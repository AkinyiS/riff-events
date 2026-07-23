"use client";

import { FormEvent, useMemo } from "react";
import FadeIn from "./FadeIn";
import { SITE_CONFIG, whatsappUrl, telUrl, mailtoUrl } from "@/lib/config";
import { buildEmailBody, buildWhatsAppMessage } from "@/lib/contact";
import { EVENT_TYPES } from "@/lib/data";

export default function Contact() {
  const today = useMemo(
    () => new Date().toISOString().split("T")[0],
    []
  );

  const getFormData = (form: HTMLFormElement) => ({
    name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
    phone: (form.elements.namedItem("phone") as HTMLInputElement).value.trim(),
    email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
    eventType: (form.elements.namedItem("eventType") as HTMLSelectElement)
      .value,
    eventDate: (form.elements.namedItem("eventDate") as HTMLInputElement)
      .value,
    message: (form.elements.namedItem("message") as HTMLTextAreaElement).value
      .trim(),
  });

  const handleWhatsAppSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = getFormData(form);
    window.open(
      whatsappUrl(buildWhatsAppMessage(data)),
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleEmailSubmit = () => {
    const form = document.getElementById("contactForm") as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = getFormData(form);
    window.location.href = mailtoUrl(
      `Event Inquiry — ${data.eventType}`,
      buildEmailBody(data)
    );
  };

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <div className="section-header section-header--light">
          <span className="section-label">Get In Touch</span>
          <h2>Contact Us</h2>
          <p>
            Ready to plan your next event? Reach out — we&apos;d love to hear
            from you.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-actions">
            <FadeIn>
              <a
                href={whatsappUrl(
                  "Hello Riff Events and Catering, I'd like to inquire about your catering and event services."
                )}
                className="contact-btn contact-btn--whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <div>
                  <strong>WhatsApp</strong>
                  <span>Chat with us instantly</span>
                </div>
              </a>
            </FadeIn>

            <FadeIn>
              <a
                href={mailtoUrl(
                  "Event Inquiry",
                  "Hello Riff Events and Catering,\n\nI would like to inquire about your services.\n\nEvent Type:\nDate:\nGuest Count:\n\nThank you."
                )}
                className="contact-btn contact-btn--email"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <div>
                  <strong>Email Us</strong>
                  <span>{SITE_CONFIG.email}</span>
                </div>
              </a>
            </FadeIn>

            <FadeIn>
              <a href={telUrl()} className="contact-btn contact-btn--call">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <div>
                  <strong>Call Us</strong>
                  <span>{SITE_CONFIG.phoneDisplay}</span>
                </div>
              </a>
            </FadeIn>
          </div>

          <FadeIn className="contact-form-wrapper">
            <form
              className="contact-form"
              id="contactForm"
              onSubmit={handleWhatsAppSubmit}
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+254 7XX XXX XXX"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@email.com"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="eventType">Event Type</label>
                  <select id="eventType" name="eventType" required defaultValue="">
                    <option value="" disabled>
                      Select event type
                    </option>
                    {EVENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="eventDate">Event Date</label>
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    min={today}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell us about your event — guest count, location, special requests..."
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary btn-full">
                  Send via WhatsApp
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light btn-full"
                  onClick={handleEmailSubmit}
                >
                  Send via Email
                </button>
              </div>
            </form>
          </FadeIn>
        </div>

        <div className="contact-location">
          <div className="location-info">
            <h3>📍 Our Location</h3>
            <p>{SITE_CONFIG.location}</p>
            <p className="location-hours">{SITE_CONFIG.hours}</p>
          </div>
          <div className="location-map">
            <iframe
              src={SITE_CONFIG.mapEmbedUrl}
              width="100%"
              height="280"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Riff Events and Catering location in Rimpa, Rongai"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
