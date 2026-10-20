#!/usr/bin/env python3
"""Build MOE's *unaltered* Bopomofo SVG/audio companion pack for LittleLines.

Input: MOE materials zip (either --source-zip or official download).  No fake data.
The SVG is presented separately as the official original demonstration: it is not
mistaken for AnimCJK stroke geometry on the handwriting board.
"""
import argparse
import collections
import hashlib
import io
import json
import pathlib
import re
import shutil
import sys
import urllib.request
import zipfile

MOE='https://language.moe.gov.tw/001/Upload/files/site_content/M0001/juyin/bopomofo_materials_20170213.zip'
ORDER='ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦㄧㄨㄩ'
assert len(ORDER)==37 and len(set(ORDER))==37
MEDIA_EXT={'.wav','.mp3','.m4a','.ogg'}
MAX_ZIP=75_000_000


def get_zip(path):
    if path:
        source=pathlib.Path(path)
        if source.stat().st_size>MAX_ZIP:raise ValueError('素材包過大')
        return source.read_bytes()
    req=urllib.request.Request(MOE,headers={'User-Agent':'LittleLines/1.23 educational attribution MOE'})
    with urllib.request.urlopen(req,timeout=45) as res: data=res.read(MAX_ZIP+1)
    if len(data)>MAX_ZIP:raise ValueError('下載的素材包超過上限')
    return data


def decode_name(raw):
    # ZIP archives may carry Big5 encoded path strings (unmarked CP437).
    # Prefer Unicode, otherwise try ZIP legacy encodings.
    candidates=[raw]
    try:
        b=raw.encode('cp437')
        for enc in ('utf-8','cp950','big5'):
            try:candidates.append(b.decode(enc))
            except UnicodeError:pass
    except UnicodeError:pass
    return next((name for name in candidates if any(c in name for c in ORDER)),raw)


def char_for(path):
    if any(c in path for c in ORDER):
        parts=re.split(r'[/\\]',path)
        # Match exactly a character-directory or filename rather than a stray char.
        for component in parts:
            stem=pathlib.PurePosixPath(component).stem
            for c in ORDER:
                if component==c or stem==c or stem in (f'U+{ord(c):04X}',str(ord(c)),f'{ord(c):04x}'):
                    return c
    return None


def build(src,destination):
    if not zipfile.is_zipfile(io.BytesIO(src)):raise ValueError('不是有效的教育部素材 ZIP')
    extracted=[]
    with zipfile.ZipFile(io.BytesIO(src)) as z:
        names=z.infolist()
        if len(names)>1500:raise ValueError('ZIP 檔案過多')
        if sum(n.file_size for n in names)>180_000_000:raise ValueError('ZIP 解壓大小過大')
        for f in names:
            if f.is_dir() or f.file_size>12_000_000:continue
            name=decode_name(f.filename)
            ext=pathlib.PurePosixPath(name).suffix.lower()
            if ext not in MEDIA_EXT|{'.svg','.xml'}:continue
            data=z.read(f)
            if not data:continue
            extracted.append((name,ext,data))
    if len(extracted)<74:raise ValueError(f'素材檔案數太少：{len(extracted)}')
    by_char=collections.defaultdict(lambda:collections.defaultdict(list))
    audio_index={}
    for name,ext,data in extracted:
        ch=char_for(name)
        if ext in MEDIA_EXT:
            stem=pathlib.PurePosixPath(name).stem.upper()
            m=re.fullmatch(r'(?:F|S|SOUND|AUDIO)[_-]?0*(\d{1,2})',stem)
            if m and 1<=int(m.group(1))<=37:
                audio_index.setdefault(int(m.group(1)),(name,ext,data))
        if ch:by_char[ch][ext].append((name,ext,data))
    entries={}
    for n,ch in enumerate(ORDER,1):
        svg_list=by_char[ch].get('.svg',[])
        if not svg_list:
            raise ValueError(f'官方素材缺少 {ch} SVG；可能是壓縮檔路徑命名不同，需要人工查核')
        # Prefer a normal SVG over an abbreviated preview.
        svg=max(svg_list,key=lambda x:len(x[2]))
        if b'<svg' not in svg[2].lower():raise ValueError(f'{ch} SVG 格式不符')
        aud=(by_char[ch].get('.wav') or by_char[ch].get('.mp3') or by_char[ch].get('.m4a') or
             ([audio_index[n]] if n in audio_index else []))
        if not aud:raise ValueError(f'官方素材缺少 {ch} 真人發音檔')
        audio=aud[0]
        if audio[1]=='.wav' and not (audio[2][:4] in (b'RIFF',b'RIFX')):
            raise ValueError(f'{ch} 音檔不是有效 WAV')
        entries[ch]={'svg':f'./assets/zhuyin-official/{ord(ch)}.svg',
                     'audio':f'./assets/zhuyin-official/{ord(ch)}{audio[1]}'}
    if len(entries)!=37:raise ValueError('不足37符號')
    folder=destination/'assets'/'zhuyin-official'
    folder.mkdir(parents=True,exist_ok=True)
    # Reextract matching media only after all 37 validated.
    for n,ch in enumerate(ORDER,1):
        svg=max(by_char[ch]['.svg'],key=lambda x:len(x[2]))
        aud=(by_char[ch].get('.wav') or by_char[ch].get('.mp3') or by_char[ch].get('.m4a') or
             ([audio_index[n]] if n in audio_index else []))[0]
        (folder/f'{ord(ch)}.svg').write_bytes(svg[2])
        (folder/f'{ord(ch)}{aud[1]}').write_bytes(aud[2])
    manifest={'source':'教育部《國語注音符號手冊》 · CC BY 4.0',
              'sourceUrl':'https://language.moe.gov.tw/001/Upload/files/site_content/M0001/juyin/',
              'bundled':True,'entries':entries}
    (destination/'assets'/'zhuyin-official.js').write_text(
        '/* V1.23 教育部注音符號動畫 SVG 及音檔，原始媒體保留不修改。CC BY 4.0 */\n'
        'window.LittleLinesZhuyinOfficial='+json.dumps(manifest,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
    # Include generated assets for PWA offline use (the base cache already includes manifest).
    sw=destination/'sw.js'; body=sw.read_text(encoding='utf-8')
    files=[p.lstrip('./') for e in entries.values() for p in e.values()]
    unique=sorted(set(files))
    needle="'./manifest.webmanifest'"
    if needle not in body:raise ValueError('找不到 SW 預快取清單')
    body=body.replace(needle,','.join(repr('./'+x) for x in unique)+','+needle)
    # Make the SW revision dependent on the official source, so a newly built
    # animation/audio set invalidates an earlier cached Bopomofo pack.
    digest=hashlib.sha256(b''.join((folder/f'{ord(ch)}.svg').read_bytes() + (folder/f'{ord(ch)}{pathlib.PurePosixPath(entries[ch]["audio"]).suffix}').read_bytes() for ch in ORDER)).hexdigest()[:10]
    body=re.sub(r'little-lines-v1\.23-(?:kana-)?[a-zA-Z0-9-]+',lambda m:m.group(0)+'-zh'+digest,body,count=1)
    sw.write_text(body,encoding='utf-8')
    return manifest


def main():
    a=argparse.ArgumentParser()
    a.add_argument('--source-zip',help='手動下載的教育部 bopomofo_materials_20170213.zip')
    a.add_argument('--site',default='dist/site')
    a.add_argument('--verify-only',action='store_true')
    args=a.parse_args()
    if args.verify_only:raise SystemExit('此工具需要網站目錄，請省略 --verify-only')
    site=pathlib.Path(args.site)
    if not (site/'index.html').exists():raise SystemExit('找不到已建置的網站目錄')
    try:manifest=build(get_zip(args.source_zip),site)
    except Exception as e:
        print('教育部 37 注音離線素材取得／驗證失敗：',e,file=sys.stderr)
        print('沒有使用不完整素材代替。可使用 --source-zip 指定原始素材。',file=sys.stderr)
        raise SystemExit(1)
    print('教育部官方注音離線素材驗證：',len(manifest['entries']),'/37 SVG + 37/37 發音，原始檔案未更改')

if __name__=='__main__': main()
