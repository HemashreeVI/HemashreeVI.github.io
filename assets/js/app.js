(function () {
  "use strict";
  var S = window.SITE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    sget: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };
  var canHover = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  var uid = 0;

  /* ================================================================ poster art */
  // Every poster is generated SVG: gradient, glow, a motif per project, and the title.
  function motif(kind, c, w, h) {
    var cx = w * 0.68, cy = h * 0.46, s = "";
    switch (kind) {
      case "walker":
        s += '<g stroke="' + c + '" stroke-width="4" fill="none" stroke-linecap="round" opacity=".9">' +
          '<path d="M' + (cx - 40) + ' ' + (cy + 55) + 'V' + (cy - 40) + 'H' + (cx + 40) + 'V' + (cy + 55) + '"/>' +
          '<path d="M' + (cx - 40) + ' ' + (cy) + 'H' + (cx + 40) + '"/></g>';
        var pts = [];
        for (var i = 0; i <= 60; i++) pts.push((cx - 110 + i * 3.7).toFixed(1) + "," + (cy + 70 + Math.sin(i / 4) * (i > 44 ? 16 : 7)).toFixed(1));
        s += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2"/>';
        s += '<circle cx="' + (cx + 70) + '" cy="' + (cy - 46) + '" r="6" fill="' + c + '"><animate attributeName="r" values="6;10;6" dur="1.6s" repeatCount="indefinite"/></circle>';
        break;
      case "rover":
        for (var gx = 0; gx < 7; gx++) for (var gy = 0; gy < 4; gy++) {
          var hz = (gx === 2 && gy === 1) || (gx === 5 && gy === 2) || (gx === 4 && gy === 0);
          s += '<rect x="' + (cx - 100 + gx * 30) + '" y="' + (cy - 50 + gy * 28) + '" width="26" height="24" rx="3" fill="' + (hz ? "#E50914" : c) + '" opacity="' + (hz ? .75 : .12) + '"/>';
        }
        s += '<g fill="none" stroke="' + c + '" stroke-opacity=".7"><path d="M' + (cx - 30) + ' ' + (cy + 40) + 'a70 70 0 0 1 140 0"/><path d="M' + (cx) + ' ' + (cy + 40) + 'a40 40 0 0 1 80 0"/></g>';
        s += '<circle cx="' + (cx + 40) + '" cy="' + (cy + 40) + '" r="9" fill="#fff"/>';
        break;
      case "xray":
        for (var t = 0; t < 7; t++) {
          s += '<rect x="' + (cx - 105 + t * 30) + '" y="' + (cy - 46) + '" width="24" height="42" rx="9" fill="#fff" fill-opacity=".16" stroke="#fff" stroke-opacity=".35"/>';
          s += '<rect x="' + (cx - 105 + t * 30) + '" y="' + (cy + 6) + '" width="24" height="42" rx="9" fill="#fff" fill-opacity=".12" stroke="#fff" stroke-opacity=".3"/>';
        }
        s += '<rect x="' + (cx - 48) + '" y="' + (cy - 52) + '" width="62" height="54" fill="none" stroke="#E50914" stroke-width="2.5"/>';
        s += '<rect x="' + (cx + 40) + '" y="' + (cy + 2) + '" width="32" height="54" fill="none" stroke="' + c + '" stroke-width="2.5"/>';
        s += '<rect x="' + (cx - 112) + '" y="' + (cy - 60) + '" width="224" height="3" fill="' + c + '" opacity=".8"><animate attributeName="y" values="' + (cy - 60) + ';' + (cy + 56) + ';' + (cy - 60) + '" dur="3.5s" repeatCount="indefinite"/></rect>';
        break;
      case "graph":
        var n = [[-80, -30], [0, -50], [70, -20], [-40, 30], [40, 40], [100, 45]];
        [[0, 1], [1, 2], [0, 3], [3, 4], [1, 4], [2, 5], [4, 5]].forEach(function (e) {
          s += '<path d="M' + (cx + n[e[0]][0]) + ' ' + (cy + n[e[0]][1]) + 'L' + (cx + n[e[1]][0]) + ' ' + (cy + n[e[1]][1]) + '" stroke="' + c + '" stroke-opacity=".5" stroke-width="2"/>';
        });
        n.forEach(function (p, i) {
          var bad = i === 4;
          s += '<circle cx="' + (cx + p[0]) + '" cy="' + (cy + p[1]) + '" r="' + (bad ? 11 : 8) + '" fill="#141414" stroke="' + (bad ? "#E50914" : c) + '" stroke-width="3"/>';
          if (bad) s += '<circle cx="' + (cx + p[0]) + '" cy="' + (cy + p[1]) + '" r="11" fill="none" stroke="#E50914"><animate attributeName="r" values="11;30" dur="1.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1.6s" repeatCount="indefinite"/></circle>';
        });
        break;
      case "stream":
        s += '<rect x="' + (cx - 10) + '" y="' + (cy - 30) + '" width="60" height="60" rx="10" fill="#141414" stroke="' + c + '" stroke-width="3"/>';
        s += '<text x="' + (cx + 20) + '" y="' + (cy + 6) + '" font-family="Inter,sans-serif" font-weight="800" font-size="16" fill="#fff" text-anchor="middle">LLM</text>';
        for (var k = 0; k < 3; k++) {
          s += '<rect width="34" height="18" rx="4" fill="' + c + '" opacity=".85"><animateMotion dur="2.4s" begin="' + (k * 0.8) + 's" repeatCount="indefinite" path="M' + (cx - 120) + ' ' + (cy - 9) + 'H' + (cx - 30) + '"/></rect>';
          s += '<path d="M' + (cx + 50) + ' ' + cy + 'L' + (cx + 80) + ' ' + (cy - 40 + k * 40) + '" stroke="' + c + '" stroke-opacity=".6" stroke-width="2"/>';
          s += '<rect x="' + (cx + 80) + '" y="' + (cy - 49 + k * 40) + '" width="40" height="18" rx="9" fill="none" stroke="' + ["#E50914", c, "#46D369"][k] + '" stroke-width="2"/>';
        }
        break;
      case "fresh":
        [["#46D369", .85], [c, .55], ["#E50914", .2]].forEach(function (f, i) {
          var y = cy - 44 + i * 38;
          s += '<circle cx="' + (cx - 70) + '" cy="' + y + '" r="14" fill="' + f[0] + '" fill-opacity=".35" stroke="' + f[0] + '" stroke-width="2"/>';
          s += '<rect x="' + (cx - 46) + '" y="' + (y - 4) + '" width="150" height="8" rx="4" fill="#fff" fill-opacity=".12"/>';
          s += '<rect x="' + (cx - 46) + '" y="' + (y - 4) + '" width="' + (150 * f[1]) + '" height="8" rx="4" fill="' + f[0] + '"/>';
        });
        break;
      case "shield":
        s += '<path d="M' + cx + ' ' + (cy - 60) + 'l55 20v35c0 35-25 58-55 70c-30-12-55-35-55-70v-35z" fill="' + c + '" fill-opacity=".15" stroke="' + c + '" stroke-width="3"/>';
        s += '<rect x="' + (cx - 16) + '" y="' + (cy - 4) + '" width="32" height="26" rx="4" fill="' + c + '"/><path d="M' + (cx - 10) + ' ' + (cy - 4) + 'v-10a10 10 0 0 1 20 0v10" fill="none" stroke="' + c + '" stroke-width="4"/>';
        break;
      case "voice":
        for (var b = 0; b < 15; b++) {
          var bh = 12 + Math.abs(Math.sin(b * 1.3)) * 70;
          s += '<rect x="' + (cx - 105 + b * 15) + '" y="' + (cy - bh / 2) + '" width="8" height="' + bh.toFixed(0) + '" rx="4" fill="' + c + '" opacity=".85"><animate attributeName="height" values="' + bh.toFixed(0) + ';' + (bh * 0.4).toFixed(0) + ';' + bh.toFixed(0) + '" dur="' + (0.8 + (b % 4) * 0.2) + 's" repeatCount="indefinite"/></rect>';
        }
        break;
      default:
        s += '<circle cx="' + cx + '" cy="' + cy + '" r="70" fill="none" stroke="' + c + '" stroke-opacity=".5" stroke-width="2"/>';
        s += '<circle cx="' + cx + '" cy="' + cy + '" r="40" fill="' + c + '" fill-opacity=".18"/>';
    }
    return s;
  }

  function poster(o, opts) {
    opts = opts || {};
    var w = opts.tall ? 200 : 320, h = opts.tall ? 300 : 180, id = "p" + (++uid);
    var c0 = (o.color && o.color[0]) || "#2a2a2a", c1 = (o.color && o.color[1]) || "#E50914";
    var title = opts.noTitle ? "" : (o.title || "");
    var fs = opts.tall ? (title.length > 12 ? 30 : 40) : (title.length > 16 ? 30 : title.length > 11 ? 36 : 44);
    var photo = opts.photo || (opts.tall ? (o.imageTall || o.image) : o.image);
    var art = photo
      ? '<image href="' + esc(photo) + '" width="' + w + '" height="' + h + '" preserveAspectRatio="xMidYMid slice"/>'
      : opts.tall
        ? '<g transform="translate(' + (-w * 0.6) + ' ' + (-20) + ') scale(1.05)">' + motif(o.art, c1, 320, 180) + '</g>'
        : motif(o.art, c1, w, h);
    var lines = opts.tall ? wrapWords(title, 11) : [title];
    var tY = h - 18 - (lines.length - 1) * fs * 0.92;
    var text = lines.map(function (ln, i) {
      return '<text x="16" y="' + (tY + i * fs * 0.92).toFixed(0) + '" font-family="Bebas Neue,Impact,sans-serif" font-size="' + fs + '" fill="#fff" letter-spacing="1">' + esc(ln) + '</text>';
    }).join("");
    return '<svg class="art" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<defs><linearGradient id="' + id + 'g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c0 + '"/><stop offset="1" stop-color="#0b0b0b"/></linearGradient>' +
      '<radialGradient id="' + id + 'r" cx="70%" cy="40%" r="60%"><stop offset="0" stop-color="' + c1 + '" stop-opacity=".45"/><stop offset="1" stop-color="' + c1 + '" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + id + 'b" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".85"/></linearGradient></defs>' +
      '<rect width="' + w + '" height="' + h + '" fill="url(#' + id + 'g)"/><rect width="' + w + '" height="' + h + '" fill="url(#' + id + 'r)"/>' +
      art + '<rect width="' + w + '" height="' + h + '" fill="url(#' + id + 'b)"/>' +
      '<text x="12" y="28" font-family="Bebas Neue,Impact,sans-serif" font-size="26" fill="#E50914">H</text>' +
      text + '</svg>';
  }

  function wrapWords(s, n) {
    var out = [], cur = "";
    s.split(" ").forEach(function (w) {
      if (cur && (cur + " " + w).length > n) { out.push(cur); cur = w; } else cur = cur ? cur + " " + w : w;
    });
    if (cur) out.push(cur);
    return out;
  }

  function bigNumber(n) {
    return '<svg viewBox="0 0 120 180" preserveAspectRatio="xMaxYMid meet" aria-hidden="true"><text x="118" y="168" text-anchor="end" font-family="Bebas Neue,Impact,sans-serif" font-size="' + (n === 10 ? 170 : 210) + '" fill="#141414" stroke="#595959" stroke-width="4" letter-spacing="' + (n === 10 ? -18 : 0) + '">' + n + '</text></svg>';
  }

  function avatar(p) {
    if (p.photo) return '<div class="av-art"><img src="' + esc(p.photo) + '" alt=""></div>';
    return '<div class="av-art" style="background:' + p.color + '"><svg viewBox="0 0 100 100" aria-hidden="true">' +
      '<circle cx="34" cy="38" r="6" fill="#fff"/><circle cx="66" cy="38" r="6" fill="#fff"/>' +
      '<path d="M26 60c8 14 40 14 48 0" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>' +
      '<text x="88" y="92" text-anchor="end" font-family="Inter,sans-serif" font-weight="800" font-size="16" fill="rgba(0,0,0,.45)">' + esc(p.glyph || "") + '</text></svg></div>';
  }

  /* ================================================================ intro + gate */
  var profile = null;

  function start() {
    var params = new URLSearchParams(location.search);
    var fromUrl = params.get("profile");
    var pick = S.profiles.filter(function (p) { return p.id === fromUrl; })[0];
    var intro = $("#intro");
    var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    var seen = store.sget("introSeen");

    function afterIntro() {
      intro.classList.add("out");
      setTimeout(function () { intro.hidden = true; }, 450);
      store.sset("introSeen", "1");
      if (pick) choose(pick, false); else showGate();
    }
    if (seen || reduce) { intro.hidden = true; if (pick) choose(pick, false); else showGate(); return; }
    var done = false;
    var finish = function () { if (!done) { done = true; afterIntro(); } };
    setTimeout(finish, 2500);
    intro.addEventListener("click", finish);
    document.addEventListener("keydown", finish, { once: true });
  }

  function showGate() {
    $("#app").hidden = true;
    var list = $("#gateList");
    list.innerHTML = S.profiles.map(function (p) {
      return '<button class="gate-item" type="button" data-p="' + p.id + '"><div class="av">' + avatar(p) + '</div><span>' + esc(p.label) + '</span></button>';
    }).join("");
    $("#gate").hidden = false;
    document.body.classList.remove("locked");
    window.scrollTo(0, 0);
    var first = list.querySelector("button");
    if (first) first.focus({ preventScroll: true });
  }

  $("#gateList").addEventListener("click", function (e) {
    var b = e.target.closest("[data-p]");
    if (!b) return;
    choose(S.profiles.filter(function (p) { return p.id === b.getAttribute("data-p"); })[0], true);
  });

  function choose(p, fromUser) {
    profile = p;
    store.set("profile", p.id);
    if (fromUser) {
      try { history.replaceState(null, "", "?profile=" + p.id + location.hash); } catch (e) {}
    }
    $("#gate").hidden = true;
    $("#app").hidden = false;
    renderApp();
    window.scrollTo(0, 0);
  }

  /* ================================================================ app */
  var sections = [
    ["Home", "#top"], ["Projects", "#row-top10"], ["Experience", "#row-experience"], ["Skills", "#row-skills"],
    ["Singapore", "#row-singapore"], ["Play", "#row-play"], ["Contact", "#contact"]
  ];

  function renderApp() {
    // nav
    $("#navLinks").innerHTML = sections.map(function (s) { return '<a href="' + s[1] + '">' + s[0] + '</a>'; }).join("");
    $("#navResume").href = S.links.resume;
    $("#avatarBtn").innerHTML = avatar(profile);
    $("#profileDrop").innerHTML = S.profiles.map(function (p) {
      return '<button type="button" data-switch="' + p.id + '"><span class="mini">' + avatar(p) + '</span><span' + (p.id === profile.id ? ' class="cur"' : "") + '>' + esc(p.label) + (p.id === profile.id ? " · watching" : "") + '</span></button>';
    }).join("") + '<div class="sep"></div><button type="button" data-switch="__gate">Manage profiles</button>';

    // billboard
    $("#bbPhoto").style.backgroundImage = "url('" + S.heroImage + "')";
    $("#bbTitle").textContent = S.name;
    $("#bbRole").textContent = S.title.toUpperCase();
    $("#bbMeta").innerHTML = '<span class="match">98% Match</span><span>' + esc(S.since) + '–</span><span class="box">B.TECH CSE</span><span>' + esc(S.college) + '</span><span class="box">HD</span>';
    $("#bbPitch").textContent = profile.pitch;
    $("#bbRank").textContent = "#1 in Portfolios for " + profile.label + "s Today";

    // rows
    var html = profile.rows.map(renderRow).join("");
    $("#rows").innerHTML = html;
    wireArrows();

    // contact
    $("#ctaLinks").innerHTML = linkButtons();
    var mail = $("#footMail"); mail.href = "mailto:" + S.email; mail.textContent = S.email;
    $("#footGrid").innerHTML = [
      ["GitHub", S.links.github], ["LinkedIn", S.links.linkedin], ["LeetCode", S.links.leetcode], ["Résumé", S.links.resume],
      ["Projects", "#row-top10"], ["Singapore 2025", "#row-singapore"], ["Mini-games", "#row-play"], ["Classic portfolio", "./classic/"]
    ].map(function (l) { return '<li><a href="' + esc(l[1]) + '"' + (/^http/.test(l[1]) ? ' target="_blank" rel="noopener"' : "") + '>' + esc(l[0]) + '</a></li>'; }).join("");
  }

  var ICON = {
    github: '<svg viewBox="0 0 24 24"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><path d="M2 5h20v14H2zm2 2v.5l8 5 8-5V7l-8 5z"/></svg>',
    code: '<svg viewBox="0 0 24 24"><path d="M8.6 16.6 4 12l4.6-4.6L7.2 6 1.2 12l6 6zm6.8 0L20 12l-4.6-4.6L16.8 6l6 6-6 6z"/></svg>',
    doc: '<svg viewBox="0 0 24 24"><path d="M6 2h9l5 5v15H6zm8 1.5V8h4.5z"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M7 4v16l13-8z"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7z"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>',
    thumb: '<svg viewBox="0 0 24 24"><path d="M2 21h4V9H2zm20-11a2 2 0 0 0-2-2h-6.3l1-4.6v-.3c0-.4-.2-.8-.4-1.1L13.2 1 6.6 7.6c-.4.4-.6.9-.6 1.4v10a2 2 0 0 0 2 2h9c.8 0 1.5-.5 1.8-1.2l3-7.1c.1-.2.2-.5.2-.7z"/></svg>',
    down: '<svg viewBox="0 0 24 24"><path d="M7.4 8.6 12 13.2l4.6-4.6L18 10l-6 6-6-6z"/></svg>'
  };

  function linkButtons() {
    return '<a href="mailto:' + esc(S.email) + '">' + ICON.mail + 'Email</a>' +
      '<a href="' + esc(S.links.linkedin) + '" target="_blank" rel="noopener">' + ICON.linkedin + 'LinkedIn</a>' +
      '<a href="' + esc(S.links.github) + '" target="_blank" rel="noopener">' + ICON.github + 'GitHub</a>' +
      '<a href="' + esc(S.links.leetcode) + '" target="_blank" rel="noopener">' + ICON.code + 'LeetCode</a>' +
      '<a href="' + esc(S.links.resume) + '" target="_blank" rel="noopener">' + ICON.doc + 'Résumé</a>';
  }

  function rowShell(key, cards) {
    var title = S.rowTitles[key].replace("{profile}", profile.label);
    return '<section class="row" id="row-' + key + '" aria-label="' + esc(title) + '"><h2>' + esc(title) +
      '<span class="explore">Explore all ›</span></h2><div class="row-wrap">' +
      '<button class="arrow l" type="button" aria-label="Scroll left">‹</button>' +
      '<div class="track">' + cards + '</div>' +
      '<button class="arrow r" type="button" aria-label="Scroll right">›</button></div></section>';
  }

  function projectCard(p) {
    return '<button class="card" type="button" data-kind="project" data-id="' + p.id + '" aria-label="' + esc(p.title + ": " + p.logline) + '">' +
      poster(p) + (p.badge ? '<span class="ribbon">' + esc(p.badge) + '</span>' : "") + '</button>';
  }

  function renderRow(key) {
    var cards = "";
    if (key === "picks") {
      cards = ["walker", "dental", "rover", "rootlens", "triage", "grocer"].map(byId).map(projectCard).join("");
    } else if (key === "top10") {
      cards = S.projects.map(function (p, i) {
        return '<button class="card t10card" type="button" data-kind="project" data-id="' + p.id + '" aria-label="Number ' + (i + 1) + ': ' + esc(p.title) + '">' +
          '<span class="num">' + bigNumber(i + 1) + '</span><span class="poster">' + poster(p, { tall: true }) + '</span></button>';
      }).join("");
    } else if (key === "building") {
      cards = S.building.map(function (b, i) {
        return '<button class="card cont" type="button" data-kind="building" data-i="' + i + '" aria-label="' + esc(b.title + ", " + b.status) + '">' +
          poster({ color: b.color, art: "", title: "" }, { noTitle: true }) +
          '<span class="label">' + esc(b.title) + '<small>' + esc(b.status) + '</small></span>' +
          '<span class="progress"><i style="width:' + Math.round(b.progress * 100) + '%"></i></span></button>';
      }).join("");
    } else if (key === "experience") {
      cards = S.experience.map(function (x, i) {
        return '<button class="card text" type="button" data-kind="experience" data-i="' + i + '" style="--c0:' + x.color[0] + ';--c1:' + x.color[1] + '">' +
          '<span class="k">' + esc(x.kicker) + '</span><span class="t">' + esc(x.title) + '</span><span class="w">' + esc(x.when) + '</span></button>';
      }).join("");
    } else if (key === "skills") {
      cards = S.skills.map(function (sk, i) {
        return '<div class="card text skill" style="--c0:#2b1013;--c1:#E50914;cursor:default"><span class="k">' + String(i + 1).padStart(2, "0") + '</span>' +
          '<span class="t">' + esc(sk.title) + '</span><span class="chips">' + sk.items.map(function (it) { return '<span>' + esc(it) + '</span>'; }).join("") + '</span></div>';
      }).join("");
    } else if (key === "certs") {
      cards = S.certs.map(function (c, i) {
        var inner = c.image ? '<img class="ph" src="' + esc(c.image) + '" alt="" loading="lazy">' : poster({ color: ["#2a1a05", "#F2C94C"], art: "", title: "" }, { noTitle: true });
        return '<button class="card has-label" type="button" data-kind="cert" data-i="' + i + '" aria-label="' + esc(c.title) + '">' + inner +
          '<span class="label">' + esc(c.title) + '<small>' + esc(c.issuer) + '</small></span></button>';
      }).join("");
    } else if (key === "singapore") {
      cards = S.singapore.map(function (g, i) {
        var inner = g.image ? '<img class="ph" src="' + esc(g.image) + '" alt="" loading="lazy">' : poster({ color: ["#2a1240", "#9B51E0"], art: "", title: "" }, { noTitle: true, tall: true });
        return '<button class="card tall" type="button" data-kind="sg" data-i="' + i + '" aria-label="' + esc(g.title + ": " + g.caption) + '">' + inner +
          '<span class="label">' + esc(g.title) + '<small>' + esc(g.caption) + '</small></span></button>';
      }).join("");
    } else if (key === "play") {
      cards = S.games.map(function (g) {
        var art = { walker: "walker", grocer: "fresh", incident: "graph", kana: "" }[g.id];
        return '<a class="card" href="./classic/#play-' + g.id + '" aria-label="Play ' + esc(g.title) + '">' +
          poster({ color: g.color, art: art, title: g.title }) + '<span class="ribbon">▶ PLAY NOW</span></a>';
      }).join("");
    } else if (key === "facts") {
      cards = S.facts.map(function (f) {
        return '<div class="card text" style="--c0:#1f1f1f;--c1:#E50914;cursor:default"><span class="glyph" aria-hidden="true">' + f.glyph + '</span><span class="k">BONUS FEATURE</span>' +
          '<span class="t">' + esc(f.title) + '</span><span class="w">' + esc(f.text) + '</span></div>';
      }).join("");
    }
    return rowShell(key, cards);
  }

  function byId(id) { return S.projects.filter(function (p) { return p.id === id; })[0]; }

  function wireArrows() {
    Array.prototype.forEach.call(document.querySelectorAll(".row-wrap"), function (w) {
      var t = $(".track", w);
      $(".arrow.l", w).onclick = function () { t.scrollBy({ left: -t.clientWidth * 0.9, behavior: "smooth" }); };
      $(".arrow.r", w).onclick = function () { t.scrollBy({ left: t.clientWidth * 0.9, behavior: "smooth" }); };
    });
  }

  /* ================================================================ nav behaviour */
  window.addEventListener("scroll", function () {
    $("#nav").classList.toggle("solid", window.scrollY > 40);
  }, { passive: true });

  $("#navBrowse").addEventListener("click", function () {
    var open = $("#navLinks").classList.toggle("open");
    this.setAttribute("aria-expanded", open);
  });
  $("#navLinks").addEventListener("click", function (e) {
    if (e.target.closest("a")) { this.classList.remove("open"); $("#navBrowse").setAttribute("aria-expanded", "false"); }
  });
  $("#avatarBtn").addEventListener("click", function (e) {
    e.stopPropagation();
    var d = $("#profileDrop"); d.hidden = !d.hidden;
    this.setAttribute("aria-expanded", !d.hidden);
  });
  document.addEventListener("click", function () { $("#profileDrop").hidden = true; });
  $("#profileDrop").addEventListener("click", function (e) {
    var b = e.target.closest("[data-switch]"); if (!b) return;
    var id = b.getAttribute("data-switch");
    if (id === "__gate") { try { history.replaceState(null, "", location.pathname); } catch (err) {} showGate(); return; }
    choose(S.profiles.filter(function (p) { return p.id === id; })[0], true);
  });

  // billboard spotlight (desktop)
  var bb = $("#billboard"), spot = $("#bbSpot");
  if (canHover) bb.addEventListener("mousemove", function (e) {
    var r = bb.getBoundingClientRect();
    spot.style.transform = "translate3d(" + (e.clientX - r.left - 320) + "px," + (e.clientY - r.top - 320) + "px,0)";
  });

  $("#bbPlay").addEventListener("click", function () { openProject(byId(profile.id === "gamer" ? "walker" : profile.id === "engineer" ? "rover" : "walker")); });
  $("#bbInfo").addEventListener("click", openAbout);

  $("#ctaForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var from = $("#ctaEmail").value.trim();
    var body = "Hi Hemashree,%0D%0A%0D%0AI saw your portfolio and would like to talk.%0D%0A%0D%0AYou can reach me at " + encodeURIComponent(from) + ".";
    location.href = "mailto:" + S.email + "?subject=" + encodeURIComponent("Let's talk (from your portfolio)") + "&body=" + body;
  });

  /* ================================================================ card clicks */
  document.addEventListener("click", function (e) {
    var c = e.target.closest("button.card");
    if (!c || !c.closest("#rows")) return;
    hidePreview(true);
    var kind = c.getAttribute("data-kind"), i = +c.getAttribute("data-i");
    if (kind === "project") openProject(byId(c.getAttribute("data-id")));
    else if (kind === "building") openBuilding(S.building[i]);
    else if (kind === "experience") openExperience(S.experience[i]);
    else if (kind === "cert") { var ct = S.certs[i]; if (ct.image) lightbox(ct.image, ct.title + " · " + ct.issuer); }
    else if (kind === "sg") { var g = S.singapore[i]; if (g.image) lightbox(g.image, g.title + " · " + g.caption); }
  });

  /* ================================================================ hover preview */
  var hoverTimer = null, pv = $("#preview"), pvCard = null;
  if (canHover) {
    document.addEventListener("mouseover", function (e) {
      var c = e.target.closest('#rows .card[data-kind="project"]');
      if (!c || c === pvCard) return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function () { showPreview(c); }, 420);
    });
    document.addEventListener("mouseout", function (e) {
      var c = e.target.closest('#rows .card[data-kind="project"]');
      if (c && !c.contains(e.relatedTarget) && !(e.relatedTarget && pv.contains(e.relatedTarget))) clearTimeout(hoverTimer);
    });
    pv.addEventListener("mouseleave", function () { hidePreview(); });
    window.addEventListener("scroll", function () { hidePreview(true); }, { passive: true });
  }

  function showPreview(card) {
    var p = byId(card.getAttribute("data-id"));
    var r = card.getBoundingClientRect();
    var w = Math.max(r.width * 1.5, 300);
    var left = r.left + r.width / 2 - w / 2;
    left = Math.max(12, Math.min(window.innerWidth - w - 12, left));
    var estH = w * 9 / 16 + 160;
    var top = r.top - (w * 9 / 16 - r.height) / 2 - 10;
    top = Math.max(70, Math.min(window.innerHeight - estH - 12, top));
    pvCard = card;
    pv.style.width = w + "px"; pv.style.left = left + "px"; pv.style.top = top + "px";
    pv.innerHTML = '<div class="pv-art">' + poster(p) + '</div><div class="pv-body">' +
      '<div class="pv-btns"><button class="circ white" type="button" data-open aria-label="Open ' + esc(p.title) + '">' + ICON.play + '</button>' +
      '<button class="circ" type="button" data-like aria-label="Add to my list">' + ICON.plus + '</button>' +
      '<button class="circ" type="button" data-thumb aria-label="Like">' + ICON.thumb + '</button>' +
      '<button class="circ more" type="button" data-open aria-label="More info">' + ICON.down + '</button></div>' +
      '<div class="pv-meta"><span class="match">' + p.match + '% Match</span><span class="box">' + esc(p.year) + '</span><span class="box">HD</span></div>' +
      '<div class="pv-genre">' + p.genre.split(" · ").map(esc).join("<b>•</b>") + '</div>' +
      '<p class="pv-line">' + esc(p.logline) + '</p></div>';
    pv.hidden = false;
    pv.onclick = function (e) {
      if (e.target.closest("[data-open]")) { hidePreview(true); openProject(p); }
      var t = e.target.closest("[data-like],[data-thumb]");
      if (t) { t.classList.toggle("white"); if (t.hasAttribute("data-like")) t.innerHTML = t.classList.contains("white") ? ICON.check : ICON.plus; }
    };
  }
  function hidePreview() { clearTimeout(hoverTimer); pv.hidden = true; pvCard = null; }

  /* ================================================================ modal */
  var lastFocus = null;
  function openModal(html) {
    lastFocus = document.activeElement;
    var box = $("#modalBox");
    box.innerHTML = '<button class="m-close" type="button" data-close aria-label="Close">×</button>' + html;
    $("#modal").hidden = false;
    $("#modal").scrollTop = 0;
    document.body.classList.add("locked");
    box.focus({ preventScroll: true });
  }
  function closeModal() {
    $("#modal").hidden = true;
    document.body.classList.remove("locked");
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  $("#modal").addEventListener("click", function (e) {
    if (e.target.closest("[data-close]")) closeModal();
    var lb = e.target.closest("[data-lb]");
    if (lb) { lightbox(lb.getAttribute("data-lb"), lb.getAttribute("data-cap")); return; }
    var m = e.target.closest("[data-more]");
    if (m) openProject(byId(m.getAttribute("data-more")));
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!$("#lightbox").hidden) { $("#lightbox").hidden = true; return; }
    if (!$("#modal").hidden) closeModal();
  });

  function heroActions(p) {
    var a = "";
    if (p.game) a += '<a class="btn btn-play" href="./classic/#play-' + p.game + '">' + ICON.play + 'Play the demo</a>';
    if (p.repo) a += '<a class="btn ' + (p.game ? "btn-info" : "btn-play") + '" href="' + esc(p.repo) + '" target="_blank" rel="noopener">' + ICON.code + 'View code</a>';
    if (!a) a = '<span class="btn btn-info" style="cursor:default">Private repository</span>';
    return a;
  }

  function openProject(p) {
    var idx = S.projects.indexOf(p) + 1;
    var eps = p.episodes.map(function (ep, i) {
      return '<li class="ep"><span class="n">' + (i + 1) + '</span><span class="thumb">' + poster({ color: p.color, art: p.art, title: "" }, { noTitle: true, photo: p.gallery ? p.gallery[i % p.gallery.length][0] : "" }) + '</span>' +
        '<div><h4>' + esc(ep[0]) + '<span>S1:E' + (i + 1) + '</span></h4><p>' + esc(ep[1]) + '</p></div></li>';
    }).join("");
    var more = S.projects.filter(function (q) { return q !== p; }).slice(0, 6).map(function (q) {
      return '<button class="more-card" type="button" data-more="' + q.id + '"><div class="ma">' + poster(q) + '</div><div class="mb">' +
        '<div class="m-meta"><span class="match">' + q.match + '% Match</span><span class="box">' + esc(q.year) + '</span></div><p>' + esc(q.logline) + '</p></div></button>';
    }).join("");
    openModal(
      '<div class="m-hero">' + poster(p, { noTitle: true }).replace('class="art"', 'class="m-art"') +
      '<div class="m-hero-c"><h2 id="modalTitle">' + esc(p.title) + '</h2><div class="bb-actions">' + heroActions(p) + '</div></div></div>' +
      '<div class="m-body"><div class="m-cols"><div>' +
      '<div class="m-meta"><span class="match">' + p.match + '% Match</span><span>' + esc(p.year) + '</span><span class="box">HD</span>' + (p.badge ? '<span class="box">' + esc(p.badge) + '</span>' : "") + '</div>' +
      '<div class="bb-top10" style="font-size:16px"><span class="t10">TOP<br>10</span>#' + idx + ' in Projects Today</div>' +
      '<p class="m-log">' + esc(p.logline) + '</p><p class="m-syn">' + esc(p.synopsis) + '</p></div>' +
      '<div class="m-side"><p><b>Cast: </b>' + p.cast.map(esc).join(", ") + '</p><p><b>Genres: </b>' + p.genre.split(" · ").map(esc).join(", ") + '</p>' +
      '<p><b>Created by: </b>Hemashree</p></div></div>' +
      (p.gallery ? '<h3 class="m-h3">Behind the Scenes</h3><div class="bts">' + p.gallery.map(function (g) {
        return '<button type="button" class="bts-item" data-lb="' + esc(g[0]) + '" data-cap="' + esc(g[1]) + '"><img src="' + esc(g[0]) + '" alt="' + esc(g[1]) + '" loading="lazy"><span>' + esc(g[1]) + '</span></button>';
      }).join("") + '</div>' : "") +
      '<h3 class="m-h3">Episodes <small>Season 1</small></h3><ol class="eps">' + eps + '</ol>' +
      '<h3 class="m-h3">More Like This</h3><div class="more-grid">' + more + '</div></div>'
    );
  }

  function openBuilding(b) {
    openModal(
      '<div class="m-hero">' + poster({ color: b.color, art: "", title: "" }, { noTitle: true }).replace('class="art"', 'class="m-art"') +
      '<div class="m-hero-c"><h2 id="modalTitle">' + esc(b.title) + '</h2><div class="bb-actions"><a class="btn btn-play" href="' + esc(b.repo) + '" target="_blank" rel="noopener">' + ICON.code + 'Follow along</a></div></div></div>' +
      '<div class="m-body"><div class="m-meta"><span class="match">In production</span><span class="box">' + esc(b.status) + '</span></div>' +
      '<div class="progress" style="position:relative;left:0;right:0;bottom:0;height:5px;max-width:420px;margin:6px 0 18px"><i style="width:' + Math.round(b.progress * 100) + '%"></i></div>' +
      '<p class="m-log">' + esc(b.note) + '</p></div>'
    );
  }

  function openExperience(x) {
    var hero = x.image
      ? '<img class="m-art" src="' + esc(x.image) + '" alt="" style="object-position:50% 35%">'
      : poster({ color: x.color, art: "", title: "" }, { noTitle: true }).replace('class="art"', 'class="m-art"');
    openModal(
      '<div class="m-hero">' + hero + '<div class="m-hero-c"><h2 id="modalTitle">' + esc(x.title) + '</h2></div></div>' +
      '<div class="m-body"><div class="m-meta"><span class="match">' + esc(x.kicker) + '</span><span class="box">' + esc(x.when) + '</span></div>' +
      '<p class="m-syn" style="font-size:17px">' + esc(x.text) + '</p></div>'
    );
  }

  function openAbout() {
    openModal(
      '<div class="m-hero" style="aspect-ratio:16/6"><div class="m-art" style="background:url(\'' + esc(S.heroImage) + '\') 50% 28%/cover"></div>' +
      '<div class="m-hero-c"><h2 id="modalTitle">' + esc(S.name) + '</h2></div></div>' +
      '<div class="m-body"><div class="about-grid"><img src="./assets/img/saree.jpg" alt="Hemashree">' +
      '<div><div class="m-meta"><span class="match">' + esc(S.title) + '</span><span class="box">' + esc(S.degree) + '</span><span>' + esc(S.college) + '</span></div>' +
      '<p class="m-log">' + esc(S.tagline) + '</p>' +
      '<p class="m-syn">I\'m ' + esc(S.fullName) + ', a software engineer studying Computer Science Engineering (Cyber Physical Systems) at VIT Chennai. I build things that sense the world, decide, and keep people safe: a patent-pending smart walker that predicts falls, a disaster-response rover, dental X-ray models, and backend platforms that diagnose their own failures. I went to Singapore in 2025 for the NUS Industry 4.0 programme and SuperAI, and I speak Tamil, English, Hindi and a little 日本語.</p>' +
      '<div class="m-side" style="margin-top:16px"><p><b>Based in: </b>' + esc(S.location) + '</p><p><b>Open to: </b>Software engineering, computer vision, cyber-physical systems, security, backend &amp; DevOps</p></div>' +
      '<div class="link-row">' + linkButtons() + '</div></div></div></div>'
    );
  }

  /* ================================================================ lightbox */
  function lightbox(src, cap) {
    $("#lbImg").src = src; $("#lbImg").alt = cap; $("#lbCap").textContent = cap;
    $("#lightbox").hidden = false;
  }
  $("#lightbox").addEventListener("click", function (e) {
    if (e.target.id !== "lbImg") $("#lightbox").hidden = true;
  });

  start();
})();
