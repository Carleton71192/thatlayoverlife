import { describe, it, expect } from 'vitest';
import { escapeHtml, splitHeadline, formatTime, formatPct, DEFAULT_STATES, DEFAULT_LAYERS, DEFAULT_TRACKS } from '../src/dashboard/motion-lab/tll-motion-lab-v1.js';

describe('motion lab helpers', () => {
  it('escapes markup in text', () => {
    expect(escapeHtml('<b>"x" & \'y\'</b>')).toBe('&lt;b&gt;&quot;x&quot; &amp; &#39;y&#39;&lt;/b&gt;');
    expect(escapeHtml(null)).toBe('');
  });

  it('splits a headline into words and marks the asterisk accent', () => {
    expect(splitHeadline('Layovers are a *lifestyle.*')).toEqual([
      { w: 'Layovers', acc: false }, { w: 'are', acc: false }, { w: 'a', acc: false }, { w: 'lifestyle.', acc: true },
    ]);
    expect(splitHeadline("You're in. *Customs* has been notified.").filter((p) => p.acc).map((p) => p.w)).toEqual(['Customs']);
    expect(splitHeadline('')).toEqual([]);
  });

  it('formats time and percent', () => {
    expect(formatTime(0)).toBe('00:00.00');
    expect(formatTime(4.8)).toBe('00:04.80');
    expect(formatTime(61.5)).toBe('01:01.50');
    expect(formatTime(-3)).toBe('00:00.00');
    expect(formatPct(0)).toBe('0');
    expect(formatPct(7.25)).toBe('7.3');
  });
});

describe('motion lab defaults', () => {
  it('every track keyframe points at a real state, and state times fit the timeline', () => {
    DEFAULT_TRACKS.forEach((t) => t.at.forEach((i) => expect(DEFAULT_STATES[i]).toBeTruthy()));
    DEFAULT_STATES.forEach((s) => { expect(s.t).toBeGreaterThanOrEqual(0); expect(s.t).toBeLessThanOrEqual(6); });
  });

  it('every part a state shows exists in some layer', () => {
    const markup = DEFAULT_LAYERS.map((l) => l.svg).join('');
    const keys = new Set(DEFAULT_STATES.flatMap((s) => Object.keys(s.show)));
    keys.forEach((k) => expect(markup).toContain(`data-tml-part="${k}"`));
  });

  it('copy follows the house rules: no em dashes, no banned words', () => {
    const copy = JSON.stringify(DEFAULT_STATES) + DEFAULT_LAYERS.map((l) => l.label + l.svg).join('');
    expect(copy).not.toMatch(/—/);
    expect(copy.toLowerCase()).not.toMatch(/ship|ledger|filed|no filler|truth over polish|real names/);
  });
});
