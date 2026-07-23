import { whatsappUrl } from "@/lib/config";
import WhatsAppIcon from "./WhatsAppIcon";

export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappUrl(
        "Hello Riff Events and Catering, I'd like to inquire about your services."
      )}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon size={32} />
    </a>
  );
}
