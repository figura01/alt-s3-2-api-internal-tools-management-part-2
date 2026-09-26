import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  title: ReactNode;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
};

/** Shared card structure; each view retains its own formatting and indicators. */
export function KpiCard({
  title,
  children,
  icon,
  className,
  headerClassName,
  contentClassName,
}: Props) {
  return (
    <Card className={cn("glass-card rounded-2xl", className)}>
      <CardHeader className={headerClassName}>
        {title}
        {icon}
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}
