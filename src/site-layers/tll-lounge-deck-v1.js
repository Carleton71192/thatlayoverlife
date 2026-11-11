/* tll-lounge-deck-v1 (11 Nov 2026, Nancy: the Layover Lounge as a swipeable postcard deck; "Approve as written, build group 1
   behind the preview"; handoff/CHANGE-LOG-LOUNGE-POSTCARDS-2026-11-11.md, L1 to L9). /gallery only, and only with ?preview=lounge
   (the deck in place of the grid) or ?preview=lounge-above (the deck above the grid). Reads the tiles the page already has
   ([data-tll-loc] with data-tll-img and data-tll-credit) and builds a stack of postcards from them: the top card and two beneath,
   drag or swipe past 140 px (or a quick flick) sends the top card away, less springs back. Previous and Next buttons, a counter,
   the arrow keys, "See all as a grid" and "Back to the deck". The continent chips filter the deck. Every word on a card comes from
   its tile. With reduced motion: no throw, no spring, no tilt. The page, its script (TLL Lounge v2) and the grid are not changed;
   the grid is only hidden while the deck stands in for it. No data-ms-* element touched. */
(function(){
if(!/^\/gallery\/?$/.test(location.pathname))return;
var Q=/[?&]preview=lounge(-above)?(?:[&#]|$)/.exec(location.search);if(!Q)return;
if(window.__tllLoungeDeck)return;window.__tllLoungeDeck=1;
var ABOVE=!!Q[1],FAR=140,SHARE='/share-photos';
var PLEX="font-family:'IBM Plex Sans Condensed',system-ui,sans-serif!important;",MONO="font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace!important;";
var P='html body .tll-deck ';
var CSS=
"html body .tll-deck{box-sizing:border-box;margin:0 0 30px;padding:14px 0 6px;overflow:hidden;text-align:center;color:#0A0B14}"+
"@supports (overflow:clip){html body .tll-deck{overflow-x:clip;overflow-y:visible}}"+
"html body .tll-deck[hidden],html body .tll-deck-backbar[hidden],html body .tll-deck-grid-off{display:none!important}"+
P+".tll-deck-stage{position:relative;width:100%;max-width:420px;aspect-ratio:4/5;margin:0 auto 34px}"+
P+".tll-deck-card{position:absolute;left:0;top:0;width:100%;height:100%;box-sizing:border-box;margin:0;padding:10px;background:#FFFFFF;border-radius:3px;"+
  "box-shadow:0 1px 2px rgba(10,11,20,.2),0 16px 28px -14px rgba(10,11,20,.5);transition:transform .34s cubic-bezier(.2,.8,.2,1),opacity .3s ease;"+
  "touch-action:pan-y;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;cursor:grab}"+
P+".tll-deck-card.is-drag{transition:none;cursor:grabbing}"+
P+".tll-deck-card.is-spring{transition:transform .44s cubic-bezier(.3,1.5,.5,1)}"+
P+".tll-deck-card.is-end{cursor:default}"+
"html body .tll-deck.tll-deck--still .tll-deck-card{transition:none!important}"+
"@media (prefers-reduced-motion:reduce){html body .tll-deck .tll-deck-card{transition:none!important}}"+
P+".tll-deck-card:focus-visible{outline:2px solid #C8325B!important;outline-offset:4px!important}"+
P+".tll-deck-face{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;overflow:hidden;background:#F7F1E8;border-radius:1px}"+
P+".tll-deck-photo{position:absolute;left:0;top:0;display:block;width:100%;height:100%;max-width:none;object-fit:cover;border-radius:0!important;pointer-events:none;-webkit-user-drag:none}"+
P+".tll-deck-credit{position:absolute;left:10px;bottom:10px;max-width:calc(100% - 20px);box-sizing:border-box;margin:0;padding:4px 7px;"+MONO+
  "font-weight:600;font-size:10px;line-height:1.3;letter-spacing:.08em;text-transform:uppercase;text-align:left;overflow-wrap:anywhere;background:rgba(10,11,20,.62);color:#F7F1E8;border-radius:2px}"+
P+"a.tll-deck-open{"+MONO+"font-weight:600;font-size:12px!important;line-height:1.4;letter-spacing:.08em;text-transform:uppercase;color:#0A0B14!important;"+
  "text-decoration:underline!important;text-decoration-color:#C8325B!important;text-decoration-thickness:2px!important;text-underline-offset:4px!important;padding:14px 10px}"+
P+".tll-deck-end-line{margin:0 14px 22px;font-family:'Playfair Display',Georgia,serif!important;font-weight:800;font-size:30px;line-height:1.15;letter-spacing:0;color:#0A0B14}"+
P+".tll-deck-end-row{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;padding:0 10px}"+
P+".tll-deck-bar{display:flex;align-items:center;justify-content:center;gap:14px;margin:0 auto 6px}"+
P+".tll-deck-btn{display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;min-height:48px;min-width:48px;margin:0;padding:0 22px;"+PLEX+
  "font-weight:600!important;font-size:16px!important;line-height:1.1!important;letter-spacing:0!important;text-transform:none!important;text-decoration:none!important;white-space:nowrap;"+
  "border:1.5px solid #0A0B14!important;border-radius:0!important;background:transparent!important;color:#0A0B14!important;box-shadow:none!important;cursor:pointer;-webkit-appearance:none;appearance:none;touch-action:manipulation}"+
P+".tll-deck-btn:hover{background:rgba(10,11,20,.1)!important}"+
P+".tll-deck-btn[disabled]{opacity:.35;cursor:default;background:transparent!important}"+
P+".tll-deck-btn.tll-deck-btn-rose{background:#D63859!important;border-color:#D63859!important;color:#FFFFFF!important}"+
P+".tll-deck-btn.tll-deck-btn-rose:hover{background:#C8325B!important;border-color:#C8325B!important}"+
P+".tll-deck-count{min-width:76px;"+MONO+"font-weight:600;font-size:12px;line-height:1.3;letter-spacing:.06em;color:#0A0B14;white-space:nowrap}"+
P+".tll-deck-links{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:4px 22px}"+
"html body .tll-deck .tll-deck-link,html body .tll-deck-backbar .tll-deck-link{display:inline-flex;align-items:center;min-height:44px;margin:0;padding:0 4px;border:0!important;background:none!important;border-radius:0!important;"+PLEX+
  "font-weight:600!important;font-size:16px!important;line-height:1.2!important;letter-spacing:0!important;text-transform:none!important;color:#0A0B14!important;cursor:pointer;-webkit-appearance:none;appearance:none;"+
  "text-decoration:underline!important;text-decoration-color:#C8325B!important;text-decoration-thickness:2px!important;text-underline-offset:4px!important;touch-action:manipulation}"+
"html body .tll-deck .tll-deck-link:hover,html body .tll-deck-backbar .tll-deck-link:hover{color:#C8325B!important}"+
P+"a.tll-deck-add{display:inline-flex;align-items:center;min-height:44px;padding:0 4px;"+MONO+"font-weight:600;font-size:11px!important;letter-spacing:1px;color:#C8325B!important;text-decoration:none!important}"+
P+"a.tll-deck-add:hover{text-decoration:underline!important}"+
P+".tll-deck-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0}"+
"html body .tll-deck-backbar{margin:0 0 14px;text-align:center}"+
"@media (max-width:479px){html body .tll-deck .tll-deck-wide{display:none}html body .tll-deck .tll-deck-btn{padding:0 18px}html body .tll-deck .tll-deck-end-line{font-size:26px}}";

var TILT=[2.5,-3,3.5,-2,4,-2.5];
var MQ=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null,STILL=!!(MQ&&MQ.matches);
var grid,root,stage,bar,prevB,nextB,count,live,gridB,backbar,backB;
var items=[],list=[],idx=0,filter='all',cards={},side={},drag=null,swallow=false,moved=false;

function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;}
function btn(cls,act,text){var b=el('button',cls,text);b.type='button';b.setAttribute('data-deck',act);return b;}
function bgUrl(t){var m=/url\((['"]?)(.*?)\1\)/.exec(t.style.backgroundImage||'');return m?m[2]:'';}
/* "NC · DECEPTION ISLAND" to who NC and place DECEPTION ISLAND; the spoken place reads Deception Island (words of four letters or more). */
function nice(s){return String(s).replace(/[^\s,]+/g,function(w){return w.length>3&&w===w.toUpperCase()?w.charAt(0)+w.slice(1).toLowerCase():w;});}
function collect(){
  items=[].map.call(grid.querySelectorAll('[data-tll-loc]'),function(t){
    var member=t.hasAttribute('data-tll-member-photo'),sp=t.querySelector('.tll-lounge-credit');
    /* A member tile (tll-lounge-members-v1) is a copy of the first tile, so its data attributes are that tile's: its own photo is its
       background and its own credit is its label. */
    var img=member?bgUrl(t):t.getAttribute('data-tll-img')||'',loc=t.getAttribute('data-tll-loc')||'';
    var credit=(member?(sp?sp.textContent:''):t.getAttribute('data-tll-credit'))||(sp?sp.textContent:'')||loc.toUpperCase();
    var i=credit.indexOf(' · '),who=i<0?'':credit.slice(0,i),place=i<0?credit:credit.slice(i+3);
    var it={tile:t,img:img,loc:loc,member:member,credit:credit,place:nice(place)};
    if(!img){it.credit='OPEN SLOT · '+loc.toUpperCase();it.place=it.credit;it.label=it.credit;}
    else it.label=member&&t.getAttribute('aria-label')?t.getAttribute('aria-label'):it.place+(who?', photo by '+who:'');
    return it;});
}
/* Member photos carry no continent of their own yet, so they show under All only (L11). */
function pick(){list=items.filter(function(it){return filter==='all'||(!it.member&&it.loc===filter);});}

function make(i){
  var c=el('div','tll-deck-card'),face=el('div','tll-deck-face');c.appendChild(face);c.setAttribute('data-i',i);
  if(i>=list.length){
    c.className+=' is-end';c.setAttribute('role','group');var line='That is all '+list.length+'.';c.setAttribute('aria-label',line);
    face.appendChild(el('p','tll-deck-end-line',line));
    var row=el('div','tll-deck-end-row');row.appendChild(btn('tll-deck-btn','restart','Start again'));
    var a=el('a','tll-deck-btn tll-deck-btn-rose','Add yours');a.href=SHARE;row.appendChild(a);face.appendChild(row);return c;}
  var it=list[i];
  if(!it.img){c.setAttribute('role','group');c.setAttribute('aria-label',it.label);var o=el('a','tll-deck-open',it.credit);o.href=SHARE;face.appendChild(o);return c;}
  c.setAttribute('role','img');c.setAttribute('aria-label',it.label);
  var im=el('img','tll-deck-photo');im.alt='';im.decoding='async';im.draggable=false;im.src=it.img;face.appendChild(im);
  face.appendChild(el('span','tll-deck-credit',it.credit));return c;
}
function at(i,pos){
  if(!pos)return 'translate(0px,0px) rotate(0deg)';
  if(STILL)return 'translate(0px,'+(pos*9)+'px) rotate(0deg)';
  var t=TILT[i%TILT.length],sx=t>0?1:-1;return 'translate('+(sx*(pos===1?6:-5))+'px,'+(pos*11)+'px) rotate('+t+'deg)';
}
function away(sign){var w=stage.offsetWidth||360;return 'translate('+(sign*w*1.25)+'px,-18px) rotate('+(sign*16)+'deg)';}
function drop(c){if(c&&c.parentNode)c.parentNode.removeChild(c);}
function layout(){
  var i,k,c,pos;
  for(k in cards){i=+k;if(i<idx||i>idx+2||i>list.length){drop(cards[k]);delete cards[k];}}
  for(i=idx;i<=Math.min(idx+2,list.length);i++){
    c=cards[i];pos=i-idx;
    if(!c){c=cards[i]=make(i);c.style.transform=at(i,Math.min(pos+1,2));c.style.opacity=pos?'0':'1';stage.appendChild(c);void c.offsetWidth;}
    c.classList.remove('is-drag');c.style.zIndex=String(10-pos);c.style.opacity='1';c.style.transform=at(i,pos);c.style.pointerEvents=pos?'none':'';
    if(pos){c.setAttribute('aria-hidden','true');c.setAttribute('inert','');c.removeAttribute('tabindex');}
    else{c.removeAttribute('aria-hidden');c.removeAttribute('inert');if(c.getAttribute('role')==='img')c.setAttribute('tabindex','0');}
  }
}
function say(){
  var n=list.length;
  if(idx>=n){count.textContent='';return 'That is all '+n+'.';}
  count.textContent=(idx+1)+' of '+n;return 'Photo '+(idx+1)+' of '+n+', '+list[idx].place;
}
function update(announce,focusCard){
  var text=say(),a=document.activeElement;
  prevB.disabled=idx<=0;nextB.disabled=idx>=list.length;
  if(announce)live.textContent=text;
  /* Focus follows the deck: a card that had focus hands it to the new top card; a button that has just been switched off hands it on. */
  if(focusCard||(a===nextB&&nextB.disabled)){var top=cards[idx],t=top&&(top.getAttribute('tabindex')==='0'?top:top.querySelector('button,a'));if(t)t.focus({preventScroll:true});}
  else if(a===prevB&&prevB.disabled)nextB.focus({preventScroll:true});
}
/* d: +1 the top card leaves (sign: the side it leaves by), -1 the last card to leave comes back from that side. */
function go(d,sign){
  var n=idx+d;if(n<0||n>list.length)return;
  moved=true;
  var a=document.activeElement,onCard=!!(a&&stage.contains(a)),c;
  if(d>0){
    c=cards[idx];delete cards[idx];side[idx]=sign||-1;
    if(c){c.classList.remove('is-drag','is-spring');c.setAttribute('aria-hidden','true');c.setAttribute('inert','');c.removeAttribute('tabindex');c.style.pointerEvents='none';
      if(STILL)drop(c);else{c.style.zIndex='20';c.style.transform=away(side[idx]);c.style.opacity='0';setTimeout(function(){drop(c);},360);}}
    idx=n;
  }else{
    idx=n;
    if(!cards[idx]&&!STILL){c=cards[idx]=make(idx);c.style.transform=away(side[idx]||-1);c.style.opacity='0';c.style.zIndex='20';stage.appendChild(c);void c.offsetWidth;}
  }
  layout();update(true,onCard);
}
function rebuild(keep){
  var cur=keep&&list[idx]?list[idx].tile:null,k;
  pick();idx=0;side={};
  if(cur)for(k=0;k<list.length;k++)if(list[k].tile===cur){idx=k;break;}
  for(k in cards){drop(cards[k]);delete cards[k];}
  layout();
}
/* The deck clips what leaves it, so a card thrown off never widens the page. Its box is stretched to the screen edges (up to 48 px a side). */
function fit(){
  root.style.marginLeft=root.style.marginRight=root.style.paddingLeft=root.style.paddingRight='';
  var r=root.getBoundingClientRect(),w=document.documentElement.clientWidth,l=Math.max(0,Math.min(48,r.left)),rt=Math.max(0,Math.min(48,w-r.right));
  root.style.marginLeft=-l+'px';root.style.paddingLeft=l+'px';root.style.marginRight=-rt+'px';root.style.paddingRight=rt+'px';
}
function order(){
  var p=grid.parentNode;if(!p)return;
  if(backbar){if(backbar.nextElementSibling!==grid)p.insertBefore(backbar,grid);if(root.nextElementSibling!==backbar)p.insertBefore(root,backbar);}
  else if(root.nextElementSibling!==grid)p.insertBefore(root,grid);
}
function showGrid(on){
  root.hidden=on;backbar.hidden=!on;grid.classList.toggle('tll-deck-grid-off',!on);
  if(on)backB.focus({preventScroll:true});else{fit();gridB.focus({preventScroll:true});}
}

function build(){
  var st=el('style');st.id='tll-lounge-deck-v1';st.textContent=CSS;(document.head||document.documentElement).appendChild(st);
  root=el('section','tll-deck'+(STILL?' tll-deck--still':''));root.setAttribute('data-tll-deck',ABOVE?'above':'replace');root.setAttribute('aria-label','Lounge photos');
  stage=el('div','tll-deck-stage');root.appendChild(stage);
  bar=el('div','tll-deck-bar');
  prevB=btn('tll-deck-btn','prev','Previous');prevB.appendChild(el('span','tll-deck-wide','\u00a0photo'));prevB.setAttribute('aria-label','Previous photo');
  nextB=btn('tll-deck-btn','next','Next');nextB.appendChild(el('span','tll-deck-wide','\u00a0photo'));nextB.setAttribute('aria-label','Next photo');
  count=el('span','tll-deck-count');bar.appendChild(prevB);bar.appendChild(count);bar.appendChild(nextB);root.appendChild(bar);
  var links=el('div','tll-deck-links');
  if(!ABOVE){gridB=btn('tll-deck-link','grid','See all as a grid');links.appendChild(gridB);}
  var add=el('a','tll-deck-add','+ ADD YOURS');add.href=SHARE;links.appendChild(add);root.appendChild(links);
  live=el('p','tll-deck-sr');live.setAttribute('aria-live','polite');live.setAttribute('aria-atomic','true');root.appendChild(live);
  if(!ABOVE){backbar=el('div','tll-deck-backbar');backbar.hidden=true;backB=btn('tll-deck-link','deck','Back to the deck');backbar.appendChild(backB);grid.classList.add('tll-deck-grid-off');}
  order();collect();pick();fit();layout();update(false);

  root.addEventListener('click',function(e){
    if(swallow){swallow=false;e.preventDefault();e.stopPropagation();return;}
    var b=e.target.closest('[data-deck]');if(!b||b.disabled)return;var act=b.getAttribute('data-deck');
    if(act==='next')go(1,-1);else if(act==='prev')go(-1);
    else if(act==='restart'){idx=0;side={};for(var k in cards){drop(cards[k]);delete cards[k];}layout();update(true,true);}
    else if(act==='grid')showGrid(true);
  },true);
  if(backB)backB.addEventListener('click',function(){showGrid(false);});
  root.addEventListener('keydown',function(e){
    if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return;
    if(e.key==='ArrowRight'){e.preventDefault();go(1,-1);}else if(e.key==='ArrowLeft'){e.preventDefault();go(-1);}
  });
  /* The page's own chip handler has already filtered the grid by the time this runs (it listens on the chip row, this on the document). */
  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('[data-tll-lounge-chips] button[data-val]'):null;if(!b)return;
    filter=b.getAttribute('data-val')||'all';rebuild(false);update(true);
  });
  stage.addEventListener('dragstart',function(e){e.preventDefault();});
  stage.addEventListener('pointerdown',function(e){
    if(e.pointerType==='mouse'&&e.button!==0)return;
    var c=cards[idx];if(!c||idx>=list.length||!c.contains(e.target)||e.target.closest('a,button'))return;
    swallow=false;drag={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,on:false,el:c,trail:[[e.timeStamp,e.clientX]]};
  });
  window.addEventListener('pointermove',function(e){
    if(!drag||e.pointerId!==drag.id)return;var dx=e.clientX-drag.x,dy=e.clientY-drag.y;
    if(!drag.on){if(Math.abs(dx)<8&&Math.abs(dy)<8)return;if(Math.abs(dx)<=Math.abs(dy)){drag=null;return;}
      drag.on=true;try{drag.el.setPointerCapture(drag.id);}catch(x){}drag.el.classList.remove('is-spring');drag.el.classList.add('is-drag');}
    drag.dx=dx;drag.trail.push([e.timeStamp,e.clientX]);if(drag.trail.length>6)drag.trail.shift();
    if(!STILL)drag.el.style.transform='translate('+dx+'px,'+(dy*0.25)+'px) rotate('+(dx/18)+'deg)';
  });
  function end(e){
    if(!drag||e.pointerId!==drag.id)return;var d=drag;drag=null;if(!d.on)return;
    try{d.el.releasePointerCapture(d.id);}catch(x){}
    d.el.classList.remove('is-drag');
    var a=d.trail[0],z=d.trail[d.trail.length-1],dt=z[0]-a[0],v=dt>0&&e.timeStamp-z[0]<120?(z[1]-a[1])/dt:0;
    var far=Math.abs(d.dx)>=FAR,flick=Math.abs(v)>0.65&&Math.abs(d.dx)>=48&&(v>0)===(d.dx>0);
    if(e.type==='pointerup'&&(far||flick)&&cards[idx]===d.el){swallow=e.pointerType==='mouse';go(1,d.dx>0?1:-1);if(swallow)setTimeout(function(){swallow=false;},60);return;}
    if(!STILL){d.el.classList.add('is-spring');setTimeout(function(){d.el.classList.remove('is-spring');},460);}
    d.el.style.transform=at(idx,0);
    if(Math.abs(d.dx)>8&&e.pointerType==='mouse'){swallow=true;setTimeout(function(){swallow=false;},60);}
  }
  window.addEventListener('pointerup',end);window.addEventListener('pointercancel',end);
  window.addEventListener('resize',function(){if(!root.hidden)fit();});
  if(MQ){var onMq=function(ev){STILL=!!ev.matches;root.classList.toggle('tll-deck--still',STILL);layout();};if(MQ.addEventListener)MQ.addEventListener('change',onMq);else if(MQ.addListener)MQ.addListener(onMq);}
  if(window.MutationObserver){
    /* Tiles added later (member photos) join the deck: at the front while the visitor has not moved a card yet, otherwise around the
       card they are on. The chip row, when the page script adds it after this, goes back above the deck. */
    new MutationObserver(function(muts){
      for(var i=0;i<muts.length;i++)for(var j=0;j<muts[i].addedNodes.length;j++){var n=muts[i].addedNodes[j];
        if(n.nodeType===1&&n.hasAttribute('data-tll-loc')){collect();rebuild(moved);update(false);return;}}
    }).observe(grid,{childList:true});
    new MutationObserver(order).observe(grid.parentNode,{childList:true});
  }
}
function start(){
  var tries=0;
  (function wait(){
    var t=document.querySelector('[data-tll-loc]');
    if(t&&(document.querySelector('[data-tll-lounge-chips]')||tries>=20)){grid=t.parentElement;build();return;}
    if(++tries<=40)setTimeout(wait,50);
  })();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
