# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary user:** The site owner (`LimneticFisher`), using the site daily as a browser startpage and personal workbench.
- **Secondary users:** Occasional peers and hobbyist visitors interested in Chinese history research resources, boardgame/ancient-text tools, or blog articles.

## Product Purpose

Provide a fast, reliable daily browser startpage (live clock, instant Bing/Google search, day/night switch) unified with the owner's curated historical research portal, self-built utility tools, and personal blog. Success means opening a new tab feels effortless and immediately useful for daily work while keeping personal tools and writing one click away.

## Positioning

A personal startpage-first static site built around Chinese history and humanities research, combining a live search/time launchpad with specialized historical database links, ancient-text utilities, and tabletop gaming tools in one lightweight MkDocs site.

## Operating Context

- Used in desktop and mobile browsers as a daily new-tab/home page and quick reference hub.
- Built as a static site via MkDocs (`mkdocs-site/mkdocs.yml`) with a custom theme (`mkdocs-site/custom_theme/`) and deployed automatically to GitHub Pages (`https://limneticfisher.github.io/`) on push to `main` or `master` via `.github/workflows/ci.yml` (`mkdocs gh-deploy --force`).

## Capabilities and Constraints

- **Core startpage:** Live date/time widget, Bing/Google switchable search form, and day/night showcase (`mkdocs-site/docs/index.md`).
- **Navigation sections:** Home (`index.md`), Resources (`resources.md`), Tools (`tools.md`), and Blog (`blog.md` + `blog/*.md`).
- **Standalone tools:** Direct HTML/JS tools such as the Zombicide Abomination deck drawer (`mkdocs-site/docs/tools/zombicide_deck.html`) with local audio assets.
- **Hard technical constraint:** Must remain compatible with the `MkDocs` + `custom_theme` static build and GitHub Actions `mkdocs gh-deploy --force` workflow without requiring a backend server.

## Brand Commitments

- **Site identity:** `LimneticFisher` (`https://limneticfisher.github.io/`).
- **Language & voice:** Chinese-first copy with a literary, historical sensibility (e.g., “落日熔金，暮云合璧 / 人在何处”, “历史，你好！”).
- **Signature imagery:** 《金陵各營屢捷解圍圖》 featured in day/night variants (`mkdocs-site/docs/images/light.webp`, `mkdocs-site/docs/images/dark.webp`).

## Evidence on Hand

- Site configuration and theme: `mkdocs-site/mkdocs.yml`, `mkdocs-site/custom_theme/main.html`, `mkdocs-site/custom_theme/css/style.css`, `mkdocs-site/custom_theme/js/main.js`.
- Content pages: `mkdocs-site/docs/index.md`, `mkdocs-site/docs/resources.md`, `mkdocs-site/docs/tools.md`, `mkdocs-site/docs/blog.md`, `mkdocs-site/docs/blog/first-post.md`, `mkdocs-site/docs/blog/houbaoyanshidai.md`, `mkdocs-site/docs/blog/likui.md`.
- Standalone tool & assets: `mkdocs-site/docs/tools/zombicide_deck.html`, `mkdocs-site/docs/images/`, `mkdocs-site/docs/audio/`.
- Deployment workflow: `.github/workflows/ci.yml`.
- **Absences:** No automated UI test suite or `DESIGN.md` exists yet.

## Product Principles

1. **Startpage speed first:** Daily launchpad interactions (clock, search, quick links) must stay immediate and uncluttered.
2. **Preserve static simplicity:** Every feature and refinement must build cleanly through MkDocs and deploy as static files on GitHub Pages.
3. **Curated utility over filler:** Keep only real research links, working tools, and genuine writing; avoid fabricated placeholders or bloat.
4. **Respect the historical voice:** Maintain the Chinese literary and historical tone across copy and content organization.
