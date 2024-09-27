import classes from './UnitPlaceholder.module.css';

const UnitPlaceholder = ({
  position,
}: {
  position: 'attacker' | 'defender';
}) => (
  <div className={classes.unitPlaceholder}>
    Select {position === 'attacker' ? 'attacking' : 'defending'} unit for combat
    analysis
  </div>
);

export default UnitPlaceholder;
