const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
function source(name) {
  const start = html.indexOf('function '+name+'(');
  assert.ok(start >= 0, 'Missing production function '+name);
  let end=html.indexOf('{',start)+1, depth=1;
  while(depth && end<html.length){if(html[end]==='{')depth++;if(html[end]==='}')depth--;end++;}
  assert.equal(depth,0);
  return html.slice(start,end);
}
function context(names, values={}) {
  const nodes={};
  const $=id=>nodes[id]??=( {value:values[id]??'',textContent:'',style:{},classList:{add(){},remove(){},toggle(){}}} );
  const ctx={$,num:id=>Number($(id).value),fmt:n=>Math.round(n).toLocaleString('en-US'),fmtUSD2:n=>'$'+n.toFixed(2)};
  vm.createContext(ctx);vm.runInContext(names.map(source).join('\n'),ctx);
  return {ctx,$};
}
test('loan payment handles zero interest and amortization',()=>{
  const {ctx}=context(['pmt']);
  assert.equal(ctx.pmt(1200,0,12),100);
  assert.equal(ctx.pmt(1200,5,0),0);
  assert.ok(Math.abs(ctx.pmt(100000,6,360)-599.550525)<0.000001);
});
test('points calculation uses net cash after taxes and preserves zero-price guard',()=>{
  const {ctx,$}=context(['calcCPP'],{cashPrice:600,pointCost:30000,taxes:60,baseline:1.5});
  ctx.calcCPP();assert.equal($('cppValue').textContent,'1.80');assert.equal($('cppStamp').textContent,'USE POINTS');
  $('pointCost').value=0;ctx.calcCPP();assert.equal($('cppValue').textContent,'54000.00');
});
