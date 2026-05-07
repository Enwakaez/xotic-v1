// xxxotic v1 — Database access layer
//
// Thin wrappers around Supabase queries. Keep page-level code free of raw
// `from(...).select(...)` chains; call these helpers instead.
//
// All functions return either:
//   { data, error: null } on success
//   { data: null, error }  on failure
//
// `error` may be a Supabase PostgrestError or a plain Error. Pages should
// always check it before reading `data`.
(function () {
  "use strict";

  function client() {
    var cfg = window.xxxoticConfig;
    return cfg && cfg.isConfigured ? cfg.client : null;
  }

  function notConfigured() {
    return { data: null, error: new Error("Backend not configured") };
  }

  // -------- Profiles ----------------------------------------------------
  async function getProfile(userId) {
    var c = client();
    if (!c) return notConfigured();
    var { data, error } = await c
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    return { data: data, error: error };
  }

  async function createBaseProfile(row) {
    var c = client();
    if (!c) return notConfigured();
    var { data, error } = await c.from("profiles").insert(row).select().single();
    return { data: data, error: error };
  }

  async function updateBaseProfile(userId, patch) {
    var c = client();
    if (!c) return notConfigured();
    var { data, error } = await c
      .from("profiles")
      .update(patch)
      .eq("id", userId)
      .select()
      .single();
    return { data: data, error: error };
  }

  // -------- Patron profiles --------------------------------------------
  async function createPatronProfile(row) {
    var c = client();
    if (!c) return notConfigured();
    var { data, error } = await c.from("patron_profiles").insert(row).select().single();
    return { data: data, error: error };
  }

  async function getPatronProfile(userId) {
    var c = client();
    if (!c) return notConfigured();
    var { data, error } = await c
      .from("patron_profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    return { data: data, error: error };
  }

  async function updatePatronProfile(userId, patch) {
    var c = client();
    if (!c) return notConfigured();
    var { data, error } = await c
      .from("patron_profiles")
      .update(patch)
      .eq("id", userId)
      .select()
      .single();
    return { data: data, error: error };
  }

  // -------- Dancer profiles --------------------------------------------
  async function createDancerProfile(row) {
    var c = client();
    if (!c) return notConfigured();
    var { data, error } = await c.from("dancer_profiles").insert(row).select().single();
    return { data: data, error: error };
  }

  async function getDancerProfileById(userId) {
    var c = client();
    if (!c) return notConfigured();
    var { data, error } = await c
      .from("dancer_profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    return { data: data, error: error };
  }

  async function getPublicDancerByIdOrSlug(idOrSlug) {
    var c = client();
    if (!c) return notConfigured();
    // Try slug first, then id (the slug column is text-unique).
    var slugRes = await c
      .from("dancer_profiles")
      .select("*")
      .eq("slug", idOrSlug)
      .eq("is_public", true)
      .maybeSingle();
    if (slugRes.data || (slugRes.error && slugRes.error.code !== "PGRST116")) return slugRes;

    // UUID fallback
    var uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRe.test(idOrSlug)) return slugRes;
    var idRes = await c
      .from("dancer_profiles")
      .select("*")
      .eq("id", idOrSlug)
      .eq("is_public", true)
      .maybeSingle();
    return idRes;
  }

  async function searchDancers(query) {
    var c = client();
    if (!c) return notConfigured();
    var q = c
      .from("dancer_profiles")
      .select("id, slug, stage_name, city, state, services, offerings, rating, rating_count")
      .eq("is_public", true)
      .order("stage_name", { ascending: true })
      .limit(50);
    if (query && query.trim()) {
      var like = "%" + query.trim() + "%";
      q = q.or(
        "stage_name.ilike." + like + ",city.ilike." + like + ",state.ilike." + like
      );
    }
    var { data, error } = await q;
    return { data: data, error: error };
  }

  async function updateDancerProfile(userId, patch) {
    var c = client();
    if (!c) return notConfigured();
    var { data, error } = await c
      .from("dancer_profiles")
      .update(patch)
      .eq("id", userId)
      .select()
      .single();
    return { data: data, error: error };
  }

  // -------- Owner profiles ---------------------------------------------
  async function createOwnerProfile(row) {
    var c = client();
    if (!c) return notConfigured();
    var { data, error } = await c.from("owner_profiles").insert(row).select().single();
    return { data: data, error: error };
  }

  async function getOwnerProfile(userId) {
    var c = client();
    if (!c) return notConfigured();
    var { data, error } = await c
      .from("owner_profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    return { data: data, error: error };
  }

  async function updateOwnerProfile(userId, patch) {
    var c = client();
    if (!c) return notConfigured();
    var { data, error } = await c
      .from("owner_profiles")
      .update(patch)
      .eq("id", userId)
      .select()
      .single();
    return { data: data, error: error };
  }

  // -------- Venues ------------------------------------------------------
  async function listFeaturedVenues() {
    var c = client();
    if (!c) return notConfigured();
    var { data, error } = await c
      .from("venues")
      .select("*")
      .eq("is_featured", true)
      .order("name", { ascending: true });
    return { data: data, error: error };
  }

  // -------- Booking requests -------------------------------------------
  async function createBookingRequest(row) {
    var c = client();
    if (!c) return notConfigured();
    var { data, error } = await c.from("booking_requests").insert(row).select().single();
    return { data: data, error: error };
  }

  async function listBookingsForPatron(userId) {
    var c = client();
    if (!c) return notConfigured();
    var { data, error } = await c
      .from("booking_requests")
      .select("*, dancer:dancer_profiles(slug, stage_name, city, state)")
      .eq("patron_id", userId)
      .order("created_at", { ascending: false });
    return { data: data, error: error };
  }

  async function listBookingsForDancer(userId) {
    var c = client();
    if (!c) return notConfigured();
    var { data, error } = await c
      .from("booking_requests")
      .select("*, patron:profiles(first_name, last_name, phone, email)")
      .eq("dancer_id", userId)
      .order("created_at", { ascending: false });
    return { data: data, error: error };
  }

  async function updateBookingStatus(bookingId, status) {
    var c = client();
    if (!c) return notConfigured();
    var { data, error } = await c
      .from("booking_requests")
      .update({ status: status })
      .eq("id", bookingId)
      .select()
      .single();
    return { data: data, error: error };
  }

  // -------- Inquiries (no-account form submissions) --------------------
  async function createInquiry(row) {
    var c = client();
    if (!c) return notConfigured();
    var { data, error } = await c.from("inquiries").insert(row).select().single();
    return { data: data, error: error };
  }

  // -------- Audit -------------------------------------------------------
  async function logAuditEvent(eventType, metadata, userId) {
    var c = client();
    if (!c) return notConfigured();
    var row = {
      event_type: eventType,
      metadata: metadata || {},
      user_id: userId || null
    };
    var { data, error } = await c.from("audit_events").insert(row);
    return { data: data, error: error };
  }

  window.xxxoticApi = {
    // profiles
    getProfile: getProfile,
    createBaseProfile: createBaseProfile,
    updateBaseProfile: updateBaseProfile,
    // patrons
    createPatronProfile: createPatronProfile,
    getPatronProfile: getPatronProfile,
    updatePatronProfile: updatePatronProfile,
    // dancers
    createDancerProfile: createDancerProfile,
    getDancerProfileById: getDancerProfileById,
    getPublicDancerByIdOrSlug: getPublicDancerByIdOrSlug,
    searchDancers: searchDancers,
    updateDancerProfile: updateDancerProfile,
    // owners
    createOwnerProfile: createOwnerProfile,
    getOwnerProfile: getOwnerProfile,
    updateOwnerProfile: updateOwnerProfile,
    // venues
    listFeaturedVenues: listFeaturedVenues,
    // bookings
    createBookingRequest: createBookingRequest,
    listBookingsForPatron: listBookingsForPatron,
    listBookingsForDancer: listBookingsForDancer,
    updateBookingStatus: updateBookingStatus,
    // inquiries / audit
    createInquiry: createInquiry,
    logAuditEvent: logAuditEvent
  };
})();
