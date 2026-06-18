(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function escapeHtml(text) {
    return String(text || "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function card(movie) {
    var terms = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.category].concat(movie.tags || []).join(" ");
    return '<article class="movie-card" data-card data-title="' + escapeHtml(movie.title) + '" data-tags="' + escapeHtml(terms) + '">' +
      '<a class="poster" data-title="' + escapeHtml(movie.title) + '" href="' + escapeHtml(movie.url) + '">' +
      '<img src="./' + escapeHtml(movie.cover) + '.jpg" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
      '<span class="poster-badge">' + escapeHtml(movie.year) + '</span>' +
      '</a>' +
      '<div class="movie-card-body">' +
      '<h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>' +
      '<p>' + escapeHtml(movie.oneLine) + '</p>' +
      '<div class="card-meta"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span><span>' + escapeHtml(movie.genre) + '</span></div>' +
      '</div>' +
      '</article>';
  }

  ready(function () {
    var data = window.filmSearchList || [];
    var params = new URLSearchParams(window.location.search);
    var query = (params.get("q") || "").trim();
    var input = document.querySelector("[data-search-input]");
    var results = document.querySelector("[data-search-results]");
    var summary = document.querySelector("[data-search-summary]");
    if (input) {
      input.value = query;
    }
    if (!results || !summary || !query) {
      return;
    }
    var lower = query.toLowerCase();
    var matched = data.filter(function (movie) {
      var text = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.category, movie.oneLine].concat(movie.tags || []).join(" ").toLowerCase();
      return text.indexOf(lower) !== -1;
    }).slice(0, 120);
    summary.textContent = matched.length ? "搜索结果" : "暂无匹配内容";
    results.innerHTML = matched.map(card).join("");
    results.querySelectorAll("img").forEach(function (img) {
      img.addEventListener("error", function () {
        var holder = img.closest(".poster") || img.parentElement;
        if (holder) {
          holder.classList.add("poster-empty");
        }
        img.remove();
      }, { once: true });
    });
  });
})();
