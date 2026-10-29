import test from 'node:test';
import assert from 'node:assert/strict';
const m = await import('../core.js').catch(() => ({}));
test('equal groups conserve cookies and expose remainders, including boundaries', () => {
 assert.equal(typeof m.group, 'function');
 assert.deepEqual(m.group(12, 3), {groups: 4, remainder: 0});
 assert.deepEqual(m.group(14, 3), {groups: 4, remainder: 2});
 assert.deepEqual(m.group(2, 5), {groups: 0, remainder: 2});
 assert.deepEqual(m.group(0, 3), {groups: 0, remainder: 0});
 for (const v of [0,-1,1.5,NaN]) assert.throws(() => m.group(12,v), RangeError);
 assert.throws(() => m.group(-1,3), RangeError);
});
