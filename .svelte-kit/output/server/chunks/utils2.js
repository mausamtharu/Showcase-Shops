//#region src/lib/utils.ts
function formatPrice(amount, currency = "NPR") {
	const num = typeof amount === "string" ? parseFloat(amount) : amount;
	return new Intl.NumberFormat("en-NP", {
		style: "currency",
		currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 2
	}).format(num);
}
function formatDate(date) {
	const d = typeof date === "string" ? new Date(date) : date;
	return new Intl.DateTimeFormat("en-NP", {
		year: "numeric",
		month: "short",
		day: "numeric"
	}).format(d);
}
function formatRelativeTime(date) {
	const d = typeof date === "string" ? new Date(date) : date;
	const diff = (/* @__PURE__ */ new Date()).getTime() - d.getTime();
	const mins = Math.floor(diff / 6e4);
	const hours = Math.floor(mins / 60);
	const days = Math.floor(hours / 24);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	if (hours < 24) return `${hours}h ago`;
	if (days < 7) return `${days}d ago`;
	return formatDate(d);
}
function slugify(text) {
	return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
function generateOrderNumber() {
	const date = /* @__PURE__ */ new Date();
	return `SC${date.getFullYear().toString().slice(-2) + String(date.getMonth() + 1).padStart(2, "0") + String(date.getDate()).padStart(2, "0")}${Math.floor(Math.random() * 1e4).toString().padStart(4, "0")}`;
}
function calcDiscount(price, discountPrice) {
	if (!discountPrice) return 0;
	const p = typeof price === "string" ? parseFloat(price) : price;
	return Math.round((p - (typeof discountPrice === "string" ? parseFloat(discountPrice) : discountPrice)) / p * 100);
}
function getStarArray(rating) {
	const stars = [];
	for (let i = 1; i <= 5; i++) if (rating >= i) stars.push("full");
	else if (rating >= i - .5) stars.push("half");
	else stars.push("empty");
	return stars;
}
//#endregion
export { generateOrderNumber as a, formatRelativeTime as i, formatDate as n, getStarArray as o, formatPrice as r, slugify as s, calcDiscount as t };
