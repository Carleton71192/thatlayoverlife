// Applies the Webflow proposal (the home hero img attributes) to a published home document, as a publish would write it.
const FIND = 'data-tll-parallax="hero" loading="eager" fetchpriority="high"';
const REPL = 'data-tll-parallax="hero" loading="lazy"';
function home(h) {
  const n = h.split(FIND).length - 1; if (n !== 1) throw new Error('proposal find count ' + n);
  return h.replace(FIND, REPL);
}
module.exports = { home, FIND, REPL };
