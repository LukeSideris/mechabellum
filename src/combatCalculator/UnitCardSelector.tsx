import { ListBox, ListBoxItem, ListBoxProps } from 'react-aria-components';

import { CombatResultsInterface } from 'src/combatCalculator/combatReducer';
import { units as baseUnits, UnitIdType } from 'src/data/units';
import classes from './UnitCardSelector.module.scss';

const UnitSelector = ({
  onSelectionChange,
  selectedKeys,
  baseCombatResults,
  moddedCombatResults,
}: ListBoxProps<object> & {
  baseCombatResults: CombatResultsInterface | undefined;
  moddedCombatResults: CombatResultsInterface | undefined;
}) => {
  return (
    <ListBox
      className={classes.unitSelector}
      aria-label="Unit selection"
      layout="grid"
      selectionMode="single"
      selectionBehavior="replace"
      onSelectionChange={onSelectionChange}
      selectedKeys={selectedKeys}
    >
      {Object.keys(baseUnits).map((unitId: string) => {
        const unit = baseUnits[unitId as UnitIdType];
        const baseEfficiency =
          baseCombatResults?.[unitId as UnitIdType]?.effectiveness ?? 0;
        const moddedEfficiency =
          moddedCombatResults?.[unitId as UnitIdType]?.effectiveness ?? 0;
        const diff = moddedEfficiency / baseEfficiency;

        return (
          <ListBoxItem
            className={classes.unit}
            key={unitId}
            id={unitId}
            textValue={unit.name}
          >
            <div
              className={classes.unitImage}
              style={{
                backgroundImage: `url("${unit.card}")`,
              }}
              aria-hidden
            />
            <span className={classes.unitName}>{unit.name}</span>
            <ModEffect diff={diff} />
          </ListBoxItem>
        );
      })}
    </ListBox>
  );
};

// Display component to indicate how the modded combat effectiveness differ from the base results
// Diff prop is a decimal representing the percentage difference between the two values
const ModEffect = ({ diff }: { diff: number }) => {
  let indicator = undefined;
  if (!diff || diff === 1) {
    return undefined;
  }

  if (diff >= 1.3) {
    indicator = <span className={classes.positiveEffect}>+++</span>;
  } else if (diff >= 1.15) {
    indicator = <span className={classes.positiveEffect}>++</span>;
  } else if (diff > 1) {
    indicator = <span className={classes.positiveEffect}>+</span>;
  } else if (diff <= 0.76) {
    // inverse of 1.3
    indicator = <span className={classes.negativeEffect}>---</span>;
  } else if (diff <= 0.86) {
    // inverse of 1.15
    indicator = <span className={classes.negativeEffect}>--</span>;
  } else if (diff < 1) {
    indicator = <span className={classes.negativeEffect}>-</span>;
  }

  return <div className={classes.modEffect}>{indicator}</div>;
};

export default UnitSelector;
