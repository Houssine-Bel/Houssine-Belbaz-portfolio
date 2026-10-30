# Portfolio motion redesign — design and verification notes

Date: 2026-10-30

## Approved direction and scope

Adapt the supplied Instagram recording, beginning at 00:28, into the existing portfolio: a near-black canvas, a flowing luminous ribbon, large mixed display typography, varied section layouts, larger project imagery, and restrained scroll and pointer movement. The approved adaptation uses the portfolio's electric-blue identity, actual portrait, four projects, and existing French, English, German, and Arabic content. This is a design-direction adaptation, not a pixel-identical clone of the photographed laptop screen.

Follow-up requirement: the ribbon's geometry must bend and twist with scrolling and reverse when scrolling upward. After accepting the procedural scroll ribbon, the user requested gentle wave motion between scroll events and a smooth response to the cursor. That latest request supersedes the earlier scroll-only idle behavior.

Latest section follow-up: give Projects, Education, Certifications, Languages, and Contact a more expressive liquid-glass treatment, with depth, pointer reflections, and scroll entrances while preserving the portfolio's content and responsiveness.

Latest background follow-up: increase the blue ribbon's brilliance and add subtle star-like lights that move around it while scrolling and respond to cursor movement.

The user then requested stars and switching focus lights in the dark gaps as well. A sparse viewport-wide field now complements the ribbon-bound stars, with independently fading focal glints.

Latest layout follow-up: extend Liquid Glass to About, Skills, and Experience, and replace the unequal, staggered project cards with an equal-sized showcase that gives every project a clearer image and the same visual space.

## Visual sources and evidence

- User video: `C:/Users/Belba/Videos/Captures/Instagram - Google Chrome 2026-10-30 14-21-49.mp4`, duration 37.669 seconds.
- Source hero capture: `C:/Users/Belba/AppData/Local/Temp/portfolio-motion-review-b02b40176c78460db916d62dd2c4f337/reference-hero.png`.
- Source section capture: `C:/Users/Belba/AppData/Local/Temp/portfolio-motion-review-b02b40176c78460db916d62dd2c4f337/reference-sections.png`.
- Current local implementation: `http://localhost:5173/`. Earlier redesign evidence below was captured on the previous `5174` session.
- Latest upper-section/project evidence: `C:/Users/Belba/AppData/Local/Temp/portfolio-browser-tools/captures/upper-projects-glass/`, covering desktop 1440, wide 1914, Arabic/German, and 390/320 mobile states. Both desktop project rows, all three upper sections, mobile Projects/Skills, and Arabic Projects were opened and inspected. `results.json` records 107/107 focused checks passing; `footer-focus.json` separately confirms focus restoration from the new footer expand button.
- Latest ambient-field evidence: `C:/Users/Belba/AppData/Local/Temp/portfolio-browser-tools/captures/switching/`, with desktop/mobile/RTL captures and `results.json` documenting all 20 focused checks passing. Desktop Hero/About and mobile Hero were opened for visual review.
- Current background evidence: `C:/Users/Belba/AppData/Local/Temp/portfolio-browser-tools/captures/starlight/`, including desktop Hero/About/Projects/Languages, Arabic, and mobile captures. Hero, About, Languages, and mobile Hero were opened and inspected for brightness and text readability. `results.json` records all 17 focused starlight checks passing.
- Current glass-section evidence: `C:/Users/Belba/AppData/Local/Temp/portfolio-browser-tools/captures/glass/`, including desktop captures of all five updated sections, Arabic Education, mobile section captures, and narrow/RTL Contact. The desktop sections and mobile Languages/Contact were opened and inspected.
- Current glass verification: `C:/Users/Belba/AppData/Local/Temp/portfolio-browser-tools/captures/glass/results.json` — all 59 focused checks passed. A subsequent narrow Contact refinement also passed targeted 390px French/Arabic and 320px checks.
- Wave/cursor evidence: `C:/Users/Belba/AppData/Local/Temp/portfolio-browser-tools/captures/ribbon-wave/desktop-wave-cursor.png`, `desktop-scrolled.png`, and `mobile-wave.png`. Desktop and mobile captures were opened and inspected after adding the bounded wave and cursor field.
- Wave motion verification: `C:/Users/Belba/AppData/Local/Temp/portfolio-browser-tools/captures/ribbon-wave/results.json` — all 20 focused checks passed.
- Previous scroll-only evidence: `C:/Users/Belba/AppData/Local/Temp/portfolio-browser-tools/captures/ribbon/`, including the RTL geometry checks. The earlier 15-check result documents the previous revision's intentionally event-driven behavior.
- Screenshot directory: `C:/Users/Belba/AppData/Local/Temp/portfolio-browser-tools/captures/`.
- Full-view comparisons: `comparison-hero.jpg` and `comparison-sections.jpg`, source and implementation displayed together and inspected after the corrections.
- Implementation evidence: `desktop-hero.png`, `desktop-about.png`, `desktop-skills.png`, `desktop-experience.png`, `desktop-projects.png`, `desktop-lightbox.png`, `desktop-arabic.png`, `desktop-full.png`, `mobile-hero.png`, `mobile-projects.png`, `mobile-arabic.png`, and `mobile-320-reduced.png`.

The original recording is 1920 × 1032. The 338 × 600 reel region was extracted and enlarged to 676 × 1200 for inspection. The reference remains a perspective photograph of a desktop screen, so exact pixel measurements and pixel-level typography comparisons would be misleading. The comparison sheet preserves both aspect ratios at a common 1000-pixel height. Desktop implementation captures use a 1440 × 1000 CSS viewport and device scale factor 1. Mobile captures use 390 × 844 and 320 × 740 CSS viewports, also at scale factor 1.

## Required fidelity surfaces

- **Typography:** Large Space Grotesk first name and an italic Georgia surname echo the reference's contrasting display styles. Arabic uses Tahoma without Latin italics. Existing translated copy remains live HTML. Desktop, 390-pixel, 320-pixel, and Arabic wrapping were inspected.
- **Spacing and layout:** Wide editorial hero, arched portrait, a glass story panel and three process cards in About, a sticky Skills introduction beside a glass stack panel, and glass entries on the scroll-progress Experience timeline. The latest project layout uses two equal desktop columns and matching card/preview sizes, superseding the earlier alternating 7/5 composition. Tablet/mobile use a single readable column with natural content height. Project previews and actions remain visible.
- **Colors and tokens:** Near-black `#05080e`, electric blue `#83caff`, pale-blue controls, and subdued blue-gray body text. The green reference ribbon is intentionally adapted to blue. The red room and laptop perspective in the recording are filming context and are not reproduced as website UI.
- **Image quality:** The existing portrait and actual project screenshots remain the content imagery. The main light ribbon is now procedurally drawn and deformed, as explicitly requested by the user, rather than an animated bitmap. The generated WebP remains only in static preview/contact surface treatments. No new product screenshots or 3D dependency were introduced. Portrait overlay panels are hidden below desktop width.
- **Copy and content:** All four projects and their galleries remain present. Existing locale data, contact details, diploma previews, and CV downloads remain in use. No invented client metrics, testimonials, or capabilities were added.

Focused hero, Skills, project, mobile, and RTL screenshots were inspected because the full-page capture alone cannot establish text readability or interaction affordances. The source recording does not expose a reference mobile layout; mobile reflow is therefore assessed as an implementation requirement rather than reference fidelity.

## Comparison and correction history

1. Compared the reference hero and section captures with the rendered desktop hero, About, Skills, Experience, and Projects. The blue ribbon, dark negative space, display hierarchy, lighter section framing, and contrasting serif treatment implement the approved direction. The personal portrait and localized portfolio content are intentional differences.
2. Browser verification identified a React 18 warning for the `fetchPriority` image prop. Replaced it with eager portrait loading and an HTML image preload. Rebuilt successfully.
3. Pointer verification identified a gallery interaction issue: releasing a swipe could also trigger the image popup. Added an explicit drag-start guard while retaining keyboard activation. Post-fix pointer verification confirmed that dragging changes the image without opening a dialog. The final browser run passed all 33 checks, with zero runtime errors or failed asset responses.
4. Removed decorative outbound arrows from read-only Skills rows to avoid suggesting nonexistent links. Passive status indicators now accompany those rows.
5. The user clarified that the luminous ribbon itself must deform with scrolling. Replaced the hero/ambient images and time-based drift with a single viewport Canvas2D renderer. It changes the centerline curvature, ribbon width, and projected filament twist from `scrollY / viewportHeight`. The old HeroBackground component and obsolete drift CSS were removed.
6. A controlled desktop scroll profile found full-resolution glow and per-filament screen blending costly. Moved the glow into a reused low-resolution canvas, composited once, and switched crisp filaments to source-over drawing. Desktop backing resolution is capped at 1.25×, compact at 1×. The same local headless 1440 × 1000 test at device scale 1.5 reported a median animation-frame interval of 16.7ms with the optimized ribbon versus 16.6ms with ribbon strokes skipped; this is a local comparison, not a cross-device frame-rate guarantee.
7. Post-fix verification passed all 15 checks: distinct pixel hashes at scroll positions 0 and 500, exact pixel equality after returning to 0, non-uniform geometry deformation, no CSS transform, no idle drawing, exact mirrored RTL path geometry, lower mobile drawing budget, reduced-motion stability, no overflow, and no browser runtime errors. Current desktop/scrolled/mobile captures were inspected for readability and composition.
8. Added the newly requested bounded wave and cursor field. Slow traveling sine waves affect the centerline, strand spread, and twist. Viewport-normalized pointer input creates a local smooth bend with a 130ms exponential response; cursor exit returns the field to neutral. Scroll remains the dominant deformation. Coarse/compact devices ignore cursor input.
9. Wave verification passed all 20 focused checks. At fixed scroll, 600ms of ambient movement displaced sampled geometry by about 9px maximum; opposite cursor positions displaced it by about 73px; a 500px scroll changed the shape by over 400px. Measured idle paint rates were about 30/s desktop and 15/s mobile. Hidden-tab pause/resume, strict reduced-motion freezing, deterministic rendering at explicit time/pointer inputs, mobile overflow, and clean runtime were confirmed. The local scroll profile still reported about 16.7ms median animation-frame intervals with the ribbon, matching its control run; these measurements apply to the local test environment.

## Verification scope

The user story is: open the portfolio, navigate its sections, read the translated content, swipe project galleries, open and close an image in the same page, and reach the existing contact options.

- Build: `npm run build` passed.
- Type checking: included in the build and passed.
- Lint: `npm run lint` passed after the focus-restoration cleanup.
- Desktop and mobile screenshots: captured and inspected.
- Four language switches: education and language content remained visible; Arabic RTL was checked.
- Modal: same-page opening, arrow navigation, Escape, keyboard focus trapping, focus restoration, and body-scroll restoration were checked.
- Mobile menu: opens, navigates, and closes on selection.
- Mobile layout: no horizontal overflow at 390 or 320 pixels; desktop overlays and portrait tilt disabled.
- Reduced motion: background animation is disabled and pointer/scroll transforms are omitted.
- No contact message was submitted to the external service. No GitHub push or production deployment was performed as part of this local redesign.
- Browser verification: all 33 checks passed. Results are recorded at `C:/Users/Belba/AppData/Local/Temp/portfolio-browser-tools/captures/results.json`.
- Final production build, lint, and whitespace checks passed after the drag correction and source formatting.

## Motion and performance decisions

The main ribbon combines scroll-driven Canvas2D geometry with gentle timed waves and a smoothed pointer field. One animation-frame loop advances its clock while visible, with target paint caps of 30/s desktop and 15/s compact when idle; recent scroll/pointer activity uses up to 60/s. Input is kept outside React state. Geometry is deterministic for identical scroll/time/pointer inputs and mirrors for Arabic. Resize resets both canvas backing sizes/transforms. Hidden tabs and component cleanup cancel the loop; resuming resets the tick timestamp to avoid a time jump. Reduced-motion users receive a frozen frame without cursor/scroll redraws.

Two glow strokes render into a reused off-DOM canvas at 0.4× viewport resolution (0.35× on compact screens). The main canvas composites that glow once and draws 36 crisp filaments on desktop or 16 on compact screens, plus two core strands. Capped paint rates and reduced rendering density keep the work bounded. Desktop portrait tilt and project movement remain independently disabled for coarse pointers, small screens, and reduced-motion preferences. Heading reveals do not animate blur filters. No extra animation dependency, WebGL renderer, or hosted service was introduced.

These are implementation safeguards, not a claim of measured frame-rate performance on every device.

## Asset provenance

- Tool: built-in Image Gen, new asset generation.
- Final project asset: `public/images/blue-flow.webp` (1536 × 1024, 81,844 bytes).
- Original generated PNG: `C:/Users/Belba/.codex/generated_images/01a05edb-0f94-77b0-bf14-67b4d3393b4e/exec-eb78e59a-b265-4839-85fd-8eea0a76f8af.png`.
- The original was retained. The project copy was encoded as WebP for delivery.
- Current role: static project-preview/contact surface texture; it is no longer the main animated ribbon.

Prompt:

> Use case: stylized-concept. Asset type: production website background texture, a wide cinematic landscape, roughly 3:2 aspect. Create a premium electric-blue flowing light ribbon on a nearly black #05080e background for a full-stack developer portfolio. A single elegant, broad S-shaped stream composed of many fine optical filaments sweeps from lower left, curls through the right half, and exits upper right. Very bright icy-blue core in one small focus on the right, subtle deep cobalt and cyan glowing tails, long-exposure fiber-optic light photography, luxurious and restrained. The left 45% and top 20% are almost pure black negative space for white website typography. Background edges must fade to absolute black so this asset blends into the page without a visible rectangular edge. Smooth curved fluid path, plenty of black, no noisy particles or stars, no galaxy or clouds, no objects, no laptop, no portrait, no text, no UI, no icons, no watermark. Beautiful fine transparent-looking threads against black with a soft ambient bloom. This will be a real web asset behind accessible HTML text, not a screenshot or mockup.

## Liquid-glass section refinement

- Added a shared `LiquidGlass` surface with a frosted gradient, bevel lighting, a pointer-following reflection, and a diagonal specular sweep. Fine-pointer desktop cards use bounded spring tilt (up to 2.5/3 degrees) and a small hover lift. Pointer reads/writes are batched once per animation frame and do not update React state. Pointer events from portaled dialogs are ignored.
- Education now uses clear chapter/date framing, a raised book mark, and a full-card native diploma button. The existing redacted images and translated information are preserved. The popup traps focus, closes with Escape, restores its trigger, and restores body scrolling.
- Certifications use staggered blue/violet glass surfaces, larger award marks, issuer/title hierarchy, and a subtle watermark. At this stage Projects retained the alternating two-column layout and existing swipe galleries/popups inside glass frames; the later equal-card refinement below supersedes that layout. Their large preview-button focus outline is inset so the frame does not clip it.
- Languages now use a four-tile mosaic with individually animated meters. Visual review caught two meters staying at zero because their zero-scale child elements were being observed directly. Their parent cards now trigger inherited animation variants; all four meters were checked against their actual levels in every locale, and the corrected desktop/mobile captures were inspected.
- Contact uses a larger illuminated panel with contact tiles and a separate flat form surface. The form does not tilt while editing. Below 480px the contact details use horizontal full-width rows, keeping the email on one line at 390px and 320px. Native validation and all existing form fields/actions remain intact; no message was submitted.
- Backdrop blur is limited to 4px and never nested: project/outer Contact frames have no backdrop blur; credential cards, the Languages panel, and the inner Contact form use a single layer. Compact/coarse-pointer and reduced-motion modes disable blur and tilt. No new dependency or image asset was added for this treatment.
- The focused headless browser run passed 59/59 checks, including desktop reflection/tilt/reset, all four locale switches, RTL, diploma/project popups, gallery swiping, form editing/validation, mobile bounds, reduced motion, and clean runtime. Build, lint, and whitespace checks passed. The final Contact-only responsive adjustment was rebuilt and checked at 390px French/Arabic and 320px; its text stayed on one line and no horizontal overflow occurred.
- An enabled/disabled/enabled backdrop comparison at Languages and Contact reported roughly 16.6–16.9ms median/p95 frame intervals with the ribbon running in the local headless environment. No material difference was observed there; physical low-end phones remain outside the measured scope.

## Brighter ribbon and starlight refinement

- Increased the cyan core and blue atmosphere, including the ribbon's lower-section intensity. At identical explicit frame inputs, the detached canvas luminance rose from approximately 4.61 to 8.00 in the controlled local comparison. This is a renderer-frame comparison, not a page contrast or display-brightness measurement.
- Added 40 deterministic desktop star seeds, reduced to 14 on compact/coarse-pointer devices. The stars interpolate the actual ribbon geometry and slowly travel/orbit around it. Their brightness varies gently, with a few small four-point glints. Scroll deforms their underlying path; the smoothed pointer field adds local repulsion and small depth-based parallax. Arabic mirrors their geometry.
- A 64px halo sprite is generated once per background mount and reused in the existing low-resolution glow canvas. There is no per-star blur, second animation loop, new dependency, or external image asset. Existing paint caps, hidden-tab pause, compact pointer suppression, and reduced-motion freezing remain in effect.
- All 17 focused browser checks passed: increased same-frame brightness, finite/deterministic star geometry, time/scroll/cursor response, RTL mirroring, reduced compact budget, inert compact cursor, static reduced motion, no pointer interception, no horizontal overflow, and clean runtime. Production build and lint passed. No deployment or GitHub push was performed.
- The local before/after renderer profile at 1440 × 1000 and DPR 1.25, including the cached halo sprite, reported roughly 0.8–1.0ms median draw submission and 2.0–2.1ms updated p95. Animation-frame intervals remained approximately 16.7ms median / 16.8ms p95 in both runs. Evidence is in `captures/starlight/performance.json`; these figures do not establish physical-device FPS.

## Viewport stars and switching focus lights

- Added 36 desktop / 12 compact stars in a stratified viewport field, alongside the existing 40/14 ribbon seeds. Their brightness is weighted toward empty dark space; slow depth-based scroll drift and cursor parallax keep them connected to the scene. The field covers all 12 sampled viewport regions on desktop and compact layouts.
- Six desktop / three compact focus stars use staggered, gradual light pulses, small four-point glints, and soft blooms from the existing cached sprite. Different focus points brighten and fade independently over several seconds. There are no abrupt flashes or color changes. At fixed scroll the measured frame-to-frame alpha change was at most about 0.006 at a 16.7ms step.
- All 20 focused checks passed, including stars beyond the ribbon, broad field coverage, alternating focus brightness, bounded drift/halo opacity, deterministic output, RTL mirroring, compact cursor suppression, static reduced motion, clean runtime, and no overflow. Build and lint passed. The existing single-loop paint limits and hidden-tab handling are unchanged; no extra animation loop or per-particle blur was added.

## Static asset paths on a stale local URL

Story: open the portfolio at its root, or from the stale local `/madarstop-website/` URL, then load the logo, portrait, project screenshots, diploma previews, and CV files through Vite's public assets.

- The existing server is listening on port 5173. The portfolio has no `/madarstop-website/` route or reference. Vite's development HTML fallback was rendering the app at that stale address, while `./images/...` and `./logo-mark.svg` resolved underneath the extra path.
- Baseline evidence: `/images/houssine-belbaz.jpg` returned HTTP 200 with `image/jpeg`, and `/logo-mark.svg` returned `image/svg+xml`. The equivalent requests under `/madarstop-website/` returned HTTP 200 with `text/html`, which could not decode as images. A successful HTTP status alone did not establish a working asset.
- Set Vite's base to `/` for the existing root-hosted Vercel site and made public image/CV/logo/preload/favicon/social references root-relative. Social image metadata now resolves from the origin. Existing root-relative CSS image URLs remain consistent. No router or redirect was introduced; the clean local address is `http://localhost:5173/`.
- React review: the change only affects static URLs and the existing metadata URL expression; no new hooks, dependencies, fetching effects, or render state were added. The portrait preload now resolves to exactly the same URL as the rendered image. Production build and lint passed.
- Focused verification passed 23/23 checks across the clean root and stale nested URL: decoded logo/portrait, correct image MIME for all 13 public image assets, both CV files returning `application/pdf` with a `%PDF` signature, ARZ/dental gallery image pairs, both diploma popup images, root preload/icon/social metadata, and clean runtime without nested asset requests. Evidence and the inspected root Hero capture are in `C:/Users/Belba/AppData/Local/Temp/portfolio-browser-tools/captures/asset-paths/`. No external form submission, push, or deployment was performed.

## Upper glass and equal project showcase

- About now has a flat glass story panel and three glass process cards with passive compass/code/check icons. Skills uses one glass stack with flat inner rows plus three support cards. Experience retains its sticky introduction and scroll-progress timeline, with individual glass entries and timeline nodes outside clipped surfaces. Existing translated content is unchanged.
- Projects now use two equal columns from 1024px upward, with equal grid rows, aligned tops, and stretched flex card interiors. Below 1024px they use one column with natural text height. Removed the alternating column spans, staggered top padding, and screenshot scroll rotation/translation. The stable project frames keep pointer reflections without tilt.
- Every gallery now has a matching browser-style header, an image plane with a 2.05 aspect ratio, and a dedicated control bar below the image. Removed the screenshot's internal padding, textured backdrop, and dark overlay. Images use `object-fit: contain` to remain fully visible; descriptions/features/chips use larger, readable type. The shared material and per-project accents remain.
- Dragging changes the screenshot without opening the popup. Both the image and footer expand button can open the same-page dialog; the actual triggering button is stored for focus restoration. Arrow navigation, Tab trapping, Escape, and body-scroll restoration remain in use. Compact expand buttons retain accessible names when their visual label is hidden. Numeric counters explicitly use LTR direction within Arabic layouts.
- The focused browser pass checked equal card/preview geometry at 1440px, 1914px, Arabic and German; decoded screenshots; swipe/modal keyboard behavior; upper-section content and glass; 390px/320px bounds; and mobile/reduced-motion fallbacks. All 107 checks passed with no runtime errors. Source review found no nested blur/tilt or new hooks/state issues. No new animation dependency or background loop was added, and no contact message, push, or deployment was performed.
- After the numeric-direction correction, targeted 1440px/390px Arabic checks confirmed LTR counters in the cards and popup; footer-button focus restoration still passed. Arabic captures were refreshed. The final production build, lint, and whitespace checks passed.

## Findings and remaining checks

- No actionable P0/P1/P2 visual or interaction findings remain in the reviewed states. The repaired gallery gesture and clean runtime were confirmed in the final browser run.
- P3: A separate performance profile on a representative low-end physical phone would be useful before claiming a particular frame rate. There is no blocker identified from the inspected responsive screenshots.

final result: passed
