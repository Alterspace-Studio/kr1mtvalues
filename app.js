"use strict";
// kr1mtvalues 화면 로직. 데이터는 data/items.js의 window.ITEMS.

const ITEMS = window.ITEMS || [];
const SITE = window.SITE || {};
const CATS = ["All", "Land", "Air", "Naval", "Soldier", "Drone", "Other"];
const CAT_ICON = { Land: "▰", Air: "✈", Naval: "⚓", Soldier: "♟", Drone: "✦", Other: "◆" };
const TREND = { up: "▲", down: "▼", stable: "■" };
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const fmt = (n) => (n == null || Number.isNaN(n) ? "—" : Number(n).toLocaleString("en-US"));
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const GEM = "💎";
// 1,000 이상은 K, 1,000,000 이상은 M (소수 둘째 자리까지, 끝의 0은 뺀다)
const compact = (n) => {
  if (n == null || Number.isNaN(n)) return "—";
  const a = Math.abs(n), sign = n < 0 ? "-" : "";
  const cut = (x) => String(+x.toFixed(2));
  if (a >= 1e6) return sign + cut(a / 1e6) + "M";
  if (a >= 1e3) return sign + cut(a / 1e3) + "K";
  return sign + String(a);
};
const gem = (n) => (n == null ? "—" : `${GEM} ${compact(n)}`);
const isUntradeable = (it) => it.tradeable === false;
const byId = (id) => ITEMS.find((i) => i.id === id);
const catVar = (c) => `var(--${(c || "other").toLowerCase()})`;

// ---------- 언어 ----------
const STR = {
  en: {
    tabValues: "Values", tabCompare: "Compare", tabTrade: "Trade Calc", updated: "Updated",
    search: "Search vehicles, soldiers, drones…",
    sortValueDesc: "Value ↓", sortValueAsc: "Value ↑", sortDemand: "Demand ↓", sortPvp: "PVP ↓", sortBoss: "Boss Raid ↓", sortVfm: "Value for money ↓", sortName: "Name A–Z",
    onlyTradeable: "Tradeable only", onlyLimited: "Limited only",
    items: (n) => `${n} item${n === 1 ? "" : "s"}`, noMatch: "No items match.",
    cat: { All: "All", Land: "Land", Air: "Air", Naval: "Naval", Soldier: "Soldier", Drone: "Drone", Other: "Other" },
    trend: { up: "Rising", down: "Falling", stable: "Stable" },
    untradeable: "Untradeable", sample: "Sample",
    value: "Value (Gems)", demand: "Demand", trendL: "Trend", obtain: "Obtain", byStars: "Value by stars",
    perf: "Performance", pvp: "PVP", boss: "Boss Raid", vfm: "Value for money",
    history: "Value history", lastChanged: "Last changed", close: "Close",
    pick: "— pick —", pickHint: "Pick items to compare.",
    youGive: "You give", youGet: "You get", addItem: "Add item…", add: "Add", total: "Total",
    star: "Stars", addFirst: "Add items to compare", fair: "FAIR", win: "WIN", lose: "LOSE",
    tradeHint: "Values are community estimates. Always double-check before trading.",
    footer: "Fan-made site. Not affiliated with Roblox or the Military Tycoon developers.",
    langBtn: "한국어",
  },
  ko: {
    tabValues: "가치", tabCompare: "비교", tabTrade: "거래 계산", updated: "업데이트",
    search: "탈것·병사·드론 검색…",
    sortValueDesc: "가치 높은 순", sortValueAsc: "가치 낮은 순", sortDemand: "수요 높은 순", sortPvp: "PVP 높은 순", sortBoss: "보스 레이드 높은 순", sortVfm: "가성비 높은 순", sortName: "이름 순",
    onlyTradeable: "거래 가능만", onlyLimited: "한정판만",
    items: (n) => `${n}개`, noMatch: "맞는 항목이 없어요.",
    cat: { All: "전체", Land: "지상", Air: "항공", Naval: "해군", Soldier: "병사", Drone: "드론", Other: "기타" },
    trend: { up: "오름", down: "내림", stable: "유지" },
    untradeable: "거래 불가", sample: "예시",
    value: "가치 (젬)", demand: "수요", trendL: "추세", obtain: "얻는 법", byStars: "별 단계별 가치",
    perf: "성능", pvp: "PVP", boss: "보스 레이드", vfm: "가성비",
    history: "가치 변화", lastChanged: "마지막 수정", close: "닫기",
    pick: "— 선택 —", pickHint: "비교할 항목을 고르세요.",
    youGive: "내가 주는 것", youGet: "내가 받는 것", addItem: "항목 추가…", add: "추가", total: "합계",
    star: "별", addFirst: "항목을 넣어 비교하세요", fair: "공정", win: "이득", lose: "손해",
    tradeHint: "가치는 커뮤니티 추정값이에요. 거래 전에 꼭 다시 확인하세요.",
    footer: "팬 사이트예요. Roblox나 Military Tycoon 개발사와 관계없어요.",
    langBtn: "English",
  },
};
let lang = "en";
try { lang = localStorage.getItem("lang") || (navigator.language.startsWith("ko") ? "ko" : "en"); } catch {}
if (!STR[lang]) lang = "en";
const T = () => STR[lang];

function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-i18n]").forEach((el) => (el.textContent = T()[el.dataset.i18n]));
  $$("[data-i18n-ph]").forEach((el) => (el.placeholder = T()[el.dataset.i18nPh]));
  $("#langBtn").textContent = T().langBtn;
  renderChips(); renderGrid(); renderPickers(); renderCompare(); renderTrade();
  if ($("#detail").open && openId) openDetail(openId);
}
$("#langBtn").addEventListener("click", () => {
  lang = lang === "en" ? "ko" : "en";
  try { localStorage.setItem("lang", lang); } catch {}
  applyLang();
});

// 머리말
document.title = SITE.title || "kr1mtvalues";
$("#siteTitle").textContent = SITE.title || "kr1mtvalues";
$("#lastUpdated").textContent = SITE.lastUpdated || "";

// 탭
$$(".tab").forEach((t) => t.addEventListener("click", () => showView(t.dataset.view)));
function showView(v) {
  $$(".tab").forEach((t) => t.classList.toggle("active", t.dataset.view === v));
  $$(".view").forEach((s) => s.classList.toggle("active", s.id === "view-" + v));
  try { history.replaceState(null, "", "#" + v); } catch {}
}

// ---------- 공용 조각 ----------
function pips(n, max, title) {
  const on = Math.max(0, Math.min(max, Math.round(n ?? 0)));
  return `<span class="pips" title="${esc(title)}">${Array.from({ length: max }, (_, i) => `<i class="${i < on ? "on" : ""}"></i>`).join("")}</span>`;
}
const demandBar = (d) => pips((d ?? 0) / 2, 5, `${T().demand} ${d ?? "—"}/10`);
// 성능 원형 게이지 (0~10)
function gauge(v, label, size = 72) {
  const r = 30, c = 2 * Math.PI * r;
  const f = v == null ? 0 : Math.max(0, Math.min(10, v)) / 10;
  return `<div class="gauge" style="--size:${size}px" title="${esc(label)} ${v ?? "—"}/10">
    <svg viewBox="0 0 72 72"><circle class="g-bg" cx="36" cy="36" r="${r}"/>
      ${f > 0 ? `<circle class="g-fg" cx="36" cy="36" r="${r}" stroke-dasharray="${(c * f).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 36 36)"/>` : ""}
      <text x="36" y="41" text-anchor="middle">${v == null ? "—" : +(+v).toFixed(1)}</text></svg>
    ${label ? `<span>${esc(label)}</span>` : ""}</div>`;
}
function tags(it) {
  return [
    it.limited ? `<span class="tag le">LE${it.stock ? " · " + fmt(it.stock) : ""}</span>` : "",
    "",
    it.sample ? `<span class="tag sample">${T().sample}</span>` : "",
    `<span class="tag">${esc(T().cat[it.category] || it.category)}</span>`,
  ].join("");
}
function thumb(it) {
  return it.image
    ? `<div class="thumb" style="background-image:url('${esc(it.image)}')"></div>`
    : `<div class="thumb">${CAT_ICON[it.category] || "◆"}</div>`;
}
const starLabel = (k) => (+k >= 0 && +k <= 5 ? "★".repeat(+k) + "☆".repeat(5 - +k) : esc(k));
// 별 단계 슬라이더. 데이터에 있는 단계만 칸으로 쓴다(0~5 중 빠진 단계는 건너뜀).
const starKeys = (it) => Object.keys(it.stars || {}).sort((a, b) => +a - +b);
function starSlider(it, star, tag) {
  const keys = starKeys(it);
  const idx = Math.max(0, keys.indexOf(String(star)));
  const ticks = keys.map((k) => `<span>${esc(k)}★</span>`).join("");
  const attr = typeof tag === "number" ? `data-i="${tag}"` : `data-slider="${tag}"`;
  return `<div class="slider"><input type="range" min="0" max="${keys.length - 1}" step="1" value="${idx}" ${attr} aria-label="${T().star}"><div class="ticks">${ticks}</div></div>`;
}
const valueOf = (it) => (isUntradeable(it) ? `<span class="untrade">${T().untradeable}</span>` : gem(it.value));
const noteOf = (it) => (lang === "ko" ? it.noteKo ?? it.note : it.note ?? it.noteKo);

// ---------- 가치 목록 ----------
let cat = "All";
function renderChips() {
  $("#categoryChips").innerHTML = CATS.map((c) => `<button class="chip${c === cat ? " active" : ""}" data-cat="${c}">${T().cat[c]}</button>`).join("");
}
$("#categoryChips").addEventListener("click", (e) => {
  const b = e.target.closest(".chip"); if (!b) return;
  cat = b.dataset.cat; renderChips(); renderGrid();
});
["#search", "#sort", "#onlyTradeable", "#onlyLimited"].forEach((s) => $(s).addEventListener("input", renderGrid));

function renderGrid() {
  const q = $("#search").value.trim().toLowerCase();
  const [key, dir] = $("#sort").value.split("-");
  const get = (it) => (key === "name" ? it.name.toLowerCase() : key === "value" ? (isUntradeable(it) ? -1 : it.value ?? -1) : key === "demand" ? it.demand ?? -1 : it.stats?.[key] ?? -1);
  const list = ITEMS.filter((it) =>
    (cat === "All" || it.category === cat) &&
    (!q || it.name.toLowerCase().includes(q) || (it.aliases || []).some((a) => a.toLowerCase().includes(q))) &&
    (!$("#onlyTradeable").checked || it.tradeable !== false) &&
    (!$("#onlyLimited").checked || it.limited)
  ).sort((a, b) => {
    const x = get(a), y = get(b);
    const r = x < y ? -1 : x > y ? 1 : 0;
    return dir === "asc" ? r : -r;
  });

  $("#resultCount").textContent = T().items(list.length);
  $("#grid").innerHTML = list.length
    ? list.map((it) => `
      <button class="card" data-id="${esc(it.id)}" style="--cat:${catVar(it.category)}">
        ${thumb(it)}
        <h3>${esc(it.name)}</h3>
        <div class="meta"><span class="val">${valueOf(it)}</span><span class="trend ${it.trend}" title="${T().trend[it.trend] || ""}">${TREND[it.trend] || ""}</span></div>
        <div class="meta">${demandBar(it.demand)}<span class="tags">${tags(it)}</span></div>
      </button>`).join("")
    : `<div class="empty">${T().noMatch}</div>`;
}
$("#grid").addEventListener("click", (e) => {
  const c = e.target.closest(".card"); if (c) openDetail(c.dataset.id);
});

// ---------- 상세 창 ----------
let openId = null;
function chart(history, title, show) {
  if (!history || history.length < 2) return "";
  const W = 560, H = 120, P = 24;
  const vs = history.map((h) => h.value);
  const lo = Math.min(...vs), hi = Math.max(...vs), span = hi - lo || 1;
  const pts = history.map((h, i) => [P + (i * (W - 2 * P)) / (history.length - 1), H - P - ((h.value - lo) / span) * (H - 2 * P)]);
  return `<div><h4>${title}</h4><svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
    <path d="M${pts.map((p) => p.join(",")).join(" L")}"/>
    ${pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="3"><title>${esc(history[i].date)}: ${show(history[i].value)}</title></circle>`).join("")}
    <text x="${P}" y="${H - 6}">${esc(history[0].date)}</text>
    <text x="${W - P}" y="${H - 6}" text-anchor="end">${esc(history.at(-1).date)}</text>
  </svg></div>`;
}
function openDetail(id) {
  const it = byId(id); if (!it) return;
  openId = id;
  const s = it.stats || {}, t = T();
  const stars = it.stars ? Object.entries(it.stars) : [];
  $("#detailBody").innerHTML = `
    <div class="d-head"><h2>${esc(it.name)}</h2><button class="close" aria-label="${t.close}">×</button></div>
    <div class="d-body">
      <div class="tags">${tags(it)}</div>
      <div class="kv">
        <div><span>${t.value}</span><b>${valueOf(it)}</b></div>
        <div><span>${t.demand}</span><b>${it.demand ?? "—"}/10</b></div>
        <div><span>${t.trendL}</span><b class="trend ${it.trend}">${TREND[it.trend] || ""} ${t.trend[it.trend] || "—"}</b></div>
        <div><span>${t.obtain}</span><b>${esc(it.obtain || "—")}</b></div>
      </div>
      ${stars.length && !isUntradeable(it) ? `<div><h4>${t.byStars}</h4>
        <div class="star-box">
          <div class="star-read"><span class="star" id="dStar">${starLabel(starKeys(it)[0])}</span><b id="dStarVal">${gem(it.stars[starKeys(it)[0]])}</b></div>
          ${starSlider(it, starKeys(it)[0], "detail")}
        </div></div>` : ""}
      <div><h4>${t.perf}</h4><div class="gauges">${gauge(s.pvp, t.pvp)}${gauge(s.boss, t.boss)}${gauge(s.vfm, t.vfm)}</div></div>
      ${chart(it.history, t.history, gem)}
      ${noteOf(it) ? `<p class="hint">${esc(noteOf(it))}</p>` : ""}
      <p class="hint">${t.lastChanged} ${esc(it.updated || "—")}</p>
    </div>`;
  $(".close", $("#detailBody")).addEventListener("click", () => $("#detail").close());
  const sl = $('input[data-slider="detail"]', $("#detailBody"));
  if (sl) sl.addEventListener("input", () => {
    const k = starKeys(it)[+sl.value];
    $("#dStar").innerHTML = starLabel(k);
    $("#dStarVal").textContent = gem(it.stars[k]);
  });
  if (!$("#detail").open) $("#detail").showModal();
}
$("#detail").addEventListener("click", (e) => { if (e.target.id === "detail") e.target.close(); });

// ---------- 비교 ----------
const ROWS = [
  ["value", (i) => (isUntradeable(i) ? null : i.value), "value"], ["demand", (i) => i.demand, "num"],
  ["pvp", (i) => i.stats?.pvp, "grade"], ["boss", (i) => i.stats?.boss, "grade"],
  ["vfm", (i) => i.stats?.vfm, "grade"],
];
let pickers = ITEMS.slice(0, 3).map((i) => i.id);
function renderPickers() {
  const opts = `<option value="">${T().pick}</option>` + ITEMS.map((i) => `<option value="${esc(i.id)}">${esc(i.name)}</option>`).join("");
  $$(".cmp-pick").forEach((s, n) => { s.innerHTML = opts; s.value = pickers[n] || ""; });
}
$$(".cmp-pick").forEach((s, n) => s.addEventListener("input", () => { pickers[n] = s.value; renderCompare(); }));

function renderCompare() {
  const picks = pickers.map(byId).filter(Boolean);
  if (!picks.length) { $("#compareTable").innerHTML = `<div class="empty">${T().pickHint}</div>`; return; }
  const rows = ROWS.map(([key, f, kind]) => {
    const vs = picks.map(f);
    const max = Math.max(...vs.filter((v) => v != null));
    const show = key === "value" ? gem : fmt;
    return `<tr><td>${T()[key]}</td>${vs.map((v, j) => {
      const best = v != null && v === max && picks.length > 1 ? "best" : "";
      if (kind === "grade") return `<td class="${best}">${gauge(v, "", 48)}</td>`;
      if (kind === "value" && v == null) return `<td>${valueOf(picks[j])}</td>`;
      return `<td class="${best}">${show(v)}${v != null && max > 0 ? `<div class="bar" style="width:${(v / max) * 100}%"></div>` : ""}</td>`;
    }).join("")}</tr>`;
  }).join("");
  $("#compareTable").innerHTML = `<div class="table-wrap"><table>
    <thead><tr><th></th>${picks.map((p) => `<th>${esc(p.name)}</th>`).join("")}</tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}

// ---------- 거래 계산기 ----------
// 별 단계를 고르면 그 단계 가치로 더한다.
$("#itemList").innerHTML = ITEMS.filter((i) => i.tradeable !== false).map((i) => `<option value="${esc(i.name)}">`).join("");
const trade = { you: [], them: [] };
const entryValue = (e) => { const it = byId(e.id); return (e.star && it.stars?.[e.star]) ?? it.value ?? 0; };
$$(".side").forEach((side) => {
  const input = $(".trade-input", side);
  const list = trade[side.dataset.side];
  const add = () => {
    const it = ITEMS.find((i) => i.name.toLowerCase() === input.value.trim().toLowerCase());
    if (!it || it.tradeable === false) { input.select(); return; }
    list.push({ id: it.id, star: it.stars ? starKeys(it)[0] : null }); input.value = ""; renderTrade();
  };
  $(".add-btn", side).addEventListener("click", add);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") add(); });
  $(".trade-list", side).addEventListener("click", (e) => {
    const b = e.target.closest("button[data-i]"); if (!b) return;
    list.splice(+b.dataset.i, 1); renderTrade();
  });
  // 슬라이더를 끄는 동안 목록을 다시 그리지 않고 글자만 바꾼다.
  $(".trade-list", side).addEventListener("input", (e) => {
    const s = e.target.closest("input[data-i]"); if (!s) return;
    const entry = list[+s.dataset.i], it = byId(entry.id);
    entry.star = starKeys(it)[+s.value];
    const li = s.closest("li");
    $(".star", li).innerHTML = starLabel(entry.star);
    $(".entry-val", li).textContent = gem(entryValue(entry));
    updateTotals();
  });
});
function renderTrade() {
  $$(".side").forEach((side) => {
    const list = trade[side.dataset.side];
    $(".trade-list", side).innerHTML = list.map((e, i) => {
      const it = byId(e.id);
      const slider = it.stars ? `<div class="li-star"><span class="star">${starLabel(e.star)}</span>${starSlider(it, e.star, i)}</div>` : "";
      return `<li><div class="li-top"><span>${esc(it.name)}</span><span><span class="entry-val">${gem(entryValue(e))}</span> <button data-i="${i}" aria-label="×">×</button></span></div>${slider}</li>`;
    }).join("");
  });
  updateTotals();
}
function updateTotals() {
  const sums = {};
  $$(".side").forEach((side) => {
    sums[side.dataset.side] = trade[side.dataset.side].reduce((a, e) => a + entryValue(e), 0);
    $(".sum", side).textContent = gem(sums[side.dataset.side]);
  });
  const v = $("#verdict"), { you, them } = sums, t = T();
  if (!you && !them) { v.className = "verdict"; v.textContent = t.addFirst; return; }
  const diff = them - you, pct = you ? Math.abs(diff) / you : 1;
  if (pct <= 0.05) { v.className = "verdict fair"; v.textContent = t.fair; }
  else if (diff > 0) { v.className = "verdict win"; v.textContent = `${t.win} +${gem(diff)}`; }
  else { v.className = "verdict lose"; v.textContent = `${t.lose} −${gem(-diff)}`; }
}

// 시작
applyLang();
const start = location.hash.slice(1);
if (["values", "compare", "trade"].includes(start)) showView(start);
