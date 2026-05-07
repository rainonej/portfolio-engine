# Scheduling (Calendly and other HTTPS providers)

Portfolio Engine does **not** embed Calendly SDK scripts or provider JavaScript. It only renders the **HTTPS scheduling URL** you configure, using the shared **`SchedulingBlock`** component from `@portfolio-engine/editorial-theme`.

**Provider behavior:** Calendly (or any other provider) continues to own availability, calendar sync, invites, reminders, cancellation, and rescheduling. Portfolio Engine surfaces your public booking link only.

## 1. Create an event type

In Calendly (or your provider), create the event type you want visitors to book.

## 2. Copy the public URL

Use the canonical **https://** scheduling link for that event (or your hub page, if that matches your workflow).

## 3. Add it to `site.json`

Under **`contact.scheduling`**, set at least `enabled`, `provider` (e.g. `"calendly"`), `mode`, and `url`:

```json
{
  "contact": {
    "heading": "Let's talk",
    "body": "Reach out directly or book a conversation.",
    "scheduling": {
      "enabled": true,
      "provider": "calendly",
      "mode": "embed",
      "url": "https://calendly.com/your-org/your-event",
      "label": "Book a conversation",
      "heading": "Book a conversation",
      "eyebrow": "Scheduling",
      "description": "For advisory, consulting, interview, or technical-fit conversations.",
      "height": 760
    }
  }
}
```

`@portfolio-engine/schema` validates this block (`SchedulingConfigSchema`): when `enabled` is true, an **https** `url` is required.

## 4. Render with `SchedulingBlock`

Import from the package export path:

```astro
---
import SchedulingBlock from '@portfolio-engine/editorial-theme/components/SchedulingBlock.astro';
---

<SchedulingBlock
  enabled={true}
  provider="calendly"
  mode="embed"
  url="https://calendly.com/example/intro-call"
  label="Book an intro call"
  heading="Book a conversation"
  eyebrow="Scheduling"
  description="For advisory, consulting, interview, or technical-fit conversations."
  height={760}
/>
```

Supported **`mode`** values: **`embed`** (responsive iframe), **`button`** (primary-styled anchor), **`link`** (inline text link). Non-HTTPS URLs fail at build/render with a clear error. With `enabled: true` and no `url`, schema validation fails in config—runtime usage should pass a resolved URL from config.

## 5. Where to use each mode

- **`mode: "embed"`** — Dedicated **Contact** (or “Book”) pages with enough vertical space; test in an incognito window so third-party cookies and embed behavior match what visitors see.
- **`mode: "button"`** — Compact CTAs on the home page, hero-adjacent strips, or footers.

## 6. Verify in incognito

Load the contact page, confirm the iframe or button opens the correct Calendly flow, and complete a test booking if your workflow requires it.

## Related

- Package export: `@portfolio-engine/editorial-theme/components/SchedulingBlock.astro`
- Schema: `SchedulingConfigSchema` in `@portfolio-engine/schema`
- **[route-ownership.md](./route-ownership.md)** if you add custom contact routes under `src/pages-local`
