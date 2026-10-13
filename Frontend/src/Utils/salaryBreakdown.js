export const computeSalaryBreakdown = (basicSalary, selectedComponents, componentCatalog = []) => {
  const basic = Number(basicSalary) || 0;
  const byId = Object.fromEntries(componentCatalog.map((c) => [String(c.id), c]));

  const earnings = [{ code: 'BASIC', name: 'Basic Salary', amount: basic, type: 'earning' }];
  const deductions = [];

  for (const row of selectedComponents || []) {
    const comp = row.component || byId[String(row.component_id)];
    if (!comp) continue;
    let amount = Number(row.amount) || 0;
    if (comp.is_percentage) {
      amount = (basic * amount) / 100;
    }
    amount = Math.round(amount * 100) / 100;
    const item = {
      code: comp.code,
      name: comp.name,
      amount,
      type: comp.type,
      is_percentage: comp.is_percentage,
      raw: Number(row.amount) || 0,
      component_id: comp.id || row.component_id,
    };
    if (comp.type === 'deduction') deductions.push(item);
    else earnings.push(item);
  }

  const gross = Math.round(earnings.reduce((s, e) => s + e.amount, 0) * 100) / 100;
  const totalDeductions = Math.round(deductions.reduce((s, d) => s + d.amount, 0) * 100) / 100;
  const net = Math.round((gross - totalDeductions) * 100) / 100;

  return {
    earnings,
    deductions,
    gross_earnings: gross,
    total_deductions: totalDeductions,
    net_pay: net,
  };
};

export const formatMoney = (n) =>
  Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const periodLabel = (month, year) =>
  `${MONTH_NAMES[(Number(month) || 1) - 1] || month} ${year}`;
