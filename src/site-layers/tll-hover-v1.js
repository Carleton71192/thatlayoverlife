/* tll-hover-v1 (29 Oct 2026, Nancy: "still having blue on hover, it is too light, maybe the dark pink?"). On light backgrounds the
   /account profile card turned its whole text bright teal on hover, and the account pick-in cards outlined in bright teal (#00C9C8 is
   for dark backgrounds only). Hover is now ink text with a dark pink (#C8325B) border and link line. Namespaced; nothing removed. */
(function(){
var CSS="html body a.tll-apc:hover,html body a.tll-apc:hover *,html body a.tll-apc:focus-visible,html body a.tll-apc:focus-visible *{color:#0A0B14!important}"+
"html body a.tll-apc:hover,html body a.tll-apc:focus-visible{border-color:#C8325B!important}"+
"html body a.tll-apc:hover .tll-apc-go,html body a.tll-apc:focus-visible .tll-apc-go{color:#C8325B!important;text-decoration-color:#C8325B!important}"+
"html body .tll-account-actions-section .tll-pickin-card:hover{outline-color:#C8325B!important;border-color:#C8325B!important}";
function add(){if(document.getElementById('tll-hover-v1'))return;var s=document.createElement('style');s.id='tll-hover-v1';s.textContent=CSS;(document.body||document.head).appendChild(s);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);else add();
})();
