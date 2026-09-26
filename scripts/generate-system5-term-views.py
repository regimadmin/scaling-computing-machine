#!/usr/bin/env python3
"""Render the provisional System 5 twenty-term passive and active views."""

from __future__ import annotations

import json
import math
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, FancyArrowPatch, FancyBboxPatch

ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = ROOT / "docs" / "diagrams" / "system5-term-view-model.json"
IMAGE_DIR = ROOT / "docs" / "images"

BACKGROUND = "#F7F5F0"
INK = "#18212B"
MUTED = "#667085"
OBJECTIVE = "#155EEF"
SUBJECTIVE = "#7A5AF8"
CYCLE = "#087E8B"
PROJECTION = "#B54708"
VIRTUAL = "#C01048"
UNRESOLVED = "#98A2B3"
WHITE = "#FFFFFF"


def load_model() -> dict:
    model = json.loads(MODEL_PATH.read_text(encoding="utf-8"))
    family_ids = [family["termId"] for family in model["families"]]
    if family_ids != [f"T{index}" for index in range(10)]:
        raise ValueError("families must be ordered T0 through T9")
    variant_count = sum(len(family["variants"]) for family in model["families"])
    if variant_count != 20:
        raise ValueError(f"expected 20 variants, found {variant_count}")
    if any(family["runtimeMappings"] for family in model["families"]):
        raise ValueError("diagram model must not contain runtime mappings")
    evidence_ids = {record["evidenceId"] for record in model["provenance"]["evidence"]}
    records = [
        *model["families"],
        *model["interfaces"],
        model["relations"]["cyclic"],
        model["relations"]["projection"],
        *model["relations"]["virtualImages"],
        *model["views"].values(),
    ]
    for record in records:
        record_evidence = record.get("evidenceIds", [])
        if not record_evidence or not set(record_evidence).issubset(evidence_ids):
            raise ValueError(f"record has missing or unknown evidence IDs: {record}")
    for source in model["provenance"]["sources"]:
        if not (ROOT / source["sourceFile"]).is_file():
            raise ValueError(f"missing provenance source: {source['sourceFile']}")
    return model


def point(radius: float, angle: float) -> tuple[float, float]:
    return radius * math.cos(angle), radius * math.sin(angle)


def add_round_node(ax, x, y, text, color, width=1.15, height=0.62, fontsize=9):
    patch = FancyBboxPatch(
        (x - width / 2, y - height / 2),
        width,
        height,
        boxstyle="round,pad=0.08,rounding_size=0.12",
        facecolor=WHITE,
        edgecolor=color,
        linewidth=1.8,
        zorder=5,
    )
    ax.add_patch(patch)
    ax.text(x, y, text, ha="center", va="center", fontsize=fontsize, color=INK, weight="bold", zorder=6)


def add_arc_arrow(ax, start, end, color, rad, linewidth=1.5, linestyle="-"):
    patch = FancyArrowPatch(
        start,
        end,
        arrowstyle="-|>",
        mutation_scale=10,
        connectionstyle=f"arc3,rad={rad}",
        color=color,
        linewidth=linewidth,
        linestyle=linestyle,
        shrinkA=11,
        shrinkB=11,
        zorder=2,
    )
    ax.add_patch(patch)


def save_figure(fig, stem: str, title: str, description: str):
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    png_path = IMAGE_DIR / f"{stem}.png"
    svg_path = IMAGE_DIR / f"{stem}.svg"
    fig.savefig(png_path, dpi=180, facecolor=BACKGROUND, bbox_inches="tight")
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


def render_passive(model: dict):
    fig, ax = plt.subplots(figsize=(17, 11), facecolor=BACKGROUND)
    ax.set_facecolor(BACKGROUND)
    ax.set_aspect("equal")
    ax.axis("off")

    families = model["families"]
    angles = [math.radians(90 - index * 36) for index in range(10)]
    outer_radius = 4.7
    inner_radius = 3.15

    ax.add_patch(Circle((0, 0), outer_radius, fill=False, edgecolor=CYCLE, linewidth=1.0, alpha=0.3))
    ax.add_patch(Circle((0, 0), inner_radius, fill=False, edgecolor=CYCLE, linewidth=1.0, alpha=0.3))

    for index, family in enumerate(families):
        angle = angles[index]
        next_angle = angles[(index + 1) % len(angles)]
        objective_pos = point(outer_radius, angle)
        objective_next = point(outer_radius, next_angle)
        subjective_pos = point(inner_radius, angle)
        subjective_next = point(inner_radius, next_angle)

        add_arc_arrow(ax, objective_pos, objective_next, CYCLE, rad=-0.24)
        add_arc_arrow(ax, subjective_pos, subjective_next, CYCLE, rad=-0.24)

        ax.plot(
            [subjective_pos[0], objective_pos[0]],
            [subjective_pos[1], objective_pos[1]],
            color=PROJECTION,
            linewidth=1.3,
            linestyle=(0, (4, 3)),
            zorder=1,
        )
        midpoint = ((subjective_pos[0] + objective_pos[0]) / 2, (subjective_pos[1] + objective_pos[1]) / 2)
        if index in {0, 5}:
            ax.text(midpoint[0], midpoint[1], "Pₖ", color=PROJECTION, fontsize=9, ha="center", va="center", weight="bold")

        add_round_node(ax, *objective_pos, family["variants"]["objective"]["token"], OBJECTIVE)
        add_round_node(ax, *subjective_pos, family["variants"]["subjective"]["token"], SUBJECTIVE)

        label_pos = point(6.0, angle)
        horizontal_alignment = "center"
        if label_pos[0] > 1.0:
            horizontal_alignment = "left"
        elif label_pos[0] < -1.0:
            horizontal_alignment = "right"
        ax.text(
            label_pos[0],
            label_pos[1],
            f"{family['termId']}\n{family['name']}",
            ha=horizontal_alignment,
            va="center",
            fontsize=8.5,
            color=INK,
            weight="bold",
        )

    ax.text(0, 0.38, "20 TERM VARIANTS", ha="center", va="center", fontsize=16, weight="bold", color=INK)
    ax.text(0, -0.08, "10 families × objective / subjective", ha="center", va="center", fontsize=10, color=MUTED)
    ax.text(0, -0.62, "Rₙ cyclic view • Pₖ radial projection", ha="center", va="center", fontsize=10, color=CYCLE, weight="bold")

    inset_x, inset_y = 8.65, -0.45
    ax.text(inset_x, 2.15, "VIRTUAL-IMAGE INSET", ha="center", fontsize=10, color=INK, weight="bold")
    ax.text(inset_x, 1.78, "proposed Vᵢ,ⱼ notation\n(source uses Iᵢ,ⱼ)", ha="center", fontsize=8, color=MUTED)
    triad = {3: (inset_x, 1.05), 4: (inset_x - 1.35, -1.0), 5: (inset_x + 1.35, -1.0)}
    for left, right, label in [(3, 4, "V₃,₄"), (4, 5, "V₄,₅"), (3, 5, "V₃,₅")]:
        x1, y1 = triad[left]
        x2, y2 = triad[right]
        ax.plot([x1, x2], [y1, y2], color=VIRTUAL, linewidth=1.5, linestyle=(0, (5, 3)))
        ax.text((x1 + x2) / 2, (y1 + y2) / 2 + 0.15, label, color=VIRTUAL, fontsize=8, ha="center", weight="bold")
    for interface, (x, y) in triad.items():
        ax.add_patch(Circle((x, y), 0.31, facecolor=WHITE, edgecolor=VIRTUAL, linewidth=1.8, zorder=5))
        ax.text(x, y, str(interface), ha="center", va="center", color=INK, weight="bold", zorder=6)
    ax.add_patch(
        FancyBboxPatch(
            (inset_x - 0.68, -2.2),
            1.36,
            0.55,
            boxstyle="round,pad=0.08,rounding_size=0.18",
            facecolor=WHITE,
            edgecolor=UNRESOLVED,
            linewidth=1.4,
        )
    )
    ax.text(inset_x, -1.925, "1 ↔ 2 coalesced", ha="center", va="center", fontsize=8, color=INK, weight="bold")

    ax.text(-7.7, 6.82, "PASSIVE (TOP VIEW)", fontsize=20, weight="bold", color=INK, ha="left")
    ax.text(-7.7, 6.35, "Structural incidence and correspondence — visual orientation only", fontsize=10.5, color=MUTED, ha="left")
    ax.text(-7.7, -6.65, "Solid teal: proposed Rₙ cycle   Dashed amber: proposed Pₖ projection   Dashed red: proposed Vᵢ,ⱼ notation", fontsize=9, color=INK, ha="left")
    ax.text(-7.7, -7.05, "Terminology model only • no passive behavior, execution order, or mapping to current runtime Rn/Pk identifiers", fontsize=9, color=MUTED, ha="left")
    ax.set_xlim(-8.5, 10.5)
    ax.set_ylim(-7.25, 7.2)

    save_figure(
        fig,
        "system5-passive-top-view",
        "Passive top view of twenty provisional System 5 term variants",
        "Ten provisional term families form objective and subjective rings. Proposed R-n cyclic relations follow the rings, proposed P-k projections connect each family pair, and a separate inset shows proposed V-i-j notation for source virtual-image pairs. No runtime behavior is implied.",
    )


def render_active(model: dict):
    fig, ax = plt.subplots(figsize=(18, 12), facecolor=BACKGROUND)
    ax.set_facecolor(BACKGROUND)
    ax.axis("off")

    families = model["families"]
    top_y = 9.2
    gap = 0.88
    x_subjective, x_family, x_objective = 2.2, 6.15, 10.1
    ys = [top_y - index * gap for index in range(10)]

    for index, (family, y) in enumerate(zip(families, ys)):
        add_round_node(ax, x_subjective, y, family["variants"]["subjective"]["token"], SUBJECTIVE, width=1.3, height=0.54)
        add_round_node(ax, x_objective, y, family["variants"]["objective"]["token"], OBJECTIVE, width=1.3, height=0.54)
        ax.add_patch(
            FancyBboxPatch(
                (x_family - 1.65, y - 0.29),
                3.3,
                0.58,
                boxstyle="round,pad=0.04,rounding_size=0.08",
                facecolor="#ECEAFB" if index % 2 == 0 else WHITE,
                edgecolor="#D0D5DD",
                linewidth=1.0,
            )
        )
        ax.text(x_family, y, f"{family['termId']}  {family['name']}", ha="center", va="center", fontsize=9.4, color=INK, weight="bold")
        ax.plot([x_subjective + 0.72, x_family - 1.7], [y, y], color=UNRESOLVED, linestyle=(0, (2, 3)), linewidth=1.0)
        ax.plot([x_family + 1.7, x_objective - 0.72], [y, y], color=UNRESOLVED, linestyle=(0, (2, 3)), linewidth=1.0)

        if index < len(ys) - 1:
            next_y = ys[index + 1]
            for x in (x_subjective, x_objective):
                ax.add_patch(
                    FancyArrowPatch(
                        (x, y - 0.31),
                        (x, next_y + 0.31),
                        arrowstyle="-|>",
                        mutation_scale=10,
                        color=PROJECTION,
                        linewidth=1.45,
                    )
                )

    ax.text(x_subjective, 10.0, "SUBJECTIVE VARIANTS", ha="center", fontsize=10, color=SUBJECTIVE, weight="bold")
    ax.text(x_family, 10.0, "ORDERED FAMILY LEVELS", ha="center", fontsize=10, color=INK, weight="bold")
    ax.text(x_objective, 10.0, "OBJECTIVE VARIANTS", ha="center", fontsize=10, color=OBJECTIVE, weight="bold")
    ax.text(x_subjective + 0.18, 5.2, "Pₖ", fontsize=10, color=PROJECTION, weight="bold")
    ax.text(x_objective + 0.18, 5.2, "Pₖ", fontsize=10, color=PROJECTION, weight="bold")

    add_arc_arrow(ax, (x_subjective - 0.72, ys[-1]), (x_subjective - 0.72, ys[0]), CYCLE, rad=0.38, linewidth=2.0)
    add_arc_arrow(ax, (x_objective + 0.72, ys[-1]), (x_objective + 0.72, ys[0]), CYCLE, rad=-0.38, linewidth=2.0)
    ax.text(0.45, 5.2, "Rₙ return", fontsize=9, color=CYCLE, rotation=90, ha="center", weight="bold")
    ax.text(11.85, 5.2, "Rₙ return", fontsize=9, color=CYCLE, rotation=270, ha="center", weight="bold")

    panel_x = 14.3
    ax.text(panel_x, 9.95, "SOURCE HIERARCHY INSET", ha="center", fontsize=10, color=INK, weight="bold")
    ax.text(panel_x, 9.58, "five interfaces • display only", ha="center", fontsize=8, color=MUTED)
    interface_y = [9.0, 8.15, 7.3, 6.45, 5.6]
    for index, (interface, y) in enumerate(zip(model["interfaces"], interface_y)):
        ax.add_patch(
            FancyBboxPatch(
                (panel_x - 1.75, y - 0.29),
                3.5,
                0.58,
                boxstyle="round,pad=0.05,rounding_size=0.08",
                facecolor=WHITE,
                edgecolor="#475467",
                linewidth=1.1,
            )
        )
        ax.text(panel_x, y, f"{interface['id']}  {interface['name']}", ha="center", va="center", fontsize=8.2, color=INK, weight="bold")
        if index < len(interface_y) - 1:
            ax.annotate("", xy=(panel_x, interface_y[index + 1] + 0.31), xytext=(panel_x, y - 0.31), arrowprops={"arrowstyle": "->", "color": UNRESOLVED, "lw": 1.1})

    ax.text(panel_x, 4.86, "VIRTUAL-IMAGE PAIRS", ha="center", fontsize=10, color=INK, weight="bold")
    triad = {3: (panel_x, 4.2), 4: (panel_x - 1.35, 2.35), 5: (panel_x + 1.35, 2.35)}
    for left, right, label in [(3, 4, "V₃,₄"), (4, 5, "V₄,₅"), (3, 5, "V₃,₅")]:
        x1, y1 = triad[left]
        x2, y2 = triad[right]
        ax.plot([x1, x2], [y1, y2], color=VIRTUAL, linewidth=1.5, linestyle=(0, (5, 3)))
        ax.text((x1 + x2) / 2, (y1 + y2) / 2 + 0.12, label, color=VIRTUAL, fontsize=8, ha="center", weight="bold")
    for interface, (x, y) in triad.items():
        ax.add_patch(Circle((x, y), 0.3, facecolor=WHITE, edgecolor=VIRTUAL, linewidth=1.7, zorder=5))
        ax.text(x, y, str(interface), ha="center", va="center", color=INK, weight="bold", zorder=6)
    ax.text(panel_x, 1.68, "Vᵢ,ⱼ = proposed notation\nsource regions are Iᵢ,ⱼ", ha="center", fontsize=8, color=MUTED)

    ax.text(0.2, 11.15, "ACTIVE (SIDE VIEW)", fontsize=20, weight="bold", color=INK, ha="left")
    ax.text(0.2, 10.72, "Ordered projection and return — visual orientation only, not an operational active state", fontsize=10.5, color=MUTED, ha="left")
    ax.text(0.2, 0.55, "Amber arrows: proposed Pₖ linear projection   Teal return arcs: proposed Rₙ cyclic closure   Red dashed: proposed Vᵢ,ⱼ notation", fontsize=9, color=INK, ha="left")
    ax.text(0.2, 0.18, "Terminology model only • no passive→active transition, execution schedule, or mapping to current runtime Rn/Pk identifiers", fontsize=9, color=MUTED, ha="left")
    ax.set_xlim(0, 17.2)
    ax.set_ylim(0, 11.55)

    save_figure(
        fig,
        "system5-active-side-view",
        "Active side view of twenty provisional System 5 term variants",
        "Ten provisional term families form ordered levels with separate subjective and objective variants. Proposed P-k projections descend through each column, proposed R-n relations return cyclically, and a separate source hierarchy and virtual-image inset provide context. No operational active behavior is defined.",
    )


def main():
    model = load_model()
    render_passive(model)
    render_active(model)
    for name in [
        "system5-passive-top-view.png",
        "system5-passive-top-view.svg",
        "system5-active-side-view.png",
        "system5-active-side-view.svg",
    ]:
        path = IMAGE_DIR / name
        if not path.is_file() or path.stat().st_size == 0:
            raise RuntimeError(f"failed to generate {path}")
        print(path.relative_to(ROOT))


if __name__ == "__main__":
    main()
