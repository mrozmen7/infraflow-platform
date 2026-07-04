import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, normalize, relative, resolve } from 'node:path';

const appRoot = resolve(process.cwd(), 'src/app');
const files = await collectTypeScriptFiles(appRoot);
const violations = [];

for (const file of files) {
  const source = await readFile(file, 'utf8');
  const fileName = toPosix(relative(appRoot, file));

  if (fileName.startsWith('features/incidents/data-access/')) {
    violations.push(`${fileName}: legacy data-access boundary is not allowed`);
  }

  for (const importSource of collectImports(source)) {
    const target = resolveImport(file, importSource);
    const isAngularImport = importSource.startsWith('@angular/');

    if (fileName.startsWith('features/incidents/domain/')) {
      forbid(
        isAngularImport ||
          hasAnySegment(target, [
            '/application/',
            '/infrastructure/',
            '/pages/',
            '/ui/',
            '/guards/',
            '/resolvers/',
          ]),
        fileName,
        importSource,
        'domain must remain framework and outer-layer independent',
      );
    }

    if (fileName.startsWith('features/incidents/application/')) {
      forbid(
        isAngularImport ||
          hasAnySegment(target, ['/infrastructure/', '/pages/', '/ui/', '/guards/', '/resolvers/']),
        fileName,
        importSource,
        'application may depend on domain and ports, not Angular or outer layers',
      );
    }

    if (
      (fileName.startsWith('features/incidents/pages/') ||
        fileName.startsWith('features/incidents/ui/')) &&
      target.includes('/features/incidents/infrastructure/')
    ) {
      violations.push(
        `${fileName}: presentation must not import infrastructure directly (${importSource})`,
      );
    }

    if (fileName.startsWith('core/') && target.includes('/features/')) {
      violations.push(`${fileName}: core must not import a feature (${importSource})`);
    }

    if (
      fileName.startsWith('shared/') &&
      (target.includes('/features/') || target.includes('/core/'))
    ) {
      violations.push(
        `${fileName}: shared must remain feature and core independent (${importSource})`,
      );
    }

    const importsIncidentFeature = target.includes('/features/incidents/');
    const isInsideIncidentFeature = fileName.startsWith('features/incidents/');
    const isPublicEntry =
      target.endsWith('/features/incidents/public-api') ||
      target.endsWith('/features/incidents/incidents.routes');

    if (importsIncidentFeature && !isInsideIncidentFeature && !isPublicEntry) {
      violations.push(
        `${fileName}: external code must enter Incidents through public-api or incidents.routes (${importSource})`,
      );
    }
  }
}

if (violations.length > 0) {
  console.error('Architecture boundary violations:\n');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log(`Architecture check passed for ${files.length} TypeScript files.`);

async function collectTypeScriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      results.push(...(await collectTypeScriptFiles(path)));
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      results.push(path);
    }
  }

  return results;
}

function collectImports(source) {
  const imports = new Set();
  const patterns = [
    /\b(?:import|export)\s+(?:type\s+)?[^;]*?\sfrom\s*['"]([^'"]+)['"]/g,
    /\bimport\s*['"]([^'"]+)['"]/g,
    /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      if (match[1]) {
        imports.add(match[1]);
      }
    }
  }

  return imports;
}

function resolveImport(file, importSource) {
  return importSource.startsWith('.')
    ? toPosix(normalize(resolve(dirname(file), importSource)))
    : importSource;
}

function hasAnySegment(value, segments) {
  return segments.some((segment) => value.includes(segment));
}

function forbid(condition, fileName, importSource, reason) {
  if (condition) {
    violations.push(`${fileName}: ${reason} (${importSource})`);
  }
}

function toPosix(value) {
  return value.replaceAll('\\', '/');
}
