export const SITE_CONFIG = {
  name: "Riff Events and Catering",
  fullName: "Riff Events and Catering",
  tagline: "Premium catering and event services in Nairobi, Kenya.",
  whatsappNumber: "254758191196",
  phoneDisplay: "0758 191 196",
  email: "info@riffevents.co.ke",
  location: "Rimpa, Rongai, Kenya",
  hours: "Mon – Sat: 8:00 AM – 6:00 PM",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Rimpa%2C%20Rongai%2C%20Kenya&t=&z=14&ie=UTF8&iwloc=&output=embed",
} as const;

export function whatsappUrl(text?: string) {
  const base = `https://wa.me/${SITE_CONFIG.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function telUrl() {
  return `tel:+${SITE_CONFIG.whatsappNumber}`;
}

export function mailtoUrl(subject?: string, body?: string) {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString();
  return `mailto:${SITE_CONFIG.email}${query ? `?${query}` : ""}`;
}
