import { units as baseUnits, UnitInterface } from 'src/data/units';
import { mods } from 'src/data/mods';
import applyUnitMods from 'src/algorithms/applyUnitMods';

export type combatStateType = {
  unitSelectionA: Set<string>;
  unitSelectionB: Set<string>;
  modSelectionA: Set<string>;
  modSelectionB: Set<string>;
  unitLibraryA: {
    [key in keyof typeof baseUnits]: UnitInterface;
  };
  unitLibraryB: {
    [key in keyof typeof baseUnits]: UnitInterface;
  };
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
};

export function getInitialState({
  searchParams,
  paramsNameMap,
}: {
  searchParams: URLSearchParams,
  // map provided from CombatCalculator.tsx to translate state var names to query param names
  paramsNameMap: {
    unitSelectionA: string;
    unitSelectionB: string;
    modSelectionA: string;
    modSelectionB: string;
  }
}): combatStateType {
  const initialState: combatStateType = { ...combatReducerDefaultState };

  if (searchParams.has(paramsNameMap.unitSelectionA)) {
    initialState.unitSelectionA = new Set(searchParams.getAll(paramsNameMap.unitSelectionA)
      // validate the param matches a valid unit id
      .filter((unitId) => unitId in baseUnits)
    );
  }

  if (searchParams.has(paramsNameMap.unitSelectionB)) {
    initialState.unitSelectionB = new Set(searchParams.getAll(paramsNameMap.unitSelectionB)
      // validate the param matches a valid unit id
      .filter((unitId) => unitId in baseUnits)
    );
  }

  if (searchParams.has(paramsNameMap.modSelectionA)) {
    const urlMods = new Set(searchParams.getAll(paramsNameMap.modSelectionA)
      // validate the param matches a valid mod id
      .filter((modId) => modId in mods)
    );
    initialState.modSelectionA = filterMods(urlMods);
  }

  if (searchParams.has(paramsNameMap.modSelectionB)) {
    const urlMods = new Set(searchParams.getAll(paramsNameMap.modSelectionB)
      // validate the param matches a valid mod id
      .filter((modId) => modId in mods)
    );
    initialState.modSelectionB = filterMods(urlMods);
  }

  // regenerate unit libraries if mods are selected
  if (initialState.modSelectionA.size > 0) {
    initialState.unitLibraryA = generateUnitLibrary(initialState.modSelectionA);
  }
  if (initialState.modSelectionB.size > 0) {
    initialState.unitLibraryB = generateUnitLibrary(initialState.modSelectionB);
  }

  return initialState;
}

const generateUnitLibrary = (activeMods: Set<string>) => {
  type ModifiedLibraryType = {
    [key in keyof typeof baseUnits]: UnitInterface;
  };
  const modifiedLibrary: ModifiedLibraryType = {} as ModifiedLibraryType;

  Object.keys(baseUnits).forEach((unitId: string) => {
    modifiedLibrary[unitId as keyof typeof baseUnits] = applyUnitMods(
      unitId as keyof typeof baseUnits,
      activeMods
    );
  });
  return modifiedLibrary;
};

const filterMods = (modList: Set<string>) => {
  const latestVal = Array.from(modList).at(-1);
  // some mods are incompatible with others, we use this to deselect some options
  if (latestVal === 'rcAttack1') {
    modList.delete('rcAttack2');
  }
  if (latestVal === 'rcAttack2') {
    modList.delete('rcAttack1');
  }
  if (latestVal === 'rcDefense1') {
    modList.delete('rcDefense2');
  }
  if (latestVal === 'rcDefense2') {
    modList.delete('rcDefense1');
  }

  // only 1 attack or defense mod may be used at a time
  if (modList.has('rcAttack1') && modList.has('rcAttack2')) {
    modList.delete('rcAttack1');
  }
  if (modList.has('rcDefense1') && modList.has('rcDefense2')) {
    modList.delete('rcDefense1');
  }

  return modList;
};

export function combatReducer(
  state: combatStateType,
  action: { type: string; payload: any } // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  switch (action.type) {
    case 'selectUnitA': {
      return {
        ...state,
        unitSelectionA: action.payload,
        // TODO: Generate efficiency tables for selected unit
      };
    }

    case 'selectUnitB': {
      return {
        ...state,
        unitSelectionB: action.payload,
        // TODO: Generate efficiency tables for selected unit
      };
    }

    case 'setModSelectionA': {
      const newMods = filterMods(action.payload);
      return {
        ...state,
        modSelectionA: newMods,
        unitLibraryA: generateUnitLibrary(newMods),
      };
    }

    case 'setModSelectionB': {
      const newMods = filterMods(action.payload);
      return {
        ...state,
        modSelectionB: newMods,
        unitLibraryB: generateUnitLibrary(newMods),
      };
    }

    case 'hoverMod': {
      return state;
    }
  }

  throw Error('Unknown action: ' + action.type);
}
