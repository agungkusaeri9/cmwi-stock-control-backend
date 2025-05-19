-- AlterTable
ALTER TABLE `stock_ins` ADD COLUMN `operator_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `stock_outs` ADD COLUMN `operator_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `stock_ins` ADD CONSTRAINT `stock_ins_operator_id_fkey` FOREIGN KEY (`operator_id`) REFERENCES `operators`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_outs` ADD CONSTRAINT `stock_outs_operator_id_fkey` FOREIGN KEY (`operator_id`) REFERENCES `operators`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
