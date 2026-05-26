import { Inbox } from "lucide-react";

type Props = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: Props) {
  return (
    <div className="flex h-full min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-border/60 p-6 text-center">
      <Inbox className="mb-3 h-8 w-8 text-muted-foreground" />

      <p className="font-medium">{title}</p>

      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
