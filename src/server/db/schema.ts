import * as pg from "drizzle-orm/pg-core";
import {relations, sql} from 'drizzle-orm';

import { 
  ConstraintSpecSchema,
  type TConstraintSpec,
} from "@/game/types";

export const colKeyEnum = pg.pgEnum('col_keys', ['A', 'B', 'C']);
export const rowKeyEnum = pg.pgEnum('row_keys', ['1', '2', '3']);

const timestamps = () => ({
  updatedAt: pg.timestamp('updated_at'),
  createdAt: pg.timestamp('created_at').defaultNow().notNull(),
  deletedAt: pg.timestamp('deleted_at'),
})

const constraintJsonb = pg.customType<{data: TConstraintSpec; driverData: string}>({
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

export const puzzles = pg.pgTable('puzzles', {
  id: pg.integer().primaryKey().generatedAlwaysAsIdentity(), 

  constraintA: constraintJsonb('constraint_a').notNull(),
  constraintB: constraintJsonb('constraint_b').notNull(),
  constraintC: constraintJsonb('constraint_c').notNull(),
  constraint1: constraintJsonb('constraint_1').notNull(),
  constraint2: constraintJsonb('constraint_2').notNull(),
  constraint3: constraintJsonb('constraint_3').notNull(),
  
  ...timestamps(),
});

export const schedules = pg.pgTable('puzzle_schedules', {
  id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),

  date: pg.date(),
  puzzleId: pg.integer().references(() => puzzles.id),


  ...timestamps(),
}, (table) => [
    pg.index('date_order').on(table.date.desc())
  ]
);

export const schedulesRelations = relations(schedules, ({ one }) => ({
  puzzle: one(puzzles),
}));

export const solutions = pg.pgTable('puzzle_solutions', {
  id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),

  uuid: pg.uuid('uuid').default(sql`gen_random_uuid()`),

  puzzleId: pg.integer().references(() => puzzles.id),

  ...timestamps(),
}, (table) => ([
  pg.uniqueIndex('uuid_idx').on(table.uuid),
]));

export const solutionsRelations = relations(solutions, ({ one, many }) => ({
  puzzle: one(puzzles),
  answers: many(answers),
}));

export const answers = pg.pgTable('solution_answers', {
  id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),

  solutionId: pg.integer().references(() => solutions.id, {onDelete: 'cascade'}).notNull(),

  col: colKeyEnum().notNull(),
  row: rowKeyEnum().notNull(),

  cardCode: pg.varchar('card_code', {length: 191}).notNull(),

  ...timestamps(),
}, (table) => [
  pg.unique().on(table.solutionId, table.col, table.row),
]);

export const answersRelations = relations(answers, ({ one }) => ({
  solution: one(solutions),
}));
