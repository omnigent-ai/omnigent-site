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

# ---- octopus mascot (from public/images/favicon.svg), as a reusable symbol ----
OCTO = """
<symbol id="octo" viewBox="0 0 84 90">
  <path d="M78.6931 68.2599C77.7222 63.6072 78.3719 58.7005 80.7991 54.6079C82.6811 51.4339 83.7192 47.2816 83.7192 41.8596C83.7192 18.7379 64.9739 0 41.8596 0C18.7453 0 0 18.7379 0 41.8596C0 47.289 1.03809 51.4339 2.92009 54.6079C5.295 58.6109 5.97461 63.413 5.11576 67.991C4.99627 68.6408 4.89918 69.1412 4.83196 69.41C2.97237 77.5878 1.98656 81.5758 2.65123 84.0254C3.22629 86.1314 4.60792 87.7446 6.54966 88.5661C7.45332 88.947 8.4242 89.1412 9.42494 89.1412C10.829 89.1412 12.2853 88.7603 13.6594 88.0134C15.6759 86.9156 19.5818 81.5459 23.4578 75.646C24.0254 80.6796 24.7872 84.9963 25.7356 86.5273C26.9156 88.4466 28.7528 89.6565 30.9037 89.9328C31.2024 89.9701 31.5011 89.9925 31.7999 89.9925C33.8163 89.9925 35.8327 89.1486 37.4309 87.5952C38.6781 86.3854 40.2465 82.5766 41.8596 77.6998C43.4727 82.5691 45.0336 86.3854 46.2883 87.5952C47.894 89.1412 49.9029 89.9925 51.9193 89.9925C52.2181 89.9925 52.5168 89.9776 52.8155 89.9328C54.9664 89.6639 56.8036 88.4541 57.9836 86.5273C58.932 84.9888 59.6938 80.6796 60.2614 75.6385C64.1374 81.5385 68.0433 86.9081 70.0597 88.006C71.4264 88.7528 72.8828 89.1337 74.2943 89.1337C75.295 89.1337 76.2659 88.947 77.1695 88.5586C79.1038 87.7297 80.4929 86.1165 81.068 84.0179C81.7401 81.5683 80.6124 76.6692 78.7528 68.4989C78.7379 68.4317 78.7155 68.3495 78.7005 68.2524L78.6931 68.2599Z" fill="#F43BA6"/>
  <path d="M36.6542 57.4313C39.5743 60.5978 44.9514 60.5232 47.0649 57.2969" stroke="black" stroke-width="2.9873" stroke-miterlimit="10" stroke-linecap="round"/>
  <path d="M60.493 62.8382C63.2482 62.8382 65.4818 61.5877 65.4818 60.0451C65.4818 58.5025 63.2482 57.252 60.493 57.252C57.7377 57.252 55.5042 58.5025 55.5042 60.0451C55.5042 61.5877 57.7377 62.8382 60.493 62.8382Z" fill="#FF75C3"/>
  <path d="M23.2263 62.8382C25.9816 62.8382 28.2151 61.5877 28.2151 60.0451C28.2151 58.5025 25.9816 57.252 23.2263 57.252C20.4711 57.252 18.2375 58.5025 18.2375 60.0451C18.2375 61.5877 20.4711 62.8382 23.2263 62.8382Z" fill="#FF75C3"/>
  <path d="M21.3532 55.5336C28.728 55.5336 34.7065 49.5552 34.7065 42.1804C34.7065 34.8056 28.728 28.8271 21.3532 28.8271C13.9785 28.8271 8 34.8056 8 42.1804C8 49.5552 13.9785 55.5336 21.3532 55.5336Z" fill="white"/>
  <path d="M21.3532 52.5911C27.1029 52.5911 31.764 47.9301 31.764 42.1804C31.764 36.4307 27.1029 31.7696 21.3532 31.7696C15.6035 31.7696 10.9425 36.4307 10.9425 42.1804C10.9425 47.9301 15.6035 52.5911 21.3532 52.5911Z" fill="black"/>
  <path d="M18.6348 41.8516C19.7525 41.8516 20.6592 42.7582 20.6592 43.876C20.659 44.9936 19.7524 45.8994 18.6348 45.8994C17.5171 45.8994 16.6115 44.9936 16.6113 43.876C16.6113 42.7582 17.517 41.8516 18.6348 41.8516ZM13.0039 36.9004C14.6371 36.9005 15.9608 38.2243 15.9609 39.8574C15.9609 41.4907 14.6372 42.8153 13.0039 42.8154C11.3706 42.8154 10.0459 41.4908 10.0459 39.8574C10.0461 38.2242 11.3707 36.9004 13.0039 36.9004Z" fill="white"/>
  <path d="M62.0635 55.5336C69.4383 55.5336 75.4167 49.5552 75.4167 42.1804C75.4167 34.8056 69.4383 28.8271 62.0635 28.8271C54.6887 28.8271 48.7102 34.8056 48.7102 42.1804C48.7102 49.5552 54.6887 55.5336 62.0635 55.5336Z" fill="white"/>
  <path d="M62.0635 52.5911C67.8132 52.5911 72.4742 47.9301 72.4742 42.1804C72.4742 36.4307 67.8132 31.7696 62.0635 31.7696C56.3138 31.7696 51.6527 36.4307 51.6527 42.1804C51.6527 47.9301 56.3138 52.5911 62.0635 52.5911Z" fill="black"/>
  <path d="M59.345 41.8516C60.4628 41.8516 61.3694 42.7582 61.3694 43.876C61.3692 44.9936 60.4627 45.8994 59.345 45.8994C58.2273 45.8994 57.3217 44.9936 57.3215 43.876C57.3215 42.7582 58.2272 41.8516 59.345 41.8516ZM53.7141 36.9004C55.3473 36.9005 56.671 38.2243 56.6712 39.8574C56.6712 41.4907 55.3474 42.8153 53.7141 42.8154C52.0808 42.8154 50.7561 41.4908 50.7561 39.8574C50.7563 38.2242 52.0809 36.9004 53.7141 36.9004Z" fill="white"/>
</symbol>
"""


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


def octo(x, y, s):
    return f'<use href="#octo" x="{x}" y="{y}" width="{s}" height="{s*90/84:.1f}"/>'


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
         f'font-family="{FONT}">', f'<defs>{OCTO}</defs>']

# ---------- connectors (draw first, sit behind boxes) ----------
MIDY = 238
# inputs -> runner
parts.append(dotted(186, 140, 318, MIDY - 16))   # CLI agents
parts.append(dotted(186, 360, 318, MIDY + 36))   # custom agents
# runner -> server
parts.append(dotted(497, MIDY, 588, MIDY))
# server -> interfaces (fan out)
IFACE_X = 968
iface_rows = [70, 138, 206, 274, 342]
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
infra_logos = [  # (cx, cy, w, h, href)
    # persistence
    (560, 460, 56, 56, PG),
    # deploy: Docker over Railway + Fly.io
    (690, 436, 50, 50, DOCK),
    (661, 492, 48, 48, RAIL),
    (719, 492, 48, 48, FLY),
    # tracing: MLflow (wordmark) + OpenTelemetry, side by side
    (828, 461, 72, 30, MLF),
    (888, 461, 42, 42, OTEL),
]
# one connector from the server to each cluster
for tx, ty in [(560, 432), (690, 408), (850, 436)]:
    parts.append(dotted(718, 352, tx, ty))

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

# ---------- Runner box ----------
rx, ry, rw, rh = 320, 146, 178, 196
parts.append(rrect(rx, ry, rw, rh, 16, "#ffffff", ACCENT, 2.5))
parts.append(octo(rx + 18, ry + 16, 30))
parts.append(text(rx + 56, ry + 38, 21, 700, FG).format("Runner"))
# host rows with logos (replaces the Sandboxing / Reliability pills)
row_x, row_w, row_h = rx + 16, rw - 32, 32
hy = ry + 58


def host_row(y, draw_mark, label=None, full_logo=None):
    """A light pill holding a centered logo (+ optional label) for one host."""
    out = [rrect(row_x, y, row_w, row_h, 9, GREY_PINK)]
    cx, cy = row_x + row_w / 2, y + row_h / 2
    if full_logo:  # wide lockup that already contains its name (Daytona)
        out.append(img(cx, cy, row_w - 22, row_h - 14, full_logo))
    else:
        # centre the [mark + gap + label] group within the row
        tw = len(label) * 14.5 * 0.56
        group = 22 + 8 + tw
        mx = cx - group / 2 + 11
        out.append(draw_mark(mx, cy))
        out.append(text(mx + 19, cy + 5, 14.5, 600, FG).format(label))
    return "".join(out)


def laptop(cx, cy):
    return (f'<g stroke="{FG}" stroke-width="1.7" fill="none" stroke-linejoin="round">'
            f'<rect x="{cx-10}" y="{cy-8}" width="20" height="13" rx="1.5"/>'
            f'<path d="M{cx-13} {cy+8} L{cx+13} {cy+8}" stroke-linecap="round"/></g>')


def modal_mark(cx, cy):
    return img(cx, cy, 22, 22, data_uri("public/logos/runners/modal.png"))


parts.append(host_row(hy, laptop, "Your machine"))
parts.append(host_row(hy + 46, modal_mark, "Modal"))
parts.append(host_row(hy + 92, None, full_logo=data_uri("public/logos/runners/daytona.png")))

# ---------- Server box ----------
sx, sy, sw, sh = 588, 120, 262, 232
parts.append(rrect(sx, sy, sw, sh, 16, ACCENT_SOFT, ACCENT, 2.5))
parts.append(octo(sx + 22, sy + 16, 30))
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
# REST API as "an API symbol or the little octopus". These icons are the interim
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
