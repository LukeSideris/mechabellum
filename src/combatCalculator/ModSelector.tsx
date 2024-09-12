import { ListBox, ListBoxItem, ListBoxProps } from 'react-aria-components';
import {
  mods,
  starterSpecialists,
  attackResearch,
  defenseResearch,
} from 'src/data/mods.ts';

import classes from './ModSelector.module.scss';

function ModListBoxItem({ modName }: { modName: string }) {
  const mod = mods[modName as keyof typeof mods];
  return (
    <ListBoxItem
      className={classes.modOption}
      key={mod.id}
      id={mod.id}
      textValue={mod.name}
    >
      <img src={mod.thumbnail} alt={mod.name} />
      <span className={classes.modName}>{mod.name}</span>
    </ListBoxItem>
  );
}

const ModSelector = ({
  onSelectionChange,
  selectedKeys,
}: ListBoxProps<object>) => {
  return (
    <ListBox
      aria-label="Unit mod specialist selection"
      className={classes.modSelector}
      layout="grid"
      selectionMode="multiple"
      onSelectionChange={onSelectionChange}
      selectedKeys={selectedKeys}
    >
      {starterSpecialists.map((modName) => (
        <ModListBoxItem modName={modName} key={modName} />
      ))}

      {attackResearch.map((modName) => (
        <ModListBoxItem modName={modName} key={modName} />
      ))}

      {defenseResearch.map((modName) => (
        <ModListBoxItem modName={modName} key={modName} />
      ))}
    </ListBox>
  );
};

export default ModSelector;
