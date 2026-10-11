// Lesehilfe / Barrierefreiheit - Knopf unten links mit kleinem Menü
// Einstellungen bleiben im Browser gespeichert (localStorage), nichts geht an einen Server.
// Wird auf Analyse- und Startseite gleich eingebunden.
(function () {
  var SPEICHER = 'praxis-lesehilfe';
  var html = document.documentElement;
  var STUFEN = ['100 %', '112 %', '125 %', '137 %']; // Schriftgröße, 0 = normal
  var SCHALTER = [
    { key: 'kontrast', text: 'Hoher Kontrast' },
    { key: 'links', text: 'Links unterstreichen' },
    { key: 'abstand', text: 'Mehr Zeilen- und Zeichenabstand' },
    { key: 'ruhig', text: 'Animationen aus' }
  ];

  function laden() {
    try { return JSON.parse(localStorage.getItem(SPEICHER)) || {}; } catch (e) { return {}; }
  }
  function speichern(s) {
    try { localStorage.setItem(SPEICHER, JSON.stringify(s)); } catch (e) { /* privat-modus: dann eben nicht */ }
  }
  var stand = laden();

  // Klassen am <html> setzen (gleiche Logik steht kurz im <head>, damit nichts flackert)
  function anwenden() {
    for (var i = 1; i < STUFEN.length; i++) html.classList.toggle('a11y-schrift-' + i, stand.schrift === i);
    SCHALTER.forEach(function (s) { html.classList.toggle('a11y-' + s.key, !!stand[s.key]); });
  }

  var icon = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10.6" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="6.4" r="1.7" fill="currentColor"/><path d="M6.4 9.2l5.6 1.3 5.6-1.3M12 10.5v3.6M12 14.1l-2.7 5M12 14.1l2.7 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var knopf = document.createElement('button');
  knopf.type = 'button';
  knopf.className = 'a11y-knopf';
  knopf.setAttribute('aria-expanded', 'false');
  knopf.setAttribute('aria-controls', 'a11y-menue');
  knopf.innerHTML = icon + '<span class="a11y-knopf-text">Lesehilfe</span>';
  knopf.setAttribute('aria-label', 'Lesehilfe und Barrierefreiheit');

  var menue = document.createElement('div');
  menue.className = 'a11y-menue';
  menue.id = 'a11y-menue';
  menue.setAttribute('role', 'dialog');
  menue.setAttribute('aria-modal', 'false');
  menue.setAttribute('aria-labelledby', 'a11y-titel');
  menue.hidden = true;
  menue.innerHTML =
    '<div class="a11y-kopf"><h2 id="a11y-titel">Lesehilfe</h2>' +
    '<button type="button" class="a11y-zu" aria-label="Lesehilfe schließen">&times;</button></div>' +
    '<div class="a11y-gruppe" role="group" aria-labelledby="a11y-schrift-titel">' +
      '<p id="a11y-schrift-titel" class="a11y-label">Schriftgröße</p>' +
      '<div class="a11y-schrift">' +
        '<button type="button" data-schrift="-1" aria-label="Schrift kleiner">A&minus;</button>' +
        '<output class="a11y-wert" aria-live="polite"></output>' +
        '<button type="button" data-schrift="1" aria-label="Schrift größer">A+</button>' +
      '</div>' +
    '</div>' +
    SCHALTER.map(function (s) {
      return '<button type="button" class="a11y-schalter" data-key="' + s.key + '" aria-pressed="false">' +
        '<span class="a11y-haken" aria-hidden="true"></span>' + s.text + '</button>';
    }).join('') +
    '<button type="button" class="a11y-reset">Alles zurücksetzen</button>';

  document.body.appendChild(knopf);
  document.body.appendChild(menue);

  var wert = menue.querySelector('.a11y-wert');
  function anzeigen() {
    var st = stand.schrift || 0;
    wert.textContent = STUFEN[st];
    menue.querySelector('[data-schrift="-1"]').disabled = st === 0;
    menue.querySelector('[data-schrift="1"]').disabled = st === STUFEN.length - 1;
    menue.querySelectorAll('.a11y-schalter').forEach(function (b) {
      b.setAttribute('aria-pressed', stand[b.getAttribute('data-key')] ? 'true' : 'false');
    });
  }

  function oeffnen() {
    menue.hidden = false;
    knopf.setAttribute('aria-expanded', 'true');
    // Fokus auf das erste Bedienelement
    var erstes = menue.querySelector('button:not([disabled]):not(.a11y-zu)');
    if (erstes) erstes.focus();
  }
  function schliessen(fokusZurueck) {
    menue.hidden = true;
    knopf.setAttribute('aria-expanded', 'false');
    if (fokusZurueck) knopf.focus();
  }

  knopf.addEventListener('click', function () {
    if (menue.hidden) oeffnen(); else schliessen(false);
  });
  menue.querySelector('.a11y-zu').addEventListener('click', function () { schliessen(true); });

  menue.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    if (b.hasAttribute('data-schrift')) {
      var neu = (stand.schrift || 0) + parseInt(b.getAttribute('data-schrift'), 10);
      stand.schrift = Math.max(0, Math.min(STUFEN.length - 1, neu));
    } else if (b.classList.contains('a11y-schalter')) {
      var k = b.getAttribute('data-key');
      stand[k] = !stand[k];
    } else if (b.classList.contains('a11y-reset')) {
      stand = {};
    } else {
      return;
    }
    speichern(stand);
    anwenden();
    anzeigen();
  });

  // Esc schließt, Fokus zurück auf den Knopf
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menue.hidden) schliessen(true);
  });
  // Klick daneben schließt
  document.addEventListener('click', function (e) {
    if (!menue.hidden && !menue.contains(e.target) && !knopf.contains(e.target)) schliessen(false);
  });

  anwenden();
  anzeigen();
})();
