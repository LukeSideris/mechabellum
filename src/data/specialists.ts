export const specialistDisplayOrder = ['heavyArmor', 'costControl'];

export type specialistsInterface = {
  name: string;
  id: string;
};

export const specialists = {
  heavyArmor: {
    name: 'Heavy Armor',
    id: 'heavyArmor',
    modifyHp: (unit: { hp: number }) => {
      return {
        ...unit,
        hp: (unit.hp *= 1.17),
      };
    },
    modifier: (unit: { hp: number }) => {
      return {
        ...unit,
        hp: (unit.hp *= 1.17),
      };
    },
  },
  costControl: {
    name: 'Cost Control',
    id: 'costControl',
    modifier: (unit: { hp: number }) => {
      return {
        ...unit,
        hp: (unit.hp *= 0.87),
      };
    },
  },
};
