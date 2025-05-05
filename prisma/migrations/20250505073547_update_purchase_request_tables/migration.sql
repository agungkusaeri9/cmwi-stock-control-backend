/*
  Warnings:

  - The primary key for the `purchase_requests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `purchase_requests` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `purchase_requests` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `date` DATETIME(3) NULL,
    MODIFY `quantity` INTEGER NULL,
    MODIFY `est_unit_price` DOUBLE NULL,
    MODIFY `est_amount` DOUBLE NULL,
    ADD PRIMARY KEY (`id`);
