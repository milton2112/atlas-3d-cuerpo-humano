import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  digestiveRecapPoints,
  modelAudit,
  systemLessonSections,
  organHotspots,
  organInfo,
  organStudyInfo,
  systemConfig,
  systemDetails,
  systemOrder,
} from "./data.js?v=20260502-digestive-finish-1";

const MODEL_VERSION = "20260502-digestive-finish-1";
const MODEL_BASE_PATH = "./assets/models";
const THUMBNAIL_BASE_PATH = "./assets/thumbnails";
const THUMBNAIL_KEYS = new Set();
const MODEL_FILES = {
  integumentary: "integumentary.glb",
  skeletal: "skeletal.glb",
  muscular: "muscular.glb",
  nervous: "nervous.glb",
  circulatory: "circulatory.glb",
  respiratory: "respiratory.glb",
  digestive: "digestive.glb",
  urinary: "urinary.glb",
  endocrine: "endocrine.glb",
  lymphatic: null,
  reproductiveMale: "reproductive-male.glb",
  reproductiveFemale: "reproductive-female.glb",
};
const REAL_MODEL_KEYS = new Set(Object.entries(MODEL_FILES).filter(([, file]) => Boolean(file)).map(([key]) => key));
const CAMERA_CONFIG = {
  integumentary: { zoom: 0.72, y: 0.04, maxDistance: 8.5 },
  skeletal: { zoom: 0.74, y: 0.05, maxDistance: 8.5 },
  muscular: { zoom: 0.7, y: 0.05, maxDistance: 8.5 },
  nervous: { zoom: 0.78, y: 0.05, maxDistance: 8.8 },
  circulatory: { zoom: 0.78, y: 0.04, maxDistance: 8.8 },
  respiratory: { zoom: 0.6, y: 0.02, maxDistance: 7 },
  digestive: { zoom: 1, previewZoom: 1.26, y: 0.02, maxDistance: 12 },
  urinary: { zoom: 1.02, previewZoom: 1.34, y: 0.02, maxDistance: 12 },
  endocrine: { zoom: 0.54, y: 0.02, maxDistance: 6.5 },
  lymphatic: { zoom: 0.62, y: 0.02, maxDistance: 7 },
  reproductiveMale: { zoom: 0.54, y: 0.02, maxDistance: 6.5 },
  reproductiveFemale: { zoom: 0.54, y: 0.02, maxDistance: 6.5 },
};
const MODEL_ROTATION_CONFIG = {
  reproductiveFemale: { y: -Math.PI / 2 },
};
const PRESERVE_SOURCE_MATERIAL_KEYS = new Set(["digestive", "urinary", "reproductiveFemale"]);
const DEFERRED_MENU_PREVIEW_KEYS = new Set(["nervous", "circulatory", "urinary"]);
const COMPACT_VIEWPORT_QUERY = "(max-width: 768px)";
const MATERIAL_NAME_COLORS = {
  urinary: [
    { match: "kidney", color: "#8d250f" },
    { match: "ureter", color: "#f0c890" },
    { match: "gland", color: "#caa16b" },
    { match: "bladder", color: "#d58c91" },
  ],
  reproductiveFemale: [
    { match: "uterus", color: "#b94c5e" },
    { match: "womb", color: "#b94c5e" },
    { match: "ovaries", color: "#f08a6c" },
    { match: "tube", color: "#f08a6c" },
  ],
};

function isCompactViewport() {
  return window.matchMedia(COMPACT_VIEWPORT_QUERY).matches;
}

function getPreviewPixelRatio() {
  return isCompactViewport() ? 0.8 : 1;
}

function getDetailPixelRatio() {
  const dpr = window.devicePixelRatio || 1;
  if (isCompactViewport()) return Math.min(dpr, 0.9);
  if (window.innerWidth <= 1100) return Math.min(dpr, 1);
  return Math.min(dpr, 1.25);
}

const gallery = document.querySelector("#systems-gallery");
const heroCard = document.querySelector(".hero-card");
const atlasTools = document.querySelector(".atlas-tools");
const organSearch = document.querySelector("#organ-search");
const searchResults = document.querySelector("#search-results");
const quickIndex = document.querySelector("#quick-index");
const detailView = document.querySelector("#system-detail");
const detailStage = document.querySelector("#detail-stage");
const modelStatus = document.querySelector("#model-status");
const detailTitle = document.querySelector("#detail-title");
const detailSummary = document.querySelector("#detail-summary");
const detailDescription = document.querySelector("#detail-description");
const detailModelNote = document.querySelector("#detail-model-note");
const detailLookSection = document.querySelector("#detail-look-section");
const detailFunctionSection = document.querySelector("#detail-function-section");
const detailLookList = document.querySelector("#detail-look-list");
const digestiveProcess = document.querySelector("#digestive-process");
const digestiveSystemIntro = document.querySelector("#digestive-system-intro");
const digestiveSystemIntroList = document.querySelector("#digestive-system-intro-list");
const digestiveGuide = document.querySelector("#digestive-guide");
const digestiveProcessList = document.querySelector("#digestive-process-list");
const digestiveSequenceButton = document.querySelector("#digestive-sequence");
const digestiveClassButton = document.querySelector("#digestive-class");
const digestiveCopyLinkButton = document.querySelector("#digestive-copy-link");
const openDigestiveModalButton = document.querySelector("#open-digestive-modal");
const openDigestiveClassButton = document.querySelector("#open-digestive-class");
const digestiveModal = document.querySelector("#digestive-modal");
const closeDigestiveModalButton = document.querySelector("#close-digestive-modal");
const digestiveClassroom = document.querySelector("#digestive-classroom");
const digestiveClassStep = document.querySelector("#digestive-class-step");
const digestiveClassTitle = document.querySelector("#digestive-class-title");
const digestiveClassSummary = document.querySelector("#digestive-class-summary");
const digestiveClassFigure = document.querySelector("#digestive-class-figure");
const digestiveClassBullets = document.querySelector("#digestive-class-bullets");
const digestiveClassPrev = document.querySelector("#digestive-class-prev");
const digestiveClassNext = document.querySelector("#digestive-class-next");
const detailFunction = document.querySelector("#detail-function");
const detailOrgans = document.querySelector("#detail-organs");
const detailKeyFact = document.querySelector("#detail-key-fact");
const detailQuestion = document.querySelector("#detail-question");
const detailMiniSummary = document.querySelector("#detail-mini-summary");
const detailThinking = document.querySelector("#detail-thinking");
const learningCards = document.querySelector(".learning-cards");
const organPanel = document.querySelector("#organ-panel");
const organTitle = document.querySelector("#organ-title");
const organDescription = document.querySelector("#organ-description");
const organLocation = document.querySelector("#organ-location");
const organFunction = document.querySelector("#organ-function");
const organKeyFact = document.querySelector("#organ-key-fact");
const backButton = document.querySelector("#back-to-gallery");
const startTourButton = document.querySelector("#start-tour");
const fullscreenButton = document.querySelector("#fullscreen-button");
const tourBanner = document.querySelector("#tour-banner");
const tourTitle = document.querySelector("#tour-title");
const tourCopy = document.querySelector("#tour-copy");
const tourProgressBar = document.querySelector("#tour-progress-bar");
const tourPrev = document.querySelector("#tour-prev");
const tourNext = document.querySelector("#tour-next");
const tourExit = document.querySelector("#tour-exit");
const tourComplete = document.querySelector("#tour-complete");
const completeMenu = document.querySelector("#complete-menu");
const completeRestart = document.querySelector("#complete-restart");
const tourSummaryList = document.querySelector("#tour-summary-list");
const viewFullButton = document.querySelector("#view-full");
const viewModelButton = document.querySelector("#view-model");
const viewSheetButton = document.querySelector("#view-sheet");
const copySystemLinkButton = document.querySelector("#copy-system-link");

const loader = new GLTFLoader();
const viewers = new Set();
const previewObserver =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.__loadPreview?.();
            previewObserver.unobserve(entry.target);
          });
        },
        { rootMargin: "360px" },
      )
    : null;
let detailViewer = null;
let tourActive = false;
let currentSystemKey = systemOrder[0];
let detailOpenToken = 0;
let digestiveLessonMode = "sequence";
let digestiveLessonIndex = 0;

buildSystemGallery();
buildQuickIndex();
bindEvents();
applyInitialRoute();

function bindEvents() {
  backButton?.addEventListener("click", closeSystemDetail);
  startTourButton?.addEventListener("click", startGuidedTour);
  fullscreenButton?.addEventListener("click", toggleFullscreen);
  tourPrev?.addEventListener("click", () => moveTour(-1));
  tourNext?.addEventListener("click", () => moveTour(1));
  tourExit?.addEventListener("click", exitGuidedTour);
  completeMenu?.addEventListener("click", closeSystemDetail);
  completeRestart?.addEventListener("click", startGuidedTour);
  organSearch?.addEventListener("input", handleOrganSearch);
  organSearch?.addEventListener("keydown", handleSearchKeydown);
  viewFullButton?.addEventListener("click", () => setDetailViewMode("full"));
  viewModelButton?.addEventListener("click", () => setDetailViewMode("model"));
  viewSheetButton?.addEventListener("click", () => setDetailViewMode("sheet"));
  copySystemLinkButton?.addEventListener("click", copyCurrentSystemLink);
  digestiveSequenceButton?.addEventListener("click", () => setDigestiveLessonMode("sequence"));
  digestiveClassButton?.addEventListener("click", () => setDigestiveLessonMode("classroom"));
  digestiveClassPrev?.addEventListener("click", () => moveDigestiveLesson(-1));
  digestiveClassNext?.addEventListener("click", () => moveDigestiveLesson(1));
  digestiveCopyLinkButton?.addEventListener("click", copyDigestiveLink);
  openDigestiveModalButton?.addEventListener("click", openDigestiveModal);
  openDigestiveClassButton?.addEventListener("click", openDigestiveClassroom);
  closeDigestiveModalButton?.addEventListener("click", closeDigestiveModal);
  digestiveModal?.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.closeDigestiveModal === "true") closeDigestiveModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !digestiveModal?.classList.contains("hidden")) {
      closeDigestiveModal();
      return;
    }
    if (event.key === "Escape" && !detailView.classList.contains("hidden")) closeSystemDetail();
  });
  document.addEventListener("fullscreenchange", updateFullscreenButton);
  window.addEventListener("resize", () => {
    viewers.forEach((viewer) => viewer.resize());
    detailViewer?.resize();
  });
}

function buildSystemGallery() {
  gallery.innerHTML = "";

  systemOrder.forEach((systemKey) => {
    const card = document.createElement("article");
    card.className = "system-card";
    card.style.setProperty("--system-color", systemConfig[systemKey].color);
    card.dataset.systemKey = systemKey;

    const stage = document.createElement("div");
    stage.className = "model-stage";

    const organCount = Object.values(organInfo).filter((organ) => organ.systemKey === systemKey).length;
    const audit = modelAudit[systemKey] ?? { status: "review", label: "En revision" };
    card.dataset.status = audit.status;
    const meta = document.createElement("div");
    meta.className = "card-meta";
    meta.innerHTML = `<span>${organCount} organos clave</span><span data-status="${audit.status}">${audit.label}</span>`;

    const title = document.createElement("div");
    title.className = "system-title";
    title.innerHTML = `<span>${systemConfig[systemKey].label}</span>`;

      const summary = document.createElement("p");
      summary.className = "card-summary";
      summary.textContent = systemDetails[systemKey]?.miniSummary ?? "Explora este sistema.";

      const statusNote = document.createElement("p");
      statusNote.className = "card-status-note";
      statusNote.textContent = getAuditStatusCopy(systemKey, audit);

      const actionHint = document.createElement("p");
      actionHint.className = "card-action-hint";
      actionHint.textContent = "Abrir sistema";

      card.append(stage, meta, title, summary, statusNote, actionHint);
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Abrir ${systemConfig[systemKey].label}`);
    card.addEventListener("click", () => openSystemDetail(systemKey));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSystemDetail(systemKey);
      }
    });

    gallery.appendChild(card);
    const viewer = createStaticPreview(stage, systemKey);
    viewers.add(viewer);
  });
}

function buildQuickIndex() {
  if (!quickIndex) return;
  quickIndex.innerHTML = "";

  systemOrder.forEach((systemKey) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quick-index-button";
    button.style.setProperty("--system-color", systemConfig[systemKey].color);
    button.textContent = systemConfig[systemKey].label;
    button.setAttribute("aria-label", `Ir a ${systemConfig[systemKey].label}`);
    button.addEventListener("click", () => openSystemDetail(systemKey));
    quickIndex.appendChild(button);
  });
}

function getAuditStatusCopy(systemKey, audit) {
  if (!audit) return "Vista general disponible para empezar a explorar.";
  if (audit.status === "ready") return "Modelo estable y listo para usar en una explicacion o trabajo individual.";
  if (audit.status === "temporary" || audit.status === "placeholder") {
    return REAL_MODEL_KEYS.has(systemKey)
      ? "Modelo temporal activo mientras se completa una version mas pulida."
      : "Vista temporal disponible para sostener el recorrido sin cortar la experiencia.";
  }
  return "Modelo en revision: ya se puede usar, pero conviene seguir puliendo encuadre y materiales.";
}

function openSystemDetail(systemKey) {
  const previousSystemKey = currentSystemKey;
  const openToken = ++detailOpenToken;
  currentSystemKey = systemKey;
  if (systemKey === "digestive" && previousSystemKey !== "digestive") {
    digestiveLessonMode = "sequence";
    digestiveLessonIndex = 0;
  }
  const detail = systemDetails[systemKey] ?? {
    title: systemConfig[systemKey].label,
    summary: "Vista general del sistema.",
    description: "Modelo independiente para explorar sin superponer capas.",
  };

  setDetailViewMode(tourActive ? "model" : "full");
  setModelStatus(`Cargando ${systemConfig[systemKey].label.toLowerCase()}...`, "loading");
  detailTitle.textContent = detail.title;
  detailSummary.textContent = detail.summary;
  detailDescription.textContent = detail.description ?? detail.summary;
  const audit = modelAudit[systemKey];
  detailModelNote.textContent = audit ? `${audit.label}: ${audit.note}` : "Modelo en revision.";
  detailModelNote.dataset.status = audit?.status ?? "review";
  detailFunction.textContent = detail.function ?? detail.description ?? detail.summary;
  detailKeyFact.textContent = detail.keyFact ?? "Relaciona este sistema con otros para entender su funcion.";
  detailQuestion.textContent = detail.question ?? "Que organos reconoces en esta vista?";
  detailMiniSummary.textContent = detail.miniSummary ?? detail.summary;
  detailThinking.textContent = buildThinkingPrompt(systemKey, detail);
  toggleDigestiveIntroLayout(systemKey);
  renderLookList(systemKey, detail);
  renderDigestiveProcess(systemKey);
  organPanel.classList.add("hidden");

  renderOrganList(systemKey);
  detailViewer?.dispose();
  detailViewer = null;
  detailStage.innerHTML = "";
  detailView.style.setProperty("--system-color", systemConfig[systemKey].color);
  detailStage.style.setProperty("--system-color", systemConfig[systemKey].color);

  gallery.classList.add("hidden");
  heroCard.classList.add("hidden");
  atlasTools?.classList.add("hidden");
  tourComplete.classList.add("hidden");
  detailView.classList.remove("hidden");
  detailView.classList.toggle("is-tour-active", tourActive);
  updateRoute();
  updateTourBanner();
  backButton.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });

  requestAnimationFrame(() => {
    if (openToken !== detailOpenToken || detailView.classList.contains("hidden")) return;
    detailViewer = createSystemViewer(detailStage, systemKey, {
      onLoad: () => setModelStatus("Modelo 3D cargado.", "ready"),
      onFallback: () => setModelStatus("Vista temporal disponible.", "fallback"),
      onError: () => setModelStatus("No se pudo cargar el modelo. Vista temporal activa.", "error"),
    });
    renderOrganHotspots(systemKey);
  });
}

function renderOrganList(systemKey) {
  detailOrgans.innerHTML = "";
  const organs = Object.entries(organInfo)
    .filter(([, organ]) => organ.systemKey === systemKey)
    .sort(([, a], [, b]) => a.title.localeCompare(b.title));

  organs.forEach(([organId, organ]) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "organ-chip";
    item.dataset.organId = organId;
      const study = organStudyInfo[organId];
      item.innerHTML = `<strong>${organ.title}</strong><span>${study?.function ?? organ.description}</span>`;
    item.addEventListener("click", () => showOrganInfo(organ, organId));
    detailOrgans.appendChild(item);
  });

  if (!organs.length) {
    const item = document.createElement("p");
    item.className = "empty-note";
    item.textContent = "Esta vista muestra el sistema completo. Mas adelante podemos sumar fichas organo por organo.";
    detailOrgans.appendChild(item);
  }
}

function renderLookList(systemKey, detail) {
  if (!detailLookList) return;
  const fallbackItems = [
    detail.summary,
    `Ubica: ${(detail.organs ?? []).slice(0, 3).join(", ")}.`,
    detail.question,
  ].filter(Boolean);
  const items = detail.lookFor?.length ? detail.lookFor : fallbackItems;
  detailLookList.innerHTML = "";
  items.slice(0, 4).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    detailLookList.appendChild(li);
  });
}

function renderDigestiveProcess(systemKey) {
  if (!digestiveProcess || !digestiveProcessList) return;

  digestiveProcessList.innerHTML = "";
  const sections = systemLessonSections[systemKey] ?? [];
  const introSections = systemKey === "digestive" ? sections.slice(0, 3) : [];
  const processSections = systemKey === "digestive" ? sections.slice(3) : sections;
  const hasLesson = sections.length > 0;
  digestiveProcess.classList.toggle("hidden", !hasLesson);
  if (!hasLesson) return;

  renderDigestiveIntro(introSections);
  renderDigestiveGuide(systemDetails[systemKey]);
  renderDigestiveClassroom(processSections);
  syncDigestiveLessonMode();

  processSections.forEach((section, index) => {
    const card = document.createElement("article");
    card.className = "process-card";
    card.dataset.sectionId = section.id;
    card.addEventListener("click", () => {
      digestiveLessonIndex = index;
      renderDigestiveClassroom(processSections);
      updateDigestiveActiveCard();
      if (digestiveLessonMode === "classroom") syncDigestiveLessonMode();
      updateRoute();
    });

    const figure = document.createElement("figure");
    figure.className = "process-figure has-fallback";

    if (section.showImage && section.image) {
      const image = document.createElement("img");
      image.className = "digestive-lesson-image";
      image.src = section.image;
      image.alt = section.title.replace(/^\d+\.\s*/, "");
      image.loading = "lazy";
      image.decoding = "async";
      figure.classList.remove("has-fallback");
      figure.append(image);
    } else {
      const fallback = document.createElement("span");
      fallback.className = "process-image-placeholder";
      fallback.textContent = "Espacio reservado para imagen";
      figure.append(fallback);
    }

    const content = document.createElement("div");
    content.className = "process-content";

    const step = document.createElement("span");
    step.className = "process-step";
    step.textContent = `Paso ${index + 1}`;

    const title = document.createElement("h3");
    title.textContent = section.title.replace(/^\d+\.\s*/, "");

    const summary = document.createElement("p");
    summary.className = "process-summary";
    summary.textContent = section.summary;

    const body = document.createElement("p");
    body.textContent = section.body;

    const list = document.createElement("ul");
    list.className = "process-bullets";
    section.bullets.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });

    content.append(step, title, summary, body, list);
    card.append(figure, content);
    digestiveProcessList.appendChild(card);
  });

  updateDigestiveActiveCard();
}

function renderDigestiveIntro(sections) {
  if (!digestiveSystemIntroList) return;
  digestiveSystemIntroList.innerHTML = "";
  if (!sections.length) return;

  sections.forEach((section) => {
    const article = document.createElement("article");
    article.className = "digestive-intro-card";

    const title = document.createElement("h4");
    title.textContent = section.title.replace(/^\d+\.\s*/, "");

    const summary = document.createElement("p");
    summary.className = "process-summary";
    summary.textContent = section.summary;

    const list = document.createElement("ul");
    list.className = "process-bullets";
    [section.body, ...(section.bullets ?? []).slice(0, 2)].forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });

    article.append(title, summary, list);
    digestiveSystemIntroList.appendChild(article);
  });
}

function renderDigestiveGuide(detail) {
  if (!digestiveGuide) return;
  digestiveGuide.innerHTML = "";
  if (currentSystemKey !== "digestive") return;

  const cards = [
    {
      title: "Que es este sistema",
      items: detail?.introHighlights ?? [],
    },
    {
      title: "Linea del proceso",
      items: detail?.processTimeline ?? [],
    },
    {
      title: "Mapa rapido de organos",
      items: detail?.organMap ?? [],
    },
    {
      title: "Que mirar primero",
      items: detail?.lookFor?.slice(0, 3) ?? [],
    },
    {
      title: "Como recorrerlo",
      items: detail?.guideSequence ?? [],
    },
    {
      title: "Idea central",
      items: detail?.guideFocus ?? [],
    },
  ].filter((card) => card.items.length);

  cards.forEach((card) => {
    const article = document.createElement("article");
      article.className = "digestive-guide-card";

    const title = document.createElement("h4");
    title.textContent = card.title;

    const list = document.createElement("ul");
    list.className = "process-bullets";
    card.items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });

    article.append(title, list);
      digestiveGuide.appendChild(article);
    });
  }

function toggleDigestiveIntroLayout(systemKey) {
  const isDigestive = systemKey === "digestive";
  detailSummary?.classList.toggle("hidden", isDigestive);
  detailDescription?.classList.toggle("hidden", isDigestive);
  detailModelNote?.classList.toggle("hidden", isDigestive);
  detailLookSection?.classList.toggle("hidden", isDigestive);
  detailFunctionSection?.classList.toggle("hidden", isDigestive);
  learningCards?.classList.toggle("hidden", isDigestive);
  digestiveSystemIntro?.classList.toggle("hidden", !isDigestive);
}

function renderDigestiveClassroom(sections) {
  if (!digestiveClassroom || !digestiveClassTitle || !digestiveClassSummary || !digestiveClassFigure || !digestiveClassBullets) return;
  const classroomSections = buildDigestiveClassroomSections(sections);
  if (!classroomSections.length) {
    digestiveClassStep.textContent = "";
    digestiveClassTitle.textContent = "";
    digestiveClassSummary.textContent = "";
    digestiveClassFigure.innerHTML = "";
    digestiveClassBullets.innerHTML = "";
    return;
  }
  const safeIndex = Math.max(0, Math.min(digestiveLessonIndex, classroomSections.length - 1));
  digestiveLessonIndex = safeIndex;
  const section = classroomSections[safeIndex];

  digestiveClassStep.textContent = safeIndex === classroomSections.length - 1 ? "Cierre final" : `Paso ${safeIndex + 1} de ${classroomSections.length}`;
  digestiveClassTitle.textContent = section.title.replace(/^\d+\.\s*/, "");
  digestiveClassSummary.textContent = section.classroomSummary ?? section.summary;
  if (section.id === "digestive-recap") {
    digestiveClassFigure.innerHTML = "";
    const recap = document.createElement("div");
    recap.className = "digestive-recap-figure";

    const recapTitle = document.createElement("p");
    recapTitle.className = "process-caption";
    recapTitle.textContent = "Resumen visual del recorrido";

    const recapList = document.createElement("ol");
    recapList.className = "digestive-recap-figure-list";
    (section.visualPoints ?? section.bullets ?? []).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      recapList.appendChild(li);
    });

    recap.append(recapTitle, recapList);
    digestiveClassFigure.appendChild(recap);
  } else if (section.showImage && section.image) {
    digestiveClassFigure.innerHTML = `<img class="digestive-lesson-image digestive-lesson-image-large" src="${section.image}" alt="${section.title.replace(/^\d+\.\s*/, "")}">`;
  } else {
    digestiveClassFigure.innerHTML = `<div class="process-image-placeholder process-image-placeholder-large">Espacio reservado para imagen</div>`;
  }
  digestiveClassBullets.innerHTML = "";
  (section.bullets ?? []).filter(Boolean).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    digestiveClassBullets.appendChild(li);
  });
  if (digestiveClassPrev) digestiveClassPrev.disabled = safeIndex === 0;
  if (digestiveClassNext) digestiveClassNext.textContent = safeIndex === classroomSections.length - 1 ? "Cerrar recorrido" : "Siguiente paso";
}

function buildDigestiveClassroomSections(sections) {
  if (!sections?.length) return [];
  return [
    ...sections.map((section) => ({
      ...section,
      summary: section.summary,
      body: section.body,
    })),
    {
      id: "digestive-recap",
      title: "Cierre: repaso del proceso digestivo",
      summary: "Antes de salir, repasa el recorrido completo del alimento.",
      classroomSummary: "Una ultima pasada corta para unir boca, estomago, intestino delgado e intestino grueso en una sola idea.",
      body: "Este cierre resume la idea central de cada tramo para que el proceso quede claro de principio a fin.",
      bullets: digestiveRecapPoints,
      visualPoints: [
        "Boca: ingreso, masticacion y formacion del bolo.",
        "Faringe y esofago: deglucion y transporte.",
        "Estomago: mezcla con jugos gastricos y formacion del quimo.",
        "Intestino delgado: digestion final y absorcion.",
        "Intestino grueso: recuperacion de agua y eliminacion.",
      ],
      showImage: false,
      image: "",
    },
  ];
}

function setDigestiveLessonMode(mode) {
  digestiveLessonMode = mode;
  syncDigestiveLessonMode();
  updateRoute();
}

function syncDigestiveLessonMode() {
  if (!digestiveProcess) return;
  const isDigestive = currentSystemKey === "digestive";
  const isClassroom = isDigestive && digestiveLessonMode === "classroom";
  digestiveProcess.dataset.lessonMode = isClassroom ? "classroom" : "sequence";
  digestiveSequenceButton?.classList.toggle("is-active", !isClassroom);
  digestiveClassButton?.classList.toggle("is-active", isClassroom);
  digestiveSequenceButton?.setAttribute("aria-pressed", String(!isClassroom));
  digestiveClassButton?.setAttribute("aria-pressed", String(isClassroom));
  digestiveClassroom?.classList.toggle("hidden", !isClassroom);
  digestiveProcessList?.classList.toggle("hidden", isClassroom);
  updateDigestiveActiveCard();
}

function updateDigestiveActiveCard() {
  document.querySelectorAll(".process-card").forEach((card, index) => {
    card.classList.toggle("is-active", currentSystemKey === "digestive" && index === digestiveLessonIndex);
  });
}

function moveDigestiveLesson(direction) {
  const sections = buildDigestiveClassroomSections((systemLessonSections.digestive ?? []).slice(3));
  if (!sections.length) return;
  if (direction > 0 && digestiveLessonIndex >= sections.length - 1) {
    setDigestiveLessonMode("sequence");
    return;
  }
  digestiveLessonIndex = Math.max(0, Math.min(sections.length - 1, digestiveLessonIndex + direction));
  renderDigestiveClassroom(sections);
  updateDigestiveActiveCard();
  updateRoute();
}

function copyDigestiveLink() {
  const url = buildCurrentShareUrl({
    system: "digestive",
    view: "sheet",
    digestiveClass: "1",
    step: String(digestiveLessonIndex + 1),
    digestiveUnit: "1",
  });
  navigator.clipboard?.writeText(url).then(
    () => setModelStatus("Link del digestivo copiado.", "ready"),
    () => setModelStatus("No se pudo copiar el link, pero la vista ya esta lista para compartir.", "fallback"),
  );
}

function copyCurrentSystemLink() {
  if (!currentSystemKey) return;
  const baseParams = {
    system: currentSystemKey,
    view: detailView.dataset.viewMode || "full",
  };
  if (currentSystemKey === "digestive" && digestiveModal && !digestiveModal.classList.contains("hidden")) {
    baseParams.digestiveUnit = "1";
  }
  if (currentSystemKey === "digestive" && digestiveLessonMode === "classroom") {
    baseParams.digestiveClass = "1";
    baseParams.step = String(digestiveLessonIndex + 1);
  }
  const url = buildCurrentShareUrl(baseParams);
  navigator.clipboard?.writeText(url).then(
    () => setModelStatus(`Link de ${systemConfig[currentSystemKey].label.toLowerCase()} copiado.`, "ready"),
    () => setModelStatus("No se pudo copiar el link, pero la vista sigue lista para compartir.", "fallback"),
  );
}

function openDigestiveClassroom() {
  digestiveLessonMode = "classroom";
  digestiveLessonIndex = 0;
  openDigestiveModal();
}

function openDigestiveModal() {
  if (!digestiveModal) return;
  digestiveModal.classList.remove("hidden");
  document.body.classList.add("has-modal-open");
  syncDigestiveLessonMode();
  closeDigestiveModalButton?.focus({ preventScroll: true });
  updateRoute();
}

function closeDigestiveModal() {
  if (!digestiveModal) return;
  digestiveModal.classList.add("hidden");
  document.body.classList.remove("has-modal-open");
  openDigestiveModalButton?.focus({ preventScroll: true });
  updateRoute();
}

function closeSystemDetail() {
  tourActive = false;
  detailOpenToken += 1;
  closeDigestiveModal();
  detailViewer?.dispose();
  detailViewer = null;
  detailView.classList.add("hidden");
  detailView.classList.remove("is-tour-active");
  gallery.classList.remove("hidden");
  heroCard.classList.remove("hidden");
  atlasTools?.classList.remove("hidden");
  tourBanner.classList.add("hidden");
  tourComplete.classList.add("hidden");
  history.replaceState({}, "", window.location.pathname);
  clearSearchResults();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showOrganInfo(organ, organId) {
  const study = organStudyInfo[organId] ?? {};
  organTitle.textContent = organ.title;
  organDescription.textContent = organ.description;
  organLocation.textContent = study.location ?? "Ubicacion general dentro del sistema.";
  organFunction.textContent = study.function ?? organ.description;
  organKeyFact.textContent = study.keyFact ?? "Relacionar con otros sistemas ayuda a entender su funcion.";
  organPanel.classList.remove("hidden");
  document.querySelectorAll(".organ-chip, .hotspot-button").forEach((element) => {
    element.classList.toggle("is-active", element.dataset.organId === organId);
  });
}

function startGuidedTour() {
  tourActive = true;
  tourComplete.classList.add("hidden");
  openSystemDetail(systemOrder[0]);
}

function moveTour(direction) {
  if (!tourActive) return;
  const currentIndex = systemOrder.indexOf(currentSystemKey);
  if (direction > 0 && currentIndex === systemOrder.length - 1) {
    finishGuidedTour();
    return;
  }
  const nextIndex = (currentIndex + direction + systemOrder.length) % systemOrder.length;
  openSystemDetail(systemOrder[nextIndex]);
}

function exitGuidedTour() {
  tourActive = false;
  closeSystemDetail();
}

function finishGuidedTour() {
  tourActive = false;
  detailOpenToken += 1;
  detailViewer?.dispose();
  detailViewer = null;
  detailView.classList.add("hidden");
  detailView.classList.remove("is-tour-active");
  tourBanner.classList.add("hidden");
  heroCard.classList.remove("hidden");
  atlasTools?.classList.remove("hidden");
  gallery.classList.remove("hidden");
  tourComplete.classList.remove("hidden");
  renderTourSummary();
  tourComplete.scrollIntoView({ behavior: "smooth", block: "center" });
}

function renderTourSummary() {
  if (!tourSummaryList) return;
  tourSummaryList.innerHTML = "";
  systemOrder.forEach((systemKey) => {
    const item = document.createElement("li");
    const detail = systemDetails[systemKey];
    item.innerHTML = `<strong>${systemConfig[systemKey].label}</strong><span>${detail.miniSummary}</span>`;
    tourSummaryList.appendChild(item);
  });
}

function updateTourBanner() {
  if (!tourActive) {
    tourBanner.classList.add("hidden");
    return;
  }
  const currentIndex = systemOrder.indexOf(currentSystemKey);
  const detail = systemDetails[currentSystemKey];
  tourTitle.textContent = `${currentIndex + 1}. ${detail.title}`;
  tourCopy.textContent = `${detail.classroomStep ?? detail.miniSummary} Pregunta guia: ${detail.question}`;
  tourNext.textContent = currentIndex === systemOrder.length - 1 ? "Cerrar recorrido" : "Siguiente";
  tourProgressBar.style.width = `${((currentIndex + 1) / systemOrder.length) * 100}%`;
  tourBanner.classList.remove("hidden");
}

function buildThinkingPrompt(systemKey, detail) {
  const linkedSystems = {
    respiratory: "circulatorio",
    circulatory: "respiratorio",
    skeletal: "muscular",
    muscular: "oseo",
    nervous: "muscular",
    digestive: "circulatorio",
    urinary: "circulatorio",
    endocrine: "circulatorio",
    lymphatic: "circulatorio e inmunologico",
    integumentary: "nervioso",
    reproductiveMale: "endocrino",
    reproductiveFemale: "endocrino",
  };
  return `Como se relaciona este sistema con el sistema ${linkedSystems[systemKey] ?? "del cuerpo"}? ${detail.question}`;
}

function setDetailViewMode(mode) {
  detailView.dataset.viewMode = mode;
  [
    [viewFullButton, "full"],
    [viewModelButton, "model"],
    [viewSheetButton, "sheet"],
  ].forEach(([button, value]) => {
    button?.classList.toggle("is-active", value === mode);
    button?.setAttribute("aria-pressed", String(value === mode));
  });
  requestAnimationFrame(() => detailViewer?.resize());
}

function setModelStatus(message, state) {
  if (!modelStatus) return;
  modelStatus.textContent = message;
  modelStatus.className = `model-status is-${state}`;
}

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
}

function buildCurrentShareUrl(extraParams = {}) {
  const url = new URL(window.location.href);
  Object.entries(extraParams).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  });
  return url.toString();
}

function updateRoute() {
  if (detailView.classList.contains("hidden")) return;
  const params = new URLSearchParams();
  params.set("system", currentSystemKey);
  params.set("view", detailView.dataset.viewMode || "full");
  if (currentSystemKey === "digestive" && digestiveLessonMode === "classroom") {
    params.set("digestiveClass", "1");
    params.set("step", String(digestiveLessonIndex + 1));
  }
  if (currentSystemKey === "digestive" && digestiveModal && !digestiveModal.classList.contains("hidden")) {
    params.set("digestiveUnit", "1");
  }
  history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
}

function applyInitialRoute() {
  const params = new URLSearchParams(window.location.search);
  const system = params.get("system");
  if (!system || !systemOrder.includes(system)) return;

  const requestedView = params.get("view");
  const digestClass = params.get("digestiveClass") === "1";
  const digestUnit = params.get("digestiveUnit") === "1";
  const step = Number(params.get("step") || "1");
  if (system === "digestive") {
    const processSections = (systemLessonSections.digestive ?? []).slice(3);
    digestiveLessonIndex = Math.max(0, Math.min(processSections.length - 1, step - 1));
    digestiveLessonMode = digestClass ? "classroom" : "sequence";
  }

  requestAnimationFrame(() => {
    openSystemDetail(system);
    if (requestedView && ["full", "model", "sheet"].includes(requestedView)) {
      setDetailViewMode(requestedView);
      updateRoute();
    }
    if (system === "digestive") {
      renderDigestiveProcess("digestive");
      syncDigestiveLessonMode();
      if (digestUnit) openDigestiveModal();
    }
  });
}

function updateFullscreenButton() {
  if (!fullscreenButton) return;
  const isFullscreen = Boolean(document.fullscreenElement);
  fullscreenButton.textContent = isFullscreen ? "Salir de pantalla completa" : "Pantalla completa";
  fullscreenButton.setAttribute("aria-pressed", String(isFullscreen));
}

function handleOrganSearch() {
  const query = normalizeSearch(organSearch.value);
  if (!query) {
    clearSearchResults();
    return;
  }

  const matches = Object.entries(organInfo)
    .filter(([, organ]) => normalizeSearch(`${organ.title} ${organ.description} ${systemConfig[organ.systemKey]?.label}`).includes(query))
    .slice(0, 8);

  searchResults.innerHTML = "";
  searchResults.classList.toggle("is-open", matches.length > 0);
  matches.forEach(([organId, organ]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "search-result";
    button.setAttribute("role", "option");
    button.innerHTML = `<strong>${organ.title}</strong><span>${systemConfig[organ.systemKey].label}</span>`;
    button.addEventListener("click", () => openOrganResult(organId));
    searchResults.appendChild(button);
  });
}

function handleSearchKeydown(event) {
  if (event.key !== "Enter") return;
  const first = searchResults.querySelector(".search-result");
  if (first) {
    event.preventDefault();
    first.click();
  }
}

function openOrganResult(organId) {
  const organ = organInfo[organId];
  if (!organ) return;
  openSystemDetail(organ.systemKey);
  window.setTimeout(() => showOrganInfo(organ, organId), 60);
}

function clearSearchResults() {
  searchResults.innerHTML = "";
  searchResults.classList.remove("is-open");
}

function normalizeSearch(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function createStaticPreview(container, systemKey) {
  const color = systemConfig[systemKey].color;
  const figure = document.createElement("div");
  figure.className = `static-preview static-preview-${systemKey}`;
  figure.style.setProperty("--system-color", color);
  if (REAL_MODEL_KEYS.has(systemKey)) figure.classList.add("will-load-3d");
  if (DEFERRED_MENU_PREVIEW_KEYS.has(systemKey)) figure.classList.add("is-deferred-preview");
  figure.innerHTML = `
    <div class="preview-body">
      <span class="preview-head"></span>
      <span class="preview-torso"></span>
      <span class="preview-arm preview-arm-left"></span>
      <span class="preview-arm preview-arm-right"></span>
      <span class="preview-leg preview-leg-left"></span>
      <span class="preview-leg preview-leg-right"></span>
    </div>
    <div class="preview-system-mark"></div>
  `;
  figure.classList.add("is-loading");
  container.appendChild(figure);

  let disposed = false;
  let renderer = null;
  let scene = null;
  let loaded = false;

  const loadPreview = () => {
    if (disposed || loaded) return;
    loaded = true;
    const preview = createPreviewScene(figure, systemKey);
    renderer = preview.renderer;
    scene = preview.scene;
  };

  figure.__loadPreview = loadPreview;
  if (DEFERRED_MENU_PREVIEW_KEYS.has(systemKey)) {
    figure.addEventListener("pointerenter", loadPreview, { once: true });
    figure.addEventListener("focusin", loadPreview, { once: true });
    figure.addEventListener("click", loadPreview, { once: true });
  } else if (previewObserver) previewObserver.observe(figure);
  else requestAnimationFrame(loadPreview);

  return {
    resize() {
      if (!renderer || !scene) return;
      renderPreviewScene(figure, renderer, scene.camera, scene.scene);
    },
    dispose() {
      disposed = true;
      previewObserver?.unobserve(figure);
      if (scene) clearObject(scene.scene);
      renderer?.dispose();
      figure.remove();
    },
  };
}

function createPreviewScene(container, systemKey) {
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(getPreviewPixelRatio());
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.className = "preview-canvas";
  container.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100);
  addLights(scene);
  const root = new THREE.Group();
  scene.add(root);

  const renderPreview = () => {
    fitCameraToObject(camera, null, root, systemKey, { preview: true });
    renderPreviewScene(container, renderer, camera, scene);
  };

  if (!REAL_MODEL_KEYS.has(systemKey)) {
    const fallback = createFallbackModel(systemKey);
    root.add(fallback);
    renderPreview();
  } else {
    renderPreviewScene(container, renderer, camera, scene);
  }

  loadSystemModel(systemKey)
    .then((model) => {
      if (!container.isConnected) return;
      clearObject(root);
      cleanupImportedModel(model);
      normalizeModel(model, systemKey);
      applySystemMaterial(model, systemKey);
      root.add(model);
      container.classList.add("has-3d");
      container.classList.remove("is-loading");
      renderPreview();
    })
    .catch(() => {
      if (!container.isConnected) return;
      clearObject(root);
      root.add(createFallbackModel(systemKey));
      container.classList.add("has-3d");
      container.classList.remove("is-loading");
      renderPreview();
    });

  return { renderer, scene: { scene, camera } };
}

function renderPreviewScene(container, renderer, camera, scene) {
  const width = Math.max(1, container.clientWidth);
  const height = Math.max(1, container.clientHeight);
  renderer.setPixelRatio(getPreviewPixelRatio());
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
}

function createSystemViewer(container, systemKey, options = {}) {
  const compactViewport = isCompactViewport();
  const renderer = new THREE.WebGLRenderer({
    antialias: !compactViewport,
    alpha: true,
    powerPreference: compactViewport ? "low-power" : "high-performance",
  });
  renderer.setPixelRatio(getDetailPixelRatio());
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = false;
  renderer.domElement.className = "model-canvas";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = !compactViewport;
  controls.dampingFactor = 0.08;
  controls.zoomToCursor = !compactViewport;
  controls.rotateSpeed = compactViewport ? 0.72 : 1;
  controls.zoomSpeed = compactViewport ? 0.85 : 1;
  controls.panSpeed = compactViewport ? 0.75 : 1;
  controls.minDistance = 1.2;
  controls.maxDistance = CAMERA_CONFIG[systemKey]?.maxDistance ?? 8.5;

  addLights(scene);
  const root = new THREE.Group();
  scene.add(root);

  const state = {
    disposed: false,
    animationId: 0,
    paused: document.hidden,
    hotspotBindings: [],
    renderQueued: false,
    onDemand: compactViewport,
  };
  resize();

  const fallback = createFallbackModel(systemKey);
  root.add(fallback);
  fitCameraToObject(camera, controls, fallback, systemKey);
  renderScene();

  loadSystemModel(systemKey)
    .then((model) => {
      if (state.disposed) return;
      clearObject(root);
      cleanupImportedModel(model);
      normalizeModel(model, systemKey);
      applySystemMaterial(model, systemKey);
      root.add(model);
      fitCameraToObject(camera, controls, model, systemKey);
      requestRender();
      options.onLoad?.();
    })
    .catch(() => {
      if (state.disposed) return;
      clearObject(root);
      root.add(createFallbackModel(systemKey));
      fitCameraToObject(camera, controls, root, systemKey);
      requestRender();
      if (REAL_MODEL_KEYS.has(systemKey)) options.onError?.();
      else options.onFallback?.();
    });

  controls.addEventListener("change", requestRender);

  if (state.onDemand) requestRender();
  else animate();

  function animate() {
    if (state.disposed) return;
    if (!state.paused) {
      controls.update();
      renderScene();
    }
    state.animationId = requestAnimationFrame(animate);
  }

  function requestRender() {
    if (state.disposed) return;
    if (!state.onDemand) {
      renderScene();
      return;
    }
    if (state.paused || state.renderQueued) return;
    state.renderQueued = true;
    state.animationId = requestAnimationFrame(() => {
      state.renderQueued = false;
      if (state.disposed || state.paused) return;
      renderScene();
    });
  }

  function renderScene() {
    renderer.render(scene, camera);
    updateHotspots();
  }

  function resize() {
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    renderer.setPixelRatio(getDetailPixelRatio());
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    requestRender();
  }

  function dispose() {
    state.disposed = true;
    cancelAnimationFrame(state.animationId);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    controls.removeEventListener("change", requestRender);
    controls.dispose();
    clearObject(scene);
    renderer.dispose();
    renderer.domElement.remove();
  }

  function handleVisibilityChange() {
    state.paused = document.hidden || detailView.classList.contains("hidden");
    if (!state.paused) requestRender();
  }

  document.addEventListener("visibilitychange", handleVisibilityChange);

  function setHotspotBindings(bindings) {
    state.hotspotBindings = bindings ?? [];
    updateHotspots();
  }

  function updateHotspots() {
    if (!state.hotspotBindings.length) return;
    const box = new THREE.Box3().setFromObject(root);
    if (!Number.isFinite(box.min.x) || !Number.isFinite(box.max.x)) return;
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);

    state.hotspotBindings.forEach(({ button, hotspot }) => {
      if (hasProjectedHotspot(hotspot) && box.max.y > box.min.y) {
        const projectedPoint = projectHotspotFromBox(box, hotspot, camera);
        const inFront = projectedPoint.z > -1 && projectedPoint.z < 1;
        const x = (projectedPoint.x * 0.5 + 0.5) * width;
        const y = (-projectedPoint.y * 0.5 + 0.5) * height;
        const inside = x >= 0 && x <= width && y >= 0 && y <= height;
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
        button.classList.toggle("is-offscreen", !(inFront && inside));
      } else {
        button.style.left = `${hotspot.x}%`;
        button.style.top = `${hotspot.y}%`;
        button.classList.remove("is-offscreen");
      }
    });
  }

  return { resize, dispose, setHotspotBindings };
}

function renderOrganHotspots(systemKey) {
  const hotspots = organHotspots[systemKey] ?? [];
  if (!hotspots.length) return;

  const layer = document.createElement("div");
  layer.className = "hotspot-layer";
  layer.setAttribute("aria-label", "Puntos interactivos del sistema");
  const bindings = [];

  hotspots.forEach((hotspot) => {
    const organ = organInfo[hotspot.organId];
    if (!organ) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hotspot-button";
    button.dataset.organId = hotspot.organId;
    button.setAttribute("aria-label", `Ver informacion de ${organ.title}`);
    button.innerHTML = `<span>${organ.title}</span>`;
    button.addEventListener("click", () => showOrganInfo(organ, hotspot.organId));
    layer.appendChild(button);
    bindings.push({ button, hotspot });
  });

  detailStage.appendChild(layer);
  detailViewer?.setHotspotBindings(bindings);
}

function hasProjectedHotspot(hotspot) {
  return [hotspot.nx, hotspot.ny, hotspot.nz].every((value) => Number.isFinite(value));
}

function projectHotspotFromBox(box, hotspot, camera) {
  const point = new THREE.Vector3(
    THREE.MathUtils.lerp(box.min.x, box.max.x, hotspot.nx),
    THREE.MathUtils.lerp(box.min.y, box.max.y, hotspot.ny),
    THREE.MathUtils.lerp(box.min.z, box.max.z, hotspot.nz),
  );
  return point.project(camera);
}

function loadSystemModel(systemKey) {
  const fileName = MODEL_FILES[systemKey];
  if (!fileName) return Promise.reject(new Error("No model file configured"));
  const url = `${MODEL_BASE_PATH}/${fileName}?v=${MODEL_VERSION}`;
  return new Promise((resolve, reject) => {
    loader.load(url, (gltf) => resolve(gltf.scene), undefined, reject);
  });
}

function addLights(scene) {
  scene.add(new THREE.HemisphereLight(0xe9fbff, 0x193a54, 2.9));
  const key = new THREE.DirectionalLight(0xffffff, 3.1);
  key.position.set(2.5, 4, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x9adfff, 1.7);
  fill.position.set(-4, 1.2, 2);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.9);
  rim.position.set(0, 2, -3);
  scene.add(rim);
}

function normalizeModel(model, systemKey) {
  applyInitialModelRotation(model, systemKey);
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  model.position.sub(center);
  model.scale.multiplyScalar(3.55 / maxDim);
  const nextBox = new THREE.Box3().setFromObject(model);
  model.position.y -= nextBox.min.y;
}

function applyInitialModelRotation(model, systemKey) {
  const rotation = MODEL_ROTATION_CONFIG[systemKey];
  if (!rotation) return;
  model.rotation.set(rotation.x ?? 0, rotation.y ?? 0, rotation.z ?? 0);
  model.updateMatrixWorld(true);
}

function cleanupImportedModel(model) {
  const removableNames = ["path", "cross section", "section", "guide", "helper", "axis", "axes", "grid", "label", "text", "curve", "line", "annotation", "shortcut", "empty"];
  const toRemove = [];
  model.traverse((object) => {
    const name = `${object.name ?? ""} ${object.type ?? ""}`.toLowerCase();
    const objectName = (object.name ?? "").toLowerCase();
    if (object.isLine || object.isLineSegments || object.isPoints || ["Line", "LineSegments", "Points"].includes(object.type)) toRemove.push(object);
    else if (objectName.endsWith(".j") || objectName.endsWith(".t") || objectName.endsWith(".g")) toRemove.push(object);
    else if (object.isMesh && looksLikeGuideMesh(object)) toRemove.push(object);
    else if (removableNames.some((part) => name.includes(part))) toRemove.push(object);
  });
  toRemove.forEach((object) => object.parent?.remove(object));
}

function looksLikeGuideMesh(object) {
  if (!object.geometry) return false;
  object.geometry.computeBoundingBox();
  const size = object.geometry.boundingBox?.getSize(new THREE.Vector3());
  if (!size) return false;
  const dimensions = [size.x, size.y, size.z].sort((a, b) => a - b);
  const [shortest, middle, longest] = dimensions;
  if (longest <= 0) return false;
  return (shortest / longest < 0.004 && middle / longest < 0.018) || (longest > 1.8 && shortest < 0.012);
}

function fitCameraToObject(camera, controls, object, systemKey, options = {}) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const config = CAMERA_CONFIG[systemKey] ?? { zoom: 0.72, y: 0.03 };
  const zoom = options.preview ? (config.previewZoom ?? config.zoom * 1.16) : config.zoom;
  const radius = Math.max(size.x, size.y, size.z) * zoom;
  const distance = Math.max(2.2, radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)));
  const target = center.clone();
  target.y += size.y * (config.y ?? 0.03);
  camera.position.set(target.x, target.y, center.z + distance * 0.9);
  camera.lookAt(target);
  controls?.target.copy(target);
  controls?.update();
}

function applySystemMaterial(model, systemKey) {
  const color = new THREE.Color(systemConfig[systemKey].color);
  const opacity = getSystemModelOpacity(systemKey);
  model.traverse((object) => {
    if (!object.isMesh) return;
    object.frustumCulled = false;
    const materials = Array.isArray(object.material) ? object.material : [object.material].filter(Boolean);
    if (!materials.length) object.material = createMaterial(color, opacity);
    materials.forEach((material) => {
      const preserveSource = shouldPreserveSourceMaterial(systemKey, material, object);
      const namedColor = getMaterialNameColor(systemKey, material);
      if (material.color) {
        const maxChannel = Math.max(material.color.r, material.color.g, material.color.b);
        const minChannel = Math.min(material.color.r, material.color.g, material.color.b);
        const brightness = material.color.r + material.color.g + material.color.b;
        const saturation = maxChannel - minChannel;
        if (!preserveSource && namedColor) material.color.copy(namedColor);
        else if (!preserveSource && (brightness < 0.28 || brightness > 2.35 || saturation < 0.08)) {
          material.color.copy(color);
        }
      }
      material.transparent = opacity < 1;
      material.opacity = opacity;
      material.roughness = Math.max(material.roughness ?? 0.58, 0.58);
      material.metalness = 0;
      material.depthWrite = opacity > 0.9;
      material.needsUpdate = true;
    });
  });
}

function shouldPreserveSourceMaterial(systemKey, material, object) {
  if (!PRESERVE_SOURCE_MATERIAL_KEYS.has(systemKey)) return false;
  return Boolean(material.map || material.emissiveMap || material.normalMap || object.geometry?.hasAttribute?.("color"));
}

function getMaterialNameColor(systemKey, material) {
  const rules = MATERIAL_NAME_COLORS[systemKey];
  if (!rules?.length) return null;
  const name = (material.name ?? "").toLowerCase();
  const rule = rules.find(({ match }) => name.includes(match));
  return rule ? new THREE.Color(rule.color) : null;
}

function getSystemModelOpacity(systemKey) {
  return {
    integumentary: 0.74,
    skeletal: 0.98,
    muscular: 0.9,
    nervous: 0.95,
    circulatory: 0.92,
    respiratory: 0.88,
    digestive: 0.92,
    urinary: 0.92,
    endocrine: 0.92,
    lymphatic: 0.9,
    reproductiveMale: 0.92,
    reproductiveFemale: 0.92,
  }[systemKey] ?? 0.9;
}

function clearObject(object) {
  while (object.children.length) {
    const child = object.children[0];
    object.remove(child);
    child.traverse((node) => {
      node.geometry?.dispose?.();
      if (node.material) {
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        materials.forEach((material) => material.dispose?.());
      }
    });
  }
}

function createFallbackModel(systemKey) {
  const color = new THREE.Color(systemConfig[systemKey].color);
  const group = new THREE.Group();
  const material = createMaterial(color, 0.88);
  const lineMaterial = createMaterial(color, 0.72);

  if (["integumentary", "muscular"].includes(systemKey)) addBodyFallback(group, material, systemKey === "muscular" ? 0.9 : 0.7);
  if (systemKey === "skeletal") addSkeletonFallback(group);
  if (systemKey === "nervous") addNervousFallback(group, material, lineMaterial);
  if (systemKey === "circulatory") addCirculatoryFallback(group, material, lineMaterial);
  if (systemKey === "respiratory") addRespiratoryFallback(group, material);
  if (systemKey === "digestive") addDigestiveFallback(group, material);
  if (systemKey === "urinary") addUrinaryFallback(group, material);
  if (systemKey === "endocrine") addEndocrineFallback(group, material);
  if (systemKey === "lymphatic") addLymphaticFallback(group, material, lineMaterial);
  if (systemKey === "reproductiveMale") addReproductiveFallback(group, material, false);
  if (systemKey === "reproductiveFemale") addReproductiveFallback(group, material, true);
  if (!group.children.length) addBodyFallback(group, material, 0.7);
  return group;
}

function createMaterial(color, opacity = 1) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.72, metalness: 0, transparent: opacity < 1, opacity });
}

function addBodyFallback(group, material, opacity) {
  const body = material.clone();
  body.opacity = opacity;
  body.transparent = true;
  addCapsule(group, 0, 2.9, 0, 0.34, 0.44, body);
  addCapsule(group, 0, 1.95, 0, 0.62, 0.86, body);
  addLimb(group, -0.62, 1.95, -0.84, 0.72, 0.13, body);
  addLimb(group, 0.62, 1.95, 0.84, 0.72, 0.13, body);
  addLimb(group, -0.25, 1.2, -0.32, 0.08, 0.15, body);
  addLimb(group, 0.25, 1.2, 0.32, 0.08, 0.15, body);
}

function addSkeletonFallback(group) {
  const bone = createMaterial(0xf2f3ed, 0.98);
  addCapsule(group, 0, 2.92, 0, 0.28, 0.35, bone);
  addLimb(group, 0, 2.32, 0, 1.12, 0.035, bone);
  for (let i = 0; i < 7; i += 1) {
    addLimb(group, -0.08 - i * 0.025, 2.45 - i * 0.105, -0.44, 2.34 - i * 0.075, 0.025, bone);
    addLimb(group, 0.08 + i * 0.025, 2.45 - i * 0.105, 0.44, 2.34 - i * 0.075, 0.025, bone);
  }
  addLimb(group, -0.5, 2.32, -0.7, 0.68, 0.055, bone);
  addLimb(group, 0.5, 2.32, 0.7, 0.68, 0.055, bone);
  addLimb(group, -0.2, 1.4, -0.3, 0.0, 0.065, bone);
  addLimb(group, 0.2, 1.4, 0.3, 0.0, 0.065, bone);
}

function addNervousFallback(group, material, lineMaterial) {
  addCapsule(group, 0, 2.95, 0, 0.25, 0.32, material);
  addLimb(group, 0, 2.55, 0, 0.35, 0.035, lineMaterial);
  [-0.55, -0.3, 0.3, 0.55].forEach((x) => addLimb(group, 0, 2.1, x, 0.85, 0.018, lineMaterial));
}

function addCirculatoryFallback(group, material, lineMaterial) {
  addCapsule(group, 0.12, 2.28, 0, 0.16, 0.2, material);
  addLimb(group, 0, 2.6, 0, 0.24, 0.035, lineMaterial);
  [-0.62, -0.32, 0.32, 0.62].forEach((x) => addLimb(group, 0, 2.25, x, 0.34, 0.018, lineMaterial));
}

function addRespiratoryFallback(group, material) {
  addLimb(group, 0, 2.72, 0, 2.24, 0.045, material);
  addCapsule(group, -0.23, 2.16, 0, 0.22, 0.38, material);
  addCapsule(group, 0.23, 2.16, 0, 0.22, 0.38, material);
}

function addDigestiveFallback(group, material) {
  addLimb(group, 0, 2.65, 0, 2.08, 0.035, material);
  addCapsule(group, 0.2, 1.92, 0, 0.28, 0.2, material);
  addCapsule(group, 0, 1.48, 0, 0.38, 0.34, material);
  addCapsule(group, 0, 1.18, 0, 0.28, 0.2, material);
}

function addUrinaryFallback(group, material) {
  addCapsule(group, -0.24, 1.82, 0, 0.16, 0.24, material);
  addCapsule(group, 0.24, 1.82, 0, 0.16, 0.24, material);
  addLimb(group, -0.18, 1.6, -0.08, 1.22, 0.022, material);
  addLimb(group, 0.18, 1.6, 0.08, 1.22, 0.022, material);
  addCapsule(group, 0, 1.05, 0, 0.18, 0.16, material);
}

function addEndocrineFallback(group, material) {
  [[0, 2.98, 0.08], [0, 2.48, 0.08], [-0.24, 1.82, 0.08], [0.24, 1.82, 0.08], [0, 1.02, 0.1]].forEach(([x, y, radius]) => {
    addCapsule(group, x, y, 0, radius, radius, material);
  });
}

function addLymphaticFallback(group, material, lineMaterial) {
  addLimb(group, 0, 2.55, 0, 0.55, 0.025, lineMaterial);
  [-0.45, -0.25, 0.25, 0.45].forEach((x) => {
    addCapsule(group, x, 2.1, 0, 0.06, 0.06, material);
    addCapsule(group, x * 0.8, 1.4, 0, 0.06, 0.06, material);
  });
}

function addReproductiveFallback(group, material, female) {
  if (female) {
    addCapsule(group, 0, 1.26, 0, 0.16, 0.18, material);
    addCapsule(group, -0.2, 1.32, 0, 0.08, 0.08, material);
    addCapsule(group, 0.2, 1.32, 0, 0.08, 0.08, material);
    addLimb(group, 0, 1.14, 0, 0.85, 0.04, material);
  } else {
    addCapsule(group, 0, 1.08, 0, 0.14, 0.12, material);
    addCapsule(group, -0.1, 0.82, 0, 0.08, 0.1, material);
    addCapsule(group, 0.1, 0.82, 0, 0.08, 0.1, material);
    addLimb(group, 0, 1.0, 0, 0.62, 0.035, material);
  }
}

function addCapsule(group, x, y, z, radius, height, material) {
  const geometry = new THREE.CapsuleGeometry(radius, height, 12, 20);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  group.add(mesh);
  return mesh;
}

function addLimb(group, x1, y1, x2, y2, radius, material) {
  const start = new THREE.Vector3(x1, y1, 0);
  const end = new THREE.Vector3(x2, y2, 0);
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const geometry = new THREE.CapsuleGeometry(radius, length, 8, 12);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  group.add(mesh);
  return mesh;
}
