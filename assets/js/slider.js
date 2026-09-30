/* =====================================================================
   ASG Slider & Pagination Controller
   ---------------------------------------------------------------------
   Handles sliding transitions for sections with pagination (.pg):
   - Numerical pagination controls (1, 2, 3, 4, 5)
   - Step controls (+ + for Previous / Next)
   - Smooth horizontal slide transition (translateX)
   - 6-second auto-play cycle across active slides
   - Pause on hover, focus, or tab inactivity
   - Synchronized bold .on class (no underline) and ARIA states
   - Touch swiping on mobile devices
   - Keyboard navigation (arrows, Enter, Space)
   - Deep-linking via URL hash (#feat-1 to #feat-5, #news-1 to #news-5)
   ===================================================================== */

(function () {
  function initSlider(sliderEl, pgEl, options) {
    if (!sliderEl || !pgEl) return null;
    var track = sliderEl.querySelector(".feat-slides, .news-slides, .slider-track");
    if (!track) return null;
    var slides = track.children;
    var total = slides.length;
    if (total === 0) return null;

    options = options || {};
    var autoPlay = (typeof options.autoPlay !== "undefined") ? options.autoPlay : true;
    var autoPlayInterval = options.autoPlayInterval || 6000;

    var spans = pgEl.querySelectorAll("span");
    var activeIndex = 0;

    // Detect initial active slide from existing .on span
    var foundInitial = false;
    for (var i = 0; i < spans.length; i++) {
      if (i < total && spans[i].classList.contains("on")) {
        activeIndex = i;
        foundInitial = true;
        break;
      }
    }
    if (!foundInitial && typeof options.initialIndex === "number") {
      activeIndex = Math.max(0, Math.min(options.initialIndex, total - 1));
    }

    var timer = null;
    var isPaused = false;

    function startAutoPlay() {
      if (!autoPlay) return;
      stopAutoPlay();
      timer = setInterval(function () {
        if (!isPaused && document.visibilityState !== "hidden") {
          goTo((activeIndex + 1) % total, true);
        }
      }, autoPlayInterval);
    }

    function stopAutoPlay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function resetAutoPlay() {
      if (!autoPlay) return;
      stopAutoPlay();
      startAutoPlay();
    }

    function goTo(index, animate) {
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      activeIndex = index;

      if (animate === false) {
        track.style.transition = "none";
      } else {
        track.style.transition = "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)";
      }
      track.style.transform = "translateX(-" + (activeIndex * 100) + "%)";

      // Update span classes & ARIA
      for (var s = 0; s < spans.length; s++) {
        if (s < total) {
          if (s === activeIndex) {
            spans[s].classList.add("on");
            spans[s].setAttribute("aria-current", "true");
          } else {
            spans[s].classList.remove("on");
            spans[s].removeAttribute("aria-current");
          }
        }
      }

      var prefix = options.sectionName || "Slide";
      pgEl.setAttribute("aria-label", prefix + " " + (activeIndex + 1) + " of " + total);

      if (window.ASGRefit) {
        window.ASGRefit();
      }
    }

    // Attach click and keyboard listeners to pagination spans
    for (var k = 0; k < spans.length; k++) {
      (function (idx) {
        var span = spans[idx];
        span.setAttribute("role", "button");
        span.setAttribute("tabindex", "0");

        if (idx < total) {
          span.setAttribute("aria-label", (options.sectionName || "Slide") + " " + (idx + 1));
        } else if (idx === total) {
          span.setAttribute("aria-label", "Previous slide");
        } else if (idx === total + 1) {
          span.setAttribute("aria-label", "Next slide");
        }

        function trigger() {
          if (idx < total) {
            goTo(idx, true);
          } else if (idx === total) {
            goTo(activeIndex - 1, true); // First + is Previous
          } else if (idx === total + 1) {
            goTo(activeIndex + 1, true); // Second + is Next
          }
          resetAutoPlay();
        }

        span.addEventListener("click", function (e) {
          e.preventDefault();
          trigger();
        });

        span.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            trigger();
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            goTo(activeIndex - 1, true);
            resetAutoPlay();
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            goTo(activeIndex + 1, true);
            resetAutoPlay();
          }
        });
      })(k);
    }

    // Pause on hover or focus so reading is not interrupted
    function pause() { isPaused = true; }
    function resume() { isPaused = false; }

    sliderEl.addEventListener("mouseenter", pause);
    sliderEl.addEventListener("mouseleave", resume);
    pgEl.addEventListener("mouseenter", pause);
    pgEl.addEventListener("mouseleave", resume);

    sliderEl.addEventListener("focusin", pause);
    sliderEl.addEventListener("focusout", resume);
    pgEl.addEventListener("focusin", pause);
    pgEl.addEventListener("focusout", resume);

    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") {
        pause();
      } else {
        resume();
        resetAutoPlay();
      }
    });

    // Touch swipe support for mobile
    var touchStartX = 0;
    var touchStartY = 0;
    sliderEl.addEventListener("touchstart", function (e) {
      if (e.touches && e.touches[0]) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    sliderEl.addEventListener("touchend", function (e) {
      if (!e.changedTouches || !e.changedTouches[0]) return;
      var diffX = e.changedTouches[0].clientX - touchStartX;
      var diffY = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          goTo(activeIndex + 1, true);
        } else {
          goTo(activeIndex - 1, true);
        }
        resetAutoPlay();
      }
    }, { passive: true });

    // Initial render without animation
    goTo(activeIndex, false);

    // Start 6-second auto play
    startAutoPlay();

    return {
      goTo: function (i, anim) {
        goTo(i, anim);
        resetAutoPlay();
      },
      play: startAutoPlay,
      pause: stopAutoPlay,
      getIndex: function () { return activeIndex; }
    };
  }

  window.ASGInitSlider = initSlider;

  function boot() {
    var featSlider = document.getElementById("feat-slider");
    var featPg = document.querySelector(".feat-body .pg, .feat .pg");
    var featCtrl = null;
    if (featSlider && featPg) {
      featCtrl = initSlider(featSlider, featPg, {
        sectionName: "Feature",
        initialIndex: 0,
        autoPlay: true,
        autoPlayInterval: 6000
      });
    }

    var newsSlider = document.getElementById("news-slider");
    var newsPg = document.querySelector(".news-band .pg");
    var newsCtrl = null;
    if (newsSlider && newsPg) {
      newsCtrl = initSlider(newsSlider, newsPg, {
        sectionName: "News",
        initialIndex: 0,
        autoPlay: true,
        autoPlayInterval: 6000
      });
    }

    // Handle deep linking via hash
    function handleHash() {
      var h = location.hash;
      if (!h) return;
      var fm = h.match(/^#feat-(\d+)$/);
      if (fm && featCtrl) {
        var fi = parseInt(fm[1], 10) - 1;
        featCtrl.goTo(fi, true);
      }
      var nm = h.match(/^#news-(\d+)$/);
      if (nm && newsCtrl) {
        var ni = parseInt(nm[1], 10) - 1;
        newsCtrl.goTo(ni, true);
      }
    }

    handleHash();
    window.addEventListener("hashchange", handleHash);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
