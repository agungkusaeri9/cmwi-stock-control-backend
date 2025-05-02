/*
  Warnings:

  - You are about to drop the column `code` on the `suppliers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `suppliers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `suppliers_code_key` ON `suppliers`;

-- AlterTable
ALTER TABLE `suppliers` DROP COLUMN `code`,
    ADD COLUMN `name` VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `suppliers_name_key` ON `suppliers`(`name`);
