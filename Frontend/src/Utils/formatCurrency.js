export const formatCurrency = (value) => {
  const numValue = Number(value);
  if (numValue >= 10000000) {
    // 10 million or more
    return "₹" + (numValue / 10000000).toFixed(2) + "Cr";
  } else if (numValue >= 100000) {
    // 1 lakh or more
    return "₹" + (numValue / 100000).toFixed(2) + "L";
  } else if (numValue >= 1000) {
    // 1 thousand or more
    return "₹" + (numValue / 1000).toFixed(2) + "K";
  }
  return "₹" + numValue.toFixed(2);
};
