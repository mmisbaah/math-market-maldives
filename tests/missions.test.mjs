import assert from 'node:assert/strict';
import { SHOPS } from '../src/data.js';
import { generateUniqueMission } from '../src/missions.js';
import { localMission, localProduct, localShop } from '../src/i18n.js';

let checked = 0;
for (const track of ['explorer', 'manager', 'planner']) {
  for (let level = 1; level <= 6; level++) {
    for (const shop of Object.values(SHOPS)) {
      const mission = generateUniqueMission(track, level, shop, 0, new Set());
      assert.ok(mission.instruction, `${track} level ${level} missing English prompt`);
      assert.ok(mission.instructionEs, `${track} level ${level} missing Spanish prompt`);
      assert.ok(localMission('es', mission).length > 15);
      assert.ok(localMission('en', mission).length > 15);
      assert.ok(localShop('es', shop));
      for (const product of shop.products) assert.ok(localProduct('es', product));
      checked++;
    }
  }
}
console.log(`Verified ${checked} bilingual missions across all tracks, levels, and stalls.`);
