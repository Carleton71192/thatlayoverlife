/*TLL inline photos v2, part A (helpers). Part B places photos from Photo placements CMS rows.*/
window.tllPh={W:function(m){try{console.warn('[tll-photos] '+m)}catch(e){}},
S:function(u){var f=String(u||'').split('/').pop().split('?')[0];try{f=decodeURIComponent(f)}catch(e){}return f.replace(/\.(jpe?g|png|webp|avif|gif)$/i,'').replace(/^(?:[0-9a-f]{24}_)+/i,'').toLowerCase()},
N:function(t){t=String(t||'');if(t.normalize)t=t.normalize('NFC');return t.replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/\s+/g,' ').trim().toLowerCase()},
T:function(el){var d=document.createElement('textarea');d.innerHTML=String(el.innerHTML||'').replace(/<br\s*\/?>/gi,'\n').replace(/<\/(p|div)>/gi,'\n').replace(/<[^>]+>/g,'');return d.value},
P:function(){var T=window.tllPh.T,el=document.querySelector('[data-tll-photo-placement]');if(el)return T(el);var pg=location.pathname.replace(/\/+$/,'').split('/').pop(),r=document.querySelectorAll('[data-tll-placement-row]');for(var i=0;i<r.length;i++)if((r[i].getAttribute('data-story-slug')||'').trim()===pg)return T(r[i]);return''},
CSS:'.tll-inline-photo{margin:2.2em -4vw;padding:0}.tll-inline-photo a{display:block}.tll-inline-photo img{display:block;width:100%;height:auto;max-height:78vh;object-fit:cover}@media(max-width:767px){.tll-inline-photo{margin:1.8em -16px}}'};
