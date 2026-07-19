/*
  Warnings:

  - You are about to drop the `user_tool_access` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_tool_access" DROP CONSTRAINT "user_tool_access_granted_by_id_fkey";

-- DropForeignKey
ALTER TABLE "user_tool_access" DROP CONSTRAINT "user_tool_access_revoked_by_id_fkey";

-- DropForeignKey
ALTER TABLE "user_tool_access" DROP CONSTRAINT "user_tool_access_tool_id_fkey";

-- DropForeignKey
ALTER TABLE "user_tool_access" DROP CONSTRAINT "user_tool_access_user_id_fkey";

-- DropTable
DROP TABLE "user_tool_access";

-- CreateTable
CREATE TABLE "user_tool_accesses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "grantedById" TEXT,
    "revokedById" TEXT,
    "status" "AccessStatus" NOT NULL DEFAULT 'active',
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "user_tool_accesses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_tool_accesses_userId_toolId_key" ON "user_tool_accesses"("userId", "toolId");

-- AddForeignKey
ALTER TABLE "user_tool_accesses" ADD CONSTRAINT "user_tool_accesses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tool_accesses" ADD CONSTRAINT "user_tool_accesses_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "tools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tool_accesses" ADD CONSTRAINT "user_tool_accesses_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tool_accesses" ADD CONSTRAINT "user_tool_accesses_revokedById_fkey" FOREIGN KEY ("revokedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
