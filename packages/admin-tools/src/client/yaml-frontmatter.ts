/** YAML frontmatter subset used by portfolio content collections. */

/** YAML flow sequence `tags: ['a', 'b']` / `[ "a", "b" ]` (single line). */
function parseFlowYamlSequence(rest: string): string[] | null {
  const t = rest.trim();
  if (!t.startsWith('[') || !t.endsWith(']')) return null;
  const inner = t.slice(1, -1).trim();
  if (inner === '') return [];

  const items: string[] = [];
  let buf = '';
  let quote: "'" | '"' | null = null;

  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (quote) {
      if (c === quote) quote = null;
      else buf += c;
      continue;
    }
    if (c === "'" || c === '"') {
      quote = c;
      continue;
    }
    if (c === ',') {
      const piece = buf.trim();
      if (piece) items.push(unquoteYaml(piece));
      buf = '';
      continue;
    }
    buf += c;
  }
  const last = buf.trim();
  if (last) items.push(unquoteYaml(last));
  return items;
}

function unquoteYaml(s: string): string {
  if (s.startsWith('"')) {
    try {
      return JSON.parse(s) as string;
    } catch {
      return s.slice(1, -1);
    }
  }
  if (s.startsWith("'")) {
    return s.slice(1, -1).replace(/''/g, "'");
  }
  return s;
}

export const yamlFrontmatter = {
  parse(raw: string): { data: Record<string, unknown>; body: string } {
    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)/);
    if (!m) return { data: {}, body: raw };
    const data: Record<string, unknown> = {};
    const lines = m[1].split('\n');
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) {
        i++;
        continue;
      }

      const bsKey = line.match(/^(\w[\w-]*):\s*[>|]/)?.[1];
      if (bsKey) {
        const parts: string[] = [];
        i++;
        while (i < lines.length && /^\s/.test(lines[i])) {
          parts.push(lines[i].trim());
          i++;
        }
        data[bsKey] = parts.join(' ');
        continue;
      }

      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) {
        i++;
        continue;
      }
      const key = line.slice(0, colonIdx).trim();
      const rest = line.slice(colonIdx + 1).trim();

      if (rest === '' || rest === '[]') {
        const items: string[] = [];
        i++;
        while (i < lines.length && /^\s*-/.test(lines[i])) {
          const rawItem = lines[i].replace(/^\s*-\s*/, '').trim();
          items.push(unquoteYaml(rawItem));
          i++;
        }
        data[key] = items;
        continue;
      }

      const flowSeq = parseFlowYamlSequence(rest);
      if (flowSeq !== null) {
        data[key] = flowSeq;
        i++;
        continue;
      }

      if (rest === 'true') data[key] = true;
      else if (rest === 'false') data[key] = false;
      else data[key] = unquoteYaml(rest);
      i++;
    }
    return { data, body: (m[2] ?? '').trimStart() };
  },

  stringify(data: Record<string, unknown>, body: string): string {
    let yaml = '---\n';
    for (const [key, val] of Object.entries(data)) {
      if (val === undefined || val === null || val === '') continue;
      if (Array.isArray(val)) {
        if ((val as unknown[]).length === 0) {
          yaml += `${key}: []\n`;
          continue;
        }
        yaml += `${key}:\n`;
        for (const item of val as string[]) yaml += `  - ${JSON.stringify(String(item))}\n`;
      } else if (typeof val === 'boolean') {
        yaml += `${key}: ${val}\n`;
      } else {
        yaml += `${key}: ${JSON.stringify(String(val))}\n`;
      }
    }
    yaml += '---\n';
    if (body.trim()) yaml += `\n${body.trimEnd()}\n`;
    return yaml;
  },
};
