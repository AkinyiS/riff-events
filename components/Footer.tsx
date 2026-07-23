import Link from "next/link";
import { SITE_CONFIG, whatsappUrl, telUrl, mailtoUrl } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="#home" className="logo">
            <span className="logo-icon">✦</span>
            <span className="logo-text">{SITE_CONFIG.name}</span>
          </Link>
          <p>{SITE_CONFIG.tagline}</p>
        </div>
        <div className="footer-links">
          <h4>Services</h4>
          <ul>
            <li>
              <Link href="#services">Wedding Catering</Link>
            </li>
            <li>
              <Link href="#services">Graduation Parties</Link>
            </li>
            <li>
              <Link href="#services">Private Chef</Link>
            </li>
            <li>
              <Link href="#equipment">Equipment Hire</Link>
            </li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Contact</h4>
          <ul>
            <li>
              <a href={telUrl()}>{SITE_CONFIG.phoneDisplay}</a>
            </li>
            <li>
              <a href={mailtoUrl()}>{SITE_CONFIG.email}</a>
            </li>
            <li>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom container">
        <p>
          &copy; {new Date().getFullYear()} {SITE_CONFIG.fullName}. All rights
          reserved. Nairobi, Kenya.
        </p>
      </div>
    </footer>
  );
}
