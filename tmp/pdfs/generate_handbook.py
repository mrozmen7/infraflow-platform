from __future__ import annotations

import html
import re
import textwrap
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Flowable,
    KeepTogether,
    LongTable,
    PageBreak,
    PageTemplate,
    Paragraph,
    Preformatted,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.platypus.tableofcontents import TableOfContents


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "output/pdf/infraflow-professional-agentic-engineering-handbook.pdf"

NAVY = colors.HexColor("#0D2530")
TEAL = colors.HexColor("#007C83")
CYAN = colors.HexColor("#36C2C7")
RED = colors.HexColor("#D93D47")
INK = colors.HexColor("#17242B")
MUTED = colors.HexColor("#5C6D75")
LINE = colors.HexColor("#C8D4D8")
PALE = colors.HexColor("#EEF4F5")
WARM = colors.HexColor("#FFF7E8")


def register_fonts() -> None:
    base = Path("/System/Library/Fonts/Supplemental")
    pdfmetrics.registerFont(TTFont("InfraSans", str(base / "Arial.ttf")))
    pdfmetrics.registerFont(TTFont("InfraSans-Bold", str(base / "Arial Bold.ttf")))
    pdfmetrics.registerFont(TTFont("InfraSans-Italic", str(base / "Arial Italic.ttf")))
    pdfmetrics.registerFont(
        TTFont("InfraSans-BoldItalic", str(base / "Arial Bold Italic.ttf"))
    )
    pdfmetrics.registerFontFamily(
        "InfraSans",
        normal="InfraSans",
        bold="InfraSans-Bold",
        italic="InfraSans-Italic",
        boldItalic="InfraSans-BoldItalic",
    )
    pdfmetrics.registerFont(
        TTFont("InfraMono", "/System/Library/Fonts/SFNSMono.ttf")
    )


register_fonts()


class CoverPanel(Flowable):
    def __init__(self, width: float, height: float = 218 * mm):
        super().__init__()
        self.width = width
        self.height = height

    def draw(self) -> None:
        c = self.canv
        c.saveState()
        c.setFillColor(NAVY)
        c.roundRect(0, 0, self.width, self.height, 5 * mm, fill=1, stroke=0)
        c.setFillColor(CYAN)
        c.rect(0, self.height - 9 * mm, self.width, 9 * mm, fill=1, stroke=0)
        c.setFillColor(colors.white)
        c.setFont("InfraSans-Bold", 11)
        c.drawString(18 * mm, self.height - 31 * mm, "INFRAFLOW  •  ENGINEERING HANDBOOK")
        c.setFillColor(CYAN)
        c.setFont("InfraSans-Bold", 33)
        c.drawString(18 * mm, self.height - 62 * mm, "Professional")
        c.drawString(18 * mm, self.height - 77 * mm, "Agentic Engineering")
        c.setFillColor(colors.white)
        c.setFont("InfraSans-Bold", 22)
        c.drawString(18 * mm, self.height - 99 * mm, "Specification’dan kanıta")
        c.setStrokeColor(colors.HexColor("#3B5963"))
        c.setLineWidth(1)
        c.line(18 * mm, self.height - 112 * mm, self.width - 18 * mm, self.height - 112 * mm)
        c.setFillColor(colors.HexColor("#D5E3E6"))
        c.setFont("InfraSans", 12)
        lines = [
            "Context • Guardrails • Specification • Planning • TDD",
            "Review • Security • Playwright • Legacy Refactoring • Agent Eval",
        ]
        y = self.height - 129 * mm
        for line in lines:
            c.drawString(18 * mm, y, line)
            y -= 8 * mm
        c.setFillColor(colors.HexColor("#153A45"))
        c.roundRect(18 * mm, 24 * mm, self.width - 36 * mm, 32 * mm, 3 * mm, fill=1, stroke=0)
        c.setFillColor(colors.white)
        c.setFont("InfraSans-Bold", 11)
        c.drawString(25 * mm, 44 * mm, "MODÜL 9–11  /  AŞAMA 3")
        c.setFont("InfraSans", 10)
        c.drawString(25 * mm, 34 * mm, "Angular • Spring Boot • AI projeleri için uyarlanabilir referans")
        c.setFillColor(colors.HexColor("#9FB4BA"))
        c.setFont("InfraSans", 9)
        c.drawRightString(self.width - 18 * mm, 12 * mm, "Sürüm 1.0  •  06 Temmuz 2026")
        c.restoreState()


class HandbookDocTemplate(BaseDocTemplate):
    def __init__(self, filename: str):
        super().__init__(
            filename,
            pagesize=A4,
            leftMargin=18 * mm,
            rightMargin=18 * mm,
            topMargin=19 * mm,
            bottomMargin=18 * mm,
            title="InfraFlow Professional Agentic Engineering Handbook",
            author="InfraFlow Engineering Learning Project",
            subject="Professional AI-assisted engineering, Angular and legacy refactoring",
        )
        frame = self._make_frame()
        self.addPageTemplates(
            PageTemplate(id="main", frames=[frame], onPage=self._decorate_page)
        )
        self._bookmark_id = 0

    def beforeDocument(self) -> None:
        self._bookmark_id = 0
        super().beforeDocument()

    def _make_frame(self):
        from reportlab.platypus import Frame

        return Frame(
            self.leftMargin,
            self.bottomMargin,
            self.width,
            self.height,
            id="content",
            leftPadding=0,
            rightPadding=0,
            topPadding=0,
            bottomPadding=0,
        )

    def _decorate_page(self, canvas, doc) -> None:
        if doc.page == 1:
            return
        canvas.saveState()
        canvas.setStrokeColor(LINE)
        canvas.setLineWidth(0.5)
        canvas.line(18 * mm, A4[1] - 12 * mm, A4[0] - 18 * mm, A4[1] - 12 * mm)
        canvas.setFont("InfraSans-Bold", 7.6)
        canvas.setFillColor(TEAL)
        canvas.drawString(18 * mm, A4[1] - 9 * mm, "INFRAFLOW  /  PROFESSIONAL AGENTIC ENGINEERING")
        canvas.setFont("InfraSans", 8)
        canvas.setFillColor(MUTED)
        canvas.drawRightString(A4[0] - 18 * mm, 9 * mm, f"{doc.page}")
        canvas.drawString(18 * mm, 9 * mm, "Aşama 3 • Referans ve eğitim kaynağı")
        canvas.restoreState()

    def afterFlowable(self, flowable) -> None:
        if not isinstance(flowable, Paragraph):
            return
        level_by_style = {"H1": 0, "H2": 1, "H3": 2}
        level = level_by_style.get(flowable.style.name)
        if level is None:
            return
        self._bookmark_id += 1
        key = f"heading-{self._bookmark_id}"
        text = flowable.getPlainText()
        self.canv.bookmarkPage(key)
        self.canv.addOutlineEntry(text, key, level=level, closed=level > 0)
        self.notify("TOCEntry", (level, text, self.page, key))


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        "H1",
        fontName="InfraSans-Bold",
        fontSize=22,
        leading=26,
        textColor=NAVY,
        spaceBefore=10 * mm,
        spaceAfter=5 * mm,
        keepWithNext=True,
    )
)
styles.add(
    ParagraphStyle(
        "H2",
        fontName="InfraSans-Bold",
        fontSize=15,
        leading=18,
        textColor=TEAL,
        spaceBefore=6 * mm,
        spaceAfter=2.5 * mm,
        keepWithNext=True,
    )
)
styles.add(
    ParagraphStyle(
        "H3",
        fontName="InfraSans-Bold",
        fontSize=11.5,
        leading=14,
        textColor=INK,
        spaceBefore=4 * mm,
        spaceAfter=1.8 * mm,
        keepWithNext=True,
    )
)
styles.add(
    ParagraphStyle(
        "BodyTR",
        fontName="InfraSans",
        fontSize=9.2,
        leading=13.2,
        textColor=INK,
        spaceAfter=2.2 * mm,
        splitLongWords=True,
    )
)
styles.add(
    ParagraphStyle(
        "BulletTR",
        parent=styles["BodyTR"],
        leftIndent=5 * mm,
        firstLineIndent=-3.5 * mm,
        bulletIndent=0,
        spaceAfter=1.2 * mm,
    )
)
styles.add(
    ParagraphStyle(
        "QuoteTR",
        parent=styles["BodyTR"],
        leftIndent=7 * mm,
        rightIndent=4 * mm,
        borderColor=CYAN,
        borderWidth=2,
        borderPadding=(2 * mm, 3 * mm, 2 * mm, 4 * mm),
        backColor=PALE,
        textColor=NAVY,
        fontName="InfraSans-Italic",
        spaceBefore=2 * mm,
        spaceAfter=3 * mm,
    )
)
styles.add(
    ParagraphStyle(
        "CodeTR",
        fontName="InfraMono",
        fontSize=7.15,
        leading=9.4,
        textColor=colors.HexColor("#17343D"),
        backColor=colors.HexColor("#F2F6F7"),
        borderColor=LINE,
        borderWidth=1,
        borderPadding=3 * mm,
        spaceBefore=1.5 * mm,
        spaceAfter=3 * mm,
    )
)
styles.add(
    ParagraphStyle(
        "TableCell",
        fontName="InfraSans",
        fontSize=7.25,
        leading=9.4,
        textColor=INK,
    )
)
styles.add(
    ParagraphStyle(
        "TableHead",
        fontName="InfraSans-Bold",
        fontSize=7.25,
        leading=9.4,
        textColor=colors.white,
    )
)
styles.add(
    ParagraphStyle(
        "FrontNote",
        fontName="InfraSans",
        fontSize=10.2,
        leading=14.5,
        textColor=INK,
        spaceAfter=3 * mm,
    )
)


def inline_markup(value: str) -> str:
    value = html.escape(value.strip())
    value = re.sub(
        r"\[([^\]]+)\]\(([^)]+)\)",
        r'<link href="\2" color="#007C83"><u>\1</u></link>',
        value,
    )
    value = re.sub(r"`([^`]+)`", r'<font name="InfraMono" color="#006B70">\1</font>', value)
    value = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", value)
    value = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", value)
    return value


def wrapped_code(text: str, width: int = 92) -> str:
    rendered: list[str] = []
    for line in text.splitlines():
        if len(line) <= width:
            rendered.append(line)
            continue
        indent = len(line) - len(line.lstrip())
        chunks = textwrap.wrap(
            line.strip(),
            width=max(25, width - indent),
            subsequent_indent=" " * (indent + 2),
            break_long_words=False,
            break_on_hyphens=False,
        )
        rendered.extend((" " * indent + chunks[0], *chunks[1:]))
    return "\n".join(rendered)


def table_widths(column_count: int, total: float) -> list[float]:
    ratios = {
        2: [0.30, 0.70],
        3: [0.24, 0.34, 0.42],
        4: [0.18, 0.29, 0.21, 0.32],
        5: [0.14, 0.18, 0.23, 0.27, 0.18],
    }.get(column_count, [1 / column_count] * column_count)
    return [total * ratio for ratio in ratios]


def parse_table(lines: list[str], width: float) -> LongTable:
    rows: list[list[Paragraph]] = []
    for row_index, line in enumerate(lines):
        if row_index == 1 and re.fullmatch(r"\|?[\s:|-]+\|?", line):
            continue
        values = [cell.strip() for cell in line.strip().strip("|").split("|")]
        style = styles["TableHead"] if not rows else styles["TableCell"]
        rows.append([Paragraph(inline_markup(value), style) for value in values])
    table = LongTable(
        rows,
        colWidths=table_widths(len(rows[0]), width),
        repeatRows=1,
        hAlign="LEFT",
        splitByRow=1,
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), NAVY),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, PALE]),
                ("GRID", (0, 0), (-1, -1), 0.35, LINE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4.5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4.5),
            ]
        )
    )
    return table


def markdown_to_story(path: Path, width: float) -> list[Flowable]:
    lines = path.read_text(encoding="utf-8").splitlines()
    story: list[Flowable] = []
    paragraph: list[str] = []
    code: list[str] = []
    in_code = False
    table_lines: list[str] = []

    def flush_paragraph() -> None:
        if paragraph:
            story.append(Paragraph(inline_markup(" ".join(paragraph)), styles["BodyTR"]))
            paragraph.clear()

    def flush_table() -> None:
        if table_lines:
            story.append(parse_table(table_lines.copy(), width))
            story.append(Spacer(1, 2.5 * mm))
            table_lines.clear()

    for raw in lines:
        line = raw.rstrip()
        if line.startswith("```"):
            flush_paragraph()
            flush_table()
            if in_code:
                story.append(Preformatted(wrapped_code("\n".join(code)), styles["CodeTR"]))
                code.clear()
                in_code = False
            else:
                in_code = True
            continue
        if in_code:
            code.append(line)
            continue
        if line.startswith("|") and line.endswith("|"):
            flush_paragraph()
            table_lines.append(line)
            continue
        flush_table()
        if not line.strip():
            flush_paragraph()
            continue
        heading = re.match(r"^(#{1,3})\s+(.*)$", line)
        if heading:
            flush_paragraph()
            level = len(heading.group(1))
            story.append(Paragraph(inline_markup(heading.group(2)), styles[f"H{level}"]))
            continue
        if line.startswith("> "):
            flush_paragraph()
            story.append(Paragraph(inline_markup(line[2:]), styles["QuoteTR"]))
            continue
        bullet = re.match(r"^\s*[-*]\s+(.*)$", line)
        numbered = re.match(r"^\s*(\d+)\.\s+(.*)$", line)
        if bullet:
            flush_paragraph()
            value = bullet.group(1)
            mark = "☑" if value.startswith("[x]") else "□" if value.startswith("[ ]") else "•"
            value = re.sub(r"^\[[x ]\]\s*", "", value)
            story.append(Paragraph(inline_markup(value), styles["BulletTR"], bulletText=mark))
            continue
        if numbered:
            flush_paragraph()
            story.append(
                Paragraph(
                    inline_markup(numbered.group(2)),
                    styles["BulletTR"],
                    bulletText=f"{numbered.group(1)}.",
                )
            )
            continue
        paragraph.append(line.strip())

    flush_paragraph()
    flush_table()
    if code:
        story.append(Preformatted(wrapped_code("\n".join(code)), styles["CodeTR"]))
    return story


def source_divider(title: str, subtitle: str) -> KeepTogether:
    data = [
        [Paragraph(inline_markup(title), styles["H1"])],
        [Paragraph(inline_markup(subtitle), styles["FrontNote"])],
    ]
    table = Table(data, colWidths=[164 * mm], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PALE),
                ("BOX", (0, 0), (-1, -1), 0.8, CYAN),
                ("LINEBEFORE", (0, 0), (0, -1), 5, TEAL),
                ("LEFTPADDING", (0, 0), (-1, -1), 10 * mm),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8 * mm),
                ("TOPPADDING", (0, 0), (-1, -1), 5 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5 * mm),
            ]
        )
    )
    return KeepTogether([Spacer(1, 16 * mm), table, Spacer(1, 7 * mm)])


def build_story(doc: HandbookDocTemplate) -> list[Flowable]:
    story: list[Flowable] = [
        Spacer(1, 5 * mm),
        CoverPanel(doc.width),
        PageBreak(),
        Paragraph("Bu kaynağı nasıl kullanmalısın?", styles["H1"]),
        Paragraph(
            "Bu PDF bir ezber listesi değildir. Önce ana el kitabıyla zihinsel modeli kur; "
            "sonra gerçek bir görevde reusable workflow'u uygula. Legacy değişiklikte "
            "playbook'u, mülakat öncesinde interview guide'ı, bilinmeyen terimde glossary'yi "
            "aç. Şablonları projenin riskine göre kısalt veya genişlet; güvenlik ve evidence "
            "kapılarını kaldırma.",
            styles["FrontNote"],
        ),
        Table(
            [
                [Paragraph("Katman", styles["TableHead"]), Paragraph("Kullanım", styles["TableHead"])],
                [Paragraph("Evrensel çekirdek", styles["TableCell"]), Paragraph("Context → spec → plan → test → review → evidence", styles["TableCell"])],
                [Paragraph("Project adapter", styles["TableCell"]), Paragraph("Angular, Spring Boot, data veya AI komutları ve riskleri", styles["TableCell"])],
                [Paragraph("Evidence", styles["TableCell"]), Paragraph("Her iddiayı tekrarlanabilir kanıta bağlayan teslim kaydı", styles["TableCell"])],
            ],
            colWidths=[42 * mm, 122 * mm],
            style=TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), NAVY),
                    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, PALE]),
                    ("GRID", (0, 0), (-1, -1), 0.4, LINE),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 6),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                    ("TOPPADDING", (0, 0), (-1, -1), 6),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ]
            ),
        ),
        Spacer(1, 5 * mm),
        Paragraph("İçindekiler", styles["H1"]),
    ]

    toc = TableOfContents()
    toc.levelStyles = [
        ParagraphStyle(
            "TOC1",
            fontName="InfraSans-Bold",
            fontSize=9.6,
            leading=13,
            leftIndent=0,
            firstLineIndent=0,
            textColor=NAVY,
            spaceBefore=2,
        ),
        ParagraphStyle(
            "TOC2",
            fontName="InfraSans",
            fontSize=8.3,
            leading=11,
            leftIndent=7 * mm,
            firstLineIndent=0,
            textColor=INK,
        ),
        ParagraphStyle(
            "TOC3",
            fontName="InfraSans",
            fontSize=7.5,
            leading=9.5,
            leftIndent=14 * mm,
            firstLineIndent=0,
            textColor=MUTED,
        ),
    ]
    story.extend([toc, PageBreak()])

    sources = [
        ("Ana El Kitabı", "Evrensel model ve project adapter", "docs/agentic-engineering/handbook.md"),
        ("Uygulamalı Modül 10", "Specification’dan çalışan Incident response akışına", "docs/learning/module-10-controlled-development-loop.md"),
        ("Uygulamalı Modül 11", "Playwright, review rolleri, refactoring ve eval", "docs/learning/module-11-advanced-agent-flows-legacy-refactoring.md"),
        ("Yeniden Kullanılabilir Workflow", "Her projeye uyarlanacak dokuz kalite kapısı", "docs/agentic-engineering/reusable-workflow.md"),
        ("Güvenlik ve Yetki", "Sandbox, approval, secrets ve prompt injection", "docs/agentic-engineering/security-and-permissions.md"),
        ("Review ve Alt Ajanlar", "Uzman lensleri, paralel/sıralı karar ve görev sınırı", "docs/agentic-engineering/review-roles-and-subagents.md"),
        ("Legacy Refactoring Playbook", "Davranışı characterization test ile koruyan değişim", "docs/agentic-engineering/legacy-refactoring-playbook.md"),
        ("Agent Evaluation", "Scorecard, bütçe, stop criteria ve insan kontrolü", "docs/agentic-engineering/agent-evaluation-scorecard.md"),
        ("Worktree ve İzolasyon", "Git, process, data ve credential ayrımı", "docs/agentic-engineering/worktrees-and-task-isolation.md"),
        ("Mülakat ve Şirket Sunumu", "Junior’dan senior’a kanıtlı anlatım", "docs/agentic-engineering/interview-guide.md"),
        ("Terimler Sözlüğü", "İngilizce kavramların Türkçe çalışma anlamı", "docs/agentic-engineering/glossary.md"),
        ("Şablon: Feature Specification", "Problemden kabul kriterine", "docs/agentic-engineering/templates/feature-specification.md"),
        ("Şablon: Implementation Plan", "Küçük adım, test, stop ve rollback", "docs/agentic-engineering/templates/implementation-plan.md"),
        ("Şablon: Review Checklist", "Architecture, behavior, security ve evidence", "docs/agentic-engineering/templates/review-checklist.md"),
        ("Şablon: Evidence Package", "İddia, komut, sonuç ve kalan risk", "docs/agentic-engineering/templates/evidence-package.md"),
        ("Şablon: Security Checklist", "Yetki ve güven sınırı kontrolü", "docs/agentic-engineering/templates/security-permission-checklist.md"),
    ]

    for index, (title, subtitle, relative) in enumerate(sources):
        if index:
            story.append(PageBreak())
        story.append(source_divider(title, subtitle))
        story.extend(markdown_to_story(ROOT / relative, doc.width))

    story.extend(
        [
            PageBreak(),
            Paragraph("Final Evidence Snapshot", styles["H1"]),
            Paragraph(
                "06 Temmuz 2026 tarihinde aynı working tree üzerinde çalıştırılan "
                "browser-inclusive quality gate sonucu:",
                styles["BodyTR"],
            ),
            parse_table(
                [
                    "| Kontrol | Sonuç | Kanıt |",
                    "|---|---|---|",
                    "| Architecture | Pass | 62 TypeScript dosyası |",
                    "| Guardrails | Pass | 73 source + 3 security proof |",
                    "| Angular/Vitest | Pass | 21/21 dosya, 73/73 test |",
                    "| Production build | Pass | Initial bundle 312.56 kB |",
                    "| Playwright | Pass | Desktop + mobile, 2/2 test |",
                ],
                doc.width,
            ),
            Paragraph(
                "Açık ortam notu: Yerel Node.js 23.11.0 ile doğrulama başarılıdır; repository "
                "standardı 24.15.0 olduğundan kurumsal/CI çalıştırmada sabit LTS sürümü kullanılmalıdır.",
                styles["QuoteTR"],
            ),
            Spacer(1, 8 * mm),
            Paragraph("Son söz", styles["H2"]),
            Paragraph(
                "Profesyonel agentic engineering'in özü daha fazla kod üretmek değildir. "
                "Doğru problemi sınırlamak, yetkiyi dar tutmak, küçük değişiklik yapmak ve "
                "her iddiayı kanıtlamaktır. Bu zincir korunursa araç değişebilir; mühendislik "
                "standardı kalır.",
                styles["FrontNote"],
            ),
        ]
    )
    return story


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = HandbookDocTemplate(str(OUTPUT))
    story = build_story(doc)
    doc.multiBuild(story)
    print(OUTPUT)


if __name__ == "__main__":
    main()
