/*
  Warnings:

  - You are about to drop the `spare_parts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `kanbans` DROP FOREIGN KEY `kanbans_part_code_fkey`;

-- DropForeignKey
ALTER TABLE `spare_parts` DROP FOREIGN KEY `spare_parts_department_id_fkey`;

-- DropForeignKey
ALTER TABLE `spare_parts` DROP FOREIGN KEY `spare_parts_machine_area_id_fkey`;

-- DropForeignKey
ALTER TABLE `spare_parts` DROP FOREIGN KEY `spare_parts_rack_id_fkey`;

-- AlterTable
ALTER TABLE `kanbans` ADD COLUMN `quantity` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `spare_parts`;

-- CreateTable
CREATE TABLE `stock_ins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kanban_id` INTEGER NULL,
    `rack_id` INTEGER NULL,
    `quantity` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_outs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kanban_id` INTEGER NULL,
    `machine_id` INTEGER NULL,
    `machine_area_id` INTEGER NULL,
    `quantity` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `kanbans` ADD CONSTRAINT `kanbans_part_code_fkey` FOREIGN KEY (`part_code`) REFERENCES `parts`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_ins` ADD CONSTRAINT `stock_ins_kanban_id_fkey` FOREIGN KEY (`kanban_id`) REFERENCES `kanbans`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_ins` ADD CONSTRAINT `stock_ins_rack_id_fkey` FOREIGN KEY (`rack_id`) REFERENCES `racks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_outs` ADD CONSTRAINT `stock_outs_kanban_id_fkey` FOREIGN KEY (`kanban_id`) REFERENCES `kanbans`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_outs` ADD CONSTRAINT `stock_outs_machine_id_fkey` FOREIGN KEY (`machine_id`) REFERENCES `machines`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_outs` ADD CONSTRAINT `stock_outs_machine_area_id_fkey` FOREIGN KEY (`machine_area_id`) REFERENCES `machine_areas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
