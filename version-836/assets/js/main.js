const ready = (fn) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
};

ready(() => {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
    });
  }

  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("is-missing");
    });
  });

  const cards = Array.from(document.querySelectorAll("[data-card]"));
  const emptyState = document.querySelector("[data-empty-state]");
  const searchInputs = Array.from(document.querySelectorAll("[data-search-input], [data-page-search]"));
  const yearFilter = document.querySelector("[data-year-filter]");
  const sortSelect = document.querySelector("[data-sort-select]");
  const cardGrid = document.querySelector(".movie-grid");

  const applyFilters = () => {
    const query = searchInputs.map((input) => input.value.trim().toLowerCase()).find(Boolean) || "";
    const year = yearFilter ? yearFilter.value : "";
    let shown = 0;

    cards.forEach((card) => {
      const haystack = [card.dataset.title, card.dataset.genre, card.dataset.region, card.dataset.year].join(" ").toLowerCase();
      const matchQuery = !query || haystack.includes(query);
      const matchYear = !year || card.dataset.year === year;
      const visible = matchQuery && matchYear;
      card.style.display = visible ? "" : "none";
      if (visible) {
        shown += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle("show", shown === 0);
    }
  };

  searchInputs.forEach((input) => input.addEventListener("input", applyFilters));
  if (yearFilter) {
    yearFilter.addEventListener("change", applyFilters);
  }

  if (sortSelect && cardGrid) {
    sortSelect.addEventListener("change", () => {
      const sorted = [...cards].sort((a, b) => {
        if (sortSelect.value === "hot") {
          return Number(b.dataset.hot || 0) - Number(a.dataset.hot || 0);
        }
        return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
      });
      sorted.forEach((card) => cardGrid.appendChild(card));
      applyFilters();
    });
  }

  const hero = document.querySelector("[data-hero]");
  if (hero) {
    const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
    let current = 0;

    const showSlide = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("active", slideIndex === current);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === current);
      });
    };

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => showSlide(index));
    });

    if (slides.length > 1) {
      window.setInterval(() => showSlide(current + 1), 5200);
    }
  }

  const video = document.querySelector("#movie-player");
  if (video) {
    const stream = video.dataset.stream;
    const overlay = document.querySelector("[data-player-overlay]");
    const startButtons = Array.from(document.querySelectorAll("[data-player-button]"));

    const Hls = window.Hls;

    if (stream) {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
      } else if (Hls && Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
    }

    const playVideo = () => {
      if (overlay) {
        overlay.classList.add("hidden");
      }
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    };

    startButtons.forEach((button) => button.addEventListener("click", playVideo));
    video.addEventListener("play", () => {
      if (overlay) {
        overlay.classList.add("hidden");
      }
    });
  }
});
