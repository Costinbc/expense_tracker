// Format currency value to local currency format
export const formatCurrency = (value, currencyCode = 'USD') => {
    if (value === null || value === undefined) return '';

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

// Format number with thousand separators
export const formatNumber = (value) => {
    if (value === null || value === undefined) return '';

    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

// Parse currency string to number
export const parseCurrencyToNumber = (currencyString) => {
    if (!currencyString) return 0;

    // Remove currency symbol and other non-numeric characters except decimal point
    const numericString = currencyString.replace(/[^0-9.-]+/g, '');
    return parseFloat(numericString);
};