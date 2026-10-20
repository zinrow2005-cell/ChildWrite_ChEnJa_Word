#!/usr/bin/env python3
"""Build a complete Japanese-kana offline Little Lines PWA from real, open-source stroke data.

No placeholder strokes: this builder fails if a complete and sufficiently diverse source
cannot be verified. It uses only Python's standard library. In GitHub Actions the
source files are fetched automatically; locally, --source-dir can read two downloaded
JSON files and avoid any external network.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import re
import shutil
import sys
import urllib.request
import zipfile
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HIRA = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'
KATA = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
ALL = HIRA + KATA
assert len(HIRA) == len(KATA) == 46 and len(set(ALL)) == 92
SOURCE_URLS = {
    'allHiragana.json': [
        'https://cdn.jsdelivr.net/npm/kana-svg-data/dist/allHiragana.json',
        'https://unpkg.com/kana-svg-data/dist/allHiragana.json',
    ],
    'allKatakana.json': [
        'https://cdn.jsdelivr.net/npm/kana-svg-data/dist/allKatakana.json',
        'https://unpkg.com/kana-svg-data/dist/allKatakana.json',
    ],
}
GRAPHICS_URLS = [
    'https://raw.githubusercontent.com/parsimonhi/animCJK/master/graphicsJaKana.txt',
    'https://cdn.jsdelivr.net/gh/parsimonhi/animCJK@master/graphicsJaKana.txt',
]
PATH_RE = re.compile(r'^[0-9eE+.,\-\sMmLlHhVvCcSsQqTtAaZz]+$')
ID_RE = re.compile(r'^(\d+)([a-z]*)$', re.IGNORECASE)
TOKENS_RE = re.compile(r'[a-zA-Z]|[-+]?(?:\d*\.)?\d+(?:[eE][-+]?\d+)?')
EXPECTED = {'あ':3, 'い':2, 'う':2, 'え':2, 'お':3, 'し':1, 'く':1, 'つ':1, 'へ':1,
            'ア':2, 'イ':2, 'ウ':3, 'エ':3, 'オ':3, 'ン':2}


def path_ok(path):
    return isinstance(path, str) and 6 < len(path) < 36000 and PATH_RE.fullmatch(path.strip()) is not None and re.search(r'[Mm]', path)


def coordinates_to_path(seq):
    if not isinstance(seq, list) or len(seq) < 2 or len(seq) > 500:
        raise ValueError('invalid stroke median coordinate sequence')
    segments=[]
    for i, p in enumerate(seq):
        if not isinstance(p, list) or len(p)!=2 or any(not isinstance(n,(float,int)) or abs(n)>5000 for n in p):
            raise ValueError('invalid stroke median point')
        segments.append(('M' if i==0 else 'L') + f'{p[0]} {p[1]}')
    return ' '.join(segments)


def parse_kana_json(items, characters):
    if not isinstance(items, list) or len(items) < 40 or len(items) > 100:
        raise ValueError('source list is not a plausible kana source')
    found = {}
    for obj in items:
        if not isinstance(obj, dict): continue
        try: ch = chr(int(obj['charCode']))
        except (KeyError, ValueError, TypeError, OverflowError): continue
        if ch not in characters: continue
        fills=defaultdict(list); paths=defaultdict(list)
        for item in obj.get('strokes', []):
            ident=ID_RE.fullmatch(str(item.get('id','')))
            value=item.get('value')
            if ident and path_ok(value): fills[int(ident.group(1))].append((ident.group(2),value))
        for item in obj.get('medians', []):
            ident=ID_RE.fullmatch(str(item.get('id','')))
            if not ident: continue
            try: val=coordinates_to_path(item.get('value')) if isinstance(item.get('value'),list) else item.get('value')
            except ValueError: continue
            if path_ok(val): paths[int(ident.group(1))].append((ident.group(2),val))
        ids=sorted(set(fills)&set(paths))
        if not ids or len(ids)>12 or len(ids)!=len(set(fills)|set(paths)):
            continue
        pen_fills=[];pen_medians=[]
        for ident in ids:
            sorted_fills=[v for _,v in sorted(fills[ident])]
            sorted_medians=[v for _,v in sorted(paths[ident])]
            if not sorted_fills or not sorted_medians: break
            # Keep split outlines together. Separate subpaths with M so we do not
            # invent a false straight-line writing stroke between distant pieces.
            pen_fills.append(' '.join(sorted_fills))
            pen_medians.append(' '.join(sorted_medians))
        if len(pen_fills)==len(ids):
            found[ch]={'fills':pen_fills,'medians':pen_medians,'from':'AnimCJK · kana-svg-data (LGPL-3.0-or-later)'}
    return found


def mirror_svg_path(source):
    """Flip AnimCJK graphics text from Y-up to SVG Y-down (absolute y -> 900-y)."""
    tokens=TOKENS_RE.findall(source)
    arity={'M':2,'L':2,'T':2,'H':1,'V':1,'C':6,'S':4,'Q':4}
    out=[]; cmd=None; i=0; repeats=0
    while i<len(tokens):
        if tokens[i].isalpha() and len(tokens[i])==1:
            cmd=tokens[i];i+=1; repeats=0
            if cmd.upper()=='Z': out.append(cmd);cmd=None;continue
        if not cmd or cmd.upper() not in arity: raise ValueError('unsupported SVG command')
        n=arity[cmd.upper()]
        if i+n>len(tokens) or any(re.fullmatch(r'[a-zA-Z]',z) for z in tokens[i:i+n]): raise ValueError('malformed path')
        v=[float(z) for z in tokens[i:i+n]]; i+=n
        if any(abs(z)>5000 for z in v):raise ValueError('path coordinate too large')
        for j in range(n):
            y=cmd.upper()=='V' or cmd.upper()!='H' and j%2==1
            if y:v[j]=900-v[j] if cmd.isupper() else -v[j]
        actual=('L' if cmd=='M' else 'l' if cmd=='m' else cmd) if repeats else cmd
        out.append(actual+' '+' '.join(f'{z:g}' for z in v)); repeats+=1
    result=' '.join(out)
    if not path_ok(result):raise ValueError('invalid converted svg path')
    return result


def parse_graphics(text):
    lines=text.strip().splitlines()
    if not 90<=len(lines)<=300:raise ValueError('implausible graphicsJaKana line count')
    dataset={}
    for line in lines:
        try:obj=json.loads(line)
        except json.JSONDecodeError: continue
        c=obj.get('character')
        if c not in ALL:continue
        try:
            s=obj['strokes']; med=obj['medians']
            if not isinstance(s,list) or not 1<=len(s)<=12 or len(s)!=len(med):continue
            fills=[mirror_svg_path(d) for d in s]
            medians=[]
            for poly in med:
                points=[(p[0],900-p[1]) for p in poly]
                medians.append(coordinates_to_path([list(p) for p in points]))
            dataset[c]={'fills':fills,'medians':medians,'from':'AnimCJK · graphicsJaKana.txt (Arphic Public License)'}
        except (KeyError,ValueError,TypeError):continue
    return dataset


def verify(dataset, kind):
    if set(dataset)!=set(ALL):
        missing=''.join(c for c in ALL if c not in dataset)
        raise ValueError(f'expected 92 real kana, got {len(dataset)}; missing: {missing}')
    sigs=[];counter=[]
    for ch in ALL:
        r=dataset[ch]
        a,b=r.get('fills'),r.get('medians')
        if not isinstance(a,list) or not isinstance(b,list) or not 1<=len(a)<=12 or len(a)!=len(b):
            raise ValueError(f'{ch}: inconsistent or missing strokes')
        if any(not path_ok(s) for s in a+b):raise ValueError(f'{ch}: invalid SVG path')
        if ch in EXPECTED and len(b)!=EXPECTED[ch]:
            raise ValueError(f'{ch}: wrong number of strokes {len(b)} vs expected {EXPECTED[ch]}')
        sigs.append(hashlib.sha256(json.dumps([a,b],sort_keys=True).encode()).hexdigest())
        counter.append(len(b))
    diversity=len(set(sigs))
    if diversity<80:raise ValueError(f'non-genuine or duplicated source: {diversity}/92 distinct shapes')
    if len(set(counter))<3:raise ValueError('suspicious number of strokes')
    return {'count':92,'distinctShapes':diversity,'hiragana':46,'katakana':46,
            'sumStrokes':sum(counter),'sourceFormat':kind,
            'verified':'structural only; not school-standard stroke-order certification'}


def download(url):
    req=urllib.request.Request(url,headers={'User-Agent':'LittleLines-OffLineBuilder/1.22 (educational; source attribution in bundle)'})
    with urllib.request.urlopen(req,timeout=28) as res:
        buf=res.read(9_000_001)
    if len(buf)>9_000_000:raise ValueError('source file too large')
    return buf.decode('utf-8-sig')


def fetch_data(source_dir=None):
    errors=[]
    # Prefer JSON where 3a/3b are explicit segment IDs, allowing true pen-stroke grouping.
    try:
        parts={}
        for filename, expected in [('allHiragana.json',HIRA),('allKatakana.json',KATA)]:
            if source_dir and (source_dir/filename).exists():
                raw=(source_dir/filename).read_text(encoding='utf-8-sig')
            elif source_dir:
                raise FileNotFoundError(f'{filename} missing from {source_dir}')
            else:
                raw=None
                for url in SOURCE_URLS[filename]:
                    try:raw=download(url);break
                    except Exception as e:errors.append(f'{url}: {e}')
                if raw is None:raise RuntimeError(f'unable to obtain {filename}')
            parts.update(parse_kana_json(json.loads(raw), expected))
        return parts,verify(parts,'json'),errors
    except Exception as e:errors.append(f'bulk JSON: {e}')
    try:
        if source_dir and (source_dir/'graphicsJaKana.txt').exists():
            raw=(source_dir/'graphicsJaKana.txt').read_text(encoding='utf-8-sig')
        elif source_dir:
            raise FileNotFoundError('graphicsJaKana.txt missing from source folder')
        else:
            raw=None
            for url in GRAPHICS_URLS:
                try:raw=download(url);break
                except Exception as e:errors.append(f'{url}: {e}')
            if raw is None:raise RuntimeError('unable to obtain AnimCJK graphicsJaKana.txt')
        data=parse_graphics(raw)
        return data,verify(data,'graphics'),errors
    except Exception as e:errors.append(f'AnimCJK graphics: {e}')
    raise RuntimeError('FAILED: no complete and valid real-data source available.\n'+'\n'.join(errors))


def package(dataset,info,outdir,zipout):
    if outdir.exists():shutil.rmtree(outdir)
    outdir.mkdir(parents=True)
    for child in ROOT.iterdir():
        if child.name in ('scripts','.github','dist','__pycache__') or child.name.startswith('.pytest'):continue
        if child.is_dir():shutil.copytree(child,outdir/child.name)
        elif child.is_file():shutil.copy2(child,outdir/child.name)
    pack='/* Real-data kana pack. See THIRD_PARTY_NOTICES.md. Not a certification of Japanese classroom stroke order. */\nwindow.LITTLE_LINES_KANA_PACK='+json.dumps(dataset,ensure_ascii=False,separators=(',',':'))+';\n'
    (outdir/'assets/kana-pack.js').write_text(pack,encoding='utf-8')
    stamp=hashlib.sha256(pack.encode()).hexdigest()[:12]
    sw=outdir/'sw.js'
    s=sw.read_text(encoding='utf-8')
    s=re.sub(r"little-lines-v1\.24-[A-Za-z0-9-]+",f'little-lines-v1.24-kana-{stamp}',s)
    sw.write_text(s,encoding='utf-8')
    meta={'buildUTC':datetime.now(timezone.utc).isoformat(),'source':dataset['あ']['from'], 'shapeHashSha256':hashlib.sha256(pack.encode()).hexdigest(),**info}
    (outdir/'OFFLINE_KANA_BUILD_REPORT.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    if zipout:
        zipout.parent.mkdir(parents=True,exist_ok=True)
        with zipfile.ZipFile(zipout,'w',compression=zipfile.ZIP_DEFLATED) as z:
            for p in sorted(outdir.rglob('*')):
                if p.is_file():z.write(p,p.relative_to(outdir).as_posix())
    print('COMPLETE authentic-source kana offline package:', json.dumps(meta,ensure_ascii=False))


def main():
    cli=argparse.ArgumentParser(description=__doc__)
    cli.add_argument('--source-dir',type=Path,help='folder containing two real bulk JSON files or graphicsJaKana.txt')
    cli.add_argument('--output-dir',type=Path,default=ROOT/'dist/site')
    cli.add_argument('--zip-out',type=Path,default=ROOT/'dist/LittleLines_V1.24_Kana92_Offline_GitHub_PWA.zip')
    args=cli.parse_args()
    try:
        data,info,errors=fetch_data(args.source_dir)
        if errors:print('Source fallback warnings:',*errors,sep='\n',file=sys.stderr)
        package(data,info,args.output_dir,args.zip_out)
    except Exception as e:
        print('OFFLINE BUILD BLOCKED:',e,file=sys.stderr)
        print('The existing package is not overwritten with incomplete or synthetic kana.',file=sys.stderr)
        return 1
    return 0

if __name__=='__main__':sys.exit(main())
