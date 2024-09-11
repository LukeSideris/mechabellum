import { ListBox, ListBoxItem, ListBoxProps } from 'react-aria-components';
import {
  mods,
  starterSpecialists,
  attackResearch,
  defenseResearch,
} from 'src/data/mods.ts';

import classes from './ModSelector.module.scss';

function ModListBoxItem({
  modName,
}: {
  // dispatch: React.Dispatch<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  modName: string;
}) {
  const mod = mods[modName as keyof typeof mods];
  return (
    <ListBoxItem
      className={classes.modOption}
      key={mod.id}
      id={mod.id}
      textValue={mod.name}
      /*
    onHoverChange={(isHovering: boolean): void => {
      dispatch({
        type: 'hoverMod',
        payload: { state: isHovering, id: mod.id },
      });
    }}
    */
    >
      <img src={mod.thumbnail} alt={mod.name} />
      <span className={classes.modName}>{mod.name}</span>
    </ListBoxItem>
  );
}

const ModSelector = ({
  onSelectionChange,
  selectedKeys,
}: ListBoxProps<object> & {
  dispatch: React.Dispatch<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}) => {
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
