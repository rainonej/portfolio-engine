import { createContentApi } from './content-api.js';
import { yamlFrontmatter } from './yaml-frontmatter.js';
import type { DesignTokenGroup } from '../lib/design-token-groups.js';

const PERSON_PATH = 'src/content/profile/person.json';
const SITE_PATH = 'src/config/site.json';

const PERSON_FIELDS = ['name', 'email', 'linkedin', 'instagram', 'photo', 'bio'] as const;

type FieldDef = {
  name: string;
  label: string;
  type?: string;
  rows?: number;
  value?: unknown;
  uploadCollection?: string;
};

type FieldGroup = { label: string; fields: FieldDef[] };

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Drawer tags field is comma-separated; frontmatter may still be an array after YAML fixes. */
function normalizeTagsInput(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((t) => String(t).trim()).filter(Boolean);
  return String(raw ?? '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

async function remotePathReadable(api: ReturnType<typeof createContentApi>, path: string): Promise<boolean> {
  try {
    await api.getText(path);
    return true;
  } catch {
    return false;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseTokenGroups(): DesignTokenGroup[] {
  const el = document.getElementById('admin-token-json');
  if (!el?.textContent) return [];
  try {
    return JSON.parse(el.textContent) as DesignTokenGroup[];
  } catch {
    return [];
  }
}

/** Resolved token sources from server (matches `.portfolio-engine/design-snapshot.json` shape). */
function parseDesignSnapshotCss(): Record<string, { value: string; source: string }> | null {
  const el = document.getElementById('admin-design-snapshot');
  if (!el?.textContent) return null;
  try {
    const raw = JSON.parse(el.textContent) as { cssVariables?: Record<string, { value: string; source: string }> };
    return raw.cssVariables ?? null;
  } catch {
    return null;
  }
}

function peTokenFromCssVar(cssVar: string): string {
  return cssVar.replace(/^--/, '');
}

function parseThemeConfigColors(): Record<string, string> {
  const raw = document.getElementById('admin-root')?.dataset.themeColors;
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

function initTokenSwatches(): void {
  const root = document.getElementById('admin-design-swatches');
  if (!root) return;
  const style = getComputedStyle(document.documentElement);
  const groups = parseTokenGroups();
  const snapshotCss = parseDesignSnapshotCss();

  for (const group of groups) {
    const wrap = document.createElement('div');
    wrap.className = 'adm-token-group';
    const h3 = document.createElement('h3');
    h3.className = 'adm-token-group-title';
    h3.textContent = group.title;
    wrap.appendChild(h3);
    const grid = document.createElement('div');
    grid.className = 'adm-token-grid';
    for (const t of group.tokens) {
      const value = style.getPropertyValue(t.cssVar).trim() || '(not set)';
      const looksLikeColor =
        /^#([0-9a-f]{3,8})$/i.test(value) || /^rgb/i.test(value) || /^hsl/i.test(value);
      const swatchBg = looksLikeColor && !value.startsWith('(') ? value : 'transparent';
      const card = document.createElement('div');
      card.className = 'adm-token-card';
      card.dataset.peToken = peTokenFromCssVar(t.cssVar);
      const src = snapshotCss?.[t.cssVar]?.source;
      const sourceLine = src ? `<p class="adm-token-source">${escapeHtml(src)}</p>` : '';
      card.innerHTML = `
        <div class="adm-token-swatch" style="background:${swatchBg}"></div>
        <div class="adm-token-meta">
          <p class="adm-token-label">${escapeHtml(t.label)}</p>
          <p class="adm-token-value">${escapeHtml(value)}</p>
          <p class="adm-token-var">${escapeHtml(t.cssVar)}</p>
          ${sourceLine}
          <p class="adm-token-usage">${escapeHtml(t.usage)}</p>
        </div>`;
      grid.appendChild(card);
    }
    wrap.appendChild(grid);
    root.appendChild(wrap);
  }

  const cfg = parseThemeConfigColors();
  const entries = Object.entries(cfg).filter(([, v]) => typeof v === 'string' && v.trim());
  if (entries.length === 0) return;
  const wrap = document.createElement('div');
  wrap.className = 'adm-token-group';
  const h3 = document.createElement('h3');
  h3.className = 'adm-token-group-title';
  h3.textContent = 'Theme file (src/config/theme.json)';
  wrap.appendChild(h3);
  const p = document.createElement('p');
  p.className = 'adm-token-file-hint';
  p.textContent =
    'These entries come from your theme config. They are optional; the editorial theme primarily uses the CSS variables above.';
  wrap.appendChild(p);
  const grid = document.createElement('div');
  grid.className = 'adm-token-grid';
  const labels: Record<string, string> = {
    primary: 'Primary',
    secondary: 'Secondary',
    background: 'Background',
    text: 'Text',
  };
  const usage: Record<string, string> = {
    primary: 'Brand primary actions and highlights when wired to components',
    secondary: 'Secondary brand tone when wired to components',
    background: 'Page or section background when wired to components',
    text: 'Default text color when wired to components',
  };
  for (const [key, val] of entries) {
    const card = document.createElement('div');
    card.className = 'adm-token-card';
    card.innerHTML = `
      <div class="adm-token-swatch" style="background:${escapeHtml(val)}"></div>
      <div class="adm-token-meta">
        <p class="adm-token-label">${escapeHtml(labels[key] ?? key)}</p>
        <p class="adm-token-value">${escapeHtml(val)}</p>
        <p class="adm-token-var">theme.colors.${escapeHtml(key)}</p>
        <p class="adm-token-usage">${escapeHtml(usage[key] ?? 'From theme config')}</p>
      </div>`;
    grid.appendChild(card);
  }
  wrap.appendChild(grid);
  root.appendChild(wrap);
}

function initLogout(logoutBtn: HTMLButtonElement): void {
  logoutBtn.addEventListener('click', async () => {
    const url = logoutBtn.dataset.logoutUrl;
    const home = logoutBtn.dataset.homeUrl;
    if (!url || !home) return;
    await fetch(url, { method: 'POST', credentials: 'include' });
    window.location.href = home;
  });
}

function showToast(el: HTMLElement, msg: string, isError = false): void {
  el.textContent = msg;
  el.className = `adm-toast adm-toast--show ${isError ? 'adm-toast--err' : 'adm-toast--ok'}`;
  window.setTimeout(() => {
    el.className = `adm-toast ${isError ? 'adm-toast--err' : 'adm-toast--ok'}`;
  }, 4000);
}

function collectionMarkdownPath(type: 'project' | 'writing', slug: string, ext: '.md' | '.mdx'): string {
  const dir = type === 'project' ? 'projects' : 'writing';
  return `src/content/${dir}/${slug}${ext}`;
}

async function resolveMarkdownEntryPath(
  api: ReturnType<typeof createContentApi>,
  type: 'project' | 'writing',
  slug: string,
): Promise<string | null> {
  const md = collectionMarkdownPath(type, slug, '.md');
  if (await remotePathReadable(api, md)) return md;
  const mdx = collectionMarkdownPath(type, slug, '.mdx');
  if (await remotePathReadable(api, mdx)) return mdx;
  return null;
}

function testimonialPath(slug: string): string {
  return `src/content/testimonials/${slug}.json`;
}

function renderFields(fields: FieldDef[]): string {
  return fields
    .map((f) => {
      const id = `df-${f.name}`;
      const safeVal = escapeHtml(String(f.value ?? ''));
      if (f.type === 'checkbox') {
        return `<div class="adm-drawer-field">
          <label class="adm-drawer-check">
            <input type="checkbox" id="${id}" name="${f.name}" ${f.value ? 'checked' : ''}>
            ${escapeHtml(f.label)}
          </label>
        </div>`;
      }
      if (f.type === 'textarea') {
        const isBody = f.name === 'body';
        const extra = isBody ? ' adm-drawer-textarea--body' : '';
        return `<div class="adm-drawer-field">
          <label class="adm-drawer-label" for="${id}">${escapeHtml(f.label)}</label>
          <textarea id="${id}" name="${f.name}" class="adm-drawer-input adm-drawer-textarea${extra}">${safeVal}</textarea>
        </div>`;
      }
      if (f.uploadCollection) {
        return `<div class="adm-drawer-field">
          <label class="adm-drawer-label" for="${id}">${escapeHtml(f.label)}</label>
          <input type="text" id="${id}" name="${f.name}" class="adm-drawer-input" value="${safeVal}" placeholder="/media/${f.uploadCollection}/photo.jpg">
          <div class="adm-img-drop" data-collection="${f.uploadCollection}" data-field="${id}">
            <span class="adm-img-drop-hint">Drop an image or click to browse</span>
            <input type="file" class="adm-img-drop-input" accept=".jpg,.jpeg,.png,.webp,.gif" aria-label="Upload image">
          </div>
          <div class="adm-img-preview" hidden>
            <img class="adm-img-preview-img" src="" alt="Preview">
          </div>
        </div>`;
      }
      return `<div class="adm-drawer-field">
        <label class="adm-drawer-label" for="${id}">${escapeHtml(f.label)}</label>
        <input type="${f.type ?? 'text'}" id="${id}" name="${f.name}" class="adm-drawer-input" value="${safeVal}">
      </div>`;
    })
    .join('');
}

function renderGroupedFields(groups: FieldGroup[]): string {
  return groups
    .map(
      (g) =>
        `<div class="adm-drawer-section"><h3 class="adm-drawer-section-label">${escapeHtml(g.label)}</h3>${renderFields(g.fields)}</div>`,
    )
    .join('');
}

function readDrawerForm(fieldsEl: HTMLElement): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const el of Array.from(fieldsEl.querySelectorAll('input, textarea, select'))) {
    const inp = el as HTMLInputElement | HTMLTextAreaElement;
    if (!inp.name) continue;
    result[inp.name] = inp.type === 'checkbox' ? (inp as HTMLInputElement).checked : inp.value;
  }
  return result;
}

function initImageUploadFields(fieldsEl: HTMLElement, api: ReturnType<typeof createContentApi>, toastEl: HTMLElement): void {
  const ALLOWED = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

  fieldsEl.querySelectorAll<HTMLElement>('.adm-img-drop').forEach((zone) => {
    const collection = zone.dataset.collection!;
    const fieldId = zone.dataset.field!;
    const pathInput = fieldsEl.querySelector<HTMLInputElement>(`#${fieldId}`);
    const previewWrap = zone.nextElementSibling as HTMLElement | null;
    const previewImg = previewWrap?.querySelector<HTMLImageElement>('.adm-img-preview-img');
    const fileInput = zone.querySelector<HTMLInputElement>('.adm-img-drop-input');
    if (!pathInput || !previewWrap || !previewImg || !fileInput) return;

    const pathIn = pathInput;
    const prevWrap = previewWrap;
    const prevImg = previewImg;
    const fileIn = fileInput;

    if (pathIn.value.trim()) {
      prevImg.src = pathIn.value.trim();
      prevWrap.hidden = false;
    }

    async function handleFile(file: File) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      if (!ALLOWED.includes(ext)) {
        showToast(toastEl, 'Only jpg, png, webp, or gif images are allowed.', true);
        return;
      }
      zone.classList.add('adm-img-drop--busy');
      try {
        const buf = await file.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
        const b64 = btoa(binary);
        const rel = `public/media/${collection}/${file.name}`;
        const pub = `/media/${collection}/${file.name}`;
        await api.putBase64(rel, b64, `admin-tools: upload ${file.name}`);
        pathIn.value = pub;
        prevImg.src = URL.createObjectURL(file);
        prevWrap.hidden = false;
        showToast(toastEl, 'Image uploaded');
      } catch (e: unknown) {
        showToast(toastEl, (e as Error).message, true);
      } finally {
        zone.classList.remove('adm-img-drop--busy');
      }
    }

    let dragDepth = 0;
    zone.addEventListener('dragenter', (e) => {
      e.preventDefault();
      dragDepth++;
      zone.classList.add('adm-img-drop--over');
    });
    zone.addEventListener('dragleave', () => {
      dragDepth--;
      if (dragDepth <= 0) {
        dragDepth = 0;
        zone.classList.remove('adm-img-drop--over');
      }
    });
    zone.addEventListener('dragover', (e) => e.preventDefault());
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      dragDepth = 0;
      zone.classList.remove('adm-img-drop--over');
      const file = e.dataTransfer?.files[0];
      if (file) void handleFile(file);
    });
    zone.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.adm-img-drop-input')) return;
      fileIn.click();
    });
    fileIn.addEventListener('change', () => {
      const file = fileIn.files?.[0];
      if (file) void handleFile(file);
      fileIn.value = '';
    });
  });
}

function markdownGroups(type: string, d: Record<string, unknown> = {}): FieldGroup[] {
  const meta: FieldDef[] = [
    { name: 'title', label: 'Title', value: d.title },
    { name: 'date', label: 'Date (YYYY-MM-DD)', value: d.date },
    {
      name: 'tags',
      label: 'Tags (comma-separated)',
      value: Array.isArray(d.tags) ? (d.tags as string[]).join(', ') : d.tags ?? '',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      rows: 3,
      value: d.description,
    },
  ];
  if (type === 'project') {
    meta.push({ name: 'link', label: 'External link (URL)', value: d.link });
  }
  meta.push({ name: 'featured', label: 'Featured', type: 'checkbox', value: d.featured });
  if (type === 'writing') {
    meta.push({ name: 'draft', label: 'Draft (hidden on site)', type: 'checkbox', value: d.draft });
  }
  const contentFields: FieldDef[] = [
    { name: 'body', label: 'Body (Markdown)', type: 'textarea', rows: 14, value: d._body },
  ];
  const mediaFields: FieldDef[] = [
    {
      name: 'image',
      label: 'Image path',
      value: d.image,
      uploadCollection: type === 'project' ? 'projects' : 'writing',
    },
  ];
  return [
    { label: 'Metadata', fields: meta },
    { label: 'Content', fields: contentFields },
    { label: 'Media', fields: mediaFields },
  ];
}

function initDrawer(
  api: ReturnType<typeof createContentApi>,
  toastEl: HTMLElement,
  onSaved: () => void,
): void {
  const drawer = document.getElementById('adm-drawer')!;
  const backdrop = document.getElementById('adm-drawer-backdrop')!;
  const fieldsEl = document.getElementById('adm-drawer-fields')!;
  const titleEl = document.getElementById('adm-drawer-title')!;
  const subtitleEl = document.getElementById('adm-drawer-subtitle')!;
  const saveBtn = document.getElementById('adm-drawer-save') as HTMLButtonElement;
  const cancelBtn = document.getElementById('adm-drawer-cancel')!;
  const closeBtn = document.getElementById('adm-drawer-close')!;
  const delBtn = document.getElementById('adm-drawer-delete') as HTMLButtonElement;

  let onSave: ((vals: Record<string, unknown>) => Promise<void>) | null = null;
  let onDelete: (() => Promise<void>) | null = null;
  let triggerEl: HTMLElement | null = null;

  function close(): void {
    drawer.classList.remove('adm-drawer--open');
    backdrop.classList.remove('adm-drawer-backdrop--open');
    document.body.style.overflow = '';
    drawer.setAttribute('inert', '');
    triggerEl?.focus();
    triggerEl = null;
    onSave = null;
    onDelete = null;
  }

  function open(): void {
    triggerEl = document.activeElement as HTMLElement | null;
    drawer.removeAttribute('inert');
    drawer.classList.add('adm-drawer--open');
    backdrop.classList.add('adm-drawer-backdrop--open');
    document.body.style.overflow = 'hidden';
    const first = drawer.querySelector<HTMLElement>('button, [href], input, textarea, select');
    (first ?? closeBtn).focus();
  }

  saveBtn.addEventListener('click', async () => {
    if (!onSave) return;
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving…';
    try {
      await onSave(readDrawerForm(fieldsEl));
      showToast(toastEl, 'Saved');
      close();
      onSaved();
    } catch (e: unknown) {
      showToast(toastEl, (e as Error).message, true);
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save';
    }
  });

  delBtn.addEventListener('click', async () => {
    if (!onDelete) return;
    if (!confirm('Delete this entry? This cannot be undone.')) return;
    delBtn.disabled = true;
    try {
      await onDelete();
      showToast(toastEl, 'Deleted');
      close();
      onSaved();
    } catch (e: unknown) {
      showToast(toastEl, (e as Error).message, true);
    } finally {
      delBtn.disabled = false;
    }
  });

  for (const el of [cancelBtn, closeBtn, backdrop]) el.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('adm-drawer--open')) close();
  });

  function openModal(opts: {
    title: string;
    subtitle?: string;
    fields?: FieldDef[];
    groups?: FieldGroup[];
    onSave: (vals: Record<string, unknown>) => Promise<void>;
    onDelete?: () => Promise<void>;
  }): void {
    titleEl.textContent = opts.title;
    subtitleEl.textContent = opts.subtitle ?? '';
    subtitleEl.style.display = opts.subtitle ? '' : 'none';
    fieldsEl.innerHTML = opts.groups ? renderGroupedFields(opts.groups) : renderFields(opts.fields ?? []);
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save';
    delBtn.hidden = !opts.onDelete;
    delBtn.disabled = false;
    onSave = opts.onSave;
    onDelete = opts.onDelete ?? null;
    initImageUploadFields(fieldsEl, api, toastEl);
    fieldsEl.scrollTop = 0;
    open();
  }

  async function openMarkdownEditor(slug: string | null, type: 'project' | 'writing'): Promise<void> {
    let existing: Record<string, unknown> = {};
    let pathForDelete: string | null = null;
    if (slug) {
      pathForDelete = await resolveMarkdownEntryPath(api, type, slug);
      if (!pathForDelete) {
        showToast(toastEl, `No entry found for "${slug}" as .md or .mdx.`, true);
        return;
      }
      try {
        const { content } = await api.getText(pathForDelete);
        const { data, body } = yamlFrontmatter.parse(content);
        existing = { ...data, _body: body };
      } catch (e: unknown) {
        showToast(toastEl, (e as Error).message, true);
        return;
      }
    }
    const typeLabel = type === 'project' ? 'Project' : 'Essay';
    const dir = type === 'project' ? 'projects' : 'writing';
    const subtitle =
      slug && pathForDelete
        ? pathForDelete.replace(/^src\/content\//, 'content/')
        : `content/${dir}/…`;
    openModal({
      title: slug ? `Edit ${typeLabel}` : `New ${typeLabel}`,
      subtitle,
      groups: markdownGroups(type, existing),
      onSave: async (vals) => {
        const title = (vals.title as string).trim();
        if (!title) throw new Error('Title is required');
        const tags = normalizeTagsInput(vals.tags);
        const targetSlug = slug ?? slugify(title);
        const label = type === 'project' ? 'project' : 'essay';

        if (!slug && (await remotePathReadable(api, collectionMarkdownPath(type, targetSlug, '.md')))) {
          throw new Error(`A ${label} with slug "${targetSlug}" already exists (.md). Pick a different title.`);
        }
        if (!slug && (await remotePathReadable(api, collectionMarkdownPath(type, targetSlug, '.mdx')))) {
          throw new Error(`A ${label} with slug "${targetSlug}" already exists (.mdx). Pick a different title.`);
        }

        const fmData: Record<string, unknown> = {
          title,
          date: vals.date || new Date().toISOString().slice(0, 10),
          tags,
          image: vals.image || undefined,
          featured: !!vals.featured,
        };
        if (type === 'project') {
          const trimmedDesc = (vals.description as string)?.trim();
          fmData.description =
            trimmedDesc ||
            (slug ? String(existing.description ?? '').trim() : '') ||
            'Description pending.';
          if (vals.link) fmData.link = vals.link;
        } else {
          const wd = (vals.description as string)?.trim();
          if (wd) fmData.description = wd;
          fmData.draft = !!vals.draft;
        }
        const fileContent = yamlFrontmatter.stringify(fmData, (vals.body as string) || '');
        const ext = slug && pathForDelete?.endsWith('.mdx') ? '.mdx' : '.md';
        const outPath = collectionMarkdownPath(type, targetSlug, ext);
        const verb = slug ? 'update' : 'add';
        await api.putText(outPath, fileContent, `admin-tools: ${verb} ${label} "${title}"`);
      },
      onDelete:
        slug && pathForDelete
          ? async () => {
              await api.remove(pathForDelete!, `admin-tools: delete ${type} "${slug}"`);
            }
          : undefined,
    });
  }

  async function openTestimonialEditor(slug: string | null): Promise<void> {
    let data: Record<string, unknown> = {};
    let path: string | null = null;
    if (slug) {
      path = testimonialPath(slug);
      try {
        const { content } = await api.getText(path);
        data = JSON.parse(content) as Record<string, unknown>;
      } catch (e: unknown) {
        showToast(toastEl, (e as Error).message, true);
        return;
      }
    }
    openModal({
      title: slug ? 'Edit testimonial' : 'New testimonial',
      subtitle: slug ? `content/testimonials/${slug}.json` : 'content/testimonials/…',
      fields: [
        { name: 'author', label: 'Author', value: data.author },
        { name: 'role', label: 'Role / title', value: data.role },
        { name: 'quote', label: 'Quote', type: 'textarea', rows: 5, value: data.quote },
        { name: 'featured', label: 'Featured', type: 'checkbox', value: data.featured },
      ],
      onSave: async (vals) => {
        const author = (vals.author as string).trim();
        if (!author) throw new Error('Author is required');
        const payload = {
          author,
          role: (vals.role as string)?.trim() || '',
          quote: (vals.quote as string).trim(),
          featured: !!vals.featured,
        };
        const targetSlug = slug ?? slugify(author);
        if (!slug && (await remotePathReadable(api, testimonialPath(targetSlug)))) {
          throw new Error(`A testimonial with slug "${targetSlug}" already exists. Pick a different author name or edit the existing entry.`);
        }
        const verb = slug ? 'update' : 'add';
        await api.putText(
          testimonialPath(targetSlug),
          `${JSON.stringify(payload, null, 2)}\n`,
          `admin-tools: ${verb} testimonial from "${author}"`,
        );
      },
      onDelete:
        slug && path
          ? async () => {
              await api.remove(path!, `admin-tools: delete testimonial "${slug}"`);
            }
          : undefined,
    });
  }

  document.querySelectorAll<HTMLElement>('[data-admin-edit]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const kind = btn.dataset.adminEdit;
      const slug = btn.dataset.slug ?? '';
      if (kind === 'project') void openMarkdownEditor(slug || null, 'project');
      else if (kind === 'writing') void openMarkdownEditor(slug || null, 'writing');
      else if (kind === 'testimonial') void openTestimonialEditor(slug || null);
    });
  });

  document.querySelectorAll<HTMLElement>('[data-admin-new]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const kind = btn.dataset.adminNew;
      if (kind === 'project') void openMarkdownEditor(null, 'project');
      else if (kind === 'writing') void openMarkdownEditor(null, 'writing');
      else if (kind === 'testimonial') void openTestimonialEditor(null);
    });
  });
}

function initSettingsEditor(
  api: ReturnType<typeof createContentApi>,
  toastEl: HTMLElement,
  onSaved: () => void,
): void {
  const section = document.getElementById('settings');
  if (!section || section.dataset.settingsAvailable !== 'true') return;

  const displayEl = document.getElementById('adm-settings-display')!;
  const formEl = document.getElementById('adm-settings-form') as HTMLFormElement;
  const editBtn = document.getElementById('adm-settings-edit')!;
  const cancelBtn = document.getElementById('adm-settings-cancel')!;

  editBtn.addEventListener('click', async () => {
    displayEl.hidden = true;
    formEl.hidden = false;
    try {
      const [personRaw, siteRaw] = await Promise.all([api.getText(PERSON_PATH), api.getText(SITE_PATH)]);
      const person = JSON.parse(personRaw.content) as Record<string, string>;
      const site = JSON.parse(siteRaw.content) as Record<string, unknown>;
      formEl.dataset.personJson = JSON.stringify(person);
      formEl.dataset.siteJson = JSON.stringify(site);
      const contact =
        site.contact && typeof site.contact === 'object'
          ? (site.contact as Record<string, string>)
          : { heading: '', body: '' };
      const flat: Record<string, string> = {
        ...person,
        title: String(site.title ?? ''),
        tagline: String(site.tagline ?? ''),
        description: String(site.description ?? ''),
        bookingUrl: String(site.bookingUrl ?? ''),
        contactHeading: String(contact.heading ?? ''),
        contactBody: String(contact.body ?? ''),
      };
      for (const [k, v] of Object.entries(flat)) {
        const el = formEl.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${k}"]`);
        if (el) el.value = v ?? '';
      }
    } catch (e: unknown) {
      showToast(toastEl, (e as Error).message, true);
      displayEl.hidden = false;
      formEl.hidden = true;
    }
  });

  cancelBtn.addEventListener('click', () => {
    displayEl.hidden = false;
    formEl.hidden = true;
  });

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const personData = JSON.parse(formEl.dataset.personJson ?? '{}') as Record<string, string>;
    const siteData = JSON.parse(formEl.dataset.siteJson ?? '{}') as Record<string, unknown>;
    const fd = new FormData(formEl);
    for (const k of PERSON_FIELDS) personData[k] = String(fd.get(k) ?? '');
    siteData.title = String(fd.get('title') ?? '');
    siteData.tagline = String(fd.get('tagline') ?? '');
    siteData.description = String(fd.get('description') ?? '');
    const booking = String(fd.get('bookingUrl') ?? '').trim();
    if (booking) siteData.bookingUrl = booking;
    else delete siteData.bookingUrl;
    const contact =
      siteData.contact && typeof siteData.contact === 'object'
        ? { ...(siteData.contact as Record<string, string>) }
        : {};
    contact.heading = String(fd.get('contactHeading') ?? '');
    contact.body = String(fd.get('contactBody') ?? '');
    siteData.contact = contact;

    const submitBtn = formEl.querySelector<HTMLButtonElement>('[type="submit"]')!;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving…';
    try {
      await api.putText(PERSON_PATH, `${JSON.stringify(personData, null, 2)}\n`, 'admin-tools: update profile');
      await api.putText(SITE_PATH, `${JSON.stringify(siteData, null, 2)}\n`, 'admin-tools: update site config');
      showToast(toastEl, 'Settings saved');
      onSaved();
    } catch (err: unknown) {
      showToast(toastEl, (err as Error).message, true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Save settings';
    }
  });
}

function initLegacyFileTools(contentApiUrl: string): void {
  const api = createContentApi(contentApiUrl);
  const fileInput = document.getElementById('adm-file') as HTMLInputElement | null;
  const contentArea = document.getElementById('adm-content') as HTMLTextAreaElement | null;
  const status = document.getElementById('adm-status');

  document.getElementById('adm-load')?.addEventListener('click', async () => {
    const file = fileInput?.value?.trim();
    if (!file || !status) return;
    status.textContent = 'Loading…';
    try {
      const { content } = await api.getText(file);
      if (contentArea) contentArea.value = content;
      status.textContent = `Loaded ${file}`;
    } catch (e: unknown) {
      status.textContent = `Load failed: ${(e as Error).message}`;
    }
  });

  document.getElementById('adm-save')?.addEventListener('click', async () => {
    const file = fileInput?.value?.trim();
    if (!file || !status) return;
    status.textContent = 'Saving…';
    try {
      await api.putText(file, contentArea?.value ?? '', `admin-tools: update ${file}`);
      status.textContent = `Saved ${file}`;
    } catch (e: unknown) {
      status.textContent = `Save failed: ${(e as Error).message}`;
    }
  });

  const dropzone = document.getElementById('adm-dropzone');
  const uploadInput = document.getElementById('adm-upload-input') as HTMLInputElement | null;
  const uploadList = document.getElementById('adm-upload-list');
  const uploadStatus = document.getElementById('adm-upload-status');
  const targetDirInput = document.getElementById('adm-target-dir') as HTMLInputElement | null;

  const renderFiles = (files: FileList) => {
    if (!uploadList) return;
    uploadList.innerHTML = '';
    [...files].forEach((f) => {
      const li = document.createElement('li');
      li.textContent = `${f.name} (${f.type || 'binary'}, ${f.size} bytes)`;
      uploadList.appendChild(li);
    });
  };

  const doUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    renderFiles(fileList);
    if (uploadStatus) uploadStatus.textContent = 'Uploading…';
    const fd = new FormData();
    const dir = targetDirInput?.value?.trim() || '';
    fd.append('targetDir', dir);
    [...fileList].forEach((f) => fd.append('files', f));
    const res = await fetch(contentApiUrl, { method: 'POST', credentials: 'include', body: fd });
    const data = (await res.json().catch(() => ({}))) as { saved?: string[]; error?: string };
    if (uploadStatus)
      uploadStatus.textContent = res.ok
        ? `Uploaded: ${(data.saved || []).join(', ')}`
        : `Upload failed: ${data.error || res.status}`;
  };

  dropzone?.addEventListener('click', () => uploadInput?.click());
  uploadInput?.addEventListener('change', () => doUpload(uploadInput.files ?? null));
  ['dragenter', 'dragover'].forEach((evt) =>
    dropzone?.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add('is-over');
    }),
  );
  ['dragleave', 'drop'].forEach((evt) =>
    dropzone?.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.remove('is-over');
    }),
  );
  dropzone?.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    if (!dt?.files) return;
    void doUpload(dt.files);
  });
}

export function initAdminApp(contentApiUrl: string): void {
  const root = document.getElementById('admin-root');
  if (!root) return;

  const api = createContentApi(contentApiUrl);
  const toastEl = document.getElementById('adm-toast')!;
  const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement | null;

  if (logoutBtn) initLogout(logoutBtn);
  initTokenSwatches();

  const reload = () => {
    window.location.reload();
  };

  initDrawer(api, toastEl, reload);
  initSettingsEditor(api, toastEl, reload);
  initLegacyFileTools(contentApiUrl);
}
