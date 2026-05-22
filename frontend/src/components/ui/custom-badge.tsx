import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;

  from: string;
  to: string;

  angle?: number;

  className?: string;
};

export function CustomBadge({
  children,
  from,
  to,
  angle = 135,
  className,
}: Props) {
  return (
    <Badge
      style={{
        backgroundImage: `linear-gradient(${angle}deg, ${from}, ${to})`,
      }}
      className={cn("border-transparent text-white shadow-sm", className)}
    >
      {children}
    </Badge>
  );
}
