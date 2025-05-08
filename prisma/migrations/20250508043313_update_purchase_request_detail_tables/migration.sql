/*
  Warnings:

  - You are about to drop the `purchaserequestdetail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `purchaserequestdetail` DROP FOREIGN KEY `PurchaseRequestDetail_pr_number_fkey`;

-- DropTable
DROP TABLE `purchaserequestdetail`;

-- CreateTable
CREATE TABLE `purchase_request_details` (
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
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `purchase_request_details` ADD CONSTRAINT `purchase_request_details_pr_number_fkey` FOREIGN KEY (`pr_number`) REFERENCES `purchase_requests`(`pr_number`) ON DELETE CASCADE ON UPDATE CASCADE;
