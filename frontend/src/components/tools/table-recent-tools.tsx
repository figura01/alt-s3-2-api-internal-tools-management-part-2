import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Calendar1 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { CustomImage } from "@/components/custom-image";

import type { ToolForTable } from "@/types/tool";
import { formatCurrency } from "@/utils/formatCurrency";

type Props = {
  tools: ToolForTable[];
};

const TableRecentTools = ({ tools }: Props) => {
  console.log("tools in array: ", tools);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recently Edited Tools</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Last 30 days</span>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tool</TableHead>
              <TableHead>Departement</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Monthly Cost</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tools.map((tool) => (
              <TableRow key={tool.id}>
                <TableCell>
                  {tool.icon_url && (
                    <CustomImage
                      src={String(tool.icon_url)}
                      alt={String(tool.name)}
                    />
                  )}{" "}
                  {tool.name}
                </TableCell>
                <TableCell>{tool.owner_department}</TableCell>
                <TableCell>{tool.users}</TableCell>
                <TableCell>&euro;{formatCurrency(tool.monthly_cost)}</TableCell>
                <TableCell>
                  <Badge
                    variant="default"
                    className={
                      tool.status === "active"
                        ? "status-active"
                        : tool.status === "unused"
                          ? "status-unused"
                          : "status-expiring"
                    }
                  >
                    {tool.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TableRecentTools;
