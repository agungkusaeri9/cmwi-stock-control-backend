/*
  Warnings:

  - You are about to alter the column `uom` on the `kanbans` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `kanbans` MODIFY `lead_time` INTEGER NOT NULL DEFAULT 0,
    MODIFY `uom` VARCHAR(100) NULL;
