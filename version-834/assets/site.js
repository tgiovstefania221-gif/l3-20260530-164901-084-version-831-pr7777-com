(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    function setupNavigation() {
        var toggle = document.querySelector('[data-nav-toggle]');
        var menu = document.querySelector('[data-nav-menu]');
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    function setupImages() {
        document.addEventListener('error', function (event) {
            var target = event.target;
            if (target && target.tagName === 'IMG') {
                target.classList.add('is-hidden');
            }
        }, true);
    }

    function setupHero() {
        var root = document.querySelector('[data-hero-carousel]');
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
        if (!slides.length) {
            return;
        }
        var current = 0;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, idx) {
                slide.classList.toggle('is-active', idx === current);
            });
            dots.forEach(function (dot, idx) {
                dot.classList.toggle('is-active', idx === current);
            });
        }
        dots.forEach(function (dot, idx) {
            dot.addEventListener('click', function () {
                show(idx);
            });
        });
        window.setInterval(function () {
            show(current + 1);
        }, 5200);
    }

    function setupCatalog() {
        var filterRoot = document.querySelector('[data-filters]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-catalog-card]'));
        if (!filterRoot || !cards.length) {
            return;
        }
        var searchInput = filterRoot.querySelector('[data-search-input]');
        var selects = Array.prototype.slice.call(filterRoot.querySelectorAll('[data-filter]'));
        function applyFilters() {
            var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
            var values = {};
            selects.forEach(function (select) {
                values[select.getAttribute('data-filter')] = select.value;
            });
            cards.forEach(function (card) {
                var text = (card.getAttribute('data-search') || '').toLowerCase();
                var ok = !keyword || text.indexOf(keyword) !== -1;
                Object.keys(values).forEach(function (key) {
                    var value = values[key];
                    if (value && card.getAttribute('data-' + key) !== value) {
                        ok = false;
                    }
                });
                card.classList.toggle('is-hidden', !ok);
            });
        }
        if (searchInput) {
            searchInput.addEventListener('input', applyFilters);
        }
        selects.forEach(function (select) {
            select.addEventListener('change', applyFilters);
        });
    }

    function setupPlayers() {
        var shells = Array.prototype.slice.call(document.querySelectorAll('[data-player-shell]'));
        shells.forEach(function (shell) {
            var video = shell.querySelector('video');
            var source = video ? video.querySelector('source') : null;
            var button = shell.querySelector('[data-play-button]');
            if (!video || !source) {
                return;
            }
            var stream = source.getAttribute('src');
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            }
            function start() {
                if (button) {
                    button.classList.add('is-hidden');
                }
                var attempt = video.play();
                if (attempt && typeof attempt.catch === 'function') {
                    attempt.catch(function () {
                        if (button) {
                            button.classList.remove('is-hidden');
                        }
                    });
                }
            }
            if (button) {
                button.addEventListener('click', start);
            }
            video.addEventListener('play', function () {
                if (button) {
                    button.classList.add('is-hidden');
                }
            });
            video.addEventListener('pause', function () {
                if (button && video.currentTime === 0) {
                    button.classList.remove('is-hidden');
                }
            });
        });
    }

    ready(function () {
        setupNavigation();
        setupImages();
        setupHero();
        setupCatalog();
        setupPlayers();
    });
}());
