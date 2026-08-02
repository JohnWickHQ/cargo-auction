import { memo } from "react";
import { Table } from "@mantine/core";
import type { RoutePoint } from "@/shared/types";
import { formatDate } from "@/shared/config";

interface RoutePointTableProps {
  routePoints: RoutePoint[];
}

export const RoutePointTable = memo(function RoutePointTable({
  routePoints,
}: RoutePointTableProps) {
  return (
    <Table striped withRowBorders withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Тип</Table.Th>
          <Table.Th>Город</Table.Th>
          <Table.Th>Адрес</Table.Th>
          <Table.Th>Дата</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {routePoints.map((point, i) => (
          <Table.Tr key={i}>
            <Table.Td>
              {point.type === "loading" ? "Погрузка" : "Разгрузка"}
            </Table.Td>
            <Table.Td>{point.city}</Table.Td>
            <Table.Td>{point.address || "—"}</Table.Td>
            <Table.Td>{formatDate(point.date)}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
});
