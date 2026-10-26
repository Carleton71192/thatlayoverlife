#!/usr/bin/env python3
"""Builds home-phone-proto.html from template.html.

The template carries the page; this script inlines the static world map (map.svg) and writes two copies:
  home-phone-proto.html        photos from the Webflow CDN and fonts from Google Fonts (for Nancy's phone)
  home-phone-proto-local.html  photos and fonts from the img/ and fonts/ folders beside it (for offline screenshots)
Nothing here is typed by hand twice: both files come from the one template.
"""
import pathlib, re

HERE = pathlib.Path(__file__).parent
tpl = (HERE / 'template.html').read_text()
svg = (HERE / 'map.svg').read_text()
page = tpl.replace('<!--MAP-->', svg)

CDN = 'https://cdn.prod.website-files.com/'
IMG = {
    '69d6145cf421c777840c1e25/6a115e2be857613f33b48a9d_Curacao.jpg': 'hero-curacao.jpg',
    '6a0b29c6d081332e921900d8/6ad72dc3c7e76f61648a3c30_6ad72d77eeadeeb5b887095e_chesney-lish-spain-hero.jpeg': 'spain-ibiza.jpg',
    '6a0b29c6d081332e921900d8/6ad72ee26479034b2f7d3279_6ad72ec18bcd4df87c789510_barzy-adam-horseshoe-bend-hero.jpeg': 'horseshoe-bend.jpg',
    '6a0b29c6d081332e921900d8/6ac86ab8eaf54b2878f9344b_6ac86a1e460d26e52c3f8d09_pantanal-hero-jaguar-swimming-the-cuiaba-river.jpeg': 'pantanal-jaguar.jpg',
    '6a0b29c6d081332e921900d8/6abccf813c37a815d4c03dde_6abcce087012c0cb94fe18b3_brazil-hero-riverboats-at-sunset-rio-negro.jpeg': 'rio-negro-riverboats.jpg',
    '6a0b29c6d081332e921900d8/6aba3d42f18f65b8d06aea74_6aba3cbc0a48f32b1687edfc_sortsol-hero-murmuration-over-the-cars.jpeg': 'sortsol-murmuration.jpg',
    '6a0b29c6d081332e921900d8/6ab3d9bc5c183888afac103a_6ab3d9295c183888afabcab9_antarctica-hero-landing-in-the-sun.jpeg': 'antarctica-landing.jpg',
    '6a0b29c6d081332e921900d8/6aae867b7b616826932f4444_6a0e022469c0ce59398ce287_La%2520Paz%2520Mexico.jpeg': 'la-paz-sea-lion.jpg',
    '6a0b29c6d081332e921900d8/6a3e79b1f2ea14b30d7a5e0f_6a0e0225995b48deb53b96e8_Fitz%2520Roy.jpeg': 'fitz-roy.jpg',
    '6a0b29c6d081332e921900d8/6a0e027dbb2d090c01c473b8_6a0e0224fb0e0ee3c092ec01_Ghana%2520kids.jpeg': 'ghana-kids.jpg',
    '6a0b29c6d081332e921900d8/6aae867b7b616826932f4447_6a1183262f8a632aeff43aed_Bulgaria.jpeg': 'bulgaria-sofia.jpg',
    '6a0b29c6d081332e921900d8/6a0e027dbb2d090c01c473b4_6a0e02265e2392e5fc632431_Montenegro%2520coast.jpeg': 'montenegro-coast.jpg',
    '69d6145cf421c777840c1e25/6ac9f3a6135a91817959e01a_magnus-holi-side.jpg': 'magnus-holi.jpg',
    '69d6145cf421c777840c1e25/6a115ea686f678134db92154_Doha-p-800.jpg': 'doha.jpg',
    '69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg': 'avatar-nancy.jpg',
    '6a0b29c6d081332e921900d8/6ad65e8f2780d19349de64e9_6ad65e66249074db2462a667_chesney-lish-avatar.jpeg': 'avatar-chesney.jpg',
    '6a0b29c6d081332e921900d8/6ad72dc2c7c33fe2b4d53be9_6ad72d778e0db3aa7718c140_barzy-adam-avatar.jpeg': 'avatar-barzy.jpg',
}
GOOGLE = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,800;1,400;1,800&family=IBM+Plex+Sans+Condensed:wght@400;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap">'
LOCAL = '<style>' + ''.join(
    f"@font-face{{font-family:'{fam}';font-style:{sty};font-weight:{w};font-display:swap;src:url(fonts/{f}.woff2) format('woff2')}}"
    for fam, sty, w, f in [
        ('Playfair Display', 'normal', 800, 'playfair-display-latin-800-normal'),
        ('Playfair Display', 'italic', 800, 'playfair-display-latin-800-italic'),
        ('Playfair Display', 'italic', 400, 'playfair-display-latin-400-italic'),
        ('IBM Plex Sans Condensed', 'normal', 400, 'ibm-plex-sans-condensed-latin-400-normal'),
        ('IBM Plex Sans Condensed', 'normal', 600, 'ibm-plex-sans-condensed-latin-600-normal'),
        ('IBM Plex Sans Condensed', 'normal', 700, 'ibm-plex-sans-condensed-latin-700-normal'),
        ('JetBrains Mono', 'normal', 400, 'jetbrains-mono-latin-400-normal'),
        ('JetBrains Mono', 'normal', 600, 'jetbrains-mono-latin-600-normal'),
        ('JetBrains Mono', 'normal', 700, 'jetbrains-mono-latin-700-normal'),
    ]) + '</style>'

assert '<!--FONTS-->' in page
for key in IMG:
    assert CDN + key in page, 'template does not use ' + key
(HERE / 'home-phone-proto.html').write_text(page.replace('<!--FONTS-->', GOOGLE))
local = page.replace('<!--FONTS-->', LOCAL)
for key, f in IMG.items():
    local = local.replace(CDN + key, 'img/' + f)
assert CDN not in local, 'a CDN url is left in the local copy: ' + re.search(re.escape(CDN) + r'\S+', local).group(0)
(HERE / 'home-phone-proto-local.html').write_text(local)
print('wrote home-phone-proto.html and home-phone-proto-local.html,', len(page) // 1024, 'KB')
