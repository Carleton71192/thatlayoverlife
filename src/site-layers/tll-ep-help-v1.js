/* tll-ep-help-v1 (29 Oct 2026, tester Roberta: "The question mark/help does not work"; "I couldn't make out what One line meant").
   1. The small "i" help marks (.ep-i on /edit-profile, and any [data-tll-tip] mark) only had a hover title, so a tap or a keyboard
      press showed nothing. They are now buttons: tap, click, Enter or Space opens a small note with the same words under the label;
      a second tap, Escape or a tap elsewhere closes it. Screen readers get the note through aria-describedby.
   2. "One line" is labeled "Tagline", with a visible hint and an example placeholder. Same input and field name (one-line).
   /edit-profile marks plus any page that uses .ep-i; nothing removed; no data-ms-* element touched. */
(function(){
var CSS=".ep-i[data-tll-help]{cursor:pointer;-webkit-tap-highlight-color:transparent}"+
".ep-i[data-tll-help]:focus-visible{outline:3px solid #C8325B;outline-offset:2px;border-radius:50%}"+
".tll-help-note{display:block;margin:8px 0 2px;padding:10px 12px;max-width:520px;border-left:3px solid #067A79;background:#E8F4F3;color:#0A0B14;"+
"font:400 14px/1.45 'IBM Plex Sans Condensed','Inter Tight',system-ui,sans-serif;letter-spacing:0;text-transform:none;border-radius:2px}"+
".tll-help-note[hidden]{display:none!important}"+
".tll-tagline-hint{margin:6px 0 0;font:400 13px/1.45 'IBM Plex Sans Condensed','Inter Tight',system-ui,sans-serif;color:#5F5A54}";
var n=0,open=null;
function close(){if(!open)return;open.note.hidden=true;open.mark.setAttribute('aria-expanded','false');open=null;}
function wire(mark){
  if(mark.dataset.tllHelp)return;var text=mark.getAttribute('aria-label')||mark.getAttribute('title')||mark.getAttribute('data-tll-tip')||'';if(!text)return;
  mark.dataset.tllHelp='1';mark.setAttribute('role','button');mark.setAttribute('tabindex','0');mark.setAttribute('aria-expanded','false');
  mark.setAttribute('aria-label','What is this?');mark.removeAttribute('title');
  var note=document.createElement('span');note.className='tll-help-note';note.id='tll-help-'+(++n);note.hidden=true;note.textContent=text;
  mark.setAttribute('aria-controls',note.id);mark.setAttribute('aria-describedby',note.id);
  var host=mark.closest('label,.ep-label,legend,h2,h3')||mark.parentNode;host.insertAdjacentElement('afterend',note);
  function toggle(e){e.preventDefault();e.stopPropagation();if(open&&open.mark===mark){close();return;}close();note.hidden=false;mark.setAttribute('aria-expanded','true');open={mark:mark,note:note};}
  mark.addEventListener('click',toggle);
  mark.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' ')toggle(e);if(e.key==='Escape')close();});
}
function tagline(){
  var input=document.getElementById('ep-f-one-line');if(!input||input.dataset.tllTag)return;input.dataset.tllTag='1';
  var lab=document.querySelector('label[for="ep-f-one-line"]');
  if(lab){[].forEach.call(lab.childNodes,function(c){if(c.nodeType===3&&/One line/i.test(c.nodeValue))c.nodeValue=c.nodeValue.replace(/One line/i,'Tagline');});}
  if(!input.placeholder)input.placeholder='Example: I finish bucket lists. Then I rebuild them.';
  var hint=document.createElement('p');hint.className='tll-tagline-hint';hint.textContent='A short line that sits under your name on your page and on the Travelers list. Not a job title.';
  input.insertAdjacentElement('afterend',hint);
}
function run(){
  if(!document.getElementById('tll-ep-help-v1')){var s=document.createElement('style');s.id='tll-ep-help-v1';s.textContent=CSS;(document.head||document.documentElement).appendChild(s);}
  [].forEach.call(document.querySelectorAll('.ep-i,[data-tll-tip]'),wire);tagline();
}
document.addEventListener('click',function(e){if(open&&!open.note.contains(e.target))close();});
document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1200);setTimeout(run,3000);
})();
