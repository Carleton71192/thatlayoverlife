# Fix 6: four CMS photos at web size

13 November 2026. Files for fix 6 in reports/bandwidth-2026-11-13.md. Nothing in Webflow was changed. Nancy uploads these by hand in the CMS (steps below).

## The files

| File | Replaces | Old file | New file |
|---|---|---|---|
| travelers-photo-a-web.jpg | Contributors collection, item id 6ae33eaa0a497974856d7d86, field **Photo**. Shown on /travelers (the 927 KB traveler photo) | 1600 x 1200, 948,021 bytes (926 KB) | 1600 x 1200, 259,325 bytes (253 KB), 73% smaller |
| travelers-photo-b-web.jpg | Contributors collection, item id 6ae323584689182a2265ccc0, field **Photo**. Shown on /travelers (the 719 KB traveler photo) | 1156 x 675, 735,202 bytes (718 KB) | 1156 x 675, 65,776 bytes (64 KB), 91% smaller |
| torrevieja-street-food-market-hero-web.jpg | Stories collection, item "Torrevieja Street Food Market 2026: Rocking Out With Some Great Food" (id 6ae32279cd599f9d975a5282), field **Hero image** | 2400 x 1800, 681,011 bytes (665 KB) | 1600 x 1200, 413,224 bytes (404 KB), 39% smaller |
| spain-madrid-wedding-ibiza-hero-web.jpg | Stories collection, item "Spain: A Wedding and an Adventure" (slug spain-madrid-wedding-ibiza, id 6ab3fad39f175bf09b7312a4), field **Hero image** | 1440 x 1920, 377,781 bytes (369 KB) | 1200 x 1600, 269,854 bytes (264 KB), 29% smaller |

All four together: 2,742,015 bytes before, 1,008,179 bytes after. That is 1.73 MB less (63%) each time all four download.

To find the two traveler items in the CMS, search the Contributors list for the item id, or open each /travelers card whose photo is one of the two old files (Webflow file ids 6ae33eaa0a497974856d7d7c and 6ae3233e70bf2323b2ccfa21).

## How they were made

- Each original was downloaded once from the Webflow CDN (three files, 2,364,234 bytes). The Spain hero came from a local copy saved on 12 November; its checksum matches the live file's ETag, so it is the same file.
- Resized with Lanczos so the longest side is at most 1,600 px. Nothing was enlarged: the first traveler photo was already 1,600 px wide and the second only 1,156 px, so those two were only recompressed. The Spain hero is a portrait photo; 1,600 px tall makes it 1,200 px wide, which keeps the 1,200 px minimum for Google Discover. The Torrevieja hero is 1,600 px wide.
- JPEG quality 80, progressive, 4:2:0 color, optimized.
- Metadata stripped. None of the four originals needed an orientation tag (three had none, one said "normal"), so none was kept. The Torrevieja original carried an sRGB color profile; it was dropped, and browsers read untagged photos as sRGB, so the colors do not change.
- The two traveler photos are still much larger than the cards show (288 x 360 on /travelers; the field note asks for 600 x 600). They follow the 1,600 px rule from the report. A 600 to 800 px copy would save more if you want it later.

## Steps in Webflow (only you can do this)

1. In the Designer, open **CMS** in the left panel.
2. Open the collection (Contributors or Stories) and the item from the table.
3. Note the image's alt text first. Click the image field, choose **Replace**, and upload the file from this folder.
4. Check the alt text is still there; paste it back if it was cleared. The first traveler photo and both story heroes have alt text today. The second traveler photo has none.
5. Click **Save**. It goes live at the next publish, so time it with an approved release.

Both stories have no OG image override, so the new hero is also their share image. The Spain story is a home cover candidate.

## Checksums (SHA-256)

- travelers-photo-a-web.jpg: e98370155b37085839d7e1793f3d03752000f1fed98f63d53b61642a5e5be8bd
- travelers-photo-b-web.jpg: 45eb6c3206a4e734b5071d80aa30ea968d8a1f05f1cc2fa0cdb0ad4b59faa8b6
- torrevieja-street-food-market-hero-web.jpg: 30ac75e7c9457ce6daff0ddd2a5f6ce3291a5e3385761dbeeee7f50d7e6aaf91
- spain-madrid-wedding-ibiza-hero-web.jpg: f43b7dd4753316d53fd15b30da786e03a8ad054c849b79f566192d3146f3ad21
