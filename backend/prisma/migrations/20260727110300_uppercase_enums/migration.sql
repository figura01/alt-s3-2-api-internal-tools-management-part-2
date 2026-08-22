/*
  Warnings:

  - The values [active,revoked] on the enum `AccessStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [pending,approved,rejected] on the enum `RequestStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [active,unused,expiring] on the enum `ToolStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [active,inactive] on the enum `UserStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AccessStatus_new" AS ENUM ('ACTIVE', 'REVOKED');
ALTER TABLE "public"."user_tool_accesses" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "user_tool_accesses" ALTER COLUMN "status" TYPE "AccessStatus_new" USING ("status"::text::"AccessStatus_new");
ALTER TYPE "AccessStatus" RENAME TO "AccessStatus_old";
ALTER TYPE "AccessStatus_new" RENAME TO "AccessStatus";
DROP TYPE "public"."AccessStatus_old";
ALTER TABLE "user_tool_accesses" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RequestStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
ALTER TABLE "public"."access_requests" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "access_requests" ALTER COLUMN "status" TYPE "RequestStatus_new" USING ("status"::text::"RequestStatus_new");
ALTER TYPE "RequestStatus" RENAME TO "RequestStatus_old";
ALTER TYPE "RequestStatus_new" RENAME TO "RequestStatus";
DROP TYPE "public"."RequestStatus_old";
ALTER TABLE "access_requests" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ToolStatus_new" AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRING');
ALTER TABLE "public"."tools" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "tools" ALTER COLUMN "status" TYPE "ToolStatus_new" USING ("status"::text::"ToolStatus_new");
ALTER TYPE "ToolStatus" RENAME TO "ToolStatus_old";
ALTER TYPE "ToolStatus_new" RENAME TO "ToolStatus";
DROP TYPE "public"."ToolStatus_old";
ALTER TABLE "tools" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserStatus_new" AS ENUM ('ACTIVE', 'INACTIVE');
ALTER TABLE "public"."users" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "status" TYPE "UserStatus_new" USING ("status"::text::"UserStatus_new");
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "public"."UserStatus_old";
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "access_requests" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "tools" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "user_tool_accesses" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
