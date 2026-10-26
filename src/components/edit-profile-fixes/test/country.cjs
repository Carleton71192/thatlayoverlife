// Unit test for tll-ep-country-v1: runs the live matcher (from the 20 Oct edit-profile part A) with the patch on top.
const fs=require('fs'),path=require('path');const D=__dirname;
const src=fs.readFileSync(path.join(D,'../../../pages/edit-profile/after-2026-10-20/15-ep-js-a.html'),'utf8');
const C=src.match(/E\.C="([^"]*)"/)[1].split(',').map(x=>({c:x.slice(0,2).toLowerCase(),n:x.slice(3)}));
const base=new Function('E','return '+src.match(/E\.ccode=(function[^]*?return ""\})/)[1])({C});
global.window={TLLEP:{C,ccode:base}};global.location={pathname:'/edit-profile'};global.document={readyState:'complete',querySelector:()=>null,addEventListener(){}};
require(path.join(D,'../tll-ep-country-v1.js'));const f=window.TLLEP.ccode;
const cases=[['Portland, Oregon, USA','us'],['USA','us'],['Copenhagen, Denmark','dk'],['London, England','gb'],['UK','gb'],['Georgia','ge'],['Atlanta, Georgia, USA','us'],['Atlanta, Georgia','ge'],['Oregon','us'],['Amsterdam, Holland','nl'],['Dubai, UAE','ae'],['dk','dk'],['Denmark','dk'],['Den','dk'],['Prague, Czech Republic','cz'],['Istanbul, Türkiye','tr'],['Seoul, South Korea','kr'],['New York, NY','us'],['Narnia',''],['','']];
let bad=0;for(const [q,w] of cases){const g=f(q);if(g!==w){bad++;console.log('FAIL',JSON.stringify(q),'got',g,'want',w)}}
console.log((cases.length-bad)+'/'+cases.length,'pass');process.exit(bad);
