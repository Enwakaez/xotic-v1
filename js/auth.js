// xxxotic v1 — Auth helpers
//
// Wraps Supabase Auth + the role-aware signup flow that creates the base
// profile row and the role-specific extension row in one go.
//
// Pages should use the helpers exposed on window.xxxoticAuth and the
// renderConfigBanner() utility to surface the "Backend not configured"
// state without breaking the visual layout.
(function () {
  "use strict";

  function client() {
    var cfg = window.xxxoticConfig;
    return cfg && cfg.isConfigured ? cfg.client : null;
  }

  function isConfigured() {
    return !!client();
  }

  // -------- Config banner ----------------------------------------------
  // Renders a sticky red banner at the top of the page when Supabase is
  // not configured, and disables every form on the page so submissions
  // can't silently no-op.
  function renderConfigBanner(targetId) {
    if (isConfigured()) return;
    var banner = document.createElement("div");
    banner.className = "config-banner";
    banner.setAttribute("role", "alert");
    banner.innerHTML =
      "<strong>Backend not configured.</strong> " +
      "Set SUPABASE_URL and SUPABASE_ANON_KEY in <code>js/config.js</code> " +
      "before this page can read or write data. See <a href=\"backend/README.md\">backend/README.md</a>.";

    var host = targetId ? document.getElementById(targetId) : null;
    if (host) {
      host.prepend(banner);
    } else {
      document.body.prepend(banner);
    }

    // Disable submit buttons inside any auth-aware form
    document.querySelectorAll("form[data-auth-form] [type=submit]").forEach(function (b) {
      b.disabled = true;
      b.setAttribute("aria-disabled", "true");
    });
  }

  // -------- Session ----------------------------------------------------
  async function getSession() {
    var c = client();
    if (!c) return { data: { session: null }, error: null };
    return c.auth.getSession();
  }

  async function getCurrentUser() {
    var s = await getSession();
    return s && s.data && s.data.session ? s.data.session.user : null;
  }

  async function requireSession(redirectTo) {
    if (!isConfigured()) return null;
    var user = await getCurrentUser();
    if (!user) {
      var dest = redirectTo || "login.html";
      window.location.href = dest;
      return null;
    }
    return user;
  }

  async function signOut() {
    var c = client();
    if (!c) return { error: null };
    return c.auth.signOut();
  }

  // -------- Sign in (email + password) ---------------------------------
  async function signIn(email, password) {
    var c = client();
    if (!c) return { data: null, error: new Error("Backend not configured") };
    return c.auth.signInWithPassword({ email: email, password: password });
  }

  // -------- Sign up + role-specific profile ----------------------------
  // payload shape:
  //   {
  //     role: 'patron' | 'dancer' | 'owner',
  //     email, password,
  //     first_name, last_name, phone,
  //     // owner-only:
  //     club_name, business_address, business_phone, business_email,
  //     selected_plan, website_or_instagram, inquiry_message
  //   }
  async function signUpWithProfile(payload) {
    var c = client();
    var api = window.xxxoticApi;
    if (!c || !api) return { data: null, error: new Error("Backend not configured") };

    // 1. Create the auth user
    var signupRes = await c.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          role: payload.role,
          first_name: payload.first_name,
          last_name: payload.last_name
        }
      }
    });
    if (signupRes.error) return { data: null, error: signupRes.error };

    var user = signupRes.data && signupRes.data.user;
    if (!user) {
      // Email confirmation required? Surface a friendly error.
      return {
        data: null,
        error: new Error(
          "Account created but no session returned. Check your email to confirm, then log in."
        )
      };
    }

    // 2. Insert base profile
    var baseRow = {
      id: user.id,
      role: payload.role,
      first_name: payload.first_name,
      last_name: payload.last_name,
      phone: payload.phone,
      email: payload.email
    };
    var baseRes = await api.createBaseProfile(baseRow);
    if (baseRes.error) return { data: null, error: baseRes.error };

    // 3. Insert role-specific row
    var roleRes = { data: null, error: null };
    if (payload.role === "patron") {
      roleRes = await api.createPatronProfile({
        id: user.id,
        city: payload.city || null,
        state: payload.state || null,
        interests: payload.interests || []
      });
    } else if (payload.role === "dancer") {
      roleRes = await api.createDancerProfile({
        id: user.id,
        slug: makeSlug(user.id, payload.first_name, payload.last_name, payload.stage_name),
        stage_name: payload.stage_name || null,
        city: payload.city || null,
        state: payload.state || null,
        is_public: false
      });
    } else if (payload.role === "owner") {
      roleRes = await api.createOwnerProfile({
        id: user.id,
        club_name: payload.club_name,
        business_address: payload.business_address,
        business_phone: payload.business_phone,
        business_email: payload.business_email,
        selected_plan: payload.selected_plan || null,
        website_or_instagram: payload.website_or_instagram || null,
        inquiry_message: payload.inquiry_message || null
      });
    }
    if (roleRes.error) return { data: null, error: roleRes.error };

    // 4. Best-effort audit log
    api.logAuditEvent("signup", { role: payload.role }, user.id);

    return { data: { user: user, role: payload.role }, error: null };
  }

  // -------- Slug helper ------------------------------------------------
  function makeSlug(uuid, first, last, stage) {
    var base = (stage && stage.trim()) ||
      ((first || "") + " " + (last || "")).trim() ||
      "dancer";
    var slug = base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40);
    if (!slug) slug = "dancer";
    var suffix = (uuid || "").replace(/-/g, "").slice(0, 6);
    return slug + (suffix ? "-" + suffix : "");
  }

  window.xxxoticAuth = {
    isConfigured: isConfigured,
    renderConfigBanner: renderConfigBanner,
    getSession: getSession,
    getCurrentUser: getCurrentUser,
    requireSession: requireSession,
    signIn: signIn,
    signOut: signOut,
    signUpWithProfile: signUpWithProfile,
    makeSlug: makeSlug
  };
})();
