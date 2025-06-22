import {Value} from '@sinclair/typebox/value';

import {NrdbCardType, type NrdbCardT} from '@/types.ts';

import {groupBy} from './utils';

import {packsByFormat} from './packs'

import rawCardData from './json/cards.json';

export const IMAGE_URL_TEMPLATE = rawCardData.imageUrlTemplate;
export const getImageUrlForCard = (card: NrdbCardT) => IMAGE_URL_TEMPLATE.replace('{code}', card.code);

export const allCards: NrdbCardT[] = [];
export const cardsByFormat: {[FormatCode in keyof typeof packsByFormat]: NrdbCardT[]} = {
  'standard': [],
  'startup': [],
}

for (const rawCard of rawCardData.data) {
  try {
    const parsedCard = Value.Parse(NrdbCardType, rawCard);
    if (parsedCard) {
      allCards.push(parsedCard);

      if (packsByFormat.standard.includes(parsedCard.pack_code)) {
        cardsByFormat.standard.push(parsedCard);
      }
      if (packsByFormat.startup.includes(parsedCard.pack_code)) {
        cardsByFormat.startup.push(parsedCard);
      }
    }
  } catch (e) {
    console.error(e, rawCard);
  }
}

export class CardStore {
  allSubtypes: Set<string>;
  cardsBySubtype: {[subtype: string]: Set<NrdbCardT>};
  constructor(private cards: NrdbCardT[]) {
    this.cards = cards;

    this.allSubtypes = new Set<string>();
    this.cardsBySubtype = {}

    for (const card of this.cards) {
      if (!card) continue;

      if (card.keywords) {
        const subtypes = card.keywords.split(' - ');
        for (const subtype of subtypes) {
          const set = this.cardsBySubtype[subtype] || new Set();
          set.add(card);
          this.cardsBySubtype[subtype] = set;

          this.allSubtypes.add(subtype);
        }
      }
    }
  }

  getAllCards() {
    return this.cards;
  }
}

export const cardStoreByFormat = {
  'eternal': new CardStore(allCards),
  'standard': new CardStore(cardsByFormat.standard),
  'startup': new CardStore(cardsByFormat.startup),
}

export function getSubtypesForCard(card: NrdbCardT): string[] {
  if (!card.keywords) {
    return [];
  }

  return card.keywords.split(' - ');
}

export const allSubtypes = new Set<string>();
export const cardsBySubtype: {[subtype: string]: Set<NrdbCardT>} = {};

for (const card of allCards) {
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

export const cardsByCost = groupBy(allCards, (item) => String(item.cost || item.advancement_cost));
export const cardsByFactionCode = groupBy(allCards, (item) => item.faction_code);
export const cardsByIllustrator = groupBy(allCards, (item) => item.illustrator);




// get word histogram
export const titleWordCount: Record<string, number> = {};
for (const card of allCards) {
  const words = card.stripped_title.split(/\s+/);

  for (const word of words) {
    const normalized = word.toLowerCase();
    titleWordCount[normalized] ||= 0;
    titleWordCount[normalized] += 1;
  }
}

export const cardsByTitleStartLetter = groupBy(allCards, (card) => card.stripped_title[0].toLowerCase());


