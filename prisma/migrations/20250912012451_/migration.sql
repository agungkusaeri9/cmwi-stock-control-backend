-- AlterTable
ALTER TABLE `stock_outs` ADD COLUMN `requester_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `stock_outs` ADD CONSTRAINT `stock_outs_requester_id_fkey` FOREIGN KEY (`requester_id`) REFERENCES `requesters`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
