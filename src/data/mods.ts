import { UnitInterface } from './units';
import thumbnailAerial from './thumbnails/specialists/aerial.png';
import thumbnailHeavyArmor from './thumbnails/specialists/heavyArmor.png';
import thumbnailCostControl from './thumbnails/specialists/costControl.png';
import thumbnailSpeed from './thumbnails/specialists/speed.png';

const researchThumbs = import.meta.glob('./thumbnails/research/*.png', {
  eager: true,
  import: 'default',
});

export type ModInterface = {
  name: string;
  id: string;
  description?: string;
  thumbnail: string;
  // hp and attack use different mathematics depending on being positive or negative
  modifyHp?: number;
  modifyDamage?: number;
  // generic modifier to apply to any unit stat. Do not use to modify attack or HP.
  modifier?: (unit: UnitInterface) => UnitInterface;
};

export const starterSpecialists = new Set([
  'heavyArmor',
  'costControl',
  'speed',
  'aerial',
]);
export const attackResearch = new Set(['rcAttack1', 'rcAttack2']);
export const defenseResearch = new Set(['rcDefense1', 'rcDefense2']);

export const mods = {
  heavyArmor: {
    name: 'Heavy Armor',
    id: 'heavyArmor',
    description: 'Increase health of all units by 17%',
    thumbnail: thumbnailHeavyArmor,
    modifyHp: 0.17,
  },
  costControl: {
    name: 'Cost Control',
    id: 'costControl',
    description: 'Decrease health and attack of all units by 13%',
    thumbnail: thumbnailCostControl,
    modifyHp: -0.13,
    modifyDamage: -0.13,
  },
  speed: {
    name: 'Speed',
    id: 'speed',
    description: 'Increase speed of all units by 3m/s',
    thumbnail: thumbnailSpeed,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        speed: unit.speed + 3,
      };
    },
  },
  aerial: {
    name: 'Aerial',
    id: 'aerial',
    description: 'Increase range of flying units by 10m',
    thumbnail: thumbnailAerial,
    modifier: (unit: UnitInterface) => {
      return {
        ...unit,
        range: unit.flying ? unit.range + 10 : unit.range,
      };
    },
  },
  rcAttack1: {
    name: 'Attack upgrade 1',
    id: 'rcAttack1',
    description: 'Increase attack of all units by 10%',
    thumbnail: researchThumbs['./thumbnails/research/attack_1.png'] as string,
    modifyDamage: 0.1,
  },
  rcAttack2: {
    name: 'Attack upgrade 2',
    id: 'rcAttack2',
    description: 'Increase health of all units by 30%',
    thumbnail: researchThumbs['./thumbnails/research/attack_2.png'] as string,
    modifyDamage: 0.3,
  },
  rcDefense1: {
    name: 'Defense upgrade 1',
    id: 'rcDefense1',
    description: 'Increase health of all units by 10%',
    thumbnail: researchThumbs['./thumbnails/research/defense_1.png'] as string,
    modifyHp: 0.1,
  },
  rcDefense2: {
    name: 'Defense upgrade 2',
    id: 'rcDefense2',
    description: 'Increase health of all units by 30%',
    thumbnail: researchThumbs['./thumbnails/research/defense_2.png'] as string,
    modifyHp: 0.3,
  },
};
