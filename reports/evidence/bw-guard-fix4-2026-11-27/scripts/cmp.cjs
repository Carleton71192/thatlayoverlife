const fs=require('fs'),path=require('path');const S=process.argv[2];
const mods={old:require(S+'/parse/old/wf-guard.cjs'),r3:require(S+'/parse/r3/wf-guard.cjs'),new:require(process.argv[3]+'/tools/wf-guard.cjs')};
let cells=0,diff=0,err=0;const head={};
for(const f of fs.readdirSync(S+'/parse/logs')){const t=fs.readFileSync(S+'/parse/logs/'+f,'utf8');
 for(let d=1;d<=30;d++){const day=new Date(Date.UTC(2026,10,d,12));const v={};for(const k in mods){try{v[k]=+mods[k].dailyTotalMB(t,day).toFixed(4)}catch(e){v[k]='ERR';}}
  if(v.new==='ERR')err++; if(v.new!==v.old||v.new!==v.r3){diff++;console.log(f,d,JSON.stringify(v));} if(v.new!==0)cells++; if(f==='HEAD.md'&&v.new)head[d]=v;}}
console.log('files',fs.readdirSync(S+'/parse/logs').length,'nonzero cells',cells,'diffs',diff,'errors',err);console.log('HEAD per day',JSON.stringify(head));
