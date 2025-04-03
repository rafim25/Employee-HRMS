export const processUploadedCandidates = (excelData) => {
  return excelData.map((row, index) => {
    // Skip header row
    if (index === 0) return null;

    return {
      code: row[0]?.startsWith('CAND') ? row[0] : `CAND${String(index).padStart(3, '0')}`,
      first_name: row[1] || '',
      last_name: row[2] || '',
      email: row[3] || '',
      phone: row[4] || '',
      job_title: row[5] || '',
      experience: row[6] || '',
      state: row[7] || '',
      city: row[8] || '',
      expected_salary: row[9] || null,
      current_salary: row[10] || null,
      resume: row[11] || '',
      source: row[12] || 'Direct',
      status: normalizeStatus(row[13] || 'Applied')
    };
  }).filter(row => row !== null); // Remove header row
};

const normalizeStatus = (status) => {
  const statusMap = {
    'applied': 'applied',
    'screening': 'screening',
    'shortlisted': 'shortlisted',
    'interviewed': 'interviewed',
    'selected': 'selected',
    'rejected': 'rejected',
    'hold': 'hold',
    'interested': 'applied' // Map 'interested' to 'applied'
  };

  return statusMap[status.toLowerCase()] || 'applied';
}; 