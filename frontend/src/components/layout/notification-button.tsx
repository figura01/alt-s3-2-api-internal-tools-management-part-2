import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const NotificationButton = () => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative bg-transparent border-none dark:hover:bg-transparent dark:hover:text-white"
    >
      <Bell className="text-muted-foreground h-4 w-4 hover:text-foreground" />
      <Badge className="absolute -right-1 -top-1 h-4 min-w-4 bg-red-400 text-white rounded-full px-1 text-[10px]">
        3
      </Badge>
    </Button>
  );
};

export default NotificationButton;
