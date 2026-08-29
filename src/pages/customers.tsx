import { List, useTable, ShowButton, Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Descriptions, Table, Tag } from "antd";
import { inr, fmtDate } from "../lib/money";

export function CustomerList() {
  const { tableProps } = useTable({ sorters: { initial: [{ field: "createdAt", order: "desc" }] } });
  return (
    <List canCreate={false}>
      <Table {...tableProps} rowKey="id">
        <Table.Column title="Name" dataIndex="name" />
        <Table.Column title="Email" dataIndex="email" />
        <Table.Column title="Orders" dataIndex={["_count", "orders"]} render={(v) => <Tag>{v ?? 0}</Tag>} />
        <Table.Column title="Joined" dataIndex="createdAt" render={fmtDate} />
        <Table.Column
          title=""
          render={(_, r: { id: string }) => <ShowButton hideText size="small" recordItemId={r.id} />}
        />
      </Table>
    </List>
  );
}

export function CustomerShow() {
  const { query } = useShow();
  const c = query?.data?.data as
    | {
        name: string;
        email: string;
        createdAt: string;
        totalSpent: number;
        addresses: { line1: string; city: string; state: string; pincode: string }[];
        orders: {
          number: string;
          total: number;
          status: string;
          paymentStatus: string;
          createdAt: string;
        }[];
      }
    | undefined;

  if (!c) return <Show isLoading />;

  return (
    <Show isLoading={query?.isLoading} title={c.name}>
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Email">{c.email}</Descriptions.Item>
        <Descriptions.Item label="Joined">{fmtDate(c.createdAt)}</Descriptions.Item>
        <Descriptions.Item label="Total spent">{inr(c.totalSpent)}</Descriptions.Item>
        <Descriptions.Item label="Addresses">{c.addresses?.length ?? 0}</Descriptions.Item>
      </Descriptions>

      <Table
        style={{ marginTop: 16 }}
        rowKey="number"
        dataSource={c.orders}
        pagination={false}
        columns={[
          { title: "Order", dataIndex: "number" },
          { title: "Total", dataIndex: "total", render: (v) => inr(v) },
          { title: "Status", dataIndex: "status", render: (v) => <Tag>{v}</Tag> },
          { title: "Payment", dataIndex: "paymentStatus", render: (v) => <Tag>{v}</Tag> },
          { title: "Placed", dataIndex: "createdAt", render: fmtDate },
        ]}
      />
    </Show>
  );
}
