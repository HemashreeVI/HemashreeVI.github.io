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
          s += '<rect x="' + (cx - 100 + gx * 30) + '" y="' + (cy - 50 + gy * 28) + '" width="26" height="24" rx="3" fill="' + (hz ? "#E10600" : c) + '" opacity="' + (hz ? .75 : .12) + '"/>';
        }
        s += '<g fill="none" stroke="' + c + '" stroke-opacity=".7"><path d="M' + (cx - 30) + ' ' + (cy + 40) + 'a70 70 0 0 1 140 0"/><path d="M' + (cx) + ' ' + (cy + 40) + 'a40 40 0 0 1 80 0"/></g>';
        s += '<circle cx="' + (cx + 40) + '" cy="' + (cy + 40) + '" r="9" fill="#fff"/>';
        break;
      case "xray":
        for (var t = 0; t < 7; t++) {
          s += '<rect x="' + (cx - 105 + t * 30) + '" y="' + (cy - 46) + '" width="24" height="42" rx="9" fill="#fff" fill-opacity=".16" stroke="#fff" stroke-opacity=".35"/>';
          s += '<rect x="' + (cx - 105 + t * 30) + '" y="' + (cy + 6) + '" width="24" height="42" rx="9" fill="#fff" fill-opacity=".12" stroke="#fff" stroke-opacity=".3"/>';
        }
        s += '<rect x="' + (cx - 48) + '" y="' + (cy - 52) + '" width="62" height="54" fill="none" stroke="#E10600" stroke-width="2.5"/>';
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
          s += '<circle cx="' + (cx + p[0]) + '" cy="' + (cy + p[1]) + '" r="' + (bad ? 11 : 8) + '" fill="#0F0F13" stroke="' + (bad ? "#E10600" : c) + '" stroke-width="3"/>';
          if (bad) s += '<circle cx="' + (cx + p[0]) + '" cy="' + (cy + p[1]) + '" r="11" fill="none" stroke="#E10600"><animate attributeName="r" values="11;30" dur="1.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1.6s" repeatCount="indefinite"/></circle>';
        });
        break;
      case "stream":
        s += '<rect x="' + (cx - 10) + '" y="' + (cy - 30) + '" width="60" height="60" rx="10" fill="#0F0F13" stroke="' + c + '" stroke-width="3"/>';
        s += '<text x="' + (cx + 20) + '" y="' + (cy + 6) + '" font-family="Inter,sans-serif" font-weight="800" font-size="16" fill="#fff" text-anchor="middle">LLM</text>';
        for (var k = 0; k < 3; k++) {
          s += '<rect width="34" height="18" rx="4" fill="' + c + '" opacity=".85"><animateMotion dur="2.4s" begin="' + (k * 0.8) + 's" repeatCount="indefinite" path="M' + (cx - 120) + ' ' + (cy - 9) + 'H' + (cx - 30) + '"/></rect>';
          s += '<path d="M' + (cx + 50) + ' ' + cy + 'L' + (cx + 80) + ' ' + (cy - 40 + k * 40) + '" stroke="' + c + '" stroke-opacity=".6" stroke-width="2"/>';
          s += '<rect x="' + (cx + 80) + '" y="' + (cy - 49 + k * 40) + '" width="40" height="18" rx="9" fill="none" stroke="' + ["#E10600", c, "#46D369"][k] + '" stroke-width="2"/>';
        }
        break;
      case "fresh":
        [["#46D369", .85], [c, .55], ["#E10600", .2]].forEach(function (f, i) {
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
      case "jarvis":
        // Original HUD-style art: gold rings, a glowing core and a voice waveform.
        var G = "#F2C94C", R = "#E5383B", jx = cx + 10, jy = cy + 6, gid = "jv" + (++uid);
        s += '<defs><radialGradient id="' + gid + '"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#BFF3FF"/><stop offset=".7" stop-color="#3FC6FF" stop-opacity=".55"/><stop offset="1" stop-color="#3FC6FF" stop-opacity="0"/></radialGradient></defs>';
        s += '<circle cx="' + jx + '" cy="' + jy + '" r="62" fill="none" stroke="' + G + '" stroke-opacity=".35" stroke-width="1"/>';
        s += '<g><circle cx="' + jx + '" cy="' + jy + '" r="54" fill="none" stroke="' + G + '" stroke-width="3" stroke-dasharray="26 10 6 10"/>' +
          '<animateTransform attributeName="transform" type="rotate" from="0 ' + jx + ' ' + jy + '" to="360 ' + jx + ' ' + jy + '" dur="18s" repeatCount="indefinite"/></g>';
        s += '<g><circle cx="' + jx + '" cy="' + jy + '" r="42" fill="none" stroke="' + R + '" stroke-width="5" stroke-dasharray="44 22"/>' +
          '<animateTransform attributeName="transform" type="rotate" from="360 ' + jx + ' ' + jy + '" to="0 ' + jx + ' ' + jy + '" dur="10s" repeatCount="indefinite"/></g>';
        for (var tk = 0; tk < 36; tk++) {
          var ang = tk * Math.PI / 18, r1 = 30, r2 = tk % 3 ? 33 : 36;
          s += '<line x1="' + (jx + r1 * Math.cos(ang)).toFixed(1) + '" y1="' + (jy + r1 * Math.sin(ang)).toFixed(1) + '" x2="' + (jx + r2 * Math.cos(ang)).toFixed(1) + '" y2="' + (jy + r2 * Math.sin(ang)).toFixed(1) + '" stroke="' + G + '" stroke-opacity=".8"/>';
        }
        s += '<circle cx="' + jx + '" cy="' + jy + '" r="34" fill="url(#' + gid + ')"><animate attributeName="r" values="30;36;30" dur="2.4s" repeatCount="indefinite"/></circle>';
        s += '<circle cx="' + jx + '" cy="' + jy + '" r="11" fill="#fff"/>';
        for (var wv = 0; wv < 9; wv++) {
          var wh = 6 + Math.abs(Math.sin(wv * 1.7)) * 26;
          s += '<rect x="' + (jx - 150 + wv * 9) + '" y="' + (jy - wh / 2) + '" width="5" height="' + wh.toFixed(0) + '" rx="2.5" fill="' + G + '" opacity=".85"><animate attributeName="height" values="' + wh.toFixed(0) + ';' + (wh * 0.35).toFixed(0) + ';' + wh.toFixed(0) + '" dur="' + (0.7 + (wv % 3) * 0.25) + 's" repeatCount="indefinite"/></rect>';
        }
        s += '<path d="M' + (jx - 66) + ' ' + jy + 'H' + (jx - 72) + 'M' + (jx - 150) + ' ' + (jy - 26) + 'H' + (jx - 80) + 'l8 8" fill="none" stroke="' + G + '" stroke-opacity=".7"/>';
        s += '<text x="' + (jx - 150) + '" y="' + (jy - 31) + '" font-family="Inter,sans-serif" font-size="8" font-weight="700" fill="' + G + '" letter-spacing="1.5">VOICE ONLINE</text>';
        s += '<text x="' + (jx - 150) + '" y="' + (jy + 30) + '" font-family="Inter,sans-serif" font-size="7" fill="#fff" fill-opacity=".6" letter-spacing="1">OFFLINE · LOCAL</text>';
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
    var c0 = (o.color && o.color[0]) || "#2a2a2a", c1 = (o.color && o.color[1]) || "#E10600";
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
      return '<text x="16" y="' + (tY + i * fs * 0.92).toFixed(0) + '" font-family="Titillium Web,Arial Black,sans-serif" font-weight="900" font-style="italic" font-size="' + (fs * 0.82).toFixed(0) + '" fill="#fff" letter-spacing="-.5">' + esc(ln.toUpperCase()) + '</text>';
    }).join("");
    return '<svg class="art" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<defs><linearGradient id="' + id + 'g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c0 + '"/><stop offset="1" stop-color="#0b0b0b"/></linearGradient>' +
      '<radialGradient id="' + id + 'r" cx="70%" cy="40%" r="60%"><stop offset="0" stop-color="' + c1 + '" stop-opacity=".45"/><stop offset="1" stop-color="' + c1 + '" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + id + 'b" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".85"/></linearGradient></defs>' +
      '<rect width="' + w + '" height="' + h + '" fill="url(#' + id + 'g)"/><rect width="' + w + '" height="' + h + '" fill="url(#' + id + 'r)"/>' +
      art + '<rect width="' + w + '" height="' + h + '" fill="url(#' + id + 'b)"/>' +
      '<path d="M12 12h22l-4 6H8z" fill="#E10600"/><path d="M36 12h8l-4 6h-8z" fill="#fff" fill-opacity=".85"/>' +
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
    // Grid slot, like a starting position: "P" plus the number in italic outline.
    return '<svg viewBox="0 0 120 180" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">' +
      '<text x="112" y="70" text-anchor="end" font-family="Titillium Web,Arial Black,sans-serif" font-weight="900" font-style="italic" font-size="34" fill="#E10600">P</text>' +
      '<text x="114" y="168" text-anchor="end" font-family="Titillium Web,Arial Black,sans-serif" font-weight="900" font-style="italic" font-size="' + (n === 10 ? 104 : 140) + '" fill="#0F0F13" stroke="#6b6b75" stroke-width="3" letter-spacing="-6">' + n + '</text>' +
      '<path d="M20 176h92" stroke="#E10600" stroke-width="3"/></svg>';
  }

  /* ================================================================ skill logos */
  // Brand logos are self-hosted in assets/img/logos (Devicon, MIT; Simple Icons, CC0).
  var LOGO = {
    "Python": "python", "Java": "java", "C++": "cplusplus", "JavaScript": "javascript", "HTML": "html5", "CSS": "css3",
    "PyTorch": "pytorch", "TensorFlow": "tensorflow", "OpenCV": "opencv", "Ollama": "ollama",
    "Arduino": "arduino", "Raspberry Pi": "raspberrypi", "ESP32": "espressif",
    "FastAPI": "fastapi", "Flask": "flask", "Docker": "docker", "Kafka": "apachekafka", "Prometheus": "prometheus",
    "Grafana": "grafana", "GitHub Actions": "githubactions", "MySQL": "mysql", "SQLite": "sqlite", "Firebase": "firebase",
    "Git": "git", "GitHub": "github", "VS Code": "vscode", "Linux": "linux", "Jupyter": "jupyter", "Colab": "googlecolab",
    "Kaggle": "kaggle", "Roboflow": "roboflow"
  };
  // Drawn icons for tools without a public logo and for concepts.
  var GLYPH = {
    "YOLOv8/v9": ['#00E5FF', '<path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5"/><rect x="7" y="7" width="10" height="10" rx="1"/>'],
    "Grad-CAM": ['#FF6B35', '<circle cx="12" cy="12" r="9" opacity=".35"/><circle cx="12" cy="12" r="5.5" opacity=".7"/><circle cx="12" cy="12" r="2" fill="currentColor"/>'],
    "MMPose": ['#7FDBFF', '<circle cx="12" cy="4.5" r="2"/><path d="M12 7v7M6 10l6-1 6 1M8 21l4-7 4 7"/>'],
    "Q-learning": ['#46D369', '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/><path d="M5.5 18.5l5-5m0 0h-3m3 0v3" stroke-width="2"/>'],
    "RAG": ['#F2C94C', '<path d="M6 3h8l4 4v8"/><path d="M6 3v18h6"/><circle cx="16.5" cy="17.5" r="3"/><path d="M18.7 19.7L21 22"/>'],
    "IBM watsonx": ['#4589FF', '<path d="M3 6h18M3 10h18M3 14h18M3 18h18" stroke-dasharray="4 2"/>'],
    "Sensor fusion": ['#F2994A', '<path d="M3 5l7 7M3 19l7-7M3 12h7"/><circle cx="15" cy="12" r="4"/><path d="M19 12h2"/>'],
    "LIDAR SLAM": ['#56CCF2', '<path d="M12 12L4 6"/><path d="M4 12a8 8 0 0 1 16 0"/><path d="M7.5 12a4.5 4.5 0 0 1 9 0"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><path d="M3 18h18"/>'],
    "A*": ['#BB6BD9', '<circle cx="5" cy="19" r="2"/><path d="M7 17l4-4 3 2 4-6"/><path d="M18 3.5l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z" fill="currentColor"/>'],
    "Qdrant": ['#DC244C', '<path d="M12 2.5l8.5 4.9v9.2L12 21.5l-8.5-4.9V7.4z"/><path d="M12 12l8.5-4.6M12 12v9.5M12 12L3.5 7.4"/>'],
    "Gradio": ['#FF7C00', '<path d="M4 7l8-4 8 4-8 4z"/><path d="M4 12l8 4 8-4"/><path d="M4 17l8 4 8-4"/>'],
    "Intrusion detection": ['#EB5757', '<path d="M12 2.5l8 3v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6z"/><path d="M12 8v5M12 16v.5" stroke-width="2.2"/>'],
    "Threat modeling": ['#EB5757', '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/>'],
    "Risk analysis": ['#F2C94C', '<path d="M3.5 17a8.5 8.5 0 1 1 17 0"/><path d="M12 17l4.5-6" stroke-width="2"/><circle cx="12" cy="17" r="1.6" fill="currentColor"/>']
  };
  var SPOKEN = { "Tamil": "த", "English": "En", "Hindi": "हि", "日本語": "日" };

  function skillIcon(name) {
    var base = name.split(" · ")[0];
    if (LOGO[base]) return '<img src="./assets/img/logos/' + LOGO[base] + '.svg" alt="" width="18" height="18" loading="lazy">';
    if (GLYPH[base]) return '<svg viewBox="0 0 24 24" aria-hidden="true" style="color:' + GLYPH[base][0] + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + GLYPH[base][1] + '</svg>';
    if (SPOKEN[base]) return '<span class="glyph-txt" aria-hidden="true">' + SPOKEN[base] + '</span>';
    return "";
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
    setTimeout(finish, 4300);
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
    var picked = S.profiles.filter(function (p) { return p.id === b.getAttribute("data-p"); })[0];
    raceTo(function () { choose(picked, true); }, picked.label.toUpperCase());
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
      return '<button type="button" data-switch="' + p.id + '"><span class="mini">' + avatar(p) + '</span><span' + (p.id === profile.id ? ' class="cur"' : "") + '>' + esc(p.label) + (p.id === profile.id ? " · current" : "") + '</span></button>';
    }).join("") + '<div class="sep"></div><button type="button" data-switch="__gate">Change seat</button>';

    // billboard
    $("#bbPhoto").src = S.heroImage;
    $("#bbTitle").textContent = S.name;
    $("#bbRole").textContent = S.title.toUpperCase();
    $("#bbMeta").innerHTML = '<span class="live"><i></i>Open to opportunities</span><span class="box">' + esc(S.since) + ' →</span><span>' + esc(S.college) + '</span><span>' + esc(S.location) + '</span>';
    $("#bbPitch").textContent = profile.pitch;
    $("#bbStats").innerHTML = [[S.projects.length, "projects built"], ["1", "patent (filing)"], ["97.1%", "best model mAP@50"], ["4", "languages spoken"]]
      .map(function (x) { return '<div><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></div>'; }).join("");

    // rows
    var html = profile.rows.map(renderRow).join("");
    $("#rows").innerHTML = html;
    wireArrows();
    wireReveal();
    initArc();

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
    return '<section class="row" id="row-' + key + '" aria-label="' + esc(title) + '"><h2><span class="bar" aria-hidden="true"></span>' + esc(title) +
      '</h2><div class="row-wrap">' +
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
      return skillArc();
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
          poster({ color: g.color, art: art, title: g.title }) + '<span class="ribbon">▶ PLAY</span></a>';
      }).join("");
    } else if (key === "facts") {
      cards = S.facts.map(function (f) {
        return '<div class="card text" style="--c0:#1f1f1f;--c1:#E10600;cursor:default"><span class="glyph" aria-hidden="true">' + f.glyph + '</span><span class="k">OFF TRACK</span>' +
          '<span class="t">' + esc(f.title) + '</span><span class="w">' + esc(f.text) + '</span></div>';
      }).join("");
    }
    return rowShell(key, cards);
  }

  function byId(id) { return S.projects.filter(function (p) { return p.id === id; })[0]; }

  /* ================================================================ skills arc */
  // Cards sit on a wide arc; scrolling through the pinned section swings them past the centre.
  function skillArc() {
    var n = S.skills.length;
    var cards = S.skills.map(function (sk, i) {
      return '<article class="sa-card" data-i="' + i + '">' +
        '<header><span class="sa-tag">' + esc(sk.tag || "") + '</span><span class="sa-idx">[ ' + String(i + 1).padStart(2, "0") + ' / ' + String(n).padStart(2, "0") + ' ]</span></header>' +
        '<div class="sa-mid"><h3>' + esc(sk.title) + '</h3><p>' + esc(sk.desc || "") + '</p></div>' +
        '<div class="sa-chips">' + sk.items.map(function (it) { return '<span>' + skillIcon(it) + esc(it) + '</span>'; }).join("") + '</div>' +
        '<i class="sa-dot" aria-hidden="true"></i></article>';
    }).join("");
    return '<section class="skill-arc" id="row-skills" aria-label="Skills" style="--n:' + n + '">' +
      '<div class="sa-sticky"><h2 class="sa-title"><span class="bar" aria-hidden="true"></span>Skills</h2>' +
      '<div class="sa-word" aria-hidden="true">SKILLS</div><div class="sa-core" aria-hidden="true"></div>' +
      '<div class="sa-stage">' + cards + '</div>' +
      '<div class="sa-hint" aria-hidden="true"><span id="saCount">01</span> / ' + String(n).padStart(2, "0") + ' · scroll to shuffle</div></div></section>';
  }

  var arcQueued = false, arcBound = false;
  function initArc() {
    var mobile = window.matchMedia("(max-width:800px)");
    function update() {
      arcQueued = false;
      var sec = $("#row-skills.skill-arc");
      if (!sec) return;
      var cards = sec.querySelectorAll(".sa-card"), count = $("#saCount");
      if (mobile.matches) {
        Array.prototype.forEach.call(cards, function (c) { c.style.transform = ""; c.style.opacity = ""; c.style.zIndex = ""; });
        return;
      }
      var r = sec.getBoundingClientRect();
      var total = sec.offsetHeight - window.innerHeight;
      var prog = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      var p = prog * (cards.length - 1);
      var R = Math.max(1400, window.innerWidth * 1.3);
      Array.prototype.forEach.call(cards, function (c, i) {
        var off = i - p, ang = off * 17, rad = ang * Math.PI / 180;
        var x = Math.sin(rad) * R, y = R - Math.cos(rad) * R;
        var sc = Math.max(0.5, 1 - Math.abs(off) * 0.13);
        c.style.transform = "translate(-50%,-50%) translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) rotate(" + ang.toFixed(2) + "deg) scale(" + sc.toFixed(3) + ")";
        c.style.opacity = Math.max(0, 1 - Math.abs(off) * 0.32).toFixed(3);
        c.style.zIndex = String(100 - Math.round(Math.abs(off) * 10));
        c.classList.toggle("active", Math.abs(off) < 0.5);
      });
      if (count) count.textContent = String(Math.round(p) + 1).padStart(2, "0");
    }
    function queue() { if (!arcQueued) { arcQueued = true; requestAnimationFrame(update); } }
    if (!arcBound) {
      arcBound = true;
      window.addEventListener("scroll", queue, { passive: true });
      window.addEventListener("resize", queue);
    }
    update();
  }

  /* ================================================================ cards slide in */
  var revealObs = null;
  function wireReveal() {
    if (revealObs) revealObs.disconnect();
    var rows = document.querySelectorAll("#rows .row");
    Array.prototype.forEach.call(rows, function (row) {
      Array.prototype.forEach.call(row.querySelectorAll(".track > .card"), function (c, i) { c.style.setProperty("--d", Math.min(i, 8) * 70 + "ms"); });
    });
    if (!("IntersectionObserver" in window)) { Array.prototype.forEach.call(rows, function (r) { r.classList.add("in"); }); return; }
    revealObs = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); revealObs.unobserve(en.target); } });
    }, { threshold: 0.12 });
    Array.prototype.forEach.call(rows, function (r) { revealObs.observe(r); });
  }

  /* ================================================================ F1 car transition */
  // Original top-down car drawing (nose up). The curtain behind it covers the screen while the page changes.
  var CAR_SVG = '<svg viewBox="0 0 200 440" aria-hidden="true"><defs>' +
    '<linearGradient id="carBody" x1="0" x2="1"><stop offset="0" stop-color="#9c0400"/><stop offset=".5" stop-color="#E10600"/><stop offset="1" stop-color="#9c0400"/></linearGradient>' +
    '<radialGradient id="carGlow"><stop offset="0" stop-color="#ffb347" stop-opacity=".95"/><stop offset="1" stop-color="#ff5a00" stop-opacity="0"/></radialGradient>' +
    '<filter id="carShadow" x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur stdDeviation="8"/></filter></defs>' +
    '<ellipse cx="100" cy="230" rx="92" ry="205" fill="#000" opacity=".55" filter="url(#carShadow)"/>' +
    '<path d="M6 30h188v14H6z" fill="#111"/><path d="M10 22h180l-6 8H16z" fill="#E10600"/>' +
    '<rect x="2" y="16" width="10" height="32" rx="2" fill="#1b1b1b"/><rect x="188" y="16" width="10" height="32" rx="2" fill="#1b1b1b"/>' +
    '<path d="M40 92L86 112M40 112L86 124M160 92L114 112M160 112L114 124" stroke="#2a2a2a" stroke-width="3"/>' +
    '<rect x="8" y="64" width="36" height="72" rx="11" fill="#141414"/><rect x="156" y="64" width="36" height="72" rx="11" fill="#141414"/>' +
    '<path d="M12 80h28M12 96h28M12 112h28M160 80h28M160 96h28M160 112h28" stroke="#2c2c2c" stroke-width="2"/>' +
    '<path d="M90 44C92 20 108 20 110 44L120 160H80z" fill="url(#carBody)"/><path d="M97 40h6l5 118h-16z" fill="#fff"/>' +
    '<path d="M74 150C58 190 36 214 36 262L40 352C56 378 144 378 160 352L164 262C164 214 142 190 126 150z" fill="url(#carBody)"/>' +
    '<path d="M50 236c6-18 16-26 26-30v26c-10 2-18 6-26 12zM150 236c-6-18-16-26-26-30v26c10 2 18 6 26 12z" fill="#0b0b0b"/>' +
    '<path d="M44 300c10 10 26 16 40 18v26c-16-2-30-8-38-16zM156 300c-10 10-26 16-40 18v26c16-2 30-8 38-16z" fill="#fff" fill-opacity=".9"/>' +
    '<ellipse cx="100" cy="212" rx="18" ry="30" fill="#0b0b0b"/><circle cx="100" cy="206" r="11" fill="#fff"/><path d="M89 204h22v5H89z" fill="#E10600"/>' +
    '<path d="M100 172c-24 0-26 20-24 54M100 172c24 0 26 20 24 54M100 172v-10" stroke="#1d1d1d" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    '<path d="M92 244h16l-2 110h-12z" fill="#0b0b0b"/>' +
    '<text x="100" y="299" text-anchor="middle" font-family="Titillium Web,Arial Black,sans-serif" font-weight="900" font-style="italic" font-size="18" fill="#fff" transform="rotate(-90 100 299)">HVI</text>' +
    '<rect x="2" y="296" width="44" height="86" rx="13" fill="#141414"/><rect x="154" y="296" width="44" height="86" rx="13" fill="#141414"/>' +
    '<path d="M6 314h36M6 334h36M6 354h36M158 314h36M158 334h36M158 354h36" stroke="#2c2c2c" stroke-width="2"/>' +
    '<ellipse cx="100" cy="404" rx="14" ry="10" fill="url(#carGlow)"/>' +
    '<rect x="22" y="388" width="156" height="24" rx="3" fill="#111"/><rect x="26" y="392" width="148" height="7" fill="#E10600"/>' +
    '<rect x="18" y="380" width="10" height="38" rx="2" fill="#1b1b1b"/><rect x="172" y="380" width="10" height="38" rx="2" fill="#1b1b1b"/>' +
    '<text x="100" y="410" text-anchor="middle" font-family="Titillium Web,Arial Black,sans-serif" font-weight="900" font-style="italic" font-size="9" fill="#fff" letter-spacing="2">HEMASHREE</text>' +
    '</svg>';
  $("#plCar").innerHTML = CAR_SVG;

  var racing = false;
  function raceTo(action, label) {
    var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    if (racing) return;
    if (reduce || !document.body.animate) { action(); return; }
    racing = true;
    hidePreview();
    var lane = $("#pitlane"), track = $("#plTrack");
    $("#plLabel").textContent = label || "";
    lane.classList.add("go");
    var anim = track.animate([{ transform: "translateY(0)" }, { transform: "translateY(-340vh)" }],
      { duration: 1400, easing: "cubic-bezier(.45,0,.55,1)", fill: "forwards" });
    setTimeout(function () { try { action(); } catch (err) {} }, 760);
    anim.onfinish = function () { lane.classList.remove("go"); anim.cancel(); racing = false; };
  }

  function jumpTo(hash) {
    if (hash === "#top") { window.scrollTo({ top: 0, behavior: "instant" }); return; }
    var el = document.querySelector(hash);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: "instant" });
  }

  // Section links and links to the classic site both get the car.
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
    var href = a.getAttribute("href");
    if (/^#/.test(href) && href.length > 1 && (href === "#top" || document.querySelector(href))) {
      e.preventDefault();
      raceTo(function () { jumpTo(href); }, (a.textContent || "").trim().toUpperCase().slice(0, 24) || "HOME");
    } else if (/^\.\/classic\//.test(href)) {
      e.preventDefault();
      raceTo(function () { location.href = href; }, /#play-/.test(href) ? "GAME ON" : "CLASSIC");
    }
  });


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
    var np = S.profiles.filter(function (p) { return p.id === id; })[0];
    raceTo(function () { choose(np, true); }, np.label.toUpperCase());
  });

  // billboard spotlight (desktop)
  var bb = $("#billboard"), spot = $("#bbSpot");
  if (canHover) bb.addEventListener("mousemove", function (e) {
    var r = bb.getBoundingClientRect();
    spot.style.transform = "translate3d(" + (e.clientX - r.left - 320) + "px," + (e.clientY - r.top - 320) + "px,0)";
  });

  $("#bbPlay").addEventListener("click", function () { raceTo(function () { jumpTo("#row-top10"); }, "PROJECTS"); });
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
      (p.repo ? '<a class="circ" href="' + esc(p.repo) + '" target="_blank" rel="noopener" aria-label="View code">' + ICON.code + '</a>' : "") +
      '<button class="circ more" type="button" data-open aria-label="More info">' + ICON.down + '</button></div>' +
      '<div class="pv-meta"><span class="box">' + esc(p.year) + '</span>' + (p.badge ? '<span class="badge">' + esc(p.badge) + '</span>' : "") + '</div>' +
      '<div class="pv-genre">' + p.genre.split(" · ").map(esc).join("<b>•</b>") + '</div>' +
      '<p class="pv-line">' + esc(p.logline) + '</p></div>';
    pv.hidden = false;
    pv.onclick = function (e) {
      if (e.target.closest("[data-open]")) { hidePreview(true); openProject(p); }
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
    var thumbs = (p.gallery || []).filter(function (g) { return g[2] !== "contain"; });
    var eps = p.episodes.map(function (ep, i) {
      return '<li class="ep"><span class="n">' + (i + 1) + '</span><span class="thumb">' + poster({ color: p.color, art: p.art, title: "" }, { noTitle: true, photo: thumbs.length ? thumbs[i % thumbs.length][0] : "" }) + '</span>' +
        '<div><h4>' + esc(ep[0]) + '<span>LAP ' + (i + 1) + '</span></h4><p>' + esc(ep[1]) + '</p></div></li>';
    }).join("");
    var more = S.projects.filter(function (q) { return q !== p; }).slice(0, 6).map(function (q) {
      return '<button class="more-card" type="button" data-more="' + q.id + '"><div class="ma">' + poster(q) + '</div><div class="mb">' +
        '<div class="m-meta"><b class="mc-t">' + esc(q.title) + '</b><span class="box">' + esc(q.year) + '</span></div><p>' + esc(q.logline) + '</p></div></button>';
    }).join("");
    openModal(
      '<div class="m-hero">' + poster(p, { noTitle: true }).replace('class="art"', 'class="m-art"') +
      '<div class="m-hero-c"><h2 id="modalTitle">' + esc(p.title) + '</h2><div class="bb-actions">' + heroActions(p) + '</div></div></div>' +
      '<div class="m-body"><div class="m-cols"><div>' +
      '<div class="m-meta"><span class="gridpos">P' + idx + '</span><span>' + esc(p.year) + '</span>' + (p.badge ? '<span class="badge">' + esc(p.badge) + '</span>' : "") + '</div>' +
      '<p class="m-log">' + esc(p.logline) + '</p><p class="m-syn">' + esc(p.synopsis) + '</p></div>' +
      '<div class="m-side"><p><b>Built with: </b>' + p.cast.map(esc).join(", ") + '</p><p><b>Area: </b>' + p.genre.split(" · ").map(esc).join(", ") + '</p></div></div>' +
      (p.gallery ? '<h3 class="m-h3">Behind the Scenes</h3><div class="bts">' + p.gallery.map(function (g) {
        return '<button type="button" class="bts-item" data-lb="' + esc(g[0]) + '" data-cap="' + esc(g[1]) + '"><img src="' + esc(g[0]) + '" alt="' + esc(g[1]) + '" loading="lazy"' + (g[2] === "contain" ? ' style="object-fit:contain"' : "") + '><span>' + esc(g[1]) + '</span></button>';
      }).join("") + '</div>' : "") +
      '<h3 class="m-h3">Highlights <small>' + p.episodes.length + ' laps</small></h3><ol class="eps">' + eps + '</ol>' +
      '<h3 class="m-h3">More Builds</h3><div class="more-grid">' + more + '</div></div>'
    );
  }

  function openBuilding(b) {
    openModal(
      '<div class="m-hero">' + poster({ color: b.color, art: "", title: "" }, { noTitle: true }).replace('class="art"', 'class="m-art"') +
      '<div class="m-hero-c"><h2 id="modalTitle">' + esc(b.title) + '</h2><div class="bb-actions">' + (b.repo ? '<a class="btn btn-play" href="' + esc(b.repo) + '" target="_blank" rel="noopener">' + ICON.code + 'Follow along</a>' : '<span class="btn btn-info" style="cursor:default">Repository coming soon</span>') + '</div></div></div>' +
      '<div class="m-body"><div class="m-meta"><span class="match">In the garage</span><span class="box">' + esc(b.status) + '</span></div>' +
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
      '<div class="m-hero" style="aspect-ratio:16/6">' + poster({ color: ["#3a0a12", "#E10600"], art: "", title: "" }, { noTitle: true }).replace('class="art"', 'class="m-art"') +
      '<div class="m-hero-c"><h2 id="modalTitle">' + esc(S.name) + '</h2></div></div>' +
      '<div class="m-body"><div class="about-grid"><img src="./assets/img/blazer.jpg" alt="Hemashree">' +
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
