(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  ready(function () {
    var toggle = document.querySelector("[data-mobile-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");

    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        var open = panel.classList.toggle("is-open");
        document.body.classList.toggle("nav-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    document.querySelectorAll("[data-hero-slider]").forEach(function (slider) {
      var slides = Array.from(slider.querySelectorAll(".hero-slide"));
      var dots = Array.from(slider.querySelectorAll(".hero-dot"));
      var prev = slider.querySelector("[data-hero-prev]");
      var next = slider.querySelector("[data-hero-next]");
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
          show(dotIndex);
          start();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          show(current - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(current + 1);
          start();
        });
      }

      slider.addEventListener("mouseenter", stop);
      slider.addEventListener("mouseleave", start);
      show(0);
      start();
    });

    document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
      var input = scope.querySelector("[data-filter-input]");
      var selects = Array.from(scope.querySelectorAll("[data-filter-select]"));
      var cards = Array.from(scope.querySelectorAll(".movie-card, .rank-row"));
      var output = scope.querySelector("[data-filter-count]");
      var empty = scope.querySelector("[data-empty-state]");

      function applyFilter() {
        var keyword = input ? input.value.trim().toLowerCase() : "";
        var selected = selects.map(function (select) {
          return {
            name: select.getAttribute("data-filter-select"),
            value: select.value
          };
        });
        var visible = 0;

        cards.forEach(function (card) {
          var text = (card.getAttribute("data-text") || "").toLowerCase();
          var matchesText = !keyword || text.indexOf(keyword) !== -1;
          var matchesSelects = selected.every(function (item) {
            if (!item.value) {
              return true;
            }
            return (card.getAttribute("data-" + item.name) || "") === item.value;
          });
          var showCard = matchesText && matchesSelects;
          card.classList.toggle("is-hidden", !showCard);
          if (showCard) {
            visible += 1;
          }
        });

        if (output) {
          output.textContent = "已匹配 " + visible + " 部影片";
        }
        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }

      if (input) {
        input.addEventListener("input", applyFilter);
      }
      selects.forEach(function (select) {
        select.addEventListener("change", applyFilter);
      });
      applyFilter();
    });
  });
})();

function initStaticPlayer(videoSource) {
  var video = document.querySelector("[data-player-video]");
  var trigger = document.querySelector("[data-play-trigger]");
  var loaded = false;
  var hlsInstance = null;

  if (!video || !videoSource) {
    return;
  }

  function loadVideo() {
    if (loaded) {
      return;
    }
    loaded = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSource;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hlsInstance.loadSource(videoSource);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = videoSource;
  }

  function playVideo() {
    loadVideo();
    video.controls = true;
    if (trigger) {
      trigger.classList.add("is-hidden");
    }

    var promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {
        video.controls = true;
      });
    }
  }

  if (trigger) {
    trigger.addEventListener("click", playVideo);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      playVideo();
    }
  });

  video.addEventListener("play", function () {
    if (trigger) {
      trigger.classList.add("is-hidden");
    }
  });

  window.addEventListener("pagehide", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}
