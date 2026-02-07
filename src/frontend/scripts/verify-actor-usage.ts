#!/usr/bin/env node
/**
 * Build verification script that ensures deprecated actor patterns are not used
 * This script scans frontend/src (excluding immutable paths) to verify:
 * 1. useActor is not imported or used (should use useAppActor instead)
 * 2. Deprecated admin-token/method strings are not present
 */

import * as fs from 'fs';
import * as path from 'path';

// Paths to exclude from scanning (immutable files)
const EXCLUDED_PATHS = [
  'frontend/src/hooks/useInternetIdentity.ts',
  'frontend/src/hooks/useInternetIdentity.tsx',
  'frontend/src/hooks/useActor.ts',
  'frontend/src/main.tsx',
  'frontend/src/components/ui',
];

// Deprecated patterns to check for
const DEPRECATED_PATTERNS = [
  {
    pattern: /from\s+['"]\.\.?\/.*\/useActor['"]/g,
    message: 'Import of useActor found (should use useAppActor instead)',
  },
  {
    pattern: /useActor\s*\(/g,
    message: 'Call to useActor() found (should use useAppActor instead)',
  },
  {
    pattern: /caffeineAdminToken/g,
    message: 'Reference to caffeineAdminToken found (deprecated admin initialization)',
  },
  {
    pattern: /_initializeAccessControlWithSecret/g,
    message: 'Reference to _initializeAccessControlWithSecret found (deprecated method)',
  },
];

interface ValidationError {
  file: string;
  line: number;
  message: string;
  snippet: string;
}

function shouldExclude(filePath: string): boolean {
  const normalizedPath = filePath.replace(/\\/g, '/');
  return EXCLUDED_PATHS.some(excluded => {
    const normalizedExcluded = excluded.replace(/\\/g, '/');
    return normalizedPath.includes(normalizedExcluded);
  });
}

function scanFile(filePath: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  for (const { pattern, message } of DEPRECATED_PATTERNS) {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    
    while ((match = regex.exec(content)) !== null) {
      // Find line number
      const beforeMatch = content.substring(0, match.index);
      const lineNumber = beforeMatch.split('\n').length;
      const line = lines[lineNumber - 1];

      errors.push({
        file: filePath,
        line: lineNumber,
        message,
        snippet: line.trim(),
      });
    }
  }

  return errors;
}

function scanDirectory(dir: string): ValidationError[] {
  let errors: ValidationError[] = [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (shouldExclude(fullPath)) {
      continue;
    }

    if (entry.isDirectory()) {
      errors = errors.concat(scanDirectory(fullPath));
    } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      errors = errors.concat(scanFile(fullPath));
    }
  }

  return errors;
}

function main() {
  console.log('🔍 Verifying actor usage patterns...\n');

  const srcDir = path.join(process.cwd(), 'frontend', 'src');

  if (!fs.existsSync(srcDir)) {
    console.error('❌ Error: frontend/src directory not found');
    process.exit(1);
  }

  const errors = scanDirectory(srcDir);

  if (errors.length === 0) {
    console.log('✅ All checks passed! No deprecated patterns found.\n');
    process.exit(0);
  }

  console.error(`❌ Found ${errors.length} issue(s):\n`);

  for (const error of errors) {
    console.error(`  ${error.file}:${error.line}`);
    console.error(`    ${error.message}`);
    console.error(`    > ${error.snippet}\n`);
  }

  console.error('Please fix these issues before deploying.\n');
  process.exit(1);
}

main();
