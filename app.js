/**
 * Lógica Principal - Mapa Interactivo de La Para (Córdoba)
 * 
 * Google Maps JavaScript API + Visor 360° con Zoom + Baliza Interactiva en Street View
 */

const DEFAULT_KEY = "AIzaSyCEN528g-ocZD_m1zBaslNt93X8kpfMXlw";
const GOOGLE_MAPS_API_KEY = DEFAULT_KEY;

// Centro de La Para (Córdoba, Argentina)
const LA_PARA_CENTER = { lat: -30.8912, lng: -62.9980 };

// Variables globales de estado
let map = null;
let streetViewPano = null;
let markers = [];
let currentPlace = null;
let currentSlideIndex = 0;

// Estado del Visor 360° con Zoom
let viewer360State = {
  currentFrame: 1,
  totalFrames: 27,
  isDragging: false,
  startX: 0,
  startFrame: 1,
  autoSpinInterval: null,
  preloadedImages: [],
  zoomLevel: 1.0,
  minZoom: 1.0,
  maxZoom: 3.5,
  initialPinchDistance: null
};

// Manejador oficial de fallo de autenticación de Google Maps
window.gm_authFailure = function() {
  console.warn("Fallo de autenticación en Google Maps");
  mostrarAvisoApiPendiente();
};

// Cargador oficial de Google Maps Platform
(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
  key: GOOGLE_MAPS_API_KEY,
  v: "weekly"
});

/**
 * Inicialización de la aplicación
 */
async function initApp() {
  try {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    map = new Map(document.getElementById("map"), {
      center: LA_PARA_CENTER,
      zoom: 16,
      mapId: "DEMO_MAP_ID",
      mapTypeControl: true,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_LEFT
      },
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
      }
    });

    renderMarkers(AdvancedMarkerElement);
    setupEventListeners();
    setup360Viewer();

  } catch (error) {
    console.error("Error al inicializar mapa:", error);
    mostrarAvisoApiPendiente(error.message);
  }
}

/**
 * Renderiza los marcadores personalizados
 */
function renderMarkers(AdvancedMarkerElement) {
  markers.forEach(m => m.element.map = null);
  markers = [];

  LUGARES_LA_PARA.forEach(lugar => {
    const markerDiv = document.createElement("div");
    markerDiv.className = "custom-marker";
    markerDiv.style.borderColor = lugar.color;
    markerDiv.innerHTML = `<span class="marker-icon">${lugar.icono}</span>`;
    markerDiv.setAttribute("title", lugar.nombre);

    markerDiv.addEventListener("click", (e) => {
      e.stopPropagation();
      abrirModal(lugar);
    });

    const marker = new AdvancedMarkerElement({
      map: map,
      position: lugar.coordenadas,
      title: lugar.nombre,
      content: markerDiv
    });

    markers.push({
      data: lugar,
      element: marker
    });
  });
}

/**
 * Abre el modal con la ficha del monumento, el visor 360° y Canva
 */
function abrirModal(lugar) {
  currentPlace = lugar;
  currentSlideIndex = 0;

  document.getElementById("modal-title").textContent = lugar.nombre;
  document.getElementById("modal-badge-cat").textContent = lugar.etiqueta;
  document.getElementById("modal-badge-cat").style.color = lugar.color;
  document.getElementById("modal-badge-students").textContent = lugar.investigadores;
  document.getElementById("modal-address").textContent = `📍 ${lugar.direccion}`;
  document.getElementById("modal-description").textContent = lugar.descripcionLarga;

  const tab360 = document.getElementById("tab-btn-360");
  const tabCanva = document.getElementById("tab-btn-canva");
  const section360 = document.getElementById("section-360");
  const sectionCanva = document.getElementById("section-canva");

  if (lugar.fotos360) {
    tab360.style.display = "flex";
    tab360.classList.add("active");
    tabCanva.classList.remove("active");
    section360.style.display = "flex";
    sectionCanva.style.display = "none";

    iniciarFotos360(lugar.fotos360);
  } else {
    tab360.style.display = "none";
    tabCanva.classList.add("active");
    section360.style.display = "none";
    sectionCanva.style.display = "block";
    detenerGiroAutomatico();
  }

  const frameContainer = document.getElementById("canva-interactive-frame");
  if (lugar.canvaEmbedUrl && lugar.canvaEmbedUrl.trim() !== "") {
    frameContainer.innerHTML = `
      <iframe class="canva-iframe" src="${lugar.canvaEmbedUrl}" allowfullscreen="allowfullscreen" allow="fullscreen"></iframe>
    `;
    document.getElementById("slide-indicator").textContent = "Presentación Oficial";
  } else {
    actualizarDiapositiva();
  }

  const modal = document.getElementById("modal-overlay");
  modal.classList.add("active");

  if (map && lugar.coordenadas) {
    map.panTo(lugar.coordenadas);
  }
}

function cerrarModal() {
  const modal = document.getElementById("modal-overlay");
  modal.classList.remove("active");
  detenerGiroAutomatico();
}

/**
 * Lógica del Visor 360° Interactivo con Zoom
 */
function iniciarFotos360(config) {
  detenerGiroAutomatico();
  viewer360State.totalFrames = config.totalFrames || 27;
  viewer360State.currentFrame = 1;
  setZoom(1.0);

  const slider = document.getElementById("slider-360");
  slider.min = 1;
  slider.max = viewer360State.totalFrames;
  slider.value = 1;

  viewer360State.preloadedImages = [];
  for (let i = 1; i <= viewer360State.totalFrames; i++) {
    const img = new Image();
    img.src = `${config.basePath}${i}${config.extension}`;
    viewer360State.preloadedImages.push(img);
  }

  mostrarFrame360(1);
}

function mostrarFrame360(frameNumber) {
  if (frameNumber < 1) frameNumber = viewer360State.totalFrames;
  if (frameNumber > viewer360State.totalFrames) frameNumber = 1;

  viewer360State.currentFrame = frameNumber;

  const imgElement = document.getElementById("viewer-360-img");
  if (currentPlace && currentPlace.fotos360) {
    const cfg = currentPlace.fotos360;
    imgElement.src = `${cfg.basePath}${frameNumber}${cfg.extension}`;
  }

  document.getElementById("slider-360").value = frameNumber;
  document.getElementById("label-360-counter").textContent = `Foto ${frameNumber} de ${viewer360State.totalFrames}`;
}

/**
 * Manejo del Zoom en la imagen 360°
 */
function setZoom(newZoom) {
  newZoom = Math.max(viewer360State.minZoom, Math.min(viewer360State.maxZoom, newZoom));
  viewer360State.zoomLevel = Math.round(newZoom * 10) / 10;

  const img = document.getElementById("viewer-360-img");
  if (img) {
    img.style.transform = `scale(${viewer360State.zoomLevel})`;
  }

  const label = document.getElementById("zoom-level-label");
  if (label) {
    label.textContent = `${viewer360State.zoomLevel.toFixed(1)}x`;
  }
}

function setup360Viewer() {
  const stage = document.getElementById("stage-360");
  const slider = document.getElementById("slider-360");
  const btnAuto = document.getElementById("btn-auto-spin");

  // Botones de Zoom
  document.getElementById("btn-zoom-in")?.addEventListener("click", (e) => {
    e.stopPropagation();
    setZoom(viewer360State.zoomLevel + 0.3);
  });

  document.getElementById("btn-zoom-out")?.addEventListener("click", (e) => {
    e.stopPropagation();
    setZoom(viewer360State.zoomLevel - 0.3);
  });

  document.getElementById("btn-zoom-reset")?.addEventListener("click", (e) => {
    e.stopPropagation();
    setZoom(1.0);
  });

  // Zoom con la rueda del mouse
  stage.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    setZoom(viewer360State.zoomLevel + delta);
  }, { passive: false });

  // Arrastre con Mouse
  stage.addEventListener("mousedown", (e) => {
    detenerGiroAutomatico();
    viewer360State.isDragging = true;
    viewer360State.startX = e.clientX;
    viewer360State.startFrame = viewer360State.currentFrame;
    stage.classList.add("dragging");
  });

  window.addEventListener("mousemove", (e) => {
    if (!viewer360State.isDragging) return;
    const deltaX = e.clientX - viewer360State.startX;
    // Sensibilidad adaptada al nivel de zoom
    const sensitivity = Math.max(8, Math.floor(12 / Math.sqrt(viewer360State.zoomLevel)));
    const frameOffset = Math.floor(deltaX / sensitivity);
    let newFrame = viewer360State.startFrame + frameOffset;

    const total = viewer360State.totalFrames;
    newFrame = ((newFrame - 1) % total + total) % total + 1;
    mostrarFrame360(newFrame);
  });

  window.addEventListener("mouseup", () => {
    if (viewer360State.isDragging) {
      viewer360State.isDragging = false;
      stage.classList.remove("dragging");
    }
  });

  // Soporte Táctil: Arrastre y Pellizco (Pinch to Zoom)
  stage.addEventListener("touchstart", (e) => {
    detenerGiroAutomatico();
    if (e.touches.length === 1) {
      viewer360State.isDragging = true;
      viewer360State.startX = e.touches[0].clientX;
      viewer360State.startFrame = viewer360State.currentFrame;
      stage.classList.add("dragging");
    } else if (e.touches.length === 2) {
      // Inicio de gesto pellizco
      viewer360State.isDragging = false;
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      viewer360State.initialPinchDistance = dist;
    }
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (e.touches.length === 1 && viewer360State.isDragging) {
      const deltaX = e.touches[0].clientX - viewer360State.startX;
      const frameOffset = Math.floor(deltaX / 10);
      let newFrame = viewer360State.startFrame + frameOffset;

      const total = viewer360State.totalFrames;
      newFrame = ((newFrame - 1) % total + total) % total + 1;
      mostrarFrame360(newFrame);
    } else if (e.touches.length === 2 && viewer360State.initialPinchDistance) {
      // Zoom por pellizco
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / viewer360State.initialPinchDistance;
      if (ratio > 1.05) {
        setZoom(viewer360State.zoomLevel + 0.1);
        viewer360State.initialPinchDistance = dist;
      } else if (ratio < 0.95) {
        setZoom(viewer360State.zoomLevel - 0.1);
        viewer360State.initialPinchDistance = dist;
      }
    }
  }, { passive: true });

  window.addEventListener("touchend", () => {
    viewer360State.isDragging = false;
    viewer360State.initialPinchDistance = null;
    stage.classList.remove("dragging");
  });

  slider.addEventListener("input", (e) => {
    detenerGiroAutomatico();
    mostrarFrame360(parseInt(e.target.value, 10));
  });

  btnAuto.addEventListener("click", () => {
    if (viewer360State.autoSpinInterval) {
      detenerGiroAutomatico();
    } else {
      iniciarGiroAutomatico();
    }
  });
}

function iniciarGiroAutomatico() {
  const btnAuto = document.getElementById("btn-auto-spin");
  btnAuto.textContent = "⏸ Pausar Giro";
  btnAuto.style.background = "#0284c7";

  viewer360State.autoSpinInterval = setInterval(() => {
    let next = viewer360State.currentFrame + 1;
    if (next > viewer360State.totalFrames) next = 1;
    mostrarFrame360(next);
  }, 110);
}

function detenerGiroAutomatico() {
  if (viewer360State.autoSpinInterval) {
    clearInterval(viewer360State.autoSpinInterval);
    viewer360State.autoSpinInterval = null;
    const btnAuto = document.getElementById("btn-auto-spin");
    if (btnAuto) {
      btnAuto.textContent = "▶ Giro Automático";
      btnAuto.style.background = "#334155";
    }
  }
}

/**
 * Canva y Diapositivas
 */
function actualizarDiapositiva() {
  if (!currentPlace || !currentPlace.diapositivas) return;

  const diapositivas = currentPlace.diapositivas;
  const slide = diapositivas[currentSlideIndex];

  document.getElementById("slide-title").textContent = slide.titulo;
  document.getElementById("slide-body").textContent = slide.contenido;
  document.getElementById("slide-note").textContent = slide.pie;
  document.getElementById("slide-indicator").textContent = `Diapositiva ${currentSlideIndex + 1} de ${diapositivas.length}`;
}

/**
 * Street View 360° con Objetivo/Baliza Interactiva
 */
function abrirStreetView() {
  if (!currentPlace || !currentPlace.streetView) return;

  cerrarModal();

  document.getElementById("streetview-title").textContent = currentPlace.nombre;
  document.getElementById("streetview-subtitle").textContent = `Orientado hacia: ${currentPlace.etiqueta}`;

  const overlay = document.getElementById("streetview-overlay");
  overlay.classList.add("active");

  // Configuramos la baliza interactiva en Street View
  const targetBadge = document.getElementById("streetview-monument-target");
  if (currentPlace.fotos360) {
    targetBadge.style.display = "flex";
    document.getElementById("target-badge-icon").textContent = currentPlace.icono || "🗿";
    document.getElementById("target-badge-title").textContent = currentPlace.nombre;
  } else {
    targetBadge.style.display = "none";
  }

  const panoElement = document.getElementById("street-view-pano");
  const svConfig = currentPlace.streetView;

  if (typeof google !== "undefined" && google.maps && google.maps.StreetViewPanorama) {
    streetViewPano = new google.maps.StreetViewPanorama(panoElement, {
      position: { lat: svConfig.lat, lng: svConfig.lng },
      pov: {
        heading: svConfig.heading || 0,
        pitch: svConfig.pitch || 0
      },
      zoom: 1,
      addressControl: true,
      linksControl: true,
      panControl: true,
      enableCloseButton: false
    });
  }
}

function cerrarStreetView() {
  const overlay = document.getElementById("streetview-overlay");
  overlay.classList.remove("active");

  if (map && currentPlace) {
    map.panTo(currentPlace.coordenadas);
    map.setZoom(17);
  }
}

/**
 * Event Listeners Generales
 */
function setupEventListeners() {
  document.getElementById("modal-close-btn")?.addEventListener("click", cerrarModal);
  document.getElementById("modal-overlay")?.addEventListener("click", (e) => {
    if (e.target.id === "modal-overlay") cerrarModal();
  });

  document.getElementById("btn-open-streetview")?.addEventListener("click", abrirStreetView);
  document.getElementById("btn-close-streetview")?.addEventListener("click", cerrarStreetView);

  // Clic en la baliza/objetivo flotante de Street View -> Entra al 360° del objeto!
  document.getElementById("streetview-monument-target")?.addEventListener("click", () => {
    cerrarStreetView();
    if (currentPlace) {
      abrirModal(currentPlace);
    }
  });

  // Pestañas
  document.getElementById("tab-btn-360")?.addEventListener("click", () => {
    document.getElementById("tab-btn-360").classList.add("active");
    document.getElementById("tab-btn-canva").classList.remove("active");
    document.getElementById("section-360").style.display = "flex";
    document.getElementById("section-canva").style.display = "none";
  });

  document.getElementById("tab-btn-canva")?.addEventListener("click", () => {
    document.getElementById("tab-btn-canva").classList.add("active");
    document.getElementById("tab-btn-360").classList.remove("active");
    document.getElementById("section-canva").style.display = "block";
    document.getElementById("section-360").style.display = "none";
    detenerGiroAutomatico();
  });

  // Diapositivas
  document.getElementById("btn-prev-slide")?.addEventListener("click", () => {
    if (!currentPlace || !currentPlace.diapositivas) return;
    if (currentSlideIndex > 0) {
      currentSlideIndex--;
      actualizarDiapositiva();
    }
  });

  document.getElementById("btn-next-slide")?.addEventListener("click", () => {
    if (!currentPlace || !currentPlace.diapositivas) return;
    if (currentSlideIndex < currentPlace.diapositivas.length - 1) {
      currentSlideIndex++;
      actualizarDiapositiva();
    }
  });

  // Buscador
  const searchInput = document.getElementById("search-input");
  searchInput?.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    filtrarLugares(query, obtenerCategoriaActiva());
  });

  // Filtros
  const chips = document.querySelectorAll(".chip-btn");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const cat = chip.dataset.cat;
      const query = searchInput.value.toLowerCase().trim();
      filtrarLugares(query, cat);
    });
  });
}

function obtenerCategoriaActiva() {
  const activeChip = document.querySelector(".chip-btn.active");
  return activeChip ? activeChip.dataset.cat : "all";
}

function filtrarLugares(query, categoria) {
  let primerCoincidencia = null;

  markers.forEach(item => {
    const matchCat = (categoria === "all" || item.data.categoria === categoria);
    const matchQuery = !query || 
      item.data.nombre.toLowerCase().includes(query) ||
      item.data.descripcionCorta.toLowerCase().includes(query) ||
      item.data.descripcionLarga.toLowerCase().includes(query) ||
      item.data.etiqueta.toLowerCase().includes(query);

    const visible = matchCat && matchQuery;
    item.element.map = visible ? map : null;

    if (visible && !primerCoincidencia) {
      primerCoincidencia = item.data;
    }
  });

  if (query && primerCoincidencia && map) {
    map.panTo(primerCoincidencia.coordenadas);
  }
}

function mostrarAvisoApiPendiente() {
  const mapDiv = document.getElementById("map");
  if (!mapDiv) return;

  mapDiv.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 24px; background: #f8fafc; font-family: sans-serif;">
      <div style="max-width: 650px; background: #ffffff; border-radius: 16px; padding: 28px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
          <span style="font-size: 32px;">🐴</span>
          <div>
            <h2 style="font-size: 19px; color: #1e293b; margin: 0;">¡Fotos 360° con Zoom y Street View listas!</h2>
            <span style="font-size: 13px; color: #b45309; font-weight: 600;">Monumento al Santo Cura Brochero integrado</span>
          </div>
        </div>

        <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 16px;">
          Sumamos controles de Zoom (1.0x a 3.5x, rueda del mouse y pellizco táctil) y el punto interactivo flotante dentro de Street View.
        </p>

        <div style="text-align: center; margin: 20px 0;">
          <button id="btn-probar-demo" style="background: #b45309; color: #ffffff; border: none; padding: 12px 24px; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(180, 83, 9, 0.3);">
            🔄 Probar Giro 360° con Zoom 👉
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("btn-probar-demo")?.addEventListener("click", () => {
    abrirModal(LUGARES_LA_PARA[0]);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  initApp();
});