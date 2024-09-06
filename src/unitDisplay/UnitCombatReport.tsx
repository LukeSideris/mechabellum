import { units as baseUnits, UnitInterface, UnitIdType } from 'src/data/units';
import { ttkInterface } from 'src/algorithms/timeToKill';
import ValueDisplay from './ValueDisplay.tsx';

import classes from './UnitCombatReport.module.css';

const UnitCombatReport = ({
  unit,
  baseCombatResults,
  moddedCombatResults,
  position,
}: {
  unit: UnitInterface;
  baseCombatResults: ttkInterface;
  moddedCombatResults: ttkInterface;
  position: 'attacker' | 'defender';
}) => {
  if (!unit) {
    return null;
  }

  const baseUnit = baseUnits[unit.id as UnitIdType];

  return (
    <section
      className={`${classes.unitCombatReport} ${position === 'attacker' ? classes.attacker : classes.defender}`}
    >
      <div className={classes.contentWrapper} style={{
        backgroundImage: `url("${unit.thumbnail}")`,
      }}>
        <header>
          <h3>{unit.name}</h3>
        </header>

        <div className={classes.unitStats}>
          <table>
            <tbody>
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
              <tr className={classes.unitHp}>
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
                <th>Splash damage radius:</th>
                <td>
                  <ValueDisplay
                    baseline={baseUnit.splashRadius}
                    modded={unit.splashRadius}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {moddedCombatResults && (
          <div className={classes.combatStats}>
            <table>
              <tbody>
                <tr>
                  <th>Shots per kill:</th>
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

                        if (val < 0.01) {
                          // use a decimal
                          return Math.round(val * 1000) / 10 + '%';
                        }

                        return Math.round(val * 100) + '%';
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default UnitCombatReport;
