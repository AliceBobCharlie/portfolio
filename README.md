# Portfolio site

A static personal site: photo + résumé at the top, and your projects
organised below into draggable, resizable, expandable cards — one per
category (AI Safety, Computer Science, Data Science, Other Projects
by default).

No build step, no framework, no dependencies beyond two Google Fonts.
Just four files: `index.html`, `styles.css`, `data.js`, `app.js`.

## 1. Preview it locally

Open `index.html` directly in a browser, or, for a slightly more
accurate preview (some browsers restrict local file access), run a
tiny local server from this folder:

```bash
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## 2. Add your content

Everything you see on the page — your name, bio, résumé link, contact
links, and every project category and link — lives in **`data.js`**.
You shouldn't need to touch the other three files for routine updates.

- **Add a project**: copy one of the objects inside a category's
  `items` array and edit `title`, `url`, `description`.
- **Add a category**: copy a whole category object (including its
  `items` array) inside `categories`, give it a new `id`, `title`,
  `accent` (a hex color), and `description`.
- **Photo**: put an image at `assets/profile.jpg` (or change the
  `photo` path in `data.js`). Set `photo: null` to show a plain
  initials avatar instead — the page works fine either way.
- **Résumé**: put your PDF at `assets/resume.pdf` (or change
  `resumeUrl`). Set `resumeUrl: null` to hide the button.

## 3. Deploy on GitHub Pages

1. Create a new GitHub repository (e.g. `yourname.github.io` for a
   root-domain site, or any name for a project site).
2. Push these files to the repository's default branch:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**, set **Source** to
   "Deploy from a branch", pick the `main` branch and `/ (root)`
   folder, and save.
4. GitHub gives you a URL a minute or two later (either
   `https://<you>.github.io` or
   `https://<you>.github.io/<repo>`, depending on the repo name).

Any time you edit `data.js` and push, the live site updates
automatically — no rebuild needed.

## How the interactive parts work

- **Drag** a card by its header to reorder the board.
- **Click** a card's header to expand or collapse it.
- **Drag the bottom edge** of an open card to resize it (desktop
  browsers only — this is a native browser feature, not custom code).

All three states (order, which cards are open, card heights) are
remembered in each visitor's own browser via `localStorage`, so a
reload doesn't reset their layout. This is local to each visitor —
there's no shared backend, which keeps the site fully static and easy
to host on GitHub Pages.
