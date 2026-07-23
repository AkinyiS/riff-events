# Riff Events and Catering

A Next.js website for a catering and events company based in Nairobi, Kenya.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |

## Customization

Update contact details in **`lib/config.ts`**:

- `whatsappNumber` — WhatsApp number (no `+` prefix)
- `phoneDisplay` — Formatted phone for display
- `email` — Business email
- `location` — Physical address

Content (services, equipment, gallery) lives in **`lib/data.ts`**.

## Project Structure

```
app/
  layout.tsx      — Root layout, fonts, metadata
  page.tsx        — Home page
  globals.css     — Global styles
components/       — UI sections (Header, Hero, Contact, etc.)
lib/
  config.ts       — Site config & contact URL helpers
  contact.ts      — Form message builders
  data.ts         — Services, equipment, gallery content
```

## Features

- Wedding, graduation, private party, BBQ, and private chef catering
- Equipment hire: tents, chairs, sound systems, DJ, portable bar, MC
- Contact section with WhatsApp, email, and phone integrations
- Inquiry form that sends via WhatsApp or email
- Floating WhatsApp button
- Google Maps embed (Westlands, Nairobi)
- Optimized images via `next/image`
- Fully responsive mobile design
