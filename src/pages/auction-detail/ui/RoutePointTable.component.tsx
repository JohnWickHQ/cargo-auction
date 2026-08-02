import { memo } from "react";
import { Table } from "@mantine/core";
import type { AuctionDetail } from "@/shared/types";

export const RoutePointTable = memo(function RoutePointTable({
  routePoints,
}: {
  routePoints: AuctionDetail["route_points"];
}) {
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
            <Table.Td>
              {new Date(point.date).toLocaleDateString("ru-RU")}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
});
