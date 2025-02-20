const cards = import.meta.glob('./cards/units/*.jpg', {
  eager: true,
  import: 'default',
});
const thumbnails = import.meta.glob('./thumbnails/units/*.png', {
  eager: true,
  import: 'default',
});

// validated list of unit ids
export type UnitIdType =
  | 'crawler'
  | 'fang'
  | 'arclight'
  | 'marksman'
  | 'hound'
  | 'mustang'
  | 'sledgehammer'
  | 'stormcaller'
  | 'steel_ball'
  | 'tarantula'
  | 'rhino'
  | 'phantom_ray'
  | 'hacker'
  | 'wasp'
  | 'phoenix'
  | 'wraith'
  | 'scorpion'
  | 'vulcan'
  | 'melting_point'
  | 'fortress'
  | 'sandworm'
  | 'raiden'
  | 'overlord'
  | 'war_factory'
  | 'fire_badger'
  | 'sabertooth'
  | 'typhoon'
  | 'farseer';

export type UnitInterface = {
  name: string;
  id: UnitIdType;
  card: string;
  thumbnail: string;
  level: number;
  cost: number;
  hp: number;
  hpMod?: number; // applied by applyMods function
  speed: number;
  damage: number;
  damageMod?: number; // applied by applyMods function
  damageMax?: number; // for damage ramp units like steel ball
  damageTable?: number[]; // for melting point damage values which seem somewhat random
  splashRadius: number; // in meters
  attackInterval: number; // in seconds
  range: number; // in meters
  flying: boolean;
  shootsUp: boolean;
  unitCount: number; // number of units in the squad
  rows?: number; // number of rows in the squad
  area: number; // square meters required for deployment
};

export type UnitLibraryInterface = {
  [key in UnitIdType]: UnitInterface;
};

export const units: UnitLibraryInterface = {
  crawler: {
    name: 'Crawler',
    id: 'crawler',
    card: cards['./cards/units/crawler.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/crawler.png'] as string,
    level: 1,
    cost: 100,
    hp: 277,
    speed: 16,
    damage: 79,
    splashRadius: 0,
    attackInterval: 0.6,
    range: 0,
    flying: false,
    shootsUp: false,
    unitCount: 24,
    rows: 3,
    area: 50 * 20,
  },
  fang: {
    name: 'Fang',
    id: 'fang',
    card: cards['./cards/units/fang.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/fang.png'] as string,
    level: 1,
    cost: 100,
    hp: 117,
    speed: 6,
    damage: 61,
    splashRadius: 0,
    attackInterval: 1.5,
    range: 75,
    flying: false,
    shootsUp: true,
    unitCount: 18,
    rows: 3,
    area: 50 * 20,
  },
  arclight: {
    name: 'Arclight',
    id: 'arclight',
    card: cards['./cards/units/arclight.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/arclight.png'] as string,
    level: 1,
    cost: 100,
    hp: 4414,
    speed: 7,
    damage: 347,
    splashRadius: 7,
    attackInterval: 0.9,
    range: 93,
    flying: false,
    shootsUp: false,
    unitCount: 1,
    rows: 1,
    area: 20 * 20,
  },
  marksman: {
    name: 'Marksman',
    id: 'marksman',
    card: cards['./cards/units/marksman.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/marksman.png'] as string,
    level: 1,
    cost: 100,
    hp: 1622,
    speed: 8,
    damage: 2329,
    splashRadius: 0,
    attackInterval: 3.1,
    range: 140,
    flying: false,
    shootsUp: true,
    unitCount: 1,
    rows: 1,
    area: 20 * 20,
  },
  hound: {
    name: 'Hound',
    id: 'hound',
    card: cards['./cards/units/placeholder.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/unknown.png'] as string,
    level: 1,
    cost: 100,
    hp: 848,
    speed: 10,
    damage: 267,
    splashRadius: 6,
    attackInterval: 2.4,
    range: 70,
    flying: false,
    shootsUp: false,
    unitCount: 5,
    rows: 2,
    area: 40 * 20,
  },
  mustang: {
    name: 'Mustang',
    id: 'mustang',
    card: cards['./cards/units/mustang.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/mustang.png'] as string,
    level: 1,
    cost: 200,
    hp: 343,
    speed: 16,
    damage: 37,
    splashRadius: 0,
    attackInterval: 0.4,
    range: 95,
    flying: false,
    shootsUp: true,
    unitCount: 12,
    rows: 2,
    area: 50 * 20,
  },
  sledgehammer: {
    // add a shy to control line breaks
    name: 'Sledge\u00ADhammer',
    id: 'sledgehammer',
    card: cards['./cards/units/sledgehammer.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/sledgehammer.png'] as string,
    level: 1,
    cost: 200,
    hp: 3478,
    speed: 7,
    damage: 608,
    splashRadius: 5.0,
    attackInterval: 4.5,
    range: 95,
    flying: false,
    shootsUp: false,
    unitCount: 5,
    rows: 1,
    area: 50 * 20,
  },
  stormcaller: {
    // add a shy to control line breaks
    name: 'Storm\u00ADcaller',
    id: 'stormcaller',
    card: cards['./cards/units/stormcaller.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/stormcaller.png'] as string,
    level: 1,
    cost: 200,
    hp: 1149,
    speed: 6,
    damage: 796 * 4, // 4 missiles
    splashRadius: 5.5,
    attackInterval: 6.6,
    range: 180,
    flying: false,
    shootsUp: false,
    unitCount: 4,
    rows: 1,
    area: 50 * 20,
  },
  steel_ball: {
    name: 'Steel Ball',
    id: 'steel_ball',
    card: cards['./cards/units/steel_ball.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/steel_ball.png'] as string,
    level: 1,
    cost: 200,
    hp: 4571,
    speed: 16,
    damage: 2,
    damageMax: 2605,
    splashRadius: 0,
    attackInterval: 0.2,
    range: 45,
    flying: false,
    shootsUp: false,
    unitCount: 4,
    rows: 1,
    area: 50 * 20,
  },
  tarantula: {
    name: 'Tarantula',
    id: 'tarantula',
    card: cards['./cards/units/tarantula.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/tarantula.png'] as string,
    level: 1,
    cost: 200,
    hp: 15162,
    speed: 8,
    damage: 550,
    splashRadius: 5.0,
    attackInterval: 0.6,
    range: 80,
    flying: false,
    shootsUp: false,
    unitCount: 1,
    rows: 1,
    area: 30 * 30,
  },
  sabertooth: {
    // add a shy to control line breaks
    name: 'Saber\u00ADtooth',
    id: 'sabertooth',
    card: cards['./cards/units/sabertooth.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/sabertooth.png'] as string,
    level: 1,
    cost: 200,
    hp: 14801,
    speed: 8,
    damage: 7372,
    splashRadius: 5.0,
    attackInterval: 3.6,
    range: 95,
    flying: false,
    shootsUp: false,
    unitCount: 1,
    rows: 1,
    area: 30 * 30,
  },
  rhino: {
    name: 'Rhino',
    id: 'rhino',
    card: cards['./cards/units/rhino.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/rhino.png'] as string,
    level: 1,
    cost: 200,
    hp: 19297,
    speed: 16,
    damage: 3560,
    splashRadius: 6,
    attackInterval: 0.9,
    range: 0,
    flying: false,
    shootsUp: false,
    unitCount: 1,
    rows: 1,
    area: 30 * 30,
  },
  hacker: {
    name: 'Hacker',
    id: 'hacker',
    card: cards['./cards/units/hacker.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/hacker.png'] as string,
    level: 1,
    cost: 300,
    hp: 3249,
    speed: 8,
    damage: 585,
    splashRadius: 0,
    attackInterval: 0.3,
    range: 110,
    flying: false,
    shootsUp: false,
    unitCount: 1,
    rows: 1,
    area: 30 * 30,
  },
  wasp: {
    name: 'Wasp',
    id: 'wasp',
    card: cards['./cards/units/wasp.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/wasp.png'] as string,
    level: 1,
    cost: 300,
    hp: 311,
    speed: 16,
    damage: 202,
    splashRadius: 0,
    attackInterval: 1.4,
    range: 50,
    flying: true,
    shootsUp: true,
    unitCount: 12,
    rows: 2,
    area: 50 * 20,
  },
  phoenix: {
    name: 'Phoenix',
    id: 'phoenix',
    card: cards['./cards/units/phoenix.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/phoenix.png'] as string,
    level: 1,
    cost: 200,
    hp: 1464,
    speed: 16,
    damage: 2981,
    splashRadius: 0,
    attackInterval: 3.2,
    range: 120,
    flying: true,
    shootsUp: true,
    unitCount: 2,
    rows: 1,
    area: 40 * 20,
  },
  phantom_ray: {
    name: 'Phantom Ray',
    id: 'phantom_ray',
    card: cards['./cards/units/phantom_ray.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/phantom_ray.png'] as string,
    level: 1,
    cost: 200,
    hp: 3159,
    speed: 16,
    damage: 1036 * 2, // 2 missiles
    splashRadius: 3,
    attackInterval: 3,
    range: 65,
    flying: true,
    shootsUp: true,
    unitCount: 3,
    rows: 1,
    area: 50 * 20,
  },
  wraith: {
    name: 'Wraith',
    id: 'wraith',
    card: cards['./cards/units/wraith.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/wraith.png'] as string,
    level: 1,
    cost: 300,
    hp: 15001,
    speed: 10,
    damage: 405,
    splashRadius: 8,
    // base attack interval: 1.6s
    // the wraith weapons can attack independently
    // so we divide the base attack interval by the number of artillery beams
    attackInterval: 0.4,
    range: 60,
    flying: true,
    shootsUp: true,
    unitCount: 1,
    rows: 1,
    area: 30 * 30,
  },
  scorpion: {
    name: 'Scorpion',
    id: 'scorpion',
    card: cards['./cards/units/scorpion.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/scorpion.png'] as string,
    level: 1,
    cost: 300,
    hp: 18632,
    speed: 7,
    damage: 10650,
    splashRadius: 15,
    attackInterval: 4.5,
    range: 100,
    flying: false,
    shootsUp: false,
    unitCount: 1,
    rows: 1,
    area: 30 * 30,
  },
  vulcan: {
    name: 'Vulcan',
    id: 'vulcan',
    card: cards['./cards/units/vulcan.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/vulcan.png'] as string,
    level: 1,
    cost: 400,
    hp: 35332,
    speed: 6,
    damage: 90,
    splashRadius: 15,
    attackInterval: 0.1,
    range: 95,
    flying: false,
    shootsUp: false,
    unitCount: 1,
    rows: 1,
    area: 40 * 40,
  },
  melting_point: {
    name: 'Melting Point',
    id: 'melting_point',
    card: cards['./cards/units/melting_point.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/melting_point.png'] as string,
    level: 1,
    cost: 400,
    hp: 30907,
    speed: 6,
    damage: 1,
    damageMax: 7952,
    // todo - recalc. patch notes changed.
    damageTable: [
      1,
      4,
      56,
      77,
      121,
      84,
      213,
      276, // estimated
      354, // estimated
      // ...
    ],
    splashRadius: 3,
    attackInterval: 0.2,
    range: 115,
    flying: false,
    shootsUp: true,
    unitCount: 1,
    rows: 1,
    area: 40 * 40,
  },
  fortress: {
    name: 'Fortress',
    id: 'fortress',
    card: cards['./cards/units/fortress.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/fortress.png'] as string,
    level: 1,
    cost: 400,
    hp: 43938,
    speed: 6,
    damage: 6177,
    splashRadius: 5,
    attackInterval: 1.8,
    range: 100,
    flying: false,
    shootsUp: false,
    unitCount: 1,
    rows: 1,
    area: 40 * 40,
  },
  sandworm: {
    name: 'Sandworm',
    id: 'sandworm',
    card: cards['./cards/units/sandworm.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/sandworm.png'] as string,
    level: 1,
    cost: 400,
    hp: 48645,
    speed: 16,
    damage: 8324,
    splashRadius: 12.0,
    attackInterval: 2.5,
    range: 0,
    flying: false,
    shootsUp: false,
    unitCount: 1,
    rows: 1,
    area: 40 * 40,
  },
  raiden: {
    name: 'Raiden',
    id: 'raiden',
    card: cards['./cards/units/placeholder.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/unknown.png'] as string,
    level: 1,
    cost: 400,
    hp: 15888,
    speed: 10,
    damage: 5304,
    splashRadius: 0,
    attackInterval: 4.6,
    range: 110,
    flying: true,
    shootsUp: true,
    unitCount: 1,
    rows: 1,
    area: 40 * 40,
  },
  overlord: {
    name: 'Overlord',
    id: 'overlord',
    card: cards['./cards/units/overlord.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/overlord.png'] as string,
    level: 1,
    cost: 500,
    hp: 22054,
    speed: 10,
    damage: 5039 * 4, // 4 missiles
    splashRadius: 7,
    attackInterval: 4.6,
    range: 115,
    flying: true,
    shootsUp: true,
    unitCount: 1,
    rows: 1,
    area: 50 * 50,
  },
  war_factory: {
    name: 'War Factory',
    id: 'war_factory',
    card: cards['./cards/units/war_factory.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/war_factory.png'] as string,
    level: 1,
    cost: 800,
    hp: 146782,
    speed: 6,
    damage: 7184,
    splashRadius: 4.5,
    attackInterval: 0.9, // 1.8 is the listed interval but it has two independent cannons
    range: 100,
    flying: false,
    shootsUp: false,
    unitCount: 1,
    rows: 1,
    area: 70 * 70,
  },
  fire_badger: {
    name: 'Fire Badger',
    id: 'fire_badger',
    card: cards['./cards/units/fire_badger.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/fire_badger.png'] as string,
    level: 1,
    cost: 200,
    hp: 5184,
    speed: 10,
    damage: 28,
    splashRadius: 9.0,
    attackInterval: 0.1,
    range: 60,
    flying: false,
    shootsUp: false,
    unitCount: 3,
    rows: 1,
    area: 50 * 20,
  },
  typhoon: {
    name: 'Typhoon',
    id: 'typhoon',
    card: cards['./cards/units/typhoon.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/typhoon.png'] as string,
    level: 1,
    cost: 300,
    hp: 9529,
    speed: 9,
    damage: 88,
    splashRadius: 5.0,
    attackInterval: 0.2,
    range: 100,
    flying: false,
    shootsUp: true,
    unitCount: 2,
    rows: 1,
    area: 40 * 20,
  },
  farseer: {
    name: 'Farseer',
    id: 'farseer',
    card: cards['./cards/units/farseer.jpg'] as string,
    thumbnail: thumbnails['./thumbnails/units/farseer.png'] as string,
    level: 1,
    cost: 300,
    hp: 11991,
    speed: 16,
    damage: 1148 * 2, // 2 missiles
    splashRadius: 8.0,
    attackInterval: 1.6,
    range: 125,
    flying: false,
    shootsUp: true,
    unitCount: 1,
    rows: 1,
    area: 30 * 30,
  },
};
