import { units, UnitInterface } from 'src/data/units.ts';

export type ttkInterface = {
  attackRounds: number | null;
  hitsPerKill: number | null;
  time: number;
};

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
    const { rows = 1 } = target;
    let minDistance = target.unitSize / 2 + (target.unitSpacing || 0);

    let rowCount = 1;
    while (attacker.splashRadius > minDistance) {
      // Sometimes there are units on both sides of the target, so 50% chance to hit 3 instead of 2
      splashDamageTargets += 1.5;

      if (rows > rowCount) {
        // +1 hit for the unit in the row behind the target
        splashDamageTargets += 1;
        const diagonalDistance = Math.hypot(minDistance, minDistance);
        if (attacker.splashRadius > diagonalDistance) {
          // Sometimes there are units on both sides of the target, so 50% chance to hit an edge
          splashDamageTargets += 1.5;
        }
      }

      minDistance += target.unitSize + (target.unitSpacing || 0);
      rowCount++;
    }
  }
  return splashDamageTargets;
};

// Calculate an estimated time to kill for a given attacker and defender
// The parameters for unit stats should have all modifiers applied already
const timeToKill = (
  attacker: UnitInterface,
  target: UnitInterface
): ttkInterface => {
  if (!attacker || !target) {
    return {
      attackRounds: null,
      hitsPerKill: null,
      time: Infinity,
    };
  }
  const { damageMod = 1 } = attacker;
  const { hpMod = 1 } = target;
  const targetHp = Math.round(target.hp * hpMod);
  const attackerDamage = Math.round(attacker.damage * damageMod);

  // untargetable units can never be killed
  if (target.flying && !attacker.shootsUp) {
    return {
      attackRounds: null,
      hitsPerKill: null,
      time: Infinity,
    };
  }

  let hitsRequired = Math.ceil(targetHp / attackerDamage);
  let totalHitsRequired = target.unitCount * hitsRequired;

  if (attacker.id === 'crawler') {
    // as melee units, crawlers can't all engage at once
    // to account for this we assume the first attack is performed by 8 crawlers
    // the second attack is performed by 16 crawlers
    // the third and subsequent attacks are performed by all crawlers
    if (totalHitsRequired <= 8) {
      return {
        attackRounds: 1,
        hitsPerKill: hitsRequired,
        time: attacker.attackInterval,
      };
    } else if (totalHitsRequired <= 24) {
      return {
        attackRounds: 2,
        hitsPerKill: hitsRequired,
        time: 2 * attacker.attackInterval,
      };
    } else {
      const attackRounds =
        Math.ceil((totalHitsRequired - 24) / attacker.unitCount) + 2;
      return {
        attackRounds,
        hitsPerKill: hitsRequired,
        time: attackRounds * attacker.attackInterval,
      };
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
    return {
      attackRounds,
      hitsPerKill: hitsRequired,
      time: attackRounds * attacker.attackInterval,
    };
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
      return {
        attackRounds: totalHits,
        hitsPerKill: hitsRequired,
        time: totalHits * attacker.attackInterval,
      };
    }

    return {
      attackRounds: hits,
      hitsPerKill: hitsRequired,
      time: hits * attacker.attackInterval,
    };
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

  const splashDamageTargets = calculateSplashDamageTargets(attacker, target);

  // return default formula for unit engagement
  const attackRounds = Math.ceil(
    totalHitsRequired / attacker.unitCount / splashDamageTargets
  );
  return {
    attackRounds: attackRounds,
    hitsPerKill: hitsRequired,
    time: attackRounds * attacker.attackInterval,
  };
};

export default timeToKill;
