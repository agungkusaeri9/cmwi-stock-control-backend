/*
  Warnings:

  - A unique constraint covering the columns `[po_number]` on the table `purchase_orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `po_number` to the `purchase_order_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `purchase_order_details` ADD COLUMN `po_number` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `purchase_orders_po_number_key` ON `purchase_orders`(`po_number`);

-- AddForeignKey
ALTER TABLE `purchase_order_details` ADD CONSTRAINT `purchase_order_details_po_number_fkey` FOREIGN KEY (`po_number`) REFERENCES `purchase_orders`(`po_number`) ON DELETE CASCADE ON UPDATE CASCADE;
