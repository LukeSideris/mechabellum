import { UnitInterface } from './units';
import { ModInterface } from './ModInterface';
import thumbnailAerial from './thumbnails/specialists/aerial.png';
import thumbnailHeavyArmor from './thumbnails/specialists/heavyArmor.png';
import thumbnailCostControl from './thumbnails/specialists/costControl.png';
import thumbnailSpeed from './thumbnails/specialists/speed.png';

export const specialistDisplayOrder = ['heavyArmor', 'costControl'];

// this object is composed of ModInterface objects
export const starterSpecialists: { [key: string]: ModInterface } = {
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
        speed: (unit.speed = 3),
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
};
