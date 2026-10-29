import test from 'node:test';
import assert from 'node:assert/strict';
import * as m from '../core.js';
test('exploration requires exact goal; demonstration cannot complete; fresh prediction gates badge', () => {
 assert.equal(typeof m.createState,'function');
 for(let i=0;i<6;i++) {
  const l=m.LEVELS[i]; let s=m.createState(i);
  s=m.transition(s,{type:'verify',value:l.verify.answer}); assert.equal(s.phase,'explore');
  s=m.transition(s,{type:'try',value:1}); assert.equal(s.phase,'explore');
  s=m.transition(s,{type:'hint'}); assert.equal(s.hints,1);
  s=m.transition(s,{type:'demo'}); assert.equal(s.phase,'demo'); assert.equal(s.complete,false);
  s=m.transition(s,{type:'verify',value:l.verify.answer}); assert.equal(s.complete,false);
  s=m.transition(s,{type:'demo-next'}); assert.ok(s.demoStep>0); assert.equal(s.complete,false);
  s=m.transition(s,{type:'retry'}); assert.equal(s.phase,'explore');
  s=m.transition(s,{type:'try',value:l.answer}); assert.equal(s.phase,'ready'); assert.equal(s.complete,false);
  s=m.transition(s,{type:'predict'}); assert.equal(s.phase,'verify');
  s=m.transition(s,{type:'verify',value:99}); assert.equal(s.complete,false); assert.equal(s.phase,'verify');
  s=m.transition(s,{type:'verify',value:l.verify.answer}); assert.equal(s.phase,'complete'); assert.equal(s.complete,true);
 }
});
