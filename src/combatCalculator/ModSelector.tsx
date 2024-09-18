import { VisuallyHidden } from 'react-aria';
import {
  Button,
  ListBox,
  ListBoxItem,
  ListBoxProps,
  Section,
  Header,
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
  modId,
  showLabel = true,
  ...tooltipProps
}: AriaTooltipProps & {
  modId: string;
  showLabel?: boolean;
}) {
  const mod = mods[modId as keyof typeof mods] as ModInterface;

  return (
    <ListBoxItem
      className={classes.modOption}
      key={mod.id}
      id={mod.id}
      textValue={mod.name}
    >
      {showLabel ? (
        <span className={`${classes.modName} typeface-condensed`}>
          {mod.name}
        </span>
      ) : (
        <VisuallyHidden>{mod.name}</VisuallyHidden>
      )}
      <img src={mod.thumbnail} alt={mod.name} />

      <Tooltip
        {...tooltipProps}
        content={<ModDescription mod={mod} />}
        wrapInteractive={false}
      >
        <Button
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

  return (
    <ListBox
      aria-label="Unit mod and specialist selection"
      className={classes.modSelector}
      layout="grid"
      orientation="horizontal"
      selectionMode="multiple"
      onSelectionChange={onSelectionChange}
      selectedKeys={selectedKeys}
    >
      <Section className={classes.starterSpecialistMods}>
        <Header>Starter specialists and unit mods</Header>
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
      </Section>

      <Section className={classes.attackResearchMods}>
        <Header>Attack Research</Header>
        <ModListBoxItem
          modId={attackResearch[0]}
          key={attackResearch[0]}
          showLabel={false}
        />
        <ModListBoxItem
          modId={attackResearch[1]}
          key={attackResearch[1]}
          showLabel={false}
          placement="right"
        />
      </Section>

      <Section className={classes.defenseResearchMods}>
        <Header>Defense Research</Header>
        <ModListBoxItem
          modId={defenseResearch[0]}
          key={defenseResearch[0]}
          showLabel={false}
          placement="top end"
        />
        <ModListBoxItem
          modId={defenseResearch[1]}
          key={defenseResearch[1]}
          showLabel={false}
          placement="right bottom"
        />
      </Section>
    </ListBox>
  );
};

export default ModSelector;
