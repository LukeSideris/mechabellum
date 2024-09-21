import {
  Button,
  ListBox,
  ListBoxItem,
  ListBoxProps,
  TooltipProps as AriaTooltipProps,
} from 'react-aria-components';
import {
  mods,
  ModInterface,
  starterSpecialists,
  attackResearch,
  defenseResearch,
} from 'src/data/mods.ts';
import Tooltip from 'src/components/Tooltip';
import ModDescription from 'src/unitDisplay/ModDescription';

import classes from './ModSelector.module.scss';

function ModListBoxItem({
  className = '',
  modId,
  ...tooltipProps
}: AriaTooltipProps & {
  className?: string;
  modId: string;
}) {
  const mod = mods[modId as keyof typeof mods] as ModInterface;

  return (
    <ListBoxItem
      className={`${classes.modOption} ${className}`}
      key={mod.id}
      id={mod.id}
      textValue={mod.name}
    >
      <span className={`${classes.modName} typeface-condensed`}>
        {mod.name}
      </span>
      <img src={mod.thumbnail} alt={mod.name} />

      <Tooltip
        {...tooltipProps}
        content={<ModDescription mod={mod} />}
        wrapInteractive={false}
      >
        <Button
          aria-label={mod.description}
          className={`tooltip-trigger-button ${classes.descriptionTooltip}`}
          onPress={(e) => {
            // trigger parent selection/click event
            // only show tooltip on hover
            e.target.parentElement?.click();
          }}
        ></Button>
      </Tooltip>
    </ListBoxItem>
  );
}

const ModSelector = ({
  onSelectionChange,
  selectedKeys,
  unitId,
}: ListBoxProps<object> & {
  unitId: string;
}) => {
  const dynamicMods = Object.keys(mods).filter(
    // return only mods that apply to the current unit
    (modId) => {
      const mod = mods[modId as keyof typeof mods] as ModInterface;
      return (mod.appliesTo || 'all') === unitId;
    }
  );

  const gridRepeatColumns = Math.ceil(
    (starterSpecialists.length + dynamicMods.length) / 2
  );

  return (
    <ListBox
      aria-label="Unit mod and specialist selection"
      className={`${classes.modSelector} ${classes[`columnRepeat${gridRepeatColumns}`]}`}
      layout="grid"
      orientation="horizontal"
      selectionMode="multiple"
      onSelectionChange={onSelectionChange}
      selectedKeys={selectedKeys}
    >
      {starterSpecialists.map((modId) => (
        <ModListBoxItem
          modId={modId}
          key={modId}
          placement="top start"
          crossOffset={-40}
        />
      ))}

      {dynamicMods.map((modId) => (
        <ModListBoxItem
          modId={modId}
          key={modId}
          placement="top start"
          crossOffset={-40}
        />
      ))}

      <ModListBoxItem
        className={classes.attackResearch1}
        modId={attackResearch[0]}
        key={attackResearch[0]}
      />
      <ModListBoxItem
        className={classes.attackResearch2}
        modId={attackResearch[1]}
        key={attackResearch[1]}
        placement="right"
      />
      <ModListBoxItem
        className={classes.defenseResearch1}
        modId={defenseResearch[0]}
        key={defenseResearch[0]}
        placement="top end"
      />
      <ModListBoxItem
        className={classes.defenseResearch2}
        modId={defenseResearch[1]}
        key={defenseResearch[1]}
        placement="right bottom"
      />
    </ListBox>
  );
};

export default ModSelector;
