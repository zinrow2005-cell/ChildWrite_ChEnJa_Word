/* Little Lines V1.33 | zero-dependency ZIP creator (stored method, CRC32).
   Generates an editable offline PWA package containing the source and user's
   legally obtained kana stroke SVG paths. Not an official stroke-order audit. */
(()=>{'use strict';
 const te=new TextEncoder();
 const zipPaths=['.nojekyll','index.html','styles.css','app.js','voice.js','sw.js','manifest.webmanifest',
  'assets/glyphs.js','assets/hanzi-data.js','assets/hanzi-glyphs.js',
  'assets/hanzi-practice-guides.js','assets/hanzi-pack.js','assets/kana-offline.js','assets/offline-export.js',
  'assets/kana-pack.js','assets/zhuyin-official.js','icons/icon-192.png','icons/icon-512.png',
  'OFL-Noto.txt','README.md','QA_TEST_REPORT.md','THIRD_PARTY_NOTICES.md',
  'licenses/GPL-3.0.txt','licenses/LGPL-3.0.txt','licenses/ARPHIC_PUBLIC_LICENSE.txt'];
 const u16=(b,o,n)=>{b[o]=n&255;b[o+1]=(n>>>8)&255};
 const u32=(b,o,n)=>{u16(b,o,n);u16(b,o+2,n>>>16)};
 const crcTable=new Uint32Array(256);
 for(let n=0;n<256;n++){let c=n;for(let i=0;i<8;i++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;crcTable[n]=c>>>0}
 const crc32=a=>{let c=0xffffffff;for(let i=0;i<a.length;i++)c=crcTable[(c^a[i])&255]^(c>>>8);return (c^0xffffffff)>>>0};
 function createZip(files){let offset=0;const local=[],central=[];
  for(const file of files){const name=te.encode(file.path),data=file.bytes,crc=crc32(data),size=data.length;
   const lh=new Uint8Array(30+name.length);u32(lh,0,0x04034b50);u16(lh,4,20);u16(lh,6,0x0800);u16(lh,8,0);u16(lh,10,0);u16(lh,12,0);u32(lh,14,crc);u32(lh,18,size);u32(lh,22,size);u16(lh,26,name.length);lh.set(name,30);
   local.push(lh,data);
   const ch=new Uint8Array(46+name.length);u32(ch,0,0x02014b50);u16(ch,4,20);u16(ch,6,20);u16(ch,8,0x0800);u16(ch,10,0);u16(ch,12,0);u16(ch,14,0);u32(ch,16,crc);u32(ch,20,size);u32(ch,24,size);u16(ch,28,name.length);u32(ch,42,offset);ch.set(name,46);
   central.push(ch);offset+=lh.length+size;
  }
  const centralSize=central.reduce((a,b)=>a+b.length,0);
  const end=new Uint8Array(22);u32(end,0,0x06054b50);u16(end,8,files.length);u16(end,10,files.length);u32(end,12,centralSize);u32(end,16,offset);
  return new Blob([...local,...central,end],{type:'application/zip'});
 }
 async function generate(entries){const name='小小練字樂園_V1.24_日文92字離線包_GitHub_PWA.zip';
  const packJS='/* Source: AnimCJK graphicsJaKana (Arphic Public License for graphics text); kana-svg-data / kana SVG (LGPL-3.0-or-later). Consult THIRD_PARTY_NOTICES.md. */\nwindow.LITTLE_LINES_KANA_PACK='+JSON.stringify(entries)+';\n';
  const stamp=crc32(te.encode(packJS)).toString(16).padStart(8,'0');
  const files=[];
  const zh=window.LittleLinesZhuyinOfficial;
  const officialPaths=zh?.bundled&&Object.keys(zh.entries||{}).length===37?
    [...new Set(Object.values(zh.entries).flatMap(v=>[v.svg,v.audio]).filter(v=>typeof v==='string'&&/^\.\/assets\/zhuyin-official\/[\d]+\.(svg|wav|mp3|m4a|ogg)$/i.test(v)).map(v=>v.slice(2)))]:[];
  // Never silently omit official media from an offline ZIP created on a completed deployment.
  if(zh?.bundled&&officialPaths.length!==74)throw new Error('教育部注音檔案不完整，請重新建置；不產生不完整離線 ZIP');
  for(const path of [...zipPaths,...officialPaths]){let bytes;
   if(path==='assets/kana-pack.js')bytes=te.encode(packJS);
   else{
    const resp=await fetch('./'+path,{cache:'no-store'});
    if(!resp.ok)throw new Error('無法讀取網站檔案 '+path+'：HTTP '+resp.status);
    const raw=new Uint8Array(await resp.arrayBuffer());
    if(path==='sw.js'){
      let t=new TextDecoder().decode(raw);
      t=t.replace(/little-lines-v1\.24-[a-zA-Z0-9-]+/g,'little-lines-v1.24-full-'+stamp);
      bytes=te.encode(t);
    }else bytes=raw;
   }
   files.push({path,bytes});
  }
  const note='完整離線版 — 日文 92 字已打包於 assets/kana-pack.js。\n'+
   '上傳 ZIP 解壓後的所有檔案到同一個 GitHub Pages 儲存庫根目錄。\n'+
   '筆順來源：AnimCJK graphicsJaKana.txt 的字形文字資料可能適用 Arphic Public License；Kana SVG / kana-svg-data 適用 LGPL-3.0-or-later。兩份授權請參照 THIRD_PARTY_NOTICES.md。\n'+
   '逐筆路徑是開源教學參考，未逐字確認日本學校教材，勿視為正式筆順認證。\n'+
   '若原站成功內建教育部注音37組官方素材，本 ZIP 會一併保留；否則注音仍需要連網。若原站已內建國字開源參考，hanzi-pack.js 也會一起保留。其他發音可能仍需網路。\n'+
   '別忘了先備份舊版練習紀錄；相同 GitHub Pages 網址更新後可保留瀏覽器資料。\n';
  files.push({path:'日文92字離線部署說明.txt',bytes:te.encode(note)});
  const blob=createZip(files),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);
  return {files:files.length,size:blob.size,name};
 }

 async function generateHanzi(entries){
  if(!entries||!Object.keys(entries).length||Object.keys(entries).length>300)throw new Error('沒有可用的國字逐筆參考，不能打包');
  const te2=new TextEncoder(),packJS='/* V1.33 · AnimCJK Taiwan Traditional reference paths. See THIRD_PARTY_NOTICES.md. Not a Taiwan MOE certification. */\nwindow.LITTLE_LINES_HANZI_PACK='+JSON.stringify(entries)+';\n';
  const sig=crc32(te2.encode(packJS)).toString(16).padStart(8,'0');
  const files=[];
  const z=window.LittleLinesZhuyinOfficial;
  const officialPaths=z?.bundled&&Object.keys(z.entries||{}).length===37? [...new Set(Object.values(z.entries).flatMap(item=>[item.svg,item.audio]).filter(path=>typeof path==='string'&&/^\.\/assets\/zhuyin-official\/[\d]+\.(svg|wav|mp3|m4a|ogg)$/i.test(path)).map(path=>path.slice(2)))]:[];
  if(z?.bundled&&officialPaths.length!==74)throw new Error('教育部注音原始素材缺漏，不能打包不完整網站');
  for(const path of [...zipPaths,...officialPaths]){
   let bytes;
   if(path==='assets/hanzi-pack.js')bytes=te2.encode(packJS);
   else {
    const response=await fetch('./'+path,{cache:'no-store'});
    if(!response.ok)throw new Error('讀取檔案失敗 '+path+' (HTTP '+response.status+')');
    const contents=new Uint8Array(await response.arrayBuffer());
    if(path==='sw.js'){
     const txt=new TextDecoder().decode(contents).replace(/const CACHE='little-lines-[^']+'/,'const CACHE=\'little-lines-v1.33-hanzi-'+sig+'\'');
     bytes=te2.encode(txt);
    }else bytes=contents;
   }
   files.push({path,bytes});
  }
  const report={format:'little-lines-hanzi-offline-report',characters:Object.keys(entries).length,curriculumCharacters:300,missingCharacters:300-Object.keys(entries).length,source:'AnimCJK graphicsZhHant.txt',license:'Arphic Public License',check:'Structural integrity only, not MOE stroke-order certification',shaChecksum:sig};
  files.push({path:'OFFLINE_HANZI_BUILD_REPORT.json',bytes:te2.encode(JSON.stringify(report,null,2))});
  files.push({path:'國字300字離線使用說明.txt',bytes:te2.encode('本網站包含 '+Object.keys(entries).length+'／300 個臺灣繁體國字的開源逐筆路徑。未取得逐筆資料的字仍可空心字描寫，並不顯示假箭頭。筆畫數及路徑驗證不等於符合教育部標準筆順。\n來源：AnimCJK · graphicsZhHant.txt；授權請閱讀 THIRD_PARTY_NOTICES.md 與 licenses/。\n解壓 ZIP 內所有檔案上傳 GitHub Pages 根目錄後使用，同網址可保留原練習紀錄。\n')});
  const blob=createZip(files),name='小小練字樂園_V1.33_國字'+Object.keys(entries).length+'字逐筆參考_300字教材_GitHub_PWA.zip';
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),20000);
  return {files:files.length,size:blob.size,name};
 }
 window.LittleLinesOfflineExport={generate,generateHanzi};
})();
