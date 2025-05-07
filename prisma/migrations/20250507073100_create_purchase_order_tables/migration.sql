-- CreateTable
CREATE TABLE `purchase_orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `department` VARCHAR(191) NULL,
    `supplier` VARCHAR(191) NULL,
    `po_number` VARCHAR(191) NULL,
    `po_date` DATETIME(3) NULL,
    `pr_date` DATETIME(3) NULL,
    `pr_number` VARCHAR(191) NULL,
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
