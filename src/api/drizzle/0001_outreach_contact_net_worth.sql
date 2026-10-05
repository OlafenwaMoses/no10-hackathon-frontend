ALTER TABLE "candidates" ADD COLUMN "net_worth" jsonb;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "net_worth_band" text;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "net_worth_usd" real;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "contact" jsonb;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "outreach_status" text DEFAULT 'not_contacted' NOT NULL;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "outreach_note" text;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "contacted_at" timestamp with time zone;