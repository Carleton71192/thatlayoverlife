# Rebuild template-head-new.html / template-footer-new.html from orig/ + ct3-country.css/js (run from this folder).
head=open('orig/template-head-orig.html').read();foot=open('orig/template-footer-orig.html').read()
og='<meta property="og:image" content="https://s3.amazonaws.com/webflow-prod-assets/69d6145cf421c777840c1e25/6a0e0225995b48deb53b96e8_Fitz%20Roy.jpg">'
css=open('ct3-country.css').read().strip();js=open('ct3-country.js').read().strip().replace('__MAPIDS__',open('mapids.txt').read().strip())
open('template-head-new.html','w').write(head.replace(og,'<!-- '+og+' (ct3, open point 8: the page-settings OG image is the only og:image) -->')+'\n<style id="tll-ct3-country-v1">\n'+css+'\n</style>')
open('template-footer-new.html','w').write(foot+'\n<script id="tll-ct3-country-js-v1">\n'+js+'\n</script>')
open('ct3-head-block.html','w').write('<style id="tll-ct3-country-v1">\n'+css+'\n</style>');open('ct3-footer-block.html','w').write('<script id="tll-ct3-country-js-v1">\n'+js+'\n</script>')
