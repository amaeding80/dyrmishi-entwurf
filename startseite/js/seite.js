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
  // Notruf-Links (116 117, 112): am Computer nur Hinweis, auf dem Handy echt anrufen lassen
  if (!window.matchMedia('(pointer: coarse)').matches) {
    document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        hinweis.textContent = 'Auf dem Handy würde hier direkt angerufen.';
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

// Online-Termin (Beispiel): nächste 5 Sprechtage, freie Zeiten aus den Sprechzeiten, nichts wird gebucht
(function () {
  var form = document.getElementById('buchung');
  if (!form) return;
  var tageBox = form.querySelector('.js-tage');
  var slotsBox = form.querySelector('.js-slots');
  var slotsTag = form.querySelector('.js-slots-tag');
  var hinweis = document.getElementById('buchung-hinweis');
  var KURZ = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  var LANG = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  // Sprechzeiten wie oben, in Minuten [von, bis]
  var ZEITEN = { 1: [[480, 720], [840, 1080]], 2: [[480, 780]], 3: [[480, 720]], 4: [[480, 720], [780, 1020]], 5: [[480, 720]] };
  // Beispiel-Zeiten - absichtlich nicht alle, damit es nach "fast voll" aussieht
  var MUSTER = [495, 540, 585, 630, 675, 810, 870, 915, 960, 1035];

  function zweistellig(n) { return (n < 10 ? '0' : '') + n; }
  function uhr(min) { return zweistellig(Math.floor(min / 60)) + ':' + zweistellig(min % 60); }

  // nächste 5 Tage mit Sprechzeiten, ab morgen
  var tage = [];
  var d = new Date();
  while (tage.length < 5) {
    d.setDate(d.getDate() + 1);
    if (ZEITEN[d.getDay()]) tage.push(new Date(d));
  }
  tage.forEach(function (t, i) {
    var datum = zweistellig(t.getDate()) + '.' + zweistellig(t.getMonth() + 1) + '.';
    var label = document.createElement('label');
    label.className = 'tag';
    label.innerHTML = '<input type="radio" name="tag" value="' + i + '"' + (i === 0 ? ' checked' : '') + '>' +
      '<span>' + KURZ[t.getDay()] + '<small>' + datum + '</small></span>';
    label.querySelector('input').setAttribute('aria-label', LANG[t.getDay()] + ', ' + datum);
    tageBox.appendChild(label);
  });

  function slotsZeigen(i) {
    var t = tage[i];
    slotsTag.textContent = 'am ' + LANG[t.getDay()];
    slotsBox.innerHTML = '';
    MUSTER.forEach(function (m) {
      var frei = ZEITEN[t.getDay()].some(function (z) { return m >= z[0] && m + 15 <= z[1]; });
      if (!frei) return;
      var label = document.createElement('label');
      label.className = 'slot';
      label.innerHTML = '<input type="radio" name="zeit" value="' + uhr(m) + '"><span>' + uhr(m) + '</span>';
      slotsBox.appendChild(label);
    });
  }
  slotsZeigen(0);
  tageBox.addEventListener('change', function (e) { slotsZeigen(+e.target.value); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var grund = form.querySelector('input[name="grund"]:checked');
    var tag = form.querySelector('input[name="tag"]:checked');
    var zeit = form.querySelector('input[name="zeit"]:checked');
    hinweis.classList.add('an');
    if (!grund || !zeit) {
      hinweis.textContent = 'Bitte wählen Sie noch ' + (!grund ? 'den Grund' + (!zeit ? ' und ' : '') : '') + (!zeit ? 'eine Uhrzeit' : '') + '.';
      return;
    }
    var t = tage[+tag.value];
    hinweis.textContent = 'Beispiel – es wurde nichts gebucht. So sähe es aus: ' + grund.value + ' am ' + LANG[t.getDay()] + ', ' +
      t.getDate() + '.' + (t.getMonth() + 1) + '., um ' + zeit.value + ' Uhr. Sie bekämen sofort eine Bestätigung und am Vortag eine Erinnerung per E-Mail oder SMS. Absagen oder verschieben ginge über den Link darin.';
  });
})();
