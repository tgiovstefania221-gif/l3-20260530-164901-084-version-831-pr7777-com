(function () {
    function initMenu() {
        var toggle = document.querySelector('[data-menu-toggle]');
        var menu = document.querySelector('[data-menu]');

        if (!toggle || !menu) {
            return;
        }

        toggle.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    function initHero() {
        var root = document.querySelector('[data-hero]');

        if (!root) {
            return;
        }

        var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
        var prev = root.querySelector('[data-hero-prev]');
        var next = root.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
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
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                start();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });

        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function initFilters() {
        var input = document.querySelector('[data-search-input]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
        var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
        var count = document.querySelector('[data-result-count]');
        var selected = 'all';

        if (!cards.length) {
            return;
        }

        function value(card, name) {
            return (card.getAttribute(name) || '').toLowerCase();
        }

        function apply() {
            var query = input ? input.value.trim().toLowerCase() : '';
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = [
                    value(card, 'data-title'),
                    value(card, 'data-region'),
                    value(card, 'data-type'),
                    value(card, 'data-genre'),
                    value(card, 'data-tags')
                ].join(' ');
                var matchText = !query || haystack.indexOf(query) !== -1;
                var cardType = value(card, 'data-type');
                var matchType = selected === 'all' || cardType.indexOf(selected.toLowerCase()) !== -1;
                var show = matchText && matchType;

                card.classList.toggle('is-hidden', !show);

                if (show) {
                    visible += 1;
                }
            });

            if (count) {
                count.textContent = String(visible);
            }
        }

        if (input) {
            input.addEventListener('input', apply);
        }

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                selected = button.getAttribute('data-filter') || 'all';
                buttons.forEach(function (item) {
                    item.classList.toggle('is-active', item === button);
                });
                apply();
            });
        });

        apply();
    }

    function connectVideo(video, stream) {
        if (video.getAttribute('data-ready') === 'true') {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({ enableWorker: true });
            hls.loadSource(stream);
            hls.attachMedia(video);
            video._hlsInstance = hls;
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                video.play().catch(function () {});
            });
        } else {
            video.src = stream;
        }

        video.setAttribute('data-ready', 'true');
    }

    function initPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

        players.forEach(function (player) {
            var video = player.querySelector('video');
            var button = player.querySelector('[data-play-button]');

            if (!video || !button) {
                return;
            }

            var stream = video.getAttribute('data-stream');

            function play() {
                if (!stream) {
                    return;
                }

                button.classList.add('is-hidden');
                video.controls = true;
                connectVideo(video, stream);
                video.play().catch(function () {
                    button.classList.remove('is-hidden');
                });
            }

            button.addEventListener('click', play);
            video.addEventListener('click', function () {
                if (video.getAttribute('data-ready') !== 'true') {
                    play();
                }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMenu();
        initHero();
        initFilters();
        initPlayers();
    });
})();
