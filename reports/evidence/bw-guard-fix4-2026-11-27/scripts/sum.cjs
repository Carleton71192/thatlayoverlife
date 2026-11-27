const fs=require('fs');const [,,f]=process.argv;
for(const l of fs.readFileSync(f,'utf8').split('\n')){const i=l.indexOf(' {');if(i<0){if(l.trim())console.log(l.slice(0,160));continue;}let o;try{o=JSON.parse(l.slice(i+1).replace(/ \| relay.*$/,''))}catch(e){console.log(l.slice(0,200));continue}
const pick={};for(const k of Object.keys(o))if(/deliver|count|bytes|request|gets|page|trip|stop|loaded|results|MB/i.test(k)){let v=o[k];if(typeof v==='string')v=v.slice(0,90);if(Array.isArray(v))v=v.length>6?`[${v.length} items]`:v;pick[k]=v;}
console.log(l.slice(0,i).slice(0,90),JSON.stringify(pick).slice(0,330));}
