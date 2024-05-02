import { UnitInterface } from 'src/data/units.ts';

import timeToKill from './timetoKill';

// calculate the estimated cost efficiency of a matchup between two units
// returns a decimal representing the cost efficiency ratio
const combatEfficiency = (attacker: UnitInterface, target: UnitInterface): number => {
  const ttkAttacker = timeToKill(attacker, target);
  const ttkTarget = timeToKill(target, attacker);

  const costRatio = target.cost / attacker.cost;
  const killRatio = ttkAttacker.time / ttkTarget.time;

  // TODO: Add a calculation here involving ranges and speeds
  // ex: marksman vs arclight - marksman should be more effective?

  return costRatio / killRatio;
}

export default combatEfficiency;