(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* scroll reveal */
  var rv = [].slice.call(document.querySelectorAll("[data-r]"));
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
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

  /* Discord presence (Lanyard) */
  var colors = { online: "#23a559", idle: "#f0b232", dnd: "#f23f43", offline: "#8a8374" };
  var labels = { online: "Çevrimiçi", idle: "Boşta", dnd: "Rahatsız etmeyin", offline: "Çevrimdışı" };
  function setDot(id, c) { var d = $(id); if (d) d.style.background = c; }
  function lanyard() {
    fetch("https://api.lanyard.rest/v1/users/349640233651798027").then(function (r) { return r.json(); }).then(function (j) {
      var d = j.data; if (!d) return;
      var st = d.discord_status;
      setDot("ds-dot", colors[st] || colors.offline); $("ds-state").textContent = labels[st] || "";
      setDot("live-dot", colors[st] || colors.offline); $("live-txt").textContent = labels[st] || "Discord";
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
    }).catch(function () { $("ds-state-long").textContent = "Durum şu an okunamıyor."; $("ds-state").textContent = ""; $("live-txt").textContent = "Discord"; });
  }
  lanyard(); setInterval(lanyard, 15000);

  /* easter eggs (kept from the previous versions) */
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
        ov.innerHTML = '<div style="text-align:center;font-family:\'Bricolage Grotesque\',sans-serif;font-weight:800;color:#fff;font-size:clamp(34px,7vw,84px);line-height:1.1;letter-spacing:-.04em;user-select:none;pointer-events:none">To eternity<br><span style="color:#f0abfc">E\'</span></div>';
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
