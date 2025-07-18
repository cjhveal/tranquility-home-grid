import { 
  PuzzleSpecSchema,
  type TColKey,
  type TRowKey,
  type NrdbCardT,
} from "@/game/types";


import {CardConstraint} from '@/constraints';

export type PuzzleConstraints = {
    "1": CardConstraint,
    "2": CardConstraint,
    "3": CardConstraint,
    "A": CardConstraint,
    "B": CardConstraint,
    "C": CardConstraint,
}

export type IncompletePuzzleConstraints = {
  [K in keyof PuzzleConstraints]: null | CardConstraint
}

export function makeBlankPuzzleConstraints(): IncompletePuzzleConstraints {
  return {
    "1": null,
    "2": null,
    "3": null,
    "A": null,
    "B": null,
    "C": null,
  }
}



export type TPuzzle = {
  date: string,
  constraints: PuzzleConstraints,
}

export const EXAMPLE_PUZZLE_1 = {"id":1,"constraints":{"1":{"kind":"subtype","payload":{"subtypes":["Sentry"]}},"2":{"kind":"subtype","payload":{"subtypes":["Icebreaker"]}},"3":{"kind":"subtype","payload":{"subtypes":["Connection"]}},"A":{"kind":"cost","payload":{"costs":[3]}},"B":{"kind":"titleStart","payload":{"chars":["a"]}},"C":{"kind":"influence","payload":{"costs":[1]}}}};
export const EXAMPLE_PUZZLE_2 = {"id":2,"constraints":{"1":{"kind":"type","payload":{"types":["operation"]}},"2":{"kind":"subtype","payload":{"subtypes":["Transaction"]}},"3":{"kind":"subtype","payload":{"subtypes":["Run"]}},"A":{"kind":"cost","payload":{"costs":[2]}},"B":{"kind":"influence","payload":{"costs":[2]}},"C":{"kind":"faction","payload":{"factions":["criminal","haas-bioroid"]}}}}
export const EXAMPLE_PUZZLE_3 = {"id":1,"constraints":{"1":{"kind":"type","payload":{"types":["asset"]}},"2":{"kind":"subtype","payload":{"subtypes":["Observer"]}},"3":{"kind":"subtype","payload":{"subtypes":["Barrier"]}},"A":{"kind":"influence","payload":{"costs":[2]}},"B":{"kind":"faction","payload":{"factions":["shaper","jinteki"]}},"C":{"kind":"cost","payload":{"costs":[2]}}}}
export const EXAMPLE_PUZZLE_4 = {"id":1,"constraints":{"1":{"kind":"type","payload":{"types":["ice"]}},"2":{"kind":"subtype","payload":{"subtypes":["Icebreaker"]}},"3":{"kind":"subtype","payload":{"subtypes":["Security"]}},"A":{"kind":"influence","payload":{"costs":[0]}},"B":{"kind":"faction","payload":{"factions":["shaper","jinteki"]}},"C":{"kind":"titleStart","payload":{"chars":["o","p"]}}}};
export const EXAMPLE_PUZZLE_5 = {"id":1,"constraints":{"1":{"kind":"subtype","payload":{"subtypes":["Security"]}},"2":{"kind":"subtype","payload":{"subtypes":["Barrier"]}},"3":{"kind":"type","payload":{"types":["upgrade"]}},"A":{"kind":"titleStart","payload":{"chars":["a","b"]}},"B":{"kind":"faction","payload":{"factions":["anarch","jinteki"]}},"C":{"kind":"cost","payload":{"costs":[3]}}}};

export function parsePuzzleSpec(input: unknown): TPuzzle {
  const puzzleSpec = PuzzleSpecSchema.parse(input);

  return {
    date: puzzleSpec.date,
    constraints: {
      "1": CardConstraint.fromSpec(puzzleSpec.constraint1),
      "2": CardConstraint.fromSpec(puzzleSpec.constraint2),
      "3": CardConstraint.fromSpec(puzzleSpec.constraint3),
      "A": CardConstraint.fromSpec(puzzleSpec.constraintA),
      "B": CardConstraint.fromSpec(puzzleSpec.constraintB),
      "C": CardConstraint.fromSpec(puzzleSpec.constraintC),
    }
  }
}

export function makePuzzleSpecFor(puzzle: TPuzzle) {

}

export type TGrid<T> = {
  [C in TColKey]: {
    [R in TRowKey]: T
  }
}

export function makeGrid<T>(fn: (c: TColKey, r: TRowKey) => T): TGrid<T> {
  return {
    "A": {
      "1": fn('A', '1'),
      "2": fn('A', '2'),
      "3": fn('A', '3'),
    },
    "B": {
      "1": fn('B', '1'),
      "2": fn('B', '2'),
      "3": fn('B', '3'),
    },
    "C": {
      "1": fn('C', '1'),
      "2": fn('C', '2'),
      "3": fn('C', '3'),
    },
  }
}

export type TSolution = TGrid<null | NrdbCardT>

export function getBlankSolution(): TSolution {
  const blankSolution: TSolution = makeGrid(() => null);

  return blankSolution;
}



