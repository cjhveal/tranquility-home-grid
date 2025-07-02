import {Type} from '@sinclair/typebox';
import {Value} from '@sinclair/typebox/value';

import {
  type TFormatCode,
  type FormatData,
  type NrdbDataByFormat,
  type NrdbCardT,
  type NrdbPackT,
  NrdbCardType,
  NrdbPackType,
} from '@/types';



const BASE_DATA_URI = `/data/json`

const CARD_DATA_URI = `${BASE_DATA_URI}/cards.json`
const PACK_DATA_URI = `${BASE_DATA_URI}/packs.json`


const CardDataSchema = Type.Object({
  imageUrlTemplate: Type.String(),
  data: Type.Array(NrdbCardType),
});

export async function fetchCards() {
  const res = await fetch(CARD_DATA_URI);

  if (!res.ok) {
    throw new Error('failed to fetch cards');
  }

  const body = await res.json()
  
  if (!body || !Array.isArray(body.data)) {
    throw new Error('malformed card data');
  }

  const parsedResponse = Value.Parse(CardDataSchema, body);

  return parsedResponse.data;
}

export async function fetchPacks() {
  const res = await fetch(PACK_DATA_URI);

  if (!res.ok) {
    throw new Error('failed to fetch packs');
  }

  const body = await res.json()
  
  if (!body || !Array.isArray(body.data)) {
    throw new Error('malformed pack data');
  }

  const allPacks: NrdbPackT[] = [];

  for (const rawPack of body.data) {
    try {
      const parsedPack = Value.Parse(NrdbPackType, rawPack);
      if (parsedPack) {
        allPacks.push(parsedPack);
      }
    } catch (e) {
      console.error(e, rawPack);
    }
  }

  return allPacks;
}
export const cycleCodesByFormat: { [format in TFormatCode]: null | string[] }= {
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
  'eternal': null,
};

function getPacksByFormat(packs: NrdbPackT[], format: TFormatCode): NrdbPackT[] {
  const validCycles = cycleCodesByFormat[format];

  if (!validCycles) {
    return [...packs];
  }

  return packs
    .filter(pack => validCycles.includes(pack.cycle_code))
}


function buildFormatData(packs: NrdbPackT[], cards: NrdbCardT[], format: TFormatCode,): FormatData {
  const formatPacks = getPacksByFormat(packs, format);

  const formatCodes = formatPacks.map(pack => pack.code);

  const formatCards = cards.filter(card => formatCodes.includes(card.pack_code));

  const allSubtypes = new Set<string>();
  const cardsBySubtype: Record<string, Set<NrdbCardT>> = {};

  for (const card of formatCards) {
    if (!card) continue;

    if (card.keywords) {
      const subtypes = card.keywords.split(' - ');
      for (const subtype of subtypes) {
        const set = cardsBySubtype[subtype] || new Set();
        set.add(card);
        cardsBySubtype[subtype] = set;

        allSubtypes.add(subtype);
      }
    }
  }

  return {
    cards: formatCards,
    packs: formatPacks,
    format,
    allSubtypes,
    cardsBySubtype,
  }
}

export async function fetchNrdbData(): Promise<NrdbDataByFormat> {
  const [allPacks, allCards] = await Promise.all([
    fetchPacks(),
    fetchCards(),
  ]);

  
  return {
    eternal: buildFormatData(allPacks, allCards, 'eternal'),
    standard: buildFormatData(allPacks, allCards, 'standard'),
    startup: buildFormatData(allPacks, allCards, 'startup'),
  }
}
