ALTER TABLE "puzzle_schedules" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "puzzle_schedules" CASCADE;--> statement-breakpoint
ALTER TABLE "solution_answers" DROP CONSTRAINT "solution_answers_solutionId_col_row_unique";--> statement-breakpoint
ALTER TABLE "puzzles" ADD COLUMN "date" date NOT NULL;--> statement-breakpoint
CREATE INDEX "date_order" ON "puzzles" USING btree ("date" DESC NULLS LAST);--> statement-breakpoint
ALTER TABLE "solution_answers" ADD CONSTRAINT "solution_grid_unique" UNIQUE("solutionId","col","row");--> statement-breakpoint
ALTER TABLE "solution_answers" ADD CONSTRAINT "solution_card_unique" UNIQUE("solutionId","card_code");