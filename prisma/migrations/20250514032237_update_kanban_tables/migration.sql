/*
  Warnings:

  - You are about to drop the column `quantity` on the `kanbans` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `purchase_order_details` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `purchase_order_details` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `purchase_orders` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `purchase_orders` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `purchase_request_details` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `purchase_request_details` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `purchase_requests` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `purchase_requests` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `purchase_order_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `purchase_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `purchase_request_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `purchase_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `kanbans` DROP COLUMN `quantity`;

-- AlterTable
ALTER TABLE `purchase_order_details` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `purchase_orders` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `purchase_request_details` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `purchase_requests` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `PurchaseSummary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pr_number` VARCHAR(100) NOT NULL,
    `po_number` VARCHAR(100) NOT NULL,
    `total_amount` DOUBLE NOT NULL,
    `total_qty` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
