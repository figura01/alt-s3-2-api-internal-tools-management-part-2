import { AccessGate } from "@/components/auth/access-gate";
import { UsersContent } from "./users-content";
export const metadata = { title: "Users" };
export default function UsersPage() {
  return (
    <AccessGate roles={["ADMIN"]}>
      <UsersContent />
    </AccessGate>
  );
}
