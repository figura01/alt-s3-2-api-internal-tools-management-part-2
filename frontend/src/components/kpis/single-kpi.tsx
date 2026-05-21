import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { TrendingUp, Wrench, Users, Building2 } from "lucide-react";

const SingleKpi = ({
  type,
  title,
  value,
  progress,
  className,
}: {
  type: string;
  title: string;
  value: string;
  progress: number;
  className?: string;
}) => {
  return (
    <Card className={`${className} "w-1/4"`}>
      <CardHeader className="flex justify-between align-items-center">
        <CardTitle>{title}</CardTitle>
        {type === "cost" && <TrendingUp className="h-4 w-4" />}
        {type === "users" && <Users className="h-4 w-4" />}
        {type === "tools" && <Wrench className="h-4 w-4" />}
        {type === "departments" && <Building2 className="h-4 w-4" />}
      </CardHeader>
      <CardContent>
        <p>{value}</p>
      </CardContent>
      <CardFooter>
        <Badge variant="default">+{progress}%</Badge>
      </CardFooter>
    </Card>
  );
};

export default SingleKpi;
