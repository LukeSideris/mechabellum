import { UnitInterface } from 'src/data/units.ts';

export type ttkInterface = {
  attackRounds: number | null;
  hitsPerKill: number | null;
  splashDamageTargets: number | null;
  time: number;
  timeToFirstKill?: number;
  effectiveness: number;
  costEfficiency: number;
};

/*
Below are notes from measured combat results in the testing grounds

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

const fangSplashTable = [
  [0, 1],
  [3, 1.1],   // melter 11, 13, 17, 17, 
  [4.5, 1.5], // warfactory
  [5, 1.75  ],   // fortress, sledge
  // [5.5, 0], // storms
  [6, 2.1],   // rhino 8, 9, 8, 9, 8 9
  [7, 2.75],   // arclight, overlord  7,7,6,7,6,6,6,6
  [8, 0],   // wraith
  [15, 10],  // scorpion, vulcan
];
*/

// splash damage formula
const calculateSplashDamageTargets = (
  attacker: UnitInterface,
  target: UnitInterface
) => {
  let splashDamageTargets = 1;
  if (attacker.splashRadius && target.unitCount > 1) {
    // get total area of attacker splash damage
    const splashArea = Math.PI * Math.pow(attacker.splashRadius, 2);
    const splashRatio = splashArea / target.area;
    splashDamageTargets = splashRatio * target.unitCount;
  }

  return Math.max(1, splashDamageTargets);
};

// Calculate an estimated time to kill for a given attacker and defender
// The parameters for unit stats should have all modifiers applied already
export const timeToKill = (
  attacker: UnitInterface,
  target: UnitInterface,
  calculateEfficiency = true
): ttkInterface => {
  // safety check for invalid units
  if (!attacker || !target) {
    return {
      attackRounds: null,
      hitsPerKill: null,
      splashDamageTargets: null,
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
      splashDamageTargets: null,
      time: Infinity,
      effectiveness: 0,
      costEfficiency: 0,
    };
  }

  let results;

  const { damageMod = 1 } = attacker;
  const { hpMod = 1 } = target;
  const targetHp = Math.round(target.hp * hpMod);
  const attackerDamage = attacker.damage * damageMod;

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
        splashDamageTargets: 1,
        time: attacker.attackInterval,
      } as ttkInterface;
    } else if (totalHitsRequired <= 24) {
      results = {
        attackRounds: 2,
        hitsPerKill: hitsRequired,
        splashDamageTargets: 1,
        time: 2 * attacker.attackInterval,
      } as ttkInterface;
    } else {
      const attackRounds =
        Math.ceil((totalHitsRequired - 24) / attacker.unitCount) + 2;
      results = {
        attackRounds,
        hitsPerKill: hitsRequired,
        splashDamageTargets: 1,
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
      splashDamageTargets: splashDamageTargets,
      time: attackRounds * attacker.attackInterval,
    } as ttkInterface;
  }

  if (attacker.id === 'steel_ball') {
    // steel ball damage ramps up to the max by doubling on every hit
    // If the target is a single unit entity we assume all 4 steel balls attack the same target
    // otherwise we assume they each attack different targets
    let cumulativeDamage = 0;
    let hits = 0;
    const damageMax = (attacker.damageMax || 1) * damageMod;
    const multiplier = Math.ceil(attacker.unitCount / target.unitCount);
    while (cumulativeDamage < targetHp) {
      cumulativeDamage +=
        Math.min(damageMax, attackerDamage * Math.pow(2, hits)) * multiplier;
      hits++;
    }

    if (multiplier === 1) {
      const totalHits = (hits * target.unitCount) / attacker.unitCount;
      results = {
        attackRounds: totalHits,
        hitsPerKill: hits,
        splashDamageTargets: 1,
        time: totalHits * attacker.attackInterval,
      } as ttkInterface;
    } else {
      results = {
        attackRounds: hits,
        hitsPerKill: hits * attacker.unitCount,
        splashDamageTargets: 1,
        time: hits * attacker.attackInterval,
      } as ttkInterface;
    }
  }

  if (attacker.id === 'melting_point' && attacker.damageMax) {
    let cumulativeDamage = 0;
    let hits = 0;

    // the highest damage value of the melting point damage increments I have measured
    const melterDamageTableMax =
      attacker.damageTable?.reduce((a, b) => a + b, 0) || 0;

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
      splashDamageTargets: splashDamageTargets,
      time: attackRounds * attacker.attackInterval,
    } as ttkInterface;
  }

  // speed/range approximations
  // TODO: Missile units like stormcaller might have a maximum speed threshold where they can hit a target
  const rangeDiff = target.range - attacker.range;
  if (rangeDiff > 0) {
    results.time = results.time + rangeDiff / attacker.speed;
  }

  if (calculateEfficiency) {
    const ttkTarget = timeToKill(target, attacker, false);
    const costRatio = attacker.cost / target.cost;
    const killRatio = ttkTarget.time / results.time;

    results.effectiveness = killRatio;
    results.costEfficiency = killRatio / costRatio;

    if (attacker.unitCount > 1 && attacker.id !== target.id) {
      // factor in unit deaths during the time it takes to kill the target
      // We base this on the time required for the attacker to kill one entity in the target squad
      // then get a ratio of how many attackers might be killed off during that duration
      const timeToFirstKill =
        target.unitCount === 1
          ? results.time
          : // todo: add timeToFirstKill to ttk logic and use it instead here
            Math.max(0, rangeDiff / attacker.speed) +
            ((results.attackRounds || 0) / target.unitCount) *
              attacker.attackInterval;
      // ex: an attrition ratio of 25% means 1/4 of the attackers were killed before
      // they could kill the target.
      let attritionAmount =
        Math.floor((timeToFirstKill / ttkTarget.time) * attacker.unitCount) /
        attacker.unitCount;
      // This value can be above 100% if there's lots of overkill, we cap this at 200%
      attritionAmount = Math.min(attritionAmount, 2);

      // use attrition ratio to reduce effectiveness
      results.effectiveness = results.effectiveness / (attritionAmount + 1);
      results.costEfficiency = results.effectiveness / costRatio;
    }
  }

  return results;
};
