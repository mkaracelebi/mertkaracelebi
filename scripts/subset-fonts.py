"""Rebuild the self-hosted Newsreader files in src/assets/fonts/.

The site only sets Newsreader at weight 400, so the weight axis is pinned and only the
optical-size axis is kept. That halves the download while keeping the display cut for
large headlines. Requires: pip install fonttools brotli

Run from the repo root:  python3 scripts/subset-fonts.py
"""
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

SRC = 'node_modules/@fontsource-variable/newsreader/files/'
JOBS = [
    ('newsreader-latin-opsz-normal.woff2', 'src/assets/fonts/newsreader-400-opsz.woff2'),
    ('newsreader-latin-opsz-italic.woff2', 'src/assets/fonts/newsreader-400-opsz-italic.woff2'),
]
# Latin-1, Latin Extended-A (Turkish and Dutch names), typographic quotes, arrows, theta.
UNICODES = (
    list(range(0x20, 0x7F))
    + list(range(0xA0, 0x180))
    + [0x2018, 0x2019, 0x201C, 0x201D, 0x2026, 0x2022, 0x2192, 0x2190, 0x2032, 0x2033, 0x20AC, 0x2212, 0x03B8]
)

for name, out in JOBS:
    font = instancer.instantiateVariableFont(TTFont(SRC + name), {'wght': 400})
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['*']
    opts.name_IDs = ['*']
    opts.notdef_outline = True
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=UNICODES)
    sub.subset(font)
    font.flavor = 'woff2'
    font.save(out)
    print('wrote', out)
