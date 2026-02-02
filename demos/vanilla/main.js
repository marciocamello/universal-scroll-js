import UniversalScrollbar from '../../dist/index.mjs';

// Option A: apply to all scrollable elements on the page
// new UniversalScrollbar();

// Option B: apply only to a specific element
const el = document.getElementById('area1');
if (el) new UniversalScrollbar({ target: el, autoHide: true });
