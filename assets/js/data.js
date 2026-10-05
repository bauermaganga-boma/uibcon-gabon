/* Contenus de l'UIBCON : formations, partenaires, actualités, icônes */
const ESM = {
  nom: "Université internationale Brice Clotaire Oligui Nguema",
  sigle: "UIBCON",
  slogan: "Par le savoir, bâtir l'avenir",
  adresse: "Cap Estérias, commune d'Akanda (Estuaire) – au nord de Libreville, Gabon",
  tels: [],
  whatsapp: "",
  email: "",
  facebook: "",
  groupe: "Ministère de l'Enseignement supérieur",
  agrement: "Université publique inaugurée le 10 septembre 2026",
};

const ICONS = {
  code:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>',
  signal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5a10 10 0 0114 0M8.5 16a5 5 0 017 0M2 9a15 15 0 0120 0"/><circle cx="12" cy="19.5" r="1" fill="currentColor"/></svg>',
  sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  map:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4z"/><path d="M8 2v16M16 6v16"/></svg>',
  bed:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16M2 8h18a2 2 0 012 2v10M2 17h20M6 8v9"/></svg>',
  utensils:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7a3 3 0 003 3h0a3 3 0 003-3V2M6 2v20M18 22V2c-3 2-4 5-4 9 0 2 1 3 4 3"/></svg>',
  leaf:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10zM2 21c0-3 1.9-5.5 6-7.5"/></svg>',
  anchor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><path d="M12 22V8M5 12H2a10 10 0 0020 0h-3"/></svg>',
  truck:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  globe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>',
  brief:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>',
  scale:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M5 21h14M3 7h18M6 7l-3 7a4 4 0 006 0zM18 7l-3 7a4 4 0 006 0z"/></svg>',
  drop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.7l5.7 5.7a8 8 0 11-11.4 0z"/></svg>',
  drill:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l5 20M12 2L7 22M8.5 16h7M9.8 10h4.4M4 22h16"/></svg>',
  fish:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 12c3-5 9-6 13.5 0-4.5 6-10.5 5-13.5 0zM6.5 12L2 8v8z"/><circle cx="16" cy="11" r=".6" fill="currentColor"/></svg>',
  users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>',
  award:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><path d="M8.2 13.9L7 23l5-3 5 3-1.2-9.1"/></svg>',
  ship:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M19.4 17L22 10.5 12 7 2 10.5 4.6 17M12 2v5M8 4h8"/></svg>',
  cap:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  hand:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 17l2 2a1 1 0 003-3M14 14l2.5 2.5a1 1 0 003-3l-3.88-3.88a3 3 0 00-4.24 0l-.88.88a1 1 0 11-3-3l2.81-2.81a5.79 5.79 0 017.06-.87l.47.28a2 2 0 001.42.25L21 4M21 3l1 11h-2M3 3L2 14l6.5 6.5a1 1 0 003-3M3 4h8"/></svg>',
  book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20V2H6.5A2.5 2.5 0 004 4.5v15zM4 19.5A2.5 2.5 0 006.5 22H20v-5"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z"/></svg>',
  mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  fb:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>',
  wa:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1112 21.8zm8.4-18.2A11.8 11.8 0 002.1 17.8L.4 24l6.3-1.7A11.8 11.8 0 0024 12c0-3.2-1.2-6.1-3.5-8.4z"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
  lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>',
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>',
  edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>',
  mega:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-5v12L3 14v-3zM11.6 16.8a3 3 0 11-5.8-1.6"/></svg>',
  chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.4 8.4 0 013.8-.9h.5a8.5 8.5 0 018 8v.5z"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
  inbox:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>',
  out:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
  dl:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
  print:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
  save:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>',
};

const FORMATIONS = [
  // Institut supérieur de Technologie
  {id:"num", niv:"ist", ic:"code", t:"Numérique et Développement", d:"Programmation, bases de données, développement web et mobile, culture numérique : les compétences recherchées par toutes les entreprises.", deb:["Développeur web / mobile","Administrateur de bases de données","Technicien support informatique"]},
  {id:"telecom", niv:"ist", ic:"signal", t:"Télécommunications et Réseaux", d:"Réseaux informatiques, transmission, téléphonie et infrastructures de communication.", deb:["Technicien réseaux","Administrateur systèmes et réseaux","Technicien télécoms"]},
  {id:"enr", niv:"ist", ic:"sun", t:"Énergies renouvelables", d:"Énergie solaire, électricité, installations et maintenance : accompagner la transition énergétique du Gabon.", deb:["Technicien en énergie solaire","Installateur d'équipements","Chargé de maintenance"]},
  {id:"gf", niv:"ist", ic:"chart", t:"Gestion, Finance et Administration des entreprises", d:"Comptabilité, finance d'entreprise, management et administration : les bases solides pour piloter une organisation.", deb:["Assistant de gestion","Comptable","Gestionnaire administratif et financier"]},
  // École supérieure du Tourisme
  {id:"tour", niv:"est", ic:"map", t:"Tourisme", d:"Conception de circuits, accueil, promotion des destinations et gestion d'agence : faire rayonner le Gabon et ses richesses.", deb:["Agent de voyages","Guide touristique","Conseiller en séjours"]},
  {id:"hot", niv:"est", ic:"bed", t:"Hôtellerie", d:"Réception, hébergement, relation client et gestion d'établissement, avec pratique à l'hôtel-restaurant d'application du campus.", deb:["Réceptionniste","Gouvernant(e)","Responsable d'hébergement"]},
  {id:"rest", niv:"est", ic:"utensils", t:"Restauration et Arts culinaires", d:"Techniques de cuisine, service en salle et gestion de restaurant, en conditions réelles sur le campus.", deb:["Cuisinier","Chef de rang","Responsable de restauration"]},
  {id:"eco", niv:"est", ic:"leaf", t:"Écotourisme, Biodiversité et Environnement", d:"Valoriser la nature gabonaise : tourisme durable, biodiversité, gestion et protection de l'environnement.", deb:["Guide écotouristique","Chargé de projet environnement","Animateur nature"]},
  // Faculté des Sciences de l'Éducation
  {id:"edu", niv:"fse", ic:"book", t:"Sciences de l'Éducation", d:"Psychologie de l'apprenant, didactique et pédagogie : comprendre comment on apprend et comment on enseigne.", deb:["Enseignant","Éducateur","Chargé de projets éducatifs"]},
  {id:"ens", niv:"fse", ic:"cap", t:"Formation des enseignants", d:"Préparation aux métiers de l'enseignement : gestion de classe, évaluation et pratique encadrée.", deb:["Enseignant du primaire ou du secondaire","Assistant pédagogique"]},
  {id:"cons", niv:"fse", ic:"users", t:"Formateurs et conseillers pédagogiques", d:"Accompagnement des équipes, ingénierie de formation et conseil pédagogique.", deb:["Formateur","Conseiller pédagogique","Responsable de formation"]},
];
const NIVEAUX = {
  ist:{l:"IST", c:"", full:"Institut supérieur de Technologie", tab:"Technologie"},
  est:{l:"Tourisme", c:"m", full:"École supérieure du Tourisme", tab:"Tourisme"},
  fse:{l:"Éducation", c:"c", full:"Faculté des Sciences de l'Éducation", tab:"Éducation"},
};

const PARTENAIRES = [
  {n:"Ministère de l'Enseignement supérieur", s:"Tutelle de l'université", c:"#0f2a5e"},
  {n:"CNOU", s:"Hébergement & restauration", c:"#17a05a"},
  {n:"NC BTP", s:"Réalisation du campus", c:"#c8202f"},
  {n:"Commune d'Akanda", s:"Cap Estérias", c:"#e0a000"},
];

/* Actualités tirées de la presse gabonaise (septembre 2026) : url = article source */
const ACTUS = [
  {img:"facade-inauguration", cat:"Inauguration", t:"Inauguration officielle le 10 septembre 2026", d:"Après dix-huit ans d'attente, le Chef de l'État inaugure l'université qui porte son nom, au Cap Estérias.", url:"https://gabonactu.com/blog/2026/09/10/cap-esterias-luniversite-internationale-brice-clotaire-oligui-nguema-officiellement-inauguree/", src:"Gabonactu"},
  {img:"campus-aerien", cat:"Campus", t:"Un campus de 14 bâtiments sur environ 11 hectares", d:"Salles de cours, amphithéâtre, bibliothèque, infirmerie, résidence universitaire et logements des enseignants.", url:"https://www.gabonreview.com/cap-esterias-apres-quinze-ans-darret-luniversite-ouvre-enfin-ses-portes/", src:"Gabonreview"},
  {img:"pedagogique-a", cat:"Rentrée", t:"Lancement officiel des activités", d:"Les trois établissements — IST, École du Tourisme et Faculté des Sciences de l'Éducation — ouvrent leurs portes.", url:"https://africaleadnews.com/2026/09/16/gabon-lancement-officiel-des-activites-de-luniversite-internationale-brice-clotaire-oligui-nguema-au-cap-esterias/", src:"Africaleadnews"},
  {img:"salle-de-cours", cat:"Équipements", t:"48 salles de cours lumineuses et équipées", d:"Tables modulables, tableaux blancs, climatisation : des salles pensées pour apprendre dans de bonnes conditions.", url:"https://fr.infosgabon.com/gabon-uibcon-le-gabon-mise-sur-sa-jeunesse/", src:"Infos Gabon"},
  {img:"amphitheatre", cat:"Équipements", t:"Un amphithéâtre d'environ 385 places", d:"Grand amphithéâtre moderne pour les cours magistraux, conférences et cérémonies de l'université.", url:"https://gabonmailinfos.com/gabon-18-ans-apres-luniversite-du-cap-esterias-accueille-ses-4000-premiers-etudiants/", src:"Gabon Mail Infos"},
  {img:"entree-batiments", cat:"Recrutement", t:"Recrutement du personnel par le CNOU", d:"Restauration, hébergement, maintenance, informatique : dépôt des dossiers du 24 septembre au 2 octobre 2026.", url:"https://gabonactu.com/blog/2026/09/24/pluie-de-recrutement-a-luniversite-international-b-c-oligui-nguema/", src:"Gabonactu"},
];

const GALERIE = [
  {img:"campus-aerien", cat:"campus", t:"Vue aérienne du campus du Cap Estérias"},
  {img:"avenue-campus", cat:"campus", t:"L'avenue centrale du campus"},
  {img:"amphitheatre", cat:"salles", t:"L'amphithéâtre d'environ 385 places"},
  {img:"pedagogique-a", cat:"campus", t:"Bâtiment pédagogique A"},
  {img:"salle-de-cours", cat:"salles", t:"Une salle de cours"},
  {img:"facade-inauguration", cat:"ceremonie", t:"Façade de l'université le jour de l'inauguration"},
  {img:"campus-vue-haute", cat:"campus", t:"Les bâtiments aux toits rouges"},
  {img:"bibliotheque", cat:"salles", t:"La bibliothèque"},
  {img:"bloc-f", cat:"campus", t:"Bloc F"},
  {img:"ceremonie-officiels", cat:"ceremonie", t:"Cérémonie d'inauguration du 10 septembre 2026"},
  {img:"salle-de-cours-2", cat:"salles", t:"Salle de cours aux couleurs vives"},
  {img:"salle-de-cours-3", cat:"salles", t:"Salle de cours lumineuse"},
  {img:"campus-plan-aerien", cat:"campus", t:"Le campus vu du ciel"},
  {img:"infirmerie", cat:"salles", t:"L'infirmerie du campus"},
  {img:"entree-batiments", cat:"campus", t:"Entrées des bâtiments pédagogiques"},
  {img:"tshirt-uibcon", cat:"ceremonie", t:"« Par le savoir, bâtir l'avenir »"},
];

/* Espace numérique : les 3 profils, leurs avantages et un compte de démonstration chacun
   (les comptes ne s'affichent que si ESM_CONFIG.showDemo n'est pas à false) */
const ESPACES = [
  {role:"etudiant", ic:"cap", t:"Étudiants", s:"Suivre sa scolarité", c:"#1f5fb8",
   pts:["Emploi du temps, notes et moyennes en temps réel","Bulletin imprimable et rang","Annonces, devoirs et messagerie"],
   demo:{login:"UIBCON26-015", pwd:"uibcon2026", nom:"Davy Mapangou · IST Énergies"}},
  {role:"enseignant", ic:"edit", t:"Enseignants", s:"Gérer ses classes", c:"#c8202f",
   pts:["Mon planning, salles sans conflit","Saisie des notes, moyennes automatiques","Examens, annonces et devoirs en un clic"],
   demo:{login:"p.ndong", pwd:"prof2026", nom:"M. Paul Ndong"}},
  {role:"admin", ic:"shield", t:"Scolarité", s:"Piloter l'université", c:"#0f2a5e",
   pts:["Planning des salles et emplois du temps","Pré-inscriptions reçues en ligne","Comptes, classes et résultats"],
   demo:{login:"scolarite", pwd:"admin2026", nom:"Service Scolarité"}},
];

/* Dates clés (presse, septembre 2026) — la date de rentrée par filière reste à confirmer par l'université */
const AGENDA = [
  {d:"10 sept. 2026", t:"Inauguration officielle", s:"Cap Estérias — cérémonie présidée par le Chef de l'État", done:true},
  {d:"16 sept. 2026", t:"Lancement officiel des activités", s:"Les trois établissements ouvrent leurs portes", done:true},
  {d:"24 sept. → 2 oct. 2026", t:"Recrutement du personnel (CNOU)", s:"Dépôt des dossiers sur place, de 7 h 30 à 15 h 30", done:true},
  {d:"Rentrée 2026-2027", t:"Début des cours par filière", s:"Dates communiquées par la scolarité et publiées dans l'Espace numérique", done:false},
];
