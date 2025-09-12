-- AlterTable
ALTER TABLE `stock_outs` ADD COLUMN `sub_machine_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `stock_outs` ADD CONSTRAINT `stock_outs_sub_machine_id_fkey` FOREIGN KEY (`sub_machine_id`) REFERENCES `sub_machines`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
