# Named override bridge and style override implementation

**Phase:** Phase 3  
**MVP relevance:** ★ Required for Backbone MVP if overrides are advertised in v0.1 docs; otherwise document exclusion explicitly  
**Products touched:** A, B  
**Labels:** `type:epic`, `area:editorial-theme`, `area:engine-core`, `source:human`

## Summary

Make sure documented and validated override surfaces actually render consumer-provided components/styles at build time.

## Why this matters

The current engine-core has override resolution and supported surface validation. The theme must use the resolved override map when rendering sections. Otherwise overrides are documented but not functionally complete.

## Tickets

### Audit current override rendering path

**Labels:** `task:research`, `owner:agentic-ai`, `area:editorial-theme`, `agent:approved`

Inspect whether `@portfolio-engine:overrides` is used in theme pages/components or whether default components are imported directly.

**Acceptance criteria**

- [ ] Audit notes cite relevant files.
- [ ] Missing bridge points are listed.

### Implement component override bridge

**Labels:** `task:feat`, `owner:agentic-ai`, `area:editorial-theme`, `agent:approved`

For each supported surface, render the consumer override if present; otherwise render the default component.

**Acceptance criteria**

- [ ] `Hero` override works.
- [ ] `FeaturedWriting` override works.
- [ ] `TestimonialSection` override works.
- [ ] `CollaborationSection` override works.

### Document surface names vs implementation files

**Labels:** `task:docs`, `owner:agentic-ai`, `area:docs`, `agent:approved`

Explain that `Hero` is an override surface name and may map to an upstream implementation such as `HeroSection.astro`; `src/overrides/Hero.astro` replaces the surface, not necessarily a literal upstream file.

**Acceptance criteria**

- [ ] Surface semantics are clear.
- [ ] Props for each surface are documented.
- [ ] `custom.css` append behavior is explained.

### Add demo override example

**Labels:** `task:feat`, `owner:agentic-ai`, `area:demo-site`, `agent:approved`

Add a small demo-site Hero override and custom.css example.

**Acceptance criteria**

- [ ] Rendered result visible.
- [ ] Source files linked in demo docs.
