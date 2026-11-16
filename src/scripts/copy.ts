let bound = false;

async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers without the async clipboard API (or without permission).
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}

export function bindCopyButtons() {
  if (bound) return;
  bound = true;
  document.addEventListener('click', async (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-copy]');
    if (!btn) return;
    const label = btn.querySelector<HTMLElement>('[data-copy-text]');
    const ok = await writeClipboard(btn.dataset.copy ?? '');
    if (!label) return;
    label.textContent = ok ? (btn.dataset.copied ?? 'Copied') : 'Press Ctrl+C';
    btn.dataset.state = ok ? 'done' : 'fail';
    window.setTimeout(() => {
      label.textContent = btn.dataset.label ?? 'Copy';
      delete btn.dataset.state;
    }, 2200);
  });
}
