# my-portfolio

Personal CV website of **Areeb Ahmed**, a mechanical engineer working on Direct Air Capture and carbon-capture hardware.
It is plain HTML, CSS and JS with a Carbon Green theme, hosted on GitHub Pages.

**Live:** https://areebahmed401.github.io/my-portfolio/

## How to update my CV

Everything on the site comes from **one file: [`data/cv.json`](data/cv.json)**. You never need to touch the HTML.

1. Open `data/cv.json`, either on github.com (click the ✏️ pencil, which works from a phone too) or in VS Code.
2. Copy an existing entry, paste it where you want it (newest first) and change the text.
3. Commit. GitHub checks the file, then the site updates automatically in about a minute.

If you make a mistake (a missing comma, a missing field), the check fails with a plain message and the live site stays as it was. You can see the result under the **Actions** tab.

### Templates (copy, paste, edit)

Each entry goes inside the matching `[ ... ]` list. Separate entries with a comma.

**New job** → `"experience"`
```json
{
  "role": "Job title",
  "company": "Company",
  "location": "City, Country",
  "start": "Jan 2027",
  "end": "Present",
  "bullets": ["What you did and the impact, ideally with a number."],
  "tags": ["Skill", "Tool"]
}
```
When a job ends, change `"Present"` to the end date.

**New degree or course** → `"education"`
```json
{
  "degree": "Degree, field",
  "institution": "University",
  "location": "City, Country",
  "start": "2027",
  "end": "2029",
  "grade": "",
  "details": ["Thesis or highlight"],
  "tags": []
}
```

**New award, certificate or patent** → `"accolades"`
```json
{ "title": "Award name", "issuer": "Organisation", "date": "2027", "description": "One line on what it was for.", "url": "" }
```

**New project** → `"portfolio"` (add `"featured": true` to make it the big card at the top). Add `"demo"` for a live link; a code project with a repo `"url"` but no `"demo"` is shown under **Archived** automatically.
```json
{ "title": "Project", "description": "One or two lines.", "url": "https://github.com/areebahmed401/repo", "tags": ["Python"] }
```

**New software or skill:** add a name to a group's `"items"` list in `"skills"`, e.g. `"items": ["Autodesk Inventor", "New Software"]`.
If you prefer a proficiency bar instead of a tag, use `{ "name": "New Software", "level": 4 }`, where the level runs from 1 (Basic) to 5 (Expert).

### Photos and logos

- **Work photos:** put images in `assets/photos/` (JPG, about 1600px wide is plenty), then list them in that job's `"photos"`. They show as a gallery that opens full-screen on click:
  ```json
  "photos": [
    { "src": "assets/photos/octavia-dac-plant.jpg", "caption": "Commissioning the 30 tCO₂/yr DAC plant" }
  ]
  ```
- **Company or university logo:** save a square PNG in `assets/logos/` and set `"logo": "assets/logos/name.png"` (plus `"website"` to make it clickable). With no logo, the company's initials are shown on a gold tile.
- **Software logos** appear automatically on skill tags for Autodesk, AutoCAD, Dassault (SolidWorks, CATIA, Abaqus), MATLAB/Simulink, Python, C++, Jupyter and JavaScript. To add another, drop its SVG in `assets/icons/` and add a line to the `SOFTWARE` list at the top of `js/main.js`.
- **Profile photo:** `profile.photo` (currently `assets/profile.jpg`).

The check also fails if a photo or logo path points to a file that doesn't exist.

**Headline numbers** in the hero are under `profile.highlights`. **Typed job titles** are under `profile.roles`.

**Download CV button:** put the PDF at `assets/Areeb_Ahmed_CV.pdf` and set `"cvPdf": "assets/Areeb_Ahmed_CV.pdf"`.

## Run locally

```bash
python -m http.server 8090
```

Open http://localhost:8090. Check the data with:

```bash
python scripts/validate_cv.py
```

## Structure

```
index.html                 page shell
data/cv.json               all content
css/style.css              Carbon Green theme + animations
js/main.js                 renders cv.json into the tabs
assets/                    monogram, toolkit logo, photos, logos, icons
scripts/validate_cv.py     data check (runs in CI)
.github/workflows/pages.yml  validate → deploy to Pages
```
