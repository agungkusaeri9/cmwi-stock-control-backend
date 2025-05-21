-- CreateTable
CREATE TABLE `_KanbanToSupplier` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_KanbanToSupplier_AB_unique`(`A`, `B`),
    INDEX `_KanbanToSupplier_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_KanbanToSupplier` ADD CONSTRAINT `_KanbanToSupplier_A_fkey` FOREIGN KEY (`A`) REFERENCES `kanbans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_KanbanToSupplier` ADD CONSTRAINT `_KanbanToSupplier_B_fkey` FOREIGN KEY (`B`) REFERENCES `suppliers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
