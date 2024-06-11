import { UnitInterface } from 'src/data/units.ts';

import timeToKill from './timetoKill';

// calculate the estimated cost efficiency of a matchup between two units
// returns a decimal representing the cost efficiency ratio
const combatEfficiency = (attacker: UnitInterface, target: UnitInterface): number => {
  const ttkAttacker = timeToKill(attacker, target);
  const ttkTarget = timeToKill(target, attacker);

  // speed/range approximations
  // TODO: Test that speed represents meters/second
  const rangeDiff = attacker.range - target.range;
  if (rangeDiff > 0) {
    ttkTarget.time += rangeDiff / target.speed;
  } else if (rangeDiff < 0) {
    ttkAttacker.time += -rangeDiff / attacker.speed
  }


  const costRatio = target.cost / attacker.cost;
  const killRatio = ttkAttacker.time / ttkTarget.time;

  return costRatio / killRatio;
}

export default combatEfficiency;