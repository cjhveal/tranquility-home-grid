import { Value } from '@sinclair/typebox/value';
import { 
  PuzzleSpecType,
  type TColKey,
  type TRowKey,
  type NrdbCardT,
} from "@/types";


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
  id: string, 
  constraints: PuzzleConstraints,
}

export const EXAMPLE_PUZZLE_1 = {"id":1,"constraints":{"1":{"kind":"subtype","payload":{"subtypes":["Sentry"]}},"2":{"kind":"subtype","payload":{"subtypes":["Icebreaker"]}},"3":{"kind":"subtype","payload":{"subtypes":["Connection"]}},"A":{"kind":"cost","payload":{"costs":[3]}},"B":{"kind":"titleStart","payload":{"chars":["a"]}},"C":{"kind":"influence","payload":{"costs":[1]}}}};
export const EXAMPLE_PUZZLE_2 = {"id":2,"constraints":{"1":{"kind":"type","payload":{"types":["operation"]}},"2":{"kind":"subtype","payload":{"subtypes":["Transaction"]}},"3":{"kind":"subtype","payload":{"subtypes":["Run"]}},"A":{"kind":"cost","payload":{"costs":[2]}},"B":{"kind":"influence","payload":{"costs":[2]}},"C":{"kind":"faction","payload":{"factions":["criminal","haas-bioroid"]}}}}
export const EXAMPLE_PUZZLE_3 = {"id":1,"constraints":{"1":{"kind":"type","payload":{"types":["asset"]}},"2":{"kind":"subtype","payload":{"subtypes":["Observer"]}},"3":{"kind":"subtype","payload":{"subtypes":["Barrier"]}},"A":{"kind":"influence","payload":{"costs":[2]}},"B":{"kind":"faction","payload":{"factions":["shaper","jinteki"]}},"C":{"kind":"cost","payload":{"costs":[2]}}}}
export const EXAMPLE_PUZZLE_4 = {"id":1,"constraints":{"1":{"kind":"type","payload":{"types":["ice"]}},"2":{"kind":"subtype","payload":{"subtypes":["Icebreaker"]}},"3":{"kind":"subtype","payload":{"subtypes":["Security"]}},"A":{"kind":"influence","payload":{"costs":[0]}},"B":{"kind":"faction","payload":{"factions":["shaper","jinteki"]}},"C":{"kind":"titleStart","payload":{"chars":["o","p"]}}}};

export function parsePuzzleSpec(input: unknown): TPuzzle {
  const puzzleSpec = Value.Parse(PuzzleSpecType, input);

  const constraintSpecs = puzzleSpec.constraints;

  return {
    id: puzzleSpec.id,
    constraints: {
      "1": CardConstraint.fromSpec(constraintSpecs["1"]),
      "2": CardConstraint.fromSpec(constraintSpecs["2"]),
      "3": CardConstraint.fromSpec(constraintSpecs["3"]),
      "A": CardConstraint.fromSpec(constraintSpecs["A"]),
      "B": CardConstraint.fromSpec(constraintSpecs["B"]),
      "C": CardConstraint.fromSpec(constraintSpecs["C"]),
    }
  }
}


export type TSolution = {
  [C in TColKey]: {
    [R in TRowKey]: null | NrdbCardT;
  }
}

export function getBlankSolution(): TSolution {
  return {
    "A": {
      "1": null,
      "2": null,
      "3": null,
    },
    "B": {
      "1": null,
      "2": null,
      "3": null,
    },
    "C": {
      "1": null,
      "2": null,
      "3": null,
    },
  }
}



