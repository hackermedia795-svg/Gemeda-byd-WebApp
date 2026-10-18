// Comprehensive Trilingual Translation Engine for Gemeda BYD Lottery
// Supports Afaan Oromoo ('om'), Amharic ('am'), and English ('en')

export type SupportedLang = 'om' | 'am' | 'en';

// Detect whether text is primarily Amharic (Ethiopic script), Afaan Oromoo, or English
export function detectSourceLanguage(text: string): SupportedLang {
  if (!text || text.trim() === '') return 'om';
  
  // Ethiopic Unicode Range: \u1200-\u137F
  if (/[\u1200-\u137F]/.test(text)) {
    return 'am';
  }

  // Common Afaan Oromoo distinct patterns and markers
  const oromoMarkers = [
    /\b(carraa|badhaasa|injif|mo'at|tikkeet|kaffalt|herreg|baank|bilbila|maamila|gudda|haaraa|guyyaa|sa'aati|baga|gammad|dorgomm|dhugaa|akkas|harka|dhaabb|booda|keessan|keenya|hanga|waliigala|qofa|gara|namoota|baay|filadhu|sakatta|qorann|ragaa|eeyyee|lakki)\b/i,
    /'[a-z]/i // apostrophe in words like mo'ataa, ta'e, mirkanaa'e
  ];

  for (const marker of oromoMarkers) {
    if (marker.test(text)) {
      return 'om';
    }
  }

  return 'en';
}

// Master phrase and vocabulary dictionary across all three languages
interface TranslationEntry {
  om: string;
  en: string;
  am: string;
}

const PHRASE_DICTIONARY: TranslationEntry[] = [
  // Hero & Headings
  {
    om: 'Konkolaataa Haaraa BYD Song Plus EV Injifadhaa!',
    en: 'Win a Brand New BYD Song Plus EV!',
    am: 'አዲስ የቢዋይዲ ሶንግ ፕላስ ኢቪ መኪና ያሸንፉ!'
  },
  {
    om: 'Carraa Guddaa Waggaa 2026',
    en: 'Grand Lottery of the Year 2026',
    am: 'የዓመቱ 2026 ታላቅ ዕድል'
  },
  {
    om: 'Tikkeetii qofa 500 Birriin bitiitii carraa konkolaataa ammayyaa BYD fi qarshii kuma dhibba shan (500,000 ETB) injifachuu argadhaa! Kaffaltii keessan Telebirr ykn Baankiiwwaniin galchaa.',
    en: 'Buy a ticket for only 500 ETB and get a chance to win a modern BYD electric car and 500,000 ETB cash! Make your payment via Telebirr or Banks.',
    am: 'በ500 ብር ብቻ ትኬት በመግዛት ዘመናዊ የቢዋይዲ መኪና እና 500,000 ብር የገንዘብ ሽልማት የማሸነፍ ዕድል ያግኙ! ክፍያዎን በቴሌብር ወይም በባንኮች ይፈጽሙ።'
  },
  {
    om: 'Guyyaa Carraan Baafamu: Muddee 15, 2026',
    en: 'Draw Date: December 15, 2026',
    am: 'የዕጣ ማውጫ ቀን፡ ታህሳስ 15፣ 2026'
  },

  // Prizes
  {
    om: 'Badhaasa 1ffaa: BYD Song Plus EV 2026',
    en: '1st Prize: BYD Song Plus EV 2026',
    am: '1ኛ ሽልማት፡ ቢዋይዲ ሶንግ ፕላስ ኢቪ 2026'
  },
  {
    om: 'Badhaasa 2ffaa: Qarshii 500,000 ETB Callaa',
    en: '2nd Prize: 500,000 ETB Direct Cash',
    am: '2ኛ ሽልማት፡ 500,000 የኢትዮጵያ ብር ጥሬ ገንዘብ'
  },
  {
    om: 'Badhaasa 3ffaa: iPhone 16 Pro Max + Chaarjarii EV',
    en: '3rd Prize: iPhone 16 Pro Max + EV Fast Charger',
    am: '3ኛ ሽልማት፡ አይፎን 16 ፕሮ ማክስ + የኢቪ ቻርጀር'
  },
  {
    om: 'Konkolaataa Ammayyaa Elektirikii Guutuu',
    en: 'Ultra-modern 100% Pure Electric SUV',
    am: 'ዘመናዊ ሙሉ የኤሌክትሪክ መኪና'
  },
  {
    om: 'Konkolaataa elektirikii guutuu kan teeknoloojii Blade Battery qabu, guutuu Itoophiyaatti kan hojjatu.',
    en: 'Pure electric luxury SUV featuring BYD Blade Battery technology and ultra-fast charging.',
    am: 'ዘመናዊ የቢዋይዲ ብሌድ ባትሪ ቴክኖሎጂ የታጠቀ፣ በኢትዮጵያ መንገዶች ላይ ፍጹም ምቹ የሆነ የኤሌክትሪክ መኪና።'
  },
  {
    om: 'Qarshii callaa herreega baankii injifataatti battalumatti kan galu.',
    en: 'Cash transferred directly into the verified winner bank account immediately upon draw confirmation.',
    am: 'ዕጣው እንደወጣ በቀጥታ ወደ አሸናፊው የባንክ ሂሳብ ገቢ የሚደረግ ጥሬ ገንዘብ።'
  },
  {
    om: 'Bilbila ammayyaa fi meeshaa chaarjarii saffisaa konkolaataaf oolu.',
    en: 'Flagship smartphone and high-speed residential EV charging station.',
    am: 'ዘመናዊ ስልክ እና ለቤት የሚያገለግል የፈጣን ኢቪ መኪና ቻርጀር።'
  },

  // Winners & Handover
  {
    om: 'Mo\'attoota Carraa Darban & Sagantaa Harka Dhaabbachuu',
    en: 'Past Verified Lottery Winners & Official Handover',
    am: 'ያለፉት የተረጋገጡ አሸናፊዎች እና ይፋዊ የርክክብ መድረክ'
  },
  {
    om: 'Carraan kun 100% dhugaa dha, galatoomaa!',
    en: 'This lottery is 100% genuine and transparent, thank you!',
    am: 'ይህ ዕጣ 100% እውነተኛና ግልጽ ነው፣ እናመሰግናለን!'
  },
  {
    om: 'Wallaahi carraan kun dhugaa dha, kaffaltee qofa carraa kee eeggadhu!',
    en: 'Truly this lottery is authentic, just buy and wait for your lucky day!',
    am: 'በእውነት ይህ ዕጣ እውነተኛ ነው፣ ትኬት ቆርጣችሁ ዕድላችሁን ጠብቁ!'
  },
  {
    om: 'Baga Gammaddan! Carraan keessan milkaa\'eera.',
    en: 'Congratulations! Your lucky ticket has been drawn.',
    am: 'እንኳን ደስ አላችሁ! ዕድለኛ ቁጥርዎ አሸንፏል።'
  },
  {
    om: 'Sagantaa harka dhaabbannaa konkolaataa irratti maatii koo wajjin baay\'ee gammanne.',
    en: 'We were overjoyed during the car keys handover ceremony with my family.',
    am: 'በመኪናው የቁልፍ ርክክብ ስነ-ስርዓት ላይ ከቤተሰቦቼ ጋር እጅግ ተደስተናል።'
  },
  {
    om: 'Odeeffannoo fi suuraa mirkanaa\'e',
    en: 'Verified Photo and Information',
    am: 'የተረጋገጠ ፎቶ እና መረጃ'
  },
  {
    om: 'Seeraan kan mirkanaa\'e',
    en: 'Officially Verified & Authentic',
    am: 'በህግ የተረጋገጠ እና እውነተኛ'
  },
  {
    om: 'Lakkoofsa Carraa Filadhaa',
    en: 'Choose Your Lucky Number',
    am: 'የዕድል ቁጥርዎን ይምረጡ'
  },
  {
    om: 'Lakkoofsi kun qabameera',
    en: 'This number is already taken',
    am: 'ይህ ቁጥር አስቀድሞ ተይዟል'
  },
  {
    om: 'Lakkoofsi kun bilisa dha',
    en: 'This number is available',
    am: 'ይህ ቁጥር ክፍት ነው'
  }
];

// Word and phrase mappings for sentence translation fallback
const DICT_OM_TO_EN: Record<string, string> = {
  konkolaataa: 'car',
  elektirikii: 'electric',
  haaraa: 'brand new',
  ammayyaa: 'modern',
  guddaa: 'grand',
  badhaasa: 'prize',
  badhaasawwan: 'prizes',
  carraa: 'lottery ticket / chance',
  'mo\'ataa': 'winner',
  'mo\'attoota': 'winners',
  injifadhaa: 'win',
  injifataa: 'winner',
  galatoomaa: 'thank you',
  kaffaltii: 'payment',
  tikkeetii: 'ticket',
  tikkeetiin: 'tickets',
  'mirkanaa\'e': 'verified',
  mirkaneessaa: 'confirmation',
  dhugaa: 'genuine and transparent',
  baga: 'congratulations',
  gammaddan: 'congratulations',
  harka: 'handover',
  dhaabbannaa: 'ceremony',
  sagantaa: 'program',
  guyyaa: 'date / day',
  'sa\'aatii': 'hours',
  daqiiqaa: 'minutes',
  qarshii: 'cash ETB',
  birrii: 'ETB',
  maamila: 'customer',
  herrega: 'bank account',
  baankii: 'bank',
  bilisa: 'available',
  qabameera: 'reserved / taken',
  finfinnee: 'Addis Ababa',
  buraayyuu: 'Burayu',
  shaggar: 'Sheger',
  adaamaa: 'Adama',
  hawaasa: 'community',
  deeggarsa: 'support',
  chaarjarii: 'charger',
  teeknoloojii: 'technology',
  qofa: 'only',
  waliigala: 'total',
  daangaa: 'limit / range'
};

const DICT_OM_TO_AM: Record<string, string> = {
  konkolaataa: 'መኪና',
  elektirikii: 'ኤሌክትሪክ',
  haaraa: 'አዲስ',
  ammayyaa: 'ዘመናዊ',
  guddaa: 'ታላቅ',
  badhaasa: 'ሽልማት',
  badhaasawwan: 'ሽልማቶች',
  carraa: 'ዕድል',
  'mo\'ataa': 'አሸናፊ',
  'mo\'attoota': 'አሸናፊዎች',
  injifadhaa: 'ያሸንፉ',
  injifataa: 'አሸናፊ',
  galatoomaa: 'እናመሰግናለን',
  kaffaltii: 'ክፍያ',
  tikkeetii: 'ትኬት',
  tikkeetiin: 'ትኬቶች',
  'mirkanaa\'e': 'የተረጋገጠ',
  mirkaneessaa: 'ማረጋገጫ',
  dhugaa: 'እውነተኛ',
  baga: 'እንኳን',
  gammaddan: 'ደስ አላችሁ',
  harka: 'የርክክብ',
  dhaabbannaa: 'ስነ-ስርዓት',
  sagantaa: 'መርሐ-ግብር',
  guyyaa: 'ቀን',
  'sa\'aatii': 'ሰዓት',
  daqiiqaa: 'ደቂቃ',
  qarshii: 'ብር',
  birrii: 'ብር',
  maamila: 'ደንበኛ',
  herrega: 'ሂሳብ',
  baankii: 'ባንክ',
  bilisa: 'ክፍት',
  qabameera: 'ተይዟል',
  finfinnee: 'አዲስ አበባ',
  buraayyuu: 'ቡራዩ',
  shaggar: 'ሸገር',
  adaamaa: 'አዳማ',
  deeggarsa: 'ድጋፍ',
  chaarjarii: 'ቻርጀር',
  teeknoloojii: 'ቴክኖሎጂ',
  qofa: 'ብቻ',
  waliigala: 'ጠቅላላ',
  daangaa: 'ገደብ'
};

const DICT_EN_TO_OM: Record<string, string> = {
  car: 'konkolaataa',
  vehicle: 'konkolaataa',
  electric: 'elektirikii',
  new: 'haaraa',
  'brand new': 'haaraa baasii',
  modern: 'ammayyaa',
  grand: 'guddaa',
  prize: 'badhaasa',
  prizes: 'badhaasawwan',
  lottery: 'carraa',
  ticket: 'tikkeetii',
  tickets: 'tikkeetiwwan',
  winner: 'mo\'ataa',
  winners: 'mo\'attoota',
  win: 'injifadhaa',
  'thank you': 'galatoomaa',
  payment: 'kaffaltii',
  verified: 'mirkanaa\'e',
  genuine: 'dhugaa fi qulqulluu',
  transparent: 'iftoomina kan qabu',
  congratulations: 'baga gammaddan',
  handover: 'harka dhaabbannaa',
  ceremony: 'sagantaa',
  date: 'guyyaa',
  cash: 'qarshii callaa',
  free: 'bilisa',
  available: 'bilisa',
  taken: 'qabameera',
  reserved: 'qabameera',
  suv: 'SUV',
  charger: 'chaarjarii',
  battery: 'baatrii',
  range: 'hanga fageenyaa',
  speed: 'saffisa',
  support: 'deeggarsa',
  total: 'waliigala',
  limit: 'daangaa'
};

const DICT_EN_TO_AM: Record<string, string> = {
  car: 'መኪና',
  vehicle: 'ተሽከርካሪ',
  electric: 'የኤሌክትሪክ',
  new: 'አዲስ',
  'brand new': 'አዲስ ባስ',
  modern: 'ዘመናዊ',
  grand: 'ታላቅ',
  prize: 'ሽልማት',
  prizes: 'ሽልማቶች',
  lottery: 'ዕጣ',
  ticket: 'ትኬት',
  tickets: 'ትኬቶች',
  winner: 'አሸናፊ',
  winners: 'አሸናፊዎች',
  win: 'ያሸንፉ',
  'thank you': 'እናመሰግናለን',
  payment: 'ክፍያ',
  verified: 'የተረጋገጠ',
  genuine: 'እውነተኛ',
  transparent: 'ግልጽ',
  congratulations: 'እንኳን ደስ አላችሁ',
  handover: 'የርክክብ',
  ceremony: 'ስነ-ስርዓት',
  date: 'ቀን',
  cash: 'ጥሬ ገንዘብ',
  free: 'ነጻ / ክፍት',
  available: 'ክፍት',
  taken: 'ተይዟል',
  reserved: 'ተይዟል',
  suv: 'ኤስ.ዩ.ቪ',
  charger: 'ቻርጀር',
  battery: 'ባትሪ',
  range: 'የጉዞ ርቀት',
  speed: 'ፍጥነት',
  support: 'ድጋፍ',
  total: 'ጠቅላላ',
  limit: 'ገደብ'
};

const DICT_AM_TO_OM: Record<string, string> = {
  'መኪና': 'konkolaataa',
  'ኤሌክትሪክ': 'elektirikii',
  'አዲስ': 'haaraa',
  'ዘመናዊ': 'ammayyaa',
  'ታላቅ': 'guddaa',
  'ሽልማት': 'badhaasa',
  'ሽልማቶች': 'badhaasawwan',
  'ዕድል': 'carraa',
  'ዕጣ': 'carraa',
  'ትኬት': 'tikkeetii',
  'ትኬቶች': 'tikkeetiwwan',
  'አሸናፊ': 'mo\'ataa',
  'አሸናፊዎች': 'mo\'attoota',
  'ያሸንፉ': 'injifadhaa',
  'እናመሰግናለን': 'galatoomaa',
  'ክፍያ': 'kaffaltii',
  'የተረጋገጠ': 'mirkanaa\'e',
  'እውነተኛ': 'dhugaa',
  'ግልጽ': 'iftoomina kan qabu',
  'እንኳን ደስ አላችሁ': 'baga gammaddan',
  'የርክክብ': 'harka dhaabbannaa',
  'ስነ-ስርዓት': 'sagantaa',
  'ቀን': 'guyyaa',
  'ጥሬ ገንዘብ': 'qarshii callaa',
  'ብር': 'qarshii / birrii',
  'ክፍት': 'bilisa',
  'ተይዟል': 'qabameera',
  'ድጋፍ': 'deeggarsa',
  'ቻርጀር': 'chaarjarii',
  'ባትሪ': 'baatrii',
  'ጠቅላላ': 'waliigala'
};

const DICT_AM_TO_EN: Record<string, string> = {
  'መኪና': 'car',
  'ኤሌክትሪክ': 'electric',
  'አዲስ': 'brand new',
  'ዘመናዊ': 'modern',
  'ታላቅ': 'grand',
  'ሽልማት': 'prize',
  'ሽልማቶች': 'prizes',
  'ዕድል': 'chance / lottery',
  'ዕጣ': 'lottery',
  'ትኬት': 'ticket',
  'ትኬቶች': 'tickets',
  'አሸናፊ': 'winner',
  'አሸናፊዎች': 'winners',
  'ያሸንፉ': 'win',
  'እናመሰግናለን': 'thank you',
  'ክፍያ': 'payment',
  'የተረጋገጠ': 'verified',
  'እውነተኛ': 'authentic & genuine',
  'ግልጽ': 'transparent',
  'እንኳን ደስ አላችሁ': 'congratulations',
  'የርክክብ': 'handover',
  'ስነ-ስርዓት': 'ceremony',
  'ቀን': 'date',
  'ጥሬ ገንዘብ': 'cash',
  'ብር': 'ETB',
  'ክፍት': 'available',
  'ተይዟል': 'reserved / taken',
  'ድጋፍ': 'support',
  'ቻርጀር': 'fast charger',
  'ባትሪ': 'blade battery',
  'ጠቅላላ': 'total'
};

/**
 * Translates a given text from source language to target language.
 * Uses exact match dictionary first, then phrase pattern replacement,
 * preserving numbers, uppercase abbreviations (BYD, EV, ETB, USD, etc.), and formatting.
 */
export function translateText(
  text: string,
  fromLang: SupportedLang,
  toLang: SupportedLang
): string {
  if (!text || text.trim() === '') return '';
  if (fromLang === toLang) return text;

  const trimmed = text.trim();

  // 1. Direct dictionary lookup
  for (const entry of PHRASE_DICTIONARY) {
    if (entry[fromLang].toLowerCase() === trimmed.toLowerCase()) {
      return entry[toLang];
    }
  }

  // 2. Partial substring matching against our phrase bank
  for (const entry of PHRASE_DICTIONARY) {
    if (trimmed.toLowerCase().includes(entry[fromLang].toLowerCase())) {
      const replaced = trimmed.replace(new RegExp(entry[fromLang], 'gi'), entry[toLang]);
      if (replaced !== trimmed) return replaced;
    }
  }

  // 3. Fallback word-by-word token translation
  let words = trimmed.split(/(\s+|[.,!?:;()\-]+)/);
  let translatedWords = words.map(w => {
    const clean = w.trim().toLowerCase();
    if (!clean) return w;

    // Preserve special brand words
    if (['byd', 'ev', 'etb', 'telebirr', 'cbe', 'awash', 'abyssinia', 'suv', 'seagull', 'song', 'plus', 'seal', 'atto', 'han', 'tang', 'iphone', 'pro', 'max'].includes(clean)) {
      return w; // keep brand names intact
    }

    // Preserve numbers
    if (/^\d+([,.]\d+)*$/.test(clean)) {
      return w;
    }

    if (fromLang === 'om') {
      if (toLang === 'en') return DICT_OM_TO_EN[clean] || w;
      if (toLang === 'am') return DICT_OM_TO_AM[clean] || w;
    } else if (fromLang === 'en') {
      if (toLang === 'om') return DICT_EN_TO_OM[clean] || w;
      if (toLang === 'am') return DICT_EN_TO_AM[clean] || w;
    } else if (fromLang === 'am') {
      if (toLang === 'om') return DICT_AM_TO_OM[clean] || w;
      if (toLang === 'en') return DICT_AM_TO_EN[clean] || w;
    }

    return w;
  });

  const result = translatedWords.join('');
  return result;
}

/**
 * Automatically translates a source text written in any one of the 3 languages
 * to all three languages (om, am, en).
 * The input language will keep the exact original input, while the other two are translated.
 */
export function autoTranslateToAll(
  text: string,
  explicitSourceLang?: SupportedLang
): { om: string; am: string; en: string } {
  const sourceLang = explicitSourceLang || detectSourceLanguage(text);
  
  if (!text || text.trim() === '') {
    return { om: '', am: '', en: '' };
  }

  const result: { om: string; am: string; en: string } = {
    om: text,
    am: text,
    en: text
  };

  // Assign the source text accurately
  result[sourceLang] = text;

  // Translate to the other two
  if (sourceLang === 'om') {
    result.en = translateText(text, 'om', 'en');
    result.am = translateText(text, 'om', 'am');
  } else if (sourceLang === 'en') {
    result.om = translateText(text, 'en', 'om');
    result.am = translateText(text, 'en', 'am');
  } else if (sourceLang === 'am') {
    result.om = translateText(text, 'am', 'om');
    result.en = translateText(text, 'am', 'en');
  }

  return result;
}
