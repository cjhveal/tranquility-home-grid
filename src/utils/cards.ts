import type {NrdbCardT} from '@/game/types';

export function getSubtypesForCard(card: NrdbCardT): string[] {
  if (!card.keywords) {
    return [];
  }

  return card.keywords.split(' - ');
}
