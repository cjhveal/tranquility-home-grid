/**
 * Generation Algorithm:
 *
 * Pick row constraints: 1 type constraint 1 large subtype constraint and 1 specific subtype constraint
 * optionally Filter out candidates from later choices if they match the type of previous step
 * Ex. If type constraint is Event, don't allow Run events, if Subtype is Icebreaker don't pick
 *
 * Next pick some column constraint categories: Cost, Influence, Faction, Title Start
 * Generate cartesian product of factions / title start bigrams
 * Compute the count of cards in each col/row intersection for each constraint candidate
 * Sort candidate constraints by minimum count against the 3 row constraints.
 * Filter out all those below a certain threshhold.
 * Pick a random constraint from the candidates and assign it to a col. (potentially weight it towards highest count?)
 * Ensure a valid grid remains by the rules below. If not, remove selection and try again.
 * Remove all candidate constraints of the same kind as the selected one.
 * Repeat the process for the remaining columns
 *
 * Optional: Finally check the chosen constraints have been used in a previous grid, even in a different order.
 *
 * A valid grid must have
 *  - At least 1 valid candidate per intersection
 *  - At least 3 valid candidates per row and column
 *  - At least 9 valid candidates across the entire grid
 *
 */

import { 
  allTypeCodes,
  allFactionCodes,
  mainRunnerFactionCodes,
  mainCorpFactionCodes,
} from '@/types';
import type {
  NrdbCardT,
  TColKey,
  TRowKey,
  TFactionCode,
} from '@/types';

import {
  CardConstraint,
  TitleStartConstraint,
  TitleIncludesConstraint,
  CostConstraint,
  FactionConstraint,
  IllustratorConstraint,
  UniqueConstraint,
  TypeConstraint,
  SubtypeConstraint,
  InfluenceConstraint,
} from '@/constraints';

import { 
  type IncompletePuzzleConstraints,
  makeBlankPuzzleConstraints,
} from "@/puzzle";

import {
  CardStore
} from '@/data/cards';


const COSTS = [0,1,2,3,4,5];
const ALPHABET = Array.from({ length: 26}, (v, n) => String.fromCharCode(n + 97));
const TITLE_WORDS = ["data", "net", "grid", "project", "wall", "campaign", "job", "test", "1", "2", "3"]
const INFLUENCE_COUNTS = [0,1,2,3,4,5];

/*
const allConstraints = [
  ...[...allSubtypes.values()].map(subtype => new SubtypeConstraint({subtypes: [subtype]})),
  ...TITLE_WORDS.map(word => new TitleIncludesConstraint({parts: [word]})),
];*/

export function makeAllCostConstraints() {
  return COSTS.map(cost => new CostConstraint({costs : [cost]}));
}

export function makeAllTitleStartConstraints() {
  return ALPHABET.map(char => new TitleStartConstraint({chars: [char]}));
}

export function makeAllInfluenceConstraints() {
  return INFLUENCE_COUNTS.map(inf => new InfluenceConstraint({costs: [inf]}));
}

export function makeAllFactionConstraints() {
  const constraints: FactionConstraint[] = [];
  for (const runnerCode of mainRunnerFactionCodes) {
    for (const corpCode of mainCorpFactionCodes) {
      constraints.push(new FactionConstraint({factions: [runnerCode, corpCode]}));
    }
  }

  return constraints;
}

export function makeAllColConstraintCandidates() {
  
}

export function makeAllTypeConstraints() {
  return allTypeCodes.map(t => new TypeConstraint({ types: [t]}));
}

export function makeAllRowConstraintCandidates() {
   
}

const generatorByKind: {[kind: string]: () => CardConstraint[]} = {
  'cost': makeAllCostConstraints,
  'faction': makeAllFactionConstraints,
  'influence': makeAllInfluenceConstraints,
  'titleStart': makeAllTitleStartConstraints,
}


class PuzzleValidator {
  cards: NrdbCardT[];
  constraints: IncompletePuzzleConstraints;

  constructor(cards: NrdbCardT[], constraints: IncompletePuzzleConstraints = makeBlankPuzzleConstraints()) {
    this.cards = cards;
    this.constraints = constraints;
  }
  
  intersectConstraint(col: TColKey, row: TRowKey) {
    const colConstraint = this.constraints[col];
    const rowConstraint = this.constraints[row];

    if (colConstraint && rowConstraint) {
      return (cards: NrdbCardT[]) => {
        return rowConstraint.filter(colConstraint.filter(cards));
      }
    } else if (colConstraint) {
      return (cards: NrdbCardT[]) => colConstraint.filter(cards);
    } else if (rowConstraint) {
      return (cards: NrdbCardT[]) => rowConstraint.filter(cards);
    } else {
      return () => this.cards;
    }
  }

  intersectRow(row: TRowKey): Array<NrdbCardT[]> {
    const colKeys = ["A", "B", "C"] as const;

    const sets = [];
    for (const col of colKeys) {
      const filterCards = this.intersectConstraint(col, row);

      sets.push(filterCards(this.cards));
    }
    
    return sets;
  }

  intersectCol(col: TColKey): Array<NrdbCardT[]> {
    const rowKeys = ["1", "2", "3"] as const;

    const sets = [];
    for (const row of rowKeys) {
      const filterCards = this.intersectConstraint(col, row);

      sets.push(filterCards(this.cards));
    }

    return sets;
  }

  intersectGrid(): Array<NrdbCardT[]> {
    const colKeys = ["A", "B", "C"] as const;
    const rowKeys = ["1", "2", "3"] as const;


    const sets = [];
    for (const col of colKeys) {
      for (const row of rowKeys) {
        const filterCards = this.intersectConstraint(col, row);

        sets.push(filterCards(this.cards));
      }
    }

    return sets;
  }


  validateGrid() {
    const colKeys = ["A", "B", "C"] as const;
    const rowKeys = ["1", "2", "3"] as const;

    for (const col of colKeys) {
      const sets = this.intersectCol(col).map(cards => new Set(cards));
      const merged = new Set(...sets);
      if (merged.size < 3) {
        return false;
      }
    }

    for (const row of rowKeys) {
      const sets = this.intersectRow(row).map(cards => new Set(cards));
      const merged = new Set(...sets);
      if (merged.size < 3) {
        return false;
      }
    }

    const sets = this.intersectGrid().map(cards => new Set(cards));
    const merged = new Set(...sets);
    if (merged.size < 9) {
      return false;
    }

    return true;
  }

  setConstraint(key: TColKey | TRowKey, constraint: CardConstraint) {
    this.constraints[key] = constraint;
  }
}

function randomInt(n: number): number {
  return Math.floor(Math.random()*n);
}

function sample<T>(list: T[]): T {
  return list[randomInt(list.length)];
}

function choose<T>(n: number, list: T[]): T[] {
  const candidates: T[] = [...list];
  const chosen: T[] = [];

  if (n >= candidates.length) {
    return candidates;
  }

  for (let i = 0; i < n; i++) {
    const j = randomInt(candidates.length);
    chosen.push(candidates[j]);
    candidates.splice(j, 1);
  }

  return chosen;
}

function shuffle<T>(list: T[]): T[] {
  const next = [...list];
  for (let i = next.length - 1; i >= 1; i--) {
    const j = randomInt(i+1);
    console.log(i, j)
    const tmp = next[j];
    next[j] = next[i];
    next[i] = tmp;
  }

  return next;
}

const SUBTYPE_GROUP_SIZE_THRESHOLD = 9;
const ROW_SIZE_THRESHOLD = 6;
const INTERSECTION_SIZE_THRESHOLD = 3;


function generateColumnConstraint(col: TColKey, puzzle: PuzzleValidator, constraints: CardConstraint[]) {
  const rowItems = puzzle.intersectCol(col);

  const rowIntersections = constraints.map(constraint => {
    return rowItems.map(cards => constraint.filter(cards));
  });

  
  const filteredConstraints = constraints.filter((constraint, i) => {
    const row = rowIntersections[i];

    const sets = row.map(items => new Set(items))

    if (sets.some(set => set.size < INTERSECTION_SIZE_THRESHOLD)) {
      return false;
    }
    
    const set = new Set(...sets)

    return set.size >= ROW_SIZE_THRESHOLD;
  });

  return sample(filteredConstraints);
}

const COL_CONSTRAINT_KINDS = ['cost', 'influence', 'titleStart', 'faction'];
function generateAllColumnConstraints(puzzle: PuzzleValidator) {
  const cols = ["A", "B", "C"] as const;
  const constraintKinds = choose(3, COL_CONSTRAINT_KINDS);
  
  const allConstraints = constraintKinds.map(kind => {
    const generator = generatorByKind[kind]

    if (generator) {
      return generator();
    } else {
      return makeAllTitleStartConstraints();
    }
  });

  for (const [i, col] of cols.entries()) {
    console.log(constraintKinds[i]);
    const constraint = generateColumnConstraint(col, puzzle, allConstraints[i]);
    puzzle.setConstraint(col, constraint);
  }
}

export function generatePuzzle(store: CardStore) {
  const cards = store.getAllCards();
  const puzzle = new PuzzleValidator(cards);
  

  const typeConstraints = makeAllTypeConstraints();
  const chosenTypeConstraint = sample(typeConstraints);

  puzzle.setConstraint("1", chosenTypeConstraint);


  const subTypeGroups = []
  for (const [subtype, subtypeSet] of Object.entries(store.cardsBySubtype)) {
    subTypeGroups.push({subtype, set: subtypeSet});
  }

  subTypeGroups.sort((a, b) => {
    return b.set.size - a.set.size
  });

  const filteredSubtypes = subTypeGroups.filter(group => {
    return group.set.size >= SUBTYPE_GROUP_SIZE_THRESHOLD;
  });

  const firstSubtypeGroup = sample(filteredSubtypes);
  const secondSubtypeGroup = sample(filteredSubtypes);

  puzzle.setConstraint("2", new SubtypeConstraint({subtypes: [firstSubtypeGroup.subtype]}));
  puzzle.setConstraint("3", new SubtypeConstraint({subtypes: [secondSubtypeGroup.subtype]}));


  generateAllColumnConstraints(puzzle);
  

  console.log(puzzle.constraints);

  return puzzle;
}


