#!/usr/bin/env python3
"""Generate public/images/architecture.svg — the homepage architecture diagram.

Editable rebuild of the PPT-exported diagram with the review changes applied:
  - Runner shows hosts "Your machine / Modal / Daytona" (no "sandbox" wording)
  - OpenTelemetry logo added alongside MLflow
  - Right-hand interfaces are placeholder screenshot frames (drop real captures in)
  - All labels are live system-ui text (matches the site font); output is SVG

Logos are embedded as base64 data-URIs so the file works when loaded via <img>.
Run:  python3 scripts/build-architecture-svg.py
"""
import base64
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public/images/architecture.svg"

# ---- palette (from app/globals.css) ----
FG = "#15131a"
FG_SOFT = "#5c5765"
ACCENT = "#ed1c9c"
ACCENT_SOFT = "#fce6f4"
BORDER = "#ece8ee"
GREY_PINK = "#f6f3f7"
FONT = "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"

def data_uri(relpath):
    p = ROOT / relpath
    raw = p.read_bytes()
    if p.suffix == ".svg":
        mime = "image/svg+xml"
    elif p.suffix == ".png":
        mime = "image/png"
    else:
        raise ValueError(p.suffix)
    return f"data:{mime};base64," + base64.b64encode(raw).decode()


# ---- Otto the starfish mascot (public/images/favicon.svg), as a reusable symbol ----
MASCOT = (f'<symbol id="otto" viewBox="0 0 1024 1024">'
          f'<image href="{data_uri("public/images/favicon.svg")}" width="1024" height="1024"/>'
          f'</symbol>')


def mascot(x, y, s):
    return f'<use href="#otto" x="{x}" y="{y}" width="{s}" height="{s}"/>'


def text(x, y, s, weight=400, fill=FG, anchor="start", spacing=None):
    sp = f' letter-spacing="{spacing}"' if spacing else ""
    return (f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{s}" '
            f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}"{sp}>{{}}</text>')


def rrect(x, y, w, h, r, fill, stroke="none", sw=1, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" ry="{r}" '
            f'fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>')


def chip(cx, y, w, label, h=30):
    x = cx - w / 2
    out = [rrect(x, y, w, h, h / 2, ACCENT)]
    out.append(text(cx, y + h / 2 + 5, 14.5, 600, "#ffffff", "middle").format(label))
    return "".join(out)


def img(cx, cy, w, h, href):
    """Place an image centered in a (w x h) box, preserving aspect ratio."""
    return (f'<image href="{href}" x="{cx-w/2}" y="{cy-h/2}" width="{w}" height="{h}" '
            f'preserveAspectRatio="xMidYMid meet"/>')


def logo_tile(cx, cy, label, href, tile=46, iw=None, ih=None):
    """White rounded tile with a centered logo + label below."""
    iw = iw or tile - 12
    ih = ih or tile - 12
    x = cx - tile / 2
    y = cy - tile / 2
    out = [rrect(x, y, tile, tile, 11, "#ffffff", BORDER, 1)]
    out.append(f'<image href="{href}" x="{cx-iw/2}" y="{cy-ih/2}" width="{iw}" '
               f'height="{ih}" preserveAspectRatio="xMidYMid meet"/>')
    out.append(text(cx, cy + tile / 2 + 16, 12.5, 500, FG_SOFT, "middle").format(label))
    return "".join(out)


def dotted(x1, y1, x2, y2):
    return (f'<path d="M{x1} {y1} L{x2} {y2}" stroke="{ACCENT}" stroke-width="2.2" '
            f'stroke-linecap="round" stroke-dasharray="0.1 7" fill="none"/>')


W, H = 1200, 545
parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
         f'font-family="{FONT}">', f'<defs>{MASCOT}</defs>']

# ---------- connectors (draw first, sit behind boxes) ----------
MIDY = 238
# inputs -> runner
parts.append(dotted(190, 132, 314, MIDY - 24))   # CLI agents
parts.append(dotted(190, 346, 314, MIDY + 24))   # custom agents
# runner -> server
parts.append(dotted(532, MIDY, 588, MIDY))
# server -> interfaces (fan out)
IFACE_X = 968
iface_rows = [84, 148, 212, 276, 340]   # icon centres (cy=row+26) symmetric on MIDY
for ry in iface_rows:
    parts.append(dotted(848, MIDY, IFACE_X, ry + 26))
# server -> infra. Three functional clusters, grouped by proximity (no labels):
#   persistence (Postgres) | deploy (Docker/Railway/Fly.io) | tracing (MLflow/OTel)
# Stacked vertically within each cluster to use vertical space instead of one wide row.
# Three proximity-grouped clusters of bare logos (no labels), packed loosely
# like the agent clusters on the left. Gaps between clusters do the grouping.
PG   = data_uri("public/logos/observability/postgresql.svg")
DOCK = data_uri("public/logos/observability/docker.svg")
RAIL = data_uri("public/logos/platforms/railway.svg")
FLY  = data_uri("public/logos/platforms/flyio.svg")
MLF  = data_uri("public/logos/observability/mlflow.svg")
OTEL = data_uri("public/logos/observability/opentelemetry.svg")
# Clusters centred on a vertical from the server (718): deploy straight below,
# persistence + tracing symmetric either side (±128).
infra_logos = [  # (cx, cy, w, h, href)
    # persistence
    (590, 444, 56, 56, PG),
    # deploy: Docker over Railway + Fly.io (centred on 718)
    (718, 444, 50, 50, DOCK),
    (689, 500, 48, 48, RAIL),
    (747, 500, 48, 48, FLY),
    # tracing: MLflow (wordmark) + OpenTelemetry, side by side
    (820, 444, 70, 30, MLF),
    (876, 444, 42, 42, OTEL),
]
# connectors: centre drops straight down (90°), sides mirror it to the same y
for tx in (590, 718, 846):
    parts.append(dotted(718, 354, tx, 418))

# ---------- left inputs (real agent logos) ----------
AG = "public/logos/agents"
# CLI Agents: Claude Code, Codex, Pi
parts.append(text(118, 58, 17, 700, FG, "middle").format("CLI Agents"))
parts.append(img(118, 98, 50, 50, data_uri(f"{AG}/claude-code.png")))
parts.append(img(92, 150, 42, 42, data_uri(f"{AG}/codex.png")))
parts.append(img(146, 150, 42, 42, data_uri(f"{AG}/pi.png")))

# Custom Agents: YAML, OpenAI Agents SDK, Llama, Claude SDK
parts.append(text(118, 262, 17, 700, FG, "middle").format("Custom Agents"))
parts.append(img(118, 300, 44, 44, data_uri(f"{AG}/yaml.png")))
parts.append(img(118, 344, 132, 34, data_uri(f"{AG}/openai-agents.png")))
parts.append(img(90, 392, 44, 44, data_uri(f"{AG}/llama.png")))
parts.append(img(156, 392, 92, 26, data_uri(f"{AG}/claude-sdk.png")))

# ---------- Runner box (Sandboxing + Reliability, per Matei's slide) ----------
rx, ry, rw, rh = 316, 128, 216, 220
parts.append(rrect(rx, ry, rw, rh, 16, "#ffffff", ACCENT, 2.5))
parts.append(mascot(rx + 16, ry + 14, 30))
parts.append(text(rx + 54, ry + 36, 21, 700, FG).format("Runner"))

inner_x = rx + 14
inner_w = rw - 28
cxin = inner_x + inner_w / 2

# Sandboxing box: the cloud sandbox providers on one line, "more coming" below
sb_y, sb_h = ry + 56, 106
parts.append(rrect(inner_x, sb_y, inner_w, sb_h, 12, GREY_PINK))
parts.append(text(cxin, sb_y + 22, 14.5, 600, FG, "middle").format("Sandboxing"))
logo_cy = sb_y + 54
parts.append(img(cxin - 48, logo_cy, 40, 28, data_uri("public/logos/runners/modal.png")))
parts.append(img(cxin + 25, logo_cy, 86, 28, data_uri("public/logos/runners/daytona.png")))
parts.append(text(cxin, sb_y + 86, 12.5, 600, FG_SOFT, "middle").format("+ more"))

# Reliability box
rb_y, rb_h = sb_y + sb_h + 12, 32
parts.append(rrect(inner_x, rb_y, inner_w, rb_h, 9, GREY_PINK))
parts.append(text(cxin, rb_y + rb_h / 2 + 5, 14.5, 600, FG, "middle").format("Reliability"))

# ---------- Server box ----------
sx, sy, sw, sh = 588, 122, 262, 232
parts.append(rrect(sx, sy, sw, sh, 16, ACCENT_SOFT, ACCENT, 2.5))
parts.append(mascot(sx + 22, sy + 16, 30))
parts.append(text(sx + 60, sy + 38, 21, 700, FG).format("Server"))
server_pills = ["History", "Catalog", "Policies", "MCPs", "Artifacts", "Skills"]
pw, ph, gap = 104, 34, 12
gx = sx + 20
gy = sy + 64
for i, p in enumerate(server_pills):
    col, row = i % 2, i // 2
    px = gx + col * (pw + gap)
    py = gy + row * (ph + gap)
    parts.append(rrect(px, py, pw, ph, ph / 2, ACCENT))
    parts.append(text(px + pw / 2, py + ph / 2 + 5, 14.5, 600, "#ffffff", "middle").format(p))

# ---------- right interfaces (distinct icon per surface) ----------
# NOTE: Matei asked for real screenshots of terminal/web/native/mobile, with
# REST API as "an API symbol or the little mascot". These icons are the interim
# stand-in until real captures exist; REST API uses an API-braces symbol.
def _ic(cx, cy, body, sw=1.9):
    return (f'<g transform="translate({cx} {cy})" fill="none" stroke="{ACCENT}" '
            f'stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round">{body}</g>')

def ic_terminal(cx, cy):
    return _ic(cx, cy, '<rect x="-14" y="-11" width="28" height="22" rx="4"/>'
                       '<path d="M-7 -2 l4 3 l-4 3"/><path d="M1 4 h6"/>')

def ic_web(cx, cy):  # globe
    return _ic(cx, cy, '<circle cx="0" cy="0" r="13"/><path d="M-13 0 h26"/>'
                       '<path d="M0 -13 a18 18 0 0 1 0 26 a18 18 0 0 1 0 -26"/>'
                       '<path d="M-9.5 -6 h19 M-9.5 6 h19"/>')

def ic_native(cx, cy):  # desktop app window
    return _ic(cx, cy, '<rect x="-14" y="-11" width="28" height="22" rx="4"/>'
                       '<path d="M-14 -4 h28"/>'
                       '<circle cx="-10" cy="-7.5" r="1.2" fill="' + ACCENT + '" stroke="none"/>'
                       '<circle cx="-6" cy="-7.5" r="1.2" fill="' + ACCENT + '" stroke="none"/>'
                       '<circle cx="-2" cy="-7.5" r="1.2" fill="' + ACCENT + '" stroke="none"/>')

def ic_mobile(cx, cy):  # phone
    return _ic(cx, cy, '<rect x="-8" y="-13" width="16" height="26" rx="3.5"/>'
                       '<path d="M-2.5 9 h5"/>')

def ic_api(cx, cy):  # { } braces
    return _ic(cx, cy, '<path d="M-3 -11 q-5 0 -5 5 q0 4 -4 6 q4 2 4 6 q0 5 5 5"/>'
                       '<path d="M3 -11 q5 0 5 5 q0 4 4 6 q-4 2 -4 6 q0 5 -5 5"/>'
                       '<circle cx="0" cy="0" r="1.4" fill="' + ACCENT + '" stroke="none"/>')

iface = [
    ("Terminal UI", ic_terminal),
    ("Web UI",      ic_web),
    ("Native App",  ic_native),
    ("Mobile UI",   ic_mobile),
    ("REST API",    ic_api),
]
for (label, icon), ry2 in zip(iface, iface_rows):
    cy = ry2 + 26
    parts.append(icon(IFACE_X + 20, cy))
    parts.append(text(IFACE_X + 48, cy + 6, 16, 600, FG).format(label))

# ---------- infra clusters (bare logos, no labels) ----------
for cx, cy, w, h, href in infra_logos:
    parts.append(img(cx, cy, w, h, href))

parts.append("</svg>")
OUT.write_text("\n".join(parts))
print("wrote", OUT, OUT.stat().st_size, "bytes")
