/* TLL story "other perspectives" invite v1 (10 Oct 2026). Adds one quiet line after the story body: were you on this trip too?
   It links to /submit?with=<this story's slug>, which prefills the bundle field on the story form. */
(function(){
var m=location.pathname.match(/^\/stories\/([a-z0-9-]+)\/?$/);if(!m)return;
function go(){var bodies=[].slice.call(document.querySelectorAll('.tll-body')).filter(function(b){return b.id!=='tll-quick-answers';});
if(!bodies.length||document.querySelector('.tll-persp-ask'))return;
var body=bodies.sort(function(a,b){return b.querySelectorAll(':scope > p').length-a.querySelectorAll(':scope > p').length;})[0];
var st=document.createElement('style');st.textContent='.tll-persp-ask{margin:2.4em 0 0;padding:18px 0 0;border-top:1px solid rgba(10,11,20,.14);font-size:16px;line-height:1.5}.tll-persp-ask b{font-weight:700}.tll-persp-ask a{color:#067A79;font-weight:600;text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px}.tll-persp-ask a:focus-visible{outline:2px solid #067A79;outline-offset:2px}';
document.head.appendChild(st);
var p=document.createElement('p');p.className='tll-persp-ask';
p.innerHTML='<b>Were you on this trip too?</b> Every traveler sees a different trip. <a></a>';
var a=p.querySelector('a');a.href='/submit?with='+m[1];a.textContent='Add your version →';
body.parentNode.insertBefore(p,body.nextSibling);}
if(document.readyState!=='loading')go();else document.addEventListener('DOMContentLoaded',go);
})();
