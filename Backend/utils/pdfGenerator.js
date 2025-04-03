import PDFDocument from 'pdfkit';

export const generateCandidatesPDF = (candidates, jobTitle) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const chunks = [];

            // Collect PDF chunks
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));

            // PDF Header
            doc.fontSize(20)
               .text(`Candidate Profiles - ${jobTitle}`, { align: 'center' })
               .moveDown();

            // Add candidates
            candidates.forEach((candidate, index) => {
                if (index > 0) doc.addPage();

                doc.fontSize(16)
                   .text(`Candidate ${index + 1}: ${candidate.name}`)
                   .moveDown()
                   .fontSize(12);

                // Add candidate details
                const details = [
                    `Email: ${candidate.email}`,
                    `Phone: ${candidate.phone}`,
                    `Experience: ${candidate.experience} years`,
                    `Location: ${candidate.location}`,
                    `Expected Salary: ${candidate.expectedSalary}`,
                    `Current Status: ${candidate.status}`
                ];

                details.forEach(detail => {
                    doc.text(detail).moveDown(0.5);
                });

                // Add skills section if available
                if (candidate.skills?.length) {
                    doc.moveDown()
                       .text('Skills:', { underline: true })
                       .text(candidate.skills.join(', '))
                       .moveDown();
                }
            });

            doc.end();

        } catch (error) {
            reject(error);
        }
    });
}; 