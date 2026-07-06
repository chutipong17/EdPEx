#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadTemplate(name) {
  return readFileSync(
    path.join(__dirname, "templates", name),
    "utf8"
  );
}

function applyTemplate(template, variables) {
  return Object.entries(variables).reduce(
    (result, [key, value]) =>
      result.replaceAll(`{{${key}}}`, value),
    template
  );
}

const moduleName = process.argv[2];

if (!moduleName) {
  console.error("Please provide a module name");
  console.log("Usage: node generate-module.js <module-name>");
  process.exit(1);
}

const pascalCase = (str) =>
  str
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");

const camelCase = (str) => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

const displayName = (str) =>
  str
    .split(/[-_]/)
    .join(" ");

// CamelCase version for variable names
const moduleNameCamel = camelCase(moduleName);

// PascalCase version for class names
const moduleNamePascal = pascalCase(moduleName);
const moduleDisplayName = displayName(moduleName);

const templateVariables = {
  moduleName,
  moduleNamePascal,
  moduleNameCamel,
  displayName: moduleDisplayName,
};

const moduleDir = path.join(
  process.cwd(),
  "src",
  "app",
  "server",
  "modules",
  moduleName
);

if (existsSync(moduleDir)) {
  console.error(`Module "${moduleName}" already exists`);
  process.exit(1);
}

mkdirSync(moduleDir, { recursive: true });

const files = {
  [`${moduleName}.repository.ts`]: applyTemplate(
    loadTemplate("repository.tpl"),
    templateVariables
  ),

  [`${moduleName}.service.ts`]: applyTemplate(
    loadTemplate("service.tpl"),
    templateVariables
  ),

  [`${moduleName}.controller.ts`]: applyTemplate(
    loadTemplate("controller.tpl"),
    templateVariables
  ),

  [`${moduleName}.route.ts`]: applyTemplate(
    loadTemplate("route.tpl"),
    templateVariables
  ),
};

Object.entries(files).forEach(([fileName, content]) => {
  const filePath = path.join(moduleDir, fileName);

  if (!existsSync(filePath)) {
    writeFileSync(filePath, content);
    console.log(`Created ${fileName}`);
  }
});

updateAppTs();

console.log(`\n✅ Module '${moduleName}' generated successfully`);

function updateAppTs() {
  const appFile = path.join(
    process.cwd(),
    "src",
    "app",
    "server",
    "app.ts"
  );

  if (!existsSync(appFile)) {
    console.log(
      "⚠ app.ts not found. Route registration skipped."
    );
    return;
  }

  let content = readFileSync(appFile, "utf8");

  const importLine = `import ${moduleNameCamel}Router from "./modules/${moduleName}/${moduleName}.route";`;

  if (!content.includes(importLine)) {
    const lastImportIndex = content.lastIndexOf("import");
    const endOfImports = content.indexOf("\n", content.indexOf(";", lastImportIndex));

    // Insert new import after the last import
    content =
      content.slice(0, endOfImports + 1) +
      importLine +
      "\n" +
      content.slice(endOfImports + 1);
  }

  const routeLine = `app.route("/${moduleName}", ${moduleNameCamel}Router);`;

  if (!content.includes(routeLine)) {
    const lastRouteIndex = content.lastIndexOf("app.route(");
    const endOfRoutes = content.indexOf("\n", content.indexOf(";", lastRouteIndex));

    // Insert new route after the last route
    content =
      content.slice(0, endOfRoutes + 1) +
      routeLine +
      "\n" +
      content.slice(endOfRoutes + 1);
  }

  writeFileSync(appFile, content);

  console.log("Updated app.ts");
}
