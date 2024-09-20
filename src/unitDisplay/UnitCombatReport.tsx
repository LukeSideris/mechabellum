import { VisuallyHidden } from 'react-aria';
import { units as baseUnits, UnitInterface, UnitIdType } from 'src/data/units';
import { ttkInterface } from 'src/algorithms/timeToKill';
import ValueDisplay from './ValueDisplay.tsx';
import getLevelIcon from './getLevelIcon.ts';
import Tooltip from 'src/components/Tooltip.tsx';
// stat icon imports
import costIcon from 'src/data/icons/supply.png';
import attackIcon from 'src/data/icons/attack.png';
import hpIcon from 'src/data/icons/health.png';
import speedIcon from 'src/data/icons/speed.png';
import splashIcon from 'src/data/icons/splashRadius.png';
import reloadIcon from 'src/data/icons/attackInterval.png';
import rangeIcon from 'src/data/icons/range.png';

import classes from './UnitCombatReport.module.scss';

const UnitCombatReport = ({
  unit,
  baseCombatResults,
  moddedCombatResults,
  position,
  setLevel,
}: {
  unit: UnitInterface;
  baseCombatResults: ttkInterface;
  moddedCombatResults: ttkInterface;
  position: 'attacker' | 'defender';
  setLevel: (unitId: UnitIdType, level: number) => void;
}) => {
  if (!unit) {
    return null;
  }

  const baseUnit = baseUnits[unit.id as UnitIdType];

  return (
    <section
      className={`${classes.unitCombatReport} ${position === 'attacker' ? classes.attacker : classes.defender}`}
    >
      <div
        className={classes.contentWrapper}
        style={{
          backgroundImage: `url("${unit.thumbnail}")`,
        }}
      >
        <header>
          <h3>{unit.name}</h3>
          <button
            aria-label={`${unit.level === 3 ? 'Reset' : 'Increase'} ${unit.name} level`}
            title={`${unit.level === 3 ? 'Reset' : 'Increase'} ${unit.name} level`}
            className={classes.unitLevelButton}
            onClick={() => {
              setLevel(unit.id as UnitIdType, unit.level + 1);
            }}
          >
            <img
              src={getLevelIcon(unit.level)}
              alt={`${unit.name} level ${unit.level}`}
            />
          </button>
        </header>

        <div className={classes.unitStats}>
          <table>
            <tbody>
              <tr>
                <th>
                  <VisuallyHidden>Cost</VisuallyHidden>
                  <div aria-hidden="true">
                    <Tooltip content="Unit cost">
                      <img src={costIcon} />
                    </Tooltip>
                  </div>
                </th>
                <td>
                  <ValueDisplay baseline={unit.cost} modded={unit.cost} />
                </td>
              </tr>
              <tr>
                <th>
                  <VisuallyHidden>HP</VisuallyHidden>
                  <div aria-hidden="true">
                    <Tooltip content="Unit HP">
                      <img src={hpIcon} />
                    </Tooltip>
                  </div>
                </th>
                <td>
                  <ValueDisplay
                    baseline={unit.hp}
                    modded={unit.hp * (unit.hpMod || 1)}
                    formatter={Math.floor}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <VisuallyHidden>Damage</VisuallyHidden>
                  <div aria-hidden="true">
                    <Tooltip content="Unit attack damage">
                      <img src={attackIcon} />
                    </Tooltip>
                  </div>
                </th>
                <td>
                  <ValueDisplay
                    baseline={unit.damage}
                    modded={unit.damage * (unit.damageMod || 1)}
                    formatter={Math.floor}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <VisuallyHidden>Speed</VisuallyHidden>
                  <div aria-hidden="true">
                    <Tooltip content="Unit speed in meters per second">
                      <img src={speedIcon} />
                    </Tooltip>
                  </div>
                </th>
                <td>
                  <ValueDisplay
                    baseline={baseUnit.speed}
                    modded={unit.speed}
                    formatter={Math.round}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <VisuallyHidden>Splash Radius</VisuallyHidden>
                  <div aria-hidden="true">
                    <Tooltip content="Unit splash damage radius in meters">
                      <img src={splashIcon} />
                    </Tooltip>
                  </div>
                </th>
                <td>
                  <ValueDisplay
                    baseline={baseUnit.splashRadius}
                    modded={unit.splashRadius}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <VisuallyHidden>Attack Interval</VisuallyHidden>
                  <div aria-hidden="true">
                    <Tooltip content="Unit Attack Interval in seconds">
                      <img src={reloadIcon} />
                    </Tooltip>
                  </div>
                </th>
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
                <th>
                  <VisuallyHidden>Range</VisuallyHidden>
                  <div aria-hidden="true">
                    <Tooltip content="Unit range in meters">
                      <img src={rangeIcon} />
                    </Tooltip>
                  </div>
                </th>
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
            </tbody>
          </table>
        </div>

        {moddedCombatResults && (
          <div className={classes.combatStats}>
            <table>
              <tbody>
                <tr>
                  <th>{unit.range ? 'Shots' : 'Hits'} per kill:</th>
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
