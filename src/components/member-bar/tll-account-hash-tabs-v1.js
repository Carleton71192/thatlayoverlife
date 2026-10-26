/* tll-account-hash-tabs-v1 (26 Oct 2026). On /account, a tap on a same-page link such as the member bar's SETTINGS
   (/account#settings) or CONTRIBUTIONS (/account#stories) opens that account tab.
   Why: Webflow's smooth scroll catches same-page # links, scrolls to the target and changes the address with pushState,
   which fires no hashchange, so the account tabs never heard the tap and the target section stayed hidden.
   This listener runs first (capture phase) and only acts when a matching account tab button exists (#a3-tab-<name>). */
(function(){
  if(window.__tllHashTabs) return; window.__tllHashTabs=1;
  function same(a){ return a.host===location.host && a.pathname.replace(/\/$/,'')===location.pathname.replace(/\/$/,''); }
  document.addEventListener('click',function(e){
    if(e.defaultPrevented||e.button>0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey) return;
    var a=e.target&&e.target.closest&&e.target.closest('a[href*="#"]'); if(!a||!a.hash||!same(a)) return;
    var tab=document.getElementById('a3-tab-'+decodeURIComponent(a.hash.slice(1))); if(!tab) return;
    e.preventDefault(); e.stopPropagation();
    tab.click();
  },true);
})();
