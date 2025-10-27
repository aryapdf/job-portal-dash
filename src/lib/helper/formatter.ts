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

export function formatPhoneNumber(inputNumber, countryCode, countries) {
  const country = countries.find(c => c.code === countryCode);
  if (!country) return inputNumber;

  const digits = inputNumber.replace(/\D/g, '');
  const pattern = country.format;

  let formatted = '';
  let digitIndex = 0;

  // loop pattern, ganti 'X' dengan digit
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === 'X') {
      formatted += digits[digitIndex] ?? '';
      digitIndex++;
    } else {
      formatted += pattern[i];
    }
  }

  return formatted.trim();
}