import os
from html.parser import HTMLParser
import csv

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
HTML_EXTS = ('.html', '.htm')

class ImgParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images = []
    def handle_starttag(self, tag, attrs):
        if tag.lower() == 'img':
            ad = dict(attrs)
            src = ad.get('src','').strip()
            alt = ad.get('alt','').strip()
            self.images.append((src, alt))

collected = []
for dirpath, dirs, files in os.walk(ROOT):
    for fn in files:
        if fn.lower().endswith(HTML_EXTS):
            path = os.path.join(dirpath, fn)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    data = f.read()
            except Exception:
                continue
            parser = ImgParser()
            parser.feed(data)
            rel = os.path.relpath(path, ROOT)
            for src, alt in parser.images:
                src_clean = src.split('?')[0]
                abs_path = os.path.normpath(os.path.join(ROOT, src_clean))
                exists = os.path.exists(abs_path)
                collected.append({'image_path': src_clean, 'alt_text': alt, 'source_file': rel, 'exists': exists})

assets_dir = os.path.join(ROOT, 'assets', 'images')
if os.path.isdir(assets_dir):
    for fn in sorted(os.listdir(assets_dir)):
        p = os.path.join('assets', 'images', fn).replace('\\', '/')
        if not any(c['image_path'] == p for c in collected):
            collected.append({'image_path': p, 'alt_text': '', 'source_file': 'assets/images (unreferenced)', 'exists': True})

OUT = os.path.join(ROOT, 'image_inventory.csv')
with open(OUT, 'w', newline='', encoding='utf-8') as csvf:
    writer = csv.DictWriter(csvf, fieldnames=['image_path','alt_text','source_file','exists'])
    writer.writeheader()
    for row in collected:
        writer.writerow(row)

print('WROTE', OUT, 'ROWS:', len(collected))
