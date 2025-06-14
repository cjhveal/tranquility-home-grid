import {Value} from '@sinclair/typebox/value';

import {NrdbPackType, type NrdbPackT} from '@/types.ts';

import {groupBy} from './utils';
import {cycleCodesByFormat} from './cycles';

import rawPackData from './json/cycles.json';

export const allPacks: NrdbPackT[] = [];

for (const rawPack of rawPackData.data) {
  try {
    const parsedPack = Value.Parse(NrdbPackType, rawPack);
    if (parsedPack) {
      allPacks.push(parsedPack);
    }
  } catch (e) {
    console.error(e, rawPack);
  }
}

export const packsByCycle = groupBy(allPacks, pack => pack.cycle_code);

function getPacksByFormat(format: string): NrdbPackT[] {
  const validCycles = cycleCodesByFormat[format];

  return allPacks.filter(pack => validCycles.includes(pack.cycle_code))
}
export const packsByFormat = {
  'standard': getPacksByFormat,
  'startup': [],
  'eternal': [...allPacks],
};
