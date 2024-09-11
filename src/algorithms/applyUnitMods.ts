import { units as baseUnits, UnitInterface, UnitIdType } from 'src/data/units';
import { mods, ModInterface } from 'src/data/mods.ts';

const applyUnitMods = (
  unitId: UnitIdType,
  activeMods: Set<string>,
  units = baseUnits
): UnitInterface => {
  // convert applied mods set into array of mod objects
  const appliedMods = Array.from(activeMods).map(
    (modName) => mods[modName as keyof typeof mods]
  );

  let modifiedUnit: UnitInterface = {
    ...units[unitId],
  };
  const attackIncrease = [] as number[];
  const attackDecrease = [] as number[];
  const hpIncrease = [] as number[];
  const hpDecrease = [] as number[];

  Array.from(appliedMods).forEach((mod: ModInterface) => {
    // positive attach and HP mods are additive, while negative mods are multiplicative
    if (mod.modifyDamage) {
      if (mod.modifyDamage > 0) {
        attackIncrease.push(mod.modifyDamage);
      } else {
        attackDecrease.push(mod.modifyDamage);
      }
    }
    if (mod.modifyHp) {
      if (mod.modifyHp > 0) {
        hpIncrease.push(mod.modifyHp);
      } else {
        hpDecrease.push(mod.modifyHp);
      }
    }

    // special mods for aerial specialist
    if (mod.modifyDamageAerial && modifiedUnit.flying) {
      attackIncrease.push(mod.modifyDamageAerial);
    }
    if (mod.modifyHpAerial && modifiedUnit.flying) {
      hpIncrease.push(mod.modifyHpAerial);
    }

    // apply generic modifier
    if (mod.modifier) {
      modifiedUnit = mod.modifier(modifiedUnit);
    }
  });

  // apply attack and hp mods
  modifiedUnit.damageMod =
    attackIncrease.reduce((acc, val) => acc + val, 1) *
    attackDecrease.reduce((acc, val) => acc * (1 + val), 1);
  modifiedUnit.hpMod =
    hpIncrease.reduce((acc, val) => acc + val, 1) *
    hpDecrease.reduce((acc, val) => acc * (1 + val), 1);

  return modifiedUnit;
};

export default applyUnitMods;
