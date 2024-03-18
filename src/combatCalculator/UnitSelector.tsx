import { ListBox, ListBoxItem, ListBoxProps } from 'react-aria-components';

import { unitDisplayOrder, units } from 'src/data/units.ts';
import classes from './UnitSelector.module.css';

function UnitSelector<T extends object>(props: ListBoxProps<T>) {
  return (
    <div>
      <ListBox
        className={classes.unitSelector}
        aria-label="Unit Selection"
        layout="grid"
        selectionMode="single"
        {...props}
      >
        {unitDisplayOrder.map((unitName: string) => {
          const unit = units[unitName as keyof typeof units];
          return (
            <ListBoxItem
              className={classes.unit}
              key={unit.id}
              id={unit.id}
              textValue={unit.test}
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
