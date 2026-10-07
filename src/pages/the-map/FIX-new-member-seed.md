# Live map: a new member's map starts pre-filled (found 7 Oct 2026, not yet fixed)

**What happened.** Jay joined on 7 Oct 2026 (Google login). His map opened with 66 countries already marked
for "Me", Denmark as Lived. His Memberstack record now carries that list under `tllStates`.

**Cause, confirmed in the map page footer code (member editor).** When a member has no `tllStates` in
localStorage, the editor seeds one from the map itself: every country the shared world-map script has
painted Rose (`#F0507A`, the `data-visited` list on `#tll-map-canvas`, which is Nancy's list) becomes
`["visited"]` for traveler "Me". The editor then saves that to localStorage and pushes it to the member's
Memberstack JSON. That seed was a one-time migration for Nancy's own account and now runs for every new member.

```js
// footer, inside ready(): the offending fallback
if(!raw){ raw={}; paths.forEach(function(p){ if((p.getAttribute("fill")||"").toUpperCase()===OLDVIS) raw[pad(p.__data__.id)]=["visited"]; }); }
```

**Proposed fix (two lines, map page only, no Memberstack block touched).**

1. Footer: a new member starts at zero.
   ```js
   if(!raw){ raw={}; }
   ```
2. Head (Memberstack sync): tie the local cache to the member who wrote it, so two people sharing one
   browser never inherit each other's map. Before `pull()` compares local and remote:
   ```js
   var mid=localStorage.getItem("_ms-mid")||""; var owner=localStorage.getItem("tllStatesOwner")||"";
   if(owner&&mid&&owner!==mid){ localStorage.removeItem(KEY); localStorage.removeItem(AT); }
   if(mid) localStorage.setItem("tllStatesOwner",mid);
   ```

**Cleanup for Jay's record (needs Nancy's go, it is his data):** set `json.tllStates` to
`{"v":2,"travelers":[{"id":"t1","name":"Me","color":"#F0507A","pet":false}],"states":{}}` and `tllStatesAt` to
now, through the Memberstack admin API (updateMember json). Then he logs out, clears the site's local
storage (or uses a fresh browser), logs in, and starts at 0.

**Also at risk:** anyone else who signs up before the fix ships gets the same seed. Nancy and Jay are the
only two members as of 7 Oct 2026 (Memberstack getMembers).

**Status:** proposal only. Nothing changed on the live page. Publish needs Nancy's approval.
