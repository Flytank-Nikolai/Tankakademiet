/* ==========================================================================
   TANKAKADEMIET — data
   Indholdet er bygget på de udleverede publikationer. Se kilder.js/views.
   ========================================================================== */

(function () {
  "use strict";

  const I = (id, text, detail, tag, p, critical) => ({
    id: id,
    text: text,
    detail: detail || "",
    tag: tag || "",
    p: p || [],
    critical: !!critical
  });

  const ACADEMY = {

    /* ------------------------------------------------------------------
       Metadata
       ------------------------------------------------------------------ */
    meta: {
      title: "Tankakademiet",
      tagline: "Fra kontrol til køretur",
      version: "2026.11",
      unit: "FVT-FFU",
      organisation: "Forsvarets Vedligeholdelsestjeneste",
      material: "Undervisningsmateriale",
      disclaimer: "FVT-FFU-undervisningsmateriale – ikke en erstatning for gældende bestemmelser, lokale ordrer eller myndighedsgodkendelser."
    },

    groups: [
      { id: "grundlag", label: "Grundlag", modules: ["overblik", "regler", "eftersyn"] },
      { id: "koret", label: "Køretøjet", modules: ["beredskab", "start", "holdt"] },
      { id: "gods", label: "Klasse 3 & tank", modules: ["klasse3", "tankvogn", "last"] },
      { id: "krav", label: "Krav & kørsel", modules: ["koeretid", "godkendelse"] },
      { id: "praksis", label: "Praksis", modules: ["scenarier", "eksamen"] }
    ],

    modules: [
      {
        id: "overblik",
        num: "00",
        group: "grundlag",
        title: "Overblik & rød tråd",
        short: "Overblik",
        subtitle: "Hvorfor fire regelsæt i virkeligheden er én arbejdsgang",
        summary: "Forstå sammenhængen mellem færdselsregler, eftersyn, farligt gods og tankvognen – og hvad der er dit ansvar.",
        minutes: 8,
        keywords: ["rød tråd", "overblik", "ansvar", "sammenhæng", "fører", "kontrol", "tankvogn"],
        source: "FKOBST H.061-0 · HRN 737-021 · FMIBST 061-02 · ADR"
      },
      {
        id: "regler",
        num: "01",
        group: "grundlag",
        title: "Regler, roller & ansvar",
        short: "Regler & roller",
        subtitle: "Hvem bestemmer hvad – og hvem hænger på ansvaret?",
        summary: "ADR, FMIBST 061-02 og de militære afvigelser. Roller fra chef til kører, sikkerhedsrådgiver og synsvirksomhed.",
        minutes: 12,
        keywords: ["ADR", "FMIBST", "FKOBST", "ansvar", "roller", "sikkerhedsrådgiver", "SR", "KSI", "FGI", "EPI", "NMCA"],
        source: "FMIBST 061-02 pkt. 3–5 · FKOBST H.061-0 pkt. 1.13–1.17"
      },
      {
        id: "eftersyn",
        num: "02",
        group: "grundlag",
        title: "Eftersynssystemet",
        short: "Eftersynssystemet",
        subtitle: "Beredskab, start, holdt, vadning og månedligt – hvornår og hvorfor",
        summary: "Lær logikken i HRN 737-021, forskellen på efterse, kontroller og afprøv – og hvilket eftersyn situationen kræver.",
        minutes: 14,
        keywords: ["HRN 737", "beredskabseftersyn", "starteftersyn", "holdteftersyn", "månedligt", "vadning", "kontrolbog", "afprøv", "efterse", "kontroller"],
        source: "HRN 737-021 pkt. 101–106"
      },
      {
        id: "beredskab",
        num: "03",
        group: "koret",
        title: "Beredskabseftersyn",
        short: "Beredskabseftersyn",
        subtitle: "Det grundlæggende daglige eftersyn – med tankvognens ekstra punkter",
        summary: "Gennemfør den fulde beredskabstjekliste, forstå de 26 punkter og se, hvad der kommer oveni på en tankvogn.",
        minutes: 18,
        keywords: ["beredskab", "tjekliste", "kontrolbog B", "fejlmelding", "tankvogn", "klasse 3"],
        source: "HRN 737-021 pkt. 201 · FMIBST 061-02 tillæg H og I"
      },
      {
        id: "start",
        num: "04",
        group: "koret",
        title: "Starteftersyn",
        short: "Starteftersyn",
        subtitle: "Før første meter – når du selv har lavet det sidste beredskabseftersyn",
        summary: "Den korte, skarpe kontrol før udkørsel. Med fokus på lækager, last, bremser og tankvognens særlige risici.",
        minutes: 14,
        keywords: ["start", "tjekliste", "kontrolbog S", "lækage", "bremser", "lys", "tankvogn"],
        source: "HRN 737-021 pkt. 202"
      },
      {
        id: "holdt",
        num: "05",
        group: "koret",
        title: "Holdt, vadning & månedligt",
        short: "Holdt & månedligt",
        subtitle: "Undervejs, efter vand og de fire månedlige eftersyn",
        summary: "Holdteftersynets 15 punkter, vadning som sjældent specialtilfælde og eftersyn 1–4 – med tydelig relevansfiltrering.",
        minutes: 20,
        keywords: ["holdteftersyn", "vadning", "vand", "månedlig", "eftersyn 1", "eftersyn 2", "eftersyn 3", "eftersyn 4", "kontrolbog H", "EV"],
        source: "HRN 737-021 pkt. 203–404"
      },
      {
        id: "klasse3",
        num: "06",
        group: "gods",
        title: "Klasse 3 & brændstof",
        short: "Klasse 3",
        subtitle: "Benzin, diesel og Jet Fuel – hvad gør dem farlige, og hvad betyder det i praksis?",
        summary: "Fareprofil, UN-numre, dampe, statisk elektricitet, mærkning og de tre brændstoftyper du møder.",
        minutes: 16,
        keywords: ["klasse 3", "benzin", "diesel", "Jet", "Jet A-1", "UN 1202", "UN 1203", "UN 1863", "flashpoint", "dampe", "statisk", "mærkning", "orange plade"],
        source: "ADR del 2–5 · FMIBST 061-02 tillæg B, E og H"
      },
      {
        id: "tankvogn",
        num: "07",
        group: "gods",
        title: "Tankvognen",
        short: "Tankvognen",
        subtitle: "FL/AT, ADR-attest, jording, ventiler, slanger og sikker overførsel",
        summary: "Klik dig gennem tankvognens kritiske punkter og lær læsse-/losseflowet, stopreglerne og havarihåndteringen.",
        minutes: 22,
        keywords: ["tankvogn", "FL", "AT", "ADR-attest", "jording", "bonding", "overfyldning", "ventil", "slange", "pumpe", "PTO", "spildsæt", "læsning", "losning"],
        source: "FMIBST 061-02 pkt. 9–12 og tillæg D, H, I · ADR del 6 og 8"
      },
      {
        id: "last",
        num: "08",
        group: "gods",
        title: "Last, dokumenter & transportregler",
        short: "Last & regler",
        subtitle: "Hvilken transportregel gælder – og hvad skal med i køretøjet?",
        summary: "Transportdokument, lastsikring, intern transport, håndværkerreglen og dispensation – med brændstof og tankvogn som omdrejningspunkt.",
        minutes: 18,
        keywords: ["transportdokument", "lastsikring", "intern transport", "håndværkerreglen", "dispensation", "dokumenter", "brændstof", "tankvogn"],
        source: "FMIBST 061-02 pkt. 4–13 og tillæg A"
      },
      {
        id: "koeretid",
        num: "09",
        group: "krav",
        title: "Køre- & hviletid",
        short: "Køre/hviletid",
        subtitle: "4,5 timer, pause, hvile og forskellen på tjeneste og øvelse",
        summary: "Forsvarets egne regler – ikke de civile EU-regler. Planlæg marchen med interaktiv tidslinje og kontrol af grænser.",
        minutes: 14,
        keywords: ["køretid", "hviletid", "pause", "4,5 timer", "9 timer", "13,5 timer", "11 timers hvile", "6 timers hvile", "march", "kolonne"],
        source: "FKOBST H.061-0 pkt. 1.6 og 2.10–2.12"
      },
      {
        id: "godkendelse",
        num: "10",
        group: "krav",
        title: "Afprøvning, syn & fritagelser",
        short: "Syn & fritagelser",
        subtitle: "Hvad er eftersyn, afprøvning, syn og godkendelse – og hvornår gælder en fritagelse?",
        summary: "ADR-godkendelse, periodisk syn, tanktest, militære typer og de fritagelser du må – og ikke må – bruge.",
        minutes: 16,
        keywords: ["afprøvning", "syn", "periodisk syn", "ADR-godkendelse", "fritagelse", "dispensation", "type I", "type II", "FL", "AT", "tanktest"],
        source: "FKOBST H.061-0 pkt. 7.3 og 3.11 · FMIBST 061-02 pkt. 5, 13 og tillæg I"
      },
      {
        id: "scenarier",
        num: "11",
        group: "praksis",
        title: "Scenarier",
        short: "Scenarier",
        subtitle: "Seks situationer hvor reglerne skal omsættes til en beslutning",
        summary: "Træn dømmekraft: læsning, lækage, defekt, køretid, færge og håndværkerreglen. Få feedback med det samme.",
        minutes: 12,
        keywords: ["scenarie", "beslutning", "lækage", "defekt", "færge", "håndværkerreglen", "køretid", "træning"],
        source: "Alle fire publikationer"
      },
      {
        id: "eksamen",
        num: "12",
        group: "praksis",
        title: "Eksamen & bevis",
        short: "Eksamen",
        subtitle: "25 spørgsmål på tværs af hele forløbet",
        summary: "Afslut forløbet med en eksamen. Du skal have mindst 80 % rigtige for at få et gennemførelsesbevis.",
        minutes: 20,
        keywords: ["eksamen", "quiz", "test", "bevis", "certifikat", "80 procent"],
        source: "Hele forløbet"
      }
    ],

    profiles: [
      { id: "tank", label: "Tankvogn / tankcontainer", desc: "Klasse 3, FL/AT, pumpe, slanger og jording" },
      { id: "trailer", label: "Påhængsvogn / trailer", desc: "Kobling, luft, el, støtteben og parkeringsbremse" },
      { id: "crane", label: "Kran, spil eller lift", desc: "Olie, wire, låse og løfte-/trækmateriel" },
      { id: "personel", label: "Personeltransport på lad", desc: "Seler, indretning, hjælper og køretidsregler" },
      { id: "wading", label: "Kørsel i vand / vadning", desc: "Åbner vadningseftersyn og dybdegrænser" },
      { id: "admin", label: "Administrativ kørsel", desc: "Motorpulje, fragt, skole og kommandantskab" }
    ],

    /* ------------------------------------------------------------------
       Checklists
       ------------------------------------------------------------------ */
    checklists: {

      beredskab: {
        title: "Beredskabseftersyn",
        short: "Beredskab",
        code: "B",
        source: "HRN 737-021 pkt. 201",
        intro: "Det grundlæggende daglige eftersyn. Udføres ved hjemkomst, før udkørsel hvis du ikke selv har lavet det sidste, hvis der er gået mere end 7 dage, eller én gang i døgnet ved længere tids konstant brug.",
        groups: [
          {
            title: "Køretøj, kabine & dokumenter",
            items: [
              I("b01", "Rengør og ryd op i køretøjet", "Fjern løse genstande, affald og ting der kan blive projektiler. Hold førerhus og stige fri.", "basis"),
              I("b02", "Efterfyld køretøjets eget brændstof", "Gælder køretøjets drift – ikke lasten i tanken. På tankvognen skal lastens mængde og dokumentation kontrolleres separat.", "basis", [], true),
              I("b03", "Efterse instrumenter og advarsels-/kontrolamper", "Se efter uventede lamper, manglende visninger og fejl i instrumentpanelet.", "basis"),
              I("b04", "Kontroller og afprøv bremsepedalens funktion, bremselufttryk og parkeringsbremse", "Afprøv funktionen – ikke bare at pedalen føles hård. Kontroller lufttryk og at parkeringsbremsen holder.", "basis", [], true),
              I("b05", "Kontroller og afprøv styretøj", "Kontroller slør og funktion. Ved servostyring kontrolleres med motoren startet, jf. køretøjets anvisning.", "basis", [], true),
              I("b06", "Kontroller koblingsfunktionen", "Kontroller at koblingen fungerer jævnt og uden unormale lyde.", "basis"),
              I("b07", "Kontroller vinduesviskere og -vasker samt horn", "Sørg for frit udsyn og fungerende horn.", "basis"),
              I("b08", "Efterse ildslukker for beskadigelser og fastgørelse", "Kontroller at ildslukkeren er intakt, fastgjort og umiddelbart tilgængelig. Følg lokal kontrolordning.", "basis", [], true),
              I("b09", "Kontroller og rengør ruder, lygter, blinklys, havariblink, stoplys, nummerplader, reflekser og spejle", "Alle lys og reflekser skal være rene, intakte og virke. På tankvognen også orange fareskilte og faresedler.", "basis", [], true),
              I("b10", "Kontroller og rengør sikkerhedsseler og -remme", "Kontroller funktion, lås og eventuelle skader.", "basis"),
              I("b11", "Efterse tilstedeværelse af advarselstrekant", "Skal være i køretøjet og tilgængelig.", "basis"),
              I("b12", "Efterse køretøjet udvendigt for beskadigelser", "Gå en runde om køretøjet. Se efter nye skader, buler, revner og løse dele.", "basis")
            ]
          },
          {
            title: "Hjul, bremser & undervogn",
            items: [
              I("b13", "Efterse hjul og dæk for lufttab og skader – kontroller dæktryk om nødvendigt, samt støvhætter", "Se efter skader, fremmedlegemer, slid og unormal slitage. Kontroller dæktryk efter behov.", "basis"),
              I("b14", "Efterse for løse hjulbolte/-møtrikker", "Kontroller visuelt og efter lokal instruks. Løse bolte er et stop-punkt.", "basis", [], true),
              I("b15", "Kontroller prodsanordningers funktion", "Følg køretøjets betjeningsvejledning for de monterede anordninger.", "basis"),
              I("b16", "Kontroller tilkobling af eventuelt påhængskøretøj", "Kobling, sikring, luft- og elforbindelser. Kontroller også støtteben og parkeringsbremse på påhængskøretøjet.", "basis", ["trailer"], true),
              I("b17", "Efterse bremse- og koblingsvæskestand", "Ved væskemangel kontaktes MMEK før fortsat kørsel.", "basis", [], true),
              I("b17a", "Kontroller olie på servobeholder", "Ved oliemangel kontaktes MMEK før fortsat kørsel.", "basis", [], true),
              I("b18", "Kontroller og efterfyld i nødvendigt omfang: motorolie, kølevæske, sprinklervæske og bremsesystemets frostbeskyttelsesvæske", "Brug køretøjets anviste væsker og niveauer. Bland ikke forkert kølevæske.", "basis"),
              I("b19", "Dræn tryklufttanke for kondensvand", "Gør det efter køretøjets anvisning. Kondens kan give bremsefejl og rust.", "basis", [], true)
            ]
          },
          {
            title: "Last, udstyr & afslutning",
            items: [
              I("b20", "Kontroller anbringelse og fastspænding af eventuelt last", "Lasten må ikke kunne forskubbe sig. På tankvognen: kontroller tankens fastgørelse, ramme og armaturer.", "basis", [], true),
              I("b21", "Kontroller tilbinding af eventuel ruf/presenning", "Presenning og ruf skal være sikret og ikke kunne flagre eller samle vand.", "basis"),
              I("b22", "Kontroller radiomateriel", "Kontroller at kommunikationsudstyret fungerer, hvis det er en del af køretøjet.", "basis"),
              I("b23", "Inden brug: kontroller olie på spil og kran", "Ved oliemangel kontaktes MMEK før fortsat kørsel.", "kran", ["crane"]),
              I("b24", "Inden brug: kontroller løfte-, træk- og surringsmateriel, herunder kæder til lad og bænke, for brud og skader", "Kontroller mærkning, slid og deformation. Defekt materiel må ikke bruges.", "kran", ["crane"], true),
              I("b25", "Udfyld kontrolbog “B” og eventuel fejlmelding", "Kvittér for udført eftersyn. Fejl og mangler skal meldes – ikke bare noteres.", "basis", [], true),
              I("b26", "Afbryd hovedafbryder", "Efter afsluttet eftersyn, medmindre køretøjet skal bruges eller lokal instruks siger noget andet.", "basis")
            ]
          },
          {
            title: "Tankvogn — klasse 3",
            items: [
              I("bt01", "ADR-godkendelsesattest og transportdokument er i køretøjet", "Kontroller at attesten gælder for køretøjet og lasten, og at transportdokumentet er udfyldt.", "tank", ["tank"], true),
              I("bt02", "Orange fareskilte og faresedler matcher lasten", "UN-nummer og fareklasse skal stemme med den faktiske last. Rengør og kontroller læsbarhed.", "tank", ["tank"], true),
              I("bt03", "Tankdæksler/manhuller er lukkede og sikrede, og ventiler står i korrekt stilling", "Følg køretøjets og den lokale læsse-/losseinstruks. En åben ventil er et stop-punkt.", "tank", ["tank"], true),
              I("bt04", "Ingen lugt af brændstof, synlige lækager eller fugt under tank og armaturer", "Lugt kan være første tegn på lækage. Stop og find årsagen – kør ikke videre på mistanke.", "tank", ["tank"], true),
              I("bt05", "Tankniveau og produkt stemmer med dokument og måling", "Kontroller mod dokumentet. Overfyldning og forkert produkt er blandt de mest alvorlige fejl.", "tank", ["tank"], true),
              I("bt06", "Nødstop, pumpe/PTO og bundventiler er funktionskontrolleret og i sikker stilling", "PTO skal ikke stå tilkoblet unødigt. Nødstop skal være tilgængeligt og virke.", "tank", ["tank"], true),
              I("bt07", "Jordingskabel/-reel er intakt og kan tilsluttes", "Jording er en sikkerhedsfunktion mod statisk elektricitet. Defekt jording = ingen overførsel.", "tank", ["tank"], true),
              I("bt08", "Slanger, koblinger, pakninger og API-adapter er kontrolleret og stuvet", "Se efter revner, blødhed, flossede ender, manglende pakninger og utætheder.", "tank", ["tank"], true),
              I("bt09", "Spildmåtte/spildsæt, absorptionsmiddel og affaldssæk er om bord", "Skal kunne bruges med det samme ved spild. Kontroller at indholdet er komplet og tørt.", "tank", ["tank"], true),
              I("bt10", "Brandslukningsudstyr er godkendt, kontrolleret, fastgjort og let tilgængeligt", "Følg ADR/FMIBST og den lokale kontrolordning. Kontroller også at ildslukkeren er egnet til brandklassen.", "tank", ["tank"], true),
              I("bt11", "Personlige værnemidler er til stede: brændstofresistente handsker, beskyttelsesbriller og sikkerhedsfodtøj", "Brug egnede handsker og briller ved håndtering. Undgå løst tøj og smykker omkring bevægelige dele.", "tank", ["tank"]),
              I("bt12", "Ingen uvedkommende eller tændkilder i nærheden – rygning, e-cigaret og åben ild forbudt inden for 30 m", "Forbuddet gælder også førerhuset. Hold øje med omgivelserne ved læsning/losning.", "tank", ["tank"], true),
              I("bt13", "Løse genstande i førerhus og på lad er sikret", "Værktøj, dunke og udstyr må ikke kunne ramme føreren eller skade tanken.", "tank", ["tank"]),
              I("bt14", "Hjul, fælge, bremser og støddæmpere er uden skader – også på tanktraileren", "Kontroller begge sider og alle aksler. Unormal varme ved fælg/nav er et stop-punkt.", "tank", ["tank"], true)
            ]
          }
        ]
      },

      start: {
        title: "Starteftersyn",
        short: "Start",
        code: "S",
        source: "HRN 737-021 pkt. 202",
        intro: "Udføres før udkørsel, når du selv har udført det sidste beredskabseftersyn. Det er den korte kontrol, der fanger det, der er ændret siden sidst.",
        groups: [
          {
            title: "Før start",
            items: [
              I("s01", "Efterse for væskespild under køretøjet – meld om eventuel utæthed", "Se under motor, gearkasse, hydraulik og tank. En ny plet er et stop-punkt.", "basis", [], true),
              I("s02", "Efterse for beskadigelser udenpå køretøjet", "Gå en hurtig runde. Se efter nye skader, løse dele og manglende udstyr.", "basis"),
              I("s03", "Efterse dæk for lufttab", "Se efter synligt lufttab, skader og fremmedlegemer.", "basis", [], true),
              I("s04", "Efterse tilbinding af eventuel ruf/presenning", "Kontroller at presenningen sidder fast og ikke kan flagre.", "basis"),
              I("s05", "Kontroller anbringelse og fastspænding af eventuelt last", "Lasten skal være sikret, før køretøjet bevæger sig. På tankvognen også tankdæksler og armaturer.", "basis", [], true),
              I("s06", "Kontroller tilkobling af eventuelt påhængskøretøj", "Kontroller kobling, sikring, luft, el og støtteben.", "basis", ["trailer"], true),
              I("s07", "Efterse tilstedeværelse af ildslukker, advarselstrekant og kontrolbog", "Alle tre skal være med. Kontroller at ildslukkeren er tilgængelig.", "basis", [], true)
            ]
          },
          {
            title: "Ved start",
            items: [
              I("s08", "Kontroller bremsepedalens funktion og bremselufttryk", "Afprøv før kørsel. Kontroller at trykket er stabilt og parkeringsbremsen holder.", "basis", [], true),
              I("s09", "Kontroller lygter, spejle, reflekser, signal- og tegngivningsapparater", "Kontroller alle lys og signaler. Juster spejle, før du kører.", "basis", [], true),
              I("s10", "Efterse instrumenter og advarsels-/kontrolamper ved start", "Se efter, at lampene slukker som de skal, og at instrumenterne viser normale værdier.", "basis"),
              I("s11", "Lyt efter unormale lyde", "Bankelyde, hvislen, hårde vibrationer eller ændret motorlyd skal undersøges.", "basis"),
              I("s12", "Afprøv driftsbremse og styretøj", "Afprøv ved lav hastighed, når det er sikkert. Bremsen skal trække lige, og styretøjet skal reagere uden slør.", "basis", [], true),
              I("s13", "Udfyld kontrolbog “S”", "Kvittér for udført starteftersyn og meld fejl.", "basis", [], true)
            ]
          },
          {
            title: "Tankvogn — før første meter",
            items: [
              I("st01", "Tank, ventiler, slanger og koblinger er visuelt tætte", "Se og lugt. Ingen dryp, ingen friske pletter, ingen løse dele.", "tank", ["tank"], true),
              I("st02", "Orange plader og faresedler er rene og læsbare", "Kontroller at de matcher lasten og ikke er dækket af snavs eller sne.", "tank", ["tank"], true),
              I("st03", "Nødstop og pumpe/PTO er i sikker stilling", "PTO må ikke være aktiv uden grund. Nødstop skal være fri og tilgængeligt.", "tank", ["tank"], true),
              I("st04", "Jordingskabel er på plads og klar til brug", "Kontroller kabel, klemme og reel. Defekt udstyr skal udskiftes, før overførsel.", "tank", ["tank"], true),
              I("st05", "Brandslukker og spildsæt er på plads", "Kontroller at de ikke er flyttet eller blokeret af bagage.", "tank", ["tank"], true),
              I("st06", "Dokumenter og kontrolbog er med", "ADR-attest, transportdokument, eventuelle tilladelser og kontrolbog.", "tank", ["tank"], true)
            ]
          }
        ]
      },

      holdt: {
        title: "Holdteftersyn",
        short: "Holdt",
        code: "H",
        source: "HRN 737-021 pkt. 203",
        intro: "Udføres efter behov i forbindelse med ophold i kørslen – og altid efter kørsel i terræn, før udkørsel i færdselslovens område.",
        groups: [
          {
            title: "Efter kørsel",
            items: [
              I("h01", "Afprøv bremserne", "Kontroller at bremserne reagerer ens og uden unormal lyd eller træk.", "basis", [], true),
              I("h02", "Efterse for beskadigelser udvendigt på køretøjet", "Se efter nye skader, især efter terræn eller tæt passage.", "basis"),
              I("h03", "Kontroller fælg/nav for unormal varmeudvikling", "Varm fælg eller nav kan betyde bremsefejl eller hjulleje. Rør forsigtigt – brug baghånden og pas på.", "basis", [], true),
              I("h04", "Efterse fælg og dæk for beskadigelser", "Se efter revner, buler, fremmedlegemer og slid.", "basis"),
              I("h05", "Efterse for løse hjulbolte og -møtrikker", "Kontroller efter kørsel og efter hjulskift.", "basis", [], true),
              I("h06", "Fjern større ansamlinger af jord", "Jord og mudder kan påvirke balance, bremser og lys.", "basis"),
              I("h07", "Efterse og rengør ruder, lygter, blinklys, nummerplader, reflekser og spejle", "Snavs fra terræn kan sløre lys og sigtbarhed.", "basis"),
              I("h08", "Kontroller og eventuelt efterfyld brændstof", "Gælder køretøjets drift. Lastens niveau og dokumentation håndteres separat.", "basis")
            ]
          },
          {
            title: "Kontroller & dokumentation",
            items: [
              I("h09", "Efterse for eventuelle utætheder i motorrum", "Se efter olie, kølevæske og brændstof.", "basis", [], true),
              I("h10", "Efterse for utætheder ved brændstof- og bremsesystem", "På tankvognen også tank, rør, ventiler og koblinger. Stop ved mistanke.", "basis", [], true),
              I("h11", "Kontroller olie og kølevæske på motor", "Kontroller niveauer og tilstand.", "basis"),
              I("h12", "Efterse styretøj, hjulophæng, fjedre, støddæmpere, gearkasse(r) og differentiale(r) m.m. for beskadigelser", "Se efter revner, løse bolte og utætheder.", "basis"),
              I("h13", "Kontroller anbringelse og fastspænding af eventuelt last", "Kontroller efter hvert stop, især efter hård kørsel eller terræn.", "basis", [], true),
              I("h14", "Kontroller eventuel tilkobling", "Kontroller kobling og forbindelser igen efter kørsel.", "basis", ["trailer"]),
              I("h15", "Udfyld kontrolbog “H”", "Kvittér for udført holdteftersyn og meld fejl.", "basis", [], true)
            ]
          },
          {
            title: "Tankvogn — undervejs",
            items: [
              I("ht01", "Tank, manhuller, ventiler og rør er tætte og i korrekt stilling", "Efter kørsel og stop: se og lugt. Ingen friske pletter eller løse dele.", "tank", ["tank"], true),
              I("ht02", "Slanger og koblinger er stuvet og sikret", "De må ikke hænge løst eller kunne skade andre trafikanter.", "tank", ["tank"], true),
              I("ht03", "Orange plader, faresedler og bagende er rene og intakte", "Snavs kan gøre mærkningen ulovlig og usynlig.", "tank", ["tank"], true),
              I("ht04", "Lasten/tankens fastgørelse og ramme er uden skader", "Kontroller efter terræn, hårde bremsninger og lang kørsel.", "tank", ["tank"], true),
              I("ht05", "Brandslukker og spildsæt er stadig på plads og tilgængelige", "Bagage må ikke blokere udstyret.", "tank", ["tank"], true)
            ]
          }
        ]
      },

      vadning: {
        title: "Eftersyn efter vadning",
        short: "Vadning",
        code: "EV",
        source: "HRN 737-021 pkt. 301",
        intro: "Kun hvis vadning eller kørsel i vand har fundet sted. Udføres i forlængelse af holdteftersynet. Tilladt vadedybde i fredstid uden særlig forberedelse: terræn 2 x dækhøjde, vej 1 x dækhøjde.",
        profiles: ["wading"],
        groups: [
          {
            title: "Efter vandpassage",
            items: [
              I("v01", "Efterse køler og ventilator for beskadigelse og rengør eventuelt", "Vand, grus og blade kan blokere kølingen.", "wading"),
              I("v02", "Afprøv bremserne – tør eventuelt bremserne under langsom kørsel ved let påvirkning af bremsepedalen", "Bremserne kan trænge til at tørre. Afprøv på et sikkert område.", "wading", [], true),
              I("v03", "Udfyld kontrolbog “EV”", "Dokumentér vadningen og eftersynet.", "wading", [], true),
              I("v04", "Efter hjemkomst: rengør og smør chassis og undervogn", "Fjern sand, mudder og vand. Smør efter køretøjets anvisning.", "wading"),
              I("v05", "Kontroller for indtrængende vand i motorolie og lygter", "Mælkehvid olie eller dug i lygter er tegn på vand. Meld det.", "wading", [], true),
              I("v06", "Udfyld kontrolbog “EV+”", "Afsluttende dokumentation efter hjemkomst.", "wading")
            ]
          },
          {
            title: "Tankvogn efter vand",
            items: [
              I("vt01", "Kontroller tank, ventiler, pakninger og elektriske forbindelser for vandindtrængning", "Vand i ventiler eller elektriske stik kan give korrosion og funktionsfejl.", "tank", ["tank", "wading"], true),
              I("vt02", "Kontroller jordingskabel og -reel for fugt og skader", "Defekt jording må ikke bruges. Tør og kontroller før næste overførsel.", "tank", ["tank", "wading"], true),
              I("vt03", "Kontroller orange plader og faresedler efter vask/vand", "Mærkning skal være ren, tør og læsbar.", "tank", ["tank", "wading"]),
              I("vt04", "Kontroller bremser og hjul efter vandpassage", "Vand kan påvirke bremsefunktion og hjullejer. Afprøv og meld unormale lyde.", "tank", ["tank", "wading"], true)
            ]
          }
        ]
      },

      maned1: {
        title: "Månedligt eftersyn 1",
        short: "Eftersyn 1",
        code: "1",
        source: "HRN 737-021 pkt. 401",
        intro: "Månedligt eftersyn – omfang og indhold tilpasses køretøjets brug siden sidst. Notér væsentlige afvigelser i kontrolbogen.",
        groups: [
          {
            title: "Rengøring & undervogn",
            items: [
              I("m101", "Rengør køretøjet ind- og udvendigt", "Indvendig vask af førerhus kan foretages med en opvredet klud.", "basis"),
              I("m102", "Rengør eventuelt motorrum – kun efter aftale med MMEK", "Motorvask kræver aftale og forsigtighed med elektriske komponenter.", "basis"),
              I("m103", "Kontroller at forhjulene ved maksimal drejning ikke berører chassis, karosse, fjedre eller bremserør/-slanger", "Fjern eventuelle årsager til berøring, før køretøjet bruges.", "basis", [], true),
              I("m104", "Kontroller for slør og fastspænding ved alle styreforbindelser og -led – motor startet ved servostyring", "Slør i styretøjet er et sikkerhedsstop.", "basis", [], true),
              I("m105", "Efterse bremseforbindelser for utætheder og beskadigelser – kontroller for tæthed", "Kontroller rør, slanger og koblinger.", "basis", [], true),
              I("m106", "Efterse fjedre og fjedrekonsoller for fastspænding", "Se efter revner, forskydninger og løse bolte.", "basis"),
              I("m107", "Efterse gearkasser samt for- og bagtøj for utætheder", "Se efter oliepletter og skader.", "basis"),
              I("m108", "Efterse spilgearhus for utætheder og kontroller oliestand", "Gælder køretøjer med spil.", "kran", ["crane"]),
              I("m109", "Efterse og kontroller udstødningssystemet for utætheder og fastspænding", "Utæt udstødning kan give farlige gasser i kabinen.", "basis"),
              I("m110", "Kontroller kølerdæksel og -væske", "Kontroller niveau, frostbeskyttelse og dæksel.", "basis"),
              I("m111", "Efterse kileremme for brud og slid samt kontroller pilhøjden", "Følg køretøjets anvisning for korrekt remspænding.", "basis"),
              I("m112", "Kontroller luftfilter – se betjeningsvejledning", "Følg køretøjets anvisning for rengøring/udskiftning.", "basis"),
              I("m113", "Kontroller eventuelt kroghejs, tippelad, skiftelad, læssebagsmæk og lignende", "Kontroller låse, hydraulik og sikring.", "basis"),
              I("m114", "Efterse karrosseri og førerhus for beskadigelser og rust", "Notér væsentlige skader og meld dem.", "basis"),
              I("m115", "Udfyld kontrolbog “1”", "Kvittér for udført eftersyn.", "basis", [], true)
            ]
          },
          {
            title: "Tankvogn — månedligt",
            items: [
              I("mt101", "Kontroller ADR-attestens gyldighed og tankens testdatoer", "Attesten og tankens prøvningsdatoer skal være gyldige. Planlæg fornyelse i god tid.", "tank", ["tank"], true),
              I("mt102", "Kontroller tank, manhuller, ventiler, rør og koblinger for tæthed, korrosion og skader", "Tankens integritet er afgørende for både sikkerhed og miljø.", "tank", ["tank"], true),
              I("mt103", "Kontroller jordingskabel/-reel og forbindelser", "Kontroller efter lokal instruks. Defekt jording skal udbedres.", "tank", ["tank"], true),
              I("mt104", "Kontroller pumpe, PTO, nødstop og bundventiler for funktion", "Afprøv uden last, hvis det er sikkert og i overensstemmelse med instruksen.", "tank", ["tank"], true),
              I("mt105", "Kontroller slanger for revner, blødhed, slid og mærkning", "Defekte slanger må ikke bruges. Kontroller også opbevaring og ophæng.", "tank", ["tank"], true),
              I("mt106", "Kontroller orange plader, faresedler og brandslukning", "Mærkning og slukningsudstyr skal være intakt og klar.", "tank", ["tank"], true),
              I("mt107", "Kontroller spildsæt og personlige værnemidler", "Kontroller at indholdet er komplet, rent og tørt.", "tank", ["tank"]),
              I("mt108", "Kontroller tankens fastgørelse, ramme og ophæng for revner og løse bolte", "Tanken må ikke kunne forskubbe sig eller hvile på skadede ophæng.", "tank", ["tank"], true)
            ]
          }
        ]
      },

      maned2: {
        title: "Månedligt eftersyn 2",
        short: "Eftersyn 2",
        code: "2",
        source: "HRN 737-021 pkt. 402",
        intro: "Månedligt eftersyn med fokus på batteri, elektriske forbindelser, radio og påhængskøretøj.",
        groups: [
          {
            title: "El, batteri & påhæng",
            items: [
              I("m201", "Efterse akkumulator for beskadigelser og defekte propper", "Kontroller udluftningshuller og akkumulatorvæskestand efter køretøjets anvisning.", "basis", [], true),
              I("m202", "Rengør og efterse akkumulatorkabler og polsko", "Se efter korrosion, løse forbindelser og skader.", "basis"),
              I("m203", "Efterse batterikurv for rust og rengør i nødvendigt omfang", "Rust og løse batterier kan give kortslutning.", "basis"),
              I("m204", "Efterse startkabelstik, inspektionslampestik samt stik til påhængsvogn", "Kontroller stik, kabler og tætninger.", "basis"),
              I("m205", "Kontroller eventuelt radiomateriel", "Kontroller funktion og fastgørelse.", "basis"),
              I("m206", "Kontroller påhængsvognens/påhængsredskabets luftslange, elstik, trækanordning, støtteben og parkeringsbremse", "Kontroller både køretøj og påhæng.", "basis", ["trailer"], true),
              I("m207", "Udfyld kontrolbog “2”", "Kvittér for udført eftersyn.", "basis", [], true)
            ]
          },
          {
            title: "Tankvogn — el & sikkerhed",
            items: [
              I("mt201", "Kontroller elektriske forbindelser til pumpe, ventiler og nødstop", "Se efter skader, fugt og løse stik.", "tank", ["tank"], true),
              I("mt202", "Kontroller batteriets fastgørelse og eventuelle gnistførende dele nær tanken", "Løse dele og gnistkilder tæt på brændstof er uacceptabelt.", "tank", ["tank"], true),
              I("mt203", "Kontroller at orange plader og faresedler kan rengøres og ikke er skadet", "Mærkning er en del af køretøjets godkendelse.", "tank", ["tank"]),
              I("mt204", "Kontroller spildsæt og ildslukker efter brug eller hændelse", "Brugt eller beskadiget udstyr skal erstattes med det samme.", "tank", ["tank"], true)
            ]
          }
        ]
      },

      maned3: {
        title: "Månedligt eftersyn 3",
        short: "Eftersyn 3",
        code: "3",
        source: "HRN 737-021 pkt. 403",
        intro: "Månedligt eftersyn med fokus på hjul, servostyring, spærre, spil, kran og containerlåse.",
        groups: [
          {
            title: "Hjul, spil & kran",
            items: [
              I("m301", "Efterse hjul og dæk for beskadigelser samt kontroller dæktryk inkl. reservehjul", "Kontroller alle hjul og reservehjulet.", "basis", [], true),
              I("m302", "Kontroller væskestand i servobeholder", "Efterfyld efter anvisning. Meld utætheder.", "basis"),
              I("m303", "Kontroller at længde- og tværspærre kan indkobles", "Afprøv funktionen, hvor det er sikkert.", "basis", ["crane"]),
              I("m304", "Efterse, rengør og indsmør spilwire, wireruller og wirefører – kontroller for defekter", "Kontroller wire for brud, deformation og korrosion.", "kran", ["crane"], true),
              I("m305", "Efterse kran for slitage og brud", "Kontroller strukturelle dele, bolte og svejsninger.", "kran", ["crane"], true),
              I("m306", "Efterse og kontroller kran for utætheder", "Hydraulikslanger og cylindere skal være tætte.", "kran", ["crane"], true),
              I("m307", "Kontroller alle kranfunktionerne", "Afprøv efter kranens anvisning og inden brug.", "kran", ["crane"], true),
              I("m308", "Efterse løskarosse/container for beskadigelse, anbringelse og fastspænding", "Kontroller låse og ramme.", "basis"),
              I("m309", "Kontroller og smør containerlåse", "Låse skal fungere og være sikret.", "basis"),
              I("m310", "Kontroller og afprøv reservehjulshejs samt smør bevægelige dele, bolte, wire m.m.", "Kontroller funktion og sikring.", "basis"),
              I("m311", "Udfyld kontrolbog “3”", "Kvittér for udført eftersyn.", "basis", [], true)
            ]
          },
          {
            title: "Tankvogn — pumpe, slanger & test",
            items: [
              I("mt301", "Kontroller pumpe og PTO for utætheder, unormal lyd og funktion", "Kør kun kortvarigt uden last og efter instruks.", "tank", ["tank"], true),
              I("mt302", "Kontroller slanger, koblinger og pakninger for slid og aldring", "Kontroller også slangernes mærkning og opbevaring.", "tank", ["tank"], true),
              I("mt303", "Kontroller tankens prøvningsdato og eventuelle betingelser i ADR-attesten", "Hvis datoen nærmer sig, skal fornyelse planlægges.", "tank", ["tank"], true),
              I("mt304", "Kontroller at tankens mærkning og faresedler stadig svarer til godkendelsen", "Ændret last kan kræve anden mærkning.", "tank", ["tank"], true)
            ]
          }
        ]
      },

      maned4: {
        title: "Månedligt eftersyn 4",
        short: "Eftersyn 4",
        code: "4",
        source: "HRN 737-021 pkt. 404",
        intro: "Månedligt eftersyn med fokus på lad, ruf, sæder, værktøj og surringsmateriel.",
        groups: [
          {
            title: "Lad, udstyr & sikring",
            items: [
              I("m401", "Efterse ladet for fastspænding, beskadigelser og rust samt veksellads låseanordninger", "Kontroller at ladet sidder fast og at låse fungerer.", "basis", [], true),
              I("m402", "Efterse ruf/presenning for beskadigelser og kontroller fastspænding", "Presenningen skal være tæt og sikret.", "basis"),
              I("m403", "Kontroller fastspænding af sæder, geværholder og væltestativ ved indbygning til personeltransport", "Kontroller alle fastgørelser og seler.", "basis", ["personel"], true),
              I("m404", "Smør hængsler og beslag", "Smør efter køretøjets anvisning.", "basis"),
              I("m405", "Optæl, rengør og kontroller værktøj og tilbehør", "Kontroller at værktøj er komplet og i forsvarlig stand.", "basis"),
              I("m406", "Kontroller løfte-, træk- og surringsmateriel for slid, defekter og afmærkning", "Defekt surringsmateriel må ikke bruges.", "basis", [], true),
              I("m407", "Udfyld kontrolbog “4”", "Kvittér for udført eftersyn.", "basis", [], true)
            ]
          },
          {
            title: "Tankvogn — lastsikring & adgang",
            items: [
              I("mt401", "Kontroller at tanken, rammen og eventuelle containere er sikret mod forskydning", "Kontroller bolte, låse og ophæng.", "tank", ["tank"], true),
              I("mt402", "Kontroller stiger, platforme og adgangsveje for skader, skridsikkerhed og fastgørelse", "Adgang til manhuller og armaturer skal være sikker.", "tank", ["tank"]),
              I("mt403", "Kontroller at spildsæt, værktøj og udstyr er komplet og fastgjort", "Ingen løse genstande nær tank eller i kabinen.", "tank", ["tank"]),
              I("mt404", "Kontroller at dokumentation og mærkning er opdateret efter månedens ændringer", "Sidste kontrol af papirer, plader og sedler.", "tank", ["tank"], true)
            ]
          }
        ]
      },

      tank_transfer: {
        title: "Læsning & losning af brændstof",
        short: "Læs/los",
        code: "T",
        source: "FMIBST 061-02 pkt. 9–12 · ADR del 6 og 8 · lokal instruks",
        intro: "Generel sikkerhedssekvens. Den konkrete procedure skal altid følge køretøjets betjeningsvejledning, den lokale læsse-/losseinstruks og anlæggets regler.",
        groups: [
          {
            title: "Før overførsel",
            items: [
              I("t01", "Kontroller transportdokument, ADR-attest og tilladelser", "Produkt, UN-nummer, mængde og destination skal stemme.", "tank", ["tank"], true),
              I("t02", "Parkér sikkert – bremse, gear i neutral/parkering, hjulklodser efter behov", "Køretøjet må ikke kunne rulle. Hold afstand til andre køretøjer og bygninger.", "tank", ["tank"], true),
              I("t03", "Sluk motoren, medmindre pumpen kræver den – følg instruksen", "Undgå unødig tomgang og tændkilder.", "tank", ["tank"], true),
              I("t04", "Brug personlige værnemidler og tænd ikke lys, telefon eller andet i fareområdet", "Rygning, e-cigaret og åben ild er forbudt inden for 30 m.", "tank", ["tank"], true),
              I("t05", "Kontroller produkt og mængde mod dokument og tankens kapacitet", "Overfyldning og forkert produkt er alvorlige fejl. Efterfyld ikke ud over sikkerhedsgrænsen.", "tank", ["tank"], true),
              I("t06", "Kontroller slanger, koblinger, pakninger og API-adapter", "Se efter revner, slid, manglende pakninger og tilsmudsning.", "tank", ["tank"], true),
              I("t07", "Tilslut jording/bonding først – og kontroller forbindelsen", "Statisk elektricitet kan antænde dampe. Jording skal være etableret, før overførsel starter.", "tank", ["tank"], true),
              I("t08", "Læg spildmåtte/spildsæt klar og sikr afdræning", "Ved spild skal du kunne handle med det samme.", "tank", ["tank"], true),
              I("t09", "Kontroller at nødstop og kommunikation er tilgængelig", "Ved pumpestyring: kontroller nødstop og aftal signal med anlægget.", "tank", ["tank"], true)
            ]
          },
          {
            title: "Under overførsel",
            items: [
              I("t10", "Hold konstant opsyn med overførslen", "Forlad ikke koblingen eller pumpen. Afbryd ved unormal lyd, lugt eller lækage.", "tank", ["tank"], true),
              I("t11", "Overvåg niveau, tryk og flow – stop før overfyldning", "Brug tankens måling og anlæggets overfyldningsbeskyttelse. Stol ikke på én indikator alene.", "tank", ["tank"], true),
              I("t12", "Hold tændkilder og uvedkommende væk", "Ingen rygning, åben ild, gnistdannende arbejde eller unødig færdsel.", "tank", ["tank"], true),
              I("t13", "Ved spild eller lækage: stop overførslen, advar og begræns spildet, hvis det er sikkert", "Prioritér person- og brandfare. Tilkald hjælp og følg beredskabsplanen.", "tank", ["tank"], true)
            ]
          },
          {
            title: "Efter overførsel",
            items: [
              I("t14", "Luk ventiler og afbryd pumpen efter instruksen", "Kontroller at alle ventiler er i lukket/sikker stilling.", "tank", ["tank"], true),
              I("t15", "Tøm og stuv slangen forsvarligt – undgå dryp og løse koblinger", "Løft slangen, så rester løber tilbage eller i opsamling.", "tank", ["tank"], true),
              I("t16", "Fjern jordingen som det sidste", "Jordingen skal blive på plads, indtil overførslen er afsluttet og udstyret er sikkert.", "tank", ["tank"], true),
              I("t17", "Kontroller for lækage og lugt omkring tank, ventiler og kobling", "En sidste kontrol før kørsel.", "tank", ["tank"], true),
              I("t18", "Opdater dokumenter, mængder og eventuelle målinger", "Dokumentationen skal afspejle den faktiske last.", "tank", ["tank"], true),
              I("t19", "Fjern klodser, luk dæksler og kontroller mærkning og lys", "Gå en afsluttende runde, før du kører.", "tank", ["tank"], true),
              I("t20", "Meld hændelser, spild eller defekter efter den lokale procedure", "Også små spild skal registreres og håndteres miljømæssigt korrekt.", "tank", ["tank"], true)
            ]
          }
        ]
      }
    },

    /* ------------------------------------------------------------------
       Quiz
       ------------------------------------------------------------------ */
    quiz: [
      {
        module: "eftersyn",
        q: "Hvilken publikation fastsætter kørerens eftersyns- og vedligeholdelsestjeneste på hjulkøretøjer?",
        options: ["FKOBST H.061-0", "HRN 737-021", "FMIBST 061-02", "HRN 202-051"],
        a: 1,
        why: "HRN 737-021 “Hjulkøretøjer – Eftersyn” beskriver brugereftersynene: beredskab, start, holdt, vadning og de månedlige eftersyn."
      },
      {
        module: "eftersyn",
        q: "Hvornår skal beredskabseftersynet som minimum udføres?",
        options: [
          "Kun én gang om måneden",
          "Ved hjemkomst, før udkørsel hvis du ikke selv har lavet det sidste, og hvis der er gået mere end 7 dage",
          "Kun efter kørsel i terræn",
          "Kun når køretøjet skal til syn"
        ],
        a: 1,
        why: "HRN 737-021 pkt. 104 beskriver fire situationer: ved hjemkomst, før udkørsel hvis du ikke selv har afholdt det sidste, hvis der er gået mere end 7 dage, og én gang i døgnet ved længere tids konstant brug."
      },
      {
        module: "eftersyn",
        q: "Hvornår udføres starteftersynet?",
        options: [
          "Når køretøjet har stået stille i mere end 30 dage",
          "Før udkørsel, når køreren selv har udført det sidste beredskabseftersyn",
          "Kun efter vadning",
          "Kun når der er last på køretøjet"
        ],
        a: 1,
        why: "Starteftersynet er den korte kontrol før udkørsel, når du selv har lavet det sidste beredskabseftersyn. Hvis en anden har lavet beredskabseftersynet, kan starteftersynet udelades den dag."
      },
      {
        module: "eftersyn",
        q: "Må de månedlige eftersyn udelades i to måneder i træk, hvis køretøjet ikke har været brugt?",
        options: [
          "Ja, hvis køretøjet står stille",
          "Nej – de kan udelades i en måned, men ikke i to på hinanden følgende måneder",
          "Ja, hvis underafdelingschefen godkender det",
          "Nej – de skal altid udføres hver måned"
        ],
        a: 1,
        why: "HRN 737-021 pkt. 104: Hvis køretøjet ikke har været anvendt i en kalendermåned, kan eftersynene udelades i den måned – men ikke i to på hinanden følgende måneder."
      },
      {
        module: "regler",
        q: "Hvad betyder det, at Forsvaret ikke er omfattet af den civile ADR-bekendtgørelse?",
        options: [
          "At der ikke gælder regler for transport af farligt gods",
          "At FMIBST 061-02 gælder, og at den bruger ADR som referencegrundlag med militære afvigelser",
          "At ADR aldrig må bruges",
          "At køreren selv kan vælge mellem ADR og FMIBST"
        ],
        a: 1,
        why: "Vejtransport med køretøjer, der tilhører de danske eller udenlandske væbnede styrker, er ikke omfattet af den civile bekendtgørelse. I stedet gælder FMIBST 061-02, som anvender ADR som referencegrundlag – med de afvigelser, der fremgår af bestemmelsen og tillæggene."
      },
      {
        module: "regler",
        q: "Hvem har efter færdselsloven ansvaret for, at køretøjet er i lovlig og forsvarlig stand?",
        options: ["Underafdelingschefen", "Føreren af køretøjet", "Sikkerhedsrådgiveren", "Synsvirksomheden"],
        a: 1,
        why: "Færdselslovens § 67, som HRN 737-021 citerer: Føreren skal til enhver tid være opmærksom på, at køretøjet er i forsvarlig stand – særligt styre-, bremse-, signal- og tegngivningsapparater samt lygter."
      },
      {
        module: "eftersyn",
        q: "Hvad er forskellen på “efterse” og “kontroller” i HRN 737-021?",
        options: [
          "De betyder det samme",
          "Efterse er visuel inspektion; kontroller er faktisk undersøgelse/afprøvning af komponenters tilstedeværelse, tilstand og funktion",
          "Efterse er kun for fagligt personel; kontroller er kun for køreren",
          "Kontroller betyder kun at læse i kontrolbogen"
        ],
        a: 1,
        why: "HRN 737-021 pkt. 106 definerer: Efterse = visuel inspektion. Kontroller = faktisk undersøgelse/afprøvning af komponenters tilstedeværelse, vedligeholdelsestilstand og funktionering. Afprøv = under kørsel/drift."
      },
      {
        module: "holdt",
        q: "Hvor dybt må man som udgangspunkt vade i terræn i fredstid uden særlig forberedelse?",
        options: ["1 x dækhøjde", "2 x dækhøjde", "3 x dækhøjde", "Altid 1 meter"],
        a: 1,
        why: "HRN 737-021 pkt. 106: Tilladt vadedybde i fredstid uden særlig forberedelse er for terræn 2 x dækhøjde og for vej 1 x dækhøjde."
      },
      {
        module: "holdt",
        q: "Hvilket eftersyn skal altid udføres efter kørsel i terræn, før du kører ud i færdselslovens område?",
        options: ["Starteftersyn", "Holdteftersyn", "Månedligt eftersyn 4", "Kun beredskabseftersyn"],
        a: 1,
        why: "HRN 737-021 pkt. 104: Holdteftersyn udføres altid efter kørsel i terræn, før udkørsel i færdselslovens gyldighedsområde."
      },
      {
        module: "klasse3",
        q: "Hvilket UN-nummer har diesel?",
        options: ["UN 1202", "UN 1203", "UN 1863", "UN 1017"],
        a: 0,
        why: "Diesel er UN 1202. Benzin/motor spirit er UN 1203, og Jet A-1/aviation turbine fuel er UN 1863. Kontroller altid den konkrete varedeklaration."
      },
      {
        module: "klasse3",
        q: "Hvilket UN-nummer har benzin?",
        options: ["UN 1202", "UN 1203", "UN 1863", "UN 3295"],
        a: 1,
        why: "Benzin er UN 1203. Det er en yderst brandfarlig væske med lavt flashpunkt og højt damptryk."
      },
      {
        module: "klasse3",
        q: "Hvilket UN-nummer har Jet A-1?",
        options: ["UN 1202", "UN 1203", "UN 1863", "UN 3454"],
        a: 2,
        why: "Jet A-1/aviation turbine fuel er UN 1863. Kontroller altid klassificeringen på transportdokumentet, da produkter og blandinger kan variere."
      },
      {
        module: "klasse3",
        q: "Hvor tæt på transport eller håndtering af farligt gods må der ikke ryges eller bruges åben ild?",
        options: ["5 meter", "10 meter", "30 meter", "100 meter"],
        a: 2,
        why: "FMIBST 061-02 tillæg H pkt. 2: Tobaksrygning, brug af e-cigaretter og åben ild er forbudt inden for en afstand af 30 meter – også i førerhuset."
      },
      {
        module: "tankvogn",
        q: "Hvornår betegnes en militær tankvogn til klasse 3 som FL eller AT?",
        options: [
          "Ved enhver transport af brændstof",
          "Ved faste tanke på mere end 1.000 liter eller tankcontainer med kapacitet på 3.000 liter eller derover",
          "Kun hvis den har påhængsvogn",
          "Kun hvis den kører internationalt"
        ],
        a: 1,
        why: "FMIBST 061-02 tillæg I pkt. 3: Militære køretøjer og påhængskøretøjer til klasse 3 i faste tanke på mere end 1.000 liter eller tankcontainer med kapacitet på 3.000 liter eller derover benævnes FL eller AT. Der skal være udstedt en ADR-godkendelsesattest."
      },
      {
        module: "tankvogn",
        q: "Hvad skal du gøre, før du tilslutter slangen ved læsning af brændstof?",
        options: [
          "Start pumpen for at kontrollere flowet",
          "Etablere jording/bonding og kontrollere forbindelsen",
          "Åbne alle ventiler på én gang",
          "Fjerne spildsættet, så det ikke er i vejen"
        ],
        a: 1,
        why: "Jording/bonding skal etableres og kontrolleres, før overførslen starter. Statisk elektricitet kan antænde brændstofdampe. Følg altid den lokale læsseinstruks."
      },
      {
        module: "tankvogn",
        q: "Hvad er det første, du gør, hvis du opdager en lækage under losning?",
        options: [
          "Kører hurtigt videre til værkstedet",
          "Stopper overførslen, advarer omgivelserne og begrænser spildet, hvis det er sikkert",
          "Tørrer op med en klud og fortsætter",
          "Åbner tanken for at udligne trykket"
        ],
        a: 1,
        why: "Stop overførslen først. Advar og begræns spild, hvis det kan gøres sikkert. Prioritér person- og brandfare, tilkald hjælp og følg beredskabsplanen. Kør ikke videre med en kendt lækage."
      },
      {
        module: "last",
        q: "Kræver intern transport af farligt gods inden for et afspærret garnisonsområde altid et transportdokument?",
        options: [
          "Ja, altid",
          "Nej, der stilles ikke krav om transportdokumentation, når betingelserne i FMIBST 061-02 pkt. 9.2 er opfyldt",
          "Kun hvis det er klasse 3",
          "Kun hvis der køres mere end 10 km"
        ],
        a: 1,
        why: "FMIBST 061-02 pkt. 9.2 opstiller en række betingelser for intern transport – herunder godkendt køretøj, tank godkendt efter ADR del 6, afmærkning, uddannet chauffør, ildslukker og udstyr. Der stilles ikke krav om transportdokumentation."
      },
      {
        module: "last",
        q: "Må håndværkerreglen bruges, når en chauffør kører diesel ud til en aktivitet, som chaufføren ikke selv deltager i?",
        options: [
          "Ja, hvis mængden er lille",
          "Ja, hvis der er tale om en militær øvelse",
          "Nej – hovedformålet vil være transport af farligt gods, ikke en underordnet del af chaufførens eget arbejde",
          "Ja, hvis chaufføren har ADR-uddannelse"
        ],
        a: 2,
        why: "FMIBST 061-02 tillæg A pkt. 6.1 bruger netop dette som eksempel på, hvornår håndværkerreglen ikke kan anvendes: Chaufføren kører ud med diesel til en aktivitet, hvor han/hun ikke selv skal deltage. Hovedformålet er transport af farligt gods."
      },
      {
        module: "koeretid",
        q: "Hvor lang må den sammenhængende køretid (rattid) være, før der som minimum skal holdes 1 times pause?",
        options: ["2 timer", "3 timer", "4,5 timer", "6 timer"],
        a: 2,
        why: "FKOBST H.061-0 pkt. 2.11.1: Kørere skal efter maks. 4½ timers kørsel (rattid) have mindst 1 times pause."
      },
      {
        module: "koeretid",
        q: "Hvad er den maksimale køretid ved daglig tjeneste efter FKOBST H.061-0?",
        options: [
          "2 x 4,5 timer = 9 timer, med mulighed for forlængelse på op til 1 time",
          "3 x 4,5 timer = 13,5 timer",
          "Altid 12 timer",
          "Kun 4,5 timer i alt"
        ],
        a: 0,
        why: "Ved daglig tjeneste må maksimal køretid ikke overstige to gange 4,5 timers kørsel. Den samlede køretid kan forlænges med maksimalt 1 time, såfremt forhold som at nå hjem eller nå en rasteplads taler for det."
      },
      {
        module: "koeretid",
        q: "Hvad er den maksimale køretid ved øvelsesvirksomhed?",
        options: ["2 x 4,5 timer", "3 x 4,5 timer = 13,5 timer", "Altid 9 timer", "Ingen øvre grænse"],
        a: 1,
        why: "FKOBST H.061-0 pkt. 2.11.1: Ved øvelsesvirksomhed må maksimal køretid ikke overstige tre gange 4,5 timers kørsel."
      },
      {
        module: "koeretid",
        q: "Hvor lang sammenhængende hvile skal alle kørere som minimum have mulighed for under øvelsesvirksomhed inden for hver 24 timer?",
        options: ["4 timer", "6 timer", "8 timer", "11 timer"],
        a: 1,
        why: "FKOBST H.061-0 pkt. 2.11.4: Under øvelsesvirksomhed skal alle kørere have mulighed for mindst seks timers sammenhængende hvile inden for hver periode på 24 timer. Den kan afbrydes/afkortes, hvis køreren i stedet får to hvileperioder af mindst fire timer."
      },
      {
        module: "koeretid",
        q: "Hvad gælder for personeltransport på lad/i container?",
        options: [
          "Køretiden må ikke planlægges at overstige 2 x 2 timer, og efter 2 timers kørsel skal der holdes mindst 30 minutters pause",
          "Der gælder samme regler som for al anden kørsel",
          "Der må køres 4,5 timer uden pause",
          "Der må ikke køres mere end 1 time i alt"
        ],
        a: 0,
        why: "FKOBST H.061-0 pkt. 2.11.5: Køretiden må ikke planlægges at overstige to gange to timer. Efter to timers kørsel skal der afholdes mindst 30 minutters pause."
      },
      {
        module: "godkendelse",
        q: "Hvor længe kan en dispensation efter FMIBST 061-02 maksimalt være gyldig ad gangen?",
        options: ["3 måneder", "6 måneder", "12 måneder", "24 måneder"],
        a: 2,
        why: "FMIBST 061-02 pkt. 13.1: Dispensationer kan maksimalt have en gyldighed på 12 måneder ad gangen."
      },
      {
        module: "godkendelse",
        q: "Hvad kræves for at dispensere fra det periodiske syn på et enkelt køretøj efter FKOBST H.061-0?",
        options: [
          "At køreren søger mundtligt",
          "At det sker af operative årsager, at det meddeles Forsvarskommandoen/Hærkommandoen og Forsvarets Bilsyn, og at en kopi indsættes i kontrolbogen",
          "At køretøjet er ældre end 10 år",
          "At køretøjet kun bruges på kasernen"
        ],
        a: 1,
        why: "FKOBST H.061-0 pkt. 7.3: Dispensation kan alene ske af operative årsager. Forud skal det meddeles Forsvarskommandoen/Hærkommandoen og Forsvarets Bilsyn og omfatte afbødende foranstaltninger, herunder periode. En kopi af dispensationen skal indsættes i køretøjets kontrolbog."
      }
    ],

    /* ------------------------------------------------------------------
       Scenarios
       ------------------------------------------------------------------ */
    scenarios: [
      {
        id: "laesning",
        title: "Læsning ved depotet",
        tag: "Tankvogn · klasse 3",
        situation: "Du holder ved depotet med tankvognen. Der skal læsses diesel. Anlægget er travlt, og en kollega råber, at du bare kan starte pumpen, fordi “den er klar”. Du kan se, at jordingsreelen hænger løst, og at spildsættet ligger under et par tomme paller.",
        choices: [
          { t: "Start læsningen med det samme – kollegaen kender anlægget.", ok: false, fb: "Nej. Jordingen er en sikkerhedsfunktion mod statisk elektricitet, og spildsættet skal være klart, før overførslen starter. Travlt er ikke et argument for at springe sikkerheden over." },
          { t: "Stop. Få jordingen kontrolleret og spildsættet gjort klar, før du åbner for produktet.", ok: true, fb: "Korrekt. Kontroller jording/bonding, spildsæt, slanger og dokumenter, før overførslen starter. Først derefter læsses der." },
          { t: "Lån en jordingsklemme fra en anden vogn og start, mens du finder spildsættet frem.", ok: false, fb: "Nej. Udstyret skal være kontrolleret og klart, før overførslen starter – ikke undervejs. Lån ikke ukontrolleret sikkerhedsudstyr." }
        ],
        debrief: "Ved læsning er rækkefølgen vigtig: dokumenter og produkt → sikker parkering → PPE → slanger/koblinger → jording → spildsæt → overførsel under opsyn."
      },
      {
        id: "laekage",
        title: "Lækage under losning",
        tag: "Tankvogn · havari",
        situation: "Under losning ved en enhed ser du en tydelig stråle diesel komme ud ved en kobling. Der ligger allerede en plet på asfalten. En person står tæt på med en cigaret i hånden.",
        choices: [
          { t: "Fortsæt losningen, mens du tilkalder en mekaniker – det går nok.", ok: false, fb: "Nej. En kendt lækage skal stoppes med det samme. Brandfare og miljøspild går forud for at få tømt tanken." },
          { t: "Stop overførslen, få personen væk fra cigaretten, advar omgivelserne og begræns spildet, hvis det er sikkert.", ok: true, fb: "Korrekt. Stop først. Fjern tændkilder, advar og begræns spild. Tilkald hjælp og følg beredskabsplanen. Meld hændelsen." },
          { t: "Skru op for pumpen, så resten kan komme ud hurtigere, og stop bagefter.", ok: false, fb: "Nej. Mere flow giver mere spild og større fare. Stop overførslen." }
        ],
        debrief: "Ved lækage: stop → advar → fjern tændkilder → begræns spild hvis sikkert → tilkald hjælp → meld. Kør aldrig videre med en kendt lækage."
      },
      {
        id: "defekt",
        title: "Defekt før udkørsel",
        tag: "Eftersyn · beslutning",
        situation: "Du har lavet starteftersyn. Bremselufttrykket falder langsomt, og ABS-lampen bliver ved med at lyse. Din chef siger, at “det plejer at gå over”, og at I er sent på den.",
        choices: [
          { t: "Kør forsigtigt og hold ekstra afstand – du kan nå det.", ok: false, fb: "Nej. En kendt bremsefejl er ikke noget, man kører videre med. Køretøjet er ikke i færdselssikkerhedsmæssig forsvarlig stand." },
          { t: "Meld fejlen, lad køretøjet stå og få den vurderet/udbedret, før du kører.", ok: true, fb: "Korrekt. Føreren skal melde fejl og mangler og sikre, at køretøjet er i forsvarlig stand, inden kørsel. En ordre om det modsatte er ikke en gyldig undskyldning." },
          { t: "Kør, men undlad at bruge anhængerens bremser.", ok: false, fb: "Nej. Det løser ikke fejlen og kan gøre køretøjet endnu farligere." }
        ],
        debrief: "Defekter skal meldes og håndteres. Du må ikke køre med en kendt fejl, der påvirker færdselssikkerheden – heller ikke fordi tiden er knap."
      },
      {
        id: "koeretid",
        title: "4 timer og 40 minutter",
        tag: "Køre- & hviletid",
        situation: "Du har kørt i 4 timer og 40 minutter. Der er 25 minutter til destinationen. Du føler dig frisk, og der er ingen planlagt pause i marchbefalingen.",
        choices: [
          { t: "Kør de sidste 25 minutter – du er under 5 timer.", ok: false, fb: "Nej. Efter maks. 4,5 timers kørsel skal der holdes mindst 1 times pause. Du er allerede over grænsen." },
          { t: "Stop ved første sikre sted og hold mindst 1 times pause, før du fortsætter.", ok: true, fb: "Korrekt. Grænsen er 4,5 timer. Pausen er ikke valgfri, fordi du føler dig frisk. Planlæg pausen i marchbefalingen." },
          { t: "Kør hurtigere, så du når frem før 5 timer.", ok: false, fb: "Nej. Hastighed løser ikke køretidsgrænsen og øger risikoen." }
        ],
        debrief: "Køretid er rattid. Efter 4,5 timer skal der mindst 1 times pause. Pauser kan deles i delpauser på mindst 15 minutter, hvoraf én skal være mindst 30 minutter."
      },
      {
        id: "faerge",
        title: "Færge med tankvogn",
        tag: "Rute · færge",
        situation: "I skal med færge, og der er kun én afgang, der passer. Du har ikke undersøgt, om færgen må medtage farligt gods. Bilen holder i køen, og boarding starter om fem minutter.",
        choices: [
          { t: "Kør om bord – det er en militær tankvogn, så det er sikkert tilladt.", ok: false, fb: "Nej. Før færgetransport skal det undersøges ved rederiet, om farligt gods kan medtages, og hvilket regelsæt der anvendes." },
          { t: "Få afklaret med rederiet, om lasten må med, og hvilke krav der gælder – før boarding.", ok: true, fb: "Korrekt. FMIBST 061-02 pkt. 10 kræver, at du undersøger det ved rederiet og afklarer regelsættet, før transporten." },
          { t: "Dæk orange plader til og kør om bord, så det ikke bliver opdaget.", ok: false, fb: "Nej. Det er både ulovligt og farligt. Mærkning og rederiets regler skal følges." }
        ],
        debrief: "Færge er ikke bare en vej. Spørg rederiet først, afklar regelsæt og planlæg ruten, så du ikke står i køen uden svar."
      },
      {
        id: "haandvaerker",
        title: "Diesel til øvelsen",
        tag: "Transportregel · fritagelse",
        situation: "En kollega spørger, om du ikke lige kan køre en dunk diesel ud til øvelsespladsen. Du skal ikke selv deltage i øvelsen. Han mener, at det er “håndværkerreglen”, fordi det kun er en lille mængde.",
        choices: [
          { t: "Ja, det er håndværkerreglen, fordi mængden er lille.", ok: false, fb: "Nej. Håndværkerreglen kræver, at transporten er en underordnet del af dit eget arbejde. Kører du ud med diesel til en aktivitet, du ikke selv deltager i, er hovedformålet transport af farligt gods." },
          { t: "Nej – det er som udgangspunkt ikke håndværkerreglen. Afklar transportregel med den ansvarlige/sikkerhedsrådgiveren.", ok: true, fb: "Korrekt. FMIBST 061-02 tillæg A pkt. 6.1 bruger netop dette som eksempel på, at håndværkerreglen ikke kan anvendes. Vælg den korrekte transportregel – og brug dispensation, hvis det er nødvendigt." },
          { t: "Ja, hvis du bare kører uden at have ADR-bevis med.", ok: false, fb: "Nej. Manglende uddannelse gør ikke transporten lovlig. Det gør den bare ulovlig på flere punkter." }
        ],
        debrief: "Fritagelser er ikke smuthuller. Håndværkerreglen handler om, at transporten er underordnet dit eget arbejde – ikke om at mængden “føles lille”."
      }
    ],

    /* ------------------------------------------------------------------
       Glossary
       ------------------------------------------------------------------ */
    glossary: [
      { t: "ADR", d: "Den internationale konvention om transport af farligt gods ad vej. Bruges som teknisk referencegrundlag i FMIBST 061-02." },
      { t: "FMIBST 061-02", d: "Forsvarsministeriets bestemmelse for vejtransport af farligt gods. Gælder for Forsvarsministeriets koncern og anvender ADR med militære afvigelser." },
      { t: "FKOBST H.061-0", d: "Bestemmelse om færdselssikkerhed i Forsvaret. Dækker bl.a. køre-/hviletid, køretøjers godkendelse, uheld og import/eksport." },
      { t: "HRN 737-021", d: "Hjulkøretøjer – Eftersyn. Kørerens eftersyns- og vedligeholdelsestjeneste: beredskab, start, holdt, vadning og månedlige eftersyn." },
      { t: "HRN 202-051", d: "Forsvarets køreruddannelse. Beskriver bl.a. basisuddannelse, supplerende uddannelse og specialkøretøjer." },
      { t: "Brugereftersyn", d: "De eftersyn køreren selv udfører: daglige (beredskab, start, holdt), særlige (vadning) og månedlige (1–4)." },
      { t: "Fagligt eftersyn", d: "Eftersyn gennemført af fagligt personel. Indhold og terminer fremgår af HMAK-publikationer." },
      { t: "Beredskabseftersyn", d: "Det grundlæggende daglige eftersyn. Udføres ved hjemkomst, før udkørsel hvis du ikke selv har lavet det sidste, efter mere end 7 dage eller én gang i døgnet ved konstant brug." },
      { t: "Starteftersyn", d: "Kontrol før udkørsel, når køreren selv har udført det sidste beredskabseftersyn. Dokumenteres i kontrolbog “S”." },
      { t: "Holdteftersyn", d: "Eftersyn efter behov undervejs – og altid efter terrænkørsel, før udkørsel i færdselslovens område. Dokumenteres i kontrolbog “H”." },
      { t: "Vadning", d: "Passage af et vandareal, kørende på bunden og uden særlig klargøring. Tilladt dybde i fredstid: terræn 2 x dækhøjde, vej 1 x dækhøjde." },
      { t: "Efterse", d: "Visuel inspektion. Se efter tilstedeværelse, skader, lækager og åbenlyse fejl." },
      { t: "Kontroller", d: "Faktisk undersøgelse/afprøvning af komponenters tilstedeværelse, vedligeholdelsestilstand og funktion." },
      { t: "Afprøv", d: "Prøv funktionen under kørsel/drift – f.eks. bremser og styretøj." },
      { t: "FL / AT", d: "Militære køretøjer/påhængskøretøjer til klasse 3 i faste tanke over 1.000 liter eller tankcontainer på 3.000 liter eller mere. Kræver ADR-godkendelsesattest." },
      { t: "ADR-godkendelsesattest", d: "Attest udstedt af synsvirksomheden for køretøjets godkendelse efter ADR. Skal medbringes på den transporterende enhed, hvor det er relevant." },
      { t: "Klasse 3", d: "Brandfarlige væsker. Omfatter bl.a. benzin (UN 1203), diesel (UN 1202) og Jet A-1 (UN 1863)." },
      { t: "Flashpoint", d: "Den laveste temperatur, hvor en væske afgiver dampe, der kan antændes. Lavt flashpoint = større fare ved normal temperatur." },
      { t: "UN-nummer", d: "Firecifret nummer, der identificerer det farlige gods. Skal fremgå af transportdokument og mærkning." },
      { t: "Orange plade", d: "Fareskilt på køretøjet med fareidentifikationsnummer og UN-nummer. Skal matche lasten." },
      { t: "Bonding / jording", d: "Elektrisk forbindelse mellem køretøj, tank og anlæg, så statisk elektricitet kan ledes væk før og under overførsel." },
      { t: "PTO", d: "Power Take-Off. Kraftudtag der driver f.eks. pumpe eller andet udstyr fra motoren." },
      { t: "Overfyldningsbeskyttelse", d: "System der skal forhindre, at tanken fyldes ud over sikkerhedsgrænsen. Må ikke være eneste kontrol – overvåg selv niveauet." },
      { t: "Intern transport", d: "Transport inden for et særligt afspærret/indhegnet garnisons-, havne-, lufthavns- eller kombiterminalområde, når betingelserne i FMIBST 061-02 pkt. 9.2 er opfyldt." },
      { t: "Små mængder", d: "Særlig ordning for udvalgte ammunitionstyper og mængder efter tabellerne i FMIBST 061-02 tillæg A pkt. 4. Omfatter ikke brændstof i tankvogn." },
      { t: "Håndværkerreglen", d: "Undtagelse i ADR pkt. 1.1.3.1(c), hvor transport af farligt gods er en underordnet del af personens eget arbejde. Kræver forudgående vejledning og overholdelse af mængdegrænser." },
      { t: "Taktisk transport", d: "Transport af farligt gods på køretøjer knyttet til styrkeproduktion, indsættelse, øvelser og uddannelse. Kræver skriftlig autorisation." },
      { t: "TIFT", d: "Troops in Fighting Trim. NATO-ordning for transport af farligt gods i “ready to use”-konfiguration under operationer og øvelser. Kræver forudgående skriftlig godkendelse fra NMCA." },
      { t: "Dispensation", d: "Midlertidig tilladelse til specifik beskrevne fravigelser. Efter FMIBST 061-02 maksimalt 12 måneder ad gangen." },
      { t: "NMCA", d: "National Military Competent Authority. I Danmark den nationale militære kompetente myndighed ved Myndighedssektionen, FMI." },
      { t: "SR", d: "Sikkerhedsrådgiver. Rådgiver vedr. transport af farligt gods og kan vejlede om fortolkning og anvendelse." },
      { t: "KSI", d: "Køretøjssikkerhedsinspektøren. Kan oplyse om køretøjets kategorisering, f.eks. type I/II eller FL/AT." },
      { t: "FGI", d: "Forsvarsministeriets Farligt Gods Sikkerhedsinspektør. Behandler bl.a. dispensationer og varige godkendelser." },
      { t: "EPI", d: "Forsvarsministeriets Eksplosivstofinspektør. Kompetent myndighed for klassificering af fareklasse 1." }
    ],

    /* ------------------------------------------------------------------
       Sources
       ------------------------------------------------------------------ */
    sources: [
      {
        code: "FKOBST",
        ref: "H.061-0",
        year: "2021-12",
        title: "Bestemmelse om færdselssikkerhed i Forsvaret",
        text: "Det overordnede færdselsregelsæt. Styrer bl.a. brugen af Forsvarets køretøjer, køre- og hviletid, godkendelse og syn, uheld og internationale forhold.",
        points: [
          "Pkt. 1.6.2: Forsvaret er ikke underlagt de civile køre- og hviletidsbestemmelser – Forsvarets egne regler gælder.",
          "Pkt. 2.11: 4,5 timers kørsel → 1 times pause; daglig tjeneste 2 x 4,5 timer; øvelse 3 x 4,5 timer; hvile 11 timer/6 timer.",
          "Pkt. 2.5.5: En ordre om at føre et køretøj uden kørekort/uddannelse eller uden at føle sig i stand til det er ulovlig.",
          "Pkt. 3.10–3.11 og 7.3: Farligt gods, ADR-attester og dispensation fra periodisk syn."
        ]
      },
      {
        code: "HRN",
        ref: "737-021",
        year: "2004-03",
        title: "Hjulkøretøjer – Eftersyn",
        text: "Kørerens eftersynsfolder. Beskriver brugereftersynene og de arbejder, køreren skal udføre – som huskeliste tilpasset det enkelte køretøj.",
        points: [
          "Pkt. 103: Brugereftersyn = daglige (beredskab, start, holdt), særlige (vadning) og månedlige (1–4).",
          "Pkt. 104: Hvornår de enkelte eftersyn iværksættes – bl.a. 7-dagesreglen og forbud mod to måneders udeladelse.",
          "Pkt. 201–203: De fulde tjeklister for beredskab, start og holdt.",
          "Pkt. 301–404: Vadning og månedlige eftersyn 1–4."
        ]
      },
      {
        code: "FMIBST",
        ref: "061-02",
        year: "2026-08",
        title: "Bestemmelse for vejtransport af farligt gods",
        text: "Forsvarsministeriets koncernbestemmelse for vejtransport af farligt gods. Anvender ADR som referencegrundlag med militære afvigelser og særbestemmelser.",
        points: [
          "Pkt. 3.1: Køretøjer, der tilhører de danske/udenlandske væbnede styrker, er ikke omfattet af den civile bekendtgørelse. FMIBST 061-02 gælder i stedet.",
          "Pkt. 4–5: Dokumenter og ADR-godkendelsesattest.",
          "Pkt. 9: Intern transport – betingelser og fritagelse for transportdokumentation.",
          "Pkt. 13: Dispensation og varig godkendelse, maks. 12 måneder.",
          "Tillæg A: Uddannelse, små mængder, håndværkerreglen, taktisk transport/TIFT og personlig udrustning.",
          "Tillæg D, H og I: Tanke/emballage, mandskab/udstyr (bl.a. 30 m rygning og ildslukkere) samt FL/AT og ADR-attest for klasse 3."
        ]
      },
      {
        code: "HRN",
        ref: "202-051",
        year: "2025-04",
        title: "Forsvarets køreruddannelse",
        text: "Reglement for køreruddannelsens opbygning, indhold og administration. Specialkøretøjer som tankvogn kan have merit eller kræve særskilt uddannelse.",
        points: [
          "Pkt. 1.6.4.6: Merit for uddannelse på specialkøretøjer som tankvogn kan udstedes af det ansvarlige kompetencecenter.",
          "Pkt. 3.6.8: Uddannelse til vejtransport af farligt gods følger FMI-bestemmelserne.",
          "Kapitel 2–3: Basisuddannelse og supplerende uddannelse, herunder specialkøretøjer og særligt udstyr."
        ]
      }
    ]
  };

  window.ACADEMY = ACADEMY;
})();
