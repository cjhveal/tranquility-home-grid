import {Value} from '@sinclair/typebox/value';

import {NrdbCycleType, type NrdbCycleT} from '@/types.ts';

import rawCycleData from './json/cycles.json';

export const allCycles: NrdbCycleT[] = [];

for (const rawCycle of rawCycleData.data) {
  try {
    const parsedCycle = Value.Parse(NrdbCycleType, rawCycle);
    if (parsedCycle) {
      allCycles.push(parsedCycle);
    }
  } catch (e) {
    console.error(e, rawCycle);
  }
}

const ALL_FORMATS = ['standard', 'startup', 'eternal']

export const cycleCodesByFormat: Record<string,string[]> = {
  'standard': [
    'system-gateway',
    'elevation',
    'ashes',
    'borealis',
    'liberation',
  ],
  'startup': [
    'system-gateway',
    'elevation',
    'liberation',
  ],
  // eternal: [...allCycles],
};
