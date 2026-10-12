/* =========================================================================
   Landing "Bianco digitale e grande formato" – Demo Srl
   JavaScript senza librerie.
   ========================================================================= */
(function () {
  'use strict';

  /* =======================================================================
     CONFIGURAZIONE DEL MODULO – l'unico punto da modificare
     ======================================================================= */
  var FORM_CONFIG = {
    // [SERVIZIO DI INVIO DA DECIDERE – es. Brevo (modulo ospitato), Netlify Forms o una funzione serverless]
    // Indirizzo a cui inviare i dati. NON inserire mai chiavi API segrete: questo file è pubblico.
    // NIENTE reCAPTCHA: imporrebbe il banner cookie.
    endpoint: null,

    // Come inviare i dati: 'urlencoded' (modulo classico) oppure 'json'.
    formato: 'urlencoded',

    // Nomi dei campi richiesti dal servizio, es. { email: 'EMAIL', nome_cognome: 'NOME' }.
    // I campi non elencati mantengono il nome standard.
    mappaCampi: {},

    // true solo quando il servizio invia davvero l'email di conferma al partecipante.
    emailConferma: false,

    // Giornate esaurite, es. ['sab'] chiude il sabato.
    giorniEsauriti: [],

    // Dopo questa data e ora il modulo viene sostituito da "L'evento si è concluso".
    chiusura: '2026-11-07T12:30:00+01:00',

    // Riserva usata ONLINE finché non c'è un servizio: si apre un'email già compilata verso questo indirizzo
    emailRiserva: 'info@demo.it',
    telefono: '0572 32000',

    paginaGrazie: 'grazie.html'
  };

  // fine: dopo questa ora la giornata non si può più scegliere ("Giornata conclusa")
  var GIORNATE = {
    gio: { nome: 'giovedì', etichetta: 'Giovedì 5 novembre', orario: '10:00-18:00, orario continuato', fine: '2026-11-05T18:00:00+01:00' },
    ven: { nome: 'venerdì', etichetta: 'Venerdì 6 novembre', orario: '10:00-18:00, orario continuato', fine: '2026-11-06T18:00:00+01:00' },
    sab: { nome: 'sabato', etichetta: 'Sabato 7 novembre', orario: '9:30-12:30, solo mattina', fine: '2026-11-07T12:30:00+01:00' }
  };

  var CAMPI_UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];

  /* ----------------------------------------------------------------------- */

  var params = new URLSearchParams(window.location.search);
  var riduciMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Modalità del modulo:
  // - 'servizio': c'è un endpoint, i dati vengono inviati davvero;
  // - 'prova':    sul computer locale (o con ?test=1) si simula l'invio e si va a grazie.html;
  // - 'email':    online senza servizio, si apre un'email già compilata (mai una finta conferma).
  var inLocale = window.location.protocol === 'file:' ||
    /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(window.location.hostname);
  var modalita = FORM_CONFIG.endpoint ? 'servizio'
    : (inLocale || params.get('test') === '1') ? 'prova'
    : 'email';

  var eventoChiuso = Date.now() > Date.parse(FORM_CONFIG.chiusura);

  // Giornate non più selezionabili: esaurite (FORM_CONFIG) o già passate
  var giorniChiusi = {};
  Object.keys(GIORNATE).forEach(function (codice) {
    if (FORM_CONFIG.giorniEsauriti.indexOf(codice) !== -1) giorniChiusi[codice] = 'Posti esauriti';
    else if (Date.now() > Date.parse(GIORNATE[codice].fine)) giorniChiusi[codice] = 'Giornata conclusa';
  });
  var tuttoChiuso = Object.keys(giorniChiusi).length === Object.keys(GIORNATE).length;

  // Evento concluso: spariscono i pulsanti che portano al modulo (vedi .evento-chiuso nel CSS)
  if (eventoChiuso) document.documentElement.classList.add('evento-chiuso');

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- Header: bordo quando si scorre ---------- */
  function initHeader() {
    var header = $('#site-header');
    if (!header) return;
    var aggiorna = function () { header.classList.toggle('is-scrolled', window.scrollY > 4); };
    window.addEventListener('scroll', aggiorna, { passive: true });
    aggiorna();
  }

  /* ---------- Menu a link: evidenzia la sezione visibile ---------- */
  function initNav() {
    var nav = $('#site-nav');
    if (!nav || !('IntersectionObserver' in window)) return;
    var links = $$('.site-nav__link', nav);
    var perId = {};
    links.forEach(function (l) { perId[l.getAttribute('href').slice(1)] = l; });

    var osservate = ['inizio'].concat(Object.keys(perId))
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    var attivo = null;
    function imposta(id) {
      if (id === attivo) return;
      attivo = id;
      links.forEach(function (l) { l.removeAttribute('aria-current'); });
      var link = perId[id];
      if (!link) return;
      link.setAttribute('aria-current', 'true');
      // Su telefono la striscia scorre in orizzontale: porta in vista la pillola attiva
      var n = nav.getBoundingClientRect();
      var r = link.getBoundingClientRect();
      if (r.left < n.left || r.right > n.right) {
        nav.scrollTo({ left: nav.scrollLeft + (r.left - n.left) - 12, behavior: riduciMovimento ? 'auto' : 'smooth' });
      }
    }

    var io = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) { if (v.isIntersecting) imposta(v.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    osservate.forEach(function (s) { io.observe(s); });
  }

  /* ---------- Barra fissa su telefono ---------- */
  function initBarraFissa() {
    var barra = $('#sticky-cta');
    var heroCta = $('#hero-cta');
    var iscrizione = $('#iscrizione');
    // Evento concluso: la barra resta nascosta (CSS .evento-chiuso), niente osservatori
    if (!barra || !heroCta || !iscrizione || eventoChiuso) return;

    var stato = { hero: true, iscrizione: false, tastiera: false };

    function aggiorna() {
      var mostra = !stato.hero && !stato.iscrizione && !stato.tastiera;
      barra.classList.toggle('is-visible', mostra);
      // Quando è nascosta non deve essere raggiungibile con Tab né letta
      if (mostra) {
        barra.removeAttribute('inert');
        barra.removeAttribute('aria-hidden');
      } else {
        barra.setAttribute('inert', '');
        barra.setAttribute('aria-hidden', 'true');
      }
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (v) {
        stato.hero = v[0].isIntersecting;
        aggiorna();
      }).observe(heroCta);
      new IntersectionObserver(function (v) {
        stato.iscrizione = v[0].isIntersecting;
        aggiorna();
      }, { rootMargin: '0px 0px -15% 0px' }).observe(iscrizione);
    } else {
      stato.hero = false;
    }

    // Tastiera aperta (campo attivo o viewport ridotto): la barra si toglie di mezzo
    function campoDiTesto(el) {
      return el && el.matches && el.matches('input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]), textarea, select');
    }
    document.addEventListener('focusin', function (e) {
      if (campoDiTesto(e.target)) { stato.tastiera = true; aggiorna(); }
    });
    document.addEventListener('focusout', function () {
      setTimeout(function () {
        stato.tastiera = campoDiTesto(document.activeElement);
        aggiorna();
      }, 60);
    });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', function () {
        var ridotto = window.innerHeight - window.visualViewport.height > 150;
        if (ridotto !== stato.tastiera) { stato.tastiera = ridotto || campoDiTesto(document.activeElement); aggiorna(); }
      });
    }

    aggiorna();
  }

  /* ---------- Mappa caricata solo al clic ---------- */
  function initMappa() {
    var box = $('#mappa');
    var pulsante = $('#carica-mappa');
    if (!box || !pulsante) return;
    pulsante.hidden = false;
    pulsante.addEventListener('click', function () {
      var indirizzo = box.getAttribute('data-indirizzo') || '';
      var frame = document.createElement('iframe');
      frame.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(indirizzo) + '&z=15&output=embed';
      frame.title = 'Mappa: Demo Srl, Ponte Buggianese';
      frame.loading = 'lazy';
      frame.referrerPolicy = 'strict-origin-when-cross-origin'; // a Google solo il dominio, non UTM e parametri
      frame.setAttribute('allowfullscreen', '');
      box.textContent = '';
      box.appendChild(frame);
      frame.focus();
    });
  }

  /* ---------- Giornate: preselezione, posti esauriti e giornate concluse ---------- */
  function radioGiornata(codice) {
    return $('#form-iscrizione input[name="giornata"][value="' + codice + '"]');
  }

  function selezionaGiornata(codice, conFocus) {
    var radio = radioGiornata(codice);
    if (!radio || radio.disabled) return;
    radio.checked = true;
    radio.dispatchEvent(new Event('change', { bubbles: true }));
    if (conFocus) {
      // Dopo lo scorrimento verso il modulo, il focus va sulla giornata scelta
      setTimeout(function () { radio.focus({ preventScroll: true }); }, riduciMovimento ? 0 : 500);
    }
  }

  function initGiornate() {
    // Va eseguita prima della preselezione da ?giorno, così una giornata chiusa non viene scelta
    Object.keys(giorniChiusi).forEach(function (codice) {
      var motivo = giorniChiusi[codice];
      var radio = radioGiornata(codice);
      if (radio) {
        radio.disabled = true;
        var nota = document.createElement('span');
        nota.className = 'choice-card__esaurito';
        nota.textContent = motivo;
        radio.nextElementSibling.appendChild(nota);
      }
      var card = $('.day[data-giorno="' + codice + '"]');
      var bottone = card && $('[data-scegli-giorno]', card);
      if (bottone) {
        var etichetta = document.createElement('p');
        etichetta.className = 'day__esaurito';
        etichetta.textContent = motivo;
        bottone.replaceWith(etichetta);
      }
    });

    $$('[data-scegli-giorno]').forEach(function (link) {
      link.addEventListener('click', function () {
        selezionaGiornata(link.getAttribute('data-scegli-giorno'), true);
      });
    });

    // Link dalle email, es. ?giorno=sab
    var dalLink = params.get('giorno');
    if (dalLink && GIORNATE[dalLink]) selezionaGiornata(dalLink, false);
  }

  /* ---------- Modulo di iscrizione ---------- */
  function initModulo() {
    var form = $('#form-iscrizione');
    if (!form) return;

    // JavaScript funziona: via il messaggio di riserva con i contatti
    var riserva = $('#form-riserva');
    if (riserva) riserva.hidden = true;

    if (eventoChiuso) {
      $('#form-chiuso').hidden = false;
      return;
    }
    if (tuttoChiuso) {
      $('#form-esaurito').hidden = false;
      return;
    }

    form.hidden = false;
    form.setAttribute('novalidate', '');
    if (modalita === 'email') $('#nota-email').hidden = false;
    if (FORM_CONFIG.emailConferma) $$('[data-se-conferma]').forEach(function (el) { el.hidden = false; });

    var riepilogo = $('#form-riepilogo');
    var statoEl = $('#form-stato');
    var pulsante = $('#invia');
    var testoPulsante = pulsante.textContent;
    var tentato = false;
    var inInvio = false;
    var inviato = false;
    var avvio = Date.now(); // per il controllo anti-spam sul tempo minimo di compilazione

    compilaUtm(form);

    // Sulla tastiera del telefono il tasto "Avanti" passa al campo successivo:
    // il modulo parte solo dal pulsante, non con Invio a metà compilazione
    form.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || e.isComposing || !e.target.matches('input.input')) return;
      e.preventDefault();
      var campi = $$('input.input, textarea.input', form);
      var successivo = campi[campi.indexOf(e.target) + 1];
      if (successivo) successivo.focus();
    });

    function valore(nome) {
      var campo = form.elements[nome];
      return campo && typeof campo.value === 'string' ? campo.value.trim() : '';
    }
    function spuntato(nome) {
      return !!form.querySelector('input[name="' + nome + '"]:checked');
    }

    var regole = {
      giornata: function () {
        return spuntato('giornata') ? '' : 'Scegli una giornata.';
      },
      partecipanti: function () {
        var scelto = form.querySelector('input[name="partecipanti"]:checked');
        var n = scelto ? parseInt(scelto.value, 10) : 0;
        return n >= 1 && n <= 5 ? '' : 'Indica quante persone partecipano (da 1 a 5).';
      },
      nome_cognome: function () {
        return valore('nome_cognome').length >= 3 ? '' : 'Scrivi nome e cognome.';
      },
      azienda: function () {
        return valore('azienda').length >= 2 ? '' : 'Scrivi il nome dell\'azienda.';
      },
      email: function () {
        var v = valore('email');
        if (!v) return 'Scrivi la tua email.';
        // la regola esclude "nome@localhost", il controllo del browser esclude virgole, < > e simili
        var ok = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(v) && !form.elements.email.validity.typeMismatch;
        return ok ? '' : 'Controlla l\'email: scrivila nel formato nome@azienda.it.';
      },
      telefono: function () {
        var v = valore('telefono');
        if (!v) return 'Scrivi un numero di telefono.';
        var cifre = v.replace(/\D/g, '');
        var ok = /^[+\d\s().\/-]+$/.test(v) && cifre.length >= 6 && cifre.length <= 15;
        return ok ? '' : 'Controlla il numero: usa solo cifre, spazi e, se serve, il prefisso +39.';
      },
      privacy: function () {
        return spuntato('privacy') ? '' : 'Per iscriverti conferma di aver letto l\'informativa privacy.';
      }
    };

    function campiDi(nome) {
      return $$('[name="' + nome + '"]', form);
    }

    function mostraErrore(nome, messaggio) {
      var err = document.getElementById('err-' + nome);
      campiDi(nome).forEach(function (c) {
        if (messaggio) c.setAttribute('aria-invalid', 'true');
        else c.removeAttribute('aria-invalid');
      });
      if (!err) return;
      err.textContent = '';
      if (messaggio) {
        var prefisso = document.createElement('span');
        prefisso.className = 'visually-hidden';
        prefisso.textContent = 'Errore: ';
        err.appendChild(prefisso);
        err.appendChild(document.createTextNode(messaggio));
      }
      err.hidden = !messaggio;
    }

    function valida(nome) {
      var messaggio = regole[nome]();
      mostraErrore(nome, messaggio);
      return messaggio;
    }

    function primoCampo(nome) {
      var campi = campiDi(nome);
      var scelto = campi.filter(function (c) { return c.checked; })[0];
      return scelto || campi.filter(function (c) { return !c.disabled; })[0];
    }

    // Dopo il primo invio i campi si ricontrollano quando li lasci, non a ogni tasto
    form.addEventListener('focusout', function (e) {
      var nome = e.target.name;
      if (tentato && regole[nome] && e.target.type !== 'radio') valida(nome);
    });
    form.addEventListener('change', function (e) {
      var nome = e.target.name;
      if (tentato && regole[nome]) valida(nome);
    });
    form.addEventListener('input', function (e) {
      var nome = e.target.name;
      if (regole[nome] && e.target.getAttribute('aria-invalid') === 'true' && !regole[nome]()) {
        mostraErrore(nome, '');
      }
    });

    function stato(messaggio, errore) {
      statoEl.textContent = messaggio || '';
      statoEl.classList.toggle('form__status--error', !!errore);
    }

    function inizioInvio() {
      inInvio = true;
      form.setAttribute('aria-busy', 'true');
      pulsante.setAttribute('aria-disabled', 'true');
      pulsante.textContent = 'Invio in corso…';
      stato('Invio in corso…');
    }

    function fineInvio() {
      inInvio = false;
      form.removeAttribute('aria-busy');
      pulsante.removeAttribute('aria-disabled');
      pulsante.textContent = testoPulsante;
    }

    function raccogliDati() {
      var dati = new FormData(form);
      var codice = dati.get('giornata') || '';
      var g = GIORNATE[codice];
      var testo = function (nome) { return String(dati.get(nome) || '').trim(); };
      var risultato = {
        giornata: g ? g.etichetta + ', ' + g.orario : '',
        giornata_codice: codice,
        partecipanti: testo('partecipanti') || '1',
        nome_cognome: testo('nome_cognome'),
        azienda: testo('azienda'),
        email: testo('email'),
        telefono: testo('telefono'),
        interessi: dati.getAll('interessi').join('; '),
        note: testo('note'),
        privacy: dati.get('privacy') ? 'sì' : 'no',
        marketing: dati.get('marketing') ? 'sì' : 'no',
        data_invio: new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Rome' })
      };
      CAMPI_UTM.forEach(function (k) { risultato[k] = testo(k); });
      return risultato;
    }

    function urlGrazie(dati) {
      var q = new URLSearchParams({ giorno: dati.giornata_codice, persone: dati.partecipanti });
      if (modalita === 'prova') q.set('prova', '1');
      if (FORM_CONFIG.emailConferma) q.set('conferma', '1');
      return FORM_CONFIG.paginaGrazie + '?' + q.toString();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (inInvio) return; // niente doppio invio

      tentato = true;
      var errori = Object.keys(regole).filter(function (nome) { return valida(nome); });

      if (errori.length) {
        riepilogo.textContent = errori.length === 1
          ? 'Controlla il campo evidenziato.'
          : 'Controlla i ' + errori.length + ' campi evidenziati.';
        riepilogo.hidden = false;
        var campo = primoCampo(errori[0]);
        if (campo) campo.focus();
        return;
      }
      riepilogo.hidden = true;

      var dati = raccogliDati();

      // Programma automatico: campo trappola compilato, oppure (solo con il servizio attivo)
      // modulo inviato in meno di 3 secondi. Finto successo, senza inviare nulla.
      var trappola = form.elements.hp_contatto_x && form.elements.hp_contatto_x.value;
      var troppoVeloce = modalita === 'servizio' && Date.now() - avvio < 3000;
      if (trappola || troppoVeloce) {
        window.location.href = urlGrazie(dati);
        return;
      }

      inizioInvio();
      inviaIscrizione(dati).then(function (esito) {
        if (!esito || !esito.ok) throw new Error('invio non riuscito');
        if (esito.email) {
          fineInvio();
          stato('Si è aperta la tua app di posta con i dati già scritti: invia l\'email per completare l\'iscrizione. ' +
            'Se non si apre, scrivi a ' + FORM_CONFIG.emailRiserva + ' o chiama lo ' + FORM_CONFIG.telefono + '.');
          return;
        }
        inviato = true;
        var destinazione = urlGrazie(dati);
        form.reset();
        window.location.href = destinazione;
      }).catch(function () {
        fineInvio();
        stato('Invio non riuscito. Riprova tra poco oppure chiama lo ' + FORM_CONFIG.telefono + '.', true);
      });
    });

    // Chi torna indietro dopo l'iscrizione (cache del browser) trova il modulo vuoto e un messaggio
    window.addEventListener('pageshow', function (e) {
      if (!e.persisted) return;
      fineInvio();
      stato('');
      compilaUtm(form);
      if (inviato) {
        var msg = $('#form-gia-inviato');
        msg.hidden = false;
        msg.focus(); // così viene anche letto dai lettori di schermo
      }
    });
  }

  /* ---------- Parametri UTM nei campi nascosti (nessun salvataggio sul dispositivo) ---------- */
  function compilaUtm(form) {
    CAMPI_UTM.forEach(function (k) {
      var v = params.get(k);
      var campo = form.elements[k];
      if (campo && v && /^[\w\-.~+%: ]{1,100}$/.test(v)) campo.value = v;
    });
  }

  /* ---------- Invio: l'unica funzione da adattare al servizio scelto ---------- */
  function inviaIscrizione(dati) {
    if (modalita === 'prova') {
      return new Promise(function (ok) { setTimeout(function () { ok({ ok: true }); }, 600); });
    }

    if (modalita === 'email') {
      apriEmail(dati);
      return Promise.resolve({ ok: true, email: true });
    }

    // modalita === 'servizio'
    var corpo = {};
    Object.keys(dati).forEach(function (k) { corpo[FORM_CONFIG.mappaCampi[k] || k] = dati[k]; });

    var opzioni = { method: 'POST', headers: {} };
    if (FORM_CONFIG.formato === 'json') {
      opzioni.headers['Content-Type'] = 'application/json';
      opzioni.headers.Accept = 'application/json';
      opzioni.body = JSON.stringify(corpo);
    } else {
      opzioni.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      opzioni.body = new URLSearchParams(corpo).toString();
    }

    var controllo = 'AbortController' in window ? new AbortController() : null;
    if (controllo) {
      opzioni.signal = controllo.signal;
      setTimeout(function () { controllo.abort(); }, 15000);
    }

    return fetch(FORM_CONFIG.endpoint, opzioni).then(function (risposta) {
      return { ok: risposta.ok };
    });
  }

  function apriEmail(dati) {
    var oggetto = 'Iscrizione evento Bianco digitale – ' + (GIORNATE[dati.giornata_codice] || {}).etichetta;
    var righe = [
      'Confermo la partecipazione all\'evento "Bianco digitale e grande formato".',
      '',
      'Giornata: ' + dati.giornata,
      'Partecipanti: ' + dati.partecipanti,
      'Nome e cognome: ' + dati.nome_cognome,
      'Azienda: ' + dati.azienda,
      'Email: ' + dati.email,
      'Telefono: ' + dati.telefono,
      'Interessi: ' + (dati.interessi || '-'),
      'Note: ' + (dati.note || '-'),
      'Informativa privacy letta: ' + dati.privacy,
      'Newsletter e comunicazioni commerciali: ' + dati.marketing
    ];
    var utm = CAMPI_UTM.filter(function (k) { return dati[k]; })
      .map(function (k) { return k + '=' + dati[k]; });
    if (utm.length) righe.push('', 'Provenienza: ' + utm.join(', '));

    var rigaNote = righe.indexOf('Note: ' + (dati.note || '-'));
    function indirizzo() {
      return 'mailto:' + FORM_CONFIG.emailRiserva +
        '?subject=' + encodeURIComponent(oggetto) +
        '&body=' + encodeURIComponent(righe.join('\r\n'));
    }
    // Alcuni programmi di posta (es. Outlook su Windows) troncano link oltre i 2000 caratteri:
    // se serve si accorcia la nota e lo si dice nell'email
    var note = dati.note || '';
    while (indirizzo().length > 2000 && note.length > 0) {
      note = note.slice(0, Math.max(0, note.length - 50));
      righe[rigaNote] = 'Note: ' + note + '… [nota troncata: completala qui]';
    }

    window.location.href = indirizzo();
  }

  /* ---------- Avvio ---------- */
  initHeader();
  initNav();
  initBarraFissa();
  initMappa();
  initModulo();
  initGiornate();
})();
