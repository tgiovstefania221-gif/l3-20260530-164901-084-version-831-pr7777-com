(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    document.querySelectorAll("[data-player]").forEach(function (box) {
      var video = box.querySelector("video");
      var button = box.querySelector("[data-play-button]");
      var status = box.querySelector("[data-player-status]");
      if (!video) {
        return;
      }

      var url = video.getAttribute("data-m3u8") || "";
      var attached = false;

      function setStatus(text) {
        if (status && text) {
          status.textContent = text;
        }
      }

      function attach() {
        if (attached || !url) {
          return;
        }
        attached = true;
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: false
          });
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              try {
                if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                  hls.startLoad();
                } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                  hls.recoverMediaError();
                } else {
                  hls.destroy();
                }
              } catch (error) {
                setStatus("播放暂不可用");
              }
            }
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = url;
        }
      }

      function playVideo() {
        attach();
        var promise = video.play();
        if (promise && typeof promise.then === "function") {
          promise.catch(function () {
            setStatus("点击播放");
          });
        }
      }

      if (button) {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          playVideo();
        });
      }

      video.addEventListener("click", function () {
        if (video.paused) {
          playVideo();
        } else {
          video.pause();
        }
      });

      video.addEventListener("play", function () {
        box.classList.add("is-playing");
        setStatus(video.getAttribute("aria-label") || status.textContent);
      });

      video.addEventListener("pause", function () {
        box.classList.remove("is-playing");
      });

      video.addEventListener("error", function () {
        setStatus("播放暂不可用");
      });

      attach();
    });
  });
})();
