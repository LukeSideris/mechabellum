import { UnitInterface } from './units';
import thumbnailAerial from './thumbnails/specialists/aerial.png';
import thumbnailFortifiedSpecialist from './thumbnails/specialists/fortifiedSpecialist.png';
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

export const starterSpecialists = [
  'fortified',
  'costControl',
  'speed',
  'aerial',
];
export const attackResearch = ['rcAttack1', 'rcAttack2'];
export const defenseResearch = ['rcDefense1', 'rcDefense2'];

export const mods = {
  fortified: {
    name: 'Fortified Specialist',
    id: 'fortified',
    description: 'Increase health of all units by 17%',
    thumbnail: thumbnailFortifiedSpecialist,
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
    name: 'Attack up 1',
    id: 'rcAttack1',
    description: 'Increase attack of all units by 10%',
    thumbnail: researchThumbs['./thumbnails/research/attack_1.png'] as string,
    modifyDamage: 0.1,
  },
  rcAttack2: {
    name: 'Attack up 2',
    id: 'rcAttack2',
    description: 'Increase health of all units by 30%',
    thumbnail: researchThumbs['./thumbnails/research/attack_2.png'] as string,
    modifyDamage: 0.3,
  },
  rcDefense1: {
    name: 'Defense up 1',
    id: 'rcDefense1',
    description: 'Increase health of all units by 10%',
    thumbnail: researchThumbs['./thumbnails/research/defense_1.png'] as string,
    modifyHp: 0.15,
  },
  rcDefense2: {
    name: 'Defense up 2',
    id: 'rcDefense2',
    description: 'Increase health of all units by 30%',
    thumbnail: researchThumbs['./thumbnails/research/defense_2.png'] as string,
    modifyHp: 0.3,
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