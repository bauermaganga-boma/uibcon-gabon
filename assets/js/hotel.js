/* UIBCON — Hôtel-restaurant d'application : données, réservations et page publique.
   • Mode démonstration : données enregistrées dans le navigateur (localStorage).
   • Mode réel : tables Supabase hotel_* (voir supabase/install.sql, section 8). */
const Hotel = (() => {
  const LIVE = Store.LIVE, KEY = "uibcon_hotel_v1";
  const TABLES = {chambres:"hotel_chambres", reservations:"hotel_reservations", resaTables:"hotel_resa_tables", menu:"hotel_menu", equipe:"hotel_equipe"};
  const ORDER = {chambres:"num", reservations:"arrivee", resaTables:"date", menu:"nom", equipe:"nom"};
  let H = {chambres:[], reservations:[], resaTables:[], menu:[], equipe:[]};
  let sb = null;

  /* ---------- Dates ---------- */
  const ymd = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const parse = s => { const [y, m, d] = String(s).slice(0, 10).split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return ymd(d); };
  const today = () => ymd(new Date());
  const nuits = (a, d) => Math.max(0, Math.round((parse(d) - parse(a)) / 864e5));
  const fcfa = n => new Intl.NumberFormat("fr-FR").format(Math.round(n)).replace(/ | /g, " ") + " FCFA";
  const fmtD = s => parse(s).toLocaleDateString("fr-FR", {weekday:"short", day:"numeric", month:"short"});
  const BLOQUANT = r => r.statut !== "annulée" && r.statut !== "parti";
  const chevauche = (r, a, d) => r.arrivee < d && a < r.depart;
  const uid = () => "h" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const prix = t => (HOTEL.types[t] || {prix:0}).prix;

  /* ---------- Données de démonstration (dates relatives à aujourd'hui) ---------- */
  function seed() {
    const T = today(), o = n => addDays(T, n);
    const ch = [];
    const add = (type, nums, etage) => nums.forEach(n => ch.push({id:"c" + n, num:String(n), type, etage, statut:"propre"}));
    add("standard", [101, 102, 103, 104, 105, 106, 107, 108], 1);
    add("confort", [201, 202, 203, 204], 2);
    add("suite", [205, 206], 2);
    add("famille", [301, 302], 3);
    ch.find(c => c.num === "105").statut = "a-nettoyer"; ch.find(c => c.num === "204").statut = "maintenance";
    let k = 0;
    const R = (num, a, d, statut, nom, pays, tel, ad = 1, en = 0, note = "") => {
      const c = ch.find(x => x.num === String(num)); k++;
      return {id:"r" + k, ref:"HOT-26-" + String(100 + k).padStart(4, "0"), type:c.type, chambre:c.id, nom, tel, email:"", pays, arrivee:o(a), depart:o(d), adultes:ad, enfants:en, note, statut, total:nuits(o(a), o(d)) * prix(c.type), date:new Date(Date.now() - (k + 1) * 36e5 * 7).toISOString()};
    };
    const reservations = [
      R(101, -2, 1, "arrivé", "Mme Sandrine Obame", "Gabon", "074 11 22 33"),
      R(102, 0, 2, "confirmée", "M. Patrick Nzang", "Gabon", "066 23 45 67", 2),
      R(103, -1, 0, "arrivé", "Dr Amadou Diallo", "Sénégal", "077 98 76 54", 1, 0, "Invité du colloque — départ à 10 h"),
      R(201, 1, 4, "confirmée", "Mme Christelle Ndong", "Gabon", "062 33 44 55", 2),
      R(202, -3, 2, "arrivé", "M. Jean-Marc Dupont", "France", "+33 6 12 34 56 78", 1, 0, "Mission de coopération universitaire"),
      R(205, 2, 5, "en attente", "Gabon Énergie — séminaire", "Gabon", "011 70 80 90", 2, 0, "Demande aussi la salle de séminaire"),
      R(301, 4, 7, "confirmée", "Famille Mintsa", "Gabon", "065 55 66 77", 2, 2, "Lits d'enfant souhaités"),
      R(104, 3, 5, "en attente", "M. Éric Mbadinga", "Gabon", "060 12 12 12"),
      R(106, -6, -3, "parti", "Mme Aïcha Traoré", "Côte d'Ivoire", "+225 07 00 00 00"),
      R(203, 6, 8, "confirmée", "Pr Henri Ondo", "Cameroun", "+237 6 99 00 11 22", 1, 0, "Invité de l'université"),
      R(107, 1, 2, "annulée", "M. Boris Ekomi", "Gabon", "074 90 80 70"),
      R(302, 0, 3, "en attente", "Mme Rose Mboumba", "Gabon", "077 44 33 22", 2, 1),
      R(108, 5, 9, "confirmée", "Délégation CNOU", "Gabon", "011 45 67 89", 2),
    ];
    const rt = (j, h, svc, nom, tel, c, statut, note = "") => ({id:"t" + (++k), ref:"TAB-26-" + String(200 + k).padStart(4, "0"), date:o(j), heure:h, service:svc, couverts:c, nom, tel, statut, note, creation:new Date().toISOString()});
    const resaTables = [
      rt(0, "12:30", "Déjeuner", "Direction des études", "062 00 11 22", 8, "confirmée", "Déjeuner de travail"),
      rt(0, "13:00", "Déjeuner", "M. Landry Essono", "074 55 44 33", 2, "confirmée"),
      rt(0, "19:30", "Dîner", "Mme Nadège Koumba", "066 77 88 99", 4, "en attente", "Anniversaire — gâteau prévu"),
      rt(0, "20:00", "Dîner", "Famille Bivigou", "077 12 34 56", 6, "confirmée"),
      rt(1, "12:00", "Déjeuner", "Association des parents d'élèves", "060 22 33 44", 20, "confirmée", "Menu unique"),
      rt(1, "19:00", "Dîner", "M. Kevin Oyane", "065 98 76 54", 2, "en attente"),
      rt(2, "13:00", "Déjeuner", "Délégation CNOU", "011 45 67 89", 12, "confirmée"),
      rt(3, "20:00", "Dîner", "Mme Joëlle Nzamba", "062 66 55 44", 5, "en attente"),
      rt(-1, "12:30", "Déjeuner", "M. Hervé Makaya", "074 11 00 99", 3, "confirmée"),
    ];
    const mi = (cat, nom, desc, p) => ({id:"m" + (++k), cat, nom, desc, prix:p, dispo:true});
    const menu = [
      mi("Petit-déjeuner", "Petit-déjeuner continental", "Pain, beurre, confiture, fruits de saison, jus frais, café ou thé", 4500),
      mi("Petit-déjeuner", "Petit-déjeuner gabonais", "Beignets, bouillie de maïs, œuf au plat, café ou thé", 3500),
      mi("Petit-déjeuner", "Omelette & pain", "Omelette de deux œufs au choix, pain frais, boisson chaude", 2500),
      mi("Entrées", "Salade de crudités", "Tomates, concombre, carottes, vinaigrette du chef", 3000),
      mi("Entrées", "Salade d'avocat et crevettes", "Avocat, crevettes roses, citron vert", 5000),
      mi("Entrées", "Soupe de poisson", "Bouillon parfumé, poisson frais, piment doux", 3500),
      mi("Entrées", "Beignets de plantain", "Plantain mûr frit, sauce pimentée", 2500),
      mi("Plats gabonais", "Poulet nyembwe", "Poulet mijoté à la sauce de noix de palme, riz ou manioc", 7500),
      mi("Plats gabonais", "Sauce graine & riz", "Sauce de noix de palme, viande ou poisson fumé", 6500),
      mi("Plats gabonais", "Maboké de capitaine", "Poisson cuit en feuilles de bananier, accompagné de bâton de manioc", 9000),
      mi("Plats gabonais", "Feuilles de manioc", "Feuilles pilées, poisson fumé, riz blanc", 6000),
      mi("Grillades & poissons", "Poisson braisé", "Poisson du jour grillé, bananes plantain, sauce tomate pimentée", 8000),
      mi("Grillades & poissons", "Brochettes de poulet", "Brochettes marinées, frites ou plantain", 6000),
      mi("Grillades & poissons", "Soya (brochettes de bœuf)", "Bœuf épicé grillé, oignons, piment", 5000),
      mi("Grillades & poissons", "Steak frites", "Bœuf grillé, frites maison, sauce poivre", 8500),
      mi("Grillades & poissons", "Crevettes sautées à l'ail", "Crevettes, ail, persil, riz parfumé", 10000),
      mi("Desserts", "Salade de fruits tropicaux", "Ananas, papaye, banane, mangue selon la saison", 3000),
      mi("Desserts", "Beignets sucrés", "Beignets chauds saupoudrés de sucre", 2000),
      mi("Desserts", "Gâteau du chef", "Pâtisserie du jour préparée par les étudiants", 3500),
      mi("Desserts", "Glace artisanale (2 boules)", "Parfums du jour", 2500),
      mi("Boissons", "Eau minérale", "50 cl", 1000),
      mi("Boissons", "Jus d'ananas ou de gingembre frais", "Pressé le jour même", 2000),
      mi("Boissons", "Bissap", "Infusion froide d'hibiscus", 2000),
      mi("Boissons", "Sodas", "Au choix, 33 cl", 1500),
      mi("Boissons", "Café ou thé", "Chaud", 1500),
      mi("Boissons", "Bière locale", "33 cl", 2500),
    ];
    const eq = (nom, poste, jours, debut, fin, promo) => ({id:"e" + (++k), nom, poste, jours, debut, fin, promo});
    const equipe = [
      eq("Aurore Nzamba", "Réception", [1, 2, 3, 4, 5], "07:00", "15:00", "Licence 1 · Hôtellerie"),
      eq("Fabrice Engone", "Réception", [1, 2, 3, 4, 5], "15:00", "22:00", "Licence 1 · Hôtellerie"),
      eq("Grâce Mba", "Gouvernante · étages", [1, 2, 3, 4, 5, 6], "08:00", "14:00", "Licence 1 · Hôtellerie"),
      eq("Yannick Ntoutoume", "Salle · service", [2, 3, 4, 5, 6], "11:30", "15:30", "Licence 1 · Restauration"),
      eq("Prisca Moussavou", "Salle · service", [2, 3, 4, 5, 6], "18:30", "22:30", "Licence 1 · Restauration"),
      eq("Cédric Obiang", "Cuisine", [1, 2, 3, 4, 5], "09:00", "15:00", "Licence 1 · Restauration"),
      eq("Merveille Ondo", "Cuisine · pâtisserie", [1, 2, 3, 4, 5], "14:00", "21:00", "Licence 1 · Restauration"),
      eq("Loïc Mabika", "Accueil · conciergerie", [1, 3, 5, 6], "08:00", "16:00", "Licence 1 · Tourisme"),
    ];
    return {v:1, chambres:ch, reservations, resaTables, menu, equipe};
  }

  /* ---------- Chargement / sauvegarde ---------- */
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(H)); } catch (e) {} };
  function loadDemo() {
    let d = null; try { d = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    if (!d || d.v !== 1) { d = seed(); H = d; save(); }
    H = d;
  }
  async function client() { await Store.ready(); sb = Store.client(); return sb; }
  async function loadTable(key) {
    await client();
    const {data, error} = await sb.from(TABLES[key]).select("*").order(ORDER[key], {ascending:key !== "reservations" || false});
    if (error) throw new Error(error.message);
    H[key] = data || [];
  }
  /* admin = true : toutes les tables (scolarité). Sinon : seulement la carte du restaurant (publique). */
  async function init(admin = false) {
    if (!LIVE) return loadDemo();
    await Promise.all((admin ? Object.keys(TABLES) : ["menu"]).map(loadTable));
  }

  async function put(key, row) {
    if (!LIVE) {
      if (row.id) Object.assign(H[key].find(x => x.id === row.id), row); else H[key].push({...row, id:uid()});
      return save();
    }
    await client(); const {id, ...rest} = row;
    const {error} = await (id ? sb.from(TABLES[key]).update(rest).eq("id", id) : sb.from(TABLES[key]).insert(rest));
    if (error) throw new Error(error.message);
    await loadTable(key);
  }
  async function del(key, id) {
    if (!LIVE) { H[key] = H[key].filter(x => x.id !== id); return save(); }
    await client(); const {error} = await sb.from(TABLES[key]).delete().eq("id", id);
    if (error) throw new Error(error.message);
    await loadTable(key);
  }

  /* ---------- Disponibilité ---------- */
  const typesSet = () => Object.keys(HOTEL.types);
  function libres(type, a, d, exceptId) {
    return H.chambres.filter(c => c.type === type && c.statut !== "maintenance"
      && !H.reservations.some(r => r.id !== exceptId && r.chambre === c.id && BLOQUANT(r) && chevauche(r, a, d)));
  }
  /* Nombre de chambres libres par type, pour la page publique */
  async function dispo(a, d) {
    if (!LIVE) { loadDemo(); return Object.fromEntries(typesSet().map(t => [t, libres(t, a, d).length])); }
    await client(); const {data, error} = await sb.rpc("hotel_dispo", {p_arrivee:a, p_depart:d});
    if (error) throw new Error(error.message);
    const o = Object.fromEntries(typesSet().map(t => [t, 0])); (data || []).forEach(r => { o[r.type] = r.libres; }); return o;
  }

  /* ---------- Réservations publiques ---------- */
  function checkResa(d) {
    if (!d.nom || !d.tel) throw new Error("Nom et téléphone sont obligatoires.");
    if (!HOTEL.types[d.type]) throw new Error("Choisissez un type de chambre.");
    if (!d.arrivee || !d.depart || d.arrivee < today()) throw new Error("Choisissez une date d'arrivée valide.");
    if (nuits(d.arrivee, d.depart) < 1) throw new Error("La date de départ doit être après l'arrivée.");
    if (nuits(d.arrivee, d.depart) > 60) throw new Error("Séjour de 60 nuits maximum : contactez-nous pour un séjour plus long.");
  }
  async function reserverChambre(d) {
    checkResa(d); const total = nuits(d.arrivee, d.depart) * prix(d.type);
    if (LIVE) {
      await client(); const {data, error} = await sb.rpc("hotel_reserver_chambre", {d});
      if (error) throw new Error(error.message.includes("complet") ? "Plus de chambre de ce type pour ces dates : essayez un autre type ou d'autres dates." : error.message);
      return {ref:data, total};
    }
    loadDemo(); const free = libres(d.type, d.arrivee, d.depart)[0];
    if (!free) throw new Error("Plus de chambre de ce type pour ces dates : essayez un autre type ou d'autres dates.");
    const ref = "HOT-26-" + String(100 + H.reservations.length + 1).padStart(4, "0");
    H.reservations.push({id:uid(), ref, type:d.type, chambre:free.id, nom:d.nom, tel:d.tel, email:d.email || "", pays:d.pays || "", arrivee:d.arrivee, depart:d.depart, adultes:+d.adultes || 1, enfants:+d.enfants || 0, note:d.note || "", statut:"en attente", total, date:new Date().toISOString()});
    save(); return {ref, total};
  }
  const couvertsService = (date, svc, exceptId) => H.resaTables.filter(t => t.id !== exceptId && t.date === date && t.service === svc && t.statut !== "annulée").reduce((a, t) => a + t.couverts, 0);
  async function reserverTable(d) {
    if (!d.nom || !d.tel) throw new Error("Nom et téléphone sont obligatoires.");
    if (!d.date || d.date < today()) throw new Error("Choisissez une date valide.");
    if (!HOTEL.resto.services[d.service]) throw new Error("Choisissez un service.");
    if (!(+d.couverts >= 1 && +d.couverts <= 40)) throw new Error("Entre 1 et 40 couverts (au-delà, contactez-nous).");
    if (LIVE) {
      await client(); const {data, error} = await sb.rpc("hotel_reserver_table", {d});
      if (error) throw new Error(error.message.includes("complet") ? "Ce service est complet à cette date : essayez un autre créneau." : error.message);
      return {ref:data};
    }
    loadDemo();
    if (couvertsService(d.date, d.service) + +d.couverts > HOTEL.resto.couverts) throw new Error("Ce service est complet à cette date : essayez un autre créneau.");
    const ref = "TAB-26-" + String(200 + H.resaTables.length + 1).padStart(4, "0");
    H.resaTables.push({id:uid(), ref, date:d.date, heure:d.heure, service:d.service, couverts:+d.couverts, nom:d.nom, tel:d.tel, statut:"en attente", note:d.note || "", creation:new Date().toISOString()});
    save(); return {ref};
  }

  /* ---------- Page publique (hotel.html) ---------- */
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  async function initPublic() {
    const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
    try { await init(false); } catch (e) { toast("Chargement de la carte impossible.", "err"); }
    // Chambres
    const rooms = $("#h-rooms");
    if (rooms) rooms.innerHTML = Object.entries(HOTEL.types).map(([k, t], i) => `<article class="room">
      <div class="room-ph"><span class="room-ic">${ICONS[t.ic]}</span><span class="room-price"><small>à partir de</small><b>${fcfa(t.prix)}</b><small>/ nuit</small></span></div>
      <div class="room-bd"><h3>${t.nom}</h3><p>${t.desc}</p>
        <p class="room-meta"><span>${t.surface}</span><span>${t.lit}</span><span>${t.cap} pers. max</span></p>
        <ul>${t.eq.map(e => `<li>${e}</li>`).join("")}</ul>
        <button class="btn btn-sm btn-navy" data-pick="${k}">Réserver cette chambre</button></div></article>`).join("");
    // Services
    const sv = $("#h-services");
    if (sv) sv.innerHTML = HOTEL.services.map(s => `<div class="fcard"><div class="ic">${ICONS[s.ic]}</div><h3>${s.t}</h3><p>${s.d}</p></div>`).join("");
    // Carte du restaurant
    const menuBox = $("#h-menu"), tabs = $("#h-menu-tabs");
    if (menuBox) {
      const items = H.menu.filter(m => m.dispo !== false), cats = HOTEL.menuCats.filter(c => items.some(m => m.cat === c));
      let cur = cats[0];
      const draw = () => {
        tabs.innerHTML = cats.map(c => `<button class="tab ${c === cur ? "on" : ""}" data-c="${c}">${c}</button>`).join("");
        menuBox.innerHTML = items.filter(m => m.cat === cur).map(m => `<div class="dish"><div><b>${esc(m.nom)}</b><small>${esc(m.desc || "")}</small></div><span>${fcfa(m.prix)}</span></div>`).join("");
      };
      tabs.addEventListener("click", e => { const b = e.target.closest("[data-c]"); if (b) { cur = b.dataset.c; draw(); } });
      draw();
    }
    // Formulaire chambre
    const f = $("#resa-form");
    if (f) {
      const sel = f.type; sel.innerHTML = `<option value="">— Type de chambre —</option>` + Object.entries(HOTEL.types).map(([k, t]) => `<option value="${k}">${t.nom} · ${fcfa(t.prix)}/nuit</option>`).join("");
      f.pays.innerHTML = HOTEL.pays.map(p => `<option>${p}</option>`).join("");
      f.arrivee.min = today(); f.arrivee.value = addDays(today(), 1); f.depart.value = addDays(today(), 3);
      const info = $("#resa-info");
      const refresh = async () => {
        if (!f.arrivee.value || !f.depart.value) return;
        const n = nuits(f.arrivee.value, f.depart.value);
        if (n < 1) { info.innerHTML = `<span class="bad">La date de départ doit être après l'arrivée.</span>`; return; }
        f.depart.min = addDays(f.arrivee.value, 1);
        let av = null; try { av = await dispo(f.arrivee.value, f.depart.value); } catch (e) {}
        const t = f.type.value, free = av && t ? av[t] : null;
        info.innerHTML = t ? `<b>${n} nuit${n > 1 ? "s" : ""}</b> · <b>${fcfa(n * prix(t))}</b> au total (tarif de démonstration)<br>${free === null ? "" : free > 0 ? `<span class="ok">✔ Disponible (${free} chambre${free > 1 ? "s" : ""} libre${free > 1 ? "s" : ""})</span>` : `<span class="bad">Complet pour ces dates</span>`}` : `${n} nuit${n > 1 ? "s" : ""} — choisissez un type de chambre pour voir le tarif.`;
      };
      ["arrivee", "depart", "type"].forEach(n => f[n].addEventListener("change", refresh)); refresh();
      $("#h-rooms") && $("#h-rooms").addEventListener("click", e => { const b = e.target.closest("[data-pick]"); if (!b) return; f.type.value = b.dataset.pick; refresh(); $("#reserver").scrollIntoView({behavior:"smooth"}); });
      f.addEventListener("submit", async e => {
        e.preventDefault(); const d = Object.fromEntries(new FormData(f)); const btn = f.querySelector("button[type=submit]"); btn.disabled = true;
        try {
          const r = await reserverChambre(d); f.reset(); f.pays.value = "Gabon"; f.arrivee.value = addDays(today(), 1); f.depart.value = addDays(today(), 3); refresh();
          modal("Demande de réservation enregistrée 🎉", `<p class="lead-p">Merci <b>${esc(d.nom)}</b> ! Votre demande pour <b>${HOTEL.types[d.type].nom}</b> du <b>${fmtD(d.arrivee)}</b> au <b>${fmtD(d.depart)}</b> a bien été transmise à la réception.</p>
            <div class="panel" style="margin:1.2rem 0;box-shadow:none;text-align:center"><small style="color:var(--muted)">Votre numéro de réservation</small><div style="font-family:var(--font-h);font-size:1.8rem;font-weight:900;color:var(--navy)">${r.ref}</div><small style="color:var(--muted)">Total estimé : ${fcfa(r.total)}</small></div>
            <p style="color:var(--muted)">La réception vous recontacte au <b>${esc(d.tel)}</b> pour confirmer. Aucun paiement n'est demandé en ligne.</p>`);
        } catch (err) { toast(err.message, "err"); }
        btn.disabled = false;
      });
    }
    // Formulaire table
    const g = $("#table-form");
    if (g) {
      g.service.innerHTML = Object.entries(HOTEL.resto.services).map(([k, v]) => `<option value="${k}">${k} · ${v.l}</option>`).join("");
      g.date.min = today(); g.date.value = today();
      const fillH = () => { g.heure.innerHTML = HOTEL.resto.services[g.service.value].h.map(h => `<option value="${h}">${h.replace(":", " h ")}</option>`).join(""); };
      g.service.addEventListener("change", fillH); fillH();
      g.addEventListener("submit", async e => {
        e.preventDefault(); const d = Object.fromEntries(new FormData(g)); const btn = g.querySelector("button[type=submit]"); btn.disabled = true;
        try {
          const r = await reserverTable(d); g.reset(); g.date.value = today(); fillH();
          modal("Table réservée 🎉", `<p class="lead-p">Merci <b>${esc(d.nom)}</b> ! Votre demande pour <b>${d.couverts} couvert(s)</b> le <b>${fmtD(d.date)}</b> à <b>${d.heure.replace(":", " h ")}</b> est enregistrée.</p>
            <div class="panel" style="margin:1.2rem 0;box-shadow:none;text-align:center"><small style="color:var(--muted)">Numéro de réservation</small><div style="font-family:var(--font-h);font-size:1.8rem;font-weight:900;color:var(--navy)">${r.ref}</div></div>
            <p style="color:var(--muted)">Le restaurant vous rappelle au <b>${esc(d.tel)}</b> pour confirmer.</p>`);
        } catch (err) { toast(err.message, "err"); }
        btn.disabled = false;
      });
    }
  }
  if (document.getElementById("h-rooms") || document.getElementById("resa-form")) document.addEventListener("DOMContentLoaded", () => initPublic());

  /* ---------- API d'administration ---------- */
  return {
    LIVE, init, ymd, parse, addDays, today, nuits, fcfa, fmtD, prix, libres, couvertsService, esc, BLOQUANT, chevauche,
    chambres: () => H.chambres, reservations: () => H.reservations, resaTables: () => H.resaTables, menu: () => H.menu, equipe: () => H.equipe,
    chambre: id => H.chambres.find(c => c.id === id),
    saveChambre: c => put("chambres", c), deleteChambre: id => del("chambres", id),
    saveResa: r => { r.total = nuits(r.arrivee, r.depart) * prix(r.type); if (!r.ref) r.ref = "HOT-26-" + String(100 + H.reservations.length + 1).padStart(4, "0") + (LIVE ? Math.random().toString(36).slice(2, 4).toUpperCase() : ""); if (!r.date) r.date = new Date().toISOString(); return put("reservations", r); },
    deleteResa: id => del("reservations", id),
    saveResaTable: t => { if (!t.ref) t.ref = "TAB-26-" + String(200 + H.resaTables.length + 1).padStart(4, "0") + (LIVE ? Math.random().toString(36).slice(2, 4).toUpperCase() : ""); if (!t.creation) t.creation = new Date().toISOString(); return put("resaTables", t); },
    deleteResaTable: id => del("resaTables", id),
    saveMenu: m => put("menu", m), deleteMenu: id => del("menu", id),
    saveEquipe: e => put("equipe", e), deleteEquipe: id => del("equipe", id),
  };
})();
