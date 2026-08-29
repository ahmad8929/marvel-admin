/** API money is integer paise. */
export const inr = (paise?: number | null) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format((paise ?? 0) / 100);

/** rupees (number) <-> paise (int) for form inputs */
export const toPaise = (rupees?: number | null) => Math.round((rupees ?? 0) * 100);
export const toRupees = (paise?: number | null) => (paise ?? 0) / 100;

export const fmtDate = (v?: string | Date) =>
  v ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(v)) : "";
