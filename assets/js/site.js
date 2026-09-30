/* Shared header + footer for the inner pages.
   Desktop positions are unchanged; the wrapper elements (.hbar, .mpanel, .ft-main, .ft-bar)
   only matter below 1200px, where the stylesheet turns them into a menu and stacked footer. */
(function () {
  var N = [["About ASG", "about"], ["Events", "events"], ["Learn", "learn"], ["Get in touch", "contact"], ["Shop", "shop"]],
    cur = document.body.dataset.p,
    L = '<i class="a"></i><i class="l"></i><i class="c"></i><span class="w1" style="left:65px;top:41.5px">ARCHITECTURAL</span><span class="w2" style="left:65px;top:56.5px">SOCIETY</span><span style="left:122px;top:56.5px">OF</span><span style="left:65px;top:71.5px">GHANA</span><span class="pl"></span>',
    logo = function (c, s) {
      return '<a class="logo' + c + '" href="index.html" aria-label="Architectural Society of Ghana, home" style="' + s + '">' + L + "</a>";
    },
    ext = function (n, u) {
      return '<a href="' + u + '" target="_blank" rel="noopener">' + n + "</a>";
    },
    hd =
      '<div class="hbar">' + logo("", "left:105px;top:93px") +
      '<button class="mbtn" type="button" aria-label="Menu" aria-expanded="false" aria-controls="mpanel"></button></div>' +
      '<div class="mpanel" id="mpanel"><nav class="nv" aria-label="Main">' +
      N.map(function (n) {
        return '<a href="' + n[1] + '.html"' + (n[1] == cur ? ' aria-current="page"' : "") + ">" + n[0] + "</a>";
      }).join('<i class="sep"></i>') +
      '</nav><div class="ac"><form action="search.html" role="search"><input class="q" type="search" name="q" aria-label="Search"></form>' +
      '<a href="search.html">search</a><i class="sep"></i><a href="login.html">log in</a><i class="sep"></i><a href="register.html">Register</a></div></div>',
    ft =
      '<div class="ft-main"><div class="b" style="left:0;top:0;width:1920px;height:278px;background:var(--bright)"></div>' +
      logo(" inv", "left:278px;top:54px") +
      '<nav class="fl fnav" aria-label="Footer" style="left:644px;top:51px">' +
      N.map(function (n) {
        return '<a href="' + n[1] + '.html">' + n[0] + "</a>";
      }).join("") +
      '</nav><i class="sep r" style="left:743px;top:56px"></i>' +
      '<div class="fl fsoc" id="footer-socials" style="left:819px;top:51px">' +
      ext("Instagram", "https://www.instagram.com/") + ext("Facebook", "https://www.facebook.com/") +
      ext("Youtube", "https://www.youtube.com/") + ext("LinkedIn", "https://www.linkedin.com/") +
      '</div><i class="sep r" style="left:918px;top:95px"></i>' +
      '<div class="fl fcon" style="left:994px;top:51px"><a id="footer-email" href="mailto:info@asg.com">info@asg.com</a><a id="footer-phone" href="tel:+2330568769823">+233 056 876 9823</a></div><i class="sep r" style="left:1093px;top:95px"></i>' +
      '<p class="t faddr" id="footer-address" style="left:992px;top:132px;font-size:19px;line-height:27px;font-weight:400">No. 9 Atsuru street</p></div>' +
      '<div class="ft-bar"><div class="b" style="left:0;top:278px;width:1920px;height:78px;background:var(--rust)"></div>' +
      '<p class="t u fcopy" style="left:278px;top:309px">All rights reserved ASG Media 2026</p>' +
      '<a class="t u fpol" href="privacy.html" style="left:642px;top:309px">Privacy Policy</a><i class="sep w" style="left:753px;top:314px"></i>' +
      '<a class="t u fpol" href="cookies.html" style="left:763px;top:309px">Cookie Policy</a><i class="sep w" style="left:873px;top:314px"></i>' +
      '<a class="t u fpol" href="ai-policy.html" style="left:883px;top:309px">AI Policy</a></div>';

  document.getElementById("hd").insertAdjacentHTML("afterbegin", hd);
  document.getElementById("ft").innerHTML = ft;

  var q = new URLSearchParams(location.search).get("q"),
    i = document.querySelector(".q");
  if (q && i) i.value = q;

  document.querySelectorAll("form[data-demo]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      f.querySelector("[role=status]").textContent = "Member login isn’t connected yet. Email info@asg.com for access.";
    });
  });

  if (window.ASGRefit) window.ASGRefit();
})();
