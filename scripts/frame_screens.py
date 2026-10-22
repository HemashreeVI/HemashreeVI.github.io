#!/usr/bin/env python3
"""Wraps README screenshots in a wine-coloured browser frame.

    python3 scripts/frame_screens.py

Reads assets/readme/<name>.jpg and writes assets/readme/framed-<name>.webp.
Needs Pillow.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
DIR = ROOT / "assets" / "readme"
MONO = "/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Regular.ttf"

SHOTS = {
    "hero": "hemashreevi.github.io/?profile=recruiter",
    "lights": "hemashreevi.github.io",
    "launch": "hemashreevi.github.io",
    "gate": "hemashreevi.github.io",
    "car": "hemashreevi.github.io  ·  page transition",
    "skills": "hemashreevi.github.io/#row-skills",
    "rows": "hemashreevi.github.io/#row-top10",
    "modal": "hemashreevi.github.io  ·  Hazard Rover",
    "mobile": "hemashreevi.github.io",
}


def rounded(im, r):
    m = Image.new("L", im.size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, im.width - 1, im.height - 1], r, fill=255)
    out = Image.new("RGBA", im.size)
    out.paste(im, (0, 0), m)
    return out


def frame(name, url):
    shot = Image.open(DIR / f"{name}.jpg").convert("RGB")
    mobile = shot.height > shot.width
    W = 1200 if not mobile else 520
    shot = shot.resize((W, int(shot.height * W / shot.width)), Image.LANCZOS)
    bar = 44 if not mobile else 40
    pad = 34
    win = Image.new("RGB", (W, shot.height + bar), "#1F0C16")
    d = ImageDraw.Draw(win)
    for i, c in enumerate(["#FF6B8A", "#C77B9B", "#8FE3C8"]):
        d.ellipse([18 + i * 22, bar / 2 - 6, 30 + i * 22, bar / 2 + 6], fill=c)
    try:
        font = ImageFont.truetype(MONO, 15 if not mobile else 13)
    except OSError:
        font = ImageFont.load_default()
    if not mobile:
        d.rounded_rectangle([110, 9, W - 110, bar - 9], 13, fill="#2A0E1B")
        d.text((W / 2, bar / 2), url, font=font, fill="#D8C4CD", anchor="mm")
    win.paste(shot, (0, bar))
    win = rounded(win, 16)

    canvas = Image.new("RGBA", (W + pad * 2, win.height + pad * 2), (0, 0, 0, 0))
    glow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(glow).rounded_rectangle([pad - 4, pad + 8, pad + W + 4, pad + win.height + 14], 20, fill=(112, 26, 61, 150))
    glow = glow.filter(ImageFilter.GaussianBlur(18))
    canvas.alpha_composite(glow)
    border = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(border).rounded_rectangle([pad - 1, pad - 1, pad + W, pad + win.height], 17, outline=(199, 123, 155, 120), width=2)
    canvas.alpha_composite(win, (pad, pad))
    canvas.alpha_composite(border)
    out = DIR / f"framed-{name}.webp"
    canvas.save(out, "WEBP", quality=84, method=6)
    print(f"  {out.name:24s} {out.stat().st_size / 1024:7.1f} KB")


if __name__ == "__main__":
    for n, u in SHOTS.items():
        frame(n, u)
