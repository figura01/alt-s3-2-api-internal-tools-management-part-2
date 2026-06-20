/*
  Warnings:

  - You are about to alter the column `name` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `name` on the `tools` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `vendor` on the `tools` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `website_url` on the `tools` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The `status` column on the `tools` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `usage_metrics` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `owner_department` on the `tools` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "access_status_type" AS ENUM ('active', 'revoked');

-- CreateEnum
CREATE TYPE "department_type" AS ENUM ('Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Design');

-- CreateEnum
CREATE TYPE "request_status_type" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "tool_status_type" AS ENUM ('active', 'deprecated', 'trial');

-- CreateEnum
CREATE TYPE "user_role_type" AS ENUM ('employee', 'manager', 'admin');

-- CreateEnum
CREATE TYPE "user_status_type" AS ENUM ('active', 'inactive');

-- DropForeignKey
ALTER TABLE "tools" DROP CONSTRAINT "tools_category_id_fkey";

-- DropForeignKey
ALTER TABLE "usage_metrics" DROP CONSTRAINT "usage_metrics_tool_id_fkey";

-- DropIndex
DROP INDEX "tools_name_key";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "color_hex" VARCHAR(7) DEFAULT '#6366f1',
ADD COLUMN     "description" TEXT,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(6);

-- AlterTable
ALTER TABLE "tools" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "vendor" DROP NOT NULL,
ALTER COLUMN "vendor" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "website_url" SET DATA TYPE VARCHAR(255),
DROP COLUMN "owner_department",
ADD COLUMN     "owner_department" "department_type" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "tool_status_type" DEFAULT 'active',
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(6);

-- DropTable
DROP TABLE "usage_metrics";

-- DropEnum
DROP TYPE "Department";

-- DropEnum
DROP TYPE "ToolStatus";

-- CreateTable
CREATE TABLE "access_requests" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tool_id" INTEGER NOT NULL,
    "business_justification" TEXT NOT NULL,
    "status" "request_status_type" DEFAULT 'pending',
    "requested_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(6),
    "processed_by" INTEGER,
    "processing_notes" TEXT,

    CONSTRAINT "access_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cost_tracking" (
    "id" SERIAL NOT NULL,
    "tool_id" INTEGER NOT NULL,
    "month_year" DATE NOT NULL,
    "total_monthly_cost" DECIMAL(10,2) NOT NULL,
    "active_users_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cost_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tool_id" INTEGER NOT NULL,
    "session_date" DATE NOT NULL,
    "usage_minutes" INTEGER DEFAULT 0,
    "actions_count" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tool_access" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tool_id" INTEGER NOT NULL,
    "granted_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "granted_by" INTEGER NOT NULL,
    "revoked_at" TIMESTAMP(6),
    "revoked_by" INTEGER,
    "status" "access_status_type" DEFAULT 'active',

    CONSTRAINT "user_tool_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "department" "department_type" NOT NULL,
    "role" "user_role_type" DEFAULT 'employee',
    "status" "user_status_type" DEFAULT 'active',
    "password_hash" VARCHAR(255) NOT NULL,
    "hire_date" DATE,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_requests_date" ON "access_requests"("requested_at");

-- CreateIndex
CREATE INDEX "idx_requests_status" ON "access_requests"("status");

-- CreateIndex
CREATE INDEX "idx_requests_user" ON "access_requests"("user_id");

-- CreateIndex
CREATE INDEX "idx_cost_month_tool" ON "cost_tracking"("month_year", "tool_id");

-- CreateIndex
CREATE UNIQUE INDEX "cost_tracking_tool_id_month_year_key" ON "cost_tracking"("tool_id", "month_year");

-- CreateIndex
CREATE INDEX "idx_usage_date_tool" ON "usage_logs"("session_date", "tool_id");

-- CreateIndex
CREATE INDEX "idx_usage_user_date" ON "usage_logs"("user_id", "session_date");

-- CreateIndex
CREATE INDEX "idx_access_granted_date" ON "user_tool_access"("granted_at");

-- CreateIndex
CREATE INDEX "idx_access_status" ON "user_tool_access"("status");

-- CreateIndex
CREATE INDEX "idx_access_tool" ON "user_tool_access"("tool_id");

-- CreateIndex
CREATE INDEX "idx_access_user" ON "user_tool_access"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_tool_access_user_id_tool_id_status_key" ON "user_tool_access"("user_id", "tool_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_department" ON "users"("department");

-- CreateIndex
CREATE INDEX "idx_users_status" ON "users"("status");

-- CreateIndex
CREATE INDEX "idx_tools_active_users" ON "tools"("active_users_count" DESC);

-- CreateIndex
CREATE INDEX "idx_tools_category" ON "tools"("category_id");

-- CreateIndex
CREATE INDEX "idx_tools_cost_desc" ON "tools"("monthly_cost" DESC);

-- CreateIndex
CREATE INDEX "idx_tools_department" ON "tools"("owner_department");

-- CreateIndex
CREATE INDEX "idx_tools_status" ON "tools"("status");

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
