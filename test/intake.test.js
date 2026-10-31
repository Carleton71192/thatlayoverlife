import { describe, it, expect } from 'vitest';
import { buildStory, bodyHtml, storyChecks, fullBody, handleIntake } from '../src/intake.js';

const roberta = {
  name: 'Unmatchable Pompeii', country: 'Italy', city: 'Pompei', region: 'europe', 'Field 5': 'November 2022',
  excerpt: 'After forty years.', body: 'I waited forty years for Pompeii.\nThe Art of Arriving First\nOk, so there I was.\nTwo Things You Must Never Skip\nFirst: the Villa. Its frescoes are among the most p',
  'hashtag-set': '#Pompeii #Italy', 'reader-question': 'What does it feel like', 'sign-off': 'Elated, Roberta', 'theme-desert-glow': 'true',
  'hero-image': 'https://res.cloudinary.com/idonvlow/image/upload/v1/tll/hero-image/abc.jpg',
  'photo-gallery': 'https://res.cloudinary.com/idonvlow/image/upload/v1/tll/photo-gallery/g1.jpg\nhttps://res.cloudinary.com/idonvlow/image/upload/v1/tll/photo-gallery/g2.jpg',
  'photo-plan': JSON.stringify([{ n: 2, caption: 'The Forum | at 9am', after: 'The Art of Arriving First' }]), 'cover-caption': 'Vesuvius behind', 'syndication-social': 'true', 'agree-charter': 'true',
};

describe('intake: stories', () => {
  it('keeps the writer words, makes headings, maps photos, captions and placement', () => {
    const b = buildStory(roberta, { contributorId: 'c1', slug: 'unmatchable-pompeii', now: Date.UTC(2026, 9, 31) });
    const fd = b.fieldData;
    expect(fd.body).toContain('<h2>The Art of Arriving First</h2>');
    expect(fd.body).toContain('<p>I waited forty years for Pompeii.</p>');
    expect(fd['byline-location']).toBe('POMPEI, ITALY');
    expect(fd['hero-image']).toEqual({ url: roberta['hero-image'], alt: 'Vesuvius behind' });
    expect(fd['photo-gallery'][1].alt).toBe('The Forum | at 9am');
    expect(b.placement).toBe('The Art of Arriving First | g2\nCaption: g2 | The Forum / at 9am');
    expect(fd.status).toBe('40fb8550c58a86ae03f3dfb83bf691e3');
    expect(fd.syndication).toBe('social');
    expect(b.countryCodes).toEqual(['it']);
  });
  it('flags the cut-off ending, few hashtags and a reader question without ?', () => {
    const c = storyChecks(roberta, fullBody(roberta));
    expect(c.join(' ')).toMatch(/Ends mid-sentence/);
    expect(c.join(' ')).toMatch(/2 hashtags/);
    expect(c.join(' ')).toMatch(/question mark/);
  });
  it('joins body parts and escapes HTML', () => {
    expect(fullBody({ body: 'x', 'body-part-1': 'Hello ', 'body-part-2': 'world.' })).toBe('Hello world.');
    expect(bodyHtml('A <b> & "c".')).toBe('<p>A &lt;b&gt; &amp; &quot;c&quot;.</p>');
  });
  it('refuses without a signed-in member', async () => {
    const r = await handleIntake(new Request('https://w/intake', { method: 'POST', body: '{}' }), { WEBFLOW_TOKEN: 't', MEMBERSTACK_KEY: 'k', STORIES_COLLECTION_ID: 's' });
    expect(r.status).toBe(401);
  });
});
