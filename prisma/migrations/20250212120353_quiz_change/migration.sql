/*
  Warnings:

  - The `correctAnswers` column on the `MSQ` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "MSQ" DROP COLUMN "correctAnswers",
ADD COLUMN     "correctAnswers" TEXT[];
