/* Layout controller.
   >= 1200px : the 1920px artboard is scaled to the viewport (unchanged desktop behaviour).
   <  1200px : scaling is switched off so the CSS media query can reflow the page,
               and the header menu button toggles the navigation panel. */
(function () {
  var pg = document.getElementById("page");
  if (!pg) return;
  var mq = window.matchMedia("(max-width:1199px)");

  function hint() {
    /* the search field has no visible label on desktop; on small screens give it one */
    var f = document.querySelectorAll(".mpanel .q");
    for (var i = 0; i < f.length; i++) {
      if (mq.matches) f[i].setAttribute("placeholder", "Search");
      else f[i].removeAttribute("placeholder");
    }
  }

  function fit() {
    hint();
    if (mq.matches) {
      pg.style.zoom = "";
      pg.style.transform = "";
      document.body.style.height = "";
      return;
    }
    var s = document.documentElement.clientWidth / 1920;
    if (CSS.supports("zoom", "1")) {
      pg.style.zoom = s;
    } else {
      pg.style.transform = "scale(" + s + ")";
      document.body.style.height = pg.offsetHeight * s + "px";
    }
  }

  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    var b = document.querySelector(".mbtn");
    if (b) b.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function onBreakpoint() {
    if (!mq.matches) setMenu(false);
    fit();
  }

  fit();
  window.addEventListener("resize", fit);
  window.addEventListener("load", fit);
  if (mq.addEventListener) mq.addEventListener("change", onBreakpoint);
  else if (mq.addListener) mq.addListener(onBreakpoint);
  window.ASGRefit = fit;

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    if (t.closest(".mbtn")) {
      setMenu(!document.body.classList.contains("menu-open"));
    } else if (t.closest(".mpanel a")) {
      setMenu(false);
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
      setMenu(false);
      var b = document.querySelector(".mbtn");
      if (b) b.focus();
    }
  });
})();
