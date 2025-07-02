import type {NrdbCardT} from '@/types';

export function getSubtypesForCard(card: NrdbCardT): string[] {
  if (!card.keywords) {
    return [];
  }

  return card.keywords.split(' - ');
}
