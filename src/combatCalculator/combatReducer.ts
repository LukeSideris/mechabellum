import { units as baseUnits, UnitInterface } from 'src/data/units';
import applyUnitMods from 'src/algorithms/applyUnitMods';

export const combatReducerInitialState = {
  // selection states are used to track the selected items in the list boxes
  unitSelectionA: new Set(),
  unitSelectionB: new Set(),
  modSelectionA: new Set(),
  modSelectionB: new Set(),

  // unit libraries are updated whenever applied mods change
  unitLibraryA: baseUnits,
  unitLibraryB: baseUnits,
};

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

  // just in case: only 1 attack or defense mod may be used
  if (modList.has('rcAttack1') && modList.has('rcAttack2')) {
    modList.delete('rcAttack1');
  }
  if (modList.has('rcDefense1') && modList.has('rcDefense2')) {
    modList.delete('rcDefense1');
  }

  return modList;
};

export function combatReducer(
  state: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  action: { type: string; payload: any } // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  switch (action.type) {
    case 'selectUnitA': {
      return {
        ...state,
        unitSelectionA: action.payload,
      };
    }

    case 'selectUnitB': {
      return {
        ...state,
        unitSelectionB: action.payload,
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
  }

  throw Error('Unknown action: ' + action.type);
}
