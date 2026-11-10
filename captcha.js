// Wholeday – Cloudflare "I'm human" check for the iPhone app.
// The app can't run Cloudflare's check itself (it isn't a normal website), so it shows this tiny page from
// wholeday.co.uk in a little frame. The check runs here, on the real website, and the one-time pass is handed
// back to the app. Opened on its own (not inside the app) it does nothing.
(function () {
  if (window.parent === window) { document.body.textContent = ""; return; }
  var send = function (msg) { try { window.parent.postMessage(msg, "*"); } catch (e) {} };
  var key = new URLSearchParams(location.search).get("k") || "";
  if (!/^[0-9A-Za-z_\-]{10,80}$/.test(key)) { send({ wdCaptchaError: "no key" }); return; }
  window.wdCaptchaGo = function () {
    try {
      window.turnstile.render("#c", { sitekey: key, theme: "light", size: "flexible",
        callback: function (t) { send({ wdCaptcha: t }); },
        "expired-callback": function () { send({ wdCaptchaExpired: 1 }); },
        "error-callback": function (e) { send({ wdCaptchaError: String(e || "error") }); return true; } });
    } catch (e) { send({ wdCaptchaError: "render" }); }
  };
})();
