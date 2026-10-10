/* TLL feedback v1.1 (9 Oct 2026, fix-first item 13, Nancy: sure). Loads tll_feedback_widget_v1 unchanged, then: 48px round button on phones, hidden while a story's text is on screen, hidden while the cookie banner is open. */
(function(){
var w=document.createElement('script');w.src='https://cdn.prod.website-files.com/69d6145cf421c777840c1e25%2F689e5ba67671442434f3ca35%2F6a0e097a2e245c8f459f436d%2Ftll_feedback_widget_v1-1.0.0.js';document.body.appendChild(w);
var s=document.createElement('style');
s.textContent='html .tll-fbk-btn{transition:opacity 150ms ease-out,visibility 150ms ease-out,background .2s ease}'+
'html.tll-fbk-reading .tll-fbk-btn,html.show--consent .tll-fbk-btn,html.show--preferences .tll-fbk-btn{opacity:0;visibility:hidden;pointer-events:none}'+
'@media(max-width:767px){html .tll-fbk-btn{width:48px;height:48px;min-height:48px;padding:0;border-radius:50%;font-size:0;letter-spacing:0;gap:0;justify-content:center}html .tll-fbk-btn .tll-fbk-btn-icon{font-size:20px;line-height:1}}';
document.head.appendChild(s);
if(!/^\/(stories|paw-passport|marathon-diaries)\/[^\/]+/.test(location.pathname))return;
function run(){
var a=document.querySelectorAll('main .w-richtext,.tll-story-body .w-richtext'),b=a[a.length-1];if(!b)return;
var d=document.documentElement,t=0;
function c(){t=0;d.classList.toggle('tll-fbk-reading',b.getBoundingClientRect().bottom>innerHeight);}
function q(){if(!t)t=requestAnimationFrame(c);}
c();addEventListener('scroll',q,{passive:true});addEventListener('resize',q);
}
if(document.readyState!=='loading')run();else document.addEventListener('DOMContentLoaded',run);
})();
