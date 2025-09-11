/*
  Warnings:

  - You are about to drop the column `nik` on the `requesters` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `operators` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `requesters_nik_key` ON `requesters`;

-- AlterTable
ALTER TABLE `operators` ADD COLUMN `user_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `requesters` DROP COLUMN `nik`;

-- CreateIndex
CREATE UNIQUE INDEX `operators_user_id_key` ON `operators`(`user_id`);

-- AddForeignKey
ALTER TABLE `operators` ADD CONSTRAINT `operators_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
