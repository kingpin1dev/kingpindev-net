(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* header gets a paper backing once the page scrolls */
  var bar = $("top-bar");
  var onScroll = function () { bar.classList.toggle("solid", scrollY > 24); };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* live timecode (Turkey time, 25 fps like PAL) */
  var tc = $("tc");
  if (tc) {
    var fmt = new Intl.DateTimeFormat("tr-TR", { timeZone: "Europe/Istanbul", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var tick = function () { var d = new Date(); tc.textContent = "TRT " + fmt.format(d).replace(/^24/, "00") + ":" + pad(Math.floor(d.getMilliseconds() / 40)); };
    tick(); setInterval(tick, reduce ? 1000 : 40);
  }

  /* scroll reveal */
  var rv = [].slice.call(document.querySelectorAll("[data-r]"));
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add("in"); });

  /* current section in the nav */
  var links = [].slice.call(document.querySelectorAll(".top nav a"));
  if ("IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { if (a.getAttribute("href") === "#" + e.target.id) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function (a) { var s = document.querySelector(a.getAttribute("href")); if (s) so.observe(s); });
  }

  /* work index: the app icon follows the pointer */
  var peek = $("peek");
  if (peek && matchMedia("(hover:hover) and (min-width:900px)").matches && !reduce) {
    var img = peek.querySelector("img"), x = 0, y = 0, cx = 0, cy = 0, raf = 0, on = false;
    var loop = function () {
      cx += (x - cx) * 0.16; cy += (y - cy) * 0.16;
      peek.style.transform = "translate3d(" + (cx + 28) + "px," + (cy - 70) + "px,0) scale(" + (on ? 1 : 0.86) + ")";
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 || on ? requestAnimationFrame(loop) : 0;
    };
    var go = function () { if (!raf) raf = requestAnimationFrame(loop); };
    document.querySelectorAll(".row").forEach(function (r) {
      var ic = r.querySelector(".r-ic");
      r.addEventListener("pointerenter", function (e) { x = cx = e.clientX; y = cy = e.clientY; if (ic) img.src = ic.getAttribute("src"); on = true; peek.classList.add("on"); go(); });
      r.addEventListener("pointermove", function (e) { x = e.clientX; y = e.clientY; go(); });
      r.addEventListener("pointerleave", function () { on = false; peek.classList.remove("on"); });
    });
  }

  /* Discord presence (Lanyard) */
  var colors = { online: "#23a559", idle: "#f0b232", dnd: "#f23f43", offline: "#8a8374" };
  var labels = { online: "Çevrimiçi", idle: "Boşta", dnd: "Rahatsız etmeyin", offline: "Çevrimdışı" };
  function setDot(id, c) { var d = $(id); if (d) d.style.background = c; }
  function lanyard() {
    fetch("https://api.lanyard.rest/v1/users/349640233651798027").then(function (r) { return r.json(); }).then(function (j) {
      var d = j.data; if (!d) return;
      var st = d.discord_status;
      setDot("ds-dot", colors[st] || colors.offline); $("ds-state").textContent = labels[st] || "";
      var game = (d.activities || []).filter(function (a) { return a.type === 0; })[0];
      $("ds-state-long").textContent = st === "offline" ? "Şu an çevrimdışı." : "Discord'da " + (labels[st] || "").toLocaleLowerCase("tr-TR") + ".";
      $("ds-game").hidden = !game; if (game) $("ds-game-name").textContent = game.name;
      var sp = d.spotify;
      $("sp-idle").hidden = !!sp; $("sp-playing").hidden = !sp; setDot("sp-dot", sp ? "#1db954" : colors.offline); $("sp-state").textContent = sp ? "Çalıyor" : "Boşta";
      if (sp) {
        $("sp-art").src = sp.album_art_url; $("sp-title").textContent = sp.song; $("sp-artist").textContent = sp.artist;
        var pct = (Date.now() - sp.timestamps.start) / (sp.timestamps.end - sp.timestamps.start) * 100;
        $("sp-bar").style.width = Math.max(0, Math.min(pct, 100)).toFixed(1) + "%";
      }
      var vc = (d.activities || []).filter(function (a) { return a.name && a.name.indexOf("Visual Studio Code") > -1; })[0];
      $("vc-idle").hidden = !!vc; $("vc-active").hidden = !vc; setDot("vc-dot", vc ? "#2b8be0" : colors.offline); $("vc-state").textContent = vc ? "Düzenliyor" : "Kapalı";
      if (vc) { $("vc-file").textContent = vc.details || "Bilinmeyen dosya"; $("vc-proj").textContent = vc.state || ""; }
    }).catch(function () { $("ds-state-long").textContent = "Durum şu an okunamıyor."; $("ds-state").textContent = ""; });
  }
  lanyard(); setInterval(lanyard, 15000);

  /* easter eggs (kept from the previous version) */
  (function () {
    var b1 = "", b2 = "";
    document.addEventListener("keydown", function (e) {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      var k = e.key;
      b1 = (b1 + k.toLowerCase()).slice(-11); b2 = (b2 + k).slice(-8);
      if (b1 === "eriswashere") {
        b1 = "";
        var o = document.createElement("div");
        o.style.cssText = "position:fixed;inset:0;background:#fff;z-index:99999;opacity:1;pointer-events:none";
        document.body.appendChild(o);
        setTimeout(function () { o.style.transition = "opacity 1s ease"; o.style.opacity = "0"; setTimeout(function () { o.remove(); }, 1000); }, 4000);
      }
      if (b2 === "04012025") {
        b2 = "";
        if ($("ee2")) return;
        var ov = document.createElement("div"); ov.id = "ee2";
        ov.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:99999;display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden";
        ov.innerHTML = '<div style="text-align:center;font-family:\'Instrument Serif\',serif;color:#fff;font-size:clamp(34px,7vw,84px);line-height:1.15;user-select:none;pointer-events:none">To eternity<br><em style="color:#f0abfc">E\'</em></div>';
        var hh = ["❤️", "💜", "🤍", "💗", "💖", "💝", "🩷"];
        var st = document.createElement("style"); st.textContent = "@keyframes floatHeart2{0%{transform:translateY(0) rotate(0);opacity:0}15%{opacity:1}100%{transform:translateY(-110vh) rotate(24deg);opacity:0}}"; ov.appendChild(st);
        for (var i = 0; i < 24; i++) {
          var h = document.createElement("span"); h.textContent = hh[i % hh.length];
          h.style.cssText = "position:fixed;font-size:" + (16 + Math.random() * 28) + "px;left:" + Math.random() * 100 + "vw;bottom:-60px;animation:floatHeart2 " + (2.5 + Math.random() * 2.5) + "s ease-in " + Math.random() * 4 + "s infinite;pointer-events:none;z-index:100000";
          ov.appendChild(h);
        }
        document.body.appendChild(ov);
        var escH = function (ev) { if (ev.key === "Escape") dismiss(); };
        var dismiss = function () { var el = $("ee2"); if (el) el.remove(); document.removeEventListener("keydown", escH); };
        document.addEventListener("keydown", escH); ov.addEventListener("click", dismiss); setTimeout(dismiss, 7000);
      }
    });
  })();
})();
