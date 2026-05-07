// xxxotic — site interactions
//
// Store destinations: when official App Store / Google Play URLs become
// available, replace the values below with the verified URLs. Until then,
// store buttons across the site route to the local download/waitlist page.
(function () {
  "use strict";

  /* -------- Store URL constants (replace before launch) -------- */
  var APP_STORE_URL = "download.html";   // TODO: replace with verified iOS URL
  var GOOGLE_PLAY_URL = "download.html"; // TODO: replace with verified Android URL
  var FORMSPREE_ENDPOINTS = {
    "dancer-apply": "",      // TODO: set to https://formspree.io/f/<id>
    "owner-inquiry": "",     // TODO: set to https://formspree.io/f/<id>
    "patron-waitlist": "",   // TODO: set to https://formspree.io/f/<id>
    "signup": "",            // TODO: set to https://formspree.io/f/<id>
    "ambassador": ""         // TODO: set to https://formspree.io/f/<id>
  };

  // Apply real store URLs to any element marked with data-store
  if (APP_STORE_URL !== "download.html" || GOOGLE_PLAY_URL !== "download.html") {
    document.querySelectorAll('[data-store="ios"]').forEach(function (el) {
      el.setAttribute("href", APP_STORE_URL);
    });
    document.querySelectorAll('[data-store="android"]').forEach(function (el) {
      el.setAttribute("href", GOOGLE_PLAY_URL);
    });
  }

  /* -------- Hero video: respect reduced motion -------- */
  var heroVideo = document.querySelector(".hero-video");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (heroVideo && reduceMotion) {
    heroVideo.pause();
    heroVideo.removeAttribute("autoplay");
  }

  /* -------- Footer year -------- */
  var yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------- Active nav highlighting based on data-page / data-nav -------- */
  var pageId = document.body.dataset.page;
  if (pageId) {
    document.querySelectorAll("[data-nav]").forEach(function (link) {
      if (link.dataset.nav === pageId) link.classList.add("active");
    });
  }

  /* -------- Mobile nav toggle -------- */
  var nav = document.getElementById("globalNav");
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = null;
  if (nav) {
    var navLeft = nav.querySelector(".nav-inner > .nav-left");
    var navRight = nav.querySelector(".nav-inner > .nav-right");
    if (navLeft && navRight) {
      mobileMenu = document.createElement("div");
      mobileMenu.className = "mobile-menu";
      mobileMenu.setAttribute("aria-label", "Mobile navigation");
      mobileMenu.appendChild(navLeft.cloneNode(true));
      mobileMenu.appendChild(navRight.cloneNode(true));
      nav.appendChild(mobileMenu);
    }
  }
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("menu-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }
  if (mobileMenu && nav && navToggle) {
    mobileMenu.addEventListener("click", function (e) {
      var link = e.target.closest("a");
      if (!link) return;
      nav.classList.remove("menu-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  }

  /* -------- Features dropdown (hover, click, keyboard) -------- */
  document.querySelectorAll(".nav-item.has-dropdown").forEach(function (item) {
    var toggle = item.querySelector(".dropdown-toggle");
    var menu = item.querySelector(".dropdown-menu");
    if (!toggle || !menu) return;

    var menuLinks = Array.prototype.slice.call(menu.querySelectorAll("a"));

    function close() {
      item.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
    function open() {
      item.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
    }
    function toggleOpen() {
      if (item.classList.contains("open")) close();
      else open();
    }

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleOpen();
    });

    toggle.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        open();
        if (menuLinks.length) menuLinks[0].focus();
      } else if (e.key === "Escape") {
        close();
      }
    });

    menuLinks.forEach(function (link, idx) {
      link.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          var next = menuLinks[(idx + 1) % menuLinks.length];
          if (next) next.focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          var prev = menuLinks[(idx - 1 + menuLinks.length) % menuLinks.length];
          if (prev) prev.focus();
        } else if (e.key === "Escape") {
          close();
          toggle.focus();
        }
      });
    });

    item.addEventListener("mouseenter", open);
    item.addEventListener("mouseleave", close);

    document.addEventListener("click", function (e) {
      if (!item.contains(e.target)) close();
    });
  });

  /* -------- Smooth scroll for in-page anchors -------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* -------- Stat count-up animation -------- */
  var stats = document.querySelectorAll(".stat-num");
  function formatNum(n, target) {
    if (target < 10 && !Number.isInteger(target)) return n.toFixed(1);
    return Math.round(n).toString();
  }
  function animateStat(el) {
    if (el.dataset.done === "1") return;
    el.dataset.done = "1";
    var target = parseFloat(el.dataset.target || "0");
    var suffix = el.dataset.suffix || "";
    var duration = 1400;
    var start = performance.now();
    function tick(now) {
      var p = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      var value = target * eased;
      el.textContent = formatNum(value, target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = (Number.isInteger(target) ? target : target.toFixed(1)) + suffix;
    }
    requestAnimationFrame(tick);
  }
  if (stats.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateStat(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.35 });
      stats.forEach(function (el) { io.observe(el); });
    } else {
      stats.forEach(animateStat);
    }
  }

  /* -------- Carousel (auto-rotate, prev/next, dots, keyboard) -------- */
  var track = document.getElementById("carTrack");
  if (track) {
    var slides = Array.prototype.slice.call(track.querySelectorAll(".car-slide"));
    var index = 0;
    var auto;

    function render() {
      slides.forEach(function (s, i) { s.hidden = i !== index; });
      // sync indicator dots inside the active slide
      slides.forEach(function (s, i) {
        var dots = s.querySelectorAll(".car-dots span");
        if (!dots.length) return;
        dots.forEach(function (d, di) {
          d.classList.toggle("is-active", di === index && i === index);
        });
      });
    }
    function go(next) {
      index = (next + slides.length) % slides.length;
      render();
    }
    function startAuto() {
      stopAuto();
      auto = window.setInterval(function () { go(index + 1); }, 6000);
    }
    function stopAuto() {
      if (auto) { window.clearInterval(auto); auto = null; }
    }

    render();
    startAuto();

    var carousel = document.getElementById("carousel");
    var prev = carousel ? carousel.querySelector(".car-btn.prev") : null;
    var next = carousel ? carousel.querySelector(".car-btn.next") : null;
    if (prev) prev.addEventListener("click", function () { go(index - 1); startAuto(); });
    if (next) next.addEventListener("click", function () { go(index + 1); startAuto(); });

    if (carousel) {
      carousel.addEventListener("mouseenter", stopAuto);
      carousel.addEventListener("mouseleave", startAuto);
      carousel.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") { go(index - 1); startAuto(); }
        else if (e.key === "ArrowRight") { go(index + 1); startAuto(); }
      });
    }

    // Click on indicator dots to jump
    track.querySelectorAll(".car-dots span").forEach(function (dot, di) {
      dot.addEventListener("click", function () { go(di); startAuto(); });
    });
  }

  /* -------- Signup role selector (?role=dancer|owner|patron) -------- */
  var roleGrid = document.getElementById("roleGrid");
  var signupRoleInput = document.getElementById("signupRole");
  var signupTitle = document.getElementById("signupTitle");
  var signupSubtitle = document.getElementById("signupSubtitle");
  var ownerOnlyRows = document.querySelectorAll("#signupForm .owner-only");

  function applyRole(role) {
    if (!role) return;
    if (signupRoleInput) signupRoleInput.value = role;

    var titles = {
      dancer: { title: "JOIN AS A DANCER", sub: "Manage your bookings, share availability, and grow your client base." },
      owner: { title: "JOIN AS A CLUB OWNER", sub: "Add your venue details so we can connect dancers and patrons to your room." },
      patron: { title: "JOIN AS A PATRON", sub: "Plan your night and book entertainment, sections, and bottles before you arrive." }
    };
    if (titles[role]) {
      if (signupTitle) signupTitle.textContent = titles[role].title;
      if (signupSubtitle) signupSubtitle.textContent = titles[role].sub;
    }

    if (ownerOnlyRows.length) {
      ownerOnlyRows.forEach(function (row) {
        var inputs = row.querySelectorAll("input, select, textarea");
        if (role === "owner") {
          row.hidden = false;
          inputs.forEach(function (inp) { inp.required = true; });
        } else {
          row.hidden = true;
          inputs.forEach(function (inp) { inp.required = false; });
        }
      });
    }

    if (roleGrid) {
      roleGrid.querySelectorAll(".role-card").forEach(function (card) {
        card.classList.toggle("selected", card.dataset.role === role);
      });
    }
  }

  if (roleGrid) {
    var params = new URLSearchParams(window.location.search);
    var initialRole = params.get("role");
    if (initialRole) applyRole(initialRole);

    roleGrid.addEventListener("click", function (e) {
      var card = e.target.closest(".role-card");
      if (!card) return;
      applyRole(card.dataset.role);
      var form = document.getElementById("signupForm");
      if (form) form.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* -------- Static form validation + Formspree-ready submission -------- */
  document.querySelectorAll("form.static-form").forEach(function (form) {
    var configuredEndpoint = FORMSPREE_ENDPOINTS[form.dataset.form || ""];
    if (configuredEndpoint) {
      form.setAttribute("action", configuredEndpoint);
      form.setAttribute("method", "POST");
    }

    function fieldIsVisible(field) {
      return field.type === "hidden" || field.offsetParent !== null;
    }

    function validateField(field) {
      if (!fieldIsVisible(field) || field.name === "_gotcha") return true;
      var value = (field.value || "").trim();
      var valid = true;

      if (field.required && value.length === 0) valid = false;
      if (field.type === "email" && value.length > 0) {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }
      if (field.type === "tel" && value.length > 0) {
        valid = /\d{7,}/.test(value.replace(/\D/g, ""));
      }

      field.classList.toggle("invalid", !valid);
      return valid;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("input, textarea, select").forEach(function (field) {
        if (!validateField(field)) ok = false;
      });

      var success = form.querySelector(".form-success");
      var error = form.querySelector(".form-error");
      var submit = form.querySelector('[type="submit"]');
      if (success) success.hidden = true;
      if (error) error.hidden = true;

      if (!ok) {
        if (success) success.hidden = true;
        return;
      }

      var action = form.getAttribute("action");
      if (!action) {
        if (error) {
          error.textContent = "This form is ready for Formspree, but its endpoint is not configured yet.";
          error.hidden = false;
        }
        return;
      }

      if (submit) submit.disabled = true;
      window.fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      }).then(function (response) {
        if (!response.ok) throw new Error("Form submission failed");
        if (success) success.hidden = false;
        form.reset();
      }).catch(function () {
        if (error) {
          error.textContent = "Something went wrong. Please try again in a moment.";
          error.hidden = false;
        }
      }).finally(function () {
        if (submit) submit.disabled = false;
      });
    });

    form.querySelectorAll("input, textarea, select").forEach(function (field) {
      field.addEventListener("input", function () { field.classList.remove("invalid"); });
    });
  });

  /* -------- Locations: map embed search -------- */
  var mapForm = document.getElementById("mapSearchForm");
  var mapFrame = document.getElementById("mapFrame");
  if (mapForm && mapFrame) {
    mapForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("mapQuery");
      var q = input ? (input.value || "").trim() : "";
      if (!q) return;
      var encoded = encodeURIComponent(q + " nightlife");
      mapFrame.src = "https://www.google.com/maps?q=" + encoded + "&output=embed";
    });
  }

  /* -------- Help: discreet "Get Help" button -------- */
  var getHelpBtn = document.getElementById("getHelpBtn");
  if (getHelpBtn) {
    getHelpBtn.addEventListener("click", function (e) {
      e.preventDefault();
      // Send users to a search for the National Human Trafficking Hotline so
      // they reach the most current verified contact info, not a hardcoded
      // number that may have changed.
      window.open("https://www.google.com/search?q=National+Human+Trafficking+Hotline", "_blank", "noopener");
    });
  }
})();
