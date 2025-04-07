export const numberToWords = (number) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    const convertLessThanHundred = (num) => {
        if (num === 0) return '';
        if (num < 10) return ones[num];
        if (num < 20) return teens[num - 10];
        
        const ten = Math.floor(num / 10);
        const one = num % 10;
        return (tens[ten] + (one ? ' ' + ones[one] : '')).trim();
    };

    const formatIndianNumber = (num) => {
        if (num === 0) return 'Zero';
        
        let result = '';
        
        // Handle Crores
        const crores = Math.floor(num / 10000000);
        if (crores > 0) {
            result += convertLessThanHundred(crores) + ' Crore ';
            num = num % 10000000;
        }

        // Handle Lakhs
        const lakhs = Math.floor(num / 100000);
        if (lakhs > 0) {
            result += convertLessThanHundred(lakhs) + ' Lakh ';
            num = num % 100000;
        }

        // Handle Thousands
        const thousands = Math.floor(num / 1000);
        if (thousands > 0) {
            result += convertLessThanHundred(thousands) + ' Thousand ';
            num = num % 1000;
        }

        // Handle Hundreds
        const hundreds = Math.floor(num / 100);
        if (hundreds > 0) {
            result += convertLessThanHundred(hundreds) + ' Hundred ';
            num = num % 100;
        }

        // Handle remaining tens and ones
        if (num > 0) {
            result += convertLessThanHundred(num);
        }

        return result.trim();
    };

    // Convert the number to a proper format
    const formattedNumber = parseFloat(number);
    if (isNaN(formattedNumber)) return '';
    
    return formatIndianNumber(Math.round(formattedNumber));
};

// Helper function to format currency in Indian format
export const formatIndianCurrency = (number) => {
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });
    return formatter.format(number);
}; 