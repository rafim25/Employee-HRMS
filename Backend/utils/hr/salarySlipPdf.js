import PDFDocument from "pdfkit";

const COMPANY = {
  name: "Seven Wings Technologies",
  addressLine1: "No.313/313A, Siddhaiah Puranik Rd, East Jayanagar",
  addressLine2: "Bengaluru, Karnataka, India - 560050",
};

export const monthName = (m) =>
  [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][m - 1] || String(m);

const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

const twoDigits = (n) => {
  if (n < 20) return ones[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return `${tens[t]}${o ? ` ${ones[o]}` : ""}`.trim();
};

const threeDigits = (n) => {
  if (n < 100) return twoDigits(n);
  const h = Math.floor(n / 100);
  const rest = n % 100;
  return `${ones[h]} Hundred${rest ? ` ${twoDigits(rest)}` : ""}`.trim();
};

/** Convert integer amount to English words (Indian grouping: lakh/crore). */
export const amountInWords = (amount) => {
  const n = Math.round(Number(amount) || 0);
  if (n === 0) return "Zero";

  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const hundred = n % 1000;

  const parts = [];
  if (crore) parts.push(`${threeDigits(crore)} Crore`);
  if (lakh) parts.push(`${threeDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${threeDigits(thousand)} Thousand`);
  if (hundred) parts.push(threeDigits(hundred));
  return parts.join(" ");
};

const formatMoney = (n) =>
  Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value).slice(0, 10);
  return d.toISOString().slice(0, 10);
};

/**
 * Payslip layout matching the reference design:
 * centered title + company, two-column employee meta, earnings|deductions table,
 * net pay + words, signature lines, system-generated footer.
 */
export const generateSalarySlipPdf = ({
  employee,
  year,
  month,
  pay,
  workedDays = 0,
  dateOfJoining = null,
}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const chunks = [];
      doc.on("data", (c) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const pageWidth = doc.page.width;
      const left = 50;
      const right = pageWidth - 50;
      const contentWidth = right - left;

      // Header
      doc.font("Helvetica-Bold").fontSize(28).fillColor("#000000");
      doc.text("Payslip", left, 48, { width: contentWidth, align: "center" });
      doc.moveDown(0.4);
      doc.fontSize(14).text(COMPANY.name, { align: "center" });
      doc.font("Helvetica").fontSize(10);
      doc.text(COMPANY.addressLine1, { align: "center" });
      doc.text(COMPANY.addressLine2, { align: "center" });

      let y = doc.y + 22;
      const colGap = 40;
      const colWidth = (contentWidth - colGap) / 2;
      const leftColX = left;
      const rightColX = left + colWidth + colGap;
      const lineH = 16;

      const metaLeft = [
        ["Date of Joining", formatDate(dateOfJoining || employee?.date_joined)],
        ["Pay Period", `${monthName(month)} ${year}`],
        ["Worked Days", String(workedDays ?? "-")],
      ];
      const metaRight = [
        ["Employee name", employee?.name || "-"],
        ["Designation", employee?.designation || "-"],
        ["Department", employee?.department || "-"],
      ];

      doc.fontSize(10);
      metaLeft.forEach(([label, value], i) => {
        doc.font("Helvetica-Bold").text(`${label} : `, leftColX, y + i * lineH, { continued: true });
        doc.font("Helvetica").text(value);
      });
      metaRight.forEach(([label, value], i) => {
        doc.font("Helvetica-Bold").text(`${label} : `, rightColX, y + i * lineH, { continued: true });
        doc.font("Helvetica").text(value);
      });

      y += metaLeft.length * lineH + 18;

      const earnings = pay.breakdown?.earnings || [];
      const deductions = pay.breakdown?.deductions || [];
      const rowCount = Math.max(earnings.length, deductions.length, 1) + 2; // lines + totals + net
      const colW = [contentWidth * 0.3, contentWidth * 0.2, contentWidth * 0.3, contentWidth * 0.2];
      const tableTop = y;
      const headerH = 22;
      const rowH = 20;
      const tableH = headerH + rowCount * rowH;

      // Table outer border
      doc.rect(left, tableTop, contentWidth, tableH).stroke("#000000");

      // Header fill
      doc.save();
      doc.rect(left, tableTop, contentWidth, headerH).fill("#d9d9d9");
      doc.restore();
      doc.rect(left, tableTop, contentWidth, headerH).stroke("#000000");

      // Vertical column lines
      let x = left;
      for (let i = 0; i < 3; i++) {
        x += colW[i];
        doc.moveTo(x, tableTop).lineTo(x, tableTop + tableH).stroke("#000000");
      }

      // Header labels
      const headers = ["Earnings", "Amount", "Deductions", "Amount"];
      x = left;
      doc.font("Helvetica-Bold").fontSize(10);
      headers.forEach((h, i) => {
        doc.text(h, x + 6, tableTop + 6, { width: colW[i] - 12, align: i % 2 === 1 ? "right" : "left" });
        x += colW[i];
      });

      // Data rows
      doc.font("Helvetica").fontSize(10);
      for (let r = 0; r < Math.max(earnings.length, deductions.length, 1); r++) {
        const rowY = tableTop + headerH + r * rowH;
        doc.moveTo(left, rowY).lineTo(right, rowY).stroke("#000000");
        const e = earnings[r];
        const d = deductions[r];
        let cx = left;
        doc.text(e?.name || "", cx + 6, rowY + 5, { width: colW[0] - 12 });
        cx += colW[0];
        doc.text(e ? formatMoney(e.amount) : "", cx + 6, rowY + 5, { width: colW[1] - 12, align: "right" });
        cx += colW[1];
        doc.text(d?.name || "", cx + 6, rowY + 5, { width: colW[2] - 12 });
        cx += colW[2];
        doc.text(d ? formatMoney(d.amount) : "", cx + 6, rowY + 5, { width: colW[3] - 12, align: "right" });
      }

      // Totals row
      const totalsRow = Math.max(earnings.length, deductions.length, 1);
      const totalsY = tableTop + headerH + totalsRow * rowH;
      doc.moveTo(left, totalsY).lineTo(right, totalsY).stroke("#000000");
      doc.font("Helvetica-Bold");
      let cx = left;
      doc.text("Total Earnings", cx + 6, totalsY + 5, { width: colW[0] - 12, align: "right" });
      cx += colW[0];
      doc.text(formatMoney(pay.gross_earnings), cx + 6, totalsY + 5, { width: colW[1] - 12, align: "right" });
      cx += colW[1];
      doc.text("Total Deductions", cx + 6, totalsY + 5, { width: colW[2] - 12, align: "right" });
      cx += colW[2];
      doc.text(formatMoney(pay.total_deductions), cx + 6, totalsY + 5, { width: colW[3] - 12, align: "right" });

      // Net pay row
      const netY = totalsY + rowH;
      doc.moveTo(left, netY).lineTo(right, netY).stroke("#000000");
      cx = left + colW[0] + colW[1];
      doc.text("Net Pay", cx + 6, netY + 5, { width: colW[2] - 12, align: "right" });
      cx += colW[2];
      doc.text(formatMoney(pay.net_pay), cx + 6, netY + 5, { width: colW[3] - 12, align: "right" });

      y = tableTop + tableH + 28;

      // Centered net pay + words
      doc.font("Helvetica-Bold").fontSize(12);
      doc.text(formatMoney(pay.net_pay), left, y, { width: contentWidth, align: "center" });
      y += 18;
      doc.font("Helvetica").fontSize(11);
      doc.text(amountInWords(pay.net_pay), left, y, { width: contentWidth, align: "center" });

      y += 50;
      const sigWidth = (contentWidth - 40) / 2;
      doc.font("Helvetica").fontSize(10);
      doc.text("Employer Signature", left, y, { width: sigWidth, align: "center" });
      doc.text("Employee Signature", left + sigWidth + 40, y, { width: sigWidth, align: "center" });
      y += 28;
      doc.moveTo(left + 20, y).lineTo(left + sigWidth - 20, y).stroke("#000000");
      doc
        .moveTo(left + sigWidth + 60, y)
        .lineTo(left + contentWidth - 20, y)
        .stroke("#000000");

      // Footer
      doc.fontSize(9).fillColor("#333333");
      doc.text("This is system generated payslip", left, doc.page.height - 60, {
        width: contentWidth,
        align: "center",
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
