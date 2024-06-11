import { ListBox, ListBoxItem, ListBoxProps } from 'react-aria-components';

import { units } from 'src/data/units.ts';
import classes from './UnitSelector.module.scss';

function UnitSelector<T extends object>(props: ListBoxProps<T>) {
  return (
    <div>
      <ListBox
        className={classes.unitSelector}
        aria-label="Unit selection"
        layout="grid"
        selectionMode="single"
        {...props}
      >
        {Object.values(units).map(unit => {
          return (
            <ListBoxItem
              className={classes.unit}
              key={unit.id}
              id={unit.id}
              textValue={unit.name}
            >
              <img
                className={classes.unitImage}
                src={unit.thumbnail}
                alt={unit.name}
              />
              <span className={classes.unitName}>{unit.name}</span>
            </ListBoxItem>
          );
        })}
      </ListBox>
    </div>
  );
}

export default UnitSelector;
