import classes from './ValueDisplay.module.css';

const defaultFormatter = (val: number) => val;

/*
 * This component displays a value and its difference from a baseline value.
 * It is used to display unit stats and their changes from mods.
 */
const ValueDisplay = ({
  baseline,
  modded,
  formatter = defaultFormatter,
  // true if a negative change is a good thing and a positive change is a bad thing
  inverted = false,
}: {
  baseline: number;
  modded: number;
  formatter?: (value: number) => string | number;
  inverted?: boolean;
}) => {
  // mitigate floating point bug
  const diff = parseFloat(Math.abs(modded - baseline).toPrecision(12));

  return (
    <>
      <span className={classes.baseline}>{formatter(modded || baseline)}</span>{' '}
      {modded !== baseline && (
        <span className={classes.modded}>
          {modded > baseline ? (
            <span className={!inverted ? classes.increase : classes.decrease}>
              +{formatter(diff)}
            </span>
          ) : (
            <span className={!inverted ? classes.decrease : classes.increase}>
                -{formatter(diff)}
            </span>
          )}
        </span>
      )}
    </>
  );
};

export default ValueDisplay;
