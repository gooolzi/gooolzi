/* Kursinhalte: Themen → Lektionen → Vokabeln & Sätze.
   pron = Aussprachehilfe für deutsche Muttersprachlerinnen. */
window.COURSE = [
  {
    id: "basics",
    title: "Erste Schritte",
    fr: "Premiers pas",
    image: "images/topic-basics.svg",
    color: "#3a7ca5",
    intro: "Die wichtigsten Wörter, mit denen du sofort charmant und höflich ankommst.",
    lessons: [
      {
        id: "basics-1",
        title: "Hallo & Tschüss",
        tip: "Franzosen sagen beim Betreten eines Geschäfts, Cafés oder sogar eines Aufzugs immer „Bonjour“. Wer es vergisst, wirkt schnell unhöflich.",
        items: [
          { fr: "Bonjour", de: "Guten Tag / Hallo", pron: "bong-schur", emoji: "👋" },
          { fr: "Bonsoir", de: "Guten Abend", pron: "bong-ßwar", emoji: "🌙" },
          { fr: "Salut", de: "Hi / Tschüss (locker)", pron: "ßa-lü", emoji: "😊" },
          { fr: "Au revoir", de: "Auf Wiedersehen", pron: "o rö-wwar", emoji: "🌊" },
          { fr: "Merci", de: "Danke", pron: "mär-ßi", emoji: "💐" },
          { fr: "S'il vous plaît", de: "Bitte (bei einer Bitte)", pron: "ßil wu plä", emoji: "✨" }
        ],
        sentences: [
          { fr: "Bonjour, merci beaucoup !", de: "Hallo, vielen Dank!" },
          { fr: "Merci, au revoir !", de: "Danke, auf Wiedersehen!" }
        ]
      },
      {
        id: "basics-2",
        title: "Sich vorstellen",
        tip: "„Ça va ?“ ist die lockere Frage unter Freunden. Bei Fremden oder im Hotel klingt „Comment allez-vous ?“ eleganter.",
        items: [
          { fr: "Je m'appelle…", de: "Ich heiße…", pron: "schö ma-päll", emoji: "🙋‍♀️" },
          { fr: "Enchantée", de: "Freut mich (als Frau)", pron: "ang-schang-te", emoji: "🌸" },
          { fr: "Comment allez-vous ?", de: "Wie geht es Ihnen?", pron: "ko-mang ta-le wu", emoji: "💬" },
          { fr: "Ça va ?", de: "Wie geht's?", pron: "ßa wa", emoji: "☀️" },
          { fr: "Très bien", de: "Sehr gut", pron: "trä bjäng", emoji: "👍" },
          { fr: "Et vous ?", de: "Und Ihnen?", pron: "e wu", emoji: "🤝" }
        ],
        sentences: [
          { fr: "Bonjour, je m'appelle Claire.", de: "Hallo, ich heiße Claire." },
          { fr: "Très bien, et vous ?", de: "Sehr gut, und Ihnen?" }
        ]
      },
      {
        id: "basics-3",
        title: "Rettungssätze",
        tip: "Keine Scheu: Ein freundliches „Plus lentement, s'il vous plaît“ wird fast immer mit einem Lächeln belohnt.",
        items: [
          { fr: "Oui", de: "Ja", pron: "ui", emoji: "✅" },
          { fr: "Non", de: "Nein", pron: "nong", emoji: "✖️" },
          { fr: "Excusez-moi", de: "Entschuldigung", pron: "ex-kü-se mwa", emoji: "🙏" },
          { fr: "Je ne comprends pas", de: "Ich verstehe nicht", pron: "schö nö kom-prang pa", emoji: "🤔" },
          { fr: "Plus lentement", de: "Langsamer", pron: "plü lang-tö-mang", emoji: "🐢" },
          { fr: "Parlez-vous anglais ?", de: "Sprechen Sie Englisch?", pron: "par-le wu ang-glä", emoji: "🗣️" }
        ],
        sentences: [
          { fr: "Excusez-moi, je ne comprends pas.", de: "Entschuldigung, ich verstehe nicht." },
          { fr: "Plus lentement, s'il vous plaît.", de: "Langsamer, bitte." }
        ]
      }
    ]
  },
  {
    id: "cafe",
    title: "Café & Restaurant",
    fr: "Au café",
    image: "images/topic-cafe.svg",
    color: "#d9734e",
    intro: "Bestellen wie eine Pariserin: vom Café crème am Morgen bis zum Glas Wein am Abend.",
    lessons: [
      {
        id: "cafe-1",
        title: "Im Café",
        tip: "„Un café“ ist in Frankreich ein Espresso. Wer Milch möchte, bestellt „un café crème“ – oder morgens „un grand crème“.",
        items: [
          { fr: "Je voudrais…", de: "Ich hätte gern…", pron: "schö wu-drä", emoji: "💭" },
          { fr: "un café", de: "ein Kaffee (Espresso)", pron: "äng ka-fe", emoji: "☕" },
          { fr: "un café crème", de: "ein Milchkaffee", pron: "äng ka-fe kräm", emoji: "🥛" },
          { fr: "un croissant", de: "ein Croissant", pron: "äng krwa-ßang", emoji: "🥐" },
          { fr: "un thé", de: "ein Tee", pron: "äng te", emoji: "🍵" },
          { fr: "de l'eau", de: "Wasser", pron: "dö lo", emoji: "💧" }
        ],
        sentences: [
          { fr: "Je voudrais un café, s'il vous plaît.", de: "Ich hätte gern einen Kaffee, bitte." },
          { fr: "Un croissant et un thé.", de: "Ein Croissant und einen Tee." }
        ]
      },
      {
        id: "cafe-2",
        title: "Im Restaurant",
        tip: "Leitungswasser ist in Restaurants gratis – frag einfach nach „une carafe d'eau“.",
        items: [
          { fr: "une table pour deux", de: "ein Tisch für zwei", pron: "ün tabl pur dö", emoji: "🪑" },
          { fr: "la carte", de: "die Speisekarte", pron: "la kart", emoji: "📜" },
          { fr: "le plat du jour", de: "das Tagesgericht", pron: "lö pla dü schur", emoji: "🍽️" },
          { fr: "un verre de vin", de: "ein Glas Wein", pron: "äng wär dö wäng", emoji: "🍷" },
          { fr: "C'est délicieux !", de: "Das ist köstlich!", pron: "ßä de-li-ßjö", emoji: "😋" },
          { fr: "Bon appétit !", de: "Guten Appetit!", pron: "bon a-pe-ti", emoji: "🥂" }
        ],
        sentences: [
          { fr: "Une table pour deux, s'il vous plaît.", de: "Einen Tisch für zwei, bitte." },
          { fr: "Je voudrais un verre de vin.", de: "Ich hätte gern ein Glas Wein." }
        ]
      },
      {
        id: "cafe-3",
        title: "Bezahlen",
        tip: "Der Service ist in Frankreich im Preis enthalten. Ein kleines Trinkgeld von ein paar Euro ist nett, aber kein Muss.",
        items: [
          { fr: "L'addition", de: "Die Rechnung", pron: "la-di-ßjong", emoji: "🧾" },
          { fr: "par carte", de: "mit Karte", pron: "par kart", emoji: "💳" },
          { fr: "en espèces", de: "bar", pron: "ang nes-päß", emoji: "💶" },
          { fr: "le pourboire", de: "das Trinkgeld", pron: "lö pur-bwar", emoji: "🪙" },
          { fr: "Je peux payer ?", de: "Kann ich zahlen?", pron: "schö pö pä-je", emoji: "👛" },
          { fr: "Gardez la monnaie", de: "Stimmt so", pron: "gar-de la mo-nä", emoji: "😉" }
        ],
        sentences: [
          { fr: "L'addition, s'il vous plaît.", de: "Die Rechnung, bitte." },
          { fr: "Je peux payer par carte ?", de: "Kann ich mit Karte zahlen?" }
        ]
      }
    ]
  },
  {
    id: "travel",
    title: "Reisen & Urlaub",
    fr: "En voyage",
    image: "images/topic-travel.svg",
    color: "#1f4e79",
    intro: "Bahnhof, Strand, Hotel: So findest du dich an der Côte d'Azur und überall sonst zurecht.",
    lessons: [
      {
        id: "travel-1",
        title: "Unterwegs",
        tip: "Zugtickets in Frankreich musst du nicht mehr entwerten, wenn sie elektronisch sind – Papiertickets aber schon (am gelben „composteur“).",
        items: [
          { fr: "la gare", de: "der Bahnhof", pron: "la gar", emoji: "🚉" },
          { fr: "le train", de: "der Zug", pron: "lö träng", emoji: "🚆" },
          { fr: "un billet", de: "eine Fahrkarte", pron: "äng bi-jä", emoji: "🎫" },
          { fr: "l'aéroport", de: "der Flughafen", pron: "la-e-ro-por", emoji: "✈️" },
          { fr: "Où est… ?", de: "Wo ist…?", pron: "u ä", emoji: "📍" },
          { fr: "aller-retour", de: "hin und zurück", pron: "a-le rö-tur", emoji: "🔁" }
        ],
        sentences: [
          { fr: "Où est la gare ?", de: "Wo ist der Bahnhof?" },
          { fr: "Un billet aller-retour, s'il vous plaît.", de: "Eine Fahrkarte hin und zurück, bitte." }
        ]
      },
      {
        id: "travel-2",
        title: "Den Weg finden",
        tip: "Achtung Verwechslungsgefahr: „tout droit“ heißt geradeaus, „à droite“ heißt rechts.",
        items: [
          { fr: "à gauche", de: "links", pron: "a gosch", emoji: "⬅️" },
          { fr: "à droite", de: "rechts", pron: "a drwat", emoji: "➡️" },
          { fr: "tout droit", de: "geradeaus", pron: "tu drwa", emoji: "⬆️" },
          { fr: "près d'ici", de: "in der Nähe", pron: "prä di-ßi", emoji: "📌" },
          { fr: "loin", de: "weit weg", pron: "lwäng", emoji: "🗺️" },
          { fr: "la plage", de: "der Strand", pron: "la plasch", emoji: "🏖️" }
        ],
        sentences: [
          { fr: "La plage est tout droit.", de: "Der Strand ist geradeaus." },
          { fr: "La gare est loin ?", de: "Ist der Bahnhof weit weg?" }
        ]
      },
      {
        id: "travel-3",
        title: "Im Hotel",
        tip: "Das Frühstück ist in französischen Hotels oft nicht inklusive. Frag beim Check-in: „Le petit-déjeuner est compris ?“",
        items: [
          { fr: "J'ai une réservation", de: "Ich habe eine Reservierung", pron: "sche ün re-ser-wa-ßjong", emoji: "📋" },
          { fr: "une chambre", de: "ein Zimmer", pron: "ün schambr", emoji: "🛏️" },
          { fr: "la clé", de: "der Schlüssel", pron: "la kle", emoji: "🔑" },
          { fr: "le petit-déjeuner", de: "das Frühstück", pron: "lö pö-ti de-schö-ne", emoji: "🍳" },
          { fr: "le wifi", de: "das WLAN", pron: "lö wi-fi", emoji: "📶" },
          { fr: "À quelle heure ?", de: "Um wie viel Uhr?", pron: "a käl ör", emoji: "🕘" }
        ],
        sentences: [
          { fr: "Bonjour, j'ai une réservation.", de: "Guten Tag, ich habe eine Reservierung." },
          { fr: "Le petit-déjeuner est à quelle heure ?", de: "Um wie viel Uhr ist das Frühstück?" }
        ]
      }
    ]
  },
  {
    id: "shopping",
    title: "Einkaufen & Mode",
    fr: "Le shopping",
    image: "images/topic-shopping.svg",
    color: "#b5838d",
    intro: "Boutiquen, Märkte und Apotheken – shoppen, anprobieren und Preise verstehen.",
    lessons: [
      {
        id: "shopping-1",
        title: "In der Boutique",
        tip: "Die Soldes (Schlussverkauf) finden in Frankreich zweimal im Jahr zu festen Terminen statt: im Januar und im Sommer.",
        items: [
          { fr: "la robe", de: "das Kleid", pron: "la rob", emoji: "👗" },
          { fr: "les chaussures", de: "die Schuhe", pron: "le scho-ßür", emoji: "👠" },
          { fr: "le sac", de: "die Tasche", pron: "lö ßak", emoji: "👜" },
          { fr: "la taille", de: "die Größe", pron: "la taj", emoji: "📏" },
          { fr: "Je regarde seulement", de: "Ich schaue nur", pron: "schö rö-gard ßöl-mang", emoji: "👀" },
          { fr: "Je peux essayer ?", de: "Kann ich anprobieren?", pron: "schö pö e-ße-je", emoji: "🪞" }
        ],
        sentences: [
          { fr: "Je regarde seulement, merci.", de: "Ich schaue nur, danke." },
          { fr: "Je peux essayer la robe ?", de: "Kann ich das Kleid anprobieren?" }
        ]
      },
      {
        id: "shopping-2",
        title: "Preise & Farben",
        tip: "Farben stehen im Französischen meist hinter dem Wort: „le sac rouge“ – die rote Tasche.",
        items: [
          { fr: "Combien ça coûte ?", de: "Was kostet das?", pron: "kom-bjäng ßa kut", emoji: "🏷️" },
          { fr: "C'est trop cher", de: "Das ist zu teuer", pron: "ßä tro schär", emoji: "💸" },
          { fr: "en solde", de: "reduziert", pron: "ang ßold", emoji: "🔖" },
          { fr: "rouge", de: "rot", pron: "rusch", emoji: "❤️" },
          { fr: "bleu", de: "blau", pron: "blö", emoji: "💙" },
          { fr: "blanc", de: "weiß", pron: "blang", emoji: "🤍" }
        ],
        sentences: [
          { fr: "Le sac rouge est en solde.", de: "Die rote Tasche ist reduziert." },
          { fr: "C'est trop cher, merci.", de: "Das ist zu teuer, danke." }
        ]
      },
      {
        id: "shopping-3",
        title: "Markt & Apotheke",
        tip: "Auf französischen Märkten darf man oft probieren. Ein Lächeln und „Je peux goûter ?“ (Darf ich probieren?) öffnen Türen.",
        items: [
          { fr: "le marché", de: "der Markt", pron: "lö mar-sche", emoji: "🧺" },
          { fr: "des fraises", de: "Erdbeeren", pron: "de fräs", emoji: "🍓" },
          { fr: "un kilo de…", de: "ein Kilo…", pron: "äng ki-lo dö", emoji: "⚖️" },
          { fr: "la pharmacie", de: "die Apotheke", pron: "la far-ma-ßi", emoji: "💊" },
          { fr: "la crème solaire", de: "die Sonnencreme", pron: "la kräm ßo-lär", emoji: "🧴" },
          { fr: "C'est tout", de: "Das ist alles", pron: "ßä tu", emoji: "🌿" }
        ],
        sentences: [
          { fr: "Un kilo de fraises, s'il vous plaît.", de: "Ein Kilo Erdbeeren, bitte." },
          { fr: "Où est la pharmacie ?", de: "Wo ist die Apotheke?" }
        ]
      }
    ]
  }
];

window.PHRASES_OF_THE_DAY = [
  { fr: "La vie est belle.", de: "Das Leben ist schön." },
  { fr: "Petit à petit, l'oiseau fait son nid.", de: "Stück für Stück baut der Vogel sein Nest. (Gut Ding will Weile haben.)" },
  { fr: "C'est la vie !", de: "So ist das Leben!" },
  { fr: "Je suis en vacances.", de: "Ich bin im Urlaub." },
  { fr: "Quelle belle journée !", de: "Was für ein schöner Tag!" },
  { fr: "Un café en terrasse ?", de: "Einen Kaffee auf der Terrasse?" },
  { fr: "J'adore la mer.", de: "Ich liebe das Meer." },
  { fr: "Il fait beau aujourd'hui.", de: "Heute ist schönes Wetter." },
  { fr: "Profite bien !", de: "Genieß es!" },
  { fr: "À bientôt !", de: "Bis bald!" },
  { fr: "Je me sens bien ici.", de: "Ich fühle mich hier wohl." },
  { fr: "Pas de souci !", de: "Kein Problem!" },
  { fr: "Bonne journée !", de: "Einen schönen Tag!" },
  { fr: "Chaque jour un peu plus.", de: "Jeden Tag ein bisschen mehr." }
];

window.LEVELS = [
  { xp: 0, name: "Débutante", de: "Einsteigerin" },
  { xp: 80, name: "Curieuse", de: "Neugierige" },
  { xp: 200, name: "Aventurière", de: "Abenteurerin" },
  { xp: 380, name: "Voyageuse", de: "Reisende" },
  { xp: 600, name: "Élégante", de: "Elegante" },
  { xp: 900, name: "Parisienne", de: "Pariserin" }
];

window.BADGES = [
  { id: "first", icon: "🌱", title: "Premier pas", desc: "Erste Lektion abgeschlossen" },
  { id: "perfect", icon: "💎", title: "Parfait", desc: "Eine Lektion ohne Fehler" },
  { id: "streak3", icon: "🔥", title: "3 jours", desc: "3 Tage in Folge gelernt" },
  { id: "streak7", icon: "🌟", title: "Une semaine", desc: "7 Tage in Folge gelernt" },
  { id: "words25", icon: "📚", title: "25 mots", desc: "25 Wörter gelernt" },
  { id: "words50", icon: "🎓", title: "50 mots", desc: "50 Wörter gelernt" },
  { id: "topic", icon: "🏅", title: "Thème complet", desc: "Ein ganzes Thema abgeschlossen" },
  { id: "review", icon: "🔁", title: "Révision", desc: "3 Wiederholungen gemacht" },
  { id: "all", icon: "👑", title: "Reine de la Riviera", desc: "Alle Lektionen abgeschlossen" }
];
