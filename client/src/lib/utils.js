// Format a date to 'DD MMM YYYY' (always date, never time)
export function formatDate(date) {
    const d = new Date(date);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}