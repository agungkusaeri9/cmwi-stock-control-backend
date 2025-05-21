/*
  Warnings:

  - You are about to drop the column `po_date` on the `purchase_order_details` table. All the data in the column will be lost.
  - You are about to drop the column `pr_date` on the `purchase_order_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `purchase_order_details` DROP COLUMN `po_date`,
    DROP COLUMN `pr_date`;

-- AlterTable
ALTER TABLE `purchase_orders` ADD COLUMN `po_date` DATETIME(3) NULL,
    ADD COLUMN `pr_date` DATETIME(3) NULL;
