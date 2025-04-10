import { UnitInterface, UnitIdType } from './units';
import thumbnailAerial from './thumbnails/specialists/aerial.png';
import thumbnailFortifiedSpecialist from './thumbnails/specialists/fortifiedSpecialist.png';
import thumbnailCostControl from './thumbnails/specialists/costControl.png';
import thumbnailAmplifySpecialist from './thumbnails/specialists/amplify.png';
import thumbnailSpeed from './thumbnails/specialists/speed.png';
import thumbnailMassProduced from './thumbnails/mods/massProduced.png';
import thumbnailAssault from './thumbnails/mods/assault.png';
import thumbnailExtendedRange from './thumbnails/mods/extendedRange.png';
import thumbnailFortified from './thumbnails/mods/fortified.png';
import thumbnailImproved from './thumbnails/mods/improved.png';

const researchThumbs = import.meta.glob('./thumbnails/research/*.png', {
  eager: true,
  import: 'default',
});

export type ModInterface = {
  name: string;
  id: string;
  description?: string;
  thumbnail: string;
  appliesTo?: UnitIdType;
  // hp and attack use different mathematics depending on being positive or negative
  modifyHp?: number;
  modifyDamage?: number;
  // special modifiers for aerial specialist
  modifyHpAerial?: number;
  modifyDamageAerial?: number;
  // generic modifier to apply to any unit stat. Do not use to modify attack or HP.
  modifier?: (unit: UnitInterface) => UnitInterface;
};

export const starterSpecialists = [
  'fortified',
  'costControl',
  'speed',
  'aerial',
  'amplify',
];
export const attackResearch = ['rcAttack1', 'rcAttack2'];
export const defenseResearch = ['rcDefense1', 'rcDefense2'];

export const mods = {
  fortified: {
    name: 'Fortified Specialist',
    id: 'fortified',
    description: 'Increase HP of all units by 17%',
    thumbnail: thumbnailFortifiedSpecialist as string,
    modifyHp: 0.17,
  },
  costControl: {
    name: 'Cost Control Specialist',
    id: 'costControl',
    description: 'Decrease HP and attack of all units by 11%',
    thumbnail: thumbnailCostControl as string,
    modifyHp: -0.11,
    modifyDamage: -0.11,
  },
  speed: {
    name: 'Speed Specialist',
    id: 'speed',
    description: 'Increases the movement speed of all units by 3m/s',
    thumbnail: thumbnailSpeed as string,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        speed: unit.speed + 3,
      };
    },
  },
  aerial: {
    name: 'Aerial Specialist',
    id: 'aerial',
    description: 'Increase HP and attack of all flying units by 10m',
    thumbnail: thumbnailAerial as string,
    modifyHpAerial: 0.13,
    modifyDamageAerial: 0.13,
  },
  amplify: {
    name: 'Amplify Specialist',
    id: 'amplify',
    description: 'Get 3 small Amplifying Cores, which boost unit attack and HP by 20%. For this calculator, the stats are applied to all units.',
    thumbnail: thumbnailAmplifySpecialist as string,
    modifyHp: 0.2,
    modifyDamage: 0.2,
  },

  // Unit-specific mods
  assaultFang: {
    name: 'Assault Fang',
    id: 'assaultFang',
    description:
      'Increase Fang’s attack by 40% and movement speed by 3 but decreases range by 15',
    thumbnail: thumbnailAssault as string,
    appliesTo: 'fang',
    modifyDamage: 0.4,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        range: unit.range - 15,
        speed: unit.speed + 3,
      };
    },
  },
  fortifiedArclight: {
    name: 'Fortified Arclight',
    id: 'fortifiedArclight',
    description: 'Increase Arclight’s HP by 180% but decreases range by 15',
    thumbnail: thumbnailFortified as string,
    appliesTo: 'arclight',
    modifyHp: 1.8,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        range: unit.range - 15,
      };
    },
  },
  extendedRangeArclight: {
    name: 'Extended Range Arclight',
    id: 'extendedRangeArclight',
    description: 'Increase Arclight’s range by 20 but decreases attack by 20%',
    thumbnail: thumbnailExtendedRange as string,
    appliesTo: 'arclight',
    modifyDamage: -0.2,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        range: unit.range + 20,
      };
    },
  },
  extendedRangeMarksman: {
    name: 'Extended Range Marksman',
    id: 'extendedRangeMarksman',
    description:
      'Increase Marksman’s range by 30 but decreases attack by 20%, and HP by 20%',
    thumbnail: thumbnailExtendedRange as string,
    appliesTo: 'marksman',
    modifyDamage: -0.2,
    modifyHp: -0.2,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        range: unit.range + 30,
      };
    },
  },
  fortifiedMustang: {
    name: 'Fortified Mustang',
    id: 'fortifiedMustang',
    description: 'Increase Mustang’s HP by 200% but decreases range by 20',
    thumbnail: thumbnailFortified as string,
    appliesTo: 'mustang',
    modifyHp: 2.0,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        range: unit.range - 20,
      };
    },
  },
  massProducedSledgehammer: {
    name: 'Mass-Produced Sledge\u200Bhammer',
    id: 'massProducedSledgehammer',
    description:
      'Decreases the recruitment cost of Sledgehammer by 100 but decreases attack by 30%, and HP by 30%',
    thumbnail: thumbnailMassProduced as string,
    appliesTo: 'sledgehammer',
    modifyHp: -0.3,
    modifyDamage: -0.3,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost - 100,
      };
    },
  },
  extendedRangeSledgehammer: {
    name: 'Extended Range Sledge\u200Bhammer',
    id: 'extendedRangeSledgehammer',
    description:
      'Increase Sledgehammer’s range by 30 but decreases attack by 20% and HP by 20%',
    thumbnail: thumbnailExtendedRange as string,
    appliesTo: 'sledgehammer',
    modifyHp: -0.2,
    modifyDamage: -0.2,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        range: unit.range + 30,
      };
    },
  },
  improvedSledgehammer: {
    name: 'Improved Sledge\u200Bhammer',
    id: 'improvedSledgehammer',
    description:
      'Increase Sledgehammer’s attack by 100%, and movement speed by 3 but increases recruitment cost by 50',
    thumbnail: thumbnailImproved as string,
    appliesTo: 'sledgehammer',
    modifyDamage: 1.0,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost + 50,
        speed: unit.speed + 3,
      };
    },
  },
  assaultStormcaller: {
    name: 'Assault Storm\u200Bcaller',
    id: 'assaultStormcaller',
    description:
      'Increase Stormcaller’s HP by 300% and movement speed by 5 but decreases range by 30',
    thumbnail: thumbnailAssault as string,
    appliesTo: 'stormcaller',
    modifyHp: 3.0,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        range: unit.range - 30,
        speed: unit.speed + 5,
      };
    },
  },
  extendedRangeStormcaller: {
    name: 'Extended Range Storm\u200Bcaller',
    id: 'extendedRangeStormcaller',
    description:
      'Increase Stormcaller’s range by 35 but decreases attack by 30%',
    thumbnail: thumbnailExtendedRange as string,
    appliesTo: 'stormcaller',
    modifyDamage: -0.3,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        range: unit.range + 35,
      };
    },
  },
  extendedRangeSteelBall: {
    name: 'Extended Range Steel Ball',
    id: 'extendedRangeSteelBall',
    description:
      'Increase Steel Ball’s range by 40 but decreases attack by 30% and HP by 40%',
    thumbnail: thumbnailExtendedRange as string,
    appliesTo: 'steel_ball',
    modifyHp: -0.4,
    modifyDamage: -0.3,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        range: unit.range + 40,
      };
    },
  },
  improvedSteelBall: {
    name: 'Improved Steel Ball',
    id: 'improvedSteelBall',
    description:
      'Increase Steel Ball’s attack by 50%, HP by 30%, movement speed by 3, and range by 10, but increases recruitment cost by 50',
    thumbnail: thumbnailImproved as string,
    appliesTo: 'steel_ball',
    modifyHp: 0.3,
    modifyDamage: 0.5,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost + 50,
        speed: unit.speed + 3,
        range: unit.range + 10,
      };
    },
  },
  improvedTarantula: {
    name: 'Improved Tarantula',
    id: 'improvedTarantula',
    description:
      'Increase Tarantula’s HP by 20%, and movement speed by 3 but increases recruitment cost by 50',
    thumbnail: thumbnailImproved as string,
    appliesTo: 'tarantula',
    modifyDamage: 0.2,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost + 50,
        speed: unit.speed + 3,
      };
    },
  },
  extendedRangeSabertooth: {
    name: 'Extended Range Sabertooth',
    id: 'extendedRangeSabertooth',
    description:
      'Increase Sabertooth’s range by 30 but decreases attack by 20% and HP by 40%',
    thumbnail: thumbnailExtendedRange as string,
    appliesTo: 'sabertooth',
    modifyHp: -0.4,
    modifyDamage: -0.2,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        range: unit.range + 30,
      };
    },
  },
  massProducedSabertooth: {
    name: 'Mass-Produced Sabertooth',
    id: 'massProducedSabertooth',
    description:
      'Decreases the recruitment cost of Sabertooth by 100 but decreases attack by 40%, and HP by 40%',
    thumbnail: thumbnailMassProduced as string,
    appliesTo: 'sabertooth',
    modifyHp: -0.4,
    modifyDamage: -0.4,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost - 100,
      };
    },
  },
  improvedSabertooth: {
    name: 'Improved Sabertooth',
    id: 'improvedSabertooth',
    description:
      'Increase Sabertooth’s HP by 20%, and decreases attack interval by 0.6s, but increases recruitment cost by 50',
    thumbnail: thumbnailImproved as string,
    appliesTo: 'sabertooth',
    modifyHp: 0.2,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost + 50,
        attackInterval: unit.attackInterval - 0.6,
      };
    },
  },
  massProducedWasp: {
    name: 'Mass-Produced Wasp',
    id: 'massProducedWasp',
    description:
      'Decreases the recruitment cost of Wasp by 100 but decreases attack by 35%, and HP by 35%',
    thumbnail: thumbnailMassProduced as string,
    appliesTo: 'wasp',
    modifyHp: -0.35,
    modifyDamage: -0.35,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost - 100,
      };
    },
  },
  improvedWasp: {
    name: 'Improved Wasp',
    id: 'improvedWasp',
    description:
      'Increase Wasp’s attack by 60%, HP by 60%, and range by 20 but increases recruitment cost by 100',
    thumbnail: thumbnailImproved as string,
    appliesTo: 'wasp',
    modifyHp: 0.6,
    modifyDamage: 0.6,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost + 100,
        range: unit.range + 20,
      };
    },
  },
  massProducedRhino: {
    name: 'Mass-Produced Rhino',
    id: 'massProducedRhino',
    description:
      'Decreases the recruitment cost of Rhino by 100 but decreases attack by 20%, and HP by 20%',
    thumbnail: thumbnailMassProduced as string,
    appliesTo: 'rhino',
    modifyHp: -0.2,
    modifyDamage: -0.2,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost - 100,
      };
    },
  },
  fortifiedHacker: {
    name: 'Fortified Hacker',
    id: 'fortifiedHacker',
    description:
      'Increase Hacker’s HP by 500% and movement speed by 5 but decreases range by 35',
    thumbnail: thumbnailFortified as string,
    appliesTo: 'hacker',
    modifyHp: 5,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        range: unit.range - 35,
        speed: unit.speed + 5,
      };
    },
  },
  massProducedPhoenix: {
    name: 'Mass-Produced Phoenix',
    id: 'massProducedPhoenix',
    description:
      'Decreases the recruitment cost of Phoenix by 100 but decreases attack by 30%, and HP by 30%',
    thumbnail: thumbnailMassProduced as string,
    appliesTo: 'phoenix',
    modifyHp: -0.3,
    modifyDamage: -0.3,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost - 100,
      };
    },
  },
  extendedRangePhoenix: {
    name: 'Extended Range Phoenix',
    id: 'extendedRangePhoenix',
    description: 'Increase Phoenix’s range by 20 but decreases attack by 20%',
    thumbnail: thumbnailExtendedRange as string,
    appliesTo: 'phoenix',
    modifyDamage: -0.2,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        range: unit.range + 20,
      };
    },
  },
  improvedPhoenix: {
    name: 'Improved Phoenix',
    id: 'improvedPhoenix',
    description:
      'Increase Phoenix’s attack by 50%, HP by 250%, but increases recruitment cost by 100',
    thumbnail: thumbnailImproved as string,
    appliesTo: 'phoenix',
    modifyHp: 2.5,
    modifyDamage: 0.5,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost + 100,
      };
    },
  },
  massProducedWraith: {
    name: 'Mass-Produced Wraith',
    id: 'massProducedWraith',
    description:
      'Decreases the recruitment cost of Wraith by 100 but decreases attack by 20%, and HP by 20%',
    thumbnail: thumbnailMassProduced as string,
    appliesTo: 'wraith',
    modifyHp: -0.2,
    modifyDamage: -0.2,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost - 100,
      };
    },
  },
  improvedWraith: {
    name: 'Improved Wraith',
    id: 'improvedWraith',
    description:
      'Increase Wraith’s attack by 30%, and range by 5 but increases recruitment cost by 50',
    thumbnail: thumbnailImproved as string,
    appliesTo: 'wraith',
    modifyDamage: 0.3,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost + 50,
        range: unit.range + 5,
      };
    },
  },
  massProducedScorpion: {
    name: 'Mass-Produced Scorpion',
    id: 'massProducedScorpion',
    description:
      'Decreases the recruitment cost of Scorpion by 100 but decreases attack by 20%, HP by 20%, and range by 10',
    thumbnail: thumbnailMassProduced as string,
    appliesTo: 'scorpion',
    modifyHp: -0.2,
    modifyDamage: -0.2,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost - 100,
        range: unit.range - 10,
      };
    },
  },
  assaultScorpion: {
    name: 'Assault Scorpion',
    id: 'assaultScorpion',
    description:
      'Increase Scorpion’s HP by 20%, movement speed by 3, and decreases attack interval by 1.5s, but decreases range by 30',
    thumbnail: thumbnailAssault as string,
    appliesTo: 'scorpion',
    modifyHp: 0.2,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        range: unit.range - 30,
        speed: unit.speed + 3,
        attackInterval: unit.attackInterval - 1.5,
      };
    },
  },
  improvedScorpion: {
    name: 'Improved Scorpion',
    id: 'improvedScorpion',
    description:
      'Increase Scorpion’s attack by 15%, HP by 15%, and range by 10 but increases recruitment cost by 50',
    thumbnail: thumbnailImproved as string,
    appliesTo: 'scorpion',
    modifyHp: 0.15,
    modifyDamage: 0.15,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost + 50,
        range: unit.range + 10,
      };
    },
  },
  assaultVulcan: {
    name: 'Assault Vulcan',
    id: 'assaultVulcan',
    description:
      'Increase Vulcan’s HP by 40% and movement speed by 3 but decreases range by 10',
    thumbnail: thumbnailAssault as string,
    appliesTo: 'vulcan',
    modifyHp: 0.4,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        range: unit.range - 10,
        speed: unit.speed + 3,
      };
    },
  },
  extendedRangeVulcan: {
    name: 'Extended Range Vulcan',
    id: 'extendedRangeVulcan',
    description: 'Increase Vulcan’s range by 20 but decreases HP by 35%',
    thumbnail: thumbnailExtendedRange as string,
    appliesTo: 'vulcan',
    modifyHp: -0.35,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        range: unit.range + 20,
      };
    },
  },
  assaultMeltingPoint: {
    name: 'Assault Melting Point',
    id: 'assaultMeltingPoint',
    description:
      'Increase Melting Point’s HP by 70% and movement speed by 5 but decreases range by 15',
    thumbnail: thumbnailAssault as string,
    appliesTo: 'melting_point',
    modifyHp: 0.7,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        range: unit.range - 15,
        speed: unit.speed + 5,
      };
    },
  },
  improvedMeltingPoint: {
    name: 'Improved Melting Point',
    id: 'improvedMeltingPoint',
    description:
      'Increase Melting Point’s HP by 20% and range by 10 but increases recruitment cost by 100',
    thumbnail: thumbnailImproved as string,
    appliesTo: 'melting_point',
    modifyHp: 0.2,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost + 100,
        range: unit.range + 10,
      };
    },
  },
  massProducedMeltingPoint: {
    name: 'Mass-Produced Melting Point',
    id: 'massProducedMeltingPoint',
    description:
      'Decreases the recruitment cost of Melting Point by 100 but decreases range by 10, attack by 20%, and HP by 20%',
    thumbnail: thumbnailMassProduced as string,
    appliesTo: 'melting_point',
    modifyHp: -0.2,
    modifyDamage: -0.2,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost - 100,
        range: unit.range - 10,
      };
    },
  },
  massProducedFortress: {
    name: 'Mass-Produced Fortress',
    id: 'massProducedFortress',
    description:
      'Decreases the recruitment cost of Fortress by 100 but decreases attack by 40% and HP by 40%',
    thumbnail: thumbnailMassProduced as string,
    appliesTo: 'fortress',
    modifyHp: -0.4,
    modifyDamage: -0.4,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost - 100,
      };
    },
  },
  assaultFortress: {
    name: 'Assault Fortress',
    id: 'assaultFortress',
    description:
      'Increase Fortress’ attack by 20%, HP by 20%, and movement speed by 3, but decreases range by 10',
    thumbnail: thumbnailAssault as string,
    appliesTo: 'fortress',
    modifyHp: 0.2,
    modifyDamage: 0.2,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        range: unit.range - 10,
        speed: unit.speed + 3,
      };
    },
  },
  extendedRangeFortress: {
    name: 'Extended Range Fortress',
    id: 'id',
    description: 'Increase fortress’ range by 20 but decreases HP by 30%',
    thumbnail: thumbnailExtendedRange as string,
    appliesTo: 'fortress',
    modifyHp: -0.3,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        range: unit.range + 20,
      };
    },
  },
  improvedFortress: {
    name: 'Improved Fortress',
    id: 'improvedFortress',
    description:
      'Increase fortress’ HP by 50%, movement speed by 3, attack by 30% and increases recruitment cost by 100',
    thumbnail: thumbnailImproved as string,
    appliesTo: 'fortress',
    modifyHp: 0.5,
    modifyDamage: 0.3,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost + 100,
        speed: unit.speed + 3,
      };
    },
  },
  improvedSandworm: {
    name: 'Improved Sandworm',
    id: 'improvedSandworm',
    description:
      'Increase Sandworm’s attack by 40%, movement speed by 3, and splash range by 5, but increases recruitment cost by 100',
    thumbnail: thumbnailImproved as string,
    appliesTo: 'sandworm',
    modifyDamage: 0.4,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost + 100,
        speed: unit.speed + 3,
        splashRadius: unit.splashRadius + 5,
      };
    },
  },
  massProducedOverlord: {
    name: 'Mass-Produced Overlord',
    id: 'massProducedOverlord',
    description:
      'Decreases the recruitment cost of Overlord by 100 but decreases attack by 20%, HP by 20%, and range by 10',
    thumbnail: thumbnailMassProduced as string,
    appliesTo: 'overlord',
    modifyHp: -0.2,
    modifyDamage: -0.2,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost - 100,
        range: unit.range - 10,
      };
    },
  },
  fortifiedOverlord: {
    name: 'Fortified Overlord',
    id: 'fortifiedOverlord',
    description: 'Increase Overlord’s HP by 75% but decreases attack by 35%',
    thumbnail: thumbnailFortified as string,
    appliesTo: 'overlord',
    modifyHp: 0.75,
    modifyDamage: -0.35,
  },
  improvedOverlord: {
    name: 'Improved Overlord',
    id: 'improvedOverlord',
    description:
      'Increase Overlord’s attack by 30%, HP by 30%, and splash range by 5, but increases recruitment cost by 100',
    thumbnail: thumbnailImproved as string,
    appliesTo: 'overlord',
    modifyHp: 0.3,
    modifyDamage: 0.3,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost + 100,
        splashRadius: unit.splashRadius + 5,
      };
    },
  },
  extendedRangeWarFactory: {
    name: 'Extended Range War Factory',
    id: 'extendedRangeWarFactory',
    description:
      'Increase War Factory’s range by 20 but decreases attack by 20%, and HP by 40%',
    thumbnail: thumbnailExtendedRange as string,
    appliesTo: 'war_factory',
    modifyHp: -0.4,
    modifyDamage: -0.2,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        range: unit.range + 20,
      };
    },
  },
  improvedWarFactory: {
    name: 'Improved War Factory',
    id: 'improvedWarFactory',
    description:
      'Increase War Factory’s attack by 15%, HP by 40%, range by 10, decreases attack interval by 0.2, but increases recruitment cost by 200',
    thumbnail: thumbnailImproved as string,
    appliesTo: 'war_factory',
    modifyHp: 0.4,
    modifyDamage: 0.15,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        cost: unit.cost + 200,
        range: unit.range + 10,
        attackInterval: unit.attackInterval - 0.2,
      };
    },
  },

  // global HP and attack modifiers
  /* not used yet
  advancedDefense: {
    name: 'Advanced Defensive Tactics',
    id: 'advancedDefense',
    description: 'Increases the HP of all units by 30%',
    modifyHp: 0.3,
  },
  advancedOffense: {
    name: 'Advanced Offensive Tactics',
    id: 'advancedOffense',
    description: 'Increases the attack of all units by 30%',
    modifyDamage: 0.3,
  },
  advancedAiming: {
    name: 'Advanced Aiming System',
    id: 'advancedAiming',
    description: 'Increases the range of all ranged by 10',
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        range: unit.range ? unit.range + 10 : unit.range,
      };
    },
  },
  advancePowertrain: {
    name: 'Advanced Powertrain',
    id: 'advancePowertrain',
    description: 'Increases the movement speed of all units by 3m/s',
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        speed: unit.speed + 3,
      };
    },
  },
  */

  rcAttack1: {
    name: 'Improved Attack 1',
    id: 'rcAttack1',
    description: 'Increase attack of all units by 12%',
    thumbnail: researchThumbs['./thumbnails/research/attack_1.png'] as string,
    modifyDamage: 0.12,
  },
  rcAttack2: {
    name: 'Improved Attack 2',
    id: 'rcAttack2',
    description: 'Increase attack of all units by 36%',
    thumbnail: researchThumbs['./thumbnails/research/attack_2.png'] as string,
    modifyDamage: 0.36,
  },
  rcDefense1: {
    name: 'Improved Defense 1',
    id: 'rcDefense1',
    description: 'Increase HP of all units by 15%',
    thumbnail: researchThumbs['./thumbnails/research/defense_1.png'] as string,
    modifyHp: 0.15,
  },
  rcDefense2: {
    name: 'Improved Defense 2',
    id: 'rcDefense2',
    description: 'Increase HP of all units by 45%',
    thumbnail: researchThumbs['./thumbnails/research/defense_2.png'] as string,
    modifyHp: 0.45,
  },
};

// Method to prevent incompatible mods from being selected
export const filterMods = (modList: Set<string>) => {
  const latestVal = Array.from(modList).at(-1);
  // some mods are incompatible with others, we use this to deselect some options
  if (latestVal === 'rcAttack1') {
    modList.delete('rcAttack2');
  }
  if (latestVal === 'rcAttack2') {
    modList.delete('rcAttack1');
  }
  if (latestVal === 'rcDefense1') {
    modList.delete('rcDefense2');
  }
  if (latestVal === 'rcDefense2') {
    modList.delete('rcDefense1');
  }

  // only 1 attack or defense mod may be used at a time
  if (modList.has('rcAttack1') && modList.has('rcAttack2')) {
    modList.delete('rcAttack1');
  }
  if (modList.has('rcDefense1') && modList.has('rcDefense2')) {
    modList.delete('rcDefense1');
  }

  return modList;
};
