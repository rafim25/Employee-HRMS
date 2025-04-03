import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const candidateTemplate = {
  headers: [
    'Code', 'First Name', 'Last Name', 'Email', 'Mobile', 'Job Title', 
    'Experience', 'State', 'City', 'Expected Salary', 'Current Salary', 
    'Resume', 'Source', 'Status'
  ],
  sampleRow: [
    'CAND001', 'John', 'Doe', 'john.doe@email.com', '1234567890', 
    'Software Engineer', '5', 'Karnataka', 'Bangalore', 
    '10', '8', 'john_resume.pdf', 'Direct', 'Applied'
  ]
};

// Function to generate and download the Excel file
export const downloadCandidateTemplate = async ({ data1, fileName = "candidate-upload-template" }) => {
  return new Promise((resolve, reject) => {
    try {
      if (!data1 || !Array.isArray(data1) || data1.length === 0) {
        console.error("❌ No valid data provided for the Excel file.");
        resolve(false);
        return;
      }

      // Convert JSON data to worksheet
      const worksheet = XLSX.utils.json_to_sheet(data1);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");

      // Convert workbook to binary buffer
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

      // Create Blob and trigger download
      const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, `${fileName}.xlsx`);

      console.log("✅ Candidate template downloaded successfully!");
      resolve(true);
    } catch (error) {
      console.error("❌ Error generating candidate template:", error);
      reject(false);
    }
  });
};
