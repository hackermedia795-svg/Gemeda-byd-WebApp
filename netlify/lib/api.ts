import { getUser } from "@netlify/identity";
import { eq, ne } from "drizzle-orm";
import { db } from "../../db/index.js";
import { settings, submissions } from "../../db/schema.js";
import { DEFAULT_HOME_CONFIG, DEFAULT_LOTTERY_CONFIG } from "../../src/data/seedData.js";
import type { HomeConfig, LotteryConfig, PaymentSubmission } from "../../src/types.js";

export type SubmissionRow = typeof submissions.$inferSelect;

export const json = (data: unknown, status = 200) => Response.json(data, { status });
export const error = (message: string, status = 400) => Response.json({ error: message }, { status });

/** Returns the signed-in Identity user when they hold the `admin` role, otherwise null. */
export async function getAdmin() {
  const user = await getUser();
  if (!user || !user.roles?.includes("admin")) return null;
  return user;
}

const formatLocal = (d: Date | null) => {
  if (!d) return undefined;
  // Display timestamps in Ethiopian local time (UTC+3), "YYYY-MM-DD HH:mm"
  const local = new Date(d.getTime() + 3 * 60 * 60 * 1000);
  return local.toISOString().slice(0, 16).replace("T", " ");
};

export function toSubmission(row: SubmissionRow): PaymentSubmission {
  return {
    id: String(row.id),
    fullName: row.fullName,
    phone: row.phone,
    email: row.email ?? undefined,
    city: row.city,
    ticketQuantity: row.ticketQuantity,
    ticketNumber: row.ticketNumber,
    selectedNumber: row.selectedNumbers[0],
    selectedNumbers: row.selectedNumbers.length > 0 ? row.selectedNumbers : undefined,
    amount: row.amount,
    method: row.method as PaymentSubmission["method"],
    transactionRef: row.transactionRef,
    receiptUrl: row.receiptKey ? `/api/receipts/${encodeURIComponent(row.receiptKey)}` : row.receiptUrl ?? undefined,
    status: row.status as PaymentSubmission["status"],
    ticketIssued: row.ticketIssued,
    source: row.source as PaymentSubmission["source"],
    createdAt: formatLocal(row.createdAt)!,
    createdAtIso: row.createdAt.toISOString(),
    reviewedAt: formatLocal(row.reviewedAt),
    reviewedBy: row.reviewedBy ?? undefined,
    adminNotes: row.adminNotes ?? undefined,
    rejectionReason: row.rejectionReason ?? undefined,
  };
}

const mask = (value: string, keepStart: number, keepEnd: number) =>
  value.length <= keepStart + keepEnd ? value : value.slice(0, keepStart) + "•••" + value.slice(-keepEnd);

/** Public projection for the customer status lookup: no receipt, internal notes, or full contact details. */
export function toPublicSubmission(row: SubmissionRow): PaymentSubmission {
  const full = toSubmission(row);
  return {
    ...full,
    phone: mask(full.phone, 4, 2),
    email: full.email ? mask(full.email, 2, full.email.length - full.email.indexOf("@")) : undefined,
    receiptUrl: undefined,
    adminNotes: undefined,
    reviewedBy: undefined,
  };
}

export async function getSiteConfig(): Promise<{ lottery: LotteryConfig; home: HomeConfig }> {
  const rows = await db.select().from(settings);
  const byKey = Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, any>;
  const savedLottery = byKey.lottery ?? {};
  return {
    lottery: {
      ...DEFAULT_LOTTERY_CONFIG,
      ...savedLottery,
      prizes: savedLottery.prizes?.length ? savedLottery.prizes : DEFAULT_LOTTERY_CONFIG.prizes,
      luckyNumberPolicy: { ...DEFAULT_LOTTERY_CONFIG.luckyNumberPolicy, ...(savedLottery.luckyNumberPolicy ?? {}) },
    },
    home: { ...DEFAULT_HOME_CONFIG, ...(byKey.home ?? {}) },
  };
}

export async function saveSetting(key: "lottery" | "home", value: unknown) {
  await db
    .insert(settings)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } });
}

/** Every lucky number held by a submission that hasn't been rejected. */
export async function getTakenNumbers(excludeId?: number): Promise<Set<number>> {
  const rows = await db
    .select({ id: submissions.id, numbers: submissions.selectedNumbers })
    .from(submissions)
    .where(ne(submissions.status, "Rejected"));
  const taken = new Set<number>();
  for (const r of rows) {
    if (r.id === excludeId) continue;
    r.numbers.forEach((n) => taken.add(n));
  }
  return taken;
}

export const formatTicket = (n: number) => `BYD-2026-${String(n).padStart(6, "0")}`;

export const formatTicketList = (numbers: number[]) =>
  numbers.length === 0
    ? "Pending Verification"
    : [formatTicket(numbers[0]), ...numbers.slice(1).map((n) => String(n).padStart(6, "0"))].join(", ");

export async function findSubmission(id: number) {
  const [row] = await db.select().from(submissions).where(eq(submissions.id, id));
  return row;
}
