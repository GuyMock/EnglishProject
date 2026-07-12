from __future__ import annotations

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import simpleSplit
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas

try:
    import pypdfium2 as pdfium
except ImportError:  # Preview rendering is optional.
    pdfium = None


PAGE_WIDTH, PAGE_HEIGHT = A4
OUTPUT_DIR = Path("output/pdf")
TMP_DIR = Path("tmp/pdfs")
OUTPUT_FILE = OUTPUT_DIR / "gantt_charts_ib_business.pdf"

NAVY = colors.HexColor("#14324A")
DEEP_NAVY = colors.HexColor("#0D2236")
CORAL = colors.HexColor("#F26B4A")
AMBER = colors.HexColor("#F2B84B")
TEAL = colors.HexColor("#4CA7B5")
FOREST = colors.HexColor("#5E9B63")
BLUE = colors.HexColor("#4C78C9")
CREAM = colors.HexColor("#F7F2EA")
WHITE = colors.white
INK = colors.HexColor("#1E2B36")
SLATE = colors.HexColor("#667588")
BORDER = colors.HexColor("#D9E1E8")
SOFT_BLUE = colors.HexColor("#EAF3FB")
SOFT_GREEN = colors.HexColor("#E9F5EC")
SOFT_CORAL = colors.HexColor("#FCE9E1")
SOFT_AMBER = colors.HexColor("#FFF2D7")
PALE_GREY = colors.HexColor("#F5F7FA")


def lighten(color: colors.Color, factor: float) -> colors.Color:
    return colors.Color(
        color.red + (1 - color.red) * factor,
        color.green + (1 - color.green) * factor,
        color.blue + (1 - color.blue) * factor,
    )


def darken(color: colors.Color, factor: float) -> colors.Color:
    return colors.Color(
        color.red * (1 - factor),
        color.green * (1 - factor),
        color.blue * (1 - factor),
    )


def draw_background(c: canvas.Canvas) -> None:
    c.setFillColor(CREAM)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, stroke=0, fill=1)
    c.setFillColor(SOFT_BLUE)
    c.circle(PAGE_WIDTH - 68, PAGE_HEIGHT - 72, 86, stroke=0, fill=1)
    c.setFillColor(SOFT_AMBER)
    c.circle(72, 112, 58, stroke=0, fill=1)


def shadow_card(
    c: canvas.Canvas,
    x: float,
    y: float,
    w: float,
    h: float,
    radius: float = 18,
    fill: colors.Color = WHITE,
) -> None:
    c.setFillColor(colors.HexColor("#DDE6EE"))
    c.roundRect(x + 5, y - 5, w, h, radius, stroke=0, fill=1)
    c.setFillColor(fill)
    c.setStrokeColor(BORDER)
    c.roundRect(x, y, w, h, radius, stroke=1, fill=1)


def draw_paragraph(
    c: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    width: float,
    font: str = "Helvetica",
    size: int = 11,
    color: colors.Color = INK,
    leading: float | None = None,
) -> float:
    leading = leading or size * 1.35
    lines = simpleSplit(text, font, size, width)
    c.setFont(font, size)
    c.setFillColor(color)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_chip(c: canvas.Canvas, text: str, x: float, y: float, fill: colors.Color) -> None:
    height = 24
    width = stringWidth(text, "Helvetica-Bold", 9) + 24
    c.setFillColor(fill)
    c.roundRect(x, y, width, height, 12, stroke=0, fill=1)
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(WHITE)
    c.drawString(x + 12, y + 8, text)


def draw_footer(c: canvas.Canvas, page_num: int) -> None:
    c.setStrokeColor(BORDER)
    c.line(40, 36, PAGE_WIDTH - 40, 36)
    c.setFont("Helvetica", 9)
    c.setFillColor(SLATE)
    c.drawString(40, 21, "IB Business Management | Project Planning Tool")
    c.drawRightString(PAGE_WIDTH - 40, 21, f"Page {page_num}")


def draw_mini_gantt(c: canvas.Canvas, x: float, y: float, w: float, h: float) -> None:
    c.setFillColor(WHITE)
    c.roundRect(x, y, w, h, 16, stroke=0, fill=1)
    c.setStrokeColor(lighten(NAVY, 0.55))
    c.roundRect(x, y, w, h, 16, stroke=1, fill=0)

    label_w = 34
    cell_w = (w - label_w - 18) / 5
    row_h = 16
    top = y + h - 20
    c.setFont("Helvetica-Bold", 7)
    c.setFillColor(SLATE)
    for week in range(5):
        c.drawCentredString(x + label_w + 10 + cell_w * week + cell_w / 2, top, str(week + 1))

    rows = [
        ("R", 0, 2, TEAL),
        ("D", 1, 2, AMBER),
        ("M", 2, 2, CORAL),
        ("L", 4, 1, FOREST),
    ]
    top -= 15
    for idx, (label, start, dur, fill) in enumerate(rows):
        row_y = top - idx * (row_h + 6)
        c.setFont("Helvetica-Bold", 8)
        c.setFillColor(WHITE)
        c.setFillColor(lighten(NAVY, 0.08))
        c.circle(x + 14, row_y + 6, 7, stroke=0, fill=1)
        c.setFillColor(WHITE)
        c.drawCentredString(x + 14, row_y + 3.5, label)
        for week in range(5):
            cell_x = x + label_w + 10 + cell_w * week
            c.setFillColor(colors.HexColor("#F4F7FA"))
            c.roundRect(cell_x, row_y, cell_w - 3, row_h, 5, stroke=0, fill=1)
        bar_x = x + label_w + 10 + start * cell_w
        c.setFillColor(fill)
        c.roundRect(bar_x, row_y + 2, cell_w * dur - 6, row_h - 4, 6, stroke=0, fill=1)


def draw_highlight_card(c: canvas.Canvas) -> None:
    shadow_card(c, 40, 542, 330, 118, fill=WHITE)
    c.setFillColor(CORAL)
    c.roundRect(54, 551, 10, 100, 5, stroke=0, fill=1)
    c.setFont("Helvetica-Bold", 18)
    c.setFillColor(DEEP_NAVY)
    c.drawString(78, 623, "What is a Gantt chart?")
    body = (
        "A Gantt chart is a time-based planning tool that maps project tasks "
        "against a calendar. It helps managers schedule work, see overlap, "
        "monitor progress, and spot delay risk quickly."
    )
    draw_paragraph(c, body, 78, 598, 230, size=11, color=INK)
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(CORAL)
    c.drawString(78, 558, "IB lens: it is strongest as a visual scheduling tool, not a full optimisation model.")


def draw_quick_facts_card(c: canvas.Canvas) -> None:
    shadow_card(c, 386, 542, 169, 118, fill=WHITE)
    c.setFont("Helvetica-Bold", 15)
    c.setFillColor(DEEP_NAVY)
    c.drawString(404, 623, "Quick facts")
    facts = [
        ("Shows", "tasks, timing, overlap"),
        ("Best for", "launches, events, rollout plans"),
        ("Remember", "great overview, limited depth"),
    ]
    y = 596
    for label, value in facts:
        c.setFillColor(AMBER)
        c.circle(406, y + 4, 4, stroke=0, fill=1)
        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(INK)
        c.drawString(418, y, label)
        c.setFont("Helvetica", 10)
        c.setFillColor(SLATE)
        draw_paragraph(c, value, 418, y - 14, 118, size=10, color=SLATE, leading=12)
        y -= 32


def draw_page1_header(c: canvas.Canvas) -> None:
    c.setFillColor(NAVY)
    c.rect(0, PAGE_HEIGHT - 182, PAGE_WIDTH, 182, stroke=0, fill=1)

    path = c.beginPath()
    path.moveTo(PAGE_WIDTH * 0.52, PAGE_HEIGHT - 182)
    path.lineTo(PAGE_WIDTH, PAGE_HEIGHT - 182)
    path.lineTo(PAGE_WIDTH, PAGE_HEIGHT - 36)
    path.lineTo(PAGE_WIDTH * 0.78, PAGE_HEIGHT - 62)
    path.close()
    c.setFillColor(CORAL)
    c.drawPath(path, fill=1, stroke=0)

    c.setFillColor(lighten(TEAL, 0.35))
    c.circle(PAGE_WIDTH - 62, PAGE_HEIGHT - 52, 34, stroke=0, fill=1)
    c.setFillColor(lighten(AMBER, 0.25))
    c.circle(PAGE_WIDTH - 145, PAGE_HEIGHT - 140, 21, stroke=0, fill=1)

    c.setFont("Helvetica-Bold", 28)
    c.setFillColor(WHITE)
    c.drawString(40, 778, "Gantt Charts")
    c.setFont("Helvetica", 14)
    c.setFillColor(lighten(WHITE, 0.08))
    c.drawString(40, 752, "IB Business Management revision sheet")
    c.setFont("Helvetica", 12)
    c.drawString(40, 724, "A clear visual tool for planning, coordinating, and tracking projects.")

    draw_chip(c, "Visual timeline", 40, 690, TEAL)
    draw_chip(c, "Task overlap", 154, 690, AMBER)
    draw_chip(c, "Progress control", 258, 690, CORAL)
    draw_mini_gantt(c, 394, 686, 160, 92)


def draw_gantt_chart_card(c: canvas.Canvas) -> None:
    x, y, w, h = 40, 118, 515, 394
    shadow_card(c, x, y, w, h, fill=WHITE)
    c.setFont("Helvetica-Bold", 18)
    c.setFillColor(DEEP_NAVY)
    c.drawString(x + 20, y + h - 32, "Example: 8-week product launch plan")
    c.setFont("Helvetica", 11)
    c.setFillColor(SLATE)
    c.drawString(x + 20, y + h - 51, "Managers use the bars to see timing, overlap, and live progress against plan.")

    chart_x = x + 18
    chart_y = y + 76
    chart_w = w - 36
    chart_h = 250
    label_w = 140
    num_weeks = 8
    cell_w = (chart_w - label_w) / num_weeks
    row_h = 28

    c.setFillColor(PALE_GREY)
    c.roundRect(chart_x, chart_y, chart_w, chart_h, 18, stroke=0, fill=1)
    c.setStrokeColor(BORDER)
    c.roundRect(chart_x, chart_y, chart_w, chart_h, 18, stroke=1, fill=0)

    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(DEEP_NAVY)
    c.drawString(chart_x + 16, chart_y + chart_h - 24, "Task")

    header_y = chart_y + chart_h - 38
    for week in range(num_weeks):
        cell_x = chart_x + label_w + week * cell_w
        c.setFillColor(lighten(SOFT_BLUE, 0.12) if week % 2 == 0 else WHITE)
        c.rect(cell_x, chart_y + 18, cell_w, chart_h - 52, stroke=0, fill=1)
        c.setFillColor(DEEP_NAVY)
        c.drawCentredString(cell_x + cell_w / 2, header_y + 12, str(week + 1))
        c.setFont("Helvetica", 9)
        c.setFillColor(SLATE)
        c.drawCentredString(cell_x + cell_w / 2, header_y, "Week")

    c.setStrokeColor(BORDER)
    for week in range(num_weeks + 1):
        line_x = chart_x + label_w + week * cell_w
        c.line(line_x, chart_y + 18, line_x, chart_y + chart_h - 16)

    tasks = [
        ("Market research", 1, 2, TEAL, 1.0),
        ("Supplier shortlist", 2, 2, AMBER, 0.85),
        ("Prototype testing", 3, 2, CORAL, 0.65),
        ("Costing and pricing", 4, 2, NAVY, 0.45),
        ("Marketing assets", 4, 3, BLUE, 0.55),
        ("Staff training", 6, 2, FOREST, 0.25),
        ("Launch event", 8, 1, darken(CORAL, 0.08), 0.0),
    ]

    c.setFont("Helvetica", 10)
    base_y = chart_y + chart_h - 72
    for row, (label, start, duration, fill, progress) in enumerate(tasks):
        row_y = base_y - row * 31
        c.setFillColor(WHITE if row % 2 == 0 else colors.HexColor("#FBFCFD"))
        c.rect(chart_x + 2, row_y - 8, chart_w - 4, row_h, stroke=0, fill=1)
        c.setFillColor(INK)
        c.drawString(chart_x + 16, row_y + 1, label)

        if label == "Launch event":
            cell_x = chart_x + label_w + (start - 1) * cell_w
            cx = cell_x + cell_w / 2
            cy = row_y + 4
            c.setFillColor(fill)
            path = c.beginPath()
            path.moveTo(cx, cy + 10)
            path.lineTo(cx + 10, cy)
            path.lineTo(cx, cy - 10)
            path.lineTo(cx - 10, cy)
            path.close()
            c.drawPath(path, fill=1, stroke=0)
            c.setFont("Helvetica-Bold", 8)
            c.setFillColor(WHITE)
            c.drawCentredString(cx, cy - 2, "M")
            c.setFont("Helvetica", 10)
            continue

        bar_x = chart_x + label_w + (start - 1) * cell_w + 4
        bar_w = cell_w * duration - 8
        bar_fill = lighten(fill, 0.45)
        c.setFillColor(bar_fill)
        c.roundRect(bar_x, row_y - 2, bar_w, 16, 8, stroke=0, fill=1)
        c.setFillColor(fill)
        c.roundRect(bar_x, row_y - 2, bar_w * progress, 16, 8, stroke=0, fill=1)
        c.setFillColor(darken(fill, 0.28))
        c.roundRect(bar_x, row_y + 11, bar_w, 2, 1, stroke=0, fill=1)

    today_x = chart_x + label_w + 5.5 * cell_w
    c.setDash(4, 3)
    c.setStrokeColor(CORAL)
    c.setLineWidth(1.4)
    c.line(today_x, chart_y + 18, today_x, chart_y + chart_h - 16)
    c.setDash()
    c.setLineWidth(1)
    c.setFillColor(CORAL)
    c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(today_x, chart_y + chart_h - 12, "Review point")

    legend_y = y + 34
    legend_items = [
        (TEAL, "completed section"),
        (lighten(TEAL, 0.45), "remaining planned time"),
        (CORAL, "live checkpoint"),
    ]
    lx = x + 22
    for fill, label in legend_items:
        c.setFillColor(fill)
        c.roundRect(lx, legend_y, 22, 10, 5, stroke=0, fill=1)
        c.setFont("Helvetica", 9)
        c.setFillColor(SLATE)
        c.drawString(lx + 30, legend_y + 1, label)
        lx += 142


def bullet_block(
    c: canvas.Canvas,
    x: float,
    y: float,
    width: float,
    title: str,
    bullets: list[str],
    accent: colors.Color,
    card_fill: colors.Color,
) -> None:
    shadow_card(c, x, y, width, 214, fill=card_fill)
    c.setFillColor(accent)
    c.circle(x + 26, y + 183, 10, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(x + 26, y + 179, "+")
    c.setFillColor(DEEP_NAVY)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(x + 44, y + 176, title)

    bullet_y = y + 145
    for text in bullets:
        c.setFillColor(accent)
        c.circle(x + 24, bullet_y + 4, 4, stroke=0, fill=1)
        draw_paragraph(c, text, x + 38, bullet_y, width - 58, size=10, color=INK, leading=13)
        bullet_y -= 41


def draw_compare_table(c: canvas.Canvas) -> None:
    x, y, w, h = 40, 276, 515, 160
    shadow_card(c, x, y, w, h, fill=WHITE)
    c.setFont("Helvetica-Bold", 17)
    c.setFillColor(DEEP_NAVY)
    c.drawString(x + 18, y + h - 28, "Gantt chart vs critical path analysis")

    col1 = 112
    col2 = 185
    col3 = w - col1 - col2 - 36
    table_x = x + 18
    table_y = y + 22
    row_h = 24

    c.setFillColor(DEEP_NAVY)
    c.roundRect(table_x, table_y + 4 * row_h, w - 36, row_h, 8, stroke=0, fill=1)
    headers = ["Aspect", "Gantt chart", "Critical path analysis"]
    col_positions = [table_x, table_x + col1, table_x + col1 + col2]
    col_widths = [col1, col2, col3]
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(WHITE)
    for header, pos, width in zip(headers, col_positions, col_widths):
        c.drawString(pos + 8, table_y + 4 * row_h + 8, header)

    rows = [
        ("Focus", "Visual schedule and overlap", "Logical sequence and total duration"),
        ("Best use", "Monitoring progress", "Finding bottlenecks and float"),
        ("Shows", "start, finish, duration, progress", "critical path, float, earliest/latest times"),
        ("Main weakness", "Can hide deeper dependency logic", "Less intuitive as a quick visual overview"),
    ]
    c.setFont("Helvetica", 9)
    for idx, row in enumerate(rows):
        row_y = table_y + (3 - idx) * row_h
        c.setFillColor(SOFT_BLUE if idx % 2 == 0 else PALE_GREY)
        c.rect(table_x, row_y, w - 36, row_h, stroke=0, fill=1)
        c.setStrokeColor(BORDER)
        c.rect(table_x, row_y, w - 36, row_h, stroke=1, fill=0)
        for pos in [table_x + col1, table_x + col1 + col2]:
            c.line(pos, row_y, pos, row_y + row_h)
        for text, pos, width in zip(row, col_positions, col_widths):
            lines = simpleSplit(text, "Helvetica", 9, width - 12)
            text_y = row_y + 15
            for line in lines:
                c.setFillColor(INK)
                c.drawString(pos + 6, text_y, line)
                text_y -= 10


def draw_exam_card(c: canvas.Canvas) -> None:
    x, y, w, h = 40, 82, 252, 172
    shadow_card(c, x, y, w, h, fill=WHITE)
    c.setFont("Helvetica-Bold", 17)
    c.setFillColor(DEEP_NAVY)
    c.drawString(x + 18, y + h - 28, "IB exam-ready evaluation")

    steps = [
        ("1", "Apply it to a real project and explain why timing matters."),
        ("2", "Analyse how the chart improves coordination or control."),
        ("3", "Evaluate the main limit: updates, clutter, or hidden dependencies."),
    ]
    sy = y + 112
    for num, text in steps:
        c.setFillColor(CORAL if num == "1" else AMBER if num == "2" else TEAL)
        c.circle(x + 28, sy + 4, 11, stroke=0, fill=1)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 10)
        c.drawCentredString(x + 28, sy + 1, num)
        draw_paragraph(c, text, x + 48, sy + 4, 182, size=9.5, color=INK, leading=12)
        sy -= 38

    c.setFillColor(SOFT_CORAL)
    c.roundRect(x + 18, y + 16, w - 36, 30, 10, stroke=0, fill=1)
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(CORAL)
    c.drawString(x + 28, y + 28, "Best judgement: use Gantt with CPA when project links are tight.")


def draw_judgement_card(c: canvas.Canvas) -> None:
    x, y, w, h = 304, 82, 251, 172
    shadow_card(c, x, y, w, h, fill=WHITE)
    c.setFont("Helvetica-Bold", 17)
    c.setFillColor(DEEP_NAVY)
    c.drawString(x + 18, y + h - 28, "Strong final judgement")

    c.setFillColor(SOFT_GREEN)
    c.roundRect(x + 18, y + 96, 92, 28, 12, stroke=0, fill=1)
    c.setFillColor(FOREST)
    c.setFont("Helvetica-Bold", 10)
    c.drawCentredString(x + 64, y + 107, "Use it when")
    c.setFillColor(SLATE)
    c.setFont("Helvetica", 9.5)
    c.drawString(x + 122, y + 106, "deadlines, overlap, and communication matter most.")

    c.setFillColor(SOFT_AMBER)
    c.roundRect(x + 18, y + 60, 92, 28, 12, stroke=0, fill=1)
    c.setFillColor(AMBER)
    c.setFont("Helvetica-Bold", 10)
    c.drawCentredString(x + 64, y + 71, "Watch out")
    c.setFillColor(SLATE)
    c.setFont("Helvetica", 9.5)
    c.drawString(x + 122, y + 70, "for complex dependencies, shifting tasks, and resource clashes.")

    summary = (
        "A Gantt chart is excellent for giving managers a clean overview of "
        "what should happen and when. In IB answers, the highest quality "
        "evaluation usually recognises that it is useful on its own for small "
        "or medium projects, but stronger when paired with critical path "
        "analysis for complex work."
    )
    draw_paragraph(c, summary, x + 18, y + 36, w - 36, size=10, color=INK, leading=13)


def draw_page2_header(c: canvas.Canvas) -> None:
    c.setFillColor(DEEP_NAVY)
    c.rect(0, PAGE_HEIGHT - 116, PAGE_WIDTH, 116, stroke=0, fill=1)

    path = c.beginPath()
    path.moveTo(0, PAGE_HEIGHT - 116)
    path.lineTo(156, PAGE_HEIGHT - 116)
    path.lineTo(208, PAGE_HEIGHT - 14)
    path.lineTo(0, PAGE_HEIGHT - 14)
    path.close()
    c.setFillColor(TEAL)
    c.drawPath(path, fill=1, stroke=0)

    c.setFont("Helvetica-Bold", 25)
    c.setFillColor(WHITE)
    c.drawString(228, 786, "Analysis and exam use")
    c.setFont("Helvetica", 12)
    c.setFillColor(lighten(WHITE, 0.08))
    c.drawString(228, 761, "Strengths, limits, and the evaluation points IB markers like to see.")


def draw_page1(c: canvas.Canvas) -> None:
    draw_background(c)
    draw_page1_header(c)
    draw_highlight_card(c)
    draw_quick_facts_card(c)
    draw_gantt_chart_card(c)
    draw_footer(c, 1)


def draw_page2(c: canvas.Canvas) -> None:
    draw_background(c)
    draw_page2_header(c)
    bullet_block(
        c,
        40,
        480,
        247,
        "Strengths",
        [
            "Turns a long project into one easy visual timeline.",
            "Makes overlap and deadlines easier to coordinate.",
            "Helps managers monitor whether progress is on schedule.",
            "Useful for communicating the plan to staff and stakeholders.",
        ],
        FOREST,
        SOFT_GREEN,
    )
    bullet_block(
        c,
        308,
        480,
        247,
        "Limitations",
        [
            "Needs updating when tasks shift or delays occur.",
            "Large projects can become crowded and hard to read.",
            "Does not identify the critical path or float directly.",
            "Timing may be visible even when resource bottlenecks are not.",
        ],
        CORAL,
        SOFT_CORAL,
    )
    draw_compare_table(c)
    draw_exam_card(c)
    draw_judgement_card(c)
    draw_footer(c, 2)


def build_pdf() -> Path:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT_FILE), pagesize=A4)
    c.setTitle("Gantt Charts - IB Business Management")
    c.setAuthor("OpenAI Codex")
    draw_page1(c)
    c.showPage()
    draw_page2(c)
    c.save()
    return OUTPUT_FILE


def render_previews(pdf_path: Path) -> list[Path]:
    if pdfium is None:
        return []

    preview_paths: list[Path] = []
    document = pdfium.PdfDocument(str(pdf_path))
    for index in range(len(document)):
        page = document[index]
        bitmap = page.render(scale=2.6)
        image = bitmap.to_pil()
        preview_path = TMP_DIR / f"gantt_charts_ib_business_page_{index + 1}.png"
        image.save(preview_path)
        preview_paths.append(preview_path)
    return preview_paths


def main() -> None:
    pdf_path = build_pdf()
    preview_paths = render_previews(pdf_path)
    print(f"Created PDF: {pdf_path}")
    for path in preview_paths:
        print(f"Created preview: {path}")


if __name__ == "__main__":
    main()
