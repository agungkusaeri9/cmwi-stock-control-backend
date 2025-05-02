/*
  Warnings:

  - You are about to drop the column `makerId` on the `kanbans` table. All the data in the column will be lost.
  - You are about to drop the column `rackId` on the `kanbans` table. All the data in the column will be lost.
  - You are about to drop the column `supplierId` on the `kanbans` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `kanbans` DROP FOREIGN KEY `kanbans_makerId_fkey`;

-- DropForeignKey
ALTER TABLE `kanbans` DROP FOREIGN KEY `kanbans_rackId_fkey`;

-- DropForeignKey
ALTER TABLE `kanbans` DROP FOREIGN KEY `kanbans_supplierId_fkey`;

-- AlterTable
ALTER TABLE `kanbans` DROP COLUMN `makerId`,
    DROP COLUMN `rackId`,
    DROP COLUMN `supplierId`,
    ADD COLUMN `maker_id` INTEGER NULL,
    ADD COLUMN `rack_id` INTEGER NULL,
    ADD COLUMN `supplier_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `kanbans` ADD CONSTRAINT `kanbans_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kanbans` ADD CONSTRAINT `kanbans_maker_id_fkey` FOREIGN KEY (`maker_id`) REFERENCES `makers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kanbans` ADD CONSTRAINT `kanbans_rack_id_fkey` FOREIGN KEY (`rack_id`) REFERENCES `racks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
