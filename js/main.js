// xxxotic — landing page interactions
(function () {
  "use strict";

  // Current year in footer
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const nav = document.getElementById("globalNav");
  const navToggle = document.getElementById("navToggle");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("menu-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Features dropdown (click + hover)
  document.querySelectorAll(".nav-item.has-dropdown").forEach((item) => {
    const toggle = item.querySelector(".dropdown-toggle");
    if (!toggle) return;

    const close = () => {
      item.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    };
    const open = () => {
      item.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
    };

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      item.classList.contains("open") ? close() : open();
    });
    item.addEventListener("mouseenter", open);
    item.addEventListener("mouseleave", close);
    document.addEventListener("click", (e) => {
      if (!item.contains(e.target)) close();
    });
  });

  // Smooth-scroll for internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Count-up animation for stat numbers (on scroll into view)
  const stats = document.querySelectorAll(".stat-num");
  const formatNum = (n, target) => {
    if (target < 10 && !Number.isInteger(target)) return n.toFixed(1);
    return Math.round(n).toString();
  };

  const animateStat = (el) => {
    if (el.dataset.done === "1") return;
    el.dataset.done = "1";
    const target = parseFloat(el.dataset.target || "0");
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = target * eased;
      el.textContent = formatNum(value, target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = (Number.isInteger(target) ? target : target.toFixed(1)) + suffix;
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStat(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    stats.forEach((el) => io.observe(el));
  } else {
    stats.forEach(animateStat);
  }

  // Testimonial carousel
  const track = document.getElementById("carTrack");
  if (track) {
    const slides = Array.from(track.querySelectorAll(".car-slide"));
    let index = 0;
    const render = () => {
      slides.forEach((s, i) => {
        s.hidden = i !== index;
      });
    };
    render();

    const prev = document.querySelector(".car-btn.prev");
    const next = document.querySelector(".car-btn.next");
    prev && prev.addEventListener("click", () => {
      index = (index - 1 + slides.length) % slides.length;
      render();
    });
    next && next.addEventListener("click", () => {
      index = (index + 1) % slides.length;
      render();
    });

    // auto-rotate every 6s
    setInterval(() => {
      index = (index + 1) % slides.length;
      render();
    }, 6000);
  }
})();
