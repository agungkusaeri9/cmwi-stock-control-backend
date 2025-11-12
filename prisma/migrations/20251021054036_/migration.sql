/*
  Warnings:

  - You are about to drop the `purchaseorderstagging` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[kanban_code]` on the table `KanbanStagging` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `purchaseorderstagging` DROP FOREIGN KEY `PurchaseOrderStagging_supplier_id_fkey`;

-- DropTable
DROP TABLE `purchaseorderstagging`;

-- CreateTable
CREATE TABLE `purchase_order_staggings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `department` VARCHAR(191) NULL,
    `supplier_id` INTEGER NULL,
    `po_number` VARCHAR(191) NOT NULL,
    `po_date` DATETIME(3) NULL,
    `pr_date` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `purchase_order_staggings_po_number_key`(`po_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_order_detail_staggings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `po_number` VARCHAR(191) NOT NULL,
    `pr_number` VARCHAR(191) NULL,
    `pr_requested` VARCHAR(191) NULL,
    `kanban_code` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `specification` TEXT NULL,
    `quantity` INTEGER NULL,
    `unit` VARCHAR(191) NULL,
    `remark` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `is_active` BOOLEAN NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `KanbanStagging_kanban_code_key` ON `KanbanStagging`(`kanban_code`);

-- AddForeignKey
ALTER TABLE `purchase_order_staggings` ADD CONSTRAINT `purchase_order_staggings_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_order_detail_staggings` ADD CONSTRAINT `purchase_order_detail_staggings_po_number_fkey` FOREIGN KEY (`po_number`) REFERENCES `purchase_order_staggings`(`po_number`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_order_detail_staggings` ADD CONSTRAINT `purchase_order_detail_staggings_kanban_code_fkey` FOREIGN KEY (`kanban_code`) REFERENCES `KanbanStagging`(`kanban_code`) ON DELETE SET NULL ON UPDATE CASCADE;
