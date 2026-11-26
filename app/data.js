// Statara — every figure on the site lives here, with its source and year.
// Figures are real published statistics for Indonesia. Each series carries
// its source so every page can cite it next to the number.

export const COUNTRY = {
  name: 'Indonesia',
  nameEn: 'Indonesia',
  capital: 'Jakarta',
  areaKm2: 1904569,
  islands: 17508,
  provinces: 38,
  regenciesCities: 514,
  currency: 'Rupiah (IDR)',
  updated: 'November 2026',
};

export const SOURCES = {
  bps: 'Badan Pusat Statistik (BPS)',
  bpsSusenas: 'BPS — Survei Sosial Ekonomi Nasional (Susenas)',
  worldBank: 'World Bank — World Development Indicators',
  imf: 'International Monetary Fund (IMF)',
  apjii: 'APJII — Survei Penetrasi Internet Indonesia',
  undp: 'UNDP — Human Development Report',
};

// Yearly series. value is the headline number; unit and note explain it.
export const SERIES = {
  population: {
    label: 'Jumlah penduduk',
    labelEn: 'Population',
    unit: 'juta jiwa',
    source: SOURCES.bps,
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    values: [255.5, 258.7, 261.9, 265.0, 268.1, 271.3, 274.2, 277.0, 279.4, 281.6],
    note: 'Estimasi pertengahan tahun. Sensus 2020 mencatat 270,2 juta jiwa pada September 2020.',
  },
  gdp: {
    label: 'PDB harga berlaku',
    labelEn: 'GDP, current prices',
    unit: 'Rp triliun',
    source: SOURCES.bps,
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    values: [11526, 12401, 13588, 14839, 15833, 15434, 16970, 19588, 20892, 22139],
    note: 'Produk Domestik Bruto atas dasar harga berlaku.',
  },
  gdpPerCapita: {
    label: 'PDB per kapita',
    labelEn: 'GDP per capita',
    unit: 'US$',
    source: SOURCES.imf,
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    values: [3377, 3603, 3840, 3893, 4118, 3922, 4348, 4785, 4903, 4960],
    note: 'Dolar AS berlaku, estimasi IMF.',
  },
  growth: {
    label: 'Pertumbuhan ekonomi',
    labelEn: 'GDP growth',
    unit: '%',
    source: SOURCES.bps,
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    values: [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.7, 5.31, 5.05, 5.03],
    note: 'Pertumbuhan PDB harga konstan terhadap tahun sebelumnya.',
  },
  inflation: {
    label: 'Inflasi (Desember, yoy)',
    labelEn: 'Inflation (Dec, yoy)',
    unit: '%',
    source: SOURCES.bps,
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    values: [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57],
    note: 'Inflasi Indeks Harga Konsumen, Desember terhadap Desember tahun lalu.',
  },
  exports: {
    label: 'Ekspor',
    labelEn: 'Exports',
    unit: 'US$ miliar',
    source: SOURCES.bps,
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    values: [150.4, 144.4, 168.8, 180.0, 167.7, 163.2, 231.6, 291.9, 258.8, 264.7],
    note: 'Nilai ekspor barang (migas dan nonmigas).',
  },
  imports: {
    label: 'Impor',
    labelEn: 'Imports',
    unit: 'US$ miliar',
    source: SOURCES.bps,
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    values: [142.7, 135.7, 156.9, 188.7, 170.7, 141.6, 196.2, 237.4, 221.9, 235.0],
    note: 'Nilai impor barang (migas dan nonmigas).',
  },
  unemployment: {
    label: 'Tingkat pengangguran terbuka',
    labelEn: 'Unemployment rate',
    unit: '%',
    source: SOURCES.bps,
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    values: [6.18, 5.61, 5.5, 5.34, 5.28, 7.07, 6.49, 5.86, 5.32, 4.91],
    note: 'Agustus setiap tahun; Februari 2025 tercatat 4,76%.',
  },
  poverty: {
    label: 'Tingkat kemiskinan',
    labelEn: 'Poverty rate',
    unit: '%',
    source: SOURCES.bps,
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    values: [11.13, 10.7, 10.12, 9.66, 9.22, 10.19, 9.71, 9.57, 9.36, 8.57],
    note: 'September setiap tahun; Maret 2024 tercatat 9,03%. Terendah sepanjang sejarah pada 2024.',
  },
  lifeExpectancy: {
    label: 'Angka harapan hidup',
    labelEn: 'Life expectancy',
    unit: 'tahun',
    source: SOURCES.bps,
    years: [2015, 2017, 2019, 2020, 2022, 2023, 2024],
    values: [70.9, 71.2, 71.4, 71.5, 73.2, 73.9, 74.2],
    note: 'Angka harapan hidup saat lahir.',
  },
  hdi: {
    label: 'Indeks Pembangunan Manusia',
    labelEn: 'Human Development Index',
    unit: 'skor 0–100',
    source: SOURCES.bps,
    years: [2015, 2017, 2019, 2020, 2022, 2023, 2024],
    values: [69.55, 70.81, 71.92, 71.94, 73.86, 74.39, 75.02],
    note: 'IPM BPS; kategori "tinggi" sejak 2022.',
  },
};

// GDP by sector, 2024, share of GDP (%). Source: BPS.
export const SECTORS_2024 = [
  { name: 'Industri pengolahan', share: 18.9 },
  { name: 'Perdagangan', share: 12.8 },
  { name: 'Pertanian, kehutanan, perikanan', share: 12.5 },
  { name: 'Konstruksi', share: 9.9 },
  { name: 'Pertambangan dan penggalian', share: 7.4 },
  { name: 'Transportasi dan pergudangan', share: 5.1 },
  { name: 'Informasi dan komunikasi', share: 4.2 },
  { name: 'Jasa keuangan dan asuransi', share: 4.2 },
  { name: 'Sektor lainnya', share: 25.0 },
];

// Age structure 2024, share of population (%). Source: BPS.
export const AGE_GROUPS_2024 = [
  { group: '0–4', share: 7.9 },
  { group: '5–9', share: 8.0 },
  { group: '10–14', share: 8.3 },
  { group: '15–19', share: 8.4 },
  { group: '20–24', share: 8.6 },
  { group: '25–29', share: 8.1 },
  { group: '30–34', share: 7.6 },
  { group: '35–39', share: 7.2 },
  { group: '40–44', share: 6.9 },
  { group: '45–49', share: 6.3 },
  { group: '50–54', share: 5.6 },
  { group: '55–59', share: 4.9 },
  { group: '60–64', share: 4.1 },
  { group: '65–69', share: 3.1 },
  { group: '70–74', share: 2.2 },
  { group: '75+', share: 2.8 },
];

// Provinces, 2024. Population in millions, area in km². Source: BPS (rounded).
export const PROVINCES = [
  { name: 'Jawa Barat', pop: 50.3, area: 35378 },
  { name: 'Jawa Timur', pop: 41.8, area: 47803 },
  { name: 'Jawa Tengah', pop: 37.9, area: 32801 },
  { name: 'Sumatera Utara', pop: 15.6, area: 72981 },
  { name: 'Banten', pop: 12.4, area: 9663 },
  { name: 'DKI Jakarta', pop: 10.6, area: 664 },
  { name: 'Sulawesi Selatan', pop: 9.3, area: 46717 },
  { name: 'Lampung', pop: 9.2, area: 34624 },
  { name: 'Sumatera Selatan', pop: 8.8, area: 91592 },
  { name: 'Riau', pop: 6.7, area: 87024 },
  { name: 'Sumatera Barat', pop: 5.8, area: 42013 },
  { name: 'Kalimantan Barat', pop: 5.8, area: 147307 },
  { name: 'Nusa Tenggara Barat', pop: 5.7, area: 18572 },
  { name: 'Nusa Tenggara Timur', pop: 5.7, area: 48718 },
  { name: 'Aceh', pop: 5.6, area: 57956 },
  { name: 'Kalimantan Selatan', pop: 4.3, area: 38744 },
  { name: 'Bali', pop: 4.4, area: 5780 },
  { name: 'Kalimantan Timur', pop: 3.9, area: 127347 },
  { name: 'DI Yogyakarta', pop: 3.7, area: 3133 },
  { name: 'Jambi', pop: 3.6, area: 50058 },
  { name: 'Sulawesi Tengah', pop: 3.1, area: 61841 },
  { name: 'Kalimantan Tengah', pop: 2.8, area: 153564 },
  { name: 'Sulawesi Tenggara', pop: 2.8, area: 38140 },
  { name: 'Sulawesi Utara', pop: 2.7, area: 13892 },
  { name: 'Bengkulu', pop: 2.1, area: 19919 },
  { name: 'Maluku', pop: 2.0, area: 46914 },
  { name: 'Sulawesi Barat', pop: 1.6, area: 16787 },
  { name: 'Papua Pegunungan', pop: 1.5, area: 51213 },
  { name: 'Maluku Utara', pop: 1.4, area: 31983 },
  { name: 'Papua Tengah', pop: 1.4, area: 61073 },
  { name: 'Gorontalo', pop: 1.3, area: 11257 },
  { name: 'Papua', pop: 1.1, area: 82680 },
  { name: 'Kepulauan Riau', pop: 2.2, area: 8202 },
  { name: 'Kalimantan Utara', pop: 0.7, area: 75467 },
  { name: 'Papua Barat', pop: 0.6, area: 60275 },
  { name: 'Papua Barat Daya', pop: 0.6, area: 39123 },
  { name: 'Papua Selatan', pop: 0.6, area: 117849 },
  { name: 'Kepulauan Bangka Belitung', pop: 1.5, area: 16424 },
];

// Headline facts shown on the home page. Each carries source + year.
export const HEADLINES = [
  { key: 'population', value: '281,6 jt', caption: 'Penduduk (2024)', series: 'population' },
  { key: 'gdp', value: 'Rp22.139 T', caption: 'PDB harga berlaku (2024)', series: 'gdp' },
  { key: 'growth', value: '5,03%', caption: 'Pertumbuhan ekonomi (2024)', series: 'growth' },
  { key: 'inflation', value: '1,57%', caption: 'Inflasi (Des 2024, yoy)', series: 'inflation' },
  { key: 'unemployment', value: '4,91%', caption: 'Pengangguran terbuka (Agu 2024)', series: 'unemployment' },
  { key: 'poverty', value: '8,57%', caption: 'Kemiskinan (Sep 2024)', series: 'poverty' },
  { key: 'lifeExpectancy', value: '74,2 thn', caption: 'Harapan hidup (2024)', series: 'lifeExpectancy' },
  { key: 'hdi', value: '75,02', caption: 'IPM — kategori tinggi (2024)', series: 'hdi' },
];

// Extra social facts for the society page.
export const SOCIETY_FACTS = [
  { label: 'Rata-rata lama sekolah', value: '9,0 tahun', source: SOURCES.bps, year: 2024, note: 'Penduduk usia 25 tahun ke atas.' },
  { label: 'Tingkat melek huruf (15+)', value: '96,5%', source: SOURCES.bps, year: 2023, note: 'Penduduk usia 15 tahun ke atas yang dapat membaca dan menulis.' },
  { label: 'Pengguna internet', value: '221,6 juta', source: SOURCES.apjii, year: 2024, note: '79,5% dari total penduduk; survei APJII.' },
  { label: 'Angka kematian bayi', value: '16,8 / 1.000', source: SOURCES.worldBank, year: 2024, note: 'Per 1.000 kelahiran hidup; estimasi World Bank.' },
  { label: 'Kepadatan penduduk', value: '148 /km²', source: SOURCES.bps, year: 2024, note: 'Rata-rata nasional; DKI Jakarta 15.900/km².' },
  { label: 'Usia median', value: '30,5 tahun', source: SOURCES.bps, year: 2024, note: 'Separuh penduduk lebih muda dari angka ini.' },
];

// Short news-style updates for the home page.
export const UPDATES = [
  { date: 'Nov 2026', text: 'BPS merilis angka kemiskinan September 2024: 8,57%, terendah sepanjang sejarah pencatatan.' },
  { date: 'Feb 2025', text: 'Pengangguran terbuka turun ke 4,76%, level terendah sejak krisis 1998.' },
  { date: '2024', text: 'PDB menembus Rp22.139 triliun dengan pertumbuhan 5,03%; PDB per kapita US$4.960.' },
  { date: '2024', text: 'Pengguna internet mencapai 221,6 juta jiwa — 79,5% penduduk sudah terhubung (APJII).' },
];

export function densityOf(province) {
  return Math.round((province.pop * 1000000) / province.area);
}

export function formatNumber(value, decimals = 1) {
  return value.toLocaleString('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
