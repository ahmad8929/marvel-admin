import { List, useTable } from "@refinedev/antd";
import { useUpdate } from "@refinedev/core";
import { InputNumber, Table, Tag, message } from "antd";

export function InventoryList() {
  const { tableProps } = useTable({
    resource: "inventory",
    sorters: { initial: [{ field: "sku", order: "asc" }] },
  });
  const { mutate } = useUpdate();

  return (
    <List title="Inventory" canCreate={false}>
      <Table {...tableProps} rowKey="id">
        <Table.Column title="Product" dataIndex={["product", "title"]} />
        <Table.Column title="SKU" dataIndex="sku" />
        <Table.Column title="Size" dataIndex="size" />
        <Table.Column title="Colour" dataIndex="color" />
        <Table.Column
          title="Stock"
          dataIndex="stock"
          render={(value: number, record: { id: string }) => (
            <InputNumber
              min={0}
              defaultValue={value}
              onBlur={(e) => {
                const next = Number(e.currentTarget.value);
                if (next !== value && Number.isFinite(next)) {
                  mutate(
                    { resource: "inventory", id: record.id, values: { stock: next } },
                    { onSuccess: () => message.success("Stock updated") },
                  );
                }
              }}
            />
          )}
        />
        <Table.Column
          title=""
          dataIndex="stock"
          render={(v: number) =>
            v === 0 ? <Tag color="red">Out</Tag> : v < 5 ? <Tag color="orange">Low</Tag> : null
          }
        />
      </Table>
    </List>
  );
}
