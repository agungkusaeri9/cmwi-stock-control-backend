/*
  Warnings:

  - You are about to drop the column `supplier` on the `purchase_orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `purchase_orders` DROP COLUMN `supplier`,
    ADD COLUMN `supplier_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `purchase_orders` ADD CONSTRAINT `purchase_orders_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
