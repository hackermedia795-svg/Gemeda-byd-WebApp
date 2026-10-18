export type PaymentStatus = 'Pending' | 'Approved' | 'Rejected';

export type PaymentMethod = 
  | 'Telebirr' 
  | 'Commercial Bank of Ethiopia (CBE)' 
  | 'Awash Bank' 
  | 'Bank of Abyssinia' 
  | 'Dashen Bank';

export interface PaymentSubmission {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  ticketQuantity: number;
  ticketNumber: string;
  selectedNumber?: number; // legacy single
  selectedNumbers?: number[]; // Multi-number selection (e.g. [77, 88, 99])
  amount: number;
  method: PaymentMethod;
  transactionRef: string;
  receiptUrl?: string;
  status: PaymentStatus;
  ticketIssued: boolean;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
  rejectionReason?: string;
}

export type Language = 'om' | 'en' | 'am';

export interface BankAccountInfo {
  name: PaymentMethod;
  accountName: string;
  accountNumber: string;
  shortCode?: string;
  badge: string;
  iconType: 'telebirr' | 'cbe' | 'awash' | 'boa' | 'dashen';
  instructions: {
    om: string;
    en: string;
    am: string;
  };
}

export interface LotteryPrize {
  id: string;
  rank: number; // 1, 2, 3...
  badge: string; // e.g. "1st Prize", "Carraa 1ffaa"
  name: string; // e.g. "BYD Song Plus EV"
  subtitle: string; // e.g. "Brand New 2026 Electric Luxury SUV"
  valueText: string; // e.g. "4,500,000 ETB"
  description: {
    om: string;
    en: string;
    am: string;
  };
  imageUrl?: string;
  iconType: 'trophy' | 'award' | 'smartphone' | 'car' | 'cash';
}

export interface LotteryWinner {
  id: string;
  fullName: string;
  photoUrl: string;
  city: string;
  ticketNumber: string;
  prizeWon: string; // e.g. "BYD Song Plus EV"
  dateWon: string; // e.g. "October 2025" or "Muddee 2025"
  testimonial: {
    om: string;
    en: string;
    am: string;
  };
  verifiedBadge: boolean;
}

export interface LuckyNumberPolicy {
  enabled: boolean; // Allow custom selection?
  allowMultiSelect: boolean; // Allow multiple numbers up to ticket quantity?
  maxSelectablePerOrder: number; // e.g., 5
}

export interface HomeConfig {
  heroBadge: string;
  heroTitle: {
    om: string;
    en: string;
    am: string;
  };
  heroDesc: {
    om: string;
    en: string;
    am: string;
  };
  drawDateText: string;
  drawDateIso?: string; // ISO 8601 string for real-time countdown calculation
  featuredCarName: string;
  featuredCarSubtitle: string;
  featuredCarImage: string;
  featuredCarRange: string;
  featuredCarAcceleration: string;
  featuredCarValue: string;
}

export interface LotteryConfig {
  maxTickets: number; // e.g., 1000, 1500, 2000, 5000
  ticketPrice: number;
  drawDate: string;
  drawDateIso?: string; // ISO 8601 target for countdown calculations
  prizes: LotteryPrize[];
  winners: LotteryWinner[];
  luckyNumberPolicy: LuckyNumberPolicy;
}

export interface MockEmail {
  id: string;
  to: string;
  recipientName: string;
  from: string;
  subject: string;
  type: 'Approved' | 'Rejected';
  ticketNumber?: string;
  submissionId: string;
  amount: number;
  method: string;
  timestamp: string;
  rejectionReason?: string;
}
