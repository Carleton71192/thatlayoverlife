import { describe, it, expect } from 'vitest';
import { articleText, cleanSummary, summarizeLink } from '../src/link-summary.js';

const page = `<html><head><title>x</title><script>var a=1</script></head><body><nav>Menu Home About</nav><article><h1>Wellness in Thailand</h1>
<p>${'Thailand has become a leading destination for luxury wellness retreats, with resorts in Phuket and Koh Samui. '.repeat(6)}</p>
<p>Short</p><p>${'Guests book week-long programs that combine Thai massage, detox menus and meditation by the sea. '.repeat(4)}</p></article><footer>Copyright</footer></body></html>`;

describe('link summary', () => {
  it('pulls article text without menus, scripts or footers', () => {
    const t = articleText(page);
    expect(t).toMatch(/^Wellness in Thailand/);
    expect(t).not.toMatch(/Menu|Copyright|var a/);
    expect(t).not.toMatch(/\nShort\n/);
  });
  it('keeps house rules and drops non-summaries', () => {
    expect(cleanSummary('NO_SUMMARY')).toBe('');
    expect(cleanSummary('A piece — on Phuket!')).toBe('A piece, on Phuket.');
  });
  it('asks the model and returns its summary', async () => {
    let req;
    const client = { beta: { messages: { create: async (r) => { req = r; return { stop_reason: 'end_turn', model: 'claude-opus-5-5', content: [{ type: 'text', text: 'The article covers wellness retreats in Phuket and Koh Samui.' }] }; } } } };
    const fetchImpl = async () => new Response(page, { status: 200, headers: { 'Content-Type': 'text/html' } });
    const s = await summarizeLink('https://thenoise.me/a', {}, { fetchImpl, client });
    expect(s.summary).toMatch(/Phuket/);
    expect(req.model).toBe('claude-opus-5-5');
    expect(req.fallbacks).toBe('default');
    expect(req.messages[0].content).toMatch(/Thailand has become/);
  });
  it('returns null on a refusal or without a key', async () => {
    const client = { beta: { messages: { create: async () => ({ stop_reason: 'refusal', content: [] }) } } };
    const fetchImpl = async () => new Response(page, { status: 200, headers: { 'Content-Type': 'text/html' } });
    expect(await summarizeLink('https://thenoise.me/a', {}, { fetchImpl, client })).toBeNull();
    expect(await summarizeLink('https://thenoise.me/a', {})).toBeNull();
  });
});
