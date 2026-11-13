# Tankakademiet

**FVT-FFU undervisningsmateriale** til Forsvarets brændstofkørere.

Tankakademiet er et interaktivt, dansksproget undervisningsforløb om køretøjseftersyn, køre- og hviletid, FMIBST 061-02 og transport af klasse 3 med tankvogn. Materialet er udarbejdet til intern oplæring og repetition i FVT-FFU-regi.

> Materialet er ikke en officiel publikation fra FVT, et ADR-bevis, et kørekort eller en myndighedsgodkendelse. Gældende bestemmelser, lokale ordrer og anlæggets instrukser har forrang og kan være strengere end det, der står her.

## Sådan åbner du materialet

Åbn `index.html` direkte i en moderne browser – fx Edge, Chrome eller Firefox.

Der er ingen server, installation eller build-proces. Alt fungerer via `file://`, og data gemmes lokalt i browserens `localStorage`.

## Indhold

- 13 moduler fra overblik og regler til tankvogn, last, køretid og godkendelse.
- 9 interaktive tjeklister med fejlmarkering, noter, udskrift og profilfiltrering.
- Marchplanlægger til køretid, pauser og hvile.
- Transportregel-guide med spørgsmål om bl.a. intern transport, fritagelser og dispensation.
- Scenarietræner med seks praksisnære forløb.
- 25-spørgsmåls eksamen med 80 % som beståelsesgrænse.
- Gennemførelsesbevis, der kan udskrives.
- Ordbog, søgning, lyst/mørkt tema og profilvalg.

## Profiler

Brugeren kan vælge et spor, så irrelevant indhold nedtones eller skjules:

- Tankvogn / tankcontainer
- Trailer / påhængsvogn
- Kran / specialkøretøj
- Personeltransport
- Vadning
- Administration / planlægning

Vadningsindhold kan skjules for brugere, der ikke har vadningsopgaver.

## Filer

```text
tankakademiet/
├─ index.html                 App-skål, navigation, footer og scriptrækkefølge
├─ README.md
└─ assets/
   ├─ styles.css              Layout, temaer, responsivitet og udskrift
   ├─ data.js                 Moduler, tjeklister, quiz, scenarier, ordbog og kilder
   ├─ views.js                Alle sider og modultekster
   ├─ app.js                  Routing, tilstand, interaktion, eksamen og udskrift
   └─ img/
      └─ fvt-emblem.svg       FVT's officielle emblem
```

`data.js`, `views.js` og `app.js` indlæses som klassiske scripts og må ikke ændres til ES-moduler, hvis materialet fortsat skal kunne åbnes direkte fra `file://`.

## FVT-grafik

FVT-emblemet er hentet fra Forsvarets hjemmeside:

- <https://www.forsvaret.dk/globalassets/fko---forsvaret/billeder/logoer/forsvarets-vedligeholdelsestjeneste_footer.svg>

Emblemet bruges som organisationsidentifikation for FVT/FVT-FFU. Der findes ikke et officielt kombineret FVT-FFU-logo i kildematerialet; teksten “FVT-FFU” er derfor sat som et tekstlockup ved siden af det officielle FVT-emblem.

## Kilder

Materialet tager udgangspunkt i:

- **FKOBST H.061-0** – Bestemmelse om færdselssikkerhed i Forsvaret.
- **FMIBST 061-02** – Bestemmelse for vejtransport af farligt gods.
- **HRN 737-021** – Hjulkøretøjer – Eftersyn.
- **HRN 202-051** – Forsvarets køreruddannelse.

Se siden **Kilder & forbehold** i materialet for en kort beskrivelse af hver publikation og forbeholdene omkring brug af indholdet.

## Nulstil progression

Al brugerdata ligger i browserens `localStorage` under:

- `tankakademiet.v1` – profil, gennemførte moduler, tjeklister og eksamensresultat.
- `tankakademiet.theme` – lyst eller mørkt tema.

Ryd de to nøgler i browserens udviklerværktøj, eller brug funktionen til nulstilling i materialet, hvis den er tilgængelig i den aktuelle version.

Ved levering af en ren kopi kan du også åbne siden i et privat vindue eller slette webstedsdata for `file://`-siden.

## Afgrænsning

Forløbet fokuserer på klasse 3 og tankvogne. Andre farliggodsklasser, ammunition og sprængstoffer er kun berørt, hvor det er nødvendigt for sammenhængen, og er ikke en del af forløbets kerneområde.

Gennemførelsesbeviset dokumenterer alene, at brugeren har gennemført dette undervisningsforløb og bestået den afsluttende eksamen. Det giver ikke ret til at føre et bestemt køretøj eller transportere farligt gods.
