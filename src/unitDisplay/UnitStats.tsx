import { UnitInterface } from 'src/data/units.ts';

const UnitStats = ({ unit }: { unit: UnitInterface }) => {
  if (!unit) {
    return null;
  }
  return (
    <div>
      <p>Cost: {unit.cost}</p>
      <p>HP: {Math.round(unit.hp * (unit.hpMod || 1))}</p>
      <p>Damage: {Math.round(unit.damage * (unit.damageMod || 1))}</p>
    </div>
  );
};

export default UnitStats;
