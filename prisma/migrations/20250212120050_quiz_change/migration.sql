/*
  Warnings:

  - Changed the type of `correctAnswers` on the `MSQ` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "MSQ" DROP COLUMN "correctAnswers",
ADD COLUMN     "correctAnswers" JSONB NOT NULL;
