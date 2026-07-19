/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `tools` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tools_name_key" ON "tools"("name");
