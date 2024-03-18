import { useState } from 'react';
import type { Selection } from 'react-aria-components';

import { units } from 'src/data/units.ts';
import timeToKill from 'src/algorithms/timetoKill';
import UnitStats from 'src/unitDisplay/UnitStats';
import UnitSelector from './UnitSelector';

import classes from './CombatCalculator.module.css';

function CombatCalculatorPage() {
  const [unitSelection1, setUnitSelection1] = useState<Selection>(new Set());
  const [unitSelection2, setUnitSelection2] = useState<Selection>(new Set());

  // Get the first unit from the selection set. Currently only one unit can be selected at a time.
  const [leftUnitId] = unitSelection1;
  const [rightUnitId] = unitSelection2;
  const leftUnit = units[leftUnitId as keyof typeof units];
  const rightUnit = units[rightUnitId as keyof typeof units];

  return (
    <>
      <h1>Combat Calculator</h1>

      <div className={classes.container}>
        <div className={classes.leftSide}>
          <UnitSelector onSelectionChange={setUnitSelection1} selectedKeys={unitSelection1} />

          {leftUnit && (
            <>
              <h2>
                {leftUnit.name}
              </h2>
              <img
                src={leftUnit.thumbnail}
                alt={leftUnit.name}
                style={{ width: '100px' }}
              />
              {rightUnit && (
                <div>
                  <b>Time to kill: </b> {Math.round(timeToKill(leftUnit, rightUnit) * 10) / 10}s
                </div>
              )}
              <UnitStats unitId={leftUnit.id} />
            </>
          )}
        </div>

        <div className={classes.divider}>
          <span className={classes.versus}>VS</span>
        </div>

        <div className={classes.rightSide}>
          <UnitSelector onSelectionChange={setUnitSelection2} selectedKeys={unitSelection2} />

          {rightUnit && (
            <>
              <h2>
                {rightUnit.name}
              </h2>
              <img
                src={rightUnit.thumbnail}
                alt={rightUnit.name}
                style={{ width: '100px' }}
              />
              <UnitStats unitId={rightUnit.id} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default CombatCalculatorPage;
