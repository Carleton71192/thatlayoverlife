/* tll-lounge-labels-v1 (29 Oct 2026, Nancy on /gallery: "The text over the images takes up all of the space"). The credit labels the
   TLL Lounge v2 page script paints on each tile (span.tll-lounge-credit, span.tll-lounge-open) become one small line in the corner:
   smaller type, tighter tracking, a long place wraps to a second short line. Same elements and text; /gallery only; nothing removed. */
(function(){
if(!/^\/gallery\/?$/.test(location.pathname))return;
var CSS="html body .tll-lounge-credit,html body .tll-lounge-open{position:absolute!important;left:10px!important;bottom:10px!important;right:auto!important;top:auto!important;"+
"max-width:calc(100% - 20px)!important;width:auto!important;box-sizing:border-box!important;margin:0!important;padding:4px 7px!important;"+
"font:600 10px/1.3 'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace!important;letter-spacing:.08em!important;text-transform:uppercase;"+
"white-space:normal!important;overflow-wrap:anywhere;"+
"background:rgba(10,11,20,.62)!important;color:#F7F1E8!important;border-radius:2px!important}"+
"@media (max-width:767px){html body .tll-lounge-credit,html body .tll-lounge-open{left:8px!important;bottom:8px!important;max-width:calc(100% - 16px)!important;font-size:9.5px!important;padding:3px 6px!important}}";
function add(){if(document.getElementById('tll-lounge-labels-v1'))return;var s=document.createElement('style');s.id='tll-lounge-labels-v1';s.textContent=CSS;(document.body||document.head).appendChild(s);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);else add();
})();
