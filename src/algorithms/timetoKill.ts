import { UnitInterface } from 'src/data/units.ts';

// splash damage formula
const calculateSplashDamageTargets = (attacker: UnitInterface, target: UnitInterface) => {
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
}

// Calculate an estimated time to kill for a given attacker and defender
// The parameters for unit stats should have all modifiers applied already
const timeToKill = (attacker: UnitInterface, target: UnitInterface): number => {
    // untargetable units can never be killed
    if (target.flying && !attacker.shootsUp) {
        return Infinity;
    }

    let hitsRequired = Math.ceil(target.hp / attacker.damage);
    if (attacker.damageMax) {
        // this unit has damage which ramps up with every attack
        // d = basedamage
        // md = maxdamage
        // n = number of hits
        // solve for:
        // hp < (

        // I can't figure out the exact formula, so I am guessing logarithmic scaling
        let n = 1;
        let cumulativeDamage = attacker.damage;
        let previousDamage = attacker.damage;
        while (cumulativeDamage < target.hp) {
            n++;
            // todo: figure out this forumla
            const newDamage = Math.min(attacker.damageMax, previousDamage * 1.6);
            cumulativeDamage += newDamage;
            previousDamage = newDamage;
        }

        hitsRequired = n;
        console.log(`melter vs `, {
            targetHP: target.hp,
            hitsRequired,
            totalHitsRequired: target.unitCount * hitsRequired,
            ttk: target.unitCount * hitsRequired * attacker.attackInterval,
            splashDamageTargets: calculateSplashDamageTargets(attacker, target),
        }
        )
    }

    const totalHitsRequired = target.unitCount * hitsRequired;

    if (attacker.id === 'crawler') {
        // as melee units, crawlers can't all engage at once
        // to account for this we assume the first attack is performed by 8 crawlers
        // the second attack is performed by 16 crawlers
        // the third and subsequent attack is performed by all crawlers
        if (totalHitsRequired <= 8) {
            return attacker.attackInterval;
        } else if (totalHitsRequired <= 24) {
            return Math.ceil(totalHitsRequired / 16) * attacker.attackInterval;
        } else {
            const timeElapsed = (totalHitsRequired) / 16 * attacker.attackInterval;
            return Math.ceil((totalHitsRequired - 24) / 24) * attacker.attackInterval + timeElapsed;
        }
    }

    if (attacker.id === 'stormcaller') {
        // stormcallers are unique in that their missiles are very inaccurate
        // this causes a wide spread and a change to miss
        // additionally, the stormcallers tend to target the same unit when aiming at a group
        // because of this, we use a different formula to calculate time to kill for stormcallers
        // we increase their effective splash radius, and reduce their missile damage by 40%
        const splashDamageTargets = calculateSplashDamageTargets({
            ...attacker, splashRadius: attacker.splashRadius * 2.5,
        }, target);

        const hitsToKill = Math.ceil(target.hp / (attacker.damage * attacker.unitCount * 0.6));
        return Math.ceil(hitsToKill * target.unitCount / splashDamageTargets) * attacker.attackInterval;
    }

    const splashDamageTargets = calculateSplashDamageTargets(attacker, target);

    // return default formula for unit engagement
    return Math.ceil(totalHitsRequired / attacker.unitCount / splashDamageTargets) * attacker.attackInterval;
}

export default timeToKill;