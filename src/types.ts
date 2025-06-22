import {Type, type Static} from '@sinclair/typebox';

export const allSideCodes = [
  "corp",
  "runner",
] as const;

export type TSideCode = typeof allSideCodes[number];

export const allTypeCodes = [
  "agenda",
  "asset",
  "event",
  "hardware",
  "ice",
  "identity",
  "operation",
  "program",
  "resource",
  "upgrade",
] as const;

export type TTypeCode = typeof allTypeCodes[number];

export const allFactionCodes = [
  "adam",
  "anarch",
  "apex",
  "criminal",
  "haas-bioroid",
  "jinteki",
  "nbn",
  "neutral-corp",
  "neutral-runner",
  "shaper",
  "sunny-lebeau",
  "weyland-consortium",
] as const;

export type TFactionCode = typeof allFactionCodes[number];

export const allMiniFactionCodes: TFactionCode[] = [
  "adam",
  "apex",
  "sunny-lebeau",
] as const;

export const allNeutralFactionCodes = [
  "neutral-corp",
  "neutral-runner",
] as const;

export const mainRunnerFactionCodes = [
  "anarch",
  "criminal",
  "shaper",
] as const;

export const allRunnerFactionCodes = [
  "anarch",
  "criminal",
  "shaper",
  "neutral-runner",
  ...allMiniFactionCodes,
] as const;

export const mainCorpFactionCodes = [
  "haas-bioroid",
  "jinteki",
  "nbn",
  "weyland-consortium",
] as const;

export const allCorpFactionCodes = [
  "haas-bioroid",
  "jinteki",
  "nbn",
  "neutral-corp",
  "weyland-consortium",
] as const;

export const factionCodeToName: {[K in TFactionCode]: string} = Object.freeze({
  "adam": "Adam",
  "anarch": "Anarch",
  "apex": "Apex",
  "criminal": "Criminal",
  "haas-bioroid": "HB",
  "jinteki": "Jinteki",
  "nbn": "NBN",
  "neutral-corp": "NeutralCorp",
  "neutral-runner": "NeutralRunner",
  "shaper": "Shaper",
  "sunny-lebeau": "Sunny",
  "weyland-consortium": "Weyland",
});


/*
{
  "code": "00005",
  "deck_limit": 1,
  "faction_code": "neutral-corp",
  "faction_cost": 0,
  "flavor": "The Past is the Future.",
  "illustrator": "Sławomir Maniak",
  "influence_limit": null,
  "keywords": "Megacorp",
  "minimum_deck_size": 30,
  "pack_code": "draft",
  "position": 5,
  "quantity": 1,
  "side_code": "corp",
  "stripped_text": "Draft format only. You can use agendas from all factions in this deck.",
  "stripped_title": "The Shadow: Pulling the Strings",
  "text": "Draft format only.\nYou can use agendas from all factions in this deck.",
  "title": "The Shadow: Pulling the Strings",
  "type_code": "identity",
  "uniqueness": false
}*/

export const FactionCodeType = Type.Union(
  allFactionCodes.map(code => Type.Literal(code)),
);


export const NrdbCardType = Type.Object({
  advancement_cost: Type.Optional(Type.Union([
    Type.Number(),
    Type.Null(),
  ])),
  agenda_points: Type.Optional(Type.Number()),
  base_link: Type.Optional(Type.Number()),
  code: Type.String(),
  cost: Type.Optional(Type.Union([
    Type.Number(),
    Type.Null(),
  ])),
  deck_limit: Type.Number(),
  faction_code: FactionCodeType,
  faction_cost: Type.Number(),
  flavor: Type.Optional(Type.String()),
  illustrator: Type.Optional(Type.String()),
  influence_limit: Type.Optional(Type.Union([
    Type.Number(),
    Type.Null(),
  ])),
  keywords: Type.Optional(Type.String()),
  memory_cost: Type.Optional(Type.Number()),
  minimum_deck_size: Type.Optional(Type.Union([
    Type.Number(),
    Type.Null(),
  ])),
  // potentially pull statically from packs.json
  pack_code: Type.String(),
  position: Type.Number(),
  side_code: Type.Union(
    allSideCodes.map(code => Type.Literal(code)),
  ),
  strength: Type.Optional(Type.Union([
    Type.Number(),
    Type.Null(),
  ])),
  text: Type.Optional(Type.String()),
  title: Type.String(),
  trash_cost: Type.Optional(Type.Number()),
  stripped_text: Type.Optional(Type.String()),
  stripped_title: Type.String(),
  type_code: Type.Union(
    allTypeCodes.map(code => Type.Literal(code))
  ),
  uniqueness: Type.Boolean(),
});

export type NrdbCardT = Static<typeof NrdbCardType>;


export const NrdbCycleType = Type.Object({
  code: Type.String(),
  name: Type.String(),
  position: Type.Number(),
  size: Type.Number(),
  rotated: Type.Boolean(),
});

export type NrdbCycleT = Static<typeof NrdbCycleType>;

export const NrdbPackType = Type.Object({
  code: Type.String(),
  cycle_code: Type.String(),
  date_release: Type.String(),
  name: Type.String(),
  position: Type.Number(),
  size: Type.Number(),
  ffg_id: Type.Union([
    Type.Number(),
    Type.Null(),
  ]),
});

export type NrdbPackT = Static<typeof NrdbPackType>;


export const ConstraintSpecType = Type.Union([
  Type.Object({
    kind: Type.Literal('titleStart'),
    payload: Type.Object({
      chars: Type.Array(Type.String()),
    })
  }),
  Type.Object({
    kind: Type.Literal('titleIncludes'),
    payload: Type.Object({
      parts: Type.Array(Type.String()),
    })
  }),
  Type.Object({
    kind: Type.Literal('cost'),
    payload: Type.Object({
      costs: Type.Array(Type.Number()),
    })
  }),
  Type.Object({
    kind: Type.Literal('faction'),
    payload: Type.Object({
      factions: Type.Array(FactionCodeType),
    })
  }),
  Type.Object({
    kind: Type.Literal('illustrator'),
    payload: Type.Object({
      illustrators: Type.Array(Type.String()),
    })
  }),
  Type.Object({
    kind: Type.Literal('uniqueness'),
    payload: Type.Object({
      unique: Type.Boolean(),
    })
  }),
  Type.Object({
    kind: Type.Literal('type'),
    payload: Type.Object({
      types: Type.Array(Type.String()),
    })
  }),
  Type.Object({
    kind: Type.Literal('subtype'),
    payload: Type.Object({
      subtypes: Type.Array(Type.String()),
    })
  }),
  Type.Object({
    kind: Type.Literal('influence'),
    payload: Type.Object({
      costs: Type.Array(Type.Number()),
    })
  }),
]);


export type TConstraintSpec = Static<typeof ConstraintSpecType>;

export type TConstraintKind = TConstraintSpec['kind'];

export type PayloadOf<K extends TConstraintKind> = Extract<
  TConstraintSpec,
  { kind: K }
>['payload'];

export type TConstraintSpecByKind = {
  [K in TConstraintKind]: { kind: K, payload: PayloadOf<K>};
}

export const PuzzleSpecType = Type.Object({
  id: Type.String(),
  constraints: Type.Object({
    "A": ConstraintSpecType,
    "B": ConstraintSpecType,
    "C": ConstraintSpecType,
    "1": ConstraintSpecType,
    "2": ConstraintSpecType,
    "3": ConstraintSpecType,
  }),
});


export type TPuzzleSpec = Static<typeof PuzzleSpecType>

export type TConstraintKey = keyof TPuzzleSpec['constraints']

export type TRowKey = "1" | "2" | "3";
export type TColKey = "A" | "B" | "C";

