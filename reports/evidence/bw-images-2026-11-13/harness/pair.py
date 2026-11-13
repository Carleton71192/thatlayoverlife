"""python3 pair.py <a.png> <b.png> <out.png> [x y w h]: side by side (crop optional, in image pixels), plus a sharpness number
(mean absolute Laplacian) for each and the share of pixels that differ by more than 24 levels."""
import sys
from PIL import Image, ImageChops, ImageFilter, ImageStat
a, b = Image.open(sys.argv[1]).convert('RGB'), Image.open(sys.argv[2]).convert('RGB')
if len(sys.argv) > 4:
    x, y, w, h = map(int, sys.argv[4:8]); a = a.crop((x, y, x + w, y + h)); b = b.crop((x, y, x + w, y + h))
k = ImageFilter.Kernel((3, 3), [0, 1, 0, 1, -4, 1, 0, 1, 0], 1, 128)
def sharp(im): return round(sum(abs(v - 128) * n for v, n in enumerate(im.convert('L').filter(k).histogram())) / (im.size[0] * im.size[1]), 3)
d = ImageChops.difference(a, b).convert('L')
big = sum(d.histogram()[25:]) / (d.size[0] * d.size[1])
out = Image.new('RGB', (a.size[0] + b.size[0] + 10, max(a.size[1], b.size[1])), 'white'); out.paste(a, (0, 0)); out.paste(b, (a.size[0] + 10, 0)); out.save(sys.argv[3])
print({'size': a.size, 'sameSize': a.size == b.size, 'sharpA': sharp(a), 'sharpB': sharp(b), 'diffOver24': round(big, 4)})
