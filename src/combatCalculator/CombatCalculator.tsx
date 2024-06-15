import { useState } from 'react';
import { ListBox, ListBoxItem, Selection } from 'react-aria-components';

import { units, UnitInterface } from 'src/data/units.ts';
import { starterSpecialists } from 'src/data/specialists.ts';
import { attackResearch, defenseResearch } from 'src/data/research.ts';
import { ModInterface } from 'src/data/ModInterface';
import timeToKill from 'src/algorithms/timetoKill';
import combatEfficiency from 'src/algorithms/combatEfficiency';
import UnitStats from 'src/unitDisplay/UnitStats';
import UnitSelector from './UnitSelector';

import classes from './CombatCalculator.module.scss';

function CombatCalculatorPage() {
  const [unitSelection1, setUnitSelection1] = useState<Selection>(new Set());
  const [unitSelection2, setUnitSelection2] = useState<Selection>(new Set());
  const [specialistSelection, setSpecialistSelection] = useState<Selection>(
    new Set()
  );
  const [attackUpgrade, setAttackUpgrade] = useState<Selection>(new Set());
  const [defenseUpgrade, setDefenseUpgrade] = useState<Selection>(new Set());

  const applyMods = (baseUnit: UnitInterface) => {
    if (!baseUnit) {
      return baseUnit;
    }

    const mods = [
      ...Array.from(attackUpgrade).map((n) => attackResearch[n]),
      ...Array.from(defenseUpgrade).map((n) => defenseResearch[n]),
      ...Array.from(specialistSelection).map((n) => starterSpecialists[n]),
    ];

    let modifiedUnit = {
      ...baseUnit,
    };
    const attackIncrease = [] as number[];
    const attackDecrease = [] as number[];
    const hpIncrease = [] as number[];
    const hpDecrease = [] as number[];

    Array.from(mods).forEach((mod: ModInterface) => {
      // positive attach and HP mods are additive, while negative mods are multiplicative
      if (mod.modifyDamage) {
        if (mod.modifyDamage > 0) {
          attackIncrease.push(mod.modifyDamage);
        } else {
          attackDecrease.push(mod.modifyDamage);
        }
      }
      if (mod.modifyHp) {
        if (mod.modifyHp > 0) {
          hpIncrease.push(mod.modifyHp);
        } else {
          hpDecrease.push(mod.modifyHp);
        }
      }
      if (mod.modifier) {
        modifiedUnit = mod.modifier(modifiedUnit);
      }
    });

    // apply attack and hp mods
    modifiedUnit.damageMod =
      (1 + attackIncrease.reduce((acc, val) => acc + val, 0)) *
      (1 + attackDecrease.reduce((acc, val) => acc * (1 + val), 0));
    modifiedUnit.hpMod =
      (1 + hpIncrease.reduce((acc, val) => acc + val, 0)) *
      (1 + hpDecrease.reduce((acc, val) => acc * (1 + val), 0));

    return modifiedUnit;
  };

  // Get the first unit from the selection set. Currently only one unit can be selected at a time.
  const [leftUnitId] = unitSelection1;
  const [rightUnitId] = unitSelection2;
  const leftUnit = applyMods(units[leftUnitId as keyof typeof units]);
  const rightUnit = units[rightUnitId as keyof typeof units];
  const ttk = timeToKill(leftUnit, rightUnit);

  return (
    <>
      <h1>Combat Calculator</h1>

      <div className={classes.container}>
        <div className={`combat-left-side ${classes.leftSide}`}>
          <UnitSelector
            onSelectionChange={setUnitSelection1}
            selectedKeys={unitSelection1}
          />

          <div className={classes.leftSideLayout}>
            <div className={classes.modifyUnit}>
              <h2>Research & Specialists</h2>
              <h3>Starting Specialists</h3>
              <div className={classes.modCategory}>
                <ListBox
                  aria-label="Starter specialist selection"
                  className={classes.modSelector}
                  layout="grid"
                  selectionMode="single"
                  onSelectionChange={setSpecialistSelection}
                  selectedKeys={specialistSelection}
                >
                  {Object.values(starterSpecialists).map(
                    (specialist: ModInterface) => {
                      return (
                        <ListBoxItem
                          className={classes.modOption}
                          key={specialist.id}
                          id={specialist.id}
                          textValue={specialist.name}
                        >
                          <img
                            src={specialist.thumbnail}
                            alt={specialist.name}
                          />
                          <span className={classes.modName}>
                            {specialist.name}
                          </span>
                        </ListBoxItem>
                      );
                    }
                  )}
                </ListBox>
              </div>

              <h3>Tower Research</h3>
              <div className={classes.modCategory}>
                <ListBox
                  aria-label="Attack research selection"
                  className={classes.modSelector}
                  layout="grid"
                  selectionMode="single"
                  onSelectionChange={setAttackUpgrade}
                  selectedKeys={attackUpgrade}
                >
                  {Object.values(attackResearch).map((mod: ModInterface) => {
                    return (
                      <ListBoxItem
                        className={classes.modOption}
                        key={mod.id}
                        id={mod.id}
                        textValue={mod.name}
                      >
                        <img src={mod.thumbnail} alt={mod.name} />
                        <span className={classes.modName}>{mod.name}</span>
                      </ListBoxItem>
                    );
                  })}
                </ListBox>
                <ListBox
                  aria-label="Defense research selection"
                  className={classes.modSelector}
                  layout="grid"
                  selectionMode="single"
                  onSelectionChange={setDefenseUpgrade}
                  selectedKeys={defenseUpgrade}
                >
                  {Object.values(defenseResearch).map((mod: ModInterface) => {
                    return (
                      <ListBoxItem
                        className={classes.modOption}
                        key={mod.id}
                        id={mod.id}
                        textValue={mod.name}
                      >
                        <img src={mod.thumbnail} alt={mod.name} />
                        <span className={classes.modName}>{mod.name}</span>
                      </ListBoxItem>
                    );
                  })}
                </ListBox>
              </div>
            </div>

            <div className={classes.unitDisplay}>
              {leftUnit && (
                <>
                  <h2>{leftUnit.name}</h2>
                  <img
                    src={leftUnit.thumbnail}
                    alt={leftUnit.name}
                    style={{ width: '100px' }}
                  />
                  {rightUnit && (
                    <div>
                      <b>Attack rounds: </b> {ttk.attackRounds || '0'}
                      <br />
                      <b>Time to kill: </b> {Math.round(ttk.time * 10) / 10}s
                      <br />
                      <b>
                        effectiveness:{' '}
                        {Math.round(
                          combatEfficiency(leftUnit, rightUnit) * 100
                        )}
                        %
                      </b>
                    </div>
                  )}
                  <UnitStats unitId={leftUnit.id} />
                </>
              )}
            </div>
          </div>
        </div>

        <div className={classes.divider}>
          <span className={classes.versus}>VS</span>
          <button
            className={classes.swapButton}
            onClick={() => {
              setUnitSelection1(unitSelection2);
              setUnitSelection2(unitSelection1);
            }}
          >
            ↔
          </button>
        </div>

        <div className={`combat-right-side ${classes.rightSide}`}>
          <UnitSelector
            onSelectionChange={setUnitSelection2}
            selectedKeys={unitSelection2}
          />

          {rightUnit && (
            <>
              <h2>{rightUnit.name}</h2>
              <img
                src={rightUnit.thumbnail}
                alt={rightUnit.name}
                style={{ width: '100px' }}
              />
              <UnitStats unitId={rightUnit.id} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default CombatCalculatorPage;
