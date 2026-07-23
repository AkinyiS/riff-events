export type InquiryFormData = {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  message: string;
};

export function buildWhatsAppMessage(data: InquiryFormData): string {
  const lines = [
    "Hello Riff Events and Catering,",
    "",
    "I would like to inquire about your services.",
    "",
    `*Name:* ${data.name}`,
    `*Phone:* ${data.phone}`,
    `*Email:* ${data.email}`,
    `*Event Type:* ${data.eventType}`,
  ];

  if (data.eventDate) {
    lines.push(`*Event Date:* ${data.eventDate}`);
  }

  lines.push("", "*Message:*", data.message);

  return lines.join("\n");
}

export function buildEmailBody(data: InquiryFormData): string {
  return [
    "Hello Riff Events and Catering,",
    "",
    "I would like to inquire about your services.",
    "",
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Event Type: ${data.eventType}`,
    data.eventDate ? `Event Date: ${data.eventDate}` : "",
    "",
    "Message:",
    data.message,
  ]
    .filter(Boolean)
    .join("\n");
}
