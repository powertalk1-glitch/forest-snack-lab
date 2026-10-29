import test from 'node:test';
import assert from 'node:assert/strict';
import * as m from '../core.js';
test('six ordered stages use nontrivial concrete goals and fresh transfer tasks', () => {
 assert.equal(m.LEVELS?.length, 6);
 assert.deepEqual(m.LEVELS.map(l=>l.kind), ['factor','factor','factor','multiple','multiple','multiple']);
 for(const l of m.LEVELS) {
  assert.ok(l.title && l.story && l.hint);
  assert.ok(l.answer > 1);
  assert.ok(l.choices.includes(l.answer));
  assert.notEqual(l.verify.total, l.total);
  assert.ok(l.verify.choices.includes(l.verify.answer));
  assert.equal(l.kind==='factor' ? l.total % l.answer : l.size*l.answer, l.kind==='factor'?0:l.total);
 }
});
