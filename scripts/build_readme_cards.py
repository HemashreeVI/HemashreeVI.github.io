#!/usr/bin/env python3
"""Builds the animated SVG cards used by this repo's README.

    python3 scripts/build_readme_cards.py

Output goes to assets/readme/cards/. Needs Pillow (for the photo in the hero).
Screenshot frames are made separately by scripts/frame_screens.py.
"""
import base64
import io
import math
import random
from pathlib import Path
from xml.sax.saxutils import escape

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "readme" / "cards"
PHOTO = ROOT / "assets" / "img" / "hero.jpg"

# ---------------------------------------------------------------- palette (wine & rose)
C = {
    "bg0": "#10070C",
    "bg1": "#190B12",
    "bg2": "#2A0E1B",
    "panel": "#1F0C16",
    "line": "#3A1828",
    "line2": "#4E2236",
    "violet": "#701A3D",
    "lav": "#C77B9B",
    "lilac": "#E5B5C7",
    "silver": "#F8F0F3",
    "mist": "#D8C4CD",
    "muted": "#B6A3AC",
    "dim": "#7C6570",
    "rose": "#FF8FB1",
    "mint": "#8FE3C8",
}

SERIF = "'Iowan Old Style','Palatino Linotype',Palatino,Georgia,'Times New Roman',serif"
SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif"
MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace"

# ---------------------------------------------------------------- helpers
def e(s):
    return escape(str(s), {'"': "&quot;"})


STYLE = f"""
<style>
.serif{{font-family:{SERIF}}}
.sans{{font-family:{SANS}}}
.mono{{font-family:{MONO}}}
.kick{{font-family:{MONO};font-size:12px;letter-spacing:3px;fill:{C['lav']}}}
.twinkle{{animation:tw 4s ease-in-out infinite}}
@keyframes tw{{0%,100%{{opacity:.15}}50%{{opacity:.9}}}}
.pulse{{animation:pl 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}}
@keyframes pl{{0%,100%{{opacity:.55;transform:scale(1)}}50%{{opacity:1;transform:scale(1.35)}}}}
.spin{{animation:sp 60s linear infinite;transform-box:view-box}}
@keyframes sp{{to{{transform:rotate(360deg)}}}}
.float{{animation:fl 6s ease-in-out infinite}}
@keyframes fl{{0%,100%{{transform:translateY(0)}}50%{{transform:translateY(-6px)}}}}
.fadein{{animation:fi 1.2s ease-out both}}
@keyframes fi{{from{{opacity:0;transform:translateY(8px)}}to{{opacity:1;transform:none}}}}
</style>"""


def base_defs(uid):
    return f"""
<defs>
  <radialGradient id="{uid}-bg" cx="70%" cy="30%" r="90%">
    <stop offset="0" stop-color="{C['bg2']}"/>
    <stop offset=".55" stop-color="{C['bg1']}"/>
    <stop offset="1" stop-color="{C['bg0']}"/>
  </radialGradient>
  <radialGradient id="{uid}-glowA" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="{C['violet']}" stop-opacity=".45"/>
    <stop offset="1" stop-color="{C['violet']}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="{uid}-glowB" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="{C['silver']}" stop-opacity=".12"/>
    <stop offset="1" stop-color="{C['silver']}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="{uid}-silver" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#FFFFFF"/>
    <stop offset=".5" stop-color="{C['mist']}"/>
    <stop offset="1" stop-color="{C['lav']}"/>
  </linearGradient>
  <linearGradient id="{uid}-rule" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="{C['lav']}" stop-opacity="0"/>
    <stop offset=".25" stop-color="{C['lav']}" stop-opacity=".8"/>
    <stop offset="1" stop-color="{C['lav']}" stop-opacity="0"/>
  </linearGradient>
  <pattern id="{uid}-grid" width="28" height="28" patternUnits="userSpaceOnUse">
    <path d="M28 0H0V28" fill="none" stroke="{C['lav']}" stroke-opacity=".05"/>
  </pattern>
  <filter id="{uid}-soft" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="3"/>
  </filter>
</defs>"""


def frame(w, h, uid, glow=(0.75, 0.3)):
    gx, gy = glow
    return f"""
<rect x="1" y="1" width="{w-2}" height="{h-2}" rx="22" fill="url(#{uid}-bg)" stroke="{C['line']}"/>
<rect x="1" y="1" width="{w-2}" height="{h-2}" rx="22" fill="url(#{uid}-grid)"/>
<ellipse cx="{w*gx:.0f}" cy="{h*gy:.0f}" rx="{w*0.35:.0f}" ry="{h*0.7:.0f}" fill="url(#{uid}-glowA)"/>
<ellipse cx="{w*(1-gx):.0f}" cy="{h*(1-gy):.0f}" rx="{w*0.25:.0f}" ry="{h*0.5:.0f}" fill="url(#{uid}-glowB)"/>"""


def stars(w, h, n, seed, pad=20):
    rnd = random.Random(seed)
    out = []
    for i in range(n):
        x, y = rnd.uniform(pad, w - pad), rnd.uniform(pad, h - pad)
        r = rnd.choice([0.8, 1, 1.2, 1.6])
        d = rnd.uniform(0, 4)
        out.append(f'<circle class="twinkle" cx="{x:.0f}" cy="{y:.0f}" r="{r}" fill="{C["silver"]}" style="animation-delay:{d:.1f}s"/>')
    return "\n".join(out)


def svg(w, h, uid, title, desc, body):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-labelledby="{uid}-t {uid}-d">
<title id="{uid}-t">{e(title)}</title>
<desc id="{uid}-d">{e(desc)}</desc>
{STYLE}
{base_defs(uid)}
{body}
</svg>
"""


def text(x, y, s, size, fill, cls="sans", anchor="start", extra=""):
    return f'<text x="{x}" y="{y}" class="{cls}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" {extra}>{e(s)}</text>'


def wrap(s, n):
    words, lines, cur = s.split(), [], ""
    for w in words:
        if len(cur) + len(w) + 1 > n and cur:
            lines.append(cur)
            cur = w
        else:
            cur = f"{cur} {w}".strip()
    if cur:
        lines.append(cur)
    return lines


def mono_w(s, size):
    # Approximate advance of a monospace glyph; CJK glyphs are double width.
    return sum(size * (1.2 if ord(ch) > 0x2E80 else 0.61) for ch in s)


def chip(x, y, label, size=11, fill=None, stroke=None, color=None):
    w = mono_w(label, size) + 22
    return (
        f'<rect x="{x}" y="{y}" width="{w:.0f}" height="24" rx="12" fill="{fill or C["panel"]}" stroke="{stroke or C["line2"]}"/>'
        + text(x + 11, y + 16, label, size, color or C["mist"], "mono")
    ), w


def chips(x, y, labels, gap=8, maxw=None, **kw):
    out, cx, cy = [], x, y
    for lb in labels:
        w = mono_w(lb, kw.get("size", 11)) + 22
        if maxw and cx + w > x + maxw:
            cx, cy = x, cy + 32
        s, w = chip(cx, cy, lb, **kw)
        out.append(s)
        cx += w + gap
    return "\n".join(out)


def write(name, content):
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / name).write_text(content, encoding="utf-8")
    print(f"  {name:28s} {len(content.encode()) / 1024:6.1f} KB")


# ---------------------------------------------------------------- section titles
def build_title(num, kicker, plain, italic, right, slug):
    W, H, u = 1200, 104, f"t{num}"
    width_plain = len(plain) * 19
    body = f"""
{text(30, 32, num, 12, C['silver'], 'mono', 'start', 'letter-spacing="3"')}
{text(58, 32, kicker, 12, C['lav'], 'mono', 'start', 'letter-spacing="3"')}
{text(1170, 32, right, 11, C['muted'], 'mono', 'end', 'letter-spacing="3"')}
<text x="30" y="80" class="serif" font-size="40" fill="{C['silver']}">{e(plain)} <tspan fill="{C['lav']}" font-style="italic">{e(italic)}</tspan></text>
<rect x="30" y="96" width="1140" height="1.2" fill="url(#{u}-rule)"/>
<circle cy="96.6" r="2.6" fill="#fff">
  <animate attributeName="cx" values="30;1170" dur="6s" repeatCount="indefinite"/>
  <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.8;1" dur="6s" repeatCount="indefinite"/>
</circle>
"""
    write(f"title-{slug}.svg", svg(W, H, u, f"{num} {kicker.title()}: {plain} {italic}", right, body))



# ---------------------------------------------------------------- content
TYPING = [
    "lights out and away we go",
    "8 projects · 1 patent · 4 mini-games",
    "html · css · js · no framework, no build step",
    "every page change is an F1 car",
]

FEATURES = [
    ("lights", "Start lights", "Five red lights, lights out, and the name launches in. Click to skip."),
    ("seat", "Pick your seat", "Recruiter, Engineer, Explorer or Gamer. Every row reorders for you."),
    ("car", "F1 transitions", "An original top-down car drives up the screen between sections."),
    ("arc", "Skills arc", "Cards swing along an arc as you scroll, with real tech logos."),
    ("grid", "Starting grid", "Projects ranked P1 to P8, rows that slide in, hover previews."),
    ("modal", "Deep dives", "Highlights as laps, behind-the-scenes photos and code links."),
    ("game", "Mini-games", "Four playable demos built from real projects, on the classic site."),
    ("care", "Built with care", "Keyboard friendly, responsive, and it honours reduced motion."),
]

PROJECTS = [
    ("Smart Walker", "IoT · Healthcare", "Arduino · MPU6050 · HX711 · HC-SR04", "PATENT · FILING"),
    ("Hazard Rover", "Robotics · RL", "Raspberry Pi 5 · SLAM · YOLOv8n · A*", "REPO"),
    ("Dental X-Ray AI", "Computer vision", "YOLOv9 · Grad-CAM · Gradio", "REPO"),
    ("RootLens", "Reliability · AIOps", "FastAPI · Docker · Prometheus", "REPO"),
    ("TriageIQ", "LLM · Streaming", "Kafka · Ollama · Qdrant", "REPO"),
    ("Smart Grocer", "Multimodal AI", "YOLO · ESP32 · Firebase", "REPO"),
    ("Intrusion Detection", "Cybersecurity", "Python · Threat modeling", "PRIVATE"),
    ("Jarvis", "Voice assistant", "Python · SpeechRecognition", "REPO"),
]

TREE = [
    ("hemashreevi.github.io/", ""),
    ("├─ index.html", "home page"),
    ("├─ assets/js/data.js", "all the content"),
    ("├─ assets/js/app.js", "intro, profiles, rows, car"),
    ("├─ assets/css/site.css", "styles"),
    ("├─ assets/img/", "photos, certificates, logos"),
    ("├─ assets/readme/", "this README's art"),
    ("├─ classic/", "original site + mini-games"),
    ("├─ scripts/", "card + screenshot builders"),
    ("└─ resume.pdf", ""),
]

STACK = ["HTML5", "CSS3", "JavaScript", "Inline SVG", "Web Animations API", "IntersectionObserver", "GitHub Pages", "Google Fonts"]


def photo_b64(w=360):
    im = Image.open(PHOTO).convert("RGB")
    im = im.resize((w, int(im.height * w / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=80, optimize=True, progressive=True)
    return base64.b64encode(buf.getvalue()).decode()


# ---------------------------------------------------------------- hero
def build_hero():
    W, H, u = 1200, 520, "hero"
    per = 4.2
    total = per * len(TYPING)
    typed = []
    for i, ln in enumerate(TYPING):
        t0, t1, t3 = i * per / total, (i * per + 1.6) / total, (i + 1) * per / total
        full = round(mono_w(ln, 13) + 4)
        if i == 0:
            kt_w, v_w, kt_o, v_o = f"0;{t1:.4f};1", f"0;{full};{full}", f"0;{t3:.4f}", "1;0"
        else:
            kt_w, v_w = f"0;{t0:.4f};{t1:.4f};1", f"0;0;{full};{full}"
            kt_o, v_o = (f"0;{t0:.4f};{t3:.4f}", "0;1;0") if i < len(TYPING) - 1 else (f"0;{t0:.4f}", "0;1")
        typed.append(f"""
<clipPath id="hero-type{i}"><rect x="330" y="58" height="24" width="0">
  <animate attributeName="width" dur="{total}s" repeatCount="indefinite" keyTimes="{kt_w}" values="{v_w}"/>
</rect></clipPath>
<g clip-path="url(#hero-type{i})" opacity="{1 if i == 0 else 0}">
  <animate attributeName="opacity" dur="{total}s" repeatCount="indefinite" calcMode="discrete" keyTimes="{kt_o}" values="{v_o}"/>
  {text(332, 75, ln, 13, C['silver'], 'mono')}
</g>""")

    ax, ay, aw, ah = 822, 96, 236, 306
    r = aw / 2
    arch = f"M{ax},{ay+ah} L{ax},{ay+r} A{r},{r} 0 0 1 {ax+aw},{ay+r} L{ax+aw},{ay+ah} Z"
    cx, cy = ax + aw / 2, ay + ah / 2 + 6
    olab = []
    for lb, ang in [("LIGHTS", -128), ("GRID", -40), ("ARC", 35), ("CAR", 150)]:
        a = math.radians(ang)
        ox, oy = cx + 200 * math.cos(a), cy + 200 * math.sin(a)
        anchor = "start" if math.cos(a) > 0 else "end"
        olab.append(f'<circle class="pulse" cx="{ox:.0f}" cy="{oy:.0f}" r="3.5" fill="{C["lilac"]}"/>'
                    + text(round(ox + (10 if anchor == "start" else -10)), round(oy + 4), lb, 11, C["mist"], "mono", anchor, 'letter-spacing="2"'))

    body = f"""
{frame(W, H, u, (0.8, 0.35))}
<defs>
  <clipPath id="hero-arch"><path d="{arch}"/></clipPath>
  <linearGradient id="hero-fade" x1="0" y1="0" x2="0" y2="1"><stop offset=".6" stop-color="{C['bg1']}" stop-opacity="0"/><stop offset="1" stop-color="{C['bg1']}" stop-opacity=".85"/></linearGradient>
  <linearGradient id="hero-tint" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{C['lav']}" stop-opacity=".16"/><stop offset="1" stop-color="{C['violet']}" stop-opacity=".08"/></linearGradient>
  <linearGradient id="hero-rose" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{C['lilac']}"/><stop offset="1" stop-color="{C['lav']}"/></linearGradient>
  <linearGradient id="hero-sheen" gradientUnits="userSpaceOnUse" x1="-300" y1="0" x2="-60" y2="0">
    <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    <animateTransform attributeName="gradientTransform" type="translate" values="0 0;1000 0;1000 0" keyTimes="0;.45;1" dur="7s" repeatCount="indefinite"/>
  </linearGradient>
  <linearGradient id="hero-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{C['silver']}" stop-opacity=".6"/><stop offset=".5" stop-color="{C['lav']}" stop-opacity=".15"/><stop offset="1" stop-color="{C['silver']}" stop-opacity=".55"/></linearGradient>
</defs>
{stars(W, H, 44, 11)}

<rect x="60" y="52" width="640" height="36" rx="18" fill="{C['bg0']}" fill-opacity=".7" stroke="{C['line2']}"/>
<circle cx="80" cy="70" r="4" fill="{C['lav']}" class="pulse"/>
{text(94, 75, "~/hemashreevi.github.io", 13, C['muted'], 'mono')}
{text(312, 75, "$", 13, C['lav'], 'mono')}
{''.join(typed)}
<rect x="680" y="61" width="8" height="18" fill="{C['lilac']}"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></rect>

<line x1="60" y1="128" x2="92" y2="128" stroke="{C['lav']}"/>
{text(104, 132, "PORTFOLIO · SOFTWARE ENGINEER · VIT CHENNAI", 12, C['lav'], 'mono', 'start', 'letter-spacing="3"')}
<g class="fadein">
  {text(56, 210, "HEMASHREE", 84, f"url(#{u}-silver)", 'serif', 'start', 'letter-spacing="5"')}
  {text(56, 210, "HEMASHREE", 84, "url(#hero-sheen)", 'serif', 'start', 'letter-spacing="5" opacity=".5"')}
  <text x="54" y="292" class="serif" font-size="82" font-style="italic" fill="url(#hero-rose)">Portfolio<tspan fill="{C['rose']}">.</tspan></text>
</g>
<rect x="60" y="314" width="560" height="1.5" fill="url(#{u}-rule)"/>
<circle cx="60" cy="315" r="3" fill="#fff"><animate attributeName="cx" values="60;620;60" dur="9s" repeatCount="indefinite"/></circle>
{text(60, 350, "SOFTWARE ENGINEER · COMPUTER VISION · CPS", 13, C['silver'], 'sans', 'start', 'letter-spacing="4" font-weight="600"')}
{text(60, 384, "A portfolio that races: start lights, a starting grid, and an F1 car between pages.", 18, C['lilac'], 'serif', 'start', 'font-style="italic"')}
{chips(60, 404, ["Vanilla JS", "No build step", "GitHub Pages", "Mobile ready"], size=11)}

<line x1="60" y1="460" x2="1140" y2="460" stroke="{C['line']}"/>
{text(60, 488, "LIVE · HEMASHREEVI.GITHUB.IO", 11, C['silver'], 'mono', 'start', 'letter-spacing="2.5"')}
{text(1140, 488, "NO FRAMEWORK · ONE DATA FILE · 4 MINI-GAMES", 11, C['muted'], 'mono', 'end', 'letter-spacing="2.5"')}

<ellipse cx="{cx}" cy="{cy}" rx="260" ry="220" fill="url(#{u}-glowA)"/>
<circle cx="{cx}" cy="{cy}" r="200" fill="none" stroke="{C['lav']}" stroke-opacity=".22"/>
<g style="transform-origin:{cx}px {cy}px" class="spin">
  <circle cx="{cx}" cy="{cy}" r="176" fill="none" stroke="url(#hero-ring)" stroke-width="1.2" stroke-dasharray="2 10"/>
  <circle cx="{cx + 176}" cy="{cy}" r="3" fill="{C['silver']}"/>
</g>
{''.join(olab)}
<g class="float">
  <path d="{arch}" transform="translate(10 10)" fill="none" stroke="{C['lav']}" stroke-opacity=".45"/>
  <g clip-path="url(#hero-arch)">
    <image href="data:image/jpeg;base64,{photo_b64()}" x="{ax}" y="{ay}" width="{aw}" height="{ah}" preserveAspectRatio="xMidYMid slice"/>
    <rect x="{ax}" y="{ay}" width="{aw}" height="{ah}" fill="url(#hero-tint)"/>
    <rect x="{ax}" y="{ay}" width="{aw}" height="{ah}" fill="url(#hero-fade)"/>
  </g>
  <path d="{arch}" fill="none" stroke="url(#hero-ring)" stroke-width="1.5"/>
  <path d="M{ax-14},{ay+ah-40} v40 h40" fill="none" stroke="{C['silver']}" stroke-opacity=".7"/>
  <path d="M{ax+aw+14},{ay+ah-40} v40 h-40" fill="none" stroke="{C['silver']}" stroke-opacity=".7"/>
</g>
"""
    write("hero.svg", svg(W, H, u, "HEMASHREE · Portfolio",
                          "A motorsport-themed portfolio: start lights, a starting grid and an F1 car between pages. Vanilla HTML, CSS and JavaScript on GitHub Pages.", body))


# ---------------------------------------------------------------- features
def glyph(kind, x, y):
    L, R, S = C['lilac'], C['rose'], C['silver']
    g = f'<g transform="translate({x} {y})" fill="none" stroke="{L}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    if kind == "lights":
        g += ''.join(f'<circle cx="{4 + i * 9}" cy="12" r="3.6" fill="{R}" stroke="none"><animate attributeName="opacity" values=".25;1;1;.25" keyTimes="0;{0.1 + i * 0.12:.2f};.85;1" dur="3s" repeatCount="indefinite"/></circle>' for i in range(5))
        g += '<rect x="-2" y="4" width="48" height="16" rx="4"/>'
    elif kind == "seat":
        g += f'<circle cx="20" cy="8" r="5"/><path d="M8 30c0-8 5-13 12-13s12 5 12 13"/><path d="M36 4l4 4-4 4" stroke="{R}"/>'
    elif kind == "car":
        g += f'<path d="M16 2h10l3 10v18l-3 6H16l-3-6V12z" fill="{R}" fill-opacity=".25" stroke="{R}"/><path d="M8 4h26M8 34h26" stroke="{S}"/><circle cx="21" cy="18" r="3" fill="{S}" stroke="none"/>'
    elif kind == "arc":
        g += ''.join(f'<rect x="{12 + (i - 1) * 12}" y="6" width="16" height="22" rx="3" transform="rotate({(i - 1) * 18} {20 + (i - 1) * 12} 30)"{" stroke=" + chr(34) + R + chr(34) if i == 1 else ""}/>' for i in range(3))
    elif kind == "grid":
        g += f'<path d="M6 34V4"/><path d="M6 5h24l-5 6 5 6H6" fill="{R}" fill-opacity=".3" stroke="{R}"/>' + f'<text x="14" y="32" font-family="{SERIF}" font-style="italic" font-size="12" fill="{S}" stroke="none">P1</text>'
    elif kind == "modal":
        g += f'<rect x="2" y="4" width="38" height="28" rx="4"/><path d="M2 12h38"/><path d="M8 18h16M8 24h24" stroke="{S}" stroke-opacity=".7"/>'
    elif kind == "game":
        g += f'<rect x="2" y="10" width="38" height="20" rx="10"/><path d="M11 16v8M7 20h8" stroke="{S}"/><circle cx="29" cy="17" r="2" fill="{R}" stroke="none"/><circle cx="33" cy="22" r="2" fill="{R}" stroke="none"/>'
    elif kind == "care":
        g += f'<path d="M21 34S4 24 4 13a8 8 0 0 1 17-3 8 8 0 0 1 17 3c0 11-17 21-17 21z" fill="{R}" fill-opacity=".2" stroke="{R}"/><path d="M14 18l5 5 9-9" stroke="{S}"/>'
    return g + '</g>'


def build_features():
    W, H, u = 1200, 560, "feat"
    parts = [frame(W, H, u, (0.5, 0.45))]
    cw, ch = 271, 238
    for k, (kind, title, desc) in enumerate(FEATURES):
        col, row = k % 4, k // 4
        x, y = 32 + col * (cw + 13), 32 + row * (ch + 16)
        parts.append(f"""
<g class="fadein" style="animation-delay:{0.1 * k:.1f}s">
<rect x="{x}" y="{y}" width="{cw}" height="{ch}" rx="18" fill="{C['panel']}" stroke="{C['line2']}"/>
<rect x="{x}" y="{y + 18}" width="3" height="54" rx="1.5" fill="{C['lav']}"/>
{text(x + cw - 20, y + 34, f"0{k + 1}", 12, C['dim'], 'mono', 'end', 'letter-spacing="2"')}
{glyph(kind, x + 22, y + 26)}
{text(x + 22, y + 116, title, 25, C['silver'], 'serif')}
{''.join(text(x + 22, y + 150 + i * 20, ln, 13.5, C['muted'], 'sans') for i, ln in enumerate(wrap(desc, 34)[:3]))}
<rect x="{x + 22}" y="{y + ch - 18}" width="36" height="2" rx="1" fill="{C['lav']}"><animate attributeName="width" values="36;{cw - 44};36" dur="{6 + k}s" repeatCount="indefinite"/></rect>
</g>""")
    desc = "; ".join(f"{t}: {d}" for _, t, d in FEATURES)
    write("features.svg", svg(W, H, u, "What's inside", desc, "".join(parts)))


# ---------------------------------------------------------------- projects
def build_projects():
    rowh = 62
    W, H, u = 1200, 64 + rowh * len(PROJECTS), "proj"
    parts = [frame(W, H, u, (0.75, 0.3))]
    for k, (name, area, tech, status) in enumerate(PROJECTS):
        y = 32 + k * rowh
        col = C['mint'] if status == "REPO" else C['rose'] if status.startswith("PATENT") else C['dim']
        parts.append(f'<rect x="32" y="{y}" width="1136" height="52" rx="14" fill="{C["panel"]}" stroke="{C["line2"]}"/>')
        parts.append(f'<text x="58" y="{y + 35}" class="serif" font-size="22" font-style="italic" fill="{C["lav"]}">P{k + 1}</text>')
        parts.append(text(118, y + 34, name, 20, C['silver'], 'serif'))
        parts.append(text(360, y + 32, area, 13, C['lilac'], 'mono', 'start', 'letter-spacing="1"'))
        parts.append(text(580, y + 32, tech, 13.5, C['muted'], 'sans'))
        parts.append(f'<circle class="pulse" cx="{1150 - mono_w(status, 10.5) - len(status) * 2 - 14:.0f}" cy="{y + 27}" r="3.5" fill="{col}" style="animation-delay:{k * 0.3:.1f}s"/>')
        parts.append(text(1150, y + 31, status, 10.5, col, 'mono', 'end', 'letter-spacing="2"'))
    desc = "; ".join(f"P{i + 1} {n} ({a}): {t}" for i, (n, a, t, _) in enumerate(PROJECTS))
    write("projects.svg", svg(W, H, u, "Projects on the grid", desc, "".join(parts)))


# ---------------------------------------------------------------- stack
def build_stack():
    W, H, u = 1200, 440, "stack"
    tx, ty, tw, th = 32, 30, 640, 380
    rows, y = [], ty + 70
    for i, (path, note) in enumerate(TREE):
        t = 0.2 + i * 0.12
        rows.append(f'<g opacity="0"><animate attributeName="opacity" values="0;1" begin="{t:.2f}s" dur=".3s" fill="freeze"/>'
                    + text(tx + 28, y, path, 13.5, C['silver'] if i == 0 else C['mist'], 'mono')
                    + (text(tx + 330, y, "# " + note, 12.5, C['dim'], 'mono') if note else "") + '</g>')
        y += 29
    stats = [("0", "frameworks"), ("0", "build steps"), ("1", "content file"), ("31", "self-hosted logos")]
    tiles = []
    for k, (big, small) in enumerate(stats):
        x, yy = 700 + (k % 2) * 238, 30 + (k // 2) * 118
        tiles.append(f'<rect x="{x}" y="{yy}" width="226" height="104" rx="16" fill="{C["panel"]}" stroke="{C["line2"]}"/>'
                     f'<rect x="{x}" y="{yy + 16}" width="3" height="72" rx="1.5" fill="{C["lav"]}"/>'
                     + text(x + 22, yy + 58, big, 38, C['silver'], 'serif') + text(x + 22, yy + 84, small, 13, C['muted'], 'sans'))
    body = f"""
{frame(W, H, u, (0.8, 0.3))}
<rect x="{tx}" y="{ty}" width="{tw}" height="{th}" rx="14" fill="{C['bg0']}" fill-opacity=".85" stroke="{C['line2']}"/>
<path d="M{tx} {ty + 36}H{tx + tw}" stroke="{C['line']}"/>
<circle cx="{tx + 20}" cy="{ty + 18}" r="5" fill="{C['rose']}" fill-opacity=".7"/><circle cx="{tx + 38}" cy="{ty + 18}" r="5" fill="{C['lav']}" fill-opacity=".7"/><circle cx="{tx + 56}" cy="{ty + 18}" r="5" fill="{C['mint']}" fill-opacity=".7"/>
{text(tx + tw / 2, ty + 23, "tree -L 2", 12, C['muted'], 'mono', 'middle')}
{''.join(rows)}
{''.join(tiles)}
{chips(700, 284, STACK, size=11, maxw=470)}
"""
    desc = "Project layout: " + "; ".join(p + (" (" + n + ")" if n else "") for p, n in TREE) + ". Stack: " + ", ".join(STACK)
    write("stack.svg", svg(W, H, u, "Built by hand", desc, body))


# ---------------------------------------------------------------- footer
def build_footer():
    W, H, u = 1200, 300, "foot"
    body = f"""
{frame(W, H, u, (0.5, 0.75))}
{stars(W, H, 30, 5)}
{text(600, 62, "BOX, BOX · LET'S BUILD SOMETHING FAST", 12, C['lav'], 'mono', 'middle', 'letter-spacing="4"')}
<text x="600" y="164" class="serif" font-size="96" font-style="italic" text-anchor="middle" fill="url(#{u}-silver)" letter-spacing="2">Hemashree<tspan fill="{C['rose']}">.</tspan></text>
<text x="600" y="164" class="serif" font-size="96" font-style="italic" text-anchor="middle" fill="none" stroke="#fff" stroke-width="1.4" stroke-dasharray="120 900" letter-spacing="2" opacity=".75">Hemashree<tspan>.</tspan><animate attributeName="stroke-dashoffset" values="1020;0" dur="6s" repeatCount="indefinite"/></text>
<rect x="380" y="192" width="440" height="1.2" fill="url(#{u}-rule)"/>
{text(600, 230, "Built by hand in Chennai · hemashreevi.github.io", 15, C['mist'], 'sans', 'middle')}
{text(600, 268, "よろしくお願いします", 18, C['lilac'], 'serif', 'middle')}
"""
    write("footer.svg", svg(W, H, u, "Hemashree", "Built by hand in Chennai. よろしくお願いします", body))


def main():
    print("building README cards →", OUT.relative_to(ROOT))
    build_hero()
    for t in [
        ("01", "PREVIEW", "Take a", "look.", "SCREENSHOTS", "preview"),
        ("02", "FEATURES", "What's", "inside.", "8 THINGS TO TRY", "features"),
        ("03", "PROJECTS", "On the", "grid.", "P1 – P8", "projects"),
        ("04", "STACK", "Built", "by hand.", "NO FRAMEWORK", "stack"),
        ("05", "RUN", "Run it", "locally.", "TWO COMMANDS", "run"),
        ("06", "CONNECT", "Let's", "talk.", "SAY HI", "connect"),
    ]:
        build_title(*t)
    build_features()
    build_projects()
    build_stack()
    build_footer()


if __name__ == "__main__":
    main()
