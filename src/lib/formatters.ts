const ICELANDIC_MONTHS = [
  "janúar",
  "febrúar",
  "mars",
  "apríl",
  "maí",
  "júní",
  "júlí",
  "ágúst",
  "september",
  "október",
  "nóvember",
  "desember",
];

export function formatIcelandicDate(date: Date): string {
  const day = date.getDate();
  const month = ICELANDIC_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day}. ${month} ${year}`;
}
