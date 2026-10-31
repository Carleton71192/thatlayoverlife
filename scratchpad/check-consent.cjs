const { chromium } = require('playwright');
const fs = require('fs');
const head = fs.readFileSync('scratchpad/p0-1031/after/site-head.html', 'utf8');
const bridge = head.slice(0, head.indexOf('</script>') + 9);
(async () => {
  const b = await chromium.launch();
  for (const mode of ['before-choice', 'accept', 'reject', 'non-eea']) {
    const p = await b.newPage(); const reqs = [];
    await p.route('**/*', (r) => { const u = r.request().url(); reqs.push(u);
      if (u.startsWith('https://www.thatlayover.life/')) return r.fulfill({ contentType: 'text/html', body: `<!doctype html><html><head><script>
        window.__fake=${JSON.stringify(mode)};window.__revoked=0;
        </script>${bridge}</head><body><footer><a href="javascript:void(0)">Cookie settings</a></footer><script>window.CookieConsent={run:function(){document.body.insertAdjacentHTML("beforeend","<div id=oldbanner>OLD</div>")}};window.addEventListener("load",function(){CookieConsent.run();window.__acc=CookieConsent.acceptedCategory("analytics");});</script></body></html>` });
      if (u.includes('fundingchoicesmessages')) return r.fulfill({ contentType: 'application/javascript', body: `
        window.googlefc=window.googlefc||{};var q=googlefc.callbackQueue||[];googlefc.callbackQueue={push:function(f){f();}};q.forEach(function(f){f();});googlefc.showRevocationMessage=function(){window.__revoked++;};
        window.__tcfapi=function(cmd,v,cb){var m=window.__fake;if(m==='before-choice'){cb({eventStatus:'cmpuishown',gdprApplies:true},true);return;}
          if(m==='non-eea'){cb({eventStatus:'tcloaded',gdprApplies:false},true);return;}
          var all=m==='accept';cb({eventStatus:'useractioncomplete',gdprApplies:true,purpose:{consents:{1:all,3:all,4:all,7:all,8:all}}},true);};` });
      return r.fulfill({ contentType: 'application/javascript', body: '' }); });
    await p.goto('https://www.thatlayover.life/'); await p.waitForTimeout(800);
    await p.click('text=Cookie settings');
    const st = await p.evaluate(() => ({ c: window.__tllConsent, revoked: window.__revoked, old: !!document.getElementById("oldbanner"), acc: window.__acc, consent: dataLayer.filter((x) => x[0] === 'consent').map((x) => x[1] + ':' + x[2].analytics_storage + '/' + x[2].ad_storage) }));
    console.log(mode, JSON.stringify(st), 'ga:', reqs.some((u) => u.includes('googletagmanager')), 'ahrefs:', reqs.some((u) => u.includes('ahrefs')), 'ads:', reqs.some((u) => u.includes('adsbygoogle')));
  }
  await b.close();
})();
