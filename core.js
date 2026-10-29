export const LEVELS = [
 {title:'兔兔的野餐袋', animal:'rabbit', kind:'factor', total:12, answer:3, choices:[2,3,5], story:'有 12 片餅乾。兔兔想裝成 4 袋，每袋一樣多，全部用完。', goal:'裝成 4 袋，沒有剩下', hint:'先試著每袋放 2 片，看看會有幾袋。再想想：要 4 袋，每袋要多一點還是少一點？', verify:{total:16, answer:4, choices:[3,4,5], prompt:'換成 16 片，想裝成 4 袋。先預測：每袋要幾片，才會剛好分完？'}},
 {title:'熊熊的分享盒', animal:'bear', kind:'factor', total:18, answer:6, choices:[4,5,6], story:'熊熊有 18 片餅乾，要送給 3 位朋友。每人一袋，要一樣多。', goal:'裝成 3 袋，沒有剩下', hint:'想像 3 位朋友各拿一袋。每袋 5 片只用掉 15 片，還有餅乾可以分。', verify:{total:15, answer:5, choices:[4,5,6], prompt:'現在有 15 片，要送給 3 位朋友。每袋應該放幾片？'}},
 {title:'狐狸的剛好挑戰', animal:'fox', kind:'factor', total:20, answer:4, choices:[3,4,6], story:'狐狸準備了 20 片餅乾，想裝成 5 袋。別把剩下的餅乾藏起來喔！', goal:'裝成 5 袋，沒有剩下', hint:'每袋 3 片會剩下 2 片。把每袋增加到 4 片，再觀察袋數。', verify:{total:24, answer:6, choices:[5,6,7], prompt:'換成 24 片，想裝成 4 袋。每袋放幾片，才會沒有剩下？'}},
 {title:'兔兔的烤盤', animal:'rabbit', kind:'multiple', size:3, total:12, answer:4, choices:[2,3,4,5,6], story:'每盤固定烤 3 片餅乾。兔兔需要剛好 12 片，試著一盤一盤加。', goal:'每盤 3 片，累積到 12 片', hint:'每加一盤，就多 3 片：3、6、9……下一盤呢？', verify:{total:15, answer:5, choices:[4,5,6], prompt:'仍然每盤 3 片。想要 15 片，先預測需要幾盤？'}},
 {title:'熊熊的下午茶', animal:'bear', kind:'multiple', size:4, total:20, answer:5, choices:[2,3,4,5,6], story:'這次每盤固定烤 4 片。熊熊想準備 20 片，不能改變每盤片數。', goal:'每盤 4 片，累積到 20 片', hint:'用手指數盤子，每盤多 4 片：4、8、12、16……', verify:{total:12, answer:3, choices:[2,3,4], prompt:'每盤還是 4 片，只需要 12 片。要烤幾盤？'}},
 {title:'森林點心派對', animal:'fox', kind:'multiple', size:5, total:30, answer:6, choices:[2,3,4,5,6], story:'派對開始！每盤烤 5 片餅乾，為大家準備剛好 30 片吧。', goal:'每盤 5 片，累積到 30 片', hint:'每盤多 5 片。數到 25 片時，還差幾盤才有 30 片？', verify:{total:20, answer:4, choices:[3,4,5], prompt:'明天需要 20 片，每盤仍是 5 片。你會準備幾盤？'}}
];

export function createState(level=0) {
 return {level: LEVELS[level] ? level : 0, phase:'explore', value:0, hints:0, demoStep:0, complete:false, attempted:false, wrong:false};
}
export function transition(state, action) {
 const s={...state}, l=LEVELS[s.level];
 if(action.type==='retry') return createState(s.level);
 if(action.type==='hint' && s.phase==='explore') s.hints++;
 if(action.type==='demo' && s.phase==='explore' && s.hints>0) {s.phase='demo'; s.demoStep=0; s.value=l.answer;}
 if(action.type==='demo-next' && s.phase==='demo') s.demoStep=Math.min(s.demoStep+1,l.kind==='factor'?l.total/l.answer:l.answer);
 if(action.type==='try' && s.phase==='explore' && Number.isInteger(action.value) && action.value>=0 && action.value<=6) {
  s.value=action.value; s.attempted=true;
  if(s.value===l.answer) s.phase='ready';
 }
 if(action.type==='predict' && s.phase==='ready') {s.phase='verify';s.wrong=false;}
 if(action.type==='verify' && s.phase==='verify') {
  s.wrong=action.value!==l.verify.answer;
  if(!s.wrong){s.phase='complete';s.complete=true;}
 }
 return s;
}

export const STORAGE_KEY='forest-snack-progress-v1';
const cleanProgress = value => Array.isArray(value) ? [...new Set(value.filter(n=>Number.isInteger(n)&&n>=0&&n<LEVELS.length))].sort((a,b)=>a-b) : [];
export function loadProgress(storage) {
 try {return cleanProgress(JSON.parse(storage.getItem(STORAGE_KEY)));} catch {return [];}
}
export function saveProgress(storage, completed) {
 try {storage.setItem(STORAGE_KEY,JSON.stringify(cleanProgress(completed)));return true;} catch {return false;}
}

export function group(total, size) {
 if (!Number.isInteger(total) || total < 0 || !Number.isInteger(size) || size < 1) throw new RangeError('數量必須是整數，每袋至少一片');
 return {groups: Math.floor(total / size), remainder: total % size};
}
