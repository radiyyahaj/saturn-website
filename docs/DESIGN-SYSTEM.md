# Saturn Website Design System (v4)

Single source of truth for saturn.africa. Everything on every page pulls from `assets/site.css`.

## Typography

| Role | Font | Usage |
|------|------|-------|
| Display / headlines | FG Futurist Light (300) | h1, h2, nav logo, buttons, kickers, stats. Generous letter spacing (0.04em to 0.42em depending on size). |
| Body / supporting | Acid Grotesk UltraLight (200) | Everything else. Sentence case, never shouts. |
| Mono accents | SF Mono / ui-monospace | `// kickers`, tags, ASCII glyphs, footer base line. |

Content max width 1500px, pad clamp(1.25rem, 4vw, 3.5rem).

Scale: `.display-xl` clamp(2.6rem–5.8rem) · `.display-lg` clamp(2rem–3.6rem) · `.display-md` clamp(1.5rem–2.3rem) · body 16px / 1.7.

Accent words inside headlines: italic + vertical accent color via `.accent-word`. One per headline max.

## Color

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | #f4f3f0 | Page ground (soft off white) |
| `--bg-raise` | #fbfaf8 | Raised sections, cards, inputs |
| `--bg-dim` | #ebeae6 | Footer, hover fills |
| `--ink` | #161616 | Primary text |
| `--ink-soft` | #4d4d4d | Supporting text |
| `--ink-mid` | #8a8a8a | Labels, captions |
| `--line` | #dedcd6 | Dividers, borders |
| `--ventures` / deep | #929292 / #6e6e6e | Ventures accent (grey) |
| `--ecosystem` / deep | #92bbd8 / #6a94b4 | Ecosystem accent (dusty blue). Ecosystem only. |
| `--foundation` / deep | #baadf5 / #9282d8 | Foundation accent (lavender) |
| `--accent` (default) | #929292 / #6e6e6e | General interactive color: neutral grey. Blue belongs to ecosystem only. |

Per page accent: add `page-ventures`, `page-ecosystem`, or `page-foundation` to `<body>`. It remaps `--accent` everywhere (rules, focus rings, kickers, CTA buttons).

## Patterns

- **Dot field:** `.dotfield` — radial gradient dot grid, 26px cell, 35% opacity, masked top and bottom. Sits behind sections and the footer.
- **ASCII glyphs:** monospace ring diagrams on vertical cards, `( o )———` style.
- **Kicker:** plain lowercase section name in Acid Grotesk, mid grey. No slashes, no uppercase.
- **The hero planet:** `assets/hero.js`, canvas ASCII Saturn with three rings, SATURN wordmark carved through the glyph field. Dissolves on scroll, reforms at rest. Mouse trail scatters glyphs.

## Components

- **Navbar:** floating dark pill, centered, top 18px. Top-lit gradient (#26262d to #0d0d10) with an inner rim highlight and three stacked shadows so it reads as a solid object. White circle logo has its own drop + inset shadow. Active item is a white pill with a cast shadow. Dropdown matches the pill, service names in their accent colours. White circle on the left holds the Saturn planet mark. Items: About Us / Our Services / Get in Touch. The selected item gets a white pill (`.active`, set on click; Our Services auto activates on vertical pages). Our Services opens a dark dropdown with the three services in their accent colors, no arrow. Hamburger below 760px opens a dark full screen overlay.
- **Buttons:** `.btn` (ink pill), `.btn-ghost` (outline), `.btn-accent` (vertical accent). All FG Futurist uppercase, letter spaced, lift on hover.
- **Cards:** `.card c-{vertical}` — solid raised panels. Top-lit surface gradient, 22px radius, hairline edge that brightens toward the light. Five stacked shadows including a tinted ambient one, so each card casts its own accent colour. Accent haze pools behind the row (`.cards::before`). Hover lifts 10px and deepens the tint. Top accent bar, ASCII glyph, tags, accent Read More.
- **Stats:** top rule, huge FG Futurist number, accent colored `+`, grey caption.
- **Contact:** segmented audience tabs feed a hidden subject field. Confirmation: `// message received. we will be in touch shortly.`
- **Footer:** 4 column grid, dot field at 22%, mono base line.

## Animation Spec

| Element | Trigger | Behaviour |
|---------|---------|-----------|
| Hero planet | Always (RAF) | Slow spin, breathing scale, ring shimmer, orbiting particles. Scroll velocity dissolves glyphs upward; they settle back. Rendering pauses past 1.25 viewport heights. |
| Section content | IntersectionObserver at 18% | `.reveal` fades up 26px over 0.8s, staggered with `data-delay` 1–3 (0.12s steps). |
| Diagram flow lines | Enters viewport | stroke-dashoffset draw, 1.6s, staggered 0.35s per line. |
| Partner marquee | Constant | 40s linear infinite loop, two identical track halves so it never runs out. Pauses on hover. Logos grayscale 45% → full color + 3px lift on hover. Every logo scales to fit the same 150x48 box (object-fit contain). |
| Cards / buttons | Hover | translateY(-6px / -2px) + shadow, 0.35s. |
| Orbit widget (`the system`) | Constant + hover | `orbit-embed.html` in a lazy iframe at 7/4 aspect. Three planets orbit an ellipse on a 10s period, scaling and dimming with depth. Hovering a vertical freezes the orbit and reveals its caption. |
| Story timeline (`our story`) | Scroll + hover | Rail draws, dots pop in staggered, year labels fade up. Hovering a year swaps the description and floats a giant ghost year behind it. |

`prefers-reduced-motion`: reveals render instantly, marquee stops, hero renders a single still frame.

## Breakpoints

| Width | Change |
|-------|--------|
| ≤ 980px | Diagram stacks (CONNECT / diagram / SCALE vertical), cards single column, stats 2×2, footer 2 columns, split sections stack. |
| ≤ 760px | Hamburger nav (full screen overlay), contact form single column, desktop CTA hidden. |
| ≤ 600px | Hero cell size drops to 5px, planet radius 30% of viewport. |

## Files

```
website_v4/
├── index.html          homepage
├── ventures.html       grey accent
├── ecosystem.html      blue accent
├── foundation.html     lavender accent
├── assets/site.css     design system
├── assets/site.js      nav, reveals, tabs, form
├── assets/hero.js      ASCII Saturn engine
├── fonts/              FG Futurist Light, Acid Grotesk UltraLight (TRIAL — license before launch)
└── logos/              partner marquee logos
```

## Before launch

- Trial fonts need commercial licenses (FG Futurist, Acid Grotesk).
- Contact form is front end only. Wire to a form endpoint (Formspree, Basin, or a mail API).
- Confirm the LinkedIn URL slug and hello@saturn.africa mailbox.


## Depth system (added after the "too flat" review)

The page was reading as flat colour fields. Four moves fixed it, all in the DEPTH PASS block at the end of `site.css`:

1. **Elevation scale** — `--sh-1` through `--sh-4`, each a *stack* of shadows (tight contact shadow + wide ambient). One blurry shadow reads as fog; stacked shadows read as depth.
2. **Top-lit surfaces** — every raised panel (cards, stats, pillars) uses a `168deg` gradient from white to warm grey. This is the strongest cue that a rectangle is a solid object rather than a painted area.
3. **Tinted ambient shadows** — cards cast a shadow in their own accent (`color-mix` with `--c`), so the three verticals separate by colour as well as position.
4. **Sections separate with light, not lines** — borders removed from `.section-raise`, `.partners` and `footer`; they now use inset shadows at the seams so planes stack instead of butting together.

Elements upgraded to raised surfaces: vertical cards, stat figures, pillar blocks, form fields (inset), buttons (cast shadow).

## Hero ASCII configuration

Set from Radiyya's control-panel settings (`saturn-hero.html` GUI, screenshotted 27 Jul):

| Control | Value |
|---------|-------|
| Planet ramp | `@1*/a` |
| Text rings | **on** — rings spell SATURN VENTURES / ECOSYSTEM / FOUNDATION |
| Particles | off |
| Res (cell) | 6 |
| Glitch | 0 |
| Spin | 0.10 |

Text-ring rendering was restored in `hero.js` (RINGS map, per-cell glyph slot, and the `LT` luminance cutoff that keeps the wordmarks legible).

## Ecosystem page (built to the Sept handoff doc)

Structure is exactly the four sections the handoff specifies — Hero, Services, Clients, Final CTA. The excluded sections (positioning matrix, how we work, culture, domains strip, selected work) are not present.

**Service cards — reveal inside the card.** Every `.svc-inner` is a fixed height photo card (400px min) with its content anchored to the bottom edge. On hover or keyboard focus the detail paragraph (`.svc-more`) slides up into space the card already owns, so the number, title and teaser lift to make room. Nothing overlaps the row below and nothing on the page moves.

Why this and not the alternatives: growing the card over its neighbours reads as a bug rather than a reveal; growing it in place reflows the whole grid on every mouse move; and hiding the copy entirely behind hover fails on touch. Fixed bounds with an internal reveal is the pattern used on most premium image card grids for exactly these reasons.

- `.svc-more` animates `max-height` 0 → 240px, opacity and a 6px lift. Longest body copy measures under 200px at desktop widths.
- Numbered `01 … 06` in `.svc-idx`, no accent rule (removed site wide).
- `.svc-inner` carries `tabindex="0"` so the reveal is keyboard reachable; `:focus-within` mirrors every `:hover` rule.
- `@media (hover: none), (max-width: 640px)` drops the fixed height and shows the detail permanently — the stacked mobile layout the handoff asks for.

**Clients** is a quiet six-up logo grid on raised tiles, greyscale at 45% until hover. Placeholder logos until real client marks arrive.

*Verification note: with the Browser pane hidden the page stops compositing, which freezes the CSS animation clock — `getComputedStyle` then reports transition start values and cards appear not to expand. Measure with `transition: none` injected, or with the pane visible.*


## Vertical naming (standing rule)

"Saturn" stays plain; the vertical word is italic in its own accent colour — Saturn *Ventures* grey, Saturn *Ecosystem* blue, Saturn *Foundation* purple. Classes `.sv-ventures` / `.sv-ecosystem` / `.sv-foundation`, declared in an `em.` form so they outrank the timeline's own `em` styling. Applied in nav dropdowns, footers, cards, and body copy.

The same colour logic carries the homepage headline: phrases pointing at a vertical take that vertical's colour ("smart capital" grey, "ecosystems" blue, "growth for startups" purple).

## Section rhythm and seams

One rhythm everywhere: `--section-y` (section padding) and `--block-gap` (heading to content). Every section carries identical padding, so the gap between any two is the same.

All seams are removed — no borders, no inset shadows, one shared background across sections, the partners band and the footer. The page reads as continuous scroll. Depth now comes only from the objects on the page (cards, pillars, form fields), never from section backgrounds.

## Contact form

No audience buckets. The three segmented tabs were cut because they forced everyone into one of three categories. Replaced with an optional "What brings you here?" select carrying six options including "Something else"; the form submits fine without it.

## Get in touch (carried from the existing saturn.africa site)

Two column: sticky lowercase `get in touch` heading, sub copy and a pulsing ring on the left; form on the right. Fields keep this site's rounded skin rather than the old underline inputs. Submit is the solid ink button — the accent grey did not read as a primary action.

Form: first name / last name row, email, "I am interested in", message. **Posts to the live Formspree endpoint `xwvrdawj`** taken from the existing site, via fetch, keeping the inline `// message received.` confirmation and falling back to an email prompt if the request fails.

The interest select lists concrete services rather than vertical names, grouped as Capital / Technology / Programs and impact / General — 17 options built from what each vertical actually offers.

## Footer (carried from the existing saturn.africa site)

Mission text left, Explore links right aligned, a giant faint `Saturn` wordmark at 6% ink, then a hairline and the base line. Identical on all four pages. Explore links use the vertical colour rule (Ventures grey, Ecosystem blue, Foundation purple, all italic).

## Photo backgrounds on the vertical cards

`card-ventures.jpg` (lunar surface), `card-ecosystem.jpg` (sky), `card-foundation.jpg` (lavender) sit behind the three cards via `--card-img`, used at full source resolution (~575KB total). Do not downscale them: cards render around 420px wide, so a retina screen needs roughly 840px of source.

The three sources are at very different brightness, so each carries the same graded dark scrim (26% at the top to 78% at the bottom) and one white text treatment. Without it, Foundation's pale lavender would need ink text while Ventures' moon needed white — the row would stop reading as a set. Cards get `min-height: 440px` so the image has room, a light hairline rim, and white Read More buttons. The accent haze behind the row is suppressed when photos are present.

Remove the `has-bg` class from the three articles to fall back to the plain raised cards.

## Get in touch on every page

The same component now closes all four pages, with only the sub copy changing:

- **Home** — "Ready to build Africa's tech future together?..."
- **Ventures** — "The businesses we back today build the Africa we live in tomorrow..."
- **Ecosystem** — "Tell us where you want to take your business..."
- **Foundation** — "Whether you're building something, mentoring someone, or funding the work..."

Same heading, same form, same interest list, same Formspree endpoint. Nav "Get in Touch" is an on-page anchor on every page. This replaced the old per-page `cta-band`.


## Card Read More buttons

Sized to match the tag pills above them: mono, 0.62rem, uppercase, pill radius. Each fills with its vertical's colour and white text, using `--c-btn` — a slightly deeper shade than the brand accent so small white text clears contrast on the fill:

| Vertical | Brand accent | Button fill (`--c-btn`) | Contrast with white |
|---|---|---|---|
| Ventures | #929292 | #6e6e6e | 4.9:1 |
| Ecosystem | #92bbd8 | #4d7a99 | 4.5:1 |
| Foundation | #baadf5 | #6f5cbe | 4.9:1 |

The brand accents themselves sit near 3:1 with white, which fails WCAG AA at this text size, hence the deeper fills.

## Spacing rhythm (tightened)

`--section-y` is `clamp(3.5rem, 6vw, 5.5rem)`. Every section, the partners band, the vertical page heroes and the footer all derive their padding from it, so the gap between any two sections is identical — measured at 173px on desktop, down from 256px. Vertical page heroes add `--nav-h` on top for fixed-nav clearance.

## Card vertical marks

The ASCII bracket glyph (`( o )———`) is replaced by the Saturn sphere mark in each vertical's colour, with the category word beneath it:

| Card | Mark | Label |
|---|---|---|
| Ventures | `mark-ventures.png` (grey) | capital |
| Ecosystem | `mark-ecosystem.png` (blue) | technology |
| Foundation | `mark-foundation.png` (purple) | impact |

Sources are `saturn brand/{vertical}/` — "ventures grey", "ecosystem blue", "foundation purple" — 2000px transparent PNGs, resized to 200px (~16KB each) and rendered at 42px so they stay sharp on retina. The marks carry their own colour, so no CSS tinting is applied.

## Card tags (outcome led)

Tags name what someone gets, not technologies. Three per card, fitting one or two lines:

- **Ventures** — Investment · Fundraising · Go to Market
- **Ecosystem** — Software Development · AI & Automation · Consulting
- **Foundation** — Ecosystem Building · Acceleration Programs · Mentorship

## Vertical landing heroes

Each vertical page opens on a full-bleed grainy Saturn render with the wordmark across it, mirroring the homepage planet + SATURN treatment. `hero-{vertical}.jpg` (1700px) and `hero-{vertical}@2x.jpg` (3400px), both quality 90, served through `image-set()` so retina screens pull the 3400px file and standard screens the lighter one.

Do not compress these hard. The film grain is the point of the artwork and it is also what resists compression — dropping quality strips the grain into blocky mush rather than saving meaningful weight. At 3400px, quality 90 costs 2.8MB versus 2.3MB at quality 80, so quality is nearly free here. 1x files are 0.6 to 0.8MB, 2x are 1.5 to 2.8MB.

Type follows the lockup and stays legible on both light and dark artwork:
- **SATURN** — caps, FG Futurist, 0.28em tracking, `clamp(2.8rem, 11vw, 9.5rem)`, solid white with a soft shadow. This is the page title and matches the homepage wordmark in weight.
- **the vertical word** — lowercase Acid Grotesk UltraLight, upright (not italic, it is a heading), `clamp(1rem, 2.6vw, 2.2rem)` so it reads as a subheading roughly a quarter the size of SATURN. Filled in `--accent-deep` with a white outline via `-webkit-text-stroke` + `paint-order: stroke fill`.

A soft radial scrim sits under the type, lighter on the pale ecosystem artwork. The old page hero content demotes to the first content section, so each page keeps exactly one `h1` (the wordmark).


## The lockup

`.sat` + `.sv-{vertical}` carry the rule everywhere the name appears:

| Part | Treatment |
|---|---|
| SATURN | caps, FG Futurist, 0.28em tracking (0.12em inside a paragraph) |
| ventures / ecosystem / foundation | lowercase, Acid Grotesk UltraLight, own accent colour |
| Italic | only inside running copy — applied by `p .sv-*` and `.stl-desc .sv-*`, so wrapping in `<em>` in body text switches it on. Headings, nav, cards, footers and wordmarks stay upright. |

## Foundation page = Saturn Startup School

Built to the final Startup School handoff. The landing hero (`vhero`) and the nav Apply pill are unchanged.

Sections: Announcement bar → Hero → Our Thesis → The Program → What Makes Us Different → Who We're Looking For → What Founders Say → Since We Started → Three Ways In.

Purple leads throughout. New components: `.announce` (fixed bar, nav drops to 52px under it via `body.has-announce`), `.diff-grid` (four differentiator cards), `.checklist` (purple tick list), `.quote-grid`, `.ways-grid` with `.way.is-primary` for the filled primary action.

### Pending links

Four links carry `data-pending` and a `TODO` comment. `site.js` swallows their clicks so they don't jump to top. To activate one: replace the `href` and delete `data-pending`.

| Link | Destination |
|---|---|
| Hero "Apply now" | Apply typeform |
| Three ways in, "Apply now" | Apply typeform (same) |
| Three ways in, "Become a mentor" | Mentor typeform |
| "Read more" under The Program | Program detail page |

"Fund a program" is live: `mailto:radiyya@saturn.africa` with a prefilled subject.

### Speedrun register (foundation page only)

Studied speedrun.a16z.com directly. Their body ground is `rgb(235,233,229)`, near identical to Saturn's `#f4f3f0`, so the difference is structural rather than chromatic. Four moves were carried over:

1. **The offer is the headline.** They lead "We invest up to $1M in your new startup" with the brand as a small eyebrow. Ours now leads "Pitch for up to R100,000 to turn your product into a business", with the amount in purple and "saturn startup school" demoted to the eyebrow.
2. **Big, tight headlines.** They run weight 600 at negative tracking. FG Futurist ships Light only, so on this page confidence comes from scale plus `letter-spacing: -0.02em` and pure black, not weight.
3. **A category label above every card.** Their card anatomy is SMALL CAPS LABEL → benefit headline → one detail line. `.diff-label` adds this.
4. **Repeated text as graphics.** Their "Got any questions?" band becomes a purple `.text-band` scrolling "Ready to build?" before the final CTA.

Also carried: standalone caps `.section-cta` links after blocks, a `.big-claim` proof sentence echoing their "$300M to fund over 300 startups", and quotes restructured with a pulled out `.lead` line plus attribution.

Saturn's typefaces, purple, and the lockup are unchanged — the register shifts, the brand does not.
