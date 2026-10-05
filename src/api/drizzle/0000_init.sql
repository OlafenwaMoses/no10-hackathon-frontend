CREATE TABLE "candidates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"search_id" uuid,
	"category" text NOT NULL,
	"sector" text NOT NULL,
	"sub_sector" text,
	"criteria" text,
	"residence_region" text,
	"nationality" text,
	"exa_id" text,
	"source" text DEFAULT 'search' NOT NULL,
	"profile_url" text,
	"name" text NOT NULL,
	"headline" text,
	"title" text,
	"organisation" text,
	"location" text,
	"country" text,
	"picture_url" text,
	"entity" jsonb,
	"highlights" text[] DEFAULT '{}' NOT NULL,
	"notes" text,
	"linkedin_profile" jsonb,
	"resolution" jsonb,
	"profile_text" text,
	"status" text DEFAULT 'discovered' NOT NULL,
	"error" text,
	"uk_links" jsonb,
	"persona" jsonb,
	"classification" jsonb,
	"score" jsonb,
	"overall_score" real,
	"openness_score" real,
	"uk_link_score" real,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "candidates_profileUrl_unique" UNIQUE("profile_url")
);
--> statement-breakpoint
CREATE TABLE "searches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"sector" text NOT NULL,
	"region" text,
	"query" text NOT NULL,
	"num_results" integer DEFAULT 10 NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"workflow_id" text,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interview_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"question_key" text NOT NULL,
	"question" text NOT NULL,
	"type" text NOT NULL,
	"options" text[] DEFAULT '{}' NOT NULL,
	"probs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"reasoning" text,
	"response" text,
	"expected" real,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "interview_answers_candidate_question_key" UNIQUE("candidate_id","question_key")
);
--> statement-breakpoint
CREATE TABLE "persona_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_search_id_fkey" FOREIGN KEY ("search_id") REFERENCES "public"."searches"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_answers" ADD CONSTRAINT "interview_answers_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "persona_messages" ADD CONSTRAINT "persona_messages_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "candidates_search_id_idx" ON "candidates" USING btree ("search_id");--> statement-breakpoint
CREATE INDEX "candidates_overall_score_idx" ON "candidates" USING btree ("overall_score");--> statement-breakpoint
CREATE INDEX "persona_messages_candidate_id_idx" ON "persona_messages" USING btree ("candidate_id");