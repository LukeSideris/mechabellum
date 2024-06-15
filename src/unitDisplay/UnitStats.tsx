import { units } from 'src/data/units.ts';

const UnitStats = ({ unitId }: { unitId: string }) => {
  const unit = units[unitId as keyof typeof units];
  return (
    <div>
      <p>Cost: {unit.cost}</p>
      <p>HP: {unit.hp}</p>
      <p>Damage: {unit.damage}</p>
    </div>
  );
};

export default UnitStats;
