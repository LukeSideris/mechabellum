import { UnitInterface } from './units';

export type ModInterface = {
  name: string;
  id: string;
  description?: string;
  thumbnail: string;
  // hp and attack use different mathematics depending on being positive or negative
  modifyHp?: number;
  modifyAttack?: number;
  // generic modifier to apply to any unit stat. Do not use to modify attack or HP.
  modifier?: (unit: UnitInterface) => UnitInterface;
};
