export function createContentApi(baseUrl: string) {
  async function getText(file: string): Promise<{ content: string }> {
    const res = await fetch(`${baseUrl}?file=${encodeURIComponent(file)}`, { credentials: 'include' });
    const data = (await res.json().catch(() => ({}))) as { content?: string; error?: string };
    if (!res.ok) throw new Error(data.error ?? `Load failed (${res.status})`);
    if (typeof data.content !== 'string') throw new Error('Unexpected response');
    return { content: data.content };
  }

  async function putText(file: string, content: string, message: string): Promise<void> {
    const res = await fetch(baseUrl, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file, content, message }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) throw new Error(data.error ?? `Save failed (${res.status})`);
  }

  async function putBase64(file: string, base64: string, message: string): Promise<void> {
    const res = await fetch(baseUrl, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file, content: base64, message, base64: true }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) throw new Error(data.error ?? `Upload failed (${res.status})`);
  }

  async function remove(file: string, message: string): Promise<void> {
    const res = await fetch(baseUrl, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file, message }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) throw new Error(data.error ?? `Delete failed (${res.status})`);
  }

  return { getText, putText, putBase64, remove };
}
