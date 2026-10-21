/* =====================================================================
   VALDERAAN · Écran de chargement — logique
   Les réglages (textes, images, musiques) sont dans config.js.
   Compatible Chromium 86 (navigateur intégré de GMod).
   ===================================================================== */
(function () {
  "use strict";

  var C = window.VALDERAAN || {};
  var $ = function (id) { return document.getElementById(id); };
  var params = new URLSearchParams(location.search);
  var MODE_DEMO = location.protocol === "file:" || params.has("demo");

  function melange(liste) {
    var a = liste.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function stockage(cle, valeur) {
    try {
      if (valeur === undefined) return localStorage.getItem(cle);
      localStorage.setItem(cle, valeur);
    } catch (e) { return null; }
  }
  function estAPreciser(t) { return !t || /à préciser/i.test(t); }

  /* ------------------------------------------------------------------
     1. Textes
     ------------------------------------------------------------------ */
  function remplirTextes() {
    var a = C.accueil || {};
    if (a.titre) $("titre").textContent = a.titre;
    $("devise").textContent = a.devise || "";
    $("message").textContent = a.message || "";

    // Parchemin (« parchemin » dans config.js ; « tournoi » accepté pour compatibilité)
    var t = C.parchemin || C.tournoi || {};
    function texte(id, valeur) {
      var el = $(id); el.textContent = valeur || ""; el.style.display = valeur ? "" : "none";
      return el;
    }
    texte("t-surtitre", t.surtitre);
    texte("t-titre", t.titre);
    texte("t-soustitre", t.sousTitre);
    texte("t-date", t.date);
    var heure = texte("t-heure", t.heure);
    if (t.heure && estAPreciser(t.heure)) heure.className = "p-heure a-preciser";
    texte("t-lieu", t.lieu);
    $("t-date").parentNode.style.display = (t.date || t.heure || t.lieu) ? "" : "none";

    var dl = $("t-lignes");
    (t.lignes || []).forEach(function (l) {
      var row = document.createElement("div"); row.className = "ligne";
      var dt = document.createElement("dt"); dt.textContent = l.label;
      var dd = document.createElement("dd"); dd.textContent = l.texte;
      if (estAPreciser(l.texte)) dd.className = "a-preciser";
      row.appendChild(dt); row.appendChild(dd); dl.appendChild(row);
    });
    dl.style.display = (t.lignes || []).length ? "" : "none";

    var pa = $("t-paragraphes");
    (t.paragraphes || []).forEach(function (txt) {
      var p = document.createElement("p"); p.textContent = txt; pa.appendChild(p);
    });
    pa.style.display = (t.paragraphes || []).length ? "" : "none";

    var ul = $("t-regles");
    (t.regles || []).forEach(function (r) {
      var li = document.createElement("li"); li.textContent = r; ul.appendChild(li);
    });
    ul.style.display = (t.regles || []).length ? "" : "none";
    texte("t-pied", t.piedDePage);
    texte("t-discord", t.discord);
  }

  /* ------------------------------------------------------------------
     2. Diaporama (fondu enchaîné + effet Ken Burns)
     ------------------------------------------------------------------ */
  function lancerDiaporama() {
    var d = C.diaporama || {};
    var images = (d.images || []).slice();
    if (!images.length) return;
    var duree = Math.max(4, d.dureeParImage || 9);
    // Les « premieres » images passent toujours dans l'ordre de la liste, le reste au hasard
    var nbFixes = Math.max(0, Math.min(images.length, d.premieres == null ? 1 : d.premieres));
    var ordre = images.slice(0, nbFixes).concat(melange(images.slice(nbFixes)));
    var animations = ["kb-zoom-in", "kb-pan-droite", "kb-zoom-out", "kb-pan-gauche"];
    var conteneur = $("diaporama");
    var calques = [document.createElement("div"), document.createElement("div")];
    calques.forEach(function (c) { c.className = "vue"; conteneur.appendChild(c); });

    // Préchargement
    images.forEach(function (src) { var i = new Image(); i.src = src; });

    var index = 0, tour = 0, actif = 0;
    function suivante() {
      var calque = calques[actif];
      var src = ordre[index % ordre.length];
      calque.style.backgroundImage = "url('" + src + "')";
      calque.style.animation = "none";
      void calque.offsetWidth; // relance l'animation
      calque.style.animation = animations[tour % animations.length] + " " + (duree + 2.5) + "s linear forwards";
      calque.classList.add("active");
      calques[1 - actif].classList.remove("active");
      actif = 1 - actif; index++; tour++;
      if (index % ordre.length === 0 && ordre.length > 2) ordre = melange(ordre);
    }
    suivante();
    setInterval(suivante, duree * 1000);
  }

  /* ------------------------------------------------------------------
     3. Essences magiques (particules)
     ------------------------------------------------------------------ */
  function lancerEssences() {
    var canvas = $("essences");
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, parts = [];

    function sprite(r, g, b) {
      var s = document.createElement("canvas"); s.width = s.height = 64;
      var c = s.getContext("2d");
      var grad = c.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255,255,240,1)");
      grad.addColorStop(0.15, "rgba(" + r + "," + g + "," + b + ",0.95)");
      grad.addColorStop(0.45, "rgba(" + r + "," + g + "," + b + ",0.25)");
      grad.addColorStop(1, "rgba(" + r + "," + g + "," + b + ",0)");
      c.fillStyle = grad; c.fillRect(0, 0, 64, 64);
      return s;
    }
    var spriteOr = sprite(255, 190, 80), spriteViolet = sprite(160, 100, 255), spriteBleu = sprite(90, 130, 255);

    function taille() {
      W = canvas.width = Math.round(innerWidth * dpr);
      H = canvas.height = Math.round(innerHeight * dpr);
      canvas.style.width = innerWidth + "px"; canvas.style.height = innerHeight + "px";
    }
    function nouvelle(initiale) {
      var magique = Math.random() < 0.22;
      return {
        x: Math.random() * W,
        y: initiale ? Math.random() * H : H + 20 * dpr,
        r: (magique ? 5 + Math.random() * 7 : 1.5 + Math.random() * 3.5) * dpr,
        vy: (magique ? 8 + Math.random() * 14 : 16 + Math.random() * 34) * dpr,
        phase: Math.random() * Math.PI * 2,
        ampl: (8 + Math.random() * 26) * dpr,
        freq: 0.3 + Math.random() * 0.8,
        vie: 0, duree: 7 + Math.random() * 9,
        img: magique ? (Math.random() < 0.5 ? spriteViolet : spriteBleu) : spriteOr,
        alpha: magique ? 0.35 + Math.random() * 0.3 : 0.5 + Math.random() * 0.5
      };
    }
    taille();
    addEventListener("resize", taille);
    var N = Math.round(Math.min(110, (innerWidth * innerHeight) / 19000));
    for (var i = 0; i < N; i++) parts.push(nouvelle(true));

    var avant = performance.now();
    function frame(t) {
      var dt = Math.min(0.05, (t - avant) / 1000); avant = t;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.vie += dt;
        p.y -= p.vy * dt;
        var x = p.x + Math.sin(p.phase + p.vie * p.freq) * p.ampl;
        var k = p.vie / p.duree;
        var fondu = k < 0.15 ? k / 0.15 : (k > 0.75 ? Math.max(0, (1 - k) / 0.25) : 1);
        var scintille = 0.75 + 0.25 * Math.sin(p.vie * 7 + p.phase);
        ctx.globalAlpha = p.alpha * fondu * scintille;
        var s = p.r * 4;
        ctx.drawImage(p.img, x - s / 2, p.y - s / 2, s, s);
        if (k >= 1 || p.y < -40) parts[i] = nouvelle(false);
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ------------------------------------------------------------------
     4. Chroniques (astuces / lore)
     ------------------------------------------------------------------ */
  function lancerChroniques() {
    var ch = C.chroniques || {};
    var textes = melange(ch.textes || []);
    var el = $("c-texte"), barre = $("c-temps");
    if (!textes.length) { $("chroniques").style.display = "none"; return; }
    var duree = Math.max(4, ch.dureeParTexte || 10);
    var i = 0;
    function montrer() {
      el.textContent = textes[i % textes.length];
      el.classList.remove("sortie");
      barre.style.transition = "none"; barre.style.width = "0%";
      void barre.offsetWidth;
      barre.style.transition = "width " + duree + "s linear"; barre.style.width = "100%";
    }
    montrer();
    setInterval(function () {
      el.classList.add("sortie");
      setTimeout(function () { i++; montrer(); }, 700);
    }, duree * 1000);
  }

  /* ------------------------------------------------------------------
     5. Musique : le thème d'abord, puis le reste au hasard.
        Bouton principal = couper / remettre, bouton ⏭ = piste suivante.
     ------------------------------------------------------------------ */
  var Musique = (function () {
    var m = C.musique || {};
    var theme = m.theme && m.theme.fichier ? m.theme : null;
    var autres = (m.autres || []).filter(function (p) { return p && p.fichier; });
    var toutes = (theme ? [theme] : []).concat(autres);
    var volumeBase = typeof m.volume === "number" ? m.volume : 0.7;
    var volumeJoueur = 1;
    var audio = new Audio();
    audio.preload = "auto";
    var file = [], courante = null, erreurs = 0, demarree = false, attenteClic = false;
    var sortie = 1, enSortie = false;   // fondu de sortie quand on passe à la suivante
    var muet = stockage("valderaan_muet") === "1";
    var widget = $("musique"), basculer = $("m-basculer"), suivante = $("m-suivante"), titre = $("m-titre");

    if (muet) document.body.classList.add("muet");
    if (!toutes.length) { widget.hidden = true; }
    if (toutes.length < 2) { suivante.hidden = true; }

    // Titre affiché : celui de config.js (+ artiste s'il est renseigné),
    // sinon le nom du fichier nettoyé ("musique/la-foret.ogg" -> "La foret")
    function nomPiste(p) {
      if (p.titre) return p.titre;
      var n = String(p.fichier).split("/").pop().replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
      return n.charAt(0).toUpperCase() + n.slice(1);
    }
    function afficher(texte, artiste) {
      titre.textContent = texte;
      if (artiste) {
        var span = document.createElement("span");
        span.className = "m-artiste";
        span.textContent = " · " + artiste;
        titre.appendChild(span);
      }
    }
    function afficherPiste() { if (courante) afficher(nomPiste(courante), courante.artiste); }

    function remplirFile() {
      if (!file.length) {
        file = demarree ? melange(toutes) : ((theme ? [theme] : []).concat(melange(autres)));
        if (courante && file.length > 1 && file[0] === courante) file.push(file.shift());
      }
    }
    function appliquerVolume() {
      var d = audio.duration, t = audio.currentTime, f = 1;
      if (isFinite(d) && d > 6) f = Math.min(1, t / 2.5, (d - t) / 2.5);
      else f = Math.min(1, t / 2.5);
      audio.volume = Math.max(0, Math.min(1, volumeBase * volumeJoueur * Math.max(0, f) * sortie));
    }
    function jouer() {
      remplirFile();
      courante = file.shift();
      if (!courante) return;
      sortie = 1; enSortie = false;
      audio.src = encodeURI(courante.fichier);
      audio.muted = muet;
      audio.volume = 0;
      afficherPiste();
      var p = audio.play();
      if (p && p.catch) p.catch(function (e) {
        if (e && e.name === "NotAllowedError") {
          // Lecture automatique bloquée (navigateur classique) : on attend un clic
          attenteClic = true;
          afficher("Clique pour la musique");
          document.body.classList.add("sans-son");
        }
      });
    }
    function passer() {
      if (enSortie || !toutes.length) return;
      demarree = true;
      if (audio.paused || muet) { jouer(); return; }
      enSortie = true;
      var debut = performance.now();
      (function fondu(t) {
        sortie = Math.max(0, 1 - (t - debut) / 600);
        appliquerVolume();
        if (sortie > 0) requestAnimationFrame(fondu); else jouer();
      })(debut);
    }

    audio.addEventListener("playing", function () {
      erreurs = 0; attenteClic = false;
      document.body.classList.remove("sans-son");
      afficherPiste();
    });
    audio.addEventListener("timeupdate", appliquerVolume);
    audio.addEventListener("ended", function () { demarree = true; jouer(); });
    audio.addEventListener("error", function () {
      erreurs++;
      if (erreurs >= toutes.length) {
        afficher("Aucune musique trouvée");
        document.body.classList.add("sans-son");
        return;
      }
      jouer();
    });

    basculer.addEventListener("click", function (ev) {
      ev.stopPropagation();
      if (attenteClic || audio.paused) {
        muet = false; stockage("valderaan_muet", "0");
        document.body.classList.remove("muet");
        if (volumeJoueur === 0) volumeJoueur = 0.6;
        audio.muted = false;
        if (audio.src) audio.play(); else jouer();
        return;
      }
      muet = !muet;
      stockage("valderaan_muet", muet ? "1" : "0");
      audio.muted = muet;
      document.body.classList.toggle("muet", muet);
    });
    suivante.addEventListener("click", function (ev) {
      ev.stopPropagation();
      if (attenteClic) { attenteClic = false; }
      passer();
    });
    document.addEventListener("click", function () {
      if (attenteClic) { audio.play(); }
    });

    return {
      demarrer: function (vol) {
        if (typeof vol === "number" && isFinite(vol)) volumeJoueur = Math.max(0, Math.min(1, vol));
        if (!toutes.length || audio.src) return;
        if (volumeJoueur === 0) {
          // Le joueur a coupé la musique dans GMod : on respecte son choix
          afficher("Désactivée dans le jeu");
          document.body.classList.add("sans-son");
          return;
        }
        jouer();
      }
    };
  })();

  /* ------------------------------------------------------------------
     6. Progression + fonctions appelées par GMod
     ------------------------------------------------------------------ */
  var ETAPES = {
    portail:  { min: 0.00, max: 0.06 },
    workshop: { min: 0.06, max: 0.55 },
    client:   { min: 0.55, max: 0.62 },
    fichiers: { min: 0.62, max: 0.86 },
    lua:      { min: 0.86, max: 0.94 },
    final:    { min: 0.94, max: 0.995 }
  };
  // Messages d'ambiance (config.js > chargement), avec des valeurs de secours
  var MESSAGES = {
    portail:  ["Le portail s'éveille…"],
    workshop: ["Les caravanes acheminent les ressources du royaume…"],
    client:   ["Les gardes vérifient votre sauf-conduit…"],
    fichiers: ["Les scribes recopient les grimoires…"],
    lua:      ["Une douce lumière répond à votre volonté…"],
    final:    ["Les portes de Valdyn s'ouvrent…"]
  };
  var cfgMsg = C.chargement || {};
  Object.keys(MESSAGES).forEach(function (k) {
    if (cfgMsg[k] && cfgMsg[k].length) MESSAGES[k] = cfgMsg[k].slice();
  });
  var etat = { total: 0, restants: 0, etape: "portail", cible: 0, affiche: 0, wsFait: 0, wsTotal: 0 };
  var rotation = { file: [], minuterie: null };

  function afficherMessage(txt) {
    var el = $("pr-etape");
    el.style.opacity = 0;
    setTimeout(function () { el.textContent = txt; el.style.opacity = 1; }, 300);
  }
  function lancerRotation(nom) {
    clearInterval(rotation.minuterie);
    var liste = MESSAGES[nom];
    afficherMessage(liste[0]);
    rotation.file = [];
    if (liste.length < 2) return;
    var derniere = liste[0];
    rotation.minuterie = setInterval(function () {
      if (!rotation.file.length) {
        rotation.file = melange(liste);
        if (rotation.file[0] === derniere) rotation.file.push(rotation.file.shift());
      }
      derniere = rotation.file.shift();
      afficherMessage(derniere);
    }, 7000);
  }

  function changerEtape(nom) {
    if (!ETAPES[nom]) return;
    var ordre = ["portail", "workshop", "client", "fichiers", "lua", "final"];
    if (ordre.indexOf(nom) < ordre.indexOf(etat.etape)) return; // jamais en arrière
    if (nom !== etat.etape) {
      etat.etape = nom;
      lancerRotation(nom);
    }
    etat.cible = Math.max(etat.cible, ETAPES[nom].min);
  }
  function majCompteur() {
    var c = "";
    if (etat.total > 0) c = "Parchemin " + Math.min(etat.total, etat.total - etat.restants) + " / " + etat.total;
    else if (etat.wsTotal > 0) c = "Ressource " + etat.wsFait + " / " + etat.wsTotal;
    $("pr-compteur").textContent = c;
  }
  function majFichiers() {
    if (etat.total > 0) {
      var frac = Math.max(0, Math.min(1, (etat.total - etat.restants) / etat.total));
      etat.cible = Math.max(etat.cible, 0.62 + 0.24 * frac);
    }
    majCompteur();
  }

  window.GameDetails = function (servername, serverurl, mapname, maxplayers, steamid, gamemode, volume, language) {
    var morceaux = [];
    if (servername) morceaux.push(servername);
    if (mapname) morceaux.push(mapname);
    if (maxplayers) morceaux.push(maxplayers + " places");
    $("serveur").textContent = morceaux.join("  ·  ");
    Musique.demarrer(parseFloat(volume));
  };
  window.SetFilesTotal = function (total) {
    etat.total = Math.max(0, parseInt(total, 10) || 0);
    if (!etat.restants) etat.restants = etat.total;
    if (etat.total > 0) changerEtape("fichiers");
    majFichiers();
  };
  window.SetFilesNeeded = function (needed) {
    etat.restants = Math.max(0, parseInt(needed, 10) || 0);
    majFichiers();
  };
  window.DownloadingFile = function (fileName) {
    $("pr-fichier").textContent = String(fileName || "").replace(/^\/+/, "");
    if (etat.total > 0) changerEtape("fichiers");
  };
  window.SetStatusChanged = function (status) {
    var s = String(status || ""), b = s.toLowerCase();
    $("pr-fichier").textContent = s;
    var ratio = s.match(/(\d+)\s*\/\s*(\d+)/);
    if (/retriev|server info/.test(b) && !/client/.test(b)) changerEtape("portail");
    if (/workshop|addon|mount|downloading/.test(b)) {
      changerEtape("workshop");
      if (ratio) {
        etat.wsFait = +ratio[1]; etat.wsTotal = +ratio[2];
        if (etat.wsTotal > 0) etat.cible = Math.max(etat.cible, 0.06 + 0.49 * (etat.wsFait / etat.wsTotal));
        majCompteur();
      }
      if (/complete/.test(b)) etat.cible = Math.max(etat.cible, 0.55);
    }
    if (/client info/.test(b)) changerEtape("client");
    if (/lua/.test(b)) changerEtape("lua");
    if (/starting lua|lua started|initiali|precach|sending complete|spawn/.test(b)) changerEtape("final");
  };

  // Animation douce de la barre (elle avance légèrement même pendant les longues étapes)
  function boucleProgression() {
    var e = ETAPES[etat.etape];
    if (etat.cible < e.max - 0.01) etat.cible += (e.max - etat.cible) * 0.0009;
    etat.affiche += (etat.cible - etat.affiche) * 0.06;
    var p = Math.max(0, Math.min(1, etat.affiche));
    $("pr-remplissage").style.width = (p * 100).toFixed(2) + "%";
    $("pr-etincelle").style.left = (p * 100).toFixed(2) + "%";
    $("pr-pourcent").textContent = Math.floor(p * 100) + " %";
    requestAnimationFrame(boucleProgression);
  }

  /* ------------------------------------------------------------------
     7. Mode démo (ouverture dans un navigateur, ou ?demo dans l'adresse)
     ------------------------------------------------------------------ */
  function demo() {
    var fichiers = [
      "maps/rp_valderaan_v1.bsp", "materials/valderaan/runes/rune_ring_01.vtf",
      "materials/valderaan/runes/rune_band_01.vtf", "models/valderaan/magic_torch_01.mdl",
      "sound/valderaan/ambiance_foret.ogg", "materials/valderaan/sky/ciel_etoile.vtf",
      "models/props/archi/humans/lightsrc/torch01.mdl", "resource/fonts/valderaan.ttf"
    ];
    var t = 0;
    function a(delai, fn) { t += delai; setTimeout(fn, t); }
    function reinit() {
      etat.total = 0; etat.restants = 0; etat.cible = 0; etat.affiche = 0;
      etat.wsFait = 0; etat.wsTotal = 0; etat.etape = "portail";
      lancerRotation("portail"); $("pr-fichier").innerHTML = "&nbsp;"; majCompteur();
    }
    function sequence() {
      t = 0; reinit();
      a(600, function () { SetStatusChanged("Retrieving server info..."); });
      for (var k = 1; k <= 18; k++) (function (k) {
        a(700, function () { SetStatusChanged("Downloading Workshop addon (" + k + "/18)"); });
      })(k);
      a(800, function () { SetStatusChanged("Workshop Complete"); });
      a(900, function () { SetStatusChanged("Sending client info..."); SetFilesTotal(60); });
      for (var n = 59; n >= 0; n--) (function (n) {
        a(150, function () { DownloadingFile(fichiers[n % fichiers.length]); SetFilesNeeded(n); });
      })(n);
      a(900, function () { SetStatusChanged("Client info sent!"); });
      a(1500, function () { SetStatusChanged("Received all Lua files we needed!"); });
      a(2000, function () { SetStatusChanged("Starting Lua..."); });
      a(4500, sequence); // recommence en boucle pour la prévisualisation
    }
    GameDetails("Valderaan · Grand Tournoi", "", "rp_valderaan_v1", 64, "76561190000000000", "", 0.8, "fr");
    sequence();
  }

  /* ------------------------------------------------------------------
     Démarrage
     ------------------------------------------------------------------ */
  remplirTextes();
  lancerDiaporama();
  lancerEssences();
  lancerChroniques();
  requestAnimationFrame(boucleProgression);
  lancerRotation("portail");

  if (MODE_DEMO) {
    setTimeout(demo, 400);
  } else {
    // Filet de sécurité : si GMod n'a pas appelé GameDetails, on lance quand même la musique
    setTimeout(function () { Musique.demarrer(); }, 4000);
  }
})();
