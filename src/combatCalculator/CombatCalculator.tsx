import { useCallback, useReducer, useEffect } from 'react';
import { Selection } from 'react-aria-components';
import { useSearchParams } from 'react-router-dom';

import { combatReducer, getInitialState } from './combatReducer';
import timeToKill from 'src/algorithms/timetoKill';
import combatEfficiency from 'src/algorithms/combatEfficiency';
import UnitStats from 'src/unitDisplay/UnitStats';
import UnitSelector from './UnitSelector';
import ModSelector from './ModSelector';

import classes from './CombatCalculator.module.scss';

const paramsNameMap = {
  unitSelectionA: 'a',
  unitSelectionB: 'b',
  modSelectionA: 'mods',
  modSelectionB: 'mods2',
};

function CombatCalculatorPage() {
  const [searchParams, setSearchParams] = useSearchParams();
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
  ] = useReducer(combatReducer, { searchParams, paramsNameMap }, getInitialState);

  // Get the first unit from the selection set. Currently only one unit can be selected at a time.
  const [leftUnitId] = unitSelectionA;
  const [rightUnitId] = unitSelectionB;
  const leftUnit = unitLibraryA[leftUnitId as keyof typeof unitLibraryA];
  const rightUnit = unitLibraryB[rightUnitId as keyof typeof unitLibraryB];
  const ttkA = timeToKill(leftUnit, rightUnit);
  const ttkB = timeToKill(rightUnit, leftUnit);

  // sync state with url params
  useEffect(() => {
    setSearchParams({
      [paramsNameMap.unitSelectionA]: Array.from(unitSelectionA),
      [paramsNameMap.unitSelectionB]: Array.from(unitSelectionB),
      [paramsNameMap.modSelectionA]: Array.from(modSelectionA),
      [paramsNameMap.modSelectionB]: Array.from(modSelectionB),
    });
  }, [setSearchParams, unitSelectionA, unitSelectionB, modSelectionA, modSelectionB]);

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
                dispatch={dispatch}
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
                dispatch={dispatch}
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
