(function () {
  const players = Array.from(document.querySelectorAll('[data-player]'));

  players.forEach(function (player) {
    const video = player.querySelector('video');
    const overlay = player.querySelector('.play-layer');
    const source = player.dataset.src;
    let hlsInstance = null;
    let ready = false;

    function attachSource() {
      if (!video || !source || ready) {
        return;
      }

      ready = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (typeof Hls !== 'undefined' && Hls.isSupported()) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function playMovie() {
      attachSource();
      player.classList.add('playing');

      const attempt = video.play();

      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {
          player.classList.remove('playing');
        });
      }
    }

    if (overlay && video) {
      overlay.addEventListener('click', playMovie);
    }

    if (video) {
      video.addEventListener('play', function () {
        player.classList.add('playing');
      });

      video.addEventListener('error', function () {
        player.classList.remove('playing');
      });
    }

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  });
})();
