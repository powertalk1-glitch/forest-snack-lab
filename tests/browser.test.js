// Optional browser test: set PLAYWRIGHT_MODULE to an installed playwright index.mjs.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
test('real mobile walkthrough, demo gate, all six transfers, reload, confirmed reset', {skip:!process.env.PLAYWRIGHT_MODULE}, async()=>{
 const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE));
 const root=resolve('.');
 const server=createServer(async(req,res)=>{try{const path=resolve(root,'.'+decodeURIComponent(req.url==='/'?'/index.html':req.url));if(!path.startsWith(root))throw Error();const data=await readFile(path);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[extname(path)]||'text/plain');res.end(data);}catch{res.statusCode=404;res.end('missing')}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 let browser;
 try {
 browser=await chromium.launch({executablePath:process.env.BROWSER_EXE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const page=await browser.newPage({viewport:{width:360,height:800},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto(`http://127.0.0.1:${server.address().port}/`);assert.equal(response.status(),200,'static game entry exists');
 assert.equal(await page.locator('.scene-caption').innerText(),'森林點心研究室','visible scene lettering is Traditional Chinese');
 await page.locator('[data-action="start"]').click();
 await page.locator('[data-choice="5"]').click();assert.match(await page.locator('.result').innerText(),/剩下 2 片/);
 await page.locator('[data-action="hint"]').click();await page.locator('[data-action="demo"]').click();
 await page.locator('[data-action="demo-next"]').click();assert.equal(await page.locator('[data-action="predict"]').count(),0);
 await page.locator('.workbench [data-action="retry"]').click();
 const answers=[3,6,4,4,5,6], transfers=[4,5,6,5,3,4];
 for(let i=0;i<6;i++){
  if(i<3) await page.locator(`[data-choice="${answers[i]}"]`).click();
  else for(let n=0;n<answers[i];n++)await page.locator('[data-action="add"]').click();
  await page.locator('[data-action="predict"]').click();
  assert.equal(await page.locator('.cookie').count(),0);
  if(i===0){await page.locator('[data-verify="3"]').click();assert.equal(await page.locator('.celebration').count(),0);}
  await page.locator(`[data-verify="${transfers[i]}"]`).click();assert.equal(await page.locator('.celebration').count(),1);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow');
  if(i<5)await page.locator('[data-action="next"]').click();
 }
 await page.locator('.workbench [data-action="map"]').click();assert.match(await page.locator('#progress').innerText(),/6.*6/);
 await page.reload();assert.match(await page.locator('#progress').innerText(),/6.*6/);
 await page.locator('[data-action="guide"]').click();assert.equal(await page.locator('#guide-dialog').evaluate(e=>e.open),true);await page.locator('.primary[data-close="guide-dialog"]').click();
 await page.locator('[data-action="reset"]').click();await page.locator('[data-close="reset-dialog"]').click();assert.match(await page.locator('#progress').innerText(),/6.*6/);
 await page.locator('[data-action="reset"]').click();await page.locator('[data-action="confirm-reset"]').click();assert.match(await page.locator('#progress').innerText(),/0.*6/);
 assert.deepEqual(errors,[]);
 await page.setViewportSize({width:1280,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 // Tablet navigation and denied localStorage remain playable.
 const tablet=await browser.newPage({viewport:{width:768,height:1024}});
 await tablet.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('storage denied')}}));
 await tablet.goto(`http://127.0.0.1:${server.address().port}/`);
 assert.match(await tablet.locator('#save-status').innerText(),/無法儲存/);
 await tablet.locator('[data-level="3"]').click();await tablet.locator('[data-action="add"]').click();
 assert.match(await tablet.locator('.result').innerText(),/3 片/);
 assert.ok(await tablet.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await tablet.locator('[data-action="remove"]').click();assert.match(await tablet.locator('.result').innerText(),/0 片/);
 await tablet.close();
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
});
