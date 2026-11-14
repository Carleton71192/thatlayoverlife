/* tll-story-avatar-v1 (14 Nov 2026, the story page first-frame jump at 390, reports/evidence/story-first-frame-2026-11-14/diagnosis.md,
   experiment E2). Story pages only (the Stories Template, html[data-wf-page="6a0b29eedc14f1444e935766"]), in the core (it must be in the
   head before the author row is parsed).
   What moved: the writer's photo in the author row (img.st3-author-img, lazy, no width or height) is sized only by the template's own
   story style (style#tll-st3-story-v1), which sits at the very end of the body, after jQuery and the Webflow scripts. When the photo
   came from the cache before that style was parsed, Chrome painted it at its natural size (342x513 on a phone), the author text went
   below the fold, and when the template style then shrank the photo to 40px the text came back up about 540px: a layout shift of
   about 0.32 on 4 to 8 of 21 phone loads, before the magazine layout is applied at DOMContentLoaded.
   The fix: from the head, the size and fit declarations of the template's two avatar rules (.st3-author-avatar and .st3-author-img in
   page-footer.after.html of 13 Nov), copied exactly: same selectors, same values. Their specificity equals the template's and they come
   earlier in the cascade, so the template's own rules (and the story layer's 44px avatar in the hero) still win every tie and the
   finished page is the same to the pixel; only the frames before the template style lands change. The ring, colour and round corners
   stay with the template. No markup, attribute or data-ms-* element is touched. */
(function(){
if(document.documentElement.getAttribute('data-wf-page')!=='6a0b29eedc14f1444e935766')return;
if(document.getElementById('tll-story-avatar-v1'))return;
var st=document.createElement('style');st.id='tll-story-avatar-v1';
st.textContent='.st3-author-avatar{flex:none;width:40px;height:40px;overflow:hidden;box-sizing:border-box}'+
'.st3-author-img{display:block;width:100%;height:100%;object-fit:cover}';
(document.head||document.documentElement).appendChild(st);
})();
