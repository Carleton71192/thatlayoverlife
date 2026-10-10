/* TLL map ids v1 (10 Oct 2026, Nancy: fix the map for all three). The world-atlas 110m file has no numeric id for Kosovo,
   N. Cyprus or Somaliland, so the map saved all three under one key, "undefined". This gives them stable codes from the
   ISO 3166 user-assigned range (900 Kosovo, 901 Northern Cyprus, 902 Somaliland) the moment the map draws them, and moves a
   saved "undefined" entry to 900 (Kosovo, the only one of the three logged so far) whenever the map saves. Map page only. */
(function(){
var FIX={'Kosovo':'900','N. Cyprus':'901','Somaliland':'902'};
function fx(s){if(!s||!s.states||!s.states.undefined)return s;var u=s.states.undefined,t=s.states['900']||{};for(var k in u)if(!t[k])t[k]=u[k];s.states['900']=t;delete s.states.undefined;return s;}
try{var LS=window.localStorage,set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(this===LS&&k==='tllStates'&&typeof v==='string'&&v.indexOf('"undefined"')>-1){try{v=JSON.stringify(fx(JSON.parse(v)));}catch(e){}}return set.call(this,k,v);};
var cur=LS.getItem('tllStates');if(cur&&cur.indexOf('"undefined"')>-1)LS.setItem('tllStates',cur);}catch(e){}
function wrap(n){var f=window[n];if(typeof f!=='function'||f.__fx)return;var g=function(s){return f.call(this,fx(s));};g.__fx=1;window[n]=g;}
var w=0,iv=setInterval(function(){wrap('__tllPush');wrap('__tllMapApply');if(++w>300)clearInterval(iv);},50);
function patch(){[].forEach.call(document.querySelectorAll('svg path'),function(p){var d=p.__data__;if(d&&d.properties&&d.id==null&&FIX[d.properties.name])d.id=FIX[d.properties.name];});}
patch();if(window.MutationObserver)new MutationObserver(patch).observe(document.documentElement,{childList:true,subtree:true});
})();
