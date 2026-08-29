import { Card, Space, Typography } from "antd";
import { brand } from "../theme";

const { Title, Paragraph, Text } = Typography;

/** Phase 0 placeholder. Real dashboard (revenue, orders by status, low-stock) lands in Phase 5. */
export function Dashboard() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%", maxWidth: 720 }}>
      <div>
        <Title level={3} style={{ color: brand.primary, marginBottom: 4 }}>
          Marvel&apos;s Online Clothings — Admin
        </Title>
        <Text type="secondary">Catalog · orders · content · settings</Text>
      </div>

      <Card
        style={{ borderColor: brand.line, background: brand.surface }}
        styles={{ body: { padding: 24 } }}
      >
        <Paragraph style={{ marginBottom: 8 }}>
          Scaffold is in place. The management screens are built in{" "}
          <Text strong>Phase 5</Text>:
        </Paragraph>
        <ul style={{ margin: 0, paddingLeft: 20, color: brand.ink }}>
          <li>Products — CRUD, image manager, variant matrix, CSV import</li>
          <li>Categories, Inventory</li>
          <li>Orders — status, tracking, Cashfree refund</li>
          <li>Coupons, Customers</li>
          <li>Content — hero slides, banners, testimonials, announcement bar, pages</li>
          <li>Settings — shipping, COD, store info, coming-soon toggle</li>
        </ul>
      </Card>
    </Space>
  );
}
