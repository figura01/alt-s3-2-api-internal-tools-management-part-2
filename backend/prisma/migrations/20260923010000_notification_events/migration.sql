CREATE TYPE "NotificationType" AS ENUM ('GENERAL', 'TOOL_EXPIRING', 'BUDGET_WARNING', 'BUDGET_EXCEEDED');
ALTER TABLE "notifications" ADD COLUMN "type" "NotificationType" NOT NULL DEFAULT 'GENERAL', ADD COLUMN "href" TEXT, ADD COLUMN "event_key" TEXT;
CREATE UNIQUE INDEX "notifications_user_id_event_key_key" ON "notifications"("user_id", "event_key");
