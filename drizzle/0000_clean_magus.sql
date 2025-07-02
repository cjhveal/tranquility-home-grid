CREATE TYPE "public"."col_keys" AS ENUM('A', 'B', 'C');--> statement-breakpoint
CREATE TYPE "public"."row_keys" AS ENUM('1', '2', '3');--> statement-breakpoint
CREATE TABLE "puzzle" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "puzzle_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
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
CREATE TABLE "puzzle_schedule" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "puzzle_schedule_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"date" date,
	"puzzleId" integer,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "puzzle_solution" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "puzzle_solution_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"puzzleId" integer,
	"col" "col_keys",
	"row" "row_keys",
	"card_code" varchar(191)
);
--> statement-breakpoint
ALTER TABLE "puzzle_schedule" ADD CONSTRAINT "puzzle_schedule_puzzleId_puzzle_id_fk" FOREIGN KEY ("puzzleId") REFERENCES "public"."puzzle"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "puzzle_solution" ADD CONSTRAINT "puzzle_solution_puzzleId_puzzle_id_fk" FOREIGN KEY ("puzzleId") REFERENCES "public"."puzzle"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "date_order" ON "puzzle_schedule" USING btree ("date" DESC NULLS LAST);