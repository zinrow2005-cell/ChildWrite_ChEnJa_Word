/* Little Lines Studio V1.46 — 五級國字各新增20字，總計300字／30課 */
(()=>{'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const NS='http://www.w3.org/2000/svg',STORAGE='little-lines-studio-v1',REFERENCE_STORE='little-lines-animcjk-v1';
const ZHUYIN=[...'ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄧㄨㄩㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦ'];
const ZH_OFFICIAL=window.LittleLinesZhuyinOfficial||{bundled:false,entries:{}};
function zhOfficialEntry(c){const e=ZH_OFFICIAL.entries?.[c];return e&&typeof e.svg==='string'&&typeof e.audio==='string'&&e.svg.startsWith('./assets/zhuyin-official/')?e:null}
function updateZhuyinOfficialPanel(){
 const p=$('#zhuyinOfficialPanel');if(!p)return;
 p.classList.toggle('hidden',state.category!=='zhuyin');
 if(state.category!=='zhuyin')return;
 const count=ZHUYIN.filter(c=>zhOfficialEntry(c)).length;
 $('#zhuyinOfficialStatus').textContent=count===37?'✓ 37／37 個官方動畫及發音已內建，可在離線時查看與試聽':`目前已內建 ${count}／37 個官方動畫與音檔；尚未取得的字仍可使用空心字描寫`;
}
function updateZhuyinOfficialPractice(){
 const p=$('#zhOfficialPractice');if(!p)return;
 const show=state.category==='zhuyin'&&state.showingPractice;
 p.classList.toggle('hidden',!show);if(!show)return;
 const ch=currentItem().chars[0],entry=zhOfficialEntry(ch);
 $('#showZhuyinOfficialBtn').disabled=!entry;
 $('#showZhuyinOfficialBtn').textContent=entry?'📖 查看教育部「'+ch+'」正式筆順':'📖 官方筆順尚未內建';
 $('#zhOfficialPracticeStatus').textContent=entry?'✓ 原始官方 SVG 可離線查看':'可從教育部手冊線上核對；不是沒有空心描寫功能';
}
function showZhuyinOfficial(){
 const ch=currentItem().chars[0],entry=zhOfficialEntry(ch);
 if(!entry){toast('這個字尚未內建官方筆順，請使用教育部原始網站核對');return}
 $('#zhOfficialTitle').textContent='教育部「'+ch+'」標準筆順';
 const area=$('#zhOfficialMedia');area.textContent='';
 const object=document.createElement('object');object.type='image/svg+xml';object.data=entry.svg;object.setAttribute('aria-label',ch+' 的教育部 SVG 筆順動畫');area.appendChild(object);
 $('#zhOfficialOverlay').classList.remove('hidden');$('#zhOfficialOverlay').setAttribute('aria-hidden','false');$('#closeZhOfficialBtn').focus();
}
function closeZhuyinOfficial(){const overlay=$('#zhOfficialOverlay');overlay.classList.add('hidden');overlay.setAttribute('aria-hidden','true');$('#zhOfficialMedia').textContent=''}
function replayZhuyinOfficial(){const ch=currentItem().chars[0],entry=zhOfficialEntry(ch);if(!entry)return;const area=$('#zhOfficialMedia');area.textContent='';const object=document.createElement('object');object.type='image/svg+xml';object.data=entry.svg;object.setAttribute('aria-label',ch+' 的教育部筆順動畫');area.appendChild(object)}
const HIRA=[...'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'];
const KATA=[...'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'];
const KANA_ROWS_H=[...'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめも'].map(c=>c);
const H_ROWS=['あいうえお','かきくけこ','さしすせそ','たちつてと','なにぬねの','はひふへほ','まみむめも',['や',null,'ゆ',null,'よ'],'らりるれろ',['わ',null,'を',null,'ん']];
const K_ROWS=['アイウエオ','カキクケコ','サシスセソ','タチツテト','ナニヌネノ','ハヒフヘホ','マミムメモ',['ヤ',null,'ユ',null,'ヨ'],'ラリルレロ',['ワ',null,'ヲ',null,'ン']];
const KANA_ROM=['a','i','u','e','o','ka','ki','ku','ke','ko','sa','shi','su','se','so','ta','chi','tsu','te','to','na','ni','nu','ne','no','ha','hi','fu','he','ho','ma','mi','mu','me','mo','ya','yu','yo','ra','ri','ru','re','ro','wa','wo','n'];
const COLORS=['#eda7a0','#f4b48f','#f6d19a','#e2d58a','#a5ccb0','#83c2b7','#9acddd','#9bb9e6','#b9aedf','#d4aad2','#f2bdc8','#b3d6cf','#c2c0a7','#9eaaa9'];
// 國字學習：五級各 60 字，全部可描寫；開源逐筆依來源有無提供，允許部分匯入與離線封裝。
const HANZI=window.LITTLE_HANZI||{levels:[],lessons:[]};
// 教材多音字：只依目前詞語提供語境讀音，不聲稱單字錄音已人工核對。
const HANZI_CONTEXT_NOTES={
 '長':{other:'ㄓㄤˇ',example:'長大'},'少':{other:'ㄕㄠˋ',example:'少年'},
 '教':{other:'ㄐㄧㄠ',example:'教書'},'樂':{other:'ㄩㄝˋ',example:'音樂'},
 '種':{other:'ㄓㄨㄥˋ',example:'種花'},'傳':{other:'ㄓㄨㄢˋ',example:'傳記'},
 '轉':{other:'ㄓㄨㄢˋ',example:'轉動'},'解':{other:'ㄐㄧㄝˋ',example:'押解'},
 '好':{other:'ㄏㄠˋ',example:'愛好'},'難':{other:'ㄋㄢˋ',example:'災難'}
};
function playHanziContextWord(item){
 if(!item||!item.word)return;
 window.LittleLinesVoice?.play({label:item.word},'hanzi',message=>toast(message));
}
function updateHanziReadBar(item){
 const bar=$('#hanziReadBar'),word=$('#hanziWordListen'),note=$('#hanziReadingNote');
 if(!bar||!word||!note)return;
 const active=state.category==='hanzi'&&!!item?.char;bar.classList.toggle('hidden',!active);word.classList.toggle('hidden',!active);
 if(!active)return;
 word.textContent='🔊 聽詞語：'+item.word;word.setAttribute('aria-label','播放完整詞語 '+item.word);
 const alt=HANZI_CONTEXT_NOTES[item.char];
 note.textContent=item.zhuyin+' · '+item.word+(alt?'｜這個字也可能讀 '+alt.other+'（'+alt.example+'）':'');
 note.title=alt?'本課以 '+item.word+' 的讀音為主，其他詞語可能使用不同發音。':'本課單字使用的注音。';
}

const HANZI_ITEMS=HANZI.lessons.flatMap(lesson=>lesson.characters.map(c=>({...c,label:c.char,chars:[c.char],id:'hanzi:'+c.char})));
const HANZI_TOTAL=HANZI_ITEMS.length;
const HANZI_LEVEL_TOTAL=level=>HANZI_ITEMS.filter(it=>it.level===level).length;
const HANZI_BASE_ITEMS=HANZI_ITEMS.filter(it=>it.level===1);
const HANZI_WORDS=new Set(HANZI_ITEMS.map(it=>it.char));
const HANZI_LEVEL_BY_CHAR=Object.fromEntries(HANZI_ITEMS.map(it=>[it.char,it.level]));
const BUILTIN_HANZI_DEMOS=window.LITTLE_HANZI_PRACTICE||{};
const DEPLOYED_HANZI=window.LITTLE_LINES_HANZI_PACK||{};
function usableDeployedHanzi(c){return !!(HANZI_WORDS.has(c)&&validHanziPaths(c,DEPLOYED_HANZI[c]))}
function hanziPackProgress(){const ready=HANZI_ITEMS.filter(it=>usableDeployedHanzi(it.char)).length;return {ready,total:HANZI_ITEMS.length}};
// V1.16 筆畫數完整性檢查：這只能驗證「有幾筆」，絕不等同筆順已對照教育部。
const HANZI_EXPECTED_STROKES={"一":1,"二":2,"三":3,"十":2,"人":2,"大":3,"小":3,"口":3,"日":4,"月":4,"山":3,"水":4,"火":4,"木":4,"土":3,"田":5,"石":5,"川":3,"天":4,"上":3,"下":3,"中":4,"左":5,"右":5,"手":4,"目":5,"耳":6,"足":7,"心":4,"子":3,"女":3,"父":4,"母":5,"白":5,"牛":4,"羊":6,"生":5,"正":5,"米":6,"八":2};
function hanziStrokeCountOK(c,count){return HANZI_WORDS.has(c)&&Number.isInteger(count)&&(HANZI_EXPECTED_STROKES[c]?count===HANZI_EXPECTED_STROKES[c]:count>=2&&count<=40)}
function validHanziPaths(c,d){return !!(HANZI_WORDS.has(c)&&d&&Array.isArray(d.fills)&&Array.isArray(d.medians)&&hanziStrokeCountOK(c,d.fills.length)&&d.fills.length===d.medians.length&&[...d.fills,...d.medians].every(x=>!!sanitizeSvgPath(x)))}


// V1.25: Import legally obtained AnimCJK graphicsZhHant.txt directly from the user's device.
// The data is *structurally* validated, not certified to match Taiwan MOE pedagogy.
function hanziAvailableReference(c){return validHanziPaths(c,usableDeployedHanzi(c)?DEPLOYED_HANZI[c]:referenceGlyphs[c])}
function hanziLocalPack(){return Object.fromEntries(HANZI_ITEMS.filter(it=>hanziAvailableReference(it.char)).map(it=>[it.char,usableDeployedHanzi(it.char)?DEPLOYED_HANZI[it.char]:referenceGlyphs[it.char]]))}
function hanziPackIntegrity(pack,requireComplete=false){
 const keys=HANZI_ITEMS.map(it=>it.char),valid={},wrong=[];
 for(const c of keys){const d=pack[c];if(!d)continue;
  if(!validHanziPaths(c,d)){wrong.push(c);continue}
  valid[c]={fills:d.fills,medians:d.medians,from:String(d.from||'AnimCJK · graphicsZhHant.txt').slice(0,120)};
 }
 const missing=keys.filter(c=>!valid[c]);
 const distinct=new Set(Object.values(valid).map(x=>JSON.stringify(x.medians))).size;
 const suspicious=Object.keys(valid).length>=10&&distinct<Math.ceil(Object.keys(valid).length*.90);
 const byLevel=HANZI.levels.map((_,i)=>({level:i+1,available:HANZI_ITEMS.filter(it=>it.level===i+1&&valid[it.char]).length,total:HANZI_ITEMS.filter(it=>it.level===i+1).length}));
 return {valid,missing,bad:wrong,available:Object.keys(valid).length,distinct,byLevel,ok:!wrong.length&&!suspicious&&(!requireComplete||!missing.length),suspicious};
}
function parseHanziGraphicsText(raw){
 if(typeof raw!=='string'||raw.length>30_000_000)throw Error('檔案太大或格式不正確');
 const entries=raw.split(/\r?\n/);if(entries.length<40)throw Error('來源行數不足；請匯入完整 graphicsZhHant.txt');
 const candidates={},err=[];
 for(const line of entries){if(!line.trim())continue;let obj;try{obj=JSON.parse(line)}catch{continue}
  const c=obj?.character;if(!HANZI_WORDS.has(c))continue;
  try{
   if(!Array.isArray(obj.strokes)||!Array.isArray(obj.medians)||obj.strokes.length!==obj.medians.length||!hanziStrokeCountOK(c,obj.strokes.length))throw Error('筆畫數不合理或簡單級筆畫數不符');
   const fills=obj.strokes.map(d=>mirrorKanaSvgPath(d));
   const medians=obj.medians.map(points=>{
    if(!Array.isArray(points)||points.length<2||points.length>1500)throw Error('中線資料錯誤');
    return sanitizeSvgPath(points.map((p,i)=>{
     if(!Array.isArray(p)||p.length!==2||p.some(x=>!Number.isFinite(x)||Math.abs(x)>5000))throw Error('座標錯誤');
     return (i?'L':'M')+p[0]+' '+(900-p[1]);
    }).join(' '));
   });
   if(!validHanziPaths(c,{fills,medians}))throw Error('SVG 路徑不完整');
   candidates[c]={fills,medians,from:'AnimCJK · 臺灣繁體開源逐筆參考（非教育部標準認證）'};
  }catch(e){err.push(c+': '+e.message)}
 }
 return {...hanziPackIntegrity(candidates,false),errors:err};
}
function renderHanziPackManager(){
 const el=$('#hanziPackManager');if(!el)return;
 el.classList.toggle('hidden',state.category!=='hanzi');if(state.category!=='hanzi')return;
 const info=hanziPackIntegrity(hanziLocalPack(),false);
 $('#hanziPackCount').textContent=info.available+' / '+HANZI_TOTAL;
 $('#hanziExportBtn').disabled=!info.ok||info.available===0;
 $('#hanziPackMessage').textContent=info.available===0?'目前尚未取得逐筆資料。可匯入 AnimCJK 臺灣繁體原始檔，已有資料才能產生離線網站。':`已取得 ${info.available} / ${HANZI_TOTAL} 字開源逐筆參考。可將已取得的字先打包；其餘仍可空心描寫。此為路徑結構檢查，不是教育部筆順認證。`;
 $('#hanziPackMissing').textContent='分級取得量：'+info.byLevel.map(x=>['簡單','中等','高級','困難','精深'][x.level-1]+x.available+'/'+x.total).join(' · ')+(info.missing.length?'\n尚缺 '+info.missing.length+' 字：'+info.missing.join('、'):'\n五級逐筆參考已取得');
}
async function importHanziSource(event){const file=event.target.files?.[0];event.target.value='';if(!file)return;
 if(file.size>30_000_000){toast('原始資料超過 30 MB，已拒絕匯入');return}
 const button=$('#hanziImportBtn');button.disabled=true;$('#hanziPackMessage').textContent='正在解析五級300字的逐筆來源…';
 try{
  const source=await file.text(),parsed=parseHanziGraphicsText(source);
  if(!parsed.ok||!parsed.available)throw Error('逐筆來源不可靠：'+(parsed.suspicious?'大量相同路徑':parsed.bad.join('、')||parsed.errors.slice(0,3).join('；')||'沒有符合教材的國字'));
  const previous={...referenceGlyphs};Object.assign(referenceGlyphs,parsed.valid);
  if(!persistReferenceCache()){
   Object.keys(referenceGlyphs).forEach(k=>delete referenceGlyphs[k]);Object.assign(referenceGlyphs,previous);
   throw Error('本機儲存空間不足；已保留原本筆順資料。建議在桌機產生離線網站 ZIP。');
  }
  Object.keys(parsed.valid).forEach(c=>referenceFailed.delete(c));
  renderLibrary();renderHanziPackManager();
  toast('成功匯入 '+parsed.available+' / '+HANZI_TOTAL+' 字開源參考，尚缺 '+parsed.missing.length+' 字');
 }catch(e){renderHanziPackManager();$('#hanziPackMessage').textContent='⚠️ '+e.message;toast('匯入未完成：'+e.message)}
 finally{button.disabled=false}
}
// V1.36: Prefer one authentic AnimCJK source download; fall back to verified individual Taiwan SVGs.
// NO stroke paths are generated by this feature. The app never marks this source as MOE-certified.
const hanziBatch={running:false,stopping:false,controller:null,result:null};
const HANZI_GRAPHICS_SOURCES=[
 'https://raw.githubusercontent.com/parsimonhi/animCJK/master/graphicsZhHant.txt',
 'https://cdn.jsdelivr.net/gh/parsimonhi/animCJK@master/graphicsZhHant.txt'
];
function refreshHanziBatchUI(message){
 const run=$('#hanziFetchBtn'),stop=$('#hanziStopFetchBtn'),picker=$('#hanziFetchLevel'),note=$('#hanziFetchStatus');
 if(!run)return;
 run.disabled=hanziBatch.running;stop.disabled=!hanziBatch.running;picker.disabled=hanziBatch.running;
 if(message)note.textContent=message;
}
function mergeValidatedHanziBatch(pack){
 const parsed=hanziPackIntegrity(pack,false);
 if(!parsed.ok||!parsed.available)throw Error('逐筆資料檢查未通過');
 const original={...referenceGlyphs};
 Object.assign(referenceGlyphs,parsed.valid);
 if(!persistReferenceCache()){
  Object.keys(referenceGlyphs).forEach(k=>delete referenceGlyphs[k]);
  Object.assign(referenceGlyphs,original);
  throw Error('瀏覽器儲存空間不足。請改用電腦匯入原始檔並匯出離線 ZIP。');
 }
 for(const ch of Object.keys(parsed.valid))referenceFailed.delete(ch);
 // Never change an active handwritten glyph in the middle of practice.
 if(state.showingPractice&&state.category==='hanzi'){
  const c=currentItem().chars[0];
  if(parsed.valid[c]){
   if(state.strokes.length){deferredPracticeReferences.add(c);syncReferenceReadyControl();updatePaperGuideChip()}
   else{cancelDemo();renderTemplate();updateGuidePanel();updatePaperGuideChip()}
  }
 }
 return parsed.available;
}
async function fetchHanziSourceWithTimeout(url,timeoutMs=17000){
 const ctl=new AbortController();hanziBatch.controller=ctl;
 const timeout=setTimeout(()=>ctl.abort(),timeoutMs);
 try{
  const response=await fetch(url,{signal:ctl.signal,cache:'no-store'});
  if(!response.ok)throw Error('HTTP '+response.status);
  const len=Number(response.headers.get('content-length')||0);
  if(len>30_000_000)throw Error('檔案太大');
  const blob=await response.text();
  if(blob.length>30_000_000)throw Error('原始資料超過 30 MB');
  return blob;
 }finally{clearTimeout(timeout);if(hanziBatch.controller===ctl)hanziBatch.controller=null}
}
async function acquireHanziLevel(){
 if(hanziBatch.running)return;
 const level=Number($('#hanziFetchLevel').value)||1;
 const targets=HANZI_ITEMS.filter(it=>it.level===level);
 const missing=()=>targets.filter(it=>!hanziAvailableReference(it.char));
 const initial=missing();
 if(!initial.length){refreshHanziBatchUI('本級全部字在此裝置已有逐筆參考，可直接產生離線 ZIP。');return}
 if(navigator.onLine===false){refreshHanziBatchUI('裝置目前處於離線狀態，無法取得新筆順。已內建的空心字仍可繼續描寫。');return}
 hanziBatch.running=true;hanziBatch.stopping=false;
 const name=['簡單','中等','高級','困難','精深'][level-1];
 let parsedCount=0,individualSuccess=0,individualFail=[],downloadErrors=[];
 refreshHanziBatchUI(name+'級目前 '+(40-initial.length)+'/40。先嘗試取得 AnimCJK 臺灣繁體原始資料（約 4 MB）…');
 try{
  for(const url of HANZI_GRAPHICS_SOURCES){
   if(hanziBatch.stopping)break;
   try{
    const raw=await fetchHanziSourceWithTimeout(url);
    if(hanziBatch.stopping)break;
    const parsed=parseHanziGraphicsText(raw);
    // Store ALL structurally valid curriculum characters found in the real source.
    // Other levels will benefit from this one successful download.
    if(!parsed.ok||!parsed.available)throw Error('資料未通過基本筆畫／路徑檢查');
    parsedCount=mergeValidatedHanziBatch(parsed.valid);
    break;
   }catch(err){
    downloadErrors.push(err?.name==='AbortError'?'連線逾時或取消':String(err?.message||err).slice(0,100));
   }
  }
  let remaining=missing();
  if(!hanziBatch.stopping&&remaining.length){
   refreshHanziBatchUI('整份資料'+(parsedCount?'已有部分字':'未能取得')+'，改按字補齊；還缺 '+remaining.length+' 字。可隨時停止。');
   let processed=0;
   const queue=[...remaining];
   const work=async()=>{
    while(queue.length&&!hanziBatch.stopping){
     const item=queue.shift();if(!item)break;
     try{await prepareReference(item,true)}catch{}
     if(hanziAvailableReference(item.char))individualSuccess++;
     else individualFail.push(item.char);
     processed++;
     refreshHanziBatchUI(name+'級逐字取得：'+processed+'/'+remaining.length+'；本級已有 '+(targets.length-missing().length)+'/'+targets.length+' 字。');
    }
   };
   await Promise.all([work(),work()]);
  }
  const missingChars=missing().map(it=>it.char);
  hanziBatch.result={level,available:targets.length-missingChars.length,missing:missingChars,stopped:hanziBatch.stopping,sourceErrors:downloadErrors};
  renderHanziPackManager();
  $('#hanziFetchStatus').textContent=(hanziBatch.stopping?'已停止後續下載。':'本輪取得結束。')+name+'級 '+(targets.length-missingChars.length)+'/'+targets.length+' 字可用。'+(missingChars.length?'仍缺 '+missingChars.length+' 字：'+missingChars.join('、')+'。':'本級已齊全。')+' 所有取得路徑僅為開源參考，不代表教育部標準筆順。'+(!parsedCount&&!individualSuccess&&downloadErrors.length?' 整份來源連線情況：'+downloadErrors.slice(0,2).join('；')+'。':'');
  if(state.category==='hanzi'&&!state.showingPractice)renderHanziQuality();
 }catch(err){
  $('#hanziFetchStatus').textContent='取得失敗：'+(err?.message||'未知錯誤')+'。現有字形與練習紀錄不受影響。';
 }finally{
  hanziBatch.running=false;hanziBatch.stopping=false;hanziBatch.controller=null;
  refreshHanziBatchUI();
 }
}
function stopHanziBatch(){
 if(!hanziBatch.running)return;
 hanziBatch.stopping=true;
 if(hanziBatch.controller)hanziBatch.controller.abort();
 refreshHanziBatchUI('已要求停止：不再開始新的字；正在進行的單字下載會在結束後停止。');
}
function exportHanziMissingReport(){
 const rows=['等級,國字,逐筆狀態,來源'];
 for(const item of HANZI_ITEMS){
  const ref=usableDeployedHanzi(item.char)?DEPLOYED_HANZI[item.char]:referenceGlyphs[item.char];
  const ready=validHanziPaths(item.char,ref);
  const source=ready?String(ref.from||'開源參考').replace(/"/g,'""'):'';
  rows.push([item.level,item.char,ready?'有開源逐筆':'缺少逐筆','"'+source+'"'].join(','));
 }
 const blob=new Blob(['\ufeff'+rows.join('\r\n')],{type:'text/csv;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='小小練字樂園_V1.36_國字300字逐筆缺漏.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
}

async function generateHanziSiteZip(){
 const report=hanziPackIntegrity(hanziLocalPack(),false);
 if(!report.ok||!report.available){toast('目前沒有可安全封裝的逐筆參考，或來源資料異常');return}
 const btn=$('#hanziExportBtn');btn.disabled=true;$('#hanziPackMessage').textContent='正在封裝 '+report.available+' 個真實開源逐筆參考…';
 try{const res=await window.LittleLinesOfflineExport.generateHanzi(report.valid);
  $('#hanziPackMessage').textContent='✓ 已產生 '+res.name+'；內建 '+report.available+'/'+HANZI_TOTAL+' 字逐筆參考，其他字可繼續描寫。';toast('已產生分級離線網站：'+report.available+'/'+HANZI_TOTAL);
 }catch(e){$('#hanziPackMessage').textContent='封裝失敗：'+e.message;toast('離線網站封裝失敗：'+e.message)}
 finally{renderHanziPackManager()}
}
function practiceGuideFor(c){return state.category==='hanzi'&&!isHanziIssue(c)&&!referenceFor(c)?BUILTIN_HANZI_DEMOS[c]||null:null}
function referenceOrPracticeCount(c){return referenceFor(c)?.medians.length||practiceGuideFor(c)?.length||strokePaths(c)?.length||0}
const HANZI_REVIEW_KEY='little-lines-hanzi-review-v1';
function safeHanziReview(data){const out={};if(!data||typeof data!=='object')return out;for(const [c,v] of Object.entries(data)){if(HANZI_ITEMS.some(x=>x.char===c)&&['checked','issue'].includes(v))out[c]=v}return out}
function loadHanziReview(){try{return safeHanziReview(JSON.parse(localStorage.getItem(HANZI_REVIEW_KEY)||'{}'))}catch{return {}}}
let hanziReview=loadHanziReview();
function saveHanziReview(){try{localStorage.setItem(HANZI_REVIEW_KEY,JSON.stringify(hanziReview))}catch{}}
function isHanziIssue(c){return hanziReview[c]==='issue'}
function hanziReviewSummary(){return {checked:Object.values(hanziReview).filter(x=>x==='checked').length,issues:Object.values(hanziReview).filter(x=>x==='issue').length,total:HANZI_ITEMS.length}}
let hanziSubview='learn';
let selectedHanziPrint=new Set();
let hanziLesson=0,hanziLevel=1; // 0 = 目前等級全部；1～30 課次篩選
const HANZI_REVISIT_KEY='little-lines-hanzi-revisit-v1';
function loadRevisit(){try{const data=JSON.parse(localStorage.getItem(HANZI_REVISIT_KEY)||'[]');return new Set(Array.isArray(data)?data.filter(c=>HANZI_ITEMS.some(i=>i.char===c)):[])}catch{return new Set()}}
let hanziRevisit=loadRevisit(),hanziRevisitOnly=false,hanziUnmasteredOnly=false;
const HANZI_MASTERY_KEY='little-lines-hanzi-mastered-v1';
function safeHanziMastered(value){return Array.isArray(value)?value.filter(c=>typeof c==='string'&&HANZI_ITEMS.some(it=>it.char===c)).slice(0,HANZI_ITEMS.length):[]}
function loadHanziMastered(){try{return new Set(safeHanziMastered(JSON.parse(localStorage.getItem(HANZI_MASTERY_KEY)||'[]')))}catch{return new Set()}}
let hanziMastered=loadHanziMastered();
function saveHanziMastered(){try{localStorage.setItem(HANZI_MASTERY_KEY,JSON.stringify([...hanziMastered]))}catch{toast('熟練紀錄無法儲存，請匯出備份')}}
let hanziStage='trace'; // trace -> hint -> free; never represents automatic grading
function setHanziStage(stage,notify=true){
 if(state.category!=='hanzi'||!['trace','hint','free'].includes(stage))return;
 cancelDemo();hanziStage=stage;
 state.free=stage==='free';
 $('#traceModeBtn').classList.toggle('selected',!state.free);
 $('#freeModeBtn').classList.toggle('selected',state.free);
 renderTemplate();updateGuidePanel();updatePenControls();syncHanziStage();
 if(notify)toast(({trace:'沿空心字描寫，筆順以已核對教材為準',hint:'提示變淡了！試著自己寫',free:'已隱藏字形，試著自己寫；筆跡仍保留，可按清空重寫'})[stage]);
}
function syncHanziStage(){
 const visible=state.category==='hanzi'&&state.showingPractice;
 const bar=$('#hanziStageBar');if(!bar)return;
 bar.classList.toggle('hidden',!visible);
 if(!visible){svg.classList.remove('study-ghost');return}
 $$('#hanziStageBar [data-stage]').forEach(b=>{const selected=b.dataset.stage===hanziStage;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected))});
 svg.classList.toggle('study-ghost',hanziStage==='hint');
 $('#hanziStageMessage').textContent=hanziStage==='trace'?'第 1 步：看字形描寫':hanziStage==='hint'?'第 2 步：淡淡提示，不顯示箭頭':'第 3 步：隱藏字形，自己寫';
 $('#paperModeTag').textContent=hanziStage==='trace'?'空心描寫':hanziStage==='hint'?'淡提示':'自己寫';
 const canPlay=hanziStage==='trace'&&hasGuides();
 $('#demoBtn').disabled=!canPlay;$('#guidePlay').disabled=!canPlay;
 if(hanziStage!=='trace'){$('#guidePrev').disabled=true;$('#guideNext').disabled=true;}
}
function updateHanziMasteryQuick(){
 const b=$('#hanziMasteryBtn');if(!b)return;
 const show=state.category==='hanzi'&&state.showingPractice;
 b.classList.toggle('hidden',!show);if(!show)return;
 const mastered=hanziMastered.has(currentItem().char);
 b.classList.toggle('selected',mastered);b.setAttribute('aria-pressed',String(mastered));
 b.textContent=mastered?'✓ 家長確認會寫 · 點此取消':'☆ 家長確認：我會寫了';
}
function toggleHanziMastery(){
 if(state.category!=='hanzi'||!state.showingPractice)return;
 const c=currentItem().char;
 if(hanziMastered.has(c)){hanziMastered.delete(c);toast('已取消「'+c+'」的熟練標記')}
 else{hanziMastered.add(c);hanziRevisit.delete(c);saveRevisit();toast('「'+c+'」已標記會寫了（家長判定，非自動評分）')}
 saveHanziMastered();updateHanziMasteryQuick();updateHanziReviewQuick();
}

function saveRevisit(){try{localStorage.setItem(HANZI_REVISIT_KEY,JSON.stringify([...hanziRevisit]))}catch{toast('複習標記無法儲存，請檢查瀏覽器空間')}}
function renderRevisitControls(){
 const arr=HANZI_ITEMS.filter(i=>hanziRevisit.has(i.char));
 $('#hanziReviewCount').textContent='需要再練 '+arr.length+' 字';
 $('#hanziReviewOnlyBtn').classList.toggle('selected',hanziRevisitOnly);
 $('#hanziReviewOnlyBtn').setAttribute('aria-pressed',String(hanziRevisitOnly));
 $('#hanziReviewOnlyBtn').textContent=hanziRevisitOnly?'✓ 顯示複習清單中 · 點此看全部':'⭐ 只看需要再練的字';
 const list=$('#hanziReviewChars');list.replaceChildren();
 if(!arr.length){const empty=document.createElement('span');empty.className='hanzi-review-empty';empty.textContent='目前沒有需要再練的國字，練習時按「☆ 加入複習」就會出現在這裡';list.appendChild(empty)}
 else arr.forEach(it=>{const b=document.createElement('button');b.type='button';b.textContent=it.char;b.title='練習 '+it.char;b.addEventListener('click',()=>{hanziLevel=it.level;hanziLesson=0;hanziRevisitOnly=false;hanziUnmasteredOnly=false;state.items=makeItems('hanzi');const idx=state.items.findIndex(x=>x.char===it.char);if(idx>=0)openPractice(idx)});list.appendChild(b)});
}
function updateHanziReviewQuick(){
 const panel=$('#hanziReviewQuick');const show=state.category==='hanzi'&&state.showingPractice;
 panel.classList.toggle('hidden',!show);if(!show)return;
 const checked=hanziRevisit.has(currentItem().char);const b=$('#markHanziReviewBtn');b.classList.toggle('selected',checked);b.setAttribute('aria-pressed',String(checked));b.textContent=checked?'✓ 已列入複習 · 點此移除':'☆ 加入複習';
}
function toggleHanziReview(){if(state.category!=='hanzi')return;const c=currentItem().char;if(hanziRevisit.has(c))hanziRevisit.delete(c);else{hanziRevisit.add(c);hanziMastered.delete(c);saveHanziMastered()}saveRevisit();updateHanziReviewQuick();updateHanziMasteryQuick();toast(hanziRevisit.has(c)?'已將「'+c+'」加入複習清單':'已從複習清單移除「'+c+'」')}
function fixedHanziSymbol(c,kind='cell'){
 const d=window.OUTLINE_GLYPHS?.[c];if(!d){const txt=document.createElement('span');txt.textContent=c;return txt}
 const el=document.createElementNS('http://www.w3.org/2000/svg','svg');el.setAttribute('viewBox','0 0 200 200');el.setAttribute('aria-hidden','true');el.classList.add('fixed-hanzi','fixed-hanzi-'+kind);
 const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',d);path.setAttribute('fill','currentColor');path.setAttribute('fill-rule','evenodd');el.appendChild(path);return el
}
function renderFixedPracticeTitle(item){const t=$('#practiceTitle');t.replaceChildren();if(state.category==='hanzi'){t.appendChild(fixedHanziSymbol(item.char,'title'));t.setAttribute('aria-label',item.char)}else{t.textContent=item.chars.join('');t.removeAttribute('aria-label')}}
function makeWorksheetSvg(c,isTrace,{miGrid=true}={}){
 const NS='http://www.w3.org/2000/svg',node=(tag,attr,parent)=>{const e=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attr))e.setAttribute(k,v);parent.appendChild(e);return e};
 const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 200 200');svg.setAttribute('aria-hidden','true');
 svg.classList.add('hanzi-print-cell');
 // 米字格使用向量描線，列印時不依賴瀏覽器的「列印背景」選項。
 node('rect',{x:1,y:1,width:198,height:198,fill:'#fff',stroke:'#E4D2CC','stroke-width':1.25},svg);
 if(miGrid){
  node('path',{d:'M100 3V197 M3 100H197',stroke:'#E6CEC7','stroke-width':.85,'stroke-dasharray':'4 6',fill:'none'},svg);
  node('path',{d:'M3 3L197 197 M197 3L3 197',stroke:'#ECDCD6','stroke-width':.78,'stroke-dasharray':'4 7',fill:'none'},svg);
 }
 if(isTrace){const d=window.OUTLINE_GLYPHS?.[c];if(d)node('path',{d,stroke:'#9AAAB6','stroke-width':2.4,fill:'white','fill-rule':'evenodd'},svg);else{const t=node('text',{x:100,y:156,'font-size':144,'text-anchor':'middle','font-family':'sans-serif',fill:'white',stroke:'#9AAAB6','stroke-width':2},svg);t.textContent=c}}
 return svg;
}
// V1.38: A4 橫列鉛筆練習。每個字一整列，左邊名稱，右邊多個田字格。
const HANZI_PRINT_LAYOUTS={small:{size:18,rows:10,cells:9,label:'小格 18mm'},medium:{size:20,rows:9,cells:8,label:'標準 20mm'},large:{size:23,rows:8,cells:7,label:'大格 23mm'}};
function hanziPrintLayout(){
 const original=HANZI_PRINT_LAYOUTS[$('#hanziPrintCellSize')?.value]||HANZI_PRINT_LAYOUTS.small;
 const req=$('#hanziPrintCells')?.value||'auto';
 const cells=req==='auto'?original.cells:Number(req);
 const safeCells=[6,8,10].includes(cells)||req==='auto'?cells:original.cells;
 // A4可列印寬194mm；左方字義21mm、間距1.2mm、格子間隔0.7mm，確保10格也不截斷。
 const fitted=Math.min(original.size,(194-21-1.2-(safeCells-1)*.7-1)/safeCells);
 return {...original,cells:safeCells,actualCellSize:Math.floor(fitted*100)/100,miGrid:$('#hanziPrintMiGrid')?.checked!==false};
}
function syncHanziPrintAdvice(){
 const l=hanziPrintLayout(),checked=selectedHanziPrint.size,repeat=$('#hanziPrintRepeat')?.checked!==false,mi=l.miGrid?'淡米字線':'無輔助線';
 const summary=$('#hanziPrintAdvice');if(summary){summary.textContent=`${l.label}：每字 ${l.cells} 格（前 2 格描寫、後 ${l.cells-2} 格自行練寫）；每格約 ${l.actualCellSize.toFixed(1)} mm，${mi}；每張 A4 建議 ${l.rows} 個字。`+(checked?`目前選 ${checked} 字，列印約 ${Math.ceil(checked/l.rows)} 張 A4`+(checked<l.rows&&repeat?'；會循環複習填滿一頁。':'。'):'請先選字，剛好選滿 '+l.rows+' 字就是一張 A4。')}
 const info=$('#hanziPrintSelection .hanzi-print-summary');if(info)info.textContent=`已選 ${checked} 字｜${l.label} 建議一張選 ${l.rows} 字（超過會自動分頁）`;
 const note=$('#hanziLessonPrintAdvice');if(note)note.textContent=`此格尺寸：每頁 ${l.rows} 字；整課 10 字會列印 ${Math.ceil(10/l.rows)} 張 A4。`;
}
function buildHanziSheet(items,heading){
 if(!items.length){toast('請先選擇要列印的國字');return}
 const sheet=$('#printSheet'),layout=hanziPrintLayout(),fill=$('#hanziPrintRepeat')?.checked!==false;
 sheet.replaceChildren();sheet.className='hanzi-lesson-print hanzi-horizontal-print';
 const all=[...items];if(fill&&all.length<layout.rows){for(let i=all.length;i<layout.rows;i++)all.push(items[i%items.length])}
 for(let start=0;start<all.length;start+=layout.rows){
  const page=document.createElement('article');page.className='hanzi-print-page';page.style.setProperty('--cell-size',layout.actualCellSize+'mm');page.style.setProperty('--page-rows',layout.rows);sheet.appendChild(page);
  const title=document.createElement('div');title.className='hanzi-print-head';
  const h=document.createElement('h1');h.textContent='小小練字樂園 · '+heading;const n=document.createElement('span');n.textContent=`第 ${Math.floor(start/layout.rows)+1} 頁／共 ${Math.ceil(all.length/layout.rows)} 頁`;
  title.append(h,n);page.appendChild(title);
  const p=document.createElement('p');p.className='hanzi-print-info';p.textContent='姓名：______________　日期：______________　由左到右：先描兩格，再自行寫字';page.appendChild(p);
  const grid=document.createElement('div');grid.className='hanzi-worksheet-grid';page.appendChild(grid);
  const part=all.slice(start,start+layout.rows);
  part.forEach((it,j)=>{
   const item=document.createElement('section');item.className='hanzi-worksheet-item';
   const cap=document.createElement('div');cap.className='hanzi-worksheet-caption';
   const big=document.createElement('strong');big.textContent=it.char;
   const zh=document.createElement('span');zh.textContent=it.zhuyin||'';
   const word=document.createElement('small');word.textContent=it.word||'';
   cap.append(big,zh,word);item.appendChild(cap);
   const row=document.createElement('div');row.className='hanzi-worksheet-tiles';
   for(let i=0;i<layout.cells;i++){
    const cell=makeWorksheetSvg(it.char,i<2,{miGrid:layout.miGrid});
    if(i===1)cell.classList.add('second-trace');
    cell.setAttribute('aria-label',i<2?it.char+' 描寫練習':'空白田字格');row.appendChild(cell)
   }
   item.appendChild(row);grid.appendChild(item);
  });
  const foot=document.createElement('div');foot.className='hanzi-print-foot';foot.textContent='♡ 一筆一畫慢慢寫 · 筆順請以老師或核對過的教材為準';page.appendChild(foot);
 }
 document.body.classList.add('printing-hanzi-lesson');
 const clear=()=>{document.body.classList.remove('printing-hanzi-lesson');sheet.className='';window.removeEventListener('afterprint',clear)};
 window.addEventListener('afterprint',clear);window.print();
}
// V1.44: category-aware A4 worksheets. Selection is retained independently by category/variant.
const multiWorksheetSelections=new Map();
function multiWorksheetKey(){return state.category==='japanese'?'japanese:'+state.variant.japanese:state.category==='english'?'english:'+state.variant.english:state.category}
function multiWorksheetItems(){return makeItems(state.category).filter(i=>i.chars&&i.chars.length)}
function multiWorksheetSelected(){const key=multiWorksheetKey();if(!multiWorksheetSelections.has(key))multiWorksheetSelections.set(key,new Set());return multiWorksheetSelections.get(key)}
function multiWorksheetOptions(){
 const size=$('#multiWorksheetSize')?.value||'small';const base=HANZI_PRINT_LAYOUTS[size]||HANZI_PRINT_LAYOUTS.small;
 const cells=$('#multiWorksheetCells')?.value||'auto';const count=cells==='auto'?base.cells:Number(cells);
 const actual=Math.floor(Math.min(base.size,(194-21-1.2-(count-1)*.7-1)/count)*100)/100;
 return {rows:base.rows,cells:count,actualCellSize:actual,traces:Number($('#multiWorksheetTraces')?.value||2),miGrid:$('#multiWorksheetMi')?.checked!==false};
}
function refreshMultiWorksheet(){
 const panel=$('#multiWorksheet');if(!panel)return;
 const active=['numbers','zhuyin','english','japanese'].includes(state.category);panel.classList.toggle('hidden',!active);if(!active)return;
 const picker=$('#multiWorksheetPicker'),custom=$('#multiWorksheetScope').value==='custom';picker.classList.toggle('hidden',!custom);
 const items=multiWorksheetItems(),selected=multiWorksheetSelected();const valid=new Set(items.map(i=>i.id));for(const id of selected)if(!valid.has(id))selected.delete(id);
 const grid=$('#multiWorksheetSymbols');grid.replaceChildren();
 if(custom)items.forEach(it=>{const btn=document.createElement('button');btn.type='button';btn.className='multi-symbol'+(selected.has(it.id)?' selected':'');btn.textContent=it.chars.join('');btn.setAttribute('aria-pressed',String(selected.has(it.id)));btn.title=it.sub||it.label;btn.addEventListener('click',()=>{if(selected.has(it.id))selected.delete(it.id);else selected.add(it.id);refreshMultiWorksheet()});grid.appendChild(btn)});
 const picked=custom?items.filter(i=>selected.has(i.id)).length:items.length,layout=multiWorksheetOptions();const single=$('#multiWorksheetMode').value==='single';
 ['multiWorksheetSize','multiWorksheetCells','multiWorksheetTraces'].forEach(id=>{$('#'+id).closest('label').classList.toggle('hidden',single)});$('#multiWorksheetRepeat').closest('label').classList.toggle('hidden',single);
 $('#multiSelectedCount').textContent='已選 '+selected.size+' 個';$('#multiWorksheetNote').textContent=`${state.category==='numbers'?'數字 0–99':state.category==='zhuyin'?'注音 37 符號':state.category==='english'?(state.variant.english==='upper'?'英文大寫 A–Z':state.variant.english==='lower'?'英文小寫 a–z':'英文大小寫 Aa–Zz'):(state.variant.japanese==='hira'?'平假名 46 字':'片假名 46 字')}｜已選 ${picked} 個｜${single?'全部排在一張 A4（每個字只有 1 個田字描寫格）':`每頁 ${layout.rows} 列、每列 ${layout.cells} 格（前 ${layout.traces} 格描寫），約 ${picked?Math.ceil(picked/layout.rows):0} 張 A4`}。`;
 $('#multiWorksheetPrint').disabled=!picked;
}
function makeMultiWorksheetCell(value,trace,miGrid){
 const s=makeWorksheetSvg('',false,{miGrid});s.classList.add('multi-print-cell');
 if(trace){const ns='http://www.w3.org/2000/svg';const t=document.createElementNS(ns,'text');t.setAttribute('x','100');t.setAttribute('y',value.length>1?'137':'151');t.setAttribute('text-anchor','middle');t.setAttribute('font-size',value.length>1?'105':'141');t.setAttribute('font-weight','500');t.setAttribute('font-family',`"Noto Sans TC", "Noto Sans JP", "Microsoft JhengHei", "Yu Gothic", sans-serif`);t.setAttribute('fill','#b8bdc5');t.textContent=value;s.appendChild(t)}return s;
}
// V1.46: A4 single-page overview, exactly ONE traced square for each symbol.
function printCompactWorksheet(items){
 const sheet=$('#printSheet');sheet.replaceChildren();sheet.className='compact-print-sheet';
 const name=state.category==='numbers'?'數字 0～99':state.category==='zhuyin'?'注音 37 符號':state.category==='english'?'英文'+(state.variant.english==='upper'?'大寫 A～Z':state.variant.english==='lower'?'小寫 a～z':'大小寫 A～Z／a～z'):(state.variant.japanese==='hira'?'日文平假名':'日文片假名');
 const count=items.length,cols=count>=80?10:count>=40?8:count>=30?7:count>=20?6:Math.min(5,Math.max(1,count));
 const rows=Math.ceil(count/cols),page=document.createElement('article');page.className='compact-print-page';page.style.setProperty('--compact-cols',cols);page.style.setProperty('--compact-rows',rows);sheet.appendChild(page);
 const header=document.createElement('div');header.className='compact-print-head';const title=document.createElement('h1');title.textContent='小小練字樂園 · '+name+'練習表';const badge=document.createElement('span');badge.textContent='全字表 · A4 一頁';header.append(title,badge);page.appendChild(header);
 const info=document.createElement('div');info.className='compact-print-info';info.textContent='姓名：________________　日期：________________　每個字只有一格，沿淡灰字描寫';page.appendChild(info);
 const grid=document.createElement('div');grid.className='compact-print-grid';page.appendChild(grid);
 const mi=$('#multiWorksheetMi').checked;
 items.forEach(it=>{const box=document.createElement('div');box.className='compact-symbol';const v=it.chars.join('');
 const square=makeMultiWorksheetCell(v,true,mi);square.setAttribute('aria-label',v+' 描寫田字格');box.appendChild(square);grid.appendChild(box)});
 const foot=document.createElement('div');foot.className='compact-print-foot';foot.textContent='♡ 每天練一點，慢慢寫出漂亮的字';page.appendChild(foot);
 document.body.classList.add('printing-hanzi-lesson');
 const clear=()=>{document.body.classList.remove('printing-hanzi-lesson');sheet.className='';window.removeEventListener('afterprint',clear)};
 window.addEventListener('afterprint',clear);window.print();
}
function printMultiWorksheet(){
 const all=multiWorksheetItems(),selected=multiWorksheetSelected(),custom=$('#multiWorksheetScope').value==='custom';const items=custom?all.filter(i=>selected.has(i.id)):all;
 if(!items.length){toast('請先選擇要列印的字');return}
 if($('#multiWorksheetMode').value==='single'){printCompactWorksheet(items);return}
 const layout=multiWorksheetOptions(),fill=$('#multiWorksheetRepeat').checked,chosen=items.slice();
 if(fill&&chosen.length<layout.rows)for(let i=chosen.length;i<layout.rows;i++)chosen.push(items[i%items.length]);
 const sheet=$('#printSheet');sheet.replaceChildren();sheet.className='hanzi-lesson-print hanzi-horizontal-print';
 const name=state.category==='numbers'?'數字':state.category==='zhuyin'?'注音符號':state.category==='english'?'英文'+(state.variant.english==='upper'?'大寫':state.variant.english==='lower'?'小寫':'大小寫'):(state.variant.japanese==='hira'?'日文平假名':'日文片假名');
 const pages=Math.ceil(chosen.length/layout.rows);
 for(let start=0;start<chosen.length;start+=layout.rows){
  const page=document.createElement('article');page.className='hanzi-print-page';page.style.setProperty('--cell-size',layout.actualCellSize+'mm');page.style.setProperty('--page-rows',layout.rows);sheet.appendChild(page);
  const heading=document.createElement('div');heading.className='hanzi-print-head';const h=document.createElement('h1');h.textContent='小小練字樂園 · '+name+'練習表';const n=document.createElement('span');n.textContent=`第 ${Math.floor(start/layout.rows)+1} 頁／共 ${pages} 頁`;heading.append(h,n);page.appendChild(heading);
  const info=document.createElement('p');info.className='hanzi-print-info';info.textContent='姓名：______________　日期：______________　先描寫，再從左到右自己練習';page.appendChild(info);
  const grid=document.createElement('div');grid.className='hanzi-worksheet-grid';page.appendChild(grid);
  chosen.slice(start,start+layout.rows).forEach(it=>{
   const value=it.chars.join(''),line=document.createElement('section');line.className='hanzi-worksheet-item';const cap=document.createElement('div');cap.className='hanzi-worksheet-caption';const main=document.createElement('strong');main.textContent=value;cap.appendChild(main);if(it.sub){const sub=document.createElement('small');sub.textContent=it.sub;cap.appendChild(sub)}line.appendChild(cap);
   const tiles=document.createElement('div');tiles.className='hanzi-worksheet-tiles';for(let x=0;x<layout.cells;x++){const cell=makeMultiWorksheetCell(value,x<layout.traces,layout.miGrid);if(x===layout.traces-1)cell.classList.add('second-trace');tiles.appendChild(cell)}line.appendChild(tiles);grid.appendChild(line);
  });const foot=document.createElement('div');foot.className='hanzi-print-foot';foot.textContent='♡ 每天練一點，慢慢寫出漂亮的字';page.appendChild(foot);
 }
 document.body.classList.add('printing-hanzi-lesson');
 const clear=()=>{document.body.classList.remove('printing-hanzi-lesson');sheet.className='';window.removeEventListener('afterprint',clear)};
 window.addEventListener('afterprint',clear);window.print();
}
function initMultiWorksheet(){
 const ids=['multiWorksheetMode','multiWorksheetScope','multiWorksheetSize','multiWorksheetCells','multiWorksheetTraces','multiWorksheetMi','multiWorksheetRepeat'];ids.forEach(id=>$('#'+id).addEventListener('change',refreshMultiWorksheet));
 $('#multiSelectAll').addEventListener('click',()=>{const selected=multiWorksheetSelected();multiWorksheetItems().forEach(it=>selected.add(it.id));refreshMultiWorksheet()});
 $('#multiSelectNone').addEventListener('click',()=>{multiWorksheetSelected().clear();refreshMultiWorksheet()});
 $('#multiWorksheetPrint').addEventListener('click',printMultiWorksheet);
}
function printHanziLesson(){
 const lesson=HANZI.lessons.find(l=>l.id===Number($('#hanziWorksheetLesson').value));if(!lesson)return;
 buildHanziSheet(lesson.characters,'第 '+lesson.id+' 課｜'+lesson.title);
}

function shownHanziItems(){return HANZI_ITEMS.filter(it=>it.level===hanziLevel&&(!hanziLesson||it.lesson===hanziLesson)&&(!hanziRevisitOnly||hanziRevisit.has(it.char))&&(!hanziUnmasteredOnly||!hanziMastered.has(it.char)))}
// 0-9 的示意式印刷體筆畫路徑。各 path 表示一筆；中央虛線和箭頭隨筆畫生成。
const DIGITS={
 '0':['M60 22 C23 22 25 132 60 132 C96 132 98 22 60 22 Z'],
 '1':['M39 44 L62 22 L62 132'],
 '2':['M29 44 C26 14 92 6 94 44 C96 69 48 104 28 131','M28 131 L96 131'],
 '3':['M29 31 C104 -2 115 67 55 74','M55 74 C115 71 110 154 28 126'],
 '4':['M80 19 L25 96 L98 96','M80 19 L80 135'],
 '5':['M90 21 L39 21 L32 74','M32 74 C106 48 113 150 27 129'],
 '6':['M89 25 C49 22 27 69 31 108 C36 148 98 148 98 106 C98 68 49 73 31 100'],
 '7':['M24 23 L98 23 L50 133'],
 '8':['M61 76 C16 64 21 19 60 19 C103 19 104 63 61 76 C13 89 19 133 60 134 C109 136 112 89 61 76'],
 '9':['M95 63 C94 14 25 10 25 57 C25 98 93 99 95 63','M95 63 C95 106 76 130 42 135']
};
const UPPER={
 A:['M24 135 L60 24 L97 135','M37 94 L85 94'],
 B:['M29 21 L29 135','M29 22 L74 22 C113 22 106 75 70 75 L29 75','M29 75 L78 75 C116 75 112 134 72 134 L29 134'],
 C:['M95 38 C38 1 15 48 19 82 C20 123 55 153 98 119'],
 D:['M28 21 L28 134','M28 21 L66 21 C122 21 126 133 67 134 L28 134'],
 E:['M95 22 L29 22 L29 134 L98 134','M29 78 L85 78'],
 F:['M29 135 L29 22 L99 22','M29 79 L85 79'],
 G:['M101 40 C53 1 18 43 19 80 C20 132 60 152 103 119 L103 87 L70 87'],
 H:['M26 22 L26 134','M97 22 L97 134','M26 79 L97 79'],
 I:['M29 23 L94 23','M60 23 L60 135','M26 135 L97 135'],
 J:['M91 23 L91 111 C91 149 30 147 27 115'],
 K:['M28 22 L28 134','M98 22 L29 81 L100 135'],
 L:['M29 22 L29 135 L99 135'],
 M:['M20 136 L20 22 L61 89 L101 22 L101 136'],
 N:['M24 136 L24 22 L98 136 L98 22'],
 O:['M60 20 C5 20 5 137 60 137 C115 137 115 20 60 20 Z'],
 P:['M27 135 L27 22 L75 22 C116 22 115 82 73 82 L27 82'],
 Q:['M60 20 C5 20 5 137 60 137 C115 137 115 20 60 20 Z','M74 105 L103 141'],
 R:['M27 135 L27 22 L76 22 C118 22 114 82 74 82 L27 82','M66 83 L104 135'],
 S:['M98 37 C54 0 21 22 22 55 C23 80 99 75 100 105 C100 141 57 151 21 121'],
 T:['M21 22 L101 22','M61 22 L61 135'],
 U:['M25 22 L25 97 C25 150 97 151 97 97 L97 22'],
 V:['M22 22 L61 136 L102 22'],
 W:['M15 23 L35 135 L61 66 L86 135 L108 23'],
 X:['M26 23 L99 134','M98 23 L26 134'],
 Y:['M21 23 L60 82 L100 23','M60 82 L60 136'],
 Z:['M23 23 L101 23 L23 134 L101 134']
};
const LOWER={
 a:['M88 77 C75 50 25 57 26 99 C28 143 90 144 90 96 C90 60 31 57 26 96','M90 62 L90 133'],
 b:['M28 20 L28 135','M28 88 C29 50 93 53 95 94 C98 137 31 148 28 110'],
 c:['M91 72 C53 41 24 73 27 100 C30 133 60 147 93 121'],
 d:['M91 20 L91 135','M91 90 C81 50 27 60 27 101 C27 143 89 143 91 102'],
 e:['M27 102 L95 102 C96 66 39 51 28 88 C13 135 65 149 94 124'],
 f:['M83 29 C52 11 47 38 47 60 L47 136','M24 71 L81 71'],
 g:['M92 67 L92 144 C91 173 42 174 29 147','M91 92 C88 58 24 61 25 100 C26 143 89 140 91 107'],
 h:['M28 21 L28 136','M28 93 C28 47 93 45 93 90 L93 136'],
 i:['M60 70 L60 134','M60 31 L60 34'],
 j:['M71 70 L71 140 C71 157 63 168 41 165','M71 31 L71 34'],
 k:['M30 21 L30 134','M90 67 L30 107','M57 93 L97 134'],
 l:['M57 21 L57 134'],
 m:['M18 70 L18 134','M18 92 C19 59 57 57 58 91 L58 134','M58 92 C58 59 99 58 101 92 L101 134'],
 n:['M29 70 L29 135','M29 90 C29 49 94 53 94 91 L94 135'],
 o:['M61 63 C15 61 15 141 61 139 C107 140 107 61 61 63 Z'],
 p:['M28 69 L28 162','M28 92 C28 57 94 53 96 98 C97 142 29 145 28 102'],
 q:['M92 69 L92 162','M92 94 C92 55 27 56 26 101 C26 144 91 143 92 107'],
 r:['M30 70 L30 135','M30 97 C32 72 53 63 91 65'],
 s:['M91 72 C47 48 20 70 31 90 C39 104 98 94 92 119 C86 145 48 146 24 125'],
 t:['M53 37 L53 113 C53 136 67 139 90 128','M25 70 L88 70'],
 u:['M27 67 L27 108 C27 148 94 144 94 109 L94 67','M94 109 L94 135'],
 v:['M24 68 L61 136 L99 68'],
 w:['M17 68 L37 136 L62 88 L84 136 L106 68'],
 x:['M25 68 L99 136','M97 68 L27 136'],
 y:['M23 68 L61 133 L98 68','M61 133 L42 166'],
 z:['M27 69 L98 69 L27 135 L99 135']
};
// 開源筆畫路徑由 AnimCJK 提供（https://github.com/parsimonhi/animCJK）。
// 首次需要網路；每個成功載入的字符路徑都快取在本機，其後可離線使用。
const REFERENCE_BASE='https://raw.githubusercontent.com/parsimonhi/animCJK/master/';
const referenceGlyphs=loadReferenceCache(),referencePending=new Map(),referenceFailed=new Set();
// V1.35: lock the visible template while the child is writing; do not swap font/path under ink.
const deferredPracticeReferences=new Set();
function pendingPracticeReference(c){return state.showingPractice&&currentItem()?.chars?.includes(c)&&deferredPracticeReferences.has(c)}
function syncReferenceReadyControl(){const button=$('#referenceReadyBtn');if(!button)return;const c=state.showingPractice?currentItem()?.chars?.[0]:null;const show=!!c&&pendingPracticeReference(c);button.classList.toggle('hidden',!show);button.disabled=!show;button.setAttribute('aria-label',show?'套用剛下載好的逐筆字形（不清除已畫的筆跡）':'目前沒有待套用資料');}
function applyDeferredPracticeReference(){if(!state.showingPractice)return;const c=currentItem()?.chars?.[0];if(!pendingPracticeReference(c))return;
 deferredPracticeReferences.delete(c);cancelDemo();renderTemplate();updateGuidePanel();updatePaperGuideChip();updateHanziAlignmentControls();updateStrokeCount();syncReferenceReadyControl();
 $('#demoBtn').disabled=!hasGuides();$('#demoBtn').textContent=hasGuides()?'▶ 播放描寫示範':'! 尚無逐筆示範';
 toast('已切換為開源逐筆字形，原有畫筆保留；如需重新描寫可按「清空」');}

const bundledKana=window.LITTLE_LINES_KANA_OFFLINE||{};
// The deployed offline package is loaded before app.js, requiring no external network.
const deployedKana=window.LITTLE_LINES_KANA_PACK||{};
const KANA_ALL=[...HIRA,...KATA],KANA_SETS={hira:HIRA,kata:KATA};
let kanaBulkBusy=false;

const referenceErrors=new Map();
function loadReferenceCache(){try{const x=JSON.parse(localStorage.getItem(REFERENCE_STORE)||'{}');return x&&typeof x==='object'?x:{}}catch{return {}}}
function persistReferenceCache(){try{localStorage.setItem(REFERENCE_STORE,JSON.stringify(referenceGlyphs));return true}catch(e){console.warn('筆順快取空間不足',e);return false}}
// V1.22: 用資料多樣性辨認「每個字都長得一樣」的測試假資料。
// 這是來源資料結構防護，不是學校筆順正確性的保證。
function kanaSignature(ref){
 if(!validKanaReference(ref))return '';
 return JSON.stringify([ref.fills,ref.medians]).replace(/[, ]/g,'');
}
function kanaDatasetAudit(dataset,strict=false){
 const keys=Object.keys(dataset).filter(c=>KANA_ALL.includes(c)&&validKanaReference(dataset[c]));
 const distinct=new Set(keys.map(c=>kanaSignature(dataset[c]))).size;
 const threshold=keys.length>=30?Math.ceil(keys.length*.78):keys.length>=10?Math.ceil(keys.length*.72):0;
 const ok=keys.length<10||distinct>=threshold;
 return {ok,count:keys.length,distinct,threshold,warning:ok?'':'筆順圖形重複過多（'+distinct+' 種／'+keys.length+' 字），疑似測試或不完整資料，已拒絕'};
}
// AnimCJK 原始 graphicsJaKana.txt 是每行一個 JSON 物件，共含基本及延伸假名。
// 坐標 y 軸由下向上，因此需轉成 SVG 的向下正軸。支援主要線條指令。
function mirrorKanaSvgPath(d){
 const src=String(d||'');if(!src||src.length>35000)throw Error('路徑長度不正確');
 const toks=src.match(/[a-zA-Z]|[-+]?(?:\d*\.)?\d+(?:[eE][-+]?\d+)?/g)||[];
 const arity={M:2,L:2,T:2,H:1,V:1,C:6,S:4,Q:4,Z:0};let active=null,step=0,out=[],seen=0;
 for(let i=0;i<toks.length;){
  const x=toks[i];if(/^[a-zA-Z]$/.test(x)){active=x;i++;if(active.toUpperCase()==='Z'){out.push(active);active=null;continue;}step=0;}
  if(!active)throw Error('筆畫指令遺失');
  const up=active.toUpperCase(),n=arity[up];if(!n||!Array.isArray(toks.slice(i,i+n))||i+n>toks.length)throw Error('不支援的筆畫指令 '+up);
  const v=toks.slice(i,i+n).map(Number);if(v.some(z=>!Number.isFinite(z)||Math.abs(z)>5000))throw Error('筆畫座標無效');i+=n;
  for(let j=0;j<n;j++){
   const y=up==='V'||up!=='H'&&(up==='C'||up==='S'||up==='Q'||up==='M'||up==='L'||up==='T')&&j%2===1;
   if(y)v[j]=active===up?900-v[j]:-v[j];
  }
  out.push(step===0?active:(up==='M'?(active==='M'?'L':'l'):active),v.join(' '));step++;
  if(++seen>3000)throw Error('SVG 路徑過長');
 }
 return sanitizeSvgPath(out.join(' '))||null;
}
function parseGraphicsJaKana(text){
 const lines=String(text||'').trim().split(/\r?\n/);
 if(lines.length<90||lines.length>300)throw Error('來源筆順行數異常：'+lines.length);
 const parsed={};let skipped=0;
 for(const line of lines){
  if(!line.trim())continue;
  let obj;try{obj=JSON.parse(line)}catch{skipped++;continue}
  const c=obj.character;if(!KANA_ALL.includes(c))continue;
  try{
   if(!Array.isArray(obj.strokes)||!Array.isArray(obj.medians)||obj.strokes.length!==obj.medians.length||!obj.strokes.length||obj.strokes.length>12)throw Error('筆數不合');
   const fills=obj.strokes.map(d=>mirrorKanaSvgPath(d));
   const medians=obj.medians.map(points=>{
    if(!Array.isArray(points)||points.length<2||points.length>200)throw Error('中線座標錯誤');
    const path=points.map((xy,i)=>{
     if(!Array.isArray(xy)||xy.length!==2||xy.some(v=>!Number.isFinite(v)||Math.abs(v)>5000))throw Error('中線座標錯誤');
     return (i?'L':'M')+xy[0]+' '+(900-xy[1]);
    }).join(' ');
    return sanitizeSvgPath(path);
   });
   const ref={fills,medians,from:'AnimCJK · graphicsJaKana.txt（開源參考）'};
   if(validKanaReference(ref))parsed[c]=ref;else skipped++;
  }catch{skipped++}
 }
 // 原始 graphicsJaKana.txt 的「あ」包含分段輪廓，教學筆數和既有已分組三筆不同。
 // 沿用 V1.18 已明確處理的三筆路徑，避免改成四筆。
 if(validKanaReference(bundledKana['あ']))parsed['あ']=bundledKana['あ'];
 const audit=kanaDatasetAudit(parsed,true);
 if(!audit.ok)throw Error(audit.warning);
 if(audit.count!==92)throw Error('官方原始檔解析後只有 '+audit.count+' / 92 字；'+(skipped?'另有 '+skipped+' 筆不相容資料':'請確認下載內容'));
 return parsed;
}
function validKanaReference(raw){
 if(!raw||typeof raw!=='object'||!Array.isArray(raw.fills)||!Array.isArray(raw.medians)||raw.fills.length<1||raw.fills.length>12||raw.fills.length!==raw.medians.length)return false;
 return raw.fills.every(d=>!!sanitizeSvgPath(d))&&raw.medians.every(d=>!!sanitizeSvgPath(d));
}
function preferredKana(c){
 const saved=referenceGlyphs[c],deployed=deployedKana[c],single=bundledKana[c];
 return validKanaReference(deployed)?deployed:validKanaReference(saved)?saved:validKanaReference(single)?single:null;
}
function kanaProgress(){let ready=0,embedded=0,saved=0,deployed=0;
 for(const c of KANA_ALL){
  if(validKanaReference(bundledKana[c])||validKanaReference(deployedKana[c]))embedded++;
  if(validKanaReference(deployedKana[c]))deployed++;
  if(validKanaReference(referenceGlyphs[c]))saved++;
  if(preferredKana(c))ready++;
 }
 return {ready,embedded,saved,deployed,total:KANA_ALL.length,missing:KANA_ALL.filter(c=>!preferredKana(c))};
}
function renderKanaManager(){const panel=$('#kanaPackManager'),stat=$('#kanaPackStatus');if(!panel||!stat)return;
 panel.classList.toggle('hidden',state.category!=='japanese');const p=kanaProgress();
 stat.textContent='可用逐筆 '+p.ready+' / '+p.total+'（網站內建 '+p.embedded+'，本機另存 '+p.saved+'）';
 $('#kanaPackMissing').textContent=p.missing.length?'尚未取得：'+p.missing.join('、'):'✓ 92 個基礎假名已備妥，可離線使用';
 $('#kanaPackDownload').disabled=kanaBulkBusy;$('#kanaPackExport').disabled=p.ready<2;$('#kanaPackImport').disabled=kanaBulkBusy;
 const integrity=kanaDatasetAudit(Object.fromEntries(KANA_ALL.map(c=>[c,preferredKana(c)]).filter(x=>x[1])),true);
 const deploy=$('#kanaDeployZip');if(deploy){deploy.disabled=p.ready!==92||kanaBulkBusy||!integrity.ok;deploy.title=!integrity.ok?integrity.warning:p.ready===92?'下載可直接上傳 GitHub Pages 的完整離線網站':'先取得或匯入尚缺的 '+(92-p.ready)+' 個逐筆資料';}
 const status=$('#kanaDeployStatus');if(status)status.textContent=!integrity.ok?'⚠️ '+integrity.warning+'。請重新下載真實來源。':p.deployed===92?'本網站已包含全部 92 字逐筆資料，其他裝置可直接離線練習。':p.ready===92?'本機已備齊 92 字！請點「產生完整離線網站 ZIP」，一次部署給全部裝置。':'目前尚缺 '+p.missing.length+' 字：可先整套下載或匯入筆順包，齊全後即可產生離線網站 ZIP。';
}
function downloadJsonFile(name,obj){const b=new Blob([JSON.stringify(obj)],{type:'application/json'}),url=URL.createObjectURL(b),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function exportKanaPack(){const entries={};for(const c of KANA_ALL){const ref=preferredKana(c);if(validKanaReference(ref))entries[c]={fills:ref.fills,medians:ref.medians,from:ref.from||'AnimCJK'}}downloadJsonFile('小小練字樂園_日文逐筆離線包.json',{format:'little-lines-kana-pack',version:1,license:Object.values(entries).some(v=>String(v.from).includes('graphicsJaKana'))?'Arphic-Public-License-and-LGPL-3.0-or-later':'LGPL-3.0-or-later',source:'https://github.com/parsimonhi/animCJK',characters:entries});toast('已匯出 '+Object.keys(entries).length+' 個日文筆順資料')}
async function importKanaPack(e){
 const files=[...(e.target.files||[])];e.target.value='';if(!files.length)return;
 const safe={},errors=[];
 for(const file of files){
  try{
   if(file.size>12*1024*1024)throw Error('檔案超過 12 MB');
   const content=await file.text();
   let x=null;try{x=JSON.parse(content)}catch{}
   let batch={};
   if(!x && content.includes('\"character\"')){batch=parseGraphicsJaKana(content)}
   else if(!x)throw Error('JSON 格式錯誤；請使用 AnimCJK graphicsJaKana.txt 或有效的 JSON');
   else 
   if(x?.format==='little-lines-kana-pack'&&x.version===1&&x.characters&&typeof x.characters==='object'){
    for(const [c,v] of Object.entries(x.characters)){
     if(KANA_ALL.includes(c)&&validKanaReference(v))batch[c]={fills:v.fills,medians:v.medians,from:String(v.from||'匯入筆順包').slice(0,90)};
    }
   }else if(Array.isArray(x)){
    // The original kana-svg-data allHiragana.json / allKatakana.json can be imported directly.
    for(const obj of x){
     const code=Number(obj?.charCode);if(!Number.isInteger(code)||code<12000||code>13000)continue;
     const c=String.fromCodePoint(code);if(!KANA_ALL.includes(c))continue;
     try{const r=parseKanaReferenceJson(obj);if(validKanaReference(r))batch[c]=r}catch{}
    }
   }else throw Error('不支援的筆順包格式');
   if(!Object.keys(batch).length)throw Error('沒有有效的基礎假名逐筆資料');
   const audit=kanaDatasetAudit(batch,true);
   if(!audit.ok)throw Error(audit.warning);
   Object.assign(safe,batch);
  }catch(err){errors.push(file.name+'：'+(err.message||'格式錯誤'))}
 }
 const count=Object.keys(safe).length;
 if(!count){toast('匯入失敗：'+(errors[0]||'無有效筆順資料'));return}
 const checked=kanaDatasetAudit(safe,true);if(!checked.ok){toast('匯入被拒絕：'+checked.warning);return}
 const before={...referenceGlyphs};Object.assign(referenceGlyphs,safe);
 if(!persistReferenceCache()){
  Object.keys(referenceGlyphs).forEach(k=>delete referenceGlyphs[k]);Object.assign(referenceGlyphs,before);
  toast('儲存空間不足，舊筆順資料已保留');return;
 }
 for(const c of Object.keys(safe))referenceFailed.delete(c);
 refreshGuideStatuses();renderKanaManager();updateZhuyinOfficialPanel();
 if(state.showingPractice&&state.category==='japanese'){
  cancelDemo();renderTemplate();updateGuidePanel();updatePaperGuideChip();$('#demoBtn').disabled=!hasGuides();
  $('#demoBtn').textContent=hasGuides()?'▶ 播放描寫示範':'! 尚無逐筆示範';
 }
 toast('已匯入 '+count+' 個假名逐筆參考'+(errors.length?'；另有 '+errors.length+' 份檔案格式不合':'')+'。');
}
async function fetchBulkKana(kind){const file=kind==='hira'?'allHiragana.json':'allKatakana.json';const urls=['https://cdn.jsdelivr.net/npm/kana-svg-data@0.0.2/dist/'+file,'https://unpkg.com/kana-svg-data@0.0.2/dist/'+file];let lastError;
 for(const url of urls){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),7000);try{const response=await fetch(url,{cache:'no-cache',signal:controller.signal});if(!response.ok)throw Error('HTTP '+response.status);const json=await response.json();if(!Array.isArray(json)||json.length<40||json.length>110)throw Error('整套筆順資料格式錯誤');const parsed={};for(const obj of json){const c=String.fromCodePoint(Number(obj.charCode||0));if(!KANA_SETS[kind].includes(c))continue;try{const data=parseKanaReferenceJson(obj);if(validKanaReference(data))parsed[c]=data}catch{}}
 if(Object.keys(parsed).length<35)throw Error('整套筆順資料無法解析：有效 '+Object.keys(parsed).length+' 字');return parsed}catch(err){lastError=err}finally{clearTimeout(timer)}}throw lastError||Error('下載失敗')}
async function fetchGraphicsJaKana(){
 const urls=[
  'https://raw.githubusercontent.com/parsimonhi/animCJK/master/graphicsJaKana.txt',
  'https://cdn.jsdelivr.net/gh/parsimonhi/animCJK@master/graphicsJaKana.txt'
 ];let lastError;
 for(const url of urls){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
  try{const response=await fetch(url,{cache:'no-cache',signal:controller.signal});
   if(!response.ok)throw Error('HTTP '+response.status);
   const text=await response.text();if(text.length>5000000)throw Error('來源檔案過大');
   return parseGraphicsJaKana(text);
  }catch(e){lastError=e}finally{clearTimeout(timer)}
 }
 throw lastError||Error('原始來源無法連線');
}
function mergeKanaData(data,source){
 const audit=kanaDatasetAudit(data,true);
 if(!audit.ok)throw Error(source+'：'+audit.warning);
 const before={...referenceGlyphs};Object.assign(referenceGlyphs,data);
 if(!persistReferenceCache()){
  Object.keys(referenceGlyphs).forEach(k=>delete referenceGlyphs[k]);Object.assign(referenceGlyphs,before);
  throw Error('裝置儲存空間不足，舊資料已保留');
 }
 for(const c of Object.keys(data))referenceFailed.delete(c);
 const all=kanaProgress(),fullAudit=kanaDatasetAudit(Object.fromEntries(KANA_ALL.map(c=>[c,preferredKana(c)]).filter(x=>x[1])),true);
 if(!fullAudit.ok)console.warn('裝置已存資料需要檢查',fullAudit.warning);
 return all;
}
async function downloadWholeKanaPack(){
 if(kanaBulkBusy)return;
 kanaBulkBusy=true;renderKanaManager();const btn=$('#kanaPackDownload'),result={};let notices=[];
 try{
  btn.textContent='↓ 下載 AnimCJK 官方假名筆順…';
  try{
   Object.assign(result,await fetchGraphicsJaKana());
   notices.push('AnimCJK 原始整套檔案已取得');
  }catch(err){
   notices.push('原始來源失敗：'+(err.name==='AbortError'?'連線逾時':err.message||'網路錯誤'));
   for(const [kind,label] of [['hira','平假名'],['kata','片假名']]){
    btn.textContent='↓ 嘗試 '+label+' JSON 備援…';
    try{const batch=await fetchBulkKana(kind);const audit=kanaDatasetAudit(batch,true);
     if(!audit.ok)throw Error(audit.warning);
     Object.assign(result,batch);notices.push(label+'備援取得成功');
    }catch(err){notices.push(label+'備援失敗：'+(err.message||'無法連線'))}
   }
  }
  if(Object.keys(result).length){const p=mergeKanaData(result,'下載來源');notices.push('本機現有 '+p.ready+'/92 字');}
  else notices.push('未取得有效筆順資料');
  toast(notices.join('；'));
 }catch(err){toast('資料檢查失敗：'+(err.message||'未知錯誤'))}
 finally{
  kanaBulkBusy=false;btn.textContent='↓ 下載 92 字離線筆順';renderKanaManager();refreshGuideStatuses();
  if(state.showingPractice&&state.category==='japanese'){
   cancelDemo();renderTemplate();updateGuidePanel();updatePaperGuideChip();$('#demoBtn').disabled=!hasGuides();
   $('#demoBtn').textContent=hasGuides()?'▶ 播放描寫示範':'! 尚無逐筆示範';
  }
 }
}

async function generateKanaSiteZip(){
 const p=kanaProgress();if(p.ready!==92){toast('還有 '+(92-p.ready)+' 字尚未取得，無法製作完整離線版');return}
 const check=kanaDatasetAudit(Object.fromEntries(KANA_ALL.map(c=>[c,preferredKana(c)])),true);
 if(!check.ok){toast('已拒絕封裝：'+check.warning);return}
 const exportTool=window.LittleLinesOfflineExport;
 if(!exportTool){toast('打包工具尚未載入，請重新整理');return}
 const entries={};for(const c of KANA_ALL){const v=preferredKana(c);if(!validKanaReference(v)){toast('筆順包驗證未通過：'+c);return}entries[c]={fills:v.fills,medians:v.medians,from:v.from||'AnimCJK'};}
 const btn=$('#kanaDeployZip');btn.disabled=true;btn.textContent='📦 正在打包網站…';
 try{
  const result=await exportTool.generate(entries);
  toast('✓ 已產生含 92 字的完整離線網站：'+result.files+' 個檔案');
 }catch(err){console.error('離線網站封裝失敗',err);toast('封裝失敗：'+(err.message||'請重試'))}
 finally{btn.textContent='📦 產生完整離線網站 ZIP';renderKanaManager();}
}

const saved=loadStore();
function loadPenPrefs(){try{const prefs=JSON.parse(localStorage.getItem('little-lines-pen-v1')||'{}');return {auto:prefs.auto!==false,manual:Number.isFinite(prefs.manual)?Math.max(5,Math.min(100,prefs.manual)):14}}catch{return {auto:true,manual:14}}}
const penPrefs=loadPenPrefs();
const state={category:'numbers',variant:{english:'both',japanese:'hira'},current:0,done:saved.done||{},art:saved.art||{},days:saved.days||{},attempts:saved.attempts||{},guideIndex:0,strokes:[],redo:[],brushColor:'#eda7a0',brushSize:penPrefs.manual,autoPen:penPrefs.auto,autoTargetWidth:14,tool:'pen',free:false,arrows:true,grid:true,activePointer:null,activeStroke:null,items:[],demoTimer:null,showingPractice:false,focus:false,followStep:false,oneStep:false};
let svg=$('#templateSvg');const canvas=$('#drawCanvas'),ctx=canvas.getContext('2d',{alpha:true});
let canvasW=0,canvasH=0,saveTimer=0,toastTimer=0,celebrateTimer=0;
const eraserCursor=$('#eraserCursor');
// 保留舊作品的筆跡資料格式；自動筆寬以 widthRatio 額外儲存，縮放畫板後仍等比例顯示。
const glyphWidthCache=new Map();
const probeCtx=(()=>{try{return document.createElement('canvas').getContext('2d')}catch{return null}})();
function strokeGlyphLocalWidth(char,ref,paths,outlinePath,host){
 if(paths)return 27;  // .ribbon-inner 的 CSS 內框正好是 27 SVG 單位。
 const cacheKey=ref?'reference:'+char:'outline:'+char;
 if(glyphWidthCache.has(cacheKey))return glyphWidthCache.get(cacheKey);
 let thickness=ref?88:19;
 try{
  if(probeCtx&&typeof Path2D!=='undefined'&&ref?.fills?.length&&ref?.medians?.length){
   const fills=ref.fills.map(d=>new Path2D(d));
   const inside=(x,y)=>fills.some(path=>probeCtx.isPointInPath(path,x,y));
   const collected=[];
   ref.medians.forEach(d=>{
    const p=svgEl('path',{d,visibility:'hidden'},host);
    try{
     const length=p.getTotalLength();if(length<3)return;
     for(const f of [.24,.43,.61,.78]){
      const v=p.getPointAtLength(f*length),a=p.getPointAtLength(Math.max(0,f*length-8)),b=p.getPointAtLength(Math.min(length,f*length+8));
      const dx=b.x-a.x,dy=b.y-a.y,norm=Math.hypot(dx,dy)||1,nx=-dy/norm,ny=dx/norm;
      if(!inside(v.x,v.y))continue;
      const probe=sign=>{let distance=0;for(let k=5;k<195;k+=5){if(!inside(v.x+nx*k*sign,v.y+ny*k*sign))break;distance=k}return distance};
      const width=probe(1)+probe(-1)+5;if(width>25&&width<240)collected.push(width);
     }
    }catch{}finally{p.remove()}
   });
   if(collected.length>=2){collected.sort((a,b)=>a-b);thickness=collected[Math.floor(collected.length*.43)]}
  }else if(probeCtx&&typeof Path2D!=='undefined'&&outlinePath){
   const path=new Path2D(outlinePath.getAttribute('d')),
     box=outlinePath.getBBox(),runs=[];
   const scan=(cross,along,stepCross,stepAlong,horiz)=>{
    for(let c=cross[0]+stepCross;c<cross[1]-stepCross;c+=stepCross){let n=0;
     for(let t=along[0];t<=along[1]+stepAlong;t+=stepAlong){
      const hit=t<=along[1]&&probeCtx.isPointInPath(path,horiz?t:c,horiz?c:t);
      if(hit)n++;else if(n){const r=n*stepAlong;if(r>=5&&r<80)runs.push(r);n=0}
     }
    }
   };
   scan([box.y,box.y+box.height],[box.x,box.x+box.width],9,2.5,true);
   scan([box.x,box.x+box.width],[box.y,box.y+box.height],9,2.5,false);
   if(runs.length>5){runs.sort((a,b)=>a-b);thickness=runs[Math.floor(runs.length*.48)]}
  }
 }catch(error){console.debug('字形筆寬估算改用安全預設',error)}
 thickness=Math.max(ref?35:9,Math.min(ref?155:35,thickness));
 glyphWidthCache.set(cacheKey,thickness);
 return thickness;
}
function updateAutoPenWidth(){
 if(!state.showingPractice)return;
 // getScreenCTM 同時考慮雙位數、英文字母大小寫、手機寬度與 SVG meet 留白。
 const figures=[...svg.querySelectorAll('svg[data-ink-width]')];
 const widths=figures.map(fig=>{const matrix=fig.getScreenCTM();return matrix?Number(fig.dataset.inkWidth)*Math.hypot(matrix.a,matrix.b):0}).filter(v=>Number.isFinite(v)&&v>0);
 if(widths.length){widths.sort((a,b)=>a-b);state.autoTargetWidth=Math.max(5,Math.min(135,widths[0]*.96))}
 updatePenControls();
}
function usesAutoPen(){return state.autoPen&&!state.free&&state.tool==='pen'}
function penWidth(){return usesAutoPen()?state.autoTargetWidth:state.brushSize}
function updatePenControls(){
 const automatic=state.autoPen&&!state.free;
 const box=$('#autoPenWidth'),slider=$('#brushSize');if(!box||!slider)return;
 box.checked=state.autoPen;
 slider.disabled=automatic&&state.tool==='pen';
 slider.value=state.brushSize;
 $('#brushSizeLabel').textContent=automatic&&state.tool==='pen'?'自動 '+Math.round(state.autoTargetWidth)+' px':state.brushSize+' px';
 $('#brushModeHint').textContent=automatic?'已依目前字形內框自動調整':state.free?'自由寫字：使用手動粗細':'手動調整粗細';
}
function savePenPrefs(){try{localStorage.setItem('little-lines-pen-v1',JSON.stringify({auto:state.autoPen,manual:state.brushSize}))}catch{}}

function eraserWidth(){return Math.max(22,state.brushSize*1.6)}
function updateEraserPreview(){
 const size=eraserWidth();eraserCursor.style.width=size+'px';eraserCursor.style.height=size+'px';
 $('#eraserSizeDot').style.width=Math.min(size,56)+'px';$('#eraserSizeDot').style.height=Math.min(size,56)+'px';
 $('#eraserSizeText').textContent=Math.round(size)+' px';
 $('#eraserInfo').classList.toggle('hidden',state.tool!=='eraser');
 if(state.tool!=='eraser')eraserCursor.classList.remove('visible');
 canvas.style.cursor=state.tool==='eraser'?'none':'crosshair';
}
function moveEraserCursor(e){if(state.tool!=='eraser'||!state.showingPractice)return;
 const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
 eraserCursor.style.left=Math.max(0,Math.min(rect.width,e.clientX-rect.left))+'px';
 eraserCursor.style.top=Math.max(0,Math.min(rect.height,e.clientY-rect.top))+'px';
 eraserCursor.classList.add('visible');
}
function hideEraserCursor(e){if(e&&state.activePointer===e.pointerId)return;eraserCursor.classList.remove('visible')}

function loadStore(){try{const v=JSON.parse(localStorage.getItem(STORAGE)||'{}');return v&&typeof v==='object'?v:{}}catch{return {}}}
function saveNow(){clearTimeout(saveTimer);try{localStorage.setItem(STORAGE,JSON.stringify({done:state.done,art:state.art,days:state.days,attempts:state.attempts}))}catch{toast('儲存空間不足，請先匯出完成的圖片')}}
function queueSave(){clearTimeout(saveTimer);saveTimer=setTimeout(saveNow,320)}
function currentItem(){return state.items[state.current]||state.items[0]}
function makeItems(category){if(category==='numbers')return Array.from({length:100},(_,i)=>({label:String(i),chars:[...String(i)],id:'numbers:'+i}));if(category==='zhuyin')return ZHUYIN.map(c=>({label:c,chars:[c],id:'zhuyin:'+c}));if(category==='english'){const v=state.variant.english;return [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map((c,i)=>{const lc=c.toLowerCase();return {label:v==='lower'?lc:c,sub:v==='both'?lc:'',chars:v==='both'?[c,lc]:[v==='upper'?c:lc],id:'english:'+v+':'+c}})}if(category==='hanzi')return shownHanziItems();const v=state.variant.japanese,chars=v==='hira'?HIRA:KATA;return chars.map((c,i)=>({label:c,chars:[c],sub:KANA_ROM[i],id:'japanese:'+v+':'+c}))}
function categoryName(){return {numbers:'數字練習',zhuyin:'注音符號',english:'英文 ABC',japanese:'日文假名',hanzi:'繁體國字'}[state.category]}
function setCategory(category){persistCurrent();window.LittleLinesVoice?.stop();$('#guideAuditBtn').setAttribute('aria-expanded','false');$('#guideAuditPanel').classList.add('hidden');state.category=category;state.current=0;state.free=false;$('#traceModeBtn').classList.add('selected');$('#freeModeBtn').classList.remove('selected');svg.classList.remove('study-ghost');state.items=makeItems(category);state.showingPractice=false;cancelDemo();renderLibrary();showView(false)}
function closePracticeTools(){document.body.classList.remove('practice-tools-open');const shade=$('#toolBackdrop');if(shade)shade.classList.add('hidden');const b=$('#openToolBtn');if(b)b.setAttribute('aria-expanded','false');}
function togglePracticeTools(open){const active=typeof open==='boolean'?open:!document.body.classList.contains('practice-tools-open');document.body.classList.toggle('practice-tools-open',active);$('#toolBackdrop').classList.toggle('hidden',!active);$('#openToolBtn').setAttribute('aria-expanded',String(active));if(active)$('#closeToolBtn').focus({preventScroll:true});else $('#openToolBtn').focus({preventScroll:true});}
function showView(practice){stopMyReplay({skipRestore:true});if(!practice){deferredPracticeReferences.clear();syncReferenceReadyControl()}closePracticeTools();document.body.classList.toggle('practice-open',practice);state.showingPractice=practice;$('#libraryView').classList.toggle('hidden',practice);$('#practiceView').classList.toggle('hidden',!practice);$('#breadcrumb').textContent=practice?'正在描寫 '+currentItem().label:categoryName();window.scrollTo({top:0,behavior:'instant'});if(practice){renderPractice();resizeCanvas();updateEraserPreview()}else hideEraserCursor()}
function renderHanziMasteryHub(){
 const stats=$('#hanziMasteryStats'),review=$('#hanziUnmasteredBtn');if(!stats||!review)return;
 const done=HANZI_ITEMS.filter(i=>state.done[i.id]).length;
 const remaining=HANZI_ITEMS.length-hanziMastered.size;
 stats.textContent=`描寫過 ${done}／${HANZI_ITEMS.length}　·　家長確認會寫 ${hanziMastered.size}／${HANZI_ITEMS.length}　·　尚未熟練 ${remaining} 字`;
 review.classList.toggle('selected',hanziUnmasteredOnly);
 review.setAttribute('aria-pressed',String(hanziUnmasteredOnly));
 review.textContent=hanziUnmasteredOnly?'✓ 只看尚未熟練 · 點此看全部':'🌱 只看尚未熟練的字';
}
// V1.32: visible curriculum audit, not a claim of verified pronunciation or official stroke order.
const HANZI_PHONETIC_RE=/^˙?[ㄅ-ㄩㄚ-ㄦ]+[ˊˇˋ]?$/u;
function getHanziQualityRows(){
 const seen=new Set(),out=[];
 for(const item of HANZI_ITEMS){
  const problems=[];
  if(seen.has(item.char))problems.push('重複國字');seen.add(item.char);
  if(!String(item.word||'').includes(item.char))problems.push('詞語未包含本字');
  if(!HANZI_PHONETIC_RE.test(item.zhuyin||''))problems.push('注音格式需要確認');
  if(!String(item.meaning||'').trim())problems.push('缺少字義');
  const shape=window.OUTLINE_GLYPHS?.[item.char];
  if(typeof shape!=='string'||shape.length<35||!/^M/i.test(shape))problems.push('固定字形遺失');
  if(!HANZI.lessons.some(l=>l.id===item.lesson&&l.characters.some(c=>c.char===item.char)))problems.push('課程關聯錯誤');
  const strokes=hanziAvailableReference(item.char);
  out.push({char:item.char,level:item.level,lesson:item.lesson,zhuyin:item.zhuyin,word:item.word,meaning:item.meaning,problems,strokes,review:hanziReview[item.char]||'unchecked'});
 }
 return out;
}
function renderHanziQuality(){
 const root=$('#hanziQualityPanel');if(!root||state.category!=='hanzi')return;
 const rows=getHanziQualityRows(),issue=rows.filter(x=>x.problems.length),stroke=rows.filter(x=>x.strokes).length,review=rows.filter(x=>x.review==='checked').length;
 $('#hanziQualityMini').textContent=`字形 ${rows.length-rows.filter(x=>x.problems.includes('固定字形遺失')).length}/${HANZI_TOTAL} · 資料異常 ${issue.length}`;
 const stats=$('#hanziQualityStats');stats.replaceChildren();
 for(const [value,title,desc] of [[(rows.length-issue.length)+'/ '+rows.length,'教材資料符合格式','不等於逐字人工核對'],[stroke+'/ '+rows.length,'可用開源逐筆','不代表教育部認證'],[review+'/ '+rows.length,'家長已比對','依家長手動標記']]){
   const div=document.createElement('div');div.className='hanzi-quality-stat';const a=document.createElement('b');a.textContent=value;const b=document.createElement('strong');b.textContent=title;const c=document.createElement('small');c.textContent=desc;div.append(a,b,c);stats.append(div);
 }
 const level=$('#hanziQualityLevel').value,filter=$('#hanziQualityFilter').value;
 const found=rows.filter(x=>(level==='all'||x.level===Number(level))&&(filter==='all'||filter==='issues'&&x.problems.length||filter==='stroke'&&!x.strokes||filter==='available'&&x.strokes||filter==='review'&&x.review==='unchecked'));
 $('#hanziQualityCount').textContent=`顯示 ${found.length} / ${rows.length} 字 · ${issue.length} 字有資料格式問題 · ${rows.length-stroke} 字尚無開源逐筆參考`;
 const grid=$('#hanziQualityGrid');grid.replaceChildren();
 for(const it of found){const b=document.createElement('button');b.type='button';b.className='hanzi-quality-char'+(it.problems.length?' issue':'')+(it.strokes?' has-strokes':'');
  b.title=`${it.char}｜${it.zhuyin}｜${it.word}\n${it.problems.length?it.problems.join('、'):'內容格式檢查通過'}\n${it.strokes?'有開源逐筆參考':'尚無開源逐筆'}`;
  b.setAttribute('aria-label',b.title);
  const glyph=document.createElement('strong');glyph.textContent=it.char;const word=document.createElement('small');word.textContent=it.word;const status=document.createElement('span');status.textContent=it.problems.length?'! 資料異常':it.strokes?'✓ 有逐筆':'僅空心字';b.append(glyph,word,status);
  b.addEventListener('click',()=>{
   hanziLevel=it.level;hanziLesson=0;hanziRevisitOnly=false;hanziUnmasteredOnly=false;state.items=shownHanziItems();
   const idx=state.items.findIndex(v=>v.char===it.char);if(idx>=0)openPractice(idx);
  });grid.appendChild(b);
 }
}
function exportHanziQuality(){
 const rows=getHanziQualityRows();const summary={version:'1.42',description:'程式資料格式檢查，不代表教育部筆順或實際語音認證',generatedAt:new Date().toISOString(),total:rows.length,formatIssues:rows.filter(x=>x.problems.length).length,availableOpenStrokeReferences:rows.filter(x=>x.strokes).length,entries:rows};
 downloadFile(new Blob([JSON.stringify(summary,null,2)],{type:'application/json;charset=utf-8'}),'小小練字樂園_V1.33_國字教材檢查_'+todayKey()+'.json');toast(HANZI_TOTAL+' 字教材檢查報告已匯出');
}

function syncHanziSubview(){
 const on=state.category==='hanzi',view=on?hanziSubview:'learn';
 document.body.classList.toggle('hanzi-subpage-open',on&&view!=='learn');
 $('#hanziSubnav').classList.toggle('hidden',!on);
 $('#hanziHub').classList.toggle('hidden',!on||view!=='learn');
 $('#hanziPrintPage').classList.toggle('hidden',!on||view!=='print');
 $('#hanziDataPage').classList.toggle('hidden',!on||view!=='data');
 $('#libraryView').querySelector('.library-card').classList.toggle('hidden',on&&view!=='learn');
 $$('#hanziSubnav [data-hanzi-page]').forEach(b=>{
  const active=on&&b.dataset.hanziPage===view;
  b.classList.toggle('selected',active);b.setAttribute('aria-current',active?'page':'false');
 });
 if(on){$('#breadcrumb').textContent=({learn:'繁體國字 · 選字練習',print:'繁體國字 · 練習單列印',data:'繁體國字 · 資料管理'})[view];}
}
function setHanziSubview(view){
 if(!['learn','print','data'].includes(view))return;
 if(state.showingPractice){persistCurrent();cancelDemo();showView(false)}
 if(state.category!=='hanzi')setCategory('hanzi');
 hanziSubview=view;renderLibrary();
 window.scrollTo({top:0,behavior:'instant'});
}
function syncHanziWorksheetOptions(){
 const chooser=$('#hanziWorksheetLesson');if(!chooser)return;
 const selected=chooser.value;
 chooser.replaceChildren();
 HANZI.lessons.forEach(lesson=>{const option=document.createElement('option');option.value=String(lesson.id);option.textContent='第 '+lesson.id+' 課 · '+lesson.title;chooser.appendChild(option)});
 if([...chooser.options].some(o=>o.value===selected))chooser.value=selected;
}
function renderHanziPrintSelection(){
 syncHanziWorksheetOptions();
 const box=$('#hanziPrintSelection');if(!box)return;
 box.replaceChildren();
 const intro=document.createElement('p');intro.className='hanzi-print-summary';intro.textContent='已選 '+selectedHanziPrint.size+' 個字，依課程分組。';box.appendChild(intro);
 HANZI.levels.forEach((level,i)=>{
  const group=document.createElement('details');group.className='hanzi-print-group';group.open=i===0;
  const heading=document.createElement('summary');heading.textContent=level.icon+' '+level.name+'級 · '+HANZI_LEVEL_TOTAL(i+1)+' 字';group.appendChild(heading);
  const chars=document.createElement('div');chars.className='hanzi-print-chargrid';
  HANZI_ITEMS.filter(x=>x.level===i+1).forEach(it=>{
   const b=document.createElement('button');b.type='button';b.textContent=it.char;b.setAttribute('aria-pressed',String(selectedHanziPrint.has(it.char)));
   if(selectedHanziPrint.has(it.char))b.classList.add('selected');
   b.title=it.char+' · '+(it.zhuyin||'')+' · '+(it.word||'');
   b.addEventListener('click',()=>{
    if(selectedHanziPrint.has(it.char))selectedHanziPrint.delete(it.char);
    else if(selectedHanziPrint.size>=30){toast('每次最多選 30 個國字；超過一頁會自動分頁');return}
    else selectedHanziPrint.add(it.char);
    b.classList.toggle('selected',selectedHanziPrint.has(it.char));b.setAttribute('aria-pressed',String(selectedHanziPrint.has(it.char)));
    syncHanziPrintAdvice();
   });chars.appendChild(b);
  });group.appendChild(chars);box.appendChild(group);
 });
 syncHanziPrintAdvice();
}
function printSelectedHanzi(){
 const items=[...selectedHanziPrint].map(c=>HANZI_ITEMS.find(it=>it.char===c)).filter(Boolean);
 buildHanziSheet(items,'自選國字練習單');
}

function renderHanziHub(){syncHanziWorksheetOptions();renderHanziPackManager();if(state.category==='hanzi')renderHanziQuality();
 if(state.category!=='hanzi')return;
 renderRevisitControls();
 renderHanziMasteryHub();
 const selectedWorksheet=[...$('#hanziWorksheetLesson').options].some(o=>o.value===String(hanziLesson))?hanziLesson:(HANZI.lessons.find(l=>l.level===hanziLevel||hanziLevel===1&&!l.level)?.id||1);$('#hanziWorksheetLesson').value=String(selectedWorksheet);
 const levels=$('#hanziLevelList'),lessons=$('#hanziLessonList');levels.replaceChildren();lessons.replaceChildren();
 HANZI.levels.forEach((level,i)=>{const b=document.createElement('button');b.type='button';b.className='hanzi-level'+(i+1===hanziLevel?' active':'');b.disabled=!level.available;b.setAttribute('aria-pressed',String(i+1===hanziLevel));b.setAttribute('aria-label','等級 '+(i+1)+' '+level.name+(level.available?'，已開放':'，尚未開放'));
  const ico=document.createElement('span');ico.className='hanzi-level-icon';ico.textContent=level.icon;
  const title=document.createElement('b');title.textContent='Level '+(i+1)+'｜'+level.name;
  const hint=document.createElement('small');hint.textContent=level.description;
  const status=document.createElement('em');const gradeLessons=HANZI.lessons.filter(l=>l.level===i+1);const firstLesson=gradeLessons[0]?.id,lastLesson=gradeLessons[gradeLessons.length-1]?.id;status.textContent=level.available?'✓ '+HANZI_ITEMS.filter(it=>it.level===i+1).length+' 字 · 第 '+firstLesson+'～'+lastLesson+' 課':'準備中';b.append(ico,title,hint,status);
  b.addEventListener('click',()=>{if(!level.available)return;hanziLevel=i+1;hanziLesson=0;hanziRevisitOnly=false;hanziUnmasteredOnly=false;renderLibrary()});levels.appendChild(b)});
 const levelAll=HANZI_ITEMS.filter(i=>i.level===hanziLevel);const total=levelAll.filter(i=>state.done[i.id]).length;const mastered=levelAll.filter(i=>hanziMastered.has(i.char)).length;$('#hanziLessonCounter').textContent='本級已描寫 '+total+' / '+levelAll.length+' · 已會寫 '+mastered+' / '+levelAll.length;const lessonHeading=$('.hanzi-lesson-head h3');if(lessonHeading)lessonHeading.textContent=(['🌱 簡單級','🌿 中等級','⭐ 高級','🔥 困難級','👑 精深級'][hanziLevel-1]||'國字練習')+' · '+levelAll.length+' 字／'+HANZI.lessons.filter(l=>l.level===hanziLevel||hanziLevel===1&&!l.level).length+' 課';const badge=$('#hanziOfflineStatus');if(badge){badge.classList.remove('hidden');const p=hanziPackProgress(),info=hanziPackIntegrity(hanziLocalPack(),false),by=info.byLevel.find(v=>v.level===hanziLevel);badge.textContent='📘 五級網站內建 '+p.ready+' / '+p.total+' · 此裝置可用 '+info.available+'/'+HANZI_TOTAL+' · 本級 '+(by?.available||0)+'/'+(by?.total||HANZI_LEVEL_TOTAL(hanziLevel))+'（開源參考，非官方認證）';badge.classList.toggle('all-ready',p.ready===p.total)}
 const levelItems=HANZI_ITEMS.filter(it=>it.level===hanziLevel);
 HANZI.lessons.filter(l=>l.level===hanziLevel||(hanziLevel===1&&!l.level)).forEach(lesson=>{const b=document.createElement('button');b.type='button';b.className='hanzi-lesson'+(hanziLesson===lesson.id?' selected':'');b.setAttribute('aria-pressed',String(hanziLesson===lesson.id));
  const title=document.createElement('strong');title.textContent=lesson.id?'第 '+lesson.id+' 課｜'+lesson.title:'本級全部 '+levelItems.length+' 字';
  const desc=document.createElement('small');desc.textContent=lesson.description;
  const examples=document.createElement('span');examples.className='hanzi-mini';examples.textContent=(lesson.characters||[]).map(x=>x.char||x.label).slice(0,8).join(' ');
  const count=document.createElement('span');count.className='hanzi-lesson-count';const ids=lesson.characters||[];count.textContent=ids.filter(c=>state.done['hanzi:'+(c.char||c.label)]).length+' / '+ids.length+' 已描寫 · '+ids.filter(c=>hanziMastered.has(c.char||c.label)).length+' 已會寫';
  b.append(title,desc,examples,count);b.addEventListener('click',()=>{hanziLesson=lesson.id;hanziRevisitOnly=false;hanziUnmasteredOnly=false;state.items=shownHanziItems();renderLibrary()});lessons.appendChild(b)});
}
// V1.34: same-source stroke/outline diagnostics. This is geometric visual QA, NOT Taiwan MOE certification.
let hanziAlignmentVisible=false;
function setHanziAlignmentVisible(value){
 hanziAlignmentVisible=!!value;
 if(!state.showingPractice||state.category!=='hanzi')return;
 cancelDemo();updateHanziAlignmentControls();renderTemplate();updateGuidePanel();
}
function updateHanziAlignmentControls(){
 const btn=$('#hanziAlignmentBtn'),message=$('#hanziAlignmentStatus');if(!btn||!message)return;
 const char=currentItem()?.char,ref=char&&referenceFor(char),issue=char&&isHanziIssue(char);
 btn.disabled=!ref||issue;
 btn.textContent=hanziAlignmentVisible&&ref&&!issue?'✓ 關閉對齊檢視':'🔎 檢視字形與筆畫對齊';
 btn.setAttribute('aria-pressed',String(hanziAlignmentVisible&&!!ref&&!issue));
 if(issue){message.textContent='此字已標記筆順差異，暫停比對示意';return}
 if(!ref){message.textContent='尚無真實逐筆路徑：只能描寫固定空心字；不能進行對齊檢查';return}
 message.textContent=hanziAlignmentVisible?'藍綠色為來源筆畫中線，紅點表示取樣位置可能偏離字形。這是幾何檢視，仍須核對正式筆順。':'已有開源逐筆來源，按下後可查看字形與中線是否一致';
}
function paintStrokeAlignment(nested,reference){
 const group=svgEl('g',{'class':'hanzi-alignment-layer','aria-hidden':'true'},nested);
 let supported=0,inside=0,outside=0;
 reference.medians.forEach((d,i)=>{
  const fill=nested.querySelectorAll('.reference-fill')[i];
  const median=svgEl('path',{d,'class':'hanzi-alignment-center'},group);
  if(!fill||typeof fill.isPointInFill!=='function'||typeof median.getTotalLength!=='function')return;
  let len=0;try{len=median.getTotalLength()}catch{}if(!len)return;
  for(let j=1;j<=9;j++){
   const p=median.getPointAtLength(len*j/10);let valid=false;
   try{valid=fill.isPointInFill(new DOMPoint(p.x,p.y));supported++}catch{continue}
   if(valid)inside++;else{outside++;svgEl('circle',{cx:p.x,cy:p.y,r:9,'class':'hanzi-alignment-outlier'},group)}
  }
 });
 // The result is a geometrical sample only, not a guarantee of correct stroke order.
 const stat=$('#hanziAlignmentStatus');if(stat&&hanziAlignmentVisible){
  stat.textContent=!supported?'已顯示同來源筆畫中線；此瀏覽器不支援自動內外取樣，請人工檢查。':`來源中線與字形取樣：${inside}/${supported} 點在筆畫內，${outside} 點需檢視（非正式筆順認證）`;
 }
}
function renderHanziCompare(item){
 const panel=$('#hanziComparePanel');if(!panel)return;
 const active=state.category==='hanzi';panel.classList.toggle('hidden',!active);if(!active)return;
 const c=item.char,guide=referenceFor(c),offline=BUILTIN_HANZI_DEMOS[c]||[];
 const count=guide?.medians.length||offline.length;
 $('#hanziCompareCount').textContent=count+' 筆 '+(guide?'開源參考':'示意');
 const review=hanziReview[c]||'unchecked';
 $$('#hanziComparePanel [data-review]').forEach(b=>{const selected=b.dataset.review===review;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected))});
 $('#hanziCompareMessage').textContent=review==='issue'?'此字已標記筆順有差異，系統已停用筆順示範':review==='checked'?'家長已記錄比對完成（不代表官方認證）':'請先對照教育部資料，再自行記錄';
 updateHanziAlignmentControls();$('#hanziCompareFoot').textContent=review==='issue'?'孩子仍可練空心字，待重新校正後再恢復箭頭與動畫。':guide?'目前是 AnimCJK 臺灣繁體逐筆參考（'+(usableDeployedHanzi(c)?'網站已內建，離線可用':'本機取得')+'），可能與教育部標準不同；比對結果只儲存於本機。':'目前是未核對的人工描寫示意，請勿把這個箭頭當成教育部標準筆順。';
}
function setHanziReview(value){
 if(state.category!=='hanzi'||!['checked','issue','unchecked'].includes(value))return;
 const item=currentItem(),c=item.char;
 if(value==='unchecked')delete hanziReview[c];else hanziReview[c]=value;
 saveHanziReview();cancelDemo();state.guideIndex=0;
 renderHanziWordInfo(item);renderHanziCompare(item);renderTemplate();updateGuidePanel();updatePaperGuideChip();
 $('#demoBtn').disabled=!hasGuides();$('#demoBtn').textContent=hasGuides()?'▶ 播放描寫示範':'! 筆順待校正';
 $('#practiceInstruction').textContent=value==='issue'?'已標記此字筆順有差異；暫停示範，只保留描寫。':value==='checked'?'已記錄家長比對；仍可按箭頭方向練習。':'尚未核對正式筆順，請先參考教育部資料。';
 toast(value==='issue'?'已暫停這個字的筆順箭頭':value==='checked'?'已儲存家長人工核對紀錄':'已改回尚未核對');
}
function renderHanziWordInfo(item){const box=$('#hanziWordInfo');box.classList.toggle('hidden',state.category!=='hanzi');if(state.category!=='hanzi')return;box.replaceChildren();
 const zh=document.createElement('span');zh.className='hanzi-bopomofo';zh.textContent=item.zhuyin||'';
 const word=document.createElement('strong');word.textContent=item.word||item.label;
 const meaning=document.createElement('span');meaning.textContent=item.meaning||'';
 const grade=document.createElement('span');grade.className='word-tag';grade.textContent=(['🌱 簡單級','🌿 中等級','⭐ 高級','🔥 困難級','👑 精深級'][item.level-1]||'國字練習')+' · 第 '+item.lesson+' 課';
 const guide=document.createElement('span');guide.className='word-tag';const ref=referenceFor(item.char);guide.textContent=ref?'✓ '+ref.medians.length+' 筆開源逐筆參考':BUILTIN_HANZI_DEMOS[item.char]?'✎ '+BUILTIN_HANZI_DEMOS[item.char].length+' 筆方向示意':'✎ 空心字可先描寫';const review=document.createElement('span');review.className='word-tag review-tag';review.textContent=hanziReview[item.char]==='issue'?'! 家長發現筆順差異':hanziReview[item.char]==='checked'?'✓ 家長已比對':'尚未人工核對';const countLabel=document.createElement('span');countLabel.className='word-tag stroke-count-verified';const expect=HANZI_EXPECTED_STROKES[item.char];const observed=referenceFor(item.char)?.medians.length||BUILTIN_HANZI_DEMOS[item.char]?.length||0;countLabel.textContent=expect?(expect+' 畫基準 · '+(expect===observed?'數量符合':'數量待校正')+'（非筆順認證）'):'此級筆順尚未核對 · 可先描寫字形';const wordAudio=document.createElement('button');wordAudio.type='button';wordAudio.className='hanzi-word-audio';wordAudio.textContent='🔊 聽詞語 '+item.word;wordAudio.setAttribute('aria-label','播放詞語 '+item.word);wordAudio.addEventListener('click',()=>window.LittleLinesVoice?.play({label:item.word},'hanzi',message=>toast(message)));box.append(zh,word,meaning,wordAudio,grade,guide,countLabel,review);
}
function countDone(){return state.items.filter(i=>state.done[i.id]).length}
function renderLibrary(){refreshMultiWorksheet();document.body.classList.toggle('hanzi-library',state.category==='hanzi');syncHanziSubview();state.items=makeItems(state.category);$$('.nav-item').forEach(b=>b.classList.toggle('selected',b.dataset.category===state.category));const meta={numbers:['數字練習','0–99','從 0 開始，依照順序寫到 99。每個數字都能反覆練習。','數字表 · 0～99','點選任何一個數字，就能打開練字畫板'],zhuyin:['注音符號','ㄅ–ㄦ','完整 37 個注音符號，認識每一個聲音和字形。','注音表 · 37 個符號','選一個注音符號，用彩色筆慢慢描寫'],english:['英文 ABC','A–Z','從 ABC 到 XYZ，一起練習英文大寫與小寫。','英文字母表 · A～Z','選一個英文字母，練習空心字的筆畫'],japanese:['日文假名','あ–ん','依照五十音表練習 46 個基本平假名或片假名。','日文五十音表','選一個日文假名，練習空心字的形狀'],hanzi:['繁體國字','五大等級','五級各 60 字，共 300 字／30 課，從簡單筆畫到精深國字循序練習。',(['簡單級','中等級','高級','困難級','精深級'][hanziLevel-1]||'國字')+' · '+(hanziLesson?('第 '+hanziLesson+' 課'):'60 字'),'選擇國字描寫，還能聽發音、複習與列印整課練習單']}[state.category];$('#sectionTitle').innerHTML=meta[0]+' <span>'+meta[1]+'</span>';$('#sectionDescription').textContent=meta[2];$('#gridTitle').textContent=meta[3];$('#tableHeading').innerHTML=meta[4]+' <span>↓</span>';
const downloadGuides=$('#downloadGuidesBtn');downloadGuides.classList.toggle('hidden',!isReferenceCategory());downloadGuides.textContent=isReferenceCategory()?'↓ 下載本類逐筆資料':'';downloadGuides.disabled=false;const vSwitch=$('#variantSwitch');vSwitch.innerHTML='';const variants=state.category==='english'?[['both','Aa 大小寫'],['upper','ABC 大寫'],['lower','abc 小寫']]:state.category==='japanese'?[['hira','平假名'],['kata','片假名']]:null;if(variants){vSwitch.classList.remove('hidden');variants.forEach(([value,label])=>{const b=document.createElement('button');b.textContent=label;b.type='button';b.className=state.variant[state.category]===value?'selected':'';b.addEventListener('click',()=>{persistCurrent();state.variant[state.category]=value;state.items=makeItems(state.category);state.current=0;renderLibrary()});vSwitch.appendChild(b)})}else vSwitch.classList.add('hidden');
$('#hanziHub').classList.toggle('hidden',state.category!=='hanzi');renderHanziHub();const list=$('#symbolGrid');list.innerHTML='';list.className='symbol-grid '+({numbers:'numbers-grid',zhuyin:'zhuyin-grid',english:'english-grid',japanese:'japanese-grid',hanzi:'hanzi-grid'}[state.category]);const buildCell=(item,index)=>{const card=document.createElement('div');card.className='symbol-card'+(state.done[item.id]?' done':'');card.dataset.char=item.chars[0];const b=document.createElement('button');b.type='button';b.className='symbol-cell';if(state.category==='hanzi'){b.appendChild(fixedHanziSymbol(item.char,'cell'))}else b.textContent=item.label;if(item.sub){const sub=document.createElement(state.category==='english'?'span':'small');sub.className='symbol-lower';sub.textContent=item.sub;b.appendChild(sub)}b.setAttribute('aria-label','練習 '+item.chars.join(''));b.addEventListener('click',()=>openPractice(index));const s=document.createElement('button');s.type='button';s.className='cell-speak-btn';s.setAttribute('aria-label','播放 '+item.chars.join('')+' 的發音');s.innerHTML='<span class="speak-blob">🔊</span><span>發音</span>';s.addEventListener('click',e=>{e.stopPropagation();speak(item,true)});card.appendChild(b);card.appendChild(s);list.appendChild(card)};
if(state.category==='hanzi'&&!state.items.length){const empty=document.createElement('p');empty.className='hanzi-grid-empty';empty.textContent='尚未標記需要複習的字。請先回到全部字表，在練習頁加入複習。';list.appendChild(empty)}
if(state.category==='japanese'){const rows=state.variant.japanese==='hira'?H_ROWS:K_ROWS;const position={};state.items.forEach((it,i)=>position[it.label]=i);rows.forEach(row=>{for(const c of row){if(c===null){const gap=document.createElement('div');gap.className='symbol-card kana-empty';gap.setAttribute('aria-hidden','true');list.appendChild(gap)}else buildCell(state.items[position[c]],position[c])}})}else state.items.forEach(buildCell);
const count=countDone(),total=state.items.length,percentage=Math.round(count/total*100);$('#progressRatio').textContent=percentage+'%';$('#progressStat').textContent=count+' / '+total;$('#progressPie').style.background=`conic-gradient(#8bbc9f ${percentage}%,#f2f0ed ${percentage}%)`;$('#topStarCount').textContent=Object.keys(state.done).filter(k=>state.done[k]).length;$('#todayCount').textContent=Object.keys(state.days).filter(k=>state.days[k]===todayKey()).length;refreshGuideStatuses();renderKanaManager();updateZhuyinOfficialPanel();
}
function guideCoverage(){
 const items=state.items,chars=[...new Set(items.flatMap(item=>item.chars))];
 const builtIn=state.category==='numbers'||state.category==='english',ready=chars.filter(ch=>builtIn?!!strokePaths(ch):!!referenceFor(ch));
 return {chars,ready,missing:chars.filter(ch=>!ready.includes(ch)),builtIn};
}
function renderGuideAudit(){
 const panel=$('#guideAuditPanel');if(!panel)return;
 const coverage=guideCoverage(),total=coverage.chars.length,complete=coverage.ready.length;
 const demoCount=state.category==='hanzi'?coverage.chars.filter(c=>!!BUILTIN_HANZI_DEMOS[c]).length:0;const embeddedHanzi=state.category==='hanzi'?coverage.chars.filter(usableDeployedHanzi).length:0;
 const reviewStats=hanziReviewSummary();
 const title=coverage.builtIn?'本類提供印刷字筆畫「方向示意」，不是官方標準筆順。':state.category==='hanzi'?'開源逐筆參考 '+complete+' / '+total+'（網站內建 '+embeddedHanzi+'）· 示意 '+demoCount+' / '+total:'逐筆資料取得狀態：'+complete+' / '+total+' 個';
 panel.innerHTML='';
 const strong=document.createElement('strong');strong.textContent=title;panel.appendChild(strong);
 const desc=document.createElement('div');desc.textContent=coverage.builtIn?'每個字都有筆畫線與方向箭頭；部分字的連寫方式會因學校教材不同而不同。':state.category==='hanzi'?'全部 '+HANZI_ITEMS.length+' 字都有空心字。網站內建開源繁體逐筆 '+embeddedHanzi+' 字，本機可用開源參考 '+complete+' 字。未取得的仍只能使用未核對的方向示意。逐筆參考不是教育部認證筆順。':complete===total?'這一類的逐筆資料均已下載到此裝置。':'尚未取得 '+coverage.missing.length+' 個字的逐筆資料。按「下載本類逐筆資料」取得，成功後可離線播放。';panel.appendChild(desc);
 if(state.category==='hanzi'){const a=document.createElement('p');a.className='zh-audit-official';a.textContent='網站已內建 '+hanziPackProgress().ready+'/'+HANZI_TOTAL+' 個開源逐筆參考，五級均可逐字取得或匯入。沒有資料的字僅提供固定空心字描寫，人工示意不能視為正式筆順。';panel.appendChild(a)}
 if(state.category==='zhuyin'){const official=document.createElement('p');official.className='zh-audit-official';const n=ZHUYIN.filter(c=>zhOfficialEntry(c)).length;official.textContent='教育部原始 SVG 動畫＋發音內建 '+n+' / 37 個；這項數字與畫板逐筆參考數量分開計算。';panel.appendChild(official)}
 if(coverage.missing.length){const missing=document.createElement('div');missing.className='missing-list';missing.textContent=(state.category==='hanzi'?'尚無開源逐筆參考（仍有離線示意）：':'缺少：')+coverage.missing.join('、');panel.appendChild(missing)}
 const legend=document.createElement('div');legend.className='audit-legend';legend.textContent=coverage.builtIn?'藍色表示字形方向示意，不代表標準筆順。':state.category==='hanzi'?'簡單級40字的順序箭頭為人工繪製的「描寫方向示意」，並非正式筆順；下載成功的 AnimCJK 臺灣繁體逐筆資料會優先顯示，仍需與教育部版本核對。':'注音：教育部標準筆順另行核對；日文：AnimCJK 逐筆來源。';panel.appendChild(legend);
 if(state.category==='hanzi'){
  const review=document.createElement('section');review.className='audit-review-area';
  const heading=document.createElement('strong');heading.textContent='家長逐字核對：已比對 '+reviewStats.checked+' 字 · 發現差異 '+reviewStats.issues+' 字 · 尚未核對 '+(reviewStats.total-reviewStats.checked-reviewStats.issues)+' 字';review.appendChild(heading);
  const hint=document.createElement('p');hint.textContent='點擊任一字進入畫板，查看教育部網站並記錄核對結果。綠色為家長人工比對，橘色為發現差異；這不是官方自動驗證。';review.appendChild(hint);
  const grid=document.createElement('div');grid.className='audit-review-grid';
  HANZI_ITEMS.forEach(it=>{const b=document.createElement('button');b.type='button';const status=hanziReview[it.char]||'unchecked';b.className='audit-review-char '+status;
    const count=referenceFor(it.char)?.medians.length||BUILTIN_HANZI_DEMOS[it.char]?.length||0;
    b.textContent=it.char;b.title=it.char+' · '+count+' 筆 · '+(status==='checked'?'家長已比對':status==='issue'?'發現差異':'尚未核對');
    b.setAttribute('aria-label',b.title);b.addEventListener('click',()=>{if(hanziLesson&&hanziLesson!==it.lesson){hanziLesson=0;state.items=makeItems('hanzi')}const i=state.items.findIndex(x=>x.char===it.char);openPractice(i>=0?i:0)});grid.appendChild(b)});
  review.appendChild(grid);panel.appendChild(review);
 }
}
function refreshGuideStatuses(){
 const ready=guideCoverage();$('#guideAuditBtn').textContent=ready.builtIn?'✓ 查看筆畫說明':state.category==='hanzi'?'🔎 核對進度 '+hanziReviewSummary().checked+'/'+HANZI_ITEMS.length:'✓ 逐筆檢查 '+ready.ready.length+'/'+ready.chars.length;
 for(const card of $$('#symbolGrid .symbol-card[data-char]')){
  const ch=card.dataset.char;
  card.classList.toggle('guide-unavailable',!ready.builtIn&&!referenceFor(ch)&&!practiceGuideFor(ch));
  card.classList.toggle('guide-demo-only',state.category==='hanzi'&&!referenceFor(ch)&&!!practiceGuideFor(ch));card.classList.toggle('hanzi-offline-ready',state.category==='hanzi'&&usableDeployedHanzi(ch));card.classList.toggle('hanzi-mastered',state.category==='hanzi'&&hanziMastered.has(ch));card.classList.toggle('review-issue',state.category==='hanzi'&&isHanziIssue(ch));card.classList.toggle('review-checked',state.category==='hanzi'&&hanziReview[ch]==='checked');
 }
 renderGuideAudit();
}
function updatePaperGuideChip(){
 const chip=$('#paperGuideChip');if(!chip||!state.showingPractice)return;
 const item=currentItem(),all=item.chars.every(c=>state.category==='numbers'||state.category==='english'?!!strokePaths(c):!!referenceFor(c));
 const fetching=item.chars.some(c=>referencePending.has(c));
 if(state.showingPractice&&pendingPracticeReference(item.chars[0])){chip.textContent='✓ 新筆順已取得 · 待套用';return}
 chip.className='paper-guide-chip'+(state.category==='hanzi'&&isHanziIssue(item.chars[0])?' missing':state.category==='numbers'||state.category==='english'?' schematic':all?'':fetching?' pending':' missing');
 chip.textContent=state.category==='hanzi'&&isHanziIssue(item.chars[0])?'! 筆順待校正':state.category==='numbers'||state.category==='english'?'筆畫方向示意':all?(state.category==='hanzi'&&usableDeployedHanzi(item.chars[0])?'✓ 繁體開源筆順已離線內建':state.category==='japanese'&&(bundledKana[item.chars[0]]||deployedKana[item.chars[0]])?'✓ 已內建逐筆參考':'✓ 已取得開源逐筆資料'):state.category==='hanzi'&&!!practiceGuideFor(item.chars[0])?'✎ 離線描寫方向示意':fetching?'筆順下載中…':referenceFailed.has(item.chars[0])?'! 筆順載入失敗，可重試':'! 尚無逐筆示範';
}
function openPractice(index){stopMyReplay({skipRestore:true});deferredPracticeReferences.clear();syncReferenceReadyControl();if(state.category==='hanzi')hanziStage='trace';state.guideIndex=0;state.current=index;state.strokes=[];state.redo=[];loadCurrent();showView(true)}
function loadCurrent(){const data=state.art[currentItem().id];state.strokes=Array.isArray(data)?JSON.parse(JSON.stringify(data)):[];state.redo=[]}
function persistCurrent(){stopMyReplay();if(!state.showingPractice||!state.items.length)return;state.art[currentItem().id]=JSON.parse(JSON.stringify(state.strokes));queueSave()}
function move(direction){stopMyReplay();if(state.activePointer!==null)return;deferredPracticeReferences.clear();syncReferenceReadyControl();window.LittleLinesVoice?.stop();persistCurrent();const next=state.current+direction;if(next<0||next>=state.items.length){toast(next<0?'已經是第一個字囉':'已經到最後一個字囉');return}state.current=next;if(state.category==='hanzi')hanziStage='trace';state.guideIndex=0;loadCurrent();renderPractice();resizeCanvas();hideEraserCursor();const pad=$('#drawingStage').getBoundingClientRect();if(pad.bottom<80||pad.top>window.innerHeight-80)$('#drawingStage').scrollIntoView({block:'center',behavior:'instant'})}
function renderPractice(){stopMyReplay({skipRestore:true});syncReferenceReadyControl();cancelDemo();hanziAlignmentVisible=false;const item=currentItem();if(state.category==='hanzi'){state.free=hanziStage==='free';$('#traceModeBtn').classList.toggle('selected',!state.free);$('#freeModeBtn').classList.toggle('selected',state.free)}updateHanziReviewQuick();updateHanziMasteryQuick();updateZhuyinOfficialPractice();$('#hanziMetaDrawer').classList.toggle('hidden',state.category!=='hanzi');$('#hanziCompareDrawer').classList.toggle('hidden',state.category!=='hanzi');renderHanziWordInfo(item);renderHanziCompare(item);updateHanziAlignmentControls();state.guideIndex=0;renderFixedPracticeTitle(item);$('#practiceStepLabel').innerHTML=categoryName()+' <span>/</span> 第 '+(state.current+1)+' 個，共 '+state.items.length+' 個';$('#breadcrumb').textContent='正在描寫 '+item.chars.join('');const hasGuide=hasGuides();$('#practiceInstruction').textContent=state.category==='hanzi'&&isHanziIssue(item.chars[0])?'此字已標記筆順有差異：目前僅保留空心字描寫，筆順引導暫停。':state.category==='hanzi'&&!referenceFor(item.chars[0])?item.level>=2?'此字尚無開源逐筆參考，可先用固定空心字進行三階段描寫；連網時可嘗試取得臺灣繁體參考。':'沿著空心字描寫；離線箭頭只是未核對示意，請另核對教育部筆順。':hasGuide?'沿著箭頭的筆畫順序，選喜歡的顏色練習。':'沿著空心字外框慢慢描寫；連網後會嘗試載入逐筆資料。';$('#speakBtn').innerHTML='<span class="speaker-badge">🔊</span><span class="speak-main">聽發音</span><small>'+speechText(item)+'</small>';$('#speakBtn').setAttribute('aria-label','播放 '+speechLabel(item)+' 的發音');updateHanziReadBar(item);$('#arrowSettingHint').textContent=hasGuide?'顯示起筆點、順序及方向':'首次取得筆順資料需要連網';$('#demoBtn').disabled=!hasGuide;$('#demoBtn').textContent=hasGuide?'▶ 播放描寫示範':'⌛ 等待筆順資料';$('#demoBtn').title=hasGuide?(state.category==='hanzi'&&!referenceFor(item.chars[0])?'播放未經官方逐字核對的描寫方向示意':'播放逐筆方向示範'):'尚未取得這個字的逐筆筆順，不播放外框冒充筆順';$('#paperModeTag').textContent=state.free?'自由寫字':'描寫模式';$('#practiceDoneStatus').classList.toggle('finished',!!state.done[item.id]);$('#practiceDoneStatus').textContent=state.done[item.id]?'✓ 已完成練習':'尚未完成';$('#completeBtn').textContent=state.done[item.id]?'✓ 再練一次 ⭐':'✓ 我寫好了 ⭐';$('#prevBtn').disabled=state.current===0;$('#nextBtn').disabled=state.current===state.items.length-1;renderTemplate();updateGuidePanel();syncHanziStage();updatePaperGuideChip();repaintCanvas();updateStrokeCount();prepareReference(item)}
function strokePaths(c){return DIGITS[c]||UPPER[c]||LOWER[c]||null}
function referenceFor(c){
 if(pendingPracticeReference(c))return null;
 const data=state.category==='japanese'?preferredKana(c):state.category==='hanzi'?(usableDeployedHanzi(c)?DEPLOYED_HANZI[c]:referenceGlyphs[c]):referenceGlyphs[c];
 if(!data||!Array.isArray(data.fills)||!Array.isArray(data.medians)||data.fills.length===0||data.fills.length!==data.medians.length)return null;
 // V1.35：國字筆畫數判斷只可用在國字，不能誤擋日文和注音的合法逐筆檔案。
 const countOK=state.category==='hanzi'?hanziStrokeCountOK(c,data.medians.length):data.medians.length<=40;
 if(!countOK||![...data.fills,...data.medians].every(d=>typeof d==='string'&&d.trim().length>3&&!!sanitizeSvgPath(d)))return null;
 return data;
}
function isReferenceCategory(){return ['zhuyin','japanese','hanzi'].includes(state.category)}
function hasGuides(){return currentItem().chars.every(c=>!(state.category==='hanzi'&&isHanziIssue(c))&&!!(referenceFor(c)||practiceGuideFor(c)||strokePaths(c)))}
function guideType(){return isReferenceCategory()?'animcjk':'drawing'}
function sanitizeSvgPath(d){return typeof d==='string'&&d.length<36000&&/^[0-9eE+.,\-\sMmLlHhVvCcSsQqTtAaZz]+$/.test(d)?d:null}
function groupKanaReferenceParts(strokes,medians){
 // SVG split strokes such as 3a and 3b are one pen-down motion, not two independent strokes.
 const groups=new Map();
 for(const s of strokes){const match=String(s.id||'').match(/^(\d+)([a-z]*)$/i);if(!match)continue;
  const id=match[1];if(!groups.has(id))groups.set(id,{fills:[],parts:[]});
  const d=sanitizeSvgPath(s.value);if(d)groups.get(id).fills.push(d);
 }
 for(const m of medians){const match=String(m.id||'').match(/^(\d+)([a-z]*)$/i);if(!match)continue;
  const g=groups.get(match[1]);if(!g)continue;
  let d=typeof m.value==='string'?m.value:Array.isArray(m.value)?m.value.map((p,i)=>Array.isArray(p)&&p.length===2&&(Number.isFinite(p[0]))&&(Number.isFinite(p[1]))?(i?'L':'M')+p[0]+' '+p[1]:'').join(' '):'';
  d=sanitizeSvgPath(d);if(d)g.parts.push({suffix:match[2],d});
 }
 const fills=[],paths=[];
 for(const key of [...groups.keys()].sort((a,b)=>+a-+b)){const g=groups.get(key);if(!g.fills.length||!g.parts.length)continue;
  const first=g.parts.find(p=>!p.suffix)||g.parts.find(p=>p.suffix==='a')||g.parts[0];
  // 同一筆中的 a / b 分段不能丟掉後續部分；依筆畫 ID 拼回連續路線。
  const ordered=[...g.parts].sort((a,b)=>a.suffix.localeCompare(b.suffix));
  let combined='';let previousEnd=null;
  for(const part of ordered){let d=part.d;const match=d.match(/^\s*M\s*([+-]?(?:\d*\.)?\d+)\s*[, ]\s*([+-]?(?:\d*\.)?\d+)/i);
    if(combined&&match){const sx=+match[1],sy=+match[2];d=' L'+sx+' '+sy+' '+d.slice(match[0].length)}
    combined+=(combined?' ':'')+d;
  }
  fills.push(g.fills.join(' '));paths.push(sanitizeSvgPath(combined)||first.d)
 }
 if(!fills.length||fills.length!==paths.length||fills.length>30)throw Error('逐筆資料分段不完整');
 return {fills,medians:paths,from:'AnimCJK (kana grouped)'};
}
function parseKanaReferenceJson(json){
 if(!json||!Array.isArray(json.strokes)||!Array.isArray(json.medians))throw Error('假名資料格式錯誤');
 return groupKanaReferenceParts(json.strokes.map(x=>({id:x.id,value:x.value})),json.medians.map(x=>({id:x.id,value:x.value})))
}
function parseReferenceSvg(xml){const doc=new DOMParser().parseFromString(xml,'image/svg+xml');if(doc.querySelector('parsererror'))throw Error('XML解析失敗');const root=doc.documentElement;
 if(!root||root.localName!=='svg')throw Error('不是SVG筆順資料');
 const fillEls=[...root.querySelectorAll('path[id]')].filter(n=>/^z\d+d\d+[a-z]*$/i.test(n.id));
 const medEls=[...root.querySelectorAll('path[clip-path]')];
 // Regular kanji/Bopomofo SVGs often have one mask and path per stroke.
 // Some kana have 3a/3b segments for one physical stroke: merge their fills and keep one median.
 if(fillEls.length){
  const extracted=fillEls.map(x=>({id:x.id.match(/d(\d+[a-z]*)$/i)?.[1],value:x.getAttribute('d')}));
  const medianData=medEls.map((x,i)=>({id:x.getAttribute('clip-path')?.match(/d(\d+[a-z]*)/i)?.[1]||extracted[i]?.id,value:x.getAttribute('d')}));
  try{return groupKanaReferenceParts(extracted,medianData)}catch(e){
   const fills=fillEls.map(n=>sanitizeSvgPath(n.getAttribute('d'))).filter(Boolean);
   const medians=medEls.map(n=>sanitizeSvgPath(n.getAttribute('d'))).filter(Boolean);
   if(fills.length&&medians.length===fills.length&&fills.length<=30)return {fills,medians,from:'AnimCJK'};
   throw e;
  }
 }
 throw Error('筆順筆畫資料格式不符');
}
async function prepareReference(item,force=false){if(!['zhuyin','japanese','hanzi'].includes(item.id.split(':')[0]))return;
 const c=item.chars[0];if(referenceFor(c))return;
 if(!force&&referenceFailed.has(c))return;
 if(referencePending.has(c))return referencePending.get(c);
 const cat=item.id.split(':')[0];const folder=cat==='zhuyin'?'svgsZhHansZoo':cat==='hanzi'?'svgsZhHant':'svgsJaKana';
 referenceErrors.delete(c);$('#referenceStatus').textContent='正在取得逐筆資料…';
 // Pending registration MUST happen before any UI refresh and be cleared before final status refresh.
 const task=(async()=>{try{
  const code=c.codePointAt(0),path=folder+'/'+code+'.svg';
  const jsonFolder=cat==='japanese'?(KATA.includes(c)?'katakana':'hiragana'):null;
  const sources=[];
  if(jsonFolder)sources.push({url:'https://cdn.jsdelivr.net/npm/kana-svg-data/dist/'+jsonFolder+'/'+encodeURIComponent(c)+'.json',type:'json'});
  sources.push({url:REFERENCE_BASE+path,type:'svg'});
  sources.push({url:'https://cdn.jsdelivr.net/gh/parsimonhi/animCJK@master/'+path,type:'svg'});
  let ref=null,lastError=null;
  for(const source of sources){const ctl=new AbortController();const timeout=setTimeout(()=>ctl.abort(),4500);
   try{const response=await fetch(source.url,{cache:'force-cache',signal:ctl.signal});if(!response.ok)throw Error('HTTP '+response.status);
    const content=await response.text();if(content.length>140000)throw Error('資料過大');
    ref=source.type==='json'?parseKanaReferenceJson(JSON.parse(content)):parseReferenceSvg(content);
    if(!ref||ref.medians.length<1)throw Error('無有效筆順');break;
   }catch(e){lastError=e}finally{clearTimeout(timeout)}
  }
  if(!ref)throw lastError||Error('無可用逐筆資料');
  if(cat==='hanzi'&&!hanziStrokeCountOK(c,ref.medians.length))throw Error('開源參考筆畫數與臺灣筆畫數不同');
  // If the child has already started drawing on an older outline, keep the same SVG until explicitly applied.
  if(state.showingPractice&&currentItem().id===item.id&&(state.strokes.length>0||cat==='hanzi'))deferredPracticeReferences.add(c);
  referenceGlyphs[c]=ref;persistReferenceCache();referenceFailed.delete(c);
  return true;
 }catch(error){referenceFailed.add(c);referenceErrors.set(c,error?.message||'無法取得資料');console.info('筆順來源載入失敗',c,error?.message);return false;
 }finally{
  // Refresh AFTER pending disappears, or the status chip can stay "筆順下載中…" forever.
  referencePending.delete(c);
  if(state.showingPractice&&currentItem().id===item.id){
   if(pendingPracticeReference(c)){syncReferenceReadyControl();$('#referenceStatus').textContent='✓ 新來源已下載；正在書寫，字形保持不變。點「套用新筆順」後切換。';updatePaperGuideChip()}
   else {
    if(state.category==='hanzi'){renderHanziWordInfo(item);renderHanziCompare(item)}
    cancelDemo();renderTemplate();updateGuidePanel();updatePaperGuideChip();
    $('#demoBtn').disabled=!hasGuides();$('#demoBtn').textContent=hasGuides()?'▶ 播放描寫示範':'! 尚無逐筆示範';
    if(referenceFor(c))$('#practiceInstruction').textContent='沿著逐筆箭頭練習描寫；開源筆順仍請家長核對教材。';
   }
  }
  if(state.category===cat)refreshGuideStatuses();
 }} )();
 referencePending.set(c,task);updatePaperGuideChip();return task;
}
function svgEl(tag,attrs={},parent=svg){const el=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));parent.appendChild(el);return el}
// 對每個起筆點配置「不重疊的編號牌」，細線指回真正起點。
// 所有幾何值皆在各字形自身的 viewBox 中計算，單/雙位數及平板可等比縮放。
function renderStartLabels(layer,starts,maxX,maxY,reference){
 const radius=reference?31:8.4,pad=radius+3,minGap=2*radius+(reference?10:3),placed=[];
 const center={x:maxX/2,y:maxY/2};
 for(const item of starts){
  const point=item.point,ang0=Math.atan2(point.y-center.y,point.x-center.x);
  let best=null;
  for(const dist of [radius+11,radius*2+12,radius*3+18,radius*4+20,radius*5+20]){
   for(let a=0;a<32;a++){
    const angle=ang0+(a%2===0?1:-1)*Math.ceil(a/2)*Math.PI/16;
    const tx=point.x+dist*Math.cos(angle),ty=point.y+dist*Math.sin(angle);
    if(tx<pad||tx>maxX-pad||ty<pad||ty>maxY-pad)continue;
    let score=dist*.12+(1-Math.cos(angle-ang0))*3.3;
    for(const p of placed){const separation=Math.hypot(tx-p.x,ty-p.y);
      if(separation<minGap)score+=5000+Math.pow(minGap-separation,2)*5;
      else if(separation<minGap*1.5)score+=((minGap*1.5-separation)/minGap)*5;
    }
    // 避免擋在其他筆畫的起點上。
    for(const other of starts){if(other===item)continue;const d=Math.hypot(tx-other.point.x,ty-other.point.y);if(d<radius+7)score+=8+(radius+7-d)*3}
    if(best===null||score<best.score)best={x:tx,y:ty,score};
   }
  }
  // 筆畫極密時，依序試著塞入可用方格，避免編號直接疊放。
  if(!best||best.score>4000){for(let yy=pad;yy<=maxY-pad;yy+=minGap){for(let xx=pad;xx<=maxX-pad;xx+=minGap){const score=Math.hypot(xx-point.x,yy-point.y)*.2+placed.reduce((a,b)=>a+(Math.hypot(xx-b.x,yy-b.y)<minGap?9000:0),0);if(!best||score<best.score)best={x:xx,y:yy,score}}}}
  if(!best)best={x:pad,y:pad};placed.push(best);
  const group=svgEl('g',{'class':'guide-label','data-step':item.step},layer);
  svgEl('line',{x1:point.x,y1:point.y,x2:best.x,y2:best.y,'class':'guide-leader'},group);
  svgEl('circle',{cx:point.x,cy:point.y,r:reference?10:2.9,'class':'guide-origin'},group);
  svgEl('circle',{cx:best.x,cy:best.y,r:radius,'class':'start-dot'+(reference?' reference-start':'')},group);
  svgEl('text',{x:best.x,y:best.y,'class':'start-num'+(reference?' reference-num':'')},group).textContent=String(item.step+1);
 }
}
function addGuideArrow(parent,path,reference,step){
 const d=path.getAttribute('d'),elem=svgEl('path',{d,'class':'guide-line'+(reference?' reference-guide':''),'data-step':step},parent);
 try{const len=elem.getTotalLength();if(!len)return null;
  const origin=elem.getPointAtLength(Math.min(reference?30:9,len*.07)),at=elem.getPointAtLength(len*.67),prev=elem.getPointAtLength(Math.max(0,len*.67-(reference?11:3))),next=elem.getPointAtLength(Math.min(len,len*.67+(reference?11:3)));
  const angle=Math.atan2(next.y-prev.y,next.x-prev.x),sz=reference?24:6;
  const pts=[[at.x+sz*Math.cos(angle),at.y+sz*Math.sin(angle)],[at.x+sz*.92*Math.cos(angle+2.42),at.y+sz*.92*Math.sin(angle+2.42)],[at.x+sz*.92*Math.cos(angle-2.42),at.y+sz*.92*Math.sin(angle-2.42)]];
  svgEl('polygon',{points:pts.map(p=>p.join(',')).join(' '),'class':'arrow-tri','data-step':step},parent);
  return origin;
 }catch(e){console.warn('筆畫箭頭渲染失敗',e);return null}
}
function renderTemplate(){
 // V1.38 雙緩衝：新字完整建立（包括箭頭、測量）後才替換舊字。
 const oldSvg=svg,newSvg=oldSvg.cloneNode(false);
 newSvg.style.visibility='hidden';oldSvg.parentNode.appendChild(newSvg);svg=newSvg;
 svg.classList.toggle('study-ghost',state.category==='hanzi'&&hanziStage==='hint');
 const mobile=window.matchMedia('(max-width:720px)').matches,w=mobile?460:760,h=mobile?520:440;
 svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.classList.toggle('single-step',state.oneStep&&!state.free);svg.innerHTML='';svgEl('rect',{x:0,y:0,width:w,height:h,fill:'#fffdfa'});
 if(state.grid){const padx=mobile?23:38,pady=mobile?37:31,iw=w-2*padx,ih=h-2*pady;
  svgEl('rect',{x:padx,y:pady,width:iw,height:ih,class:'grid-shade',stroke:'#f2e2dc','stroke-width':1.3});
  svgEl('path',{d:`M${w/2} ${pady}V${h-pady} M${padx} ${h/2}H${w-padx}`,class:'grid-mid'});
  svgEl('path',{d:`M${padx} ${pady}L${w-padx} ${h-pady} M${w-padx} ${pady}L${padx} ${h-pady}`,class:'grid-line'});
  for(let i=1;i<=2;i++){const yy=pady+ih*(i/3);svgEl('line',{x1:padx,y1:yy,x2:w-padx,y2:yy,class:'grid-line'})}}
 if(state.free){oldSvg.remove();newSvg.style.visibility='';updatePenControls();return}
 const chars=currentItem().chars,dual=chars.length>1;let totalStrokeIndex=0;
 chars.forEach((char,i)=>{
  let x,y,cw,ch;if(mobile){y=94;cw=dual?207:320;ch=dual?324:345;x=dual?23+i*207:70}
  else{y=47;cw=dual?230:294;ch=dual?328:338;x=dual?148+i*235:233}
  const flagged=state.category==='hanzi'&&isHanziIssue(char);
  const reference=flagged?null:referenceFor(char),offline=flagged?null:practiceGuideFor(char),paths=flagged?null:strokePaths(char);
  const viewBox=reference?'0 0 1024 1024':paths?'0 0 120 160':'0 0 200 200';
  const nested=svgEl('svg',{x,y,width:cw,height:ch,viewBox,'preserveAspectRatio':'xMidYMid meet'});
  const starts=[];
  if(reference){
   // 外框 + 中線直接使用同一份來源資料；不要另疊字型或人工輪廓造成錯位。
   reference.fills.forEach(d=>svgEl('path',{d,class:'reference-fill'},nested));
   reference.medians.forEach((d,idx)=>svgEl('path',{d,class:'reference-median','data-step':totalStrokeIndex+idx},nested));
   if(state.category==='hanzi'&&hanziAlignmentVisible)paintStrokeAlignment(nested,reference);
   if(state.arrows){reference.medians.forEach(d=>{
    const marker=svgEl('path',{d,class:'marker-source',visibility:'hidden'},nested);
    const step=totalStrokeIndex++;const origin=addGuideArrow(nested,marker,true,step);
    marker.remove();if(origin)starts.push({point:origin,step});
   });renderStartLabels(nested,starts,1024,1024,true)}
  }else if(offline){
   // 本地順序示意與印刷字形為兩層；不覆蓋正式字形，也不冒充已核對的標準筆順。
   const outline=(window.OUTLINE_GLYPHS||{})[char];
   if(outline)svgEl('path',{d:outline,class:'glyph-fill-outline'},nested);
   offline.forEach((d,idx)=>svgEl('path',{d,class:'offline-median','data-step':totalStrokeIndex+idx},nested));
   if(state.arrows){offline.forEach(d=>{
    const path=svgEl('path',{d,visibility:'hidden'},nested);
    const step=totalStrokeIndex++;const origin=addGuideArrow(nested,path,false,step);
    path.remove();if(origin)starts.push({point:origin,step});
   });renderStartLabels(nested,starts,200,200,false)}
  }else if(paths){
   paths.forEach(d=>{svgEl('path',{d,class:'ribbon-under'},nested);svgEl('path',{d,class:'ribbon-inner'},nested)});
   if(state.arrows){paths.forEach(d=>{
    const marker=svgEl('path',{d,class:'marker-source',visibility:'hidden'},nested);
    const step=totalStrokeIndex++;const origin=addGuideArrow(nested,marker,false,step);
    marker.remove();if(origin)starts.push({point:origin,step});
   });renderStartLabels(nested,starts,120,160,false)}
  }else{const d=(window.OUTLINE_GLYPHS||{})[char];if(d){svgEl('path',{d,class:'glyph-fill-outline'},nested)}else svgEl('text',{x:100,y:150,'text-anchor':'middle','font-size':'158','font-weight':'900',fill:'white',stroke:'#9faeb9','stroke-width':'3'},nested).textContent=char}
  const outline=nested.querySelector('.glyph-fill-outline');
  nested.dataset.inkWidth=strokeGlyphLocalWidth(char,reference,paths,outline,nested);
 });
 oldSvg.remove();newSvg.style.visibility='';
 updateAutoPenWidth();
}
function resizeCanvas(){stopMyReplay({skipRestore:true});const r=canvas.getBoundingClientRect(),newW=Math.max(1,Math.round(r.width)),newH=Math.max(1,Math.round(r.height));if(newW===canvasW&&newH===canvasH)return;canvasW=newW;canvasH=newH;const ratio=Math.min(2.5,window.devicePixelRatio||1);canvas.width=Math.round(newW*ratio);canvas.height=Math.round(newH*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);repaintCanvas();updateAutoPenWidth()}
function drawStroke(context,stroke,width,height){if(!stroke||!Array.isArray(stroke.points)||!stroke.points.length)return;context.save();context.globalCompositeOperation=stroke.eraser?'destination-out':'source-over';context.strokeStyle=stroke.color||'#eda7a0';context.fillStyle=stroke.color||'#eda7a0';context.lineWidth=stroke.widthRatio?stroke.widthRatio*width:stroke.width||14;context.lineJoin='round';context.lineCap='round';const pts=stroke.points,px=p=>[p.x*width,p.y*height];let [x,y]=px(pts[0]);if(pts.length===1){context.beginPath();context.arc(x,y,context.lineWidth/2,0,Math.PI*2);context.fill();context.restore();return}context.beginPath();context.moveTo(x,y);for(let i=1;i<pts.length;i++){const [nx,ny]=px(pts[i]);if(i<pts.length-1){const [nnx,nny]=px(pts[i+1]);context.quadraticCurveTo(nx,ny,(nx+nnx)/2,(ny+nny)/2)}else context.lineTo(nx,ny)}context.stroke();context.restore()}
function repaintCanvas(){if(!canvas.width)return;ctx.clearRect(0,0,canvasW,canvasH);state.strokes.forEach(s=>drawStroke(ctx,s,canvasW,canvasH))}

// V1.42 只回放孩子實際畫過的軌跡；不把錄製順序當成官方標準筆順。
let myReplaySession=null;
function myReplayUi(active,message){
 const btn=$('#myReplayBtn'),status=$('#myReplayStatus');
 if(btn){btn.textContent=active?'■ 停止回放':'▶ 回看我寫的';btn.classList.toggle('playing',!!active);btn.setAttribute('aria-pressed',String(!!active));}
 if(status)status.textContent=message||'依儲存的畫線順序重現，不是標準筆順';
}
function stopMyReplay(options={}){
 const replay=myReplaySession;
 if(!replay)return;
 myReplaySession=null;
 if(replay.frame!==null)cancelAnimationFrame(replay.frame);
 myReplayUi(false,options.message||'已保留原有筆跡，可繼續練字');
 if(!options.skipRestore)repaintCanvas();
}
function replayMyWriting(){
 if(myReplaySession){stopMyReplay();return}
 if(state.activePointer!==null){toast('請先完成這一筆再回放');return}
 const snapshot=state.strokes.filter(s=>Array.isArray(s.points)&&s.points.length).map(s=>({...s,points:s.points.map(p=>({...p}))}));
 if(!snapshot.length){toast('先寫幾筆，再來看看自己怎麼寫 ✨');return}
 cancelDemo();hideEraserCursor();
 const speed=Math.max(.5,Math.min(2,Number($('#myReplaySpeed').value)||1));
 // Duration is derived from point count; old backups have no timestamps.
 const durations=snapshot.map(s=>Math.min(1700,Math.max(450,(350+s.points.length*16)/speed)));
 const replay={strokes:snapshot,index:0,start:null,frame:null,durations,itemId:currentItem().id};
 myReplaySession=replay;
 myReplayUi(true,'正在回放孩子自己的畫線：第 1 / '+snapshot.length+' 筆');
 const tick=(now)=>{
  if(myReplaySession!==replay||!state.showingPractice||currentItem().id!==replay.itemId){stopMyReplay();return}
  if(replay.start===null)replay.start=now;
  const current=replay.strokes[replay.index];
  if(!current){stopMyReplay({message:'回放完成！現在可以繼續寫字'});return}
  const progress=Math.min(1,(now-replay.start)/replay.durations[replay.index]);
  if(canvas.width){
   ctx.clearRect(0,0,canvasW,canvasH);
   for(let i=0;i<replay.index;i++)drawStroke(ctx,replay.strokes[i],canvasW,canvasH);
   const pointCount=current.points.length;
   const location=progress*Math.max(0,pointCount-1);
   const lastIndex=Math.min(pointCount-1,Math.floor(location));
   const shown=current.points.slice(0,lastIndex+1);
   if(lastIndex<pointCount-1){
    const fraction=location-lastIndex,from=current.points[lastIndex],to=current.points[lastIndex+1];
    shown.push({x:from.x+(to.x-from.x)*fraction,y:from.y+(to.y-from.y)*fraction});
   }
   drawStroke(ctx,{...current,points:shown},canvasW,canvasH);
  }
  if(progress>=1){
   replay.index++;
   replay.start=now;
   if(replay.index>=replay.strokes.length){stopMyReplay({message:'回放完成！這是你剛才的畫線順序，不代表標準筆順'});return}
   myReplayUi(true,'正在回放孩子自己的畫線：第 '+(replay.index+1)+' / '+replay.strokes.length+' 筆');
  }
  replay.frame=requestAnimationFrame(tick);
 };
 replay.frame=requestAnimationFrame(tick);
}
function relativePointer(e){const r=canvas.getBoundingClientRect();return {x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))}}
function clearSelection(){try{window.getSelection()?.removeAllRanges()}catch{}}
function handleDown(e){stopMyReplay();if(!state.showingPractice||state.activePointer!==null||e.button>0&&e.pointerType==='mouse')return;e.preventDefault();clearSelection();cancelDemo();moveEraserCursor(e);state.activePointer=e.pointerId;const p=relativePointer(e);const thickness=state.tool==='eraser'?eraserWidth():penWidth();state.activeStroke={color:state.brushColor,width:thickness,eraser:state.tool==='eraser',points:[p]};if(usesAutoPen()&&canvasW)state.activeStroke.widthRatio=thickness/canvasW;state.strokes.push(state.activeStroke);state.redo=[];try{canvas.setPointerCapture(e.pointerId)}catch{};repaintCanvas();updateStrokeCount()}
function handleMove(e){moveEraserCursor(e);if(state.activePointer!==e.pointerId||!state.activeStroke)return;e.preventDefault();const events=e.getCoalescedEvents?e.getCoalescedEvents():[e];let changed=false;for(const event of events){const p=relativePointer(event),points=state.activeStroke.points,prev=points[points.length-1];if(Math.hypot((p.x-prev.x)*canvasW,(p.y-prev.y)*canvasH)>.75){points.push(p);changed=true}}if(changed)repaintCanvas()}
function handleUp(e){if(state.activePointer!==e.pointerId)return;e.preventDefault();const p=relativePointer(e);if(state.activeStroke){const pts=state.activeStroke.points,last=pts[pts.length-1];if(Math.hypot((p.x-last.x)*canvasW,(p.y-last.y)*canvasH)>1)pts.push(p)}state.activeStroke=null;state.activePointer=null;try{canvas.releasePointerCapture(e.pointerId)}catch{};repaintCanvas();updateStrokeCount();persistCurrent();autoAdvanceGuide();if(e.pointerType==='touch')hideEraserCursor()}
function updateStrokeCount(){$('#strokeCounter').textContent=state.strokes.filter(s=>!s.eraser).length+' 筆畫線'}
function undo(){stopMyReplay();if(state.activePointer!==null)return;const s=state.strokes.pop();if(!s){toast('目前沒有可以復原的筆畫');return}state.redo.push(s);repaintCanvas();updateStrokeCount();persistCurrent()}
function redo(){stopMyReplay();if(state.activePointer!==null)return;const s=state.redo.pop();if(!s){toast('目前沒有可以重做的筆畫');return}state.strokes.push(s);repaintCanvas();updateStrokeCount();persistCurrent()}
function clearDrawing(){stopMyReplay();
 // 示範動畫繪在 SVG，而孩子的筆跡繪在 Canvas：清空時兩層都需要停止／清理。
 if(state.activePointer!==null)return;
 const hadDemo=!!state.demoTimer||svg.querySelector('.demo-stroke,.demo-outline')!==null;
 cancelDemo();state.guideIndex=0;
 svg.querySelectorAll('.guide-active,.label-active').forEach(el=>el.classList.remove('guide-active','label-active'));
 const hadArt=state.strokes.length>0;
 state.strokes=[];state.redo=[];
 repaintCanvas();updateStrokeCount();updateGuidePanel();persistCurrent();
 toast(hadArt?'已清空全部筆跡和示範，空心字保留':hadDemo?'已停止示範，畫板已清空':'畫板已經是空白的囉');
}
function cancelDemo(){if(state.demoTimer){clearTimeout(state.demoTimer);state.demoTimer=null}svg.querySelectorAll('.demo-stroke,.demo-outline').forEach(e=>e.remove());const b=$('#guidePlay');if(b)b.textContent='▶ 播放'}
// 教學線與 SVG 字形外框分開：未有逐筆資料的注音、日文只做「字形外框巡覽」，不冒充官方筆順。
function guidePaths(){return [...svg.querySelectorAll('.guide-line')]}
function sourceNotice(){if(state.category==='zhuyin')return zhOfficialEntry(currentItem().chars[0])?'教育部原始 SVG 筆順動畫已內建，可點「查看教育部正式筆順」；畫板上逐筆路徑仍是另一份開源描寫參考。':'畫板逐筆資料來自 AnimCJK 開源參考，正式標準請另參考教育部《國語注音符號手冊》。';if(state.category==='japanese')return (bundledKana[currentItem().chars[0]]||deployedKana[currentItem().chars[0]])?'此字已內建 AnimCJK 開源日文逐筆參考，可離線播放；與學校使用的字形仍需核對。':'逐筆路徑：AnimCJK / kana-svg-data 開源假名參考，成功下載後可離線快取；若失敗可重試。';;if(state.category==='hanzi'&&isHanziIssue(currentItem().chars[0]))return '此字由家長標記「發現筆順差異」，已暫停筆順箭頭與動畫；仍可練習空心字形。請查閱教育部來源。';if(state.category==='hanzi')return referenceFor(currentItem().chars[0])?'目前顯示 AnimCJK 臺灣繁體逐筆參考（'+(usableDeployedHanzi(currentItem().chars[0])?'已內建，可離線使用':'本機已取得')+'）；仍請以教育部官方筆順教材核對。':'此字尚無可用的開源逐筆資料；簡單級可能有未經官方核對的人工方向示意。可取得 AnimCJK 臺灣繁體參考後再逐筆檢視。';return '數字與英文為印刷字練習方向示意，不代表各校統一規範。'}
function updateGuidePanel(){syncReferenceReadyControl();const ref=isReferenceCategory(),loaded=ref&&!!referenceFor(currentItem().chars[0]),builtinDemo=!!practiceGuideFor(currentItem().chars[0]),available=hasGuides(),n=available?currentItem().chars.reduce((sum,c)=>sum+referenceOrPracticeCount(c),0):1;
 state.guideIndex=Math.max(0,Math.min(state.guideIndex,Math.max(0,n-1)));
 $('#guideTag').textContent=ref?(loaded&&(bundledKana[currentItem().chars[0]]||deployedKana[currentItem().chars[0]])?'✓ 離線假名逐筆參考':loaded?'AnimCJK · 逐筆參考':builtinDemo?'離線描寫方向示意 · 非標準筆順':referencePending.has(currentItem().chars[0])?'正在載入逐筆資料…':'尚無逐筆示範'):'印刷字筆畫方向示意';
 $('#guideStepText').textContent=available?'第 '+(state.guideIndex+1)+' / '+n+' 筆':'可先描寫字形';
 $('#guidePrev').disabled=!available||state.guideIndex===0;$('#guideNext').disabled=!available||state.guideIndex>=n-1;$('#guidePlay').disabled=!available;
 const quick=$('#quickDemoBtn');if(quick){const confirmed=!!referenceFor(currentItem().chars[0]);quick.textContent=available?(confirmed?'▶ 筆順':'▶ 示意'):'◌ 無筆順';quick.disabled=!available;quick.title=available?(confirmed?'開源逐筆參考，仍須核對教材':'這是印刷筆畫／人工方向示意，並非正式標準筆順'):'目前沒有可播放的逐筆資料';}
 $('#sourceCaption').textContent=sourceNotice();const link=$('#referenceLink');link.classList.toggle('hidden',!ref);
 link.href=state.category==='zhuyin'?'https://language.moe.gov.tw/001/Upload/files/site_content/M0001/juyin/':state.category==='hanzi'?'https://stroke-order.learningweb.moe.edu.tw/':'https://github.com/parsimonhi/animCJK/tree/master/svgsJaKana';
 link.textContent=state.category==='zhuyin'?'↗ 查教育部注音標準筆順':state.category==='hanzi'?'↗ 查教育部國字標準筆順':'↗ 開啟 AnimCJK 日文字形來源';
 $('#guideToolbar').classList.toggle('guide-unverified',!available);
 if(state.category==='hanzi'&&hanziStage!=='trace'){$('#guidePrev').disabled=true;$('#guideNext').disabled=true;$('#guidePlay').disabled=true;$('#demoBtn').disabled=true;}
 $('#referenceStatus').textContent=ref?(loaded&&(bundledKana[currentItem().chars[0]]||deployedKana[currentItem().chars[0]])?'✓ 已內建日文描寫參考，可離線播放':loaded?'✓ 已取得逐筆路徑':builtinDemo?'✓ 已內建描寫示意，可離線播放；正式筆順尚需核對':referencePending.has(currentItem().chars[0])?'正在取得逐筆資料…':referenceFailed.has(currentItem().chars[0])?'下載失敗：請連網後重試（仍可描寫空心字）':'尚未載入筆順，可按「重試下載」'):'可離線練習';
 $('#retryGuideBtn').classList.toggle('hidden',!ref||loaded);
 $('#retryGuideBtn').disabled=referencePending.has(currentItem().chars[0]);
 $('#followStepBtn').classList.toggle('selected',state.followStep);const ss=$('#oneStepBtn');if(ss){ss.classList.toggle('selected',state.oneStep);ss.setAttribute('aria-pressed',String(state.oneStep));ss.disabled=!available;ss.textContent=state.oneStep?'✓ 一次看一筆':'◎ 一次看一筆'}svg.classList.toggle('single-step',state.oneStep&&!state.free&&available);if(state.oneStep&&available)highlightGuide();updatePaperGuideChip();
}
function playOutline(){const paths=[...svg.querySelectorAll('.glyph-fill-outline')];if(!paths.length){toast('沒有可播放的字形，請直接描寫');return}const target=paths[0],p=svgEl('path',{d:target.getAttribute('d'),class:'demo-outline'},target.parentNode);let len=0;try{len=p.getTotalLength()}catch{len=400};p.style.strokeDasharray=''+len;p.style.strokeDashoffset=''+len;p.getBoundingClientRect();p.style.transition='stroke-dashoffset 2500ms linear';p.style.strokeDashoffset='0';state.demoTimer=setTimeout(()=>{p.remove();state.demoTimer=null;$('#guidePlay').textContent='▶ 播放'},2850)}
function animateGuideStep(index,loop){cancelDemo();if(state.free){toast('先切回「空心字描寫」再觀看示範');return}if(!state.arrows){state.arrows=true;$('#showArrows').checked=true;renderTemplate()}const paths=guidePaths();if(!hasGuides()){toast('這個字的逐筆筆順尚未取得，請先下載');updateGuidePanel();return}if(!paths.length)return;state.guideIndex=Math.max(0,Math.min(index,paths.length-1));updateGuidePanel();highlightGuide();const p=paths[state.guideIndex],demo=svgEl('path',{d:p.getAttribute('d'),class:'demo-stroke'+(p.classList.contains('reference-guide')?' demo-reference':'')},p.parentNode);const len=demo.getTotalLength(),ms=Math.min(1600,650+len*4);demo.style.strokeDasharray=''+len;demo.style.strokeDashoffset=''+len;demo.getBoundingClientRect();demo.style.transition='stroke-dashoffset '+ms+'ms ease-in-out';demo.style.strokeDashoffset='0';$('#guidePlay').textContent='■ 播放中';state.demoTimer=setTimeout(()=>{demo.remove();state.demoTimer=null;if(loop&&state.guideIndex<paths.length-1)animateGuideStep(state.guideIndex+1,true);else $('#guidePlay').textContent='▶ 播放'},ms+190)}
function demoStrokes(){animateGuideStep(0,true)}
function manualGuide(delta){cancelDemo();if(!hasGuides()){toast('尚無可播放的逐筆資料，請點「重試下載」');return}const count=guidePaths().length;state.guideIndex=Math.max(0,Math.min(count-1,state.guideIndex+delta));highlightGuide();animateGuideStep(state.guideIndex,false)}
function toast(message){const el=$('#toast');clearTimeout(toastTimer);el.textContent=message;el.classList.add('visible');toastTimer=setTimeout(()=>el.classList.remove('visible'),2500)}
function complete(){stopMyReplay();if(!state.strokes.some(s=>!s.eraser)){toast('先在字上畫幾筆，再按完成吧 ✨');return}persistCurrent();const id=currentItem().id,first=!state.done[id];state.done[id]=true;state.attempts[id]=(state.attempts[id]||0)+1;state.days[id]=todayKey();saveNow();renderPractice();$('#topStarCount').textContent=Object.keys(state.done).filter(k=>state.done[k]).length;if(first){const c=$('#celebrate');c.classList.remove('hidden');clearTimeout(celebrateTimer);celebrateTimer=setTimeout(()=>c.classList.add('hidden'),1250)}else toast('這個字又練習了一次，真棒！')}
function speechText(item=currentItem()){return window.LittleLinesVoice?.text(item,state.category)||item?.label||''}
function speechLabel(item=currentItem()){return window.LittleLinesVoice?.label(item,state.category)||item?.label||''}
function speak(item=currentItem(),showToast=false){
 if(!item)return;
 window.LittleLinesVoice?.play(item,state.category,message=>toast(message));
}
async function exportPng(){try{const w=canvasW,h=canvasH;if(!w||!h)return;const zoom=Math.min(3,1600/w),off=document.createElement('canvas');off.width=Math.round(w*zoom);off.height=Math.round(h*zoom);const dc=off.getContext('2d');dc.fillStyle='#fffdfa';dc.fillRect(0,0,off.width,off.height);const xml=new XMLSerializer().serializeToString(svg);const blob=new Blob([xml],{type:'image/svg+xml;charset=utf-8'});const src=URL.createObjectURL(blob);const image=await new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src});dc.drawImage(image,0,0,off.width,off.height);URL.revokeObjectURL(src);dc.drawImage(canvas,0,0,off.width,off.height);const a=document.createElement('a');a.href=off.toDataURL('image/png');a.download='小小練字_'+currentItem().chars.join('')+'.png';document.body.appendChild(a);a.click();a.remove();toast('已產生練習作品圖片')}catch(err){console.error(err);toast('圖片匯出失敗，請用截圖保存這張練習')}}
function todayKey(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function downloadFile(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2500)}
function exportBackup(){persistCurrent();saveNow();const backup={format:'little-lines-backup',version:'1.27',exportedAt:new Date().toISOString(),hanziReview:safeHanziReview(hanziReview),hanziRevisit:[...hanziRevisit],hanziMastered:[...hanziMastered],done:state.done,art:state.art,days:state.days,attempts:state.attempts};downloadFile(new Blob([JSON.stringify(backup)],{type:'application/json;charset=utf-8'}),'小小練字樂園_完整備份_'+todayKey()+'.json');toast('完整練習備份已匯出')}
function sanitizeBackup(raw){if(!raw||typeof raw!=='object'||!['little-lines-backup',undefined].includes(raw.format))throw Error('不是支援的備份格式');const done={},art={},days={},attempts={};const validateId=k=>typeof k==='string'&&/^(numbers:\d{1,2}|zhuyin:.{1,2}|english:(both|upper|lower):[A-Z]|japanese:(hira|kata):.{1,2}|hanzi:[\u3400-\u9fff])$/u.test(k);
for(const [k,v] of Object.entries(raw.done||{}))if(validateId(k)&&v)done[k]=true;
for(const [k,strokes] of Object.entries(raw.art||{})){if(!validateId(k)||!Array.isArray(strokes))continue;art[k]=strokes.slice(0,800).filter(s=>s&&Array.isArray(s.points)).map(s=>({color:/^#[0-9a-f]{6}$/i.test(s.color)?s.color:'#eda7a0',width:Math.max(2,Math.min(100,Number(s.width)||14)),widthRatio:Number.isFinite(+s.widthRatio)&&+s.widthRatio>0&&+s.widthRatio<1?+s.widthRatio:undefined,eraser:!!s.eraser,points:s.points.slice(0,3000).map(p=>({x:Math.max(0,Math.min(1,Number(p.x)||0)),y:Math.max(0,Math.min(1,Number(p.y)||0))}))}))}
for(const[k,v]of Object.entries(raw.days||{}))if(validateId(k)&&/^\d{4}-\d{2}-\d{2}$/.test(v))days[k]=v;
for(const[k,v]of Object.entries(raw.attempts||{}))if(validateId(k)&&Number.isFinite(v))attempts[k]=Math.max(0,Math.floor(v));return {done,art,days,attempts,hanziReview:safeHanziReview(raw.hanziReview),hanziRevisit:Array.isArray(raw.hanziRevisit)?raw.hanziRevisit.filter(c=>HANZI_ITEMS.some(i=>i.char===c)):[],hanziMastered:safeHanziMastered(raw.hanziMastered)}}
async function importBackup(e){const file=e.target.files?.[0];e.target.value='';if(!file)return;if(file.size>9*1024*1024){toast('備份檔案超過 9MB，請確認是否正確');return}try{const parsed=sanitizeBackup(JSON.parse(await file.text()));const count=Object.keys(parsed.done).length;if(!confirm('要匯入這份備份嗎？\n\n將取代此裝置目前的練習紀錄（共 '+count+' 個完成項目）。請先匯出目前的備份。'))return;state.done=parsed.done;state.art=parsed.art;state.days=parsed.days;state.attempts=parsed.attempts;hanziReview=parsed.hanziReview;hanziRevisit=new Set(parsed.hanziRevisit);hanziMastered=new Set(parsed.hanziMastered);saveHanziMastered();saveRevisit();saveHanziReview();saveNow();if(state.showingPractice){loadCurrent();renderPractice()}else renderLibrary();toast('匯入完成：已還原 '+count+' 個練習紀錄')}catch(err){console.error(err);toast('備份格式不正確，沒有更改原本資料')}}
function printWorksheet(){const sheet=$('#printSheet');sheet.innerHTML='';const title=document.createElement('h1');title.textContent='小小練字樂園 · '+categoryName()+' · '+currentItem().chars.join('');sheet.appendChild(title);const subtitle=document.createElement('p');subtitle.textContent='姓名：______________　日期：______________　先描寫上面兩格，再自己練習下面兩格';sheet.appendChild(subtitle);const cells=document.createElement('div');cells.className='print-cells';sheet.appendChild(cells);for(let i=0;i<4;i++){const box=document.createElement('div');box.className='print-cell';const tag=document.createElement('strong');tag.textContent=i<2?'✎ 描一描':'☆ 自己寫';box.appendChild(tag);if(i<2){const clone=svg.cloneNode(true);clone.querySelectorAll('.demo-stroke,.demo-outline,.guide-line,.arrow-tri,.start-dot,.start-num').forEach(n=>n.remove());box.appendChild(clone)}else{const base=svg.cloneNode(false);base.setAttribute('viewBox',svg.getAttribute('viewBox'));const grid=svg.querySelector('.grid-shade');if(grid){base.appendChild(grid.cloneNode(true));svg.querySelectorAll('.grid-mid,.grid-line').forEach(g=>base.appendChild(g.cloneNode(true)))}box.appendChild(base)}cells.appendChild(box)}const foot=document.createElement('p');foot.textContent='♡ 寫字不用急，一天進步一點點！';sheet.appendChild(foot);window.print()}
function refreshQuickTools(){if(!$('#quickPalette'))return;$$('.quick-swatch').forEach(b=>b.classList.toggle('selected',b.dataset.color.toLowerCase()===String(state.brushColor).toLowerCase()));$$('[data-quick-tool]').forEach(b=>b.classList.toggle('selected',b.dataset.quickTool===state.tool));}
function setBrushColor(color){state.brushColor=color;setTool('pen');$$('.swatch').forEach(btn=>btn.classList.toggle('selected',btn.dataset.color.toLowerCase()===color.toLowerCase()));$$('.tool-mode').forEach(btn=>btn.classList.toggle('selected',btn.dataset.tool===state.tool));$('#currentColorDot').style.background=color;refreshQuickTools();}
function setTool(tool){state.tool=tool;updatePenControls();$$('.tool-mode').forEach(btn=>btn.classList.toggle('selected',btn.dataset.tool===tool));updateEraserPreview();if(tool==='eraser'){const r=canvas.getBoundingClientRect();if(r.width){eraserCursor.style.left=r.width/2+'px';eraserCursor.style.top=r.height/2+'px';eraserCursor.classList.add('visible')}}refreshQuickTools();}
async function downloadCategoryReferences(){
 if(!isReferenceCategory())return;const list=[...state.items];const btn=$('#downloadGuidesBtn');btn.disabled=true;
 const uncached=list.filter(i=>!referenceFor(i.chars[0]));const already=list.length-uncached.length;
 if(uncached.length===0){btn.textContent='✓ 本類筆順已離線備妥';toast('這一類的逐筆資料已儲存在此裝置');btn.disabled=false;return}
 let finished=0,succeeded=0;const oldCategory=state.category;
 const workers=Array.from({length:Math.min(3,uncached.length)},async()=>{
   while(uncached.length){const item=uncached.shift();if(!item)break;
    referenceFailed.delete(item.chars[0]);await prepareReference(item,true);
    if(referenceFor(item.chars[0]))succeeded++;finished++;
    btn.textContent='下載中 '+(already+finished)+' / '+list.length;
   }
 });await Promise.all(workers);
 btn.disabled=false;btn.textContent=succeeded+already===list.length?'✓ 本類筆順已離線備妥':'↓ 再試下載未完成的筆順';
 if(state.category===oldCategory){refreshGuideStatuses();toast('完成：'+(succeeded+already)+' / '+list.length+' 個筆順已存入此裝置')}
refreshQuickTools();}
function toggleFocus(){state.focus=!state.focus;document.body.classList.toggle('focus-mode',state.focus);$('#focusBtn').textContent=state.focus?'↙ 退出專心練習':'⛶ 專心練習';resizeCanvas();}
function toggleFollowStep(){state.followStep=!state.followStep;$('#followStepBtn').classList.toggle('selected',state.followStep);if(state.followStep&&hasGuides()){state.guideIndex=0;animateGuideStep(0,false)}else toast(state.followStep?'每寫完一筆，會自動提示下一筆':'已關閉寫完自動提示');}
function autoAdvanceGuide(){if(!state.followStep||!hasGuides()||state.tool==='eraser'||state.free)return;const total=guidePaths().length;if(state.guideIndex<total-1){state.guideIndex++;updateGuidePanel();highlightGuide()}else{toast('所有示範筆畫已完成！可以點「我寫好了」⭐')}}
function highlightGuide(){svg.querySelectorAll('.guide-line,.reference-median,.offline-median,.arrow-tri').forEach(node=>{const step=Number(node.dataset.step);node.classList.toggle('guide-active',step===state.guideIndex);node.classList.toggle('step-selected',step===state.guideIndex)});svg.querySelectorAll('.guide-label').forEach(node=>node.classList.toggle('label-active',Number(node.dataset.step)===state.guideIndex))}
function toggleSingleStep(){if(!hasGuides()){toast('這個字尚無可使用的逐筆資料');return}cancelDemo();state.oneStep=!state.oneStep;state.guideIndex=0;svg.classList.toggle('single-step',state.oneStep&&!state.free);updateGuidePanel();if(!state.oneStep)svg.querySelectorAll('.guide-active,.label-active,.step-selected').forEach(el=>el.classList.remove('guide-active','label-active','step-selected'));toast(state.oneStep?'已啟用：每次只強調一筆，按「下一筆」慢慢練':'已顯示全部筆畫箭頭')}
function bindUI(){
 $('#printHanziLessonBtn').addEventListener('click',printHanziLesson);initMultiWorksheet();
 $('#markHanziReviewBtn').addEventListener('click',toggleHanziReview);
 $('#hanziMasteryBtn').addEventListener('click',toggleHanziMastery);
 $$('#hanziStageBar [data-stage]').forEach(b=>b.addEventListener('click',()=>setHanziStage(b.dataset.stage)));
 $('#hanziUnmasteredBtn').addEventListener('click',()=>{hanziUnmasteredOnly=!hanziUnmasteredOnly;hanziRevisitOnly=false;hanziLesson=0;renderLibrary()});
 $('#hanziReviewOnlyBtn').addEventListener('click',()=>{hanziRevisitOnly=!hanziRevisitOnly;hanziUnmasteredOnly=false;hanziLesson=0;renderLibrary()});

 $('#hanziImportBtn').addEventListener('click',()=>$('#hanziSourceFile').click());
 $('#hanziSourceFile').addEventListener('change',importHanziSource);
 $('#hanziExportBtn').addEventListener('click',generateHanziSiteZip);
 $('#hanziFetchBtn').addEventListener('click',acquireHanziLevel);
 $('#hanziStopFetchBtn').addEventListener('click',stopHanziBatch);
 $('#hanziMissingCsvBtn').addEventListener('click',exportHanziMissingReport);

 $('#showZhuyinOfficialBtn').addEventListener('click',showZhuyinOfficial);
 $('#closeZhOfficialBtn').addEventListener('click',closeZhuyinOfficial);
 $('#replayZhOfficialBtn').addEventListener('click',replayZhuyinOfficial);
 $('#zhOfficialOverlay').addEventListener('click',e=>{if(e.target.id==='zhOfficialOverlay')closeZhuyinOfficial()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#zhOfficialOverlay').classList.contains('hidden'))closeZhuyinOfficial()});
 const quickColors=['#eda7a0','#f6d19a','#a5ccb0','#9acddd','#b9aedf','#d4aad2'];
 const quickPalette=$('#quickPalette');quickColors.forEach(color=>{const b=document.createElement('button');b.type='button';b.className='quick-swatch';b.style.background=color;b.dataset.color=color;b.title='使用這個畫筆顏色';b.setAttribute('aria-label','畫筆顏色 '+color);b.addEventListener('click',()=>{setBrushColor(color);refreshQuickTools()});quickPalette.appendChild(b)});
 $('#openToolBtn').addEventListener('click',()=>togglePracticeTools());$('#closeToolBtn').addEventListener('click',()=>togglePracticeTools(false));$('#toolBackdrop').addEventListener('click',()=>togglePracticeTools(false));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('practice-tools-open')){e.preventDefault();togglePracticeTools(false)}});
 $$('[data-quick-tool]').forEach(b=>b.addEventListener('click',()=>{setTool(b.dataset.quickTool);refreshQuickTools()}));

 $$('#hanziComparePanel [data-review]').forEach(b=>b.addEventListener('click',()=>setHanziReview(b.dataset.review)));
 $('#hanziAlignmentBtn').addEventListener('click',()=>setHanziAlignmentVisible(!hanziAlignmentVisible));
 $('#copyHanziBtn').addEventListener('click',async()=>{const c=currentItem()?.char;if(!c)return;try{await navigator.clipboard.writeText(c);toast('已複製「'+c+'」，可貼到教育部查詢欄')}catch{toast('請手動選取目前字：「'+c+'」')}});
 $$('#hanziQualityLevel,#hanziQualityFilter').forEach(x=>x.addEventListener('change',renderHanziQuality));$('#hanziQualityExport').addEventListener('click',exportHanziQuality);$('#hanziQualityPanel').addEventListener('toggle',()=>{if($('#hanziQualityPanel').open)renderHanziQuality()});
 window.LittleLinesVoice?.init(()=>state.category);state.items=makeItems('numbers');renderLibrary();COLORS.forEach(color=>{const b=document.createElement('button');b.type='button';b.className='swatch';b.dataset.color=color;b.title='選擇 '+color;b.setAttribute('aria-label','畫筆顏色 '+color);b.style.setProperty('--swatch',color);b.addEventListener('click',()=>setBrushColor(color));$('#palette').appendChild(b)});setBrushColor(COLORS[0]);$('#customColor').addEventListener('input',e=>setBrushColor(e.target.value));$('#brushSize').value=state.brushSize;$('#autoPenWidth').checked=state.autoPen;$('#autoPenWidth').addEventListener('change',e=>{state.autoPen=e.target.checked;savePenPrefs();updatePenControls();toast(state.autoPen?'畫筆已自動對齊字內框粗細 ✨':'已改成手動畫筆粗細')});$('#brushSize').addEventListener('input',e=>{state.brushSize=+e.target.value;savePenPrefs();updatePenControls();updateEraserPreview()});updatePenControls();$$('.tool-mode').forEach(b=>b.addEventListener('click',()=>setTool(b.dataset.tool)));$$('.nav-item').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.category==='hanzi')hanziSubview='learn';setCategory(b.dataset.category)}));$$('#hanziSubnav [data-hanzi-page]').forEach(b=>b.addEventListener('click',()=>setHanziSubview(b.dataset.hanziPage)));$('#printSelectedHanziBtn').addEventListener('click',printSelectedHanzi);$('#hanziPrintCellSize').addEventListener('change',syncHanziPrintAdvice);$('#hanziPrintCells').addEventListener('change',syncHanziPrintAdvice);$('#hanziPrintMiGrid').addEventListener('change',syncHanziPrintAdvice);$('#hanziPrintRepeat').addEventListener('change',syncHanziPrintAdvice);$('#clearSelectedHanziBtn').addEventListener('click',()=>{selectedHanziPrint.clear();renderHanziPrintSelection()});renderHanziPrintSelection();$('#logoHome').addEventListener('click',()=>{persistCurrent();if(state.category==='hanzi')hanziSubview='learn';showView(false);renderLibrary()});$('#startFirst').addEventListener('click',()=>{if(!state.items.length){toast('此分類目前沒有可練習的字');return}const target=state.items.findIndex(i=>!state.done[i.id]);openPractice(target<0?0:target)});$('#randomPick').addEventListener('click',()=>state.items.length?openPractice(Math.floor(Math.random()*state.items.length)):toast('目前沒有可隨機練習的字'));$('#continueBtn').addEventListener('click',()=>{if(!state.items.length){toast('目前沒有可練習的字');return}const n=state.items.findIndex(i=>!state.done[i.id]);openPractice(n<0?0:n)});$('#backLibrary').addEventListener('click',()=>{persistCurrent();showView(false);renderLibrary()});$('#prevBtn').addEventListener('click',()=>move(-1));$('#nextBtn').addEventListener('click',()=>move(1));$('#myReplayBtn').addEventListener('click',replayMyWriting);$('#myReplaySpeed').addEventListener('change',()=>{if(myReplaySession){stopMyReplay({message:'速度已更新，請重新按回放'})}});$('#undoBtn').addEventListener('click',undo);$('#redoBtn').addEventListener('click',redo);$('#clearBtn').addEventListener('click',clearDrawing);$('#demoBtn').addEventListener('click',demoStrokes);$('#quickDemoBtn').addEventListener('click',()=>{if(!hasGuides()){toast('尚無可靠的逐筆參考，現在可先沿空心字描寫');return}demoStrokes()});$('#referenceReadyBtn').addEventListener('click',applyDeferredPracticeReference);$('#oneStepBtn').addEventListener('click',toggleSingleStep);$('#guidePrev').addEventListener('click',()=>manualGuide(-1));$('#guideNext').addEventListener('click',()=>manualGuide(1));$('#guidePlay').addEventListener('click',()=>{if(state.demoTimer)cancelDemo();else animateGuideStep(state.guideIndex,true)});$('#completeBtn').addEventListener('click',complete);$('#speakBtn').addEventListener('click',()=>{const item=currentItem();if(state.category==='hanzi'&&HANZI_CONTEXT_NOTES[item.char]){playHanziContextWord(item);toast('多音字：以「'+item.word+'」示範本課讀音')}else speak(item,true)});$('#hanziWordListen').addEventListener('click',()=>playHanziContextWord(currentItem()));$('#savePngBtn').addEventListener('click',exportPng);$('#printBtn').addEventListener('click',printWorksheet);$('#downloadGuidesBtn').addEventListener('click',downloadCategoryReferences);$('#kanaPackDownload').addEventListener('click',downloadWholeKanaPack);$('#kanaPackExport').addEventListener('click',exportKanaPack);$('#kanaPackImport').addEventListener('click',()=>$('#kanaPackFile').click());$('#kanaPackFile').addEventListener('change',importKanaPack);$('#kanaDeployZip').addEventListener('click',generateKanaSiteZip);$('#guideAuditBtn').addEventListener('click',()=>{const btn=$('#guideAuditBtn'),p=$('#guideAuditPanel'),expanded=btn.getAttribute('aria-expanded')!=='true';btn.setAttribute('aria-expanded',expanded?'true':'false');p.classList.toggle('hidden',!expanded);renderGuideAudit()});$('#focusBtn').addEventListener('click',toggleFocus);$('#followStepBtn').addEventListener('click',toggleFollowStep);$('#retryGuideBtn').addEventListener('click',()=>{referenceFailed.delete(currentItem().chars[0]);prepareReference(currentItem(),true)});$('#backupBtn').addEventListener('click',exportBackup);$('#restoreBtn').addEventListener('click',()=>$('#backupInput').click());$('#backupInput').addEventListener('change',importBackup);$('#showGrid').addEventListener('change',e=>{cancelDemo();state.grid=e.target.checked;renderTemplate();updateGuidePanel()});$('#showArrows').addEventListener('change',e=>{cancelDemo();state.arrows=e.target.checked;renderTemplate();updateGuidePanel()});$('#traceModeBtn').addEventListener('click',()=>setFreeMode(false));$('#freeModeBtn').addEventListener('click',()=>setFreeMode(true));canvas.addEventListener('pointerenter',moveEraserCursor,{passive:true});canvas.addEventListener('pointerleave',hideEraserCursor,{passive:true});canvas.addEventListener('pointerdown',handleDown,{passive:false});canvas.addEventListener('pointermove',handleMove,{passive:false});canvas.addEventListener('pointerup',handleUp,{passive:false});canvas.addEventListener('pointercancel',handleUp,{passive:false});canvas.addEventListener('lostpointercapture',e=>{if(state.activePointer===e.pointerId)handleUp(e)},{passive:false});const wrap=$('#drawingStage');['selectstart','dragstart','dblclick','contextmenu','gesturestart','gesturechange'].forEach(type=>wrap.addEventListener(type,e=>{e.preventDefault();clearSelection()},{capture:true,passive:false}));let lastPadGeometry='';const measuredPadGeometry=()=>{const r=wrap.getBoundingClientRect();return Math.round(r.width)+'x'+Math.round(r.height)+'x'+(window.matchMedia('(max-width:720px)').matches?'m':'d')};const refreshPadGeometry=()=>{if(!state.showingPractice)return;const key=measuredPadGeometry();if(lastPadGeometry===key)return;lastPadGeometry=key;renderTemplate();resizeCanvas();updateGuidePanel()};window.addEventListener('resize',refreshPadGeometry,{passive:true});if('ResizeObserver' in window){new ResizeObserver(refreshPadGeometry).observe(wrap)}window.addEventListener('pagehide',saveNow);document.addEventListener('visibilitychange',()=>{if(document.hidden)saveNow()});document.addEventListener('keydown',e=>{if(!state.showingPractice||e.target.matches('input'))return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?redo():undo()}else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){e.preventDefault();redo()}});if('serviceWorker' in navigator&&location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}
function setFreeMode(free){if(state.category==='hanzi'){setHanziStage(free?'free':'trace');return}if(state.free===free)return;cancelDemo();state.free=free;$('#traceModeBtn').classList.toggle('selected',!free);$('#freeModeBtn').classList.toggle('selected',free);$('#paperModeTag').textContent=free?'自由寫字':'描寫模式';renderTemplate();updateGuidePanel();updatePenControls();toast(free?'切換空白練習，已有畫筆仍會保留':'切回空心字描寫')}
bindUI();
})();
