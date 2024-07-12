import {
  ListBox,
  ListBoxItem,
  ListBoxProps,
  Section,
  Header,
} from 'react-aria-components';
import {
  mods,
  starterSpecialists,
  attackResearch,
  defenseResearch,
} from 'src/data/mods.ts';

import classes from './ModSelector.module.scss';

function ModListBoxItem({ dispatch, modName }: {
  dispatch: React.Dispatch<any>, // eslint-disable-line @typescript-eslint/no-explicit-any 
  modName: string
}) {
  const mod = mods[modName as keyof typeof mods];
  return (
    <ListBoxItem
      className={classes.modOption}
      key={mod.id}
      id={mod.id}
      textValue={mod.name}
      onHoverChange={(isHovering: boolean): void => {
        // console.log('onHoverChange', isHovering);
        dispatch({ type: 'hoverMod', payload: { state: isHovering, id: mod.id } });
      }}
    >
      <img src={mod.thumbnail} alt={mod.name} />
      <span className={classes.modName}>{mod.name}</span>
    </ListBoxItem>
  );
}

const ModSelector = ({ dispatch, onSelectionChange, selectedKeys }: ListBoxProps<object> & {
  dispatch: React.Dispatch<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
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
      <Section>
        <Header>Starting Specialists</Header>
        {starterSpecialists.map((modName) => (
          <ModListBoxItem dispatch={dispatch} modName={modName} key={modName} />
        ))}
      </Section>

      <Section>
        <Header>Tower Research ATK</Header>
        {attackResearch.map((modName) => (
          <ModListBoxItem dispatch={dispatch} modName={modName} key={modName} />
        ))}
      </Section>

      <Section>
        <Header>Tower Research DEF</Header>
        {defenseResearch.map((modName) => (
          <ModListBoxItem dispatch={dispatch} modName={modName} key={modName} />
        ))}
      </Section>
    </ListBox>
  );
}

export default ModSelector;
