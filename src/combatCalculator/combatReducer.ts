import { units as baseUnits, UnitInterface, UnitIdType } from 'src/data/units';
import { timeToKill, ttkInterface } from 'src/algorithms/timeToKill';
import { mods, filterMods } from 'src/data/mods';
import applyUnitMods from 'src/algorithms/applyUnitMods';

export type UnitLibraryInterface = {
  [key in UnitIdType]: UnitInterface;
};

export type CombatResultsInterface = {
  [key in UnitIdType]: ttkInterface;
};

export type combatStateType = {
  unitSelectionA: Set<string>;
  unitSelectionB: Set<string>;
  modSelectionA: Set<string>;
  modSelectionB: Set<string>;
  unitLibraryA: UnitLibraryInterface;
  unitLibraryB: UnitLibraryInterface;
  baseCombatResultsA: CombatResultsInterface;
  baseCombatResultsB: CombatResultsInterface;
  moddedCombatResultsA: CombatResultsInterface;
  moddedCombatResultsB: CombatResultsInterface;
};

export const combatReducerDefaultState: combatStateType = {
  // selection states are used to track the selected items in the list boxes
  unitSelectionA: new Set(),
  unitSelectionB: new Set(),
  modSelectionA: new Set(),
  modSelectionB: new Set(),

  // unit libraries are updated whenever applied mods change
  unitLibraryA: baseUnits,
  unitLibraryB: baseUnits,

  // baseline combat tables are recalculated whenever unit selection changes
  baseCombatResultsA: {} as CombatResultsInterface,
  baseCombatResultsB: {} as CombatResultsInterface,
  // modded combat tables are recalculated whenever mod selection or unit selection changes
  moddedCombatResultsA: {} as CombatResultsInterface,
  moddedCombatResultsB: {} as CombatResultsInterface,
};

export function getInitialState({
  searchParams,
  paramsNameMap,
}: {
  searchParams: URLSearchParams;
  // map provided from CombatCalculator.tsx to translate state var names to query param names
  paramsNameMap: {
    unitSelectionA: string;
    unitSelectionB: string;
    modSelectionA: string;
    modSelectionB: string;
  };
}): combatStateType {
  const initialState: combatStateType = { ...combatReducerDefaultState };

  if (searchParams.has(paramsNameMap.unitSelectionA)) {
    initialState.unitSelectionA = new Set(
      searchParams
        .getAll(paramsNameMap.unitSelectionA)
        // validate the param matches a valid unit id
        .filter((unitId) => unitId in baseUnits)
    );
  }

  if (searchParams.has(paramsNameMap.unitSelectionB)) {
    initialState.unitSelectionB = new Set(
      searchParams
        .getAll(paramsNameMap.unitSelectionB)
        // validate the param matches a valid unit id
        .filter((unitId) => unitId in baseUnits)
    );
  }

  if (searchParams.has(paramsNameMap.modSelectionA)) {
    const urlMods = new Set(
      searchParams
        .getAll(paramsNameMap.modSelectionA)
        // validate the param matches a valid mod id
        .filter((modId) => modId in mods)
    );
    initialState.modSelectionA = filterMods(urlMods);
  }

  if (searchParams.has(paramsNameMap.modSelectionB)) {
    const urlMods = new Set(
      searchParams
        .getAll(paramsNameMap.modSelectionB)
        // validate the param matches a valid mod id
        .filter((modId) => modId in mods)
    );
    initialState.modSelectionB = filterMods(urlMods);
  }

  // generate unit libraries if mods are selected
  if (initialState.modSelectionA.size > 0) {
    initialState.unitLibraryA = generateUnitLibrary(initialState.modSelectionA);
  }
  if (initialState.modSelectionB.size > 0) {
    initialState.unitLibraryB = generateUnitLibrary(initialState.modSelectionB);
  }

  // generate baseline combat results
  const [selectedUnitA] = initialState.unitSelectionA;
  const [selectedUnitB] = initialState.unitSelectionB;
  if (selectedUnitA) {
    initialState.baseCombatResultsA = generateCombatTable(
      baseUnits[selectedUnitA as UnitIdType],
      baseUnits
    );

    initialState.moddedCombatResultsA = generateCombatTable(
      initialState.unitLibraryA[selectedUnitA as UnitIdType],
      initialState.unitLibraryB
    );
  }
  if (selectedUnitB) {
    initialState.baseCombatResultsB = generateCombatTable(
      baseUnits[selectedUnitB as UnitIdType],
      baseUnits
    );

    initialState.moddedCombatResultsB = generateCombatTable(
      initialState.unitLibraryB[selectedUnitB as UnitIdType],
      initialState.unitLibraryA
    );
  }

  return initialState;
}

const generateUnitLibrary = (activeMods: Set<string>) => {
  type ModifiedLibraryType = {
    [key in UnitIdType]: UnitInterface;
  };
  const modifiedLibrary = {} as ModifiedLibraryType;

  Object.keys(baseUnits).forEach((unitId: string) => {
    modifiedLibrary[unitId as UnitIdType] = applyUnitMods(
      unitId as UnitIdType,
      activeMods
    );
  });
  return modifiedLibrary;
};

const generateCombatTable = (
  attacker: UnitInterface,
  targetLibrary: UnitLibraryInterface
) => {
  const table = {} as CombatResultsInterface;
  if (!attacker) {
    return table;
  }

  let targetId: keyof UnitLibraryInterface;
  for (targetId in targetLibrary) {
    const target = targetLibrary[targetId];
    const ttk = timeToKill(attacker, target);
    table[targetId] = ttk;
  }

  return table;
};

export function combatReducer(
  state: combatStateType,
  action: { type: string; payload: any } // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  switch (action.type) {
    case 'selectUnitA': {
      const [newUnit] = action.payload;
      return {
        ...state,
        unitSelectionA: action.payload,
        // Generate effectiveness tables for selected unit
        baseCombatResultsA: generateCombatTable(
          baseUnits[newUnit as UnitIdType],
          baseUnits
        ),
        moddedCombatResultsA: generateCombatTable(
          state.unitLibraryA[newUnit as UnitIdType],
          state.unitLibraryB
        ),
      };
    }

    case 'selectUnitB': {
      const [newUnit] = action.payload;
      return {
        ...state,
        unitSelectionB: action.payload,
        // Generate effectiveness tables for selected unit
        baseCombatResultsB: generateCombatTable(
          baseUnits[newUnit as UnitIdType],
          baseUnits
        ),
        moddedCombatResultsB: generateCombatTable(
          state.unitLibraryB[newUnit as UnitIdType],
          state.unitLibraryA
        ),
      };
    }

    case 'setModSelectionA': {
      const newMods = filterMods(action.payload);
      const newLibrary = generateUnitLibrary(newMods);
      const [activeUnitA] = state.unitSelectionA;
      const [activeUnitB] = state.unitSelectionB;
      return {
        ...state,
        modSelectionA: newMods,
        unitLibraryA: newLibrary,
        // Generate effectiveness tables for new library
        moddedCombatResultsA: generateCombatTable(
          newLibrary[activeUnitA as UnitIdType],
          state.unitLibraryB
        ),
        moddedCombatResultsB: generateCombatTable(
          state.unitLibraryB[activeUnitB as UnitIdType],
          newLibrary
        ),
      };
    }

    case 'setModSelectionB': {
      const newMods = filterMods(action.payload);
      const newLibrary = generateUnitLibrary(newMods);
      const [activeUnitA] = state.unitSelectionA;
      const [activeUnitB] = state.unitSelectionB;
      return {
        ...state,
        modSelectionB: newMods,
        unitLibraryB: newLibrary,
        // Generate effectiveness tables for new library
        moddedCombatResultsA: generateCombatTable(
          state.unitLibraryA[activeUnitA as UnitIdType],
          newLibrary
        ),
        moddedCombatResultsB: generateCombatTable(
          newLibrary[activeUnitB as UnitIdType],
          state.unitLibraryA
        ),
      };
    }

    case 'hoverMod': {
      return state;
    }
  }

  throw Error('Unknown action: ' + action.type);
}
