-- AlterTable
ALTER TABLE `spare_parts` ADD COLUMN `maximum_quantity` INTEGER NOT NULL DEFAULT 0,
    MODIFY `minimum_quantity` INTEGER NOT NULL DEFAULT 0;
