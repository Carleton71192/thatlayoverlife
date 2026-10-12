# 301 redirects: legacy /destinations/{slug} to /countries/{slug} (open point 7)

Approved by Nancy on 12 October 2026 ("Go with defaults"). The Webflow API cannot write 301s, so Nancy or the main session adds these by hand in Site settings, Publishing, 301 redirects. Add each row as Old path and Redirect to path, then publish.

Checked on 12 October 2026: all 8 legacy items in the old Destinations collection (6a0b29c702602326705dcfb1) are published, and all 8 target slugs exist as published items in the Countries collection (6a8afbd98e907b41c4da109b).

| Old path | Redirect to path |
|---|---|
| /destinations/tanzania | /countries/tanzania |
| /destinations/japan | /countries/japan |
| /destinations/united-states | /countries/united-states |
| /destinations/denmark | /countries/denmark |
| /destinations/ghana | /countries/ghana |
| /destinations/sweden | /countries/sweden |
| /destinations/montenegro | /countries/montenegro |
| /destinations/bulgaria | /countries/bulgaria |

Plain list to paste one at a time:

```
/destinations/tanzania -> /countries/tanzania
/destinations/japan -> /countries/japan
/destinations/united-states -> /countries/united-states
/destinations/denmark -> /countries/denmark
/destinations/ghana -> /countries/ghana
/destinations/sweden -> /countries/sweden
/destinations/montenegro -> /countries/montenegro
/destinations/bulgaria -> /countries/bulgaria
```

Do not add a wildcard such as /destinations/(.*): it would also catch /destinations itself if written loosely, and the other 190 legacy items are not published.

Keep in place, per the default: the legacy items, the old Destinations collection and its template (every story's Country field references that collection), and the template's noindex plus JS redirect, which stays as a fallback.

After publishing, check: each old URL answers 301 with the new Location, and /destinations itself still answers 200.
