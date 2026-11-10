/* tll-stories-strip-v1 (10 Nov 2026, week-one item 5: "Cut the photo strip that repeats the grid"). On /stories, tll-page-heroes-v1
   (core) builds a row of four story covers (.tll-ph-row, placed under the search bar as .tll-ph-row-below, or under the title when the
   bar is missing); all four are cards that already sit in the grid below. The row is hidden here with a style written at parse time,
   from the stories chunk, so it never paints; its images are lazy, so a hidden row fetches nothing. The builder in the core layer is
   left as it is (it also serves four other pages); dropping its /stories branch is the cleaner follow-up once this is live.
   /stories only; nothing removed from the DOM; no data-ms-* element touched. */
(function(){
if(!/^\/stories\/?$/.test(location.pathname))return;
if(document.getElementById('tll-stories-strip-v1'))return;
var s=document.createElement('style');s.id='tll-stories-strip-v1';
s.textContent='html body .tll-ph-row,html body .tll-ph-row.tll-ph-row-below{display:none}';
(document.head||document.documentElement).appendChild(s);
})();
