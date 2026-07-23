import FadeIn from "./FadeIn";
import { EQUIPMENT_ITEMS } from "@/lib/data";

export default function Equipment() {
  return (
    <section className="section equipment" id="equipment">
      <div className="container">
        <div className="section-header section-header--light">
          <span className="section-label">Full Event Solutions</span>
          <h2>Equipment &amp; Entertainment</h2>
          <p>
            Everything you need under one roof — from setup to soundcheck to the
            last dance.
          </p>
        </div>

        <div className="equipment-grid">
          {EQUIPMENT_ITEMS.map((item) => (
            <FadeIn key={item.title} className="equipment-item">
              <div className="equipment-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
