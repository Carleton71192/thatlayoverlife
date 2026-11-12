/* tll-components-v1 (12 Nov 2026, codebase review): the shared sub-components the stories side (/stories, story pages) and the expat
   side (/for-expats, the staged expat build) both draw from. Core style, every page, so a page layer or Webflow page code only adds
   class names. Values are today's values: adopting a class changes no pixel. Where two layers wrote the same rule twice, the rule now
   lives here once and the old class names are listed beside the new ones, so Webflow page code that still uses an old name keeps working.
   Class scheme: tll-ui-<piece> for a piece, tll-ui-<piece>--<variant> for a variant, nothing else. No name here contains card, eyebrow,
   title, h3, group or divider, because site-wide head rules match those words inside class names ([class*=eyebrow] and the like).
   Tokens: --tll-ui-* on :root, one per value in use; every token below is read by a rule in this file or by a layer.
     --tll-ui-ink        #0A0B14  ink: text, tape, panels
     --tll-ui-paper      #FDF9F3  paper: page and box background, tape text
     --tll-ui-cream      #F7F1E8  cream: text on ink
     --tll-ui-line       #E0DACE  hairline around boxes
     --tll-ui-dash       #C9B89A  dashed frame of an empty state
     --tll-ui-text-2     #3A3A3A  second text color
     --tll-ui-muted-2    #5F5A54  small notes inside layer boxes. The page code uses #6B6660 for the same role; merging the two is an
                                  owner decision (it moves pixels), so both stay for now.
     --tll-ui-rose-text  #C8325B  rose for text and underlines (AA on paper)
     --tll-ui-teal-text  #067A79  teal for text (AA on paper)
     --tll-ui-f-head, --tll-ui-f-body, --tll-ui-f-mono  the three font stacks (Playfair Display, IBM Plex Sans Condensed, JetBrains Mono)
     --tll-ui-r          10px     corner of an empty state
   Pieces:
     .tll-ui-tape              the black washi label (was .tll-wt-tape in tll-series-v1 and .tll-ex-tape in tll-expat-v1)
       --above                 above a headline: 10px below it (.tll-wt-tape)
       --sm                    10px type (.tll-wt-card-tape, .tll-ex-tape)
       --corner                pinned to the top left corner of a card (.tll-wt-card-tape, .tll-ex-rail .tll-ex-tape)
     .tll-ui-kicker            the small teal label above a box (was .tll-sr-k, .tll-ex-k and .tll-si-k, the same rule three times)
     .tll-ui-empty             an empty state: dashed frame on white, one line and at most one action
       --center                the /stories "No stories from ... yet" note (was an inline style written by tll-stories-places-v1)
     .tll-ui-hidden            hidden by a layer (was an inline style written by tll-stories-noimg-v1)
   The style is tll-components-v1.html (registered in STYLES); this header documents it because the build sends the style's own comment
   to every page and strips this one. Nothing removed; no data-ms-* element touched.

   Helpers (12 Nov 2026, codebase review). The small helpers that tll-series-v1, tll-expat-v1 and tll-story-is-v1
   each carried a copy of, now defined once in the core as window.__tllUI. The core runs before any chunk on every page (the chunk
   loader appends the chunks after it), so a chunk layer can read window.__tllUI at any point after its own path guard.
     el(tag, className, text)  a new element; className and text are optional (text is set only when it is not null or undefined)
     style(id, css)            appends <style id=id> with css to the head, once per id
     json(url)                 GET url, the parsed JSON when the answer is 2xx, otherwise null; never throws
   Same behavior as the copies it replaces. Layers with a different el() contract (tll-expats-map-v1 takes an attributes object) keep
   their own. No data-ms-* element touched. */
(function(){
if(window.__tllUI)return;
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function style(id,css){if(document.getElementById(id))return;var s=document.createElement('style');s.id=id;s.textContent=css;document.head.appendChild(s);}
function json(url){return fetch(url).then(function(r){return r.ok?r.json():null;}).catch(function(){return null;});}
window.__tllUI={el:el,style:style,json:json};
})();
