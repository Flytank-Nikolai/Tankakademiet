/* ==========================================================================
   TANKAKADEMIET — app
   Routing, tilstand, tjeklister, værktøjer, scenarier, eksamen og bevis.
   Klassisk script — ingen imports, virker fra file://.
   ========================================================================== */

(function () {
  "use strict";

  var A = window.ACADEMY;
  var V = window.VIEWS;

  if (!A || !V) {
    document.addEventListener("DOMContentLoaded", function () {
      var main = document.getElementById("main");
      if (main) {
        main.innerHTML = '<div class="content"><section class="block"><h2>Indlæsningsfejl</h2><p class="muted">Data eller visninger kunne ikke indlæses. Kontroller, at assets/data.js og assets/views.js ligger samme sted som app.js.</p></section></div>';
      }
    });
    return;
  }

  var STORAGE_KEY = "tankakademiet.v1";
  var THEME_KEY = "tankakademiet.theme";

  var main = document.getElementById("main");
  var sideNav = document.getElementById("sideNav");
  var sidebar = document.getElementById("sidebar");
  var scrim = document.querySelector(".sidebar-scrim");
  var menuBtn = document.querySelector(".menu-btn");
  var modalRoot = document.getElementById("modalRoot");
  var searchOverlay = document.getElementById("searchOverlay");
  var searchInput = document.getElementById("searchInput");
  var searchResults = document.getElementById("searchResults");
  var toastEl = document.getElementById("toast");
  var profileName = document.getElementById("profileName");
  var profileMeta = document.getElementById("profileMeta");
  var profileAvatar = document.getElementById("profileAvatar");
  var sideProgressText = document.getElementById("sideProgressText");
  var sideProgressBar = document.getElementById("sideProgressBar");
  var crumbsEl = document.getElementById("crumbs");

  var toastTimer = null;
  var lastFocus = null;
  var currentRoute = { name: "home" };
  var wizardActive = false;
  var wizardStep = 0;
  var wizardAnswers = {};
  var searchIndex = null;
  var searchBuilt = false;

  /* ------------------------------------------------------------------
     Hjælpere
     ------------------------------------------------------------------ */

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function norm(value) {
    return String(value == null ? "" : value)
      .toLowerCase()
      .replace(/æ/g, "ae")
      .replace(/ø/g, "o")
      .replace(/å/g, "aa")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function clock(minutes) {
    var m = ((Math.round(minutes) % 1440) + 1440) % 1440;
    return pad2(Math.floor(m / 60)) + ":" + pad2(m % 60);
  }

  function fmtHours(hours) {
    var total = Math.round(Number(hours) * 60);
    var h = Math.floor(total / 60);
    var m = total % 60;
    if (!h) return m + " min";
    if (!m) return h + " t";
    return h + " t " + m + " min";
  }

  function moduleById(id) {
    return A.modules.find(function (m) { return m.id === id; });
  }

  function profileById(id) {
    return A.profiles.find(function (p) { return p.id === id; });
  }

  function moduleDone(id) {
    if (!id) return false;
    if (id === "eksamen") {
      return !!state.completed[id] || !!(state.exam && state.exam.passed);
    }
    if (id === "scenarier") {
      var all = A.scenarios.length > 0 && A.scenarios.every(function (s) {
        return !!(state.scenarios && state.scenarios[s.id]);
      });
      return !!state.completed[id] || all;
    }
    return !!state.completed[id];
  }

  function doneModuleCount() {
    return A.modules.filter(function (m) { return moduleDone(m.id); }).length;
  }

  /* ------------------------------------------------------------------
     Tilstand
     ------------------------------------------------------------------ */

  function defaultState() {
    return {
      completed: {},
      checklists: {},
      profile: "",
      checklistShowAll: false,
      scenarios: {},
      exam: {
        active: false,
        answers: {},
        current: 0,
        best: null,
        passed: false,
        date: null,
        result: null
      },
      name: "",
      certName: ""
    };
  }

  function ensureExam() {
    var base = defaultState().exam;
    if (!state.exam || typeof state.exam !== "object") state.exam = {};
    Object.keys(base).forEach(function (key) {
      if (state.exam[key] == null) state.exam[key] = base[key];
    });
    if (!state.exam.answers || typeof state.exam.answers !== "object" || Array.isArray(state.exam.answers)) {
      state.exam.answers = {};
    }
    if (typeof state.exam.current !== "number" || state.exam.current < 0) state.exam.current = 0;
  }

  function loadState() {
    var base = defaultState();
    try {
      var raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (raw && typeof raw === "object") {
        base.completed = raw.completed && typeof raw.completed === "object" ? raw.completed : {};
        base.checklists = raw.checklists && typeof raw.checklists === "object" ? raw.checklists : {};
        base.profile = typeof raw.profile === "string" ? raw.profile : "";
        base.checklistShowAll = !!raw.checklistShowAll;
        base.scenarios = raw.scenarios && typeof raw.scenarios === "object" ? raw.scenarios : {};
        base.exam = Object.assign(base.exam, raw.exam && typeof raw.exam === "object" ? raw.exam : {});
        base.name = typeof raw.name === "string" ? raw.name : "";
        base.certName = typeof raw.certName === "string" ? raw.certName : "";
      }
    } catch (err) {
      console.warn("Kunne ikke læse gemt tilstand:", err);
    }
    return base;
  }

  var state = loadState();
  ensureExam();

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn("Kunne ikke gemme tilstand:", err);
    }
  }

  /* ------------------------------------------------------------------
     Toast, tema og sidebar
     ------------------------------------------------------------------ */

  function showToast(message, type) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.className = "toast show" + (type ? " " + type : "");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.className = "toast";
    }, 3600);
  }

  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (err) { saved = null; }
    if (saved === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else if (saved === "dark") {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  function toggleTheme() {
    var isLight = document.documentElement.getAttribute("data-theme") === "light";
    if (isLight) {
      document.documentElement.removeAttribute("data-theme");
      try { localStorage.setItem(THEME_KEY, "dark"); } catch (err) {}
      showToast("Mørk visning slået til");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      try { localStorage.setItem(THEME_KEY, "light"); } catch (err) {}
      showToast("Lys visning slået til");
    }
  }

  function setSidebar(open) {
    if (!sidebar) return;
    sidebar.classList.toggle("open", !!open);
    if (scrim) scrim.classList.toggle("show", !!open);
    if (menuBtn) menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function closeSidebar() {
    setSidebar(false);
  }

  /* ------------------------------------------------------------------
     Routing
     ------------------------------------------------------------------ */

  function routeFromHash() {
    var raw = (window.location.hash || "#/").replace(/^#\/?/, "");
    var parts = raw.split("/").filter(Boolean).map(function (part) {
      try { return decodeURIComponent(part); } catch (err) { return part; }
    });

    if (!parts.length) return { name: "home" };

    switch (parts[0]) {
      case "modul": return { name: "module", id: parts[1] || "" };
      case "moduler": return { name: "modules" };
      case "vaerktoejer": return { name: "tools" };
      case "tjeklister": return { name: "checklists" };
      case "tjekliste": return { name: "checklist", id: parts[1] || "" };
      case "march": return { name: "march" };
      case "transportregel": return { name: "wizard" };
      case "ordbog": return { name: "glossary" };
      case "kilder": return { name: "sources" };
      case "scenarier": return { name: "scenarios" };
      case "scenarie": return { name: "scenario", id: parts[1] || "" };
      case "eksamen": return { name: "exam" };
      case "bevis": return { name: "certificate" };
      default: return { name: "notfound" };
    }
  }

  function render(options) {
    options = options || {};
    var previousName = currentRoute.name;
    var route = routeFromHash();
    currentRoute = route;

    if (route.name !== "wizard") wizardActive = false;

    var ctx = { state: state };
    var html = "";
    var title = "Tankakademiet";
    var crumbs = "";

    try {
      switch (route.name) {
        case "home":
          html = V.home(ctx);
          title = "Tankakademiet · FVT-FFU undervisningsmateriale";
          crumbs = '<span class="current">Forsiden</span>';
          break;

        case "modules":
          html = V.modules(ctx);
          title = "Moduloversigt · Tankakademiet";
          crumbs = '<a href="#/" data-link>Forsiden</a><span class="sep">/</span><span class="current">Moduloversigt</span>';
          break;

        case "module": {
          var mod = moduleById(route.id);
          html = V.module(ctx, route.id);
          if (mod) {
            var group = A.groups.find(function (g) { return g.id === mod.group; });
            title = mod.title + " · Tankakademiet";
            crumbs = '<a href="#/" data-link>Forsiden</a><span class="sep">/</span>' +
              '<a href="#/moduler" data-link>Forløb</a><span class="sep">/</span>' +
              '<span class="current">' + esc(group ? group.label : "Modul") + " · " + esc(mod.short) + "</span>";
          } else {
            title = "Siden findes ikke · Tankakademiet";
            crumbs = '<a href="#/" data-link>Forsiden</a><span class="sep">/</span><span class="current">Ikke fundet</span>';
          }
          break;
        }

        case "tools":
          html = V.tools();
          title = "Værktøjer · Tankakademiet";
          crumbs = '<a href="#/" data-link>Forsiden</a><span class="sep">/</span><span class="current">Værktøjer</span>';
          break;

        case "checklists":
          html = V.checklists(ctx);
          title = "Tjeklister · Tankakademiet";
          crumbs = '<a href="#/" data-link>Forsiden</a><span class="sep">/</span><a href="#/vaerktoejer" data-link>Værktøjer</a><span class="sep">/</span><span class="current">Tjeklister</span>';
          break;

        case "checklist": {
          var cl = A.checklists[route.id];
          html = V.checklist(ctx, route.id);
          title = (cl ? cl.title : "Tjekliste") + " · Tankakademiet";
          crumbs = '<a href="#/" data-link>Forsiden</a><span class="sep">/</span><a href="#/tjeklister" data-link>Tjeklister</a><span class="sep">/</span><span class="current">' + esc(cl ? cl.title : "Ikke fundet") + "</span>";
          break;
        }

        case "march":
          html = V.march();
          title = "Marchplanlægger · Tankakademiet";
          crumbs = '<a href="#/" data-link>Forsiden</a><span class="sep">/</span><a href="#/vaerktoejer" data-link>Værktøjer</a><span class="sep">/</span><span class="current">Marchplanlægger</span>';
          break;

        case "wizard":
          html = V.wizard();
          title = "Transportregel · Tankakademiet";
          crumbs = '<a href="#/" data-link>Forsiden</a><span class="sep">/</span><a href="#/vaerktoejer" data-link>Værktøjer</a><span class="sep">/</span><span class="current">Transportregel</span>';
          break;

        case "glossary":
          html = V.glossary();
          title = "Ordbog · Tankakademiet";
          crumbs = '<a href="#/" data-link>Forsiden</a><span class="sep">/</span><a href="#/vaerktoejer" data-link>Værktøjer</a><span class="sep">/</span><span class="current">Ordbog</span>';
          break;

        case "sources":
          html = V.sources();
          title = "Kilder & forbehold · Tankakademiet";
          crumbs = '<a href="#/" data-link>Forsiden</a><span class="sep">/</span><span class="current">Kilder & forbehold</span>';
          break;

        case "scenarios":
          html = V.scenarios(ctx);
          title = "Scenarier · Tankakademiet";
          crumbs = '<a href="#/" data-link>Forsiden</a><span class="sep">/</span><a href="#/moduler" data-link>Forløb</a><span class="sep">/</span><span class="current">Scenarier</span>';
          break;

        case "scenario": {
          var scenario = A.scenarios.find(function (s) { return s.id === route.id; });
          html = V.scenario(ctx, route.id);
          title = (scenario ? scenario.title : "Scenarie") + " · Tankakademiet";
          crumbs = '<a href="#/" data-link>Forsiden</a><span class="sep">/</span><a href="#/scenarier" data-link>Scenarier</a><span class="sep">/</span><span class="current">' + esc(scenario ? scenario.title : "Ikke fundet") + "</span>";
          break;
        }

        case "exam":
          html = V.exam(ctx);
          title = "Eksamen & bevis · Tankakademiet";
          crumbs = '<a href="#/" data-link>Forsiden</a><span class="sep">/</span><a href="#/moduler" data-link>Forløb</a><span class="sep">/</span><span class="current">Eksamen</span>';
          break;

        case "certificate":
          html = V.certificate(ctx);
          title = "Gennemførelsesbevis · Tankakademiet";
          crumbs = '<a href="#/" data-link>Forsiden</a><span class="sep">/</span><a href="#/eksamen" data-link>Eksamen</a><span class="sep">/</span><span class="current">Bevis</span>';
          break;

        default:
          html = V.notFound();
          title = "Siden findes ikke · Tankakademiet";
          crumbs = '<a href="#/" data-link>Forsiden</a><span class="sep">/</span><span class="current">Ikke fundet</span>';
          break;
      }
    } catch (err) {
      console.error("Renderfejl:", err);
      html = '<div class="module-head fade-up" data-num="!"><div class="module-head-top"><span class="pill red">Fejl</span></div><div class="eyebrow">Teknisk</div><h1>Siden kunne ikke vises</h1><p class="lead">Der opstod en fejl under indlæsningen af visningen. Prøv at genindlæse siden.</p></div><div class="content"><section class="block"><button class="btn btn-primary" type="button" onclick="location.reload()">Genindlæs</button></section></div>';
      title = "Fejl · Tankakademiet";
      crumbs = '<span class="current">Fejl</span>';
    }

    main.innerHTML = html;
    document.title = title;
    if (crumbsEl) crumbsEl.innerHTML = crumbs;

    updateChrome(route);

    if (!options.keepScroll) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    initRoute(route);

    if (previousName !== route.name || route.name !== "wizard") {
      closeSidebar();
    }
  }

  function updateChrome(route) {
    route = route || currentRoute;
    var activeModule = "";
    if (route.name === "module") activeModule = route.id;
    if (route.name === "scenarios" || route.name === "scenario") activeModule = "scenarier";
    if (route.name === "exam" || route.name === "certificate") activeModule = "eksamen";

    buildNav(activeModule, route);
    updateProfileCard();

    var done = A.modules.filter(function (m) { return !!state.completed[m.id]; }).length;
    var total = A.modules.length;
    if (sideProgressText) sideProgressText.textContent = done + "/" + total;
    if (sideProgressBar) sideProgressBar.style.width = (total ? Math.round(done / total * 100) : 0) + "%";
  }

  function buildNav(activeModule, route) {
    if (!sideNav) return;

    var html = "";
    A.groups.forEach(function (group) {
      html += '<div class="nav-group"><div class="nav-label">' + esc(group.label) + "</div>";
      group.modules.forEach(function (id) {
        var m = moduleById(id);
        if (!m) return;
        var href = id === "eksamen" ? "#/eksamen" : id === "scenarier" ? "#/scenarier" : "#/modul/" + id;
        var active = id === activeModule || (id === "scenarier" && activeModule === "scenarier") || (id === "eksamen" && activeModule === "eksamen");
        html += '<a class="nav-item' + (active ? " active" : "") + (moduleDone(id) ? " done" : "") + '" href="' + href + '" data-link>' +
          '<span class="nav-num">' + esc(m.num) + "</span>" +
          '<span class="nav-title">' + esc(m.short) + "</span>" +
          '<span class="nav-check" aria-hidden="true">✓</span>' +
          "</a>";
      });
      html += "</div>";
    });

    var tools = [
      { href: "#/tjeklister", key: "checklists", label: "Tjeklister", icon: "✓" },
      { href: "#/march", key: "march", label: "Marchplanlægger", icon: "◷" },
      { href: "#/transportregel", key: "wizard", label: "Transportregel", icon: "⇄" },
      { href: "#/ordbog", key: "glossary", label: "Ordbog", icon: "A" },
      { href: "#/kilder", key: "sources", label: "Kilder", icon: "§" }
    ];
    var activeTool = route && (route.name === "checklist" ? "checklists" : route.name);

    html += '<div class="nav-group"><div class="nav-label">Værktøj & reference</div>';
    tools.forEach(function (tool) {
      html += '<a class="nav-item' + (tool.key === activeTool ? " active" : "") + '" href="' + tool.href + '" data-link>' +
        '<span class="nav-num">' + esc(tool.icon) + "</span>" +
        '<span class="nav-title">' + esc(tool.label) + "</span>" +
        "</a>";
    });
    html += "</div>";

    sideNav.innerHTML = html;
  }

  function updateProfileCard() {
    var profile = profileById(state.profile);
    var name = String(state.name || "").trim();
    if (profileName) profileName.textContent = name || (profile ? profile.label : "Vælg dit spor");
    if (profileMeta) {
      profileMeta.textContent = profile
        ? profile.desc
        : (name ? "Sæt et spor for at filtrere tjeklisterne" : "Tilpas indholdet til din køretøjstype");
    }
    if (profileAvatar) {
      profileAvatar.textContent = name
        ? name.charAt(0).toUpperCase()
        : (profile ? profile.label.charAt(0).toUpperCase() : "–");
    }
  }

  /* ------------------------------------------------------------------
     Init efter render
     ------------------------------------------------------------------ */

  function initRoute(route) {
    switch (route.name) {
      case "march":
        initMarch();
        break;
      case "wizard":
        initWizard();
        break;
      case "exam":
        renderExamStage();
        break;
      case "module":
        if (route.id === "eksamen") renderExamStage();
        break;
      case "glossary":
        initGlossary();
        break;
      case "certificate":
        initCertificate();
        break;
      default:
        break;
    }
  }

  /* ------------------------------------------------------------------
     Profilmodal
     ------------------------------------------------------------------ */

  function openModal(html) {
    if (!modalRoot) return;
    modalRoot.innerHTML = '<div class="modal-overlay" data-modal-overlay><div class="modal" role="dialog" aria-modal="true">' + html + "</div></div>";
    document.body.style.overflow = "hidden";
    window.setTimeout(function () {
      var focusable = modalRoot.querySelector("input, button, select, textarea, [tabindex]");
      if (focusable) focusable.focus();
    }, 30);
  }

  function closeModal() {
    if (!modalRoot) return;
    modalRoot.innerHTML = "";
    document.body.style.overflow = "";
  }

  function openProfileModal() {
    var selected = state.profile || "";
    var options = [{ id: "", label: "Generelt spor", desc: "Vis alle punkter og alt indhold" }].concat(A.profiles);

    var html = '<div class="modal-head">' +
      '<div><h2>Tilpas dit spor</h2><p>Vælg den køretøjstype og de opgaver, du møder. Så filtreres tjeklisterne, og relevante tank-, kran- og vadningspunkter fremhæves.</p></div>' +
      '<button class="icon-btn" type="button" data-action="close-modal" aria-label="Luk">✕</button>' +
      "</div>" +
      '<div class="modal-body">' +
      '<div class="profile-options">' +
      options.map(function (p) {
        var on = p.id === selected;
        return '<button class="profile-option' + (on ? " on" : "") + '" type="button" data-profile="' + esc(p.id) + '">' +
          '<span class="po-check">✓</span>' +
          "<span><strong>" + esc(p.label) + "</strong><br><small class=\"muted\">" + esc(p.desc) + "</small></span>" +
          "</button>";
      }).join("") +
      "</div>" +
      '<div class="field" style="margin-top:14px">' +
      '<label for="profileNameInput">Navn til gennemførelsesbevis</label>' +
      '<input id="profileNameInput" type="text" maxlength="80" autocomplete="name" placeholder="Fornavn og efternavn" value="' + esc(state.name || "") + '">' +
      "<small>Valgfrit. Navnet bruges kun på beviset i denne browser og sendes ikke nogen steder.</small>" +
      "</div>" +
      "</div>" +
      '<div class="modal-foot">' +
      '<button class="btn btn-ghost" type="button" data-action="close-modal">Annuller</button>' +
      '<button class="btn btn-primary" type="button" data-action="save-profile">Gem</button>' +
      "</div>";

    openModal(html);
  }

  function saveProfile() {
    var selected = modalRoot ? modalRoot.querySelector(".profile-option.on") : null;
    state.profile = selected ? (selected.getAttribute("data-profile") || "") : "";
    var nameInput = document.getElementById("profileNameInput");
    if (nameInput) {
      state.name = nameInput.value.trim();
      state.certName = state.name;
    }
    saveState();
    closeModal();
    render({ keepScroll: true });
    showToast(state.profile ? "Spor og indstillinger gemt" : "Spor ryddet – alle punkter vises", "good");
  }

  function confirmDialog(title, body, onConfirm, confirmLabel) {
    var html = '<div class="modal-head"><div><h2>' + esc(title) + "</h2><p>" + esc(body) + "</p></div>" +
      '<button class="icon-btn" type="button" data-action="close-modal" aria-label="Luk">✕</button></div>' +
      '<div class="modal-foot" style="padding-top:18px">' +
      '<button class="btn btn-ghost" type="button" data-action="close-modal">Annuller</button>' +
      '<button class="btn btn-primary" type="button" data-confirm-yes>' + esc(confirmLabel || "Ja, fortsæt") + "</button>" +
      "</div>";
    openModal(html);
    var yes = modalRoot ? modalRoot.querySelector("[data-confirm-yes]") : null;
    if (yes) {
      yes.addEventListener("click", function () {
        closeModal();
        onConfirm();
      }, { once: true });
    }
  }

  /* ------------------------------------------------------------------
     Tjeklister
     ------------------------------------------------------------------ */

  function checklistState(id) {
    if (!state.checklists[id] || typeof state.checklists[id] !== "object") state.checklists[id] = {};
    return state.checklists[id];
  }

  function updateChecklistCounters(shell) {
    if (!shell) return;
    var id = shell.getAttribute("data-checklist");
    var cl = A.checklists[id];
    if (!cl) return;

    var st = checklistState(id);
    var showAll = shell.getAttribute("data-show-all") === "1";
    var profile = state.profile || "";
    var total = 0;
    var done = 0;
    var faults = 0;

    cl.groups.forEach(function (group) {
      group.items.forEach(function (item) {
        var relevant = !profile || showAll || !item.p || !item.p.length || item.p.indexOf(profile) !== -1;
        if (relevant) total++;
        var rec = st[item.id] || {};
        if (rec.done) done++;
        if (rec.fault) faults++;
      });
    });

    var percent = total ? Math.round(done / total * 100) : 0;
    var ring = shell.querySelector("[data-cl-ring]");
    var pctEl = shell.querySelector("[data-cl-pct]");
    var countEl = shell.querySelector("[data-cl-count]");
    var totalEl = shell.querySelector("[data-cl-total]");
    var faultEl = shell.querySelector("[data-cl-faults]");
    var faultLine = shell.querySelector("[data-cl-fault-line]");

    if (ring) ring.style.setProperty("--p", percent);
    if (pctEl) pctEl.textContent = percent + "%";
    if (countEl) countEl.textContent = done;
    if (totalEl) totalEl.textContent = total;
    if (faultEl) faultEl.textContent = faults;
    if (faultLine) faultLine.textContent = faults ? faults + " punkt(er) markeret som fejl" : "Ingen fejl markeret";

    if (percent === 100 && total > 0) {
      showToast("Tjeklisten er fuldført – husk at melde eventuelle fejl.", "good");
    }
  }

  function toggleChecklistItem(button) {
    var item = button.closest(".cl-item");
    var shell = item ? item.closest("[data-checklist]") : null;
    if (!item || !shell) return;

    var id = shell.getAttribute("data-checklist");
    var itemId = item.getAttribute("data-item");
    var st = checklistState(id);
    var rec = st[itemId] || {};

    rec.done = !rec.done;
    if (rec.done) {
      rec.doneAt = new Date().toISOString();
    } else {
      delete rec.doneAt;
    }
    st[itemId] = rec;

    item.classList.toggle("done", !!rec.done);
    button.setAttribute("aria-pressed", rec.done ? "true" : "false");
    saveState();
    updateChecklistCounters(shell);
  }

  function toggleChecklistFault(button) {
    var item = button.closest(".cl-item");
    var shell = item ? item.closest("[data-checklist]") : null;
    if (!item || !shell) return;

    var id = shell.getAttribute("data-checklist");
    var itemId = item.getAttribute("data-item");
    var st = checklistState(id);
    var rec = st[itemId] || {};

    rec.fault = !rec.fault;
    st[itemId] = rec;

    item.classList.toggle("fault", !!rec.fault);
    button.setAttribute("aria-pressed", rec.fault ? "true" : "false");
    saveState();
    updateChecklistCounters(shell);

    if (rec.fault) {
      showToast("Fejl markeret. Beskriv fejlen og hvem den er meldt til.", "bad");
      var note = item.querySelector("textarea");
      if (note) window.setTimeout(function () { note.focus(); }, 60);
    }
  }

  function updateChecklistNote(textarea) {
    var item = textarea.closest(".cl-item");
    var shell = item ? item.closest("[data-checklist]") : null;
    if (!item || !shell) return;

    var id = shell.getAttribute("data-checklist");
    var itemId = item.getAttribute("data-item");
    var st = checklistState(id);
    var rec = st[itemId] || {};
    rec.note = textarea.value;
    st[itemId] = rec;
    saveState();
  }

  function resetChecklist(shell) {
    if (!shell) return;
    var id = shell.getAttribute("data-checklist");
    var cl = A.checklists[id];
    confirmDialog(
      "Nulstil tjeklisten?",
      "Alle markeringer og noter i " + (cl ? cl.title : "tjeklisten") + " fjernes fra denne browser. Det kan ikke fortrydes.",
      function () {
        state.checklists[id] = {};
        saveState();
        render({ keepScroll: true });
        showToast("Tjeklisten er nulstillet", "good");
      },
      "Nulstil"
    );
  }

  function printChecklist(shell) {
    if (!shell) {
      window.print();
      return;
    }

    var hidden = [];
    var node = shell;
    while (node && node !== main) {
      var parent = node.parentElement;
      if (!parent) break;
      Array.prototype.forEach.call(parent.children, function (sibling) {
        if (sibling !== node && !sibling.classList.contains("no-print")) {
          hidden.push([sibling, sibling.style.display]);
          sibling.style.display = "none";
        }
      });
      node = parent;
    }

    var restored = false;
    function restore() {
      if (restored) return;
      restored = true;
      hidden.forEach(function (pair) {
        pair[0].style.display = pair[1] || "";
      });
      window.removeEventListener("afterprint", restore);
    }

    window.addEventListener("afterprint", restore);
    window.print();
    window.setTimeout(restore, 4000);
  }

  /* ------------------------------------------------------------------
     Marchplanlægger
     ------------------------------------------------------------------ */

  function initMarch() {
    var type = document.getElementById("marchType");
    var start = document.getElementById("marchStart");
    var drive = document.getElementById("marchDrive");
    var extend = document.getElementById("marchExtend");
    var note = document.getElementById("marchNote");

    if (!type || !start || !drive || !extend) return;

    function update() {
      var values = marchValues(type.value);
      var extChecked = !!extend.checked && type.value === "daily";
      extend.disabled = type.value !== "daily";
      if (type.value !== "daily") extend.checked = false;

      var startMinutes = parseClock(start.value);
      var driveHours = Math.max(0, Math.min(24, parseFloat(drive.value) || 0));
      var block = values.block;
      var pause = values.pause;
      var max = values.max + (extChecked ? 1 : 0);

      var segments = [];
      var remaining = driveHours;
      var cursor = startMinutes;
      var cumulative = 0;
      var pauses = 0;

      while (remaining > 0.0001) {
        var duration = Math.min(block, remaining);
        cumulative += duration;
        segments.push({
          kind: "drive",
          hours: duration,
          start: cursor,
          over: cumulative > max + 0.0001
        });
        cursor += duration * 60;
        remaining -= duration;

        if (remaining > 0.0001) {
          segments.push({
            kind: "pause",
            hours: pause,
            start: cursor,
            over: false
          });
          cursor += pause * 60;
          pauses++;
        }
      }

      var output = document.getElementById("marchOutput");
      var warning = document.getElementById("marchWarning");

      if (!output) return;

      if (!driveHours) {
        output.innerHTML = '<div class="timeline"><div class="tl-row"><div class="tl-time">' + esc(start.value || "06:00") +
          '</div><div class="tl-track"><div class="tl-bar pause" style="width:100%">Indtast planlagt køretid</div></div></div></div>' +
          '<div class="march-stats"><div class="mstat"><span>Planlagt køretid</span><b>0 min</b></div>' +
          '<div class="mstat"><span>Grænse</span><b>' + fmtHours(max) + "</b></div></div>";
      } else {
        var span = driveHours * 60 + pauses * pause * 60;
        var timeline = segments.map(function (segment) {
          var width = span ? Math.max(7, Math.round(segment.hours * 60 / span * 100)) : 100;
          var label = segment.kind === "drive" ? "Kørsel " + fmtHours(segment.hours) : "Pause " + fmtHours(segment.hours);
          var cls = segment.kind === "pause" ? "pause" : (segment.over ? "over" : "drive");
          return '<div class="tl-row"><div class="tl-time">' + clock(segment.start) + '</div>' +
            '<div class="tl-track"><div class="tl-bar ' + cls + '" style="width:' + width + '%">' + esc(label) + "</div></div></div>";
        }).join("");

        var pauseLabel = pauses ? pauses + " × " + fmtHours(pause) : "Ingen planlagte";
        var restLabel = values.rest;
        var over = driveHours > max + 0.0001;

        output.innerHTML = '<div class="timeline">' + timeline + "</div>" +
          '<div class="march-stats">' +
          '<div class="mstat"><span>Planlagt køretid</span><b>' + fmtHours(driveHours) + "</b></div>" +
          '<div class="mstat"><span>Pauser</span><b>' + pauseLabel + "</b></div>" +
          '<div class="mstat"><span>Kørsel slutter</span><b>' + clock(cursor) + "</b></div>" +
          '<div class="mstat' + (over ? " warn" : "") + '"><span>Tilladt køretid</span><b>' + fmtHours(max) + "</b></div>" +
          '<div class="mstat"><span>Hvile efter</span><b>' + restLabel + "</b></div>" +
          "</div>";
      }

      var warnings = [];
      var baseMax = values.max;

      if (driveHours > max + 0.0001) {
        warnings.push("Planen overskrider den valgte tjenestetypes grænse med " + fmtHours(driveHours - max) + ". Læg køretiden om, eller vælg en anden tjenestetype.");
      } else if (type.value === "daily" && driveHours > baseMax - 0.0001 && !extChecked) {
        warnings.push("Du rammer den daglige grænse på " + fmtHours(baseMax) + ". Forlængelse på op til 1 time kræver, at forholdene taler for det, og skal fremgå af planlægningen.");
      }

      if (type.value === "daily" && extChecked) {
        warnings.push("Forlængelsen gælder kun daglig tjeneste og kræver en konkret begrundelse – f.eks. at nå hjem eller en egnet rasteplads.");
      }

      if (note && /kolonne/i.test(note.value)) {
        warnings.push("Kolonnekørsel med lav hastighed reducerer ikke kravene: Køretiden skal reduceres, og der skal lægges kortere ekstra pauser ind. Langsom kørsel er ikke hvile.");
      }

      if (warning) {
        warning.textContent = warnings.join(" ");
        warning.classList.toggle("show", warnings.length > 0);
      }
    }

    [type, start, drive, extend, note].forEach(function (el) {
      el.addEventListener("input", update);
      el.addEventListener("change", update);
    });

    update();
  }

  function marchValues(type) {
    if (type === "exercise") return { block: 4.5, pause: 1, max: 13.5, rest: "6 t el. 2 × 4 t" };
    if (type === "passenger") return { block: 2, pause: 0.5, max: 4, rest: "—" };
    return { block: 4.5, pause: 1, max: 9, rest: "11 t" };
  }

  function parseClock(value) {
    var match = /^(\d{1,2}):(\d{2})$/.exec(value || "");
    if (!match) return 6 * 60;
    return (parseInt(match[1], 10) % 24) * 60 + parseInt(match[2], 10);
  }

  /* ------------------------------------------------------------------
     Transportregel-vælger
     ------------------------------------------------------------------ */

  var WIZARD_QUESTIONS = [
    {
      q: "Hvor foregår transporten?",
      help: "Stedet afgør, om der er tale om almindelig vejtransport, intern transport eller en taktisk situation.",
      options: [
        { value: "offentlig", label: "På offentlig vej / mellem garnisoner" },
        { value: "intern", label: "Inden for et afspærret eller indhegnet område" },
        { value: "taktisk", label: "I et øvelses- eller indsættelsesområde" }
      ]
    },
    {
      q: "Hvad er formålet med turen?",
      help: "Håndværkerreglen og andre fritagelser afhænger af, om transporten er underordnet dit eget arbejde.",
      options: [
        { value: "almindelig", label: "Almindelig transport af farligt gods" },
        { value: "eget", label: "Underordnet del af mit eget arbejde" },
        { value: "levering", label: "Levering til en aktivitet, jeg ikke selv deltager i" },
        { value: "taktisk", label: "Taktisk transport / styrkeproduktion" }
      ]
    },
    {
      q: "Hvilken brændstoflast er der tale om?",
      help: "Dette forløb har klasse 3 og tankvogne som omdrejningspunkt. Andre fareklasser nævnes kun som afgrænsning.",
      options: [
        { value: "tank", label: "Klasse 3 i tankvogn eller tankcontainer" },
        { value: "dunk", label: "Dunke eller mindre mængder klasse 3" },
        { value: "andet", label: "Andet farligt gods – uden for forløbets fokus" }
      ]
    },
    {
      q: "Findes der en dispensation?",
      help: "En dispensation ændrer ikke automatisk regelsættet. Den skal være skriftlig, gyldig og medbragt.",
      options: [
        { value: "ja", label: "Ja, og den er gyldig og medbragt" },
        { value: "nej", label: "Nej" },
        { value: "vedikke", label: "Ved ikke / skal afklares" }
      ]
    }
  ];

  function initWizard() {
    if (!wizardActive) {
      wizardActive = true;
      wizardStep = 0;
      wizardAnswers = {};
    }
    renderWizard();
  }

  function renderWizard() {
    var stepsEl = document.getElementById("wizardSteps");
    var bodyEl = document.getElementById("wizardBody");
    if (!stepsEl || !bodyEl) return;

    stepsEl.innerHTML = WIZARD_QUESTIONS.map(function (_, index) {
      var cls = "wizard-dot";
      if (index < wizardStep) cls += " done";
      if (index === wizardStep && wizardStep < WIZARD_QUESTIONS.length) cls += " active";
      return '<span class="' + cls + '"></span>';
    }).join("");

    if (wizardStep >= WIZARD_QUESTIONS.length) {
      bodyEl.innerHTML = wizardResultHTML();
      return;
    }

    var question = WIZARD_QUESTIONS[wizardStep];
    bodyEl.innerHTML = '<div class="fade-up">' +
      '<div class="wizard-q">' + esc(question.q) + "</div>" +
      '<p class="wizard-help">' + esc(question.help) + "</p>" +
      '<div class="wizard-options">' +
      question.options.map(function (option) {
        return '<button class="btn btn-ghost" type="button" data-wizard-option="' + esc(option.value) + '">' + esc(option.label) + "</button>";
      }).join("") +
      "</div>" +
      (wizardStep > 0 ? '<div class="row mt-16"><button class="btn btn-ghost btn-sm" type="button" data-action="wizard-back">← Tilbage</button></div>' : "") +
      "</div>";
  }

  function wizardResultHTML() {
    var a = wizardAnswers;
    var title = "Almindelig transport efter FMIBST 061-02";
    var intro = "Transporten skal som udgangspunkt gennemføres efter FMIBST 061-02. Bestemmelsen bruger ADR som referencegrundlag og har militære afvigelser. Alternativt kan transporten gennemføres efter ADR og den nationale regulering – men valget skal træffes bevidst og dokumenteres.";
    var points = [
      "Kontroller chaufføruddannelse, køretøjets godkendelse og eventuel ADR-godkendelsesattest.",
      "Medbring transportdokument, mærkning, faresedler, ildslukker og det krævede udstyr.",
      "Kontroller, at last, mærkning og dokumenter stemmer overens.",
      "Spørg sikkerhedsrådgiveren, hvis der er tvivl om regelsættet."
    ];
    var tone = "amber";

    if (a.q1 === "intern") {
      title = "Intern transport efter FMIBST 061-02 pkt. 9.2";
      intro = "Transporten kan gennemføres som intern transport, hvis den foregår inden for et særligt afspærret eller indhegnet område og indgår som led i håndteringen af godset. Der stilles ikke krav om transportdokumentation – men de øvrige betingelser gælder.";
      points = [
        "Køretøjet skal være godkendt efter tillæg I, hvor det er relevant, og tanke efter ADR del 6.",
        "Afmærkning med orange fareskilte og faresedler efter ADR 8.1.3.",
        "Chaufføren skal have den relevante uddannelse efter ADR 8.2.1 eller kapitel 1.3.",
        "Klassificering, emballering, afmærkning, håndtering og lastsikring skal følge ADR.",
        "Ildslukker, udstyr og eventuelle skriftlige anvisninger skal være til stede."
      ];
      tone = "teal";
    } else if (a.q1 === "taktisk" || a.q2 === "taktisk") {
      title = "Taktisk transport eller TIFT";
      intro = "Taktisk transport kræver skriftlig autorisation. TIFT er NATO-ordningen for transport i “ready to use”-konfiguration under operationer og øvelser og kræver forudgående skriftlig godkendelse fra NMCA. Det er ikke en almindelig fritagelse.";
      points = [
        "Afklar med den ansvarlige, om transporten er taktisk transport eller TIFT.",
        "Sørg for skriftlig autorisation eller godkendelse, før transporten starter.",
        "Overhold de vilkår, der følger af autorisationen – mærkning, dokumenter, rute og uddannelse.",
        "Ved tvivl: stop og spørg sikkerhedsrådgiveren."
      ];
      tone = "red";
    } else if (a.q2 === "eget") {
      title = "Håndværkerreglen kan muligvis anvendes";
      intro = "Håndværkerreglen kræver, at transporten af farligt gods er en underordnet del af dit eget arbejde. Der kræves forudgående vejledning og overholdelse af mængdegrænserne. Mængden alene gør ikke transporten fritaget.";
      points = [
        "Vurder, om transporten reelt er underordnet dit eget arbejde – ikke om den “føles lille”.",
        "Kontroller mængdegrænser og kravene til forudgående vejledning.",
        "Kører du brændstof ud til en aktivitet, du ikke selv deltager i, er hovedformålet som udgangspunkt transport af farligt gods.",
        "Afklar med sikkerhedsrådgiveren, hvis du er i tvivl."
      ];
      tone = "amber";
    } else if (a.q2 === "levering") {
      title = "Ikke håndværkerreglen – brug den almindelige transportregel";
      intro = "Når du leverer brændstof til en aktivitet, du ikke selv deltager i, er transporten ikke en underordnet del af dit eget arbejde. Håndværkerreglen kan derfor som udgangspunkt ikke anvendes.";
      points = [
        "Vælg den korrekte transportregel – normalt FMIBST 061-02.",
        "Sørg for dokumenter, mærkning, uddannelse og godkendt køretøj/tank.",
        "Hvis transporten ikke kan gennemføres efter reglerne, kan der søges dispensation.",
        "Brug ikke manglende uddannelse eller manglende dokumenter som en “løsning”."
      ];
      tone = "red";
    } else if (a.q4 === "ja") {
      title = "Transport på dispensation";
      intro = "En dispensation kan give tilladelse til en konkret fravigelse, når transporten ikke kan gennemføres efter FMIBST 061-02, ADR, bekendtgørelsen eller AMovP-6. Den skal være skriftlig, gyldig og medbragt – og gælder kun det, der står i den.";
      points = [
        "Kontroller dispensationens gyldighed og omfang – maksimalt 12 måneder ad gangen.",
        "Medbring dispensationen og eventuelle vilkår i køretøjet.",
        "Opfyld de afbødende foranstaltninger, som dispensationen kræver.",
        "En dispensation er ikke en blankocheck og kan ikke udvides mundtligt."
      ];
      tone = "amber";
    } else if (a.q3 === "andet") {
      title = "Andet farligt gods – uden for dette forløbs fokus";
      intro = "Tankakademiet handler om klasse 3 – benzin, diesel og Jet Fuel – i tankvogn eller tankcontainer. Andre fareklasser har egne krav og skal planlægges efter FMIBST 061-02 og de relevante ADR-bestemmelser.";
      points = [
        "Brug ikke dette forløbs tjeklister som dækning for andre fareklasser.",
        "Afklar klassificering, køretøjskategori, dokumentation og uddannelse med sikkerhedsrådgiveren.",
        "Ved tvivl: stop og få den konkrete transport vurderet, før den gennemføres."
      ];
      tone = "red";
    }

    if (a.q4 === "vedikke" && a.q1 !== "intern" && a.q1 !== "taktisk") {
      points.push("Dispensationen er ikke afklaret. Det skal afklares, før transporten gennemføres.");
    }

    var summary = [
      WIZARD_QUESTIONS[0].options.find(function (o) { return o.value === a.q1; }),
      WIZARD_QUESTIONS[1].options.find(function (o) { return o.value === a.q2; }),
      WIZARD_QUESTIONS[2].options.find(function (o) { return o.value === a.q3; }),
      WIZARD_QUESTIONS[3].options.find(function (o) { return o.value === a.q4; })
    ].filter(Boolean).map(function (o) { return o.label; }).join(" · ");

    return '<div class="wizard-result show">' +
      '<div class="result-card">' +
      '<span class="tag ' + tone + '">Kvalificeret bud</span>' +
      "<h3>" + esc(title) + "</h3>" +
      "<p>" + esc(intro) + "</p>" +
      "<ul>" + points.map(function (point) { return "<li>" + esc(point) + "</li>"; }).join("") + "</ul>" +
      '<p class="muted" style="margin-top:12px;font-size:11px"><b>Dine svar:</b> ' + esc(summary) + "</p>" +
      '<div class="result-actions">' +
      '<a class="btn btn-primary btn-sm" href="#/modul/last" data-link>Læs om transportregler</a>' +
      '<a class="btn btn-ghost btn-sm" href="#/tjeklister" data-link>Se tjeklister</a>' +
      '<button class="btn btn-ghost btn-sm" type="button" data-action="wizard-restart">Prøv igen</button>' +
      "</div></div></div>";
  }

  /* ------------------------------------------------------------------
     Scenarier
     ------------------------------------------------------------------ */

  function handleScenarioChoice(button) {
    var shell = button.closest("[data-scenario]");
    if (!shell || button.disabled) return;

    var id = shell.getAttribute("data-scenario");
    var scenario = A.scenarios.find(function (s) { return s.id === id; });
    if (!scenario) return;

    var index = parseInt(button.getAttribute("data-choice"), 10);
    var choice = scenario.choices[index];
    if (!choice) return;

    state.scenarios[id] = {
      choice: index,
      ok: !!choice.ok,
      date: new Date().toISOString()
    };

    if (A.scenarios.every(function (s) { return !!state.scenarios[s.id]; })) {
      state.completed.scenarier = true;
    }
    saveState();

    var correctIndex = scenario.choices.findIndex(function (c) { return c.ok; });
    Array.prototype.forEach.call(shell.querySelectorAll("[data-choice]"), function (el) {
      var original = parseInt(el.getAttribute("data-choice"), 10);
      el.disabled = true;
      el.classList.remove("correct", "wrong");
      if (original === correctIndex) el.classList.add("correct");
      if (original === index && !choice.ok) el.classList.add("wrong");
      if (original === index) el.setAttribute("aria-pressed", "true");
    });

    var feedback = document.getElementById("scenarioFeedback");
    if (feedback) {
      var scenarioIndex = A.scenarios.findIndex(function (s) { return s.id === id; });
      var next = A.scenarios[scenarioIndex + 1];
      feedback.innerHTML = '<div class="feedback-badge ' + (choice.ok ? "ok" : "no") + '">' +
        (choice.ok ? "✓ Rigtigt valg" : "✕ Ikke det bedste valg") + "</div>" +
        "<p>" + esc(choice.fb) + "</p>" +
        '<p class="muted" style="font-size:11.5px"><b>Debrief:</b> ' + esc(scenario.debrief) + "</p>" +
        '<div class="row mt-16">' +
        (next
          ? '<a class="btn btn-primary btn-sm" href="#/scenarie/' + esc(next.id) + '" data-link>Næste scenarie →</a>'
          : '<a class="btn btn-primary btn-sm" href="#/eksamen" data-link>Gå til eksamen →</a>') +
        '<a class="btn btn-ghost btn-sm" href="#/scenarier" data-link>Alle scenarier</a>' +
        "</div>";
      feedback.classList.add("show");
    }

    var dots = shell.querySelectorAll(".scenario-progress i");
    if (dots.length) {
      Array.prototype.forEach.call(dots, function (dot, i) {
        var s = A.scenarios[i];
        dot.classList.toggle("done", !!(s && state.scenarios[s.id]));
      });
    }

    updateChrome(currentRoute);
    if (state.completed.scenarier) {
      showToast("Alle seks scenarier er gennemført", "good");
    }
  }

  /* ------------------------------------------------------------------
     Eksamen
     ------------------------------------------------------------------ */

  function examStartHTML() {
    var ex = state.exam;
    var best = ex.best != null ? '<p class="muted" style="font-size:11.5px;margin-top:10px">Din bedste score: <b>' + esc(String(ex.best)) + " %</b></p>" : "";

    return '<div class="question-card fade-up" style="text-align:center">' +
      '<div class="question-tag">Klar til test?</div>' +
      "<h2>25 spørgsmål · 80 % for at bestå</h2>" +
      '<p class="muted" style="max-width:560px;margin:0 auto 18px;font-size:12.5px;line-height:1.7">Du kan gå frem og tilbage mellem spørgsmålene, indtil du afslutter. Resultatet og gennemgangen vises med det samme. Du kan tage eksamen igen, så mange gange du vil.</p>' +
      best +
      '<div class="row" style="justify-content:center;margin-top:18px">' +
      '<button class="btn btn-primary" type="button" data-action="exam-start">Start eksamen</button>' +
      "</div></div>";
  }

  function examQuestionHTML() {
    var ex = state.exam;
    var total = A.quiz.length;
    var index = Math.max(0, Math.min(total - 1, Number(ex.current) || 0));
    var q = A.quiz[index];
    if (!q) return examStartHTML();

    var selected = ex.answers[index];
    var answered = Object.keys(ex.answers).filter(function (key) {
      var value = parseInt(key, 10);
      return value >= 0 && value < total;
    }).length;
    var module = A.modules.find(function (m) { return m.id === q.module; });

    var rotation = index % q.options.length;
    var options = q.options.map(function (_, i) {
      return (i + rotation) % q.options.length;
    }).map(function (original, displayIndex) {
      return '<button class="option' + (selected === original ? " selected" : "") + '" type="button" data-exam-option="' + original + '">' +
        '<span class="opt-letter">' + String.fromCharCode(65 + displayIndex) + "</span>" +
        "<span>" + esc(q.options[original]) + "</span>" +
        "</button>";
    }).join("");

    var isLast = index === total - 1;
    var nextButton = isLast
      ? '<button class="btn btn-primary btn-sm" type="button" data-action="exam-finish">Afslut eksamen</button>'
      : '<button class="btn btn-primary btn-sm" type="button" data-action="exam-next">Næste →</button>';

    return '<div class="quiz-shell fade-up">' +
      '<div class="quiz-top"><span class="quiz-counter">Spørgsmål <b>' + (index + 1) + "</b> / " + total + "</span>" +
      '<span class="quiz-counter">' + answered + " af " + total + " besvaret</span></div>" +
      '<div class="quiz-track"><i style="width:' + Math.round(answered / total * 100) + '%"></i></div>' +
      '<div class="question-card">' +
      '<div class="question-tag">' + esc(module ? module.title : "Eksamen") + '</div>' +
      "<h2>" + esc(q.q) + "</h2>" +
      '<div class="options">' + options + "</div>" +
      '<div class="quiz-nav"><div><button class="btn btn-ghost btn-sm" type="button" data-action="exam-prev"' + (index === 0 ? " disabled" : "") + ">← Forrige</button></div>" +
      '<div class="quiz-nav-right">' + nextButton + "</div></div>" +
      "</div></div>";
  }

  function examResultHTML() {
    var ex = state.exam;
    var result = ex.result;
    if (!result) return examStartHTML();

    var score = result.score;
    var passed = !!result.passed;
    var previousPass = !!ex.passed && !passed;
    var review = A.quiz.map(function (q, i) {
      var given = result.answers[i];
      var isCorrect = given === q.a;
      var givenText = given != null ? q.options[given] : "Ikke besvaret";
      return '<div class="review-item ' + (isCorrect ? "ok" : "no") + '">' +
        '<div class="review-q">' + (i + 1) + ". " + esc(q.q) + "</div>" +
        '<div class="review-a">Dit svar: ' + (isCorrect ? "<b>" : "<i>") + esc(givenText) + (isCorrect ? "</b>" : "</i>") +
        " · Rigtigt svar: <b>" + esc(q.options[q.a]) + "</b></div>" +
        '<div class="review-a" style="margin-top:4px">' + esc(q.why) + "</div>" +
        "</div>";
    }).join("");

    return '<div class="result-hero fade-up">' +
      '<div class="question-tag">' + (passed ? "Eksamen bestået" : "Eksamen gennemført") + "</div>" +
      '<div class="result-score">' + score + "%</div>" +
      "<h1>" + (passed ? "Bestået" : "Ikke bestået") + "</h1>" +
      "<p>" + (passed
        ? "Du har svaret rigtigt på " + result.correct + " af " + result.total + " spørgsmål og opfyldt kravet på 80 %. Dit gennemførelsesbevis er nu tilgængeligt."
        : "Du har svaret rigtigt på " + result.correct + " af " + result.total + " spørgsmål. Kravet er 80 %. Gennemgå svarene og prøv igen.") +
      (previousPass ? ' <span class="muted">Dit tidligere beståede resultat er stadig registreret.</span>' : "") +
      "</p>" +
      '<div class="result-actions">' +
      (passed ? '<a class="btn btn-primary" href="#/bevis" data-link>Se gennemførelsesbevis</a>' : "") +
      '<button class="btn btn-ghost" type="button" data-action="exam-retry">Tag eksamen igen</button>' +
      '<a class="btn btn-ghost" href="#/scenarier" data-link>Træn scenarier</a>' +
      "</div></div>" +
      '<div class="block"><div class="block-head"><div><div class="block-label">Gennemgang</div><h2>Dine svar</h2>' +
      "<p>Gennemgangen viser både dit svar og det rigtige svar med begrundelse.</p></div></div>" +
      '<div class="review-list">' + review + "</div></div>";
  }

  function renderExamStage() {
    var stage = document.getElementById("examStage");
    if (!stage) return;
    ensureExam();

    if (state.exam.result) {
      stage.innerHTML = examResultHTML();
    } else if (state.exam.active) {
      stage.innerHTML = examQuestionHTML();
    } else {
      stage.innerHTML = examStartHTML();
    }
  }

  function startExam() {
    ensureExam();
    state.exam.active = true;
    state.exam.answers = {};
    state.exam.current = 0;
    state.exam.result = null;
    saveState();
    renderExamStage();
    var stage = document.getElementById("examStage");
    if (stage) stage.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function finishExam() {
    ensureExam();
    var total = A.quiz.length;
    var missing = [];
    for (var i = 0; i < total; i++) {
      if (state.exam.answers[i] == null) missing.push(i);
    }

    if (missing.length) {
      state.exam.current = missing[0];
      saveState();
      renderExamStage();
      showToast("Du mangler at svare på " + missing.length + " spørgsmål.", "bad");
      return;
    }

    var correct = 0;
    A.quiz.forEach(function (q, index) {
      if (state.exam.answers[index] === q.a) correct++;
    });
    var score = Math.round(correct / total * 100);
    var passed = score >= 80;

    state.exam.result = {
      score: score,
      correct: correct,
      total: total,
      passed: passed,
      answers: Object.assign({}, state.exam.answers),
      date: new Date().toISOString()
    };
    state.exam.best = state.exam.best == null ? score : Math.max(state.exam.best, score);
    state.exam.active = false;

    if (passed) {
      state.exam.passed = true;
      state.exam.date = state.exam.result.date;
      state.completed.eksamen = true;
    }

    saveState();
    render({ keepScroll: true });
    showToast(passed ? "Eksamen bestået med " + score + " %" : "Eksamen gennemført – " + score + " %", passed ? "good" : "bad");
  }

  /* ------------------------------------------------------------------
     Ordbog
     ------------------------------------------------------------------ */

  function initGlossary() {
    var input = document.getElementById("glossarySearch");
    var grid = document.getElementById("glossaryGrid");
    var empty = document.getElementById("glossaryEmpty");
    if (!input || !grid) return;

    var items = Array.prototype.slice.call(grid.querySelectorAll("[data-glossary]"));

    function filter() {
      var query = norm(input.value);
      var visible = 0;
      items.forEach(function (item) {
        var match = !query || norm(item.textContent).indexOf(query) !== -1;
        item.classList.toggle("cl-hidden", !match);
        if (match) visible++;
      });
      if (empty) empty.classList.toggle("hidden", visible > 0);
    }

    input.addEventListener("input", filter);
    filter();
  }

  /* ------------------------------------------------------------------
     Bevis
     ------------------------------------------------------------------ */

  function initCertificate() {
    if (!(state.exam && state.exam.passed)) return;
    if (String(state.name || "").trim()) return;

    var cert = document.getElementById("certificate");
    if (!cert) return;

    cert.insertAdjacentHTML("beforebegin",
      '<div class="block no-print" style="margin-bottom:14px">' +
      '<div class="row-between"><div><div class="block-label">Navn</div>' +
      "<h3 style=\"margin-bottom:4px\">Beviset mangler et navn</h3>" +
      '<p class="muted" style="font-size:12px;margin:0">Angiv dit navn, så det fremgår af gennemførelsesbeviset. Navnet gemmes kun i denne browser.</p></div>' +
      '<button class="btn btn-primary btn-sm" type="button" data-action="open-profile">Angiv navn</button></div></div>');
  }

  /* ------------------------------------------------------------------
     Hotspots
     ------------------------------------------------------------------ */

  function selectHotspot(element) {
    if (!element) return;
    var id = element.getAttribute("data-hotspot");
    var hotspot = (V.HOTSPOTS || []).find(function (h) { return h.id === id; });
    if (!hotspot) return;

    Array.prototype.forEach.call(document.querySelectorAll("[data-hotspot]"), function (el) {
      el.classList.toggle("active", el === element);
    });

    var panel = document.getElementById("hotspotPanel");
    if (!panel) return;

    panel.innerHTML = '<div class="hp-num">PUNKT ' + hotspot.n + " AF " + V.HOTSPOTS.length + "</div>" +
      "<h3>" + esc(hotspot.title) + "</h3>" +
      "<p>" + esc(hotspot.text) + "</p>" +
      "<ul>" + hotspot.bullets.map(function (bullet) { return "<li>" + esc(bullet) + "</li>"; }).join("") + "</ul>" +
      '<p class="hp-hint">Kontroller altid efter køretøjets betjeningsvejledning og den lokale instruks.</p>';
  }

  /* ------------------------------------------------------------------
     Søgning
     ------------------------------------------------------------------ */

  function buildSearchIndex() {
    if (searchBuilt && searchIndex) return searchIndex;

    var index = [];

    A.modules.forEach(function (m) {
      index.push({
        href: m.id === "eksamen" ? "#/eksamen" : m.id === "scenarier" ? "#/scenarier" : "#/modul/" + m.id,
        num: m.num,
        title: m.title,
        text: [m.subtitle, m.summary, m.source, (m.keywords || []).join(" ")].join(" ")
      });
    });

    Object.keys(A.checklists).forEach(function (id) {
      var cl = A.checklists[id];
      index.push({
        href: "#/tjekliste/" + id,
        num: cl.code,
        title: cl.title,
        text: [cl.intro, cl.source, "tjekliste eftersyn"].join(" ")
      });
      cl.groups.forEach(function (group) {
        group.items.forEach(function (item) {
          index.push({
            href: "#/tjekliste/" + id,
            num: cl.code,
            title: item.text,
            text: [cl.title, group.title, item.detail, item.tag].join(" ")
          });
        });
      });
    });

    A.glossary.forEach(function (entry) {
      index.push({
        href: "#/ordbog",
        num: "A",
        title: entry.t,
        text: entry.d
      });
    });

    A.scenarios.forEach(function (scenario) {
      index.push({
        href: "#/scenarie/" + scenario.id,
        num: "S",
        title: scenario.title,
        text: [scenario.tag, scenario.situation, scenario.debrief].join(" ")
      });
    });

    A.sources.forEach(function (source) {
      index.push({
        href: "#/kilder",
        num: "§",
        title: source.code + " " + source.ref,
        text: [source.title, source.text, source.points.join(" ")].join(" ")
      });
    });

    [
      { href: "#/tjeklister", num: "✓", title: "Tjekliste-center", text: "Alle tjeklister beredskab start holdt vadning månedligt læs los" },
      { href: "#/march", num: "◷", title: "Marchplanlægger", text: "Køretid pauser hvile marchbefaling 4,5 timer" },
      { href: "#/transportregel", num: "⇄", title: "Transportregel-vælger", text: "FMIBST ADR intern transport håndværkerreglen dispensation" },
      { href: "#/ordbog", num: "A", title: "Ordbog", text: "Begreber forklaring opslag" },
      { href: "#/kilder", num: "§", title: "Kilder & forbehold", text: "Publikationer afgrænsning forbehold" }
    ].forEach(function (entry) { index.push(entry); });

    searchIndex = index;
    searchBuilt = true;
    return index;
  }

  function openSearch() {
    if (!searchOverlay || !searchInput) return;
    lastFocus = document.activeElement;
    searchOverlay.hidden = false;
    searchInput.value = "";
    renderSearch("");
    window.setTimeout(function () {
      searchInput.focus();
      searchInput.select();
    }, 20);
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.hidden = true;
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function renderSearch(query) {
    if (!searchResults) return;
    var raw = String(query || "").trim();

    if (!raw) {
      var suggestions = [
        { href: "#/modul/overblik", num: "00", title: "Overblik & rød tråd", text: "Start her: fire regelsæt, én arbejdsgang." },
        { href: "#/tjeklister", num: "B", title: "Tjekliste-center", text: "Beredskab, start, holdt, vadning og månedligt." },
        { href: "#/modul/tankvogn", num: "07", title: "Tankvognen", text: "FL/AT, jording, ventiler og sikker overførsel." },
        { href: "#/modul/koeretid", num: "09", title: "Køre- & hviletid", text: "4,5 timer, pauser og marchplanlægning." },
        { href: "#/march", num: "◷", title: "Marchplanlægger", text: "Regn køretid, pauser og hvile igennem." },
        { href: "#/ordbog", num: "A", title: "Ordbog", text: "FL/AT, TIFT, PTO og de øvrige begreber." }
      ];
      searchResults.innerHTML = suggestions.map(function (result) {
        return '<a class="search-result" href="' + result.href + '" data-link>' +
          '<span class="sr-num">' + esc(result.num) + "</span>" +
          "<span><strong>" + esc(result.title) + "</strong><small>" + esc(result.text) + "</small></span></a>";
      }).join("");
      return;
    }

    var tokens = norm(raw).split(/\s+/).filter(Boolean);
    var index = buildSearchIndex();

    var matches = index.map(function (entry) {
      var title = norm(entry.title);
      var text = norm(entry.text + " " + entry.num);
      var haystack = title + " " + text;
      var ok = tokens.every(function (token) { return haystack.indexOf(token) !== -1; });
      if (!ok) return null;

      var score = 0;
      if (title.indexOf(norm(raw)) !== -1) score += 10;
      tokens.forEach(function (token) {
        if (title.indexOf(token) !== -1) score += 4;
        if (text.indexOf(token) !== -1) score += 1;
      });
      return {
        href: entry.href,
        num: entry.num,
        title: entry.title,
        text: entry.text,
        score: score
      };
    }).filter(Boolean).sort(function (a, b) {
      return b.score - a.score || a.title.localeCompare(b.title, "da");
    }).slice(0, 12);

    if (!matches.length) {
      searchResults.innerHTML = '<div class="search-empty">Ingen resultater for “' + esc(raw) + '”. Prøv et bredere ord – f.eks. “tank”, “pause” eller “dispensation”.</div>';
      return;
    }

    searchResults.innerHTML = matches.map(function (result) {
      return '<a class="search-result" href="' + result.href + '" data-link>' +
        '<span class="sr-num">' + esc(result.num) + "</span>" +
        "<span><strong>" + esc(result.title) + "</strong><small>" + esc(result.text.length > 150 ? result.text.slice(0, 147) + "…" : result.text) + "</small></span></a>";
    }).join("");
  }

  /* ------------------------------------------------------------------
     Handlinger
     ------------------------------------------------------------------ */

  function handleAction(element, event) {
    var action = element.getAttribute("data-action");
    if (!action) return;

    if (event && element.matches("button, a")) event.preventDefault();

    switch (action) {
      case "toggle-sidebar":
        setSidebar(!sidebar.classList.contains("open"));
        break;

      case "search":
        openSearch();
        break;

      case "close-search":
        closeSearch();
        break;

      case "toggle-theme":
        toggleTheme();
        break;

      case "open-profile":
        openProfileModal();
        break;

      case "close-modal":
        closeModal();
        break;

      case "save-profile":
        saveProfile();
        break;

      case "complete": {
        var moduleId = element.getAttribute("data-module");
        if (!moduleId) break;
        var nowDone = !state.completed[moduleId];
        if (nowDone) state.completed[moduleId] = true;
        else delete state.completed[moduleId];
        saveState();
        render({ keepScroll: true });
        showToast(nowDone ? "Modul markeret som gennemført" : "Markeringen er fjernet", nowDone ? "good" : "");
        break;
      }

      case "accordion": {
        var acc = element.closest(".acc-item");
        if (!acc) break;
        var isOpen = acc.classList.toggle("open");
        element.setAttribute("aria-expanded", isOpen ? "true" : "false");
        break;
      }

      case "cl-check":
        toggleChecklistItem(element);
        break;

      case "cl-fault":
        toggleChecklistFault(element);
        break;

      case "cl-reset":
        resetChecklist(element.closest("[data-checklist]"));
        break;

      case "cl-print":
        printChecklist(element.closest("[data-checklist]"));
        break;

      case "cl-relevance":
        state.checklistShowAll = !state.checklistShowAll;
        saveState();
        render({ keepScroll: true });
        showToast(state.checklistShowAll ? "Alle punkter vises" : "Ikke-relevante punkter er skjult");
        break;

      case "print-cert":
        window.print();
        break;

      case "wizard-restart":
        wizardActive = true;
        wizardStep = 0;
        wizardAnswers = {};
        renderWizard();
        break;

      case "wizard-back":
        if (wizardStep > 0) {
          wizardStep--;
          renderWizard();
        }
        break;

      case "exam-start":
        startExam();
        break;

      case "exam-prev":
        ensureExam();
        state.exam.current = Math.max(0, (Number(state.exam.current) || 0) - 1);
        saveState();
        renderExamStage();
        break;

      case "exam-next":
        ensureExam();
        state.exam.current = Math.min(A.quiz.length - 1, (Number(state.exam.current) || 0) + 1);
        saveState();
        renderExamStage();
        break;

      case "exam-finish":
        finishExam();
        break;

      case "exam-retry":
        ensureExam();
        state.exam.active = true;
        state.exam.answers = {};
        state.exam.current = 0;
        state.exam.result = null;
        saveState();
        render({ keepScroll: true });
        showToast("Ny eksamen startet");
        break;

      default:
        break;
    }
  }

  /* ------------------------------------------------------------------
     Globale hændelser
     ------------------------------------------------------------------ */

  document.addEventListener("click", function (event) {
    var profileOption = event.target.closest(".profile-option");
    if (profileOption) {
      event.preventDefault();
      var options = modalRoot ? modalRoot.querySelectorAll(".profile-option") : [];
      Array.prototype.forEach.call(options, function (option) {
        option.classList.toggle("on", option === profileOption);
      });
      return;
    }

    var hotspot = event.target.closest("[data-hotspot]");
    if (hotspot) {
      selectHotspot(hotspot);
      return;
    }

    var choice = event.target.closest("[data-choice]");
    if (choice) {
      handleScenarioChoice(choice);
      return;
    }

    var wizardOption = event.target.closest("[data-wizard-option]");
    if (wizardOption) {
      event.preventDefault();
      wizardAnswers["q" + (wizardStep + 1)] = wizardOption.getAttribute("data-wizard-option");
      wizardStep++;
      renderWizard();
      return;
    }

    var examOption = event.target.closest("[data-exam-option]");
    if (examOption) {
      event.preventDefault();
      ensureExam();
      var index = parseInt(examOption.getAttribute("data-exam-option"), 10);
      state.exam.answers[Number(state.exam.current) || 0] = index;
      saveState();
      renderExamStage();
      return;
    }

    var actionEl = event.target.closest("[data-action]");
    if (actionEl) {
      handleAction(actionEl, event);
    }

    var link = event.target.closest("a[data-link], a[href^='#/']");
    if (link) {
      closeSidebar();
      if (searchOverlay && !searchOverlay.hidden) closeSearch();
    }

    if (event.target.matches("[data-modal-overlay]")) {
      closeModal();
    }

    if (event.target === searchOverlay) {
      closeSearch();
    }
  });

  document.addEventListener("input", function (event) {
    var note = event.target.closest("[data-action='cl-note']");
    if (note) updateChecklistNote(note);
  });

  document.addEventListener("keydown", function (event) {
    var tag = (document.activeElement && document.activeElement.tagName) || "";
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(tag);

    if (event.key === "Escape") {
      if (searchOverlay && !searchOverlay.hidden) {
        closeSearch();
        return;
      }
      if (modalRoot && modalRoot.innerHTML.trim()) {
        closeModal();
        return;
      }
      closeSidebar();
    }

    if (event.key === "/" && !typing) {
      event.preventDefault();
      openSearch();
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openSearch();
      return;
    }

    if (searchOverlay && !searchOverlay.hidden && event.key === "Enter" && document.activeElement === searchInput) {
      var first = searchResults ? searchResults.querySelector("a") : null;
      if (first) {
        event.preventDefault();
        closeSearch();
        window.location.hash = first.getAttribute("href").replace(/^#/, "");
      }
      return;
    }

    var hotspot = event.target.closest ? event.target.closest("[data-hotspot]") : null;
    if (hotspot && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      selectHotspot(hotspot);
    }
  });

  window.addEventListener("hashchange", function () {
    render();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 860) closeSidebar();
  });

  /* ------------------------------------------------------------------
     Start
     ------------------------------------------------------------------ */

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      renderSearch(searchInput.value);
    });
  }

  var skipLink = document.querySelector(".skip-link");
  if (skipLink) {
    skipLink.addEventListener("click", function (event) {
      event.preventDefault();
      if (main && typeof main.focus === "function") main.focus();
    });
  }

  initTheme();
  updateChrome(routeFromHash());
  render();
})();
