export const researchDisplayOrder = ['rcAttack10', 'rcDefense10'];

export const research = {
  rcAttack10: {
    name: 'RC Attack 10',
    id: 'rcAttack10',
    modifier: (unit: { damage: number }) => {
      return {
        ...unit,
        damage: (unit.damage *= 1.1),
      };
    },
  },
  rcDefense10: {
    name: 'RC Defense 10',
    id: 'rcDefense10',
    modifier: (unit: { hp: number }) => {
      return {
        ...unit,
        hp: (unit.hp *= 1.1),
      };
    },
  },
};
