/*
  Warnings:

  - You are about to drop the `receivingreport` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `receivingreport` DROP FOREIGN KEY `ReceivingReport_kanban_code_fkey`;

-- DropTable
DROP TABLE `receivingreport`;

-- CreateTable
CREATE TABLE `receiving_reports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kanban_code` VARCHAR(191) NULL,
    `received_quantity` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `receiving_reports` ADD CONSTRAINT `receiving_reports_kanban_code_fkey` FOREIGN KEY (`kanban_code`) REFERENCES `kanbans`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;
