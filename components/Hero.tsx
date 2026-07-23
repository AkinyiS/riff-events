import Image from "next/image";
import Link from "next/link";
import { HERO_IMAGE } from "@/lib/data";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-bg">
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="hero-overlay" />
      <div className="hero-content container">
        <p className="hero-tag">Nairobi&apos;s Premier Events Partner</p>
        <h1>Exceptional Catering &amp; Events, Crafted for You</h1>
        <p className="hero-sub">
          From intimate home barbecues to grand weddings — we bring flavour,
          style, and seamless service to every occasion across Nairobi and
          beyond.
        </p>
        <div className="hero-actions">
          <Link href="#contact" className="btn btn-primary">
            Get a Quote
          </Link>
          <Link href="#services" className="btn btn-outline">
            Explore Services
          </Link>
        </div>
      </div>
      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
