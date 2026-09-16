# Build Saturn Startup School application — Claude spec

You are implementing a custom multi-step application form for Saturn Foundation.

Do not use Typeform, Tally, or Google Forms. Build it as a page on the existing Saturn site.

## Goal
A 15-minute mobile-first application at `https://saturn.africa/apply.html`.

This is an application to **the school**, not to the grant. The grant is awarded later, at demo day, to 3–5 founders per cohort.

## Site context
- Live pages: `https://saturn.africa/` and `https://saturn.africa/foundation.html`
- Visual language of foundation.html: white background, dark text, monospace headings, red text links for primary actions (`Apply now` style). Match that. Do not invent a black Typeform look.
- Point every founder **Apply now** button on `foundation.html` at `/apply.html`.

## Stack
- Single page: `apply.html` plus `apply.css` and `apply.js` if the site is static HTML.
- No framework required. Vanilla HTML/CSS/JS is preferred so it deploys the same way as foundation.html.
- Persist answers in `localStorage` under key `saturn-school-001` so a founder can leave and come back.
- One question (or one statement) per view. Back button on every view except welcome and endings.
- Progress bar: show step number only after the gate is passed. Example: “12 of 38”.
- Submit via POST JSON to a form backend. Use **Formspree** or **Getform** or the site’s existing contact endpoint if there is one. Email every completed application to **radiyya@saturn.africa**.
- Subject line of that email: `School 001 application — {full_name} — {business_name}`
- File upload (photo): optional. If the backend cannot take files, accept a URL instead and drop the file input. Do not block launch on upload.

## Do not
- Do not ask for a pitch deck, business plan, CIPC documents, ID, bank statements, or tax pin.
- Do not imply the R100,000 is part of the seat.
- Do not send applicant data to Saturn Ventures or Saturn Ecosystem as a lead list.
- Do not add extra questions.
- Do not skip logic jumps.

---

## Flow

```
Welcome
  → Statement: The gate
  → Q1 Age
  → Q2 South Africa
  → Q3 Already exists
  → Q4 Traction
       if any of Q1–Q4 is No → Ending B. Stop. Do not save a “completed” application.
  → Statement: You
  → Q5–Q12
  → Statement: The business
  → Q13–Q29
  → Statement: Who is building it
  → Q30 team shape
       if Q30 is “Alone” or “I have people who work with me, but I own the business”
         → skip Q31 and Q32, go to Q33
       else → Q31 → Q32 → Q33
  → Q33 decision maker
       if Q33 is “No” → Ending C. Stop.
  → Statement: You in the work
  → Q34–Q39
  → Statement: The grant
  → Q40 grant tick (required)
  → Q41 use of grant
  → Statement: Two last things
  → Q42–Q44 (Q42, Q43, Q44 optional except where marked)
  → Q45 consent (required)
  → Submit
       on success → Ending A
       on failure → stay on Q45, show “Something went wrong. Try again.”
```

Validation: a required field must have a value before Continue works. Show the missing field, do not jump.

---

## Shared UI
- Primary button label is **Continue**, except welcome (**Start**) and Q45 (**Submit application**).
- Secondary control: **Back**
- Yes/No: two large tappable options, not a dropdown.
- Multiple choice single: tappable list, one selected.
- Helper text sits under the heading, smaller, muted.
- Character counts on long text, live, `n / max`.
- Never lose answers on Back.

---

## Screens
Copy is exact. Do not rewrite.

### Welcome
Heading: Apply for Saturn Startup School

Body:
Cohort 001 begins January 2027.

This is an application to the school. It is not an application for a grant.

The school is six months, online, weekly. Sessions cover the business and the person running it. At demo day, three to five founders per cohort receive a R100,000 grant. Everyone who finishes receives twelve months of mentorship.

About 15 minutes. You can finish on a phone.

Button: Start

### Statement — The gate
Heading: First, four questions.
Body: If the school is not a fit, we will stop here so you do not spend the time.

### Q1 Age — yes/no — required
Heading: Are you between 18 and 35 years old?
Help: You must be 18 or older, and 35 or younger, on 1 January 2027.
If No → Ending B

### Q2 South Africa — yes/no — required
Heading: Do you live in South Africa, and are you a South African citizen or permanent resident?
Help: The 2027 school is for founders based in South Africa.
If No → Ending B

### Q3 Already exists — yes/no — required
Heading: Do you already have a product, service or shop in the world?
Help: Not a plan. Not a pitch deck. Something a customer can already buy or use.
If No → Ending B

### Q4 Traction — yes/no — required
Heading: Do you already have early users, or early revenue?
Help: Either is enough. Both is fine. An idea with neither is not a fit for this cohort.
If No → Ending B

### Statement — You
Heading: You.
Body: How we reach you, and where you work from.

### Q5 Name — short text — required — max 80
Heading: Full name
Help: The name you use. This is the name on the seat.
Placeholder: First name and surname

### Q6 Email — email — required
Heading: Email
Help: We will write here if we want a conversation.
Validate a normal email pattern.

### Q7 WhatsApp — tel — required
Heading: WhatsApp number
Help: This is how the school will reach you. Use the number you live on.
Accept SA numbers. Store as entered.

### Q8 City — short text — required — max 60
Heading: City or town
Placeholder: e.g. Gqeberha

### Q9 Province — select — required
Heading: Province
Options: Eastern Cape · Free State · Gauteng · KwaZulu-Natal · Limpopo · Mpumalanga · Northern Cape · North West · Western Cape

### Q10 Date of birth — date — required
Heading: Date of birth
Help: Confirms the age gate.
Input type=date. Also reject a date that makes them under 18 or over 35 on 1 January 2027. If invalid, stay here with: On 1 January 2027 you must be 18 to 35.

### Q11 Gender — single choice — required
Heading: Gender
Help: Used for reporting. Not used to select the cohort.
Options: Woman · Man · Non-binary · Prefer not to say

### Q12 How they heard — select — required
Heading: How did you hear about Saturn Startup School?
Options: Instagram · TikTok · LinkedIn · A friend or another founder · University · Saturn website · Other

### Statement — The business
Heading: The business.
Body: Short answers. Specific is better than polished. One example runs through the next screens — Slip, an invoicing app for sole traders.

### Q13 Business name — short text — required — max 80
Heading: What is the business called?
Help: Trading name is fine if you are not registered yet. Example: Slip.
Placeholder: Slip

### Q14 One sentence — long text — required — max 140
Heading: In one sentence, what does the business do?
Help: Write it so a stranger understands. Example: I built an app that turns a WhatsApp quote into an invoice a client can pay.
Placeholder: I built an app that turns a WhatsApp quote into an invoice a client can pay.

### Q15 Who uses it — long text — required — max 280
Heading: Who pays you, or who uses it?
Help: A person or a kind of customer. Not “the market”. Example: Plumbers, tutors and makeup artists in Gauteng who still chase payment over WhatsApp.
Placeholder: Plumbers, tutors and makeup artists in Gauteng who still chase payment over WhatsApp.

### Q16 How they use it — long text — required — max 280
Heading: How does a customer use it, and what do they pay?
Help: One pass through the product, then the price. Example: They turn a WhatsApp quote into a payment link. Three invoices are free. Then R249 a month.
Placeholder: They turn a WhatsApp quote into a payment link. Three invoices are free. Then R249 a month.

### Q17 First use or pay — short text — required — max 40
Heading: When did someone first use it, or first pay?
Help: Month and year. Not when you had the idea. Example: August 2025.
Placeholder: August 2025

### Q18 Stage — single choice — required
Heading: Which is true today?
Help: Slip would choose “I have both users and paying customers”.
Options:
- I have paying customers
- I have users, not yet paying
- I have both users and paying customers

### Q19 Paying customers — number — required — min 0
Heading: Roughly how many paying customers in the last 30 days?
Help: Zero is an honest answer. Example: 19.

### Q20 Active users — number — required — min 0
Heading: Roughly how many people used it in the last 30 days?
Help: Include paying and non-paying. Zero is an honest answer. Example: 140. Nineteen paid. The rest are on the free tier.

### Q21 Revenue — single choice — required
Heading: Rough monthly revenue right now
Help: A band is enough. Do not invent a precise number. Example: R5,001 – R20,000. Nineteen people on R249 a month land in this band.
Options:
- R0
- R1 – R5,000
- R5,001 – R20,000
- R20,001 – R50,000
- R50,001 – R100,000
- More than R100,000

### Q22 Paid people — number — required — min 0
Heading: Besides you, how many people are paid to work in the business?
Help: Zero is fine.

### Q23 Hours — single choice — required
Heading: How many hours a week do you spend on this business?
Options: Fewer than 10 · 10 to 20 · 21 to 40 · More than 40

### Q24 Other job — single choice — required
Heading: Do you have another job, or another business, besides this one?
Options:
- No. This is what I do.
- Yes. A job as well.
- Yes. Another business as well.

### Q25 Books — yes/no — required
Heading: Do you keep a separate business bank account, or a simple monthly record of money in and money out?
Help: “Not yet” is allowed. That is part of what the school teaches.
Yes label: Yes
No label: Not yet

### Q26 CIPC — single choice — required
Heading: Is the business registered with CIPC?
Help: Not a requirement to apply.
Options: Yes · In progress · Not yet

### Q27 Sector — select — required
Heading: Sector
Help: Any sector is welcome. Slip would choose Software and digital.
Options: Food and hospitality · Retail and consumer · Services · Software and digital · Creative and media · Health and wellness · Education · Trade and manufacturing · Agriculture · Other

### Q28 Link — url or text — optional
Heading: A link, if you have one
Help: Website, Instagram, WhatsApp catalogue, or app store. Skip if you do not have one. Example: getslip.app
Placeholder: https://getslip.app

### Q29 Photo — file or skip — optional
Heading: One photo or screenshot that proves it exists
Help: Shop front, product, app screen, invoice, or booking calendar. Not a pitch deck. 10 MB or smaller. Example: a phone screenshot of the invoice link a client receives.
Accept: image/*, application/pdf
If file upload is hard on this host, show a second optional field: “Or paste a link to the photo.”

### Statement — Who is building it
Heading: Who is building it.
Body: Solo founders are welcome. If there is a team, we need to know who will sit in the school.

### Q30 Team shape — single choice — required
Heading: Are you building this alone, or with other people?
Options:
- Alone
- With one cofounder
- With two or more cofounders
- I have people who work with me, but I own the business

Logic:
- Alone → Q33
- I have people who work with me, but I own the business → Q33
- With one cofounder → Q31
- With two or more cofounders → Q31

### Q31 Cofounders — long text — required when shown — max 400
Heading: Cofounders
Help: How many, including you. First names, and what each person does, in one line each.
Only render if Q30 is “With one cofounder” or “With two or more cofounders”.

### Q32 Who attends — single choice — required when shown
Heading: Who will attend the weekly sessions?
Help: The seat is held by one named founder. A cofounder may sit in if we invite them.
Options: I will · We will share the seat · All cofounders want to attend
Only render if Q30 is “With one cofounder” or “With two or more cofounders”.

### Q33 Decision maker — single choice — required
Heading: Are you the person who makes the final decisions in the business?
Options:
- Yes
- Shared with a cofounder
- No
If No → Ending C

### Statement — You in the work
Heading: You in the work.
Body: The school coaches the business and the person running it.

### Q34 Why this — long text — required — max 500
Heading: Why this business, and why you?
Help: A short answer. Eighty words is enough.

### Q35 Hardest part — long text — required — max 400
Heading: What is the hardest part of running it right now?

### Q36 Other programme — yes/no — required
Heading: Will you be on another incubator, accelerator or grant programme between January and June 2027?
Help: Two programmes at once is how people disappear. Tell us now.

### Q37 Time — single choice — required
Heading: The school is weekly for six months from January 2027, online, then twelve months of mentorship. Can you protect that time?
Options: Yes · I need to talk about it

### Q38 Device — yes/no — required
Heading: Do you have a laptop or smartphone, and data, for a weekly online session?
Help: The school is online. “Not yet” does not close the door. We need to know.
Yes label: Yes
No label: Not yet

### Q39 July 2027 — long text — required — max 400
Heading: What do you want to be true about the business by July 2027?
Help: The end of the six months. Be specific. Example: Eighty paying subscribers. A monthly P&L. One person on support.

### Statement — The grant
Heading: The grant.
Body: Read this before you submit.
A seat in the school does not include a grant. At demo day, a panel awards three to five grants of R100,000 per cohort. No equity. No repayment. The founder keeps the company. Everyone who finishes still receives twelve months of mentorship.

### Q40 Grant tick — checkbox — required
Label: I understand that a seat in the school does not include a grant.
Help: Grants of R100,000 are awarded at demo day to three to five founders per cohort.
Continue is disabled until checked.

### Q41 Use of grant — long text — required — max 280
Heading: If you were awarded the grant, what would the R100,000 be used for?
Help: A sketch is enough. This is not a budget submission. Example: Six months of a developer two days a week, and the App Store and Play Store listing fees.

### Statement — Two last things
Heading: Two last things.

### Q42 Where they work — single choice — optional
Heading: Where do you mainly work from?
Help: Optional. Used for reporting. Not used to select the cohort.
Options: City · Township · Peri-urban · Rural · Prefer not to say
Allow Continue with nothing selected.

### Q43 Disability — single choice — optional
Heading: Do you identify as a person with a disability?
Help: Optional. Used for reporting. Not used to select the cohort.
Options: Yes · No · Prefer not to say
Allow Continue with nothing selected.

### Q44 Named in stories — yes/no — optional
Heading: If you join the cohort, may Saturn Foundation use your first name, city, business name and a photo in reports and on the site?
Help: You can change this later.
Allow Continue with nothing selected. Store empty as “not answered”.

### Q45 Consent — checkbox — required
Heading: Thank you for taking the time to complete this application.

Checkbox label / body:
I confirm that my answers are true and complete. By submitting, I give Saturn Foundation my personal information to assess this application, and I agree to receive updates from Saturn Foundation about the school and later programmes. I can ask to be removed from updates at any time by writing to radiyya@saturn.africa.

Button: Submit application
Disabled until the checkbox is ticked.

On submit:
1. Disable the button, label it “Sending…”
2. POST the payload
3. On 2xx: clear localStorage, show Ending A
4. On error: re-enable, show “Something went wrong. Try again.”

---

## Endings
These are full-page states. No Back. No form chrome.

### Ending A — submitted
Heading: You're done.

Body:
Thank you for applying to Saturn Startup School. Please give us time to review every application. We will reach out to you. You do not need to follow up.

Follow Saturn Foundation on LinkedIn so you see the cohort as it takes shape.

Button: Follow Saturn Foundation on LinkedIn
URL: https://www.linkedin.com/company/saturnfoundation
Open in a new tab.

### Ending B — not a fit
Show if Q1, Q2, Q3 or Q4 is No.
Do not POST an application.

Heading: This cohort is not a fit.

Body:
Saturn Startup School is for founders aged 18 to 35, based in South Africa, who already have users or revenue. If that is not you yet, write to radiyya@saturn.africa and apply to a later cohort when it is.

Button: Back to saturn.africa
URL: https://saturn.africa/foundation.html

### Ending C — not the owner
Show if Q33 is No.
Do not POST an application.

Heading: The applicant has to be the owner.

Body:
Saturn teaches the person who can change the business. If that is a cofounder, they should apply in their own name.

Button: Back to saturn.africa
URL: https://saturn.africa/foundation.html

---

## Payload
POST JSON. Include a submitted_at ISO timestamp and source: "apply.html".

```
{
  "source": "apply.html",
  "cohort": "001",
  "submitted_at": "",
  "full_name": "",
  "email": "",
  "whatsapp": "",
  "city": "",
  "province": "",
  "date_of_birth": "",
  "gender": "",
  "heard_from": "",
  "business_name": "",
  "one_sentence": "",
  "who_uses": "",
  "how_they_use_and_pay": "",
  "first_use_or_pay": "",
  "stage": "",
  "paying_customers_30d": 0,
  "active_users_30d": 0,
  "revenue_band": "",
  "paid_people": 0,
  "hours_per_week": "",
  "other_job": "",
  "keeps_books": "",
  "cipc": "",
  "sector": "",
  "link": "",
  "photo_url": "",
  "team_shape": "",
  "cofounders": "",
  "who_attends": "",
  "decision_maker": "",
  "why_this": "",
  "hardest_part": "",
  "other_programme": "",
  "can_protect_time": "",
  "has_device": "",
  "july_2027": "",
  "grant_understood": true,
  "grant_use": "",
  "work_from": "",
  "disability": "",
  "may_feature": "",
  "consent_personal_and_updates": true
}
```

Also send a plain-text version of the same fields in the notification email so it is readable on a phone.

## Auto-reply to the applicant
If the form backend can send one, use:

Subject: We have your application — Saturn Startup School 001

{full_name},

Thank you for applying to Saturn Startup School. Please give us time to review every application. We will reach out to you. You do not need to follow up.

Saturn Foundation

## Wire the site
On `foundation.html`, change every founder Apply now href from `#` or `#ways` to `apply.html`.

Leave Become a mentor and Fund a programme alone.

## Done when
- Gate Nos never reach submit.
- Cofounder questions only appear when they should.
- Q33 No never reaches submit.
- Q40 and Q45 must be ticked.
- A test submit arrives at radiyya@saturn.africa.
- Mobile works.
- Refresh does not wipe answers mid-form.
- Copy matches this spec.
