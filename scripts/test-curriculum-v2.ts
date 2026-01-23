import { level1v2, getCurriculumSummary } from '../data/staging/level1-curriculum-v2';

console.log(getCurriculumSummary());

console.log('\nDETAILED BREAKDOWN:\n');

for (const mod of level1v2.modules) {
  const type = mod.themeType === 'end' ? '[END]' : mod.themeType === 'means' ? '[MEANS]' : '[MIXED]';
  console.log(`${type} ${mod.name}`);
  for (const lesson of mod.lessons) {
    const tags = lesson.requiredTags.length > 0 ? lesson.requiredTags.join(' + ') : 'mixed';
    console.log(`    ${lesson.id}: ${lesson.name} (${tags})`);
  }
  console.log('');
}
