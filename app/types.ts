export type Gender = 'male' | 'female';

export enum Goals {
  LoseWeight = 'lose_weight',
  MaintainWeight = 'maintain_weight',
  GainWeight = 'gain_weight',
  None = 'none'
}

export interface User {
  email: string;
  username: string;
  password: string;
  current_weight: number;
  target_weight: number;
  height: number;
  age: number;
  gender: Gender;
  goals: Goals;
}

const dummy = {};

export default dummy;