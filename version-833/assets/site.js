(function () {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-nav-menu]");

  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      menu.classList.toggle("open");
    });
  }

  const slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(document.querySelectorAll("[data-hero-dot]"));
  const prev = document.querySelector("[data-hero-prev]");
  const next = document.querySelector("[data-hero-next]");
  let current = 0;
  let timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === current);
    });
  }

  function restartTimer() {
    if (timer) {
      window.clearInterval(timer);
    }
    if (slides.length > 1) {
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 6200);
    }
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showSlide(index);
      restartTimer();
    });
  });

  if (prev) {
    prev.addEventListener("click", function () {
      showSlide(current - 1);
      restartTimer();
    });
  }

  if (next) {
    next.addEventListener("click", function () {
      showSlide(current + 1);
      restartTimer();
    });
  }

  restartTimer();

  const searchInput = document.querySelector("[data-search-input]");
  const selects = Array.from(document.querySelectorAll("[data-filter-select]"));
  const cards = Array.from(document.querySelectorAll("[data-filter-card]"));

  if (searchInput) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (query) {
      searchInput.value = query;
    }
  }

  function matchesSelects(card) {
    return selects.every(function (select) {
      const value = select.value.trim();
      if (!value) {
        return true;
      }
      const field = select.getAttribute("data-filter-field");
      const cardValue = (card.getAttribute("data-" + field) || "").toLowerCase();
      return cardValue.indexOf(value.toLowerCase()) !== -1;
    });
  }

  function updateCards() {
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
    cards.forEach(function (card) {
      const text = (card.getAttribute("data-text") || card.textContent || "").toLowerCase();
      const keywordMatch = !keyword || text.indexOf(keyword) !== -1;
      card.hidden = !(keywordMatch && matchesSelects(card));
    });
  }

  if (searchInput || selects.length) {
    if (searchInput) {
      searchInput.addEventListener("input", updateCards);
    }
    selects.forEach(function (select) {
      select.addEventListener("change", updateCards);
    });
    updateCards();
  }
})();
