import { useState, useEffect, useRef } from "react";
import {
  Sun, Cloud, CloudRain, CloudSnow, Waves, Mountain, Trees,
  MapPin, Navigation, Sparkles, ChevronDown, ChevronUp,
  Search, Thermometer, Droplets, Clock, ArrowRight, Globe
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// 🌍 SYSTÈME I18N — 12 LANGUES + SLOGANS CULTURELS SUR-MESURE
// ═══════════════════════════════════════════════════════════════
const LANGUAGES = {
  fr: {
    flag: "🇫🇷", name: "Français",
    // Slogan inspiré de la liberté, du terroir et de l'art de vivre français
    slogan: "La vie est trop belle pour rester sous la pluie.",
    tagline: "Trouvez le beau temps près de chez vous",
    hero_title: "Il pleut chez vous ?",
    hero_sub: "Le soleil est peut-être à quelques minutes d'ici.",
    hero_desc: "Aéria analyse la météo autour de vous en temps réel et vous guide vers le beau temps le plus proche.",
    search_placeholder: "Entrez votre ville ou adresse…",
    search_btn: "Chercher",
    gps_btn: "Utiliser ma position GPS",
    radius_label: "Rayon de recherche",
    radius_unit: "km",
    radius_hint: "≈ {min} min en voiture",
    loading_steps: ["📡 Relevé météo au départ…","🌍 Sondage des alentours…","📍 Identification des spots…","✨ Calcul des meilleures options…"],
    origin_label: "Météo actuelle à votre départ",
    results_title: "Les meilleures destinations",
    score_label: "sur 100",
    more_info: "Plus d'infos & itinéraire",
    less_info: "Moins d'infos",
    maps_btn: "Obtenir l'itinéraire Google Maps",
    temp_max: "Température max",
    wind_label: "Vent",
    sun_label: "Ensoleillement",
    rain_label: "Précipitations",
    better_than: "pts vs départ",
    terrain: { coast: "Plage & baignade", hiking: "Rando & nature", food: "Terrasse & gastronomie", culture: "Ville & culture", view: "Vue & panorama", family: "Famille & loisirs", mountain: "Rando & nature", countryside: "Famille & loisirs" },
    terrain_tag: { coast: "Mer, lac, baignade", hiking: "Forêts, sentiers, parcs", food: "Restos, bars, cafés", culture: "Vieille ville, musées", view: "Points de vue, photos", family: "Parcs, plans d'eau, enfants", mountain: "Forêts, sentiers, parcs", countryside: "Parcs, plans d'eau, enfants" },
    score_words: ["Déconseillé","Passable","Très bien","Excellent"],
    partner_label: "PARTENAIRE",
    partners: [
      { text: "🏨 Hôtels & hébergements — Réservez au soleil", cta: "Voir les offres", color: "#1E3A5F" },
      { text: "🚗 Location de voiture — À partir de 29€/jour", cta: "Comparer", color: "#14532D" },
      { text: "🍽️ Restaurants près de chez vous", cta: "Découvrir", color: "#7C2D12" },
    ],
    how_title: "Comment ça marche ?",
    how_desc: "Entrez votre ville ou activez le GPS, choisissez le rayon, et découvrez où le soleil vous attend !",
    steps: [
      { e:"📍", t:"Indiquez votre départ", d:"Tapez votre ville ou appuyez sur GPS — en une seconde, Aéria sait d'où vous partez." },
      { e:"🎚️", t:"Choisissez votre rayon", d:"10, 30 ou 80 km — vous choisissez jusqu'où vous êtes prêt à rouler." },
      { e:"🎯", t:"Découvrez vos destinations", d:"Les 5 meilleurs spots classés par qualité du ciel, avec l'itinéraire direct." },
    ],
    cta_final: "Prêt à partir vers le soleil ?",
    error_msg: "Impossible de récupérer les données. Vérifiez votre connexion.",
    city_not_found: "Ville introuvable. Essayez autrement.",
  },

  en: {
    flag: "🇬🇧", name: "English",
    // Inspired by British pragmatism + understated wit
    slogan: "Because life's too short to spend indoors when sunshine is just around the corner.",
    tagline: "Find sunny weather near you",
    hero_title: "Raining outside?",
    hero_sub: "Blue skies might be just minutes away.",
    hero_desc: "Aéria scans the weather around you in real time and navigates you straight to the nearest sunshine.",
    search_placeholder: "Enter your city or address…",
    search_btn: "Search",
    gps_btn: "Use my GPS location",
    radius_label: "Search radius",
    radius_unit: "km",
    radius_hint: "≈ {min} min drive",
    loading_steps: ["📡 Reading local weather…","🌍 Scanning the surroundings…","📍 Identifying sunny spots…","✨ Ranking your best options…"],
    origin_label: "Current weather at your location",
    results_title: "Today's best destinations",
    score_label: "out of 100",
    more_info: "More details & directions",
    less_info: "Less details",
    maps_btn: "Get directions on Google Maps",
    temp_max: "Max temperature",
    wind_label: "Wind",
    sun_label: "Sunshine",
    rain_label: "Rainfall",
    better_than: "pts vs origin",
    terrain: { coast: "Beach & swim", hiking: "Hiking & nature", food: "Dining & terraces", culture: "City & culture", view: "Views & panorama", family: "Family & leisure", mountain: "Hiking & nature", countryside: "Family & leisure" },
    terrain_tag: { coast: "Sea, lake, swimming", hiking: "Forests, trails, parks", food: "Restaurants, bars, cafés", culture: "Old town, museums", view: "Viewpoints, photos", family: "Parks, lakes, kids", mountain: "Forests, trails, parks", countryside: "Parks, lakes, kids" },
    score_words: ["Avoid","Acceptable","Very good","Excellent"],
    partner_label: "PARTNER",
    partners: [
      { text: "🏨 Hotels & B&Bs — Book your sunny getaway", cta: "Browse deals", color: "#1E3A5F" },
      { text: "🚗 Car rental — From £25/day", cta: "Compare", color: "#14532D" },
      { text: "🍽️ Local restaurants near your destination", cta: "Discover", color: "#7C2D12" },
    ],
    how_title: "How does it work?",
    how_desc: "Enter your city or use GPS, choose your range, and discover where the sun is waiting for you!",
    steps: [
      { e:"📍", t:"Tell us where you are", d:"Type your city or tap GPS — Aéria knows your starting point in seconds." },
      { e:"🎚️", t:"Choose your range", d:"10, 30 or 80 km — how far are you willing to drive for sunshine?" },
      { e:"🎯", t:"Discover your destinations", d:"Top 5 spots ranked by weather quality, with direct directions." },
    ],
    cta_final: "Ready to chase the sun?",
    error_msg: "Unable to fetch weather data. Please check your connection.",
    city_not_found: "City not found. Please try again.",
  },

  de: {
    flag: "🇩🇪", name: "Deutsch",
    // Inspiriert von Ordnung, Natur und der deutschen Wanderkultur
    slogan: "Schlechtes Wetter gibt es nicht — nur den falschen Ort.",
    tagline: "Finden Sie gutes Wetter in Ihrer Nähe",
    hero_title: "Regnet es bei Ihnen?",
    hero_sub: "Die Sonne scheint vielleicht nur wenige Minuten entfernt.",
    hero_desc: "Aéria analysiert das Wetter um Sie herum in Echtzeit und führt Sie direkt zum nächsten Sonnenschein.",
    search_placeholder: "Stadt oder Adresse eingeben…",
    search_btn: "Suchen",
    gps_btn: "Meinen GPS-Standort verwenden",
    radius_label: "Suchradius",
    radius_unit: "km",
    radius_hint: "≈ {min} Min. Fahrt",
    loading_steps: ["📡 Wetterdaten werden abgerufen…","🌍 Umgebung wird gescannt…","📍 Sonnige Orte werden identifiziert…","✨ Beste Optionen werden berechnet…"],
    origin_label: "Aktuelles Wetter an Ihrem Standort",
    results_title: "Die besten Ziele heute",
    score_label: "von 100",
    more_info: "Mehr Details & Route",
    less_info: "Weniger Details",
    maps_btn: "Route auf Google Maps öffnen",
    temp_max: "Höchsttemperatur",
    wind_label: "Wind",
    sun_label: "Sonnenschein",
    rain_label: "Niederschlag",
    better_than: "Pkt. besser als Abfahrt",
    terrain: { coast: "Strand & Baden", hiking: "Wandern & Natur", food: "Essen & Terrassen", culture: "Stadt & Kultur", view: "Aussicht & Panorama", family: "Familie & Freizeit", mountain: "Wandern & Natur", countryside: "Familie & Freizeit" },
    terrain_tag: { coast: "Meer, See, Schwimmen", hiking: "Wälder, Pfade, Parks", food: "Restaurants, Bars, Cafés", culture: "Altstadt, Museen", view: "Aussichtspunkte, Fotos", family: "Parks, Seen, Kinder", mountain: "Wälder, Pfade, Parks", countryside: "Parks, Seen, Kinder" },
    score_words: ["Nicht empfohlen","Akzeptabel","Sehr gut","Ausgezeichnet"],
    partner_label: "PARTNER",
    partners: [
      { text: "🏨 Hotels & Ferienwohnungen — Buchen Sie in der Sonne", cta: "Angebote ansehen", color: "#1E3A5F" },
      { text: "🚗 Mietwagen — Ab 29€/Tag", cta: "Vergleichen", color: "#14532D" },
      { text: "🍽️ Lokale Restaurants in Ihrer Nähe", cta: "Entdecken", color: "#7C2D12" },
    ],
    how_title: "Wie funktioniert das?",
    how_desc: "Geben Sie Ihre Stadt ein oder nutzen Sie GPS, wählen Sie den Radius und entdecken Sie, wo die Sonne wartet!",
    steps: [
      { e:"📍", t:"Sagen Sie uns Ihren Standort", d:"Stadt eingeben oder GPS drücken — Aéria kennt Ihren Ausgangspunkt sofort." },
      { e:"🎚️", t:"Radius wählen", d:"10, 30 oder 80 km — wie weit möchten Sie für Sonnenschein fahren?" },
      { e:"🎯", t:"Ziele entdecken", d:"Top 5 Orte nach Wetterqualität, mit direkter Routenführung." },
    ],
    cta_final: "Bereit, der Sonne zu folgen?",
    error_msg: "Wetterdaten konnten nicht geladen werden. Bitte Verbindung prüfen.",
    city_not_found: "Stadt nicht gefunden. Bitte erneut versuchen.",
  },

  es: {
    flag: "🇪🇸", name: "Español",
    // Inspirado en la pasión, el calor y el espíritu aventurero hispano
    slogan: "El sol no desaparece. Solo cambia de dirección. Síguelo.",
    tagline: "Encuentra buen tiempo cerca de ti",
    hero_title: "¿Llueve en tu ciudad?",
    hero_sub: "El sol puede estar a solo unos minutos de distancia.",
    hero_desc: "Aéria analiza el tiempo a tu alrededor en tiempo real y te guía hacia el sol más cercano.",
    search_placeholder: "Introduce tu ciudad o dirección…",
    search_btn: "Buscar",
    gps_btn: "Usar mi ubicación GPS",
    radius_label: "Radio de búsqueda",
    radius_unit: "km",
    radius_hint: "≈ {min} min en coche",
    loading_steps: ["📡 Leyendo el tiempo local…","🌍 Escaneando los alrededores…","📍 Identificando los mejores spots…","✨ Calculando las mejores opciones…"],
    origin_label: "Tiempo actual en tu ubicación",
    results_title: "Los mejores destinos de hoy",
    score_label: "sobre 100",
    more_info: "Más detalles & ruta",
    less_info: "Menos detalles",
    maps_btn: "Cómo llegar en Google Maps",
    temp_max: "Temperatura máxima",
    wind_label: "Viento",
    sun_label: "Horas de sol",
    rain_label: "Precipitaciones",
    better_than: "pts vs origen",
    terrain: { coast: "Playa & baño", hiking: "Senderismo & naturaleza", food: "Comer & terrazas", culture: "Ciudad & cultura", view: "Vistas & panorama", family: "Familia & ocio", mountain: "Senderismo & naturaleza", countryside: "Familia & ocio" },
    terrain_tag: { coast: "Mar, lago, baño", hiking: "Bosques, senderos, parques", food: "Restaurantes, bares, cafés", culture: "Casco antiguo, museos", view: "Miradores, fotos", family: "Parques, lagos, niños", mountain: "Bosques, senderos, parques", countryside: "Parques, lagos, niños" },
    score_words: ["Desaconsejado","Aceptable","Muy bueno","Excelente"],
    partner_label: "SOCIO",
    partners: [
      { text: "🏨 Hoteles & casas rurales — Reserva bajo el sol", cta: "Ver ofertas", color: "#1E3A5F" },
      { text: "🚗 Alquiler de coches — Desde 25€/día", cta: "Comparar", color: "#14532D" },
      { text: "🍽️ Restaurantes locales cerca de tu destino", cta: "Descubrir", color: "#7C2D12" },
    ],
    how_title: "¿Cómo funciona?",
    how_desc: "Introduce tu ciudad o usa el GPS, elige el radio y descubre dónde te espera el sol.",
    steps: [
      { e:"📍", t:"Dinos dónde estás", d:"Escribe tu ciudad o pulsa GPS — Aéria sabe tu punto de partida en segundos." },
      { e:"🎚️", t:"Elige tu radio", d:"10, 30 o 80 km — ¿cuánto estás dispuesto a conducir por el sol?" },
      { e:"🎯", t:"Descubre tus destinos", d:"Top 5 lugares por calidad del cielo, con ruta directa." },
    ],
    cta_final: "¿Listo para perseguir el sol?",
    error_msg: "No se pudieron obtener los datos. Comprueba tu conexión.",
    city_not_found: "Ciudad no encontrada. Inténtalo de nuevo.",
  },

  pt: {
    flag: "🇧🇷", name: "Português",
    // Inspirado na alegria de viver brasileira e na saudade do sol
    slogan: "O sol nunca some. Ele só te espera um pouco mais longe.",
    tagline: "Encontre bom tempo perto de você",
    hero_title: "Está chovendo aí?",
    hero_sub: "O sol pode estar a apenas alguns minutos de você.",
    hero_desc: "Aéria analisa o tempo ao seu redor em tempo real e te leva direto para o sol mais próximo.",
    search_placeholder: "Digite sua cidade ou endereço…",
    search_btn: "Buscar",
    gps_btn: "Usar minha localização GPS",
    radius_label: "Raio de busca",
    radius_unit: "km",
    radius_hint: "≈ {min} min de carro",
    loading_steps: ["📡 Lendo o tempo local…","🌍 Escaneando os arredores…","📍 Identificando os melhores spots…","✨ Calculando as melhores opções…"],
    origin_label: "Tempo atual na sua localização",
    results_title: "Os melhores destinos de hoje",
    score_label: "de 100",
    more_info: "Mais detalhes & rota",
    less_info: "Menos detalhes",
    maps_btn: "Como chegar no Google Maps",
    temp_max: "Temperatura máxima",
    wind_label: "Vento",
    sun_label: "Horas de sol",
    rain_label: "Precipitação",
    better_than: "pts vs origem",
    terrain: { coast: "Praia & banho", hiking: "Trilha & natureza", food: "Comer & terraços", culture: "Cidade & cultura", view: "Vistas & panorama", family: "Família & lazer", mountain: "Trilha & natureza", countryside: "Família & lazer" },
    terrain_tag: { coast: "Mar, lago, banho", hiking: "Florestas, trilhas, parques", food: "Restaurantes, bares, cafés", culture: "Centro histórico, museus", view: "Miradouros, fotos", family: "Parques, lagos, crianças", mountain: "Florestas, trilhas, parques", countryside: "Parques, lagos, crianças" },
    score_words: ["Evitar","Aceitável","Muito bom","Excelente"],
    partner_label: "PARCEIRO",
    partners: [
      { text: "🏨 Pousadas & hotéis — Reserve com sol garantido", cta: "Ver ofertas", color: "#1E3A5F" },
      { text: "🚗 Aluguel de carro — A partir de R$120/dia", cta: "Comparar", color: "#14532D" },
      { text: "🍽️ Restaurantes locais perto do seu destino", cta: "Descobrir", color: "#7C2D12" },
    ],
    how_title: "Como funciona?",
    how_desc: "Digite sua cidade ou use o GPS, escolha o raio e descubra onde o sol está te esperando!",
    steps: [
      { e:"📍", t:"Diga onde você está", d:"Digite sua cidade ou aperte GPS — Aéria sabe seu ponto de partida em segundos." },
      { e:"🎚️", t:"Escolha seu raio", d:"10, 30 ou 80 km — até onde você topa ir pelo sol?" },
      { e:"🎯", t:"Descubra seus destinos", d:"Top 5 lugares por qualidade do tempo, com rota direta." },
    ],
    cta_final: "Pronto para correr atrás do sol?",
    error_msg: "Não foi possível obter os dados. Verifique sua conexão.",
    city_not_found: "Cidade não encontrada. Tente novamente.",
  },

  it: {
    flag: "🇮🇹", name: "Italiano",
    // Ispirato alla dolce vita, al sole mediterraneo e all'amore per il bello
    slogan: "La dolce vita non aspetta la pioggia. Il sole è già lì fuori.",
    tagline: "Trova il bel tempo vicino a te",
    hero_title: "Piove da te?",
    hero_sub: "Il sole potrebbe essere a pochi minuti di distanza.",
    hero_desc: "Aéria analizza il meteo intorno a te in tempo reale e ti guida verso il sole più vicino.",
    search_placeholder: "Inserisci la tua città o indirizzo…",
    search_btn: "Cerca",
    gps_btn: "Usa la mia posizione GPS",
    radius_label: "Raggio di ricerca",
    radius_unit: "km",
    radius_hint: "≈ {min} min in auto",
    loading_steps: ["📡 Lettura del meteo locale…","🌍 Scansione dei dintorni…","📍 Identificazione dei migliori spot…","✨ Calcolo delle migliori opzioni…"],
    origin_label: "Meteo attuale alla tua partenza",
    results_title: "Le migliori destinazioni di oggi",
    score_label: "su 100",
    more_info: "Più dettagli & percorso",
    less_info: "Meno dettagli",
    maps_btn: "Apri il percorso su Google Maps",
    temp_max: "Temperatura massima",
    wind_label: "Vento",
    sun_label: "Ore di sole",
    rain_label: "Precipitazioni",
    better_than: "pts vs partenza",
    terrain: { coast: "Spiaggia & nuoto", hiking: "Escursioni & natura", food: "Mangiare & terrazze", culture: "Città & cultura", view: "Vista & panorama", family: "Famiglia & svago", mountain: "Escursioni & natura", countryside: "Famiglia & svago" },
    terrain_tag: { coast: "Mare, lago, nuoto", hiking: "Boschi, sentieri, parchi", food: "Ristoranti, bar, caffè", culture: "Centro storico, musei", view: "Punti panoramici, foto", family: "Parchi, laghi, bambini", mountain: "Boschi, sentieri, parchi", countryside: "Parchi, laghi, bambini" },
    score_words: ["Da evitare","Accettabile","Molto buono","Eccellente"],
    partner_label: "PARTNER",
    partners: [
      { text: "🏨 Hotel & agriturismi — Prenota al sole", cta: "Vedi offerte", color: "#1E3A5F" },
      { text: "🚗 Noleggio auto — Da 29€/giorno", cta: "Confronta", color: "#14532D" },
      { text: "🍽️ Ristoranti locali vicino a te", cta: "Scopri", color: "#7C2D12" },
    ],
    how_title: "Come funziona?",
    how_desc: "Inserisci la tua città o usa il GPS, scegli il raggio e scopri dove ti aspetta il sole!",
    steps: [
      { e:"📍", t:"Dicci da dove parti", d:"Scrivi la tua città o premi GPS — Aéria conosce il tuo punto di partenza in secondi." },
      { e:"🎚️", t:"Scegli il tuo raggio", d:"10, 30 o 80 km — fin dove sei disposto a guidare per il sole?" },
      { e:"🎯", t:"Scopri le tue destinazioni", d:"Top 5 posti per qualità del cielo, con percorso diretto." },
    ],
    cta_final: "Pronto a inseguire il sole?",
    error_msg: "Impossibile ottenere i dati. Controlla la connessione.",
    city_not_found: "Città non trovata. Riprova.",
  },

  nl: {
    flag: "🇳🇱", name: "Nederlands",
    // Geïnspireerd door nuchterheid, poldergeest en de Nederlandse liefde voor fietsen buiten
    slogan: "Regen? Prima. Maar twintig minuten rijden en het is droog.",
    tagline: "Vind mooi weer bij jou in de buurt",
    hero_title: "Regent het bij jou?",
    hero_sub: "De zon schijnt misschien al na enkele minuten rijden.",
    hero_desc: "Aéria scant het weer om je heen in realtime en navigeert je naar het dichtstbijzijnde zonnige plekje.",
    search_placeholder: "Voer je stad of adres in…",
    search_btn: "Zoeken",
    gps_btn: "Gebruik mijn GPS-locatie",
    radius_label: "Zoekradius",
    radius_unit: "km",
    radius_hint: "≈ {min} min rijden",
    loading_steps: ["📡 Lokaal weer ophalen…","🌍 Omgeving scannen…","📍 Zonnige plekken identificeren…","✨ Beste opties berekenen…"],
    origin_label: "Huidig weer op jouw locatie",
    results_title: "De beste bestemmingen van vandaag",
    score_label: "van 100",
    more_info: "Meer details & route",
    less_info: "Minder details",
    maps_btn: "Route openen in Google Maps",
    temp_max: "Maximale temperatuur",
    wind_label: "Wind",
    sun_label: "Zonneschijn",
    rain_label: "Neerslag",
    better_than: "pts vs vertrekpunt",
    terrain: { coast: "Strand & zwemmen", hiking: "Wandelen & natuur", food: "Eten & terrassen", culture: "Stad & cultuur", view: "Uitzicht & panorama", family: "Familie & vrije tijd", mountain: "Wandelen & natuur", countryside: "Familie & vrije tijd" },
    terrain_tag: { coast: "Zee, meer, zwemmen", hiking: "Bossen, paden, parken", food: "Restaurants, bars, cafés", culture: "Oude stad, musea", view: "Uitzichtpunten, foto's", family: "Parken, meren, kinderen", mountain: "Bossen, paden, parken", countryside: "Parken, meren, kinderen" },
    score_words: ["Niet aan te raden","Acceptabel","Zeer goed","Uitstekend"],
    partner_label: "PARTNER",
    partners: [
      { text: "🏨 Hotels & vakantiehuizen — Boek in de zon", cta: "Bekijk aanbiedingen", color: "#1E3A5F" },
      { text: "🚗 Auto huren — Vanaf €29/dag", cta: "Vergelijken", color: "#14532D" },
      { text: "🍽️ Lokale restaurants bij jou in de buurt", cta: "Ontdekken", color: "#7C2D12" },
    ],
    how_title: "Hoe werkt het?",
    how_desc: "Voer je stad in of gebruik GPS, kies je radius en ontdek waar de zon op je wacht!",
    steps: [
      { e:"📍", t:"Vertel ons waar je bent", d:"Typ je stad of druk op GPS — Aéria kent je vertrekpunt in seconden." },
      { e:"🎚️", t:"Kies je radius", d:"10, 30 of 80 km — hoe ver wil jij rijden voor zonneschijn?" },
      { e:"🎯", t:"Ontdek je bestemmingen", d:"Top 5 plekken op weerkwaliteit, met directe routebeschrijving." },
    ],
    cta_final: "Klaar om de zon te achtervolgen?",
    error_msg: "Kan geen weerdata ophalen. Controleer je verbinding.",
    city_not_found: "Stad niet gevonden. Probeer opnieuw.",
  },

  ja: {
    flag: "🇯🇵", name: "日本語",
    // 日本の「晴耕雨読」精神と外出文化にインスパイアされたスローガン
    slogan: "雨の日でも、20分先には青空がある。",
    tagline: "近くの晴れ間を見つけよう",
    hero_title: "今、雨が降っていますか？",
    hero_sub: "もしかしたら、数分先には晴れているかもしれません。",
    hero_desc: "Aériaはリアルタイムで周辺の天気を分析し、最寄りの晴れスポットへ案内します。",
    search_placeholder: "都市または住所を入力…",
    search_btn: "検索",
    gps_btn: "現在地を使用する",
    radius_label: "検索範囲",
    radius_unit: "km",
    radius_hint: "車で約{min}分",
    loading_steps: ["📡 現地の天気を取得中…","🌍 周辺をスキャン中…","📍 晴れスポットを特定中…","✨ 最良の選択肢を計算中…"],
    origin_label: "出発地点の現在の天気",
    results_title: "今日のおすすめ目的地",
    score_label: "点（100点満点）",
    more_info: "詳細とルートを見る",
    less_info: "閉じる",
    maps_btn: "Google Mapsでルートを開く",
    temp_max: "最高気温",
    wind_label: "風速",
    sun_label: "日照時間",
    rain_label: "降水量",
    better_than: "pt 出発地より良い",
    terrain: { coast: "ビーチ＆海水浴", hiking: "ハイキング＆自然", food: "グルメ＆テラス", culture: "街＆文化", view: "絶景＆展望", family: "ファミリー＆レジャー", mountain: "ハイキング＆自然", countryside: "ファミリー＆レジャー" },
    terrain_tag: { coast: "海、湖、海水浴", hiking: "森、トレイル、公園", food: "レストラン、バー、カフェ", culture: "旧市街、美術館", view: "展望スポット、写真", family: "公園、湖、子供", mountain: "森、トレイル、公園", countryside: "公園、湖、子供" },
    score_words: ["おすすめしません","まあまあ","とても良い","最高"],
    partner_label: "パートナー",
    partners: [
      { text: "🏨 ホテル＆旅館 — 晴れの日を予約しよう", cta: "プランを見る", color: "#1E3A5F" },
      { text: "🚗 レンタカー — 1日3,000円から", cta: "比較する", color: "#14532D" },
      { text: "🍽️ 目的地近くの地元レストラン", cta: "探す", color: "#7C2D12" },
    ],
    how_title: "使い方は？",
    how_desc: "都市を入力するかGPSを使い、範囲を選んで、太陽が待つ場所を発見しましょう！",
    steps: [
      { e:"📍", t:"出発地を教えてください", d:"都市を入力するかGPSを押すと、Aériaが出発地を認識します。" },
      { e:"🎚️", t:"範囲を選んでください", d:"10・30・80km — どこまで走りますか？" },
      { e:"🎯", t:"目的地を発見しよう", d:"天気スコアでランク付けされたトップ5スポットと直接ルートを表示。" },
    ],
    cta_final: "太陽を追いかける準備はできていますか？",
    error_msg: "データを取得できません。接続を確認してください。",
    city_not_found: "都市が見つかりません。もう一度お試しください。",
  },

  ko: {
    flag: "🇰🇷", name: "한국어",
    // 한국인의 야외 활동 사랑과 '나들이' 문화에서 영감을 받은 슬로건
    slogan: "비 오는 날도, 20분이면 맑은 하늘 아래에 있을 수 있어요.",
    tagline: "가까운 맑은 날씨를 찾아보세요",
    hero_title: "지금 비가 오나요?",
    hero_sub: "몇 분 거리에 햇빛이 있을지도 모릅니다.",
    hero_desc: "Aéria는 실시간으로 주변 날씨를 분석하여 가장 가까운 맑은 장소로 안내합니다.",
    search_placeholder: "도시 또는 주소를 입력하세요…",
    search_btn: "검색",
    gps_btn: "현재 위치 사용",
    radius_label: "검색 반경",
    radius_unit: "km",
    radius_hint: "차로 약 {min}분",
    loading_steps: ["📡 현지 날씨 불러오는 중…","🌍 주변 스캔 중…","📍 맑은 장소 찾는 중…","✨ 최적의 옵션 계산 중…"],
    origin_label: "현재 위치의 날씨",
    results_title: "오늘의 추천 목적지",
    score_label: "점 (100점 만점)",
    more_info: "자세히 보기 & 경로",
    less_info: "닫기",
    maps_btn: "Google Maps에서 경로 열기",
    temp_max: "최고 기온",
    wind_label: "바람",
    sun_label: "일조 시간",
    rain_label: "강수량",
    better_than: "pt 출발지보다 좋음",
    terrain: { coast: "해변 & 수영", hiking: "하이킹 & 자연", food: "맛집 & 테라스", culture: "도시 & 문화", view: "전망 & 풍경", family: "가족 & 여가", mountain: "하이킹 & 자연", countryside: "가족 & 여가" },
    terrain_tag: { coast: "바다, 호수, 수영", hiking: "숲, 산책로, 공원", food: "레스토랑, 바, 카페", culture: "구시가지, 박물관", view: "전망대, 사진", family: "공원, 호수, 아이들", mountain: "숲, 산책로, 공원", countryside: "공원, 호수, 아이들" },
    score_words: ["비추천","보통","매우 좋음","최고"],
    partner_label: "파트너",
    partners: [
      { text: "🏨 호텔 & 펜션 — 맑은 날 예약하기", cta: "상품 보기", color: "#1E3A5F" },
      { text: "🚗 렌터카 — 하루 3만원부터", cta: "비교하기", color: "#14532D" },
      { text: "🍽️ 목적지 근처 현지 맛집", cta: "찾기", color: "#7C2D12" },
    ],
    how_title: "어떻게 사용하나요?",
    how_desc: "도시를 입력하거나 GPS를 사용하고, 반경을 선택하면 태양이 기다리는 곳을 발견할 수 있어요!",
    steps: [
      { e:"📍", t:"출발지를 알려주세요", d:"도시를 입력하거나 GPS를 누르면 Aéria가 바로 출발지를 인식합니다." },
      { e:"🎚️", t:"반경을 선택하세요", d:"10, 30 또는 80km — 햇빛을 위해 얼마나 달릴 건가요?" },
      { e:"🎯", t:"목적지를 발견하세요", d:"날씨 품질 순위별 상위 5개 장소와 직접 경로를 안내합니다." },
    ],
    cta_final: "태양을 쫓을 준비가 되셨나요?",
    error_msg: "데이터를 가져올 수 없습니다. 연결을 확인해 주세요.",
    city_not_found: "도시를 찾을 수 없습니다. 다시 시도해 주세요.",
  },

  hi: {
    flag: "🇮🇳", name: "हिन्दी",
    // भारत की मानसून संस्कृति और धूप के प्रति प्रेम से प्रेरित
    slogan: "बारिश रुकने का इंतज़ार क्यों? धूप तो 20 मिनट दूर है।",
    tagline: "अपने पास अच्छा मौसम खोजें",
    hero_title: "क्या आपके यहाँ बारिश हो रही है?",
    hero_sub: "शायद कुछ मिनट की दूरी पर धूप खिली हो।",
    hero_desc: "Aéria आपके आस-पास का मौसम रियल-टाइम में स्कैन करता है और सबसे नज़दीकी धूप वाली जगह तक पहुँचाता है।",
    search_placeholder: "अपना शहर या पता दर्ज करें…",
    search_btn: "खोजें",
    gps_btn: "मेरी GPS लोकेशन उपयोग करें",
    radius_label: "खोज दायरा",
    radius_unit: "किमी",
    radius_hint: "≈ {min} मिनट की ड्राइव",
    loading_steps: ["📡 स्थानीय मौसम डेटा लोड हो रहा है…","🌍 आसपास स्कैन हो रहा है…","📍 धूप वाली जगहें खोजी जा रही हैं…","✨ सबसे अच्छे विकल्प तैयार हो रहे हैं…"],
    origin_label: "आपकी वर्तमान लोकेशन का मौसम",
    results_title: "आज के सबसे अच्छे गंतव्य",
    score_label: "में से 100",
    more_info: "अधिक जानकारी & रास्ता",
    less_info: "कम जानकारी",
    maps_btn: "Google Maps पर रास्ता देखें",
    temp_max: "अधिकतम तापमान",
    wind_label: "हवा",
    sun_label: "धूप के घंटे",
    rain_label: "बारिश",
    better_than: "pts शुरुआत से बेहतर",
    terrain: { coast: "बीच & तैराकी", hiking: "ट्रेकिंग & प्रकृति", food: "खाना & टेरेस", culture: "शहर & संस्कृति", view: "नज़ारे & परिदृश्य", family: "परिवार & मनोरंजन", mountain: "ट्रेकिंग & प्रकृति", countryside: "परिवार & मनोरंजन" },
    terrain_tag: { coast: "समुद्र, झील, तैराकी", hiking: "जंगल, रास्ते, पार्क", food: "रेस्तरां, बार, कैफे", culture: "पुराना शहर, संग्रहालय", view: "नज़ारे, फ़ोटो", family: "पार्क, झीलें, बच्चे", mountain: "जंगल, रास्ते, पार्क", countryside: "पार्क, झीलें, बच्चे" },
    score_words: ["उचित नहीं","ठीक है","बहुत अच्छा","उत्कृष्ट"],
    partner_label: "पार्टनर",
    partners: [
      { text: "🏨 होटल & रिसॉर्ट — धूप में बुकिंग करें", cta: "ऑफर देखें", color: "#1E3A5F" },
      { text: "🚗 कार किराए पर — ₹1500/दिन से", cta: "तुलना करें", color: "#14532D" },
      { text: "🍽️ आपके गंतव्य के पास स्थानीय रेस्तरां", cta: "खोजें", color: "#7C2D12" },
    ],
    how_title: "यह कैसे काम करता है?",
    how_desc: "अपना शहर दर्ज करें या GPS का उपयोग करें, दायरा चुनें और जानें कि धूप कहाँ आपका इंतज़ार कर रही है!",
    steps: [
      { e:"📍", t:"हमें बताएं आप कहाँ हैं", d:"शहर टाइप करें या GPS दबाएं — Aéria तुरंत आपकी लोकेशन जान लेता है।" },
      { e:"🎚️", t:"अपना दायरा चुनें", d:"10, 30 या 80 किमी — धूप के लिए आप कितनी दूर जाना चाहते हैं?" },
      { e:"🎯", t:"अपने गंतव्य खोजें", d:"मौसम गुणवत्ता के हिसाब से टॉप 5 जगहें, सीधे रास्ते के साथ।" },
    ],
    cta_final: "धूप का पीछा करने के लिए तैयार हैं?",
    error_msg: "डेटा नहीं मिल सका। अपना कनेक्शन जाँचें।",
    city_not_found: "शहर नहीं मिला। फिर से प्रयास करें।",
  },

  ar: {
    flag: "🇸🇦", name: "العربية",
    // مستوحى من ثقافة الاستمتاع بالطقس المعتدل والرحلات العائلية
    slogan: "المطر لا يمنع المغامرة. الشمس تنتظرك على بُعد عشرين دقيقة.",
    tagline: "اعثر على طقس جميل بالقرب منك",
    hero_title: "هل تمطر عندك الآن؟",
    hero_sub: "ربما الشمس تنتظرك على بُعد بضع دقائق فقط.",
    hero_desc: "يحلل Aéria الطقس حولك في الوقت الفعلي ويرشدك إلى أقرب منطقة مشمسة.",
    search_placeholder: "أدخل مدينتك أو عنوانك…",
    search_btn: "بحث",
    gps_btn: "استخدام موقعي GPS",
    radius_label: "نطاق البحث",
    radius_unit: "كم",
    radius_hint: "≈ {min} دقيقة بالسيارة",
    loading_steps: ["📡 جارٍ تحميل بيانات الطقس المحلي…","🌍 جارٍ مسح المنطقة المحيطة…","📍 جارٍ تحديد المناطق المشمسة…","✨ جارٍ حساب أفضل الخيارات…"],
    origin_label: "الطقس الحالي في موقعك",
    results_title: "أفضل الوجهات اليوم",
    score_label: "من 100",
    more_info: "مزيد من التفاصيل والاتجاهات",
    less_info: "إخفاء التفاصيل",
    maps_btn: "فتح الاتجاهات في خرائط Google",
    temp_max: "درجة الحرارة القصوى",
    wind_label: "الرياح",
    sun_label: "ساعات الشمس",
    rain_label: "هطول الأمطار",
    better_than: "نقطة أفضل من نقطة الانطلاق",
    terrain: { coast: "شاطئ & سباحة", hiking: "مشي & طبيعة", food: "مطاعم & تراسات", culture: "مدينة & ثقافة", view: "إطلالة & مناظر", family: "عائلة & ترفيه", mountain: "مشي & طبيعة", countryside: "عائلة & ترفيه" },
    terrain_tag: { coast: "بحر، بحيرة، سباحة", hiking: "غابات، مسارات، حدائق", food: "مطاعم، حانات، مقاهي", culture: "مدينة قديمة، متاحف", view: "نقاط مشاهدة، صور", family: "حدائق، بحيرات، أطفال", mountain: "غابات، مسارات، حدائق", countryside: "حدائق، بحيرات، أطفال" },
    score_words: ["غير موصى به","مقبول","جيد جداً","ممتاز"],
    partner_label: "شريك",
    partners: [
      { text: "🏨 فنادق & منتجعات — احجز في الشمس", cta: "عرض العروض", color: "#1E3A5F" },
      { text: "🚗 تأجير سيارات — من 100 ريال/يوم", cta: "مقارنة", color: "#14532D" },
      { text: "🍽️ مطاعم محلية بالقرب من وجهتك", cta: "اكتشف", color: "#7C2D12" },
    ],
    how_title: "كيف يعمل؟",
    how_desc: "أدخل مدينتك أو استخدم GPS، اختر النطاق، واكتشف أين تنتظرك الشمس!",
    steps: [
      { e:"📍", t:"أخبرنا أين أنت", d:"اكتب مدينتك أو اضغط GPS — يعرف Aéria موقع انطلاقك فوراً." },
      { e:"🎚️", t:"اختر نطاقك", d:"10 أو 30 أو 80 كم — إلى أي مدى ستذهب لإيجاد الشمس؟" },
      { e:"🎯", t:"اكتشف وجهاتك", d:"أفضل 5 أماكن مصنفة حسب جودة الطقس، مع اتجاهات مباشرة." },
    ],
    cta_final: "هل أنت مستعد لمطاردة الشمس؟",
    error_msg: "تعذّر الحصول على البيانات. يرجى التحقق من الاتصال.",
    city_not_found: "المدينة غير موجودة. حاول مرة أخرى.",
  },

  id: {
    flag: "🇮🇩", name: "Bahasa Indonesia",
    // Terinspirasi dari semangat petualangan Indonesia dan budaya wisata lokal
    slogan: "Hujan bukan halangan. Matahari menunggu 20 menit dari sini.",
    tagline: "Temukan cuaca cerah di dekatmu",
    hero_title: "Sedang hujan di tempatmu?",
    hero_sub: "Mungkin ada sinar matahari hanya beberapa menit dari sini.",
    hero_desc: "Aéria memindai cuaca di sekitarmu secara real-time dan memandu kamu ke tempat cerah terdekat.",
    search_placeholder: "Masukkan kota atau alamatmu…",
    search_btn: "Cari",
    gps_btn: "Gunakan lokasi GPS saya",
    radius_label: "Radius pencarian",
    radius_unit: "km",
    radius_hint: "≈ {min} menit berkendara",
    loading_steps: ["📡 Mengambil data cuaca lokal…","🌍 Memindai area sekitar…","📍 Mengidentifikasi spot cerah…","✨ Menghitung opsi terbaik…"],
    origin_label: "Cuaca saat ini di lokasimu",
    results_title: "Destinasi terbaik hari ini",
    score_label: "dari 100",
    more_info: "Detail & petunjuk arah",
    less_info: "Sembunyikan detail",
    maps_btn: "Buka petunjuk arah di Google Maps",
    temp_max: "Suhu maksimum",
    wind_label: "Angin",
    sun_label: "Jam cerah",
    rain_label: "Curah hujan",
    better_than: "pts lebih baik dari asal",
    terrain: { coast: "Pantai & berenang", hiking: "Hiking & alam", food: "Kuliner & teras", culture: "Kota & budaya", view: "Pemandangan & panorama", family: "Keluarga & rekreasi", mountain: "Hiking & alam", countryside: "Keluarga & rekreasi" },
    terrain_tag: { coast: "Laut, danau, berenang", hiking: "Hutan, jalur, taman", food: "Restoran, bar, kafé", culture: "Kota tua, museum", view: "Titik pandang, foto", family: "Taman, danau, anak-anak", mountain: "Hutan, jalur, taman", countryside: "Taman, danau, anak-anak" },
    score_words: ["Tidak disarankan","Cukup baik","Sangat baik","Luar biasa"],
    partner_label: "MITRA",
    partners: [
      { text: "🏨 Hotel & villa — Pesan di bawah sinar matahari", cta: "Lihat penawaran", color: "#1E3A5F" },
      { text: "🚗 Sewa mobil — Mulai Rp 200.000/hari", cta: "Bandingkan", color: "#14532D" },
      { text: "🍽️ Restoran lokal dekat tujuanmu", cta: "Temukan", color: "#7C2D12" },
    ],
    how_title: "Bagaimana cara kerjanya?",
    how_desc: "Masukkan kotamu atau gunakan GPS, pilih radius, dan temukan di mana matahari menunggumu!",
    steps: [
      { e:"📍", t:"Beritahu kami lokasimu", d:"Ketik kotamu atau tekan GPS — Aéria langsung tahu titik keberangkatanmu." },
      { e:"🎚️", t:"Pilih radiusmu", d:"10, 30 atau 80 km — seberapa jauh kamu mau pergi demi sinar matahari?" },
      { e:"🎯", t:"Temukan destinasimu", d:"5 tempat terbaik berdasarkan kualitas cuaca, dengan petunjuk arah langsung." },
    ],
    cta_final: "Siap mengejar matahari?",
    error_msg: "Tidak dapat mengambil data. Periksa koneksimu.",
    city_not_found: "Kota tidak ditemukan. Coba lagi.",
  },
};

// ═══════════════════════════════════════════════════════════════
// 🔍 DÉTECTION AUTOMATIQUE DE LANGUE
// ═══════════════════════════════════════════════════════════════
const detectLang = () => {
  const supported = Object.keys(LANGUAGES);
  // 1. URL param ?lang=xx
  const urlParam = new URLSearchParams(window.location.search).get("lang");
  if (urlParam && supported.includes(urlParam)) return urlParam;
  // 2. localStorage
  const stored = localStorage.getItem("aeria_lang");
  if (stored && supported.includes(stored)) return stored;
  // 3. Navigator language
  const nav = (navigator.language || navigator.userLanguage || "fr").split("-")[0].toLowerCase();
  if (supported.includes(nav)) return nav;
  // 4. Fallback
  return "fr";
};

// ═══════════════════════════════════════════════════════════════
// 🌤️ WEATHER CODE HELPERS (multilingual)
// ═══════════════════════════════════════════════════════════════
const weatherInfo = (code, L) => {
  const labels = {
    fr: ["Ciel dégagé","Peu nuageux","Couvert","Brouillard","Bruine","Pluie","Neige","Averses","Orage","Variable"],
    en: ["Clear sky","Partly cloudy","Overcast","Foggy","Drizzle","Rain","Snow","Showers","Thunderstorm","Variable"],
    de: ["Klarer Himmel","Leicht bewölkt","Bedeckt","Nebel","Nieselregen","Regen","Schnee","Schauer","Gewitter","Wechselhaft"],
    es: ["Cielo despejado","Poco nuboso","Nublado","Niebla","Llovizna","Lluvia","Nieve","Chubascos","Tormenta","Variable"],
    pt: ["Céu limpo","Pouco nublado","Nublado","Neblina","Garoa","Chuva","Neve","Aguaceiros","Tempestade","Variável"],
    it: ["Cielo sereno","Poco nuvoloso","Coperto","Nebbia","Pioggerella","Pioggia","Neve","Rovesci","Temporale","Variabile"],
    nl: ["Heldere lucht","Licht bewolkt","Bewolkt","Mist","Motregen","Regen","Sneeuw","Buien","Onweer","Wisselvallig"],
    ja: ["快晴","晴れ時々曇り","曇り","霧","霧雨","雨","雪","にわか雨","雷雨","変わりやすい"],
    ko: ["맑음","구름 조금","흐림","안개","이슬비","비","눈","소나기","뇌우","변덕스러움"],
    hi: ["साफ आसमान","थोड़े बादल","बादल छाए","कोहरा","बूंदाबांदी","बारिश","बर्फ","बौछारें","आंधी-तूफान","परिवर्तनशील"],
    ar: ["سماء صافية","غائم جزئياً","غائم","ضبابي","رذاذ","مطر","ثلج","زخات","عاصفة رعدية","متغير"],
    id: ["Langit cerah","Sedikit berawan","Mendung","Berkabut","Gerimis","Hujan","Salju","Hujan lebat","Badai petir","Berubah-ubah"],
  };
  const lang = L && labels[L] ? L : "fr";
  const l = labels[lang];
  if (code===0) return {label:l[0],emoji:"☀️",Icon:Sun,score:100};
  if (code<=2)  return {label:l[1],emoji:"🌤️",Icon:Sun,score:82};
  if (code===3) return {label:l[2],emoji:"☁️",Icon:Cloud,score:45};
  if (code>=45&&code<=48) return {label:l[3],emoji:"🌫️",Icon:Cloud,score:30};
  if (code>=51&&code<=57) return {label:l[4],emoji:"🌦️",Icon:CloudRain,score:25};
  if (code>=61&&code<=67) return {label:l[5],emoji:"🌧️",Icon:CloudRain,score:10};
  if (code>=71&&code<=77) return {label:l[6],emoji:"❄️",Icon:CloudSnow,score:20};
  if (code>=80&&code<=82) return {label:l[7],emoji:"🌨️",Icon:CloudRain,score:15};
  if (code>=95) return {label:l[8],emoji:"⛈️",Icon:CloudRain,score:5};
  return {label:l[9],emoji:"🌥️",Icon:Cloud,score:40};
};

// ═══════════════════════════════════════════════════════════════
// GEO + WEATHER HELPERS
// ═══════════════════════════════════════════════════════════════
const ringPoints=(lat,lon,radiusKm,count=16)=>{
  const pts=[],R=6371,dirs=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSO","SO","OSO","O","ONO","NO","NNO"];
  for(let i=0;i<count;i++){
    const bearing=(i*360)/count,br=(bearing*Math.PI)/180;
    const latR=(lat*Math.PI)/180,lonR=(lon*Math.PI)/180,dr=radiusKm/R;
    const lat2=Math.asin(Math.sin(latR)*Math.cos(dr)+Math.cos(latR)*Math.sin(dr)*Math.cos(br));
    const lon2=lonR+Math.atan2(Math.sin(br)*Math.sin(dr)*Math.cos(latR),Math.cos(dr)-Math.sin(latR)*Math.sin(lat2));
    pts.push({lat:(lat2*180)/Math.PI,lon:(lon2*180)/Math.PI,bearing,direction:dirs[i]});
  }
  return pts;
};
const distKm=(a,b,c,d)=>{const R=6371,dL=((c-a)*Math.PI)/180,dG=((d-b)*Math.PI)/180,x=Math.sin(dL/2)**2+Math.cos((a*Math.PI)/180)*Math.cos((c*Math.PI)/180)*Math.sin(dG/2)**2;return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));};
const reverseGeocode=async(lat,lon,lang="fr")=>{try{const r=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=${lang}&zoom=10`);const d=await r.json();if(d&&d.address){const a=d.address;const city=a.city||a.town||a.village||a.municipality||a.county||a.hamlet||a.suburb||"";const region=a.state||a.region||a.country||"";return city+(region&&city?", "+region:region);}}catch{}return null;};
const forwardGeocode=async(q,lang="fr")=>{const r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=${lang}`);const d=await r.json();return d.results||[];};
const fetchWeatherBatch=async(points)=>{const lats=points.map(p=>p.lat.toFixed(4)).join(","),lons=points.map(p=>p.lon.toFixed(4)).join(",");const url=`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,weather_code,cloud_cover,wind_speed_10m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunshine_duration&timezone=auto&forecast_days=1`;const r=await fetch(url);const d=await r.json();return Array.isArray(d)?d:[d];};
const fetchElevation=async(lat,lon)=>{try{const r=await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`);const d=await r.json();return d.elevation?.[0]??0;}catch{return 0;}};
const inferTerrain=(elev,L)=>{const t=LANGUAGES[L]||LANGUAGES.fr;if(elev>800)return{kind:t.terrain.mountain,tag:t.terrain_tag.mountain,Icon:Mountain,bg:"#E0F2FE",accent:"#0284C7"};if(elev<40)return{kind:t.terrain.coast,tag:t.terrain_tag.coast,Icon:Waves,bg:"#ECFDF5",accent:"#059669"};return{kind:t.terrain.countryside,tag:t.terrain_tag.countryside,Icon:Trees,bg:"#FEF9C3",accent:"#CA8A04"};};
const scoreLabel=(s,L)=>{const t=LANGUAGES[L]||LANGUAGES.fr;const w=t.score_words;if(s>=85)return{text:w[3],color:"#16A34A"};if(s>=65)return{text:w[2],color:"#65A30D"};if(s>=45)return{text:w[1],color:"#D97706"};return{text:w[0],color:"#DC2626"};};

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════
const AdBanner=({partner,label})=>(
  <div style={{background:partner.color,borderRadius:12,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,marginTop:8,marginBottom:8}}>
    <div style={{display:"flex",flexDirection:"column",gap:3}}>
      <span style={{fontSize:9,letterSpacing:"0.15em",color:"rgba(255,255,255,0.55)",fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase"}}>{label}</span>
      <span style={{color:"#fff",fontSize:14,fontFamily:"'DM Sans',sans-serif"}}>{partner.text}</span>
    </div>
    <button style={{background:"rgba(255,255,255,0.18)",border:"1px solid rgba(255,255,255,0.35)",color:"#fff",borderRadius:8,padding:"8px 14px",fontSize:12,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",whiteSpace:"nowrap"}}>{partner.cta} →</button>
  </div>
);

const ScoreRing=({score,lang})=>{
  const r=26,circ=2*Math.PI*r;
  const {color}=scoreLabel(score,lang);
  return(<svg width={70} height={70} viewBox="0 0 70 70"><circle cx={35} cy={35} r={r} fill="none" stroke="#E5E7EB" strokeWidth={5}/><circle cx={35} cy={35} r={r} fill="none" stroke={color} strokeWidth={5} strokeDasharray={circ} strokeDashoffset={circ*(1-score/100)} strokeLinecap="round" transform="rotate(-90 35 35)" style={{transition:"stroke-dashoffset 1s ease"}}/><text x={35} y={39} textAnchor="middle" fontSize={14} fontWeight={700} fill={color} fontFamily="'DM Sans',sans-serif">{Math.round(score)}</text></svg>);
};

const LangPicker=({current,onChange})=>{
  const [open,setOpen]=useState(false);
  return(
    <div style={{position:"relative"}}>
      <button onClick={()=>setOpen(!open)} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",color:"#fff",borderRadius:10,padding:"8px 12px",fontSize:13,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
        <Globe size={14}/> {LANGUAGES[current].flag} {LANGUAGES[current].name} ▾
      </button>
      {open&&(
        <div style={{position:"absolute",top:"100%",right:0,background:"#fff",borderRadius:12,boxShadow:"0 8px 30px rgba(0,0,0,0.15)",zIndex:100,minWidth:180,overflow:"hidden",marginTop:4}}>
          {Object.entries(LANGUAGES).map(([code,l])=>(
            <div key={code} onClick={()=>{onChange(code);setOpen(false);}} style={{padding:"10px 16px",cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif",color:"#1E293B",display:"flex",alignItems:"center",gap:8,background:code===current?"#F5F3FF":"#fff",borderBottom:"1px solid #F1F5F9"}}>
              <span style={{fontSize:18}}>{l.flag}</span> {l.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [lang,setLang]=useState(detectLang);
  const L=LANGUAGES[lang];
  const isRTL=lang==="ar";

  const [query,setQuery]=useState("");
  const [suggestions,setSuggestions]=useState([]);
  const [radius,setRadius]=useState(30);
  const [loading,setLoading]=useState(false);
  const [step,setStep]=useState("");
  const [results,setResults]=useState([]);
  const [originWx,setOriginWx]=useState(null);
  const [error,setError]=useState("");
  const [expanded,setExpanded]=useState(null);
  const [lastPos,setLastPos]=useState(null);
  const debounce=useRef(null);

  useEffect(()=>{localStorage.setItem("aeria_lang",lang);setResults([]);setOriginWx(null);setError("");},[lang]);

  // Relance automatique quand on change le rayon (si une position est déjà active)
  useEffect(()=>{
    if(lastPos){
      console.log("[Aeria] Radius changed, auto-relaunching search at:",radius,"km");
      runSearch(lastPos.lat,lastPos.lon,lastPos.name);
    }
  },[radius]);

  useEffect(()=>{
    clearTimeout(debounce.current);
    if(query.length<2){setSuggestions([]);return;}
    debounce.current=setTimeout(async()=>{const res=await forwardGeocode(query,lang);setSuggestions(res.slice(0,5));},350);
  },[query,lang]);

  const runSearch=async(lat,lon,name)=>{
    setLastPos({lat,lon,name});
    setLoading(true);setError("");setResults([]);setExpanded(null);setSuggestions([]);
    let si=0;setStep(L.loading_steps[0]);
    const iv=setInterval(()=>{si=(si+1)%L.loading_steps.length;setStep(L.loading_steps[si]);},1800);
    try{
      const candidates=ringPoints(lat,lon,radius,16);
      const all=[{lat,lon,direction:"—"},...candidates];
      const weather=await fetchWeatherBatch(all);
      const enriched=weather.map((w,i)=>{
        const pt=all[i];const cur=w.current;const daily=w.daily;
        const wx=weatherInfo(cur.weather_code,lang);
        const sunH=(daily.sunshine_duration?.[0]??0)/3600;
        const precip=daily.precipitation_sum?.[0]??0;
        let score=wx.score+Math.min(sunH*5,40)-Math.min(precip*8,50);
        score=Math.max(0,Math.min(100,score));
        return{...pt,temp:cur.temperature_2m,tempMax:daily.temperature_2m_max?.[0],tempMin:daily.temperature_2m_min?.[0],wind:cur.wind_speed_10m,precip,sunH,wx,score,dist:i===0?0:distKm(lat,lon,pt.lat,pt.lon)};
      });
      const home=enriched[0];setOriginWx({...home,name});
      const away=enriched.slice(1).sort((a,b)=>b.score-a.score).slice(0,5);
      const top=await Promise.all(away.map(async(p)=>{
        const[placeName,elev]=await Promise.all([reverseGeocode(p.lat,p.lon,lang),fetchElevation(p.lat,p.lon)]);
        const terrain=inferTerrain(elev,lang);
        return{...p,placeName:placeName||`${p.direction} — ${p.dist.toFixed(0)} km`,terrain};
      }));
      clearInterval(iv);setResults(top);setLoading(false);
    }catch{clearInterval(iv);setError(L.error_msg);setLoading(false);}
  };

  const useLocation=()=>{
    if(!navigator.geolocation){setError(L.error_msg);return;}
    setLoading(true);setStep(L.loading_steps[0]);
    navigator.geolocation.getCurrentPosition(async pos=>{
      const{latitude:lat,longitude:lon}=pos.coords;
      const name=await reverseGeocode(lat,lon,lang)||"📍";
      runSearch(lat,lon,name);
    },()=>{setLoading(false);setError(L.error_msg);});
  };

  const pickSuggestion=(s)=>{
    const name=s.name+(s.admin1?", "+s.admin1:"")+(s.country?", "+s.country:"");
    setQuery(name);setSuggestions([]);
    runSearch(s.latitude,s.longitude,name);
  };

  const radiusOptions=[10,20,30,50,80];
  const betterBy=(r)=>r.score-(originWx?.score??0);

  const S={
    app:{fontFamily:"'DM Sans',sans-serif",background:"#F0F4F8",minHeight:"100vh",direction:isRTL?"rtl":"ltr"},
    header:{background:"linear-gradient(135deg,#1a1a2e 0%,#16213e 40%,#0f3460 70%,#533483 100%)",padding:"28px 20px 36px",textAlign:"center"},
    logo:{fontSize:42,fontWeight:800,color:"#fff",letterSpacing:"-1px",marginBottom:4},
    tagline:{fontSize:18,color:"rgba(255,255,255,0.92)",fontWeight:500,marginBottom:0,letterSpacing:"0.2px"},
    main:{maxWidth:640,margin:"0 auto",padding:"0 16px 40px"},
    card:{background:"#fff",borderRadius:20,padding:24,marginBottom:16,boxShadow:"0 2px 16px rgba(0,0,0,0.07)"},
    inputWrap:{position:"relative",marginBottom:12},
    input:{width:"100%",padding:"16px 48px 16px 16px",fontSize:17,border:"2px solid #E5E7EB",borderRadius:14,outline:"none",boxSizing:"border-box",background:"#F9FAFB",transition:"border-color .2s"},
    locBtn:{width:"100%",padding:"15px",background:"#533483",color:"#fff",border:"none",borderRadius:14,fontSize:16,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"background .2s"},
    radioBtns:{display:"flex",gap:8,flexWrap:"wrap",marginTop:16},
    radioBtnBase:{flex:1,minWidth:54,padding:"12px 8px",border:"2px solid #E5E7EB",borderRadius:12,fontSize:14,fontWeight:600,cursor:"pointer",textAlign:"center",background:"#F9FAFB",transition:"all .2s"},
    suggestions:{position:"absolute",top:"100%",left:0,right:0,background:"#fff",borderRadius:12,boxShadow:"0 8px 30px rgba(0,0,0,0.12)",zIndex:50,overflow:"hidden",border:"1px solid #E5E7EB"},
    suggItem:{padding:"14px 16px",cursor:"pointer",fontSize:15,borderBottom:"1px solid #F3F4F6",display:"flex",alignItems:"center",gap:10},
    originCard:{background:"linear-gradient(135deg,#1a1a2e,#533483)",borderRadius:20,padding:20,marginBottom:16,color:"#fff"},
    resultCard:{background:"#fff",borderRadius:20,padding:20,marginBottom:12,boxShadow:"0 2px 16px rgba(0,0,0,0.07)",cursor:"pointer",transition:"transform .15s, box-shadow .15s"},
    badge:{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:999,fontSize:12,fontWeight:600},
    pill:{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:999,fontSize:13,background:"#F1F5F9",color:"#475569"},
    mapsBtn:{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"#533483",color:"#fff",border:"none",borderRadius:12,padding:"14px",fontSize:15,fontWeight:600,cursor:"pointer",width:"100%",textDecoration:"none",marginTop:12},
    sectionTitle:{fontSize:13,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#64748B",marginBottom:12},
    detailGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12},
    detailItem:{background:"#F8FAFC",borderRadius:10,padding:"10px 12px"},
    detailLabel:{fontSize:11,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2},
    detailVal:{fontSize:16,fontWeight:700,color:"#1E293B"},
  };

  return(
    <div style={S.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        input:focus{border-color:#533483!important;background:#fff!important;}
        .loc-btn:hover{background:#6d45a8!important;}
        .res-card:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.12)!important;}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        .fade-up{animation:fadeUp 0.5s ease both;}
        ::-webkit-scrollbar{display:none;}
      `}</style>

      {/* HEADER */}
      <div style={S.header}>
        {/* Lang picker top right */}
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:16,paddingRight:4}}>
          <LangPicker current={lang} onChange={setLang}/>
        </div>

        {/* Logo Aéria boussole */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,marginBottom:6}}>
          <svg width="240" height="240" viewBox="0 0 500 500" fill="none" style={{filter:"drop-shadow(0 0 40px rgba(196,181,253,0.15))"}}>
            <defs>
              <linearGradient id="bvLight" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#ffffff"/><stop offset="100%" stopColor="#c4b5fd"/></linearGradient>
              <linearGradient id="bvDark" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#8b7fb8" stopOpacity="0.95"/><stop offset="100%" stopColor="#3d2563" stopOpacity="0.9"/></linearGradient>
              <linearGradient id="bhLight" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ffffff"/><stop offset="100%" stopColor="#c4b5fd"/></linearGradient>
              <linearGradient id="bhDark" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8b7fb8" stopOpacity="0.95"/><stop offset="100%" stopColor="#3d2563" stopOpacity="0.9"/></linearGradient>
              <radialGradient id="cHub" cx="35%" cy="30%" r="70%"><stop offset="0%" stopColor="#ffffff"/><stop offset="25%" stopColor="#e0d4ff"/><stop offset="65%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#1a1a2e"/></radialGradient>
            </defs>
            {/* Cercles extérieurs */}
            <circle cx="250" cy="250" r="245" fill="none" stroke="#ffffff" strokeWidth="1.4" opacity="1"/>
            <circle cx="250" cy="250" r="238" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.55"/>
            {/* Graduations 5° */}
            {Array.from({length:36},(_,i)=>i*10+5).map(deg=>(
              <line key={`f${deg}`} x1="250" y1="7" x2="250" y2="14" stroke="#ffffff" strokeWidth="0.4" opacity="0.55" transform={`rotate(${deg} 250 250)`}/>
            ))}
            {/* Graduations 10° (sauf 30°) */}
            {[10,20,40,50,70,80,100,110,130,140,160,170,190,200,220,230,250,260,280,290,310,320,340,350].map(deg=>(
              <line key={`m${deg}`} x1="250" y1="7" x2="250" y2="18" stroke="#ffffff" strokeWidth="0.8" opacity="0.85" transform={`rotate(${deg} 250 250)`}/>
            ))}
            {/* Graduations 30° (longues) */}
            {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg=>(
              <line key={`l${deg}`} x1="250" y1="7" x2="250" y2="24" stroke="#ffffff" strokeWidth="1.4" opacity="1" transform={`rotate(${deg} 250 250)`}/>
            ))}
            {/* Chiffres degrés */}
            <g fontFamily="'DM Sans',sans-serif" fontSize="13" fontWeight="600" fill="#ffffff" opacity="0.9" textAnchor="middle" dominantBaseline="middle">
              <text x="250" y="39">0</text>
              <text x="362" y="69" transform="rotate(30 362 69)">30</text>
              <text x="431" y="138" transform="rotate(60 431 138)">60</text>
              <text x="461" y="250" transform="rotate(90 461 250)">90</text>
              <text x="431" y="362" transform="rotate(120 431 362)">120</text>
              <text x="362" y="431" transform="rotate(150 362 431)">150</text>
              <text x="250" y="461" transform="rotate(180 250 461)">180</text>
              <text x="138" y="431" transform="rotate(210 138 431)">210</text>
              <text x="69" y="362" transform="rotate(240 69 362)">240</text>
              <text x="39" y="250" transform="rotate(270 39 250)">270</text>
              <text x="69" y="138" transform="rotate(300 69 138)">300</text>
              <text x="138" y="69" transform="rotate(330 138 69)">330</text>
            </g>
            {/* Cercle séparateur */}
            <circle cx="250" cy="250" r="215" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.7"/>
            {/* Petits losanges aux inter-cardinaux */}
            <g fill="#ffffff" opacity="0.55">
              <polygon points="377,118 382,123 377,128 372,123"/>
              <polygon points="377,372 382,377 377,382 372,377"/>
              <polygon points="123,372 128,377 123,382 118,377"/>
              <polygon points="123,118 128,123 123,128 118,123"/>
            </g>
            {/* Lettres cardinales N/E/S/W */}
            <g fontFamily="'DM Sans',sans-serif" fontWeight="800" fill="#ffffff" textAnchor="middle" dominantBaseline="middle">
              <text x="250" y="70" fontSize="46">N</text>
              <text x="430" y="250" fontSize="40">E</text>
              <text x="250" y="430" fontSize="40">S</text>
              <text x="70" y="250" fontSize="40">W</text>
            </g>
            {/* Cercle interne */}
            <circle cx="250" cy="250" r="145" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.45"/>
            {/* Branches diagonales */}
            <polygon points="321,179 250,250 244,244" fill="#d8d0f0" opacity="0.85"/>
            <polygon points="321,179 250,250 256,256" fill="#5d4a8a" opacity="0.75"/>
            <polygon points="321,321 250,250 256,244" fill="#d8d0f0" opacity="0.85"/>
            <polygon points="321,321 250,250 244,256" fill="#5d4a8a" opacity="0.75"/>
            <polygon points="179,321 250,250 256,256" fill="#d8d0f0" opacity="0.85"/>
            <polygon points="179,321 250,250 244,244" fill="#5d4a8a" opacity="0.75"/>
            <polygon points="179,179 250,250 244,256" fill="#d8d0f0" opacity="0.85"/>
            <polygon points="179,179 250,250 256,244" fill="#5d4a8a" opacity="0.75"/>
            {/* Branches principales */}
            <polygon points="250,105 250,250 238,238" fill="url(#bvLight)"/>
            <polygon points="250,105 250,250 262,238" fill="url(#bvDark)"/>
            <polygon points="250,395 250,250 262,262" fill="url(#bvLight)"/>
            <polygon points="250,395 250,250 238,262" fill="url(#bvDark)"/>
            <polygon points="395,250 250,250 262,238" fill="url(#bhLight)"/>
            <polygon points="395,250 250,250 262,262" fill="url(#bhDark)"/>
            <polygon points="105,250 250,250 238,262" fill="url(#bhLight)"/>
            <polygon points="105,250 250,250 238,238" fill="url(#bhDark)"/>
            {/* Fleur de lys au-dessus du Nord */}
            <g transform="translate(250, 95)" opacity="0.95">
              <path d="M 0,-14 L 4,-4 L 0,2 L -4,-4 Z" fill="#ffffff"/>
              <path d="M -2,-2 Q -10,-8 -8,-14 Q -4,-8 -2,-2 Z" fill="#ffffff" opacity="0.85"/>
              <path d="M 2,-2 Q 10,-8 8,-14 Q 4,-8 2,-2 Z" fill="#ffffff" opacity="0.85"/>
              <ellipse cx="0" cy="2" rx="6" ry="1.2" fill="#ffffff"/>
            </g>
            {/* Moyeu central */}
            <circle cx="250" cy="250" r="18" fill="url(#cHub)"/>
            <circle cx="250" cy="250" r="18" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.9"/>
            <circle cx="250" cy="250" r="6" fill="#1a1a2e"/>
            <ellipse cx="245" cy="245" rx="3" ry="2" fill="#ffffff" opacity="0.6" transform="rotate(-30 245 245)"/>
          </svg>
          <div style={S.logo}>Aéria</div>
        </div>

        {/* Slogan culturel unique par langue */}
        <div style={{fontSize:22,color:"rgba(255,255,255,0.92)",fontStyle:"italic",fontWeight:300,maxWidth:520,margin:"0 auto 14px",lineHeight:1.45,padding:"0 16px",letterSpacing:"0.2px"}}>
          "{L.slogan}"
        </div>
        <div style={S.tagline}>{L.tagline}</div>

        <svg viewBox="0 0 1440 40" style={{display:"block",marginTop:24,width:"100%"}}>
          <path d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40Z" fill="#F0F4F8"/>
        </svg>
      </div>

      <div style={S.main}>

        {/* SEARCH CARD */}
        <div style={{...S.card,marginTop:-4}} className="fade-up">
          <div style={S.sectionTitle}>📍 {L.radius_label === "Rayon de recherche" ? "Votre point de départ" : L.search_btn}</div>
          <div style={S.inputWrap}>
            <input style={S.input} type="text" placeholder={L.search_placeholder} value={query}
              onChange={e=>setQuery(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&suggestions.length>0)pickSuggestion(suggestions[0]);}}/>
            <Search style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",color:"#9CA3AF",pointerEvents:"none"}} size={20}/>
            {suggestions.length>0&&(
              <div style={S.suggestions}>
                {suggestions.map((s,i)=>(
                  <div key={i} style={S.suggItem} onClick={()=>pickSuggestion(s)}
                    onMouseEnter={e=>e.currentTarget.style.background="#F8FAFC"}
                    onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                    <MapPin size={16} color="#94A3B8"/>
                    <div>
                      <div style={{fontWeight:600,fontSize:15}}>{s.name}</div>
                      <div style={{fontSize:12,color:"#9CA3AF"}}>{[s.admin1,s.country].filter(Boolean).join(", ")}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button style={S.locBtn} className="loc-btn" onClick={()=>{console.log("[Aeria] GPS button clicked");useLocation();}}>
            <Navigation size={18}/> {L.gps_btn}
          </button>
          <div style={{marginTop:20}}>
            <div style={S.sectionTitle}>🚗 {L.radius_label}</div>
            <div style={S.radioBtns}>
              {radiusOptions.map(r=>(
                <button key={r} style={{...S.radioBtnBase,background:radius===r?"#533483":"#F9FAFB",color:radius===r?"#fff":"#374151",borderColor:radius===r?"#533483":"#E5E7EB"}} onClick={()=>{console.log("[Aeria] Radius clicked:",r);setRadius(r);}}>
                  {r} {L.radius_unit}
                </button>
              ))}
            </div>
            <div style={{fontSize:13,color:"#9CA3AF",marginTop:8,textAlign:"center"}}>
              {L.radius_hint.replace("{min}",Math.round(radius*1.4))}
            </div>
          </div>
        </div>

        {/* AD BANNER 1 */}
        <AdBanner partner={L.partners[0]} label={L.partner_label}/>

        {/* LOADING */}
        {loading&&(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"40px 0"}} className="fade-up">
            <div style={{width:56,height:56,border:"4px solid #E5E7EB",borderTop:"4px solid #533483",borderRadius:"50%",animation:"spin 0.9s linear infinite"}}/>
            <div style={{fontSize:16,fontWeight:600,color:"#374151",marginTop:16}}>{step}</div>
          </div>
        )}

        {error&&!loading&&(<div style={{background:"#FEE2E2",border:"1px solid #FCA5A5",borderRadius:14,padding:16,color:"#991B1B",fontSize:15,marginBottom:16}} className="fade-up">⚠️ {error}</div>)}

        {/* ORIGIN WEATHER */}
        {originWx&&!loading&&(
          <div style={S.originCard} className="fade-up">
            <div style={{fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(255,255,255,0.6)",marginBottom:4}}>{L.origin_label}</div>
            <div style={{fontSize:20,fontWeight:700,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
              <MapPin size={18}/> {originWx.name}
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{fontSize:42,fontWeight:800,lineHeight:1}}>{Math.round(originWx.temp)}°</div>
                <div style={{fontSize:15,color:"rgba(255,255,255,0.8)",marginTop:4}}>{originWx.wx.emoji} {originWx.wx.label}</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",marginTop:6}}>{L.wind_label} {Math.round(originWx.wind)} km/h · {L.rain_label} {originWx.precip.toFixed(1)} mm</div>
              </div>
              <div style={{textAlign:"center"}}>
                <ScoreRing score={originWx.score} lang={lang}/>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:4}}>{L.score_label}</div>
              </div>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {results.length>0&&!loading&&(
          <>
            <div style={{fontSize:20,fontWeight:800,color:"#1E293B",marginBottom:14,marginTop:4}}>🎯 {L.results_title}</div>
            {results.map((r,i)=>{
              const sl2=scoreLabel(r.score,lang);
              const Ter=r.terrain.Icon;
              const better=betterBy(r);
              const open=expanded===i;
              return(
                <div key={i}>
                  <div className="res-card fade-up" style={{...S.resultCard,animationDelay:`${i*80}ms`}} onClick={()=>setExpanded(open?null:i)}>
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                          <span style={{...S.badge,background:r.terrain.bg,color:r.terrain.accent}}>
                            <Ter size={13}/> {r.terrain.kind}
                          </span>
                          {better>8&&(<span style={{...S.badge,background:"#F0FDF4",color:"#16A34A"}}><Sparkles size={13}/> +{Math.round(better)} {L.better_than}</span>)}
                        </div>
                        <div style={{fontSize:18,fontWeight:800,color:"#1E293B",marginBottom:3,lineHeight:1.2}}>{r.placeName}</div>
                        <div style={{fontSize:13,color:"#64748B",marginBottom:8,display:"flex",alignItems:"center",gap:4}}>
                          <Clock size={13}/> {r.dist.toFixed(0)} km · {r.direction}
                        </div>
                        <div style={{fontSize:15,fontWeight:600,color:r.terrain.accent}}>{r.terrain.tag}</div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,minWidth:70}}>
                        <ScoreRing score={r.score} lang={lang}/>
                        <div style={{fontSize:11,fontWeight:700,color:sl2.color,textAlign:"center"}}>{sl2.text}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
                      <span style={S.pill}>{r.wx.emoji} {r.wx.label}</span>
                      <span style={S.pill}><Thermometer size={13}/> {Math.round(r.tempMin)}°–{Math.round(r.tempMax)}°</span>
                      <span style={S.pill}><Droplets size={13}/> {r.precip.toFixed(1)} mm</span>
                      <span style={S.pill}>☀️ {r.sunH.toFixed(1)}h</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginTop:14,color:"#94A3B8",fontSize:13,gap:4}}>
                      {open?<><ChevronUp size={16}/> {L.less_info}</>:<><ChevronDown size={16}/> {L.more_info}</>}
                    </div>
                    {open&&(
                      <div onClick={e=>e.stopPropagation()}>
                        <div style={{height:1,background:"#F1F5F9",margin:"14px 0"}}/>
                        <div style={S.detailGrid}>
                          <div style={S.detailItem}><div style={S.detailLabel}>{L.temp_max}</div><div style={S.detailVal}>{Math.round(r.tempMax)}°C</div></div>
                          <div style={S.detailItem}><div style={S.detailLabel}>{L.wind_label}</div><div style={S.detailVal}>{Math.round(r.wind)} km/h</div></div>
                          <div style={S.detailItem}><div style={S.detailLabel}>{L.sun_label}</div><div style={S.detailVal}>{r.sunH.toFixed(1)}h</div></div>
                          <div style={S.detailItem}><div style={S.detailLabel}>{L.rain_label}</div><div style={S.detailVal}>{r.precip.toFixed(1)} mm</div></div>
                        </div>
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${r.lat},${r.lon}`} target="_blank" rel="noopener noreferrer" style={S.mapsBtn}>
                          <MapPin size={18}/> {L.maps_btn} <ArrowRight size={16}/>
                        </a>
                      </div>
                    )}
                  </div>
                  {i===1&&<AdBanner partner={L.partners[1]} label={L.partner_label}/>}
                  {i===3&&<AdBanner partner={L.partners[2]} label={L.partner_label}/>}
                </div>
              );
            })}
          </>
        )}

        {/* EMPTY STATE / HOW IT WORKS */}
        {!originWx&&!loading&&!error&&(
          <div className="fade-up">
            {/* Hero avec boussole Marine Vintage */}
            <div style={{background:"radial-gradient(ellipse at top, #1e2749 0%, #0a0e27 50%, #05071a 100%)",borderRadius:24,padding:"40px 24px 32px",textAlign:"center",marginBottom:16,position:"relative",overflow:"hidden"}}>
              {/* Halo lumineux d'arrière-plan */}
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-65%)",width:340,height:340,background:"radial-gradient(circle, rgba(200,220,255,0.08) 0%, transparent 70%)",borderRadius:"50%",pointerEvents:"none"}}/>

              {/* Boussole SVG */}
              <div style={{display:"flex",justifyContent:"center",alignItems:"center",marginBottom:24,position:"relative"}}>
                <svg viewBox="0 0 500 500" width="240" height="240" xmlns="http://www.w3.org/2000/svg" style={{filter:"drop-shadow(0 0 30px rgba(200, 220, 255, 0.15))"}}>
                  <defs>
                    <linearGradient id="bv-l" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#ffffff"/><stop offset="100%" stopColor="#b8c2dc"/></linearGradient>
                    <linearGradient id="bv-d" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#8590b0"/><stop offset="100%" stopColor="#3d4668"/></linearGradient>
                    <linearGradient id="bh-l" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ffffff"/><stop offset="100%" stopColor="#b8c2dc"/></linearGradient>
                    <linearGradient id="bh-d" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8590b0"/><stop offset="100%" stopColor="#3d4668"/></linearGradient>
                    <radialGradient id="hub" cx="35%" cy="30%" r="70%"><stop offset="0%" stopColor="#ffffff"/><stop offset="25%" stopColor="#e8ecf5"/><stop offset="65%" stopColor="#7a86a8"/><stop offset="100%" stopColor="#2d3354"/></radialGradient>
                  </defs>
                  {/* Cercles extérieurs */}
                  <circle cx="250" cy="250" r="245" fill="none" stroke="#ffffff" strokeWidth="1.4"/>
                  <circle cx="250" cy="250" r="238" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.55"/>
                  {/* Graduations 5° */}
                  <g stroke="#ffffff" strokeWidth="0.4" opacity="0.55">
                    {[5,15,25,35,45,55,65,75,85,95,105,115,125,135,145,155,165,175,185,195,205,215,225,235,245,255,265,275,285,295,305,315,325,335,345,355].map(d=>(
                      <line key={d} x1="250" y1="7" x2="250" y2="14" transform={`rotate(${d} 250 250)`}/>
                    ))}
                  </g>
                  {/* Graduations 10° */}
                  <g stroke="#ffffff" strokeWidth="0.8" opacity="0.85">
                    {[10,20,40,50,70,80,100,110,130,140,160,170,190,200,220,230,250,260,280,290,310,320,340,350].map(d=>(
                      <line key={d} x1="250" y1="7" x2="250" y2="18" transform={`rotate(${d} 250 250)`}/>
                    ))}
                  </g>
                  {/* Graduations 30° */}
                  <g stroke="#ffffff" strokeWidth="1.4">
                    {[0,30,60,90,120,150,180,210,240,270,300,330].map(d=>(
                      <line key={d} x1="250" y1="7" x2="250" y2="24" transform={`rotate(${d} 250 250)`}/>
                    ))}
                  </g>
                  {/* Chiffres degrés */}
                  <g fontFamily="serif" fontSize="11" fontWeight="500" fill="#ffffff" opacity="0.9" textAnchor="middle" dominantBaseline="middle">
                    <text x="250" y="39">0</text>
                    <text x="362" y="69" transform="rotate(30 362 69)">30</text>
                    <text x="431" y="138" transform="rotate(60 431 138)">60</text>
                    <text x="461" y="250" transform="rotate(90 461 250)">90</text>
                    <text x="431" y="362" transform="rotate(120 431 362)">120</text>
                    <text x="362" y="431" transform="rotate(150 362 431)">150</text>
                    <text x="250" y="461" transform="rotate(180 250 461)">180</text>
                    <text x="138" y="431" transform="rotate(210 138 431)">210</text>
                    <text x="69" y="362" transform="rotate(240 69 362)">240</text>
                    <text x="39" y="250" transform="rotate(270 39 250)">270</text>
                    <text x="69" y="138" transform="rotate(300 69 138)">300</text>
                    <text x="138" y="69" transform="rotate(330 138 69)">330</text>
                  </g>
                  {/* Cercle séparateur */}
                  <circle cx="250" cy="250" r="215" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.7"/>
                  {/* Losanges inter-cardinaux */}
                  <g fill="#ffffff" opacity="0.55">
                    <polygon points="377,118 382,123 377,128 372,123"/>
                    <polygon points="377,372 382,377 377,382 372,377"/>
                    <polygon points="123,372 128,377 123,382 118,377"/>
                    <polygon points="123,118 128,123 123,128 118,123"/>
                  </g>
                  {/* Lettres cardinales */}
                  <g fontFamily="serif" fontWeight="700" fill="#ffffff" textAnchor="middle" dominantBaseline="middle">
                    <text x="250" y="70" fontSize="44">N</text>
                    <text x="430" y="250" fontSize="38">E</text>
                    <text x="250" y="430" fontSize="38">S</text>
                    <text x="70" y="250" fontSize="38">W</text>
                  </g>
                  {/* Cercle interne */}
                  <circle cx="250" cy="250" r="145" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.45"/>
                  {/* Branches diagonales */}
                  <polygon points="321,179 250,250 244,244" fill="#d8dee8" opacity="0.85"/>
                  <polygon points="321,179 250,250 256,256" fill="#6b7594" opacity="0.75"/>
                  <polygon points="321,321 250,250 256,244" fill="#d8dee8" opacity="0.85"/>
                  <polygon points="321,321 250,250 244,256" fill="#6b7594" opacity="0.75"/>
                  <polygon points="179,321 250,250 256,256" fill="#d8dee8" opacity="0.85"/>
                  <polygon points="179,321 250,250 244,244" fill="#6b7594" opacity="0.75"/>
                  <polygon points="179,179 250,250 244,256" fill="#d8dee8" opacity="0.85"/>
                  <polygon points="179,179 250,250 256,244" fill="#6b7594" opacity="0.75"/>
                  {/* Branches principales */}
                  <polygon points="250,105 250,250 238,238" fill="url(#bv-l)"/>
                  <polygon points="250,105 250,250 262,238" fill="url(#bv-d)"/>
                  <polygon points="250,395 250,250 262,262" fill="url(#bv-l)"/>
                  <polygon points="250,395 250,250 238,262" fill="url(#bv-d)"/>
                  <polygon points="395,250 250,250 262,238" fill="url(#bh-l)"/>
                  <polygon points="395,250 250,250 262,262" fill="url(#bh-d)"/>
                  <polygon points="105,250 250,250 238,262" fill="url(#bh-l)"/>
                  <polygon points="105,250 250,250 238,238" fill="url(#bh-d)"/>
                  {/* Fleur de lys */}
                  <g transform="translate(250, 95)" opacity="0.95">
                    <path d="M 0,-14 L 4,-4 L 0,2 L -4,-4 Z" fill="#ffffff"/>
                    <path d="M -2,-2 Q -10,-8 -8,-14 Q -4,-8 -2,-2 Z" fill="#ffffff" opacity="0.85"/>
                    <path d="M 2,-2 Q 10,-8 8,-14 Q 4,-8 2,-2 Z" fill="#ffffff" opacity="0.85"/>
                    <ellipse cx="0" cy="2" rx="6" ry="1.2" fill="#ffffff"/>
                  </g>
                  {/* Moyeu */}
                  <circle cx="250" cy="250" r="18" fill="url(#hub)"/>
                  <circle cx="250" cy="250" r="18" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.9"/>
                  <circle cx="250" cy="250" r="6" fill="#0a0e27"/>
                </svg>
              </div>

              {/* Slogan principal — bien visible */}
              <div style={{fontSize:18,fontWeight:300,fontStyle:"italic",color:"#fff",lineHeight:1.4,marginBottom:20,maxWidth:320,margin:"0 auto 20px",letterSpacing:"0.3px"}}>
                {L.slogan}
              </div>

              {/* Titre principal */}
              <div style={{fontSize:24,fontWeight:800,color:"#fff",lineHeight:1.3,marginBottom:12}}>
                {L.hero_title}<br/>
                <span style={{color:"#c4b5fd"}}>{L.hero_sub}</span>
              </div>

              {/* Description */}
              <div style={{fontSize:14,color:"rgba(255,255,255,0.75)",lineHeight:1.7,maxWidth:300,margin:"0 auto"}}>{L.hero_desc}</div>
            </div>

            {/* Steps */}
            <div style={{...S.card,padding:"28px 24px",marginBottom:16}}>
              <div style={{fontSize:18,fontWeight:800,color:"#1E293B",marginBottom:20,textAlign:"center"}}>{L.how_title} 👇</div>
              {L.steps.map((s,i)=>(
                <div key={i} style={{display:"flex",gap:16,alignItems:"flex-start",marginBottom:20}}>
                  <div style={{width:48,height:48,borderRadius:16,background:["#EDE9FE","#E0F2FE","#ECFDF5"][i],display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{s.e}</div>
                  <div>
                    <div style={{fontSize:15,fontWeight:800,color:"#1E293B",marginBottom:3}}>{s.t}</div>
                    <div style={{fontSize:14,color:"#64748B",lineHeight:1.6}}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Destinations */}
            <div style={{...S.card,padding:"28px 24px",marginBottom:16}}>
              <div style={{fontSize:18,fontWeight:800,color:"#1E293B",marginBottom:16,textAlign:"center"}}>🗺️</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[
                  {emoji:"🏖️",lieu:L.terrain.coast,desc:L.terrain_tag.coast,bg:"#ECFDF5",col:"#059669"},
                  {emoji:"🥾",lieu:L.terrain.hiking,desc:L.terrain_tag.hiking,bg:"#FEF9C3",col:"#CA8A04"},
                  {emoji:"🍽️",lieu:L.terrain.food,desc:L.terrain_tag.food,bg:"#FFE4E6",col:"#BE123C"},
                  {emoji:"🏛️",lieu:L.terrain.culture,desc:L.terrain_tag.culture,bg:"#E0E7FF",col:"#4338CA"},
                  {emoji:"📸",lieu:L.terrain.view,desc:L.terrain_tag.view,bg:"#E0F2FE",col:"#0284C7"},
                  {emoji:"👨‍👩‍👧",lieu:L.terrain.family,desc:L.terrain_tag.family,bg:"#F3E8FF",col:"#7C3AED"},
                ].map(d=>(
                  <div key={d.lieu} style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",gap:6,background:d.bg,borderRadius:14,padding:"16px 10px"}}>
                    <div style={{fontSize:30,lineHeight:1}}>{d.emoji}</div>
                    <div style={{fontSize:13,fontWeight:800,color:"#1E293B",lineHeight:1.2}}>{d.lieu}</div>
                    <div style={{fontSize:11,color:"#64748B",lineHeight:1.4}}>{d.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA final */}
            <div style={{background:"linear-gradient(135deg,#533483,#7c3aed)",borderRadius:20,padding:"28px 24px",textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:28,marginBottom:8}}>🧭</div>
              <div style={{fontSize:18,fontWeight:800,color:"#fff",marginBottom:16}}>{L.cta_final}</div>
              <div style={{display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap"}}>
                {["🏖️","🥾","🍽️","🏛️","📸","👨‍👩‍👧"].map(tag=>(
                  <span key={tag} style={{background:"rgba(255,255,255,0.15)",color:"#fff",padding:"6px 14px",borderRadius:999,fontSize:16}}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div style={{textAlign:"center",fontSize:12,color:"#94A3B8",marginTop:8,lineHeight:1.8}}>
          <div style={{fontWeight:700,color:"#533483",fontSize:14,marginBottom:4}}>Aéria</div>
          <div>Open-Meteo · CC BY 4.0</div>
          <div style={{marginTop:4}}>🌍 {Object.keys(LANGUAGES).length} languages · {Object.keys(LANGUAGES).map(l=>LANGUAGES[l].flag).join(" ")}</div>
        </div>
      </div>
    </div>
  );
}
