/* SVG charts drawn from CHART_DATA. theme "foam" = on dark foam, "paper" = on the inspection sheet. */
const Charts = (() => {
  const palette = {
    foam: { ink: "#efe9dc", sub: "#958d7d", grid: "rgba(239,233,220,0.12)", bar: "#f26a1b", alt: "#7ad9b5", gate: "#f6b23a" },
    paper: { ink: "#1b1c1e", sub: "#6b6558", grid: "rgba(27,28,30,0.12)", bar: "#d4560e", alt: "#2f7d5f", gate: "#a5620a" },
  };
  const fmt = (v, lang, digits) => {
    const s = Number(v).toFixed(digits);
    return lang === "vi" ? s.replace(".", ",") : s;
  };
  const pick = (t, lang) => (t && typeof t === "object" ? t[lang] || t.en : t);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function bars(d, theme, lang) {
    const c = palette[theme];
    const W = 520, rowH = 34, padL = 132, padR = 64, top = 8;
    const H = top + d.rows.length * rowH + 30;
    const isPercent = String(pick(d.unit, "en")).includes("%");
    let max = d.max ?? Math.max(...d.rows.map((r) => r[1]), d.gate ? d.gate.value : 0) * 1.08;
    if (isPercent) max = Math.min(max, 100);
    const min = d.min ?? 0;
    const x = (v) => padL + ((v - min) / (max - min)) * (W - padL - padR);
    const digits = max <= 1 ? 3 : 2;
    const best = d.lowerIsBetter ? Math.min(...d.rows.map((r) => r[1])) : Math.max(...d.rows.map((r) => r[1]));
    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(pick(d.unit, lang))}" font-family="JetBrains Mono, monospace">`;
    for (let i = 0; i <= 4; i++) {
      const gx = padL + (i / 4) * (W - padL - padR);
      s += `<line x1="${gx}" x2="${gx}" y1="${top}" y2="${H - 24}" stroke="${c.grid}"/>`;
      s += `<text x="${gx}" y="${H - 8}" font-size="11" fill="${c.sub}" text-anchor="middle">${fmt(min + (i / 4) * (max - min), lang, max <= 1 ? 2 : 0)}</text>`;
    }
    d.rows.forEach(([label, v], i) => {
      const y = top + i * rowH;
      const isBest = v === best;
      s += `<text x="${padL - 10}" y="${y + 21}" font-size="12" fill="${c.ink}" text-anchor="end">${esc(label)}</text>`;
      s += `<rect x="${padL}" y="${y + 7}" width="${Math.max(2, x(v) - padL)}" height="20" rx="3" fill="${isBest ? c.bar : c.sub}" opacity="${isBest ? 1 : 0.55}"/>`;
      s += `<text x="${x(v) + 6}" y="${y + 21}" font-size="12" font-weight="700" fill="${c.ink}">${fmt(v, lang, digits)}</text>`;
    });
    if (d.gate) {
      const gx = x(d.gate.value);
      s += `<line x1="${gx}" x2="${gx}" y1="${top}" y2="${H - 24}" stroke="${c.gate}" stroke-width="2" stroke-dasharray="5 4"/>`;
      s += `<text x="${gx + 5}" y="${top + 10}" font-size="11" font-weight="700" fill="${c.gate}">${esc(pick(d.gate.label, lang))}</text>`;
    }
    return s + "</svg>";
  }

  function series(d, theme, lang) {
    const c = palette[theme];
    const W = 520, H = 220, padL = 40, padR = 20, top = 16, bottom = 28;
    const ys = d.series, n = ys.length;
    const max = Math.ceil(Math.max(...ys) / 10) * 10;
    const x = (i) => padL + (i / (n - 1)) * (W - padL - padR);
    const y = (v) => top + (1 - v / max) * (H - top - bottom);
    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(pick(d.unit, lang))}" font-family="JetBrains Mono, monospace">`;
    for (let v = 0; v <= max; v += 10) {
      s += `<line x1="${padL}" x2="${W - padR}" y1="${y(v)}" y2="${y(v)}" stroke="${c.grid}"/>`;
      s += `<text x="${padL - 8}" y="${y(v) + 4}" font-size="11" fill="${c.sub}" text-anchor="end">${v}</text>`;
    }
    const path = ys.map((v, i) => `${i ? "H" : "M"}${x(i).toFixed(1)}${i ? `V${y(v).toFixed(1)}` : ` ${y(v).toFixed(1)}`}`).join(" ");
    s += `<path d="${path}" fill="none" stroke="${c.bar}" stroke-width="2.5" stroke-linejoin="round"/>`;
    ys.forEach((v, i) => { s += `<circle cx="${x(i)}" cy="${y(v)}" r="3" fill="${c.bar}"/>`; });
    const last = ys[n - 1];
    s += `<text x="${x(n - 1) - 4}" y="${y(last) - 10}" font-size="12" font-weight="700" fill="${c.ink}" text-anchor="end">${fmt(last, lang, 2)}</text>`;
    s += `<text x="${padL}" y="${H - 8}" font-size="11" fill="${c.sub}">${lang === "vi" ? "lượt nộp 1" : "submission 1"}</text>`;
    s += `<text x="${W - padR}" y="${H - 8}" font-size="11" fill="${c.sub}" text-anchor="end">${n}</text>`;
    return s + "</svg>";
  }

  function render(name, theme, lang) {
    const d = CHART_DATA[name];
    if (!d) return "";
    return d.series ? series(d, theme, lang) : bars(d, theme, lang);
  }
  function caption(name, lang) {
    const d = CHART_DATA[name];
    const unit = pick(d.unit, lang);
    const note = d.note ? ` · ${pick(d.note, lang)}` : "";
    return `${unit}${note}`;
  }
  return { render, caption };
})();
