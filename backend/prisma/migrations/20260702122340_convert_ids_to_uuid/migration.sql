/*
  Warnings:

  - The primary key for the `access_requests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `cost_tracking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tools` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `usage_logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user_tool_access` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "access_requests" DROP CONSTRAINT "access_requests_processed_by_fkey";

-- DropForeignKey
ALTER TABLE "access_requests" DROP CONSTRAINT "access_requests_tool_id_fkey";

-- DropForeignKey
ALTER TABLE "access_requests" DROP CONSTRAINT "access_requests_user_id_fkey";

-- DropForeignKey
ALTER TABLE "cost_tracking" DROP CONSTRAINT "cost_tracking_tool_id_fkey";

-- DropForeignKey
ALTER TABLE "tools" DROP CONSTRAINT "tools_category_id_fkey";

-- DropForeignKey
ALTER TABLE "usage_logs" DROP CONSTRAINT "usage_logs_tool_id_fkey";

-- DropForeignKey
ALTER TABLE "usage_logs" DROP CONSTRAINT "usage_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_tool_access" DROP CONSTRAINT "user_tool_access_granted_by_fkey";

-- DropForeignKey
ALTER TABLE "user_tool_access" DROP CONSTRAINT "user_tool_access_revoked_by_fkey";

-- DropForeignKey
ALTER TABLE "user_tool_access" DROP CONSTRAINT "user_tool_access_tool_id_fkey";

-- DropForeignKey
ALTER TABLE "user_tool_access" DROP CONSTRAINT "user_tool_access_user_id_fkey";

-- AlterTable
ALTER TABLE "access_requests" DROP CONSTRAINT "access_requests_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "tool_id" SET DATA TYPE TEXT,
ALTER COLUMN "processed_by" SET DATA TYPE TEXT,
ADD CONSTRAINT "access_requests_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "access_requests_id_seq";

-- AlterTable
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "categories_id_seq";

-- AlterTable
ALTER TABLE "cost_tracking" DROP CONSTRAINT "cost_tracking_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "tool_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "cost_tracking_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "cost_tracking_id_seq";

-- AlterTable
ALTER TABLE "tools" DROP CONSTRAINT "tools_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "category_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "tools_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tools_id_seq";

-- AlterTable
ALTER TABLE "usage_logs" DROP CONSTRAINT "usage_logs_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "tool_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "usage_logs_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "usage_logs_id_seq";

-- AlterTable
ALTER TABLE "user_tool_access" DROP CONSTRAINT "user_tool_access_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "tool_id" SET DATA TYPE TEXT,
ALTER COLUMN "granted_by" SET DATA TYPE TEXT,
ALTER COLUMN "revoked_by" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_tool_access_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "user_tool_access_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- AddForeignKey
ALTER TABLE "tools" ADD CONSTRAINT "tools_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "access_requests" ADD CONSTRAINT "access_requests_processed_by_fkey" FOREIGN KEY ("processed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "access_requests" ADD CONSTRAINT "access_requests_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "access_requests" ADD CONSTRAINT "access_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cost_tracking" ADD CONSTRAINT "cost_tracking_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usage_logs" ADD CONSTRAINT "usage_logs_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usage_logs" ADD CONSTRAINT "usage_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_tool_access" ADD CONSTRAINT "user_tool_access_granted_by_fkey" FOREIGN KEY ("granted_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_tool_access" ADD CONSTRAINT "user_tool_access_revoked_by_fkey" FOREIGN KEY ("revoked_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_tool_access" ADD CONSTRAINT "user_tool_access_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_tool_access" ADD CONSTRAINT "user_tool_access_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
