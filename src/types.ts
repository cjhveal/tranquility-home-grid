import {Type, type Static} from '@sinclair/typebox';

export enum SideCode {
  Corp = "corp",
  Runner = "runner",
}

export enum TypeCode {
  Agenda = "agenda",
  Asset = "asset",
  Event = "event",
  Hardware = "hardware",
  Ice = "ice",
  Identity = "identity",
  Operation = "operation",
  Program = "program",
  Resource = "resource",
  Upgrade = "upgrade",
}

export enum FactionCode {
  Adam = "adam",
  Anarch = "anarch",
  Apex = "apex",
  Criminal = "criminal",
  HB = "haas-bioroid",
  Jinteki = "jinteki",
  NBN = "nbn",
  NeutralCorp = "neutral-corp",
  NeutralRunner = "neutral-runner",
  Shaper = "shaper",
  Sunny = "sunny-lebeau",
  Weyland = "weyland-consortium",
}

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
  faction_code: Type.Enum(FactionCode),
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
  side_code: Type.Enum(SideCode),
  strength: Type.Optional(Type.Union([
    Type.Number(),
    Type.Null(),
  ])),
  text: Type.Optional(Type.String()),
  title: Type.String(),
  trash_cost: Type.Optional(Type.Number()),
  stripped_text: Type.Optional(Type.String()),
  stripped_title: Type.String(),
  type_code: Type.Enum(TypeCode), 
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
      factions: Type.Array(Type.String()),
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

