document.addEventListener('DOMContentLoaded', () => {
    // --- UTILITY FUNCTION ---
    // Reads an uploaded image file and returns it as a Base64 string
    const getImageBase64 = (file) => {
        return new Promise((resolve, reject) => {
            if (!file) {
                resolve(null); // No file uploaded
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };
    
    // --- MAIN EXPORT FUNCTIONS ---
    
    // Function to generate PDF
    const generatePDF = async () => {
        // Get form data
        const parties = document.getElementById('parties').value;
        const dateLocation = document.getElementById('date-location').value;
        const background = document.getElementById('background').value;
        const result = document.getElementById('result').value;
        const actionPlan = document.getElementById('action-plan').value;
        const prepName = document.getElementById('prep-name').value;
        const prepDept = document.getElementById('prep-dept').value;
        const signatureFile = document.getElementById('signature-upload').files[0];

        const signatureBase64 = await getImageBase64(signatureFile);

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        let y = 20; // Y-coordinate for placing text

        // Header
        doc.setFontSize(16).setFont(undefined, 'bold');
        doc.text('Minutes of Meeting', 105, y, { align: 'center' });
        y += 15;

        doc.setFontSize(11).setFont(undefined, 'normal');
        doc.text(`Parties Involved: ${parties}`, 15, y);
        y += 7;
        doc.text(`Date & Location: ${dateLocation}`, 15, y);
        y += 15;

        // Body
        doc.setFontSize(12).setFont(undefined, 'bold');
        doc.text('1. Background', 15, y);
        y += 7;
        doc.setFontSize(11).setFont(undefined, 'normal');
        doc.text(background, 15, y, { maxWidth: 180 });
        y = doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : y + 30; // Adjust y after text block

        doc.setFontSize(12).setFont(undefined, 'bold');
        doc.text('2. Result', 15, y);
        y += 7;
        doc.setFontSize(11).setFont(undefined, 'normal');
        doc.text(result, 15, y, { maxWidth: 180 });
        y = doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : y + 40;

        doc.setFontSize(12).setFont(undefined, 'bold');
        doc.text('3. Action Plan', 15, y);
        y += 7;
        doc.setFontSize(11).setFont(undefined, 'normal');
        doc.text(actionPlan, 15, y, { maxWidth: 180 });
        y = doc.previousAutoTable ? doc.previousAutoTable.finalY + 20 : y + 40;

        // Approval Section
        y = y > 220 ? 220 : y; // Move to bottom part of the page if too low
        doc.text('These minutes are made in utmost faith, the content has been approved as guidelines for works.', 15, y);
        y += 7;
        doc.text(`Prepared by: ${prepDept}`, 15, y);
        y += 15;
        
        if (signatureBase64) {
            doc.addImage(signatureBase64, 'PNG', 15, y, 40, 20);
            y += 25;
        }

        doc.text(prepName, 15, y);

        // Save the PDF
        doc.save('minutes-of-meeting.pdf');
    };

    // Function to generate Word Doc
    const generateWord = async () => {
        // Get form data (same as PDF)
        const parties = document.getElementById('parties').value;
        const dateLocation = document.getElementById('date-location').value;
        const background = document.getElementById('background').value;
        const result = document.getElementById('result').value;
        const actionPlan = document.getElementById('action-plan').value;
        const prepName = document.getElementById('prep-name').value;
        const prepDept = document.getElementById('prep-dept').value;
        const signatureFile = document.getElementById('signature-upload').files[0];

        const signatureBase64 = await getImageBase64(signatureFile);
        let signatureBuffer = null;
        if (signatureBase64) {
            // Convert base64 to ArrayBuffer for the docx library
            const res = await fetch(signatureBase64);
            signatureBuffer = await res.arrayBuffer();
        }

        const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun } = docx;

        const children = [
            new Paragraph({
                children: [new TextRun({ text: 'Minutes of Meeting', bold: true, size: 32 })],
                alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: `Parties Involved: ${parties}`, style: "Normal" }),
            new Paragraph({ text: `Date & Location: ${dateLocation}`, style: "Normal" }),
            new Paragraph({ text: '' }), // Spacer
            new Paragraph({
                children: [new TextRun({ text: '1. Background', bold: true, size: 24 })],
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({ text: background }),
            new Paragraph({ text: '' }),
            new Paragraph({
                children: [new TextRun({ text: '2. Result', bold: true, size: 24 })],
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({ text: result }),
            new Paragraph({ text: '' }),
            new Paragraph({
                children: [new TextRun({ text: '3. Action Plan', bold: true, size: 24 })],
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({ text: actionPlan }),
            new Paragraph({ text: '' }), new Paragraph({ text: '' }), // Spacers
            new Paragraph({ text: 'These minutes are made in utmost faith, the content has been approved as guidelines for works.' }),
            new Paragraph({ text: `Prepared by: ${prepDept}` }),
            new Paragraph({ text: '' }),
        ];

        // Add signature if it exists
        if (signatureBuffer) {
            children.push(new Paragraph({
                children: [new ImageRun({
                    data: signatureBuffer,
                    transformation: { width: 160, height: 80 },
                })]
            }));
        }

        children.push(new Paragraph({ text: prepName }));

        const doc = new Document({
            sections: [{
                properties: {},
                children: children,
            }],
        });

        // Save the Word file
        Packer.toBlob(doc).then(blob => {
            saveAs(blob, "minutes-of-meeting.docx");
        });
    };


    // --- EVENT LISTENERS ---
    document.getElementById('export-pdf').addEventListener('click', generatePDF);
    document.getElementById('export-word').addEventListener('click', generateWord);
});
