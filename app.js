import {LEVELS,createState,transition,loadProgress,saveProgress} from './core.js';
import {animal,workbench} from './view.js';
const main=document.querySelector('#main');
let storage;try{storage=window.localStorage;}catch{}
let completed=loadProgress(storage),state=createState(),screen='map';
function persist(){const ok=saveProgress(storage,completed);document.querySelector('#save-status').textContent=ok?'紀錄已存在這個瀏覽器':'目前無法儲存；仍可遊玩，關閉頁面後紀錄可能消失。';}
function render(focus=false){
 if(screen==='map')main.innerHTML=`<section class="hero"><div class="hero-copy"><span class="eyebrow"><i></i> 今日開店囉 · 歡迎小小點心師</span><h1>分一分，烤一烤，<br>讓數學<span>變好懂。</span></h1><p>兔兔、熊熊和狐狸正在準備野餐。<br>用你的雙手幫點心找個家，<br>把「剛剛好」的祕密，一點一點做出來。</p><button class="primary start" data-action="start">${completed.length?'繼續我的點心冒險':'穿上圍裙，開始玩'} <span aria-hidden="true">→</span></button><div class="hero-tags"><span>✦ 不趕時間</span><span>✦ 可以一直試</span><span>✦ 用手就能懂</span></div></div><div class="forest-scene" aria-hidden="true"><span class="sun">✺</span><span class="cloud cloud-one"></span><span class="cloud cloud-two"></span><span class="scene-caption">森林點心研究室</span><div class="tree tree-one"></div><div class="tree tree-two"></div><div class="friends"><div class="friend bear">${animal('bear')}</div><div class="friend rabbit">${animal('rabbit')}</div><div class="friend fox">${animal('fox')}</div></div><div class="picnic-table"><div class="table-plate"><span class="cookie"><i></i></span><span class="cookie"><i></i></span><span class="cookie"><i></i></span></div><span class="jam">果醬</span></div><div class="grass">✿ <span>✿</span> ✿</div><span class="scene-sticker">今天也有<br><b>剛剛好的快樂</b></span></div></section><section class="map-section" aria-labelledby="map-title"><div class="map-heading"><div><span class="eyebrow">一趟小小的森林旅程</span><h2 id="map-title">你的點心探險地圖</h2></div><span id="progress" class="progress">${completed.length} / 6 枚點心印章</span></div><div class="chapter-label"><span>01—03</span><b>分袋小幫手</b><span>固定總片數 → 每袋一樣多</span></div><div class="level-grid">${LEVELS.map((l,i)=>`${i===3?'</div><div class="chapter-label second"><span>04—06</span><b>烤盤小達人</b><span>固定每盤片數 → 一盤盤累積</span></div><div class="level-grid">':''}<button class="level-card ${completed.includes(i)?'done':''}" data-level="${i}" aria-label="第 ${i+1} 站 ${l.title}${completed.includes(i)?'，已完成':''}"><span class="level-number">${String(i+1).padStart(2,'0')}</span><div class="card-animal">${animal(l.animal)}</div><span class="level-info"><strong>${l.title}</strong><small>${i<3?l.total+' 片，一起分袋':'每盤 '+l.size+' 片，一起烤'}</small></span><span class="card-arrow">${completed.includes(i)?'✓':'↗'}</span></button>`).join('')}</div><p class="map-note">每一站都可以自由探索。建議依順序玩，讓發現慢慢長大。</p></section>`;
 else {const l=LEVELS[state.level];main.innerHTML=`<section class="game-shell"><div class="game-nav"><button class="quiet" data-action="map">← 森林地圖</button><span>第 ${state.level+1} 站 / 6</span><button class="quiet" data-action="retry">↻ 重新試試</button></div><div class="mission"><div class="mission-animal">${animal(l.animal)}</div><div><span class="eyebrow">${state.level<3?'分袋小幫手':'烤盤小達人'} · 第 ${state.level+1} 站</span><h1>${l.title}</h1><p>${l.story}</p><div class="goal"><span>這次的小任務</span> ${l.goal}</div></div></div><section class="workbench" aria-label="動手做點心">${workbench(state)}</section><div class="game-foot"><span>沒有扣分，放心試試看。</span><span>✿ ${completed.length} 枚印章</span></div></section>`;}
 if(focus)main.focus({preventScroll:true});
}
function openLevel(n){state=createState(n);screen='game';render(true);window.scrollTo({top:0,behavior:'instant'});}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b||b.disabled)return;
 if(b.dataset.close){document.getElementById(b.dataset.close).close();return;}
 const action=b.dataset.action;
 if(action==='guide'){document.querySelector('#guide-dialog').showModal();return;}
 if(action==='reset'){document.querySelector('#reset-dialog').showModal();return;}
 if(action==='confirm-reset'){completed=[];persist();document.querySelector('#reset-dialog').close();screen='map';render(true);return;}
 if(b.dataset.level!==undefined){openLevel(Number(b.dataset.level));return;}
 if(action==='start'){openLevel(LEVELS.findIndex((_,i)=>!completed.includes(i))<0?0:LEVELS.findIndex((_,i)=>!completed.includes(i)));return;}
 if(action==='map'){screen='map';render(true);return;}
 if(action==='next'){openLevel(state.level+1);return;}
 let event;
 if(b.dataset.choice!==undefined)event={type:'try',value:Number(b.dataset.choice)};
 else if(b.dataset.verify!==undefined)event={type:'verify',value:Number(b.dataset.verify)};
 else if(action==='add'||action==='remove')event={type:'try',value:state.value+(action==='add'?1:-1)};
 else if(['hint','demo','demo-next','retry','predict'].includes(action))event={type:action};
 if(!event)return;
 const before=state.phase;state=transition(state,event);
 if(state.complete&&!completed.includes(state.level)){completed.push(state.level);persist();}
 // Keep the same action focused after DOM replacement, without jumping the page.
 const selector=b.dataset.choice!==undefined?`[data-choice="${b.dataset.choice}"]`:b.dataset.verify!==undefined?`[data-verify="${b.dataset.verify}"]`:`[data-action="${action}"]`;
 render();const target=main.querySelector(selector);if(target&&!target.disabled)target.focus({preventScroll:true});else if(before!==state.phase)main.focus({preventScroll:true});
});
render();persist();
