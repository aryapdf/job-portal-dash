// lib/helper/formatter.ts

// Format salary
export function formatRupiah(amount: number) {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

// Format date
export function formatDate(timestamp: any) {
  if (!timestamp) return "";
  const date =
    typeof timestamp === "string"
      ? new Date(timestamp)
      : timestamp.toDate
        ? timestamp.toDate()
        : new Date(timestamp);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatJobType (jobType: string) {
  const types: { [key: string]: string } = {
    full_time: "Full-time",
    contract: "Contract",
    part_time: "Part-time",
    internship: "Internship",
    freelance: "Freelance"
  };
  return types[jobType] || jobType;
};