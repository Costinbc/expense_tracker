// Format date to YYYY-MM-DD
export const formatDateToISO = (date) => {
    if (!date) return '';

    const d = new Date(date);
    return d.toISOString().split('T')[0];
};

// Format date to DD/MM/YYYY
export const formatDateToDisplay = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

// Format date and time
export const formatDateTime = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// Convert string date from input in YYYY-MM-DD format to Date object
export const parseInputDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString);
};

// Get today's date in YYYY-MM-DD format for input default value
export const getTodayForInput = () => {
    const today = new Date();
    return formatDateToISO(today);
};

export { formatDateToDisplay as formatDate };