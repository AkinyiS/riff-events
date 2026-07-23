import Image from "next/image";
import FadeIn from "./FadeIn";
import { ABOUT_IMAGES, ABOUT_STATS } from "@/lib/data";

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="container about-grid">
        <FadeIn className="about-images">
          <Image
            src={ABOUT_IMAGES.main.src}
            alt={ABOUT_IMAGES.main.alt}
            width={600}
            height={450}
            className="about-img-main"
          />
          <Image
            src={ABOUT_IMAGES.accent.src}
            alt={ABOUT_IMAGES.accent.alt}
            width={400}
            height={300}
            className="about-img-accent"
          />
        </FadeIn>

        <div className="about-content">
          <span className="section-label">Who We Are</span>
          <h2>Rooted in Nairobi, Built on Excellence</h2>
          <p>
            Riff Events and Catering is a full-service events company based in
            the heart of Nairobi, Kenya. For years, we&apos;ve been the trusted
            partner for families, corporates, and institutions who expect nothing
            less than perfection.
          </p>
          <p>
            From Rimpa and Rongai to Nairobi and beyond — we know Kenya&apos;s
            venues, seasons, and tastes. Our team blends local flavour with
            international standards to deliver events that feel personal and run
            flawlessly.
          </p>
          <ul className="about-stats">
            {ABOUT_STATS.map((stat) => (
              <li key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
