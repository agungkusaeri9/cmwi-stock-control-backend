/*
  Warnings:

  - You are about to drop the column `part_code` on the `kanbans` table. All the data in the column will be lost.
  - You are about to drop the column `kanban_id` on the `stock_ins` table. All the data in the column will be lost.
  - You are about to drop the column `kanban_id` on the `stock_outs` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `kanbans` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `kanbans` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `kanbans` DROP FOREIGN KEY `kanbans_part_code_fkey`;

-- DropForeignKey
ALTER TABLE `stock_ins` DROP FOREIGN KEY `stock_ins_kanban_id_fkey`;

-- DropForeignKey
ALTER TABLE `stock_outs` DROP FOREIGN KEY `stock_outs_kanban_id_fkey`;

-- AlterTable
ALTER TABLE `kanbans` DROP COLUMN `part_code`,
    ADD COLUMN `balance` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `code` VARCHAR(100) NOT NULL,
    ADD COLUMN `description` VARCHAR(255) NULL,
    ADD COLUMN `max_quantity` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `min_quantity` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `specification` VARCHAR(255) NULL,
    ADD COLUMN `stock_in_quantity` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `stock_ins` DROP COLUMN `kanban_id`,
    ADD COLUMN `kanban_code` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `stock_outs` DROP COLUMN `kanban_id`,
    ADD COLUMN `kanban_code` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `kanbans_code_key` ON `kanbans`(`code`);

-- AddForeignKey
ALTER TABLE `stock_ins` ADD CONSTRAINT `stock_ins_kanban_code_fkey` FOREIGN KEY (`kanban_code`) REFERENCES `kanbans`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_outs` ADD CONSTRAINT `stock_outs_kanban_code_fkey` FOREIGN KEY (`kanban_code`) REFERENCES `kanbans`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;
