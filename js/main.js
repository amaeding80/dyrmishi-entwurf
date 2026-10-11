// Kontaktdaten - hier ändern, gilt für alle Buttons auf der Seite
var KONTAKT_MAIL = 'anfrage@praxisecht.de';
var WHATSAPP_NR = '4917643433973';
var WA_TEXT = 'Hallo Herr Mäding, ich habe mir Ihre Analyse zu meiner Praxis-Website angesehen und hätte gern mehr Informationen.';
var MAIL_BETREFF = 'Website-Analyse Praxis Dr. Dyrmishi';

(function () {
  var mailHref = 'mailto:' + KONTAKT_MAIL + '?subject=' + encodeURIComponent(MAIL_BETREFF);
  var waHref = 'https://wa.me/' + WHATSAPP_NR + '?text=' + encodeURIComponent(WA_TEXT);

  document.querySelectorAll('.js-mail').forEach(function (a) {
    a.href = mailHref;
  });
  document.querySelectorAll('.js-mail-text').forEach(function (a) {
    a.textContent = KONTAKT_MAIL;
  });
  document.querySelectorAll('.js-wa').forEach(function (a) {
    a.href = waHref;
    a.target = '_blank';
    a.rel = 'noopener';
  });
})();

// heutigen Tag in den Sprechzeiten markieren (Sa/So nichts)
(function () {
  var tag = new Date().getDay(); // 0 = Sonntag
  document.querySelectorAll('.js-zeiten tr[data-tag="' + tag + '"]').forEach(function (tr) {
    tr.classList.add('heute');
    tr.firstElementChild.setAttribute('title', 'heute');
  });
})();

// Buttons im Beispiel sind nur Attrappen
(function () {
  var hinweis = document.getElementById('demo-hinweis');
  var texte = {
    termin: 'Nur Vorschau: Hier käme man zur Online-Terminbuchung.',
    zeiten: 'Nur Vorschau: Hier käme man zu allen Sprechzeiten und zum Notdienst.',
    neu: 'Nur Vorschau: Hier käme man zu den Infos für neue Patienten.',
    menu: 'Nur Vorschau: Hier würde sich das Menü öffnen.'
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

  // sticky Buttons erst nach dem Intro zeigen, beim Kontakt-Bereich wieder weg
  var sticky = document.getElementById('sticky');
  var intro = document.getElementById('start');
  var kontakt = document.getElementById('kontakt');
  if (sticky && kontakt) {
    var introSicht = true, kontaktSicht = false;
    var update = function () { sticky.classList.toggle('weg', introSicht || kontaktSicht); };
    update();
    if (intro) {
      new IntersectionObserver(function (e) { introSicht = e[0].isIntersecting; update(); }, { threshold: 0 }).observe(intro);
    } else { introSicht = false; }
    new IntersectionObserver(function (e) { kontaktSicht = e[0].isIntersecting; update(); }, { threshold: 0.15 }).observe(kontakt);
  }
})();
