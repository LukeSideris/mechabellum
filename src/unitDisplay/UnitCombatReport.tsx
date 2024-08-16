import { units as baseUnits, UnitInterface, UnitIdType } from 'src/data/units';
import { ttkInterface } from 'src/algorithms/timeToKill';
import ValueDisplay from './ValueDisplay.tsx';

import classes from './UnitCombatReport.module.css';

const UnitCombatReport = ({
  unit,
  baseCombatResults,
  moddedCombatResults,
  position,
  showVersus = false,
}: {
  unit: UnitInterface;
  baseCombatResults: ttkInterface;
  moddedCombatResults: ttkInterface;
  position: 'attacker' | 'defender';
  showVersus?: boolean;
}) => {
  if (!unit) {
    return null;
  }

  const baseUnit = baseUnits[unit.id as UnitIdType];

  return (
    <section
      className={`${classes.unitCombatReport} ${position === 'attacker' ? classes.attacker : classes.defender}`}
    >
      <header
        className={`${classes.unitHeader} ${showVersus && classes.hasVersus}`}
      >
        <h3>{unit.name}</h3>

        {showVersus && position === 'attacker' && (
          <span className={classes.versus} aria-hidden>
            VS
          </span>
        )}
      </header>

      <div className={classes.combatStats}>
        <img
          className={`unit-thumbnail ${classes.thumbnail}`}
          src={unit.thumbnail}
          alt={unit.name}
        />

        {moddedCombatResults && (
          <table>
            <tbody>
              <tr>
                <th>Hits per kill:</th>
                <td>
                  <ValueDisplay
                    baseline={baseCombatResults.hitsPerKill || 0}
                    modded={moddedCombatResults.hitsPerKill || 0}
                    inverted
                    formatter={(val) => {
                      if (!val) {
                        return '–';
                      }
                      return val;
                    }}
                  />
                </td>
              </tr>
              <tr>
                <th>Time to kill:</th>
                <td>
                  <ValueDisplay
                    baseline={baseCombatResults.time || 0}
                    modded={moddedCombatResults.time || 0}
                    inverted
                    formatter={(val) => {
                      if (!val || val === Infinity) {
                        return '–';
                      }

                      return Math.round(val * 100) / 100 + 's';
                    }}
                  />
                </td>
              </tr>
              <tr>
                <th>Effectiveness:</th>
                <td>
                  {/*
                    This might change, but for now the attacker uses cost efficiency as its 
                    effectiveness metric while the defender uses standard effectiveness.
                  */}
                  <ValueDisplay
                    baseline={baseCombatResults.costEfficiency || 0}
                    modded={moddedCombatResults.costEfficiency || 0}
                    formatter={(val) => {
                      if (!val) {
                        return '0';
                      }

                      if (val === Infinity) {
                        return '∞';
                      }

                      return Math.round(val * 100) + '%';
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      <div className={classes.unitStats}>
        <table>
          <tbody>
            <tr>
              <th>HP:</th>
              <td>
                <ValueDisplay
                  baseline={unit.hp}
                  modded={unit.hp * (unit.hpMod || 1)}
                  formatter={Math.floor}
                />
              </td>
            </tr>
            <tr>
              <th>Damage:</th>
              <td>
                <ValueDisplay
                  baseline={unit.damage}
                  modded={unit.damage * (unit.damageMod || 1)}
                  formatter={Math.floor}
                />
              </td>
            </tr>
            <tr>
              <th>Attack Interval:</th>
              <td>
                <ValueDisplay
                  baseline={baseUnit.attackInterval}
                  modded={unit.attackInterval}
                  formatter={(value) => {
                    return value + 's';
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>Range:</th>
              <td>
                <ValueDisplay
                  baseline={baseUnit.range}
                  modded={unit.range}
                  formatter={(value) => {
                    if (value === 0) {
                      return 'Melee';
                    }

                    return Math.round(value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>Speed:</th>
              <td>
                <ValueDisplay
                  baseline={baseUnit.speed}
                  modded={unit.speed}
                  formatter={Math.round}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UnitCombatReport;
