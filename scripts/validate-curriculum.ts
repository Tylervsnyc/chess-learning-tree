#!/usr/bin/env ts-node
/**
 * Validate Curriculum Structure
 *
 * Checks the V2 curriculum against structure rules:
 * - No consecutive lessons with same piece filter
 * - No consecutive lessons with identical tags
 * - Section variety requirements
 * - Review section requirements
 *
 * Usage:
 *   npx ts-node scripts/validate-curriculum.ts
 *   npx ts-node scripts/validate-curriculum.ts --level 1
 *   npx ts-node scripts/validate-curriculum.ts --all
 */

import { level1V2 } from '../data/staging/level1-v2-curriculum';
import { level2V2 } from '../data/staging/level2-v2-curriculum';
import { level3V2 } from '../data/staging/level3-v2-curriculum';
import {
  validateCurriculumStructure,
  printValidationReport,
  LevelForValidation,
  CURRICULUM_STRUCTURE_RULES,
} from '../data/curriculum-v2-config';

// Parse command line args
const args = process.argv.slice(2);
const levelArg = args.find(a => a.startsWith('--level='))?.split('=')[1] ||
                 args[args.indexOf('--level') + 1];
const showAll = args.includes('--all');

console.log('\n🎓 CHESS PATH V2 CURRICULUM VALIDATOR\n');
console.log('Rules being checked:');
console.log(`  • MAX_CONSECUTIVE_SAME_PIECE: ${CURRICULUM_STRUCTURE_RULES.MAX_CONSECUTIVE_SAME_PIECE}`);
console.log(`  • MAX_CONSECUTIVE_SAME_TAGS: ${CURRICULUM_STRUCTURE_RULES.MAX_CONSECUTIVE_SAME_TAGS}`);
console.log(`  • MIN_UNIQUE_PIECES_PER_SECTION: ${CURRICULUM_STRUCTURE_RULES.MIN_UNIQUE_PIECES_PER_SECTION}`);
console.log(`  • REVIEW_MUST_BE_MIXED: ${CURRICULUM_STRUCTURE_RULES.REVIEW_MUST_BE_MIXED}`);

const levels = [
  { num: 1, data: level1V2 as LevelForValidation },
  { num: 2, data: level2V2 as LevelForValidation },
  { num: 3, data: level3V2 as LevelForValidation },
];

let totalErrors = 0;
let totalWarnings = 0;

for (const { num, data } of levels) {
  if (levelArg && levelArg !== String(num)) continue;

  const result = validateCurriculumStructure(data);
  totalErrors += result.errors.length;
  totalWarnings += result.warnings.length;

  if (showAll || result.errors.length > 0 || result.warnings.length > 0) {
    printValidationReport(data);
  } else {
    console.log(`\n✓ Level ${num}: ${data.name} - ${result.summary}`);
  }
}

// Summary
console.log('\n' + '─'.repeat(60));
if (totalErrors === 0 && totalWarnings === 0) {
  console.log('🎉 All curricula pass validation!\n');
} else if (totalErrors === 0) {
  console.log(`⚠️  ${totalWarnings} warnings across all levels (no blocking errors)\n`);
} else {
  console.log(`❌ ${totalErrors} errors, ${totalWarnings} warnings - please fix before deploying\n`);
  process.exit(1);
}
