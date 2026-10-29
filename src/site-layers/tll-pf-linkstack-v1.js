/* tll-pf-linkstack-v1 (29 Oct 2026). Public profile (/contributors/{slug}): shows the member's "More links" (partners.stack, set on
   /edit-profile) under their link buttons. Plain links are buttons. YouTube, X posts, TikTok videos, Twitch, Spotify, Apple Music,
   Apple Podcasts and Calendly show as a card that loads the player only when tapped, so no outside service loads until the reader
   asks. Shop, digital products, courses and tips carry an AFFILIATE, PAID or TIPS tag and rel="sponsored". The contact card saves a
   .vcf with the member's name, profile link and the email they chose to share. Never touches data-ms-* elements. */
(function(){
if(!/^\/contributors\/[^/]+\/?$/.test(location.pathname))return;
var TAG={shop:'AFFILIATE',digital:'PAID',course:'PAID',tips:'TIPS'},WORD={web:'Link',pdf:'PDF',book:'Book',presave:'Pre-save',booking:'Book a time',contact:'Contact'};
var CSS='.tll-lsp{display:grid;gap:10px;width:100%;flex-basis:100%;margin:14px 0 0}.tll-lsp-h{margin:0;font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;color:#067A79}'+
'.tll-lsp-btns{display:flex;flex-wrap:wrap;gap:8px}.tll-lsp-card{display:flex;align-items:center;gap:12px;width:100%;min-height:56px;padding:10px 14px;border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;color:#0A0B14;font:600 15px/1.3 "IBM Plex Sans Condensed",system-ui,sans-serif;text-align:left;cursor:pointer}'+
'.tll-lsp-card span{display:block;font:500 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1px;color:#5F5A54;text-transform:uppercase}.tll-lsp-card b{flex:none;width:34px;height:34px;border-radius:50%;background:#C8325B;color:#fff;display:grid;place-items:center;font-size:13px}'+
'.tll-lsp-frame{width:100%;border:0;border-radius:4px;background:#F7F1E8}@media(hover:hover){.tll-lsp-card:hover{border-color:#C8325B}}.tll-lsp-card:focus-visible{outline:3px solid #0A0B14;outline-offset:2px}';
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function safe(u){u=String(u||'').trim();return /^https:\/\/\S+$/i.test(u)?u:''}
function embed(l){var u=safe(l.url),m;if(!u)return null;var host=location.hostname;
  if(l.t==='youtube'&&(m=u.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{6,})/)))return {src:'https://www.youtube-nocookie.com/embed/'+m[1],h:'56.25%',name:'YouTube'};
  if(l.t==='x'&&(m=u.match(/(?:x|twitter)\.com\/[^/]+\/status\/(\d+)/)))return {src:'https://platform.twitter.com/embed/Tweet.html?id='+m[1]+'&dnt=true',px:560,name:'X'};
  if(l.t==='tiktok'&&(m=u.match(/tiktok\.com\/.*\/video\/(\d+)/)))return {src:'https://www.tiktok.com/embed/v2/'+m[1],px:740,name:'TikTok'};
  if(l.t==='twitch'&&(m=u.match(/twitch\.tv\/([\w]+)\/?$/)))return {src:'https://player.twitch.tv/?channel='+m[1]+'&parent='+host+'&autoplay=false',h:'56.25%',name:'Twitch'};
  if((l.t==='music'||l.t==='podcast')&&(m=u.match(/open\.spotify\.com\/(?:intl-\w+\/)?(track|album|playlist|episode|show|artist)\/(\w+)/)))return {src:'https://open.spotify.com/embed/'+m[1]+'/'+m[2],px:(m[1]==='track'||m[1]==='episode')?152:352,name:'Spotify'};
  if(l.t==='music'&&/^https:\/\/music\.apple\.com\//.test(u))return {src:u.replace('https://music.apple.com/','https://embed.music.apple.com/'),px:/[?&]i=/.test(u)?175:450,name:'Apple Music'};
  if(l.t==='podcast'&&/^https:\/\/podcasts\.apple\.com\//.test(u))return {src:u.replace('https://podcasts.apple.com/','https://embed.podcasts.apple.com/'),px:/[?&]i=/.test(u)?175:450,name:'Apple Podcasts'};
  if(l.t==='booking'&&/^https:\/\/calendly\.com\//.test(u))return {src:u+(u.indexOf('?')>-1?'&':'?')+'embed_type=Inline&hide_gdpr_banner=1&embed_domain='+host,px:700,name:'Calendly'};
  return null}
function vcf(l){var name=((document.querySelector('h1')||{}).textContent||'').trim(),em=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l.url||'')?l.url:'';
  var t=['BEGIN:VCARD','VERSION:3.0','FN:'+name.replace(/[\r\n;,]/g,' '),'URL:'+location.origin+location.pathname].concat(em?['EMAIL:'+em]:[]).concat(['END:VCARD']).join('\r\n');
  var a=el('a','pf5-btn pf5-btn-line',l.label||'Save my contact');a.href=URL.createObjectURL(new Blob([t],{type:'text/vcard'}));a.download=(name||'contact').replace(/[^\w]+/g,'-')+'.vcf';return a}
function run(){
  var root=document.querySelector('[data-pf5="root"]');if(!root||document.querySelector('.tll-lsp'))return;
  var P;try{P=JSON.parse(root.getAttribute('data-partners')||'null')}catch(e){P=null}
  var S=P&&Array.isArray(P.stack)?P.stack.slice(0,12):[];if(!S.length)return;
  var st=el('style');st.textContent=CSS;document.head.appendChild(st);
  var w=el('div','tll-lsp');w.appendChild(el('p','tll-lsp-h','MORE LINKS'));var btns=el('div','tll-lsp-btns'),cards=el('div','tll-lsp');cards.style.margin='0';
  S.forEach(function(l){if(!l||!l.t)return;
    if(l.t==='contact'){btns.appendChild(vcf(l));return}
    var u=safe(l.url);if(!u)return;var em=embed(l);
    if(em){var c=el('button','tll-lsp-card');c.type='button';c.appendChild(el('b',null,'▶'));var tx=el('div',null,l.label||em.name);tx.appendChild(el('span',null,em.name+' · tap to load'));c.appendChild(tx);
      c.onclick=function(){var f=el('iframe','tll-lsp-frame');f.src=em.src;f.title=(l.label||em.name);f.loading='lazy';f.allow='autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write';f.setAttribute('allowfullscreen','');
        if(em.h){var bx=el('div');bx.style.cssText='position:relative;width:100%;padding-top:'+em.h;f.style.cssText='position:absolute;inset:0;height:100%';bx.appendChild(f);c.replaceWith(bx)}else{f.style.height=em.px+'px';c.replaceWith(f)}};
      cards.appendChild(c);return}
    var a=el('a','pf5-btn pf5-btn-line',l.label||WORD[l.t]||'Link');a.href=u;a.target='_blank';a.rel=TAG[l.t]?'sponsored noopener':'noopener';
    if(TAG[l.t]){var tg=el('span','pf5-tag',TAG[l.t]);a.appendChild(tg)}
    if(l.t==='pdf'){var p=el('span','pf5-tag','PDF');a.appendChild(p)}
    var s=el('span',null,'↗');s.setAttribute('aria-hidden','true');a.appendChild(s);btns.appendChild(a)});
  if(btns.childNodes.length)w.appendChild(btns);if(cards.childNodes.length)w.appendChild(cards);
  var B=document.querySelector('[data-pf5="buttons"]');if(B)B.insertAdjacentElement('afterend',w);else root.appendChild(w);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,50)});else setTimeout(run,50);
setTimeout(run,1500);
})();
