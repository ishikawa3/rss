/**
 * Registers the service worker that makes the site installable and readable
 * offline. The template already referenced index.js, so this also fills in a
 * file that previously 404'd.
 */
(function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    // Resolve against the document so the worker keeps the /rss/ scope that
    // GitHub Pages serves the site from.
    navigator.serviceWorker
      .register(new URL("sw.js", document.baseURI))
      .then(function (registration) {
        registration.addEventListener("updatefound", function () {
          var installing = registration.installing;
          if (!installing) return;

          installing.addEventListener("statechange", function () {
            // A worker that finishes installing while another one controls the
            // page is a pending update. The page holds no user state, so take
            // it immediately rather than waiting for every tab to close.
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              installing.postMessage("SKIP_WAITING");
            }
          });
        });
      })
      .catch(function () {
        /* Offline support is optional; a failed registration must not break the page. */
      });

    // On a first visit the worker claims this page, which also fires
    // controllerchange. Only an existing controller being replaced means a
    // genuine update, so reload for that case alone.
    var hadController = !!navigator.serviceWorker.controller;
    var reloading = false;
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (!hadController || reloading) return;
      reloading = true;
      window.location.reload();
    });
  });
})();
