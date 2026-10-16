/**
 * Lugares Históricos, Esculturas y Monumentos de La Para (Córdoba)
 * Base de datos del proyecto escolar
 */

const LUGARES_LA_PARA = [
  {
    id: "monumento-cura-brochero",
    nombre: "Monumento al Santo Cura Brochero",
    categoria: "esculturas",
    etiqueta: "Escultura en 360° - Plazoleta Cura Gaucho",
    icono: "🐴",
    color: "#b45309",
    coordenadas: { lat: -30.8935, lng: -62.9970 },
    direccion: "Plazoleta Cura Gaucho José Gabriel Brochero, La Para",
    investigadores: "Alumnos del Proyecto Escolar - Relevamiento Fotográfico 360°",
    descripcionCorta: "Monumento al Cura Gaucho sobre su mula Malacara, emplazado sobre un imponente pedestal de piedras rústicas.",
    descripcionLarga: "Monumento en homenaje a San José Gabriel del Rosario Brochero ('El Cura Gaucho'), el Santo Argentino. La escultura representa al párroco montando su fiel mula Malacara sobre una base de rocas serranas. Los alumnos realizaron un relevamiento fotográfico secuencial de 27 tomas continuas para permitir a la comunidad girar e inspeccionar la obra en 360°.",
    fotos360: {
      basePath: "img/brochero/",
      totalFrames: 27,
      extension: ".jpg"
    },
    streetView: {
      lat: -30.8935,
      lng: -62.9970,
      heading: 40,
      pitch: 5
    },
    canvaEmbedUrl: "",
    diapositivas: [
      {
        titulo: "1. El Santo de las Sierras",
        contenido: "José Gabriel Brochero (1840-1914), primer santo que nació, vivió y falleció en Argentina. Dedicó su vida a las comunidades postergadas, abriendo caminos, acueductos y escuelas a lomo de mula.",
        pie: "Diapositiva 1 de 3 - Historia del Santo Argentino"
      },
      {
        titulo: "2. La Mula 'Malacara'",
        contenido: "La escultura lo retrata junto a su inseparable mula, su medio de transporte incansable para cruzar las Altas Cumbres cordobesas bajo tormentas y nevadas.",
        pie: "Diapositiva 2 de 3 - Simbolismo e Iconografía"
      },
      {
        titulo: "3. La Plazoleta en La Para",
        contenido: "La placa inaugural conmemora la bendición de este espacio de encuentro espiritual y cívico para todas las familias de La Para.",
        pie: "Diapositiva 3 de 3 - Placa y Monumento Local"
      }
    ]
  },
  {
    id: "parque-pleistoceno",
    nombre: "Parque Pleistoceno - Megafauna de Ansenuza",
    categoria: "esculturas",
    etiqueta: "Megafauna y Réplicas Paleontológicas",
    icono: "🦣",
    color: "#d97706",
    coordenadas: { lat: -30.89287, lng: -62.99900 },
    direccion: "Av. Belgrano (Predio del Lago Recreativo Municipal)",
    investigadores: "Alumnos de 4to y 5to Año",
    descripcionCorta: "Esculturas a escala real de los gigantes prehistóricos que habitaron la región de Ansenuza.",
    descripcionLarga: "El Parque Pleistocénico Ansenuza es un espacio al aire libre único en la región, situado en el predio del lago recreativo de La Para. Presenta réplicas a escala 1:1 de la megafauna que habitó estas tierras hace más de 10.000 años: Gliptodontes (armadillos gigantes), Smilodon (tigre dientes de sable) y Megaterio (perezoso gigante).",
    streetView: {
      lat: -30.89287,
      lng: -62.99900,
      heading: 35,
      pitch: 5
    },
    canvaEmbedUrl: "",
    diapositivas: [
      {
        titulo: "1. Gigantes en la Laguna de Ansenuza",
        contenido: "Durante la época del Pleistoceno, los pastizales y humedales de Ansenuza albergaban mamíferos colosales que pesaban varias toneladas.",
        pie: "Diapositiva 1 de 3 - Investigación de Alumnos"
      },
      {
        titulo: "2. Fósiles Hallados en la Zona",
        contenido: "En las costas y arroyos de la región de Ansenuza se han hallado placas de caparazones óseos de Gliptodonte y colmillos milenarios.",
        pie: "Diapositiva 2 de 3 - Paleontología Local"
      },
      {
        titulo: "3. Creación de las Esculturas",
        contenido: "Fueron modeladas con exactitud anatómica utilizando estructuras de hierro y resinas para resistir el clima al aire libre.",
        pie: "Diapositiva 3 de 3 - Arte y Patrimonio"
      }
    ]
  },
  {
    id: "plazoleta-malvinas",
    nombre: "Plazoleta Islas Malvinas",
    categoria: "monumentos",
    etiqueta: "Monumento y Muro de Piedra",
    icono: "🗿",
    color: "#2563eb",
    coordenadas: { lat: -30.89025, lng: -62.99645 },
    direccion: "Plazoleta Islas Malvinas, La Para",
    investigadores: "Alumnos de 3er Año",
    descripcionCorta: "Muro conmemorativo de piedra natural y mástil en homenaje a los héroes de Malvinas.",
    descripcionLarga: "Espacio público de recogimiento y homenaje a los veteranos y caídos en el conflicto de 1982. Destaca su muro curvo de piedra natural autóctona, sus placas conmemorativas y el mástil ceremonial donde cada 2 de abril se congrega el pueblo de La Para.",
    streetView: {
      lat: -30.89025,
      lng: -62.99645,
      heading: 25,
      pitch: 2
    },
    canvaEmbedUrl: "",
    diapositivas: [
      {
        titulo: "1. Espacio de Memoria Activa",
        contenido: "La plazoleta es el lugar de conmemoración oficial y reflexión sobre la causa Malvinas para toda la comunidad.",
        pie: "Diapositiva 1 de 2 - Soberanía y Memoria"
      },
      {
        titulo: "2. La Fuerza de la Piedra",
        contenido: "El muro de piedra rústica simboliza la fortaleza y constancia de nuestro pueblo en el reclamo pacífico de memoria.",
        pie: "Diapositiva 2 de 2 - Simbolismo Monumental"
      }
    ]
  },
  {
    id: "estacion-ferrocarril",
    nombre: "Museo Histórico Municipal (Ex Estación)",
    categoria: "historico",
    etiqueta: "Patrimonio Ferroviario y Origen de La Para",
    icono: "🏛️",
    color: "#059669",
    coordenadas: { lat: -30.89185, lng: -62.99750 },
    direccion: "Predio del Ferrocarril Belgrano, La Para",
    investigadores: "Alumnos de 2do y 4to Año",
    descripcionCorta: "Edificio fundacional del ferrocarril de 1911, actual museo con objetos históricos.",
    descripcionLarga: "El 1 de octubre de 1911, la habilitación de esta estación ferroviaria marcó el hito de nacimiento de La Para. Conserva las galerías y techos originales de estilo ferroviario inglés, albergando una rica colección de fotografías de familias pioneras, herramientas de campo y telégrafos.",
    streetView: {
      lat: -30.89185,
      lng: -62.99750,
      heading: 105,
      pitch: 5
    },
    canvaEmbedUrl: "",
    diapositivas: [
      {
        titulo: "1. La Llegada del Tren (1911)",
        contenido: "El Ferrocarril Central Norte conectó a La Para con el resto del país, dinamizando la agricultura y la población.",
        pie: "Diapositiva 1 de 3 - Origen del Pueblo"
      },
      {
        titulo: "2. Arquitectura Ferroviaria",
        contenido: "Fachada de ladrillo a la vista, tirantes de madera dura y la campana histórica conservada intacta.",
        pie: "Diapositiva 2 de 3 - Arquitectura Patrimonial"
      },
      {
        titulo: "3. Las Salas del Museo",
        contenido: "Objetos de época donados por vecinos que permiten a las nuevas generaciones conocer la vida de sus abuelos.",
        pie: "Diapositiva 3 de 3 - Acervo Cultural"
      }
    ]
  },
  {
    id: "plaza-san-martin",
    nombre: "Plaza Central San Martín",
    categoria: "monumentos",
    etiqueta: "Centro Cívico y Busto al Libertador",
    icono: "🌳",
    color: "#7c3aed",
    coordenadas: { lat: -30.88950, lng: -62.99850 },
    direccion: "Rivadavia y Sarmiento, La Para",
    investigadores: "Alumnos de 1er Año",
    descripcionCorta: "Plaza principal de La Para, punto de encuentro social y cultural con arboleda autóctona.",
    descripcionLarga: "La Plaza San Martín es el corazón cívico de La Para. Rodeada por la Parroquia y edificios públicos, cuenta con senderos arbolados, bancos de descanso y el busto de bronce en homenaje al General Don José de San Martín.",
    streetView: {
      lat: -30.88950,
      lng: -62.99850,
      heading: 180,
      pitch: 0
    },
    canvaEmbedUrl: "",
    diapositivas: [
      {
        titulo: "1. El Pulmón del Pueblo",
        contenido: "Diseño clásico con diagonales sombreadas por tipas y lapachos floridos.",
        pie: "Diapositiva 1 de 2 - Espacio Social"
      },
      {
        titulo: "2. Homenaje a San Martín",
        contenido: "Monumento patrio central que preside las conmemoraciones y desfiles cívicos anuales.",
        pie: "Diapositiva 2 de 2 - Monumento"
      }
    ]
  }
];