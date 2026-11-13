"""Cropped before/after pairs for the repo evidence (crops keep out bylines and photo credits). JPEG q90."""
import sys, json
from PIL import Image, ImageChops, ImageFilter
S = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov13/next/bwimg/shots/'
OUT = sys.argv[1]
JOBS = [('home-390-cover', 'home-%s-390-top.png', (0, 250, 1170, 750)),
        ('home-390-railcard', 'home-%s-390-card.png', None),
        ('home-1440-cover', 'home-%s-1440-top.png', (640, 80, 800, 780)),
        ('paw-390-hero', 'paw-%s-390-top.png', (0, 190, 1170, 1020)),
        ('paw-1440-hero', 'paw-%s-1440-top.png', (0, 54, 1440, 266)),
        ('profile-390-card', 'prof-%s-390-card.png', None)]
k = ImageFilter.Kernel((3, 3), [0, 1, 0, 1, -4, 1, 0, 1, 0], 1, 128)
def sharp(im): return round(sum(abs(v - 128) * n for v, n in enumerate(im.convert('L').filter(k).histogram())) / (im.size[0] * im.size[1]), 2)
res = {}
for name, pat, box in JOBS:
    a, b = (Image.open(S + pat % v).convert('RGB') for v in 'ba')
    if box: x, y, w, h = box; a = a.crop((x, y, x + w, y + h)); b = b.crop((x, y, x + w, y + h))
    d = ImageChops.difference(a, b).convert('L'); hist = d.histogram(); n = a.size[0] * a.size[1]
    res[name] = {'px': list(a.size), 'sharpness_before': sharp(a), 'sharpness_after': sharp(b), 'share_of_pixels_off_by_more_than_24_of_255': round(sum(hist[25:]) / n, 4),
                 'mean_abs_diff_of_255': round(sum(i * c for i, c in enumerate(hist)) / n, 2)}
    out = Image.new('RGB', (a.size[0] * 2 + 12, a.size[1]), 'white'); out.paste(a, (0, 0)); out.paste(b, (a.size[0] + 12, 0))
    out.save(OUT + '/' + name + '-before-left-after-right.jpg', quality=90)
print(json.dumps(res, indent=1))
