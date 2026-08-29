import {
  List,
  useTable,
  EditButton,
  DeleteButton,
  Create,
  Edit,
  useForm,
} from "@refinedev/antd";
import { Form, Input, InputNumber, Rate, Space, Switch, Table, Tag } from "antd";

/* ---------------- hero slides ---------------- */
export function SlideList() {
  const { tableProps } = useTable({
    resource: "content/slides",
    sorters: { initial: [{ field: "sortOrder", order: "asc" }] },
  });
  return (
    <List resource="content/slides">
      <Table {...tableProps} rowKey="id" pagination={false}>
        <Table.Column
          title="Image"
          dataIndex="imageDesktop"
          render={(v) => <img src={v} alt="" width={80} height={45} style={{ objectFit: "cover" }} />}
        />
        <Table.Column title="Headline" dataIndex="headline" />
        <Table.Column title="CTA" dataIndex="ctaLabel" />
        <Table.Column title="Order" dataIndex="sortOrder" />
        <Table.Column
          title="Active"
          dataIndex="active"
          render={(v) => <Tag color={v ? "green" : "default"}>{v ? "Yes" : "No"}</Tag>}
        />
        <Table.Column
          title=""
          render={(_, r: { id: string }) => (
            <Space>
              <EditButton hideText size="small" resource="content/slides" recordItemId={r.id} />
              <DeleteButton hideText size="small" resource="content/slides" recordItemId={r.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}

function SlideForm({ formProps }: { formProps: Record<string, unknown> }) {
  return (
    <Form {...formProps} layout="vertical">
      <Form.Item label="Desktop image URL" name="imageDesktop" rules={[{ required: true }]}>
        <Input placeholder="https://…" />
      </Form.Item>
      <Form.Item label="Mobile image URL" name="imageMobile" rules={[{ required: true }]}>
        <Input placeholder="https://…" />
      </Form.Item>
      <Form.Item label="Headline" name="headline">
        <Input />
      </Form.Item>
      <Form.Item label="Sub-text" name="sub">
        <Input />
      </Form.Item>
      <Space size="large">
        <Form.Item label="CTA label" name="ctaLabel">
          <Input />
        </Form.Item>
        <Form.Item label="CTA link" name="ctaHref">
          <Input placeholder="/collections/kurtis" />
        </Form.Item>
        <Form.Item label="Sort order" name="sortOrder" initialValue={0}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Active" name="active" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
      </Space>
    </Form>
  );
}

export function SlideCreate() {
  const { formProps, saveButtonProps } = useForm({ resource: "content/slides", redirect: "list" });
  return (
    <Create resource="content/slides" saveButtonProps={saveButtonProps}>
      <SlideForm formProps={formProps as unknown as Record<string, unknown>} />
    </Create>
  );
}
export function SlideEdit() {
  const { formProps, saveButtonProps } = useForm({ resource: "content/slides", redirect: "list" });
  return (
    <Edit resource="content/slides" saveButtonProps={saveButtonProps}>
      <SlideForm formProps={formProps as unknown as Record<string, unknown>} />
    </Edit>
  );
}

/* ---------------- testimonials ---------------- */
export function TestimonialList() {
  const { tableProps } = useTable({
    resource: "content/testimonials",
    sorters: { initial: [{ field: "sortOrder", order: "asc" }] },
  });
  return (
    <List resource="content/testimonials">
      <Table {...tableProps} rowKey="id" pagination={false}>
        <Table.Column title="Author" dataIndex="author" />
        <Table.Column title="Location" dataIndex="location" />
        <Table.Column title="Rating" dataIndex="rating" render={(v) => <Rate disabled value={v} />} />
        <Table.Column title="Quote" dataIndex="quote" ellipsis />
        <Table.Column
          title="Active"
          dataIndex="active"
          render={(v) => <Tag color={v ? "green" : "default"}>{v ? "Yes" : "No"}</Tag>}
        />
        <Table.Column
          title=""
          render={(_, r: { id: string }) => (
            <Space>
              <EditButton hideText size="small" resource="content/testimonials" recordItemId={r.id} />
              <DeleteButton hideText size="small" resource="content/testimonials" recordItemId={r.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}

function TestimonialForm({ formProps }: { formProps: Record<string, unknown> }) {
  return (
    <Form {...formProps} layout="vertical">
      <Space size="large">
        <Form.Item label="Author" name="author" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Location" name="location">
          <Input />
        </Form.Item>
        <Form.Item label="Rating" name="rating" initialValue={5}>
          <Rate />
        </Form.Item>
      </Space>
      <Form.Item label="Quote" name="quote" rules={[{ required: true }]}>
        <Input.TextArea rows={3} />
      </Form.Item>
      <Space size="large">
        <Form.Item label="Sort order" name="sortOrder" initialValue={0}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Active" name="active" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
      </Space>
    </Form>
  );
}

export function TestimonialCreate() {
  const { formProps, saveButtonProps } = useForm({
    resource: "content/testimonials",
    redirect: "list",
  });
  return (
    <Create resource="content/testimonials" saveButtonProps={saveButtonProps}>
      <TestimonialForm formProps={formProps as unknown as Record<string, unknown>} />
    </Create>
  );
}
export function TestimonialEdit() {
  const { formProps, saveButtonProps } = useForm({
    resource: "content/testimonials",
    redirect: "list",
  });
  return (
    <Edit resource="content/testimonials" saveButtonProps={saveButtonProps}>
      <TestimonialForm formProps={formProps as unknown as Record<string, unknown>} />
    </Edit>
  );
}

/* ---------------- pages ---------------- */
export function PageList() {
  const { tableProps } = useTable({
    resource: "content/pages",
    sorters: { initial: [{ field: "slug", order: "asc" }] },
  });
  return (
    <List resource="content/pages">
      <Table {...tableProps} rowKey="id" pagination={false}>
        <Table.Column title="Slug" dataIndex="slug" render={(v) => <Tag>{v}</Tag>} />
        <Table.Column title="Title" dataIndex="title" />
        <Table.Column
          title=""
          render={(_, r: { id: string }) => (
            <Space>
              <EditButton hideText size="small" resource="content/pages" recordItemId={r.id} />
              <DeleteButton hideText size="small" resource="content/pages" recordItemId={r.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}

function PageForm({ formProps }: { formProps: Record<string, unknown> }) {
  return (
    <Form {...formProps} layout="vertical">
      <Form.Item label="Slug" name="slug" rules={[{ required: true }]}>
        <Input placeholder="shipping-policy" />
      </Form.Item>
      <Form.Item label="Title" name="title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Body (markdown)" name="bodyMarkdown" rules={[{ required: true }]}>
        <Input.TextArea rows={12} />
      </Form.Item>
    </Form>
  );
}

export function PageCreate() {
  const { formProps, saveButtonProps } = useForm({ resource: "content/pages", redirect: "list" });
  return (
    <Create resource="content/pages" saveButtonProps={saveButtonProps}>
      <PageForm formProps={formProps as unknown as Record<string, unknown>} />
    </Create>
  );
}
export function PageEdit() {
  const { formProps, saveButtonProps } = useForm({ resource: "content/pages", redirect: "list" });
  return (
    <Edit resource="content/pages" saveButtonProps={saveButtonProps}>
      <PageForm formProps={formProps as unknown as Record<string, unknown>} />
    </Edit>
  );
}
