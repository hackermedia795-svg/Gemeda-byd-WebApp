CREATE TABLE "settings" (
	"key" text PRIMARY KEY,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" serial PRIMARY KEY,
	"full_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"city" text NOT NULL,
	"ticket_quantity" integer DEFAULT 1 NOT NULL,
	"ticket_number" text NOT NULL,
	"selected_numbers" integer[] DEFAULT '{}'::integer[] NOT NULL,
	"amount" integer NOT NULL,
	"method" text NOT NULL,
	"transaction_ref" text NOT NULL,
	"receipt_key" text,
	"receipt_url" text,
	"status" text DEFAULT 'Pending' NOT NULL,
	"ticket_issued" boolean DEFAULT false NOT NULL,
	"source" text DEFAULT 'online' NOT NULL,
	"admin_notes" text,
	"rejection_reason" text,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "submissions_status_idx" ON "submissions" ("status");--> statement-breakpoint
CREATE INDEX "submissions_phone_idx" ON "submissions" ("phone");--> statement-breakpoint
CREATE INDEX "submissions_transaction_ref_idx" ON "submissions" ("transaction_ref");