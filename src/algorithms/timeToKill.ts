import { units, UnitInterface } from 'src/data/units.ts';

export type ttkInterface = {
  attackRounds: number | null;
  hitsPerKill: number | null;
  time: number;
  effectiveness: number;
  costEfficiency: number;
};

/*
const crawlerSplashTable = [
  [0, 1],
  [3, 1.3],   // melter
  [4.5, 2.15], // warfactory 11, 10, 11, 12,11
  [5, 3],   // fortress, sledge 8, 9, 12
  // [5.5, 0], // storms
  [6, 3],   // rhino
  [7, 4],   // arclight, overlord
  [8, 4.5],   // wraith
  [12, 7],    // sandworm
  [15, 11],  // scorpion, vulcan
];

/* 
AI Analysis:
this seems to represent a quadratic forumla
y=ax^2 + bx + c 
The fitted quadratic function is:

y=0.033x^2 + 0.166x + 0.919
*/
/*
const fangSplashTable = [
  [0, 1],
  [3, 1.1],   // melter 11, 13, 17, 17, 
  [4.5, 1.5], // warfactory
  [5, 1.6],   // fortress, sledge
  // [5.5, 0], // storms
  [6, 2.1],   // rhino 8, 9, 8, 9, 8 9
  [7, 2.75],   // arclight, overlord  7,7,6,7,6,6,6,6
  [8, 0],   // wraith
  [15, 10],  // scorpion, vulcan
];

/* 
AI Analysis:
this seems to represent a quadratic forumla
The fitted quadratic function is:

y = 0.0538x^2 + -0.0504x + 0.6997
*/


// the highest damage value of the melting point damage increments I have measured
const melterDamageTableMax = units.melting_point.damageTable?.reduce(
  (a, b) => a + b,
  0
);

// splash damage formula
const calculateSplashDamageTargets = (
  attacker: UnitInterface,
  target: UnitInterface
) => {
  let splashDamageTargets = 1;
  if (attacker.splashRadius && target.unitCount > 1) {
    // TODO: Change calculations
    // for crawler, fang, mustang....
    // figure out what number of units get hit at various splash damage thresholds
    // turn that into a formula, possibly with a splash index value

    const { rows = 1 } = target;
    let minDistance = target.unitSize / 2 + (target.unitSpacing || 0);

    let rowCount = 1;
    while (attacker.splashRadius > minDistance) {
      // Sometimes there are units on both sides of the target, so 50% chance to hit 3 instead of 2
      splashDamageTargets += 1.5;

      if (rows > rowCount) {
        // +1 hit for the unit in the row behind the target
        splashDamageTargets += 1;
        const diagonalDistance = Math.hypot(minDistance, minDistance) * rowCount;
        if (attacker.splashRadius > diagonalDistance) {
          // Sometimes there are units on both sides of the target, so 50% chance to hit an edge
          splashDamageTargets += 1.5;
        }
      }

      minDistance += target.unitSize + (target.unitSpacing || 0);
      rowCount++;
    }
  }

  // TODO: validate this
  // splash damage calculation is just too unreliable, because the unit often hits off-center
  // to account for this we reduce the impact of splash damage by 15%, hopefully this gives more accurate results.
  return Math.max(1, splashDamageTargets * 0.85);
};

// Calculate an estimated time to kill for a given attacker and defender
// The parameters for unit stats should have all modifiers applied already
export const timeToKill = (
  attacker: UnitInterface,
  target: UnitInterface,
  calculateEffieciency = true,
): ttkInterface => {
  // safety check for invalid units
  if (!attacker || !target) {
    return {
      attackRounds: null,
      hitsPerKill: null,
      time: Infinity,
      effectiveness: 0,
      costEfficiency: 0,
    };
  }

  // untargetable units can never be killed
  if (target.flying && !attacker.shootsUp) {
    return {
      attackRounds: null,
      hitsPerKill: null,
      time: Infinity,
      effectiveness: 0,
      costEfficiency: 0,
    };
  }

  let results;

  const { damageMod = 1 } = attacker;
  const { hpMod = 1 } = target;
  const targetHp = Math.round(target.hp * hpMod);
  const attackerDamage = Math.round(attacker.damage * damageMod);

  let hitsRequired = Math.ceil(targetHp / attackerDamage);
  let totalHitsRequired = target.unitCount * hitsRequired;

  if (attacker.id === 'crawler') {
    // as melee units, crawlers can't all engage at once
    // to account for this we assume the first attack is performed by 8 crawlers
    // the second attack is performed by 16 crawlers
    // the third and subsequent attacks are performed by all crawlers
    if (totalHitsRequired <= 8) {
      results = {
        attackRounds: 1,
        hitsPerKill: hitsRequired,
        time: attacker.attackInterval,
      } as ttkInterface;
    } else if (totalHitsRequired <= 24) {
      results = {
        attackRounds: 2,
        hitsPerKill: hitsRequired,
        time: 2 * attacker.attackInterval,
      } as ttkInterface;
    } else {
      const attackRounds =
        Math.ceil((totalHitsRequired - 24) / attacker.unitCount) + 2;
      results = {
        attackRounds,
        hitsPerKill: hitsRequired,
        time: attackRounds * attacker.attackInterval,
      } as ttkInterface;
    }
  }

  if (attacker.id === 'stormcaller') {
    // stormcallers are unique in that their missiles are very inaccurate
    // this causes a wide spread and a change to miss
    // additionally, the stormcallers tend to target the same unit when aiming at a group
    // because of this, we use a different formula to calculate time to kill for stormcallers
    // we increase their effective splash radius, and reduce their missile damage by 40%
    const splashDamageTargets = calculateSplashDamageTargets(
      {
        ...attacker,
        splashRadius: attacker.splashRadius * 2.5,
      },
      target
    );

    const hitsToKill = Math.ceil(
      targetHp / (attackerDamage * attacker.unitCount * 0.6)
    );

    const attackRounds = Math.ceil(
      (hitsToKill * target.unitCount) / splashDamageTargets
    );
    results = {
      attackRounds,
      hitsPerKill: hitsRequired,
      time: attackRounds * attacker.attackInterval,
    } as ttkInterface;
  }

  if (attacker.id === 'steel_ball') {
    // steel ball damage ramps up to the max by doubling on every hit
    // If the target is a single unit entity we assume all 4 steel balls attack the same target
    // otherwise we assume they each attack different targets
    let cumulativeDamage = 0;
    let hits = 0;
    const multiplier = Math.ceil(attacker.unitCount / target.unitCount);
    while (cumulativeDamage < targetHp) {
      cumulativeDamage = attackerDamage * Math.pow(2, hits) * multiplier;
      hits++;
    }

    if (multiplier === 1) {
      const totalHits = (hits * target.unitCount) / attacker.unitCount;
      results = {
        attackRounds: totalHits,
        hitsPerKill: hitsRequired,
        time: totalHits * attacker.attackInterval,
      } as ttkInterface;
    } else {
      results = {
        attackRounds: hits,
        hitsPerKill: hitsRequired,
        time: hits * attacker.attackInterval,
      } as ttkInterface;
    }
  }

  if (attacker.id === 'melting_point' && attacker.damageMax) {
    let cumulativeDamage = 0;
    let hits = 0;

    // melting point has really weird damage scaling
    // I measured some of the damage values. If the target is within this range we use the damage table
    if (targetHp <= melterDamageTableMax * damageMod) {
      while (cumulativeDamage < targetHp) {
        cumulativeDamage += Math.round(
          (attacker.damageTable?.[hits] || 0) * damageMod
        );
        hits++;
      }
    } else {
      // For now we are estimating using a damage ramp equation based on a cubic formula
      const nStep = 1 / 22; // 4.4 second ramp time

      const damageRange = attacker.damageMax - attacker.damage;
      while (cumulativeDamage < targetHp) {
        const rampProgress = Math.min(1, hits * nStep);
        const damageRatio = Math.pow(rampProgress, 3);
        cumulativeDamage += Math.round(
          (attacker.damage + Math.round(damageRange * damageRatio)) * damageMod
        );
        hits++;
      }
    }

    // overwrite default hits required with the calculated value and resolve TTK formula as normal
    hitsRequired = hits;
    totalHitsRequired = target.unitCount * hitsRequired;
  }

  // if results are not calculated from a special case, use the default formula
  if (!results) {
    const splashDamageTargets = calculateSplashDamageTargets(attacker, target);

    // default formula for unit engagement
    const attackRounds = Math.ceil(
      totalHitsRequired / attacker.unitCount / splashDamageTargets
    );
    results = {
      attackRounds: attackRounds,
      hitsPerKill: hitsRequired,
      time: attackRounds * attacker.attackInterval,
    } as ttkInterface;
  }


  // speed/range approximations
  // TODO: Missile units like stormcaller might have a maximum speed threshold where they can hit a target
  const rangeDiff = target.range - attacker.range;
  if (rangeDiff > 0) {
    results.time = results.time + rangeDiff / attacker.speed;
  }

  if (calculateEffieciency) {
    const ttkTarget = timeToKill(target, attacker, false);

    const costRatio = attacker.cost / target.cost;
    const killRatio = ttkTarget.time / results.time;

    results.effectiveness = killRatio;
    // TODO: test and validate this equation
    results.costEfficiency = killRatio / costRatio;
  }

  return results;
};
