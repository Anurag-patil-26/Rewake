// Scroll reveal — one observer, unobserve after first entry.
  (function () {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var els = document.querySelectorAll(".rv");
    if (reduced || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  })();

  // Hero demo: loops Rewake's real story — capture, power cut, restore.
  (function () {
    var apps = [
      { n: "devenv",          d: "2 windows",            c: "#B48CF2" },
      { n: "WindowsTerminal", d: "3 tabs, saved folders", c: "#7FD4F5" },
      { n: "chrome",          d: "14 tabs",              c: "#F5B97F" },
      { n: "Notepad",         d: "notes.txt",            c: "#7FF5C0" },
      { n: "Explorer",        d: "D:\\Rewake",           c: "#F5E27F" }
    ];
    var demo  = document.getElementById("demo");
    var title = document.getElementById("demoTitle");
    var msg   = document.getElementById("demoMsg");
    var count = document.getElementById("demoCount");
    var fill  = document.getElementById("demoFill");
    var box   = document.getElementById("demoRows");
    var chips = [];

    apps.forEach(function (a) {
      var row = document.createElement("div");
      row.className = "drow";
      row.innerHTML =
        "<span class='di' style='background:" + a.c + "'>" + a.n[0].toUpperCase() + "</span>" +
        "<span><span class='dn'>" + a.n + "</span><br><span class='dd'>" + a.d + "</span></span>" +
        "<span class='chip'>open</span>";
      box.appendChild(row);
      chips.push(row.lastElementChild);
    });

    function setChip(i, text, cls) { chips[i].textContent = text; chips[i].className = "chip" + (cls ? " " + cls : ""); }
    function rowDim(i, on) { chips[i].parentElement.classList.toggle("dim", on); }
    function bar(f) { fill.style.width = (f * 100) + "%"; }

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      title.textContent = "REWAKE — RESTORE";
      msg.textContent = "Restore finished — everything back in place.";
      count.textContent = apps.length + " of " + apps.length;
      apps.forEach(function (_, i) { setChip(i, "restored \u2713", "on"); });
      bar(1);
      return;
    }

    var queue = [];
    function at(t, fn) { queue.push(setTimeout(fn, t)); }

    function loop() {
      var t = 0, n = apps.length, i;

      // ---- capture ----
      at(t, function () {
        demo.classList.remove("off");
        title.textContent = "REWAKE — CAPTURE";
        msg.textContent = "Capturing workspace\u2026";
        count.textContent = "";
        bar(0);
        apps.forEach(function (_, k) { setChip(k, "open"); rowDim(k, false); });
      });
      apps.forEach(function (_, k) {
        at(t += 420, function () {
          setChip(k, "captured \u2713", "on");
          count.textContent = (k + 1) + " of " + n;
          bar((k + 1) / n);
        });
      });
      at(t += 700, function () { msg.textContent = "Capture saved \u2014 " + n + " apps."; });

      // ---- power cut ----
      at(t += 1500, function () {
        demo.classList.add("off");
        title.textContent = "\u26A1 POWER CUT";
        msg.textContent = "Power lost \u2014 rebooting\u2026";
        count.textContent = "";
        bar(0);
      });

      // ---- restore ----
      at(t += 1700, function () {
        demo.classList.remove("off");
        title.textContent = "REWAKE — RESTORE";
        msg.textContent = "Restoring workspace \u2014 " + n + " windows\u2026";
        apps.forEach(function (_, k) { setChip(k, "queued"); rowDim(k, true); });
      });
      for (i = 0; i < n; i++) {
        (function (k) {
          at(t += 350, function () { rowDim(k, false); setChip(k, "launching\u2026", "busy"); });
          at(t += 330, function () {
            setChip(k, "restored \u2713", "on");
            count.textContent = (k + 1) + " of " + n;
            bar((k + 1) / n);
          });
        })(i);
      }
      at(t += 700, function () { msg.textContent = "Restore finished \u2014 everything back in place."; });

      // ---- linger, then run it again ----
      at(t += 3000, function () { queue = []; loop(); });
    }
    loop();
  })();
