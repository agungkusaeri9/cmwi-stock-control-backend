/*
  Warnings:

  - You are about to drop the column `machine_code` on the `kanbans` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `kanbans` DROP FOREIGN KEY `kanbans_machine_code_fkey`;

-- DropForeignKey
ALTER TABLE `kanbans` DROP FOREIGN KEY `kanbans_part_code_fkey`;

-- AlterTable
ALTER TABLE `kanbans` DROP COLUMN `machine_code`,
    ADD COLUMN `machine_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `kanbans` ADD CONSTRAINT `kanbans_part_code_fkey` FOREIGN KEY (`part_code`) REFERENCES `parts`(`code`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kanbans` ADD CONSTRAINT `kanbans_machine_id_fkey` FOREIGN KEY (`machine_id`) REFERENCES `machines`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
