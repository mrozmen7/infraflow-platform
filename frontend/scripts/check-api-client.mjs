#!/usr/bin/env node

/**
 * Fails when the checked-in API client in src/app/core/api/generated is out of
 * sync with contracts/openapi/infraflow-api-v1.openapi.json. Regenerates the
 * client into a temporary directory and compares both trees byte for byte.
 * Run `npm run generate:api` to update the client after a contract change.
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';

const frontendRoot = new URL('..', import.meta.url).pathname;
const contractPath = join(frontendRoot, '..', 'contracts', 'openapi', 'infraflow-api-v1.openapi.json');
const generatedPath = join(frontendRoot, 'src', 'app', 'core', 'api', 'generated');
const generatorBin = join(frontendRoot, 'node_modules', 'ng-openapi-gen', 'lib', 'index.js');

function collectFiles(directory, base = directory) {
  const entries = [];
  for (const name of readdirSync(directory).sort()) {
    const fullPath = join(directory, name);
    if (statSync(fullPath).isDirectory()) {
      entries.push(...collectFiles(fullPath, base));
    } else {
      entries.push(relative(base, fullPath));
    }
  }
  return entries;
}

const tempOutput = mkdtempSync(join(tmpdir(), 'infraflow-api-client-'));

try {
  execFileSync(process.execPath, [generatorBin, '--input', contractPath, '--output', tempOutput], {
    stdio: 'ignore',
  });

  const expected = collectFiles(generatedPath);
  const actual = collectFiles(tempOutput);

  const missing = expected.filter((file) => !actual.includes(file));
  const unexpected = actual.filter((file) => !expected.includes(file));
  const changed = expected.filter(
    (file) =>
      actual.includes(file) &&
      !readFileSync(join(generatedPath, file)).equals(readFileSync(join(tempOutput, file))),
  );

  if (missing.length > 0 || unexpected.length > 0 || changed.length > 0) {
    console.error('API client is out of sync with contracts/openapi/infraflow-api-v1.openapi.json.');
    for (const file of missing) console.error(`  missing:   ${file}`);
    for (const file of unexpected) console.error(`  unexpected: ${file}`);
    for (const file of changed) console.error(`  changed:   ${file}`);
    console.error('Run `npm run generate:api` and commit the result.');
    process.exit(1);
  }

  console.log(`API client is in sync with the OpenAPI contract (${expected.length} files).`);
} finally {
  rmSync(tempOutput, { recursive: true, force: true });
}
