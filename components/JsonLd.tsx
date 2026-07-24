import { SITE_CONFIG } from "@/lib/config";
import { HERO_IMAGE } from "@/lib/data";

export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_CONFIG.url}/#business`,
    name: SITE_CONFIG.fullName,
    description: SITE_CONFIG.tagline,
    url: SITE_CONFIG.url,
    image: HERO_IMAGE.src,
    telephone: `+${SITE_CONFIG.whatsappNumber}`,
    email: SITE_CONFIG.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rimpa",
      addressLocality: "Rongai",
      addressRegion: "Kajiado",
      addressCountry: "KE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -1.396,
      longitude: 36.744,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "08:00",
      closes: "18:00",
    },
    areaServed: [
      { "@type": "City", name: "Nairobi" },
      { "@type": "City", name: "Rongai" },
      { "@type": "City", name: "Rimpa" },
    ],
    priceRange: "$$",
    sameAs: [`https://wa.me/${SITE_CONFIG.whatsappNumber}`],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Event and catering services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Wedding Catering",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Graduation Parties",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Private Parties",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Home Barbecue",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Private Chef",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Event Equipment Hire",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
