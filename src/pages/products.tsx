import { List, useTable, EditButton, Create, Edit, useForm } from "@refinedev/antd";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
  message,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useList } from "@refinedev/core";
import { inr } from "../lib/money";
import { config } from "../config";

type Category = { id: string; name: string };

/* ------------- list ------------- */
export function ProductList() {
  const { tableProps } = useTable({
    sorters: { initial: [{ field: "createdAt", order: "desc" }] },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          title="Title"
          dataIndex="title"
          render={(v, r: { images?: { url: string }[] }) => (
            <Space>
              {r.images?.[0] && (
                <img
                  src={r.images[0].url}
                  alt=""
                  width={36}
                  height={48}
                  style={{ objectFit: "cover", borderRadius: 4 }}
                />
              )}
              {v}
            </Space>
          )}
        />
        <Table.Column title="Category" dataIndex={["category", "name"]} />
        <Table.Column title="Price" dataIndex="price" render={(v) => inr(v)} />
        <Table.Column
          title="Variants"
          dataIndex={["_count", "variants"]}
          render={(v) => <Tag>{v}</Tag>}
        />
        <Table.Column
          title="Status"
          dataIndex="status"
          render={(v) => (
            <Tag color={v === "ACTIVE" ? "green" : v === "DRAFT" ? "gold" : "default"}>
              {v}
            </Tag>
          )}
        />
        <Table.Column
          title=""
          render={(_, r: { id: string }) => (
            <EditButton hideText size="small" recordItemId={r.id} />
          )}
        />
      </Table>
    </List>
  );
}

/* ------------- shared form ------------- *
 * Prices are entered in rupees; converted to paise on submit.               */
type FormValues = {
  title: string;
  slug?: string;
  description: string;
  priceRupees: number;
  mrpRupees: number;
  categoryId: string;
  status: string;
  fabric?: string;
  care?: string;
  tags?: string;
  images?: { url: string; alt?: string }[];
  variants?: {
    size: string;
    color: string;
    colorHex?: string;
    sku?: string;
    stock: number;
  }[];
};

function toApiPayload(v: FormValues) {
  return {
    title: v.title,
    slug: v.slug || undefined,
    description: v.description,
    price: Math.round((v.priceRupees ?? 0) * 100),
    mrp: Math.round((v.mrpRupees ?? 0) * 100),
    categoryId: v.categoryId,
    status: v.status,
    fabric: v.fabric || undefined,
    care: v.care || undefined,
    tags:
      typeof v.tags === "string"
        ? v.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    images: (v.images ?? []).filter((im) => im && im.url),
    variants: (v.variants ?? []).map((va) => ({ ...va, stock: Number(va.stock) || 0 })),
  };
}

function ProductForm({
  formProps,
  onFinish,
}: {
  formProps: Record<string, unknown>;
  onFinish: (payload: ReturnType<typeof toApiPayload>) => void;
}) {
  const { result } = useList<Category>({
    resource: "categories",
    pagination: { mode: "off" },
  });
  const categories: Category[] = result?.data ?? [];

  return (
    <Form
      {...formProps}
      layout="vertical"
      onFinish={(values) => onFinish(toApiPayload(values as FormValues))}
    >
      <Form.Item label="Title" name="title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Slug (optional)" name="slug">
        <Input placeholder="auto from title" />
      </Form.Item>
      <Form.Item label="Description" name="description" rules={[{ required: true }]}>
        <Input.TextArea rows={4} />
      </Form.Item>

      <Space size="large" wrap>
        <Form.Item label="Price (₹)" name="priceRupees" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="MRP (₹)" name="mrpRupees" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Category" name="categoryId" rules={[{ required: true }]}>
          <Select
            style={{ minWidth: 200 }}
            options={categories.map((c) => ({ label: c.name, value: c.id }))}
          />
        </Form.Item>
        <Form.Item label="Status" name="status" initialValue="DRAFT">
          <Select
            options={["DRAFT", "ACTIVE", "ARCHIVED"].map((s) => ({ label: s, value: s }))}
          />
        </Form.Item>
      </Space>

      <Space size="large" wrap>
        <Form.Item label="Fabric" name="fabric">
          <Input />
        </Form.Item>
        <Form.Item label="Care" name="care">
          <Input />
        </Form.Item>
      </Space>

      <Form.Item label="Tags (comma separated)" name="tags">
        <Input placeholder="new, cotton, festive" />
      </Form.Item>

      <Typography.Title level={5}>Images</Typography.Title>
      <Form.List name="images">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Space key={field.key} align="baseline" style={{ display: "flex" }}>
                <Form.Item name={[field.name, "url"]} rules={[{ required: true }]}>
                  <Input placeholder="https://…" style={{ width: 340 }} />
                </Form.Item>
                <Form.Item name={[field.name, "alt"]}>
                  <Input placeholder="alt text" />
                </Form.Item>
                <Button danger type="link" onClick={() => remove(field.name)}>
                  Remove
                </Button>
              </Space>
            ))}
            <Space>
              <Button icon={<PlusOutlined />} onClick={() => add({ url: "" })}>
                Add image URL
              </Button>
              <MediaUpload onDone={(url) => add({ url })} />
            </Space>
          </>
        )}
      </Form.List>

      <Typography.Title level={5} style={{ marginTop: 24 }}>
        Variants
      </Typography.Title>
      <Form.List name="variants">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Space key={field.key} align="baseline" wrap>
                <Form.Item name={[field.name, "size"]} rules={[{ required: true }]}>
                  <Input placeholder="Size" style={{ width: 80 }} />
                </Form.Item>
                <Form.Item name={[field.name, "color"]} rules={[{ required: true }]}>
                  <Input placeholder="Colour" style={{ width: 120 }} />
                </Form.Item>
                <Form.Item name={[field.name, "colorHex"]}>
                  <Input placeholder="#hex" style={{ width: 90 }} />
                </Form.Item>
                <Form.Item name={[field.name, "sku"]}>
                  <Input placeholder="SKU (auto)" style={{ width: 150 }} />
                </Form.Item>
                <Form.Item name={[field.name, "stock"]} initialValue={0}>
                  <InputNumber min={0} placeholder="Stock" />
                </Form.Item>
                <Button danger type="link" onClick={() => remove(field.name)}>
                  Remove
                </Button>
              </Space>
            ))}
            <Button icon={<PlusOutlined />} onClick={() => add({ stock: 0 })}>
              Add variant
            </Button>
          </>
        )}
      </Form.List>
    </Form>
  );
}

function MediaUpload({ onDone }: { onDone: (url: string) => void }) {
  return (
    <Upload
      accept="image/*"
      showUploadList={false}
      customRequest={async (opts) => {
        const fd = new FormData();
        fd.append("file", opts.file as Blob);
        fd.append("folder", "products");
        const token = localStorage.getItem("marvels.admin.token");
        const res = await fetch(`${config.adminApiUrl}/media`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          credentials: "include",
          body: fd,
        });
        if (res.ok) {
          const j = await res.json();
          onDone(j.url);
          message.success("Uploaded");
          opts.onSuccess?.(j);
        } else {
          message.error("Upload failed — check media storage config");
          opts.onError?.(new Error("upload failed"));
        }
      }}
    >
      <Button icon={<UploadOutlined />}>Upload image</Button>
    </Upload>
  );
}

export function ProductCreate() {
  const { formProps, saveButtonProps, onFinish } = useForm({ redirect: "list" });
  return (
    <Create saveButtonProps={saveButtonProps}>
      <ProductForm
        formProps={formProps as unknown as Record<string, unknown>}
        onFinish={(payload) => onFinish(payload)}
      />
    </Create>
  );
}

export function ProductEdit() {
  const { formProps, saveButtonProps, onFinish, query } = useForm({ redirect: "list" });
  const record = query?.data?.data as
    | { price?: number; mrp?: number }
    | undefined;

  const merged = {
    ...formProps,
    initialValues: record
      ? {
          ...record,
          priceRupees: (record.price ?? 0) / 100,
          mrpRupees: (record.mrp ?? 0) / 100,
        }
      : formProps.initialValues,
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <ProductForm
        formProps={merged as unknown as Record<string, unknown>}
        onFinish={(payload) => onFinish(payload)}
      />
    </Edit>
  );
}
