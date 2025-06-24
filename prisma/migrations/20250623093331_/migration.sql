/*
  Warnings:

  - You are about to drop the column `original_quantity` on the `stock_outs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `stock_outs` DROP COLUMN `original_quantity`;

-- CreateTable
CREATE TABLE `StockOutChangeLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stock_out_id` INTEGER NOT NULL,
    `quantity_before` INTEGER NOT NULL,
    `quantity_after` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StockOutChangeLog` ADD CONSTRAINT `StockOutChangeLog_stock_out_id_fkey` FOREIGN KEY (`stock_out_id`) REFERENCES `stock_outs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
