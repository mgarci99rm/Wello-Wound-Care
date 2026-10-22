# Wello Wound Care — new website (draft)

Static site: plain HTML, CSS and a little JavaScript. No build step.

- Draft URL: https://sophiawebdraft.es (GitHub Pages, custom domain via the `CNAME` file)
- Pages: index, about, services, resources, contact

## Before going live on wellowoundcare.com
1. Remove `<meta name="robots" content="noindex, nofollow">` from every page and delete `robots.txt`.
2. Change `CNAME` to the clinic's domain (or delete it if hosted elsewhere).
3. Images are currently loaded from Wello's Wix media library. Download them into `assets/img/` and update the links, so they keep working after Wix is cancelled.
4. Contact form opens the visitor's email app. Connect a form service (e.g. Formspree) if the clinic wants submissions delivered directly.

## Waiting on Wello
- Team profiles: in `about.html`, search for `TEAM PROFILES`.
- Service area: in `services.html`, search for `SERVICE AREA` (and in the footer of each page).
