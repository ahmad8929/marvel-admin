import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Table, Tag, Typography } from "antd";
import { Link } from "react-router";
import { adminHttp } from "../providers/dataProvider";
import { inr, fmtDate } from "../lib/money";
import { brand } from "../theme";

type Stats = {
  revenue7: number;
  revenue30: number;
  orders7: number;
  orders30: number;
  aov30: number;
  customers: number;
  ordersByStatus: { status: string; count: number }[];
  lowStock: { id: string; sku: string; stock: number; product: { title: string; slug: string } }[];
  latestOrders: { number: string; total: number; status: string; paymentStatus: string; createdAt: string }[];
};

export function Dashboard() {
  const [s, setS] = useState<Stats | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    adminHttp("/stats")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to load stats"))))
      .then(setS)
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <Typography.Text type="danger">{err}</Typography.Text>;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Typography.Title level={3} style={{ color: brand.primary, margin: 0 }}>
        Dashboard
      </Typography.Title>

      <Row gutter={16}>
        <Col xs={12} md={6}>
          <Card><Statistic title="Revenue (30d)" value={inr(s?.revenue30)} /></Card>
        </Col>
        <Col xs={12} md={6}>
          <Card><Statistic title="Orders (30d)" value={s?.orders30 ?? 0} /></Card>
        </Col>
        <Col xs={12} md={6}>
          <Card><Statistic title="AOV (30d)" value={inr(s?.aov30)} /></Card>
        </Col>
        <Col xs={12} md={6}>
          <Card><Statistic title="Customers" value={s?.customers ?? 0} /></Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="Low stock (< 5)">
            <Table
              size="small"
              rowKey="id"
              pagination={false}
              dataSource={s?.lowStock ?? []}
              columns={[
                { title: "Product", dataIndex: ["product", "title"] },
                { title: "SKU", dataIndex: "sku" },
                { title: "Stock", dataIndex: "stock", render: (v) => <Tag color={v === 0 ? "red" : "orange"}>{v}</Tag> },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Latest orders">
            <Table
              size="small"
              rowKey="number"
              pagination={false}
              dataSource={s?.latestOrders ?? []}
              columns={[
                { title: "Order", dataIndex: "number", render: (v) => <Link to={`/orders`}>{v}</Link> },
                { title: "Total", dataIndex: "total", render: inr },
                { title: "Status", dataIndex: "status", render: (v) => <Tag>{v}</Tag> },
                { title: "Placed", dataIndex: "createdAt", render: fmtDate },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
