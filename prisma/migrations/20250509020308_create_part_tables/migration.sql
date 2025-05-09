/*
  Warnings:

  - You are about to drop the column `js_code` on the `kanbans` table. All the data in the column will be lost.
  - You are about to drop the column `maker_id` on the `kanbans` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `kanbans` table. All the data in the column will be lost.
  - You are about to drop the column `spare_part_id` on the `kanbans` table. All the data in the column will be lost.
  - You are about to drop the column `supplier_id` on the `kanbans` table. All the data in the column will be lost.
  - Added the required column `uom` to the `kanbans` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `kanbans` DROP FOREIGN KEY `kanbans_maker_id_fkey`;

-- DropForeignKey
ALTER TABLE `kanbans` DROP FOREIGN KEY `kanbans_spare_part_id_fkey`;

-- DropForeignKey
ALTER TABLE `kanbans` DROP FOREIGN KEY `kanbans_supplier_id_fkey`;

-- DropIndex
DROP INDEX `kanbans_js_code_key` ON `kanbans`;

-- AlterTable
ALTER TABLE `kanbans` DROP COLUMN `js_code`,
    DROP COLUMN `maker_id`,
    DROP COLUMN `quantity`,
    DROP COLUMN `spare_part_id`,
    DROP COLUMN `supplier_id`,
    ADD COLUMN `machine_area_id` INTEGER NULL,
    ADD COLUMN `machine_code` VARCHAR(191) NULL,
    ADD COLUMN `part_code` VARCHAR(191) NULL,
    ADD COLUMN `uom` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `parts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NULL,
    `specification` VARCHAR(255) NULL,
    `min_quantity` INTEGER NOT NULL DEFAULT 0,
    `max_quantity` INTEGER NOT NULL DEFAULT 0,
    `balance` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `parts_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `kanbans` ADD CONSTRAINT `kanbans_part_code_fkey` FOREIGN KEY (`part_code`) REFERENCES `parts`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kanbans` ADD CONSTRAINT `kanbans_machine_area_id_fkey` FOREIGN KEY (`machine_area_id`) REFERENCES `machine_areas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kanbans` ADD CONSTRAINT `kanbans_machine_code_fkey` FOREIGN KEY (`machine_code`) REFERENCES `machines`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;
