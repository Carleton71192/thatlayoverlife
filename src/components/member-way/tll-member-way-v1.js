/* tll-member-way-v1 (23 Oct 2026). Nancy, 23 Oct: "It wasn't intuitive for Jay to find how to edit his site." Then: "Go and publish".
   1. Your own profile page (/contributors/<you>): a bar across the top, THIS IS YOUR PAGE, with Edit your profile (rose) and Edit your map.
   2. /account, /edit-profile, /the-map, /my-pets: the member bar (Overview, Profile, Map, Pets, Stories, Settings), the current page underlined.
      Same links and look as src/components/member-bar/tll-member-bar-v1.html, inserted by script so no Designer element is needed.
   3. /account: the Edit profile button in the hero becomes the rose primary button.
   Signed-in members only, read once with getCurrentMember. Writes nothing. Touches no data-ms-* element. */
(function(){
  if(window.__tllMemberWay) return; window.__tllMemberWay=1;
  var D=document, P=(location.pathname.replace(/\/+$/,'')||'/').toLowerCase();
  var BAR={'/account':1,'/edit-profile':1,'/the-map':1,'/my-pets':1};
  var isProfile=/^\/contributors\/[^\/]+$/.test(P);
  if(!isProfile&&!BAR[P]) return;

  var s=D.createElement('style'); s.id='tll-member-way-css';
  s.textContent=
    '.tmw-own{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;background:#0A0B14;color:#F7F1E8;padding:12px max(16px,4vw)}'+
    '.tmw-own .tmw-k{margin-right:auto;font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:2px;color:#00C9C8}'+
    '.tmw-own a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 18px;font:600 15px/1.2 "IBM Plex Sans Condensed","IBM Plex Sans",system-ui,sans-serif;text-decoration:none}'+
    '.tmw-own .tmw-btn{background:#D63859;color:#fff}'+
    '.tmw-own .tmw-line{border:1.5px solid #F7F1E8;color:#F7F1E8}'+
    '.tmw-own a:focus-visible{outline:3px solid #00C9C8;outline-offset:2px}'+
    '@media (max-width:480px){.tmw-own .tmw-k{width:100%}.tmw-own a{flex:1 1 0}}'+
    '.tmw-bar{background:#F7F1E8;border-bottom:1px solid #E0DACE}'+
    '.tmw-bar nav{display:flex;gap:0 22px;overflow-x:auto;max-width:1280px;margin:0 auto;padding:0 max(16px,4vw);scrollbar-width:none;font:400 12px/1 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px}'+
    '.tmw-bar nav::-webkit-scrollbar{display:none}'+
    '.tmw-bar a{flex:none;display:inline-flex;align-items:center;min-height:48px;margin-bottom:-1px;border-bottom:3px solid transparent;color:#5E5A54;text-decoration:none}'+
    '.tmw-bar a[aria-current="page"]{color:#0A0B14;border-bottom-color:#F0507A}'+
    '.tmw-bar a:focus-visible{outline:3px solid #0A0B14;outline-offset:-3px}'+
    '.a3-btn-edit{background:#D63859 !important;color:#fff !important;border-color:#D63859 !important}'+
    /* the page's own member bar on phones: one line that scrolls sideways, off the screen edge */
    '@media (max-width:767px){.tll-mbar{flex-wrap:nowrap !important;overflow-x:auto;scrollbar-width:none;padding:0 16px;margin-bottom:16px !important}.tll-mbar::-webkit-scrollbar{display:none}.tll-mbar a{flex:none}}';
  D.head.appendChild(s);

  function el(tag,attrs,txt){ var e=D.createElement(tag); for(var k in attrs) e.setAttribute(k,attrs[k]); if(txt!=null) e.textContent=txt; return e; }
  function main(){ return D.querySelector('main')||D.body; }
  /* 26 Oct 2026 (Nancy: "There is a double menu in the profile section"): never above the site header. Pages without a
     <main> (/account, /edit-profile) got the bar as the first thing in <body>. Now it goes right after the header. */
  function navTop(root){ var n=D.querySelector('.tll-nav-v1,.tll-nav-inner,body > nav,header'); if(!n||!root.contains(n)) return null;
    while(n.parentNode&&n.parentNode!==root) n=n.parentNode; return n.parentNode===root?n:null; }
  function first(parent,node){ var t=navTop(parent); parent.insertBefore(node,t?t.nextSibling:parent.firstChild); }

  function ownerBar(m){
    var root=D.querySelector('[data-pf5="root"]'); if(!root||D.getElementById('tmw-own')) return;
    var id=root.getAttribute('data-member'); if(!id||id!==m.id) return;
    var bar=el('div',{id:'tmw-own','class':'tmw-own',role:'region','aria-label':'Your page'});
    bar.appendChild(el('span',{'class':'tmw-k'},'THIS IS YOUR PAGE'));
    bar.appendChild(el('a',{'class':'tmw-btn',href:'/edit-profile'},'Edit your profile'));
    bar.appendChild(el('a',{'class':'tmw-line',href:'/the-map#edit'},'Edit your map'));
    first(main(),bar);
  }

  function memberBar(){
    if(D.getElementById('tmw-bar')) return;
    /* The page already carries its own member bar (Edit profile 3.4 embed, data-tll-member-bar): stand aside. */
    if(D.querySelector('[data-tll-member-bar],.tll-mbar')) return;
    var wrap=el('div',{id:'tmw-bar','class':'tmw-bar'}), nav=el('nav',{'aria-label':'Your TLL'});
    [['/account','OVERVIEW'],['/edit-profile','PROFILE'],['/the-map','MAP'],['/my-pets','PETS'],['/account#stories','STORIES'],['/account#settings','SETTINGS']].forEach(function(l){
      var a=el('a',{href:l[0]},l[1]); if(l[0]===P) a.setAttribute('aria-current','page'); nav.appendChild(a);
    });
    wrap.appendChild(nav);
    var m=main(), members=m.querySelector('[data-ms-content="members"]');
    /* Before the members block, never inside it: /account turns that block into a grid. */
    if(members&&members.parentNode===m) m.insertBefore(wrap,members); else first(m,wrap);
  }

  function member(cb){
    var k=0, iv=setInterval(function(){
      var ms=window.$memberstackDom; if(!ms||typeof ms.getCurrentMember!=='function'){ if(++k>60) clearInterval(iv); return; }
      clearInterval(iv);
      ms.getCurrentMember().then(function(r){ if(r&&r.data) cb(r.data); }).catch(function(){});
    },150);
  }
  function go(){ member(function(m){ if(isProfile) ownerBar(m); else memberBar(); }); }
  if(D.readyState==='loading') D.addEventListener('DOMContentLoaded',go); else go();
})();
