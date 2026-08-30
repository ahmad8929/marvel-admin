import { List, useTable, ShowButton, Show } from "@refinedev/antd";
import { useShow, useInvalidate } from "@refinedev/core";
import {
  Button,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Timeline,
  Typography,
  message,
} from "antd";
import { useState } from "react";
import { adminHttp } from "../providers/dataProvider";
import { inr, fmtDate } from "../lib/money";

const STATUS = ["PENDING", "PAID", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
const color: Record<string, string> = {
  PAID: "green",
  SHIPPED: "blue",
  DELIVERED: "green",
  CANCELLED: "red",
  REFUNDED: "volcano",
  PENDING: "gold",
  PACKED: "cyan",
};

export function OrderList() {
  const { tableProps } = useTable({
    sorters: { initial: [{ field: "createdAt", order: "desc" }] },
    filters: {
      initial: [],
    },
  });
  return (
    <List canCreate={false}>
      <Table {...tableProps} rowKey="id">
        <Table.Column title="Order" dataIndex="number" />
        <Table.Column title="Email" dataIndex="email" />
        <Table.Column title="Total" dataIndex="total" render={(v) => inr(v)} />
        <Table.Column title="Payment" dataIndex="paymentMethod" />
        <Table.Column
          title="Pay status"
          dataIndex="paymentStatus"
          render={(v) => <Tag color={color[v]}>{v}</Tag>}
        />
        <Table.Column
          title="Status"
          dataIndex="status"
          render={(v) => <Tag color={color[v]}>{v}</Tag>}
        />
        <Table.Column title="Placed" dataIndex="createdAt" render={fmtDate} />
        <Table.Column
          title=""
          render={(_, r: { id: string }) => (
            <ShowButton hideText size="small" recordItemId={r.id} />
          )}
        />
      </Table>
    </List>
  );
}

export function OrderShow() {
  const { query } = useShow();
  const invalidate = useInvalidate();
  const order = query?.data?.data as
    | {
        id: string;
        number: string;
        email: string;
        phone: string;
        status: string;
        paymentMethod: string;
        paymentStatus: string;
        subtotal: number;
        discount: number;
        shippingFee: number;
        codFee: number;
        platformFee: number;
        handlingFee: number;
        total: number;
        couponCode?: string;
        trackingCarrier?: string;
        trackingNumber?: string;
        shippingAddress: Record<string, string>;
        createdAt: string;
        items: {
          title: string;
          size: string;
          color: string;
          image: string;
          unitPrice: number;
          qty: number;
        }[];
        events: { status: string; note?: string; createdAt: string }[];
      }
    | undefined;

  const [refundOpen, setRefundOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!order) return <Show isLoading />;

  const act = async (path: string, body: unknown) => {
    setBusy(true);
    const res = await adminHttp(`/orders/${order.id}${path}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (res.ok) {
      message.success("Updated");
      invalidate({ resource: "orders", invalidates: ["detail"], id: order.id });
    } else {
      message.error("Failed");
    }
  };

  return (
    <Show
      isLoading={query?.isLoading}
      title={`Order ${order.number}`}
      headerButtons={
        <Space>
          <Select
            value={order.status}
            style={{ width: 150 }}
            onChange={(v) => act("/status", { status: v })}
            options={STATUS.map((s) => ({ label: s, value: s }))}
          />
          {order.paymentStatus === "PAID" && (
            <Button danger onClick={() => setRefundOpen(true)}>
              Refund
            </Button>
          )}
        </Space>
      }
    >
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Email">{order.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{order.phone}</Descriptions.Item>
        <Descriptions.Item label="Payment">
          {order.paymentMethod} · <Tag color={color[order.paymentStatus]}>{order.paymentStatus}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Placed">{fmtDate(order.createdAt)}</Descriptions.Item>
        <Descriptions.Item label="Address" span={2}>
          {order.shippingAddress?.fullName}, {order.shippingAddress?.line1}
          {order.shippingAddress?.line2 ? `, ${order.shippingAddress.line2}` : ""},{" "}
          {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
          {order.shippingAddress?.pincode}
        </Descriptions.Item>
      </Descriptions>

      <Table
        style={{ marginTop: 16 }}
        rowKey={(_, i) => String(i)}
        pagination={false}
        dataSource={order.items}
        columns={[
          {
            title: "Item",
            render: (_, r) => (
              <Space>
                <img src={r.image} alt="" width={32} height={42} style={{ objectFit: "cover" }} />
                {r.title}
              </Space>
            ),
          },
          { title: "Variant", render: (_, r) => `${r.size} / ${r.color}` },
          { title: "Qty", dataIndex: "qty" },
          { title: "Price", dataIndex: "unitPrice", render: (v) => inr(v) },
          { title: "Line", render: (_, r) => inr(r.unitPrice * r.qty) },
        ]}
      />

      <Descriptions style={{ marginTop: 16 }} column={1} size="small">
        <Descriptions.Item label="Subtotal">{inr(order.subtotal)}</Descriptions.Item>
        {order.discount > 0 && (
          <Descriptions.Item label={`Discount ${order.couponCode ? `(${order.couponCode})` : ""}`}>
            -{inr(order.discount)}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Shipping">{inr(order.shippingFee)}</Descriptions.Item>
        {order.platformFee > 0 && (
          <Descriptions.Item label="Platform fee">{inr(order.platformFee)}</Descriptions.Item>
        )}
        {order.handlingFee > 0 && (
          <Descriptions.Item label="Handling / misc">{inr(order.handlingFee)}</Descriptions.Item>
        )}
        {order.codFee > 0 && (
          <Descriptions.Item label="COD fee">{inr(order.codFee)}</Descriptions.Item>
        )}
        <Descriptions.Item label="Total">
          <strong>{inr(order.total)}</strong>
        </Descriptions.Item>
      </Descriptions>

      <Typography.Title level={5} style={{ marginTop: 24 }}>
        Tracking
      </Typography.Title>
      <Form
        layout="inline"
        initialValues={{
          trackingCarrier: order.trackingCarrier,
          trackingNumber: order.trackingNumber,
        }}
        onFinish={(v) => act("/tracking", v)}
      >
        <Form.Item name="trackingCarrier" rules={[{ required: true }]}>
          <Input placeholder="Carrier (e.g. Delhivery)" />
        </Form.Item>
        <Form.Item name="trackingNumber" rules={[{ required: true }]}>
          <Input placeholder="Tracking number" />
        </Form.Item>
        <Button htmlType="submit" loading={busy}>
          Save & mark shipped
        </Button>
      </Form>

      <Typography.Title level={5} style={{ marginTop: 24 }}>
        Timeline
      </Typography.Title>
      <Timeline
        items={(order.events ?? []).map((e) => ({
          children: (
            <>
              <strong>{e.status}</strong>
              {e.note ? ` — ${e.note}` : ""}
              <div style={{ fontSize: 12, opacity: 0.6 }}>{fmtDate(e.createdAt)}</div>
            </>
          ),
        }))}
      />

      <Modal
        title="Issue refund"
        open={refundOpen}
        confirmLoading={busy}
        onCancel={() => setRefundOpen(false)}
        onOk={async () => {
          const amount = (
            document.getElementById("refund-amount") as HTMLInputElement | null
          )?.value;
          setBusy(true);
          const res = await adminHttp(`/orders/${order.id}/refund`, {
            method: "POST",
            body: JSON.stringify(amount ? { amount: Math.round(Number(amount) * 100) } : {}),
          });
          setBusy(false);
          setRefundOpen(false);
          if (res.ok) {
            message.success("Refund issued");
            invalidate({ resource: "orders", invalidates: ["detail"], id: order.id });
          } else message.error("Refund failed");
        }}
      >
        <p>Leave blank to refund the full total ({inr(order.total)}).</p>
        <InputNumber id="refund-amount" min={0} addonBefore="₹" style={{ width: "100%" }} />
      </Modal>
    </Show>
  );
}
