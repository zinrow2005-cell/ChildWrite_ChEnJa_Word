#!/usr/bin/env python3
"""Build a PARTIAL, structurally checked AnimCJK Taiwan Hanzi stroke pack.

All 300 curriculum characters are considered. Keep every existing lesson/glyph.
The output pack never uses synthetic strokes. The base ZIP contains no externally
fetched data; this optional script downloads from AnimCJK in the GitHub workflow.
Coverage is reported exactly; structural checks are not MOE certification.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import re
import sys
import urllib.request
from pathlib import Path
from build_offline import mirror_svg_path, coordinates_to_path, path_ok

ROOT = Path(__file__).resolve().parent.parent
BASIC = '一二三十人大 小口日月山水火木土田石川天上下中左右手目耳足心子女父母白牛羊生正米八'.replace(' ', '')
EXPECTED = dict(zip(BASIC, [1,2,3,2,2,3,3,3,4,4,3,4,4,4,3,5,5,3,4,3,3,4,5,5,4,5,6,7,4,3,3,4,5,5,4,6,5,5,6,2]))
assert len(BASIC)==len(EXPECTED)==40
URLS = [
 'https://raw.githubusercontent.com/parsimonhi/animCJK/master/graphicsZhHant.txt',
 'https://cdn.jsdelivr.net/gh/parsimonhi/animCJK@master/graphicsZhHant.txt',
]


def lesson_data():
    raw=(ROOT/'assets/hanzi-data.js').read_text(encoding='utf-8-sig').strip()
    match=re.search(r'window\.LITTLE_HANZI\s*=\s*(\{.*\})\s*;?\s*$',raw,re.S)
    if not match:
        raise ValueError('Cannot parse assets/hanzi-data.js curriculum')
    obj=json.loads(match.group(1))
    levels={}
    for lesson in obj['lessons']:
        for item in lesson['characters']:
            char=item['char']
            if char in levels:raise ValueError('duplicate lesson character: '+char)
            levels[char]=item['level']
    if len(levels)!=300 or set(BASIC)-set(levels):
        raise ValueError('Expected exactly 300 curriculum characters including 40 beginner chars')
    return levels


def read_source(path):
    if path:return Path(path).read_text(encoding='utf-8-sig')
    errors=[]
    for url in URLS:
        try:
            req=urllib.request.Request(url,headers={'User-Agent':'LittleLines-Hanzi-300-Builder/1.33'})
            with urllib.request.urlopen(req,timeout=45) as resp:blob=resp.read(24_000_001)
            if len(blob)>24_000_000:raise ValueError('Input larger than 24MB')
            return blob.decode('utf-8-sig')
        except Exception as exc:errors.append(str(exc))
    raise RuntimeError('Download failed; nothing will be fabricated. '+ ' | '.join(errors))


def valid_count(char,n,levels):
    return isinstance(n,int) and (n==EXPECTED[char] if char in EXPECTED else 2<=n<=40) and char in levels


def parse_source(raw,levels):
    found={}
    if len(raw.splitlines())<40:raise ValueError('Incomplete source')
    for line in raw.splitlines():
        if not line.strip():continue
        try:entry=json.loads(line)
        except (ValueError,TypeError):continue
        if not isinstance(entry,dict):continue
        ch=entry.get('character')
        if ch not in levels:continue
        strokes,medians=entry.get('strokes'),entry.get('medians')
        if not isinstance(strokes,list) or not isinstance(medians,list):continue
        if len(strokes)!=len(medians) or not valid_count(ch,len(strokes),levels):continue
        try:
            fills=[mirror_svg_path(path) for path in strokes]
            lines=[]
            for points in medians:
                if not isinstance(points,list) or not 2<=len(points)<=1500:raise ValueError('Bad median length')
                if any(not isinstance(p,list) or len(p)!=2 or any(not isinstance(v,(int,float)) or abs(v)>5000 for v in p) for p in points):raise ValueError('Bad coordinates')
                lines.append(coordinates_to_path([[x,900-y] for x,y in points]))
            if any(not path_ok(p) for p in fills+lines):continue
            found[ch]={'fills':fills,'medians':lines,'from':'AnimCJK graphicsZhHant.txt · Taiwan traditional reference, NOT MOE-certified'}
        except (ValueError,TypeError):continue
    return found


def verify(data,levels):
    if not data:raise ValueError('No real valid matching strokes; stop deployment')
    signatures={};total=0;counts={str(level):0 for level in range(1,6)}
    for char,d in data.items():
        n=len(d['fills'])
        if char not in levels or len(d['medians'])!=n or not valid_count(char,n,levels):raise ValueError(char+' count mismatch')
        if not all(path_ok(p) for p in d['fills']+d['medians']):raise ValueError(char+' invalid SVG')
        signature=hashlib.sha256(json.dumps(d['medians'],ensure_ascii=False).encode()).hexdigest()
        if signature in signatures:raise ValueError('Repeated stroke geometry for '+char+' and '+signatures[signature])
        signatures[signature]=char
        total+=n;counts[str(levels[char])]+=1
    keys=set(levels)-set(data)
    return dict(curriculumTotal=len(levels),available=len(data),missing=len(keys),missingCharacters=''.join(ch for ch in levels if ch in keys),byLevel=counts,totalStrokes=total,validation='Stroke geometry checks only; NOT Taiwan MOE standard certification')


def build(source,site):
    levels=lesson_data()
    data=parse_source(read_source(source),levels)
    report=verify(data,levels)
    site=Path(site)
    if not (site/'index.html').is_file():raise FileNotFoundError('Site not prepared')
    content='/* V1.33 Partial, real AnimCJK Hanzi strokes. See THIRD_PARTY_NOTICES.md. NOT MOE certified. */\nwindow.LITTLE_LINES_HANZI_PACK='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n'
    (site/'assets').mkdir(parents=True,exist_ok=True)
    (site/'assets/hanzi-pack.js').write_text(content,encoding='utf8')
    digest=hashlib.sha256(content.encode()).hexdigest()
    (site/'OFFLINE_HANZI_BUILD_REPORT.json').write_text(json.dumps({'source':'AnimCJK graphicsZhHant.txt','license':'Arphic Public License','sha256':digest,**report},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    sw=site/'sw.js';js=sw.read_text(encoding='utf8')
    js=re.sub(r"const CACHE='little-lines-[^']+'",f"const CACHE='little-lines-v1.33-hanzi-{digest[:12]}'",js)
    sw.write_text(js,encoding='utf8')
    print('BUILT partial genuine source pack:',json.dumps(report,ensure_ascii=False))
    return report


def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--source-file',type=Path)
    ap.add_argument('--site',type=Path,required=True)
    opts=ap.parse_args()
    try:build(opts.source_file,opts.site)
    except Exception as exc:
        print('NO HANZI PACK GENERATED:',exc,file=sys.stderr)
        return 1
    return 0

if __name__=='__main__':sys.exit(main())
