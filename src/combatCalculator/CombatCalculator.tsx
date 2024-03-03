import { useState } from 'react';
import type { Selection } from 'react-aria-components';

import { units, UnitInterface } from 'src/data/units.ts';
import UnitSelector from './UnitSelector';
import classes from './CombatCalculator.module.css';

function CombatCalculatorPage() {
  const [unitSelection1, setUnitSelection1] = useState<Selection>(new Set());
  const [unitSelection2, setUnitSelection2] = useState<Selection>(new Set());

  // Get the first unit from the selection set. Currently only one unit can be selected at a time.
  const [leftUnitId] = unitSelection1;
  const [rightUnitId] = unitSelection2;
  const leftUnit: UnitInterface = units[leftUnitId as keyof typeof units];
  const rightUnit: UnitInterface = units[rightUnitId as keyof typeof units];

  return (
    <>
      <h1>Combat Calculator</h1>

      <div className={classes.container}>
        <div className={classes.leftSide}>
          <UnitSelector onSelectionChange={setUnitSelection1} selectedKeys={unitSelection1} />
          <h2>
            {leftUnit?.name}
          </h2>
        </div>

        <div className={classes.divider}>
          <span className={classes.versus}>VS</span>
        </div>

        <div className={classes.rightSide}>
          <UnitSelector onSelectionChange={setUnitSelection2} selectedKeys={unitSelection2} />
          <h2>
            {rightUnit?.name}
          </h2>
        </div>
      </div>
    </>
  );
}

export default CombatCalculatorPage;
