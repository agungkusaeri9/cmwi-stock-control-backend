/*
  Warnings:

  - Added the required column `pr_number` to the `ManualPurchaseOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `manualpurchaseorder` ADD COLUMN `pr_number` VARCHAR(100) NOT NULL;
