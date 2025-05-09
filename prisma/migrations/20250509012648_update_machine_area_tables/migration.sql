/*
  Warnings:

  - You are about to drop the column `code` on the `machine_areas` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `machine_areas` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `machine_areas_code_key` ON `machine_areas`;

-- AlterTable
ALTER TABLE `machine_areas` DROP COLUMN `code`;

-- CreateIndex
CREATE UNIQUE INDEX `machine_areas_name_key` ON `machine_areas`(`name`);
