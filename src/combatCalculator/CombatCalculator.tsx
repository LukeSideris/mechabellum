import { useCallback, useReducer, useEffect } from 'react';
import { Selection } from 'react-aria-components';
import { useSearchParams } from 'react-router-dom';

import { combatReducer, getInitialState } from './combatReducer';
import UnitCombatReport from 'src/unitDisplay/UnitCombatReport';
import UnitPlaceholder from 'src/unitDisplay/UnitPlaceholder';
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
      baseCombatResultsB,
      moddedCombatResultsA,
      moddedCombatResultsB,
    },
    dispatch,
  ] = useReducer(
    combatReducer,
    { searchParams, paramsNameMap },
    getInitialState
  );

  // Get the first unit from the selection set. Currently only one unit can be selected at a time.
  const [leftUnitId] = unitSelectionA;
  const [rightUnitId] = unitSelectionB;
  const leftUnit = unitLibraryA[leftUnitId as UnitIdType];
  const rightUnit = unitLibraryB[rightUnitId as UnitIdType];

  // sync state with url params
  useEffect(() => {
    setSearchParams({
      [paramsNameMap.unitSelectionA]: Array.from(unitSelectionA),
      [paramsNameMap.unitSelectionB]: Array.from(unitSelectionB),
      [paramsNameMap.modSelectionA]: Array.from(modSelectionA),
      [paramsNameMap.modSelectionB]: Array.from(modSelectionB),
    });
  }, [
    setSearchParams,
    unitSelectionA,
    unitSelectionB,
    modSelectionA,
    modSelectionB,
  ]);

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
    <div className={classes.gridContainer}>
      <div className={classes.pageTitle}>
        <h1>Combat Calculator</h1>
      </div>
      <div className={classes.infopanel}>
        <strong>How to use</strong>
        <ul>
          <li>Select mods to highlight changes in combat efficiency</li>
          <li>
            Choose a left side unit to see how selected mods apply to fights
          </li>
          <li>Choose right and left units for detailed combat stats</li>
        </ul>
        <span className={classes.gameVersion}>patch 0.9.0.2</span>
      </div>

      <div className={classes.modsA}>
        <h2 className="title-h3">
          <span>Attacker mods</span>
        </h2>
        <ModSelector
          dispatch={dispatch}
          onSelectionChange={handleModSelectionA}
          selectedKeys={modSelectionA}
        />
      </div>

      <div className={classes.modsB}>
        <h2 className="title-h3">
          <span>Defender mods</span>
        </h2>
        <ModSelector
          dispatch={dispatch}
          onSelectionChange={handleModSelectionB}
          selectedKeys={modSelectionB}
        />
      </div>

      <div className={`combat-left-side ${classes.unitsA}`}>
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

      <div className={`combat-attacker ${classes.attacker}`}>
        {leftUnit && (
          <UnitCombatReport
            unit={leftUnit}
            baseCombatResults={baseCombatResultsA[rightUnitId as UnitIdType]}
            moddedCombatResults={
              moddedCombatResultsA[rightUnitId as UnitIdType]
            }
            position="attacker"
          />
        )}
        {!leftUnit && rightUnit && (
          <UnitPlaceholder />
        )}
      </div>

      <div className={`combat-defender ${classes.defender}`}>
        {rightUnit && (
          <UnitCombatReport
            unit={rightUnit}
            baseCombatResults={baseCombatResultsB[leftUnitId as UnitIdType]}
            moddedCombatResults={moddedCombatResultsB[leftUnitId as UnitIdType]}
            position="defender"
          />
        )}
        {!rightUnit && leftUnit && (
          <UnitPlaceholder />
        )}
      </div>
    </div>
  );
}

export default CombatCalculatorPage;
