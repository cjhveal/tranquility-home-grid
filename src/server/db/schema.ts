import * as t from "drizzle-orm/pg-core";

import { 
  ConstraintSpecSchema,
  type TConstraintSpec,
} from "@/game/types";

const table = t.pgTable;


const colKeyEnum = t.pgEnum('col_keys', ['A', 'B', 'C']);
const rowKeyEnum = t.pgEnum('row_keys', ['1', '2', '3']);

const timestamps = () => ({
  updatedAt: t.timestamp('updated_at'),
  createdAt: t.timestamp('created_at').defaultNow().notNull(),
  deletedAt: t.timestamp('deleted_at'),
})

const constraintJsonb = t.customType<{data: TConstraintSpec; driverData: string}>({
  dataType() {
    return 'jsonb';
  },

  toDriver(value) {
    return JSON.stringify(value);
  },

  fromDriver(value: string) {
    return ConstraintSpecSchema.parse(value);
  }
})

export const puzzle = table('puzzle', {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(), 

  constraintA: constraintJsonb('constraint_a').notNull(),
  constraintB: constraintJsonb('constraint_b').notNull(),
  constraintC: constraintJsonb('constraint_c').notNull(),
  constraint1: constraintJsonb('constraint_1').notNull(),
  constraint2: constraintJsonb('constraint_2').notNull(),
  constraint3: constraintJsonb('constraint_3').notNull(),

  
  ...timestamps(),
});

export const puzzleSchedule = table('puzzle_schedule', {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),

  date: t.date(),
  puzzleId: t.integer().references(() => puzzle.id),


  ...timestamps(),
});

export const puzzleSolution = table('puzzle_solution', {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),

  puzzleId: t.integer().references(() => puzzle.id),

  col: colKeyEnum(),
  row: rowKeyEnum(),

  cardCode: t.varchar('card_code', {length: 191}),
});
