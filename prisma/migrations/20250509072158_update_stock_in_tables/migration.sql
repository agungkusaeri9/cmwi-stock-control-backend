/*
  Warnings:

  - You are about to drop the column `rack_id` on the `stock_ins` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `stock_ins` DROP FOREIGN KEY `stock_ins_rack_id_fkey`;

-- AlterTable
ALTER TABLE `stock_ins` DROP COLUMN `rack_id`;
