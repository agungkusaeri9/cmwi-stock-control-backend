/*
  Warnings:

  - You are about to drop the `purchasesummary` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `balance_after` to the `stock_ins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `balance_before` to the `stock_ins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `balance_after` to the `stock_outs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `balance_before` to the `stock_outs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stock_ins` ADD COLUMN `balance_after` INTEGER NOT NULL,
    ADD COLUMN `balance_before` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `stock_outs` ADD COLUMN `balance_after` INTEGER NOT NULL,
    ADD COLUMN `balance_before` INTEGER NOT NULL;

-- DropTable
DROP TABLE `purchasesummary`;
