import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function generatePDF(data) {
  const { name, role, position, startDate, endDate, gender } = data;

  const existingPdfBytes = await fetch("/base.pdf").then((res) =>
    res.arrayBuffer()
  );

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const page = pdfDoc.getPage(0);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  page.setFontSize(12);

  const content = `
    <span class="text-2xl bg-red-400 mb-20 ml-90">CERTIFICATE OF EXPERIENCE</span>

This is to certify that <span class="font-bold">${name}</span> has worked with our company from
<span class="font-bold">${startDate}</span> to <span class="font-bold">${endDate}</span> as a <span class="font-bold">${position} (${role})</span>.

During ${
    gender === "male" ? "his" : "her"
  } tenure with us, <span class="font-bold">${name}</span> was actively involved in a live project,
showcasing technical skills and dedication in real-world project
development. ${
    gender === "male" ? "He" : "She"
  } has demonstrated expertise in developing,
designing, and deploying web applications, leveraging technologies relevant
to the role of <span class="font-bold">${position} (${role})</span>.

<span class="font-bold">${name}</span> has consistently shown a high level of professionalism, dedication,
 and commitment to work and contributed positively to our team.


Yours Sincerely,
Immanuel Varghese 
MD & CEO
Learnbuds
  `;

  const lines = content.split("\n").map((line) => line.trim());
  let currentY = 650;

  for (const line of lines) {
    const segments = parseSegments(line);
    let offsetX = 70;

    for (const segment of segments) {
      const { text, isBold, styles } = segment;
      const fontToUse = isBold ? boldFont : font;

      offsetX += styles.marginLeft || 0;
      currentY -= styles.marginTop || 0;

      page.drawText(text, {
        x: offsetX,
        y: currentY,
        size: styles.fontSize,
        color: styles.color,
        font: fontToUse,
      });

      offsetX += fontToUse.widthOfTextAtSize(text, styles.fontSize);
      currentY -= styles.marginBottom || 0;
    }
    currentY -= 20;
  }

  const pdfBytes = await pdfDoc.save();
  download(pdfBytes, `${name} certificate.pdf`, "application/pdf");
}

function download(blob, filename, type) {
  const blobFile = new Blob([blob], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blobFile);
  link.download = filename;
  link.click();
}

function parseSegments(line) {
  const segments = [];
  const spanRegex = /<span class="([^"]+)">([^<]*)<\/span>/g;
  let lastIndex = 0;
  let match;

  while ((match = spanRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        text: line.slice(lastIndex, match.index),
        isBold: false,
        styles: { fontSize: 12, color: rgb(0, 0, 0) },
      });
    }

    const classNames = match[1].split(" ");
    const text = match[2];
    const isBold = classNames.includes("font-bold");
    const fontSize = classNames.includes("text-2xl") ? 20 : 12;
    const color = classNames.includes("bg-red-400")
      ? rgb(1, 0, 0)
      : rgb(0, 0, 0);

    const styles = {
      fontSize,
      color,
      marginLeft: getMarginValue(classNames, "ml"),
      marginTop: getMarginValue(classNames, "mt"),
      marginBottom: getMarginValue(classNames, "mb"),
    };

    segments.push({ text, isBold, styles });
    lastIndex = spanRegex.lastIndex;
  }

  if (lastIndex < line.length) {
    segments.push({
      text: line.slice(lastIndex),
      isBold: false,
      styles: { fontSize: 12, color: rgb(0, 0, 0) },
    });
  }

  return segments;
}

function getMarginValue(classNames, prefix) {
  const marginClass = classNames.find((className) =>
    className.startsWith(prefix)
  );
  return marginClass ? parseInt(marginClass.split("-")[1], 10) : 0;
}