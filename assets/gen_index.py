"""Builds ../index.html (static, no framework). Run: python assets/gen_index.py  (keeps the tile data in one place)."""
import math, os, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARROW = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8"/></svg>'
ARROW_S = '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 10.5l7-7M4.5 3.5h6v6"/></svg>'


def burst(n=14, r1=47, r2=38):
    pts = []
    for i in range(n * 2):
        r = r1 if i % 2 == 0 else r2
        a = math.pi * i / n
        pts.append("%.1f,%.1f" % (50 + r * math.cos(a), 50 + r * math.sin(a)))
    return " ".join(pts)


# name, small, desc, kind, colour, icon, url, class
TILES = [
    ("Notchify", "", "Ekranın üstüne Dinamik Ada ekleyen masaüstü uygulaması: müzik, bildirimler, pano geçmişi ve widget'lar.", "Windows", "#c9b6ff", "notchify.png", "https://notchify.app", "xl"),
    ("Mixora", "eski adıyla Fluent Mixer", "Uygulama seslerini Oyun, Sohbet, Medya ve Aux gruplarına ayıran ses mikseri.", "Windows", "#ffb86b", "FluentMixer.png", "https://mixora.kingpindev.com", "l"),
    ("LunaDock", "", "Masaüstündeki dosya ve kısayolları düzenli yığınlara ayıran düzenleyici.", "Windows", "#8fd8ff", "lunadock.png", "https://lunadock.kingpindev.com", "l"),
    ("Hotpad", "", "İkinci bir klavyeyi makro klavyeye çevirir.", "Windows", "#ffe14d", "Hotpad.png", "https://hotpad.kingpindev.com", ""),
    ("SpotiDrop", "", "Müziği etiketli MP3 olarak Spotify Yerel Dosyalar'a indirir.", "Windows", "#5cf09a", "SpotiDrop.png", "https://spotidrop.kingpindev.com", ""),
    ("Aurora Radios", "", "Ruh haline, türe ya da ülkeye göre dünya radyoları.", "Windows", "#ff9fd0", "Aurora.png", "https://aurora.kingpindev.com", ""),
    ("VICE Sonar", "", "SteelSeries GG Sonar için hafif kontrol aracı: ses, ChatMix, EQ ve RGB.", "Windows", "#86a9ff", "vice-sonar.png", "https://vicesonar.kingpindev.com", "w"),
    ("GlideSnap", "", "Alt tuşuyla pencereleri farenin her yerinden sürükleyip boyutlandırın.", "Windows", "#c4ff55", "GlideSnap.png", "https://glidesnap.kingpindev.com", "w"),
    ("vOrganizer", "", "Dağınık klasörleri dosya türüne göre ayıran, tek tıkla geri alınabilen düzenleyici.", "Windows", "#ff9066", "Vorganizer.png", "https://vorganizer.kingpindev.com", ""),
    ("BokMail", "", "Kişisel adresinizi vermeden kullandığınız geçici e-posta servisi.", "Web", "#fff0b8", "BokMail.png", "https://bokmails.com", ""),
    ("Goliath", "", "Moderasyon, seviye, müzik ve yardım paneliyle çok amaçlı Discord botu.", "Discord botu", "#a6adff", "Goliath.png", "https://goliath.kingpindev.com", ""),
    ("Lolable", "", "League of Legends toplulukları için rank, maç dökümü ve liderlik tablosu botu.", "Discord botu", "#ff7d7d", "Lolable.png", "https://lolable.kingpindev.com", "w"),
]

STORE = "https://apps.microsoft.com/search/publisher?name=Kingpindev&hl=tr-TR&gl=TR"


def tile(i, t):
    name, small, desc, kind, col, icon, url, cls = t
    sm = "<small>%s</small>" % html.escape(small) if small else ""
    return ('<li class="tile %s" data-r style="--i:%d;--bg:%s"><a href="%s" target="_blank" rel="noopener">'
            '<span class="pill" lang="en">%s</span><span class="go">%s</span>'
            '<img class="ic" src="img/%s" alt="" width="92" height="92" loading="lazy">'
            '<h3>%s%s</h3><p>%s</p></a></li>') % (cls, i % 4, col, url, kind, ARROW, icon, html.escape(name), sm, html.escape(desc))


tiles = "\n    ".join(tile(i, t) for i, t in enumerate(TILES))
store_tile = ('<li class="tile store w" data-r><a href="%s" target="_blank" rel="noopener"><span class="pill" lang="en">Microsoft Store</span><span class="go">%s</span>'
              '<h3>Hepsi Store profilimde</h3><p>Hotpad ve SpotiDrop Store\'da değil; kendi sitelerinden indirilir.</p></a></li>') % (STORE, ARROW)

IG = [("DF5Ur9UN0nn", "ig1", "8,6B", 105), ("DD2znKCtNWy", "ig2", "397", 4), ("C9r4GdPtqMD", "ig3", "476", 26), ("C7jI_oftVvz", "ig4", "91,8B", 457), ("C5vgkL8M14j", "ig5", "72,4B", 297), ("C22EVl5sPN_", "ig6", "5,5B", 58)]
shots = "\n    ".join(
    '<a class="shot" data-r style="--i:%d" href="https://www.instagram.com/p/%s/" target="_blank" rel="noopener"><img src="img/%s.jpg" alt="SineOrbit paylaşımı, kare %d" width="640" height="640" loading="lazy"><span class="meta"><span>%s beğeni</span><span>%d yorum</span></span></a>'
    % (i % 3, code, img, i + 1, likes, com) for i, (code, img, likes, com) in enumerate(IG))

TOOLS = ["JavaScript", "Python", "C# / .NET", "HTML / CSS", "Tailwind CSS", "Premiere Pro", "After Effects", "Figma"]
tick = "".join("<span>%s</span>" % t for t in TOOLS)

SOC = [("GitHub", "https://github.com/kingpin1dev"), ("Discord", "https://discord.com/users/kingpin1dev"), ("Instagram", "https://www.instagram.com/burakpekeel/"), ("SineOrbit", "https://www.instagram.com/sineorbit/"),
       ("Spotify", "https://open.spotify.com/intl-tr/artist/7tqKllQw5Qmb8W2rxxBykt?si=5235320fb4d34e84")]
reach = "\n    ".join('<li><a href="%s" target="_blank" rel="noopener">%s %s</a></li>' % (u, n, ARROW_S) for n, u in SOC)

SP = [("Windows 11 Pro", "İşletim sistemi"), ("AMD Ryzen 5 5600X", "İşlemci"), ("NVIDIA RTX 3060", "Ekran kartı"), ("16 GB DDR4 3200 MHz", "Bellek"), ("2560 × 1440 · 144 Hz", "Ekran"), ("1 TB NVMe SSD", "Depolama"), ("VS Code", "Editör"), ("PowerShell 7", "Kabuk")]
spec = "\n      ".join('<div><dt>%s</dt><dd>%s</dd></div>' % (k, v) for v, k in SP)

PAGE = open(os.path.join(ROOT, "assets", "index.tpl.html"), encoding="utf-8").read()
for k, v in (("%%TILES%%", tiles + "\n    " + store_tile), ("%%SHOTS%%", shots), ("%%TICK%%", tick + tick + tick + tick), ("%%REACH%%", reach), ("%%SPEC%%", spec), ("%%BURST%%", burst())):
    PAGE = PAGE.replace(k, v)
open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8").write(PAGE)
print("index.html", len(PAGE))
