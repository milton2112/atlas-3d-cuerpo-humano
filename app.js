import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  organHotspots,
  organInfo,
  systemConfig,
  systemDetails,
  systemOrder,
} from "./data.js?v=20260421-final-polish-2";

const MODEL_VERSION = "20260421-final-polish-2";
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
  lymphatic: "lymphatic.glb",
  reproductiveMale: "reproductive-male.glb",
  reproductiveFemale: null,
};
const REAL_MODEL_KEYS = new Set(Object.entries(MODEL_FILES).filter(([, file]) => Boolean(file)).map(([key]) => key));

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
const detailFunction = document.querySelector("#detail-function");
const detailOrgans = document.querySelector("#detail-organs");
const detailKeyFact = document.querySelector("#detail-key-fact");
const detailQuestion = document.querySelector("#detail-question");
const detailMiniSummary = document.querySelector("#detail-mini-summary");
const organPanel = document.querySelector("#organ-panel");
const organTitle = document.querySelector("#organ-title");
const organDescription = document.querySelector("#organ-description");
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
const viewFullButton = document.querySelector("#view-full");
const viewModelButton = document.querySelector("#view-model");
const viewSheetButton = document.querySelector("#view-sheet");

const loader = new GLTFLoader();
const viewers = new Set();
let detailViewer = null;
let tourActive = false;
let currentSystemKey = systemOrder[0];

buildSystemGallery();
buildQuickIndex();
bindEvents();

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

  document.addEventListener("keydown", (event) => {
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
    const meta = document.createElement("div");
    meta.className = "card-meta";
    meta.innerHTML = `<span>${organCount} organos clave</span><span>Explorar</span>`;

    const title = document.createElement("div");
    title.className = "system-title";
    title.innerHTML = `<span>${systemConfig[systemKey].label}</span>`;

    const summary = document.createElement("p");
    summary.className = "card-summary";
    summary.textContent = systemDetails[systemKey]?.miniSummary ?? "Explora este sistema.";

    card.append(stage, meta, title, summary);
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

function openSystemDetail(systemKey) {
  currentSystemKey = systemKey;
  const detail = systemDetails[systemKey] ?? {
    title: systemConfig[systemKey].label,
    summary: "Vista general del sistema.",
    description: "Modelo independiente para explorar sin superponer capas.",
  };

  setDetailViewMode("full");
  setModelStatus("Cargando modelo 3D...", "loading");
  detailTitle.textContent = detail.title;
  detailSummary.textContent = detail.summary;
  detailDescription.textContent = detail.description ?? detail.summary;
  detailFunction.textContent = detail.function ?? detail.description ?? detail.summary;
  detailKeyFact.textContent = detail.keyFact ?? "Relaciona este sistema con otros para entender su funcion.";
  detailQuestion.textContent = detail.question ?? "Que organos reconoces en esta vista?";
  detailMiniSummary.textContent = detail.miniSummary ?? detail.summary;
  organPanel.classList.add("hidden");

  renderOrganList(systemKey);
  detailViewer?.dispose();
  detailStage.innerHTML = "";
  detailStage.style.setProperty("--system-color", systemConfig[systemKey].color);
  detailViewer = createSystemViewer(detailStage, systemKey, {
    onLoad: () => setModelStatus("Modelo 3D cargado.", "ready"),
    onFallback: () => setModelStatus("Modelo temporal disponible.", "fallback"),
    onError: () => setModelStatus("No se pudo cargar el modelo 3D. Vista temporal disponible.", "error"),
  });
  renderOrganHotspots(systemKey);

  gallery.classList.add("hidden");
  heroCard.classList.add("hidden");
  atlasTools?.classList.add("hidden");
  tourComplete.classList.add("hidden");
  detailView.classList.remove("hidden");
  updateTourBanner();
  backButton.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
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
    item.innerHTML = `<strong>${organ.title}</strong><span>${organ.description}</span>`;
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

function closeSystemDetail() {
  tourActive = false;
  detailViewer?.dispose();
  detailViewer = null;
  detailView.classList.add("hidden");
  gallery.classList.remove("hidden");
  heroCard.classList.remove("hidden");
  atlasTools?.classList.remove("hidden");
  tourBanner.classList.add("hidden");
  tourComplete.classList.add("hidden");
  clearSearchResults();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showOrganInfo(organ, organId) {
  organTitle.textContent = organ.title;
  organDescription.textContent = organ.description;
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
  detailViewer?.dispose();
  detailViewer = null;
  detailView.classList.add("hidden");
  tourBanner.classList.add("hidden");
  heroCard.classList.remove("hidden");
  atlasTools?.classList.remove("hidden");
  gallery.classList.remove("hidden");
  tourComplete.classList.remove("hidden");
  tourComplete.scrollIntoView({ behavior: "smooth", block: "center" });
}

function updateTourBanner() {
  if (!tourActive) {
    tourBanner.classList.add("hidden");
    return;
  }
  const currentIndex = systemOrder.indexOf(currentSystemKey);
  const detail = systemDetails[currentSystemKey];
  tourTitle.textContent = `Paso ${currentIndex + 1} de ${systemOrder.length}: ${detail.title}`;
  tourCopy.textContent = detail.question;
  tourNext.textContent = currentIndex === systemOrder.length - 1 ? "Finalizar recorrido" : "Siguiente sistema";
  tourProgressBar.style.width = `${((currentIndex + 1) / systemOrder.length) * 100}%`;
  tourBanner.classList.remove("hidden");
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
  if (THUMBNAIL_KEYS.has(systemKey)) {
    const image = document.createElement("img");
    image.className = "preview-thumbnail";
    image.alt = "";
    image.loading = "lazy";
    image.addEventListener("load", () => figure.classList.add("has-thumbnail"));
    image.addEventListener("error", () => image.remove());
    image.src = `${THUMBNAIL_BASE_PATH}/${systemKey}.png?v=${MODEL_VERSION}`;
    figure.prepend(image);
  }
  container.appendChild(figure);
  return {
    resize() {},
    dispose() {
      figure.remove();
    },
  };
}

function createSystemViewer(container, systemKey, options = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.45));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = false;
  renderer.domElement.className = "model-canvas";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.zoomToCursor = true;
  controls.minDistance = 1.2;
  controls.maxDistance = 9;

  addLights(scene);
  const root = new THREE.Group();
  scene.add(root);

  const state = { disposed: false, animationId: 0 };
  resize();

  const fallback = createFallbackModel(systemKey);
  root.add(fallback);
  fitCameraToObject(camera, controls, fallback);
  renderScene();

  loadSystemModel(systemKey)
    .then((model) => {
      if (state.disposed) return;
      root.clear();
      cleanupImportedModel(model);
      normalizeModel(model);
      applySystemMaterial(model, systemKey);
      root.add(model);
      fitCameraToObject(camera, controls, model);
      renderScene();
      options.onLoad?.();
    })
    .catch(() => {
      if (state.disposed) return;
      root.clear();
      root.add(createFallbackModel(systemKey));
      fitCameraToObject(camera, controls, root);
      renderScene();
      if (REAL_MODEL_KEYS.has(systemKey)) options.onError?.();
      else options.onFallback?.();
    });

  animate();

  function animate() {
    if (state.disposed) return;
    controls.update();
    renderScene();
    state.animationId = requestAnimationFrame(animate);
  }

  function renderScene() {
    renderer.render(scene, camera);
  }

  function resize() {
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderScene();
  }

  function dispose() {
    state.disposed = true;
    cancelAnimationFrame(state.animationId);
    controls.dispose();
    scene.traverse((object) => {
      object.geometry?.dispose?.();
      if (object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose?.());
      }
    });
    renderer.dispose();
    renderer.domElement.remove();
  }

  return { resize, dispose };
}

function renderOrganHotspots(systemKey) {
  const hotspots = organHotspots[systemKey] ?? [];
  if (!hotspots.length) return;

  const layer = document.createElement("div");
  layer.className = "hotspot-layer";
  layer.setAttribute("aria-label", "Puntos interactivos del sistema");

  hotspots.forEach((hotspot) => {
    const organ = organInfo[hotspot.organId];
    if (!organ) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hotspot-button";
    button.dataset.organId = hotspot.organId;
    button.style.left = `${hotspot.x}%`;
    button.style.top = `${hotspot.y}%`;
    button.setAttribute("aria-label", `Ver informacion de ${organ.title}`);
    button.innerHTML = `<span>${organ.title}</span>`;
    button.addEventListener("click", () => showOrganInfo(organ, hotspot.organId));
    layer.appendChild(button);
  });

  detailStage.appendChild(layer);
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
  scene.add(new THREE.HemisphereLight(0xdff7ff, 0x12334b, 2.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.8);
  key.position.set(2.5, 4, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x9adfff, 1.5);
  fill.position.set(-4, 1.2, 2);
  scene.add(fill);
}

function normalizeModel(model) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  model.position.sub(center);
  model.scale.multiplyScalar(3.55 / maxDim);
  const nextBox = new THREE.Box3().setFromObject(model);
  model.position.y -= nextBox.min.y;
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

function fitCameraToObject(camera, controls, object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const radius = Math.max(size.x, size.y, size.z) * 0.72;
  const distance = Math.max(2.2, radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)));
  camera.position.set(center.x, center.y + size.y * 0.03, center.z + distance * 0.9);
  camera.lookAt(center);
  controls.target.copy(center);
  controls.update();
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
      if (material.color) {
        const maxChannel = Math.max(material.color.r, material.color.g, material.color.b);
        const minChannel = Math.min(material.color.r, material.color.g, material.color.b);
        const brightness = material.color.r + material.color.g + material.color.b;
        const saturation = maxChannel - minChannel;
        if (brightness < 0.28 || brightness > 2.35 || saturation < 0.08) material.color.copy(color);
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
