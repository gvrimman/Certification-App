import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function generatePDF(data) {
  const { name, role, position, type, startDate, endDate, gender } = data;

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  const duration = calculateDuration(startDate, endDate);

  const durationText = `
    ${
      duration.years > 0
        ? `${duration.years} year${duration.years > 1 ? "s" : ""}`
        : ""
    }
    ${
      duration.months > 0
        ? `${duration.months} month${duration.months > 1 ? "s" : ""}`
        : ""
    }
    ${
      duration.days > 0
        ? `${duration.days} day${duration.days > 1 ? "s" : ""}`
        : ""
    }
  `.trim();

  const existingPdfBytes = await fetch("/base.pdf").then((res) =>
    res.arrayBuffer()
  );

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const page = pdfDoc.getPage(0);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  page.setFontSize(12);

  const experienceCont = `
    <span class="text-2xl bg-red-400 mb-20 ml-60">CERTIFICATE OF EXPERIENCE</span>

This is to certify that <span class="font-bold">${name}</span> has worked with our <span class="font-bold">Learnbuds</span> from
<span class="font-bold">${formattedStartDate}</span> to <span class="font-bold">${formattedEndDate}</span> as a <span class="font-bold">${position} ${role} ${
    role === "Python" ? "Full" : ""
  } Stack Developer</span> 
over a period of ${`<span class="font-bold">${durationText}</span>`}.

During ${
    gender === "male" ? "his" : "her"
  } tenure with us, <span class="font-bold">${name}</span> was actively involved in a live project,
showcasing technical skills and dedication in real-world project
development. ${
    gender === "male" ? "He" : "She"
  } has also demonstrated expertise in developing,
designing, and deploying web applications, ${
    role === "Python"
      ? `using Python as the primary
       backend language and a variety of frontend and database technologies.`
      : `using the MERN Stack
(MongoDB, Express.js, React.js, and Node.js).`
  }

<span class="font-bold">${name}</span> has consistently shown a high level of professionalism, dedication,
 and commitment to work and contributed positively to our team.


Yours Sincerely,
Immanuel Varghese 
MD & CEO
Learnbuds
  `;

  const internCont = `
   ${
     type === "masterClass"
       ? `<span class="text-2xl bg-red-400 mb-20 ml-35">ADVANCED TRAINING CERTIFICATE</span>`
       : `<span class="text-2xl bg-red-400 mb-20 ml-60">CERTIFICATE OF INTERNSHIP</span>`
   }

This is to certify that <span class="font-bold">${name}</span> has successfully completed ${
    gender === "male" ? "his" : "her"
  } ${
    type === "masterClass"
      ? `<span class="font-bold">45 days</span>`
      : `<span class="font-bold">${durationText}</span>`
  } 
${
  type === "masterClass" ? "advance training" : ""
} as a <span class="font-bold">${role} ${
    role === "Python" ? "Full" : ""
  } Stack Developer Intern</span> with <span class="font-bold">Learnbuds</span>. 
  The duration of internship was from <span class="font-bold">${formattedStartDate}</span> to <span class="font-bold">${formattedEndDate}</span>  .

During ${
    gender === "male" ? "his" : "her"
  } tenure with us, <span class="font-bold">${name}</span> was actively involved in a live project,
showcasing technical skills and dedication in real-world project
development. ${
    gender === "male" ? "He" : "She"
  } has also demonstrated expertise in developing,
designing, and deploying web applications, ${
    role === "Python"
      ? `using Python as the primary
       backend language and a variety of frontend and database technologies.`
      : `using the MERN Stack
(MongoDB, Express.js, React.js, and Node.js).`
  }

<span class="font-bold">${name}</span> has consistently shown a high level of professionalism, dedication,
 and commitment to work and contributed positively to our team.

 We wish the candidate all the success in his future endeavours.

Yours Sincerely,
Immanuel Varghese 
MD & CEO
Learnbuds
  `;
  // This is to certify that <span class="font-bold">${name}</span> has successfully completed ${
  //     gender === "male" ? "his" : "her"
  //   } <span class="font-bold">45 days</span>
  // advance training as a <span class="font-bold">${role} ${
  //     role === "Python" ? "Full" : ""
  //   } Stack Developer Intern</span> with <span class="font-bold">Learnbuds</span>. The duration
  //   of internship was from <span class="font-bold">${formattedStartDate}</span> to <span class="font-bold">${formattedEndDate}</span>  .

  // During ${
  //     gender === "male" ? "his" : "her"
  //   } tenure with us, <span class="font-bold">${name}</span> was actively involved in a live project,
  // showcasing technical skills and dedication in real-world project
  // development. ${
  //     gender === "male" ? "He" : "She"
  //   } has also demonstrated expertise in developing,
  // designing, and deploying web applications, ${
  //     role === "Python"
  //       ? `using Python as the primary
  //        backend language and a variety of frontend and database technologies.`
  //       : `using the MERN Stack
  // (MongoDB, Express.js, React.js, and Node.js).`
  //   }

  // <span class="font-bold">${name}</span> has consistently shown a high level of professionalism, dedication,
  //  and commitment to work and contributed positively to our team.

  //  We wish the candidate all the success in his future endeavours.

  // Yours Sincerely,
  // Immanuel Varghese
  // MD & CEO
  // Learnbuds
  //   `;

  const content = type === "experience" ? experienceCont : internCont;

  const lines = content.split("\n").map((line) => line.trim());
  let currentY = 650;

  for (const line of lines) {
    const segments = parseSegments(line);
    let offsetX = 90;

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

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
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

function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); // Days in the previous month
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}
