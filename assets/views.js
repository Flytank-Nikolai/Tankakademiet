/* ==========================================================================
   TANKAKADEMIET — views
   Alle visninger er almindelige funktioner, der returnerer HTML-strenge.
   app.js står for routing, tilstand og interaktion efter render.
   ========================================================================== */

(function () {
  "use strict";

  const A = window.ACADEMY;

  /* ------------------------------------------------------------------
     Hjælpere
     ------------------------------------------------------------------ */
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));

  const modById = (id) => A.modules.find((m) => m.id === id);
  const modIndex = (id) => A.modules.findIndex((m) => m.id === id);
  const pct = (done, total) => (total ? Math.round((done / total) * 100) : 0);

  const tag = (text, cls) => `<span class="tag ${cls || ""}">${esc(text)}</span>`;

  const pill = (text, cls) => `<span class="pill ${cls || ""}">${esc(text)}</span>`;

  const callout = (title, body, cls) => `
    <div class="callout ${cls || ""}">
      <div class="callout-title">${esc(title)}</div>
      <p>${body}</p>
    </div>`;

  const block = (label, title, body, extra) => `
    <section class="block fade-up">
      <div class="block-head">
        <div>
          <div class="block-label">${esc(label)}</div>
          <h2>${title}</h2>
          ${extra ? `<p>${extra}</p>` : ""}
        </div>
      </div>
      ${body}
    </section>`;

  const infoCard = (num, title, body, footer) => `
    <article class="info-card">
      ${num ? `<span class="num">${esc(num)}</span>` : ""}
      <h3>${title}</h3>
      <p>${body}</p>
      ${footer || ""}
    </article>`;

  const accordion = (items, idPrefix) => `
    <div class="accordion">
      ${items.map((it, i) => `
        <div class="acc-item" data-acc>
          <button class="acc-btn" type="button" data-action="accordion" aria-expanded="false" aria-controls="${idPrefix}-${i}">
            <span class="acc-icon">+</span>
            <span>${esc(it.q)}</span>
          </button>
          <div class="acc-panel" id="${idPrefix}-${i}">${it.a}</div>
        </div>`).join("")}
    </div>`;

  const checklistsDone = (ctx, id) => {
    const cl = A.checklists[id];
    const st = ctx.state.checklists[id] || {};
    let done = 0;
    let total = 0;
    cl.groups.forEach((g) => g.items.forEach((it) => {
      total++;
      if (st[it.id] && st[it.id].done) done++;
    }));
    return { done, total };
  };

  /* ------------------------------------------------------------------
     Tjekliste-komponent
     ------------------------------------------------------------------ */
  const TAG_LABEL = {
    basis: "Almindeligt køretøj",
    kran: "Kran/spil",
    tank: "Tankvogn",
    wading: "Vadning"
  };

  function checklistHTML(id, ctx, opts) {
    const cl = A.checklists[id];
    if (!cl) return "";
    const st = ctx.state.checklists[id] || {};
    const profile = ctx.state.profile || "";
    const showAll = !!ctx.state.checklistShowAll;
    const isRelevant = (it) => {
      if (!profile || showAll) return true;
      if (!it.p || !it.p.length) return true;
      return it.p.includes(profile);
    };

    let total = 0;
    let visible = 0;
    let done = 0;
    let faults = 0;
    cl.groups.forEach((g) => g.items.forEach((it) => {
      total++;
      if (isRelevant(it)) visible++;
      const s = st[it.id] || {};
      if (s.done) done++;
      if (s.fault) faults++;
    }));

    const groupsHtml = cl.groups.map((g, gi) => {
      const items = g.items.filter((it) => opts && opts.printAll ? true : isRelevant(it));
      if (!items.length) return "";
      return `
        <div class="cl-group" data-cl-group>
          <div class="cl-group-head">
            <h3>${esc(g.title)}</h3>
            <span>${items.length} punkter</span>
          </div>
          <div class="cl-items">
            ${items.map((it) => {
              const s = st[it.id] || {};
              return `
                <div class="cl-item ${s.done ? "done" : ""} ${s.fault ? "fault" : ""}"
                     data-item="${esc(it.id)}"
                     data-profiles="${esc((it.p || []).join(" "))}">
                  <button class="cl-check" type="button" data-action="cl-check"
                          aria-pressed="${s.done ? "true" : "false"}"
                          aria-label="Markér punkt som udført">✓</button>
                  <div class="cl-copy">
                    <strong>${esc(it.text)}</strong>
                    ${it.detail ? `<small>${esc(it.detail)}</small>` : ""}
                    <div class="cl-tags">
                      ${it.tag ? tag(TAG_LABEL[it.tag] || it.tag, it.tag === "tank" ? "amber" : it.tag === "kran" ? "teal" : "") : ""}
                      ${it.critical ? tag("Sikkerhedskritisk", "red") : ""}
                    </div>
                  </div>
                  <div class="cl-side">
                    <button class="cl-fault" type="button" data-action="cl-fault"
                            aria-pressed="${s.fault ? "true" : "false"}">FEJL</button>
                  </div>
                  <div class="cl-note">
                    <textarea data-action="cl-note" rows="2"
                      placeholder="Beskriv fejlen og hvem den er meldt til…">${esc(s.note || "")}</textarea>
                  </div>
                </div>`;
            }).join("")}
          </div>
        </div>`;
    }).join("");

    const profileHint = !profile
      ? `<div class="cl-summary"><span>Vælg dit spor for at skjule punkter, der ikke gælder din køretøjstype.</span><button class="btn btn-ghost btn-sm" type="button" data-action="open-profile">Vælg spor</button></div>`
      : "";

    return `
      <div class="checklist-shell" data-checklist="${esc(id)}" data-show-all="${showAll ? "1" : "0"}">
        <div class="checklist-toolbar no-print">
          <div class="cl-progress">
            <div class="cl-ring" data-cl-ring style="--p:${pct(done, visible)}">
              <b data-cl-pct>${pct(done, visible)}%</b>
            </div>
            <div class="cl-meta">
              <strong>${esc(cl.title)}</strong>
              <small><span data-cl-count>${done}</span> af <span data-cl-total>${visible}</span> relevante punkter
                · <span data-cl-faults>${faults}</span> fejl · gemmes automatisk</small>
            </div>
          </div>
          <div class="checklist-actions">
            ${profile ? `<button class="btn btn-ghost btn-sm" type="button" data-action="cl-relevance">${showAll ? "Skjul ikke-relevante" : "Vis alle punkter"}</button>` : ""}
            <button class="btn btn-ghost btn-sm" type="button" data-action="cl-reset">Nulstil</button>
            <button class="btn btn-ghost btn-sm" type="button" data-action="cl-print">Udskriv</button>
          </div>
        </div>
        ${profileHint}
        <div class="cl-summary">
          <span><b>${esc(cl.code)}</b> · ${esc(cl.source)}</span>
          <span class="fault-count" data-cl-fault-line>${faults ? faults + " punkt(er) markeret som fejl" : "Ingen fejl markeret"}</span>
        </div>
        ${groupsHtml}
        <div class="callout teal">
          <div class="callout-title">Sådan bruger du listen</div>
          <p>${esc(cl.intro)}</p>
        </div>
      </div>`;
  }

  /* ------------------------------------------------------------------
     Forside
     ------------------------------------------------------------------ */
  const truckSVG = () => `
    <svg viewBox="0 0 520 300" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="tankMetal" x1="60" y1="80" x2="340" y2="210" gradientUnits="userSpaceOnUse">
          <stop stop-color="#2a3a4a"/><stop offset=".5" stop-color="#182430"/><stop offset="1" stop-color="#0d151d"/>
        </linearGradient>
      </defs>
      <path d="M18 250h484" stroke="rgba(141,161,179,.35)" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M28 262h96M176 262h80M300 262h60M402 262h82" stroke="rgba(141,161,179,.14)" stroke-width="2" stroke-linecap="round"/>
      <rect x="46" y="86" width="296" height="112" rx="55" fill="url(#tankMetal)" stroke="#ffb020" stroke-width="2"/>
      <path d="M112 87v110M176 87v110M240 87v110M304 87v110" stroke="rgba(255,176,32,.28)" stroke-width="1"/>
      <rect x="118" y="66" width="38" height="22" rx="9" fill="#101b25" stroke="#ffb020" stroke-width="1.6"/>
      <path d="M160 66v-9h10" stroke="#ffb020" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M60 206h278" stroke="#ffb020" stroke-width="2"/>
      <path d="M70 210v34M330 210v34" stroke="#8da1b3" stroke-width="3"/>
      <rect x="352" y="120" width="88" height="78" rx="10" fill="#16222d" stroke="#8da1b3" stroke-width="1.6"/>
      <path d="M362 130h52v30h-52z" fill="rgba(53,214,193,.14)" stroke="#35d6c1" stroke-width="1.3"/>
      <path d="M352 168h88v10h-88z" fill="rgba(255,176,32,.12)"/>
      <path d="M440 198h26v12h-26z" fill="#263544" stroke="#8da1b3" stroke-width="1.4"/>
      <path d="M52 118h-8v58h8M458 132h14v50h-14" stroke="#8da1b3" stroke-width="2"/>
      <circle cx="108" cy="214" r="28" fill="#0b131a" stroke="#8da1b3" stroke-width="2"/>
      <circle cx="108" cy="214" r="12" fill="#1b2834" stroke="#ffb020" stroke-width="1.4"/>
      <circle cx="192" cy="214" r="28" fill="#0b131a" stroke="#8da1b3" stroke-width="2"/>
      <circle cx="192" cy="214" r="12" fill="#1b2834" stroke="#ffb020" stroke-width="1.4"/>
      <circle cx="330" cy="214" r="28" fill="#0b131a" stroke="#8da1b3" stroke-width="2"/>
      <circle cx="330" cy="214" r="12" fill="#1b2834" stroke="#ffb020" stroke-width="1.4"/>
      <circle cx="432" cy="214" r="28" fill="#0b131a" stroke="#8da1b3" stroke-width="2"/>
      <circle cx="432" cy="214" r="12" fill="#1b2834" stroke="#ffb020" stroke-width="1.4"/>
      <path d="M204 140h30v22h-30z" fill="rgba(255,176,32,.09)" stroke="rgba(255,176,32,.45)" stroke-width="1.2"/>
      <path d="M237 151h4M281 151h4" stroke="#ffb020" stroke-width="1.2"/>
      <path d="M300 190c14 0 18 8 26 8" stroke="#35d6c1" stroke-width="2" stroke-linecap="round"/>
      <circle cx="326" cy="198" r="4" fill="#35d6c1"/>
      <path d="M64 150h16v14H64z" fill="none" stroke="rgba(141,161,179,.5)" stroke-width="1.2"/>
      <path d="M78 157h14" stroke="rgba(141,161,179,.5)" stroke-width="1.2"/>
      <text x="92" y="240" font-family="monospace" font-size="8" fill="#8da1b3">KLASSE 3 · FL/AT</text>
    </svg>`;

  function home(ctx) {
    const st = ctx.state;
    const total = A.modules.length;
    const done = A.modules.filter((m) => st.completed[m.id]).length;
    const progress = pct(done, total);
    const firstOpen = A.modules.find((m) => !st.completed[m.id]) || A.modules[A.modules.length - 1];
    const startIdx = Math.max(0, modIndex(firstOpen.id));
    const route = A.modules.slice(startIdx, startIdx + 5);
    const exam = st.exam || {};
    const nextLabel = done ? "Fortsæt forløbet" : "Start forløbet";

    return `
      <section class="hero fade-up">
        <div class="hero-copy">
          <div class="fvt-lockup">
            <img src="assets/img/fvt-emblem.svg" alt="" width="52" height="76">
            <span class="fvt-lockup-copy">
              <b>FVT-FFU</b>
              <small>Undervisningsmateriale</small>
            </span>
          </div>
          <div class="eyebrow">Brændstof · klasse 3 · Forsvaret</div>
          <h1>Fra kontrol til køretur – <span class="grad-text">uden genveje.</span></h1>
          <p class="lead">Et interaktivt forløb for dig, der skal føre tankvogn eller transportere klasse 3 i Forsvaret.
            Fire regelsæt, én arbejdsgang: eftersyn, last, dokumenter, køretid og beslutninger i den virkelige verden.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#/modul/${esc(firstOpen.id)}" data-link>${nextLabel} <span aria-hidden="true">→</span></a>
            <button class="btn btn-ghost" type="button" data-action="open-profile">Tilpas mit spor</button>
            <a class="btn btn-ghost" href="#/vaerktoejer" data-link>Værktøjer</a>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><b>${total}</b><span>moduler</span></div>
            <div class="hero-stat"><b>7</b><span>tjeklister</span></div>
            <div class="hero-stat"><b>25</b><span>eksamensspørgsmål</span></div>
            <div class="hero-stat"><b>80 %</b><span>for gennemførelse</span></div>
          </div>
        </div>
        <div class="hero-visual">
          ${truckSVG()}
          <span class="float-tag t1">FL / AT · ADR-attest</span>
          <span class="float-tag t2">Jording før overførsel</span>
        </div>
      </section>

      <div class="dash-grid">
        <section class="panel fade-up">
          <div class="panel-head">
            <div>
              <h2>Dit forløb</h2>
              <p>${done ? "Du er godt i gang. Fortsæt hvor du slap." : "Begynd med overblikket – eller gå direkte til dit ansvarsområde."}</p>
            </div>
            <span class="panel-link">${done}/${total} moduler</span>
          </div>
          <div class="progress-ring-wrap">
            <div class="progress-ring" style="--p:${progress}">
              <b>${progress}%</b><small>GENNEMFØRT</small>
            </div>
            <div class="progress-copy">
              <h3>${done === total ? "Forløbet er gennemført" : done ? "Næste skridt: " + esc(firstOpen.title) : "Start med den røde tråd"}</h3>
              <p>${exam.passed ? "Eksamen er bestået med " + esc(String(exam.best || 0)) + " %. Dit gennemførelsesbevis kan hentes under Eksamen." : "Modulerne kan læses i din egen rækkefølge. Aftryk markeres manuelt, når du har været igennem indholdet."}</p>
              <div class="row mt-16">
                <a class="btn btn-primary btn-sm" href="#/modul/${esc(firstOpen.id)}" data-link>${done ? "Fortsæt" : "Begynd her"} →</a>
                <a class="btn btn-ghost btn-sm" href="#/eksamen" data-link>Eksamen</a>
              </div>
            </div>
          </div>
          <hr class="rule">
          <div class="path-list">
            ${route.map((m) => {
              const isDone = !!st.completed[m.id];
              const active = m.id === firstOpen.id;
              return `
                <a class="path-item ${isDone ? "done" : ""} ${active ? "active" : ""}" href="#/modul/${esc(m.id)}" data-link>
                  <span class="path-num">${esc(m.num)}</span>
                  <span class="path-copy"><strong>${esc(m.title)}</strong><small>${esc(m.summary)}</small></span>
                  <span class="path-state">${isDone ? "Færdig" : active ? "Næste" : m.minutes + " min"}</span>
                </a>`;
            }).join("")}
          </div>
          <div class="row mt-16">
            <a class="btn btn-ghost btn-sm" href="#/moduler" data-link>Se alle moduler</a>
          </div>
        </section>

        <section class="panel fade-up">
          <div class="panel-head">
            <div>
              <h2>Fire principper</h2>
              <p>Gælder uanset køretøj og last.</p>
            </div>
          </div>
          <div class="principles">
            <div class="principle"><span class="principle-icon">1</span><div><h3>KONTROLLÉR FØR DU KØRER</h3><p>Eftersynet er ikke papir. Det er den eneste gang, du opdager fejlen, før den bliver en hændelse.</p></div></div>
            <div class="principle"><span class="principle-icon">2</span><div><h3>STOP VED MISTANKE</h3><p>Lækage, lugt, bremsefejl eller åben ventil: stop overførslen eller køretøjet og find årsagen.</p></div></div>
            <div class="principle"><span class="principle-icon">3</span><div><h3>DOKUMENTÉR OG MELD</h3><p>Kontrolbog, transportdokument og fejlmelding er en del af sikkerheden – ikke bureaukrati.</p></div></div>
            <div class="principle"><span class="principle-icon">4</span><div><h3>PLANLÆG KØRETIDEN</h3><p>4,5 timer er en hård grænse. Pausen skal ligge i marchplanen, før du kører.</p></div></div>
          </div>
          <div class="callout red">
            <div class="callout-title">Lokale ordrer kan være strengere</div>
            <p>Dette materiale er et læringsværktøj. Gældende bestemmelser, lokale ordrer og anlæggets instrukser har forrang – og kan være strengere end det, du ser her.</p>
          </div>
        </section>
      </div>

      ${block("Rød tråd", "Fire regelsæt, der i praksis er én arbejdsgang", `
        <div class="two-col">
          <div class="layer-stack">
            <a class="layer" href="#/modul/regler" data-link><span class="layer-badge">01</span><span><strong>Regler, roller & ansvar</strong><small>FMIBST 061-02 · FKOBST H.061-0</small></span><span>→</span></a>
            <a class="layer" href="#/modul/eftersyn" data-link><span class="layer-badge">02</span><span><strong>Eftersynssystemet</strong><small>HRN 737-021 · beredskab, start, holdt, vadning, månedligt</small></span><span>→</span></a>
            <a class="layer" href="#/modul/tankvogn" data-link><span class="layer-badge">07</span><span><strong>Tankvognen</strong><small>FL/AT · jording · ventiler · slanger · overførsel</small></span><span>→</span></a>
            <a class="layer" href="#/modul/last" data-link><span class="layer-badge">08</span><span><strong>Last & transportregler</strong><small>Dokumenter · intern transport · fritagelser · dispensation</small></span><span>→</span></a>
            <a class="layer" href="#/modul/koeretid" data-link><span class="layer-badge">09</span><span><strong>Køre- & hviletid</strong><small>4,5 timer · pause · daglig tjeneste · øvelse</small></span><span>→</span></a>
          </div>
          <div>
            <p class="muted" style="font-size:12.5px;line-height:1.7;margin-top:0">
              Rækkefølgen er ikke tilfældig. <b>Reglerne</b> fortæller, hvem der har ansvaret.
              <b>Eftersynet</b> sikrer, at køretøjet er klar. <b>Tankvognen</b> og <b>lasten</b> handler om at
              flytte brændstoffet uden at skabe en fare. <b>Køretiden</b> sikrer, at mennesket bag rattet også er klar.
            </p>
            <p class="muted" style="font-size:12.5px;line-height:1.7">
              På en tankvogn mødes alle fire i én arbejdsgang: Du kontrollerer køretøjet, kontrollerer tank og udstyr,
              kontrollerer dokumenter og mærkning, læsser under opsyn – og planlægger turen, så pauserne passer.
            </p>
            <div class="row mt-16">
              <a class="btn btn-primary btn-sm" href="#/modul/overblik" data-link>Læs overblikket</a>
              <a class="btn btn-ghost btn-sm" href="#/vaerktoejer" data-link>Se værktøjer</a>
            </div>
          </div>
        </div>
      `)}

      ${block("Moduloversigt", "Hele forløbet – grupperet efter tema", `
        <div class="two-col">
          ${A.groups.map((g) => `
            <div class="mb-16">
              <div class="block-label">${esc(g.label)}</div>
              <div class="path-list">
                ${g.modules.map((id) => {
                  const m = modById(id);
                  return `<a class="path-item ${st.completed[id] ? "done" : ""}" href="#/modul/${esc(id)}" data-link>
                    <span class="path-num">${esc(m.num)}</span>
                    <span class="path-copy"><strong>${esc(m.short)}</strong><small>${esc(m.subtitle)}</small></span>
                    <span class="path-state">${st.completed[id] ? "Færdig" : m.minutes + " min"}</span>
                  </a>`;
                }).join("")}
              </div>
            </div>`).join("")}
        </div>
      `)}

      <section class="block fade-up">
        <div class="row-between">
          <div>
            <div class="block-label">Afgrænsning</div>
            <h2 style="font-size:24px">Læring – ikke myndighedsgodkendelse</h2>
          </div>
          <a class="btn btn-ghost btn-sm" href="#/kilder" data-link>Kilder & forbehold</a>
        </div>
        <p class="muted" style="font-size:12.5px;line-height:1.7;max-width:850px">
          Tankakademiet er FVT-FFU-undervisningsmateriale til intern oplæring og repetition.
          Gennemførsel af forløbet giver ikke ADR-bevis, kørekort, militær godkendelse eller ret til at føre et bestemt køretøj.
          Det gør et gennemførelsesbevis heller ikke. Myndighedsgodkendelser, ADR-attester, syn og dispensationer udstedes og
          kontrolleres af de ansvarlige myndigheder og synsvirksomheder. Materialet tager udgangspunkt i de udleverede
          publikationer og kan ikke erstatte dem.
        </p>
      </section>`;
  }

  /* ------------------------------------------------------------------
     Modulramme
     ------------------------------------------------------------------ */
  function moduleView(ctx, id) {
    const m = modById(id);
    if (!m) return notFound();
    const idx = modIndex(id);
    const prev = A.modules[idx - 1];
    const next = A.modules[idx + 1];
    const done = !!ctx.state.completed[id];
    const body = MODULE_BODIES[id] || SPECIAL[id];

    return `
      <div class="module-head fade-up" data-num="${esc(m.num)}">
        <div class="module-head-top">
          ${pill("Modul " + m.num, "amber")}
          ${pill(m.minutes + " min")}
          ${done ? pill("Gennemført", "green") : ""}
        </div>
        <div class="eyebrow">${esc(A.groups.find((g) => g.id === m.group).label)}</div>
        <h1>${esc(m.title)}</h1>
        <p class="lead">${esc(m.summary)}</p>
        <div class="module-meta">
          <span><b>Kilde:</b> ${esc(m.source)}</span>
          <span><b>Fokus:</b> ${esc(m.subtitle)}</span>
        </div>
      </div>

      <div class="content">
        ${body ? body(ctx) : `<section class="block"><p class="muted">Indholdet er under opbygning.</p></section>`}

        <section class="block fade-up">
          <div class="row-between">
            <div>
              <div class="block-label">Afslutning</div>
              <h3 style="margin-bottom:4px">${done ? "Modulet er markeret som gennemført" : "Har du været igennem indholdet?"}</h3>
              <p class="muted" style="font-size:12px;margin:0">Markeringen er din egen progressionskontrol. Den erstatter ikke undervisning, certifikater eller godkendelser.</p>
            </div>
            <button class="btn ${done ? "btn-teal" : "btn-primary"}" type="button" data-action="complete" data-module="${esc(id)}">
              ${done ? "✓ Gennemført" : "Markér som gennemført"}
            </button>
          </div>
        </section>
      </div>

      <nav class="module-nav" aria-label="Modulnavigation">
        ${prev ? `<a href="#/modul/${esc(prev.id)}" data-link><small>← Forrige</small><strong>${esc(prev.title)}</strong></a>` : `<a href="#/" data-link><small>← Forside</small><strong>Overblik</strong></a>`}
        ${next ? `<a class="next" href="#/modul/${esc(next.id)}" data-link><small>Næste →</small><strong>${esc(next.title)}</strong></a>` : `<a class="next" href="#/eksamen" data-link><small>Næste →</small><strong>Eksamen & bevis</strong></a>`}
      </nav>`;
  }

  /* ==================================================================
     MODULINDHOLD
     ================================================================== */
  const MODULE_BODIES = {};

  /* ---- 00 Overblik ------------------------------------------------ */
  MODULE_BODIES.overblik = () => `
    ${block("Sammenhæng", "Du står ikke over for fire regelsæt. Du står over for én arbejdsgang.", `
      <p class="lead" style="font-size:15px">På papiret kommer kravene fra forskellige publikationer. I førerhuset og ved tanken
      smelter de sammen til en kæde af beslutninger, som du skal kunne tage i den rigtige rækkefølge.</p>
      <div class="three-col mt-16 stagger">
        ${infoCard("FØR", "Køretøjet skal være klar", "Beredskabs-, start- og holdteftersyn efter HRN 737-021. Fejl meldes, før køretøjet bruges.")}
        ${infoCard("UNDER", "Lasten skal være kontrolleret", "Produkt, mængde, dokumenter, mærkning, ventiler, jording og slanger efter FMIBST 061-02.")}
        ${infoCard("EFTER", "Mennesket skal holde", "Køre- og hviletid efter FKOBST H.061-0. Pauser planlægges – ikke improviseres.")}
      </div>
      <div class="quote">
        “Føreren skal til enhver tid være opmærksom på, at køretøjet er i forsvarlig stand.”
        <cite>Færdselsloven § 67, gengivet i HRN 737-021</cite>
      </div>
      ${callout("Den røde tråd", "Uanset om du laver beredskabseftersyn, læsser diesel eller planlægger en march, er spørgsmålet det samme: <b>Hvad kan gå galt nu – og hvad gør jeg ved det, før det sker?</b>")}
    `)}

    ${block("De fire kilder", "Hvad styrer hvad?", `
      <div class="two-col">
        ${infoCard("01", "FMIBST 061-02", "Forsvarsministeriets bestemmelse for vejtransport af farligt gods. Gælder for Forsvarsministeriets koncern og bruger ADR som teknisk reference med militære afvigelser.", `<div class="tag amber">Farligt gods · tank · dokumenter</div>`)}
        ${infoCard("02", "HRN 737-021", "Hjulkøretøjer – Eftersyn. Kørerens brugereftersyn: beredskab, start, holdt, vadning og månedlige eftersyn 1–4.", `<div class="tag teal">Eftersyn · kontrolbog</div>`)}
        ${infoCard("03", "FKOBST H.061-0", "Bestemmelse om færdselssikkerhed i Forsvaret. Bl.a. køre-/hviletid, godkendelse og syn, uheld og internationale forhold.", `<div class="tag">Kørsel · godkendelse</div>`)}
        ${infoCard("04", "HRN 202-051", "Forsvarets køreruddannelse. Beskriver basis- og supplerende uddannelse, herunder specialkøretøjer som tankvogn.", `<div class="tag">Uddannelse · kompetence</div>`)}
      </div>
      ${callout("Vigtigt om ADR", "Forsvaret er ikke omfattet af den civile ADR-bekendtgørelse. Det betyder <b>ikke</b>, at der ikke gælder regler. FMIBST 061-02 gælder i stedet – og den bruger ADR som referencegrundlag. Derfor kan du møde ADR-begreber, tabeller og krav, selv om det formelle grundlag er den militære bestemmelse.", "teal")}
    `)}

    ${block("Kompetenceniveauer", "Fra grundkører til klasse 3-specialist", `
      <div class="layer-stack">
        <div class="layer"><span class="layer-badge">NIVEAU 1</span><span><strong>Grundkører</strong><small>Køretøjseftersyn, færdselsregler, køre- og hviletid. Kan føre køretøjet forsvarligt og melde fejl.</small></span><span>Alle</span></div>
        <div class="layer"><span class="layer-badge">NIVEAU 2</span><span><strong>Tankvognskører</strong><small>Klasse 3, FL/AT, ADR-attest, jording, ventiler, slanger, læsning/losning og spildhåndtering.</small></span><span>Tankprofil</span></div>
        <div class="layer"><span class="layer-badge">NIVEAU 3</span><span><strong>Klasse 3-specialist</strong><small>Transportregler, fritagelser, dispensation, færge, intern transport og sikkerhedsmæssig dømmekraft under pres.</small></span><span>Mål</span></div>
      </div>
      <p class="muted mt-16" style="font-size:12.5px">Forløbet peger mod niveau 3, men det er stadig kun undervisning. Den formelle uddannelse og godkendelse ligger uden for denne side.</p>
    `)}

    ${block("Sådan bruger du forløbet", "Vælg dit spor – og spring kun det over, du reelt ikke møder", `
      <div class="two-col">
        <div>
          <p class="muted" style="font-size:12.5px;line-height:1.7">Klik på <b>dit spor</b> i sidebaren. Så filtreres tjeklisterne, så
          tankvognspunkter, kranpunkter eller vadningspunkter vises efter relevans. Du kan altid slå “vis alle punkter” til.</p>
          <p class="muted" style="font-size:12.5px;line-height:1.7">Vadning er et typisk eksempel: Mange kørere møder det aldrig.
          Modulet forklarer det stadig, fordi det er en del af eftersynssystemet – men du kan folde det væk og springe tjeklisten over.</p>
        </div>
        <div class="principles">
          <div class="principle"><span class="principle-icon">→</span><div><h3>LÆS</h3><p>Følg modulerne i rækkefølge første gang. De bygger på hinanden.</p></div></div>
          <div class="principle"><span class="principle-icon">✓</span><div><h3>TRÆN</h3><p>Brug tjeklister, marchplanlægger og scenarier. Det er der, viden bliver til handling.</p></div></div>
          <div class="principle"><span class="principle-icon">◎</span><div><h3>TEST</h3><p>Afslut med 25 spørgsmål. Du skal have mindst 80 % rigtige for gennemførelsesbeviset.</p></div></div>
        </div>
      </div>
    `)}`;

  /* ---- 01 Regler, roller & ansvar --------------------------------- */
  MODULE_BODIES.regler = () => `
    ${block("Retligt grundlag", "Hvem bestemmer – og hvad betyder “fritaget”?", `
      <p class="lead" style="font-size:15px">Den vigtigste nuance i hele forløbet: Forsvaret er ikke omfattet af den civile
      ADR-bekendtgørelse. Men det er ikke det samme som “ingen regler”.</p>
      <div class="two-col mt-16">
        <div>
          <h3>Civil vejtransport</h3>
          <p class="muted" style="font-size:12.5px;line-height:1.7">Transport af farligt gods ad vej er som udgangspunkt reguleret af
          ADR og den danske bekendtgørelse herom. Virksomheder har bl.a. sikkerhedsrådgiver, uddannelse, dokumentation og
          køretøjsgodkendelse.</p>
        </div>
        <div>
          <h3>Militær vejtransport</h3>
          <p class="muted" style="font-size:12.5px;line-height:1.7">Køretøjer, der tilhører de danske eller udenlandske væbnede styrker,
          er ikke omfattet af den civile bekendtgørelse. I stedet gælder <b>FMIBST 061-02</b> for Forsvarsministeriets koncern –
          med ADR som referencegrundlag og militære afvigelser.</p>
        </div>
      </div>
      ${callout("Praktisk oversættelse", "Du kan derfor ikke bruge “det er militært” som begrundelse for at springe sikkerheden over. Du skal kende den militære bestemmelse, de lokale ordrer og de krav, som FMIBST 061-02 stiller – og ADR bruges som det faglige referencepunkt, når bestemmelsen henviser til det.", "red")}
      <div class="table-wrap mt-16">
        <table>
          <thead><tr><th>Spørgsmål</th><th>Svar</th><th>Grundlag</th></tr></thead>
          <tbody>
            <tr><td>Gælder civil ADR direkte for Forsvaret?</td><td>Nej, køretøjer tilhørende væbnede styrker er ikke omfattet af den civile bekendtgørelse.</td><td>FMIBST 061-02 pkt. 3.1</td></tr>
            <tr><td>Gælder der så ingen regler?</td><td>Jo. FMIBST 061-02 gælder, og ADR anvendes som reference.</td><td>FMIBST 061-02 pkt. 3</td></tr>
            <tr><td>Kan lokale ordrer være strengere?</td><td>Ja. Lokale ordrer, anlægsinstrukser og køretøjsbetjening kan stille skrappere krav.</td><td>Lokal instruks</td></tr>
            <tr><td>Hvem har ansvaret i sidste ende?</td><td>Føreren har ansvaret for, at køretøjet er i forsvarlig stand, og skal melde fejl og mangler.</td><td>Færdselsloven § 67 · HRN 737-021</td></tr>
          </tbody>
        </table>
      </div>
    `)}

    ${block("Roller", "Hvem gør hvad – og hvem kan du spørge?", `
      <div class="three-col">
        ${infoCard("FØRER", "Dig", "Udfører eftersyn, kontrollerer last og dokumenter, kører efter reglerne, stopper ved fare og melder fejl og hændelser.")}
        ${infoCard("CHEF", "Underafdelingschef / ansvarlig", "Sikrer rammerne: ordrer, kompetence, køretøjer, planlægning og opfølgning på fejl. Kan ikke give en ulovlig ordre.")}
        ${infoCard("SR", "Sikkerhedsrådgiver", "Rådgiver om transport af farligt gods, fortolkning, fritagelser og dispensationer. Spørg før – ikke efter.")}
        ${infoCard("KSI", "Køretøjssikkerhedsinspektør", "Kan oplyse om køretøjets kategorisering, f.eks. type I/II eller FL/AT, og om godkendelsesforhold.")}
        ${infoCard("FGI", "Farligt Gods Sikkerhedsinspektør", "Behandler bl.a. dispensationer og varige godkendelser inden for farligt gods.")}
        ${infoCard("SYN", "Synsvirksomhed", "Udfører periodisk syn og udsteder ADR-godkendelsesattest efter de gældende regler.")}
      </div>
      ${callout("NMCA og EPI", "<b>NMCA</b> er den nationale militære kompetente myndighed (Myndighedssektionen, FMI). <b>EPI</b> er Forsvarsministeriets Eksplosivstofinspektør og kompetent myndighed for fareklasse 1. Du møder dem især ved dispensationer, taktisk transport og klassificering – ikke i den daglige tankrutine.", "teal")}
    `)}

    ${block("Ansvar", "Tre ting du ikke kan delegere væk", `
      <div class="three-col">
        ${infoCard("01", "Forsvarlig stand", "Du skal være opmærksom på, at køretøjet er i forsvarlig stand – særligt styre-, bremse-, signal- og tegngivningsapparater samt lygter.")}
        ${infoCard("02", "Meldepligt", "Fejl og mangler skal meldes. Det gælder også, når det er besværligt, og når tiden er knap.")}
        ${infoCard("03", "Stoppe", "Du må ikke køre videre eller fortsætte en overførsel med en kendt fare. Stop er altid en gyldig beslutning.")}
      </div>
      <div class="quote">
        “En ordre om at føre et køretøj uden fornøden uddannelse, eller uden at føreeren føler sig i stand til det, er ulovlig.”
        <cite>FKOBST H.061-0 pkt. 2.5.5 – gengivet som princip</cite>
      </div>
      <p class="muted" style="font-size:12.5px">Derfor er “chefen sagde, at jeg skulle” ikke et forsvar for at køre med en kendt bremsefejl,
      en utæt tank eller uden den nødvendige kompetence.</p>
    `)}

    ${block("Dokumenter", "Hvad skal du kunne finde – og hvornår?", `
      <div class="accordion">
        <div class="acc-item" data-acc>
          <button class="acc-btn" type="button" data-action="accordion" aria-expanded="false"><span class="acc-icon">+</span><span>Transportdokument</span></button>
          <div class="acc-panel"><p>Følger lasten og beskriver bl.a. UN-nummer, fareklasse, mængde, emballage/tank og afsender/modtager.
          Ved intern transport efter FMIBST 061-02 pkt. 9.2 stilles der ikke krav om transportdokumentation, når betingelserne er opfyldt.</p></div>
        </div>
        <div class="acc-item" data-acc>
          <button class="acc-btn" type="button" data-action="accordion" aria-expanded="false"><span class="acc-icon">+</span><span>ADR-godkendelsesattest</span></button>
          <div class="acc-panel"><p>Attesten dokumenterer køretøjets godkendelse efter ADR og skal medbringes på den transporterende enhed, hvor det er relevant.
          For FL/AT til klasse 3 skal der være udstedt en ADR-godkendelsesattest. Kontroller gyldighed og tankens testdatoer.</p></div>
        </div>
        <div class="acc-item" data-acc>
          <button class="acc-btn" type="button" data-action="accordion" aria-expanded="false"><span class="acc-icon">+</span><span>Kontrolbog</span></button>
          <div class="acc-panel"><p>Kvittering for udførte brugereftersyn: B (beredskab), S (start), H (holdt), EV (vadning) og 1–4 (månedligt).
          Fejlmeldinger og dispensationer kan også skulle indsættes her.</p></div>
        </div>
        <div class="acc-item" data-acc>
          <button class="acc-btn" type="button" data-action="accordion" aria-expanded="false"><span class="acc-icon">+</span><span>Dispensation og tilladelser</span></button>
          <div class="acc-panel"><p>Skal være skriftlig, tidsbegrænset og dække præcis det, der dispensereres fra. Efter FMIBST 061-02 maksimalt 12 måneder ad gangen.
          Lokale tilladelser og anlæggets instrukser kommer oveni.</p></div>
        </div>
      </div>
    `)}

    ${block("Myter", "Fire ting, der ikke holder", `
      ${accordion([
        { q: "“Militære køretøjer er fritaget, så ADR gælder ikke.”", a: "<p>Nej. Den civile bekendtgørelse gælder ikke for køretøjer tilhørende væbnede styrker, men FMIBST 061-02 gælder – og bruger ADR som reference. Fritagelsen er et andet regelsæt, ikke et tomrum.</p>" },
        { q: "“Hvis jeg har kørekort, må jeg køre alt.”", a: "<p>Nej. Specialkøretøjer og transport af farligt gods kræver den relevante uddannelse og kompetence. HRN 202-051 beskriver bl.a. supplerende uddannelse og specialkøretøjer.</p>" },
        { q: "“Chefen kan godkende, at vi springer et eftersyn over.”", a: "<p>Nej. Eftersynsordningen og kravet om forsvarlig stand er ikke noget, den enkelte chef kan sætte til side. En ulovlig ordre skal ikke følges.</p>" },
        { q: "“En lille mængde brændstof er altid omfattet af håndværkerreglen.”", a: "<p>Nej. Håndværkerreglen kræver, at transporten er en underordnet del af dit eget arbejde. Kører du diesel ud til en aktivitet, du ikke selv deltager i, er hovedformålet transport af farligt gods.</p>" }
      ], "regler-myter")}
    `)}`;

  /* ---- 02 Eftersynssystemet --------------------------------------- */
  MODULE_BODIES.eftersyn = () => `
    ${block("Grundbegreber", "Efterse, kontrollere, afprøve – tre forskellige ting", `
      <p class="lead" style="font-size:15px">HRN 737-021 skelner mellem at se, at undersøge og at prøve funktionen i drift.
      Forskellen er ikke ordkløveri: Den afgør, om du har gjort det, du skulle.</p>
      <div class="three-col mt-16">
        ${infoCard("EFTerse", "Visuel inspektion", "Se efter tilstedeværelse, skader, lækager, slid og åbenlyse fejl. Du bruger øjne, lugt og i nogle tilfælde hænder – men du starter ikke systemet.")}
        ${infoCard("KONTROLLER", "Faktisk undersøgelse", "Undersøg og afprøv komponentens tilstedeværelse, vedligeholdelsestilstand og funktion. F.eks. bremselufttryk, lys og kobling.")}
        ${infoCard("AFPRØV", "Prøv under drift", "Prøv funktionen, mens køretøjet kører eller systemet er i drift – f.eks. bremser ved lav hastighed og styretøj.")}
      </div>
      ${callout("Hvorfor det betyder noget", "“Jeg kiggede på bremsen” er ikke det samme som “jeg afprøvede bremsen”. Tjeklisten siger <b>kontroller og afprøv</b>, når funktionen skal testes – ikke bare ses.", "teal")}
    `)}

    ${block("Systemet", "Fem typer brugereftersyn – og hvornår de udløses", `
      <div class="table-wrap">
        <table>
          <thead><tr><th>Eftersyn</th><th>Udføres når</th><th>Kontrolbog</th><th>Typisk profil</th></tr></thead>
          <tbody>
            <tr><td><b>Beredskab</b></td><td>Ved hjemkomst. Før udkørsel, hvis du ikke selv har udført det sidste. Hvis der er gået mere end 7 dage. Én gang i døgnet ved længere tids konstant brug.</td><td>B</td><td>Alle</td></tr>
            <tr><td><b>Start</b></td><td>Før udkørsel, når du selv har udført det sidste beredskabseftersyn. Den korte kontrol af det, der kan være ændret.</td><td>S</td><td>Alle</td></tr>
            <tr><td><b>Holdt</b></td><td>Efter behov undervejs – og <b>altid</b> efter kørsel i terræn, før udkørsel i færdselslovens område.</td><td>H</td><td>Alle</td></tr>
            <tr><td><b>Vadning</b></td><td>Efter vadning eller kørsel i vand. Udføres i forlængelse af holdteftersynet.</td><td>EV / EV+</td><td>Kun ved vadning</td></tr>
            <tr><td><b>Månedligt 1–4</b></td><td>Månedligt efter den rullende ordning. Kan udelades i en måned, hvor køretøjet ikke har været anvendt – men ikke to måneder i træk.</td><td>1 / 2 / 3 / 4</td><td>Alle</td></tr>
          </tbody>
        </table>
      </div>
      ${callout("To regler, der ofte huskes forkert", "<b>7 dage:</b> Beredskabseftersyn skal udføres, hvis der er gået mere end 7 dage.<br><b>To måneder:</b> Månedseftersyn kan springes over i én ubrugt måned – aldrig i to på hinanden følgende måneder.", "red")}
    `)}

    ${block("Beslutningshjælp", "Beredskab eller start – eller begge?", `
      <div class="steps">
        <div class="step"><span class="step-num">1</span><div><h3>Har du selv lavet det sidste beredskabseftersyn?</h3><p>Ja → du kan nøjes med starteftersyn før udkørsel. Nej → lav beredskabseftersyn først.</p></div></div>
        <div class="step"><span class="step-num">2</span><div><h3>Er der gået mere end 7 dage siden sidste beredskabseftersyn?</h3><p>Ja → beredskabseftersyn skal udføres, uanset hvem der lavede det sidste.</p></div></div>
        <div class="step"><span class="step-num">3</span><div><h3>Har køretøjet kørt i terræn?</h3><p>Ja → holdteftersyn skal udføres, før du kører ud i færdselslovens område.</p></div></div>
        <div class="step"><span class="step-num">4</span><div><h3>Har køretøjet været i vand?</h3><p>Ja → vadningseftersyn (EV) i forlængelse af holdteftersynet – og EV+ efter hjemkomst.</p></div></div>
        <div class="step"><span class="step-num">5</span><div><h3>Er det en ny måned?</h3><p>Så skal det månedlige eftersyn efter planen gennemføres – medmindre køretøjet ikke har været brugt i den pågældende måned.</p></div></div>
      </div>
      <div class="row mt-16">
        <a class="btn btn-primary btn-sm" href="#/tjeklister" data-link>Åbn tjekliste-center</a>
        <a class="btn btn-ghost btn-sm" href="#/modul/beredskab" data-link>Gå til beredskabseftersyn</a>
      </div>
    `)}

    ${block("Vadning", "Det sjældne specialtilfælde – og hvorfor du stadig skal kende det", `
      <div class="two-col">
        <div>
          <p class="muted" style="font-size:12.5px;line-height:1.7">Vadning er passage af et vandareal, hvor køretøjet kører på bunden
          uden særlig klargøring. Mange kørere møder det aldrig i deres daglige tjeneste. Derfor kan du filtrere vadningspunkterne væk
          i tjeklisterne – men du skal kende grænserne, hvis opgaven opstår.</p>
          <p class="muted" style="font-size:12.5px;line-height:1.7">Tilladt vadedybde i fredstid uden særlig forberedelse er
          <b>2 x dækhøjde i terræn</b> og <b>1 x dækhøjde på vej</b>. Ved dybere vand kræves særlig forberedelse og vurdering.</p>
        </div>
        <div>
          <div class="callout red" style="margin-top:0">
            <div class="callout-title">Vand skjuler fejl</div>
            <p>Bremser, hjullejer, elektriske stik og jordingsudstyr kan tage skade uden at fejlen er synlig med det samme.
            Afprøv bremserne efter passage, og meld unormale lyde eller fugt i lygter og olie.</p>
          </div>
          <a class="btn btn-ghost btn-sm" href="#/modul/holdt" data-link>Se vadningseftersynet</a>
        </div>
      </div>
    `)}`;

  /* ---- 03 Beredskabseftersyn ------------------------------------- */
  MODULE_BODIES.beredskab = (ctx) => `
    ${block("Inden du starter", "Det grundlæggende eftersyn – ikke en hurtig runde om bilen", `
      <p class="lead" style="font-size:15px">Beredskabseftersynet er kørerens fulde gennemgang af køretøjet. Det udføres ved hjemkomst,
      så fejl bliver fanget, mens der er tid til at udbedre dem – og før udkørsel, hvis du ikke selv har lavet det sidste.</p>
      <div class="two-col mt-16">
        <div>
          <h3>Fire situationer</h3>
          <ul class="muted" style="font-size:12.5px;line-height:1.8;padding-left:18px">
            <li>Ved hjemkomst efter endt kørsel.</li>
            <li>Før udkørsel, hvis du ikke selv har udført det sidste beredskabseftersyn.</li>
            <li>Hvis der er gået mere end 7 dage siden sidste eftersyn.</li>
            <li>Én gang i døgnet ved længere tids konstant brug.</li>
          </ul>
        </div>
        <div>
          <h3>Sådan læser du listen</h3>
          <p class="muted" style="font-size:12.5px;line-height:1.7">Punkter mærket <b>sikkerhedskritisk</b> kræver, at du stopper og
          får fejlen vurderet, hvis de ikke er i orden. Markér <b>FEJL</b>, skriv hvad der er galt, og meld det efter den lokale procedure.
          En kvittering i kontrolbogen er ikke det samme som at have meldt fejlen.</p>
        </div>
      </div>
      ${callout("Tankvognen kommer oveni", "Har du valgt tankprofil, vises tankvognens egne punkter nederst i listen. De erstatter ikke de almene punkter – de lægges oveni. Kontroller altid, at profilen passer til det køretøj, du faktisk skal føre.", "amber")}
    `)}

    ${block("Tjekliste B", "Beredskabseftersyn – fuld liste", `
      ${checklistHTML("beredskab", ctx)}
    `)}

    ${block("Efter eftersynet", "Tre ting, der ikke må mangle", `
      <div class="three-col">
        ${infoCard("01", "Kontrolbog B", "Kvittér for det udførte eftersyn. Uden kvittering kan ingen se, at køretøjet er kontrolleret.")}
        ${infoCard("02", "Fejlmelding", "Meld fejl og mangler – også de små. En løs hjulbolt bliver ikke mindre farlig af at vente.")}
        ${infoCard("03", "Hovedafbryder", "Afbryd hovedafbryderen efter eftersynet, medmindre køretøjet skal bruges eller lokal instruks siger andet.")}
      </div>
      ${callout("Stopregler", "Løse hjulbolte, bremsefejl, synlig lækage, åben tankventil, defekt jording eller manglende dokumenter er ikke noget, du “lige kører med”. Stop og få det udbedret.", "red")}
    `)}`;

  /* ---- 04 Starteftersyn ------------------------------------------ */
  MODULE_BODIES.start = (ctx) => `
    ${block("Før første meter", "Den korte kontrol af det, der kan være ændret", `
      <p class="lead" style="font-size:15px">Starteftersynet er ikke en gentagelse af hele beredskabseftersynet. Det er den målrettede kontrol,
      du laver, når du selv har lavet det sidste beredskabseftersyn – og nu skal ud at køre.</p>
      <div class="two-col mt-16">
        <div>
          <h3>Forudsætningen</h3>
          <p class="muted" style="font-size:12.5px;line-height:1.7">Du kan kun nøjes med starteftersyn, hvis <b>du selv</b> har udført
          det sidste beredskabseftersyn. Har en anden kørt og kontrolleret køretøjet, eller er der gået mere end 7 dage, skal du lave
          beredskabseftersyn.</p>
        </div>
        <div>
          <h3>Fokus</h3>
          <p class="muted" style="font-size:12.5px;line-height:1.7">Væskespild under køretøjet, nye skader, dæk, last, tilkobling,
          ildslukker og kontrolbog. Ved start: bremser, lys, instrumenter, unormale lyde og en afprøvning ved lav hastighed.</p>
        </div>
      </div>
    `)}

    ${block("Tjekliste S", "Starteftersyn – før og ved start", `
      ${checklistHTML("start", ctx)}
    `)}

    ${block("Sammenligning", "Beredskab vs. start – kort fortalt", `
      <div class="table-wrap">
        <table>
          <thead><tr><th></th><th>Beredskabseftersyn</th><th>Starteftersyn</th></tr></thead>
          <tbody>
            <tr><td><b>Hvornår</b></td><td>Ved hjemkomst, efter 7 dage, eller hvis du ikke selv har lavet det sidste</td><td>Før udkørsel, når du selv har lavet det sidste beredskabseftersyn</td></tr>
            <tr><td><b>Omfang</b></td><td>Fuld gennemgang af køretøj, hjul, bremser, undervogn, last og udstyr</td><td>Kort kontrol af ændringer, væsker, last, lys, bremser og instrumenter</td></tr>
            <tr><td><b>Dokumentation</b></td><td>Kontrolbog “B”</td><td>Kontrolbog “S”</td></tr>
            <tr><td><b>Typisk fejl</b></td><td>At man kun kigger udvendigt og glemmer bremser, væsker og dokumenter</td><td>At man springer afprøvningen af bremser og styretøj over</td></tr>
          </tbody>
        </table>
      </div>
      ${callout("På tankvognen", "Ved starteftersynet kontrolleres også, at tank, ventiler, slanger og koblinger er tætte, at orange plader og faresedler matcher lasten, og at nødstop, PTO og jording er i sikker stilling.", "amber")}
    `)}`;

  /* ---- 05 Holdt, vadning & månedligt ----------------------------- */
  MODULE_BODIES.holdt = (ctx) => `
    ${block("Undervejs", "Holdteftersyn – når turen ændrer køretøjet", `
      <p class="lead" style="font-size:15px">Holdteftersynet er kontrol efter brug. Det udføres efter behov undervejs – og altid efter kørsel i terræn,
      før du kører ud i færdselslovens område.</p>
      <p class="muted" style="font-size:12.5px;line-height:1.7">Efter terræn er fokus især på bremser, hjul, ophæng, lys og last.
      Jord, mudder og vand kan skjule skader og påvirke funktionen. På tankvognen kommer tank, ventiler, slanger og mærkning til.</p>
      ${callout("Efter terræn", "Holdteftersynet er ikke valgfrit, fordi du er tæt på destinationen. Det skal være udført, <b>før</b> du kører ud i færdselslovens område.", "red")}
    `)}

    ${block("Tjekliste H", "Holdteftersyn", `
      ${checklistHTML("holdt", ctx)}
    `)}

    ${block("Vadning", "Eftersyn efter vand – kun hvis du faktisk har vadet", `
      <p class="muted" style="font-size:12.5px;line-height:1.7">Vadning er sjældent for de fleste. Derfor er hele vadningsafsnittet foldet sammen.
      Har du ikke kørt i vand, kan du springe det over. Har du, skal eftersynet udføres i forlængelse af holdteftersynet – og det skal dokumenteres.</p>
      <div class="two-col mt-16">
        <div class="callout teal" style="margin:0">
          <div class="callout-title">Dybdegrænser i fredstid</div>
          <p>Terræn: 2 x dækhøjde. Vej: 1 x dækhøjde. Dybere passage kræver særlig forberedelse og vurdering – det er ikke en beslutning, du tager alene under tidspres.</p>
        </div>
        <div class="callout red" style="margin:0">
          <div class="callout-title">Efter passage</div>
          <p>Afprøv bremserne, tør dem ved langsom kørsel, og kontroller køler, lygter og olie for vand. Meld unormale lyde, dug eller mælkehvid olie.</p>
        </div>
      </div>
      <div class="accordion mt-16">
        <div class="acc-item" data-acc>
          <button class="acc-btn" type="button" data-action="accordion" aria-expanded="false"><span class="acc-icon">+</span><span>Vis vadningseftersyn (EV / EV+)</span></button>
          <div class="acc-panel" style="padding-left:15px">
            ${checklistHTML("vadning", ctx)}
          </div>
        </div>
      </div>
    `)}

    ${block("Månedligt", "Eftersyn 1–4 – den rullende månedsplan", `
      <p class="muted" style="font-size:12.5px;line-height:1.7">De fire månedlige eftersyn har hvert sit hovedfokus. Tilsammen dækker de
      køretøjet mere grundigt end de daglige eftersyn. Hvis køretøjet ikke har været anvendt i en kalendermåned, kan eftersynet udelades
      i den måned – men aldrig to måneder i træk.</p>
      <div class="four-col mt-16">
        ${infoCard("1", "Rengøring & undervogn", "Styretøj, bremserør, fjedre, gearkasser, køler, kileremme, karrosseri og kroghejs.")}
        ${infoCard("2", "El, batteri & påhæng", "Akkumulator, kabler, stik, radio og påhængsvognens luft, el, støtteben og parkeringsbremse.")}
        ${infoCard("3", "Hjul, spil & kran", "Dæk og dæktryk, servostyring, spærre, spilwire, kranfunktioner, containerlåse og reservehjulshejs.")}
        ${infoCard("4", "Lad, udstyr & sikring", "Lad, ruf, sæder, geværholder, værktøj, surringsmateriel og smøring af hængsler.")}
      </div>
      <div class="accordion mt-16">
        ${[1, 2, 3, 4].map((n) => {
          const id = "maned" + n;
          const cl = A.checklists[id];
          return `
            <div class="acc-item" data-acc>
              <button class="acc-btn" type="button" data-action="accordion" aria-expanded="false">
                <span class="acc-icon">+</span><span>Eftersyn ${n} · ${esc(cl.title.replace("Månedligt eftersyn ", ""))} – ${cl.groups.reduce((sum, g) => sum + g.items.length, 0)} punkter</span>
              </button>
              <div class="acc-panel" style="padding-left:15px">
                ${checklistHTML(id, ctx)}
              </div>
            </div>`;
        }).join("")}
      </div>
    `)}`;

  /* ---- 06 Klasse 3 & brændstof ----------------------------------- */
  MODULE_BODIES.klasse3 = () => `
    ${block("Fareprofil", "Hvad gør benzin, diesel og Jet Fuel farligt?", `
      <p class="lead" style="font-size:15px">Alle tre er brandfarlige væsker i klasse 3 – men de er ikke lige farlige.
      Forskellen ligger i flashpunkt, damptryk og hvor let dampene antændes.</p>
      <div class="table-wrap mt-16">
        <table>
          <thead><tr><th>Produkt</th><th>UN-nummer</th><th>Klasse</th><th>Flashpunkt (vejledende)</th><th>Praktisk fare</th></tr></thead>
          <tbody>
            <tr><td><b>Benzin / motor spirit</b></td><td>UN 1203</td><td>3</td><td>Ca. −43 °C</td><td>Meget letantændelig. Dampe kan antændes ved normal temperatur og spredes langs gulvet.</td></tr>
            <tr><td><b>Diesel / gas oil</b></td><td>UN 1202</td><td>3</td><td>Ca. 55–60 °C eller derover</td><td>Mindre flygtig end benzin, men stadig brandfarlig. Varm diesel og tåge kan give farlige dampe.</td></tr>
            <tr><td><b>Jet A-1</b></td><td>UN 1863</td><td>3</td><td>Ca. 38 °C eller derover</td><td>Flybrændstof med lavt flashpunkt. Behandles som brandfarlig væske – ikke som “almindelig diesel”.</td></tr>
          </tbody>
        </table>
      </div>
      ${callout("Kontroller varedeklarationen", "Flashpunkt og klassificering afhænger af det konkrete produkt og blandinger. Diesel med flashpunkt over 60 °C er som udgangspunkt ikke klasse 3 efter ADR – men det er en vurdering, der skal fremgå af dokumentationen, ikke noget du gætter. Kontroller altid transportdokument og mærkning.", "red")}
    `)}

    ${block("Dampe & antændelse", "Det er dampene, der brænder – ikke væsken", `
      <div class="two-col">
        <div>
          <p class="muted" style="font-size:12.5px;line-height:1.7">Ved normal temperatur afgiver brandfarlige væsker dampe. Dampene blandes med luft
          og kan antændes af en gnist, en varm overflade, en cigaret eller statisk elektricitet. Dampe fra benzin er tungere end luft og kan
          samle sig i lavtliggende områder, kloaker og tanke.</p>
          <p class="muted" style="font-size:12.5px;line-height:1.7">Derfor er “ingen lugt” ikke en garanti, og “jeg kunne ikke se noget” er ikke
          det samme som “der er ikke en fare”. Brug lugtesansen aktivt – men aldrig som eneste kontrol.</p>
        </div>
        <div class="principles">
          <div class="principle"><span class="principle-icon">✦</span><div><h3>TÆNDKILDER</h3><p>Rygning, e-cigaretter og åben ild er forbudt inden for 30 meter ved transport eller håndtering af farligt gods – også i førerhuset.</p></div></div>
          <div class="principle"><span class="principle-icon">⚡</span><div><h3>STATISK ELEKTricitet</h3><p>Jording/bonding etableres og kontrolleres, før overførslen starter. Det er ikke en formalitet.</p></div></div>
          <div class="principle"><span class="principle-icon">☀</span><div><h3>VARME</h3><p>Varme overflader og varmt vejr øger dampdannelsen. En tank, der har stået i solen, er ikke “tom”, fordi den er tømt.</p></div></div>
        </div>
      </div>
    `)}

    ${block("Mærkning", "Orange plade, fareseddel og UN-nummer", `
      <div class="three-col">
        ${infoCard("ORANGE PLADE", "Fareidentifikationsnummer + UN-nummer", "Pladen bag på køretøjet viser fareidentifikation øverst og UN-nummer nederst. Eksempel: 33/1203 for benzin, 30/1202 for diesel. Kontroller altid mod transportdokumentet.")}
        ${infoCard("FARESEDDEL", "Klasse 3 – brandfarlig væske", "Den diamantformede fareseddel angiver fareklassen. Sedler og plader skal være rene, læsbare og matche den faktiske last.")}
        ${infoCard("DOKUMENT", "Transportdokumentet er facit", "Produkt, UN-nummer, mængde og emballage/tank skal stemme med det, der står i dokumentet – og med det, der faktisk er i tanken.")}
      </div>
      ${callout("Mærkning er ikke kosmetik", "Ulovlig eller manglende mærkning gør køretøjet sværere at håndtere for redningspersonale og kan føre til, at lasten behandles forkert i en hændelse. Rengør plader og sedler som en del af eftersynet.", "teal")}
    `)}

    ${block("Håndtering", "Seks vaner, der forebygger de fleste hændelser", `
      <div class="steps">
        <div class="step"><span class="step-num">1</span><div><h3>Kontroller produkt og mængde mod dokumentet</h3><p>Forkert produkt eller overfyldning er blandt de mest alvorlige fejl. Stop, hvis noget ikke stemmer.</p></div></div>
        <div class="step"><span class="step-num">2</span><div><h3>Hold tændkilder væk – også telefonen</h3><p>30-meterreglen gælder rygning, e-cigaretter og åben ild. Undgå unødig brug af tændkilder i fareområdet.</p></div></div>
        <div class="step"><span class="step-num">3</span><div><h3>Jord før du åbner</h3><p>Jording/bonding skal være etableret og kontrolleret, før produktet begynder at flytte sig.</p></div></div>
        <div class="step"><span class="step-num">4</span><div><h3>Hold opsyn hele tiden</h3><p>Forlad ikke koblingen eller pumpen. Afbryd ved unormal lyd, lugt, tryk eller lækage.</p></div></div>
        <div class="step"><span class="step-num">5</span><div><h3>Brug egnede værnemidler</h3><p>Brændstofresistente handsker, beskyttelsesbriller og sikkerhedsfodtøj. Undgå løst tøj og smykker ved bevægelige dele.</p></div></div>
        <div class="step"><span class="step-num">6</span><div><h3>Ryd op og meld – også små spild</h3><p>Brug spildsættet, og registrér hændelsen efter den lokale procedure. Miljøspild forsvinder ikke af sig selv.</p></div></div>
      </div>
    `)}`;

  /* ---- 07 Tankvognen --------------------------------------------- */
  const HOTSPOTS = [
    { id: "manhul", x: 196, y: 88, n: 1, title: "Manhuller & dæksler", text: "Dæksler og manhuller skal være lukkede og sikrede under kørsel. Åbne eller utætte dæksler kan give dampudslip, vandindtrængning og spild.", bullets: ["Kontroller pakninger og låse", "Ingen lugt eller friske pletter", "Åbn kun efter instruks og med jording etableret"] },
    { id: "ventilation", x: 286, y: 84, n: 2, title: "Åndedrætsventiler", text: "Tankens åndedrætsventiler skal fungere og være i korrekt stilling. Blokerede ventiler kan give overtryk eller undertryk i tanken.", bullets: ["Kontroller at ventilen er ren og fri", "Følg køretøjets betjeningsvejledning", "Meld unormal lugt eller tryk"] },
    { id: "plade", x: 352, y: 158, n: 3, title: "Orange plader & faresedler", text: "Mærkningen skal matche lasten og være ren og læsbar. UN-nummer og fareklasse skal stemme med transportdokumentet.", bullets: ["Rengør sne, snavs og støv", "Kontroller begge sider og bagende", "Skift mærkning, når lasten skifter"] },
    { id: "jording", x: 96, y: 196, n: 4, title: "Jordingsreel & kabel", text: "Jordingen leder statisk elektricitet væk. Defekt kabel, klemme eller reel betyder, at overførslen ikke må starte.", bullets: ["Kontroller kabel, klemme og reels funktion", "Tilslut før overførsel – fjern sidst", "Ingen overførsel uden fungerende jording"] },
    { id: "slange", x: 468, y: 214, n: 5, title: "Slanger & koblinger", text: "Slanger skal være tætte, mærkede og uden revner, blødhed eller flossede ender. Manglende pakninger er en typisk utæthedskilde.", bullets: ["Kontroller pakninger og API-adapter", "Tøm og stuv slangen efter brug", "Defekt slange må ikke bruges"] },
    { id: "pumpe", x: 392, y: 214, n: 6, title: "Pumpe & PTO", text: "PTO må ikke være tilkoblet unødigt. Pumpen skal være tæt og fungere uden unormal lyd eller vibration.", bullets: ["Kontroller PTO-stilling", "Se efter lækager ved pumpe og pakninger", "Kør kun pumpe efter instruks"] },
    { id: "nodstop", x: 430, y: 146, n: 7, title: "Nødstop", text: "Nødstoppet skal være frit tilgængeligt og fungere. Det er din hurtigste måde at stoppe overførslen på.", bullets: ["Afprøv funktionen efter instruks", "Hold det fri for udstyr og bagage", "Aftal signal med anlægget"] },
    { id: "bundventil", x: 306, y: 210, n: 8, title: "Bundventiler", text: "Bundventiler skal være lukkede og sikrede under kørsel. En åben eller utæt bundventil er et stop-punkt.", bullets: ["Kontroller stilling og tæthed", "Se efter dryp under tanken", "Luk og sikr efter overførsel"] },
    { id: "bagende", x: 540, y: 190, n: 9, title: "Bagende & underruns", text: "Bagenden skal være intakt og synlig. Underkørselsbeskyttelse, lys og reflekser skal være hele og rene.", bullets: ["Kontroller lys og reflekser", "Se efter skader efter påkørsel", "Hold bagenden fri for løse dele"] },
    { id: "foererhus", x: 540, y: 108, n: 10, title: "Førerhus & dokumenter", text: "I førerhuset skal dokumenter, kontrolbog og nødvendigt udstyr være tilgængeligt – og løse genstande sikret.", bullets: ["ADR-attest og transportdokument", "Kontrolbog og tilladelser", "Ingen løse genstande, der kan ramme føreren"] }
  ];

  function hotspotSVG() {
    return `
      <svg viewBox="0 0 640 300" role="img" aria-label="Tankvogn med nummererede kontrolpunkter">
        <path d="M18 252h604" stroke="rgba(141,161,179,.35)" stroke-width="1.5"/>
        <path d="M30 264h100M180 264h90M320 264h70M430 264h120" stroke="rgba(141,161,179,.14)" stroke-width="2"/>
        <rect x="42" y="104" width="404" height="104" rx="50" fill="#16222d" stroke="#ffb020" stroke-width="2"/>
        <path d="M108 105v102M176 105v102M244 105v102M312 105v102M380 105v102" stroke="rgba(255,176,32,.25)" stroke-width="1"/>
        <rect x="178" y="82" width="36" height="24" rx="8" fill="#101b25" stroke="#ffb020" stroke-width="1.6"/>
        <rect x="268" y="80" width="36" height="24" rx="8" fill="#101b25" stroke="#ffb020" stroke-width="1.6"/>
        <path d="M214 94h10M304 94h10" stroke="#ffb020" stroke-width="1.2"/>
        <path d="M54 208h384" stroke="#ffb020" stroke-width="2"/>
        <rect x="446" y="122" width="104" height="86" rx="10" fill="#16222d" stroke="#8da1b3" stroke-width="1.6"/>
        <path d="M456 132h64v34h-64z" fill="rgba(53,214,193,.14)" stroke="#35d6c1" stroke-width="1.3"/>
        <path d="M446 176h104v12h-104z" fill="rgba(255,176,32,.12)"/>
        <path d="M550 200h30v12h-30z" fill="#263544" stroke="#8da1b3" stroke-width="1.4"/>
        <circle cx="126" cy="212" r="28" fill="#0b131a" stroke="#8da1b3" stroke-width="2"/>
        <circle cx="126" cy="212" r="11" fill="#1b2834" stroke="#ffb020" stroke-width="1.3"/>
        <circle cx="246" cy="212" r="28" fill="#0b131a" stroke="#8da1b3" stroke-width="2"/>
        <circle cx="246" cy="212" r="11" fill="#1b2834" stroke="#ffb020" stroke-width="1.3"/>
        <circle cx="470" cy="212" r="28" fill="#0b131a" stroke="#8da1b3" stroke-width="2"/>
        <circle cx="470" cy="212" r="11" fill="#1b2834" stroke="#ffb020" stroke-width="1.3"/>
        <circle cx="548" cy="212" r="28" fill="#0b131a" stroke="#8da1b3" stroke-width="2"/>
        <circle cx="548" cy="212" r="11" fill="#1b2834" stroke="#ffb020" stroke-width="1.3"/>
        <path d="M404 150h26v20h-26z" fill="rgba(255,176,32,.10)" stroke="rgba(255,176,32,.5)" stroke-width="1.2"/>
        <rect x="330" y="140" width="44" height="26" rx="4" fill="#ffb020" stroke="#17120a" stroke-width="1"/>
        <text x="352" y="151" font-family="monospace" font-size="7" fill="#17120a" text-anchor="middle" font-weight="700">33</text>
        <text x="352" y="161" font-family="monospace" font-size="7" fill="#17120a" text-anchor="middle" font-weight="700">1203</text>
        <path d="M86 232c10 6 18 10 28 10" stroke="#35d6c1" stroke-width="2" stroke-linecap="round" fill="none"/>
        <circle cx="86" cy="232" r="6" fill="#101b25" stroke="#35d6c1" stroke-width="2"/>
        <text x="156" y="242" font-family="monospace" font-size="8" fill="#8da1b3">KLASSE 3 · FL/AT</text>
        ${HOTSPOTS.map((h) => `
          <g class="hotspot" data-hotspot="${h.id}" tabindex="0" role="button" aria-label="${esc(h.n + ". " + h.title)}">
            <circle cx="${h.x}" cy="${h.y}" r="13"></circle>
            <text class="hotspot text" x="${h.x}" y="${h.y}">${h.n}</text>
          </g>`).join("")}
      </svg>`;
  }

  MODULE_BODIES.tankvogn = (ctx) => `
    ${block("Køretøjet", "Tankvognen er et køretøj, et trykbeholder-system og et transportmiddel på samme tid", `
      <p class="lead" style="font-size:15px">En tankvogn fejler sjældent på én gang. Det er summen af en ventil i forkert stilling,
      en defekt jording, en træt pakning og en chauffør, der har travlt. Derfor er kontrollen punktvis – og rækkefølgen er vigtig.</p>
      <div class="three-col mt-16">
        ${infoCard("FL / AT", "Kun når tanken er stor nok", "Militære køretøjer og påhængskøretøjer til klasse 3 i faste tanke på <b>mere end 1.000 liter</b> eller tankcontainer på <b>3.000 liter eller derover</b> benævnes FL eller AT. Der skal være udstedt en ADR-godkendelsesattest.")}
        ${infoCard("ATTEST", "ADR-godkendelsesattest", "Attesten udstedes af synsvirksomheden og skal medbringes på den transporterende enhed. Kontroller gyldighed og tankens testdatoer.")}
        ${infoCard("TANKKODER", "Tank og udstyr", "Tanken skal være godkendt efter ADR del 6, hvor det er relevant. Ventiler, slanger, pumpe og jording er en del af sikkerhedskæden.")}
      </div>
      ${callout("Ikke alle tanke er FL/AT", "Grænsen er fast: over 1.000 liter i fast tank eller 3.000 liter i tankcontainer. En mindre tank eller en dunk gør ikke køretøjet til FL/AT – men reglerne for farligt gods og mærkning kan stadig gælde.", "teal")}
    `)}

    ${block("Hotspots", "Ti punkter på tankvognen, du skal kunne finde i mørke", `
      <div class="hotspot-wrap">
        <div class="hotspot-canvas">
          ${hotspotSVG()}
        </div>
        <aside class="hotspot-panel" id="hotspotPanel" aria-live="polite">
          <div class="hp-num">VÆLG ET PUNKT</div>
          <h3>Sådan bruger du diagrammet</h3>
          <p>Klik på et nummer på tankvognen. Hvert punkt beskriver, hvad du kontrollerer, og hvad der gør det til et stop-punkt.</p>
          <p class="hp-hint">Diagrammet er principielt. Placering og betjening kan variere med køretøjstype – følg altid køretøjets betjeningsvejledning.</p>
        </aside>
      </div>
    `)}

    ${block("Overførsel", "Læsning og losning – rækkefølgen redder dig", `
      <div class="steps">
        <div class="step"><span class="step-num">1</span><div><h3>Dokumenter, produkt og mængde</h3><p>Kontroller transportdokument, ADR-attest og tilladelser. Produkt, UN-nummer, mængde og destination skal stemme.</p></div></div>
        <div class="step"><span class="step-num">2</span><div><h3>Sikker parkering</h3><p>Bremse, gear i neutral/parkering og hjulklodser efter behov. Hold afstand til bygninger, andre køretøjer og tændkilder.</p></div></div>
        <div class="step"><span class="step-num">3</span><div><h3>Motor, værnemidler og tændkilder</h3><p>Sluk motoren, medmindre pumpen kræver den. Brug egnede værnemidler. 30-meterreglen gælder.</p></div></div>
        <div class="step"><span class="step-num">4</span><div><h3>Slanger, koblinger og spildsæt</h3><p>Kontroller slanger, pakninger og API-adapter. Læg spildmåtte og spildsæt klar, så du kan handle med det samme.</p></div></div>
        <div class="step"><span class="step-num">5</span><div><h3>Jording – først nu åbner du</h3><p>Tilslut jording/bonding, og kontroller forbindelsen. Først derefter starter overførslen.</p></div></div>
        <div class="step"><span class="step-num">6</span><div><h3>Overvåg til det sidste</h3><p>Hold konstant opsyn med niveau, tryk og flow. Stop før overfyldning. Afbryd ved den mindste uregelmæssighed.</p></div></div>
        <div class="step"><span class="step-num">7</span><div><h3>Afslut kontrolleret</h3><p>Luk ventiler, afbryd pumpen, tøm og stuv slangen. Fjern jordingen som det sidste. Opdater dokumenter og mængder.</p></div></div>
      </div>
      ${callout("Stopregler ved overførsel", "Lækage, lugt, unormal lyd, ukontrolleret flow, defekt jording, tændkilde i nærheden eller personer i fareområdet: <b>stop overførslen først</b>. Spørg bagefter, hvad der skete.", "red")}
    `)}

    ${block("Havari", "Hvis det går galt", `
      <div class="four-col">
        ${infoCard("01", "Stop", "Afbryd overførslen eller køretøjet. Fjern tændkilder, og få personer væk, hvis det er sikkert.")}
        ${infoCard("02", "Advar", "Advar omgivelserne og tilkald hjælp efter beredskabsplanen. Vær tydelig om produkt, mængde og placering.")}
        ${infoCard("03", "Begræns", "Brug spildsæt og afdækning, hvis det kan gøres uden at bringe dig selv eller andre i fare. Stop ikke afløb med kroppen.")}
        ${infoCard("04", "Meld", "Meld hændelsen, også små spild. Dokumentér forløbet, og deltag i opfølgningen.")}
      </div>
      ${callout("Kør ikke videre med en kendt lækage", "En kendt lækage bliver ikke mindre farlig af at være på vej til værkstedet. Stop på et sikkert sted, og følg beredskabsplanen.", "red")}
    `)}

    ${block("Tjekliste T", "Læsning & losning – sikkerhedssekvens", `
      ${checklistHTML("tank_transfer", ctx)}
    `)}`;

  /* ---- 08 Last, dokumenter & transportregler --------------------- */
  MODULE_BODIES.last = () => `
    ${block("Transportregler", "Vælg den rigtige regel, før du vælger ruten", `
      <p class="lead" style="font-size:15px">Den største fejl i transport af farligt gods er ikke en defekt tank. Det er at bruge den forkerte
      transportregel – og derfor mangle dokumenter, uddannelse eller mærkning, uden at nogen opdager det før en kontrol.</p>
      <div class="two-col mt-16">
        <div>
          <h3>FMIBST 061-02 eller ADR?</h3>
          <p class="muted" style="font-size:12.5px;line-height:1.7">Vejtransport med køretøjer, der tilhører de danske eller udenlandske væbnede styrker,
          eller som disse er ansvarlige for, er ikke omfattet af den civile bekendtgørelse. Transporten kan gennemføres efter FMIBST 061-02 –
          eller efter ADR og den tilhørende nationale regulering. Det er et valg, der skal træffes og dokumenteres, ikke noget man blander tilfældigt.</p>
        </div>
        <div>
          <h3>Udgangspunktet</h3>
          <p class="muted" style="font-size:12.5px;line-height:1.7">Som militær kører arbejder du normalt efter FMIBST 061-02. Bestemmelsen bruger ADR
          som referencegrundlag og indeholder militære afvigelser. Spørg sikkerhedsrådgiveren, hvis du er i tvivl om, hvilken regel der gælder for en konkret transport.</p>
        </div>
      </div>
      <div class="row mt-16">
        <a class="btn btn-primary btn-sm" href="#/transportregel" data-link>Brug transportregel-vælgeren →</a>
        <a class="btn btn-ghost btn-sm" href="#/modul/regler" data-link>Repetér regler & roller</a>
      </div>
    `)}

    ${block("Fritagelser", "Fem veje – og deres faldgruber", `
      <div class="accordion">
        <div class="acc-item" data-acc>
          <button class="acc-btn" type="button" data-action="accordion" aria-expanded="false"><span class="acc-icon">+</span><span>Almindelig transport efter FMIBST 061-02</span></button>
          <div class="acc-panel">
            <p>Kræver bl.a. korrekt uddannet chauffør, godkendt køretøj/tank, mærkning, transportdokument, dokumentation, ildslukker og udstyr.
            For FL/AT til klasse 3 skal der være udstedt en ADR-godkendelsesattest, som medbringes på den transporterende enhed.</p>
          </div>
        </div>
        <div class="acc-item" data-acc>
          <button class="acc-btn" type="button" data-action="accordion" aria-expanded="false"><span class="acc-icon">+</span><span>Intern transport – pkt. 9.2</span></button>
          <div class="acc-panel">
            <p>Kan finde sted inden for et særligt afspærret/indhegnet garnisons-, havne-, lufthavns- eller kombiterminalområde, hvor transporten
            indgår som et led i håndteringen af godset. Betingelserne omfatter bl.a.:</p>
            <ul>
              <li>Køretøjet er godkendt efter tillæg I, hvor relevant.</li>
              <li>Tanke er godkendt efter ADR del 6.</li>
              <li>Afmærkning med orange fareskilte og faresedler efter ADR 8.1.3.</li>
              <li>Transport efter sammenlæsningsforbud/tillæg G, pkt. 2.</li>
              <li>Chaufføren har den særlige uddannelse efter ADR 8.2.1 eller kapitel 1.3.</li>
              <li>Klassificering, emballering, afmærkning, håndtering og lastsikring efter ADR.</li>
              <li>Ildslukker og udstyr efter ADR 8.1.4 og 8.1.5.</li>
              <li>Skriftlige anvisninger, hvis transporten kræver ADR kap. 8.2-chauffør.</li>
            </ul>
            <p><b>Der stilles ikke krav om transportdokumentation.</b> Det er ikke det samme som “ingen krav”.</p>
          </div>
        </div>
        <div class="acc-item" data-acc>
          <button class="acc-btn" type="button" data-action="accordion" aria-expanded="false"><span class="acc-icon">+</span><span>Håndværkerreglen</span></button>
          <div class="acc-panel">
            <p>Undtagelsen i ADR 1.1.3.1(c) kræver, at transporten af farligt gods er en <b>underordnet del</b> af personens eget arbejde.
            Der kræves forudgående vejledning og overholdelse af mængdegrænser.</p>
            <p><b>Eksempel på misbrug:</b> Chaufføren kører diesel ud til en aktivitet, hvor han/hun ikke selv skal deltage. Så er hovedformålet
            transport af farligt gods – og håndværkerreglen kan som udgangspunkt ikke anvendes.</p>
          </div>
        </div>
        <div class="acc-item" data-acc>
          <button class="acc-btn" type="button" data-action="accordion" aria-expanded="false"><span class="acc-icon">+</span><span>Andre undtagelser – kort</span></button>
          <div class="acc-panel">
            <p>FMIBST 061-02 indeholder også særordninger for små mængder, taktisk transport og TIFT. De er relevante i andre dele af Forsvaret,
            men <b>ikke dette forløbs fokus</b>. Små mængder omfatter ikke brændstof i tankvogn. Taktisk transport og TIFT kræver skriftlig
            autorisation eller godkendelse – spørg sikkerhedsrådgiveren, hvis du møder dem i en brændstofopgave.</p>
          </div>
        </div>
        <div class="acc-item" data-acc>
          <button class="acc-btn" type="button" data-action="accordion" aria-expanded="false"><span class="acc-icon">+</span><span>Dispensation</span></button>
          <div class="acc-panel">
            <p>Ved forhold, hvor transporten ikke kan gennemføres efter FMIBST 061-02, ADR, bekendtgørelsen eller AMovP-6, kan der søges om
            dispensation eller varig godkendelse på særlige vilkår. En dispensation kan maksimalt have en gyldighed på <b>12 måneder ad gangen</b>.
            Den skal være skriftlig, beskrive problemstillingen, UN-numre, risikovurdering og løsning – og den skal medbringes.</p>
          </div>
        </div>
      </div>
    `)}

    ${block("Dokumenter", "Det skal være i køretøjet", `
      <div class="table-wrap">
        <table>
          <thead><tr><th>Dokument</th><th>Hvad det dokumenterer</th><th>Kontroller</th></tr></thead>
          <tbody>
            <tr><td><b>Transportdokument</b></td><td>Last, UN-nummer, fareklasse, mængde, emballage/tank, afsender/modtager</td><td>At det matcher den faktiske last og mærkning</td></tr>
            <tr><td><b>ADR-godkendelsesattest</b></td><td>Køretøjets godkendelse efter ADR</td><td>Gyldighed og tankens testdatoer</td></tr>
            <tr><td><b>Kontrolbog</b></td><td>Udførte eftersyn og fejlmeldinger</td><td>At B/S/H/EV/1–4 er kvitteret</td></tr>
            <tr><td><b>Tilladelser/dispensation</b></td><td>Specifikke fravigelser eller intern/taktisk transport</td><td>Gyldighed, omfang og eventuelle vilkår</td></tr>
            <tr><td><b>Skriftlige anvisninger</b></td><td>Hvad chaufføren skal gøre ved en hændelse</td><td>At de er til stede, læsbare og forstået</td></tr>
          </tbody>
        </table>
      </div>
      ${callout("Intern transport", "Ved intern transport efter pkt. 9.2 stilles der ikke krav om transportdokumentation – men de øvrige betingelser gælder fortsat. Det er en af de nemmeste faldgruber at overse.", "amber")}
    `)}

    ${block("Lastsikring", "Lasten skal blive, hvor den er", `
      <div class="two-col">
        <div>
          <p class="muted" style="font-size:12.5px;line-height:1.7">Farligt gods skal være forsvarligt lastsikret, så det ikke kan forskubbe sig
          i forhold til hinanden på lastfladen under normale transportforhold. Det gælder også kortere ture og interne transporter.</p>
          <p class="muted" style="font-size:12.5px;line-height:1.7">Kontroller surring efter hvert stop, efter hård bremsning og efter terrænkørsel.
          Løse genstande i førerhuset er også last – de kan ramme dig ved en undvigemanøvre.</p>
        </div>
        <div class="callout teal" style="margin:0">
          <div class="callout-title">Varme og vejr</div>
          <p>Brændstof skal beskyttes mod unødig opvarmning. Sol på en tank øger damptrykket, og varmt vejr gør “den tomme tank”
          til et damprum, der stadig skal behandles som farligt. Kontroller ventilation, tæthed og mærkning, før du kører.</p>
        </div>
      </div>
    `)}

    ${block("Færge", "Spørg rederiet, før du stiller dig i køen", `
      <p class="muted" style="font-size:12.5px;line-height:1.7;max-width:850px">Før tiltænkt færgetransport skal det undersøges ved rederiet, om farligt gods
      kan medtages. Hvis det kan, skal det afklares, hvilket regelsæt der anvendes. Det er ikke en beslutning, der træffes ved boardingrampen –
      og det er ikke løst ved at dække orange plader til.</p>
      <div class="callout red">
        <div class="callout-title">Planlæg før afgang</div>
        <p>Rederiets regler, lastens mærkning og eventuelle særkrav skal være afklaret, før du kører om bord. Manglende afklaring er et stop-punkt.</p>
      </div>
    `)}`;

  /* ---- 09 Køre- & hviletid --------------------------------------- */
  MODULE_BODIES.koeretid = () => `
    ${block("Grundlag", "Forsvarets regler – ikke de civile EU-regler", `
      <p class="lead" style="font-size:15px">Forsvaret er ikke underlagt de civile køre- og hviletidsbestemmelser. I stedet gælder Forsvarets egne regler
      i FKOBST H.061-0. De er ikke “blødere” – de har bare en anden opbygning og andre hensyn.</p>
      <div class="table-wrap mt-16">
        <table>
          <thead><tr><th>Emne</th><th>Daglig tjeneste</th><th>Øvelsesvirksomhed</th></tr></thead>
          <tbody>
            <tr><td><b>Sammenhængende kørsel</b></td><td>Maks. 4,5 timer → mindst 1 times pause</td><td>Maks. 4,5 timer → mindst 1 times pause</td></tr>
            <tr><td><b>Maksimal køretid</b></td><td>2 x 4,5 timer = 9 timer</td><td>3 x 4,5 timer = 13,5 timer</td></tr>
            <tr><td><b>Forlængelse</b></td><td>Op til 1 time, hvis forhold som at nå hjem eller en rasteplads taler for det</td><td>Følger de særlige vilkår for øvelsen</td></tr>
            <tr><td><b>Hvile</b></td><td>11 timers hvile efter arbejdsmiljøloven</td><td>Mulighed for mindst 6 timers sammenhængende hvile pr. 24 timer – eller to perioder på mindst 4 timer</td></tr>
          </tbody>
        </table>
      </div>
      ${callout("Marchbefalingen skal indeholde det", "Forud for en march skal der udgives en befaling med distance, køretid, antal pauser og pausernes længde. Køreren skal kunne vurdere, om han/hun er udhvilet nok til at gennemføre marchen.", "teal")}
    `)}

    ${block("Pause", "Pausen er en rettighed – og en pligt", `
      <div class="two-col">
        <div>
          <h3>Delpauser</h3>
          <p class="muted" style="font-size:12.5px;line-height:1.7">Pauser kan deles i delpauser på mindst 15 minutter. Én af delpauserne skal være
          mindst 30 minutter. Du kan udføre andre opgaver i pauseperioder – f.eks. holdteftersyn, af-/pålæsning eller vagt – og pausen kan
          afholdes i en kørende bil.</p>
        </div>
        <div>
          <h3>Kolonnekørsel</h3>
          <p class="muted" style="font-size:12.5px;line-height:1.7">Ved kolonnekørsel med lav hastighed skal køretiden reduceres, og der skal lægges
          yderligere pauser af kortere varighed ind. Langsom kørsel i kolonne er ikke det samme som hvile.</p>
        </div>
      </div>
      ${callout("Personeltransport på lad/i container", "Køretiden må ikke planlægges at overstige 2 x 2 timer. Efter 2 timers kørsel skal der holdes mindst 30 minutters pause. Det er en skarpere grænse end de almindelige 4,5 timer – husk den, når du planlægger med personel bagpå.", "red")}
    `)}

    ${block("Planlægning", "Regn på marchen, før du kører", `
      <p class="muted" style="font-size:12.5px;line-height:1.7;max-width:850px">Brug marchplanlæggeren til at se, hvordan køretid, pauser og hvile
      ligger i forhold til grænserne. Den regner på det grundlag, du vælger – og advarer, hvis planen overskrider den valgte tjenestetype.</p>
      <div class="two-col mt-16">
        <div class="callout teal" style="margin:0">
          <div class="callout-title">Eksempel: daglig tjeneste</div>
          <p>4,5 timer kørsel → 1 times pause → 4,5 timer kørsel. Herefter er den daglige køretid brugt. En eventuel forlængelse på op til
          1 time kræver, at forholdene taler for det – og skal fremgå af planlægningen.</p>
        </div>
        <div class="callout" style="margin:0">
          <div class="callout-title">Eksempel: øvelse</div>
          <p>3 x 4,5 timer er den øvre grænse, men hvilekravet skal stadig kunne opfyldes. Planlæg ikke efter “maksimum”, hvis marchbefalingen
          eller mandskabet ikke kan holde hvileperioderne.</p>
        </div>
      </div>
      <div class="row mt-16">
        <a class="btn btn-primary btn-sm" href="#/march" data-link>Åbn marchplanlæggeren →</a>
      </div>
    `)}

    ${block("Hvile", "Hvile er ikke bare “ikke at køre”", `
      <div class="three-col">
        ${infoCard("DAGLIG", "11 timers hvile", "Under daglig tjeneste gælder reglen om 11 timers hvile som angivet i Arbejdsmiljøloven.")}
        ${infoCard("ØVELSE", "6 timer – eller 2 x 4", "Under øvelsesvirksomhed skal alle kørere have mulighed for mindst 6 timers sammenhængende hvile inden for hver 24 timer. Hvilet kan afbrydes eller afkortes, hvis køreren i stedet får to hvileperioder af mindst 4 timer.")}
        ${infoCard("FORBUD", "Ingen tjenestelige pligter", "Der må ikke pålægges køreren tjenestelige pligter under hvileperioden. Hvile må ikke holdes i en bil, der kører.")}
      </div>
      ${callout("NATO-ledede øvelser", "Marchkredit tildelt i forbindelse med NATO-ledede øvelser går forud for de almindelige køre- og hviletidsbestemmelser. Det er en særregel – ikke en almindelig undskyldning for at overskride grænserne.", "amber")}
    `)}`;

  /* ---- 10 Afprøvning, syn & fritagelser -------------------------- */
  MODULE_BODIES.godkendelse = () => `
    ${block("Begreber", "Fem ord, der ikke betyder det samme", `
      <div class="table-wrap">
        <table>
          <thead><tr><th>Begreb</th><th>Hvad det er</th><th>Hvem gør det</th></tr></thead>
          <tbody>
            <tr><td><b>Eftersyn</b></td><td>Kørerens brugereftersyn efter HRN 737-021: beredskab, start, holdt, vadning, månedligt.</td><td>Køreren</td></tr>
            <tr><td><b>Afprøvning</b></td><td>Kontrol af funktion under drift – f.eks. bremser og styretøj. Kan også være en teknisk prøvning af udstyr.</td><td>Køreren / fagligt personel</td></tr>
            <tr><td><b>Periodisk syn</b></td><td>Myndighedskrævet syn af køretøjet efter gældende intervaller.</td><td>Synsvirksomhed</td></tr>
            <tr><td><b>ADR-godkendelse</b></td><td>Godkendelse af køretøjet til transport af farligt gods efter ADR. Dokumenteres med ADR-godkendelsesattest.</td><td>Synsvirksomhed</td></tr>
            <tr><td><b>Dispensation</b></td><td>Tidsbegrænset tilladelse til en specifik fravigelse. Maks. 12 måneder ad gangen efter FMIBST 061-02.</td><td>Myndighed / FGI</td></tr>
          </tbody>
        </table>
      </div>
      ${callout("Eftersyn erstatter ikke syn", "At køretøjet er efterset og kontrolbogen kvitteret, betyder ikke, at det er synet eller ADR-godkendt. De forskellige ordninger supplerer hinanden – de erstatter ikke hinanden.", "red")}
    `)}

    ${block("Køretøjskategorier", "Type I/II og FL/AT – med et kort sideblik", `
      <div class="three-col">
        ${infoCard("TYPE I / II", "Ældre militær godkendelse", "Militære køretøjer kan være kategoriseret som Type I eller Type II. En national militær godkendelse, som ikke længere tildeles ved nyanskaffelser. Køretøjer med denne godkendelse kan udelukkende anvendes ved nationale transporter.")}
        ${infoCard("FL / AT", "Klasse 3-tankvogne", "Faste tanke over 1.000 liter eller tankcontainer på 3.000 liter eller derover. Der skal være udstedt en ADR-godkendelsesattest af synsvirksomheden.")}
        ${infoCard("ANDRE KATEGORIER", "Uden for dette forløbs fokus", "Køretøjer til andre fareklasser – f.eks. EX/II og EX/III til ammunition og eksplosiver – har egne krav. Dette forløb handler om klasse 3 i tankvogn, så de nævnes kun som afgrænsning.")}
      </div>
      ${callout("Kontroller kategorien", "Kategoriseringen fremgår af køretøjets typegodkendelse eller kan findes hos Køretøjssikkerhedsinspektøren (KSI). Er du i tvivl, så spørg – før du læsser.", "teal")}
    `)}

    ${block("Dispensation", "To forskellige dispensationer – hold dem adskilt", `
      <div class="two-col">
        <div class="info-card">
          <span class="num">FARLIGT GODS</span>
          <h3>FMIBST 061-02 pkt. 13</h3>
          <p>Ved forhold, hvor transporten ikke kan gennemføres efter FMIBST 061-02, ADR, bekendtgørelsen eller AMovP-6, kan der søges om
          dispensation eller varig godkendelse på særlige vilkår. En dispensation kan maksimalt have en gyldighed på <b>12 måneder ad gangen</b>.</p>
          <p style="margin-top:8px">Ansøgningen skal som minimum indeholde problembeskrivelse, UN-numre, skriftlig risikovurdering kommenteret af
          sikkerhedsrådgiveren og forslag til løsning – herunder emballering, afmærkning, dokumentation, køretøj og ruter.</p>
        </div>
        <div class="info-card">
          <span class="num">PERIODISK SYN</span>
          <h3>FKOBST H.061-0 pkt. 7.3</h3>
          <p>Hvis den stedlige chef dispenserer for det periodiske syn på et enkeltkøretøj, skal en kopi af dispensationen indsættes i
          køretøjets kontrolbog.</p>
          <p style="margin-top:8px">Dispensationen kan alene ske af <b>operative årsager</b>. Forud skal det meddeles Forsvarskommandoen/Hærkommandoen
          og Forsvarets Bilsyn og omfatte afbødende foranstaltninger, herunder periode.</p>
        </div>
      </div>
      ${callout("Dispensation er ikke en blankocheck", "Den gælder præcis det, der står – i den periode, der står. Den kan ikke bruges som generel undtagelse eller udvides mundtligt. Læs vilkårene, og hav dokumentet med.", "red")}
    `)}

    ${block("Fritagelser i praksis", "Hvornår må du – og hvornår må du ikke?", `
      ${accordion([
        { q: "Må jeg køre med en defekt, hvis værkstedet først kan se på den i morgen?", a: "<p>Nej. Hvis defekten påvirker færdselssikkerheden – f.eks. bremser, styretøj, lys eller en kendt lækage – må køretøjet ikke bruges. Meld fejlen, og lad køretøjet stå.</p>" },
        { q: "Må jeg bruge håndværkerreglen, fordi mængden er lille?", a: "<p>Ikke alene fordi mængden er lille. Det afgørende er, om transporten er en underordnet del af dit eget arbejde. Kører du brændstof ud til en aktivitet, du ikke selv deltager i, er hovedformålet transport af farligt gods.</p>" },
        { q: "Må jeg køre uden transportdokument ved intern transport?", a: "<p>Ved intern transport efter FMIBST 061-02 pkt. 9.2 stilles der ikke krav om transportdokumentation – når betingelserne i øvrigt er opfyldt. Det gælder ikke automatisk for andre former for transport.</p>" },
        { q: "Må jeg køre på dispensation uden at have den med?", a: "<p>Nej. Dispensationen skal være skriftlig og medbringes. En dispensation, der ligger på kontoret, hjælper dig ikke ved en kontrol eller i en hændelse.</p>" },
        { q: "Må jeg følge ADR i stedet for FMIBST 061-02?", a: "<p>Transporten kan gennemføres efter FMIBST 061-02 eller efter ADR og den tilhørende nationale regulering. Valget skal træffes bevidst og dokumenteres – du kan ikke blande regelsættene undervejs.</p>" }
      ], "godkendelse-acc")}
    `)}`;

  /* ---- 11 Scenarier (specialvisning) ----------------------------- */
  const SPECIAL = {};

  function scenarioCard(ctx, sc, idx) {
    const res = (ctx.state.scenarios || {})[sc.id];
    return `
      <a class="info-card" href="#/scenarie/${esc(sc.id)}" data-link>
        <span class="num">SCENARIE ${String(idx + 1).padStart(2, "0")} ${res ? "· GENNEMFØRT" : ""}</span>
        <h3>${esc(sc.title)}</h3>
        <p>${esc(sc.situation.length > 150 ? sc.situation.slice(0, 147) + "…" : sc.situation)}</p>
        <div class="tag ${res ? "green" : "amber"}" style="margin-top:10px">${esc(sc.tag)}</div>
      </a>`;
  }

  function scenarioIndex(ctx) {
    const list = A.scenarios;
    const done = list.filter((s) => (ctx.state.scenarios || {})[s.id]).length;
    return `
      <div class="module-head fade-up" data-num="11">
        <div class="module-head-top">${pill("Modul 11", "amber")}${pill("12 min")}${done ? pill(done + "/6 gennemført", "green") : ""}</div>
        <div class="eyebrow">Praksis</div>
        <h1>Scenarier</h1>
        <p class="lead">Seks situationer, hvor reglerne skal omsættes til en beslutning. Der er ikke altid en “pæn” løsning –
        men der er en rækkefølge, der gør risikoen mindre.</p>
        <div class="module-meta"><span><b>Format:</b> Vælg et svar og få begrundelsen med det samme.</span><span><b>Kilder:</b> Alle fire publikationer</span></div>
      </div>
      <div class="content">
        <section class="block fade-up">
          <div class="block-head"><div><div class="block-label">Træning</div><h2>Vælg en situation</h2><p>Start med læsning og lækage – de to mest typiske tankvognssituationer.</p></div><span class="panel-link">${done}/6 gennemført</span></div>
          <div class="two-col">
            ${list.map((sc, i) => scenarioCard(ctx, sc, i)).join("")}
          </div>
        </section>
        <section class="block">
          <div class="row-between">
            <div><div class="block-label">Næste skridt</div><h3 style="margin-bottom:4px">Klar til at blive testet?</h3><p class="muted" style="font-size:12px;margin:0">Eksamen har 25 spørgsmål på tværs af hele forløbet. Du skal have mindst 80 % rigtige.</p></div>
            <a class="btn btn-primary" href="#/eksamen" data-link>Gå til eksamen →</a>
          </div>
        </section>
      </div>`;
  }

  function scenarioDetail(ctx, id) {
    const idx = A.scenarios.findIndex((s) => s.id === id);
    const sc = A.scenarios[idx];
    if (!sc) return notFound();
    const res = (ctx.state.scenarios || {})[id];
    const prev = A.scenarios[idx - 1];
    const next = A.scenarios[idx + 1];
    const choiceOffset = idx % sc.choices.length;
    const choiceOrder = sc.choices.map((_, i) => (i + choiceOffset) % sc.choices.length);

    return `
      <div class="module-head fade-up" data-num="11">
        <div class="module-head-top">${pill("Scenarie " + String(idx + 1).padStart(2, "0"), "amber")}${pill(sc.tag)}${res ? pill("Besvaret", "green") : ""}</div>
        <div class="eyebrow">Praksis · beslutning</div>
        <h1>${esc(sc.title)}</h1>
        <p class="lead">Læs situationen. Vælg det svar, du ville handle på i virkeligheden – ikke det, du tror lyder bedst.</p>
      </div>
      <div class="content">
        <div class="scenario-shell" data-scenario="${esc(sc.id)}">
          <div class="scenario-head">
            <div class="scenario-meta">
              <span class="tag amber">${esc(sc.tag)}</span>
              <div class="scenario-progress" role="group" aria-label="Scenarie ${idx + 1} af ${A.scenarios.length}">
                ${A.scenarios.map((s, i) => `<i class="${(ctx.state.scenarios || {})[s.id] ? "done" : ""} ${i === idx ? "active" : ""}"></i>`).join("")}
              </div>
            </div>
            <h2>Situationen</h2>
          </div>
          <div class="scenario-body">
            <p class="scenario-situation">${esc(sc.situation)}</p>
            <div class="scenario-choices" role="group" aria-label="Svarmuligheder">
              ${choiceOrder.map((original, displayIndex) => `
                <button class="choice" type="button" data-choice="${original}">
                  <span class="choice-letter">${String.fromCharCode(65 + displayIndex)}</span>
                  <span>${esc(sc.choices[original].t)}</span>
                </button>`).join("")}
            </div>
            <div class="scenario-feedback" id="scenarioFeedback" aria-live="polite"></div>
          </div>
        </div>
        <div class="module-nav">
          ${prev ? `<a href="#/scenarie/${esc(prev.id)}" data-link><small>← Forrige</small><strong>${esc(prev.title)}</strong></a>` : `<a href="#/scenarier" data-link><small>← Alle</small><strong>Scenarieoversigt</strong></a>`}
          ${next ? `<a class="next" href="#/scenarie/${esc(next.id)}" data-link><small>Næste →</small><strong>${esc(next.title)}</strong></a>` : `<a class="next" href="#/eksamen" data-link><small>Næste →</small><strong>Eksamen & bevis</strong></a>`}
        </div>
      </div>`;
  }

  SPECIAL.scenarier = (ctx) => `
    <section class="block fade-up">
      <div class="block-head"><div><div class="block-label">Vælg situation</div><h2>Seks beslutninger</h2><p>Svarene er ikke facit for alle lokale forhold – men begrundelserne viser den rigtige rækkefølge.</p></div></div>
      <div class="two-col">${A.scenarios.map((sc, i) => scenarioCard(ctx, sc, i)).join("")}</div>
      <div class="row mt-16"><a class="btn btn-primary btn-sm" href="#/eksamen" data-link>Gå til eksamen →</a></div>
    </section>`;

  /* ---- 12 Eksamen (specialvisning) ------------------------------- */
  function examBlocks(ctx) {
    const ex = ctx.state.exam || {};
    return `
      <section class="block fade-up" id="examIntro">
        <div class="block-head"><div><div class="block-label">Eksamen</div><h2>25 spørgsmål · 80 % for at bestå</h2><p>Spørgsmålene dækker hele forløbet. Du får resultatet og en gennemgang, når du har svaret på alle.</p></div></div>
        <div class="three-col">
          <div class="mstat"><span>Spørgsmål</span><b>25</b></div>
          <div class="mstat"><span>Beståelseskrav</span><b>80 %</b></div>
          <div class="mstat ${ex.passed ? "" : ""}"><span>Din bedste score</span><b>${ex.best != null ? esc(String(ex.best)) + " %" : "–"}</b></div>
        </div>
        <div class="callout teal mt-16">
          <div class="callout-title">Sådan foregår det</div>
          <p>Vælg ét svar pr. spørgsmål. Du kan gå frem og tilbage, indtil du afslutter. Når du har afsluttet, får du score,
          gennemgang af alle spørgsmål og – ved mindst 80 % – adgang til et gennemførelsesbevis.</p>
        </div>
        <div id="examStage"></div>
      </section>
      <section class="block">
        <div class="row-between">
          <div><div class="block-label">Forbehold</div><h3 style="margin-bottom:4px">Beviset er ikke en godkendelse</h3><p class="muted" style="font-size:12px;margin:0;max-width:640px">Gennemførelsesbeviset dokumenterer, at du har gennemført dette undervisningsforløb. Det er ikke et ADR-bevis, kørekort eller myndighedsgodkendelse.</p></div>
          <a class="btn btn-ghost btn-sm" href="#/bevis" data-link>Se bevis</a>
        </div>
      </section>`;
  }

  SPECIAL.eksamen = examBlocks;

  function examView(ctx) {
    return `
      <div class="module-head fade-up" data-num="12">
        <div class="module-head-top">${pill("Modul 12", "amber")}${pill("20 min")}${(ctx.state.exam || {}).passed ? pill("Bestået", "green") : ""}</div>
        <div class="eyebrow">Praksis · afslutning</div>
        <h1>Eksamen & bevis</h1>
        <p class="lead">Afslut forløbet med 25 spørgsmål. Du skal have mindst 80 % rigtige for at få et gennemførelsesbevis.</p>
      </div>
      <div class="content">${examBlocks(ctx)}</div>`;
  }

  /* ---- Diverse sider --------------------------------------------- */
  function tools() {
    const cards = [
      { href: "#/tjeklister", icon: "☑", title: "Tjekliste-center", text: "Alle syv tjeklister: beredskab, start, holdt, vadning, månedligt 1–4 og læs/los. Filtreret efter dit spor." },
      { href: "#/march", icon: "⏱", title: "Marchplanlægger", text: "Regn køretid, pauser og hvile igennem. Se hvor grænsen for daglig tjeneste, øvelse og personeltransport ligger." },
      { href: "#/transportregel", icon: "⇄", title: "Transportregel-vælger", text: "Svar på fire spørgsmål og få et kvalificeret bud på, hvilken regel der gælder – og hvad der skal med." },
      { href: "#/modul/tankvogn", icon: "◉", title: "Tankvognens hotspots", text: "Ti kritiske punkter på tankvognen: manhuller, ventiler, jording, slanger, pumpe, nødstop og dokumenter." },
      { href: "#/ordbog", icon: "A", title: "Ordbog", text: "ADR, FL/AT, PTO, NMCA, TIFT, håndværkerreglen og de øvrige begreber – kort og præcist." },
      { href: "#/kilder", icon: "§", title: "Kilder & afgrænsning", text: "De fire publikationer, deres rolle og hvad materialet ikke kan bruges til." },
      { href: "#/bevis", icon: "✦", title: "Gennemførelsesbevis", text: "Se dit bevis, hvis du har bestået eksamen. Kan udskrives – men er ikke en myndighedsgodkendelse." }
    ];
    return `
      <div class="module-head fade-up" data-num="V">
        <div class="module-head-top">${pill("Værktøjer", "teal")}</div>
        <div class="eyebrow">Praksis</div>
        <h1>Værktøjer</h1>
        <p class="lead">Det, du har brug for, når du ikke læser – men skal handle. Alle værktøjer virker uden login, og dine tjeklister gemmes lokalt i browseren.</p>
      </div>
      <div class="content">
        <section class="block fade-up">
          <h2 class="sr-only">Værktøjsoversigt</h2>
          <div class="tool-grid">
            ${cards.map((c) => `
              <a class="tool-card" href="${c.href}" data-link>
                <span class="tool-icon">${c.icon}</span>
                <h3>${c.title}</h3>
                <p>${c.text}</p>
                <span class="tool-link">Åbn →</span>
              </a>`).join("")}
          </div>
        </section>
        <section class="block">
          <div class="row-between">
            <div><div class="block-label">Udskrivning</div><h3 style="margin-bottom:4px">Tag tjeklisterne med på papir</h3><p class="muted" style="font-size:12px;margin:0">Åbn en tjekliste og tryk “Udskriv”. Siden er tilpasset print, så du får punkterne – ikke navigationen.</p></div>
            <a class="btn btn-ghost btn-sm" href="#/tjeklister" data-link>Vælg tjekliste</a>
          </div>
        </section>
      </div>`;
  }

  function checklistsPage(ctx) {
    const ids = Object.keys(A.checklists);
    return `
      <div class="module-head fade-up" data-num="B">
        <div class="module-head-top">${pill("Tjeklister", "amber")}${pill(ids.length + " lister")}</div>
        <div class="eyebrow">Værktøj</div>
        <h1>Tjekliste-center</h1>
        <p class="lead">Alle kørerens eftersyn og sikkerhedssekvensen ved læsning/losning. Punkterne filtreres efter dit spor, og dine markeringer gemmes automatisk i denne browser.</p>
      </div>
      <div class="content">
        <section class="block fade-up">
          <h2 class="sr-only">Tjeklister</h2>
          <div class="row-between mb-16">
            <div><div class="block-label">Status</div><h3 style="margin-bottom:4px">Vælg en liste</h3><p class="muted" style="font-size:12px;margin:0">${ctx.state.profile ? "Dit spor er sat til " + esc((A.profiles.find((p) => p.id === ctx.state.profile) || {}).label || "") + "." : "Vælg et spor i sidebaren for at skjule punkter, du ikke møder."}</p></div>
            <button class="btn btn-ghost btn-sm no-print" type="button" data-action="open-profile">Skift spor</button>
          </div>
          <div class="two-col">
            ${ids.map((id) => {
              const cl = A.checklists[id];
              const { done, total } = checklistsDone(ctx, id);
              const p = pct(done, total);
              return `
                <a class="info-card" href="#/tjekliste/${esc(id)}" data-link>
                  <span class="num">${esc(cl.code)} · ${esc(cl.source)}</span>
                  <h3>${esc(cl.title)}</h3>
                  <p>${esc(cl.intro.length > 150 ? cl.intro.slice(0, 147) + "…" : cl.intro)}</p>
                  <div class="row mt-16" style="justify-content:space-between">
                    <span class="tag ${p === 100 ? "green" : "amber"}">${done}/${total} udført</span>
                    <span class="panel-link">Åbn →</span>
                  </div>
                </a>`;
            }).join("")}
          </div>
        </section>
      </div>`;
  }

  function checklistPage(ctx, id) {
    const cl = A.checklists[id];
    if (!cl) return notFound();
    return `
      <div class="module-head fade-up" data-num="${esc(cl.code)}">
        <div class="module-head-top">${pill("Tjekliste " + cl.code, "amber")}${pill(cl.source)}</div>
        <div class="eyebrow">Eftersyn</div>
        <h1>${esc(cl.title)}</h1>
        <p class="lead">${esc(cl.intro)}</p>
      </div>
      <div class="content">
        <section class="block fade-up">
          <h2 class="sr-only">Tjekpunkter</h2>
          ${checklistHTML(id, ctx)}
        </section>
        <section class="block no-print">
          <div class="row-between">
            <div><div class="block-label">Relateret</div><h3 style="margin-bottom:4px">Læs mere om eftersynet</h3><p class="muted" style="font-size:12px;margin:0">Tjeklisten er et arbejdsredskab. Forklaringen finder du i modulerne.</p></div>
            <div class="row">
              <a class="btn btn-ghost btn-sm" href="#/tjeklister" data-link>Alle tjeklister</a>
              <a class="btn btn-ghost btn-sm" href="#/modul/eftersyn" data-link>Eftersynssystemet</a>
            </div>
          </div>
        </section>
      </div>`;
  }

  function marchPage() {
    return `
      <div class="module-head fade-up" data-num="M">
        <div class="module-head-top">${pill("Marchplanlægger", "teal")}${pill("FKOBST H.061-0 pkt. 2.11")}</div>
        <div class="eyebrow">Værktøj</div>
        <h1>Planlæg køretid, pause og hvile</h1>
        <p class="lead">Indtast tjenestetype, starttid og planlagt køretid. Værktøjet viser, hvornår pauserne skal ligge, og om planen
        overskrider grænsen for den valgte tjenestetype.</p>
      </div>
      <div class="content">
        <section class="block fade-up">
          <div class="block-head"><div><div class="block-label">Input</div><h2>Din march</h2><p>Værktøjet regner med hele kvarter og viser et principielt forløb – altid med forbehold for marchbefaling og lokale forhold.</p></div></div>
          <div class="form-grid">
            <div class="field">
              <label for="marchType">Tjenestetype</label>
              <select id="marchType">
                <option value="daily">Daglig tjeneste – maks. 2 x 4,5 timer</option>
                <option value="exercise">Øvelsesvirksomhed – maks. 3 x 4,5 timer</option>
                <option value="passenger">Personeltransport på lad – maks. 2 x 2 timer</option>
              </select>
              <small>Personeltransport har en skarpere grænse og 30 minutters pause.</small>
            </div>
            <div class="field">
              <label for="marchStart">Starttid</label>
              <input id="marchStart" type="time" value="06:00">
              <small>Bruges til at vise tidslinjen.</small>
            </div>
            <div class="field">
              <label for="marchDrive">Planlagt køretid (timer)</label>
              <input id="marchDrive" type="number" min="0" max="20" step="0.25" value="9">
              <small>Rattid – ikke samlet arbejdstid.</small>
            </div>
            <div class="field">
              <label for="marchExtend">Forlængelse</label>
              <label class="check-inline" style="text-transform:none;letter-spacing:0;font-weight:400;font-size:11.5px;color:var(--muted)">
                <input id="marchExtend" type="checkbox"> Brug forlængelse på op til 1 time (daglig tjeneste)
              </label>
              <small>Kræver, at forhold som at nå hjem eller en rasteplads taler for det.</small>
            </div>
            <div class="field full">
              <label for="marchNote">Bemærkning (valgfri)</label>
              <input id="marchNote" type="text" maxlength="120" placeholder="F.eks. kolonnekørsel, færge eller øvelseskredit">
              <small>Gemmes ikke – kun til din egen planlægning.</small>
            </div>
          </div>
          <div id="marchOutput" class="march-output" aria-live="polite"></div>
          <div id="marchWarning" class="march-warning"></div>
        </section>
        <section class="block">
          <div class="block-head"><div><div class="block-label">Regler</div><h2>Grænserne, værktøjet regner efter</h2></div></div>
          <div class="three-col">
            ${infoCard("DAGLIG", "2 x 4,5 timer", "Maksimal køretid er 9 timer. Kan forlænges med op til 1 time, hvis forholdene taler for det.")}
            ${infoCard("ØVELSE", "3 x 4,5 timer", "Maksimal køretid er 13,5 timer. Hvilekravet skal stadig kunne opfyldes.")}
            ${infoCard("PERSONEL", "2 x 2 timer", "Efter 2 timers kørsel skal der holdes mindst 30 minutters pause.")}
          </div>
          <div class="callout">
            <div class="callout-title">Værktøjet er en huskeliste</div>
            <p>Det erstatter ikke marchbefalingen, lokal planlægning eller en konkret vurdering af vejr, rute og mandskab. Kolonnekørsel med lav hastighed kræver reduceret køretid og yderligere pauser.</p>
          </div>
        </section>
      </div>`;
  }

  function wizardPage() {
    return `
      <div class="module-head fade-up" data-num="R">
        <div class="module-head-top">${pill("Transportregel", "teal")}${pill("FMIBST 061-02")}</div>
        <div class="eyebrow">Værktøj</div>
        <h1>Hvilken transportregel gælder?</h1>
        <p class="lead">Fire spørgsmål om sted, formål, last og dispensation. Du får et kvalificeret bud – ikke en myndighedsafgørelse.
        Er du i tvivl, spørger du sikkerhedsrådgiveren.</p>
      </div>
      <div class="content">
        <section class="block fade-up">
          <div class="wizard" id="transportWizard">
            <div class="wizard-top">
              <div class="wizard-steps" id="wizardSteps"></div>
              <button class="btn btn-ghost btn-sm" type="button" data-action="wizard-restart">Start forfra</button>
            </div>
            <div id="wizardBody"></div>
          </div>
        </section>
        <section class="block">
          <div class="block-head"><div><div class="block-label">Husk</div><h2>Reglen vælges før ruten</h2></div></div>
          <div class="two-col">
            <p class="muted" style="font-size:12.5px;line-height:1.7">Det er afsenderens ansvar at orientere chaufføren om valg af transportregel.
            Som kører skal du kunne se, at valget hænger sammen med last, dokumenter, mærkning og uddannelse.</p>
            <p class="muted" style="font-size:12.5px;line-height:1.7">Ved intern transport efter pkt. 9.2 stilles der ikke krav om transportdokumentation –
            men de øvrige betingelser gælder. Håndværkerreglen kræver, at transporten er en underordnet del af dit eget arbejde.</p>
          </div>
        </section>
      </div>`;
  }

  function glossaryPage() {
    return `
      <div class="module-head fade-up" data-num="A">
        <div class="module-head-top">${pill("Ordbog", "teal")}${pill(A.glossary.length + " begreber")}</div>
        <div class="eyebrow">Reference</div>
        <h1>Ordbog</h1>
        <p class="lead">De begreber, du møder i bestemmelserne, på transportdokumentet og i den daglige drift. Kort forklaret –
        med henvisning til hvor du læser mere.</p>
      </div>
      <div class="content">
        <section class="block fade-up">
          <div class="field glossary-search">
            <label for="glossarySearch">Søg i ordbogen</label>
            <input id="glossarySearch" type="search" placeholder="F.eks. FL/AT, PTO, dispensation…" autocomplete="off">
          </div>
          <dl class="glossary-grid" id="glossaryGrid">
            ${A.glossary.map((g) => `
              <div class="glossary-item" data-glossary>
                <dt>${esc(g.t)}</dt>
                <dd>${esc(g.d)}</dd>
              </div>`).join("")}
          </dl>
          <div class="glossary-empty hidden" id="glossaryEmpty">Ingen begreber matcher søgningen.</div>
        </section>
      </div>`;
  }

  function sourcesPage() {
    return `
      <div class="module-head fade-up" data-num="§">
        <div class="module-head-top">${pill("Kilder", "amber")}${pill("Version " + A.meta.version)}</div>
        <div class="eyebrow">Afgrænsning</div>
        <h1>Kilder & forbehold</h1>
        <p class="lead">Materialet er bygget på fire udleverede publikationer. Her er deres rolle – og grænserne for, hvad denne side kan bruges til.</p>
      </div>
      <div class="content">
        <section class="block fade-up">
          <div class="fvt-about">
            <div class="fvt-about-mark">
              <img src="assets/img/fvt-emblem.svg" alt="Forsvarets Vedligeholdelsestjenestes mærke" width="52" height="76">
            </div>
            <div class="fvt-about-copy">
              <div class="block-label">Om materialet</div>
              <h2>FVT-FFU undervisningsmateriale</h2>
              <p>Tankakademiet er udarbejdet som internt undervisningsmateriale i FVT-FFU-regi til oplæring og repetition
              af Forsvarets brændstofkørere. FVT står for Forsvarets Vedligeholdelsestjeneste.</p>
              <p>Materialet er ikke en officiel publikation fra FVT, en myndighedsgodkendelse eller en erstatning for
              gældende bestemmelser. Brug altid den aktuelle udgave af publikationerne og de lokale ordrer, der gælder
              på din enhed og dit anlæg.</p>
            </div>
          </div>
        </section>
        <section class="block fade-up">
          <h2 class="sr-only">Publikationer og forbehold</h2>
          <div class="source-grid">
            ${A.sources.map((s) => `
              <article class="source-card">
                <div class="source-code"><b>${esc(s.code)}</b>${esc(s.ref)}<br>${esc(s.year)}</div>
                <div>
                  <h3>${esc(s.title)}</h3>
                  <p>${esc(s.text)}</p>
                  <ul>${s.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
                </div>
              </article>`).join("")}
          </div>
        </section>
        <section class="block">
          <div class="block-head"><div><div class="block-label">Vigtigt</div><h2>Hvad materialet ikke er</h2></div></div>
          <div class="two-col">
            <div>
              <ul class="muted" style="font-size:12.5px;line-height:1.8;padding-left:18px">
                <li>Ikke en erstatning for gældende bestemmelser eller lokale ordrer.</li>
                <li>Ikke en myndighedsgodkendelse, et ADR-bevis eller et kørekort.</li>
                <li>Ikke en garanti for, at en konkret transport er lovlig.</li>
                <li>Ikke en fuldstændig gengivelse af publikationerne – der er udvalgt og forklaret.</li>
              </ul>
            </div>
            <div>
              <ul class="muted" style="font-size:12.5px;line-height:1.8;padding-left:18px">
                <li>Lokale ordrer, anlægsinstrukser og køretøjsbetjening kan være strengere.</li>
                <li>Ved tvivl: spørg sikkerhedsrådgiveren eller den ansvarlige myndighed.</li>
                <li>Kontroller altid, at du læser den aktuelle udgave af publikationen.</li>
                <li>Gennemførelsesbeviset dokumenterer kun dette undervisningsforløb.</li>
              </ul>
            </div>
          </div>
          <div class="callout red">
            <div class="callout-title">Juridisk nuance</div>
            <p>Forsvaret er ikke omfattet af den civile ADR-bekendtgørelse for køretøjer, der tilhører de danske eller udenlandske væbnede styrker.
            FMIBST 061-02 gælder i stedet og anvender ADR som referencegrundlag med militære afvigelser. Transporten kan også gennemføres efter
            ADR og den tilhørende nationale regulering. Valget skal træffes bevidst og dokumenteres.</p>
          </div>
        </section>
      </div>`;
  }

  function modulesPage(ctx) {
    return `
      <div class="module-head fade-up" data-num="13">
        <div class="module-head-top">${pill("Alle moduler", "amber")}</div>
        <div class="eyebrow">Forløb</div>
        <h1>Moduloversigt</h1>
        <p class="lead">Tretten moduler fra grundlag til eksamen. Læs dem i rækkefølge første gang – eller gå direkte til det, du har brug for at repetere.</p>
      </div>
      <div class="content">
        ${A.groups.map((g) => `
          <section class="block fade-up">
            <div class="block-head"><div><div class="block-label">${esc(g.label)}</div><h2>${esc(g.label)}</h2></div></div>
            <div class="path-list">
              ${g.modules.map((id) => {
                const m = modById(id);
                return `<a class="path-item ${ctx.state.completed[id] ? "done" : ""}" href="#/modul/${esc(id)}" data-link>
                  <span class="path-num">${esc(m.num)}</span>
                  <span class="path-copy"><strong>${esc(m.title)}</strong><small>${esc(m.summary)}</small></span>
                  <span class="path-state">${ctx.state.completed[id] ? "Færdig" : m.minutes + " min"}</span>
                </a>`;
              }).join("")}
            </div>
          </section>`).join("")}
      </div>`;
  }

  function certificatePage(ctx) {
    const ex = ctx.state.exam || {};
    const passed = !!ex.passed;
    if (!passed) {
      return `
        <div class="module-head fade-up" data-num="✦">
          <div class="module-head-top">${pill("Bevis", "amber")}${pill("Låst", "red")}</div>
          <div class="eyebrow">Afslutning</div>
          <h1>Gennemførelsesbevis</h1>
          <p class="lead">Beviset bliver tilgængeligt, når du har bestået eksamen med mindst 80 % rigtige.</p>
        </div>
        <div class="content">
          <section class="block fade-up">
            <div class="row-between">
              <div><div class="block-label">Status</div><h3 style="margin-bottom:4px">Ingen bestået eksamen endnu</h3><p class="muted" style="font-size:12px;margin:0">${ex.best != null ? "Din bedste score er " + esc(String(ex.best)) + " %." : "Du har ikke taget eksamen endnu."} Du kan prøve igen, så mange gange du vil.</p></div>
              <a class="btn btn-primary" href="#/eksamen" data-link>Gå til eksamen →</a>
            </div>
          </section>
        </div>`;
    }
    const name = ctx.state.name || ctx.state.certName || "Navn ikke angivet";
    const profile = A.profiles.find((p) => p.id === ctx.state.profile);
    const date = ex.date ? new Date(ex.date) : new Date();
    const dateText = isNaN(date.getTime()) ? "–" : date.toLocaleDateString("da-DK", { day: "2-digit", month: "long", year: "numeric" });
    const modsDone = A.modules.filter((m) => ctx.state.completed[m.id]).length;

    return `
      <div class="module-head fade-up no-print" data-num="✦">
        <div class="module-head-top">${pill("Bevis", "green")}${pill("Bestået", "green")}</div>
        <div class="eyebrow">Afslutning</div>
        <h1>Gennemførelsesbevis</h1>
        <p class="lead">Beviset dokumenterer, at du har gennemført FVT-FFU-undervisningsmaterialet Tankakademiet og bestået eksamen. Det er ikke en myndighedsgodkendelse.</p>
      </div>
      <div class="content">
        <div class="certificate" id="certificate">
          <div class="certificate-inner">
            <div class="cert-brand">
              <img src="assets/img/fvt-emblem.svg" alt="Forsvarets Vedligeholdelsestjenestes mærke" width="52" height="76">
              <span class="cert-brand-copy">
                <b>FVT-FFU</b>
                <span>Forsvarets Vedligeholdelsestjeneste</span>
                <small>Undervisningsmateriale</small>
              </span>
            </div>
            <div class="cert-kicker">Gennemførelsesbevis</div>
            <h2>Tankakademiet</h2>
            <div class="cert-sub">Brændstof · klasse 3 · Forsvaret</div>
            <div class="cert-name">${esc(name)}</div>
            <p class="cert-text">har gennemført FVT-FFU-undervisningsforløbet Tankakademiet i køretøjseftersyn, køre- og hviletid,
            FMIBST 061-02 og transport af klasse 3 med tankvogn – og bestået den afsluttende eksamen.</p>
            <div class="cert-grid">
              <div class="cert-stat"><span>Resultat</span><b>${esc(String(ex.best || 0))} %</b></div>
              <div class="cert-stat"><span>Spor</span><b>${esc(profile ? profile.label : "Generelt")}</b></div>
              <div class="cert-stat"><span>Moduler</span><b>${modsDone}/${A.modules.length}</b></div>
            </div>
            <div class="cert-foot">
              <span>Dato: ${esc(dateText)}</span>
              <span>Forløb: ${esc(A.meta.version)} · Eksamensdato: ${ex.date ? esc(new Date(ex.date).toLocaleDateString("da-DK")) : "–"}</span>
            </div>
            <div class="cert-disclaimer">
              Dette bevis er dokumentation for gennemført FVT-FFU-undervisningsforløb i Tankakademiet. Det er ikke et ADR-bevis,
              kørekort, militær godkendelse eller myndighedsgodkendelse og giver ikke ret til at føre et bestemt køretøj eller
              transportere farligt gods. Gældende bestemmelser, lokale ordrer og myndighedskrav har forrang.
            </div>
          </div>
        </div>
        <div class="row no-print" style="justify-content:center;margin-top:18px">
          <button class="btn btn-primary" type="button" data-action="print-cert">Udskriv bevis</button>
          <a class="btn btn-ghost" href="#/eksamen" data-link>Se eksamen</a>
          <a class="btn btn-ghost" href="#/kilder" data-link>Kilder & forbehold</a>
        </div>
      </div>`;
  }

  function notFound() {
    return `
      <div class="module-head fade-up" data-num="404">
        <div class="module-head-top">${pill("Ikke fundet", "red")}</div>
        <div class="eyebrow">Navigation</div>
        <h1>Siden findes ikke</h1>
        <p class="lead">Linket peger på et modul eller en side, der ikke findes i denne version.</p>
      </div>
      <div class="content"><section class="block"><div class="row"><a class="btn btn-primary" href="#/" data-link>Gå til forsiden</a><a class="btn btn-ghost" href="#/moduler" data-link>Se moduler</a></div></section></div>`;
  }

  /* ---- Eksport ---------------------------------------------------- */
  window.VIEWS = {
    home: home,
    module: moduleView,
    modules: modulesPage,
    tools: tools,
    checklists: checklistsPage,
    checklist: checklistPage,
    march: marchPage,
    wizard: wizardPage,
    glossary: glossaryPage,
    sources: sourcesPage,
    scenarios: scenarioIndex,
    scenario: scenarioDetail,
    exam: examView,
    certificate: certificatePage,
    notFound: notFound,
    HOTSPOTS: HOTSPOTS
  };
})();

