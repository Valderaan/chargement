/* =====================================================================
   VALDERAAN · Écran de chargement — FICHIER DE RÉGLAGES
   ---------------------------------------------------------------------
   C'est le seul fichier à modifier au quotidien.
   - Garde les guillemets "…" autour des textes.
   - Chaque ligne d'une liste se termine par une virgule.
   - Les chemins sont relatifs au dossier de l'écran de chargement.
   - Une ligne qui commence par // est ignorée (pratique pour désactiver).
   ===================================================================== */

window.VALDERAAN = {

  /* ---------- En-tête ---------- */
  accueil: {
    titre: "Valderaan",
    devise: "Vivez l'éveil à la magie de votre monde.",
    message: "Bienvenue, voyageur. Avant que le royaume n'ouvre officiellement ses portes, la Commanderie convie tous les braves à croiser le fer. Garde, parade, contre-attaque : viens montrer ce que vaut ta lame.",
  },

  /* ---------- Parchemin ----------
     Sert pour le tournoi aujourd'hui, et pour toute annonce ensuite
     (actualités, lore en cours…). Tout champ vide "" ou liste vide [] est masqué.
     - lignes      : tableau « libellé / valeur »
     - paragraphes : texte libre, un élément = un paragraphe
     - regles      : liste à puces losanges
     Attention à la place : si le texte déborde, retire une ligne ou raccourcis. */
  parchemin: {
    surtitre: "Proclamation royale",
    titre: "Grand Tournoi",
    sousTitre: "au corps à corps",
    date: "Vendredi 23 octobre",
    heure: "Entraînement dès 20h30 · Joutes à 21h30",
    lieu: "En la Commanderie des Deux Guets",
    lignes: [
      { label: "Duels",       texte: "1 contre 1, en deux manches gagnantes" },
      { label: "Tableau",     texte: "Élimination directe" },
      { label: "Armes",       texte: "Épée, massue, dague, hache" },
      { label: "Récompense",  texte: "Une bourse d'or pour tous" },
      { label: "Inscription", texte: "Registre des tournois (Discord)" },
    ],
    paragraphes: [
      // "Exemple de paragraphe libre pour une future annonce.",
    ],
    regles: [
      "Lames renforcées : nulle réparation entre deux combats.",
      "Toutes les techniques de combat sont débloquées.",
      "Hors de la Commanderie, le royaume demeure scellé.",
    ],
    piedDePage: "Que la Couronne veille sur vos lames.",
    discord: "",   // pour l'afficher sous le pied de page : "discord.gg/KTe4VHn4rb"
  },

  /* ---------- Diaporama ---------- */
  // 1920×1080 conseillé, en .jpg (~300 Ko).
  // Les « premieres » images de la liste passent toujours dans cet ordre au début,
  // les suivantes sont mélangées à chaque chargement.
  diaporama: {
    dureeParImage: 9,                         // secondes
    premieres: 3,                             // jardin du tournoi, duel sur le pont, arène
    images: [
      "images/diaporama/03-jardin-automne.jpg",
      "images/diaporama/22-duel-pont.jpg",
      "images/diaporama/01-arene-commanderie.jpg",
      "images/diaporama/02-sentier-ensoleille.jpg",
      "images/diaporama/04-chateau-nuit.jpg",
      "images/diaporama/05-refuge-cascade.jpg",
      "images/diaporama/06-grande-galerie.jpg",
      "images/diaporama/07-moulin-pluie.jpg",
      "images/diaporama/08-academie-crepuscule.jpg",
      "images/diaporama/09-bibliotheque.jpg",
      "images/diaporama/10-bibliotheque-mezzanine.jpg",
      "images/diaporama/11-grotte-cristal.jpg",
      "images/diaporama/12-pont-cascade.jpg",
      "images/diaporama/13-sentier-rochers.jpg",
      "images/diaporama/14-puits.jpg",
      "images/diaporama/15-arches-brume.jpg",
      "images/diaporama/16-tour-lune.jpg",
      "images/diaporama/17-cachots.jpg",
      "images/diaporama/18-maison-riviere.jpg",
      "images/diaporama/19-village-montagne.jpg",
      "images/diaporama/20-chateau-jour.jpg",
      "images/diaporama/21-bibliotheque-erudit.jpg",
    ],
  },

  /* ---------- Musique ----------
     Fichiers .ogg OBLIGATOIRES (le navigateur de GMod ne lit pas le .mp3).
     Le thème passe toujours en premier, puis les autres en ordre aléatoire.
     « artiste » est facultatif : renseigné, il s'affiche après le titre.
     Les fichiers de ce dossier ont été harmonisés en volume (-20 LUFS) :
     pour en ajouter, envoie-les à Claude ou harmonise-les de la même façon. */
  musique: {
    volume: 0.7,                              // 0 à 1, multiplié par le volume musique du joueur
    theme: { fichier: "musique/rivia.ogg", titre: "Rivia", artiste: "Daniel Schmitz" },
    autres: [
      { fichier: "musique/ashes-of-the-forgotten.ogg", titre: "Ashes of the Forgotten" },
      { fichier: "musique/darkwood-path.ogg",          titre: "Darkwood Path" },
      { fichier: "musique/elven-dawn.ogg",             titre: "Elven Dawn" },
      { fichier: "musique/emberlight.ogg",             titre: "Emberlight" },
      { fichier: "musique/frostbound.ogg",             titre: "Frostbound" },
      { fichier: "musique/hollow-throne.ogg",          titre: "Hollow Throne" },
      { fichier: "musique/moonspire.ogg",              titre: "Moonspire" },
      { fichier: "musique/mystic-grove.ogg",           titre: "Mystic Grove" },
      { fichier: "musique/silverbrook.ogg",            titre: "Silverbrook" },
      { fichier: "musique/sorrows-edge.ogg",           titre: "Sorrow's Edge" },
      { fichier: "musique/throne-of-storms.ogg",       titre: "Throne of Storms" },
      { fichier: "musique/winds-of-valor.ogg",         titre: "Winds of Valor" },
    ],
  },

  /* ---------- Messages au-dessus de la barre de progression ----------
     Un groupe par étape du chargement. Le premier message de chaque groupe
     s'affiche en entrant dans l'étape, puis les autres tournent au hasard
     si l'étape dure (toutes les ~7 s). Clins d'œil au Guide du Jeune Éveillé.
     60 caractères maximum par message, sinon il est coupé en 16:9. */
  chargement: {
    portail: [
      "Le portail s'éveille…",
      "Un messager galope vers Valdyn pour annoncer votre venue…",
      "La Gardienne Kaevra parcourt la liste des arrivants…",
      "Les pigeons du Royaume emportent la nouvelle de votre arrivée…",
    ],
    workshop: [
      "Les caravanes acheminent les ressources du royaume…",
      "Le bois descend de Felrun, le poisson remonte le Roydan…",
      "Le minerai sort des montagnes, les marchés de Valdyn s'animent…",
      "Borin remplit les chopes de sa taverne…",
      "Borin cherche encore la clé de votre chambre…",
      "Milo rappelle que les chaises ne sont pas des projectiles…",
      "Les maîtres d'armes aiguisent les lames de la Commanderie…",
    ],
    client: [
      "Les gardes du Guet du Lion d'Or vérifient votre sauf-conduit…",
      "Un greffier ouvre le Registre des Éveillés…",
      "La Gardienne Kaevra relit votre inscription… deux fois.",
      "Le héraut inscrit votre nom au tableau du tournoi…",
    ],
    fichiers: [
      "Les scribes apposent leurs empreintes dans les grimoires…",
      "À la Grande Bibliothèque, on déchiffre le temps d'avant…",
      "Un cartographe trace les routes que gardent les Guets…",
      "Les chercheurs de l'Académie consignent leurs observations…",
      "Borin note une nouvelle ardoise dans son registre…",
    ],
    lua: [
      "Une douce lumière répond à votre volonté…",
      "Sœur Eléan prépare les bandages. Un tournoi, on ne sait jamais…",
      "Les chevaliers de la Couronne prennent place autour de la lice…",
      "Le public s'installe dans les tribunes…",
    ],
    final: [
      "Les portes de Valdyn s'ouvrent…",
      "Nul ne s'éveille seul. Bienvenue en Valderaan.",
    ],
  },

  /* ---------- Chroniques (astuces & lore qui défilent) ---------- */
  // 3 lignes maximum à l'écran : environ 170 caractères par texte.
  chroniques: {
    dureeParTexte: 10,                        // secondes
    textes: [
      // — Le tournoi —
      "De 20h30 à 21h30, les maîtres d'armes enseignent garde, parade et contre-attaque. L'occasion de croiser le fer… et de faire connaissance.",
      "Épée, massue, dague ou hache : chaque arme a ses forces et ses faiblesses. Les maîtres d'armes vous les dévoileront avant les joutes.",
      "Chaque duel se joue en trois manches. Le premier à en remporter deux poursuit sa route dans l'arbre du tournoi.",
      "Si la lune le permet, des joutes en duo suivront : pour l'honneur seul, et pour apprendre à tenir quand on est en sous-nombre.",
      "Pour ce soir, le quartier général de l'Ordre de la Couronne se dévoile tel qu'il sera à son deuxième rang. Un avant-goût de ce que deviendront vos QG.",
      "Ce soir, seuls la Commanderie et une partie du château sont ouverts. Le reste du royaume demeure scellé… pour l'instant.",
      "En Valderaan, la lame comptera autant que la magie. Pour ce tournoi, toutes vos techniques de combat sont débloquées.",
      "Après les joutes, un court questionnaire vous sera remis : vos retours façonneront l'art du combat en Valderaan.",
      "Merci d'être parmi les premiers à fouler Valderaan. D'autres rassemblements suivront avant l'ouverture officielle des portes.",
      // — Clins d'œil au Guide du Jeune Éveillé —
      "Derrière le comptoir de Borin : « Ceux qui prétendent n'avoir jamais perdu paient leur tournée à toute la salle. » Avis aux futurs champions.",
      "Sœur Eléan l'assure : la peur rappelle ce qui compte. Mais devant un troll affamé, la fuite reste une réponse spirituellement acceptable.",
      "Nul pouvoir sans devoir, proclame la Couronne. Rien n'est interdit à qui sait pourquoi, répond l'Académie. Nul ne s'éveille seul, murmure la Communion.",
      "Tout Éveillé doit être inscrit au Registre des Éveillés, à la Commanderie des Deux Guets. Le tournoi ne vous en dispense pas.",
      "À l'est, la forêt de Varren s'épaissit et les brumes effacent les repères. Ceux qui s'y sont enfoncés assez loin ne sont pas revenus.",
      "Un mot inconnu, un titre, un lieu ? Le Lexique de Valderaan vous répond sur valderaan.github.io/lexique.",
      // — Le royaume —
      "Le ciel de Valderaan change sans cesse : pluie, brume et nuit tombent sur le royaume au fil des heures.",
      "Une question, un souci ? Le staff veille : n'hésite pas à le solliciter en jeu ou sur Discord.",
    ],
  },
};
