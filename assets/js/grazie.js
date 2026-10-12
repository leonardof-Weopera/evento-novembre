/* =========================================================================
   Pagina di ringraziamento: riepilogo della giornata scelta.
   Legge solo ?giorno=gio|ven|sab e ?persone=1-5 (nessun dato personale nell'indirizzo).
   ========================================================================= */
(function () {
  'use strict';

  // Sede dell'evento (sede Demo). Se dovesse cambiare, aggiornarla in tutti i punti elencati nel commento
  // della sezione "Come arrivare" di index.html: index.html (JSON-LD, indirizzo, link e mappa, footer),
  // grazie.html (riepilogo, card "Come arrivare", link), questa costante e i 3 file assets/ics/*.ics.
  var INDIRIZZO = 'Demo Srl, Via Degli Ulivi 8, 51019 Ponte Buggianese (PT)';

  var GIORNATE = {
    gio: { titolo: 'Giovedì 5 novembre 2026', orario: '10:00-18:00, orario continuato', date: '20261105T100000/20261105T180000' },
    ven: { titolo: 'Venerdì 6 novembre 2026', orario: '10:00-18:00, orario continuato', date: '20261106T100000/20261106T180000' },
    sab: { titolo: 'Sabato 7 novembre 2026', orario: '9:30-12:30, solo mattina', date: '20261107T093000/20261107T123000' }
  };

  var params = new URLSearchParams(window.location.search);
  var codice = params.get('giorno');
  var giornata = Object.prototype.hasOwnProperty.call(GIORNATE, codice) ? GIORNATE[codice] : null;
  var persone = parseInt(params.get('persone'), 10);

  function el(id) { return document.getElementById(id); }

  if (params.get('prova') === '1') el('banner-prova').hidden = false;
  if (params.get('conferma') === '1') el('msg-conferma').hidden = false;

  if (!giornata) return; // senza parametri validi resta il messaggio generico con tutte le date

  el('r-giorno').textContent = giornata.titolo;
  el('r-orario').textContent = giornata.orario;
  el('riepilogo').hidden = false;

  if (persone >= 1 && persone <= 5) {
    el('r-persone').textContent = persone === 1 ? '1 persona' : persone + ' persone';
    el('r-persone-riga').hidden = false;
  }

  // Calendario: resta solo la giornata scelta
  Array.prototype.forEach.call(document.querySelectorAll('#cal-list [data-giorno]'), function (voce) {
    voce.hidden = voce.getAttribute('data-giorno') !== codice;
  });

  var gcal = el('gcal');
  gcal.href = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent('Bianco digitale e grande formato – Demo Srl') +
    '&dates=' + giornata.date +
    '&ctz=Europe/Rome' +
    '&location=' + encodeURIComponent(INDIRIZZO) +
    '&details=' + encodeURIComponent('Dimostrazioni dal vivo Xerox e Mutoh per le Arti Grafiche. ' + giornata.titolo + ', ' + giornata.orario + '.');
  gcal.hidden = false;
})();
