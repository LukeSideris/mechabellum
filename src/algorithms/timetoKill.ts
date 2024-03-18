import { UnitInterface } from 'src/data/units.ts';

// Calculate an estimated time to kill for a given attacker and defender
// The parameters for unit stats should have all modifiers applied already
const timeToKill = (attacker: UnitInterface, target: UnitInterface): number => {
    // untargetable units can never be killed
    if (target.flying && !attacker.shootsUp) {
        return Infinity;
    }

    const hitsRequired = Math.ceil(target.hp / attacker.damage);
    // TODO: add calculation for splash damage here.
    // this involves unit size, rows, etc

    // TODO: Add calculation for rows, melee body blocking
    const totalHitsRequired = target.unitCount * hitsRequired;

    return totalHitsRequired / attacker.unitCount * attacker.attackInterval;
}

export default timeToKill;