import * as z from 'zod/v4-mini';


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

export const NrdbCardSchema = z.object({
  advancement_cost: z.nullish(z.number()),
  agenda_points: z.optional(z.number()),
  base_link: z.optional(z.number()),
  code: z.string(),
  cost: z.nullish(z.number()),
  deck_limit: z.number(),
  faction_code: z.literal(allFactionCodes),
  faction_cost: z.number(),
  flavor: z.optional(z.string()),
  illustrator: z.optional(z.string()),
  influence_limit: z.nullish(z.number()),
  keywords: z.optional(z.string()),
  memory_cost: z.optional(z.number()),
  minimum_deck_size: z.nullish(z.number()),
  pack_code: z.string(),
  position: z.number(),
  side_code: z.literal(allSideCodes),
  strength: z.nullish(z.number()),
  text: z.optional(z.string()),
  title: z.string(),
  trash_cost: z.optional(z.number()),
  stripped_text: z.optional(z.string()),
  stripped_title: z.string(),
  type_code: z.literal(allTypeCodes),
  uniqueness: z.boolean(),
});

export type NrdbCardT = z.infer<typeof NrdbCardSchema>;



export const NrdbCycleSchema = z.object({
  code: z.string(),
  name: z.string(),
  position: z.string(),
  size: z.number(),
  rotated: z.boolean(),
});

export type NrdbCycleT = z.infer<typeof NrdbCycleSchema>;

export const NrdbPackSchema = z.object({
  code: z.string(),
  cycle_code: z.string(),
  date_release: z.string(),
  name: z.string(),
  position: z.number(),
  size: z.number(),
  ffg_id: z.nullable(z.number()),
});

export type NrdbPackT = z.infer<typeof NrdbPackSchema>;

export const allFormatCodes = [
  'eternal',
  'standard',
  'startup',
] as const;

export type TFormatCode = typeof allFormatCodes[number];

export interface FormatData {
  cards: NrdbCardT[];
  packs: NrdbPackT[];
  format: TFormatCode;
  allSubtypes: Set<string>;
  cardsBySubtype: {[subtype: string]: Set<NrdbCardT>};
}

export type NrdbDataByFormat = {
  [F in TFormatCode]: FormatData
}

export const ConstraintSpecSchema = z.union([
  z.object({
    kind: z.literal('titleStart'),
    payload: z.object({
      chars: z.array(z.string())
    }),
  }),
  z.object({
    kind: z.literal('titleIncludes'),
    payload: z.object({
      parts: z.array(z.string())
    }),
  }),
  z.object({
    kind: z.literal('cost'),
    payload: z.object({
      costs: z.array(z.number())
    }),
  }),
  z.object({
    kind: z.literal('faction'),
    payload: z.object({
      factions: z.array(z.literal(allFactionCodes))
    }),
  }),
  z.object({
    kind: z.literal('illustrator'),
    payload: z.object({
      illustrators: z.array(z.string())
    }),
  }),
  z.object({
    kind: z.literal('uniqueness'),
    payload: z.object({
      unique: z.boolean(),
    }),
  }),
  z.object({
    kind: z.literal('type'),
    payload: z.object({
      types: z.array(z.string())
    }),
  }),
  z.object({
    kind: z.literal('subtype'),
    payload: z.object({
      subtypes: z.array(z.string())
    }),
  }),
  z.object({
    kind: z.literal('influence'),
    payload: z.object({
      costs: z.array(z.number())
    }),
  }),
]);

export type TConstraintSpec = z.infer<typeof ConstraintSpecSchema>;

export type TConstraintKind = TConstraintSpec['kind'];

export type PayloadOf<K extends TConstraintKind> = Extract<
  TConstraintSpec,
  { kind: K }
>['payload'];

export type TConstraintSpecByKind = {
  [K in TConstraintKind]: { kind: K, payload: PayloadOf<K>};
}

export const PuzzleSpecSchema = z.object({
  id: z.string(),
  date: z.iso.date(),
  constraints: z.object({
    "A": ConstraintSpecSchema,
    "B": ConstraintSpecSchema,
    "C": ConstraintSpecSchema,
    "1": ConstraintSpecSchema,
    "2": ConstraintSpecSchema,
    "3": ConstraintSpecSchema,
  
  }),
});

export type TPuzzleSpec = z.infer<typeof PuzzleSpecSchema>

export type TConstraintKey = keyof TPuzzleSpec['constraints']

export type TRowKey = "1" | "2" | "3";
export type TColKey = "A" | "B" | "C";

