/* tll-home-bands-v1 (29 Oct 2026, Nancy: the Brazil band "looks pixelated"; the Montenegro band "I think we have better images for this").
   The two full-width photo bands on the home page now show members' own story photos at full size (2400 px wide), each credited to the
   writer and linked to the story it came from. Captions name the place of a published story, never where anyone is now. Home only;
   the figure, its classes and its data-h3-il key stay; nothing is removed and no data-ms-* element is touched. */
(function(){
if(!/^\/(index\.html)?$/.test(location.pathname))return;
var C='https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/';
var B={
 rio:{src:C+'6ac86ab8eaf54b2878f9344b_6ac86a1e460d26e52c3f8d09_pantanal-hero-jaguar-swimming-the-cuiaba-river.jpeg',w:2400,h:1350,
  alt:'A jaguar swimming across the Cuiaba River in the Pantanal',pos:'50% 42%',label:'In the library · Pantanal, Brazil',by:'Nancy Carleton',href:'/stories/pantanal-glimmers-in-the-wild'},
 montenegro:{src:C+'6aba3d42f18f65b8d06aea74_6aba3cbc0a48f32b1687edfc_sortsol-hero-murmuration-over-the-cars.jpeg',w:2400,h:1350,
  alt:'A murmuration of starlings at sunset during Sort Sol, cars parked below',pos:'50% 40%',label:'On the map · Sort Sol, Denmark',by:'Nancy Carleton',href:'/stories/sort-sol-black-sun-denmark'}
};
var CSS=".h3-il[data-tll-band] figcaption{padding:0!important;background:none!important}"+
".h3-il[data-tll-band] figcaption a{display:inline-block;padding:8px 12px;background:rgba(10,11,20,.72);color:#F7F1E8!important;text-decoration:none!important}"+
".h3-il[data-tll-band] figcaption b{font-weight:600}"+
".h3-il[data-tll-band] figcaption a:hover b,.h3-il[data-tll-band] figcaption a:focus-visible b{text-decoration:underline;text-decoration-color:#F0507A;text-underline-offset:3px}"+
".h3-il[data-tll-band] figcaption a:focus-visible{outline:3px solid #F0507A;outline-offset:3px}";
function swap(){
  if(!document.getElementById('tll-home-bands-v1')){var s=document.createElement('style');s.id='tll-home-bands-v1';s.textContent=CSS;(document.body||document.head).appendChild(s);}
  Object.keys(B).forEach(function(k){
    var f=document.querySelector('figure.h3-il[data-h3-il="'+k+'"]');if(!f||f.getAttribute('data-tll-band'))return;
    var p=B[k],i=f.querySelector('img'),c=f.querySelector('figcaption');if(!i||!c)return;
    f.setAttribute('data-tll-band','1');
    i.removeAttribute('srcset');i.removeAttribute('sizes');i.src=p.src;i.alt=p.alt;i.width=p.w;i.height=p.h;i.style.objectPosition=p.pos;
    var a=document.createElement('a');a.href=p.href;a.appendChild(document.createTextNode(p.label+' · '));
    var b=document.createElement('b');b.textContent=p.by;a.appendChild(b);c.textContent='';c.appendChild(a);
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',swap);else swap();
})();
