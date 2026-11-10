/* tll-img-variants-v1 (10 Nov 2026, week one item 4: images). Before this, no photo on the home page, /stories, a story page or
   /the-paw-passport carried a srcset, so a phone downloaded every photo at full size (home 9.7 MB, /stories 31 MB, a story 13.4 MB).
   Webflow's CDN ignores ?width; its sizes exist only as pre-built variants, {siteId}_{name}-p-{500|800|1080|1600|2000}.jpg, and only in the
   site bucket (69d6145c...). CMS photos live in the CMS bucket (6a0b29c6...) with no variants, but almost every one has a twin in the site
   bucket: .../6a0b29c6.../{cmsId}_{siteId}_{name}.jpeg is .../69d6145c.../{siteId}_{name}-p-{w}.jpg (%2520 in the name reads %20).
   What it does, from the head (core), for every img whose src is such a CMS URL (and for site-bucket photos listed in the table):
     srcset  the twin's variants that exist (the table below, written by build-img-variants-table-v1.py; a file not listed is taken to
             have all five), plus the original as the top candidate when the variants stop below the photo's own width.
     sizes   by the image's class or container, read off the live pages from 360 to 1920 px wide (100vw for any other photo, so
             an unknown box never gets a file smaller than the screen). Written once, before the browser picks, and changed only when a
             script moves a lazy photo into another container: changing sizes on a photo already being fetched downloads it twice.
             Not sizes=auto: Chrome sized a lazy image it picked for while the image had no box (the home rail's hidden cards) as
             100vw, a full-screen file for a 40px face; and not a measured width, for the same reason (tried on 10 Nov, both doubled
             requests on /stories).
     src     kept as it is, the fallback for browsers without srcset and for the error case.
     error   when a variant fails (a 403 for a width Webflow did not build), the srcset is dropped and the original loads once.
   When: a MutationObserver from the head sees each img as the parser adds it, before a lazy image is fetched, plus a pass at
   DOMContentLoaded for any it missed. Eager images the parser has already asked for are left alone (the preload scanner fetched their src, and a srcset
   now would download the photo twice); layers that create or swap a photo (cover, home bands, page heroes) call window.__tllImgV with
   the new URL before they set src, so their photo is fetched once.
   The story hero (.tll-story-hero-img, the largest paint on a story page) is lazy in the template; here it becomes eager with high
   fetch priority. Alt text, width, height and classes are never changed. Images inside any data-ms-* element are never touched.
   Files with no twin variants stay on their originals (as of 10 Nov: chesney-lish-spain-hero, chesney-lish-avatar, barzy-adam-avatar,
   and the two CMS files without a twin name, 17932678182301 and uwjpidtfgp3gwxuzeefz). No external host is added. */
(function(){
if(window.__tllImgV)return;
var H='https://cdn.prod.website-files.com/',SITE='69d6145cf421c777840c1e25',W=[500,800,1080,1600,2000];
/* The last six hex digits of each twin's id, grouped by how many variants it has (0 to 4); every other twin has all five. */
/*TABLE*/var T={0:'18c14062300e62a66787095ebc8683f600baf8ce14',1:'0198b807e83f0c8dd90f01e11f64a0215a0023764124db7831a08633818334db0335690b36c0283d2d9d3fe51e3fe8db41f7da458a1245ac464beadf4c9b234c9bc750ff3653a18a551c3e5acf487c2d597d6e087d9a6e7fce8b817a158c5ca58c5d708e866a9d88b8a66e82b0e948bfc72bceaf18e2bd06e3bee3e51d60e6d68ee72224f24e74f43f38f7718af857c1f9ccc7fa1e85',2:'001dfb037114052c2107a2720d359f0f0b2e1009c1102dcc1035d8135b1e136ef516046c17e95c1f21571f645420f5382159b421f42923012023013534260034c391354df235675e37d85c37f5f9382d3f382e6239312e3b7ca93f928843115a4418ed4d9cf04fafba4fafea50c10c50c128530fa2530fc0531fc154acbf54ad1655b1ed55b42c55b651581e515857b55fb4b864b8bf6602d968e9786b3b446bae946baed46c6e6c72e7b17d58a185671586d0c688b2da8fe65a91904894866e95ae7796014598c2f79d9ce09e45a39e76a9a1162fa678baa9b77eab99f2ab9a8bafccc6afcdaab844e4c6953ccbe17ecc283dcca402cfdba9cfdbbecfdbd3d13568d1ba6ad524ccd57c2ad91a6bda1ab4de66e5de71f2e290f9e6e704e6e801e6f062f12d34f24e2df303c3f339e6f33c27f74124f814caf814dff8335af833ddf89cdef9627bfb4bfbfc5a45fe713dff3224ff98a5ffec99',3:'01913d023f5a032a12032a800348a8048bfe064c9106e83907395007396508bbee0a59f80b3cfd0b3d4e0bc9330bc9540bfa330c1fb70c6b300c74500c74650db1330db2bb0e3d4e0e3d820f0b190f50fe0f6a160f6d2c0f73a20fc529100a06102db7141053175c201a66571b0d2d1db5871eb40f1f1d4521594e216f1421765921f3282212ba229a6522b02d23baea249faa24a04724f7cb2539cd2633a32633b82969eb29b1a02a09262acb7c2adcd62b604a2b9b182c0d952dfde82e989c2edc6b304e4c30670431954c31dc5d33811c3542da3544cf354505354522368c26377d8837f98f3888b139964a3a531c3a567d3b5e3b3ef6a73fd3093fd3b841de77448422448eb04a14534b08c34b507c4e96ac50aed250ff2151196351d7875476b459e01a5b0dae5b9f285cb9235d20d65ddb215eada85f04e15fb3a85fc6fc649fda6602c466b4c668c68568e2686b129b6b7a296c6dfd6c6e03729d0b75dc4a76356d76d1d2776d93776dd777f3137860d578951078981179b85b79d3cc7a23717ac8d27ac90a7c2e0f7dd03c7df7fe7e0c457fcea080d05784d16584d5168741e489128c8b51978bea868bebb18ce2878d612b8db7338eb05e9189ec91af9494868396dce5973a089a94ee9a9b329ac1179dce889e309d9ec0d49fd9249fe774a076bba11611a287e6a35076a4445daa6698abcab9ac7431af0ee2b1bdb2bbb440bc541fbe0d90c268f2c4377ec47b10c4a981c56705c70f00c954c0c9affccbdb97cbf1c7cd33cecd4d95cd53cfcdb6abceaf3cceaf51cf3b40cf3c01cf3c55cf715cd0a761d0c047d0c162d4b6d1d4b6e6d50005d52ea8d9e153da685add5fa8dd6084dd7861ddd108de52a3deb450debc8bdfe7e6dfe822dfe847e0e61ce10f79e2bcb4e2bce0e31152e3361be70065e902a5e902e2e916dfeb31aded9740ed976aed97f4eeed4befc57cf000d2f29319f2932ef29343f31807f3183df43aedf6603df7a934f7b458f8216ef8df87fb731afbba1afbfee0fc40c4fdcd47fe1098',4:'00922e01bbd70225e804f01c0ae5680b4cec0bb7520bfa120c1fcc0cf92c13e2ac1f2d3823761526d7062846612ac2012e521633146f332f9035b9c436ad2d3a29f8426aeb4351af465be347866e479cc34a09344bd3534e816850ce4751255451d772530f835acf5e5bb8065f050d602ca862101767612b6781ac68a6da6a2fc36b215a6e6d9872a49874814475db4f7c82d57db4597db87a7e1ed584c43e85d35d892be18be8d38beaa9914aec91afdb98270e9a42bc9a8d50a077a7ab9c43ac71c8ac722dafa073b1daf6b4593ab48a9db8f4a0b92154c43793c947c2cc83decf71cfd0c155d40880d438d1d49fbbd4e542d56a4ad71eded8a9c7da0551db18e5dc5947dea16ddfeff7e093a4e116ace8941ceeed0befddecf213e6fd661c'};/*/TABLE*/
var N={};(function(){for(var c in T){var s=T[c];for(var i=0;i+6<=s.length;i+=6)N[s.substr(i,6)]=+c;}})();
var RC=/^https:\/\/cdn\.prod\.website-files\.com\/6a0b29c6d081332e921900d8\/[0-9a-f]{24}_(?:[0-9a-f]{24}_)*([0-9a-f]{24})_([^\/?#]+)\.(?:jpe?g|png)$/i;
var RS=/^https:\/\/cdn\.prod\.website-files\.com\/69d6145cf421c777840c1e25\/([0-9a-f]{24})_([^\/?#]+)\.(?:jpe?g|png)$/i;
function twin(u){
  if(typeof u!=='string')return null;var m=RC.exec(u),cms=!!m;
  if(!m){m=RS.exec(u);if(!m||/-p-\d+$/.test(m[2]))return null;}
  var id=m[1].toLowerCase(),n=N[id.slice(-6)];
  if(n==null){if(!cms)return null;n=W.length;}
  if(!n)return null;
  return {base:H+SITE+'/'+id+'_'+m[2].replace(/%25/g,'%'),n:n};
}
function srcset(u){
  var t=twin(u);if(!t)return '';var s=[];
  for(var i=0;i<t.n;i++)s.push(t.base+'-p-'+W[i]+'.jpg '+W[i]+'w');
  /* the variants stop below the photo's own width, so the original is the next size up */
  if(t.n<W.length)s.push(u+' '+W[t.n]+'w');
  return s.join(', ');
}
/* one URL for a box w device pixels wide (for code that writes a single src): the smallest variant that covers it, else the original */
function pick(u,w){
  var t=twin(u);if(!t)return u;
  for(var i=0;i<t.n;i++)if(W[i]>=w)return t.base+'-p-'+W[i]+'.jpg';
  return t.n<W.length?u:t.base+'-p-'+W[t.n-1]+'.jpg';
}
/* sizes by class (the img's own class, else its parent's); the library lead card (first in the grid) is wider from 768px up */
var BY=[['tll-story-hero-img','(min-width:1280px) 1200px, calc(100vw - 32px)'],['tll-lib-byline-img','24px'],['st3-author-img','44px'],['st3-cc-img','60px'],
  ['tll-lib-img','(min-width:1280px) 385px, (min-width:768px) 47vw, calc(100vw - 48px)'],['tll-related-img','(min-width:991px) 840px, calc(100vw - 40px)'],
  ['tll-gallery-img','(min-width:900px) 300px, (min-width:600px) 33vw, 50vw'],['tll-paw-ex-img','(min-width:767px) 280px, calc(100vw - 32px)']];
var BYP=[['h3-card-by','40px'],['h3-card-ph','(min-width:991px) 26vw, 80vw'],['h3-pc','(min-width:1440px) 220px, (min-width:991px) 15vw, 44vw'],
  ['tll-mg-chip','36px'],['h3-c5-ph','(min-width:991px) 50vw, 100vw']];
var INLINE='(min-width:991px) 880px, calc(100vw - 48px)';
var LEAD='(min-width:1280px) 700px, (min-width:991px) 55vw, (min-width:768px) 95vw, calc(100vw - 48px)';
function has(e,c){return !!e&&(' '+(e.getAttribute('class')||'')+' ').indexOf(' '+c+' ')>=0;}
function guess(img){
  var i,p=img.parentElement;
  if(img.closest&&img.closest('.tll-inline-photo'))return INLINE;
  if(has(img,'tll-lib-img')){var it=img.closest&&img.closest('.tll-lib-grid>*');if(it&&!it.previousElementSibling)return LEAD;}
  for(i=0;i<BY.length;i++)if(has(img,BY[i][0]))return BY[i][1];
  for(i=0;i<BYP.length;i++)if(has(p,BYP[i][0]))return BYP[i][1];
  /* review 10 Nov: classless CMS card photos on /destinations and contributor pages are about 300px wide on desktop, full column on phones */
  if(!img.getAttribute('class')&&/^\/(destinations$|contributors\/)/.test(location.pathname.replace(/\/+$/,''))&&img.closest&&img.closest('.w-dyn-item'))return '(min-width:991px) 300px, calc(100vw - 32px)';
  var w=parseInt(img.getAttribute('width'),10);
  return w>0&&w<=160?w+'px':'100vw';
}
function ms(el){
  for(var e=el;e&&e.nodeType===1;e=e.parentNode){var a=e.attributes;for(var i=0;i<a.length;i++)if(a[i].name.lastIndexOf('data-ms-',0)===0)return true;}
  return false;
}
function lazy(img){return (img.getAttribute('loading')||'').toLowerCase()==='lazy';}
/* apply(img[, sizes[, src]]): writes srcset and sizes for src (default: the img's own src). A layer about to set src passes the new URL
   first, so the browser fetches once, from the srcset. Returns true when a srcset is in place. */
function apply(img,sz,src,moved){
  if(!img||img.nodeName!=='IMG')return false;
  var layer=src!=null;src=layer?String(src):img.getAttribute('src');if(!src)return false;
  if(img.getAttribute('data-tll-vx')===src)return false;
  var mine=img.getAttribute('data-tll-v')!=null;
  if(!layer&&!mine&&img.getAttribute('srcset'))return false;
  if(ms(img))return false;
  var ss=srcset(src);
  if(!ss){if(mine||layer){img.removeAttribute('srcset');img.removeAttribute('sizes');img.removeAttribute('data-tll-v');}return false;}
  if(mine&&img.getAttribute('data-tll-v')===src&&img.getAttribute('srcset')===ss){
    /* the same photo moved by a script (a story photo into the body column): its box changed, so its sizes follow while it is lazy and
       not yet fetched (a lazy image is fetched only near the screen, after the move) */
    if(moved&&!sz&&img.getAttribute('data-tll-vs')==null&&lazy(img)&&!img.complete){var g=guess(img);if(g!==img.getAttribute('sizes'))img.setAttribute('sizes',g);}
    return true;}
  var s=sz||guess(img);
  /* review 10 Nov: sizes a layer passed survive the later move scan (they were reset to 100vw on /about, /for-expats, /stories) */
  if(sz)img.setAttribute('data-tll-vs','');else img.removeAttribute('data-tll-vs');
  img.setAttribute('data-tll-v',src);img.setAttribute('sizes',s);img.setAttribute('srcset',ss);
  return true;
}
function hero(img){
  if(!has(img,'tll-story-hero-img'))return false;
  if(img.getAttribute('data-tll-hero'))return true;img.setAttribute('data-tll-hero','1');
  if(!ms(img)){
    if(lazy(img)&&(!img.getAttribute('srcset')||img.getAttribute('data-tll-v')!=null)){var ss=srcset(img.getAttribute('src'));
      if(ss){img.setAttribute('data-tll-v',img.getAttribute('src'));img.setAttribute('sizes',guess(img));img.setAttribute('srcset',ss);}}
    img.setAttribute('loading','eager');img.setAttribute('fetchpriority','high');
  }
  return true;
}
function consider(img,moved){
  if(img.getAttribute('data-tll-v')!=null&&img.getAttribute('srcset')){apply(img,null,null,moved);return;}
  if(hero(img))return;
  if(!lazy(img)||img.getAttribute('srcset'))return;
  apply(img);
}
function scan(n){
  if(n.nodeType!==1)return;
  if(n.nodeName==='IMG'){consider(n,true);return;}
  if(n.firstElementChild){var l=n.getElementsByTagName('img');for(var i=0;i<l.length;i++)consider(l[i],true);}
}
/* a variant that fails (a width Webflow did not build): drop the srcset, the original loads once */
document.addEventListener('error',function(e){
  var i=e.target;if(!i||i.nodeName!=='IMG'||i.getAttribute('data-tll-v')==null||!i.getAttribute('srcset'))return;
  var src=i.getAttribute('src');if(i.currentSrc&&i.currentSrc===src)return;
  i.setAttribute('data-tll-vx',src);i.removeAttribute('srcset');i.removeAttribute('sizes');i.removeAttribute('data-tll-v');i.removeAttribute('data-tll-vs');
},true);
if(window.MutationObserver){
  new MutationObserver(function(recs){
    for(var r=0;r<recs.length;r++){var x=recs[r];
      if(x.type==='attributes'){if(x.target.nodeName==='IMG')consider(x.target);continue;}
      for(var j=0;j<x.addedNodes.length;j++)scan(x.addedNodes[j]);}
  }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
}
/* once the page is parsed: every img again, in case one was missed */
function pass(){var l=document.images;for(var i=0;i<l.length;i++)consider(l[i]);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',pass);else pass();
window.__tllImgV={twin:twin,srcset:srcset,pick:pick,apply:apply,sizes:guess};
})();
