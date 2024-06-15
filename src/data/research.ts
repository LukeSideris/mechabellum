import { ModInterface } from './ModInterface';

const thumbnails = import.meta.glob('./thumbnails/research/*.png', {
  eager: true,
  import: 'default',
});

export const attackResearch: { [key: string]: ModInterface } = {
  rcAttack1: {
    name: 'Attack upgrade 1',
    id: 'rcAttack1',
    description: 'Increase attack of all units by 10%',
    thumbnail: thumbnails['./thumbnails/research/attack_1.png'] as string,
    modifyDamage: 0.1,
  },
  rcAttack2: {
    name: 'Attack upgrade 2',
    id: 'rcAttack2',
    description: 'Increase health of all units by 30%',
    thumbnail: thumbnails['./thumbnails/research/attack_2.png'] as string,
    modifyDamage: 0.3,
  },
};

export const defenseResearch: { [key: string]: ModInterface } = {
  rcDefense1: {
    name: 'Defense upgrade 1',
    id: 'rcDefense1',
    description: 'Increase health of all units by 10%',
    thumbnail: thumbnails['./thumbnails/research/defense_1.png'] as string,
    modifyHp: 0.1,
  },
  rcDefense2: {
    name: 'Defense upgrade 2',
    id: 'rcDefense2',
    description: 'Increase health of all units by 30%',
    thumbnail: thumbnails['./thumbnails/research/defense_2.png'] as string,
    modifyHp: 0.3,
  },
};
