/*
  Warnings:

  - Made the column `po_number` on table `purchase_order_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `po_number` on table `purchase_orders` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `purchase_order_details` DROP FOREIGN KEY `purchase_order_details_po_number_fkey`;

-- AlterTable
ALTER TABLE `purchase_order_details` MODIFY `po_number` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `purchase_orders` MODIFY `po_number` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `purchase_request_details` ADD COLUMN `is_active` BOOLEAN NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE `purchase_order_details` ADD CONSTRAINT `purchase_order_details_po_number_fkey` FOREIGN KEY (`po_number`) REFERENCES `purchase_orders`(`po_number`) ON DELETE CASCADE ON UPDATE CASCADE;
