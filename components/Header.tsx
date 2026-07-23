"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/data";
import { SITE_CONFIG } from "@/lib/config";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      const scrollPos = window.scrollY + 120;
      const sections = document.querySelectorAll("section[id]");

      sections.forEach((section) => {
        const top = (section as HTMLElement).offsetTop;
        const height = (section as HTMLElement).offsetHeight;
        const id = section.getAttribute("id");

        if (id && scrollPos >= top && scrollPos < top + height) {
          setActiveSection(id);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`header${scrolled ? " scrolled" : ""}`}>
      <nav className="nav container">
        <Link href="#home" className="logo" onClick={closeMenu}>
          <span className="logo-icon">✦</span>
          <span className="logo-text">{SITE_CONFIG.name}</span>
        </Link>

        <button
          className={`nav-toggle${menuOpen ? " active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`nav-links${menuOpen ? " open" : ""}`}>
          {NAV_LINKS.map((link) => {
            const { href, label } = link;
            const cta = "cta" in link && link.cta;
            const id = href.replace("#", "");
            const isActive = activeSection === id;

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cta ? "nav-cta" : undefined}
                  onClick={closeMenu}
                  style={
                    !cta && isActive ? { color: "#C9A962" } : undefined
                  }
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
