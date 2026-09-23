"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCurrentUser } from "@/store/store";
import { api } from "@/lib/api";

type Inbox = {
  items: { id: string; href: string | null; title: string; message: string; createdAt: string; readAt: string | null }[];
  unreadCount: number;
  total: number;
  nextOffset: number | null;
};

function UserNotifications({ userId }: { userId: string }) {
  const [offset, setOffset] = useState(0);
  const client = useQueryClient();
  const key = ["notifications", userId];
  const inbox = useQuery({
    queryKey: [...key, offset],
    queryFn: ({ signal }) => api<Inbox>(`/notifications?offset=${offset}`, { signal }),
    refetchInterval: 60_000,
  });
  const markRead = useMutation({
    mutationFn: (id: string | null) => api(id ? `/notifications/${encodeURIComponent(id)}/read` : "/notifications/read-all", { method: "PATCH" }),
    onSuccess: () => client.invalidateQueries({ queryKey: key }),
  });
  const unread = inbox.data?.unreadCount ?? 0;

  return (
    <Popover onOpenChange={(open) => { if (open) { void inbox.refetch(); markRead.reset(); } }}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative bg-transparent border-none" aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}>
          <Bell className="h-4 w-4" />
          {unread > 0 && <Badge aria-hidden="true" className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full bg-red-400 px-1 text-[10px] text-white">{unread > 99 ? "99+" : unread}</Badge>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 max-w-[calc(100vw-2rem)]" aria-label="Notifications">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="font-semibold">Notifications</h2>
          {unread > 0 && <Button size="sm" variant="ghost" disabled={markRead.isPending} onClick={() => markRead.mutate(null)}>Mark all as read</Button>}
        </div>
        {inbox.isPending ? <p role="status">Loading notifications…</p> : inbox.isError ? <div role="alert">Unable to load notifications. <Button variant="link" onClick={() => inbox.refetch()}>Retry</Button></div> : <>
          {inbox.data.items.length === 0 ? <p>No notifications.</p> : <ul className="max-h-80 space-y-3 overflow-y-auto" aria-label="Notification list">
            {inbox.data.items.map((item) => <li key={item.id} className="border-b pb-3 last:border-0">
              {item.href && (item.href === "/analytics" || /^\/tools\/[a-zA-Z0-9_-]+$/.test(item.href)) && <Link href={item.href} className="text-sm text-primary underline">View details</Link>}
              <p className={item.readAt ? "font-normal" : "font-semibold"}>{item.title}</p>
              <p className="break-words text-sm text-muted-foreground">{item.message}</p>
              <time dateTime={item.createdAt} className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</time>
              {!item.readAt && <Button size="sm" variant="link" disabled={markRead.isPending} onClick={() => markRead.mutate(item.id)}>Mark as read</Button>}
            </li>)}
          </ul>}
          {(offset > 0 || inbox.data.nextOffset !== null) && <div className="mt-2 flex justify-between">
            <Button size="sm" variant="ghost" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - 20))}>Previous</Button>
            <Button size="sm" variant="ghost" disabled={inbox.data.nextOffset === null} onClick={() => setOffset(inbox.data.nextOffset!)}>Next</Button>
          </div>}
        </>}
        {markRead.isError && <p role="alert" className="mt-2 text-sm text-destructive">Unable to mark notifications as read. Please try again.</p>}
      </PopoverContent>
    </Popover>
  );
}

export default function NotificationButton() {
  const user = useCurrentUser();
  return user ? <UserNotifications key={user.id} userId={user.id} /> : null;
}
