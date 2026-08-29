import {
  List,
  useTable,
  EditButton,
  DeleteButton,
  Create,
  Edit,
  useForm,
} from "@refinedev/antd";
import { Form, Input, InputNumber, Select, Space, Switch, Table, Tag } from "antd";
import { inr } from "../lib/money";

export function CouponList() {
  const { tableProps } = useTable({ sorters: { initial: [{ field: "createdAt", order: "desc" }] } });
  return (
    <List>
      <Table {...tableProps} rowKey="id" pagination={false}>
        <Table.Column title="Code" dataIndex="code" render={(v) => <Tag>{v}</Tag>} />
        <Table.Column
          title="Discount"
          render={(_, r: { type: string; value: number }) =>
            r.type === "PERCENT" ? `${r.value}%` : inr(r.value)
          }
        />
        <Table.Column title="Min cart" dataIndex="minSubtotal" render={(v) => inr(v)} />
        <Table.Column title="Used" dataIndex="usedCount" />
        <Table.Column
          title="Active"
          dataIndex="active"
          render={(v) => <Tag color={v ? "green" : "default"}>{v ? "Yes" : "No"}</Tag>}
        />
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

function CouponForm({ formProps }: { formProps: Record<string, unknown> }) {
  return (
    <Form {...formProps} layout="vertical">
      <Form.Item label="Code" name="code" rules={[{ required: true }]}>
        <Input style={{ textTransform: "uppercase" }} />
      </Form.Item>
      <Space size="large">
        <Form.Item label="Type" name="type" initialValue="PERCENT" rules={[{ required: true }]}>
          <Select
            options={[
              { label: "Percent (%)", value: "PERCENT" },
              { label: "Flat (paise)", value: "FLAT" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Value" name="value" rules={[{ required: true }]}>
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item label="Min subtotal (paise)" name="minSubtotal" initialValue={0}>
          <InputNumber min={0} />
        </Form.Item>
      </Space>
      <Space size="large">
        <Form.Item label="Max redemptions" name="maxRedemptions">
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item label="Per-user limit" name="perUserLimit">
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item label="Active" name="active" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
      </Space>
    </Form>
  );
}

export function CouponCreate() {
  const { formProps, saveButtonProps } = useForm({ redirect: "list" });
  return (
    <Create saveButtonProps={saveButtonProps}>
      <CouponForm formProps={formProps as unknown as Record<string, unknown>} />
    </Create>
  );
}

export function CouponEdit() {
  const { formProps, saveButtonProps } = useForm({ redirect: "list" });
  return (
    <Edit saveButtonProps={saveButtonProps}>
      <CouponForm formProps={formProps as unknown as Record<string, unknown>} />
    </Edit>
  );
}
