# TLL copy voice fix: Claude Code prompt (10 November 2026)

Source: a line-by-line read of the live site (thatlayover.life) on 10 Nov 2026, tested against the Brand Kit v2.5 copy voice rules (section 13, "AI tells: sentence patterns"). Story text by contributors was not touched.

## Task: copy voice pass on the live TLL site

Replace the lines below exactly as written. Copy-only change: no layout, style, or component changes.

Rule (Brand Kit v2.5, section 13): copy should sound like Nancy talking to a friend, not a brand selling something. No lists of three; no mirrored pairs ("real X, real Y"); no reassurance nobody asked for ("no card, no paywall"); someone is always talking; one concrete image or dry aside instead of vague praise. No em dashes. US spelling. Never use the word "ships".

How to work:
1. For each line, search the whole codebase for the old string: Webflow exports, custom code embeds, JS that swaps text at runtime, CMS seed files, and i18n/translation files. Some lines exist in more than one source (the home hero has a static version "Free, forever. No card, no paywall." and a runtime version "Real places and real opinions..."). Change every source so they agree.
2. Curly and straight apostrophes may differ between sources. Match both.
3. If a line appears in translated versions, change the English only and add it to the translation queue. Do not machine-translate.
4. Do not change anything in the "Do not change" section.
5. Check every edited page at 390px wide, then at 1440px. No line should overflow its container or wrap to an orphan word. If a new line is longer than the old one and breaks the layout, report it. Do not shorten the copy.
6. Stage the release and report: every file changed, every string replaced, any string not found, and the release number. Do not publish. Nancy publishes.

## Replacements

### Home (/)
| # | Where | Old | New |
|---|---|---|---|
| H1 | Hero subhead (runtime text) | Real places and real opinions, written by the people who went. Free to join, no card, no paywall. | Travel stories from people who left the airport. (Most of them, anyway.) Free to join. |
| H2 | Hero small print (static fallback) | Free, forever. No card, no paywall. | Free to join. |
| H3 | "Why That Layover Life" intro | It keeps your trips somewhere that is yours, shows them off the way Grandpa's slide projector did, and puts you next to people who travel the way you do. Free, no card, 16+. | It keeps your trips somewhere that is yours and puts you next to people who travel the way you do. Free to join if you're 16 or older. |
| H4 | 02 · Your travel dashboard, subhead | Every stamp, every stopover, one map. Plus inspo for the next one. | Your stamps and stopovers on one map. It also shows where you haven't been, which is how the trouble starts. |
| H5 | Expats, Visa trackers card | Never miss a renewal again. | Before the migration office reminds you. |
| H6 | Paw Passport, small print | The EU pet travel guide. No surprises at the border. | The EU pet travel guide. Read it before the ferry, not in the queue. |

### Sitewide footer
| F1 | Written by the people who went. Travel stories from members around the world, edited in Copenhagen. | Travel stories from members around the world, edited in Copenhagen with a Samoyed on the editor's feet. |

### Sign up (/signup)
| S1 | Check your travel stats. Register your pet. Share your story and your photos. Free to join. We're not a gym. | Log your countries and give your pet a passport. The stories can come later. Free to join. We're not a gym. |
| S2 | Every byline is a real person, and sponsorships are disclosed at the top, never in a footnote. | Every name on a story belongs to the person who took the trip. Sponsored trips say so at the top. |

### Share photos (/share-photos)
| P1 | Real photos from real places. No filters, no stock, no staging. If you were there, it counts. | If you were there, it counts. Phone shots welcome, filters less so. |
| P2 | Webflow placeholder text in the form: "This is some text inside of a div block." and "Form Label" (appears several times) | Remove every instance. If an element only holds placeholder text and is used as a template by script, give it empty text and confirm nothing visible or screen-reader-readable remains. |

### The Layover Lounge (/gallery)
| G1 | Real places, shot by the people who actually went. All frames currently by Nancy, the honest version. | So far every frame is Nancy's. That's the honest version, and also why we need yours. |

### Travelers (/travelers)
| T1 | SHUFFLED, NEVER RANKED, NEVER PAID · PLACES THEY KNOW, NOT WHERE THEY ARE NOW | IN RANDOM ORDER. NOBODY PAID FOR A SPOT. · PLACES THEY KNOW, NOT WHERE THEY ARE TONIGHT |

### For expats (/for-expats)
| E1 | Real prices, real seasons, the restaurant that survived the hype. Dated, so readers can trust it. | What a coffee actually costs, and the restaurant that survived the hype. Dated, so readers can trust it. |
| E2 | The Location Expert label on your profile and every byline. Earned, not bought. | The Location Expert label on your profile and every byline. You get it by living there, which is the hard part. |

### Share your story (/submit)
| U1 | You were there. Your photos, your dates, your mistakes. No stock photos, no press kits, no "top ten". | You were there. Use your own photos and keep the mistakes in. Stock photos and press kits get sent back. |

### FAQ (/faq)
| Q1 | Yes to both. Free to read, free to submit, free forever for travelers. | Yes to both, and it stays free for travelers. |

### Contact (/contact)
| C1 | SAY HELLO · REAL HUMAN, REAL INBOX | SAY HELLO · NANCY READS THESE |
| C2 | Real human, real reply. | She replies, usually before the dog needs walking. |

### Editorial charter (/editorial-charter)
| R1 | Seven rules. No exceptions. | Seven rules, kept in public. |
| R2 | Every story carries a real byline from a person who actually went. No chatbot drafts, no filled-in fiction, no stock itineraries dressed up as memory. | Every story carries a real byline from a person who actually went. If a chatbot wrote it or the trip didn't happen, it doesn't run. |

### For press (/for-press)
| X1 | Hosted trips, gifted stays, comped tours: all of it publishable, all of it labeled where your compliance team wants it. | Hosted trips and gifted stays are welcome here. They get labeled at the top, which is where your compliance team wants them anyway. |
| X2 | 48-hour human review: one editor, no committee, publication decisions with reasons attached. | One editor reviews it within 48 hours and tells you why, either way. |
| X3 | No scraped inboxes, no BCC chains, consented distribution only. | It only goes to travelers who asked for press trips. Nobody's inbox gets scraped. |

### Community guidelines (/community-guidelines)
| CG1 | Real places, real dates. (rule II heading) | Name the place and the date. |

## Do not change (Nancy decides; list them in the report)
1. When stories get reviewed (FAQ: publish on pass, editor reads after; charter: "Reviewed within 48 hours"; contact: Nancy "Reads every story before it publishes"; destinations: "A human reviews it within 48 hours").
2. Reply time (contact: "usually the same day" and "48 hours, every door").
3. Magnus's count (Paw Passport 13 countries; home, about, travelers 14).
4. Countries with stories (destinations 53, footer 54; check whether they come from the same source).
5. Home newsletter prompt "Where did your last national park take you?" (rotating, or should read "layover"?).
6. Meta title and primary tagline "Real places, by people who actually went" (open tagline decision in Brand Kit v2.5).
Also leave alone: contributor story titles, excerpts and bodies; the "BY THE PEOPLE WHO WENT" postmark stamp; legal and license wording on /share-photos and /terms; everything on /about, /the-paw-passport and /for-brands not listed above.
