from __future__ import annotations

import json
import re
from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET

import matplotlib.pyplot as plt


ROOT = Path(__file__).resolve().parents[1]
BASE_TEX = ROOT / "docs" / "architecture" / "motomap_algorithm_dijkstra.tex"
DOCX_PATH = Path(r"C:\Users\lenovo\Downloads\motomap_rotalama_raporu.docx")
SUITE_JSON = ROOT / "website" / "routes" / "comparison_suite.json"
TMP_DIR = ROOT / "tmp" / "combined_report"
APPENDIX_TEX = TMP_DIR / "docx_appendix.tex"
PNG_PATH = TMP_DIR / "website_comparison.png"
COMBINED_TEX = TMP_DIR / "combined_report.tex"

W_NS = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}


def latex_escape(text: str) -> str:
    unicode_map = {
        "—": "--",
        "’": "'",
        "†": "",
        "‡": "",
        "°": r"$^\circ$",
        "·": r"$\cdot$",
        "×": r"$\times$",
        "Ĝ": r"$\hat{G}$",
        "Δ": r"$\Delta$",
        "Σ": r"$\Sigma$",
        "α": r"$\alpha$",
        "δ": r"$\delta$",
        "θ": r"$\theta$",
        "ρ": r"$\rho$",
        "φ": r"$\phi$",
        "→": r"$\to$",
        "⇒": r"$\Rightarrow$",
        "∀": r"$\forall$",
        "∈": r"$\in$",
        "∉": r"$\notin$",
        "−": "-",
        "∧": r"$\land$",
        "∨": r"$\lor$",
        "≤": r"$\leq$",
        "≥": r"$\geq$",
        "𝟙": r"$\mathbb{1}$",
        "₁": "1",
        "₂": "2",
        "₃": "3",
        "₄": "4",
        "₊": "+",
        "₋": "-",
        "ₐ": "a",
        "ₑ": "e",
        "ₓ": "x",
        "ₕ": "h",
        "ₘ": "m",
        "ₜ": "t",
        "⁶": "6",
        "ˢ": "std",
        "ᵈ": "d",
        "ᵉ": "e",
        "ᵍ": "g",
        "ᵏ": "k",
        "ᵗ": "t",
        "ᵛ": "v",
        "ᵢ": "i",
        "ᶠ": "f",
    }
    for src, dst in unicode_map.items():
        text = text.replace(src, dst)

    replacements = {
        "\\": r"\textbackslash{}",
        "&": r"\&",
        "%": r"\%",
        "$": r"\$",
        "#": r"\#",
        "_": r"\_",
        "{": r"\{",
        "}": r"\}",
        "~": r"\textasciitilde{}",
        "^": r"\textasciicircum{}",
    }
    for src, dst in replacements.items():
        text = text.replace(src, dst)
    return text


def clean_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    return text


def paragraph_text(paragraph: ET.Element) -> str:
    parts = [node.text or "" for node in paragraph.findall(".//w:t", NS)]
    return clean_text("".join(parts))


def paragraph_style(paragraph: ET.Element) -> str | None:
    style = paragraph.find("./w:pPr/w:pStyle", NS)
    if style is None:
        return None
    return style.get(f"{W_NS}val")


def table_to_latex(table: ET.Element, table_idx: int) -> str:
    rows: list[list[str]] = []
    max_cols = 0
    for tr in table.findall("./w:tr", NS):
        row: list[str] = []
        for tc in tr.findall("./w:tc", NS):
            texts = [paragraph_text(p) for p in tc.findall(".//w:p", NS)]
            cell = " ".join(t for t in texts if t)
            row.append(latex_escape(cell) if cell else " ")
        if row:
            max_cols = max(max_cols, len(row))
            rows.append(row)

    if not rows:
        return ""

    for row in rows:
        while len(row) < max_cols:
            row.append(" ")

    colspec = "|".join(["p{0.22\\textwidth}"] * max_cols)
    lines = [
        r"\begin{table}[ht]",
        r"\centering",
        rf"\begin{{tabular}}{{|{colspec}|}}",
        r"\hline",
    ]

    for idx, row in enumerate(rows):
        lines.append(" {} \\\\".format(" & ".join(row)))
        lines.append(r"\hline")
        if idx == 0 and len(rows) > 1:
            pass

    lines.extend(
        [
            r"\end{tabular}",
            rf"\caption{{DOCX tablosu {table_idx}}}",
            r"\end{table}",
            "",
        ]
    )
    return "\n".join(lines)


def build_docx_appendix() -> None:
    with ZipFile(DOCX_PATH) as archive:
        xml = archive.read("word/document.xml")

    root = ET.fromstring(xml)
    body = root.find("w:body", NS)
    if body is None:
        raise RuntimeError("DOCX body bulunamadi.")

    lines: list[str] = [
        r"\clearpage",
        r"\section{DOCX Raporunun LaTeX Donusumu}",
        r"\noindent Bu bolum \texttt{motomap\_rotalama\_raporu.docx} iceriginin sirali LaTeX donusumudur.",
        "",
    ]

    table_idx = 0
    for child in list(body):
        tag = child.tag.split("}")[-1]
        if tag == "p":
            text = paragraph_text(child)
            if not text:
                continue
            style = paragraph_style(child)
            escaped = latex_escape(text)
            if style == "Heading1":
                lines.extend([rf"\section{{{escaped}}}", ""])
            elif style == "Heading2":
                lines.extend([rf"\subsection{{{escaped}}}", ""])
            else:
                lines.extend([rf"\noindent {escaped}\par", ""])
        elif tag == "tbl":
            table_idx += 1
            lines.append(table_to_latex(child, table_idx))

    APPENDIX_TEX.write_text("\n".join(lines), encoding="utf-8")


def build_website_png() -> None:
    data = json.loads(SUITE_JSON.read_text(encoding="utf-8"))
    cases = data["cases"]
    fig, axes = plt.subplots(len(cases), 2, figsize=(14, 4.6 * len(cases)))
    if len(cases) == 1:
        axes = [axes]

    mode_order = ["standart", "viraj_keyfi", "guvenli"]
    mode_labels = ["Google", "Standart", "Viraj", "Guvenli"]

    for idx, case in enumerate(cases):
        dist_ax = axes[idx][0]
        time_ax = axes[idx][1]
        base_dist = float(case["baseline_stats"]["mesafe_m"])
        base_time = float(case["baseline_stats"]["sure_s"])
        dist_vals = [
            base_dist,
            *[float(case["modes"][mode]["stats"]["mesafe_m"]) for mode in mode_order],
        ]
        time_vals = [
            base_time,
            *[float(case["modes"][mode]["stats"]["sure_s"]) for mode in mode_order],
        ]
        colors = ["#2563eb", "#e76f51", "#f4a261", "#2a9d8f"]

        dist_ax.bar(mode_labels, dist_vals, color=colors)
        dist_ax.set_title(f"Rota {idx + 1} Mesafe\n{case['origin_label']} -> {case['destination_label']}")
        dist_ax.set_ylabel("metre")
        dist_ax.grid(axis="y", alpha=0.25)

        time_ax.bar(mode_labels, time_vals, color=colors)
        time_ax.set_title(f"Rota {idx + 1} Sure")
        time_ax.set_ylabel("saniye")
        time_ax.grid(axis="y", alpha=0.25)

        verdict = case["evidence"]["verdict"]
        dist_ax.text(
            0.01,
            0.95,
            f"PASS={verdict} | skor={case['evidence']['score']}/{case['evidence']['total']}",
            transform=dist_ax.transAxes,
            ha="left",
            va="top",
            fontsize=10,
            bbox={"facecolor": "white", "alpha": 0.8, "edgecolor": "#cccccc"},
        )
        time_ax.text(
            0.01,
            0.95,
            "Viraj>=Standart, GuvenliRisk<=Standart",
            transform=time_ax.transAxes,
            ha="left",
            va="top",
            fontsize=10,
            bbox={"facecolor": "white", "alpha": 0.8, "edgecolor": "#cccccc"},
        )

    fig.suptitle("Website Karsilastirma Ozeti: Google baz rota ve 9 MOTOMAP rota", fontsize=16)
    fig.tight_layout(rect=(0, 0, 1, 0.98))
    fig.savefig(PNG_PATH, dpi=180)
    plt.close(fig)


def build_combined_tex() -> None:
    base = BASE_TEX.read_text(encoding="utf-8")
    appendix_rel = APPENDIX_TEX.as_posix()
    png_rel = PNG_PATH.as_posix()
    addition = "\n".join(
        [
            r"\clearpage",
            r"\section{Website Karsilastirma PNG}",
            r"\begin{figure}[ht]",
            r"\centering",
            rf"\includegraphics[width=\textwidth]{{{png_rel}}}",
            r"\caption{Website karsilastirma ozet PNG ciktisi.}",
            r"\end{figure}",
            rf"\input{{{appendix_rel}}}",
            "",
        ]
    )
    if r"\usepackage{graphicx}" not in base:
        base = base.replace(r"\usepackage{amsmath,amssymb}", r"\usepackage{amsmath,amssymb}" + "\n" + r"\usepackage{graphicx}")
    if r"\usepackage[T1]{fontenc}" not in base:
        base = base.replace(r"\usepackage[margin=2.0cm]{geometry}", r"\usepackage[margin=2.0cm]{geometry}" + "\n" + r"\usepackage[T1]{fontenc}")
    if r"\usepackage[utf8]{inputenc}" not in base:
        base = base.replace(r"\usepackage[T1]{fontenc}", r"\usepackage[T1]{fontenc}" + "\n" + r"\usepackage[utf8]{inputenc}")
    combined = base.replace(r"\end{document}", addition + r"\end{document}")
    COMBINED_TEX.write_text(combined, encoding="utf-8")


def main() -> None:
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    build_docx_appendix()
    build_website_png()
    build_combined_tex()
    print(APPENDIX_TEX)
    print(PNG_PATH)
    print(COMBINED_TEX)


if __name__ == "__main__":
    main()
