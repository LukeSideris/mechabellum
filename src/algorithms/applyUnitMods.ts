import { UnitInterface, units as baseUnits } from 'src/data/units';
import { mods, ModInterface } from 'src/data/mods.ts';

const applyUnitMods = (
  unitId: keyof typeof baseUnits,
  activeMods: Set<string>
): UnitInterface => {
  // convert applied mods set into array of mod objects
  const appliedMods = Array.from(activeMods).map(
    (modName) => mods[modName as keyof typeof mods]
  );

  let modifiedUnit: UnitInterface = {
    ...baseUnits[unitId],
    damageMod: 1,
    hpMod: 1,
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
    if (mod.modifier) {
      modifiedUnit = mod.modifier(modifiedUnit);
    }
  });

  // apply attack and hp mods
  modifiedUnit.damageMod =
    (1 + attackIncrease.reduce((acc, val) => acc + val, 0)) *
    (1 + attackDecrease.reduce((acc, val) => acc * (1 + val), 0));
  modifiedUnit.hpMod =
    (1 + hpIncrease.reduce((acc, val) => acc + val, 0)) *
    (1 + hpDecrease.reduce((acc, val) => acc * (1 + val), 0));

  return modifiedUnit;
};

export default applyUnitMods;
