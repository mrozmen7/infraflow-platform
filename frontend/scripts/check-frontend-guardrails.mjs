import { readdir, readFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const sourceRoot = resolve(process.cwd(), 'src');
const files = await collectFiles(sourceRoot);
const violations = [];

const securityRules = [
  {
    pattern: /\[innerHTML\]|\.innerHTML\s*=/,
    message: 'dynamic HTML requires an explicit security review; use text interpolation by default',
  },
  {
    pattern: /bypassSecurityTrust(?:Html|Script|Style|Url|ResourceUrl)/,
    message: 'DomSanitizer bypass APIs are forbidden without an approved security exception',
  },
  {
    pattern: /\beval\s*\(|\bnew\s+Function\s*\(/,
    message: 'dynamic code execution is forbidden',
  },
  {
    pattern: /console\.(?:log|debug|trace)\s*\(/,
    message: 'debug console output must not ship in application code',
  },
  {
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    message: 'private key material must never be stored in frontend source',
  },
  {
    pattern:
      /\b(?:apiKey|clientSecret|accessToken|refreshToken)\s*[:=]\s*['"`][^'"`\s]{16,}['"`]/i,
    message: 'hard-coded secret-like values are forbidden in frontend source',
  },
  {
    pattern:
      /\bAuthorization\s*:\s*['"`]Bearer\s+[A-Za-z0-9._~+/=-]{12,}['"`]/i,
    message: 'hard-coded bearer credentials are forbidden in frontend source',
  },
];

const securityRuleProofs = [
  {
    message: 'private key material must never be stored in frontend source',
    unsafeExample: '-----BEGIN PRIVATE KEY-----',
  },
  {
    message: 'hard-coded secret-like values are forbidden in frontend source',
    unsafeExample: "const apiKey = 'example-not-a-real-secret-value';",
  },
  {
    message: 'hard-coded bearer credentials are forbidden in frontend source',
    unsafeExample: "const headers = { Authorization: 'Bearer example-not-a-real-token' };",
  },
];

validateSecurityRuleProofs();

for (const file of files) {
  const source = await readFile(file, 'utf8');
  const fileName = relative(process.cwd(), file).replaceAll('\\', '/');

  for (const rule of securityRules) {
    if (rule.pattern.test(source)) {
      violations.push(`${fileName}: ${rule.message}`);
    }
  }

  if (!file.endsWith('.html')) {
    continue;
  }

  for (const match of source.matchAll(/<button\b[\s\S]*?>/g)) {
    if (!/\btype\s*=/.test(match[0])) {
      violations.push(`${fileName}: every button must declare an explicit type`);
    }
  }

  for (const match of source.matchAll(/<img\b[\s\S]*?>/g)) {
    if (!/\balt\s*=/.test(match[0])) {
      violations.push(`${fileName}: every image must declare alt text, including alt=""`);
    }
  }

  for (const match of source.matchAll(/<a\b[\s\S]*?target=["']_blank["'][\s\S]*?>/g)) {
    if (!/\brel=["'][^"']*noopener/.test(match[0])) {
      violations.push(`${fileName}: target="_blank" links must include rel="noopener"`);
    }
  }

  if (/<(?:div|span)\b[^>]*\(click\)=/.test(source)) {
    violations.push(`${fileName}: use a native button or link for clickable interactions`);
  }
}

if (violations.length > 0) {
  console.error('Frontend guardrail violations:\n');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log(
  `Frontend guardrails passed for ${files.length} source files with ${securityRuleProofs.length} security rule proofs.`,
);

function validateSecurityRuleProofs() {
  for (const proof of securityRuleProofs) {
    const rule = securityRules.find((candidate) => candidate.message === proof.message);

    if (!rule?.pattern.test(proof.unsafeExample)) {
      throw new Error(`Guardrail self-check failed: ${proof.message}`);
    }
  }
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      results.push(...(await collectFiles(path)));
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.html'))) {
      results.push(path);
    }
  }

  return results;
}
