import UnitSelector from './UnitSelector';
import classes from './CombatCalculator.module.css';

function CombatCalculatorPage() {
  return (
    <>
      <h1>Combat Calculator</h1>

      <div className={classes.container}>
        <div className={classes.leftSide}>
          <UnitSelector />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam
            velit,
          </p>
        </div>
        <div className={classes.rightSide}>
          <UnitSelector />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam
            velit,
          </p>
        </div>
      </div>
    </>
  );
}

export default CombatCalculatorPage;
