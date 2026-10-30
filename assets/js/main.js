/* Portfolio interactions. Content lives in data.js (PROJECTS, CATEGORIES). */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const storage = {
    get(key) {
      try { return localStorage.getItem(key); } catch (e) { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ }
    },
  };

  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Theme ---------- */

  const root = document.documentElement;
  const savedTheme = storage.get("theme");
  if (savedTheme) root.dataset.theme = savedTheme;
  else if (window.matchMedia("(prefers-color-scheme: light)").matches) root.dataset.theme = "light";

  $("#theme-toggle").addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    storage.set("theme", next);
  });

  /* ---------- Navigation ---------- */

  const nav = $(".nav");
  const menuBtn = $(".nav__menu-btn");
  const progress = $(".scroll-progress");
  const backToTop = $(".back-to-top");

  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  $$(".nav__links a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    })
  );

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 10);
    backToTop.classList.toggle("is-visible", y > 700);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" }));

  const navLinks = new Map($$(".nav__links a").map((a) => [a.getAttribute("href").slice(1), a]));
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.remove("is-active"));
        const link = navLinks.get(entry.target.id);
        if (link) link.classList.add("is-active");
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  $$("main section[id]").forEach((s) => sectionObserver.observe(s));

  /* ---------- Typed roles ---------- */

  const typed = $(".typed");
  const roles = JSON.parse(typed.dataset.roles);
  if (prefersReducedMotion) {
    typed.textContent = roles[0];
  } else {
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    const tick = () => {
      const word = roles[roleIdx];
      charIdx += deleting ? -1 : 1;
      typed.textContent = word.slice(0, charIdx);
      let delay = deleting ? 35 : 70;
      if (!deleting && charIdx === word.length) {
        deleting = true;
        delay = 1800;
      } else if (deleting && charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        delay = 350;
      }
      setTimeout(tick, delay);
    };
    tick();
  }

  /* ---------- Projects ---------- */

  const grid = $("#projects-grid");
  const filters = $("#project-filters");
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  grid.innerHTML = PROJECTS.map(
    (p, i) => `
    <button class="card reveal${p.featured ? " card--featured" : ""}" data-index="${i}" data-cats="${p.categories.join(" ")}"
      style="--delay:${(i % 3) * 0.08}s" aria-label="Open details: ${escapeHtml(p.title)}">
      <div class="card__media">
        <img src="${p.images[0].src}" alt="${escapeHtml(p.images[0].alt)}" loading="lazy" width="1200" height="750" />
        ${p.badge ? `<span class="card__badge">${escapeHtml(p.badge)}</span>` : ""}
      </div>
      <div class="card__body">
        <span class="card__meta">${escapeHtml(p.meta)}</span>
        <h3 class="card__title">${escapeHtml(p.title)}</h3>
        <p class="card__desc">${escapeHtml(p.short)}</p>
        <div class="card__tags">${p.tags.slice(0, 4).map((t) => `<span class="chip">${escapeHtml(t)}</span>`).join("")}</div>
        <span class="card__more">View case study ${arrow}</span>
      </div>
    </button>`
  ).join("");

  filters.innerHTML = CATEGORIES.map((c, i) => {
    const count = c.id === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.categories.includes(c.id)).length;
    return `<button class="filter-btn${i === 0 ? " is-active" : ""}" data-filter="${c.id}" aria-pressed="${i === 0}">
      ${escapeHtml(c.label)}<span class="count">${count}</span></button>`;
  }).join("");

  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    const f = btn.dataset.filter;
    $$(".filter-btn", filters).forEach((b) => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-pressed", String(b === btn));
    });
    $$(".card", grid).forEach((card) => {
      const show = f === "all" || card.dataset.cats.split(" ").includes(f);
      card.classList.toggle("is-hidden", !show);
      card.classList.toggle("card--featured", show && f === "all" && PROJECTS[card.dataset.index].featured);
      if (show) {
        card.classList.add("is-visible");
        card.animate?.([{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], {
          duration: prefersReducedMotion ? 0 : 420,
          easing: "cubic-bezier(.2,.7,.2,1)",
        });
      }
    });
  });

  // Cursor-following glow and subtle tilt
  if (!prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
    grid.addEventListener("pointermove", (e) => {
      const card = e.target.closest(".card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
      const rx = ((y / r.height) - 0.5) * -4;
      const ry = ((x / r.width) - 0.5) * 4;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    grid.addEventListener("pointerout", (e) => {
      const card = e.target.closest(".card");
      if (card && !card.contains(e.relatedTarget)) card.style.transform = "";
    });
  }

  /* ---------- Modal + gallery ---------- */

  const modal = $("#project-modal");
  const dialog = $(".modal__dialog", modal);
  let lastFocus = null;
  let slide = 0;
  let slideCount = 0;

  const setSlide = (n) => {
    slide = (n + slideCount) % slideCount;
    $(".gallery__track", modal).style.transform = `translateX(-${slide * 100}%)`;
    $$(".gallery__dots button", modal).forEach((d, i) => d.classList.toggle("is-active", i === slide));
    const cap = $(".gallery__caption", modal);
    cap.textContent = $$(".gallery__slide img", modal)[slide].alt;
  };

  const linkIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M8 7h9v9"/></svg>';

  const openModal = (p) => {
    lastFocus = document.activeElement;
    slideCount = p.images.length;
    const multi = slideCount > 1;
    dialog.innerHTML = `
      <button class="icon-btn modal__close" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18"/></svg>
      </button>
      <div class="gallery">
        <div class="gallery__track">
          ${p.images.map((img) => `<div class="gallery__slide"><img src="${img.src}" alt="${escapeHtml(img.alt)}" loading="lazy" /></div>`).join("")}
        </div>
        <div class="gallery__caption"></div>
        ${multi ? `
          <button class="icon-btn gallery__nav gallery__nav--prev" aria-label="Previous image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg></button>
          <button class="icon-btn gallery__nav gallery__nav--next" aria-label="Next image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></button>
          <div class="gallery__dots">${p.images.map((_, i) => `<button aria-label="Image ${i + 1}"></button>`).join("")}</div>` : ""}
      </div>
      <div class="modal__content">
        <span class="card__meta">${escapeHtml(p.meta)}</span>
        <h3 id="modal-title">${escapeHtml(p.title)}</h3>
        <p class="modal__summary">${escapeHtml(p.summary)}</p>
        <div class="modal__cols">
          <div>
            <h4>Highlights</h4>
            <ul class="highlights">${p.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}</ul>
          </div>
          <div>
            <h4>At a glance</h4>
            <dl class="facts">
              ${p.facts.map(([k, v]) => `<div><dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd></div>`).join("")}
              <div><dt>Stack</dt><dd class="modal__tags">${p.tags.map((t) => `<span class="chip">${escapeHtml(t)}</span>`).join("")}</dd></div>
            </dl>
          </div>
        </div>
        ${p.links && p.links.length ? `<div class="modal__links">${p.links.map((l, i) =>
          `<a class="btn ${i === 0 ? "btn--primary" : "btn--ghost"}" href="${l.href}" target="_blank" rel="noopener">${escapeHtml(l.label)} ${linkIcon}</a>`).join("")}</div>` : ""}
      </div>`;
    setSlide(0);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    dialog.scrollTop = 0;
    $(".modal__close", dialog).focus();
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) openModal(PROJECTS[card.dataset.index]);
  });

  modal.addEventListener("click", (e) => {
    if (e.target.closest(".modal__close") || e.target.classList.contains("modal__backdrop")) closeModal();
    else if (e.target.closest(".gallery__nav--prev")) setSlide(slide - 1);
    else if (e.target.closest(".gallery__nav--next")) setSlide(slide + 1);
    else if (e.target.closest(".gallery__dots button")) setSlide($$(".gallery__dots button", modal).indexOf(e.target.closest("button")));
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("is-open")) return;
    if (e.key === "Escape") closeModal();
    else if (e.key === "ArrowLeft" && slideCount > 1) setSlide(slide - 1);
    else if (e.key === "ArrowRight" && slideCount > 1) setSlide(slide + 1);
    else if (e.key === "Tab") {
      const focusables = $$("button, a[href]", dialog);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  let touchX = null;
  modal.addEventListener("touchstart", (e) => {
    if (e.target.closest(".gallery")) touchX = e.touches[0].clientX;
  }, { passive: true });
  modal.addEventListener("touchend", (e) => {
    if (touchX === null || slideCount < 2) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) setSlide(slide + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  /* ---------- Reveal + counters ---------- */

  const animateCount = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    if (prefersReducedMotion) { el.textContent = target + suffix; return; }
    const start = performance.now();
    const dur = 1400;
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        $$("[data-count]", entry.target).forEach(animateCount);
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Copy email ---------- */

  const toast = $(".toast");
  let toastTimer;
  $$("[data-copy]").forEach((el) =>
    el.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(el.dataset.copy);
        toast.textContent = "Email copied to clipboard";
      } catch (err) {
        window.location.href = `mailto:${el.dataset.copy}`;
        return;
      }
      toast.classList.add("is-visible");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
    })
  );

  $("#year").textContent = new Date().getFullYear();

  /* ---------- Background: neural-network particles ---------- */

  const canvas = $("#bg-canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx || prefersReducedMotion) return;

  let w, h, dpr, nodes;
  const mouse = { x: -9999, y: -9999 };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = window.innerWidth * dpr;
    h = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    const count = Math.round(Math.min(90, (window.innerWidth * window.innerHeight) / 18000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25 * dpr,
      vy: (Math.random() - 0.5) * 0.25 * dpr,
      r: (Math.random() * 1.4 + 0.6) * dpr,
    }));
  };

  const accentRGB = () => (root.dataset.theme === "light" ? "13,148,136" : "45,212,191");
  const linkDist = () => 140 * dpr;

  let running = true;
  const draw = () => {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    const rgb = accentRGB();
    const maxD = linkDist();
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
      const dx = n.x - mouse.x;
      const dy = n.y - mouse.y;
      const md = Math.hypot(dx, dy);
      if (md < 160 * dpr) {
        n.x += (dx / md) * 0.6;
        n.y += (dy / md) * 0.6;
      }
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < maxD) {
          ctx.strokeStyle = `rgba(${rgb},${(1 - d / maxD) * 0.35})`;
          ctx.lineWidth = dpr * 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = `rgba(${rgb},0.8)`;
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  };

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (e) => {
    mouse.x = e.clientX * dpr;
    mouse.y = e.clientY * dpr;
  }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(draw);
  });
  resize();
  draw();
})();
