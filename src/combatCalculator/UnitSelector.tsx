import { ListBox, ListBoxItem } from 'react-aria-components';

import { unitDisplayOrder, units, UnitInterface } from 'src/data/units.ts';
import classes from './UnitSelector.module.css';

function UnitSelector() {
  return (
    <div>
      <ListBox
        className={classes.unitSelector}
        aria-label="Unit Selection"
        layout="grid"
        selectionMode="single"
      >
        {unitDisplayOrder.map((unitName: string) => {
          const unit: UnitInterface = units[unitName as keyof typeof units];
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
