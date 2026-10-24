import { pgTable, serial, text, integer, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";

export const submissions = pgTable(
  "submissions",
  {
    id: serial().primaryKey(),
    fullName: text("full_name").notNull(),
    phone: text().notNull(),
    email: text(),
    city: text().notNull(),
    ticketQuantity: integer("ticket_quantity").notNull().default(1),
    ticketNumber: text("ticket_number").notNull(),
    selectedNumbers: integer("selected_numbers").array().notNull().default([]),
    amount: integer().notNull(),
    method: text().notNull(),
    transactionRef: text("transaction_ref").notNull(),
    receiptKey: text("receipt_key"),
    receiptUrl: text("receipt_url"),
    status: text().notNull().default("Pending"),
    ticketIssued: boolean("ticket_issued").notNull().default(false),
    source: text().notNull().default("online"),
    adminNotes: text("admin_notes"),
    rejectionReason: text("rejection_reason"),
    reviewedBy: text("reviewed_by"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("submissions_status_idx").on(t.status),
    index("submissions_phone_idx").on(t.phone),
    index("submissions_transaction_ref_idx").on(t.transactionRef),
  ],
);

// Site-wide settings (lottery config, home page config) stored as JSON documents by key.
export const settings = pgTable("settings", {
  key: text().primaryKey(),
  value: jsonb().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
