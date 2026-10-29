import {LEVELS,group} from './core.js';
export function animal(name='rabbit') {
 const ears=name==='rabbit'?'<ellipse cx="54" cy="42" rx="14" ry="32" fill="#fff3dd"/><ellipse cx="101" cy="42" rx="14" ry="32" fill="#fff3dd"/><ellipse cx="54" cy="41" rx="6" ry="21" fill="#efb1a0"/><ellipse cx="101" cy="41" rx="6" ry="21" fill="#efb1a0"/>':name==='bear'?'<circle cx="39" cy="58" r="20" fill="#bd865e"/><circle cx="116" cy="58" r="20" fill="#bd865e"/>':'<path d="M30 80 25 19 70 58M90 58 130 19 126 84" fill="#d98855" stroke="#95583b" stroke-width="3"/>';
 const color=name==='bear'?'#bd865e':name==='fox'?'#e79a61':'#fff3dd';
 return `<svg class="animal" viewBox="0 0 160 175" aria-hidden="true">${ears}<ellipse cx="79" cy="140" rx="48" ry="31" fill="${color}"/><path d="M42 138 Q80 120 116 138L109 171H49Z" fill="#74a995"/><path d="M58 133V162H99V133" fill="#e6ecce"/><ellipse cx="79" cy="92" rx="58" ry="48" fill="${color}"/><ellipse cx="79" cy="107" rx="35" ry="24" fill="#fff7e7"/><ellipse cx="43" cy="104" rx="10" ry="6" fill="#edab98"/><ellipse cx="115" cy="104" rx="10" ry="6" fill="#edab98"/><circle cx="59" cy="86" r="4" fill="#493a31"/><circle cx="99" cy="86" r="4" fill="#493a31"/><path d="M74 101Q79 96 84 101L79 106Z" fill="#805342"/><path d="M69 111Q79 121 89 111" fill="none" stroke="#805342" stroke-width="3" stroke-linecap="round"/><path d="M24 144Q32 129 43 145M116 145Q126 130 135 144" stroke="${color}" stroke-width="17" stroke-linecap="round"/></svg>`;
}
const cookies = n => Array.from({length:n},()=>'<span class="cookie" aria-hidden="true"><i></i></span>').join('');
const button=(label,action,extra='')=>`<button ${extra} data-action="${action}">${label}</button>`;
export function workbench(s) {
 const l=LEVELS[s.level],factor=l.kind==='factor';
 if(s.phase==='verify') return `<section class="prediction"><span class="eyebrow">小小預測 · 換一份點心</span><h2>換個數量，也會了嗎？</h2><p>${l.verify.prompt}</p><div class="prediction-icon" aria-hidden="true">${animal(l.animal)}</div><p class="gentle">先想一想再點選。這次不先幫你分好喔。</p><div class="choices">${l.verify.choices.map(n=>`<button data-verify="${n}">${n} ${factor?'片／袋':'盤'}</button>`).join('')}</div><p role="status">${s.wrong?'還可以再想想，不急！'+(factor?'用每袋片數 × 袋數，看看是不是總片數。':`每盤 ${l.size} 片，把盤數乘上每盤片數。`):'答對這個新任務，才能得到這一站的點心印章。'}</p></section>`;
 if(s.phase==='complete') return `<section class="celebration"><div class="seal" aria-hidden="true">✿</div><span class="eyebrow">點心印章 +1</span><h2>不只是分好，你也想通了！</h2><p>${factor?`${l.verify.total} 片，每袋 ${l.verify.answer} 片，剛好 ${l.verify.total/l.verify.answer} 袋。<br>${l.verify.answer} 是 ${l.verify.total} 的因數。`:`${l.verify.answer} 盤 × 每盤 ${l.size} 片 = ${l.verify.total} 片。<br>${l.verify.total} 是 ${l.size} 的倍數。`}</p><div class="end-actions">${s.level<5?button('前往下一站 →','next','class="primary"'):button('看看我的森林地圖','map','class="primary"')}${button('再玩這一站','retry','class="quiet"')}</div></section>`;
 let size=factor?s.value:l.size;
 let count=factor?(size?group(l.total,size).groups:0):s.value;
 let remainder=factor?(size?group(l.total,size).remainder:l.total):0;
 if(s.phase==='demo') {count=s.demoStep; remainder=factor?l.total-count*size:0;}
 let board='';
 if(count) board=`<div class="groups">${Array.from({length:count},(_,i)=>`<div class="packet"><div class="cookie-grid">${cookies(size)}</div><span>${factor?'第 '+(i+1)+' 袋':`第 ${i+1} 盤`}</span>${!factor?`<b>累積 ${(i+1)*size} 片</b>`:''}</div>`).join('')}</div>`;
 if(factor&&remainder) board+=`<div class="leftovers"><span>${s.value?'剩下':'還沒分的'} ${remainder} 片</span><div class="cookie-grid">${cookies(remainder)}</div></div>`;
 if(!factor&&!count) board='<div class="empty-tray"><span aria-hidden="true">＋</span><p>烤盤準備好了<br>點「加一盤」，讓香味慢慢累積。</p></div>';
 const total=factor?l.total:count*size;
 let result=s.attempted?(factor?`每袋 ${size} 片 → ${count} 袋，剩下 ${remainder} 片`:`${count} 盤 × 每盤 ${size} 片 = ${total} 片`):'動動手，看看餅乾會怎麼變。';
 if(s.phase==='demo') result=`示範第 ${s.demoStep} 步：${factor?`已裝 ${count} 袋，還有 ${remainder} 片`:`${count} 盤，共 ${total} 片`}。看完請自己再試一次。`;
 let controls='';
 if(s.phase==='demo') controls=`<div class="demo-note">這是慢慢看的示範，不會獲得印章。</div><div class="end-actions">${button('下一步：'+(factor?'裝一袋':'加一盤'),'demo-next',count>=(factor?l.total/l.answer:l.answer)?'disabled':'class="primary"')}${button('換我試試','retry')}</div>`;
 else if(s.phase==='explore') controls=factor?`<p class="control-label">每袋要放幾片？點一個數量，餅乾就會重新分袋。</p><div class="choices">${l.choices.map(n=>`<button data-choice="${n}" aria-pressed="${s.value===n}">${n}<small>片／袋</small></button>`).join('')}</div>`:`<div class="batch-controls">${button('− 拿走一盤','remove',s.value===0?'disabled':'')}<strong>${s.value}<small>盤</small></strong>${button('＋ 加一盤','add',s.value>=6?'disabled':'class="primary"')}</div>`;
 else controls=`<div class="discovery"><span>✦ 你發現了！</span><p>${factor?`${l.total} 片，每袋 ${size} 片，剛好分完。<br><b>${size} 是 ${l.total} 的因數</b>，意思是用 ${size} 片一袋來分 ${l.total} 片，不會有剩下。`:`每盤 ${size} 片，做 ${count} 盤就是 ${total} 片。<br><b>${total} 是 ${size} 的倍數</b>，意思是 ${size} 片一盤，重複 ${count} 盤得到的總片數。`}</p>${button('我懂了，試試新任務 →','predict','class="primary"')}</div>`;
 return `<div class="bench-heading"><div><span class="eyebrow">${factor?'分袋工作臺':'一盤一盤做'}</span><h2>${factor?'每袋一樣多，會剩下嗎？':'每盤固定，總數慢慢長大。'}</h2></div><span class="quantity">${factor?l.total+' 片餅乾':`每盤 ${l.size} 片`}</span></div><div class="board" aria-label="${factor?'餅乾分袋情形':'烤盤與累積片數'}">${board}</div><p class="result" role="status">${result}</p>${controls}${s.phase==='explore'?`<div class="help-row">${button('☀ 給我一點提示','hint','class="quiet"')}${s.hints?button('看一步一步示範','demo','class="quiet"'):''}</div>${s.hints?`<aside class="hint">${l.hint}</aside>`:''}`:''}`;
}
