(function () {
  const menuButton = document.querySelector('.menu-toggle');
  const mobilePanel = document.querySelector('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      mobilePanel.hidden = expanded;
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let index = 0;
    let timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
        startTimer();
      });
    });

    hero.addEventListener('mouseenter', stopTimer);
    hero.addEventListener('mouseleave', startTimer);
    showSlide(0);
    startTimer();
  }

  const cards = Array.from(document.querySelectorAll('[data-card]'));
  const keywordInput = document.querySelector('[data-filter="keyword"]');
  const yearSelect = document.querySelector('[data-filter="year"]');
  const regionSelect = document.querySelector('[data-filter="region"]');
  const typeSelect = document.querySelector('[data-filter="type"]');
  const categorySelect = document.querySelector('[data-filter="category"]');
  const resetButton = document.querySelector('[data-filter-reset]');
  const resultText = document.querySelector('[data-filter-result]');

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }

    const keyword = normalize(keywordInput && keywordInput.value);
    const year = normalize(yearSelect && yearSelect.value);
    const region = normalize(regionSelect && regionSelect.value);
    const type = normalize(typeSelect && typeSelect.value);
    const category = normalize(categorySelect && categorySelect.value);
    let visible = 0;

    cards.forEach(function (card) {
      const text = normalize(card.dataset.search);
      const cardYear = normalize(card.dataset.year);
      const cardRegion = normalize(card.dataset.region);
      const cardType = normalize(card.dataset.type);
      const cardCategory = normalize(card.dataset.category);
      const matched = (!keyword || text.indexOf(keyword) !== -1) &&
        (!year || cardYear === year) &&
        (!region || cardRegion === region) &&
        (!type || cardType === type) &&
        (!category || cardCategory === category);

      card.hidden = !matched;

      if (matched) {
        visible += 1;
      }
    });

    if (resultText) {
      resultText.textContent = '当前显示 ' + visible + ' 部影片';
    }
  }

  [keywordInput, yearSelect, regionSelect, typeSelect, categorySelect].forEach(function (field) {
    if (!field) {
      return;
    }

    field.addEventListener('input', applyFilters);
    field.addEventListener('change', applyFilters);
  });

  if (resetButton) {
    resetButton.addEventListener('click', function () {
      [keywordInput, yearSelect, regionSelect, typeSelect, categorySelect].forEach(function (field) {
        if (field) {
          field.value = '';
        }
      });
      applyFilters();
    });
  }

  if (keywordInput) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');

    if (query) {
      keywordInput.value = query;
    }
  }

  applyFilters();
})();
