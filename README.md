# Project Portfolio

Source for my GitHub Pages portfolio site, published at https://spicytenderloin.github.io/portfolio/

Built with Jekyll, GitHub Pages builds it automatically on push — no local build step needed.

## Adding a new project

1. Drop your photos in `assets/img/<project-slug>/`
2. Create `_projects/<project-slug>.md` with front matter:

   ```yaml
   ---
   title: My Project Name
   description: One-line summary shown on the projects page card.
   category: university   # or: extracurricular
   thumbnail: /assets/img/<project-slug>/cover.jpg
   gallery:
     - /assets/img/<project-slug>/cover.jpg
     - /assets/img/<project-slug>/another.jpg
   ---

   Write your notes here in normal Markdown — headings, lists,
   links, whatever. This becomes the body of the project page.
   ```

3. Commit and push. The card on `/projects/` and the project's detail page
   are generated automatically — no HTML editing required.
