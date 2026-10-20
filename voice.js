/* Little Lines V1.10 — Curated US letter recordings + custom verified MP3 set + TTS fallback.
   A–Z uses one selected device voice for consistency; on-device audio quality still needs listening checks. */
(function(){ 'use strict';
const SETTINGS_KEY='little-lines-voice-v1';
const LOCALE={hanzi:'zh-TW',numbers:'zh-TW',zhuyin:'zh-TW',english:'en-US',japanese:'ja-JP'};
const defaults={rates:{hanzi:.9,numbers:.95,zhuyin:1,english:.86,japanese:.85},voices:{},audioMode:{zhuyin:'recording',english:'recording'},numberMode:'whole',numberAudioMode:'voice'};
const DIGITS=[...'零一二三四五六七八九'];
const ZHUYIN_AUDIO_ORDER=[...'ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦㄧㄨㄩ'];
const ZHUYIN_AUDIO=Object.fromEntries(ZHUYIN_AUDIO_ORDER.map((x,i)=>[x,i+1]));
// TTS plain-text cues are approximations of US letter NAMES (not phonics).
// One selected en-US voice (any gender) is used for ALL 26 letters, both cases.
const ENGLISH_NAMES={A:'ay',B:'bee',C:'see',D:'dee',E:'ee',F:'eff',G:'gee',H:'aitch',I:'eye',J:'jay',K:'kay',L:'ell',M:'em',N:'en',O:'oh',P:'pee',Q:'cue',R:'are',S:'ess',T:'tee',U:'you',V:'vee',W:'double you',X:'ex',Y:'why',Z:'zee'};
// Name-based quality hints only; a "natural" label cannot establish true pronunciation quality.
const CLEAR_ENGLISH_NAMES=/\b(neural|natural|enhanced|premium|high quality|高品質)\b/i;
const ENGLISH_PROVIDER_NAMES=/\b(microsoft|google|apple)\b/i;
const SOURCES={zhuyin:'https://language.moe.gov.tw/001/Upload/files/site_content/M0001/juyin/html_ch/audio/',zhuyinBackup:'https://raw.githubusercontent.com/kaoshou/bopomofo-shooter/main/audio/'};
const $=id=>document.getElementById(id);
let currentCategory=()=> 'numbers',settings=readSettings(),voices=[],playing=null,seq=0,activeSpeech=null,voiceTimer=null;

// 來源：Wikimedia Commons 英文字母名稱 US recordings (24 verified file pages; L/X excluded pending verification).
// 不代表 24 個全由同一人錄製。MP3 transcoding is served by Wikimedia, not included in ZIP.
const ENGLISH_CURATED_MP3={
 "A": "https://upload.wikimedia.org/wikipedia/commons/transcoded/4/42/En-us-A.ogg/En-us-A.ogg.mp3",
 "B": "https://upload.wikimedia.org/wikipedia/commons/transcoded/9/93/En-us-b.ogg/En-us-b.ogg.mp3",
 "C": "https://upload.wikimedia.org/wikipedia/commons/transcoded/5/5c/En-us-c.ogg/En-us-c.ogg.mp3",
 "D": "https://upload.wikimedia.org/wikipedia/commons/transcoded/8/80/En-us-d.ogg/En-us-d.ogg.mp3",
 "E": "https://upload.wikimedia.org/wikipedia/commons/transcoded/1/18/En-us-e.ogg/En-us-e.ogg.mp3",
 "F": "https://upload.wikimedia.org/wikipedia/commons/transcoded/7/71/En-us-f.ogg/En-us-f.ogg.mp3",
 "G": "https://upload.wikimedia.org/wikipedia/commons/transcoded/0/06/En-us-g.ogg/En-us-g.ogg.mp3",
 "H": "https://upload.wikimedia.org/wikipedia/commons/transcoded/d/d1/En-us-h.ogg/En-us-h.ogg.mp3",
 "I": "https://upload.wikimedia.org/wikipedia/commons/transcoded/d/de/En-us-i.ogg/En-us-i.ogg.mp3",
 "J": "https://upload.wikimedia.org/wikipedia/commons/transcoded/7/7e/En-us-j.ogg/En-us-j.ogg.mp3",
 "K": "https://upload.wikimedia.org/wikipedia/commons/transcoded/8/8d/En-us-k.ogg/En-us-k.ogg.mp3",
 "M": "https://upload.wikimedia.org/wikipedia/commons/transcoded/4/44/En-us-m.ogg/En-us-m.ogg.mp3",
 "N": "https://upload.wikimedia.org/wikipedia/commons/transcoded/7/71/En-us-n.ogg/En-us-n.ogg.mp3",
 "O": "https://upload.wikimedia.org/wikipedia/commons/transcoded/7/7d/En-us-o.ogg/En-us-o.ogg.mp3",
 "P": "https://upload.wikimedia.org/wikipedia/commons/transcoded/7/79/En-us-p.ogg/En-us-p.ogg.mp3",
 "Q": "https://upload.wikimedia.org/wikipedia/commons/transcoded/6/6f/En-us-q.ogg/En-us-q.ogg.mp3",
 "R": "https://upload.wikimedia.org/wikipedia/commons/transcoded/7/75/En-us-r.ogg/En-us-r.ogg.mp3",
 "S": "https://upload.wikimedia.org/wikipedia/commons/transcoded/5/54/En-us-s.ogg/En-us-s.ogg.mp3",
 "T": "https://upload.wikimedia.org/wikipedia/commons/transcoded/8/8d/En-us-t.ogg/En-us-t.ogg.mp3",
 "U": "https://upload.wikimedia.org/wikipedia/commons/transcoded/9/9d/En-us-u.ogg/En-us-u.ogg.mp3",
 "V": "https://upload.wikimedia.org/wikipedia/commons/transcoded/3/3a/En-us-v.ogg/En-us-v.ogg.mp3",
 "W": "https://upload.wikimedia.org/wikipedia/commons/transcoded/4/4b/En-us-w.ogg/En-us-w.ogg.mp3",
 "Y": "https://upload.wikimedia.org/wikipedia/commons/transcoded/d/dd/En-us-y.ogg/En-us-y.ogg.mp3",
 "Z": "https://upload.wikimedia.org/wikipedia/commons/transcoded/0/0f/En-us-z.ogg/En-us-z.ogg.mp3"
};
const ENGLISH_DB='little-lines-en-recordings-v1',ENGLISH_STORE='clips';
const englishClips=new Map();let englishDB=null,englishReady=false;
function englishLetter(item){return String(item?.label||'').charAt(0).toUpperCase()}
function openEnglishDB(){return new Promise((resolve,reject)=>{if(!window.indexedDB){reject(Error('IndexedDB 不可用'));return}const req=indexedDB.open(ENGLISH_DB,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(ENGLISH_STORE))req.result.createObjectStore(ENGLISH_STORE,{keyPath:'id'})};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||Error('資料庫無法開啟'))})}
async function prepareEnglishClips(){try{englishDB=await openEnglishDB();const clips=await new Promise((resolve,reject)=>{const q=englishDB.transaction(ENGLISH_STORE,'readonly').objectStore(ENGLISH_STORE).getAll();q.onsuccess=()=>resolve(q.result||[]);q.onerror=()=>reject(q.error)});clips.forEach(x=>{if(x&&/^[A-Z]$/.test(x.id)&&x.blob instanceof Blob)englishClips.set(x.id,URL.createObjectURL(x.blob))});englishReady=true;updateEnglishClipStatus()}catch(e){englishReady=true;updateEnglishClipStatus('此瀏覽器無法儲存英文錄音：'+String(e.message||e))}}
function updateEnglishClipStatus(message){const statusEl=$('englishClipCount');if(statusEl)statusEl.textContent=message||`本裝置已有 ${englishClips.size} / 26 個指定發音音檔；未匯入時可連網使用開放錄音（24 個已查證頁面），其他字母改用裝置語音。`;const b=$('englishClearClips');if(b)b.disabled=!englishClips.size}
async function importEnglishClips(files){const clips=[],ignored=[],used=new Set();for(const f of files){const match=/^([a-z])\.(mp3|m4a|wav|ogg)$/i.exec(f.name);if(!match||!f.size||f.size>4*1024*1024||used.has(match[1].toUpperCase())){ignored.push(f.name);continue}const id=match[1].toUpperCase();used.add(id);clips.push({id,blob:new Blob([f],{type:f.type||({mp3:'audio/mpeg',m4a:'audio/mp4',wav:'audio/wav',ogg:'audio/ogg'}[match[2].toLowerCase()])})})}
 if(!clips.length){updateEnglishClipStatus('無有效錄音。請使用 A.mp3～Z.mp3（也支援 m4a/wav/ogg），單檔 4 MB 內。');return}
 if(!englishDB){updateEnglishClipStatus('這台裝置無法儲存錄音，請檢查瀏覽器儲存權限。');return}
 try{await new Promise((resolve,reject)=>{const tx=englishDB.transaction(ENGLISH_STORE,'readwrite');clips.forEach(x=>tx.objectStore(ENGLISH_STORE).put(x));tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});clips.forEach(x=>{if(englishClips.has(x.id))URL.revokeObjectURL(englishClips.get(x.id));englishClips.set(x.id,URL.createObjectURL(x.blob))});settings.audioMode.english='recording';persist();renderPanel(false);updateEnglishClipStatus(`已匯入 ${clips.length} 個英文字母錄音，現有 ${englishClips.size}/26 個。${ignored.length?'忽略 '+ignored.length+' 個檔案。':''}`)}catch(e){updateEnglishClipStatus('匯入失敗：'+String(e.message||e))}}
async function clearEnglishClips(){if(!englishDB)return;await new Promise((resolve,reject)=>{const tx=englishDB.transaction(ENGLISH_STORE,'readwrite');tx.objectStore(ENGLISH_STORE).clear();tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});for(const url of englishClips.values())URL.revokeObjectURL(url);englishClips.clear();updateEnglishClipStatus('已移除裝置儲存的英文字母錄音。')}
function playEnglishRecording(item,cb,token){const l=englishLetter(item),local=englishClips.get(l),remote=ENGLISH_CURATED_MP3[l];if(!local&&!remote){info('字母 '+l+' 暫無核對好的線上錄音，改用裝置美式語音。',cb);return playTTS(item,'english',cb,token)}
 const a=new Audio();playing=a; a.preload='auto';a.playbackRate=1;let failed=false;const source=local?'本機真人錄音':'Wikimedia Commons 錄音';
 const onFail=()=>{if(token!==seq||failed)return;failed=true;a.onerror=null;a.onended=null;try{a.pause();a.removeAttribute('src')}catch{};playing=null;markSpeaking(false);info(source+'播放失敗；正在嘗試裝置美式語音。',cb);playTTS(item,'english',cb,token)};
 a.onplaying=()=>{if(token===seq){markSpeaking(true);info(`${label(item,'english')} · ${source} · 原速`,cb)}};
 a.onended=()=>{if(token===seq){markSpeaking(false);playing=null;info('錄音播放完成，點喇叭可以重聽',cb)}};
 a.onerror=onFail;
 a.src=local||remote;
 try{const promise=a.play();if(promise&&typeof promise.catch==='function')promise.catch(e=>{if(e?.name==='NotAllowedError'){if(token===seq)info('瀏覽器暫時阻擋聲音，請再按喇叭',cb)}else onFail()});return true}catch(e){onFail();return false}
}

const NUMBER_DB='little-lines-number-recordings-v1',NUMBER_STORE='clips';
const numberClips=new Map();let clipsReady=false,numberAudioDb=null;
function openNumberDB(){return new Promise((resolve,reject)=>{if(!('indexedDB' in window)){reject(Error('IndexedDB 不可用'));return}const req=indexedDB.open(NUMBER_DB,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(NUMBER_STORE))req.result.createObjectStore(NUMBER_STORE,{keyPath:'id'})};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||Error('資料庫無法開啟'))})}
async function prepareClips(){try{numberAudioDb=await openNumberDB();const entries=await new Promise((resolve,reject)=>{const req=numberAudioDb.transaction(NUMBER_STORE,'readonly').objectStore(NUMBER_STORE).getAll();req.onsuccess=()=>resolve(req.result||[]);req.onerror=()=>reject(req.error)});for(const entry of entries){if(entry?.blob instanceof Blob&&entry.id>=0&&entry.id<=99)numberClips.set(entry.id,URL.createObjectURL(entry.blob))}clipsReady=true;updateClipStatus()}catch(e){clipsReady=true;updateClipStatus('此瀏覽器無法儲存錄音：'+(e?.message||'請檢查私密瀏覽設定'))}}
function updateClipStatus(message){const el=$('numberClipCount');if(el)el.textContent=message||`此裝置已有 ${numberClips.size} / 100 個完整數字錄音；沒有錄音的數字仍用臺灣國語語音。`;const del=$('numberClearClips');if(del)del.disabled=!numberClips.size}
async function saveNumberClips(files){const invalid=[],selected=[],seen=new Set();for(const file of files){const m=/^(0|[1-9][0-9])\.(mp3|m4a|wav|ogg)$/i.exec(file.name);if(!m||!file.size||file.size>4*1024*1024||seen.has(+m[1])){invalid.push(file.name);continue}seen.add(+m[1]);selected.push({id:+m[1],blob:new Blob([file],{type:file.type||({mp3:'audio/mpeg',m4a:'audio/mp4',wav:'audio/wav',ogg:'audio/ogg'}[m[2].toLowerCase()])})})}
 if(!selected.length){updateClipStatus('無有效檔案。請使用 0.mp3 ～ 99.mp3（或 m4a/wav/ogg），每檔不超過 4 MB。');return}
 if(!numberAudioDb){updateClipStatus('這台裝置無法儲存錄音；請關閉私密瀏覽或檢查儲存權限。');return}
 try{await new Promise((resolve,reject)=>{const tx=numberAudioDb.transaction(NUMBER_STORE,'readwrite');const store=tx.objectStore(NUMBER_STORE);selected.forEach(x=>store.put(x));tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});for(const x of selected){const old=numberClips.get(x.id);if(old)URL.revokeObjectURL(old);numberClips.set(x.id,URL.createObjectURL(x.blob))}settings.numberAudioMode='recording';persist();renderPanel(false);updateClipStatus(`成功匯入 ${selected.length} 個數字錄音，目前共 ${numberClips.size}/100 個。${invalid.length?'忽略 '+invalid.length+' 個檔名不符的檔案。':''}`)}catch(e){updateClipStatus('匯入失敗：'+(e?.message||'瀏覽器儲存空間可能不足'))}}
async function clearNumberClips(){if(!numberAudioDb)return;await new Promise((resolve,reject)=>{const tx=numberAudioDb.transaction(NUMBER_STORE,'readwrite');tx.objectStore(NUMBER_STORE).clear();tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});for(const url of numberClips.values())URL.revokeObjectURL(url);numberClips.clear();settings.numberAudioMode='voice';persist();renderPanel(false);updateClipStatus('已移除此裝置所有數字錄音，恢復臺灣國語合成音。')}
function hasNumberClip(item){const n=Number(item?.label);return Number.isInteger(n)&&n>=0&&n<=99&&numberClips.has(n)}
function playNumberClip(item,cb,token){const url=numberClips.get(Number(item?.label));if(!url)return false;const a=new Audio();playing=a;a.preload='auto';a.src=url;a.playbackRate=1;a.preservesPitch=true;
 a.onplaying=()=>{if(token===seq){markSpeaking(true);info(`固定錄音：${label(item,'numbers')} · 原速`,cb)}};
 a.onended=()=>{if(token===seq){playing=null;markSpeaking(false);info('固定錄音播放完成，可再點喇叭重聽',cb)}};
 a.onerror=()=>{if(token===seq){playing=null;markSpeaking(false);info('錄音檔無法播放。可在發音設定切回「裝置臺灣國語」。',cb)}};
 try{const p=a.play();if(p?.catch)p.catch(e=>{if(token===seq){markSpeaking(false);info('錄音播放失敗：'+(e?.name||'請檢查裝置音訊格式'),cb)}});return true}catch{info('錄音播放失敗，請換用 MP3 或 WAV 檔',cb);return false}
}

function synth(){return window.speechSynthesis}
function readSettings(){
 try { const x=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')||{};
  const preferred={...(x.voices||{})};
  // V1.8 auto-saved a female-only default even when no voice had been manually chosen.
  // Reset that gender-constrained default once, but preserve users' explicit "other voices" choice.
  if(x.audioMode?.english==='female'&&!x.permitManualEnglish)delete preferred.english;
  return {rates:{...defaults.rates,...(x.rates||{})},voices:preferred,audioMode:{...defaults.audioMode,...(x.audioMode||{}),english:(x.audioMode?.english==='synthesis'&&x.englishModeV110Explicit?'synthesis':'recording')},numberMode:'whole',numberAudioMode:x.numberAudioMode==='recording'?'recording':'voice',englishModeV110Explicit:!!x.englishModeV110Explicit};
 } catch {return JSON.parse(JSON.stringify(defaults))}
}
function persist(){try{localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings))}catch{}}
function chineseNumber(value){let n=Number(value);if(!Number.isInteger(n)||n<0||n>99)return String(value);if(n<10)return DIGITS[n];let tens=Math.trunc(n/10),ones=n%10;return(tens===1?'十':DIGITS[tens]+'十')+(ones?DIGITS[ones]:'')}
function text(item,category){const c=category||currentCategory(),s=String(item?.label??'');if(c==='numbers')return chineseNumber(s);if(c==='hanzi')return s;if(c==='english')return (s[0]||'').toUpperCase();return s}
function label(item,c){return ({numbers:'數字',zhuyin:'注音',english:'英文字母',japanese:'日文假名',hanzi:'國字'}[c]||'字')+' '+String(item?.label??'')}
function ttsText(item,c){return c==='english'?ENGLISH_NAMES[text(item,c)]||text(item,c):text(item,c)}
function normalize(s){return String(s||'').replaceAll('_','-').toLowerCase()}
function supportsVoice(v,c){let lang=normalize(v.lang);return c==='numbers'||c==='zhuyin'||c==='hanzi'?lang==='zh-tw'||lang.startsWith('zh-hant-tw'):c==='english'?lang==='en-us'||lang.startsWith('en-us-'):lang==='ja-jp'||lang==='ja'}
function voiceWeight(v,c){
 const name=String(v.name||''),nm=normalize(name);
 let score=(normalize(v.lang)===normalize(LOCALE[c]||(c==='hanzi'?'zh-TW':''))?100:0)+(v.localService?8:0);
 if(c==='english'){
  if(CLEAR_ENGLISH_NAMES.test(name))score+=55;
  if(ENGLISH_PROVIDER_NAMES.test(name))score+=12;
  if(/\b(compact|low quality|robot|legacy)\b/i.test(name))score-=20;
  // No gender scoring/filtering: clear US letter names matter, not voice gender.
 }else if(c==='numbers'){
  if(/(neural|natural|enhanced|premium|高品質|自然)/i.test(name))score+=35;
  if(/(hsin.yu|hanhan|mei.jia|mei-lin|美佳|曉雨|雅婷|曉臻|淑芬|han.han)/i.test(name))score+=20;
 }
 return score
}
function opts(c){return voices.filter(v=>supportsVoice(v,c)).sort((a,b)=>voiceWeight(b,c)-voiceWeight(a,c))}
function refreshVoices(render=false){try{voices=Array.from(synth()?.getVoices()||[]).filter(v=>v?.name&&v?.lang)}catch{voices=[]}if(render&&$('voicePanelOverlay')&&!$('voicePanelOverlay').classList.contains('hidden'))renderPanel(false);return voices}
function chosenVoice(c){const list=opts(c);let pref=settings.voices[c];return list.find(v=>v.voiceURI===pref||v.name===pref)||list[0]||null}
function voiceName(v){return v?`${v.name}（${v.lang}）${v.localService?' · 本機':''}`:'沒有符合條件的語音'}
function device(){let s=navigator.userAgent||'';return /iPad|iPhone|iPod/.test(s)||navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1?'iPhone／iPad':/Android/i.test(s)?'Android 手機／平板':/Windows/i.test(s)?'Windows 電腦':'此裝置'}
function status(s){const t=$('voiceStatusText');if(t&&$('voicePanelOverlay')&&!$('voicePanelOverlay').classList.contains('hidden'))t.textContent=s}
function markSpeaking(v){document.querySelectorAll('.pretty-speak-btn,.cell-speak-btn').forEach(x=>x.classList.toggle('voice-speaking',v))}
function stop(){seq++;let a=playing;playing=null;if(a){a.onended=null;a.onerror=null;a.onplaying=null;a.pause();a.removeAttribute('src');try{a.load()}catch{}}try{synth()?.cancel()}catch{}activeSpeech=null;markSpeaking(false)}
function recordMode(c){return c==='zhuyin'&&settings.audioMode.zhuyin!=='synthesis'}
function recordedURLs(item,c){if(c!=='zhuyin')return[];const ch=text(item,c),n=ZHUYIN_AUDIO[ch];const official=window.LittleLinesZhuyinOfficial?.entries?.[ch]?.audio;return n?[...(typeof official==='string'&&official.startsWith('./assets/zhuyin-official/')?[official]:[]),SOURCES.zhuyin+`F${n}.WAV`,SOURCES.zhuyinBackup+`F${n}.WAV`]:[]}
function info(s,callback){if(typeof callback==='function')callback(s);status(s)}
function play(item,c,onMessage){if(!item)return false;stop();const token=seq;
 if(c==='numbers'&&settings.numberAudioMode==='recording'&&hasNumberClip(item))return playNumberClip(item,onMessage,token);
 if(c==='numbers'&&settings.numberAudioMode==='recording'&&!hasNumberClip(item)){info('這個數字尚未匯入固定錄音，改用臺灣國語朗讀。',onMessage)}
 if(c==='english'&&settings.audioMode.english!=='synthesis')return playEnglishRecording(item,onMessage,token);
 if(recordMode(c)){
  const urls=recordedURLs(item,c);if(!urls.length){info('沒有對應注音錄音',onMessage);return false}
  let idx=0;
  const next=()=>{if(seq!==token)return;if(idx>=urls.length){info('注音錄音目前無法連線，不使用可能錯誤的近音字代替。',onMessage);return}
   const a=new Audio();playing=a;a.playbackRate=1;a.preservesPitch=true;let failed=false;
   const fail=()=>{if(failed||seq!==token)return;failed=true;a.pause();next()};
   a.onplaying=()=>{if(seq===token){markSpeaking(true);info('教育部注音錄音：'+label(item,c)+' · 原速',onMessage)}};
   a.onended=()=>{if(seq===token){playing=null;markSpeaking(false);info('播放完成，點喇叭可重聽',onMessage)}};
   a.onerror=fail;a.src=urls[idx++];info('正在載入注音錄音…',onMessage);
   const promise=a.play();if(promise?.catch)promise.catch(e=>{if(seq!==token)return;if(e?.name==='NotAllowedError')info('瀏覽器阻擋播放，請再點一次喇叭',onMessage);else if(e?.name!=='AbortError')fail()});
  };next();return true;
 }
 return playTTS(item,c,onMessage,token);
}
function playTTS(item,c,cb,token){if(!window.SpeechSynthesisUtterance||!synth()){info('此瀏覽器不支援發音',cb);return false}
 refreshVoices();const chosen=chosenVoice(c);
 if(!chosen){info(c==='english'?'找不到可用的美式英語語音；請在裝置安裝 en-US 語音或重新偵測。':'找不到對應語言的語音，請在裝置上安裝語音包',cb);return false}
 const u=new SpeechSynthesisUtterance(ttsText(item,c));u.voice=chosen;u.lang=chosen.lang;u.rate=Math.max(.65,Math.min(1.05,Number(settings.rates[c])||defaults.rates[c]||.9));u.pitch=1;u.volume=1;activeSpeech=u;
 u.onstart=()=>{if(token===seq){markSpeaking(true);info(`${label(item,c)} · ${voiceName(chosen)} · ${u.rate.toFixed(2)} 倍`,cb)}};
 u.onend=()=>{if(token===seq){activeSpeech=null;markSpeaking(false);info('播放完成，可再按一次重聽',cb)}};
 u.onerror=e=>{if(token===seq&&!['interrupted','canceled'].includes(e?.error)){markSpeaking(false);info('合成語音播放失敗，請重新偵測語音',cb)}};
 try{synth().speak(u);return true}catch{info('無法播放語音',cb);return false}
}
function sample(c){return {numbers:{label:'25'},zhuyin:{label:'ㄅ'},english:{label:'A'},japanese:{label:'あ'},hanzi:{label:'木'}}[c]||{label:'25'}}
function renderPanel(scan=true){if(!$('voiceSelection'))return;if(scan)refreshVoices();const c=currentCategory(),record=recordMode(c),englishRecorded=c==='english'&&settings.audioMode.english!=='synthesis',recordLike=record||englishRecorded;
 $('voiceDeviceInfo').textContent=device()+' · '+({numbers:'數字 0～99',zhuyin:'注音',english:'英文（清楚發音優先）',japanese:'日文',hanzi:'繁體國字'}[c]);
 $('voiceModeRow').classList.toggle('hidden',c!=='zhuyin'&&c!=='english');if($('englishRecordingPanel'))$('englishRecordingPanel').classList.toggle('hidden',c!=='english');updateEnglishClipStatus();if($('numberRecordingPanel'))$('numberRecordingPanel').classList.toggle('hidden',c!=='numbers');if($('numberAudioToggle'))$('numberAudioToggle').checked=settings.numberAudioMode==='recording';updateClipStatus();document.querySelectorAll('[data-speech-mode]').forEach(b=>b.classList.toggle('selected',b.dataset.speechMode===(recordLike?'recording':'synthesis')));
 $('voiceTtsPanel').classList.toggle('hidden',recordLike);
 let sel=$('voiceSelection');sel.replaceChildren();let list=opts(c);if(!list.length){sel.add(new Option(c==='english'?'找不到美式英語語音':'目前找不到 '+LOCALE[c]+' 語音',''));sel.disabled=true}else{
  sel.disabled=recordLike;list.forEach(v=>sel.add(new Option(voiceName(v),v.voiceURI||v.name)));let v=chosenVoice(c);if(v)sel.value=v.voiceURI||v.name;
  if(!settings.voices[c]&&v){settings.voices[c]=v.voiceURI||v.name;persist()}
 }
 let speed=recordLike?1:Math.max(.65,Math.min(1.05,Number(settings.rates[c])||defaults.rates[c]||.9));$('voiceSpeed').value=String(speed);$('voiceSpeedText').textContent=speed.toFixed(2)+' 倍';$('voiceSpeed').disabled=recordLike;
 document.querySelectorAll('[data-voice-rate]').forEach(b=>{b.disabled=recordLike;b.classList.toggle('selected',Math.abs(Number(b.dataset.voiceRate)-speed)<.001)});
 const item=sample(c);$('voiceSampleText').textContent=item.label+(c==='numbers'?' → '+text(item,c):'');$('voiceTestBtn').disabled=!recordLike&&!chosenVoice(c)&&!(c==='numbers'&&settings.numberAudioMode==='recording'&&hasNumberClip(item));
 let msg='';if(c==='english'){
  msg=englishRecorded?'真人錄音優先：先用本機匯入的音檔；無檔案則嘗試 Wikimedia Commons 核對過的美式字母名稱錄音。L、X 暫用裝置語音。線上錄音需網路，且錄音者可能不同；不是 phonics 自然發音。':'裝置合成語音模式：A～Z 使用選定的 en-US 語音，依字母名稱發音。實際音質仍需在本機試聽。';
 }else if(c==='numbers')msg=settings.numberAudioMode==='recording'?`已啟用固定錄音（${numberClips.size}/100 個）。只有錄音存在的數字會使用原速錄音；其餘會使用下方所選臺灣國語聲音。`:'0～99 朗讀完整數字（如 25 → 二十五）。優先選較自然的 zh-TW 語音；原生速度通常比強制慢速更不易失真。可試聽、換聲音，或匯入自己已確認正確的錄音。';
 else if(c==='zhuyin')msg=Object.keys(window.LittleLinesZhuyinOfficial?.entries||{}).length===37?'注音已內建教育部37個原速發音，離線也能使用。':'注音優先讀取教育部固定錄音；未內建時需要連網，缺檔不使用漢字近音冒充。';
 else msg='日文仍使用裝置提供的日語語音，請由家長試聽。';
 $('voiceAdvisory').textContent=msg;
 $('voiceStatusText').textContent=recordLike?(c==='english'?'優先使用字母真人錄音，若無法載入則使用裝置語音。':'優先使用教育部正式注音錄音。'):chosenVoice(c)?'現在選用：'+voiceName(chosenVoice(c)):'目前沒有可使用的合適語音。';
 let extra=$('voiceQuickSamples');if(extra){extra.replaceChildren();let values=c==='numbers'?['0','1','10','11','17','20','25','99']:c==='english'?['A','E','H','I','W','Z']:[];
 extra.classList.toggle('hidden',!values.length);
 for(const s of values){const b=document.createElement('button');b.type='button';b.textContent=s;b.setAttribute('aria-label','試聽 '+s);b.addEventListener('click',()=>play({label:s},c,status));extra.appendChild(b)}
 }
 $('voiceRefreshBtn')?.classList.remove('hidden');
}
function open(){stop();$('voicePanelOverlay').classList.remove('hidden');document.body.classList.add('voice-panel-open');refreshVoices();renderPanel(false);$('voicePanelClose').focus();
 // iOS Safari often fills its voice list asynchronously, sometimes without voiceschanged.
 clearTimeout(voiceTimer);voiceTimer=setTimeout(()=>{if(!$('voicePanelOverlay').classList.contains('hidden'))renderPanel()},900);
}
function close(){clearTimeout(voiceTimer);stop();$('voicePanelOverlay').classList.add('hidden');document.body.classList.remove('voice-panel-open')}
function init(categoryFn){currentCategory=categoryFn||currentCategory;refreshVoices();prepareClips();prepareEnglishClips();try{synth()?.addEventListener?.('voiceschanged',()=>{refreshVoices();if(!$('voicePanelOverlay').classList.contains('hidden'))renderPanel(false)})}catch{}
 $('voiceSettingsLibrary')?.addEventListener('click',open);$('voiceSettingsPractice')?.addEventListener('click',open);
 $('voicePanelClose')?.addEventListener('click',close);$('voicePanelConfirm')?.addEventListener('click',close);
 $('voicePanelOverlay')?.addEventListener('click',e=>{if(e.target===$('voicePanelOverlay'))close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('voicePanelOverlay').classList.contains('hidden')){e.preventDefault();close()}});
 $('voiceRefreshBtn')?.addEventListener('click',()=>{stop();refreshVoices();renderPanel(false)});
 $('englishClipFiles')?.addEventListener('change',async e=>{await importEnglishClips([...e.target.files]);e.target.value=''});
 $('englishClearClips')?.addEventListener('click',async()=>{if(confirm('要清除這台裝置已匯入的所有英文字母錄音嗎？這不影響練字紀錄。')){stop();try{await clearEnglishClips()}catch(e){updateEnglishClipStatus('清除失敗：'+String(e.message||e))}}});
 $('numberAudioToggle')?.addEventListener('change',e=>{stop();settings.numberAudioMode=e.target.checked?'recording':'voice';persist();renderPanel(false)});
 $('numberClipFiles')?.addEventListener('change',async e=>{await saveNumberClips([...e.target.files]);e.target.value=''});
 $('numberClearClips')?.addEventListener('click',async()=>{if(confirm('要刪除此裝置中匯入的所有數字錄音嗎？這不會刪除練字作品。')){stop();try{await clearNumberClips()}catch(e){updateClipStatus('無法刪除錄音：'+(e?.message||'儲存空間錯誤'))}}});
 $('voiceSelection')?.addEventListener('change',e=>{settings.voices[currentCategory()]=e.target.value;persist();stop();renderPanel()});
 document.querySelectorAll('[data-speech-mode]').forEach(b=>b.addEventListener('click',()=>{const c=currentCategory();if(c!=='zhuyin'&&c!=='english')return;settings.audioMode[c]=b.dataset.speechMode;if(c==='english')settings.englishModeV110Explicit=true;persist();stop();renderPanel()}));
 function changeRate(n){const c=currentCategory();if(recordMode(c)||c==='english'&&settings.audioMode.english!=='synthesis')return;settings.rates[c]=Math.max(.65,Math.min(1.05,Number(n)||defaults.rates[c]));stop();persist();renderPanel()}
 $('voiceSpeed')?.addEventListener('input',e=>changeRate(e.target.value));document.querySelectorAll('[data-voice-rate]').forEach(b=>b.addEventListener('click',()=>changeRate(b.dataset.voiceRate)));
 $('voiceTestBtn')?.addEventListener('click',()=>play(sample(currentCategory()),currentCategory(),status));
}
window.LittleLinesVoice={init,play,stop,text,label,refreshVoices,voiceName,chineseNumber,recordedURLs,zhuyinAudioOrder:ZHUYIN_AUDIO_ORDER,settingsSnapshot:()=>JSON.parse(JSON.stringify(settings)),numberClipsCount:()=>numberClips.size,importNumberFiles:saveNumberClips,englishClipsCount:()=>englishClips.size,importEnglishFiles:importEnglishClips,englishRemoteMap:()=>({...ENGLISH_CURATED_MP3})};
})();
