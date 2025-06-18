import type { NrdbCardT, TConstraintKind, TConstraintSpecByKind, PayloadOf } from '@/types';
import { getSubtypesForCard } from '@/data/cards';

export abstract class CardConstraint<K extends TConstraintKind = TConstraintKind> {
  kind: K;
  payload: PayloadOf<K>;

  constructor(kind: K, payload: PayloadOf<K>) {
    this.kind = kind;
    this.payload = payload;
  }

  static fromSpec<K extends TConstraintKind>(spec: TConstraintSpecByKind[K]) {
    return new CONSTRAINT_MAP[spec.kind](spec.payload);
  }

  abstract predicate(card: NrdbCardT): boolean;
  abstract getName(): string;
  abstract validate(card: NrdbCardT): undefined | string[]

  toSpec() {
    return {
      kind: this.kind,
      payload: {...this.payload},
    }
  }

  filter(cards: NrdbCardT[]): NrdbCardT[] {
    return cards.filter(card => this.predicate(card))
  }
}


export class TitleStartConstraint extends CardConstraint<'titleStart'> {
  constructor(payload: {chars: string[]}) {
    super('titleStart', payload);
  }

  predicate(card: NrdbCardT) {
    const {chars} = this.payload;

    return chars.some(char => char.toLowerCase() === card.stripped_title[0].toLowerCase());
  }

  getName() {
    const {chars} = this.payload;

    return `Starts with ${chars.join(', ')}`;
  }

  validate(card: NrdbCardT): undefined | string[] {
    if (!this.predicate(card)) {
      const {chars} = this.payload;
      return [`does not begin with ${chars.join(', ')}`]
    }
  }
}

export class TitleIncludesConstraint extends CardConstraint<'titleIncludes'> {
  constructor(payload: {parts: string[]}) {
    super('titleIncludes', payload);
  }

  predicate(card: NrdbCardT) {
    const {parts} = this.payload;

    return parts.some(part => card.stripped_title.toLowerCase().includes(part.toLowerCase()));
  }

  getName() {
    const {parts} = this.payload;

    return `Starts with ${parts.join(', ')}`;
  }

  validate(card: NrdbCardT): undefined | string[] {
    if (!this.predicate(card)) {
      const {parts} = this.payload;
      return [`does not include ${parts.join(', ')}`]
    }
  }
}

export class CostConstraint extends CardConstraint<'cost'> {
  constructor(payload: PayloadOf<'cost'>) {
    super('cost', payload);
  }

  predicate(card: NrdbCardT) {
    const {costs} = this.payload;

    return costs.some(cost => cost === card.cost || cost === card.advancement_cost);
  }

  getName() {
    const {costs} = this.payload;

    return `Cost ${costs.join(', ')}`;
  }

  validate(card: NrdbCardT): undefined | string[] {
    if (!this.predicate(card)) {
      const { costs } = this.payload;
      return [`does not have rez/play/install/advancement cost of ${costs.join(', ')}`]
    }
  }
}

export class FactionConstraint extends CardConstraint<'faction'> {
  constructor(payload: PayloadOf<'faction'>) {
    super('faction', payload);
  }

  predicate(card: NrdbCardT) {
    const {factions} = this.payload;

    return factions.some(faction => faction === card.faction_code);
  }

  getName() {
    const {factions} = this.payload;

    return `${factions.join(', ')}`;
  }

  validate(card: NrdbCardT): undefined | string[] {
    if (!this.predicate(card)) {
      const { factions } = this.payload;
      return [`does not have faction of ${factions.join(', ')}`]
    }
  }
}

export class IllustratorConstraint extends CardConstraint<'illustrator'> {
  constructor(payload: PayloadOf<'illustrator'>) {
    super('illustrator', payload);
  }

  predicate(card: NrdbCardT) {
    const {illustrators} = this.payload;

    return illustrators.some(illustrator => illustrator === card.illustrator);
  }

  getName() {
    const {illustrators} = this.payload;

    return `${illustrators.join(', ')}`;
  }

  validate(card: NrdbCardT): undefined | string[] {
    if (!this.predicate(card)) {
      const { illustrators } = this.payload;
      return [`does not have faction of ${illustrators.join(', ')}`]
    }
  }
}

export class UniqueConstraint extends CardConstraint<'uniqueness'> {
  constructor(payload: PayloadOf<'uniqueness'>) {
    super('uniqueness', payload);
  }

  predicate(card: NrdbCardT) {
    const {unique} = this.payload;

    return unique === card.uniqueness;
  }

  getName() {
    const {unique} = this.payload;

    return unique ? 'Unique' : 'Not unique';
  }

  validate(card: NrdbCardT): undefined | string[] {
    if (!this.predicate(card)) {
      const { unique } = this.payload;
      return [unique ? 'is not unique' : 'is unique']
    }
  }
}

export class TypeConstraint extends CardConstraint<'type'> {
  constructor(payload: PayloadOf<'type'>) {
    super('type', payload);
  }

  predicate(card: NrdbCardT) {
    const {types} = this.payload;

    return types.some(t => t === card.type_code)
  }

  getName() {
    const {types} = this.payload;

    return types.map(t => t[0].toUpperCase() + t.slice(1)).join(', ');
  }

  validate(card: NrdbCardT): undefined | string[] {
    if (!this.predicate(card)) {
      const { types } = this.payload;
      return [`does not have type of ${types.join(', ')}`]
    }
  }
}

export class SubtypeConstraint extends CardConstraint<'subtype'> {
  constructor(payload: PayloadOf<'subtype'>) {
    super('subtype', payload);
  }

  predicate(card: NrdbCardT) {
    const {subtypes} = this.payload;
    const cardSubtypes = getSubtypesForCard(card);

    return subtypes.some(subtype => cardSubtypes.includes(subtype))
  }

  getName() {
    const {subtypes} = this.payload;

    return subtypes.join(', ');
  }

  validate(card: NrdbCardT): undefined | string[] {
    if (!this.predicate(card)) {
      const { subtypes } = this.payload;
      return [`does not have subtype of ${subtypes.join(', ')}`]
    }
  }
}

export class InfluenceConstraint extends CardConstraint<'influence'> {
  constructor(payload: PayloadOf<'influence'>) {
    super('influence', payload);
  }

  predicate(card: NrdbCardT) {
    const {costs} = this.payload;

    return costs.some(cost => cost === card.faction_cost);
  }

  getName() {
    const {costs} = this.payload;

    return `Influence ${costs.join(', ')}`;
  }

  validate(card: NrdbCardT): undefined | string[] {
    if (!this.predicate(card)) {
      const { costs } = this.payload;
      return [`does not have influence cost of ${costs.join(', ')}`]
    }
  }
}

const CONSTRAINT_MAP: {[K in TConstraintKind]: new (p: PayloadOf<K>) => CardConstraint<K>} = {
  titleStart: TitleStartConstraint,
  titleIncludes: TitleIncludesConstraint,
  cost: CostConstraint,
  faction: FactionConstraint,
  illustrator: IllustratorConstraint,
  uniqueness: UniqueConstraint,
  type: TypeConstraint,
  subtype: SubtypeConstraint,
  influence: InfluenceConstraint,
};
