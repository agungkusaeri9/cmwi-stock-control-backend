/*
  Warnings:

  - You are about to drop the column `description` on the `purchase_orders` table. All the data in the column will be lost.
  - You are about to drop the column `pr_number` on the `purchase_orders` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `purchase_orders` table. All the data in the column will be lost.
  - You are about to drop the column `remark` on the `purchase_orders` table. All the data in the column will be lost.
  - You are about to drop the column `specification` on the `purchase_orders` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `purchase_orders` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `purchase_orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `purchase_orders` DROP COLUMN `description`,
    DROP COLUMN `pr_number`,
    DROP COLUMN `quantity`,
    DROP COLUMN `remark`,
    DROP COLUMN `specification`,
    DROP COLUMN `status`,
    DROP COLUMN `unit`;

-- CreateTable
CREATE TABLE `purchase_order_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pr_number` VARCHAR(191) NULL,
    `pr_requested` VARCHAR(191) NULL,
    `product_code` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `specification` VARCHAR(191) NULL,
    `quantity` INTEGER NULL,
    `unit` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `remark` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
