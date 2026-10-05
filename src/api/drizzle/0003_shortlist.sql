CREATE TABLE "shortlist_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"stage" text DEFAULT 'pending' NOT NULL,
	"priority" integer,
	"success_rag" text,
	"relationship_rag" text,
	"support_level" text,
	"background_check" text DEFAULT 'not_started' NOT NULL,
	"relationship_holder" text,
	"account_manager" text,
	"lead_source" text DEFAULT 'global_talent_radar' NOT NULL,
	"next_step" text,
	"origin_date" date DEFAULT now() NOT NULL,
	"data_hub_link" text,
	"issue_categories" text[] DEFAULT '{}'::text[] NOT NULL,
	"issue_details" text,
	"solution_offered" text,
	"resolved" text,
	"outcome" text,
	"success_category" text,
	"closed_at" date,
	"failure_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shortlist_entries_candidateId_unique" UNIQUE("candidate_id")
);
--> statement-breakpoint
ALTER TABLE "shortlist_entries" ADD CONSTRAINT "shortlist_entries_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;