# saturn.africa

Marketing site for Saturn. Four pages, no build step. Plain HTML, CSS and vanilla JavaScript, plus GSAP from cdnjs on the foundation page for the announcement bar.

---

## Structure

```
.
├── index.html              Homepage
├── ventures.html           Saturn ventures
├── ecosystem.html          Saturn ecosystem
├── foundation.html         Saturn startup school
├── orbit-embed.html        Orbit widget, loaded in an iframe by index.html
│
├── assets/
│   ├── css/site.css        The whole design system, one file
│   ├── js/
│   │   ├── site.js         Nav, scroll reveals, counters, contact form
│   │   ├── hero.js         ASCII Saturn canvas, homepage only
│   │   └── announce.js     Announcement bar letter animation (GSAP), foundation only
│   ├── fonts/              FG Futurist + Acid Grotesk
│   └── img/
│       ├── brand/          Saturn mark, per vertical marks
│       ├── heroes/         Vertical landing images, 1x and 2x
│       ├── cards/          Card backgrounds (homepage, ventures, ecosystem)
│       ├── buttons/        Apply / mentor / fund artwork, foundation page
│       └── logos/          Partner and client logos
│
└── docs/
    ├── DESIGN-SYSTEM.md    Colours, type, components, animation, breakpoints
    └── handoffs/           Approved content briefs
```

---

## Running it locally

No build step. Either open `index.html` directly, or serve it:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000

A server is better than opening the file directly, because the homepage loads `orbit-embed.html` in an iframe.

---

## Deploying to Vercel

Vercel detects this as a static site. No framework preset, no build command, no output directory.

1. Push to GitHub
2. Import the repo in Vercel
3. Framework preset: **Other**. Leave build and output settings empty.
4. Deploy, then point `saturn.africa` at it in Vercel's domain settings

`vercel.json` sets long cache headers on `/assets` so the hero images are only downloaded once per visitor.

---

## Before this goes live

**Fonts are trial versions.** `FG_FuturistTRIAL-Light.otf` and `FFF-AcidGrotesk-UltraLight-TRIAL.otf` are evaluation files. They cannot be used on a public site or redistributed in a public repository. Buy the web licences and replace both files, keeping the same filenames, or make this repository private until then.

**Links waiting on a destination.** Each is marked `data-pending` in the HTML with a `TODO` comment above it, and `site.js` swallows the click so nothing jumps to the top of the page. To activate one, replace the `href` and delete `data-pending`.

| Page | Link | Waiting on |
|---|---|---|
| foundation.html | Announcement bar, nav "Apply now", landing "Apply now", hero "Apply now" | Apply typeform (all four currently jump to the Apply, mentor, or fund section) |
| foundation.html | Apply, mentor, or fund: "Apply now" | Apply typeform, same URL |
| foundation.html | Apply, mentor, or fund: "Become a mentor" | Mentor typeform |
| foundation.html | "Read more about the program" | Program detail page |

**The contact form posts to Formspree** (`formspree.io/f/xwvrdawj`), carried over from the previous saturn.africa site. Confirm submissions still reach the right inbox.

**PDF attachment on the contact form is switched off.** Formspree only forwards file uploads on a paid plan, so the field is out of the markup for now. The styling (`.file-pick` in `site.css`) and the validation (`site.js`, PDF only, 10MB cap) are still in place. Once the form is upgraded, add `enctype="multipart/form-data"` to the `<form>` tag and drop this block after the Message field:

```html
<div class="field field-file">
  <label for="f-file">Pitch deck (optional)</label>
  <div class="file-pick">
    <input id="f-file" name="attachment" type="file" accept="application/pdf,.pdf">
    <label for="f-file" class="file-btn">Choose file</label>
    <span class="file-name" data-empty="PDF, up to 10MB">PDF, up to 10MB</span>
  </div>
</div>
```

**NPC registration number.** Every footer carries "Saturn Foundation NPC · Registration no. [pending]". Replace `[pending]` in all four HTML files once CIPC issues the number.

**Two client logos are hidden.** Virgin Active and Abby Health are still being pitched, so their tiles are commented out (search for "hidden until the pitch lands") in `ecosystem.html` and `index.html`. Delete the comment markers to show them again.

**No privacy policy yet.** The contact form collects personal data, which POPIA requires you to account for.

---

## Notes

- Hero images are served at two resolutions through CSS `image-set()`. Retina screens pull the `@2x` files, everything else gets the smaller ones. Do not compress them harder — the film grain is the artwork and it resists compression, so quality costs almost nothing here.
- `docs/DESIGN-SYSTEM.md` is the reference for colours, the Saturn lockup, spacing rhythm and every component.
