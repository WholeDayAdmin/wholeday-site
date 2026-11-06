document.documentElement.classList.add("js");
// Clickjacking guard: GitHub Pages can't send anti-framing headers, so if another site loads this page
// inside a hidden frame, hide it and break out to the real wholeday.co.uk instead.
if (window.top !== window.self) {
  document.documentElement.style.display = "none";
  try { window.top.location.replace(window.self.location.href); } catch (e) { /* the page stays hidden */ }
}
