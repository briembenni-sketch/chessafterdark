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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatEpisodeDescription(raw: string): string {
  if (!raw) return "";

  const lines = raw.replace(/\r\n/g, "\n").trim().split("\n");
  const formatted: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      formatted.push("");
      continue;
    }

    const endsWithColon = /:\s*$/.test(line);
    let nextNonEmpty = "";
    for (let j = i + 1; j < lines.length; j++) {
      if (lines[j].trim()) {
        nextNonEmpty = lines[j].trim();
        break;
      }
    }
    const nextIsBullet = /^[•\-*]/.test(nextNonEmpty);

    if (endsWithColon && nextIsBullet) {
      formatted.push(
        `<h4 class="episode-section-header">${escapeHtml(line)}</h4>`
      );
    } else if (/^[•\-*]\s*/.test(line)) {
      const content = line.replace(/^[•\-*]\s*/, "");
      formatted.push(`<li>${escapeHtml(content)}</li>`);
    } else {
      formatted.push(`<p>${escapeHtml(line)}</p>`);
    }
  }

  let html = formatted.join("\n");
  html = html.replace(/(<li>[^<]*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

  return html;
}
