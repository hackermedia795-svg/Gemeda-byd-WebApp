// Comprehensive directory of Ethiopian cities and regional towns
// Categorized by Region with Afaan Oromoo, Amharic, and English representations

export interface CityGroup {
  region: {
    om: string;
    en: string;
    am: string;
  };
  cities: {
    name: string; // standard display name
    value: string; // stored value
    popular?: boolean;
  }[];
}

export const ETHIOPIAN_REGIONS_AND_CITIES: CityGroup[] = [
  {
    region: {
      om: 'Finfinnee & Magaalota Naannawa Shaggar',
      en: 'Finfinnee (Addis Ababa) & Shaggar Special Zone',
      am: 'አዲስ አበባ እና የሸገር ከተሞች'
    },
    cities: [
      { name: 'Finfinnee / Addis Ababa (Bole, Kirkos, Arada, Yeka)', value: 'Finfinnee (Addis Ababa)', popular: true },
      { name: 'Buraayyuu (Burayu)', value: 'Buraayyuu (Burayu)', popular: true },
      { name: 'Sabbataa (Sebeta)', value: 'Sabbataa (Sebeta)', popular: true },
      { name: 'Sulultaa (Sululta)', value: 'Sulultaa (Sululta)', popular: true },
      { name: 'Laga Xaafoo / Laga Daadhii (Legetafo)', value: 'Laga Xaafoo (Legetafo)', popular: true },
      { name: 'Galaan (Gelan)', value: 'Galaan (Gelan)' },
      { name: 'Duukam (Dukem)', value: 'Duukam (Dukem)', popular: true },
      { name: 'Bishooftuu (Bishoftu / Debre Zeyit)', value: 'Bishooftuu (Bishoftu)', popular: true },
      { name: 'Mojoo (Mojo)', value: 'Mojoo (Mojo)', popular: true },
      { name: 'Sandafa (Sendafa)', value: 'Sandafa (Sendafa)' }
    ]
  },
  {
    region: {
      om: 'Naannoo Oromiyaa (Oromia Region)',
      en: 'Oromia Region',
      am: 'የኦሮሚያ ክልል'
    },
    cities: [
      { name: 'Adaamaa (Adama / Nazret)', value: 'Adaamaa (Adama)', popular: true },
      { name: 'Jimmaa (Jimma)', value: 'Jimmaa (Jimma)', popular: true },
      { name: 'Naqamte (Nekemte)', value: 'Naqamte (Nekemte)', popular: true },
      { name: 'Shaashamannee (Shashamane)', value: 'Shaashamannee (Shashamane)', popular: true },
      { name: 'Amboo (Ambo)', value: 'Amboo (Ambo)', popular: true },
      { name: 'Asallaa (Asella)', value: 'Asallaa (Asella)', popular: true },
      { name: 'Roobee (Bale Robe)', value: 'Roobee (Bale Robe)', popular: true },
      { name: 'Gooba (Goba)', value: 'Gooba (Goba)' },
      { name: 'Mattuu (Metu)', value: 'Mattuu (Metu)', popular: true },
      { name: 'Walisoo (Waliso)', value: 'Walisoo (Waliso)', popular: true },
      { name: 'Bulee Horaa (Bule Hora)', value: 'Bulee Horaa (Bule Hora)', popular: true },
      { name: 'Yaaballoo (Yabelo)', value: 'Yaaballoo (Yabelo)' },
      { name: 'Moyyaalee (Moyale)', value: 'Moyyaalee (Moyale)' },
      { name: 'Dambi Doolloo (Dembi Dolo)', value: 'Dambi Doolloo (Dembi Dolo)', popular: true },
      { name: 'Gimbi (Gimbi)', value: 'Gimbi (Gimbi)' },
      { name: 'Fichee (Fitche)', value: 'Fichee (Fitche)' },
      { name: 'Shambuu (Shambu)', value: 'Shambuu (Shambu)' },
      { name: 'Najjoo (Nejo)', value: 'Najjoo (Nejo)' },
      { name: 'Baddallee (Bedele)', value: 'Baddallee (Bedele)' },
      { name: 'Agaarfa (Agarfa)', value: 'Agaarfa (Agarfa)' },
      { name: 'Dodola (Dodola)', value: 'Dodola (Dodola)' },
      { name: 'Haramaya (Haromaya)', value: 'Haramaya (Haromaya)' },
      { name: 'Aweday (Awaday)', value: 'Aweday (Awaday)' },
      { name: 'Batu / Ziway (Batu)', value: 'Batu (Ziway)' },
      { name: 'Wolenchiti (Welenchiti)', value: 'Wolenchiti (Welenchiti)' },
      { name: 'Metehara (Metehara)', value: 'Metehara (Metehara)' },
      { name: 'Holeta (Holeta)', value: 'Holeta (Holeta)' },
      { name: 'Ginchi (Ginchi)', value: 'Ginchi (Ginchi)' },
      { name: 'Shakiso (Shakiso)', value: 'Shakiso (Shakiso)' },
      { name: 'Adola / Kibre Mengist', value: 'Adola (Kibre Mengist)' },
      { name: 'Agaro (Agaro)', value: 'Agaro (Agaro)' },
      { name: 'Chiro / Asebe Teferi', value: 'Chiro (Asebe Teferi)' },
      { name: 'Gelemso (Gelemso)', value: 'Gelemso (Gelemso)' },
      { name: 'Hirna (Hirna)', value: 'Hirna (Hirna)' },
      { name: 'Mieso (Mieso)', value: 'Mieso (Mieso)' },
      { name: 'Sheno (Sheno)', value: 'Sheno (Sheno)' },
      { name: 'Gedo (Gedo)', value: 'Gedo (Gedo)' },
      { name: 'Babile (Babile)', value: 'Babile (Babile)' },
      { name: 'Kofele (Kofele)', value: 'Kofele (Kofele)' },
      { name: 'Negele Borana', value: 'Negele Borana' },
      { name: 'Nedjo (Nedjo)', value: 'Nedjo (Nedjo)' },
      { name: 'Mendi (Mendi)', value: 'Mendi (Mendi)' },
      { name: 'Sire (Sire)', value: 'Sire (Sire)' }
    ]
  },
  {
    region: {
      om: 'Bulchiinsa Dirree Dhawaa & Naannoo Hararii',
      en: 'Dire Dawa & Harari Region',
      am: 'ድሬዳዋ እና ሐረሪ ክልል'
    },
    cities: [
      { name: 'Dirree Dhawaa (Dire Dawa)', value: 'Dirree Dhawaa (Dire Dawa)', popular: true },
      { name: 'Harar (Harari / Jugol)', value: 'Harar (Harari)', popular: true }
    ]
  },
  {
    region: {
      om: 'Naannoo Amaaraa (Amhara Region)',
      en: 'Amhara Region',
      am: 'የአማራ ክልል'
    },
    cities: [
      { name: 'Baahir Daar (Bahir Dar)', value: 'Baahir Daar (Bahir Dar)', popular: true },
      { name: 'Gondar (Gonder)', value: 'Gondar (Gonder)', popular: true },
      { name: 'Dasee (Dessie)', value: 'Dasee (Dessie)', popular: true },
      { name: 'Dabra Birhaan (Debre Berhan)', value: 'Dabra Birhaan (Debre Berhan)', popular: true },
      { name: 'Dabra Maarqos (Debre Markos)', value: 'Dabra Maarqos (Debre Markos)', popular: true },
      { name: 'Kombolcha (Kombolcha)', value: 'Kombolcha (Kombolcha)' },
      { name: 'Waldia (Woldiya)', value: 'Waldia (Woldiya)' },
      { name: 'Lalibela (Lalibela)', value: 'Lalibela (Lalibela)' },
      { name: 'Debre Tabor (Debre Tabor)', value: 'Debre Tabor' },
      { name: 'Kobo (Kobo)', value: 'Kobo (Kobo)' },
      { name: 'Shewa Robit (Shewa Robit)', value: 'Shewa Robit' },
      { name: 'Finote Selam (Finote Selam)', value: 'Finote Selam' },
      { name: 'Enjibara (Injibara)', value: 'Enjibara (Injibara)' },
      { name: 'Motta (Motta)', value: 'Motta (Motta)' },
      { name: 'Bati (Bati)', value: 'Bati (Bati)' },
      { name: 'Sekota (Sekota)', value: 'Sekota (Sekota)' },
      { name: 'Metemma (Metemma)', value: 'Metemma (Metemma)' },
      { name: 'Humera (Humera)', value: 'Humera (Humera)' }
    ]
  },
  {
    region: {
      om: 'Naannoo Sidaamaa & Naannoo Kibba Itoophiyaa',
      en: 'Sidama & Southern Ethiopia Regions',
      am: 'ሲዳማ እና የደቡብ ኢትዮጵያ ክልሎች'
    },
    cities: [
      { name: 'Hawaasaa (Hawassa)', value: 'Hawaasaa (Hawassa)', popular: true },
      { name: 'Arba Minch (Arba Minch)', value: 'Arba Minch', popular: true },
      { name: 'Wolaita Sodo (Sodo)', value: 'Wolaita Sodo', popular: true },
      { name: 'Dilla (Dilla)', value: 'Dilla (Dilla)', popular: true },
      { name: 'Hosanna (Hossana)', value: 'Hosanna (Hossana)', popular: true },
      { name: 'Butajira (Butajira)', value: 'Butajira (Butajira)' },
      { name: 'Jinka (Jinka)', value: 'Jinka (Jinka)' },
      { name: 'Yirgalem (Yirgalem)', value: 'Yirgalem (Yirgalem)' },
      { name: 'Aleta Wendo (Aleta Wendo)', value: 'Aleta Wendo' },
      { name: 'Worabe (Worabe / Silte)', value: 'Worabe (Silte)' },
      { name: 'Durame (Durame / Kembata)', value: 'Durame (Kembata)' },
      { name: 'Sawla (Sawla / Gofa)', value: 'Sawla (Gofa)' },
      { name: 'Bonga (Bonga / Keffa)', value: 'Bonga (Keffa)' },
      { name: 'Mizan Teferi / Mizan Aman', value: 'Mizan Aman (Bench Sheko)' },
      { name: 'Tepi (Tepi / Sheka)', value: 'Tepi (Sheka)' },
      { name: 'Konso / Karat (Konso)', value: 'Konso (Karat)' },
      { name: 'Halaba Kulito (Halaba)', value: 'Halaba Kulito' }
    ]
  },
  {
    region: {
      om: 'Naannoo Tigraay (Tigray Region)',
      en: 'Tigray Region',
      am: 'የትግራይ ክልል'
    },
    cities: [
      { name: 'Maqalee (Mekelle)', value: 'Maqalee (Mekelle)', popular: true },
      { name: 'Aksum (Axum)', value: 'Aksum (Axum)' },
      { name: 'Adigrat (Adigrat)', value: 'Adigrat (Adigrat)' },
      { name: 'Shire (Inda Selassie)', value: 'Shire (Inda Selassie)' },
      { name: 'Adwa (Adwa)', value: 'Adwa (Adwa)' },
      { name: 'Alamata (Alamata)', value: 'Alamata (Alamata)' },
      { name: 'Wukro (Wukro)', value: 'Wukro (Wukro)' },
      { name: 'Maychew (Maychew)', value: 'Maychew (Maychew)' },
      { name: 'Korem (Korem)', value: 'Korem (Korem)' }
    ]
  },
  {
    region: {
      om: 'Naannoo Soomaalee (Somali Region)',
      en: 'Somali Region',
      am: 'የሶማሌ ክልል'
    },
    cities: [
      { name: 'Jigjiga (Jijiga)', value: 'Jigjiga (Jijiga)', popular: true },
      { name: 'Gode (Godey)', value: 'Gode (Godey)' },
      { name: 'Qabridahar (Kebri Dehar)', value: 'Qabridahar (Kebri Dehar)' },
      { name: 'Degehabur (Dhagaxbuur)', value: 'Degehabur' },
      { name: 'Warder (Werder)', value: 'Warder (Werder)' },
      { name: 'Dolo Ado (Dollo Ado)', value: 'Dolo Ado' },
      { name: 'Shinile (Sitti)', value: 'Shinile (Sitti)' },
      { name: 'Tog Wajale (Wajaale)', value: 'Tog Wajale' }
    ]
  },
  {
    region: {
      om: 'Naannoo Affaar (Afar Region)',
      en: 'Afar Region',
      am: 'የአፋር ክልል'
    },
    cities: [
      { name: 'Samara (Semera)', value: 'Samara (Semera)', popular: true },
      { name: 'Asayita (Aysaita)', value: 'Asayita (Aysaita)' },
      { name: 'Awash Sebat (Awash 7 Kilo)', value: 'Awash Sebat' },
      { name: 'Gewane (Gewane)', value: 'Gewane (Gewane)' },
      { name: 'Dubti (Dubti)', value: 'Dubti (Dubti)' },
      { name: 'Mille (Mille)', value: 'Mille (Mille)' }
    ]
  },
  {
    region: {
      om: 'Naannoo Benishangul-Gumuz',
      en: 'Benishangul-Gumuz Region',
      am: 'የቤንሻንጉል ጉሙዝ ክልል'
    },
    cities: [
      { name: 'Asoosa (Asosa)', value: 'Asoosa (Asosa)', popular: true },
      { name: 'Gilgel Beles (Metekel)', value: 'Gilgel Beles (Metekel)' },
      { name: 'Kamashi (Kamashi)', value: 'Kamashi (Kamashi)' },
      { name: 'Bambasi (Bambasi)', value: 'Bambasi (Bambasi)' }
    ]
  },
  {
    region: {
      om: 'Naannoo Gaambeellaa (Gambella Region)',
      en: 'Gambella Region',
      am: 'የጋምቤላ ክልል'
    },
    cities: [
      { name: 'Gaambeellaa (Gambela)', value: 'Gaambeellaa (Gambela)', popular: true },
      { name: 'Itang (Itang Special)', value: 'Itang (Itang)' },
      { name: 'Abobo (Abobo)', value: 'Abobo (Abobo)' },
      { name: 'Pugnido (Pugnido)', value: 'Pugnido (Pugnido)' }
    ]
  },
  {
    region: {
      om: 'Biyya Alaa / Diaspora (International)',
      en: 'International / Diaspora (Outside Ethiopia)',
      am: 'ዲያስፖራ / ከኢትዮጵያ ውጭ'
    },
    cities: [
      { name: 'Diaspora: USA & Canada (Biyya Alaa)', value: 'Diaspora (USA & Canada)' },
      { name: 'Diaspora: Europe (UK, Germany, Norway...)', value: 'Diaspora (Europe)' },
      { name: 'Diaspora: Middle East (UAE, Saudi, Qatar...)', value: 'Diaspora (Middle East)' },
      { name: 'Diaspora: Africa & Others', value: 'Diaspora (Africa / Other)' }
    ]
  }
];

// Flat list of all city names and values for quick search and autocomplete
export const ALL_ETHIOPIAN_CITIES: string[] = ETHIOPIAN_REGIONS_AND_CITIES.flatMap(
  group => group.cities.map(c => c.value)
);
