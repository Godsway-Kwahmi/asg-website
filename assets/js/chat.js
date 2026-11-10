/* ASG assistant — ranks the questions in assets/js/knowledge.js and answers with the Society's own
   wording, so a reply can never contradict the page it links to. Built on <body>, outside #page,
   because layout.js zoom-scales that artboard. Nothing is generated and nothing is stored. */
(function (g) {
  var KB = g.ASGKb;
  if (!KB || !KB.length) return;

  var LABELS = { about: "About ASG", features: "Features", news: "News", events: "Events", learn: "Learn",
    podcast: "Podcast", contact: "Get in touch", shop: "Shop", join: "Join Us", jobs: "ASG Job Board",
    register: "Register", login: "Log in", search: "Search", privacy: "Privacy Policy",
    cookies: "Cookie Policy", "ai-policy": "AI Policy", index: "ASG home" },
    STOP = "a an and are as at be but by can could did does do for from had has have how i if in is it its me my " +
      "of on or our than that the their them there these they this to us was we were what when where which who why will " +
      "with would you your about tell say am find want".split(" "),
    page = document.body.dataset.p || "";

  function stem(t) { return t.length > 3 && /[^s]s$/.test(t) ? t.slice(0, -1) : t; }
  function keys(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" ").filter(function (t) {
      return t.length > 2 && STOP.indexOf(t) < 0;
    }).map(stem);
  }
  function set(t) { var m = {}; t.forEach(function (x) { m[x] = 1; }); return m; }

  KB.forEach(function (e) {
    e._i = keys(e.q + "|" + e.alt.join("|"));
    e._a = keys(e.a);
    e._p = set(keys(e.url.split("#")[0].replace(".html", "")));
  });
  var DF = {};
  KB.forEach(function (e) { var u = set(e._i); for (var t in u) DF[t] = (DF[t] || 0) + 1; });

  function ask(q) {
    var t = keys(q), phrase = q.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (!t.length) return [];
    return KB.map(function (e) {
      var i = set(e._i), a = set(e._a), s = 0, m = 0, mi = 0;
      t.forEach(function (tok) {
        if (i[tok]) { s += (DF[tok] || 0) > 5 ? 1 : 3; m++; mi++; }
        else if (a[tok]) { s += 1; m++; }
      });
      if (mi === t.length) s += 2;
      if (t.some(function (tok) { return e._p[tok]; })) s += 2;
      if (phrase.length > 9 && (" " + e._i.join(" ") + " ").indexOf(phrase) > -1) s += 4;
      if (e.topic === page) s += 1.5;
      e._s = s;
      e._c = m / t.length;
      e._mi = mi;
      e._one = t.length === 1 && mi === 1;
      return e;
    }).filter(function (e) { return (e._s >= 4 && e._c >= 0.5) || e._one; })
      .sort(function (x, y) { return y._s - x._s || y._mi - x._mi; })
      .slice(0, 3);
  }

  function label(url) {
    var f = url.split("#")[0].replace(".html", "");
    return LABELS[f] || f;
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  var btn, panel, log, input, open = false;

  function answer(entry) {
    var box = el("div", "ask-a"), src = el("p", "ask-src"), link = el("a", null, label(entry.url));
    link.href = entry.url;
    src.appendChild(document.createTextNode("From "));
    src.appendChild(link);
    src.appendChild(document.createTextNode(" "));
    box.appendChild(el("h3", "ask-qt", entry.q));
    box.appendChild(el("p", "ask-at", entry.a));
    box.appendChild(src);
    return box;
  }

  function none() {
    var box = el("div", "ask-a ask-none"),
      mail = el("a", null, "info@asg.com"), form = el("a", null, "contact form");
    mail.href = "mailto:info@asg.com";
    form.href = "contact.html";
    box.appendChild(el("p", "ask-at", "That one isn’t answered anywhere on this site yet, and we would rather send you to a person than guess."));
    var line = el("p", "ask-src");
    line.appendChild(document.createTextNode("Email "));
    line.appendChild(mail);
    line.appendChild(document.createTextNode(" or use the "));
    line.appendChild(form);
    box.appendChild(line);
    return box;
  }

  function ask_(q) {
    var hits = ask(q);
    log.appendChild(el("p", "ask-u", q));
    if (!hits.length) log.appendChild(none());
    else hits.forEach(function (h) { log.appendChild(answer(h)); });
    log.scrollTop = log.scrollHeight;
  }

  function show(on) {
    open = on;
    panel.classList.toggle("on", on);
    btn.setAttribute("aria-expanded", on ? "true" : "false");
    if (on) input.focus();
    else btn.focus();
  }

  btn = el("button", "ask-btn");
  btn.type = "button";
  btn.id = "ask-btn";
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", "ask-panel");
  btn.appendChild(el("i", "pl"));
  btn.appendChild(el("span", null, "Ask ASG"));

  panel = el("div", "ask");
  panel.id = "ask-panel";
  panel.setAttribute("role", "region");
  panel.setAttribute("aria-label", "Ask ASG");

  var hd = el("div", "ask-hd"), x = el("button", "ask-x");
  x.type = "button";
  x.setAttribute("aria-label", "Close Ask ASG");
  x.appendChild(document.createTextNode("+"));
  hd.appendChild(el("p", "ask-t", "Ask ASG"));
  hd.appendChild(x);

  log = el("div", "ask-log");
  log.setAttribute("aria-live", "polite");
  log.appendChild(el("p", "ask-at", "Ask about membership, categories, fees, CPD, events, the podcast or the shop. Every answer comes from this site, with a link to the page it comes from."));
  log.appendChild(el("p", "ask-disc", "You’re talking to ASG’s automated assistant. It answers from published pages only and never decides an application."));

  var chips = el("div", "ask-chips");
  ["How do I join?", "What does membership cost?", "When is the AGM?", "How does CPD work?"].forEach(function (c) {
    var b = el("button", "ask-chip", c);
    b.type = "button";
    b.addEventListener("click", function () { ask_(c); });
    chips.appendChild(b);
  });
  log.appendChild(chips);

  var form = el("form", "ask-row"), lb = el("label", "ask-lb", "Your question"), go = el("button", "ask-go", "Send");
  lb.htmlFor = "ask-in";
  form.action = "#";
  input = el("input", "ask-in");
  input.type = "text";
  input.id = "ask-in";
  input.autocomplete = "off";
  input.setAttribute("aria-label", "Your question");
  go.type = "submit";
  form.appendChild(lb);
  form.appendChild(input);
  form.appendChild(go);
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var q = input.value.trim();
    if (!q) return;
    input.value = "";
    ask_(q);
  });

  panel.appendChild(hd);
  panel.appendChild(log);
  panel.appendChild(form);
  document.body.appendChild(btn);
  document.body.appendChild(panel);

  btn.addEventListener("click", function () { show(!open); });
  x.addEventListener("click", function () { show(false); });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && open) show(false);
  });

  g.ASGAsk = { ask: ask, score: function (q) { return ask(q).map(function (e) { return e.id + ":" + e._s; }); } };
})(window);
