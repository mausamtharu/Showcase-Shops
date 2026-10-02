// ── Price Formatting ──────────────────────────────────────────────────────────
export function formatPrice(amount, currency = 'NPR') {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-NP', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(num);
}
export function formatPriceCompact(amount) {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (num >= 100000)
        return `रू ${(num / 100000).toFixed(1)}L`;
    if (num >= 1000)
        return `रू ${(num / 1000).toFixed(1)}K`;
    return `रू ${num.toFixed(0)}`;
}
// ── Date Formatting ───────────────────────────────────────────────────────────
export function formatDate(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-NP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(d);
}
export function formatRelativeTime(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (mins < 1)
        return 'just now';
    if (mins < 60)
        return `${mins}m ago`;
    if (hours < 24)
        return `${hours}h ago`;
    if (days < 7)
        return `${days}d ago`;
    return formatDate(d);
}
// ── Slug Generation ───────────────────────────────────────────────────────────
export function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
// ── Order Number ──────────────────────────────────────────────────────────────
export function generateOrderNumber() {
    const date = new Date();
    const prefix = 'SC';
    const timestamp = date.getFullYear().toString().slice(-2) +
        String(date.getMonth() + 1).padStart(2, '0') +
        String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${timestamp}${random}`;
}
// ── Discount Calculation ──────────────────────────────────────────────────────
export function calcDiscount(price, discountPrice) {
    if (!discountPrice)
        return 0;
    const p = typeof price === 'string' ? parseFloat(price) : price;
    const d = typeof discountPrice === 'string' ? parseFloat(discountPrice) : discountPrice;
    return Math.round(((p - d) / p) * 100);
}
// ── cn helper (tailwind merge) ─────────────────────────────────────────────────
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
// ── Stars ─────────────────────────────────────────────────────────────────────
export function getStarArray(rating) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i)
            stars.push('full');
        else if (rating >= i - 0.5)
            stars.push('half');
        else
            stars.push('empty');
    }
    return stars;
}
// ── Truncate ──────────────────────────────────────────────────────────────────
export function truncate(str, length = 100) {
    if (str.length <= length)
        return str;
    return str.slice(0, length).trimEnd() + '…';
}
