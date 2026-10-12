/* Memberstack mock for offline tests. Mode __MODE__. Records every write call so the test can prove the a3/au3 code never writes. */
/* Simulates the hosted page script that is expected to define window.tllOwn: the live tll-acct-lists v1.3 calls tllOwn(),
   which is only declared inside the __tllAcctStats closure. Without it, cardCounts() and wrapped() throw (pre-existing, see build log). */
if(!/noshim/.test(location.search)) window.tllOwn=function(d){var hum={},any=0;(d&&d.travelers||[]).forEach(function(t){if(t&&!t.pet){hum[t.id]=1;any=1;}});var n=0,l=0,lv=0;Object.keys(d&&d.states||{}).forEach(function(k){var row=d.states[k]||{},best='';Object.keys(row).forEach(function(id){if(any&&!hum[id])return;var v=row[id];if(v==='lived'){best='lived';}else if(v==='visited'){if(best!=='lived')best='visited';}else if(v==='layover'&&!best)best='layover';});if(best==='lived'){n++;lv++;}else if(best==='visited')n++;else if(best==='layover')l++;});return{n:n,lived:lv,stayed:n-lv,layover:l};};
(function(){
  var mode='__MODE__'; window.__msWrites=[];
  var states={v:2,travelers:[{id:'t1',name:'Me'},{id:'p1',name:'Magnus',pet:true}],states:{'208':{t1:'lived',p1:'visited'},'076':{t1:'visited'},'250':{t1:'layover'},'704':{t1:'visited',p1:'visited'}}};
  var member=mode==='member'?{id:'mem_test',profileImage:'',customFields:{'first-name':'Test','bio-short':'','lives-country':'Denmark','languages':'English','link-website':'https://example.com','link-website-on':'true','is-expat':'true','share-level':'unlisted'}}
    :mode==='member-empty'?{id:'mem_new',customFields:{}}:null;
  var json=mode==='member'?{tllStates:states,tllLists:{airports:[{name:'Keflavik',year:'2024',at:'2026-10-01'}]},tllPlaces:{BR:'want'}}:{};
  window.$memberstackDom={
    getCurrentMember:function(){return Promise.resolve({data:member});},
    getMemberJSON:function(){return Promise.resolve({data:json});},
    updateMember:function(x){window.__msWrites.push(['updateMember',x]);return Promise.resolve({data:member});},
    updateMemberJSON:function(x){window.__msWrites.push(['updateMemberJSON',x]);return Promise.resolve({});}
  };
  document.addEventListener('DOMContentLoaded',function(){
    var rm=member?'[data-ms-content="anonymous"]':'[data-ms-content="members"]';
    [].slice.call(document.querySelectorAll(rm)).forEach(function(e){e.parentNode.removeChild(e);});
    if(!member) document.documentElement.classList.add('tll-anon');
  });
})();
