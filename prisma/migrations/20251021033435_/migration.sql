-- CreateTable
CREATE TABLE `PurchaseOrderStagging` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `department` VARCHAR(191) NULL,
    `supplier_id` INTEGER NULL,
    `po_number` VARCHAR(191) NOT NULL,
    `po_date` DATETIME(3) NULL,
    `pr_date` DATETIME(3) NULL,
    `pr_number` VARCHAR(191) NULL,
    `pr_requested` VARCHAR(191) NULL,
    `kanban_code` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `specification` TEXT NULL,
    `quantity` INTEGER NULL,
    `unit` VARCHAR(191) NULL,
    `remark` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PurchaseOrderStagging` ADD CONSTRAINT `PurchaseOrderStagging_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
