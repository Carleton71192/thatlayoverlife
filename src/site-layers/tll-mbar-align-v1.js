/* tll-mbar-align-v1 (29 Oct 2026, Nancy on /account: "The overview, profile... etc seems too left aligned and not consistent with the
   design"). The member bar (OVERVIEW PROFILE MAP PETS CONTRIBUTIONS SETTINGS, nav.tll-mbar on /account, /edit-profile, /the-map and
   /my-pets) ran from the very left edge of the window while the page content sits in a centered column. The bar keeps its full-width
   rule, and its links now start where the content column starts (the site's 1208 px column, 24 px gutters on small screens). The
   current page line is the light-background rose #C8325B. Same element and links; nothing removed; no data-ms-* element touched. */
(function(){
var CSS="html body nav.tll-mbar{box-sizing:border-box;width:100%;padding-left:max(24px,calc((100% - 1208px) / 2 + 12px))!important;padding-right:max(24px,calc((100% - 1208px) / 2 + 12px))!important;column-gap:28px}"+
"html body nav.tll-mbar a[aria-current=\"page\"]{border-bottom-color:#C8325B}"+
"html body nav.tll-mbar a:focus-visible{outline-color:#C8325B}"+
"@media (max-width:767px){html body nav.tll-mbar{padding-left:24px!important;padding-right:24px!important;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;column-gap:22px}html body nav.tll-mbar::-webkit-scrollbar{display:none}html body nav.tll-mbar a{flex:0 0 auto}}";
function add(){if(document.getElementById('tll-mbar-align-v1'))return;var s=document.createElement('style');s.id='tll-mbar-align-v1';s.textContent=CSS;(document.head||document.documentElement).appendChild(s);}
add();
})();
