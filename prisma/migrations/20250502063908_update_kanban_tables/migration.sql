/*
  Warnings:

  - You are about to drop the column `code` on the `kanbans` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `kanbans` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[js_code]` on the table `kanbans` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `js_code` to the `kanbans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lead_time` to the `kanbans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specification` to the `spare_parts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `kanbans` DROP FOREIGN KEY `kanbans_spare_part_id_fkey`;

-- DropIndex
DROP INDEX `kanbans_code_key` ON `kanbans`;

-- AlterTable
ALTER TABLE `kanbans` DROP COLUMN `code`,
    DROP COLUMN `name`,
    ADD COLUMN `js_code` VARCHAR(100) NOT NULL,
    ADD COLUMN `lead_time` INTEGER NOT NULL,
    ADD COLUMN `makerId` INTEGER NULL,
    ADD COLUMN `rackId` INTEGER NULL,
    ADD COLUMN `supplierId` INTEGER NULL,
    MODIFY `spare_part_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `spare_parts` ADD COLUMN `specification` VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `kanbans_js_code_key` ON `kanbans`(`js_code`);

-- AddForeignKey
ALTER TABLE `kanbans` ADD CONSTRAINT `kanbans_spare_part_id_fkey` FOREIGN KEY (`spare_part_id`) REFERENCES `spare_parts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kanbans` ADD CONSTRAINT `kanbans_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `suppliers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kanbans` ADD CONSTRAINT `kanbans_makerId_fkey` FOREIGN KEY (`makerId`) REFERENCES `makers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kanbans` ADD CONSTRAINT `kanbans_rackId_fkey` FOREIGN KEY (`rackId`) REFERENCES `racks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
