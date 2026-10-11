// Startseite Entwurf Dyrmishi

// Menü auf/zu
(function () {
  var btn = document.querySelector('.burger');
  var menue = document.getElementById('hauptmenue');
  if (!btn || !menue) return;
  btn.addEventListener('click', function () {
    var auf = menue.classList.toggle('offen');
    btn.setAttribute('aria-expanded', auf ? 'true' : 'false');
  });
  // nach Klick auf einen Punkt wieder zu
  menue.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      menue.classList.remove('offen');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

// heutigen Tag in den Sprechzeiten markieren + Zeile "Heute" für die Handy-Karte
(function () {
  var tag = new Date().getDay(); // 0 = Sonntag
  var namen = ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'];
  document.querySelectorAll('.js-zeiten tr[data-tag="' + tag + '"]').forEach(function (tr) {
    tr.classList.add('heute');
  });
  var zeile = document.querySelector('.js-heute');
  if (!zeile) return;
  var tr = document.querySelector('.karte-tabelle tr[data-tag="' + tag + '"]');
  if (tr) {
    zeile.textContent = 'Heute (' + namen[tag] + '): ' + tr.lastElementChild.textContent;
  } else {
    // Wochenende: nächster Termin ist Montag
    var mo = document.querySelector('.karte-tabelle tr[data-tag="1"] td');
    zeile.textContent = 'Heute geschlossen. Montag ab ' + mo.textContent.slice(0, 5) + ' Uhr';
  }
  zeile.hidden = false;
})();

// Attrappen - auf der Vorschau passiert nichts Echtes
(function () {
  var hinweis = document.getElementById('hinweis');
  var texte = {
    route: 'Nur Vorschau: Hier würde sich die Route in Ihrer Karten-App öffnen.',
    anamnese: 'Beispiel: Hier käme der Anamnesebogen zum Ausfüllen am Handy oder Computer.',
    rezept: 'Beispiel: Hier käme das Formular für Folgerezepte und Überweisungen.',
    download: 'Beispiel: Hier läge das Dokument der Praxis als PDF.',
    mail: 'Nur Vorschau: Hier würde sich Ihr E-Mail-Programm öffnen.',
    recht: 'Nur Vorschau: Hier käme Ihr Impressum bzw. die Datenschutzerklärung.'
  };
  var timer;
  function zeigen(el) {
    if (!hinweis) return;
    hinweis.textContent = texte[el.getAttribute('data-demo')] || 'Nur Vorschau.';
    hinweis.classList.add('an');
    clearTimeout(timer);
    timer = setTimeout(function () { hinweis.classList.remove('an'); }, 3500);
  }
  document.querySelectorAll('[data-demo]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      zeigen(el);
    });
  });
  // Telefon-Links: am Computer nur Hinweis, auf dem Handy echt anrufen lassen
  if (!window.matchMedia('(pointer: coarse)').matches) {
    document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        hinweis.textContent = 'Nur Vorschau: Auf dem Handy würde hier direkt angerufen.';
        hinweis.classList.add('an');
        clearTimeout(timer);
        timer = setTimeout(function () { hinweis.classList.remove('an'); }, 3500);
      });
    });
  }
})();

// Einblenden beim Scrollen
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('sichtbar'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('sichtbar');
        io.unobserve(en.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach(function (el) { io.observe(el); });
})();

// Handy-Leiste erst zeigen, wenn die Buttons im Hero weggescrollt sind (sonst doppelt)
(function () {
  var leiste = document.querySelector('.handy-leiste');
  var btns = document.querySelector('.hero-btns');
  if (!leiste || !btns || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(function (e) {
    leiste.classList.toggle('weg', e[0].isIntersecting);
  }, { threshold: 0 }).observe(btns);
})();

// Terminanfrage ist nur ein Beispiel - nichts verschicken, freundlicher Hinweis
(function () {
  var form = document.getElementById('terminanfrage');
  if (!form) return;
  var hinweis = document.getElementById('termin-hinweis');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    hinweis.textContent = 'Danke! Das ist nur ein Beispiel, es wurde nichts gesendet. Später stünde hier, wann sich die Praxis meldet.';
    hinweis.classList.add('an');
  });
})();
