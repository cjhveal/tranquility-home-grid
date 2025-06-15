import {type NrdbCardT} from '@/types';

import {cardsBySubtype} from '@/data/cards';

type InfoText = {
  name: string,
  detail?: string,
  invalid?: string,
}

export class CardConstraint {
  predicate: (card: NrdbCardT) => boolean;
  infoText: InfoText;

  constructor(infoText: InfoText, predicate: (card: NrdbCardT) => boolean) {
    this.infoText = infoText;
    this.predicate = predicate;
  }

  filter(cards: NrdbCardT[]): NrdbCardT[] {
    return cards.filter(this.predicate);
  }

  
  static and(infoText: InfoText, ...items: CardConstraint[]) {
    const nextPredicate = (card: NrdbCardT) => {
      return items.every(constraint => constraint.predicate(card));
    }

    return new CardConstraint(infoText, nextPredicate);
  }
  static or(infoText: InfoText, ...items: CardConstraint[]) {
    const nextPredicate = (card: NrdbCardT) => {
      return items.some(constraint => constraint.predicate(card));
    }

    return new CardConstraint(infoText, nextPredicate);
  }
}



/***************
 * Constraints *
 **************/

export class TitleStartConstraint extends CardConstraint {
  constructor(char: string) {
    const pred = (card: NrdbCardT) => char === card.stripped_title.toLowerCase()[0];

    super({name: `Starts with ${char}`}, pred)
  }
}

export class TitleIncludesConstraint extends CardConstraint {
  constructor(substr: string) {
    const pred = (card: NrdbCardT) => card.stripped_title.toLowerCase().includes(substr);

    super({name: `Title includes "${substr}"`}, pred)
  }
}

export class CostConstraint extends CardConstraint {
  constructor(value: number) {
    const pred = (card: NrdbCardT) => value === card.cost || value === card.advancement_cost;

    super({name: `Cost ${value}`}, pred);
  }
}

export class FactionConstraint extends CardConstraint {
  constructor(factionCode: string) {
    const pred = (card: NrdbCardT) => factionCode === card.faction_code;
    super({name: `Faction: ${factionCode}`}, pred);
  }
}

export class IllustratorConstraint extends CardConstraint {
  constructor(illustrator: string) {
    const pred = (card: NrdbCardT) => illustrator === card.illustrator;
    super({name: `Illustrated by ${illustrator}`}, pred);
  }
}

export class UniqueConstraint extends CardConstraint {
  constructor(unique:boolean = true) {
    const pred = (card: NrdbCardT)  => unique === card.uniqueness;
    super({name: unique ? 'Unique' : 'Not unique'}, pred);
  }
}

export class SubtypeConstraint extends CardConstraint {
  constructor(subtype: string) {
    const pred = (card: NrdbCardT)  => cardsBySubtype[subtype] && cardsBySubtype[subtype].has(card);
    super({name: subtype}, pred);
  }
}

export class InfluenceConstraint extends CardConstraint {
  constructor(influence: number) {
    const pred = (card: NrdbCardT)  => influence === card.faction_cost;
    super({name: `${influence} influence`}, pred);

  }
}
