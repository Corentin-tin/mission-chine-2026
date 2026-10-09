(function(){
  const $ = id => document.getElementById(id);

  /* ---------- Langue ---------- */
  // Les textes sont stockés en paires {fr, en} : horaires et données restent uniques.
  const LANG = document.documentElement.lang === "en" ? "en" : "fr";
  const LOC = LANG === "en" ? "en-GB" : "fr-BE";
  const L = v => (v && typeof v === "object" && !Array.isArray(v) && "fr" in v) ? v[LANG] : v;
  const STR = {
    fr:{
      localDep:"heure locale de départ", allFlown:"Tous les vols sont passés",
      nights:"Nuits", address:"Adresse", tel:"Tél.", stay:"Séjour", around:"Autour de l'hôtel",
      showDriver:"Montrer au chauffeur", photos:"Voir les photos ↗", copy:"Copier", copied:"Copié", select:"Sélectionnez",
      numInApp:"Numéro dans expotrip",
      cdDep:"Décollage EK 182 dans", cdBack:"Retour à Bruxelles dans", tripOver:"Voyage terminé",
      beforeDep:"Avant le départ", onTrip:"En voyage · jour ",
      kind:{fly:"Vol", road:"Transfert", fair:"Salon / visite", free:"Temps libre", hotel:"Hôtel", wait:"Aéroport / attente", night:"Nuit"},
      approxTime:"Horaire estimé", approxLow:"horaire estimé", flightOf:"vol de ", shift:"décalage ",
      place:{"+02:00":"Bruxelles","+04:00":"Dubaï","+08:00":"Chine"},
      hereAlt:"Vous êtes ici", tlHint:"Échelle 0–24 h en heure locale : l'horloge change à chaque vol. Touchez un bloc pour le détail.",
      d:"j", atHome:"À la maison, valise en préparation", welcome:"Voyage terminé. Bienvenue à la maison",
      enRoute:"En route depuis ", home:"Bruxelles", arrival:"Arrivée ", departure:"Départ ", at:" à ", localTime:" (heure locale)",
      inT:"dans ", nothingElse:"Rien d'autre au programme", live:"En direct", sim:"Simulation",
      shown:"Moment affiché : ", bruTime:" (heure de Bruxelles)", replay:"▶ Rejouer", pause:"❚❚ Pause"
    },
    en:{
      localDep:"local departure time", allFlown:"All flights are behind you",
      nights:"Nights", address:"Address", tel:"Phone", stay:"Stay", around:"Around the hotel",
      showDriver:"Show the driver", photos:"See photos ↗", copy:"Copy", copied:"Copied", select:"Select it",
      numInApp:"Number in expotrip",
      cdDep:"EK 182 takes off in", cdBack:"Back in Brussels in", tripOver:"Trip over",
      beforeDep:"Before departure", onTrip:"Travelling · day ",
      kind:{fly:"Flight", road:"Transfer", fair:"Fair / visit", free:"Free time", hotel:"Hotel", wait:"Airport / waiting", night:"Night"},
      approxTime:"Estimated time", approxLow:"estimated time", flightOf:"flight time ", shift:"time change ",
      place:{"+02:00":"Brussels","+04:00":"Dubai","+08:00":"China"},
      hereAlt:"You are here", tlHint:"0–24 h scale in local time: the clock changes with each flight. Tap a block for details.",
      d:"d", atHome:"At home, packing", welcome:"Trip over. Welcome home",
      enRoute:"On the way from ", home:"Brussels", arrival:"Arrives ", departure:"Leaves ", at:" at ", localTime:" (local time)",
      inT:"in ", nothingElse:"Nothing else on the schedule", live:"Live", sim:"Simulation",
      shown:"Showing: ", bruTime:" (Brussels time)", replay:"▶ Replay", pause:"❚❚ Pause"
    }
  }[LANG];

  /* ---------- Data ---------- */
  const flights = [
    {no:"EK 182", air:"Emirates · A350", from:"BRU", fromCity:{fr:"Bruxelles",en:"Brussels"}, dep:"2026-10-10T21:40:00+02:00", to:"DXB", toCity:{fr:"Dubaï T3",en:"Dubai T3"}, arr:"2026-10-11T06:55:00+04:00", conn:{fr:"Correspondance 2 h 45 à Dubaï",en:"2 h 45 connection in Dubai"}},
    {no:"EK 304", air:"Emirates", from:"DXB", fromCity:{fr:"Dubaï",en:"Dubai"}, dep:"2026-10-11T09:40:00+04:00", to:"PVG", toCity:"Shanghai Pudong T2", arr:"2026-10-11T22:20:00+08:00"},
    {no:"MU 9991", air:{fr:"China Eastern · groupe B",en:"China Eastern · group B"}, from:"PVG", fromCity:"Shanghai Pudong T1", dep:"2026-10-13T17:40:00+08:00", to:"MFM", toCity:"Macao", arr:"2026-10-13T20:25:00+08:00"},
    {no:"EK 363", air:"Emirates · A380", from:"CAN", fromCity:{fr:"Canton Baiyun T3",en:"Guangzhou Baiyun T3"}, dep:"2026-10-17T00:20:00+08:00", to:"DXB", toCity:{fr:"Dubaï",en:"Dubai"}, arr:"2026-10-17T04:00:00+04:00", warn:{fr:"Part le vendredi 16 au soir",en:"Leaves Friday 16, late evening"}, conn:{fr:"Correspondance 3 h 50 à Dubaï",en:"3 h 50 connection in Dubai"}},
    {no:"EK 183", air:"Emirates · B777", from:"DXB", fromCity:{fr:"Dubaï",en:"Dubai"}, dep:"2026-10-17T07:50:00+04:00", to:"BRU", toCity:{fr:"Bruxelles",en:"Brussels"}, arr:"2026-10-17T13:30:00+02:00"}
  ];
  const hotels = [
    {city:"Shanghai", name:"Jing An Shangri-La", zh:"上海静安香格里拉大酒店", nights:{fr:"11 → 13 oct. (2 nuits)",en:"11 → 13 Oct (2 nights)"}, addr:"1218 Middle Yan'an Road, Jing An Kerry Centre, Shanghai 200040", tel:"+86 21 2203 8888",
      notes:{fr:"Petit-déjeuner buffet inclus · check-in dès 14:00, check-out avant 12:00",en:"Buffet breakfast included · check-in from 14:00, check-out by 12:00"},
      tower:{total:60, from:32, to:60, caption:{fr:"Étages 32 à 60 d'une tour de 60 étages",en:"Floors 32 to 60 of a 60-storey tower"}},
      facts:{fr:[["508","chambres"],["29","étages d'hôtel"],["2 min","du métro"]],en:[["508","rooms"],["29","hotel floors"],["2 min","to the metro"]]},
      about:{fr:"Dans les 29 derniers étages d'une tour de 60 étages, au-dessus du centre commercial Jing An Kerry Centre, dans le quartier de Jing'an. Chambres contemporaines avec touches chinoises et baies vitrées sur la ville.",
        en:"On the top 29 floors of a 60-storey tower above the Jing An Kerry Centre mall, in the Jing'an district. Contemporary rooms with Chinese touches and floor-to-ceiling windows over the city."},
      amen:{fr:["Piscine","Salle de sport","Spa","Restaurants et bar","Centre d'affaires"],en:["Pool","Gym","Spa","Restaurants and bar","Business centre"]},
      around:{fr:"Métro <b>Jing'an Temple</b> à 2 min à pied (lignes 2, 7 et 14). La ligne 2 va directement au salon CIIF (station <i>National Exhibition and Convention Center</i>). Quartier de West Nanjing Road : boutiques et restaurants à pied.",
        en:"<b>Jing'an Temple</b> metro station is a 2 min walk (lines 2, 7 and 14). Line 2 runs straight to the CIIF fair (<i>National Exhibition and Convention Center</i> station). West Nanjing Road area: shops and restaurants within walking distance."},
      photos:{label:{fr:"Photos et avis (The Hotel Guru)",en:"Photos and reviews (The Hotel Guru)"}, url:"https://www.thehotelguru.com/hotel/jing-an-shangri-la-shanghai"}},
    {city:"Macao", name:"Conrad Macao", zh:"澳門康萊德酒店", nights:{fr:"13 → 14 oct. (1 nuit)",en:"13 → 14 Oct (1 night)"}, addr:{fr:"Estrada do Istmo, s/n, Cotai (dans The Londoner Macao)",en:"Estrada do Istmo, s/n, Cotai (inside The Londoner Macao)"}, tel:"+853 2882 9000",
      notes:{fr:"Arrivée vers 20:30 · check-out le matin du 14",en:"Arrival around 20:30 · check-out on the morning of the 14th"},
      tower:{total:39, from:1, to:39, caption:{fr:"Tour de 39 étages, Cotai Strip",en:"39-storey tower, Cotai Strip"}},
      facts:{fr:[["659","chambres"],["4","piscines extérieures"],["~5 min","de l'aéroport"]],en:[["659","rooms"],["4","outdoor pools"],["~5 min","from the airport"]]},
      about:{fr:"Sur le Cotai Strip, au sein du complexe The Londoner Macao, au décor d'inspiration victorienne. En face du Venetian (passerelle couverte) et de City of Dreams, avec accès direct aux Shoppes at Cotai (plus de 600 boutiques). Classé 4 étoiles par Forbes Travel Guide.",
        en:"On the Cotai Strip, inside The Londoner Macao resort with its Victorian-inspired decor. Opposite the Venetian (covered walkway) and City of Dreams, with direct access to the Shoppes at Cotai (600+ shops). Forbes Travel Guide 4-star."},
      amen:{fr:["4 piscines extérieures","Salle de sport et sauna","Bodhi Spa","The Lounge (bar du lobby)","Casino dans le complexe"],en:["4 outdoor pools","Gym and sauna","Bodhi Spa","The Lounge (lobby bar)","Casino in the resort"]},
      around:{fr:"Casinos, boutiques et spectacles à pied, sans sortir à l'extérieur. Navettes gratuites des casinos vers l'aéroport et les terminaux de ferry. Rappel : 21 ans minimum et passeport sur soi dans les casinos.",
        en:"Casinos, shops and shows on foot without going outside. Free casino shuttles to the airport and ferry terminals. Reminder: 21+ only and carry your passport in the casinos."},
      photos:{label:{fr:"Photos et fiche (Forbes Travel Guide)",en:"Photos and listing (Forbes Travel Guide)"}, url:"https://www.forbestravelguide.com/hotels/macau-china/conrad-macao-cotai-central"}},
    {city:{fr:"Canton",en:"Guangzhou"}, name:"The Ritz-Carlton, Guangzhou", zh:"广州富力丽思卡尔顿酒店", nights:{fr:"14 → 16 oct. (2 nuits)",en:"14 → 16 Oct (2 nights)"}, addr:"3 Xing An Road, Pearl River New City, Tianhe District, Guangzhou 510623", tel:"+86 20 3813 6688",
      notes:{fr:"Petit-déjeuner buffet inclus (restaurant FOODS) · check-out avant 12:00 le 16",en:"Buffet breakfast included (FOODS restaurant) · check-out by 12:00 on the 16th"},
      tower:{total:38, from:1, to:38, caption:{fr:"Bâtiment de 38 étages, Zhujiang New Town",en:"38-storey building, Zhujiang New Town"}},
      facts:{fr:[["350","chambres"],["~10 min","du Canton Fair"],["~50 min","de l'aéroport"]],en:[["350","rooms"],["~10 min","to the Canton Fair"],["~50 min","to the airport"]]},
      about:{fr:"Dans le quartier d'affaires de Zhujiang New Town (Pearl River New City), à 2 min en voiture de la Canton Tower. Chambres avec baignoire profonde et TV 55 pouces.",
        en:"In the Zhujiang New Town business district (Pearl River New City), a 2 min drive from the Canton Tower. Rooms with deep soaking tubs and 55-inch TVs."},
      amen:{fr:["Piscine extérieure","Salle de sport 24 h/24","Spa, sauna, hammam","Lai Heen : cantonais, 1 étoile Michelin","LIMONI (italien), Churchill Bar"],en:["Outdoor pool","24-hour gym","Spa, sauna, steam room","Lai Heen: Cantonese, 1 Michelin star","LIMONI (Italian), Churchill Bar"]},
      around:{fr:"Canton Fair (Pazhou) à environ 10 min en voiture. Métro <b>Liede</b> à 8 min à pied. Aéroport de Baiyun à environ 50 min en voiture : à garder en tête pour le transfert du vendredi soir.",
        en:"Canton Fair (Pazhou) about 10 min by car. <b>Liede</b> metro station is an 8 min walk. Baiyun airport is about 50 min by car: keep this in mind for the Friday-night transfer."},
      photos:{label:{fr:"Photos et avis (Hotels.com)",en:"Photos and reviews (Hotels.com)"}, url:"https://uk.hotels.com/ho259052/the-ritz-carlton-guangzhou-guangzhou-china/"}}
  ];
  const contacts = [
    {name:"Benjamin Ferdinand", role:{fr:"Organisateur · WhatsApp en priorité",en:"Organiser · WhatsApp first"}, primary:true},
    {name:"Jean-Marc Van Bever", role:{fr:"Organisateur",en:"Organiser"}},
    {name:"Christophe Pezzetti", role:{fr:"Organisateur",en:"Organiser"}},
    {name:"Nemo Voyages Charleroi", role:{fr:"Agence de voyage",en:"Travel agency"}, num:"+32 71 30 81 76"}
  ];
  const checks = [
    {id:"passport", t:{fr:"Passeport valide 6 mois et plus",en:"Passport valid for 6+ months"}, d:{fr:"Plus une copie en ligne (e-mail, cloud ou photo).",en:"Plus a copy online (email, cloud or photo)."}},
    {id:"expotrip", t:{fr:"App expotrip installée",en:"expotrip app installed"}, d:{fr:"app.expotrip.be → code reçu par e-mail de l'organisateur → touchez votre nom. iPhone : Safari → Partager → « Sur l'écran d'accueil ». Android : Chrome → ⋮ → « Installer l'appli ».",en:"app.expotrip.be → code from the organiser's email → tap your name. iPhone: Safari → Share → \"Add to Home Screen\". Android: Chrome → ⋮ → \"Install app\"."}},
    {id:"arrival", t:{fr:"E-Arrival Card remplie",en:"E-Arrival Card filled in"}, d:{fr:"App NIA 12367 ou site officiel : passeport, vol EK 304, adresse du Jing An Shangri-La. Capture d'écran du QR code. En cas de souci, l'organisateur vous aide à l'aéroport.",en:"NIA 12367 app or official website: passport, flight EK 304, Jing An Shangri-La address. Screenshot the QR code. If anything goes wrong, the organiser will help at the airport."}},
    {id:"alipay", t:{fr:"Alipay configuré",en:"Alipay set up"}, d:{fr:"Compte avec votre numéro belge, carte Visa/Mastercard ajoutée, vérification avec le passeport. À faire depuis la Belgique (SMS plus simples).",en:"Account on your Belgian number, Visa/Mastercard added, passport verification. Do it from Belgium (SMS codes are easier)."}},
    {id:"wechat", t:{fr:"WeChat configuré",en:"WeChat set up"}, d:{fr:"Compte avec votre numéro belge, carte ajoutée dans « Pay » en secours. Vos contacts chinois vous joindront ici.",en:"Account on your Belgian number, card added under \"Pay\" as a backup. Your Chinese contacts will reach you here."}},
    {id:"esim", t:{fr:"eSIM Chine + Macao achetée",en:"China + Macao eSIM bought"}, d:{fr:"Forfait data couvrant la Chine continentale et Macao, au moins 7 jours.",en:"Data plan covering mainland China and Macao, at least 7 days."}},
    {id:"esim-inst", t:{fr:"eSIM installée le 9 ou le 10 oct. avant 17:45",en:"eSIM installed on 9 or 10 Oct, before 17:45"}, d:{fr:"Pas plus tôt. Sur un Wi-Fi stable, ligne data coupée jusqu'à l'arrivée. Ne supprimez jamais l'eSIM.",en:"Not earlier. On stable Wi-Fi, with the data line off until arrival. Never delete the eSIM."}},
    {id:"vpn", t:{fr:"VPN installé et testé (optionnel)",en:"VPN installed and tested (optional)"}, d:{fr:"Sur téléphone et portable, avant le départ.",en:"On phone and laptop, before departure."}},
    {id:"adapter", t:{fr:"Adaptateur universel",en:"Universal adapter"}, d:{fr:"Indispensable à Macao (type G).",en:"Essential in Macao (type G)."}},
    {id:"bag", t:{fr:"Valise cabine pesée (≤ 7 kg)",en:"Cabin bag weighed (≤ 7 kg)"}, d:{fr:"Cabine + sac à dos confirmés auprès de l'organisateur.",en:"Cabin bag + backpack confirmed with the organiser."}},
    {id:"cards", t:{fr:"Cartes de visite",en:"Business cards"}, d:{fr:"Idéalement bilingues.",en:"Ideally bilingual."}}
  ];

  /* ---------- Flights ---------- */
  const tz = {BRU:"Europe/Brussels", DXB:"Asia/Dubai", PVG:"Asia/Shanghai", MFM:"Asia/Macau", CAN:"Asia/Shanghai"};
  const fmt = (iso, code) => new Intl.DateTimeFormat(LOC,{timeZone:tz[code],hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date(iso));
  const fmtDay = (iso, code) => new Intl.DateTimeFormat(LOC,{timeZone:tz[code],weekday:"short",day:"numeric",month:"short"}).format(new Date(iso));
  const dur = f => { const m = Math.round((new Date(f.arr)-new Date(f.dep))/60000); return Math.floor(m/60)+" h "+String(m%60).padStart(2,"0"); };

  function renderFlights(now){
    const box = $("flights"); box.innerHTML = "";
    const nextIdx = flights.findIndex(f => new Date(f.dep) > now);
    flights.forEach((f,i) => {
      const done = new Date(f.arr) < now;
      const el = document.createElement("div");
      el.className = "flight" + (done ? " done" : "") + (i === nextIdx ? " nextup" : "");
      el.innerHTML =
        `<div class="no">${f.no}<small>${L(f.air)}</small></div>
         <div class="pt"><b>${fmt(f.dep,f.from)}</b><div>${f.from} · ${L(f.fromCity)} · ${fmtDay(f.dep,f.from)}</div></div>
         <div class="pt"><b>${fmt(f.arr,f.to)}</b><div>${f.to} · ${L(f.toCity)} · ${fmtDay(f.arr,f.to)}</div></div>
         <div class="dur">${dur(f)}${f.warn ? `<br><span class="tag w" style="margin:4px 0 0">${L(f.warn)}</span>` : ""}</div>`;
      box.appendChild(el);
      if (f.conn){ const c = document.createElement("div"); c.className="conn"; c.textContent = "↳ " + L(f.conn); box.appendChild(c); }
    });
    const nf = $("nextFlight");
    if (nextIdx >= 0){
      const f = flights[nextIdx];
      nf.innerHTML = `<span class="fl">${f.no}</span><span>${f.from} ${fmt(f.dep,f.from)} → ${f.to} ${fmt(f.arr,f.to)}</span><span style="color:var(--board-muted);font-size:.85rem">${fmtDay(f.dep,f.from)}, ${STR.localDep}</span>`;
    } else {
      nf.innerHTML = `<span class="fl">—</span><span>${STR.allFlown}</span>`;
    }
  }

  /* ---------- Hotels ---------- */
  const hl = $("hotelList");
  hotels.forEach((h,i) => {
    const el = document.createElement("article");
    el.className = "hotel";
    const t = h.tower, H = 120, fh = H / t.total, cap = L(t.caption);
    let floors = "";
    for (let f = 1; f <= t.total; f++){
      const y = H - f*fh, on = f >= t.from && f <= t.to;
      floors += `<rect x="0" y="${y.toFixed(2)}" width="34" height="${Math.max(fh-0.6,0.6).toFixed(2)}" fill="${on ? "var(--jade)" : "var(--line)"}"/>`;
    }
    el.innerHTML =
      `<div class="h-top">
         <svg class="tower" viewBox="0 0 34 ${H}" width="34" height="${H}" role="img" aria-label="${cap}">${floors}</svg>
         <div style="min-width:0"><div class="label">${L(h.city)}</div><h3>${h.name}</h3><div class="zh">${h.zh}</div>
           <div class="muted" style="font-size:.78rem;margin-top:4px">${cap}</div></div>
       </div>
       <div class="facts">${L(h.facts).map(f => `<div><b>${f[0]}</b><span>${f[1]}</span></div>`).join("")}</div>
       <p style="font-size:.9rem">${L(h.about)}</p>
       <div class="amen">${L(h.amen).map(a => `<span class="chip">${a}</span>`).join("")}</div>
       <dl>
         <dt>${STR.nights}</dt><dd>${L(h.nights)}</dd>
         <dt>${STR.address}</dt><dd>${L(h.addr)}</dd>
         <dt>${STR.tel}</dt><dd><span class="mono">${h.tel}</span> <button class="btn ghost sm" data-copy="${h.tel}">${STR.copy}</button></dd>
         <dt>${STR.stay}</dt><dd>${L(h.notes)}</dd>
       </dl>
       <div class="around"><div class="label">${STR.around}</div><p>${L(h.around)}</p></div>
       <div class="h-actions">
         <button class="btn" data-driver="${i}">${STR.showDriver}</button>
         <a class="btn ghost" href="${h.photos.url}" target="_blank" rel="noopener">${STR.photos}</a>
       </div>
       <p class="muted" style="font-size:.75rem">${L(h.photos.label)}</p>`;
    hl.appendChild(el);
  });
  const drv = $("driver");
  let lastFocus = null;
  document.addEventListener("click", e => {
    const d = e.target.closest("[data-driver]");
    if (d){
      const h = hotels[+d.dataset.driver];
      $("drvZh").textContent = h.zh; $("drvAddr").textContent = L(h.addr); $("drvTel").textContent = h.tel;
      lastFocus = d; drv.hidden = false; $("drvClose").focus();
    }
    const c = e.target.closest("[data-copy]");
    if (c){
      const txt = c.dataset.copy, orig = c.textContent;
      const done = ok => { c.textContent = ok ? STR.copied : STR.select; setTimeout(() => c.textContent = orig, 1400); };
      try { navigator.clipboard.writeText(txt).then(() => done(true), () => done(false)); } catch(_) { done(false); }
    }
  });
  const closeDrv = () => { drv.hidden = true; if (lastFocus) lastFocus.focus(); };
  $("drvClose").addEventListener("click", closeDrv);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !drv.hidden) closeDrv(); });

  /* ---------- Contacts ---------- */
  const cl = $("contactList");
  contacts.forEach(c => {
    const el = document.createElement("div");
    el.className = "contact" + (c.primary ? " primary" : "");
    el.innerHTML = `<div><strong>${c.name}</strong><div class="muted" style="font-size:.85rem">${L(c.role)}</div></div>
      <div style="display:flex;gap:8px;align-items:center">${c.num
        ? `<span class="num">${c.num}</span><button class="btn ghost sm" data-copy="${c.num}">${STR.copy}</button>`
        : `<span class="muted" style="font-size:.85rem">${STR.numInApp}</span>`}</div>`;
    cl.appendChild(el);
  });

  /* ---------- Checklist (per viewer, shared across languages) ---------- */
  const KEY = "mission-chine-2026-checks";
  let state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch(_) { state = {}; }
  const ck = $("checks");
  checks.forEach(c => {
    const lab = document.createElement("label");
    lab.className = "check";
    lab.innerHTML = `<input type="checkbox" id="ck-${c.id}" ${state[c.id] ? "checked" : ""}><div><strong>${L(c.t)}</strong><small>${L(c.d)}</small></div>`;
    ck.appendChild(lab);
  });
  function updCount(){
    const n = checks.filter(c => $("ck-"+c.id).checked).length;
    $("checkCount").textContent = n + " / " + checks.length;
    $("checkBar").style.width = (n / checks.length * 100) + "%";
  }
  ck.addEventListener("change", e => {
    const id = e.target.id.replace("ck-","");
    state[id] = e.target.checked;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(_) {}
    updCount();
  });
  updCount();

  /* ---------- Converter ---------- */
  const nf0 = new Intl.NumberFormat(LOC,{maximumFractionDigits:0});
  function conv(){
    const v = parseFloat($("eurIn").value) || 0;
    $("rCny").textContent = nf0.format(v*7.70);
    $("rMop").textContent = nf0.format(v*9.36);
    $("rHkd").textContent = nf0.format(v*9.09);
  }
  $("eurIn").addEventListener("input", conv); conv();

  /* ---------- Clocks, countdown, today ---------- */
  const DEP = new Date("2026-10-10T21:40:00+02:00");
  const END = new Date("2026-10-17T13:30:00+02:00");
  const clk = z => new Intl.DateTimeFormat(LOC,{timeZone:z,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date());
  const ymd = (d,z) => new Intl.DateTimeFormat("en-CA",{timeZone:z,year:"numeric",month:"2-digit",day:"2-digit"}).format(d);
  let lastMin = -1;

  function tick(){
    const now = new Date();
    $("clkBru").textContent = clk("Europe/Brussels");
    $("clkDxb").textContent = clk("Asia/Dubai");
    $("clkCn").textContent  = clk("Asia/Shanghai");

    const st = $("status"), stt = $("statusText");
    let target = DEP, label = STR.cdDep;
    if (now >= DEP && now < END){ target = END; label = STR.cdBack; }
    if (now >= END){
      $("cdLabel").textContent = STR.tripOver;
      ["cdD","cdH","cdM"].forEach(id => $(id).textContent = "00");
    } else {
      const ms = target - now, m = Math.floor(ms/60000);
      $("cdLabel").textContent = label;
      $("cdD").textContent = String(Math.floor(m/1440)).padStart(2,"0");
      $("cdH").textContent = String(Math.floor(m/60)%24).padStart(2,"0");
      $("cdM").textContent = String(m%60).padStart(2,"0");
    }

    if (now.getMinutes() === lastMin) return;
    lastMin = now.getMinutes();

    // day status: Brussels date before departure, China date during the trip
    const zone = now < DEP ? "Europe/Brussels" : "Asia/Shanghai";
    const today = ymd(now, zone);
    let dayN = 0;
    document.querySelectorAll("#days .day").forEach((d,i) => {
      const dd = d.dataset.date;
      d.classList.toggle("today", dd === today && now < END);
      d.classList.toggle("past", dd < today || now >= END);
      if (dd === today) dayN = i + 1;
    });
    if (now < DEP){ st.classList.remove("live"); stt.textContent = STR.beforeDep; }
    else if (now < END){ st.classList.add("live"); stt.textContent = STR.onTrip + (dayN || "—") + " / 8"; }
    else { st.classList.remove("live"); stt.textContent = STR.tripOver; }

    renderFlights(now);
  }
  tick(); setInterval(tick, 1000);

  /* ---------- Timeline 24 h par jour ---------- */
  (function(){
    const BE="+02:00", CN="+08:00", AE="+04:00";
    const KIND = STR.kind;
    const segs = [
      ["2026-10-10T08:00"+BE,"2026-10-10T17:45"+BE,"free",{fr:"Préparatifs, eSIM à installer avant 17:45",en:"Getting ready, install eSIM before 17:45"}],
      ["2026-10-10T17:45"+BE,"2026-10-10T18:30"+BE,"road","HUB → Brussels Airport"],
      ["2026-10-10T18:30"+BE,"2026-10-10T21:40"+BE,"wait",{fr:"Rendez-vous 19:00, enregistrement",en:"Meet at 19:00, check-in"}],
      ["2026-10-10T21:40"+BE,"2026-10-11T06:55"+AE,"fly",{fr:"EK 182 Bruxelles → Dubaï",en:"EK 182 Brussels → Dubai"}],
      ["2026-10-11T06:55"+AE,"2026-10-11T09:40"+AE,"wait",{fr:"Correspondance à Dubaï T3",en:"Connection at Dubai T3"}],
      ["2026-10-11T09:40"+AE,"2026-10-11T22:20"+CN,"fly",{fr:"EK 304 Dubaï → Shanghai",en:"EK 304 Dubai → Shanghai"}],
      ["2026-10-11T22:20"+CN,"2026-10-11T22:45"+CN,"wait",{fr:"Bagages, regroupement 22:30",en:"Baggage, regroup at 22:30"}],
      ["2026-10-11T22:45"+CN,"2026-10-11T23:50"+CN,"road",{fr:"Transfert Pudong → hôtel",en:"Transfer Pudong → hotel"}],
      ["2026-10-11T23:50"+CN,"2026-10-12T07:30"+CN,"night","Jing An Shangri-La"],
      ["2026-10-12T07:30"+CN,"2026-10-12T08:30"+CN,"hotel",{fr:"Petit-déjeuner",en:"Breakfast"}],
      ["2026-10-12T08:30"+CN,"2026-10-12T09:15"+CN,"road",{fr:"Vers le CIIF (NECC)",en:"To CIIF (NECC)"},1],
      ["2026-10-12T09:15"+CN,"2026-10-12T18:00"+CN,"fair",{fr:"Salon CIIF · RS & AIMS",en:"CIIF fair · RS & AIMS"},1],
      ["2026-10-12T18:00"+CN,"2026-10-12T18:50"+CN,"road",{fr:"Retour à l'hôtel",en:"Back to the hotel"},1],
      ["2026-10-12T18:50"+CN,"2026-10-12T23:30"+CN,"free",{fr:"Soirée libre · le Bund",en:"Free evening · the Bund"},1],
      ["2026-10-12T23:30"+CN,"2026-10-13T07:00"+CN,"night","Jing An Shangri-La"],
      ["2026-10-13T07:00"+CN,"2026-10-13T08:30"+CN,"hotel",{fr:"Petit-déjeuner, check-out",en:"Breakfast, check-out"}],
      ["2026-10-13T08:30"+CN,"2026-10-13T13:15"+CN,"fair",{fr:"Agibot ou CIIF, au choix",en:"Agibot or CIIF, your choice"},1],
      ["2026-10-13T13:15"+CN,"2026-10-13T13:45"+CN,"hotel",{fr:"Retour au lobby avec les bagages",en:"Back to the lobby with luggage"}],
      ["2026-10-13T13:45"+CN,"2026-10-13T15:00"+CN,"road",{fr:"Transfert vers Pudong T1",en:"Transfer to Pudong T1"}],
      ["2026-10-13T15:00"+CN,"2026-10-13T17:40"+CN,"wait",{fr:"Enregistrement, sortie de Chine",en:"Check-in, exit China"}],
      ["2026-10-13T17:40"+CN,"2026-10-13T20:25"+CN,"fly",{fr:"MU 9991 Shanghai → Macao",en:"MU 9991 Shanghai → Macao"}],
      ["2026-10-13T20:25"+CN,"2026-10-13T21:05"+CN,"road",{fr:"Frontière, puis Conrad",en:"Border, then Conrad"},1],
      ["2026-10-13T21:05"+CN,"2026-10-14T00:00"+CN,"free",{fr:"Soirée casinos (21 ans min.)",en:"Casino evening (21+)"},1],
      ["2026-10-14T00:00"+CN,"2026-10-14T08:00"+CN,"night","Conrad Macao"],
      ["2026-10-14T08:00"+CN,"2026-10-14T17:00"+CN,"free",{fr:"Journée libre · centre historique, Taipa",en:"Free day · historic centre, Taipa"},1],
      ["2026-10-14T17:00"+CN,"2026-10-14T20:00"+CN,"road",{fr:"Macao → Canton, frontière (à confirmer)",en:"Macao → Guangzhou, border (TBC)"},1],
      ["2026-10-14T20:00"+CN,"2026-10-14T23:00"+CN,"hotel",{fr:"Check-in Ritz-Carlton, soirée",en:"Ritz-Carlton check-in, evening"},1],
      ["2026-10-14T23:00"+CN,"2026-10-15T07:30"+CN,"night",{fr:"Ritz-Carlton Canton",en:"Ritz-Carlton Guangzhou"}],
      ["2026-10-15T07:30"+CN,"2026-10-15T09:00"+CN,"hotel",{fr:"Petit-déjeuner (FOODS)",en:"Breakfast (FOODS)"}],
      ["2026-10-15T09:00"+CN,"2026-10-15T09:20"+CN,"road",{fr:"Vers Pazhou",en:"To Pazhou"},1],
      ["2026-10-15T09:20"+CN,"2026-10-15T18:00"+CN,"fair",{fr:"Canton Fair · ouverture Phase 1",en:"Canton Fair · Phase 1 opening"},1],
      ["2026-10-15T18:00"+CN,"2026-10-15T18:20"+CN,"road",{fr:"Retour à l'hôtel",en:"Back to the hotel"},1],
      ["2026-10-15T18:20"+CN,"2026-10-15T23:00"+CN,"free",{fr:"Croisière rivière des Perles",en:"Pearl River cruise"},1],
      ["2026-10-15T23:00"+CN,"2026-10-16T07:30"+CN,"night",{fr:"Ritz-Carlton Canton",en:"Ritz-Carlton Guangzhou"}],
      ["2026-10-16T07:30"+CN,"2026-10-16T09:00"+CN,"hotel",{fr:"Petit-déjeuner, check-out",en:"Breakfast, check-out"}],
      ["2026-10-16T09:00"+CN,"2026-10-16T09:20"+CN,"road",{fr:"Vers Pazhou, avec les bagages",en:"To Pazhou, with luggage"},1],
      ["2026-10-16T09:20"+CN,"2026-10-16T20:30"+CN,"fair",{fr:"Canton Fair + visites sur réservation",en:"Canton Fair + bookable visits"},1],
      ["2026-10-16T20:30"+CN,"2026-10-16T21:30"+CN,"road",{fr:"Transfert vers Baiyun T3",en:"Transfer to Baiyun T3"},1],
      ["2026-10-16T21:30"+CN,"2026-10-17T00:20"+CN,"wait",{fr:"Enregistrement, immigration",en:"Check-in, immigration"}],
      ["2026-10-17T00:20"+CN,"2026-10-17T04:00"+AE,"fly",{fr:"EK 363 Canton → Dubaï",en:"EK 363 Guangzhou → Dubai"}],
      ["2026-10-17T04:00"+AE,"2026-10-17T07:50"+AE,"wait",{fr:"Correspondance à Dubaï",en:"Connection in Dubai"}],
      ["2026-10-17T07:50"+AE,"2026-10-17T13:30"+BE,"fly",{fr:"EK 183 Dubaï → Bruxelles",en:"EK 183 Dubai → Brussels"}],
      ["2026-10-17T13:30"+BE,"2026-10-17T14:30"+BE,"road",{fr:"Frontière, bagages, retour",en:"Border, baggage, home"},1]
    ].map(s => ({a:new Date(s[0]), b:new Date(s[1]), k:s[2], l:L(s[3]), approx:!!s[4], ao:s[0].slice(-6), bo:s[1].slice(-6)}));
    const PLACE = STR.place;
    const offMs = off => (parseInt(off)*60 + (off[0]==="-"?-1:1)*parseInt(off.slice(4)))*60000;
    const loc = (d,off) => new Date(d.getTime() + offMs(off)).toISOString().slice(11,16);
    // Heure locale « murale » : pendant un vol, l'horloge passe de l'heure de départ à celle d'arrivée
    segs.forEach(s => { s.La = s.a.getTime() + offMs(s.ao); s.Lb = s.b.getTime() + offMs(s.bo); s.shift = (offMs(s.bo) - offMs(s.ao))/36e5; });
    const localNow = t => {
      const s = segs.find(x => t >= x.a.getTime() && t < x.b.getTime());
      if (s) return s.La + (t - s.a.getTime())/(s.b - s.a)*(s.Lb - s.La);
      return t + offMs(t < segs[0].a.getTime() ? segs[0].ao : segs[segs.length-1].bo);
    };
    const dur = ms => { const m = Math.round(ms/6e4); return `${Math.floor(m/60)} h ${String(m%60).padStart(2,"0")}`; };
    const sh = h => (h > 0 ? "+" : "−") + Math.abs(h) + " h";
    const head = (document.getElementById("headImg")||{}).getAttribute ? document.getElementById("headImg").getAttribute("href") : "";

    // Légende
    const prog = document.getElementById("programme");
    const lg = document.createElement("div"); lg.className = "tl-legend";
    lg.innerHTML = Object.entries(KIND).map(([k,v]) => `<span><i class="k-${k}"></i>${v}</span>`).join("") + `<span><i class="k-road approx" style="background-image:repeating-linear-gradient(135deg,transparent 0 3px,rgba(255,255,255,.45) 3px 5px)"></i>${STR.approxTime}</span>`;
    prog.querySelector(".sec-head").after(lg);

    const days = [];
    document.querySelectorAll("#days .day").forEach(dayEl => {
      const date = dayEl.dataset.date;
      const start = Date.parse(`${date}T00:00:00Z`), end = start + 864e5; // minuit en heure locale
      const wrap = document.createElement("div"); wrap.className = "tl";
      const bar = document.createElement("div"); bar.className = "tl-bar";
      bar.innerHTML = `<div class="tl-grid">${[3,6,9,12,15,18,21].map(h => `<b style="left:${h/24*100}%"></b>`).join("")}</div>`;
      const info = document.createElement("div"); info.className = "tl-info";
      const items = [];
      segs.forEach(s => {
        const a = Math.max(s.La, start), b = Math.min(s.Lb, end);
        if (b <= a) return;
        const btn = document.createElement("button"); btn.type = "button";
        btn.className = `tl-seg k-${s.k}` + (s.approx ? " approx" : "");
        btn.style.left = ((a-start)/864e5*100) + "%"; btn.style.width = ((b-a)/864e5*100) + "%";
        const times = s.ao === s.bo ? `${loc(s.a,s.ao)}–${loc(s.b,s.bo)} (${PLACE[s.ao]})` : `${loc(s.a,s.ao)} ${PLACE[s.ao]} → ${loc(s.b,s.bo)} ${PLACE[s.bo]}`;
        const extra = s.k === "fly" ? ` · ${STR.flightOf}${dur(s.b - s.a)}${s.shift ? `, ${STR.shift}${sh(s.shift)}` : ""}` : "";
        const txt = `${s.approx?"≈ ":""}${times} · ${s.l}${extra}`;
        btn.innerHTML = `<span>${s.l}</span>`;
        btn.title = txt; btn.setAttribute("aria-label", `${KIND[s.k]}: ${txt}`);
        const show = () => { bar.querySelectorAll(".tl-seg.sel").forEach(x => x.classList.remove("sel")); btn.classList.add("sel");
          info.innerHTML = `<span class="mono">${s.approx?"≈ ":""}${times}</span> · <b>${s.l}</b> <span class="muted">· ${KIND[s.k]}${extra}${s.approx?", "+STR.approxLow:""}</span>`; };
        btn.addEventListener("click", show); btn.addEventListener("mouseenter", show); btn.addEventListener("focus", show);
        bar.appendChild(btn); items.push(btn);
        if (s.shift && s.Lb > start && s.Lb <= end){ const g = document.createElement("span"); g.className = "tl-shift";
          g.style.left = ((s.Lb-start)/864e5*100) + "%"; g.textContent = sh(s.shift); bar.appendChild(g); }
      });
      const now = document.createElement("div"); now.className = "tl-now"; now.hidden = true;
      if (head) now.innerHTML = `<img src="${head}" alt="${STR.hereAlt}">`;
      bar.appendChild(now);
      const ticks = document.createElement("div"); ticks.className = "tl-ticks";
      ticks.innerHTML = [0,6,12,18,24].map(h => `<span style="left:${h/24*100}%">${String(h).padStart(2,"0")}h</span>`).join("");
      info.innerHTML = `<span class="tl-tz">${STR.tlHint}</span>`;
      wrap.append(bar, ticks, info);
      const h3 = dayEl.querySelector(".body h3"); h3.after(wrap);
      days.push({start, end, now, items});
    });

    function fit(){ days.forEach(d => d.items.forEach(b => { const sp = b.firstChild; b.classList.remove("tight"); if (sp.scrollWidth > b.clientWidth - 8) b.classList.add("tight"); })); }
    function nowLine(){ const t = localNow(Date.now()); days.forEach(d => { const on = t >= d.start && t < d.end; d.now.hidden = !on; if (on) d.now.style.left = ((t-d.start)/864e5*100) + "%"; }); }
    fit(); nowLine();
    window.addEventListener("resize", fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    setInterval(nowLine, 60000);
  })();

  /* ---------- Carte : tête qui suit le programme ---------- */
  (function(){
    const svg = $("mapSvg"); if (!svg) return;
    // Géographie partagée (assets/js/geo.js), injectée ici pour ne pas la dupliquer dans chaque langue
    if (window.GEO) [["geoLand","land"],["geoCn","cn"],["geoBorders","borders"]].forEach(([id,k]) => $(id).setAttribute("d", window.GEO[k]));
    const NS = "http://www.w3.org/2000/svg";
    const LON0=-12, LAT0=62, S=10, K=Math.cos(32*Math.PI/180);
    const P = (lat,lon) => [(lon-LON0)*K*S, (LAT0-lat)*S];
    const TZ = {be:"Europe/Brussels", ae:"Asia/Dubai", cn:"Asia/Shanghai", mo:"Asia/Macau"};
    const BXL = {fr:"Bruxelles",en:"Brussels"}, DXB = {fr:"Dubaï",en:"Dubai"}, CTN = {fr:"Canton",en:"Guangzhou"};
    const places = {
      home:{n:{fr:"HUB · Bruxelles",en:"HUB · Brussels"}, c:BXL, lat:50.846, lon:4.352, tz:"be"},
      BRU:{n:"Brussels Airport", c:BXL, lat:50.901, lon:4.484, tz:"be"},
      DXB:{n:{fr:"Dubaï DXB",en:"Dubai DXB"}, c:DXB, lat:25.253, lon:55.365, tz:"ae"},
      PVG:{n:"Pudong PVG", c:"Shanghai", lat:31.144, lon:121.808, tz:"cn"},
      JAS:{n:"Jing An Shangri-La", c:"Shanghai", lat:31.2235, lon:121.4465, tz:"cn"},
      NECC:{n:{fr:"Salon CIIF",en:"CIIF fair"}, c:"Shanghai", lat:31.192, lon:121.302, tz:"cn", end:1},
      MFM:{n:{fr:"Aéroport de Macao",en:"Macao airport"}, c:"Macao", lat:22.149, lon:113.592, tz:"mo", dy:12, dyw:14},
      CON:{n:"Conrad Macao", c:"Macao", lat:22.1435, lon:113.5625, tz:"mo", end:1, dyw:14},
      RITZ:{n:"Ritz-Carlton", c:CTN, lat:23.1175, lon:113.329, tz:"cn", end:1, dy:-6, dyw:-6},
      FAIR:{n:"Canton Fair", c:CTN, lat:23.1035, lon:113.367, tz:"cn", dy:12},
      CAN:{n:"Baiyun CAN", c:CTN, lat:23.392, lon:113.299, tz:"cn"}
    };
    Object.values(places).forEach(p => { const xy = P(p.lat,p.lon); p.x = xy[0]; p.y = xy[1]; p.n = L(p.n); p.c = L(p.c); });
    // Trajets (heures locales). approx = horaire estimé, pas dans le programme.
    const moves = [
      {f:"home",t:"BRU", a:"2026-10-10T17:45:00+02:00", b:"2026-10-10T18:30:00+02:00", l:{fr:"Départ du HUB vers Brussels Airport",en:"Leaving the HUB for Brussels Airport"}, stay:{fr:"Rendez-vous à 19:00 à Brussels Airport, puis embarquement",en:"Meet at 19:00 at Brussels Airport, then boarding"}},
      {f:"BRU",t:"DXB", a:"2026-10-10T21:40:00+02:00", b:"2026-10-11T06:55:00+04:00", l:{fr:"EK 182 vers Dubaï",en:"EK 182 to Dubai"}, fly:1, stay:{fr:"Correspondance à Dubaï (2 h 45), terminal 3",en:"Connection in Dubai (2 h 45), terminal 3"}},
      {f:"DXB",t:"PVG", a:"2026-10-11T09:40:00+04:00", b:"2026-10-11T22:20:00+08:00", l:{fr:"EK 304 vers Shanghai",en:"EK 304 to Shanghai"}, fly:1, stay:{fr:"Bagages, regroupement à 22:30",en:"Baggage, regroup at 22:30"}},
      {f:"PVG",t:"JAS", a:"2026-10-11T22:45:00+08:00", b:"2026-10-11T23:50:00+08:00", l:{fr:"Transfert vers l'hôtel",en:"Transfer to the hotel"}, stay:{fr:"Nuit au Jing An Shangri-La",en:"Night at the Jing An Shangri-La"}},
      {f:"JAS",t:"NECC", a:"2026-10-12T08:30:00+08:00", b:"2026-10-12T09:15:00+08:00", l:{fr:"Vers le salon CIIF",en:"To the CIIF fair"}, approx:1, stay:{fr:"Salon de la robotique CIIF, journée complète",en:"CIIF robotics fair, full day"}},
      {f:"NECC",t:"JAS", a:"2026-10-12T18:00:00+08:00", b:"2026-10-12T18:50:00+08:00", l:{fr:"Retour à l'hôtel",en:"Back to the hotel"}, approx:1, stay:{fr:"Soirée libre à Shanghai. Le matin du 13 : check-out, puis Agibot ou CIIF au choix",en:"Free evening in Shanghai. Morning of the 13th: check-out, then Agibot or CIIF, your choice"}},
      {f:"JAS",t:"PVG", a:"2026-10-13T13:45:00+08:00", b:"2026-10-13T15:00:00+08:00", l:{fr:"Transfert vers Pudong T1, avec les bagages",en:"Transfer to Pudong T1, with luggage"}, stay:{fr:"Enregistrement à Pudong T1",en:"Check-in at Pudong T1"}},
      {f:"PVG",t:"MFM", a:"2026-10-13T17:40:00+08:00", b:"2026-10-13T20:25:00+08:00", l:{fr:"MU 9991 vers Macao",en:"MU 9991 to Macao"}, fly:1, stay:{fr:"Passage de la frontière à Macao",en:"Border crossing in Macao"}},
      {f:"MFM",t:"CON", a:"2026-10-13T20:45:00+08:00", b:"2026-10-13T21:05:00+08:00", l:{fr:"Vers le Conrad Macao",en:"To the Conrad Macao"}, approx:1, stay:{fr:"Soirée à Macao, journée libre le 14",en:"Evening in Macao, free day on the 14th"}},
      {f:"CON",t:"RITZ", a:"2026-10-14T17:00:00+08:00", b:"2026-10-14T20:00:00+08:00", l:{fr:"Transfert Macao → Canton (horaire à confirmer)",en:"Transfer Macao → Guangzhou (time TBC)"}, approx:1, stay:{fr:"Check-in au Ritz-Carlton Canton",en:"Check-in at the Ritz-Carlton Guangzhou"}},
      {f:"RITZ",t:"FAIR", a:"2026-10-15T09:00:00+08:00", b:"2026-10-15T09:20:00+08:00", l:{fr:"Vers la Canton Fair",en:"To the Canton Fair"}, approx:1, stay:{fr:"Canton Fair, jour d'ouverture de la Phase 1",en:"Canton Fair, Phase 1 opening day"}},
      {f:"FAIR",t:"RITZ", a:"2026-10-15T18:00:00+08:00", b:"2026-10-15T18:20:00+08:00", l:{fr:"Retour au Ritz-Carlton",en:"Back to the Ritz-Carlton"}, approx:1, stay:{fr:"Soirée à Canton",en:"Evening in Guangzhou"}},
      {f:"RITZ",t:"FAIR", a:"2026-10-16T09:00:00+08:00", b:"2026-10-16T09:20:00+08:00", l:{fr:"Check-out, puis Canton Fair",en:"Check-out, then Canton Fair"}, approx:1, stay:{fr:"Canton Fair et visites, avec les bagages",en:"Canton Fair and visits, with luggage"}},
      {f:"FAIR",t:"CAN", a:"2026-10-16T20:30:00+08:00", b:"2026-10-16T21:30:00+08:00", l:{fr:"Transfert vers Baiyun T3",en:"Transfer to Baiyun T3"}, approx:1, stay:{fr:"Enregistrement et immigration à Baiyun T3",en:"Check-in and immigration at Baiyun T3"}},
      {f:"CAN",t:"DXB", a:"2026-10-17T00:20:00+08:00", b:"2026-10-17T04:00:00+04:00", l:{fr:"EK 363 vers Dubaï",en:"EK 363 to Dubai"}, fly:1, stay:{fr:"Correspondance à Dubaï (3 h 50)",en:"Connection in Dubai (3 h 50)"}},
      {f:"DXB",t:"BRU", a:"2026-10-17T07:50:00+04:00", b:"2026-10-17T13:30:00+02:00", l:{fr:"EK 183 vers Bruxelles",en:"EK 183 to Brussels"}, fly:1, stay:{fr:"Bienvenue à la maison",en:"Welcome home"}}
    ];
    moves.forEach(m => { m.A = new Date(m.a); m.B = new Date(m.b); m.l = L(m.l); m.stay = L(m.stay); });
    const T0 = new Date("2026-10-10T15:00:00+02:00").getTime(), T1 = new Date("2026-10-17T15:00:00+02:00").getTime();

    // Géométrie : arc pour les vols, ligne droite pour la route
    function ctrl(m){
      const a = places[m.f], b = places[m.t];
      if (!m.fly) return null;
      const mx=(a.x+b.x)/2, my=(a.y+b.y)/2, dx=b.x-a.x, dy=b.y-a.y, len=Math.hypot(dx,dy);
      let nx=-dy/len, ny=dx/len; if (ny>0){nx=-nx;ny=-ny;}
      const k = Math.min(.18*len, 90);
      return [mx+nx*k, my+ny*k];
    }
    function at(m,p){
      const a = places[m.f], b = places[m.t], c = ctrl(m);
      if (!c) return [a.x+(b.x-a.x)*p, a.y+(b.y-a.y)*p];
      const q=1-p; return [q*q*a.x+2*q*p*c[0]+p*p*b.x, q*q*a.y+2*q*p*c[1]+p*p*b.y];
    }
    function d(m){ const a=places[m.f], b=places[m.t], c=ctrl(m); return c ? `M${a.x} ${a.y}Q${c[0]} ${c[1]} ${b.x} ${b.y}` : `M${a.x} ${a.y}L${b.x} ${b.y}`; }

    // État à un instant t
    function state(t){
      const ms = t.getTime();
      for (let i=0;i<moves.length;i++){
        const m = moves[i];
        if (ms < m.A.getTime()){
          const prev = moves[i-1];
          const pl = prev ? places[prev.t] : places.home;
          return {i, moving:false, pos:[pl.x,pl.y], place:pl, next:m, stay: prev ? prev.stay : STR.atHome};
        }
        if (ms <= m.B.getTime()){
          const p = (ms - m.A.getTime()) / (m.B.getTime() - m.A.getTime());
          return {i, moving:true, p, pos:at(m,p), cur:m, next:m};
        }
      }
      return {i:moves.length, moving:false, pos:[places.BRU.x,places.BRU.y], place:places.BRU, next:null, stay:STR.welcome};
    }

    // Formats
    const fT = (d,tz) => new Intl.DateTimeFormat(LOC,{timeZone:TZ[tz],hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(d);
    const fD = (d,tz) => new Intl.DateTimeFormat(LOC,{timeZone:TZ[tz],weekday:"short",day:"numeric"}).format(d);
    const until = ms => { const m=Math.max(0,Math.round(ms/60000)), dd=Math.floor(m/1440), h=Math.floor(m/60)%24, mn=m%60;
      return dd ? `${dd} ${STR.d} ${h} h` : h ? `${h} h ${String(mn).padStart(2,"0")}` : `${mn} min`; };

    // Dessin de l'itinéraire
    const gR=$("gRoutes"), gP=$("gPins"), gA=$("gArrow"), gH=$("gHead"), headImg=$("headImg"), headInner=$("headInner");
    const routeEls = moves.map(m => { const p=document.createElementNS(NS,"path"); p.setAttribute("d",d(m)); gR.appendChild(p); return p; });
    const pinEls = {};
    Object.entries(places).forEach(([k,p]) => {
      if (k==="home") return;
      const g=document.createElementNS(NS,"g");
      const c=document.createElementNS(NS,"circle"); c.setAttribute("cx",p.x); c.setAttribute("cy",p.y); c.setAttribute("class","pin");
      const tx=document.createElementNS(NS,"text"); tx.setAttribute("class","plabel");
      g.appendChild(c); g.appendChild(tx); gP.appendChild(g); pinEls[k]={g,c,tx,p};
    });
    const arrowPath=document.createElementNS(NS,"path"); arrowPath.setAttribute("class","arrow"); gA.appendChild(arrowPath);
    const arrowHead=document.createElementNS(NS,"path"); arrowHead.setAttribute("class","arrow-head"); gA.appendChild(arrowHead);
    const HW=151, HH=200;

    // Cadrages
    const box = (pts,minW) => { let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9; pts.forEach(([x,y])=>{x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);});
      const cx=(x0+x1)/2, cy=(y0+y1)/2; let w=Math.max((x1-x0)*1.7,minW), h=Math.max((y1-y0)*1.9,minW*.55);
      return [cx,cy,w,h]; };
    const VIEWS = {
      world: box([P(55,-2),P(16,126)],100),
      china: box([P(32.2,111.5),P(21.6,122.4)],40)
    };
    let mode = "follow";
    function targetView(st){
      if (mode!=="follow") return VIEWS[mode];
      if (!st.next) return VIEWS.world;
      const m = st.next, a = places[m.f], b = places[m.t];
      const pts = [st.pos,[b.x,b.y]];
      if (st.moving) pts.push([a.x,a.y]);
      if (m.fly && (m.f==="BRU"||m.t==="BRU"||m.f==="DXB"||m.t==="DXB")) return VIEWS.world;
      return box(pts, 32);
    }
    let vb = null, goal = null;
    const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Rendu
    let tSel = null; // null = en direct
    let st = null;
    function px(){ const r = svg.getBoundingClientRect(); return {w:r.width||800, h:r.height||500}; }
    function draw(){
      if (!vb) return;
      const [cx,cy,w,h] = vb, sz = px();
      const s = 1/Math.min(sz.w/w, sz.h/h); // unités par pixel
      svg.setAttribute("viewBox", `${cx-w/2} ${cy-h/2} ${w} ${h}`);
      ["geoLand","geoCn","geoBorders"].forEach(id => $(id).setAttribute("stroke-width", (id==="geoBorders"?.8:.6)*s));
      const ms = (tSel ?? Date.now());
      routeEls.forEach((el,i) => { const done = moves[i].B.getTime() <= ms;
        el.setAttribute("class","rt "+(done?"done":"todo")); el.setAttribute("stroke-width",(done?2.6:1.8)*s);
        el.setAttribute("stroke-dasharray", done ? "" : `${5*s} ${5*s}`); });
      const wide = w > 60, seen = {};
      const hot = st && st.next ? st.next.t : null;
      Object.entries(pinEls).forEach(([k,o]) => {
        o.c.setAttribute("r", (k===hot?5.5:3.5)*s); o.c.setAttribute("stroke-width",1.5*s);
        o.c.setAttribute("class","pin"+(k===hot?" hot":""));
        let txt = wide ? o.p.c : o.p.n;
        if (wide && seen[txt]) txt = ""; seen[o.p.c]=1;
        o.tx.textContent = txt; o.tx.setAttribute("font-size", (k===hot?14:12)*s);
        o.tx.setAttribute("stroke-width", 3*s);
        o.tx.setAttribute("class","plabel"+(k===hot?"":" dim"));
        const here = st && !st.moving && st.place === o.p;
        if (here) o.tx.textContent = "";
        o.tx.setAttribute("text-anchor", (!wide && o.p.end) ? "end" : "start");
        o.tx.setAttribute("x", o.p.x + ((!wide && o.p.end) ? -8 : 8)*s); o.tx.setAttribute("y", o.p.y + (4 + (wide ? (o.p.dyw||0) : (o.p.dy||0)))*s);
      });
      if (!st) return;
      // Tête
      const H = Math.max(30, Math.min(44, sz.w/17)) * s, W = H*HW/HH;
      const [hx,hy] = st.pos;
      headImg.setAttribute("width",W); headImg.setAttribute("height",H);
      headImg.setAttribute("x",-W/2); headImg.setAttribute("y",-H*.62);
      let rot = 0, bob = 0;
      if (st.moving){ const a=at(st.cur,Math.max(0,st.p-.01)), b=at(st.cur,Math.min(1,st.p+.01));
        rot = Math.max(-14,Math.min(14,(b[0]-a[0]>=0?1:-1)*10)); if (!reduce) bob = Math.sin(performance.now()/260)*3*s; }
      gH.setAttribute("transform",`translate(${hx} ${hy})`);
      flag(H);
      headInner.setAttribute("transform",`translate(0 ${bob}) rotate(${rot})`);
      // Flèche vers la prochaine étape
      if (st.next){
        const b = places[st.next.t], dx=b.x-hx, dy=b.y-hy, L=Math.hypot(dx,dy);
        const r0 = H*.55, r1 = 9*s;
        if (L > r0 + r1 + 6*s){
          const ux=dx/L, uy=dy/L, sx=hx+ux*r0, sy=hy+uy*r0, ex=b.x-ux*r1, ey=b.y-uy*r1;
          const bend = Math.min(L*.18, 60*s), qx=(sx+ex)/2-uy*bend, qy=(sy+ey)/2+ux*bend;
          const dash = 7*s, off = reduce ? 0 : -((performance.now()/40)%14)*s;
          arrowPath.setAttribute("d",`M${sx} ${sy}Q${qx} ${qy} ${ex} ${ey}`);
          arrowPath.setAttribute("stroke-width",3*s); arrowPath.setAttribute("stroke-dasharray",`${dash} ${dash*.7}`);
          arrowPath.setAttribute("stroke-dashoffset",off);
          const tx=ex-qx, ty=ey-qy, tl=Math.hypot(tx,ty)||1, vx=tx/tl, vy=ty/tl, a=12*s, wdt=7*s;
          arrowHead.setAttribute("d",`M${ex+vx*4*s} ${ey+vy*4*s}L${ex-vx*a-vy*wdt} ${ey-vy*a+vx*wdt}L${ex-vx*a+vy*wdt} ${ey-vy*a-vx*wdt}Z`);
          gA.removeAttribute("visibility");
        } else gA.setAttribute("visibility","hidden");
      } else gA.setAttribute("visibility","hidden");
    }

    // Easter egg : double-clic sur la tête → drapeau chinois et feu d'artifice
    const gF=$("gFlag"), flagPole=$("flagPole"), flagCloth=$("flagCloth"), flagStars=$("flagStars");
    const STARS = [[5,5,3],[10,2,1],[12,4,1],[12,7,1],[10,9,1]].map(([x,y,r],i) => {
      const p=document.createElementNS(NS,"path"); p.setAttribute("class","flag-star"); flagStars.appendChild(p);
      return {u:x/30, v:y/20, r:r/20, rot: i ? Math.atan2(5-y,5-x) : -Math.PI/2, el:p}; });
    const starD = (cx,cy,r,rot) => { let d=""; for (let k=0;k<10;k++){ const a=rot+k*Math.PI/5, rr = k%2 ? r*.382 : r;
      d += (k?"L":"M")+(cx+Math.cos(a)*rr).toFixed(2)+" "+(cy+Math.sin(a)*rr).toFixed(2); } return d+"Z"; };
    let eggT = null;
    const EGG_LEN = 8000;
    function flag(H){
      if (eggT === null) return;
      const el = performance.now() - eggT;
      if (el > EGG_LEN){ eggT = null; gF.setAttribute("visibility","hidden"); return; }
      gF.removeAttribute("visibility");
      gF.setAttribute("opacity", Math.min(1, (EGG_LEN-el)/800));
      const rise = 1 - Math.pow(1 - Math.min(1, el/700), 3); // le drapeau se déploie
      const px0 = -H*.42, top = -H*1.18, fw = H*1.5*rise, fh = H, t = reduce ? 0 : el/1000;
      const wave = (u) => (reduce ? 0 : Math.sin(u*5.5 - t*6)*H*.06*u);
      flagPole.setAttribute("x1",px0); flagPole.setAttribute("x2",px0);
      flagPole.setAttribute("y1",top-H*.06); flagPole.setAttribute("y2",H*.5); flagPole.setAttribute("stroke-width",H*.045);
      const N=16; let d="";
      for (let i=0;i<=N;i++){ const u=i/N; d += (i?"L":"M")+(px0+u*fw)+" "+(top+wave(u)); }
      for (let i=N;i>=0;i--){ const u=i/N; d += "L"+(px0+u*fw)+" "+(top+fh+wave(u)); }
      flagCloth.setAttribute("d", d+"Z");
      STARS.forEach(st => st.el.setAttribute("d", starD(px0+st.u*fw, top+st.v*fh+wave(st.u), st.r*fh*Math.max(.01,rise), st.rot)));
    }
    const fx = $("fxCanvas"), fctx = fx.getContext("2d");
    let parts = [], fxOn = false;
    const FX_COL = ["#EE1C25","#FFDE00","#FFF4C2","#FF8A3D","#FFFFFF"];
    function burst(x,y){
      const col = FX_COL[Math.floor(Math.random()*FX_COL.length)], n = 70, out = [];
      for (let i=0;i<n;i++){ const a = i/n*Math.PI*2 + Math.random()*.1, v = 90 + Math.random()*120;
        out.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:1.4+Math.random()*.6,age:0,col,r:1.6+Math.random()*1.4}); }
      return out;
    }
    function fireworks(){
      const r = fx.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
      fx.width = r.width*dpr; fx.height = r.height*dpr; fctx.setTransform(dpr,0,0,dpr,0,0);
      const hr = headImg.getBoundingClientRect(), cx = hr.left + hr.width/2 - r.left, cy = hr.top + hr.height/2 - r.top;
      for (let k=0;k<7;k++) setTimeout(() => {
        const x = k%2 ? r.width*(.15+Math.random()*.7) : Math.max(40, Math.min(r.width-40, cx + (Math.random()-.5)*r.width*.4));
        const y = Math.max(30, Math.min(r.height*.7, cy - 40 - Math.random()*r.height*.35));
        parts.push({x, y:r.height, rocket:{ty:y}, age:0, life:.55, col:"#FFF4C2", r:2});
        fxLoop(r);
      }, k*380);
    }
    function fxLoop(r){
      if (!fxOn){ fxOn = true; let last = performance.now();
        const loop = now => { const dt = Math.min(.05,(now-last)/1000); last = now;
          fctx.clearRect(0,0,r.width,r.height);
          const born = [];
          parts = parts.filter(p => {
            p.age += dt;
            if (p.rocket){ const q = Math.min(1, p.age/p.life), e = 1-Math.pow(1-q,2);
              p.y = r.height + (p.rocket.ty - r.height)*e;
              fctx.globalAlpha = 1; fctx.fillStyle = p.col; fctx.beginPath(); fctx.arc(p.x,p.y,p.r,0,7); fctx.fill();
              if (q >= 1){ born.push(...burst(p.x,p.y)); return false; } return true; }
            p.vx *= .985; p.vy = p.vy*.985 + 70*dt; p.x += p.vx*dt; p.y += p.vy*dt;
            const k = 1 - p.age/p.life; if (k <= 0) return false;
            fctx.globalAlpha = k; fctx.fillStyle = p.col; fctx.beginPath(); fctx.arc(p.x,p.y,p.r*(.6+.4*k),0,7); fctx.fill();
            return true; });
          parts.push(...born);
          fctx.globalAlpha = 1;
          if (parts.length) requestAnimationFrame(loop); else { fxOn = false; fctx.clearRect(0,0,r.width,r.height); } };
        requestAnimationFrame(loop); }
    }
    function easterEgg(){ eggT = performance.now(); if (!reduce) fireworks(); }
    // Double-clic à la souris, double tap au doigt
    let lastTap = 0;
    gH.addEventListener("pointerup", e => { const now = performance.now();
      if (now - lastTap < 350){ lastTap = 0; e.preventDefault(); easterEgg(); } else lastTap = now; });

    function panel(){
      const now = new Date(tSel ?? Date.now());
      if (st.moving){
        $("mNow").textContent = st.cur.l;
        $("mNowSub").textContent = STR.enRoute + places[st.cur.f].n;
      } else {
        $("mNow").textContent = st.place === places.home ? STR.home : st.place.n;
        $("mNowSub").textContent = st.stay;
      }
      const m = st.next;
      if (m){
        const f = places[m.f], ap = m.approx ? "≈ " : "";
        if (st.moving){
          $("mNext").textContent = places[m.t].n;
          $("mNextSub").textContent = `${STR.arrival}${ap}${fD(m.B,places[m.t].tz)}${STR.at}${fT(m.B,places[m.t].tz)}${STR.localTime}`;
          $("mNextCd").textContent = STR.inT + until(m.B - now);
        } else {
          $("mNext").textContent = m.l;
          $("mNextSub").textContent = `${STR.departure}${ap}${fD(m.A,f.tz)}${STR.at}${fT(m.A,f.tz)}${STR.localTime}${m.approx?" · "+STR.approxLow:""}`;
          $("mNextCd").textContent = STR.inT + until(m.A - now);
        }
      } else { $("mNext").textContent = STR.tripOver; $("mNextSub").textContent = ""; $("mNextCd").textContent = ""; }
      const later = moves.slice(st.i + 1, st.i + 4);
      $("mLater").innerHTML = later.length ? later.map(x => { const f=places[x.f];
        return `<li><span class="t">${fD(x.A,f.tz)} ${x.approx?"≈":""}${fT(x.A,f.tz)}</span><span>${x.l}</span></li>`; }).join("")
        : `<li><span class="t">—</span><span>${STR.nothingElse}</span></li>`;
      const live = tSel === null;
      $("mLive").classList.toggle("on", live);
      $("mLiveTxt").textContent = live ? STR.live : STR.sim;
      $("mWhen").textContent = live ? "" : STR.shown + new Intl.DateTimeFormat(LOC,{timeZone:"Europe/Brussels",weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(now) + STR.bruTime;
      if (live){ const v = (Math.min(T1,Math.max(T0,Date.now()))-T0)/(T1-T0)*10000; $("mTime").value = Math.round(v); }
    }

    function update(){
      st = state(new Date(tSel ?? Date.now()));
      goal = targetView(st);
      if (!vb) vb = goal.slice();
      panel();
    }
    // Replay : chaque trajet a sa propre durée, les attentes sont condensées
    const ease = p => p*p*(3-2*p);
    const SCHED = [];
    { let t = T0, at0 = 0;
      const push = (a,b,dur,mv) => { SCHED.push({a,b,s0:at0,s1:at0+dur,mv}); at0 += dur; };
      moves.forEach(m => { const A=m.A.getTime(), B=m.B.getTime();
        if (A > t) push(t, A, 1.4, false);
        push(A, B, m.fly ? 5 : 2.6, true); t = B; });
      if (T1 > t) push(t, T1, 1.4, false); }
    const PLAY_LEN = SCHED[SCHED.length-1].s1;
    const simAt = sec => { const g = SCHED.find(x => sec <= x.s1) || SCHED[SCHED.length-1];
      const p = Math.max(0, Math.min(1, (sec-g.s0)/(g.s1-g.s0))); return g.a + (g.b-g.a)*(g.mv ? ease(p) : p); };
    const secAt = ms => { const g = SCHED.find(x => ms <= x.b) || SCHED[SCHED.length-1];
      let p = Math.max(0, Math.min(1, (ms-g.a)/((g.b-g.a)||1)));
      if (g.mv){ let lo=0, hi=1; for (let k=0;k<20;k++){ const mid=(lo+hi)/2; if (ease(mid)<p) lo=mid; else hi=mid; } p=lo; }
      return g.s0 + (g.s1-g.s0)*p; };
    let playSec = 0, lastT = null;
    const CAM_TAU = .7; // secondes : inertie de la caméra
    function frame(now){
      const dt = lastT === null ? 0 : Math.min(.1, (now-lastT)/1000); lastT = now;
      if (goal){
        const k = 1 - Math.exp(-dt/CAM_TAU);
        if (reduce) vb = goal.slice();
        else vb = vb.map((v,i) => { const g = goal[i]; return Math.abs(g-v) < 1e-3*Math.max(1,Math.abs(g)) ? g : (i<2 ? v+(g-v)*k : Math.exp(Math.log(v)+(Math.log(g)-Math.log(v))*k)); });
      }
      if (playing){ playSec += dt; tSel = simAt(playSec);
        if (playSec >= PLAY_LEN){ tSel = T1; playing=false; $("mPlay").textContent=STR.replay; }
        $("mTime").value = Math.round((tSel-T0)/(T1-T0)*10000); update(); }
      if (st && st.moving && tSel === null) st = state(new Date());
      draw();
      requestAnimationFrame(frame);
    }

    // Contrôles
    let playing = false;
    const setMode = mm => { mode = mm; ["vFollow","vWorld","vChina"].forEach(id => $(id).setAttribute("aria-pressed", String(({vFollow:"follow",vWorld:"world",vChina:"china"})[id]===mm))); update(); };
    $("vFollow").addEventListener("click", () => setMode("follow"));
    $("vWorld").addEventListener("click", () => setMode("world"));
    $("vChina").addEventListener("click", () => setMode("china"));
    $("mTime").addEventListener("input", e => { playing=false; $("mPlay").textContent=STR.replay; tSel = T0 + (+e.target.value/10000)*(T1-T0); update(); });
    $("mNowBtn").addEventListener("click", () => { playing=false; $("mPlay").textContent=STR.replay; tSel = null; update(); });
    $("mPlay").addEventListener("click", () => {
      if (playing){ playing=false; $("mPlay").textContent=STR.replay; return; }
      if (mode !== "follow") setMode("follow");
      if (tSel === null || tSel >= T1) tSel = T0;
      playSec = secAt(tSel);
      playing = true; $("mPlay").textContent = STR.pause;
    });
    update(); setInterval(() => { if (tSel === null) update(); }, 30000);
    requestAnimationFrame(frame);
  })();
})();
