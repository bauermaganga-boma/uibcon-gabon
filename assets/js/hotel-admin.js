/* UIBCON — Gestion de l'hôtel-restaurant d'application (back-office, profil Scolarité).
   Tableau de bord, planning des chambres, réservations, restaurant & carte, chambres & ménage, équipe de stagiaires. */
const HotelAdmin = (() => {
  const H = Hotel, esc = H.esc, f$ = H.fcfa;
  const CHIP = {"en attente":"warn", "confirmée":"info", "arrivé":"ok", "parti":"neu", "annulée":"bad"};
  const HG = {"en attente":"hg-att", "confirmée":"hg-conf", "arrivé":"hg-arr"};
  const MENAGE = {"propre":["Propre","ok"], "a-nettoyer":["À nettoyer","warn"], "maintenance":["Maintenance","bad"]};
  const JOURS = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
  const chip = s => `<span class="chip ${CHIP[s] || "neu"}">${s}</span>`;
  const isoDow = s => (H.parse(s).getDay() + 6) % 7 + 1;   // 1 = lundi
  let A;                                                    // API fournie par portal.js

  const typeNom = t => (HOTEL.types[t] || {nom:t}).nom;
  const roomNum = id => (H.chambre(id) || {num:"—"}).num;
  const couvre = (r, d) => r.arrivee <= d && d < r.depart;
  const fmtDay = s => H.parse(s).toLocaleDateString("fr-FR", {day:"numeric", month:"short"});
  const sel = (name, opts, cur) => `<select name="${name}">${opts.map(([v, l]) => `<option value="${esc(v)}" ${String(v) === String(cur) ? "selected" : ""}>${esc(l)}</option>`).join("")}</select>`;
  const reload = () => A.rerender();

  /* ---------- Fiche et actions d'une réservation ---------- */
  function recu(r) {
    const w = window.open("", "_blank"); if (!w) return toast("Autorisez les fenêtres pop-up pour imprimer.", "err");
    const n = H.nuits(r.arrivee, r.depart);
    w.document.write(`<!doctype html><meta charset="utf-8"><title>Reçu ${esc(r.ref)}</title><style>body{font-family:Arial,sans-serif;max-width:640px;margin:2rem auto;color:#0f1c33}h1{color:#0f2a5e;font-size:1.3rem;margin:0}small{color:#5b6b85}table{width:100%;border-collapse:collapse;margin:1.2rem 0}td{padding:.5rem;border-bottom:1px solid #e3e9f2}td:last-child{text-align:right}.t{font-size:1.2rem;font-weight:bold}</style>
      <img src="${location.origin + location.pathname.replace(/[^/]*$/, "")}assets/img/logo-uibcon.svg" height="64" alt=""><h1>Hôtel-restaurant d'application — UIBCON</h1><small>Cap Estérias, commune d'Akanda · Reçu de réservation (démonstration)</small>
      <p><b>Réservation ${esc(r.ref)}</b><br>Client : ${esc(r.nom)} · ${esc(r.tel)}${r.pays ? " · " + esc(r.pays) : ""}</p>
      <table><tr><td>${esc(typeNom(r.type))} — chambre ${esc(roomNum(r.chambre))}<br><small>${fmtDay(r.arrivee)} → ${fmtDay(r.depart)} · ${n} nuit${n > 1 ? "s" : ""} · ${r.adultes} adulte(s)${r.enfants ? ", " + r.enfants + " enfant(s)" : ""}</small></td><td>${f$(H.prix(r.type))} / nuit</td></tr>
      <tr><td class="t">Total</td><td class="t">${f$(r.total)}</td></tr></table><small>Statut : ${esc(r.statut)}. Document de démonstration, sans valeur comptable.</small><script>onload=()=>print()<\/script>`);
    w.document.close();
  }
  function resaModal(r) {
    const n = H.nuits(r.arrivee, r.depart), act = [];
    if (r.statut === "en attente") act.push(["confirmée", "Confirmer", "btn-orange"]);
    if (r.statut === "confirmée") act.push(["arrivé", "Enregistrer l'arrivée (check-in)", "btn-orange"]);
    if (r.statut === "arrivé") act.push(["parti", "Enregistrer le départ (check-out)", "btn-orange"]);
    if (r.statut !== "annulée" && r.statut !== "parti") act.push(["annulée", "Annuler", "btn-line"]);
    const free = H.libres(r.type, r.arrivee, r.depart, r.id), cur = H.chambre(r.chambre);
    const rooms = (cur && !free.some(c => c.id === cur.id) ? [cur] : []).concat(free);
    const box = modal(`Réservation ${r.ref}`, `<p>${chip(r.statut)} <b>${esc(r.nom)}</b> — <a href="tel:${esc(r.tel.replace(/\s/g, ""))}">${esc(r.tel)}</a>${r.email ? ` · <a href="mailto:${esc(r.email)}">${esc(r.email)}</a>` : ""}${r.pays ? " · " + esc(r.pays) : ""}</p>
      <div class="post" style="margin:.8rem 0"><p><b>${esc(typeNom(r.type))}</b> · du <b>${H.fmtD(r.arrivee)}</b> au <b>${H.fmtD(r.depart)}</b> (${n} nuit${n > 1 ? "s" : ""})</p>
        <small>${r.adultes} adulte(s)${r.enfants ? ", " + r.enfants + " enfant(s)" : ""} · Total : <b>${f$(r.total)}</b>${r.note ? `<br>Note : ${esc(r.note)}` : ""}</small></div>
      <form class="form" id="rf"><div class="field"><label>Chambre attribuée</label><select name="chambre">${rooms.map(c => `<option value="${c.id}" ${c.id === r.chambre ? "selected" : ""}>${c.num} · étage ${c.etage}</option>`).join("") || `<option value="">Aucune chambre libre</option>`}</select></div></form>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1rem">${act.map(([s, l, c]) => `<button class="btn ${c} btn-sm" data-s="${s}">${l}</button>`).join("")}<button class="btn btn-line btn-sm" id="rprint">${ICONS.print} Reçu</button><button class="btn btn-line btn-sm" id="rdel" style="color:var(--bad)">Supprimer</button></div>`);
    const done = async (fn, msg) => { if (await A.act(fn, msg)) { box.classList.remove("on"); reload(); } };
    box.querySelectorAll("[data-s]").forEach(b => b.onclick = async () => {
      const s = b.dataset.s; if (s === "annulée" && !confirm("Annuler cette réservation ?")) return;
      const chambre = box.querySelector("[name=chambre]").value || r.chambre;
      await done(async () => {
        await H.saveResa({...r, statut:s, chambre});
        if (s === "parti" && H.chambre(chambre)) await H.saveChambre({...H.chambre(chambre), statut:"a-nettoyer"});
      }, `Réservation ${s}.`);
    });
    box.querySelector("[name=chambre]").onchange = e => { if (e.target.value && e.target.value !== r.chambre) done(() => H.saveResa({...r, chambre:e.target.value}), "Chambre modifiée."); };
    box.querySelector("#rprint").onclick = () => recu(r);
    box.querySelector("#rdel").onclick = () => { if (confirm("Supprimer définitivement cette réservation ?")) done(() => H.deleteResa(r.id), "Réservation supprimée."); };
  }
  function newResaModal(pre = {}) {
    const box = modal("Nouvelle réservation", `<form class="form" id="nf">
      <div class="row"><div class="field"><label>Nom *</label><input name="nom" required maxlength="120"></div><div class="field"><label>Téléphone *</label><input name="tel" required maxlength="40"></div></div>
      <div class="row"><div class="field"><label>Type</label>${sel("type", Object.entries(HOTEL.types).map(([k, t]) => [k, `${t.nom} · ${f$(t.prix)}`]), pre.type || "standard")}</div>
        <div class="field"><label>Pays</label>${sel("pays", HOTEL.pays.map(p => [p, p]), "Gabon")}</div></div>
      <div class="row"><div class="field"><label>Arrivée</label><input type="date" name="arrivee" required value="${pre.arrivee || H.today()}"></div><div class="field"><label>Départ</label><input type="date" name="depart" required value="${H.addDays(pre.arrivee || H.today(), 1)}"></div></div>
      <div class="row"><div class="field"><label>Adultes</label><input type="number" name="adultes" min="1" max="8" value="1"></div><div class="field"><label>Enfants</label><input type="number" name="enfants" min="0" max="8" value="0"></div></div>
      <div class="field"><label>Chambre</label><select name="chambre"></select></div>
      <div class="field"><label>Note</label><input name="note" maxlength="300"></div>
      <p id="nfmsg" style="font-size:.85rem;color:var(--muted)"></p><button class="btn btn-orange">Enregistrer la réservation</button></form>`);
    const f = box.querySelector("#nf");
    const fill = () => {
      const n = H.nuits(f.arrivee.value, f.depart.value), free = n > 0 ? H.libres(f.type.value, f.arrivee.value, f.depart.value) : [];
      f.chambre.innerHTML = free.length ? free.map(c => `<option value="${c.id}" ${c.id === pre.chambre ? "selected" : ""}>${c.num} · étage ${c.etage}</option>`).join("") : `<option value="">Aucune chambre libre</option>`;
      box.querySelector("#nfmsg").textContent = n > 0 ? `${n} nuit(s) · ${f$(n * H.prix(f.type.value))}` : "Le départ doit être après l'arrivée.";
    };
    ["type", "arrivee", "depart"].forEach(k => f[k].onchange = fill); fill();
    f.onsubmit = async e => {
      e.preventDefault(); const d = Object.fromEntries(new FormData(f));
      if (!d.chambre) return toast("Aucune chambre libre sur ces dates.", "err");
      if (H.nuits(d.arrivee, d.depart) < 1) return toast("Le départ doit être après l'arrivée.", "err");
      d.adultes = +d.adultes; d.enfants = +d.enfants; d.statut = "confirmée"; d.email = "";
      if (await A.act(() => H.saveResa(d), "Réservation enregistrée.")) { box.classList.remove("on"); reload(); }
    };
  }

  /* ---------- Vues ---------- */
  function views() {
    return {
      tableau(el) {
        const T = H.today(), R = H.reservations().filter(H.BLOQUANT), actives = H.chambres().filter(c => c.statut !== "maintenance").length;
        const occ = R.filter(r => r.statut === "arrivé" && couvre(r, T)).length;
        const arr = R.filter(r => r.arrivee === T && r.statut !== "arrivé"), dep = R.filter(r => r.depart === T && r.statut === "arrivé");
        const att = H.reservations().filter(r => r.statut === "en attente").length;
        const tbl = H.resaTables().filter(t => t.date === T && t.statut !== "annulée"), cov = tbl.reduce((a, t) => a + t.couverts, 0);
        const mois = T.slice(0, 7), ca = H.reservations().filter(r => r.statut !== "annulée" && r.arrivee.startsWith(mois)).reduce((a, r) => a + r.total, 0);
        const days = Array.from({length:14}, (_, i) => H.addDays(T, i));
        const bars = days.map(d => { const n = R.filter(r => couvre(r, d)).length, p = actives ? Math.round(n / actives * 100) : 0; return `<div class="bar"><i style="height:${Math.max(4, p)}%"></i><b>${p}%</b><small>${fmtDay(d)}</small></div>`; }).join("");
        const li = (r, k) => `<button class="hrow" data-r="${r.id}"><b>${esc(r.nom)}</b><small>${esc(typeNom(r.type))} · ch. ${roomNum(r.chambre)} · ${k}</small></button>`;
        el.innerHTML = A.kpis([["bed", "ic-b", `${Math.round(actives ? occ / actives * 100 : 0)} %`, `occupation (${occ}/${actives} chambres)`], ["inbox", "ic-o", att, "réservations à confirmer"], ["users", "ic-g", arr.length + " / " + dep.length, "arrivées / départs du jour"], ["chart", "ic-y", f$(ca), "chiffre d'affaires du mois (estimé)"]]) + `
          <div class="cols"><div class="card"><h2>Occupation · 14 prochains jours</h2><div class="bars">${bars}</div></div>
          <div class="card"><h2>Aujourd'hui</h2><p style="color:var(--muted);margin-bottom:.8rem">${H.fmtD(T)} · <b>${cov}</b> couvert(s) réservé(s) au restaurant</p>
            <h4 style="color:var(--navy);margin:.4rem 0">Arrivées attendues (${arr.length})</h4>${arr.length ? arr.map(r => li(r, r.statut)).join("") : `<p class="empty" style="padding:.6rem">Aucune arrivée.</p>`}
            <h4 style="color:var(--navy);margin:1rem 0 .4rem">Départs du jour (${dep.length})</h4>${dep.length ? dep.map(r => li(r, "à libérer")).join("") : `<p class="empty" style="padding:.6rem">Aucun départ.</p>`}</div></div>
          <div class="card"><h2>Tables du jour <a class="btn btn-line btn-sm" href="#restaurant">Gérer le restaurant</a></h2>${tbl.length ? `<div class="tbl-wrap"><table class="tbl"><tr><th>Heure</th><th>Service</th><th>Nom</th><th>Couverts</th><th>Statut</th></tr>${tbl.sort((a, b) => a.heure.localeCompare(b.heure)).map(t => `<tr><td>${t.heure.replace(":", "h")}</td><td>${t.service}</td><td>${esc(t.nom)}</td><td>${t.couverts}</td><td>${chip(t.statut)}</td></tr>`).join("")}</table></div>` : `<p class="empty">Aucune table réservée aujourd'hui.</p>`}</div>`;
        el.querySelectorAll("[data-r]").forEach(b => b.onclick = () => resaModal(H.reservations().find(r => r.id === b.dataset.r)));
      },

      planning(el) {
        const start = A.ss("hot_start") || H.today(), N = 14, days = Array.from({length:N}, (_, i) => H.addDays(start, i)), T = H.today();
        const R = H.reservations().filter(H.BLOQUANT);
        const etages = [...new Set(H.chambres().map(c => c.etage))].sort();
        const row = c => `<tr><th class="hg-room"><b>${c.num}</b><small>${typeNom(c.type)}</small>${c.statut !== "propre" ? `<em class="chip ${MENAGE[c.statut][1]}">${MENAGE[c.statut][0]}</em>` : ""}</th>${days.map(d => {
          const r = R.find(x => x.chambre === c.id && couvre(x, d));
          if (c.statut === "maintenance" && !r) return `<td class="hg-cell hg-maint" title="En maintenance"></td>`;
          return r ? `<td class="hg-cell ${HG[r.statut]}${r.arrivee === d ? "hg-first" : ""}" data-r="${r.id}" title="${esc(r.nom)} · ${r.statut}">${r.arrivee === d || d === start ? `<span>${esc(r.nom)}</span>` : ""}</td>` : `<td class="hg-cell hg-free ${d === T ? "hg-today" : ""}" data-add="${c.id}" data-d="${d}"></td>`;
        }).join("")}</tr>`;
        el.innerHTML = `<div class="card"><h2>Planning des chambres <span class="pl-nav"><button class="btn btn-line btn-sm" data-n="-7">‹ 7 j</button><b>${fmtDay(days[0])} → ${fmtDay(days[N - 1])}</b><button class="btn btn-line btn-sm" data-n="7">7 j ›</button><button class="btn btn-line btn-sm" data-n="0">Aujourd'hui</button></span></h2>
          <div class="hg-legend"><span><i class="hg-conf"></i>Confirmée</span><span><i class="hg-att"></i>En attente</span><span><i class="hg-arr"></i>Arrivé</span><span><i class="hg-maint"></i>Maintenance</span><span style="color:var(--muted)">Cliquez sur une case libre pour réserver, sur une réservation pour la gérer.</span></div>
          <div class="tbl-wrap"><table class="hg"><thead><tr><th></th>${days.map(d => `<th class="${d === T ? "hg-th-today" : ""}"><b>${JOURS[isoDow(d) - 1]}</b><small>${H.parse(d).getDate()}</small></th>`).join("")}</tr></thead><tbody>
          ${etages.map(e => `<tr><td colspan="${N + 1}" class="hg-etage">Étage ${e}</td></tr>` + H.chambres().filter(c => c.etage === e).sort((a, b) => a.num.localeCompare(b.num)).map(row).join("")).join("")}</tbody></table></div></div>`;
        el.querySelectorAll("[data-n]").forEach(b => b.onclick = () => { const n = +b.dataset.n; A.ss("hot_start", n === 0 ? H.today() : H.addDays(start, n)); reload(); });
        el.querySelectorAll("[data-r]").forEach(c => c.onclick = () => resaModal(H.reservations().find(r => r.id === c.dataset.r)));
        el.querySelectorAll("[data-add]").forEach(c => c.onclick = () => newResaModal({chambre:c.dataset.add, type:H.chambre(c.dataset.add).type, arrivee:c.dataset.d}));
      },

      reservations(el) {
        const flt = A.ss("hot_f") || "tous", q = (A.ss("hot_q") || "").toLowerCase();
        const F = {tous:null, "en attente":["en attente"], "confirmées":["confirmée"], "en séjour":["arrivé"], "terminées":["parti"], "annulées":["annulée"]};
        let L = H.reservations().slice().sort((a, b) => b.arrivee.localeCompare(a.arrivee));
        if (F[flt]) L = L.filter(r => F[flt].includes(r.statut));
        if (q) L = L.filter(r => (r.nom + r.ref + r.tel).toLowerCase().includes(q));
        el.innerHTML = `<div class="card"><h2>Réservations de chambres <span style="display:flex;gap:.5rem;flex-wrap:wrap"><input id="hq" placeholder="Rechercher…" value="${esc(q)}" style="padding:.5rem .8rem;border:1px solid var(--line);border-radius:10px"><button class="btn btn-orange btn-sm" id="hnew">+ Nouvelle réservation</button></span></h2>
          <div class="tabs" style="margin-bottom:1rem">${Object.keys(F).map(k => `<button class="tab ${k === flt ? "on" : ""}" data-f="${k}">${k[0].toUpperCase() + k.slice(1)}</button>`).join("")}</div>
          ${L.length ? `<div class="tbl-wrap"><table class="tbl"><tr><th>Réf.</th><th>Client</th><th>Chambre</th><th>Séjour</th><th>Total</th><th>Statut</th><th></th></tr>${L.map(r => `<tr><td><b>${esc(r.ref)}</b></td><td>${esc(r.nom)}<br><small style="color:var(--muted)">${esc(r.tel)}${r.pays ? " · " + esc(r.pays) : ""}</small></td><td>${roomNum(r.chambre)}<br><small style="color:var(--muted)">${typeNom(r.type)}</small></td><td>${fmtDay(r.arrivee)} → ${fmtDay(r.depart)}<br><small style="color:var(--muted)">${H.nuits(r.arrivee, r.depart)} nuit(s)</small></td><td>${f$(r.total)}</td><td>${chip(r.statut)}</td><td><button class="btn btn-line btn-sm" data-r="${r.id}">Gérer</button></td></tr>`).join("")}</table></div>` : A.empty("Aucune réservation.", "inbox")}</div>`;
        el.querySelector("#hnew").onclick = () => newResaModal();
        el.querySelector("#hq").onchange = e => { A.ss("hot_q", e.target.value); reload(); };
        el.querySelectorAll("[data-f]").forEach(b => b.onclick = () => { A.ss("hot_f", b.dataset.f); reload(); });
        el.querySelectorAll("[data-r]").forEach(b => b.onclick = () => resaModal(H.reservations().find(r => r.id === b.dataset.r)));
      },

      restaurant(el) {
        const T = H.today(), d0 = A.ss("hot_td") || T, S = HOTEL.resto.services;
        const L = H.resaTables().filter(t => t.date === d0).sort((a, b) => a.heure.localeCompare(b.heure));
        const jauge = Object.keys(S).map(s => { const c = H.couvertsService(d0, s), p = Math.min(100, Math.round(c / HOTEL.resto.couverts * 100)); return `<div class="jauge"><span>${s}</span><div><i style="width:${p}%"></i></div><b>${c}/${HOTEL.resto.couverts}</b></div>`; }).join("");
        const menu = H.menu();
        el.innerHTML = `<div class="card"><h2>Tables réservées <span class="pl-nav"><button class="btn btn-line btn-sm" data-dn="-1">‹</button><input type="date" id="td" value="${d0}" style="padding:.4rem .6rem;border:1px solid var(--line);border-radius:10px"><button class="btn btn-line btn-sm" data-dn="1">›</button><button class="btn btn-orange btn-sm" id="tnew">+ Table</button></span></h2>
          <div class="jauges">${jauge}</div>
          ${L.length ? `<div class="tbl-wrap"><table class="tbl"><tr><th>Heure</th><th>Service</th><th>Nom</th><th>Couverts</th><th>Statut</th><th></th></tr>${L.map(t => `<tr><td><b>${t.heure.replace(":", "h")}</b></td><td>${t.service}</td><td>${esc(t.nom)}<br><small style="color:var(--muted)">${esc(t.tel)}${t.note ? " · " + esc(t.note) : ""}</small></td><td>${t.couverts}</td><td><select data-ts="${t.id}" class="chip ${CHIP[t.statut]}" style="border:0;cursor:pointer">${["en attente", "confirmée", "arrivé", "annulée"].map(s => `<option ${s === t.statut ? "selected" : ""}>${s}</option>`).join("")}</select></td><td><button class="btn btn-line btn-sm" data-td-del="${t.id}">Supprimer</button></td></tr>`).join("")}</table></div>` : A.empty("Aucune table réservée ce jour-là.", "inbox")}</div>
          <div class="card"><h2>Carte du restaurant <button class="btn btn-orange btn-sm" id="mnew">+ Plat ou boisson</button></h2>
          ${HOTEL.menuCats.map(c => { const it = menu.filter(m => m.cat === c); return it.length ? `<h4 style="color:var(--navy);margin:1rem 0 .5rem">${c}</h4><div class="tbl-wrap"><table class="tbl"><tbody>${it.map(m => `<tr><td><b>${esc(m.nom)}</b><br><small style="color:var(--muted)">${esc(m.desc || "")}</small></td><td style="white-space:nowrap">${f$(m.prix)}</td><td><label style="display:flex;gap:.4rem;align-items:center;font-size:.8rem"><input type="checkbox" data-md="${m.id}" ${m.dispo !== false ? "checked" : ""}> Disponible</label></td><td style="white-space:nowrap"><button class="btn btn-line btn-sm" data-me="${m.id}">Modifier</button></td></tr>`).join("")}</tbody></table></div>` : ""; }).join("")}</div>`;
        const setD = d => { A.ss("hot_td", d); reload(); };
        el.querySelector("#td").onchange = e => e.target.value && setD(e.target.value);
        el.querySelectorAll("[data-dn]").forEach(b => b.onclick = () => setD(H.addDays(d0, +b.dataset.dn)));
        el.querySelectorAll("[data-ts]").forEach(s => s.onchange = async () => { await A.act(() => H.saveResaTable({...H.resaTables().find(t => t.id === s.dataset.ts), statut:s.value}), "Statut mis à jour."); reload(); });
        el.querySelectorAll("[data-td-del]").forEach(b => b.onclick = async () => { if (confirm("Supprimer cette réservation de table ?") && await A.act(() => H.deleteResaTable(b.dataset.tdDel), "Supprimée.")) reload(); });
        el.querySelectorAll("[data-md]").forEach(c => c.onchange = async () => { await A.act(() => H.saveMenu({...H.menu().find(m => m.id === c.dataset.md), dispo:c.checked}), c.checked ? "Plat disponible." : "Plat retiré de la carte."); reload(); });
        el.querySelectorAll("[data-me]").forEach(b => b.onclick = () => menuModal(H.menu().find(m => m.id === b.dataset.me)));
        el.querySelector("#mnew").onclick = () => menuModal({});
        el.querySelector("#tnew").onclick = () => {
          const box = modal("Nouvelle réservation de table", `<form class="form" id="tf"><div class="row"><div class="field"><label>Date</label><input type="date" name="date" required value="${d0}"></div><div class="field"><label>Service</label>${sel("service", Object.entries(S).map(([k, v]) => [k, `${k} · ${v.l}`]), "Déjeuner")}</div></div>
            <div class="row"><div class="field"><label>Heure</label><select name="heure"></select></div><div class="field"><label>Couverts</label><input type="number" name="couverts" min="1" max="60" value="2" required></div></div>
            <div class="row"><div class="field"><label>Nom *</label><input name="nom" required></div><div class="field"><label>Téléphone *</label><input name="tel" required></div></div><div class="field"><label>Remarque</label><input name="note"></div><button class="btn btn-orange">Enregistrer</button></form>`);
          const f = box.querySelector("#tf"), fill = () => { f.heure.innerHTML = S[f.service.value].h.map(h => `<option value="${h}">${h.replace(":", "h")}</option>`).join(""); }; f.service.onchange = fill; fill();
          f.onsubmit = async e => { e.preventDefault(); const d = Object.fromEntries(new FormData(f)); d.couverts = +d.couverts; d.statut = "confirmée";
            if (H.couvertsService(d.date, d.service) + d.couverts > HOTEL.resto.couverts && !confirm("Ce service dépasse la capacité du restaurant. Enregistrer quand même ?")) return;
            if (await A.act(() => H.saveResaTable(d), "Table réservée.")) { box.classList.remove("on"); reload(); } };
        };
      },

      chambres(el) {
        const C = H.chambres().slice().sort((a, b) => a.num.localeCompare(b.num));
        const cnt = Object.fromEntries(Object.keys(HOTEL.types).map(t => [t, C.filter(c => c.type === t).length]));
        el.innerHTML = `<div class="cards" style="grid-template-columns:repeat(4,1fr);margin-bottom:1.2rem">${Object.entries(HOTEL.types).map(([k, t]) => `<div class="fcard"><div class="ic">${ICONS[t.ic]}</div><h3>${t.nom}</h3><p><b>${f$(t.prix)}</b> / nuit · ${t.cap} pers.<br>${cnt[k]} chambre(s)</p></div>`).join("")}</div>
          <div class="card"><h2>Chambres & ménage <button class="btn btn-orange btn-sm" id="cnew">+ Chambre</button></h2>
          <div class="tbl-wrap"><table class="tbl"><tr><th>N°</th><th>Type</th><th>Étage</th><th>État</th><th></th></tr>${C.map(c => `<tr><td><b>${c.num}</b></td><td>${typeNom(c.type)}</td><td>${c.etage}</td><td><select data-cs="${c.id}" class="chip ${MENAGE[c.statut][1]}" style="border:0;cursor:pointer">${Object.entries(MENAGE).map(([k, v]) => `<option value="${k}" ${k === c.statut ? "selected" : ""}>${v[0]}</option>`).join("")}</select></td><td><button class="btn btn-line btn-sm" data-ce="${c.id}">Modifier</button></td></tr>`).join("")}</table></div></div>`;
        el.querySelectorAll("[data-cs]").forEach(s => s.onchange = async () => { await A.act(() => H.saveChambre({...H.chambre(s.dataset.cs), statut:s.value}), "État de la chambre mis à jour."); reload(); });
        const form = c => {
          const box = modal(c.id ? "Modifier la chambre" : "Nouvelle chambre", `<form class="form" id="cf"><div class="row"><div class="field"><label>Numéro</label><input name="num" required maxlength="10" value="${esc(c.num || "")}"></div><div class="field"><label>Étage</label><input type="number" name="etage" min="0" max="20" value="${c.etage ?? 1}"></div></div>
            <div class="field"><label>Type</label>${sel("type", Object.entries(HOTEL.types).map(([k, t]) => [k, t.nom]), c.type || "standard")}</div><div class="field"><label>État</label>${sel("statut", Object.entries(MENAGE).map(([k, v]) => [k, v[0]]), c.statut || "propre")}</div>
            <div style="display:flex;gap:.6rem"><button class="btn btn-orange">Enregistrer</button>${c.id ? `<button type="button" class="btn btn-line" id="cdel" style="color:var(--bad)">Supprimer</button>` : ""}</div></form>`);
          const f = box.querySelector("#cf");
          f.onsubmit = async e => { e.preventDefault(); const d = Object.fromEntries(new FormData(f)); d.etage = +d.etage; if (c.id) d.id = c.id;
            if (H.chambres().some(x => x.num === d.num && x.id !== c.id)) return toast("Ce numéro existe déjà.", "err");
            if (await A.act(() => H.saveChambre(d), "Chambre enregistrée.")) { box.classList.remove("on"); reload(); } };
          const del = box.querySelector("#cdel"); if (del) del.onclick = async () => { if (H.reservations().some(r => r.chambre === c.id && H.BLOQUANT(r))) return toast("Cette chambre a des réservations en cours : réattribuez-les d'abord.", "err"); if (confirm("Supprimer cette chambre ?") && await A.act(() => H.deleteChambre(c.id), "Chambre supprimée.")) { box.classList.remove("on"); reload(); } };
        };
        el.querySelector("#cnew").onclick = () => form({});
        el.querySelectorAll("[data-ce]").forEach(b => b.onclick = () => form(H.chambre(b.dataset.ce)));
      },

      equipe(el) {
        const E = H.equipe(), T = H.today(), dow = isoDow(T);
        const jour = d => E.filter(e => e.jours.includes(d)).sort((a, b) => a.debut.localeCompare(b.debut));
        el.innerHTML = `<div class="card"><h2>Équipe de stagiaires — étudiants en pratique <button class="btn btn-orange btn-sm" id="enew">+ Stagiaire</button></h2>
          <p style="color:var(--muted);margin-bottom:1rem">Les étudiants de l'École supérieure du Tourisme tiennent l'établissement, par équipes, sous la direction de leurs encadreurs. Aujourd'hui : <b>${jour(dow).length}</b> stagiaire(s) en poste.</p>
          <div class="eq-grid">${JOURS.map((j, i) => `<div class="eq-col ${i + 1 === dow ? "today" : ""}"><h4>${j}</h4>${jour(i + 1).map(e => `<button class="eq-chip" data-e="${e.id}"><b>${esc(e.nom)}</b><small>${esc(e.poste)}<br>${e.debut.replace(":", "h")}–${e.fin.replace(":", "h")}</small></button>`).join("") || `<small style="color:var(--muted)">—</small>`}</div>`).join("")}</div></div>`;
        const form = e0 => {
          const box = modal(e0.id ? "Modifier le stagiaire" : "Nouveau stagiaire", `<form class="form" id="ef2"><div class="row"><div class="field"><label>Nom *</label><input name="nom" required maxlength="80" value="${esc(e0.nom || "")}"></div><div class="field"><label>Poste</label><input name="poste" required maxlength="60" value="${esc(e0.poste || "")}" placeholder="Réception, Salle, Cuisine…"></div></div>
            <div class="row"><div class="field"><label>Début</label><input type="time" name="debut" required value="${e0.debut || "08:00"}"></div><div class="field"><label>Fin</label><input type="time" name="fin" required value="${e0.fin || "16:00"}"></div></div>
            <div class="field"><label>Promotion</label><input name="promo" maxlength="80" value="${esc(e0.promo || "")}"></div>
            <div class="field"><label>Jours de présence</label><div style="display:flex;gap:.5rem;flex-wrap:wrap">${JOURS.map((j, i) => `<label style="display:flex;gap:.3rem;align-items:center"><input type="checkbox" name="j" value="${i + 1}" ${(e0.jours || [1, 2, 3, 4, 5]).includes(i + 1) ? "checked" : ""}>${j}</label>`).join("")}</div></div>
            <div style="display:flex;gap:.6rem"><button class="btn btn-orange">Enregistrer</button>${e0.id ? `<button type="button" class="btn btn-line" id="edel" style="color:var(--bad)">Supprimer</button>` : ""}</div></form>`);
          const f = box.querySelector("#ef2");
          f.onsubmit = async ev => { ev.preventDefault(); const d = {nom:f.nom.value, poste:f.poste.value, debut:f.debut.value, fin:f.fin.value, promo:f.promo.value, jours:[...f.querySelectorAll("[name=j]:checked")].map(c => +c.value)};
            if (!d.jours.length) return toast("Choisissez au moins un jour.", "err"); if (d.fin <= d.debut) return toast("La fin doit être après le début.", "err"); if (e0.id) d.id = e0.id;
            if (await A.act(() => H.saveEquipe(d), "Stagiaire enregistré.")) { box.classList.remove("on"); reload(); } };
          const del = box.querySelector("#edel"); if (del) del.onclick = async () => { if (confirm("Retirer ce stagiaire de l'équipe ?") && await A.act(() => H.deleteEquipe(e0.id), "Stagiaire retiré.")) { box.classList.remove("on"); reload(); } };
        };
        el.querySelector("#enew").onclick = () => form({});
        el.querySelectorAll("[data-e]").forEach(b => b.onclick = () => form(H.equipe().find(x => x.id === b.dataset.e)));
      },
    };
  }
  function menuModal(m) {
    const box = modal(m.id ? "Modifier le plat" : "Nouveau plat ou boisson", `<form class="form" id="mf"><div class="field"><label>Nom *</label><input name="nom" required maxlength="80" value="${esc(m.nom || "")}"></div>
      <div class="field"><label>Description</label><input name="desc" maxlength="200" value="${esc(m.desc || "")}"></div>
      <div class="row"><div class="field"><label>Catégorie</label>${sel("cat", HOTEL.menuCats.map(c => [c, c]), m.cat || "Plats gabonais")}</div><div class="field"><label>Prix (FCFA)</label><input type="number" name="prix" min="0" step="100" required value="${m.prix ?? 5000}"></div></div>
      <div style="display:flex;gap:.6rem"><button class="btn btn-orange">Enregistrer</button>${m.id ? `<button type="button" class="btn btn-line" id="mdel" style="color:var(--bad)">Supprimer</button>` : ""}</div></form>`);
    const f = box.querySelector("#mf");
    f.onsubmit = async e => { e.preventDefault(); const d = Object.fromEntries(new FormData(f)); d.prix = +d.prix; d.dispo = m.dispo !== false; if (m.id) d.id = m.id; if (await A.act(() => H.saveMenu(d), "Carte mise à jour.")) { box.classList.remove("on"); reload(); } };
    const del = box.querySelector("#mdel"); if (del) del.onclick = async () => { if (confirm("Supprimer ce plat de la carte ?") && await A.act(() => H.deleteMenu(m.id), "Plat supprimé.")) { box.classList.remove("on"); reload(); } };
  }

  async function start(api) {
    A = api;
    try { await H.init(true); } catch (e) { document.getElementById("views").innerHTML = A.empty("Chargement de l'hôtel impossible : " + e.message); return; }
    const att = () => H.reservations().filter(r => r.statut === "en attente").length;
    api.shell([
      {id:"tableau", l:"Tableau de bord", ic:"home", s:"Occupation, arrivées, départs et restaurant du jour"},
      {id:"planning", l:"Planning des chambres", ic:"cal", s:"Occupation de chaque chambre sur 14 jours", },
      {id:"reservations", l:"Réservations", ic:"inbox", s:"Demandes reçues du site et réservations manuelles", badge:att},
      {id:"restaurant", l:"Restaurant & carte", ic:"book", s:"Tables réservées, couverts par service et carte du restaurant"},
      {id:"chambres", l:"Chambres & ménage", ic:"bed", s:"Parc de chambres, tarifs par type et état de propreté"},
      {id:"equipe", l:"Équipe de stagiaires", ic:"users", s:"Étudiants en pratique : postes et horaires de la semaine"},
      {id:"retour", l:"Retour à la scolarité", ic:"shield", s:"", href:"enseignant.html"},
    ], views(), "Hôtel-restaurant");
  }
  return {start};
})();
