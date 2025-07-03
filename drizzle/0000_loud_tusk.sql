CREATE TYPE "public"."col_keys" AS ENUM('A', 'B', 'C');--> statement-breakpoint
CREATE TYPE "public"."row_keys" AS ENUM('1', '2', '3');--> statement-breakpoint
CREATE TABLE "solution_answers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "solution_answers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"solutionId" integer NOT NULL,
	"col" "col_keys" NOT NULL,
	"row" "row_keys" NOT NULL,
	"card_code" varchar(191) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "solution_answers_solutionId_col_row_unique" UNIQUE("solutionId","col","row")
);
--> statement-breakpoint
CREATE TABLE "puzzles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "puzzles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"constraint_a" jsonb NOT NULL,
	"constraint_b" jsonb NOT NULL,
	"constraint_c" jsonb NOT NULL,
	"constraint_1" jsonb NOT NULL,
	"constraint_2" jsonb NOT NULL,
	"constraint_3" jsonb NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "puzzle_schedules" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "puzzle_schedules_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"date" date,
	"puzzleId" integer,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "puzzle_solutions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "puzzle_solutions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid(),
	"puzzleId" integer,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "solution_answers" ADD CONSTRAINT "solution_answers_solutionId_puzzle_solutions_id_fk" FOREIGN KEY ("solutionId") REFERENCES "public"."puzzle_solutions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "puzzle_schedules" ADD CONSTRAINT "puzzle_schedules_puzzleId_puzzles_id_fk" FOREIGN KEY ("puzzleId") REFERENCES "public"."puzzles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "puzzle_solutions" ADD CONSTRAINT "puzzle_solutions_puzzleId_puzzles_id_fk" FOREIGN KEY ("puzzleId") REFERENCES "public"."puzzles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "date_order" ON "puzzle_schedules" USING btree ("date" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "uuid_idx" ON "puzzle_solutions" USING btree ("uuid");