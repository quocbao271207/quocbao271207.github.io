/* Field kit behaviour: render trays from KIT, language latch, one-axis 3D scroll, media, inspection sheets. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const langParam = new URLSearchParams(location.search).get("lang");
  let lang = (langParam || store.get("lang")) === "vi" ? "vi" : "en";
  const t = (k) => I18N[lang][k] ?? I18N.en[k] ?? k;
  const L = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] ?? v.en : v);

  const ICON = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M8 7h9v9"/></svg>',
  };

  const all = () => [
    ...KIT.projects.map((p) => ({ ...p, kind: "project" })),
    ...KIT.research.map((p) => ({ ...p, kind: "research" })),
    ...KIT.awards.map((p) => ({ ...p, kind: "award", status: "award" })),
  ];
  const byTag = (tag) => all().find((i) => i.tag === tag);

  const statusLabel = (s) => ({ verified: t("statusVerified"), prototype: t("statusPrototype"), "in-progress": t("statusWip"), award: t("statusAward") }[s]);
  const statusText = (item) => (item.statusNote ? L(item.statusNote) : statusLabel(item.status));
  const led = (s) => `<span class="led${s === "verified" || s === "award" ? "" : " led--wip"}" aria-hidden="true"></span>`;
  const arrow = ICON.arrow.replace("<svg", '<svg aria-hidden="true"');

  /* ---------- Pocket markup ---------- */

  function videoEl(src, poster) {
    return `<video class="autoplay" src="${src}" poster="${poster || ""}" muted loop playsinline preload="none" aria-hidden="true"></video>`;
  }

  function coverMarkup(item) {
    const c = item.cover || {};
    if (c.video) {
      const clinical = item.key === "onevoice";
      const note = clinical ? L(item.statusNote) : t("playing");
      const media = `<div class="pocket__media">${videoEl(c.video, c.poster)}<span class="play-note${clinical ? " play-note--clinical" : ""}"><i></i>${esc(note)}</span></div>`;
      return item.size === "phone" ? `<div class="phone">${media}</div>` : `<div class="device">${media}</div>`;
    }
    if (c.img) {
      const fit = c.ar ? ` pocket__media--fit" style="aspect-ratio: ${c.ar}` : "";
      return `<div class="pocket__media${fit}"><img src="${c.img}" alt="${esc(L(item.media?.[0]?.cap) || L(item.title))}" loading="lazy"></div>`;
    }
    if (c.chart) return `<div class="pocket__chart">${Charts.render(c.chart, "foam", lang)}<span class="chart-cap">${esc(Charts.caption(c.chart, lang))}</span></div>`;
    if (c.spec) {
      return `<dl class="spec">${item.stack.slice(0, 2).map((s, i) => `<dt>${i ? "Tracking" : "Model"}</dt><dd>${esc(s)}</dd>`).join("")}<dt>Target</dt><dd>P ≥ 90% · R ≥ 88% · ≥ 30 FPS</dd><dt>${esc(t("honest"))}</dt><dd>${esc(statusText(item))}</dd></dl>`;
    }
    return "";
  }

  const tagFoot = (serial, status, label) =>
    `<span class="tag__foot"><span class="status">${led(status)}${esc(label)}</span><span class="tag__id"><span class="tag__serial">${serial}</span>${arrow}</span></span>`;

  function pocket(item, extraStyle = "") {
    const title = L(item.title);
    const sizeClass = extraStyle ? "" : ` size-${item.size}`;
    return `<a class="pocket${sizeClass}${item.size === "empty" ? " pocket--empty" : ""}${item.size === "phone" ? " pocket--phone" : ""}" href="#${item.tag}" aria-label="${esc(t("inspect"))}: ${esc(title)}"${extraStyle}>
      <div class="pocket__item">
        ${coverMarkup(item)}
        <div class="tag">
          <span class="tag__name">${esc(title)}</span>
          ${extraStyle ? "" : `<span class="tag__line">${esc(L(item.line))}</span>`}
          ${tagFoot(item.tag, item.status, extraStyle && item.key !== "onevoice" ? statusLabel(item.status) : statusText(item))}
        </div>
      </div>
    </a>`;
  }

  function awardPocket(a, big) {
    return `<a class="pocket award size-${big ? "award-lg" : "award"}" href="#${a.tag}" aria-label="${esc(t("inspect"))}: ${esc(L(a.title))}">
      <div class="pocket__item">
        <div class="pocket__media"><img src="${a.cover}" alt="${esc(L(a.media[0].cap))}" loading="lazy" style="object-position: ${a.focus || "50% 50%"}"></div>
        <div class="tag">
          <span class="tag__rank">${esc(L(a.rank))}</span>
          <span class="tag__name">${esc(L(a.title))}</span>
          ${tagFoot(a.tag, "award", L(a.by))}
        </div>
      </div>
    </a>`;
  }

  function honoursRoll() {
    const withImg = KIT.honours.find((h) => h.img);
    return `<div class="roll size-roll">
      <div>
        <h3>${esc(t("honours"))}</h3>
        <ul>${KIT.honours.map((h) => `<li>${ICON.check}<span>${esc(L(h))}</span></li>`).join("")}</ul>
      </div>
      ${withImg ? `<img src="${withImg.img}" alt="${esc(L(withImg))}" loading="lazy">` : ""}
    </div>`;
  }

  /* ---------- Render ---------- */

  function renderBase() {
    const ov = KIT.projects[0], vg = KIT.projects[1];
    const medal = (a) => `<a class="medal award" href="#${a.tag}" aria-label="${esc(t("inspect"))}: ${esc(L(a.title))}">
        <span class="medal__disc"><img src="${a.cover}" alt="${esc(L(a.media[0].cap))}" style="object-position: ${a.focus || "50% 50%"}"></span>
        <span class="tag"><span class="tag__rank">${esc(L(a.short || a.rank))}</span>${tagFoot(a.tag, "award", a.tag === "TQB-301" ? "IQC 2026" : "Qualcomm 2026")}</span>
      </a>`;
    $("#base").innerHTML =
      pocket(ov, ' style="grid-row: span 2"') +
      pocket(vg, ' style="grid-row: span 2"') +
      medal(KIT.awards[0]) + medal(KIT.awards[1]);
  }

  function renderTrays() {
    $("#projects-pockets").innerHTML = KIT.projects.map((p) => pocket(p)).join("");
    $("#research-pockets").innerHTML = KIT.research.map((p) => pocket(p)).join("");
    $("#awards-pockets").innerHTML =
      KIT.awards.map((a, i) => awardPocket(a, i < 2)).join("") + honoursRoll();
    $("#log-entries").innerHTML = KIT.log.map((e) => `
      <div class="log__entry">
        <span class="tape"><b>${esc(L(e.when))}</b>${esc(e.org)}</span>
        <div class="log__what"><h3>${esc(L(e.role))}</h3><p>${esc(L(e.what))}</p></div>
      </div>`).join("");
  }

  function applyStatic() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$(".latch button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    $(".latch").dataset.lang = lang;
  }

  function renderAll() {
    applyStatic();
    renderBase();
    renderTrays();
    observeVideos();
    onScroll();
  }

  /* ---------- Language latch ---------- */

  $$(".latch button").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.lang === lang) return;
    lang = b.dataset.lang;
    store.set("lang", lang);
    renderAll();
    if ($("#sheet").open && currentTag) openSheet(currentTag, true);
  }));

  /* ---------- Menu + current tray ---------- */

  const rail = $(".rail");
  const menuBtn = $(".rail__menu");
  menuBtn.addEventListener("click", () => {
    const open = rail.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  $$(".rail__tabs a").forEach((a) => a.addEventListener("click", () => { rail.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", "false"); }));

  const tabs = new Map($$(".rail__tabs a").map((a) => [a.getAttribute("href").slice(1), a]));
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      tabs.forEach((a) => a.removeAttribute("aria-current"));
      tabs.get(e.target.id)?.setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  ["kit", "projects", "research", "awards", "log", "contact"].forEach((id) => sectionObs.observe(document.getElementById(id)));

  /* ---------- One scroll axis drives the lid and every tray ---------- */

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const shellEl = $(".case__shell");
  const trays = $$(".tray__body");
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      if (reduceMotion) return;
      const vh = innerHeight;
      const open = clamp(scrollY / (vh * 0.75));
      shellEl.style.setProperty("--open", open.toFixed(3));
      const tiltMax = innerWidth < 760 ? 10 : 24;
      trays.forEach((tray) => {
        const top = tray.getBoundingClientRect().top;
        const lift = clamp((vh - top) / (vh * 0.85));
        const eased = 1 - Math.pow(1 - lift, 3);
        tray.style.setProperty("--lift", eased.toFixed(3));
        tray.style.setProperty("--tilt", ((1 - eased) * tiltMax).toFixed(2));
        $$(".pocket", tray).forEach((p) => p.style.setProperty("--lift", eased.toFixed(3)));
      });
    });
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);

  /* ---------- Videos play only while visible ---------- */

  let videoObs;
  function observeVideos() {
    videoObs?.disconnect();
    if (reduceMotion) return;
    videoObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const v = e.target;
        if (e.isIntersecting) { v.preload = "auto"; v.play().catch(() => {}); }
        else v.pause();
      });
    }, { threshold: 0.35 });
    $$("video.autoplay").forEach((v) => videoObs.observe(v));
  }

  /* ---------- Inspection sheet ---------- */

  const sheet = $("#sheet");
  let currentTag = null;
  let slide = 0;

  function viewerMarkup(media) {
    if (!media.length) return "";
    return `<div class="viewer">
      <div class="viewer__stage"></div>
      <div class="viewer__cap"></div>
      ${media.length > 1 ? `<div class="viewer__thumbs">${media.map((m, i) => `<button type="button" data-i="${i}" class="${m.video ? "is-video" : ""}" aria-label="${esc(L(m.cap))}"><img src="${m.poster || m.img}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}
    </div>`;
  }
  function showSlide(media, i) {
    slide = i;
    const m = media[i];
    $(".viewer__stage", sheet).innerHTML = m.video
      ? `<video src="${m.video}" poster="${m.poster || ""}" controls autoplay muted loop playsinline></video>`
      : `<img src="${m.img}" alt="${esc(L(m.cap))}">`;
    $(".viewer__cap", sheet).textContent = L(m.cap);
    $$(".viewer__thumbs button", sheet).forEach((b, k) => b.setAttribute("aria-current", String(k === i)));
  }

  function openSheet(tag, keepSlide = false) {
    const item = byTag(tag);
    if (!item) return;
    currentTag = tag;
    const title = L(item.title);
    const media = item.media || [];
    const status = item.status;
    const isAward = item.kind === "award";
    sheet.innerHTML = `<div class="sheet__scroll">
      <div class="sheet__clip"><span>${esc(t("inspect"))} · ${item.tag}</span><button class="sheet__close" type="button">${esc(t("close"))} ✕</button></div>
      <div class="sheet__body">
        <div class="sheet__head">
          <h2 id="sheet-title">${esc(isAward ? L(item.rank) : title)}</h2>
          <p class="sheet__meta">${esc(isAward ? `${L(item.title)} — ${L(item.by)}` : L(item.meta))}</p>
          <span class="stamp${status === "verified" || status === "award" ? "" : " stamp--wip"}">${esc(isAward ? statusLabel(status) : statusText(item))}</span>
        </div>
        ${viewerMarkup(media)}
        ${isAward ? "" : `<div class="sheet__grid">
          <div>
            <h3>${esc(t("whatItIs"))}</h3>
            <p>${esc(L(item.summary))}</p>
            <h3>${esc(t("whatIDid"))}</h3>
            <ul class="checks">${(L(item.did) || []).map((d) => `<li>${ICON.check}<span>${esc(d)}</span></li>`).join("")}</ul>
            ${item.honest ? `<h3>${esc(t("honest"))}</h3><p class="honest">${esc(L(item.honest))}</p>` : ""}
          </div>
          <div>
            ${item.chart ? `<h3>${esc(t("evidence"))}</h3><div class="sheet__chart">${Charts.render(item.chart, "paper", lang)}<p class="chart-cap" style="color:#6b6558;margin:6px 0 0">${esc(Charts.caption(item.chart, lang))}</p></div>` : ""}
            <h3>${esc(t("stack"))}</h3>
            <div class="chips">${(item.stack || []).map((s) => `<span>${esc(s)}</span>`).join("")}</div>
            ${item.links && item.links.length ? `<h3>${esc(t("links"))}</h3><div class="sheet__links">${item.links.map((l) => `<a class="btn btn--latch" href="${l.href}" target="_blank" rel="noopener">${esc(l.label)} ${ICON.arrow}</a>`).join("")}</div>` : ""}
          </div>
        </div>`}
      </div>
    </div>`;
    if (media.length) showSlide(media, keepSlide ? Math.min(slide, media.length - 1) : 0);
    $(".sheet__close", sheet).addEventListener("click", () => sheet.close());
    $$(".viewer__thumbs button", sheet).forEach((b) => b.addEventListener("click", () => showSlide(media, +b.dataset.i)));
    if (!sheet.open) sheet.showModal();
    $(".sheet__scroll", sheet).scrollTop = keepSlide ? $(".sheet__scroll", sheet).scrollTop : 0;
    if (location.hash !== `#${tag}`) history.pushState(null, "", `#${tag}`);
  }

  sheet.addEventListener("close", () => {
    currentTag = null;
    sheet.innerHTML = "";
    if (/^#TQB-\d+$/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
  });
  sheet.addEventListener("click", (e) => { if (e.target === sheet) sheet.close(); });
  addEventListener("keydown", (e) => {
    if (!sheet.open || !currentTag) return;
    const media = byTag(currentTag).media || [];
    if (media.length < 2) return;
    if (e.key === "ArrowRight") showSlide(media, (slide + 1) % media.length);
    if (e.key === "ArrowLeft") showSlide(media, (slide - 1 + media.length) % media.length);
  });

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#TQB-"]');
    if (!a) return;
    e.preventDefault();
    openSheet(a.getAttribute("href").slice(1));
  });
  const fromHash = () => {
    const m = location.hash.match(/^#(TQB-\d+)$/);
    if (m) openSheet(m[1]);
    else if (sheet.open) sheet.close();
  };
  addEventListener("popstate", fromHash);

  /* ---------- Contact label ---------- */

  const toast = $(".toast");
  $$("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch (e) { location.href = `mailto:${b.dataset.copy}`; return; }
    toast.textContent = t("copied");
    toast.classList.add("is-on");
    setTimeout(() => toast.classList.remove("is-on"), 2000);
  }));

  // Code-39-style bars derived from the address text (decorative label print).
  (function barcode() {
    const svg = $("#barcode");
    const src = "BAO.TRINH271207@HCMUT.EDU.VN";
    let x = 0, bars = "";
    for (const ch of src) {
      const code = ch.charCodeAt(0);
      for (let k = 0; k < 5; k++) {
        const w = (code >> k) & 1 ? 3 : 1.4;
        if (k % 2 === 0) bars += `<rect x="${x}" y="0" width="${w}" height="46" fill="currentColor"/>`;
        x += w + 1.6;
      }
      x += 2;
    }
    svg.setAttribute("viewBox", `0 0 ${x} 46`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.innerHTML = bars;
  })();

  $("#year").textContent = new Date().getFullYear();

  renderAll();
  fromHash();
})();
