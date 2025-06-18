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




export type TPuzzle = {
  id: string, 
  constraints: PuzzleConstraints,
}

export const EXAMPLE_PUZZLE_1 = {"id":1,"constraints":{"1":{"kind":"subtype","payload":{"subtypes":["Sentry"]}},"2":{"kind":"subtype","payload":{"subtypes":["Icebreaker"]}},"3":{"kind":"subtype","payload":{"subtypes":["Connection"]}},"A":{"kind":"cost","payload":{"costs":[3]}},"B":{"kind":"titleStart","payload":{"chars":["a"]}},"C":{"kind":"influence","payload":{"costs":[1]}}}};

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
