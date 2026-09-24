(() => {
  async function applyPrices() {
    try {
      const response = await fetch("prices.json", { cache: "no-store" });
      if (!response.ok) return;
      const prices = await response.json();

      document.querySelectorAll("[data-price-app]").forEach((el) => {
        const app = prices[el.dataset.priceApp];
        if (!app) return;
        const label = el.querySelector("[data-price-label]");
        const note = el.querySelector("[data-price-note]");
        if (label && app.label) label.textContent = app.label;
        if (note && app.note) note.textContent = app.note;
      });

      document.querySelectorAll("[data-price-button]").forEach((el) => {
        const app = prices[el.dataset.priceButton];
        if (app?.button) el.textContent = app.button;
      });

      document.querySelectorAll("[data-price-badge]").forEach((el) => {
        const app = prices[el.dataset.priceBadge];
        if (app?.badge) el.textContent = app.badge;
      });
    } catch (_) {
      // Keep the HTML fallback prices if the JSON cannot load.
    }
  }

  applyPrices();

  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  const panels = [...document.querySelectorAll(".tab-panel")];
  const lightbox = document.querySelector(".lightbox");
  if (!lightbox) return;

  const lightboxImage = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");
  const lightboxClose = lightbox.querySelector(".lightbox-close");
  let lastFocus = null;

  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  document.querySelectorAll('.nav-links a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  });

  function selectTab(id, { focusTab = false } = {}) {
    tabs.forEach((tab) => {
      const selected = tab.dataset.tab === id;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focusTab) tab.focus();
    });

    panels.forEach((panel) => {
      const match = panel.dataset.panel === id;
      panel.hidden = !match;
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab.dataset.tab));

    tab.addEventListener("keydown", (event) => {
      const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
      if (!keys.includes(event.key)) return;
      event.preventDefault();

      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;

      selectTab(tabs[next].dataset.tab, { focusTab: true });
    });
  });

  document.querySelectorAll("[data-explore]").forEach((link) => {
    link.addEventListener("click", () => {
      selectTab(link.dataset.explore);
    });
  });

  function initCarousel(root) {
    const slides = [...root.querySelectorAll(".carousel-slide")];
    if (slides.length < 2) return;

    const prev = root.querySelector("[data-carousel-prev]");
    const next = root.querySelector("[data-carousel-next]");
    const dotsWrap = root.querySelector(".carousel-dots");
    const status = root.querySelector(".carousel-status");
    let index = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));

    const dots = slides.map((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Show screenshot ${i + 1} of ${slides.length}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
      return dot;
    });

    function goTo(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const active = i === index;
        slide.classList.toggle("is-active", active);
        slide.hidden = !active;
        dots[i].setAttribute("aria-selected", String(active));
        dots[i].tabIndex = active ? 0 : -1;
      });
      if (status) status.textContent = `${index + 1} / ${slides.length}`;
    }

    prev?.addEventListener("click", () => goTo(index - 1));
    next?.addEventListener("click", () => goTo(index + 1));

    root.addEventListener("keydown", (event) => {
      if (event.target.closest(".shot-open")) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(index - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(index + 1);
      }
    });

    goTo(index);
  }

  document.querySelectorAll("[data-carousel]").forEach(initCarousel);

  function openLightbox(button) {
    lastFocus = document.activeElement;
    lightboxImage.src = button.dataset.lightbox;
    lightboxImage.alt = button.querySelector("img")?.alt || "";
    lightboxCaption.textContent = button.dataset.caption || "";
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImage.src = "";
    document.body.classList.remove("lightbox-open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  document.querySelectorAll("[data-lightbox]").forEach((button) => {
    button.addEventListener("click", () => openLightbox(button));
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  });

  lightbox.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || lightbox.hidden) return;
    const focusables = [lightboxClose];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
