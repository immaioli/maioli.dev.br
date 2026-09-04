// Anti-FOUC script loaded as an external file by next/script with src=
// (instead of dangerouslySetInnerHTML). The Turbopack dev server in Next
// 16.2.10 emits a noisy console warning whenever a <Script> component is
// rendered with inline content via dangerouslySetInnerHTML; switching to an
// external src= asset eliminates the warning while preserving the before-
// paint execution order (this file is still injected into the head before
// any other JS module thanks to strategy="beforeInteractive").
//
// Source of truth for the allowed-theme list: src/lib/themes.ts
(function () {
  var ALLOWED_THEMES = ['universe','spider-man','thanos','iron-man','captain-america','thor','hulk','black-widow','black-panther','loki','doctor-strange','captain-marvel','scarlet-witch','deadpool','magneto','daredevil','x-men','fantastic-four','guardians','doctor-doom'];
  var theme = 'universe';

  try {
    var stored = localStorage.getItem('theme');
    if (stored && ALLOWED_THEMES.indexOf(stored) !== -1) {
      theme = stored;
    }
  } catch (e) {}

  document.documentElement.setAttribute('data-theme', theme);

  try {
    localStorage.setItem('theme', theme);
  } catch (e) {}
})();
