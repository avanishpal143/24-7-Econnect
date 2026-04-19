# 24x7 Econnect — Official Website

India's leading Bulk SMS, WhatsApp API, Google RCS, Voice IVR & Email Marketing platform. Built with pure HTML, CSS, and Vanilla JavaScript — no frameworks, no dependencies.

---

## Live Preview

Serve the `public/` folder with any static server:

```bash
# Python
python3 -m http.server 8000 --directory public

# Node (npx)
npx serve public
```

Then open → `http://localhost:8000`

---

## Project Structure

```
24-7-econnect/
├── public/
│   ├── index.html                  ← Homepage (main landing page)
│   ├── pages/
│   │   ├── about.html              ← About Us page
│   │   ├── bulk-sms.html           ← Bulk SMS & OTP product page
│   │   ├── whatsapp-api.html       ← WhatsApp Business API page
│   │   ├── google-rcs.html         ← Google RCS page
│   │   ├── voice-ivr.html          ← Voice & IVR page
│   │   ├── email-marketing.html    ← Email Marketing page
│   │   └── pricing.html            ← Pricing page
│   └── assets/
│       ├── css/
│       │   ├── site.css            ← Main stylesheet (all components)
│       │   ├── about-page.css      ← About page specific styles
│       │   └── pricing-animations.css ← Pricing page animations
│       ├── js/
│       │   ├── site.js             ← Core JS (nav, AOS, counters, form, FAQ)
│       │   ├── pricing-data.js     ← Pricing plans data
│       │   ├── pricing-tabs.js     ← Pricing tab controller
│       │   └── pricing-animations.js ← Pricing card animations
│       └── images/
│           ├── logo-24x7.svg       ← Logo (dark text — for light backgrounds)
│           └── logo-24x7-white.svg ← Logo (white text — for dark/footer)
└── README.md
```

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Markup     | HTML5 (semantic)                    |
| Styling    | CSS3 (Flexbox, Grid, Custom Props)  |
| Scripting  | Vanilla JavaScript ES6+             |
| Fonts      | Poppins (Google Fonts)              |
| Icons      | Inline SVG                          |
| Backend    | None (pure static site)             |

---

## Pages & Sections

### Homepage (`index.html`)
| Section | Description |
|---|---|
| Navbar | Floating glassmorphism pill navbar with dropdown, shimmer CTA |
| Hero | Two-column layout, animated orbs, floating stat cards |
| Clients Marquee | Auto-scrolling client logos |
| Products Grid | 6 product cards with glow effects |
| Why Choose Us | Horizontal scroll cards with images |
| Case Studies | 5-column grid with modal popups |
| Testimonials | Auto-scroll mini review cards |
| Pricing Preview | 3-tier pricing cards |
| About Us | Stats + services grid teaser |
| FAQ | 2-column accordion with color-coded items |
| Contact Form | Lead generation form with mailto fallback |
| Footer | Full footer with logo, links, social, trust badges |

### Product Pages
Each product page includes:
- Page Hero with badge, title, CTA buttons
- Features Grid (6 feature cards)
- Why Choose Us (horizontal scroll)
- About Us teaser with stats
- Full Footer

---

## Design System

### Color Palette
```css
--maroon:       #800020   /* Primary brand color */
--maroon-dark:  #5c0017   /* Hover states */
--blue:         #007BFF   /* Accent color */
--text:         #1a1a1a   /* Body text */
--muted:        #6c757d   /* Secondary text */
--off-white:    #F8F9FA   /* Section backgrounds */
--border:       #e9ecef   /* Borders */
```

### Section Background Pattern
Alternating gradients keep the page visually varied:
- Hero → Blue-purple tint
- Clients → Soft maroon-pink
- Products → White with blue orb
- Why Choose → Purple-blue gradient
- Cases → White with maroon orb
- Testimonials → Purple-blue-pink
- Pricing Preview → Soft maroon-pink
- About → Blue-purple gradient
- FAQ → Purple-blue-pink
- Contact → Maroon-pink to blue
- Footer → Dark `#0d0d14`

### Typography
- Font: **Poppins** (300–900 weights)
- Headings: `clamp()` for fluid sizing
- Body: 0.88rem – 1.05rem

### Animations
- **AOS** — custom scroll-triggered fade/slide (no library, pure CSS+JS)
- **Orb Float** — hero background blobs
- **Hero Float** — floating stat cards
- **Marquee** — client logos & testimonials auto-scroll
- **Why Scroll** — auto-scroll with pause on hover/drag
- **Shimmer** — navbar CTA button sweep effect
- **Counter** — animated number counters on scroll

---

## JavaScript Modules

### `site.js`
- Scroll progress bar
- Navbar scroll effect + pill shrink
- Hamburger mobile menu
- AOS (Animate On Scroll) — IntersectionObserver based
- Animated counters
- Pricing toggle (monthly/yearly)
- Why section auto-scroll + drag support
- FAQ accordion
- Smooth scroll for anchor links
- Contact form with client-side validation + mailto fallback
- Case study modal (open/close/keyboard ESC)
- Modal stat number animations

### `pricing-data.js`
- All pricing plan data (SMS, WhatsApp, RCS, Voice, Email)
- Monthly & yearly prices
- Feature lists per plan

### `pricing-tabs.js`
- Tab controller for switching between product pricing
- Renders cards dynamically from `pricing-data.js`

### `pricing-animations.js`
- Stagger fade-in for pricing cards
- Smooth transitions on tab switch

---

## Contact Form

The contact form uses **client-side only** handling:
- Validates: name, company, 10-digit mobile, email
- On submit → opens `mailto:support@24x7econnect.com` with pre-filled data
- No server or PHP required

To connect a real backend, replace the `mailto` block in `site.js`:
```js
// In site.js — replace this block:
window.location.href = 'mailto:support@24x7econnect.com?subject=...'

// With a fetch call to your API:
await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
```

---

## SEO & Meta

Each page has:
- `<title>` tag
- `<meta name="description">`
- `<meta name="viewport">`
- Semantic HTML5 elements (`<nav>`, `<section>`, `<footer>`, `<main>`)
- `alt` attributes on all images
- `aria-label` on interactive elements

---

## Browser Support

| Browser | Support |
|---|---|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Mobile (iOS/Android) | ✅ Responsive |

---

## Company Info

| | |
|---|---|
| Company | 24x7 Econnect |
| Phone | +91-7428464014 |
| Email | support@24x7econnect.com |
| Location | Majlis Park, New Delhi — 110033 |
| LinkedIn | [24-7-econnect](https://www.linkedin.com/company/24-7-econnect) |
| Certifications | ISO 27001, ISO 9001, DPIIT Recognized, Nvidia Inception Member, Official Meta Tech Provider |
# 24-7-Econnect
