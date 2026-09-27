#!/usr/bin/env python3
"""Render the proposed System 5 per-term R_n / P_k / I_i,j relation atlas sheets."""

from __future__ import annotations

import json
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, FancyArrowPatch, FancyBboxPatch

ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = ROOT / "docs" / "diagrams" / "system5-term-relation-model.json"
IMAGE_DIR = ROOT / "docs" / "images"

BACKGROUND = "#F7F5F0"
INK = "#18212B"
MUTED = "#667085"
OBJECTIVE = "#155EEF"
SUBJECTIVE = "#7A5AF8"
UNIVERSAL = "#475467"
CYCLE = "#087E8B"
PROJECTION = "#B54708"
VIRTUAL = "#C01048"
UNRESOLVED = "#98A2B3"
WHITE = "#FFFFFF"

SERIES_COLORS = {
    "subjective-autonomic": SUBJECTIVE,
    "objective-somatic": OBJECTIVE,
    "transjective-universal": UNIVERSAL,
}

INTERFACE_X = {1: 0.0, 2: 1.35, 3: 2.7, 4: 4.05, 5: 5.4}
NODE_Y = 0.0
NODE_RADIUS = 0.34


def load_model() -> dict:
    model = json.loads(MODEL_PATH.read_text(encoding="utf-8"))
    if len(model["terms"]) != 20:
        raise ValueError(f"expected 20 terms, found {len(model['terms'])}")
    interface_ids = {record["id"] for record in model["interfaces"]}
    if interface_ids != {1, 2, 3, 4, 5}:
        raise ValueError("interfaces must be exactly 1 through 5")
    for term in model["terms"]:
        if term["runtimeMappings"]:
            raise ValueError(f"{term['termToken']} must not contain runtime mappings")
        for relation in term["cyclicRelations"] + term["linearProjections"]:
            if not set(relation["path"]).issubset(interface_ids):
                raise ValueError(f"{term['termToken']} {relation['id']} path is invalid")
        for image in term["virtualImages"]["images"]:
            if tuple(image["interfaces"]) not in {(3, 4), (4, 5), (3, 5)}:
                raise ValueError(f"{term['termToken']} {image['notation']} pair is invalid")
    evidence_ids = {record["evidenceId"] for record in model["provenance"]["evidence"]}
    records = [
        *model["terms"],
        *model["interfaces"],
        *model["notation"].values(),
        *model["views"].values(),
        *model["openQuestions"],
    ]
    for record in records:
        record_evidence = record.get("evidenceIds", [])
        if not record_evidence or not set(record_evidence).issubset(evidence_ids):
            raise ValueError(f"record has missing or unknown evidence IDs: {record}")
    for source in model["provenance"]["sources"]:
        if not (ROOT / source["sourceFile"]).is_file():
            raise ValueError(f"missing provenance source: {source['sourceFile']}")
    for view in model["views"].values():
        if not view["imageBase"].startswith("system5-rn-pk-iij"):
            raise ValueError(f"unexpected image base: {view['imageBase']}")
    return model


def save_figure(fig, stem: str, title: str, description: str):
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    png_path = IMAGE_DIR / f"{stem}.png"
    svg_path = IMAGE_DIR / f"{stem}.svg"
    fig.savefig(png_path, dpi=160, facecolor=BACKGROUND, bbox_inches="tight")
    fig.savefig(svg_path, format="svg", facecolor=BACKGROUND, bbox_inches="tight")
    plt.close(fig)

    svg = svg_path.read_text(encoding="utf-8")
    svg = "\n".join(line.rstrip() for line in svg.splitlines()) + "\n"
    svg_start = svg.index("<svg")
    tag_end = svg.index(">", svg_start)
    opening = svg[svg_start:tag_end]
    if 'role="img"' not in opening:
        opening += ' role="img" aria-labelledby="diagram-title diagram-desc"'
    metadata = (
        f'><title id="diagram-title">{title}</title>'
        f'<desc id="diagram-desc">{description}</desc>'
    )
    svg = svg[:svg_start] + opening + metadata + svg[tag_end + 1 :]
    svg_path.write_text(svg, encoding="utf-8")


def arc(ax, start_x, end_x, y, color, rad, linestyle="-", arrow=True, linewidth=1.4):
    style = "-|>" if arrow else "-"
    patch = FancyArrowPatch(
        (start_x, y),
        (end_x, y),
        arrowstyle=style,
        mutation_scale=9,
        connectionstyle=f"arc3,rad={rad}",
        color=color,
        linewidth=linewidth,
        linestyle=linestyle,
        shrinkA=8,
        shrinkB=8,
        zorder=3,
    )
    ax.add_patch(patch)


def band_arc(ax, path, level, color, above, linestyle, arrow, label):
    """Draw one labelled arc from path start to end in the band above or below the nodes."""
    start_x = INTERFACE_X[path[0]]
    end_x = INTERFACE_X[path[-1]]
    if start_x == end_x:
        end_x += 0.01
    sag = 0.28 + 0.30 * level
    if above:
        rad = -sag if start_x < end_x else sag
        label_y = NODE_Y + 0.62 + 0.50 * level
    else:
        rad = sag if start_x < end_x else -sag
        label_y = NODE_Y - 0.62 - 0.50 * level
    arc(ax, start_x, end_x, NODE_Y, color, rad, linestyle=linestyle, arrow=arrow)
    ax.text(
        (start_x + end_x) / 2,
        label_y,
        label,
        ha="center",
        va="center",
        fontsize=6.4,
        color=color,
        weight="bold",
        zorder=4,
    )


def capsule(ax, ids, color, linestyle, pad_y=0.52, alpha=0.14, fill=True):
    xs = [INTERFACE_X[i] for i in ids]
    x0, x1 = min(xs) - 0.52, max(xs) + 0.52
    patch = FancyBboxPatch(
        (x0, NODE_Y - pad_y),
        x1 - x0,
        2 * pad_y,
        boxstyle="round,pad=0.05,rounding_size=0.25",
        facecolor=color if fill else "none",
        alpha=alpha if fill else 1.0,
        edgecolor=color,
        linewidth=1.1,
        linestyle=linestyle,
        zorder=1,
    )
    ax.add_patch(patch)


def draw_term_panel(ax, term, color):
    ax.set_facecolor(BACKGROUND)
    ax.axis("off")
    ax.set_xlim(-1.15, 6.55)
    ax.set_ylim(-2.75, 2.85)

    config = term["interfaceConfiguration"]
    signature = term["structuralSignature"]

    for group in config["coalesced"]:
        capsule(ax, group, color, "solid")
    if config.get("closedTriad"):
        capsule(ax, config["closedTriad"], VIRTUAL, (0, (2, 2)), pad_y=0.66, fill=False)
    if config.get("hierarchy"):
        capsule(ax, [1, 2, 3, 4, 5], color, (0, (5, 2)), pad_y=0.66, fill=False)
        ax.text(6.15, NODE_Y, "(1)⊂(2)⊂(3)⊂(4)⊂(5)", fontsize=5.8, color=MUTED, rotation=90, ha="center", va="center")

    for interface_id, x in INTERFACE_X.items():
        ax.add_patch(Circle((x, NODE_Y), NODE_RADIUS, facecolor=WHITE, edgecolor=color, linewidth=1.6, zorder=5))
        ax.text(x, NODE_Y, str(interface_id), ha="center", va="center", fontsize=9, color=INK, weight="bold", zorder=6)

    for level, relation in enumerate(term["cyclicRelations"]):
        path_text = "→".join(str(i) for i in relation["path"])
        suffix = "†" if relation["status"] == "source-attested" else ""
        band_arc(ax, relation["path"], level, CYCLE, True, "-", True, f"{relation['id']}{suffix} {path_text}")

    for level, projection in enumerate(term["linearProjections"]):
        path_text = "→".join(str(i) for i in projection["path"])
        suffix = "†" if projection["status"] == "source-attested" else ""
        band_arc(
            ax,
            projection["path"],
            level,
            PROJECTION,
            False,
            (0, (4, 2)),
            True,
            f"{projection['id']}{suffix} {path_text} ({projection['role']})",
        )

    images = term["virtualImages"]["images"]
    if images:
        suffix = "†" if term["virtualImages"]["status"] == "source-attested" else ""
        labels = " · ".join(image["notation"] for image in images)
        for index, image in enumerate(images):
            i, j = image["interfaces"]
            level = len(term["linearProjections"]) + index * 0.45
            sag = 0.28 + 0.30 * level
            arc(ax, INTERFACE_X[i], INTERFACE_X[j], NODE_Y, VIRTUAL, sag, linestyle=(0, (1, 2)), arrow=False, linewidth=1.2)
        ax.text(2.7, -2.55, f"virtual images{suffix}: {labels}", ha="center", fontsize=6.4, color=VIRTUAL, weight="bold")

    ax.text(-1.05, 2.62, f"{term['termToken']} — {term['title']}", fontsize=8.6, color=INK, weight="bold", ha="left")
    ax.text(
        -1.05,
        2.24,
        f"{term['function']} · {signature['sourceToken']} {signature['parenthesisForm']} · M={signature['matulaNumber']} ({signature['primeForm']})",
        fontsize=6.6,
        color=MUTED,
        ha="left",
    )
    if config.get("spansSeries"):
        ax.text(6.15, NODE_Y, "spans both series", fontsize=5.8, color=MUTED, rotation=90, ha="center", va="center")


def render_sheet(model: dict, view_name: str):
    view = model["views"][view_name]
    series = next(record for record in model["series"] if record["seriesId"] == view["seriesId"])
    terms = [term for term in model["terms"] if term["seriesId"] == view["seriesId"]]
    color = SERIES_COLORS[view["seriesId"]]
    rows, cols = view["grid"]

    fig, axes = plt.subplots(rows, cols, figsize=(6.3 * cols, 3.6 * rows + 1.5), facecolor=BACKGROUND)
    axes = [axes] if rows * cols == 1 else list(axes.flat)
    for ax, term in zip(axes, terms):
        draw_term_panel(ax, term, color)
    for ax in axes[len(terms):]:
        ax.axis("off")
        ax.set_facecolor(BACKGROUND)

    fig.suptitle(
        f"System 5 — {series['name']}: proposed R_n / P_k / I_i,j relation atlas",
        fontsize=15,
        weight="bold",
        color=INK,
        y=0.995,
    )
    legend = (
        "solid teal = R_n cyclic relation (counter-current pair) · dashed amber = P_k linear projection · "
        "dotted crimson = I_i,j virtual image · shaded capsule = coalesced interfaces · "
        "dotted crimson box = closed (3,4,5) triad · dashed outline = hierarchy · † = source-attested"
    )
    footer = (
        f"{series['pathway']} · regenerative mode swaps (1)⇄(2) · proposed interpretive documentation — "
        "no mapping to runtime Rn/Pk identifiers · generated by scripts/generate-system5-term-relation-diagrams.py"
    )
    fig.text(0.5, 0.955 if rows > 1 else 0.90, legend, ha="center", fontsize=7.6, color=MUTED)
    fig.text(0.5, 0.012, footer, ha="center", fontsize=7.6, color=MUTED)
    fig.subplots_adjust(top=0.93 if rows > 1 else 0.82, bottom=0.05, left=0.02, right=0.98, hspace=0.16, wspace=0.08)

    save_figure(
        fig,
        view["imageBase"],
        f"Proposed R_n, P_k and I_i,j relation atlas for the {series['name']}",
        f"Each panel shows the five interfaces of one System 5 Term in the {series['name']} with proposed "
        "cyclic relations drawn as solid arcs above, linear projections as dashed arrows below, and virtual "
        "images as dotted links inside the closed triad. The atlas is interpretive documentation only and "
        "defines no runtime behavior.",
    )


def main():
    model = load_model()
    for view_name in model["views"]:
        render_sheet(model, view_name)
    for view in model["views"].values():
        for extension in ["png", "svg"]:
            path = IMAGE_DIR / f"{view['imageBase']}.{extension}"
            if not path.is_file() or path.stat().st_size == 0:
                raise RuntimeError(f"failed to generate {path}")
            print(path.relative_to(ROOT))


if __name__ == "__main__":
    main()
