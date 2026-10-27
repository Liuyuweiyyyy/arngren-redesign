# Layout and motion references

This class prototype studies patterns, not assets or source code copied from other sites.

| Reference | Observed pattern | Adaptation in this prototype |
| --- | --- | --- |
| [Teenage Engineering store](https://teenage.engineering/store) | Wide two-column product grid, quiet background, large image stage, compact name and price below | Two-column featured and catalogue layouts, restrained product metadata |
| [Teenage Engineering product page](https://teenage.engineering/store/op-1-field/) | Product visual to the left, concise purchase information and prominent action to the right | Clear visual and information hierarchy on product details |
| [GSAP image reveal demo](https://codepen.io/GreenSock/pen/eYjoOEW) | `clip-path` reveals tied to ScrollTrigger | One short reveal when featured images enter the viewport; no pinning or scroll takeover |
| [GSAP SplitText + ScrollTrigger demo](https://codepen.io/GreenSock/pen/GggpRoB) | Text enters in reading order as the user scrolls | Restrained heading reveal and scroll-responsive closing statement |
| [Lenis showcase](https://lenis.dev/showcase) | Scrolling can add a sense of pacing to an editorial page | Brief image and text reveals on the home page; browsing controls remain static and immediately usable |
| [Sonos shop](https://www.sonos.com/en-us/shop) | Simple product discovery, visible filters and sorting, concise product cards | Category navigation, direct search, filters, result count and sorting on the catalogue |
| [Bang & Olufsen](https://www.bang-olufsen.com/en/us) | Large product photography, spacious typography and restrained color | Warm neutral palette, larger hero photography and uncluttered product stages |

Product imagery remains AI-generated concept imagery and is labelled as such in the site and report. Reduced-motion users see the content without scroll animations.

## Interactive tank homepage

[OP-XY by Meng To](https://opxy.mengto.here.now/?utm_source=lenis) informed the persistent 3D product stage, camera choreography, large background typography and synchronized narrative. The tank geometry and code are original; no model, source code or artwork was copied from that site.

The home page uses Three.js for an original RC tank concept, GSAP ScrollTrigger for reversible assembly, and Lenis for wheel scrolling. Tracks, chassis, hull, turret and barrel are separate visual groups. A single scroll sequence reveals the components, then brings them together. Chapter buttons and two material finishes provide direct controls. This is a visual concept, not a replica of the Torro product or an actual assembly manual.

Desktop and 390px mobile layouts were checked for component clipping and text overlap. The mobile camera pulls back for the exploded view and completed side view. Static preview removes pinning; the OS reduced-motion preference also disables scroll choreography. Browsers without WebGL show the existing concept image. Route changes dispose the scene and remove its scrolling effects.
