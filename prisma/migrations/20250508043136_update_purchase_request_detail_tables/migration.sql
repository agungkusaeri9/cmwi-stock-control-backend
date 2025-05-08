/*
  Warnings:

  - You are about to drop the column `acc` on the `purchase_requests` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `purchase_requests` table. All the data in the column will be lost.
  - You are about to drop the column `description_of_goods` on the `purchase_requests` table. All the data in the column will be lost.
  - You are about to drop the column `est_amount` on the `purchase_requests` table. All the data in the column will be lost.
  - You are about to drop the column `est_unit_price` on the `purchase_requests` table. All the data in the column will be lost.
  - You are about to drop the column `item_code` on the `purchase_requests` table. All the data in the column will be lost.
  - You are about to drop the column `item_name` on the `purchase_requests` table. All the data in the column will be lost.
  - You are about to drop the column `part` on the `purchase_requests` table. All the data in the column will be lost.
  - You are about to drop the column `purpose` on the `purchase_requests` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `purchase_requests` table. All the data in the column will be lost.
  - You are about to drop the column `remark` on the `purchase_requests` table. All the data in the column will be lost.
  - You are about to drop the column `req_delivery` on the `purchase_requests` table. All the data in the column will be lost.
  - You are about to drop the column `specification` on the `purchase_requests` table. All the data in the column will be lost.
  - You are about to drop the column `supplier` on the `purchase_requests` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `purchase_requests` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pr_number]` on the table `purchase_requests` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `purchase_requests` DROP COLUMN `acc`,
    DROP COLUMN `currency`,
    DROP COLUMN `description_of_goods`,
    DROP COLUMN `est_amount`,
    DROP COLUMN `est_unit_price`,
    DROP COLUMN `item_code`,
    DROP COLUMN `item_name`,
    DROP COLUMN `part`,
    DROP COLUMN `purpose`,
    DROP COLUMN `quantity`,
    DROP COLUMN `remark`,
    DROP COLUMN `req_delivery`,
    DROP COLUMN `specification`,
    DROP COLUMN `supplier`,
    DROP COLUMN `unit`;

-- CreateTable
CREATE TABLE `PurchaseRequestDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pr_number` VARCHAR(191) NULL,
    `acc` VARCHAR(191) NULL,
    `item_code` VARCHAR(191) NULL,
    `item_name` VARCHAR(191) NULL,
    `description_of_goods` VARCHAR(191) NULL,
    `specification` VARCHAR(191) NULL,
    `part` VARCHAR(191) NULL,
    `quantity` INTEGER NULL,
    `unit` VARCHAR(191) NULL,
    `est_unit_price` DOUBLE NULL,
    `est_amount` DOUBLE NULL,
    `currency` VARCHAR(191) NULL,
    `req_delivery` DATETIME(3) NULL,
    `supplier` VARCHAR(191) NULL,
    `remark` VARCHAR(191) NULL,
    `purpose` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `purchase_requests_pr_number_key` ON `purchase_requests`(`pr_number`);

-- AddForeignKey
ALTER TABLE `PurchaseRequestDetail` ADD CONSTRAINT `PurchaseRequestDetail_pr_number_fkey` FOREIGN KEY (`pr_number`) REFERENCES `purchase_requests`(`pr_number`) ON DELETE CASCADE ON UPDATE CASCADE;
