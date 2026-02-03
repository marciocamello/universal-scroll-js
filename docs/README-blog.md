# Blog post – how to use on Medium

Medium often **does not** convert pasted markdown (only the first title may format). Use one of these:

## Option 1: Paste the HTML (recommended)

1. Open `blog-post-medium.html` in a text editor.
2. Select all and copy.
3. In Medium, create a new story and **paste** (Ctrl+V / Cmd+V).  
   Medium usually keeps the HTML: headings (H1, H2), bold, lists, code, links.
4. If something looks wrong, select that part and use Medium’s toolbar (heading, bold, link).

## Option 2: Import from URL (if the file is online)

1. In Medium: **Write** → **Import a story**.
2. Enter the URL of the **raw** markdown or HTML (e.g. from GitHub: `https://raw.githubusercontent.com/marciocamello/universal-scrollbar/main/docs/blog-post-medium.md`).
3. Medium will convert and import; then fix any formatting.

## Option 3: Use a converter, then paste

1. Go to [markdowntomedium.com](https://markdowntomedium.com) or similar.
2. Paste the content of `blog-post-medium.md`.
3. Copy the result and paste into Medium.

## Option 4: Paste markdown section by section and format in Medium

1. Paste one section (e.g. “What It Does” and its list).
2. Select the section title and set it to **Subheading** (or Heading 2) in Medium.
3. Select words that should be **bold** or `code` and use the toolbar.
4. Repeat for each section.

Files:

- **blog-post-medium.md** – article in Markdown (for Dev.to, Hashnode, or converters).
- **blog-post-medium.html** – same article in HTML (for pasting into Medium so formatting is preserved).
