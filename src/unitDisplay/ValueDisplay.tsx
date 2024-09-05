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
  return (
    <>
      <span className={classes.baseline}>{formatter(modded || baseline)}</span>{' '}
      {modded !== baseline && (
        <span className={classes.modded}>
          {modded > baseline ? (
            <span className={!inverted ? classes.increase : classes.decrease}>
              +{formatter(Math.abs(modded - baseline))}
            </span>
          ) : (
            <span className={!inverted ? classes.decrease : classes.increase}>
              -{formatter(Math.abs(modded - baseline))}
            </span>
          )}
        </span>
      )}
    </>
  );
};

export default ValueDisplay;
