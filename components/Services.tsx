import Image from "next/image";
import FadeIn from "./FadeIn";
import { CATERING_SERVICES } from "@/lib/data";

export default function Services() {
  return (
    <section className="section services" id="services">
      <div className="container">
        <div className="section-header">
          <span className="section-label">What We Offer</span>
          <h2>Catering Services</h2>
          <p>
            Every dish tells a story. Our team delivers unforgettable culinary
            experiences tailored to your event.
          </p>
        </div>

        <div className="services-grid">
          {CATERING_SERVICES.map((service) => (
            <FadeIn
              key={service.title}
              className={`service-card${service.wide ? " service-card--wide" : ""}`}
            >
              <div className="service-img">
                <Image
                  src={service.image}
                  alt={service.alt}
                  width={service.wide ? 900 : 600}
                  height={service.wide ? 400 : 220}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div className="service-body">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
