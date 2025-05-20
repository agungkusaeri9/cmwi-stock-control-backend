/*
  Warnings:

  - You are about to drop the column `po_date` on the `purchase_orders` table. All the data in the column will be lost.
  - You are about to drop the column `pr_date` on the `purchase_orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `purchase_order_details` ADD COLUMN `po_date` DATETIME(3) NULL,
    ADD COLUMN `pr_date` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `purchase_orders` DROP COLUMN `po_date`,
    DROP COLUMN `pr_date`;
