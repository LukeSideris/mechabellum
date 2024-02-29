const thumbnails = import.meta.glob('./unitThumbs/*.png', {
  eager: true,
  import: 'default',
});

export const unitDisplayOrder = [
  'crawler',
  'fang',
  'arclight',
  'marksman',
  'sledgehammer',
  'mustang',
  'rhino',
  'steel_ball',
  'stormcaller',
  'wasp',
  'phoenix',
  'vulcan',
  'fortress',
  'melting_point',
  'overlord',
];

export type UnitInterface = {
  name: string;
  id: string;
  cost: number;
  hp: number;
  damage: number;
  thumbnail: string;
};

// NOTE: All the health and damage values need to be checked
export const units = {
  crawler: {
    name: 'Crawler',
    id: 'crawler',
    cost: 100,
    hp: 261,
    damage: 66,
    thumbnail: thumbnails['./unitThumbs/crawler.png'] as string,
  },
  fang: {
    name: 'Fang',
    id: 'fang',
    cost: 100,
    hp: 117,
    damage: 56,
    thumbnail: thumbnails['./unitThumbs/fang.png'] as string,
  },
  arclight: {
    name: 'Arclight',
    id: 'arclight',
    cost: 100,
    hp: 3903,
    damage: 346,
    thumbnail: thumbnails['./unitThumbs/arclight.png'] as string,
  },
  marksman: {
    name: 'Marksman',
    id: 'marksman',
    cost: 100,
    hp: 1622,
    damage: 2329,
    thumbnail: thumbnails['./unitThumbs/marksman.png'] as string,
  },
  sledgehammer: {
    name: 'Sledgehammer',
    id: 'sledgehammer',
    cost: 200,
    hp: 3700,
    damage: 608,
    thumbnail: thumbnails['./unitThumbs/sledgehammer.png'] as string,
  },
  mustang: {
    name: 'Mustang',
    id: 'mustang',
    cost: 200,
    hp: 343,
    damage: 33,
    thumbnail: thumbnails['./unitThumbs/mustang.png'] as string,
  },
  rhino: {
    name: 'Rhino',
    id: 'rhino',
    cost: 200,
    hp: 19297,
    damage: 3297,
    thumbnail: thumbnails['./unitThumbs/rhino.png'] as string,
  },
  steel_ball: {
    name: 'Steel Ball',
    id: 'steel_ball',
    cost: 200,
    hp: 4571,
    damage: 2,
    thumbnail: thumbnails['./unitThumbs/steel_ball.png'] as string,
  },
  stormcaller: {
    name: 'Stormcaller',
    id: 'stormcaller',
    cost: 200,
    hp: 1149,
    damage: 860, // x 4 missiles
    thumbnail: thumbnails['./unitThumbs/stormcaller.png'] as string,
  },
  wasp: {
    name: 'Wasp',
    id: 'wasp',
    cost: 300,
    hp: 302,
    damage: 202,
    thumbnail: thumbnails['./unitThumbs/wasp.png'] as string,
  },
  phoenix: {
    name: 'Phoenix',
    id: 'phoenix',
    cost: 200,
    hp: 1464,
    damage: 3073,
    thumbnail: thumbnails['./unitThumbs/phoenix.png'] as string,
  },
  vulcan: {
    name: 'Vulcan',
    id: 'vulcan',
    cost: 400,
    hp: 36909,
    damage: 81,
    thumbnail: thumbnails['./unitThumbs/vulcan.png'] as string,
  },
  fortress: {
    name: 'Fortress',
    id: 'fortress',
    cost: 400,
    hp: 51205,
    damage: 6843,
    thumbnail: thumbnails['./unitThumbs/fortress.png'] as string,
  },
  melting_point: {
    name: 'Melting Point',
    id: 'melting_point',
    cost: 400,
    hp: 41102,
    damage: 1,
    thumbnail: thumbnails['./unitThumbs/melting_point.png'] as string,
  },
  overlord: {
    name: 'Overlord',
    id: 'overlord',
    cost: 400,
    hp: 15630,
    damage: 3654, // x 4 missiles
    thumbnail: thumbnails['./unitThumbs/overlord.png'] as string,
  },
};
