-- AlterTable
ALTER TABLE `kanbans` MODIFY `description` TEXT NULL,
    MODIFY `specification` TEXT NULL;

-- AlterTable
ALTER TABLE `purchase_order_details` MODIFY `description` TEXT NULL,
    MODIFY `specification` TEXT NULL;

-- AlterTable
ALTER TABLE `purchase_request_details` MODIFY `description_of_goods` TEXT NULL,
    MODIFY `specification` TEXT NULL;
