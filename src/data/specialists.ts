export const specialistDisplayOrder = ['heavyArmor', 'costControl'];

export const specialists = {
  heavyArmor: {
    name: 'Heavy Armor',
    id: 'heavyArmor',
    modifier: (unit: { hp: number }) => {
      return {
        ...unit,
        hp: (unit.hp *= 1.13),
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
