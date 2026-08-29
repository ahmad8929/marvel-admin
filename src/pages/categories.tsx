import {
  List,
  useTable,
  EditButton,
  DeleteButton,
  Create,
  Edit,
  useForm,
} from "@refinedev/antd";
import { Form, Input, InputNumber, Space, Table, Tag } from "antd";

export function CategoryList() {
  const { tableProps } = useTable({ sorters: { initial: [{ field: "sortOrder", order: "asc" }] } });
  return (
    <List>
      <Table {...tableProps} rowKey="id" pagination={false}>
        <Table.Column title="Name" dataIndex="name" />
        <Table.Column title="Slug" dataIndex="slug" />
        <Table.Column
          title="Products"
          dataIndex={["_count", "products"]}
          render={(v) => <Tag>{v ?? 0}</Tag>}
        />
        <Table.Column title="Order" dataIndex="sortOrder" />
        <Table.Column
          title=""
          render={(_, r: { id: string }) => (
            <Space>
              <EditButton hideText size="small" recordItemId={r.id} />
              <DeleteButton hideText size="small" recordItemId={r.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}

function CategoryForm({ formProps }: { formProps: Record<string, unknown> }) {
  return (
    <Form {...formProps} layout="vertical">
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Slug (optional)" name="slug">
        <Input placeholder="auto from name" />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item label="Hero image URL" name="image">
        <Input placeholder="https://…" />
      </Form.Item>
      <Form.Item label="Sort order" name="sortOrder" initialValue={0}>
        <InputNumber min={0} />
      </Form.Item>
    </Form>
  );
}

export function CategoryCreate() {
  const { formProps, saveButtonProps } = useForm({ redirect: "list" });
  return (
    <Create saveButtonProps={saveButtonProps}>
      <CategoryForm formProps={formProps as unknown as Record<string, unknown>} />
    </Create>
  );
}

export function CategoryEdit() {
  const { formProps, saveButtonProps } = useForm({ redirect: "list" });
  return (
    <Edit saveButtonProps={saveButtonProps}>
      <CategoryForm formProps={formProps as unknown as Record<string, unknown>} />
    </Edit>
  );
}
