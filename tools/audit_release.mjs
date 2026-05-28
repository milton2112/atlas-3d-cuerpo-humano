import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const appPath = path.join(root, "app.js");
const dataPath = path.join(root, "data.js");
const appSource = fs.readFileSync(appPath, "utf8");
const data = await import(pathToFileURL(dataPath));

const MB = 1024 * 1024;
const warnings = [];
const errors = [];

function readModelFiles() {
  const match = appSource.match(/const MODEL_FILES = \{([\s\S]*?)\};/);
  if (!match) {
    errors.push("No se pudo leer MODEL_FILES en app.js.");
    return {};
  }

  const entries = {};
  for (const line of match[1].split("\n")) {
    const item = line.trim().match(/^([A-Za-z0-9]+):\s*(?:"([^"]+)"|null),?/);
    if (item) entries[item[1]] = item[2] ?? null;
  }
  return entries;
}

function checkFile(filePath, label) {
  if (!fs.existsSync(filePath)) {
    errors.push(`Falta ${label}: ${path.relative(root, filePath)}`);
    return null;
  }
  return fs.statSync(filePath);
}

function checkModels() {
  const modelFiles = readModelFiles();
  for (const [systemKey, fileName] of Object.entries(modelFiles)) {
    if (!fileName) continue;
    const stat = checkFile(path.join(root, "assets", "models", fileName), `modelo de ${systemKey}`);
    if (!stat) continue;
    const sizeMb = stat.size / MB;
    if (sizeMb > 35) warnings.push(`${fileName} pesa ${sizeMb.toFixed(1)} MB. Conviene crear una version mobile.`);
    else if (sizeMb > 20) warnings.push(`${fileName} pesa ${sizeMb.toFixed(1)} MB. Revisar optimizacion antes de publicar.`);
  }
}

function checkDigestiveImages() {
  const sections = data.systemLessonSections?.digestive ?? [];
  for (const section of sections) {
    if (!section.image) continue;
    const relativePath = section.image.replace(/^\.\//, "");
    checkFile(path.join(root, relativePath), `imagen digestiva "${section.title}"`);
  }
}

function checkSystemData() {
  for (const systemKey of data.systemOrder ?? []) {
    if (!data.systemConfig?.[systemKey]) errors.push(`Falta systemConfig para ${systemKey}.`);
    if (!data.systemDetails?.[systemKey]) errors.push(`Falta systemDetails para ${systemKey}.`);
    if (!data.modelAudit?.[systemKey]) warnings.push(`Falta modelAudit para ${systemKey}.`);
  }

  for (const [organId, organ] of Object.entries(data.organInfo ?? {})) {
    if (!data.systemConfig?.[organ.systemKey]) errors.push(`El organo ${organId} apunta a un sistema inexistente: ${organ.systemKey}.`);
  }
}

function checkCleanFolders() {
  const emptyPreferred = [path.join(root, "assets", "downloads"), path.join(root, "assets", "thumbnails")];
  for (const folder of emptyPreferred) {
    if (!fs.existsSync(folder)) continue;
    const entries = fs.readdirSync(folder);
    if (entries.length) warnings.push(`${path.relative(root, folder)} tiene ${entries.length} archivo(s). Revisar si se usan.`);
  }
}

checkModels();
checkDigestiveImages();
checkSystemData();
checkCleanFolders();

console.log("Auditoria de release");
console.log(`Errores: ${errors.length}`);
for (const error of errors) console.log(`ERROR: ${error}`);
console.log(`Advertencias: ${warnings.length}`);
for (const warning of warnings) console.log(`AVISO: ${warning}`);

if (errors.length) process.exitCode = 1;
