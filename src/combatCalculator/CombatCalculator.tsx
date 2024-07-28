import { useCallback, useReducer, useEffect } from 'react';
import { Selection } from 'react-aria-components';
import { useSearchParams } from 'react-router-dom';

import { combatReducer, getInitialState } from './combatReducer';
import UnitStats from 'src/unitDisplay/UnitStats';
import UnitSelector from './UnitSelector';
import UnitCardSelector from './UnitCardSelector';
import ModSelector from './ModSelector';

import classes from './CombatCalculator.module.scss';
import { UnitIdType } from 'src/data/units';

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
      baseCombatResultsA,
      // baseCombatResultsB,
      moddedCombatResultsA,
      moddedCombatResultsB,
    },
    dispatch,
  ] = useReducer(combatReducer, { searchParams, paramsNameMap }, getInitialState);

  // Get the first unit from the selection set. Currently only one unit can be selected at a time.
  const [leftUnitId] = unitSelectionA;
  const [rightUnitId] = unitSelectionB;
  const leftUnit = unitLibraryA[leftUnitId as UnitIdType];
  const rightUnit = unitLibraryB[rightUnitId as UnitIdType];


  const ttkA = moddedCombatResultsA[rightUnitId as UnitIdType];
  const ttkB = moddedCombatResultsB[leftUnitId as UnitIdType];

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

      <div className={classes.gridContainer}>
        <div className={classes.modsA}>
          <h2 className="title-h3"><span>Attacker mods</span></h2>
          <ModSelector
            dispatch={dispatch}
            onSelectionChange={handleModSelectionA}
            selectedKeys={modSelectionA}
          />
        </div>

        <div className={classes.modsB}>
          <h2 className="title-h3"><span>Defender mods</span></h2>
          <ModSelector
            dispatch={dispatch}
            onSelectionChange={handleModSelectionB}
            selectedKeys={modSelectionB}
          />
        </div>

        <div className={`combat-left-side ${classes.unitsA}`}> 
          <h2 className="title-h3"><span>Select a unit</span></h2>
          <UnitCardSelector
            onSelectionChange={handleUnitSelectionA}
            selectedKeys={unitSelectionA}
            baseCombatResults={undefined}
            moddedCombatResults={undefined}
          />
        </div>

        <div className={`combat-right-side ${classes.unitsB}`}>
          <UnitCardSelector
            onSelectionChange={handleUnitSelectionB}
            selectedKeys={unitSelectionB}
            baseCombatResults={baseCombatResultsA}
            moddedCombatResults={moddedCombatResultsA}
          />
        </div>

        <div className={classes.gap} />
        
        <div className={classes.attacker}>
          {leftUnit && (
            <>
              <h2>{leftUnit.name}</h2>
              <img
                className={classes.attackerThumbnail}
                src={leftUnit.thumbnail}
                alt={leftUnit.name}
                style={{ width: '100px' }}
              />
            </>
          )}

          {leftUnit && rightUnit && (
            <div className={classes.combatUtils}>
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
          )}
        </div>

        <div className={classes.defender}>
          {rightUnit && (
            <>
              <h2>{rightUnit.name}</h2>
              <img
                src={rightUnit.thumbnail}
                alt={rightUnit.name}
                style={{ width: '100px' }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default CombatCalculatorPage;
