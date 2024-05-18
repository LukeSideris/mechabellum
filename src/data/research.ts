const thumbnails = import.meta.glob('./researchThumbs/*.png', {
  eager: true,
  import: 'default',
});

export type researchInterface = {
  name: string;
  id: string;
  attackModifier?: number;
  hpModifier?: number;
  thumbnail: string;
};

export const attackResearch = [
  {
    name: 'Attack upgrade 1',
    id: 'rcAttack1',
    attackModifier: 0.1,
    thumbnail: thumbnails['./researchThumbs/attack_1.png'] as string,
  },
  {
    name: 'Attack upgrade 2',
    id: 'rcAttack2',
    attackModifier: 0.3,
    thumbnail: thumbnails['./researchThumbs/attack_2.png'] as string,
  }
];

export const defenseResearch = [
  {
    name: 'Defense upgrade 1',
    id: 'rcDefense1',
    hpModifier: 0.1,
    thumbnail: thumbnails['./researchThumbs/defense_1.png'] as string,
  },
  {
    name: 'Defense upgrade 2',
    id: 'rcDefense2',
    hpModifier: 0.3,
    thumbnail: thumbnails['./researchThumbs/defense_2.png'] as string,
  }
];
