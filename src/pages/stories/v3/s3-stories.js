/* TLL Stories 3.0 companion (10 Oct 2026). Copy only, no layout: (1) the approved no-results note, (2) the
   SPONSORED chip on cards whose bound Disclosure starts with "Hosted:", (3) the prototype placeholder on the
   search input when it has none (the Data API cannot set it on this input). Runs after search v4 and chips v1. */
(function(){
  function ph(){var i=document.getElementById('tll-lib-q');if(i&&!i.getAttribute('placeholder'))i.setAttribute('placeholder','A country, a train line, a feeling');}
  function note(){
    var n=document.getElementById('tll-q-note');if(!n||n.getAttribute('data-s3'))return;
    var s=n.querySelector('span'),q=s?s.textContent:((new URLSearchParams(location.search).get('q'))||'').trim();
    n.setAttribute('data-s3','1');
    n.innerHTML='Nothing on the shelf for “<span class="s3-q-term"></span>” yet. <span class="s3-q-actions"><a class="s3-q-share" href="/submit">Share your story →</a><a class="s3-q-clear" href="/stories">Clear the search</a></span>';
    n.querySelector('.s3-q-term').textContent=q;
  }
  function chips(){
    [].forEach.call(document.querySelectorAll('[data-tll-disclosure]'),function(d){
      var card=d.closest('[data-tll-card]');if(!card||card.querySelector('.s3-sponsored'))return;
      var m=/^\s*Hosted:\s*(.*)$/.exec(d.textContent||'');if(!m)return;
      var name=m[1].trim(),c=document.createElement('span');c.className='s3-sponsored';
      c.textContent=name?'Sponsored · by '+name:'Sponsored';
      var t=card.querySelector('.tll-lib-title');if(t)t.insertAdjacentElement('afterend',c);
    });
  }
  function run(){ph();note();chips();}
  document.addEventListener('tll:lib-filtered',note);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
