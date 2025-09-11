/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `requesters` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `requesters_name_key` ON `requesters`(`name`);
