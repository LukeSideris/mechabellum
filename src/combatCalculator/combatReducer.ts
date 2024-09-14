import {
  units as baseUnits,
  UnitInterface,
  UnitLibraryInterface,
} from 'src/data/units';
import { timeToKill, ttkInterface } from 'src/algorithms/timeToKill';
import { mods, filterMods } from 'src/data/mods';
import applyUnitMods from 'src/algorithms/applyUnitMods';

// make copies of baseUnits to modify with unit levels
const baseUnitsA = structuredClone(baseUnits);
const baseUnitsB = structuredClone(baseUnits);
type UnitIdType = keyof typeof baseUnitsA;

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
  unitLibraryA: baseUnitsA,
  unitLibraryB: baseUnitsB,

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
    leftUnitLevel: string;
    rightUnitLevel: string;
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

    const [selectedUnitA] = initialState.unitSelectionA;
    // apply stored unit level from search params
    if (selectedUnitA && searchParams.has(paramsNameMap.leftUnitLevel)) {
      const level = parseInt(
        searchParams.get(paramsNameMap.leftUnitLevel) || '1'
      );
      const modifiedStats = getUnitStatsForLevel(
        selectedUnitA as UnitIdType,
        level
      );
      const newUnit: UnitInterface = {
        ...baseUnits[selectedUnitA as UnitIdType],
        ...modifiedStats,
      };
      // update local copy of baseUnitsA with leveled up unit
      initialState.unitLibraryA[selectedUnitA as UnitIdType] = newUnit;
    }
  }

  if (searchParams.has(paramsNameMap.unitSelectionB)) {
    initialState.unitSelectionB = new Set(
      searchParams
        .getAll(paramsNameMap.unitSelectionB)
        // validate the param matches a valid unit id
        .filter((unitId) => unitId in baseUnits)
    );

    const [selectedUnitB] = initialState.unitSelectionB;
    // apply stored unit level from search params
    if (selectedUnitB && searchParams.has(paramsNameMap.rightUnitLevel)) {
      const level = parseInt(
        searchParams.get(paramsNameMap.rightUnitLevel) || '1'
      );
      const modifiedStats = getUnitStatsForLevel(
        selectedUnitB as UnitIdType,
        level
      );
      const newUnit: UnitInterface = {
        ...baseUnits[selectedUnitB as UnitIdType],
        ...modifiedStats,
      };
      // update local copy of baseUnitsB with leveled up unit
      initialState.unitLibraryB[selectedUnitB as UnitIdType] = newUnit;
    }
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
    initialState.unitLibraryA = generateUnitLibrary(
      initialState.modSelectionA,
      baseUnitsA
    );
  }
  if (initialState.modSelectionB.size > 0) {
    initialState.unitLibraryB = generateUnitLibrary(
      initialState.modSelectionB,
      baseUnitsB
    );
  }

  // generate baseline combat results
  const [selectedUnitA] = initialState.unitSelectionA;
  const [selectedUnitB] = initialState.unitSelectionB;
  if (selectedUnitA) {
    initialState.baseCombatResultsA = generateCombatTable(
      baseUnitsA[selectedUnitA as UnitIdType],
      baseUnitsB
    );

    initialState.moddedCombatResultsA = generateCombatTable(
      initialState.unitLibraryA[selectedUnitA as UnitIdType],
      initialState.unitLibraryB
    );
  }
  if (selectedUnitB) {
    initialState.baseCombatResultsB = generateCombatTable(
      baseUnitsB[selectedUnitB as UnitIdType],
      baseUnitsA
    );

    initialState.moddedCombatResultsB = generateCombatTable(
      initialState.unitLibraryB[selectedUnitB as UnitIdType],
      initialState.unitLibraryA
    );
  }

  return initialState;
}

const getUnitStatsForLevel = (unitId: UnitIdType, newLevel: number) => {
  // only levels between 1 and 3 are supported
  const level = newLevel > 3 ? 1 : Math.max(1, newLevel);
  const baseUnit = baseUnits[unitId];

  interface OptionalStats {
    damageMax?: number;
    damageTable?: number[];
  }
  const optionalStats: OptionalStats = {};
  if (baseUnit.damageMax) {
    optionalStats['damageMax'] = baseUnit.damageMax * level;
  }
  if (baseUnit.damageTable) {
    optionalStats.damageTable = baseUnit.damageTable.map(
      (damage) => damage * level
    );
  }

  // return only the stats modified by level
  return {
    level: level,
    cost: baseUnit.cost * (1 + (level - 1) * 0.5), // each level is 1/2 the base cost
    hp: baseUnit.hp * level,
    damage: baseUnit.damage * level,
    ...optionalStats,
  };
};

const generateUnitLibrary = (activeMods: Set<string>, units = baseUnits) => {
  type ModifiedLibraryType = {
    [key in UnitIdType]: UnitInterface;
  };
  const modifiedLibrary = {} as ModifiedLibraryType;

  Object.keys(units).forEach((unitId: string) => {
    modifiedLibrary[unitId as UnitIdType] = applyUnitMods(
      unitId as UnitIdType,
      activeMods,
      units
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
          baseUnitsA[newUnit as UnitIdType],
          baseUnitsB
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
          baseUnitsB[newUnit as UnitIdType],
          baseUnitsA
        ),
        moddedCombatResultsB: generateCombatTable(
          state.unitLibraryB[newUnit as UnitIdType],
          state.unitLibraryA
        ),
      };
    }

    case 'setAttackerLevel': {
      const { unitId, level } = action.payload;
      const [activeUnitB] = state.unitSelectionB;
      const modifiedStats = getUnitStatsForLevel(unitId as UnitIdType, level);
      const newUnit: UnitInterface = {
        ...baseUnits[unitId as UnitIdType],
        ...modifiedStats,
      };
      // update local copy of baseUnits
      baseUnitsA[unitId as UnitIdType] = newUnit;
      const newLibrary = generateUnitLibrary(state.modSelectionA, baseUnitsA);

      return {
        ...state,
        unitLibraryA: newLibrary,
        // Generate effectiveness tables for new library
        baseCombatResultsA: generateCombatTable(newUnit, baseUnitsB),
        baseCombatResultsB: generateCombatTable(
          baseUnitsB[activeUnitB as UnitIdType],
          baseUnitsA
        ),
        moddedCombatResultsA: generateCombatTable(
          newLibrary[unitId as UnitIdType],
          state.unitLibraryB
        ),
        moddedCombatResultsB: generateCombatTable(
          state.unitLibraryB[activeUnitB as UnitIdType],
          newLibrary
        ),
      };
    }

    case 'setDefenderLevel': {
      const { unitId, level } = action.payload;
      const [activeUnitA] = state.unitSelectionA;
      const modifiedStats = getUnitStatsForLevel(unitId as UnitIdType, level);
      const newUnit: UnitInterface = {
        ...baseUnits[unitId as UnitIdType],
        ...modifiedStats,
      };
      // update local copy of baseUnits
      baseUnitsB[unitId as UnitIdType] = newUnit;
      const newLibrary = generateUnitLibrary(state.modSelectionB, baseUnitsB);

      return {
        ...state,
        unitLibraryB: newLibrary,
        // Generate effectiveness tables for new library
        baseCombatResultsA: generateCombatTable(
          baseUnitsA[activeUnitA as UnitIdType],
          baseUnitsB
        ),
        baseCombatResultsB: generateCombatTable(newUnit, baseUnitsA),
        moddedCombatResultsA: generateCombatTable(
          state.unitLibraryA[activeUnitA as UnitIdType],
          newLibrary
        ),
        moddedCombatResultsB: generateCombatTable(
          newLibrary[unitId as UnitIdType],
          state.unitLibraryA
        ),
      };
    }

    case 'setModSelectionA': {
      const newMods = filterMods(action.payload);
      const newLibrary = generateUnitLibrary(newMods, baseUnitsA);
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
      const newLibrary = generateUnitLibrary(newMods, baseUnitsB);
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
