/*
  Warnings:

  - You are about to drop the column `created_at` on the `usage_logs` table. All the data in the column will be lost.
  - You are about to drop the column `session_count` on the `usage_logs` table. All the data in the column will be lost.
  - You are about to drop the column `tool_id` on the `usage_logs` table. All the data in the column will be lost.
  - You are about to drop the column `total_minutes` on the `usage_logs` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `usage_logs` table. All the data in the column will be lost.
  - You are about to drop the column `usage_date` on the `usage_logs` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `usage_logs` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,toolId,usageDate]` on the table `usage_logs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `toolId` to the `usage_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usageDate` to the `usage_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `usage_logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "usage_logs" DROP CONSTRAINT "usage_logs_tool_id_fkey";

-- DropForeignKey
ALTER TABLE "usage_logs" DROP CONSTRAINT "usage_logs_user_id_fkey";

-- DropIndex
DROP INDEX "idx_usage_logs_date";

-- DropIndex
DROP INDEX "idx_usage_logs_tool";

-- DropIndex
DROP INDEX "idx_usage_logs_user";

-- AlterTable
ALTER TABLE "usage_logs" DROP COLUMN "created_at",
DROP COLUMN "session_count",
DROP COLUMN "tool_id",
DROP COLUMN "total_minutes",
DROP COLUMN "updated_at",
DROP COLUMN "usage_date",
DROP COLUMN "user_id",
ADD COLUMN     "sessionCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "toolId" TEXT NOT NULL,
ADD COLUMN     "totalMinutes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usageDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "usage_logs_usageDate_idx" ON "usage_logs"("usageDate");

-- CreateIndex
CREATE INDEX "usage_logs_toolId_idx" ON "usage_logs"("toolId");

-- CreateIndex
CREATE UNIQUE INDEX "usage_logs_userId_toolId_usageDate_key" ON "usage_logs"("userId", "toolId", "usageDate");

-- AddForeignKey
ALTER TABLE "usage_logs" ADD CONSTRAINT "usage_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_logs" ADD CONSTRAINT "usage_logs_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "tools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
