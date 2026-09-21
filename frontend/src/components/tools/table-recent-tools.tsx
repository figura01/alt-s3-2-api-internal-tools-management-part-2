"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { CustomBadge } from "@/components/ui/custom-badge";

import { CustomImage } from "@/components/custom-image";

import type { ToolForTable } from "@/types/tool";
import { formatCurrency } from "@/utils/format";
import { useAppStore } from "@/store/store";
import { gradients } from "@/lib/gradients";

type Props = {
  tools: ToolForTable[];
};

const TableRecentTools = ({ tools }: Props) => {
  const locale = useAppStore(state => state.locale);
  const currency = useAppStore(state => state.currency);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Tools</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Latest additions</span>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tool</TableHead>
              <TableHead>Department</TableHead>
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
                  {tool.name.length > 20
                    ? tool.name.slice(0, 20) + "..."
                    : tool.name}
                </TableCell>
                <TableCell>{tool.owner_department}</TableCell>
                <TableCell>{tool.users}</TableCell>
                <TableCell>{formatCurrency(tool.monthly_cost, locale, currency)}</TableCell>
                <TableCell>
                  {tool.status === "ACTIVE" ? (
                    <CustomBadge angle={90} {...gradients.green}>
                      {tool.status}
                    </CustomBadge>
                  ) : tool.status === "UNUSED" ? (
                    <CustomBadge angle={90} {...gradients.red}>
                      {tool.status}
                    </CustomBadge>
                  ) : tool.status === "EXPIRING" ? (
                    <CustomBadge angle={90} {...gradients.orange}>
                      {tool.status}
                    </CustomBadge>
                  ) : (
                    <CustomBadge angle={90} {...gradients.pink}>
                      {tool.status}
                    </CustomBadge>
                  )}
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
