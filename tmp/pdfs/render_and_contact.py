from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[2]
PDF = ROOT / "output/pdf/infraflow-professional-agentic-engineering-handbook.pdf"
RENDER = ROOT / "tmp/pdfs/render-pdfium"
CONTACT = ROOT / "tmp/pdfs/contact-sheets"


def label_font(size: int):
    return ImageFont.truetype(
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf", size=size
    )


def main() -> None:
    RENDER.mkdir(parents=True, exist_ok=True)
    CONTACT.mkdir(parents=True, exist_ok=True)
    document = pdfium.PdfDocument(PDF)
    rendered: list[Path] = []

    for index in range(len(document)):
        page = document[index]
        image = page.render(scale=1.2).to_pil().convert("RGB")
        path = RENDER / f"page-{index + 1:02d}.png"
        image.save(path, format="PNG", optimize=True)
        rendered.append(path)
        page.close()

    font = label_font(18)
    per_sheet = 8
    thumb_width = 520
    thumb_height = 736
    gap = 22
    label_height = 32
    columns = 2
    rows = 4

    for sheet_index, start in enumerate(range(0, len(rendered), per_sheet), start=1):
        batch = rendered[start : start + per_sheet]
        sheet = Image.new(
            "RGB",
            (
                columns * thumb_width + (columns + 1) * gap,
                rows * (thumb_height + label_height) + (rows + 1) * gap,
            ),
            "#DCE5E7",
        )
        draw = ImageDraw.Draw(sheet)

        for offset, path in enumerate(batch):
            image = Image.open(path).convert("RGB")
            image.thumbnail((thumb_width, thumb_height), Image.Resampling.LANCZOS)
            column = offset % columns
            row = offset // columns
            x = gap + column * (thumb_width + gap)
            y = gap + row * (thumb_height + label_height + gap)
            draw.rectangle(
                (x - 2, y - 2, x + image.width + 2, y + image.height + 2),
                fill="#9AAEB4",
            )
            sheet.paste(image, (x, y))
            draw.text(
                (x, y + thumb_height + 4),
                f"Sayfa {start + offset + 1}",
                fill="#0D2530",
                font=font,
            )

        sheet.save(CONTACT / f"contact-{sheet_index:02d}.png", format="PNG", optimize=True)

    print(f"pages={len(rendered)} contacts={(len(rendered) + per_sheet - 1) // per_sheet}")


if __name__ == "__main__":
    main()
