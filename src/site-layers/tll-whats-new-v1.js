/* tll-whats-new-v1 (31 Oct 2026, Nancy: "when we add a new function, is there a way to prompt current users to check it out?"
   "Yes please"). Signed-in members only. The Worker (GET /whats-new) lists the entries Nancy switched on in the CMS "What's new"
   collection. An entry a member has not seen, and that started after they joined:
   1. puts a small rose dot on the member bar's account link (any page), with "new" for screen readers;
   2. shows as a card at the top of /account: title, one line, a button to the feature and "Got it".
   Seen entries are kept on the member's own Memberstack record (JSON key tllSeenNew, merged with what is there), so they stay
   gone on every device; this browser keeps a copy too. Nothing shows while no entry is live. The nav component is not edited
   in the Designer: the dot is added in the browser to a link the member bar already has, never to a data-ms-* element. */
(function(){
if(window.__tllWhatsNew)return;window.__tllWhatsNew=1;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/whats-new';
var P=location.pathname.replace(/\/+$/,'')||'/';
var CSS='.tll-wn-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#C8325B;margin-left:6px;vertical-align:middle;box-shadow:0 0 0 2px #FDF9F3}'+
'.tll-wn-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}'+
'.tll-wn{max-width:760px;margin:20px auto;padding:0 16px;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-wn-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 8px}'+
'.tll-wn-card{border:1px solid #E0DACE;border-left:3px solid #C8325B;border-radius:4px;background:#fff;padding:14px 16px;margin:0 0 10px}'+
'.tll-wn-card h3{font:800 19px/1.2 "Playfair Display",Georgia,serif;margin:0 0 4px}.tll-wn-card p{margin:0 0 10px;color:#3a3833}'+
'.tll-wn-row{display:flex;flex-wrap:wrap;gap:8px}.tll-wn-row a,.tll-wn-row button{display:inline-flex;align-items:center;min-height:40px;padding:0 14px;border-radius:4px;font:600 14px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer;text-decoration:none}'+
'.tll-wn-row a{background:#C8325B;color:#fff;border:0}.tll-wn-row button{background:transparent;border:1.5px solid #0A0B14;color:#0A0B14}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-whats-new-v1'))return;var s=el('style');s.id='tll-whats-new-v1';s.textContent=CSS;document.head.appendChild(s);}
function ms(){return window.$memberstackDom;}
function local(){try{return JSON.parse(localStorage.getItem('tll-seen-new')||'[]');}catch(e){return[];}}
function saveLocal(a){try{localStorage.setItem('tll-seen-new',JSON.stringify(a));}catch(e){}}
function seenRemote(){var m=ms();if(!m||!m.getMemberJSON)return Promise.resolve({json:{},seen:[]});
  return m.getMemberJSON().then(function(j){var d=(j&&j.data)||{};return{json:d,seen:Array.isArray(d.tllSeenNew)?d.tllSeenNew:[]};}).catch(function(){return{json:{},seen:[]};});}
function markSeen(id){var l=local();if(l.indexOf(id)<0){l.push(id);saveLocal(l);}
  var m=ms();if(!m||!m.getMemberJSON||!m.updateMemberJSON)return;
  m.getMemberJSON().then(function(j){var d=(j&&j.data)||{};var s=Array.isArray(d.tllSeenNew)?d.tllSeenNew.slice():[];if(s.indexOf(id)<0)s.push(id);d.tllSeenNew=s.slice(-50);return m.updateMemberJSON({json:d});}).catch(function(){});}
function dots(n){
  [].forEach.call(document.querySelectorAll('.tll-wn-dot,.tll-wn-sr'),function(x){x.remove();});if(!n)return;
  var links=[].filter.call(document.querySelectorAll('a[href^="/account"]'),function(a){return ![].some.call(a.attributes,function(x){return x.name.indexOf('data-ms-')===0;})&&a.offsetParent!==null&&!a.closest('#tll-wn');});
  var a=links[0];if(!a)return;var d=el('span','tll-wn-dot');d.setAttribute('aria-hidden','true');a.appendChild(d);a.appendChild(el('span','tll-wn-sr',' ('+n+' new)'));}
function card(list,left){
  var box=document.getElementById('tll-wn');if(!list.length){if(box)box.remove();return;}
  if(!box){box=el('section','tll-wn');box.id='tll-wn';box.setAttribute('aria-label','New on That Layover Life');
    var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),anc=h&&(h.closest('section')||h.parentElement);
    if(anc&&anc.parentNode)anc.parentNode.insertBefore(box,anc.nextSibling);else main.insertBefore(box,main.firstChild);}
  box.textContent='';box.appendChild(el('p','tll-wn-k','New on That Layover Life'));
  list.forEach(function(e){var c=el('div','tll-wn-card');c.appendChild(el('h3','',e.title));if(e.line)c.appendChild(el('p','',e.line));
    var row=el('div','tll-wn-row');
    if(e.link){var a=el('a','',e.button);a.href=e.link;a.addEventListener('click',function(){markSeen(e.id);try{window.gtag&&gtag('event','whats_new_click',{division:'tll',entry:e.id});}catch(x){}});row.appendChild(a);}
    var b=el('button','','Got it');b.type='button';b.addEventListener('click',function(){markSeen(e.id);left(e.id);});row.appendChild(b);
    c.appendChild(row);box.appendChild(c);});}
function run(){
  var m=ms();if(!m||!m.getCurrentMember)return;
  m.getCurrentMember().then(function(r){
    var mem=r&&r.data;if(!mem)return null;
    return Promise.all([fetch(API).then(function(x){return x.ok?x.json():{entries:[]};}).catch(function(){return{entries:[]};}),seenRemote()]).then(function(v){
      var joined=Date.parse(mem.createdAt||mem.created_at||'')||0,seen=v[1].seen.concat(local());
      var fresh=(v[0].entries||[]).filter(function(e){return seen.indexOf(e.id)<0&&(!joined||!e.starts||Date.parse(e.starts)>=joined-864e5);});
      if(!fresh.length)return;css();
      function left(id){fresh=fresh.filter(function(e){return e.id!==id;});dots(fresh.length);if(P==='/account')card(fresh,left);}
      dots(fresh.length);if(P==='/account')card(fresh,left);
    });
  }).catch(function(){});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1400);});else setTimeout(run,1400);
})();
