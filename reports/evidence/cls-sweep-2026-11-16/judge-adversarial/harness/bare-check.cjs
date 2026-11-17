/* the three layers that go into the core without their comments: is the code the same as the source? Both are minified with esbuild and compared. */
const fs=require('fs'),path=require('path');const esbuild=require('/home/user/thatlayoverlife/node_modules/esbuild');
const WT=process.argv[2],core=fs.readFileSync(process.argv[3],'utf8').split('\n');
const names=['tll-page-heroes-v1','tll-first-paint-v1','tll-early-state-v1'];
const marks=[];core.forEach((l,i)=>{const m=/^\/\* (src\/[^ ]+\.js) \*\/$/.exec(l);if(m)marks.push([i,m[1]]);});
for(const n of names){const k=marks.findIndex(m=>m[1].endsWith('/'+n+'.js'));const seg=core.slice(marks[k][0]+1,k+1<marks.length?marks[k+1][0]:core.length).join('\n');
  const src=fs.readFileSync(path.join(WT,'src/site-layers',n+'.js'),'utf8');
  const a=esbuild.transformSync(src,{minify:true}).code;let b;try{b=esbuild.transformSync(seg,{minify:true}).code;}catch(e){b='ERR '+e.message.slice(0,200);}
  console.log(n,'source lines',src.split('\n').length,'core lines',seg.split('\n').length,'minified source',a.length,'minified core part',b.length,a===b?'SAME':(b.includes(a.trim().replace(/;$/,''))||a.includes(b.trim()))?'core part contains the source code (wrapper around it)':'DIFFERENT');
  if(a!==b){fs.writeFileSync('/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov16/judge-adversarial/bare-'+n+'.a.js',a);fs.writeFileSync('/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov16/judge-adversarial/bare-'+n+'.b.js',b);}}
