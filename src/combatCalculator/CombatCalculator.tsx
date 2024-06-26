import { useCallback, useReducer } from 'react';
import { Selection } from 'react-aria-components';

import { combatReducer, combatReducerInitialState } from './combatReducer';
import timeToKill from 'src/algorithms/timetoKill';
import combatEfficiency from 'src/algorithms/combatEfficiency';
import UnitStats from 'src/unitDisplay/UnitStats';
import UnitSelector from './UnitSelector';
import ModSelector from './ModSelector';

import classes from './CombatCalculator.module.scss';

function CombatCalculatorPage() {
  const [
    {
      unitSelectionA,
      unitSelectionB,
      modSelectionA,
      modSelectionB,
      unitLibraryA,
      unitLibraryB,
    },
    dispatch,
  ] = useReducer(combatReducer, combatReducerInitialState);

  // Get the first unit from the selection set. Currently only one unit can be selected at a time.
  const [leftUnitId] = unitSelectionA;
  const [rightUnitId] = unitSelectionB;
  const leftUnit = unitLibraryA[leftUnitId];
  const rightUnit = unitLibraryB[rightUnitId];
  const ttkA = timeToKill(leftUnit, rightUnit);
  const ttkB = timeToKill(rightUnit, leftUnit);

  const handleUnitSelectionA = useCallback(
    (selection: Selection) => {
      dispatch({
        type: 'selectUnitA',
        payload: selection,
      });
    },
    [dispatch]
  );

  const handleUnitSelectionB = useCallback(
    (selection: Selection) => {
      dispatch({
        type: 'selectUnitB',
        payload: selection,
      });
    },
    [dispatch]
  );

  const handleModSelectionA = useCallback(
    (appliedMods: Selection) => {
      dispatch({
        type: 'setModSelectionA',
        payload: appliedMods,
      });
    },
    [dispatch]
  );

  const handleModSelectionB = useCallback(
    (appliedMods: Selection) => {
      dispatch({
        type: 'setModSelectionB',
        payload: appliedMods,
      });
    },
    [dispatch]
  );

  return (
    <>
      <h1>Combat Calculator</h1>

      <div className={classes.container}>
        <div className={`combat-left-side ${classes.leftSide}`}>
          <UnitSelector
            onSelectionChange={handleUnitSelectionA}
            selectedKeys={unitSelectionA}
          />

          <div className={classes.leftSideLayout}>
            <div className={classes.modifyUnit}>
              <h2>Research & Specialists</h2>

              <ModSelector
                onSelectionChange={handleModSelectionA}
                selectedKeys={modSelectionA}
              />
            </div>

            <div className={classes.unitDisplay}>
              {leftUnit && (
                <>
                  <h2>{leftUnit.name}</h2>
                  <img
                    src={leftUnit.thumbnail}
                    alt={leftUnit.name}
                    style={{ width: '100px' }}
                  />
                  {rightUnit && (
                    <div>
                      <b>Attack rounds: </b> {ttkA.attackRounds || 0}
                      <br />
                      <b>Time to kill: </b> {Math.round(ttkA.time * 10) / 10}s
                      <br />
                      <b>
                        effectiveness:{' '}
                        {Math.round(
                          combatEfficiency(leftUnit, rightUnit) * 100
                        )}
                        %
                      </b>
                      <br />
                      <b>Hits per kill: {ttkA.hitsPerKill || 0}</b>
                    </div>
                  )}
                  <UnitStats unit={leftUnit} />
                </>
              )}
            </div>
          </div>
        </div>

        <div className={classes.divider}>
          <span className={classes.versus}>VS</span>
          <button
            className={classes.swapButton}
            onClick={() => {
              handleUnitSelectionA(unitSelectionB);
              handleUnitSelectionB(unitSelectionA);
            }}
          >
            ↔
          </button>
        </div>

        <div className={`combat-right-side ${classes.rightSide}`}>
          <UnitSelector
            onSelectionChange={handleUnitSelectionB}
            selectedKeys={unitSelectionB}
          />

          <div className={classes.rightSideLayout}>
            <div className={classes.modifyUnit}>
              <h2>Research & Specialists</h2>

              <ModSelector
                onSelectionChange={handleModSelectionB}
                selectedKeys={modSelectionB}
              />
            </div>

            <div className={classes.unitDisplay}>
              {rightUnit && (
                <>
                  <h2>{rightUnit.name}</h2>
                  <img
                    src={rightUnit.thumbnail}
                    alt={rightUnit.name}
                    style={{ width: '100px' }}
                  />
                  {leftUnit && (
                    <div>
                      <b>Attack rounds: </b> {ttkB.attackRounds || 0}
                      <br />
                      <b>Time to kill: </b> {Math.round(ttkB.time * 10) / 10}s
                      <br />
                      <b>
                        effectiveness:{' '}
                        {Math.round(
                          combatEfficiency(rightUnit, leftUnit) * 100
                        )}
                        %
                      </b>
                      <br />
                      <b>Hits per kill: {ttkB.hitsPerKill || 0}</b>
                    </div>
                  )}
                  <UnitStats unit={rightUnit} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CombatCalculatorPage;
