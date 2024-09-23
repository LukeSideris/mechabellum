import { useState } from 'react';
import {
  Button,
  ListBox,
  ListBoxItem,
  ListBoxProps,
} from 'react-aria-components';
import { CombatResultsInterface } from 'src/combatCalculator/combatReducer';
import { ttkInterface } from 'src/algorithms/timeToKill';
import { units as baseUnits, UnitIdType } from 'src/data/units';
import { mods, ModInterface } from 'src/data/mods.ts';
import getLevelIcon from 'src/unitDisplay/getLevelIcon';
import Tooltip from 'src/components/Tooltip';
import ModDescription from 'src/unitDisplay/ModDescription';
import classes from './UnitCardSelector.module.scss';

const UnitSelector = ({
  onSelectionChange,
  selectedKeys,
  baseCombatResults,
  moddedCombatResults,
  unitLibrary = baseUnits,
  activeMods,
  setLevel,
}: ListBoxProps<object> & {
  baseCombatResults: CombatResultsInterface | undefined;
  moddedCombatResults: CombatResultsInterface | undefined;
  unitLibrary?: typeof baseUnits;
  activeMods: Set<keyof typeof mods>;
  setLevel: (unitId: 'all', level: number) => void;
}) => {
  const [globalLevel, setGlobalLevel] = useState(1);
  return (
    <div className={classes.container}>
      <ListBox
        className={classes.unitSelector}
        aria-label="Unit selection"
        layout="grid"
        selectionMode="single"
        selectionBehavior="replace"
        onSelectionChange={onSelectionChange}
        selectedKeys={selectedKeys}
      >
        {Object.keys(unitLibrary).map((unitId: string) => {
          const unit = unitLibrary[unitId as UnitIdType];
          const unitSpecificMods = [...activeMods].filter(
            (modId) =>
              'appliesTo' in mods[modId] && mods[modId].appliesTo === unitId
          );

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
              <div className={`typeface-condensed ${classes.unitName}`}>
                <span>{unit.name}</span>
                <img
                  className={classes.levelIcon}
                  hidden={unit.level === 1}
                  src={getLevelIcon(unit.level)}
                  alt={`${unit.name} level ${unit.level}`}
                />
              </div>
              <UnitModThumbnails unitMods={unitSpecificMods} />
              <ModEffect
                ttk={baseCombatResults?.[unitId as UnitIdType]}
                ttkModded={moddedCombatResults?.[unitId as UnitIdType]}
              />
            </ListBoxItem>
          );
        })}
      </ListBox>

      <div className={classes.levelUp}>
        <Button
          className={classes.levelAllButton}
          onPress={() => {
            const newLevel = globalLevel === 3 ? 1 : globalLevel + 1;
            setGlobalLevel(newLevel);
            setLevel('all', newLevel);
          }}
        >
          Level up units
        </Button>
      </div>
    </div>
  );
};

const UnitModThumbnails = ({
  unitMods = [],
}: {
  unitMods: (keyof typeof mods)[];
}) => {
  return (
    <div className={classes.modThumbnails}>
      {unitMods.map((modId) => {
        const mod = mods[modId] as ModInterface;
        return (
          <Tooltip key={modId} content={<ModDescription mod={mod} />}>
            <div className={classes.unitMod}>
              <img src={mod.thumbnail} alt={mod.name} />
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
};

// Display component to indicate how the modded combat effectiveness differ from the base results
// Diff prop is a decimal representing the percentage difference between the two values
const ModEffect = ({
  ttk,
  ttkModded,
}: {
  ttk: ttkInterface | undefined;
  ttkModded: ttkInterface | undefined;
}) => {
  const baseEfficiency = ttk?.costEfficiency ?? 1;
  const moddedEfficiency = ttkModded?.costEfficiency ?? 0;

  const diff = moddedEfficiency / baseEfficiency;
  if (!diff || diff === 1) {
    return undefined;
  }

  let indicator = undefined;
  const diffPercent = Math.round((diff - 1) * 100);
  let tooltipContent =
    "Active mods have no effect on the attacker's combat effectiveness";

  if (diff >= 1.5) {
    indicator = <span className={classes.positiveEffect}>+++</span>;
    tooltipContent = `Attacker is significantly more effective with active mods (${diffPercent}%)`;
  } else if (diff >= 1.3) {
    indicator = <span className={classes.positiveEffect}>++</span>;
    tooltipContent = `Attacker is more effective with active mods (${diffPercent}%)`;
  } else if (diff > 1) {
    indicator = <span className={classes.positiveEffect}>+</span>;
    tooltipContent = `Attacker is slightly more effective with active mods (${diffPercent}%)`;
  } else if (diff <= 0.66) {
    // inverse of 1.3
    indicator = <span className={classes.negativeEffect}>−−−</span>;
    tooltipContent = `Attacker is significantly less effective with active mods (${diffPercent}%)`;
  } else if (diff <= 0.76) {
    // inverse of 1.15
    indicator = <span className={classes.negativeEffect}>−−</span>;
    tooltipContent = `Attacker is less effective with active mods (${diffPercent}%)`;
  } else if (diff < 1) {
    indicator = <span className={classes.negativeEffect}>−</span>;
    tooltipContent = `Attacker is slightly less effective with active mods (${diffPercent}%)`;
  }

  return (
    <div className={classes.modEffect}>
      <Tooltip content={tooltipContent}>
        <div className={classes.modEffectContent}>{indicator}</div>
      </Tooltip>
    </div>
  );
};

export default UnitSelector;
