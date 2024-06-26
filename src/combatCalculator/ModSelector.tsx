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

function ModSelector<T extends object>(props: ListBoxProps<T>) {
  return (
    <ListBox
      aria-label="Unit mod specialist selection"
      className={classes.modSelector}
      layout="grid"
      selectionMode="multiple"
      {...props}
    >
      <Section>
        <Header>Starting Specialists</Header>
        {Array.from(starterSpecialists).map((modName) => {
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
        })}
      </Section>

      <Section>
        <Header>Tower Research ATK</Header>
        {Array.from(attackResearch).map((modName) => {
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
        })}
      </Section>

      <Section>
        <Header>Tower Research DEF</Header>
        {Array.from(defenseResearch).map((modName) => {
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
        })}
      </Section>
    </ListBox>
  );
}

export default ModSelector;
