-- AlterTable
ALTER TABLE `kanbans` ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `kanban_parent_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `KanbanParent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `original_code` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KanbanStagging` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kanban_code` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `kanbans` ADD CONSTRAINT `kanbans_kanban_parent_id_fkey` FOREIGN KEY (`kanban_parent_id`) REFERENCES `KanbanParent`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
