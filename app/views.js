// Statara — page views. Each route renders its HTML, then mounts its charts
// and wires its controls. Every number shown comes from data.js with its
// source and year cited beside it.

import {
  SERIES,
  SOURCES,
  SECTORS_2024,
  AGE_GROUPS_2024,
  PROVINCES,
  HEADLINES,
  SOCIETY_FACTS,
  UPDATES,
  COUNTRY,
  densityOf,
  formatNumber,
} from './data.js';
import { drawLineChart, drawBarChart, drawHBarChart, drawDonut, drawMultiLine } from './charts.js';

function sourceLine(series) {
  return `<p class="source">Sumber: ${series.source} · ${series.years[0]}–${series.years[series.years.length - 1]}</p>`;
}

function seriesTable(series, fromYear, toYear) {
  const rows = series.years
    .map((y, i) => ({ y, v: series.values[i] }))
    .filter((r) => (!fromYear || r.y >= fromYear) && (!toYear || r.y <= toYear));
  return `<table class="data-table"><thead><tr><th>Tahun</th><th>${series.label} (${series.unit})</th></tr></thead><tbody>${rows
    .map((r) => `<tr><td>${r.y}</td><td>${formatNumber(r.v, series.unit === '%' ? 2 : 1)}</td></tr>`)
    .join('')}</tbody></table>`;
}

function statCard(headline) {
  const s = SERIES[headline.series];
  const last = s.values[s.values.length - 1];
  const prev = s.values[s.values.length - 2];
  const change = prev !== undefined && prev !== 0 ? ((last - prev) / Math.abs(prev)) * 100 : null;
  const arrow = change === null ? '' : change >= 0 ? '▲' : '▼';
  const changeText =
    change === null
      ? ''
      : `<span class="delta">${arrow} ${formatNumber(Math.abs(change), 1)}% dari tahun sebelumnya</span>`;
  return `<a class="stat-card" href="#/jelajah?indikator=${headline.series}">
    <span class="stat-value">${headline.value}</span>
    <span class="stat-caption">${headline.caption}</span>
    ${changeText}
    <span class="stat-source">Sumber: ${s.source}</span>
  </a>`;
}

function chartCard(id, title, subtitle, bodyHtml) {
  return `<section class="card chart-card">
    <h2 id="${id}-title">${title}</h2>
    <p class="card-sub">${subtitle}</p>
    ${bodyHtml}
  </section>`;
}

const ROUTES = [
  { path: '#/', label: 'Beranda', labelEn: 'Home' },
  { path: '#/penduduk', label: 'Penduduk', labelEn: 'Population' },
  { path: '#/ekonomi', label: 'Ekonomi', labelEn: 'Economy' },
  { path: '#/masyarakat', label: 'Masyarakat', labelEn: 'Society' },
  { path: '#/daerah', label: 'Daerah', labelEn: 'Regions' },
  { path: '#/jelajah', label: 'Jelajah Data', labelEn: 'Data Explorer' },
  { path: '#/sumber', label: 'Sumber Data', labelEn: 'Sources' },
];

export function navLinks(current) {
  return ROUTES.map(
    (r) =>
      `<a href="${r.path}" class="${r.path === current ? 'active' : ''}" ${r.path === current ? 'aria-current="page"' : ''}>${r.label}</a>`,
  ).join('');
}

function homeView() {
  const indicatorList = Object.entries(SERIES)
    .map(
      ([key, s]) =>
        `<li data-name="${s.label.toLowerCase()} ${s.labelEn.toLowerCase()}"><a href="#/jelajah?indikator=${key}">${s.label} <span>${s.labelEn} · ${s.years[s.years.length - 1]}: ${formatNumber(s.values[s.values.length - 1], s.unit === '%' ? 2 : 1)} ${s.unit}</span></a></li>`,
    )
    .join('');
  return {
    title: 'Statara — Statistik Indonesia',
    html: `
    <section class="hero">
      <p class="eyebrow">Portal Statistik Nasional · Indonesia</p>
      <h1>Angka Indonesia,<br>dalam satu tempat.</h1>
      <p class="lede">Penduduk, ekonomi, masyarakat, dan daerah — angka resmi terbaru beserta
      sumber dan tahunnya, disajikan agar mudah ditemukan, dibaca, dan dipakai.</p>
      <div class="hero-actions">
        <a class="btn primary" href="#/jelajah">Jelajah Data</a>
        <a class="btn" href="#/daerah">Lihat 38 Provinsi</a>
      </div>
      <p class="hero-facts">${COUNTRY.areaKm2.toLocaleString('id-ID')} km² · ${COUNTRY.islands.toLocaleString('id-ID')} pulau · ${COUNTRY.provinces} provinsi · ${COUNTRY.regenciesCities} kabupaten/kota · Ibu kota ${COUNTRY.capital}</p>
    </section>
    <section aria-labelledby="angka-utama">
      <h2 id="angka-utama">Angka utama</h2>
      <div class="stat-grid">${HEADLINES.map(statCard).join('')}</div>
    </section>
    <section class="home-split" aria-labelledby="cari-angka">
      <div class="card">
        <h2 id="cari-angka">Cari angka</h2>
        <label class="field-label" for="home-search">Ketik nama indikator, misalnya “kemiskinan” atau “ekspor”.</label>
        <input id="home-search" type="search" placeholder="Cari indikator…" autocomplete="off">
        <ul id="indicator-list" class="indicator-list">${indicatorList}</ul>
        <p id="no-result" class="muted" hidden>Tidak ada indikator yang cocok. Coba kata lain.</p>
      </div>
      <div class="card">
        <h2>Pertumbuhan penduduk</h2>
        <p class="card-sub">Juta jiwa, 2015–2024 · Sumber: ${SERIES.population.source}</p>
        <canvas id="home-pop-chart" height="220"></canvas>
        <p class="source">Penduduk tumbuh rata-rata sekitar 1% per tahun; separuh penduduk tinggal di Pulau Jawa.</p>
        <a class="btn small" href="#/penduduk">Buka halaman Penduduk</a>
      </div>
    </section>
    <section aria-labelledby="kabar">
      <h2 id="kabar">Kabar angka terbaru</h2>
      <ul class="updates">${UPDATES.map((u) => `<li><span class="update-date">${u.date}</span><span>${u.text}</span></li>`).join('')}</ul>
    </section>
    <section aria-labelledby="jelajah-cepat">
      <h2 id="jelajah-cepat">Mulai dari topik</h2>
      <div class="topic-grid">
        <a class="topic" href="#/penduduk"><strong>Penduduk</strong><span>281,6 juta jiwa, sebaran provinsi, struktur usia.</span></a>
        <a class="topic" href="#/ekonomi"><strong>Ekonomi</strong><span>PDB Rp22.139 triliun, tumbuh 5,03%, inflasi 1,57%.</span></a>
        <a class="topic" href="#/masyarakat"><strong>Masyarakat</strong><span>Kemiskinan 8,57%, pengangguran 4,91%, IPM 75,02.</span></a>
        <a class="topic" href="#/daerah"><strong>Daerah</strong><span>38 provinsi: penduduk, luas, kepadatan — bisa dicari dan diurutkan.</span></a>
      </div>
    </section>`,
    mount(root) {
      const s = SERIES.population;
      drawLineChart(root.querySelector('#home-pop-chart'), s.years, s.values, { height: 220 });
      const input = root.querySelector('#home-search');
      const list = root.querySelector('#indicator-list');
      const empty = root.querySelector('#no-result');
      input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        let shown = 0;
        list.querySelectorAll('li').forEach((li) => {
          const hit = !q || li.dataset.name.includes(q);
          li.hidden = !hit;
          if (hit) shown++;
        });
        empty.hidden = shown > 0;
      });
    },
  };
}

function populationView() {
  const top10 = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 10);
  return {
    title: 'Penduduk — Statara',
    html: `
    <header class="page-head">
      <p class="eyebrow">Penduduk · Population</p>
      <h1>Penduduk Indonesia</h1>
      <p class="lede">281,6 juta jiwa pada 2024 — negara keempat terpadat di dunia. Sebaran dan
      strukturnya menentukan kebutuhan sekolah, rumah, lapangan kerja, dan layanan publik.</p>
    </header>
    <div class="tabs" role="tablist" aria-label="Bagian halaman penduduk">
      <button role="tab" aria-selected="true" data-tab="tren" class="tab active">Tren</button>
      <button role="tab" aria-selected="false" data-tab="provinsi" class="tab">Provinsi</button>
      <button role="tab" aria-selected="false" data-tab="usia" class="tab">Struktur usia</button>
    </div>
    <div id="tab-tren" class="tab-panel">
      ${chartCard('pop-tren', 'Jumlah penduduk 2015–2024', 'Juta jiwa · ' + SERIES.population.source, `<canvas id="pop-line" height="260"></canvas>${sourceLine(SERIES.population)}<p>${SERIES.population.note}</p>`)}
      <div class="fact-row">
        <div class="fact"><strong>30,5 tahun</strong><span>Usia median (2024, BPS)</span></div>
        <div class="fact"><strong>148/km²</strong><span>Kepadatan rata-rata (2024, BPS)</span></div>
        <div class="fact"><strong>56%</strong><span>Penduduk tinggal di Pulau Jawa</span></div>
        <div class="fact"><strong>68,9%</strong><span>Penduduk usia produktif 15–64 tahun</span></div>
      </div>
    </div>
    <div id="tab-provinsi" class="tab-panel" hidden>
      ${chartCard('pop-prov', 'Provinsi terpadat', 'Juta jiwa, 2024 · ' + SOURCES.bps, `<canvas id="prov-bars" height="320"></canvas><p class="source">Sumber: ${SOURCES.bps}. Angka dibulatkan ke 0,1 juta.</p>`)}
      <p><a class="btn" href="#/daerah">Lihat semua 38 provinsi →</a></p>
    </div>
    <div id="tab-usia" class="tab-panel" hidden>
      ${chartCard('pop-usia', 'Struktur usia 2024', 'Persen penduduk per kelompok usia · BPS', `<canvas id="age-bars" height="520"></canvas><p class="source">Sumber: BPS, 2024. Kelompok usia produktif (15–64 tahun) mencapai 68,9% — jendela bonus demografi.</p>`)}
    </div>`,
    mount(root) {
      const s = SERIES.population;
      drawLineChart(root.querySelector('#pop-line'), s.years, s.values, { height: 260 });
      drawHBarChart(
        root.querySelector('#prov-bars'),
        top10.map((p) => ({ label: p.name, value: p.pop })),
        { suffix: ' jt', rowHeight: 30, labelWidth: 150 },
      );
      drawHBarChart(
        root.querySelector('#age-bars'),
        AGE_GROUPS_2024.map((a) => ({ label: a.group + ' thn', value: a.share, highlight: a.group === '20–24' })),
        { suffix: '%', rowHeight: 30, labelWidth: 110 },
      );
      root.querySelectorAll('.tab').forEach((btn) => {
        btn.addEventListener('click', () => {
          root.querySelectorAll('.tab').forEach((b) => {
            b.classList.toggle('active', b === btn);
            b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
          });
          root.querySelectorAll('.tab-panel').forEach((p) => {
            p.hidden = p.id !== 'tab-' + btn.dataset.tab;
          });
          // Redraw charts that were hidden (canvas needs layout to size).
          if (btn.dataset.tab === 'provinsi') {
            drawHBarChart(
              root.querySelector('#prov-bars'),
              top10.map((p) => ({ label: p.name, value: p.pop })),
              { suffix: ' jt', rowHeight: 30, labelWidth: 150 },
            );
          }
          if (btn.dataset.tab === 'usia') {
            drawHBarChart(
              root.querySelector('#age-bars'),
              AGE_GROUPS_2024.map((a) => ({ label: a.group + ' thn', value: a.share, highlight: a.group === '20–24' })),
              { suffix: '%', rowHeight: 30, labelWidth: 110 },
            );
          }
        });
      });
    },
  };
}

function economyView() {
  return {
    title: 'Ekonomi — Statara',
    html: `
    <header class="page-head">
      <p class="eyebrow">Ekonomi · Economy</p>
      <h1>Ekonomi Indonesia</h1>
      <p class="lede">PDB Rp22.139 triliun pada 2024 — ekonomi terbesar di Asia Tenggara.
      Pertumbuhan stabil di sekitar 5% selama satu dekade, kecuali kontraksi 2020 saat pandemi.</p>
    </header>
    ${chartCard('gdp', 'PDB 2015–2024', 'Rp triliun, harga berlaku · ' + SERIES.gdp.source, `<canvas id="gdp-line" height="260"></canvas>${sourceLine(SERIES.gdp)}`)}
    <div class="two-col">
      ${chartCard('growth', 'Pertumbuhan ekonomi', '% per tahun · BPS', `<canvas id="growth-bars" height="240"></canvas>${sourceLine(SERIES.growth)}<p>Kontraksi −2,07% pada 2020 adalah yang pertama sejak 1998.</p>`)}
      ${chartCard('inflasi', 'Inflasi', '%, Desember yoy · BPS', `<canvas id="inflation-bars" height="240"></canvas>${sourceLine(SERIES.inflation)}<p>Inflasi 2024 sebesar 1,57% — terendah dalam satu dekade.</p>`)}
    </div>
    <div class="two-col">
      ${chartCard('sektor', 'PDB menurut lapangan usaha, 2024', 'Persen terhadap PDB · BPS', `<canvas id="sector-donut" height="300"></canvas><p>Industri pengolahan tetap penyumbang terbesar (18,9%), diikuti perdagangan (12,8%) dan pertanian (12,5%).</p>`)}
      ${chartCard('dagang', 'Perdagangan luar negeri', 'US$ miliar · BPS', `<canvas id="trade-lines" height="260"></canvas><p>Surplus dagang 2024: US$29,7 miliar (ekspor US$264,7 miliar, impor US$235,0 miliar).</p>`)}
    </div>
    <section class="card">
      <h2>PDB per kapita</h2>
      <p class="card-sub">US$ · IMF · 2015–2024</p>
      <canvas id="gdppc-line" height="220"></canvas>
      <p class="source">Sumber: IMF. PDB per kapita naik dari US$3.377 (2015) menjadi US$4.960 (2024).</p>
    </section>`,
    mount(root) {
      drawLineChart(root.querySelector('#gdp-line'), SERIES.gdp.years, SERIES.gdp.values, { decimals: 0 });
      drawBarChart(root.querySelector('#growth-bars'), SERIES.growth.years, SERIES.growth.values, {
        decimals: 2,
        height: 240,
      });
      drawBarChart(root.querySelector('#inflation-bars'), SERIES.inflation.years, SERIES.inflation.values, {
        decimals: 2,
        height: 240,
        color: '#d97706',
      });
      drawDonut(root.querySelector('#sector-donut'), SECTORS_2024, { size: 300 });
      drawMultiLine(root.querySelector('#trade-lines'), SERIES.exports.years, [
        { label: 'Ekspor', values: SERIES.exports.values, color: '#0e7a6d' },
        { label: 'Impor', values: SERIES.imports.values, color: '#2563eb' },
      ], { decimals: 0, height: 260 });
      drawLineChart(root.querySelector('#gdppc-line'), SERIES.gdpPerCapita.years, SERIES.gdpPerCapita.values, {
        decimals: 0,
        height: 220,
        color: '#2563eb',
      });
    },
  };
}

function societyView() {
  return {
    title: 'Masyarakat — Statara',
    html: `
    <header class="page-head">
      <p class="eyebrow">Masyarakat · Society</p>
      <h1>Masyarakat Indonesia</h1>
      <p class="lede">Kemiskinan di titik terendah sepanjang sejarah, pengangguran di bawah 5%,
      dan harapan hidup 74,2 tahun. Angka-angka ini mengukur apakah pertumbuhan ekonomi
      sampai ke kehidupan sehari-hari.</p>
    </header>
    <div class="two-col">
      ${chartCard('miskin', 'Tingkat kemiskinan', '% penduduk · BPS', `<canvas id="poverty-line" height="240"></canvas>${sourceLine(SERIES.poverty)}<p>September 2024: 8,57% — turun dari 11,13% pada 2015.</p>`)}
      ${chartCard('kerja', 'Pengangguran terbuka', '% · BPS', `<canvas id="unemp-bars" height="240"></canvas>${sourceLine(SERIES.unemployment)}<p>Agustus 2024: 4,91%; Februari 2025: 4,76%.</p>`)}
    </div>
    <div class="two-col">
      ${chartCard('hdi', 'Indeks Pembangunan Manusia', 'Skor 0–100 · BPS', `<canvas id="hdi-line" height="240"></canvas>${sourceLine(SERIES.hdi)}<p>IPM 2024: 75,02 — kategori “tinggi”.</p>`)}
      ${chartCard('hidup', 'Angka harapan hidup', 'Tahun · BPS', `<canvas id="life-line" height="240"></canvas>${sourceLine(SERIES.lifeExpectancy)}<p>Harapan hidup 2024: 74,2 tahun.</p>`)}
    </div>
    <section aria-labelledby="fakta-sosial">
      <h2 id="fakta-sosial">Fakta sosial lainnya</h2>
      <div class="fact-grid">${SOCIETY_FACTS.map(
        (f) => `<div class="fact-card"><strong>${f.value}</strong><span>${f.label}</span><em>${f.source} · ${f.year}</em><p>${f.note}</p></div>`,
      ).join('')}</div>
    </section>`,
    mount(root) {
      drawLineChart(root.querySelector('#poverty-line'), SERIES.poverty.years, SERIES.poverty.values, {
        decimals: 2,
        height: 240,
        color: '#15803d',
      });
      drawBarChart(root.querySelector('#unemp-bars'), SERIES.unemployment.years, SERIES.unemployment.values, {
        decimals: 2,
        height: 240,
        color: '#c2410c',
      });
      drawLineChart(root.querySelector('#hdi-line'), SERIES.hdi.years, SERIES.hdi.values, {
        decimals: 2,
        height: 240,
        color: '#7c3aed',
      });
      drawLineChart(root.querySelector('#life-line'), SERIES.lifeExpectancy.years, SERIES.lifeExpectancy.values, {
        decimals: 1,
        height: 240,
        color: '#0891b2',
      });
    },
  };
}

function regionsView() {
  return {
    title: 'Daerah — Statara',
    html: `
    <header class="page-head">
      <p class="eyebrow">Daerah · Regions</p>
      <h1>38 Provinsi</h1>
      <p class="lede">Dari Jawa Barat yang terpadat hingga Papua Selatan yang terluas.
      Cari provinsi, urutkan tabelnya, lalu klik barisnya untuk melihat detail —
      atau bandingkan dua provinsi berdampingan.</p>
    </header>
    <section class="card" aria-labelledby="tabel-provinsi">
      <h2 id="tabel-provinsi">Tabel provinsi, 2024</h2>
      <p class="card-sub">Sumber: BPS. Penduduk dibulatkan ke 0,1 juta; kepadatan = penduduk ÷ luas.</p>
      <div class="controls">
        <label>Cari provinsi <input id="prov-search" type="search" placeholder="mis. Jawa, Papua…" autocomplete="off"></label>
        <label>Urutkan
          <select id="prov-sort">
            <option value="pop-desc">Penduduk terbanyak</option>
            <option value="pop-asc">Penduduk tersedikit</option>
            <option value="density-desc">Kepadatan tertinggi</option>
            <option value="area-desc">Luas terluas</option>
            <option value="name-asc">Nama A–Z</option>
          </select>
        </label>
      </div>
      <div class="table-wrap">
        <table class="data-table" id="prov-table">
          <thead><tr><th>Provinsi</th><th>Penduduk (juta)</th><th>Luas (km²)</th><th>Kepadatan (/km²)</th><th>Pangsa (%)</th></tr></thead>
          <tbody></tbody>
        </table>
      </div>
      <p id="prov-empty" class="muted" hidden>Tidak ada provinsi yang cocok dengan pencarian.</p>
      <p class="source">Klik baris untuk melihat detail provinsi.</p>
    </section>
    <section class="card" id="prov-detail" aria-labelledby="detail-title">
      <h2 id="detail-title">Detail provinsi</h2>
      <p class="muted" id="detail-hint">Pilih baris pada tabel di atas, atau pilih dari daftar:</p>
      <div class="controls">
        <label>Provinsi A
          <select id="compare-a"></select>
        </label>
        <label>Provinsi B
          <select id="compare-b"></select>
        </label>
      </div>
      <div id="compare-out" class="compare-grid"></div>
    </section>`,
    mount(root) {
      const tbody = root.querySelector('#prov-table tbody');
      const empty = root.querySelector('#prov-empty');
      const search = root.querySelector('#prov-search');
      const sortSel = root.querySelector('#prov-sort');
      const total = PROVINCES.reduce((a, p) => a + p.pop, 0);
      const selA = root.querySelector('#compare-a');
      const selB = root.querySelector('#compare-b');
      const out = root.querySelector('#compare-out');
      const options = PROVINCES.map((p) => `<option value="${p.name}">${p.name}</option>`).join('');
      selA.innerHTML = options;
      selB.innerHTML = options;
      selA.value = 'Jawa Barat';
      selB.value = 'DKI Jakarta';

      function renderRows() {
        const q = search.value.trim().toLowerCase();
        let rows = PROVINCES.filter((p) => !q || p.name.toLowerCase().includes(q));
        const mode = sortSel.value;
        const by = {
          'pop-desc': (a, b) => b.pop - a.pop,
          'pop-asc': (a, b) => a.pop - b.pop,
          'density-desc': (a, b) => densityOf(b) - densityOf(a),
          'area-desc': (a, b) => b.area - a.area,
          'name-asc': (a, b) => a.name.localeCompare(b.name, 'id'),
        }[mode];
        rows = rows.sort(by);
        tbody.innerHTML = rows
          .map(
            (p) => `<tr data-name="${p.name}" tabindex="0">
              <td>${p.name}</td><td>${formatNumber(p.pop)}</td>
              <td>${p.area.toLocaleString('id-ID')}</td>
              <td>${densityOf(p).toLocaleString('id-ID')}</td>
              <td>${formatNumber((p.pop / total) * 100)}</td></tr>`,
          )
          .join('');
        empty.hidden = rows.length > 0;
        tbody.querySelectorAll('tr').forEach((tr) => {
          const pick = () => {
            selA.value = tr.dataset.name;
            renderCompare();
            root.querySelector('#prov-detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
          };
          tr.addEventListener('click', pick);
          tr.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              pick();
            }
          });
        });
      }

      function provinceCard(p) {
        return `<div class="compare-card">
          <h3>${p.name}</h3>
          <dl>
            <div><dt>Penduduk (2024)</dt><dd>${formatNumber(p.pop)} juta jiwa</dd></div>
            <div><dt>Luas</dt><dd>${p.area.toLocaleString('id-ID')} km²</dd></div>
            <div><dt>Kepadatan</dt><dd>${densityOf(p).toLocaleString('id-ID')} jiwa/km²</dd></div>
            <div><dt>Pangsa penduduk nasional</dt><dd>${formatNumber((p.pop / total) * 100)}%</dd></div>
          </dl>
          <p class="source">Sumber: BPS, 2024.</p>
        </div>`;
      }

      function renderCompare() {
        const a = PROVINCES.find((p) => p.name === selA.value);
        const b = PROVINCES.find((p) => p.name === selB.value);
        out.innerHTML = provinceCard(a) + provinceCard(b);
        const denser = densityOf(a) >= densityOf(b) ? a.name : b.name;
        const bigger = a.pop >= b.pop ? a.name : b.name;
        root.querySelector('#detail-hint').textContent =
          `${bigger} berpenduduk lebih banyak; ${denser} lebih padat. Perbandingan diperbarui saat pilihan berubah.`;
      }

      search.addEventListener('input', renderRows);
      sortSel.addEventListener('change', renderRows);
      selA.addEventListener('change', renderCompare);
      selB.addEventListener('change', renderCompare);
      renderRows();
      renderCompare();
    },
  };
}

function explorerView() {
  const indicatorOptions = Object.entries(SERIES)
    .map(([key, s]) => `<option value="${key}">${s.label} (${s.unit})</option>`)
    .join('');
  return {
    title: 'Jelajah Data — Statara',
    html: `
    <header class="page-head">
      <p class="eyebrow">Jelajah Data · Data Explorer</p>
      <h1>Jelajah Data</h1>
      <p class="lede">Pilih indikator dan rentang tahun, lihat grafik dan tabelnya,
      lalu unduh sebagai CSV untuk dipakai sendiri. Semua data berasal dari berkas situs ini —
      tidak ada yang diambil dari internet.</p>
    </header>
    <section class="card" aria-labelledby="pilih-indikator">
      <h2 id="pilih-indikator">Pilih indikator</h2>
      <div class="controls">
        <label>Indikator
          <select id="ex-indicator">${indicatorOptions}</select>
        </label>
        <label>Dari tahun
          <select id="ex-from"></select>
        </label>
        <label>Sampai tahun
          <select id="ex-to"></select>
        </label>
        <button class="btn primary" id="ex-csv" type="button">Unduh CSV</button>
      </div>
      <p class="source" id="ex-source"></p>
      <canvas id="ex-chart" height="280"></canvas>
      <div class="table-wrap" id="ex-table-wrap"></div>
      <p id="ex-note" class="muted"></p>
    </section>`,
    mount(root) {
      const indicatorSel = root.querySelector('#ex-indicator');
      const fromSel = root.querySelector('#ex-from');
      const toSel = root.querySelector('#ex-to');
      const sourceEl = root.querySelector('#ex-source');
      const noteEl = root.querySelector('#ex-note');
      const wrap = root.querySelector('#ex-table-wrap');
      const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
      const initial = params.get('indikator');
      if (initial && SERIES[initial]) indicatorSel.value = initial;

      function fillYears() {
        const s = SERIES[indicatorSel.value];
        fromSel.innerHTML = s.years.map((y) => `<option value="${y}">${y}</option>`).join('');
        toSel.innerHTML = s.years.map((y) => `<option value="${y}">${y}</option>`).join('');
        fromSel.value = String(s.years[0]);
        toSel.value = String(s.years[s.years.length - 1]);
      }

      function render() {
        const s = SERIES[indicatorSel.value];
        let from = Number(fromSel.value);
        let to = Number(toSel.value);
        if (from > to) {
          [from, to] = [to, from];
          fromSel.value = String(from);
          toSel.value = String(to);
        }
        const idx = s.years.map((y, i) => ({ y, v: s.values[i] })).filter((r) => r.y >= from && r.y <= to);
        const years = idx.map((r) => r.y);
        const values = idx.map((r) => r.v);
        drawLineChart(root.querySelector('#ex-chart'), years, values, {
          height: 280,
          decimals: s.unit === '%' ? 2 : 1,
        });
        sourceEl.textContent = `Sumber: ${s.source} · ${from}–${to} · Satuan: ${s.unit}`;
        noteEl.textContent = s.note;
        wrap.innerHTML = seriesTable(
          { ...s, years, values },
          null,
          null,
        );
      }

      fillYears();
      render();
      indicatorSel.addEventListener('change', () => {
        fillYears();
        render();
      });
      fromSel.addEventListener('change', render);
      toSel.addEventListener('change', render);
      root.querySelector('#ex-csv').addEventListener('click', () => {
        const s = SERIES[indicatorSel.value];
        const from = Number(fromSel.value);
        const to = Number(toSel.value);
        const lines = ['tahun,' + s.label.replace(/,/g, '') + ' (' + s.unit + ')'];
        s.years.forEach((y, i) => {
          if (y >= from && y <= to) lines.push(y + ',' + String(s.values[i]).replace('.', ','));
        });
        lines.push('Sumber,' + s.source);
        const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'statara-' + indicatorSel.value + '-' + from + '-' + to + '.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      });
    },
  };
}

function sourcesView() {
  const rows = Object.entries(SERIES)
    .map(
      ([, s]) =>
        `<tr><td>${s.label}</td><td>${s.years[0]}–${s.years[s.years.length - 1]}</td><td>${s.source}</td><td>${s.note}</td></tr>`,
    )
    .join('');
  return {
    title: 'Sumber Data — Statara',
    html: `
    <header class="page-head">
      <p class="eyebrow">Sumber Data · Sources</p>
      <h1>Sumber &amp; Metodologi</h1>
      <p class="lede">Setiap angka di situs ini punya sumber dan tahun. Angka dibulatkan untuk
      keterbacaan; angka resmi lengkapnya ada pada publikasi sumber yang tercantum.</p>
    </header>
    <section class="card">
      <h2>Semua indikator</h2>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Indikator</th><th>Tahun</th><th>Sumber</th><th>Catatan</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
    <section class="card">
      <h2>Provinsi</h2>
      <p>Jumlah penduduk dan luas 38 provinsi: ${SERIES.bps}, 2024, dibulatkan ke 0,1 juta jiwa.
      Kepadatan dihitung sebagai penduduk dibagi luas. Enam provinsi di Papua dibentuk dari
      pemekaran 2022, sehingga angka sebelum 2022 tidak sebanding langsung.</p>
    </section>
    <section class="card">
      <h2>Metodologi singkat</h2>
      <ul class="method">
        <li><strong>Kemiskinan</strong> diukur BPS dari garis kemiskinan (kebutuhan makanan dan non-makanan minimum); angka September setiap tahun.</li>
        <li><strong>Pengangguran terbuka</strong> adalah pencari kerja aktif dibagi angkatan kerja; angka Agustus setiap tahun.</li>
        <li><strong>Inflasi</strong> dihitung dari Indeks Harga Konsumen di 90 kota; angka Desember terhadap Desember tahun lalu.</li>
        <li><strong>PDB per kapita</strong> memakai estimasi IMF dalam dolar AS berlaku.</li>
        <li><strong>IPM</strong> menggabungkan kesehatan, pendidikan, dan standar hidup layak (BPS).</li>
      </ul>
      <p class="source">Statara adalah situs independen dan bukan publikasi resmi BPS atau lembaga mana pun. Angka-angka di sini merujuk pada publikasi resmi yang tercantum, terakhir diperbarui November 2026.</p>
    </section>`,
    mount() {},
  };
}

export const VIEWS = {
  '/': homeView,
  '/penduduk': populationView,
  '/ekonomi': economyView,
  '/masyarakat': societyView,
  '/daerah': regionsView,
  '/jelajah': explorerView,
  '/sumber': sourcesView,
};

export function notFoundView(path) {
  return {
    title: 'Tidak ditemukan — Statara',
    html: `<header class="page-head"><h1>Halaman tidak ditemukan</h1>
      <p class="lede">Alamat “${path}” tidak ada di situs ini. Mungkin tautannya sudah berubah.</p>
      <p><a class="btn primary" href="#/">Kembali ke Beranda</a></p></header>`,
    mount() {},
  };
}
