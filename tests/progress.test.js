import test from 'node:test';
import assert from 'node:assert/strict';
import * as m from '../core.js';
test('progress validates stored data and survives unavailable storage',()=>{
 assert.equal(typeof m.loadProgress,'function');
 const store={value:null,getItem(){return this.value},setItem(k,v){this.value=v}};
 assert.deepEqual(m.loadProgress(store),[]);
 assert.equal(m.saveProgress(store,[0,2,2,8,-1,'1']),true);
 assert.deepEqual(m.loadProgress(store),[0,2]);
 for(const v of ['oops','null','{}','["0",-1,6,0,0]']) {store.value=v; assert.deepEqual(m.loadProgress(store),v.startsWith('[')?[0]:[]);}
 const denied={getItem(){throw Error()},setItem(){throw Error()}};
 assert.deepEqual(m.loadProgress(denied),[]);
 assert.equal(m.saveProgress(denied,[0]),false);
 assert.deepEqual(m.loadProgress(undefined),[]);
});
