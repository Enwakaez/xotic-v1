// xxxotic v1 — Supabase config
//
// Replace the two placeholder strings below with the values from your
// Supabase project (Settings -> API). The anon key is safe to ship in
// the browser. NEVER paste a service-role key here.
//
// While the placeholders are in place, every auth-aware page will show
// a "Backend not configured" banner and disable submission instead of
// silently failing.
(function () {
  "use strict";

  var SUPABASE_URL = "REPLACE_WITH_SUPABASE_URL";
  var SUPABASE_ANON_KEY = "REPLACE_WITH_SUPABASE_ANON_KEY";

  var configured =
    SUPABASE_URL && SUPABASE_URL.indexOf("REPLACE_") !== 0 &&
    SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.indexOf("REPLACE_") !== 0;

  var client = null;
  if (configured) {
    if (window.supabase && typeof window.supabase.createClient === "function") {
      client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true }
      });
    } else {
      // The supabase-js CDN script must be loaded before config.js.
      // If it isn't, surface a console warning so devs catch it fast.
      // eslint-disable-next-line no-console
      console.warn("[xxxotic] supabase-js global is missing. Did you forget the CDN script tag?");
    }
  }

  window.xxxoticConfig = {
    SUPABASE_URL: SUPABASE_URL,
    SUPABASE_ANON_KEY: SUPABASE_ANON_KEY,
    isConfigured: !!client,
    client: client
  };
})();
