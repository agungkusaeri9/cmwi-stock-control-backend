-- DropIndex
DROP INDEX `ManualPurchaseOrder_po_number_key` ON `manualpurchaseorder`;

-- AlterTable
ALTER TABLE `manualpurchaseorder` ADD COLUMN `kanban_code` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `ManualPurchaseOrder` ADD CONSTRAINT `ManualPurchaseOrder_kanban_code_fkey` FOREIGN KEY (`kanban_code`) REFERENCES `kanbans`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;
