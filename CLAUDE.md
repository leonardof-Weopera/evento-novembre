# Progetto: landing page "Bianco digitale e grande formato" – Demo Srl

Landing page per l'evento di Demo Srl (https://www.demo.it/) a Ponte Buggianese (PT), 5-6-7 novembre 2026.
Tutte le email della campagna rimandano qui. Obiettivo principale: **raccogliere le iscrizioni con la scelta della giornata**.
Pubblico: aziende delle Arti Grafiche del database clienti di Demo Srl.
Fase successiva del progetto (non ora): newsletter/email della campagna (mail 1, 2, 3, promemoria).

## File di riferimento in questa cartella
- `brief-landing-page-evento-bianco-digitale.pdf` → brief completo: **è la fonte principale, leggilo prima di iniziare**.
  Le decisioni successive scritte in questo file (orari, colori, sezioni) prevalgono sul brief.
- `MACCHINE XEROX.docx` → elenco delle macchine Xerox e Mutoh da presentare.
- `P92BR-01I.pdf` → brochure Xerox PrimeLink C9265/C9275/C9281 (non più usata nella pagina: la sezione Download è stata tolta).
- `Reference/` → immagini di riferimento per lo stile e screenshot del sito Demo.
- `LOGO/` → loghi ufficiali: Demo nero (`LOGO black.png`), Demo bianco (`logo demo new white-02.png`), Xerox (`2560px-Xerox_logo.svg.png`), Bianco Digitale (`BiancoDigitale_logo.png`), Mutoh (`logo-mutoh.webp`, piccolo: 164x32 px).
- `assets/img/` → foto delle macchine, foto della sede (`Esterno-2.jpg`, usata nella pagina in versione ottimizzata `sede/demo-sede-esterno-2-*.jpg`; l'originale non va pubblicato) e loghi ottimizzati; elenco e fonti in `assets/img/fonti-immagini.txt`.

## Dati evento (confermati)
- Giovedì 5 novembre: 10:00-18:00, orario continuato
- Venerdì 6 novembre: 10:00-18:00, orario continuato
- Sabato 7 novembre: 9:30-12:30, solo mattina
- Sede: sede Demo Srl – Via Degli Ulivi 8, 51019 Ponte Buggianese (PT). Parcheggio disponibile per i partecipanti.
- Partecipazione gratuita, posti limitati.
- Partner: Xerox (bianco digitale), Mutoh (piccolo e medio formato). **Nessun riferimento al grande formato** nei testi:
  resta solo nel nome dell'evento "Bianco digitale e grande formato" (meta titolo, anteprima social, footer, privacy, grazie, calendario), che è il nome dato dal brief.
  **Il titolo dell'hero (H1) è "Open Lab Demo" + logo Bianco Digitale**, senza "e grande formato" (tolto su richiesta). "Open Lab Demo" non va nella barra del menu.
- Contatti: Tel. 0572 32000 – info@demo.it. **Nessun referente**: non inserire segnaposto per il referente.
- Dati societari (confermati), riga del footer in index, grazie e privacy:
  "© 2026 Demo Srl · Via Degli Ulivi 8, 51019 Ponte Buggianese (PT) · P.IVA 01105460479 · REA PT-118681 · Cap. Soc. € 75.600,00"
  (spazio indivisibile tra "€" e l'importo). Titolare del trattamento nella privacy: Demo Srl, Via Degli Ulivi 8, P.IVA 01105460479.
- Gli orari compaiono in più punti: hero, programma, modulo, riepiloghi, JSON-LD in index.html, `assets/js/main.js`, `assets/js/grazie.js`, `grazie.html`, file `assets/ics/*.ics`. Se cambiano, aggiornarli ovunque.

## Macchine in mostra
Xerox e Pro1050: i dati delle schede vengono **solo** da `schede-xerox-pro1050.md` (ignorare la sua sezione "Note per Demo"); non aggiungere dati tecnici.
Schede **brevi** come le Mutoh: nome, etichetta breve e 3 punti chiave in frasi corte (senza grassetti, senza descrizioni).
- Xerox PrimeLink C9265 **White Edition** (nome indicato da Demo l'8/10) – "Produzione leggera a colori". Supporti da 40 a 600 g/m² (dato fornito da Demo).
  Nei punti chiave non aggiungere altri riferimenti al bianco oltre al nome "White Edition".
- Xerox Proficio PX300 – "Stampa di produzione con quinto colore": quinta stazione colore **opzionale** (bianco, oro e argento); supporti fino a 450 g/m² (dato fornito da Demo).
- **Oki Pro1050 White** – "Etichette a 5 colori con bianco". Marca confermata da Demo l'8/10.
Mutoh: i dati delle schede vengono **solo** da `schede-mutoh.md` (ignorare la sua sezione "Note per Demo"); non aggiungere dati tecnici che non siano in quel file.
Schede Mutoh **brevi** (la pagina era troppo piena): solo nome, titolo e 3 caratteristiche principali; niente descrizione introduttiva, niente etichetta breve, niente applicazioni.
- Mutoh XpertJet 661UF – stampante UV LED piana per oggettistica e gadget (con bianco e vernice)
- Mutoh ValueJet 628MP – stampante roll-to-roll compatta, piccolo formato, inchiostro multiuso MP31.
  **Non è UV**: nessun riferimento alla tecnologia UV. Non scrivere "stampa e taglio": scrivere "taglio automatico del supporto".
- Blocchi formato: **solo piccolo e medio formato** (il blocco grande formato è stato tolto). Su desktop stanno impilati a fianco della XpertJet 661UF, la ValueJet 628MP sta sotto.
- Medio formato: presenza confermata (nessun segnaposto nel blocco).
- Al passaggio del mouse tutte le schede macchina (Xerox, Pro1050 e Mutoh) hanno lo stesso bordo **ciano** (`.machine:hover`).

## Struttura della pagina (dall'alto verso il basso)
1. Hero – titolo = "Open Lab **Demo**" a fianco del logo Bianco Digitale (versione bianca) come marchio dell'evento (affiancati con filetto su desktop, uno sopra l'altro su telefono), sottotitolo "Tre giorni di dimostrazioni dal vivo per le Arti Grafiche", date, orari e luogo, "Partecipazione gratuita · posti limitati" e sotto "È gradita conferma di partecipazione", loghi partner, pulsante "Conferma la tua presenza" → modulo.
2. Xerox: il bianco digitale – testi dal brief + schede PrimeLink, PX300 e Pro1050 (scheda ampia).
3. Mutoh: ogni formato – blocchi piccolo e medio formato a fianco della XpertJet 661UF, ValueJet 628MP sotto (schede brevi).
4. Programma e orari – tre schede affiancate (gio/ven/sab); cosa si vedrà: demo dal vivo, campioni da portare via, confronto con i tecnici.
5. Come arrivare – foto della sede, indirizzo, parcheggio, indicazioni stradali, mappa caricata solo al clic.
6. Modulo di registrazione – "I posti sono limitati", partecipazione gratuita indicata vicino al titolo e sopra il pulsante.
7. Footer – contatti, loghi, informativa privacy, dati societari.
**Nessuna sezione Download** e nessun riferimento ai download nei testi.
Menu di navigazione: link ad ancora a forma di pillola, **solo testo** (niente icone), nessun menu classico a tendina.

## Modulo di registrazione
Campi: Giornata* (3 riquadri selezionabili, non menu a tendina), Numero partecipanti* (1-5), Nome e cognome*, Azienda*, Email*, Telefono*,
Interessi (multipla: Bianco digitale Xerox, Mutoh, Entrambi), Note, "Ho letto l'informativa privacy"* (con link),
consenso facoltativo a newsletter e comunicazioni commerciali (per la fase 2).
Dopo l'invio: pagina di ringraziamento (`grazie.html`) con riepilogo giornata e orario e file .ics per il calendario.
Servono: email di conferma automatica al partecipante, notifica interna, esportazione dati in Excel/CSV.
**Servizio di invio del modulo: DA DECIDERE** (ipotesi: Brevo, utile anche per le newsletter future). Va deciso prima del 14 ottobre.
La configurazione sta tutta in `FORM_CONFIG` all'inizio di `assets/js/main.js`. Finché `endpoint` è vuoto: in locale "modalità prova"
(invio simulato; **nessun riquadro "modalità prova" nella sezione iscrizione**, tolto su richiesta; resta solo in `grazie.html`),
online si apre un'email precompilata verso info@demo.it (mai una finta conferma). Chiedimi prima di integrare un servizio esterno.

## Stile grafico
Obiettivo: fondere lo stile asciutto e istituzionale di Demo Srl con le reference in `Reference/`.

### Colori (decisione aggiornata)
- **Niente magenta** (#E6007E) in nessun punto del sito.
- Colori ammessi: **blu Demo #264873** (colore istituzionale: hero, card scure, footer, pulsanti secondari, scelte selezionate nel modulo),
  **ciano #00B4E6** e **giallo #FFD800** come accenti. Nero #161616 solo come testo sul giallo.
- **Pulsante principale "Conferma la tua presenza": giallo #FFD800 con testo nero #161616** (contrasto 13:1), a pillola.
  Pulsanti secondari: blu Demo con testo bianco. Il sito Demo usa l'arancione #F77F00 per i pulsanti: qui non usarlo.
- Colori guida delle sezioni: Xerox = ciano, Mutoh = blu Demo, Programma = giallo, Come arrivare = blu Demo, Iscrizione = giallo.
- Barra colorata in testa e sopra il footer: ciano / blu Demo / giallo.
- Ciano e giallo non vanno mai usati come colore del testo su fondo chiaro (contrasto insufficiente); per le etichette in ciano usare #0077A3.
- Testi: #1A202C per i testi forti, #2D3748 per il testo corrente; fondo pagina #F4F4F6.

### Font e forme
- Font: **DM Sans**, ospitato sul sito (`assets/fonts`, niente Google Fonts). Titoli grandi in peso 300-400 con le parole chiave in 700; 700 per titoletti, etichette e pulsanti.
- Impaginazione "a blocchi" (bento): riquadri con angoli molto arrotondati (20px su telefono, 28px su desktop) su fondo #F4F4F6.
- Card affiancate: una chiara con immagine, le altre blu Demo con testo bianco; card numerate 01-04 per i vantaggi.
- Il rombo del logo Demo (CSS) è il segno grafico per elenchi ed etichette; crocino di registro una sola volta nell'hero.
- Le macchine scontornate "escono" dal riquadro come nelle reference.
- Tutti i colori e i font sono variabili CSS in un unico `:root` in `assets/css/style.css`.

### Loghi
- Demo: **nero** (`assets/img/logo/demo-logo.png`) su fondi chiari, **bianco** (`assets/img/logo/demo-logo-bianco.png`) su fondi scuri.
  Nota: nel logo bianco i triangoli sono blu e sul blu Demo si vedono poco; se serve, chiedere a Demo una versione tutta bianca.
- Bianco Digitale: versione bianca (`assets/img/logo/bianco-digitale-bianco.png`) nell'hero come marchio dell'evento.
- Hero: "Evento **Demo Srl** con" in grande, con Demo Srl in bianco e grassetto.
- Xerox e Mutoh: su piastrina bianca (`logo-chip`), **della stessa misura** (piastrine uguali e lettere dei due marchi alla stessa altezza: Mutoh un po' più alto di Xerox, `.logo-chip--mutoh`), nei colori ufficiali, nell'hero e nel footer (`assets/img/logo/xerox.png`, `assets/img/logo/mutoh.webp`).
  Il file Mutoh è piccolo (164x32 px): se serve più nitidezza chiedere una versione più grande o in SVG.

### Icone
- Le icone (date, orari, luogo, parcheggio, partecipazione gratuita, demo dal vivo, campioni stampati, consulenza tecnica) vanno prese **solo da Magnific**:
  lineari, tratto sottile, monocromatiche, salvate come SVG in `assets/img/icons`, con la licenza annotata in `assets/img/fonti-immagini.txt`.
  Non usare altre fonti. Finora non scaricate (Magnific non accessibile).

### Regole fisse
- Sfondi bianchi o grigio chiarissimo per i testi lunghi.
- Pulsante "Conferma la tua presenza" sempre visibile, anche su telefono (barra fissa in basso su mobile).
- Niente blocchi segnaposto per le foto delle stampe con il bianco (cartoncino nero, kraft, trasparente): tolti su richiesta. Reinserire una galleria solo quando arrivano foto vere.

## Requisiti tecnici
- Sito statico semplice (HTML, CSS, JavaScript), senza passaggi di build, facile da pubblicare su Netlify/Vercel.
- Responsive, mobile first (oltre metà del traffico da cellulare). Caricamento veloce, immagini ottimizzate (WebP dove serve, mai originali pesanti).
- Meta titolo: "Bianco digitale e grande formato - Demo Srl, 5-6-7 novembre". Meta description e immagine di anteprima social (`assets/img/og-image.jpg`).
- Indirizzo previsto: [dominio]/evento-bianco-digitale/ — **sempre con la barra finale** nei link delle email (senza barra CSS e immagini non si caricano).
- Conserva i parametri UTM (utm_source, utm_medium, utm_campaign, utm_content) e salvali in campi nascosti del modulo.
- Informativa privacy; banner cookie solo se si usano strumenti di tracciamento (la mappa Google si carica solo al clic).
- Accessibilità di base: contrasti adeguati, etichette sui campi, navigazione da tastiera.
- Pubblicare solo i file del sito (index, grazie, privacy, assets senza originali pesanti e cartelle grezze), non brief, Reference e LOGO.

## Scadenze
- 14 ottobre: pagina online con contenuti e schede
- 21 ottobre: modulo attivo e testato
- 29 ottobre: controllo dati per il promemoria ai non iscritti

## Newsletter (fase 2 – non ora)
Riferimenti: `Reference/Newsletter/` (newsletter precedenti di Demo).
- Stile Demo: fondo petrolio sfumato (#37AFC8 → #027A93), parole chiave evidenziate a colori, testi brevissimi, grande pulsante arrotondato, illustrazioni 3D isometriche.
- Le vecchie newsletter sono immagini uniche 1080x1920: per l'evento fare invece email HTML con testo reale (consegna migliore, leggibili anche con immagini bloccate).
- Le email dell'evento devono riprendere la grafica della landing (blu Demo + ciano e giallo, niente magenta, pulsante giallo con testo nero) e tenere dalle vecchie newsletter le parole chiave evidenziate e il pulsante grande.
- Ogni link alla landing con parametri UTM (mail1, mail2, mail3, promemoria) e con la barra finale nell'indirizzo.

## Regole di lavoro
- Rispondi in italiano. Testi della pagina in italiano, tono professionale e diretto.
- Non inventare dati (indirizzo, contatti, specifiche tecniche): lascia segnaposto evidenti tra [parentesi quadre].
- Organizza i file così: `index.html`, `grazie.html`, `privacy.html`, `assets/css`, `assets/js`, `assets/img` (con `logo/`, `hero/`, `sede/`, `icons/`), `assets/fonts`, `assets/ics`, `assets/pdf`.
- Non modificare né cancellare i file originali del brief.
