/* tll-submit-ux-v1 (29 Oct 2026, tester Luke via Nancy: "I couldn't find a clear way to insert headings"; "I wasn't entirely sure what to go
   with for the Pull Quote ... the sign-off and reader question"). Part 1, the live story form: clearer hints and an example in the box for
   Pull quote, Reader question and Sign-off, and a line under Body on subheads and photos. Part 2, the newer editor (when it ships): the
   toolbar buttons read B, I, H, a curly quote and an arrow; the subhead button was there but not readable as one. Each button now shows
   its word (Bold, Italic, Subhead, Quote, Link) and a line under the toolbar says how. Namespaced tll-su-; nothing removed. */
(function(){
if((location.pathname.replace(/\/+$/,'')||'/')!=='/submit')return;
var WORDS={bold:'Bold',italic:'Italic',h2:'Subhead',blockquote:'Quote',createLink:'Link'};
var CSS=".tsv5-tools .tll-su-w{font:600 13px/1 'IBM Plex Sans Condensed',system-ui,sans-serif;letter-spacing:0;margin-left:6px;text-transform:none}"+
".tsv5-tools .tsv5-tool{width:auto!important;min-width:44px;padding:0 10px!important;display:inline-flex;align-items:center}"+
".tsv5-tools{flex-wrap:wrap;gap:6px}"+
".tll-su-hint{margin:6px 0 0;font-size:13px;line-height:1.4;color:#5F5A54}";
function run(){var t=document.querySelector('.tsv5-tools');if(!t||t.dataset.tllSu)return;t.dataset.tllSu='1';
  var s=document.createElement('style');s.id='tll-submit-ux-v1';s.textContent=CSS;document.head.appendChild(s);
  [].forEach.call(t.querySelectorAll('.tsv5-tool'),function(b){var k=b.getAttribute('data-arg')||b.getAttribute('data-cmd'),w=WORDS[k];if(!w)return;
    var g=b.firstChild;if(g&&g.nodeType===3){var sp=document.createElement('span');sp.setAttribute('aria-hidden','true');sp.textContent=g.nodeValue;b.replaceChild(sp,g);}
    var l=document.createElement('span');l.className='tll-su-w';l.textContent=w;b.appendChild(l);});
  var h=document.createElement('p');h.className='tll-su-hint';h.textContent='Put the cursor on a line and tap Subhead to make it a heading.';t.insertAdjacentElement('afterend',h);}
var HINTS={'pull-quote':['One or two sentences copied word for word from your story: the line you would want someone to screenshot. Leave blank and the editor suggests three.','e.g. "The smell alone was enough to bring in the queues."'],
 'reader-question':['One question for readers, about your trip or theirs. It closes the story and invites replies.','e.g. Which food festival would you travel for?'],
 'sign-off':['Your last line, in your voice: a mood, then your name.','e.g. Still raising glasses. Nancy'],
 'body':['Start anywhere. The middle is fine. Put each subhead on its own line and the editor sets it as a heading. Want a photo in a certain spot? Add it in Photos and write [photo: what it shows] on its own line where it goes.','']};
function hints(){[].forEach.call(document.querySelectorAll('form textarea[name],form input[name]'),function(i){var h=HINTS[i.name];if(!h||i.dataset.tllSu)return;i.dataset.tllSu='1';
  var lab=i.closest('label'),sp=lab&&lab.querySelector('.tll-pen-helptext');if(sp&&!(i.name==='body'&&/Autosaves/.test(sp.textContent)&&false))sp.textContent=i.name==='body'?h[0]+' '+((sp.textContent.match(/Autosaves[^.]*\.(?: Drafts[^.]*\.)?/)||[''])[0]):h[0];
  if(h[1]&&!i.getAttribute('placeholder'))i.setAttribute('placeholder',h[1]);});}
function all(){run();hints();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',all);else all();
})();
