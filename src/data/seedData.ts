import { BankAccountInfo, PaymentSubmission, LotteryConfig, LotteryPrize, HomeConfig, LotteryWinner, LuckyNumberPolicy } from '../types';

export const BANK_ACCOUNTS: BankAccountInfo[] = [
  {
    name: 'Telebirr',
    accountName: 'Gemeda BYD Official',
    accountNumber: '0912305111',
    shortCode: '*127#',
    badge: 'Telebirr SuperApp & USSD',
    iconType: 'telebirr',
    instructions: {
      om: 'Telebirr keessan banuun gara lakkoofsa 0912305111 Birrii kaffalaa. Suuraa ergaa mirkaneessaa (SMS screenshot) asitti galchaa.',
      en: 'Open Telebirr and send payment to 0912305111. Take a screenshot of the confirmation SMS and upload it here.',
      am: 'የቴሌብር መተግበሪያዎን በመክፈት ወደ 0912305111 ክፍያ ይፈጽሙ። የማረጋገጫ መልዕክቱን ስክሪንሾት እዚህ ይጫኑ።'
    }
  },
  {
    name: 'Commercial Bank of Ethiopia (CBE)',
    accountName: 'Gemeda BYD Lottery Account',
    accountNumber: '1000173000395',
    badge: 'CBE Birr & Mobile Banking',
    iconType: 'cbe',
    instructions: {
      om: 'CBE Mobile Banking (CBEBirr) ykn damee baankii dhiyootti lakkoofsa herreegaa 1000173000395 irratti kaffalaa. Lakkoofsa FT... galchaa.',
      en: 'Use CBE Mobile Banking or deposit at any CBE branch to account 1000173000395. Copy your FT... transaction code.',
      am: 'በሲቢኢ ሞባይል ባንኪንግ ወይም በማንኛውም ቅርንጫፍ ወደ 1000173000395 ገቢ ያድርጉ። የ FT... ቁጥርዎን ያስገቡ።'
    }
  },
  {
    name: 'Awash Bank',
    accountName: 'Gemeda BYD Motors & Promo',
    accountNumber: '01320867792800',
    badge: 'Awash Birr / Mobile',
    iconType: 'awash',
    instructions: {
      om: 'Baankii Hawaas (Awash Bank) lakkoofsa herreegaa 01320867792800 kaffaluun lakk. mirkaneessaa galchaa.',
      en: 'Transfer via Awash Birr to account 01320867792800 and submit the reference number.',
      am: 'በአዋሽ ባንክ ሂሳብ ቁጥር 01320867792800 ገቢ በማድረግ የትራንዛክሽን ቁጥሩን ያስገቡ።'
    }
  },
  {
    name: 'Bank of Abyssinia',
    accountName: 'Gemeda BYD Ventures',
    accountNumber: '119125294',
    badge: 'Apollo & BOA Mobile',
    iconType: 'boa',
    instructions: {
      om: 'Manni Baankii Habashaa herreega 119125294 irratti kaffaluun ragaa mirkaneessaa ergaa.',
      en: 'Transfer via Apollo or branch to account 119125294 and submit transaction code.',
      am: 'በአቢሲኒያ ባንክ ሂሳብ ቁጥር 119125294 ገቢ ያድርጉ።'
    }
  }
];

export const CONTACT_INFO = {
  phones: ['0912305111', '0910046270'],
  email: 'support@gemedabyd.com',
  address: 'Gemeda BYD SHAGGAR, AMBO Road, BURAYU, Ethiopia'
};

export const DEFAULT_PRIZES: LotteryPrize[] = [
  {
    id: 'prize-1',
    rank: 1,
    badge: '1st Prize',
    name: 'BYD Song Plus EV',
    subtitle: 'Brand New 2026 Electric Luxury SUV',
    valueText: '4,500,000 ETB',
    description: {
      om: 'Konkolaataa elektiriikii ammayyaa, chaarjii tokkoon km 605 kan deemuu fi teeknooloojii ol-aanaa qabu.',
      en: 'Zero emissions, 605km extended range, luxury panoramic sunroof, advanced ADAS autopilot.',
      am: 'በአንድ ቻርጅ 605 ኪ.ሜ የሚጓዝ ዘመናዊ እና ውብ የኤሌክትሪክ መኪና።'
    },
    imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=900&auto=format&fit=crop&q=85',
    iconType: 'trophy'
  },
  {
    id: 'prize-2',
    rank: 2,
    badge: '2nd Prize',
    name: '500,000 ETB Cash',
    subtitle: 'Half a Million Birr Direct Bank Transfer',
    valueText: '500,000 ETB',
    description: {
      om: 'Qarshii kuma dhibba shan (500,000) kallattiin herreega baankii maamila injifateef kan kaffalamu.',
      en: '500,000 Birr wired directly to the winner\'s CBE or Telebirr account with instant verification.',
      am: 'ግማሽ ሚሊዮን ብር በቀጥታ ለአሸናፊው የባንክ ሂሳብ ገቢ የሚደረግ።'
    },
    iconType: 'award'
  },
  {
    id: 'prize-3',
    rank: 3,
    badge: '3rd Prize',
    name: 'iPhone 16 Pro Max',
    subtitle: '+ 7kW Smart Home EV Fast Charger',
    valueText: '280,000 ETB',
    description: {
      om: 'Bilbila ammayyaa iPhone 16 Pro Max 256GB fi meeshaa chaarjarii konkolaataa mana keessaa.',
      en: 'Latest flagship smartphone 256GB Titanium plus 7kW smart home level 2 fast charger bundle.',
      am: 'የቅርብ ጊዜው አይፎን 16 ፕሮ ማክስ ስልክ እና የቤት ውስጥ ፈጣን የኢቪ ቻርጀር።'
    },
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    iconType: 'smartphone'
  }
];

export const DEFAULT_WINNERS: LotteryWinner[] = [
  {
    id: 'win-1',
    fullName: 'Obbo Tolaasaa Baqqalaa Garbaa',
    city: 'Shaggar / Buraayyuu',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    ticketNumber: 'BYD-2025-000342',
    prizeWon: 'BYD Song Plus EV (100% Electric SUV)',
    dateWon: 'Muddee 2025 / Dec 2025',
    testimonial: {
      om: 'Wallaahi carraan kun dhugaa dha! Tikkeetii 3 qofa bitadheen konkolaataa miiliyoona 4.5 injifadhe. Galatoomaa Gemeda BYD!',
      en: 'This car lottery is 100% genuine! I bought just 3 tickets and won this brand new 4.5 million Birr BYD EV!',
      am: 'በእውነት ይህ ዕጣ 100% እውነተኛ ነው! 3 ቲኬት ብቻ ገዝቼ አሸናፊ ሆኛለሁ።'
    },
    verifiedBadge: true
  },
  {
    id: 'win-2',
    fullName: 'Aaddee Caaltuu Mokonnon Alamuu',
    city: 'Adaamaa (Adama)',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    ticketNumber: 'BYD-2025-001209',
    prizeWon: '500,000 ETB Cash Prize',
    dateWon: 'Fulbaana 2025 / Sep 2025',
    testimonial: {
      om: 'Qarshiin 500,000 daqiiqaa 30 keessatti herreega CBE kootti naaf dhufe. Maatiin koo baay\'ee gammadeera!',
      en: 'Half a million Birr was deposited straight to my CBE bank account within 30 minutes of verification!',
      am: '500,000 ብር በ30 ደቂቃ ውስጥ ወደ ሲቢኢ አካውንቴ ገቢ ተደርጎልኛል!'
    },
    verifiedBadge: true
  },
  {
    id: 'win-3',
    fullName: 'Dargaggoo Daawwit Tasfaayee',
    city: 'Hawaasaa (Hawassa)',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    ticketNumber: 'BYD-2025-000891',
    prizeWon: 'iPhone 16 Pro Max + EV Fast Charger',
    dateWon: 'Hagayya 2025 / Aug 2025',
    testimonial: {
      om: 'Tikkeetii Telebirriin bitadheen iPhone 16 Pro Max badhaafame. Gemeda BYD amansiisaa dha!',
      en: 'Paid via Telebirr and claimed the brand new iPhone 16 Pro Max package. Transparent and trusted!',
      am: 'በቴሌብር ቲኬት ገዝቼ አዲስ አይፎን 16 ፕሮ ማክስ ተሸልሜያለሁ።'
    },
    verifiedBadge: true
  }
];

export const DEFAULT_LUCKY_POLICY: LuckyNumberPolicy = {
  enabled: true,
  allowMultiSelect: true,
  maxSelectablePerOrder: 5
};

export const DEFAULT_HOME_CONFIG: HomeConfig = {
  heroBadge: 'Carraa Guddaa Waggaa 2026',
  heroTitle: {
    om: 'Konkolaataa Haaraa BYD Song Plus EV Injifadhaa!',
    en: 'Win a Brand New BYD Song Plus EV!',
    am: 'አዲስ የቢዋይዲ ሶንግ ፕላስ የኤሌክትሪክ መኪና ያሸንፉ!'
  },
  heroDesc: {
    om: 'Tikkeetii qofa 500 Birriin bitiitii carraa konkolaataa ammayyaa BYD fi qarshii kuma dhibba shan (500,000 ETB) injifachuu argadhaa! Kaffaltii keessan Telebirr ykn Baankiiwwaniin galchaa.',
    en: 'Enter for just 500 ETB per ticket for your chance to win a state-of-the-art BYD electric vehicle and 500,000 Birr cash! Pick your own lucky number and submit verified payments through Telebirr or Ethiopian banks.',
    am: 'በ500 ብር ብቻ ቲኬት በመግዛት ዘመናዊ የቢዋይዲ መኪና እና 500,000 ብር የገንዘብ ሽልማት አሸናፊ ይሁኑ! የራስዎን የዕድል ቁጥር ይምረጡ፤ ክፍያዎን በቴሌብር ወይም በባንክ ይፈጽሙ።'
  },
  drawDateText: 'Guyyaa Carraan Baafamu: Muddee 15, 2026 (Dec 24, 2026)',
  drawDateIso: '2026-12-24T18:00',
  featuredCarName: 'BYD Song Plus EV',
  featuredCarSubtitle: 'Model 2026 • 0 km Brand New Electric SUV',
  featuredCarImage: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=900&auto=format&fit=crop&q=85',
  featuredCarRange: '605 KM Range',
  featuredCarAcceleration: '5.9s (0-100)',
  featuredCarValue: '4,500,000 ETB'
};

export const DEFAULT_LOTTERY_CONFIG: LotteryConfig = {
  maxTickets: 2000, // Default range: 1 - 2000
  ticketPrice: 500,
  drawDate: '2026-12-24T18:00',
  drawDateIso: '2026-12-24T18:00',
  prizes: DEFAULT_PRIZES,
  winners: DEFAULT_WINNERS,
  luckyNumberPolicy: DEFAULT_LUCKY_POLICY
};

export const INITIAL_SUBMISSIONS: PaymentSubmission[] = [
  {
    id: '1081',
    fullName: 'Geemeda Tolaasaa Baqqalaa',
    phone: '0911458923',
    email: 'gemeda.tolasa@gmail.com',
    city: 'Finfinnee (Addis Ababa)',
    ticketQuantity: 3,
    ticketNumber: 'BYD-2026-000077',
    selectedNumber: 77,
    selectedNumbers: [77],
    amount: 1400,
    method: 'Telebirr',
    transactionRef: 'TX992810482',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    status: 'Approved',
    ticketIssued: true,
    createdAt: '2026-10-17 14:22',
    reviewedAt: '2026-10-17 14:35',
    reviewedBy: 'Admin (Gemeda)',
    adminNotes: 'Telebirr payment verified. Lucky Ticket #0077 issued.'
  },
  {
    id: '1082',
    fullName: 'Chaltuu Mokonnon Alamuu',
    phone: '0922894172',
    email: 'chaltu.alemu@yahoo.com',
    city: 'Adaamaa (Adama)',
    ticketQuantity: 1,
    ticketNumber: 'Pending Verification',
    selectedNumber: 124,
    selectedNumbers: [124],
    amount: 500,
    method: 'Commercial Bank of Ethiopia (CBE)',
    transactionRef: 'FT26108920192',
    receiptUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80',
    status: 'Pending',
    ticketIssued: false,
    createdAt: '2026-10-18 08:15',
    adminNotes: 'Awaiting bank clearance confirmation.'
  },
  {
    id: '1083',
    fullName: 'Baqqalaa Dastaa Garbaa',
    phone: '0933561944',
    email: 'bekele.dasta@gmail.com',
    city: 'Jimmaa (Jimma)',
    ticketQuantity: 5,
    ticketNumber: 'BYD-2026-000777',
    selectedNumber: 777,
    selectedNumbers: [777],
    amount: 2500,
    method: 'Telebirr',
    transactionRef: 'TX884920198',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80',
    status: 'Approved',
    ticketIssued: true,
    createdAt: '2026-10-18 09:40',
    reviewedAt: '2026-10-18 09:50',
    reviewedBy: 'Admin (Gemeda)',
    adminNotes: 'Lucky Ticket #0777 issued.'
  },
  {
    id: '1084',
    fullName: 'Tigist Hayiluu Zawudee',
    phone: '0944120938',
    email: 'tigist.h@hotmail.com',
    city: 'Hawaasaa (Hawassa)',
    ticketQuantity: 2,
    ticketNumber: 'Pending Verification',
    selectedNumber: 450,
    selectedNumbers: [450],
    amount: 1000,
    method: 'Awash Bank',
    transactionRef: 'AWB9384910',
    receiptUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    status: 'Pending',
    ticketIssued: false,
    createdAt: '2026-10-18 10:05'
  },
  {
    id: '1085',
    fullName: 'Ahmed Mohammed Usmaan',
    phone: '0915672901',
    email: 'ahmed.m@gmail.com',
    city: 'Dirree Dhawaa (Dire Dawa)',
    ticketQuantity: 1,
    ticketNumber: 'Rejected',
    amount: 500,
    method: 'Commercial Bank of Ethiopia (CBE)',
    transactionRef: 'FT25000000000',
    status: 'Rejected',
    ticketIssued: false,
    createdAt: '2026-10-16 11:30',
    reviewedAt: '2026-10-16 12:00',
    reviewedBy: 'Admin (Gemeda)',
    rejectionReason: 'Invalid transaction reference. Deposit was not found in CBE bank statement.',
    adminNotes: 'Customer notified to resend valid slip.'
  },
  {
    id: '1086',
    fullName: 'Boontuu Guddinaa Fayyisaa',
    phone: '0911782390',
    email: 'bontu.fayyisa@gmail.com',
    city: 'Naqamte (Nekemte)',
    ticketQuantity: 2,
    ticketNumber: 'Pending Verification',
    selectedNumber: 999,
    selectedNumbers: [999],
    amount: 1000,
    method: 'Telebirr',
    transactionRef: 'TX102938475',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    status: 'Pending',
    ticketIssued: false,
    createdAt: '2026-10-18 11:15'
  }
];

export const TICKET_PRICING = [
  { qty: 1, price: 500, discount: '', popular: false, bonus: '' },
  { qty: 3, price: 1400, discount: 'Save 100 ETB', popular: false, bonus: '' },
  { qty: 5, price: 2500, discount: '+1 Free Ticket', popular: true, bonus: 'Best Value' },
  { qty: 10, price: 5000, discount: '+3 Free Tickets', popular: false, bonus: 'VIP Supporter' }
];
