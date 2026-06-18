(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        menu.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("img").forEach(function (img) {
      img.addEventListener("error", function () {
        var holder = img.closest(".poster") || img.parentElement;
        if (holder) {
          holder.classList.add("poster-empty");
        }
        img.remove();
      }, { once: true });
    });

    document.querySelectorAll("[data-hero-carousel]").forEach(function (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
      var prev = carousel.querySelector("[data-hero-prev]");
      var next = carousel.querySelector("[data-hero-next]");
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === index);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
          start();
        });
      }
      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          start();
        });
      }
      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
          show(dotIndex);
          start();
        });
      });
      carousel.addEventListener("mouseenter", stop);
      carousel.addEventListener("mouseleave", start);
      show(0);
      start();
    });

    document.querySelectorAll("[data-local-filter]").forEach(function (input) {
      var section = input.closest(".content-section") || document;
      var chips = section.querySelectorAll("[data-filter-tag]");
      var activeTag = "全部";

      function filter() {
        var keyword = input.value.trim().toLowerCase();
        section.querySelectorAll("[data-card]").forEach(function (card) {
          var text = ((card.getAttribute("data-title") || "") + " " + (card.getAttribute("data-tags") || "")).toLowerCase();
          var tagMatched = activeTag === "全部" || text.indexOf(activeTag.toLowerCase()) !== -1;
          var wordMatched = !keyword || text.indexOf(keyword) !== -1;
          card.classList.toggle("is-hidden", !(tagMatched && wordMatched));
        });
      }

      input.addEventListener("input", filter);
      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          activeTag = chip.getAttribute("data-filter-tag") || "全部";
          chips.forEach(function (item) {
            item.classList.toggle("is-active", item === chip);
          });
          filter();
        });
      });
    });

    document.querySelectorAll("form").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector('input[type="search"]');
        if (input && input.name === "q" && !input.value.trim()) {
          event.preventDefault();
          input.focus();
        }
      });
    });
  });
})();
