import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { desc } from "drizzle-orm";
import { db } from "../../db/index.js";
import { submissions } from "../../db/schema.js";
import { BANK_ACCOUNTS, TICKET_PRICING } from "../../src/data/seedData.js";
import {
  error,
  formatTicketList,
  getAdmin,
  getSiteConfig,
  getTakenNumbers,
  json,
  toPublicSubmission,
  toSubmission,
} from "../lib/api.js";

const MAX_RECEIPT_BYTES = 4 * 1024 * 1024;
const VALID_METHODS = new Set<string>([...BANK_ACCOUNTS.map((b) => b.name), "Dashen Bank"]);

const priceFor = (qty: number, ticketPrice: number) =>
  TICKET_PRICING.find((p) => p.qty === qty)?.price ?? qty * ticketPrice;

export default async (req: Request) => {
  if (req.method === "GET") {
    if (!(await getAdmin())) return error("Unauthorized", 401);
    const rows = await db.select().from(submissions).orderBy(desc(submissions.createdAt));
    return json(rows.map(toSubmission));
  }

  if (req.method !== "POST") return error("Method not allowed", 405);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return error("Invalid JSON body");
  }

  const walkIn = body.walkIn === true;
  const admin = walkIn ? await getAdmin() : null;
  if (walkIn && !admin) return error("Unauthorized", 401);

  const fullName = String(body.fullName ?? "").trim();
  const phone = String(body.phone ?? "").replace(/\s+/g, "");
  const transactionRef = String(body.transactionRef ?? "").trim().toUpperCase();
  const method = String(body.method ?? "");
  const ticketQuantity = Math.max(1, Math.min(100, Math.floor(Number(body.ticketQuantity) || 1)));

  if (fullName.length < 3 || phone.length < 9) return error("Full name and a valid phone number are required.");
  if (!walkIn && !transactionRef) return error("A transaction reference is required.");
  if (!VALID_METHODS.has(method)) return error("Unknown payment method.");

  const { lottery } = await getSiteConfig();
  const requested: number[] = Array.isArray(body.selectedNumbers)
    ? [...new Set<number>(body.selectedNumbers.map(Number).filter(Number.isInteger))]
    : [];

  if (requested.length > ticketQuantity) return error("More lucky numbers than tickets were selected.");
  if (requested.some((n) => n < 1 || n > lottery.maxTickets)) {
    return error(`Lucky numbers must be between 1 and ${lottery.maxTickets}.`);
  }
  if (requested.length > 0) {
    const taken = await getTakenNumbers();
    const clash = requested.filter((n) => taken.has(n));
    if (clash.length > 0) {
      return json({ error: `Lucky number(s) already taken: ${clash.join(", ")}`, taken: clash }, 409);
    }
  }

  // Receipts are uploaded as data URLs and kept in Blobs; plain URLs (sample receipts) are stored as-is.
  let receiptKey: string | null = null;
  let receiptUrl: string | null = null;
  const receipt = typeof body.receipt === "string" ? body.receipt : "";
  const dataUrl = receipt.match(/^data:([\w/+.-]+);base64,(.+)$/);
  if (dataUrl) {
    const bytes = Buffer.from(dataUrl[2], "base64");
    if (bytes.byteLength > MAX_RECEIPT_BYTES) return error("Receipt image is too large (max 4 MB).", 413);
    receiptKey = `${Date.now()}-${crypto.randomUUID()}`;
    await getStore("receipts").set(receiptKey, bytes, { metadata: { contentType: dataUrl[1] } });
  } else if (/^https:\/\//.test(receipt)) {
    receiptUrl = receipt;
  }

  const now = new Date();
  const amount = walkIn
    ? Math.max(0, Math.floor(Number(body.amount) || 0))
    : priceFor(ticketQuantity, lottery.ticketPrice || 500);

  const [row] = await db
    .insert(submissions)
    .values({
      fullName,
      phone,
      email: String(body.email ?? "").trim() || null,
      city: String(body.city ?? "").trim() || "Unknown",
      ticketQuantity,
      selectedNumbers: requested,
      ticketNumber: walkIn ? formatTicketList(requested) : requested.length ? `${formatTicketList(requested)} (Reserved)` : "Pending Verification",
      amount,
      method,
      transactionRef: transactionRef || `OFFICE-CASH-${now.getTime().toString(36).toUpperCase()}`,
      receiptKey,
      receiptUrl,
      status: walkIn ? "Approved" : "Pending",
      ticketIssued: walkIn,
      source: walkIn ? "walk-in" : "online",
      adminNotes: walkIn
        ? "Registered in-person at Gemeda BYD Promotion Center Burayu."
        : requested.length
          ? `Requested Lucky Numbers: ${requested.map((n) => `#${n}`).join(", ")}. Waiting for reviewer confirmation.`
          : "Submitted via customer portal. Waiting for reviewer confirmation.",
      reviewedBy: walkIn ? admin!.email ?? "Admin" : null,
      reviewedAt: walkIn ? now : null,
    })
    .returning();

  return json(admin ? toSubmission(row) : toPublicSubmission(row), 201);
};

export const config: Config = {
  path: "/api/submissions",
};
