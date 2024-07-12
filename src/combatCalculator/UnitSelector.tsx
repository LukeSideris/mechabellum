import { ListBox, ListBoxItem, ListBoxProps } from 'react-aria-components';

import { units as baseUnits } from 'src/data/units';
import classes from './UnitSelector.module.scss';

function UnitSelector<T extends object>({ onSelectionChange, selectedKeys }: ListBoxProps<T>) {
  return (
    <div>
      <ListBox
        className={classes.unitSelector}
        aria-label="Unit selection"
        layout="grid"
        selectionMode="single"
        selectionBehavior="replace"
        onSelectionChange={onSelectionChange}
        selectedKeys={selectedKeys}
      >
        {Object.values(baseUnits).map((unit) => {
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
