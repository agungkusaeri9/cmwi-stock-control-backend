/*
  Warnings:

  - You are about to drop the column `product_code` on the `purchase_order_details` table. All the data in the column will be lost.
  - You are about to drop the column `item_code` on the `purchase_request_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `purchase_order_details` DROP COLUMN `product_code`,
    ADD COLUMN `kanban_code` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `purchase_request_details` DROP COLUMN `item_code`,
    ADD COLUMN `kanban_code` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `purchase_request_details` ADD CONSTRAINT `purchase_request_details_kanban_code_fkey` FOREIGN KEY (`kanban_code`) REFERENCES `kanbans`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_order_details` ADD CONSTRAINT `purchase_order_details_kanban_code_fkey` FOREIGN KEY (`kanban_code`) REFERENCES `kanbans`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;
