export const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#equipment", label: "Equipment" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact Us", cta: true },
] as const;

export const CATERING_SERVICES = [
  {
    icon: "💍",
    title: "Wedding Catering",
    description:
      "Elegant multi-course menus, live cooking stations, and flawless service for your special day.",
    image:
      "https://images.unsplash.com/photo-1695281536457-01f9a07c575b?w=600&q=80",
    alt: "African bride and groom embracing at their wedding reception",
    wide: false,
  },
  {
    icon: "🎓",
    title: "Graduation Parties",
    description:
      "Celebrate milestones with buffet spreads, cocktail hours, and themed menus for every graduate.",
    image:
      "https://images.unsplash.com/photo-1633734973050-d6499a977c17?w=600&q=80",
    alt: "African graduates celebrating in caps and gowns",
    wide: false,
  },
  {
    icon: "🎉",
    title: "Private Parties",
    description:
      "Birthdays, anniversaries, and corporate gatherings — we handle the food so you enjoy the moment.",
    image:
      "https://images.unsplash.com/photo-1683549200177-e60855969f29?w=600&q=80",
    alt: "African friends preparing food together at a celebration",
    wide: false,
  },
  {
    icon: "🔥",
    title: "Home Barbecue",
    description:
      "Bring the grill masters to your backyard. Nyama choma, sides, and full setup included.",
    image:
      "https://images.unsplash.com/photo-1687422808277-2334638f09fb?w=600&q=80",
    alt: "African chef grilling food at an outdoor barbecue",
    wide: false,
  },
  {
    icon: "👨‍🍳",
    title: "Private Chef",
    description:
      "A dedicated chef in your home or venue — personalised menus, dietary accommodations, and white-glove service for an exclusive dining experience.",
    image:
      "https://images.unsplash.com/photo-1709837167684-47d7ccf0ed89?w=900&q=80",
    alt: "African private chef preparing a gourmet meal",
    wide: true,
  },
] as const;

export const EQUIPMENT_ITEMS = [
  {
    icon: "⛺",
    title: "Tents & Marquees",
    description:
      "Elegant tent setups for any venue size, weather-ready and beautifully styled.",
  },
  {
    icon: "🪑",
    title: "Chairs & Seating",
    description:
      "Chiavari, banquet, and lounge seating arrangements for every guest count.",
  },
  {
    icon: "🔊",
    title: "Sound Systems",
    description:
      "Professional PA systems for speeches, music, and crystal-clear announcements.",
  },
  {
    icon: "🎧",
    title: "DJ Services",
    description:
      "Experienced DJs who read the room and keep your dance floor alive all night.",
  },
  {
    icon: "🍸",
    title: "Portable Bar",
    description:
      "Fully stocked mobile bars with professional bartenders and custom cocktail menus.",
  },
  {
    icon: "🎤",
    title: "Master of Ceremony",
    description:
      "Charismatic MCs who guide your programme with warmth, humour, and professionalism.",
  },
] as const;

export const EVENT_TYPES = [
  "Wedding",
  "Graduation",
  "Private Party",
  "Home Barbecue",
  "Private Chef",
  "Corporate Event",
  "Other",
] as const;

export const ABOUT_STATS = [
  { value: "50+", label: "Expert Staff" },
  { value: "100%", label: "Client Satisfaction" },
] as const;

export const ABOUT_IMAGES = {
  main: {
    src: "https://images.unsplash.com/photo-1642178233359-1c87278a80d8?w=600&q=80",
    alt: "Professional DJ turntables and mixer equipment",
  },
  accent: {
    src: "https://images.unsplash.com/photo-1652169892293-ba174ef19931?w=400&q=80",
    alt: "Outdoor picnic table arranged with a basket and flowers",
  },
} as const;

export const HERO_IMAGE = {
  src: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1920&q=80",
  alt: "Catering buffet with food served in chafing dishes",
} as const;
