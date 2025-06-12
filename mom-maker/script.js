document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("mom-form");
  const statusDiv = document.getElementById("status");
  const saveBtn = document.getElementById("saveLocal");
  const loadBtn = document.getElementById("loadLocal");

  function getFormData() {
    const data = new FormData(form);
    return Object.fromEntries(data.entries());
  }

  function setFormData(data) {
    Object.entries(data).forEach(([key, value]) => {
      const field = form.elements[key];
      if (field) field.value = value;
    });
  }

  function saveToLocal() {
    const data = getFormData();
    const now = new Date().toISOString();
    const existing = JSON.parse(localStorage.getItem("momRecords") || "[]");
    existing.push({ id: now, ...data });
    localStorage.setItem("momRecords", JSON.stringify(existing));
    statusDiv.textContent = "Saved to local storage ✅";
  }

  function loadFromLocal() {
    const records = JSON.parse(localStorage.getItem("momRecords") || "[]");
    if (records.length === 0) {
      statusDiv.textContent = "No records found.";
      return;
    }
    const latest = records[records.length - 1];
    setFormData(latest);
    statusDiv.textContent = "Loaded last saved record.";
  }

  async function generateDocx(data) {
    const { Document, Packer, Paragraph } = window.docx;
    const {
      datetime, agenda, venue, attendees, background,
      result, actionPlan, preparedBy, location, preparedDate
    } = data;

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: "Minutes of Meeting", heading: "Title" }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: `Date & Time: ${datetime}` }),
          new Paragraph({ text: `Agenda: ${agenda}` }),
          new Paragraph({ text: `Venue: ${venue}` }),
          new Paragraph({ text: `Attendees: ${attendees}` }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "1. Background", heading: "Heading1" }),
          new Paragraph(background || "(None)"),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "2. Result", heading: "Heading1" }),
          new Paragraph(result || "(None)"),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "3. Action Plan", heading: "Heading1" }),
          new Paragraph(actionPlan || "(None)"),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "These minutes are made in utmost faith, the content has been approved as guidelines for works."
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Prepared by Technical Design Management Department of KCIC"
          }),
          new Paragraph({ text: preparedBy }),
          new Paragraph({ text: `${location}, ${preparedDate}` }),
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `MoM_${agenda.replace(/\s+/g, "_")}.docx`);
  }

  function generatePDF(data) {
    const {
      datetime, agenda, venue, attendees, background,
      result, actionPlan, preparedBy, location, preparedDate
    } = data;

    const docDefinition = {
      content: [
        { text: 'Minutes of Meeting', style: 'header' },
        { text: '\n' },
        { text: `Date & Time: ${datetime}`, style: 'info' },
        { text: `Agenda: ${agenda}`, style: 'info' },
        { text: `Venue: ${venue}`, style: 'info' },
        { text: `Attendees: ${attendees}`, style: 'info' },
        { text: '\n' },
        { text: '1. Background', style: 'subheader' },
        { text: background || '(None)', margin: [0, 0, 0, 10] },
        { text: '2. Result', style: 'subheader' },
        { text: result || '(None)', margin: [0, 0, 0, 10] },
        { text: '3. Action Plan', style: 'subheader' },
        { text: actionPlan || '(None)', margin: [0, 10, 0, 10] },
        { text: "These minutes are made in utmost faith...", italics: true, margin: [0, 10, 0, 10] },
        { text: "Prepared by Technical Design Management Department of KCIC", margin: [0, 10, 0, 0] },
        { text: preparedBy },
        { text: `${location}, ${preparedDate}` }
      ],
      styles: {
        header: { fontSize: 20, bold: true, alignment: 'center' },
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
        info: { fontSize: 11 }
      },
      defaultStyle: { fontSize: 11 },
      pageMargins: [40, 60, 40, 60]
    };

    pdfMake.createPdf(docDefinition).download(`MoM_${agenda.replace(/\s+/g, "_")}.pdf`);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = getFormData();
    await generateDocx(data);
    generatePDF(data);
  });

  saveBtn.addEventListener("click", saveToLocal);
  loadBtn.addEventListener("click", loadFromLocal);
});