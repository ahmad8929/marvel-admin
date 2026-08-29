import { useForm } from "@refinedev/antd";
import { Card, Form, Input, InputNumber, Switch, Button, Space, Typography, message } from "antd";
import { brand } from "../theme";

export function SettingsPage() {
  const { formProps, saveButtonProps } = useForm({
    resource: "settings",
    action: "edit",
    id: "1",
    redirect: false,
    onMutationSuccess: () => message.success("Settings saved"),
  });

  return (
    <Card>
      <Typography.Title level={3} style={{ color: brand.primary }}>
        Store settings
      </Typography.Title>
      <Form {...formProps} layout="vertical" style={{ maxWidth: 640 }}>
        <Form.Item label="Announcement bar text" name="announcementText">
          <Input />
        </Form.Item>
        <Form.Item label="Announcement link (optional)" name="announcementHref">
          <Input placeholder="/collections/kurtis" />
        </Form.Item>

        <Space size="large" wrap>
          <Form.Item label="Free-ship threshold (paise)" name="freeShipThreshold">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Flat shipping fee (paise)" name="flatShipFee">
            <InputNumber min={0} />
          </Form.Item>
        </Space>

        <Space size="large" wrap>
          <Form.Item label="COD enabled" name="codEnabled" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="COD fee (paise)" name="codFee">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Coming-soon mode" name="comingSoon" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Space>

        <Space size="large" wrap>
          <Form.Item label="Support email" name="supportEmail">
            <Input />
          </Form.Item>
          <Form.Item label="Support phone" name="supportPhone">
            <Input />
          </Form.Item>
        </Space>

        <Space size="large" wrap>
          <Form.Item label="Instagram URL" name="instagramUrl">
            <Input />
          </Form.Item>
          <Form.Item label="Facebook URL" name="facebookUrl">
            <Input />
          </Form.Item>
          <Form.Item label="WhatsApp number" name="whatsappNumber">
            <Input />
          </Form.Item>
        </Space>

        <Space size="large" wrap>
          <Form.Item label="GSTIN" name="gstin">
            <Input />
          </Form.Item>
        </Space>
        <Form.Item label="Business address" name="businessAddress">
          <Input.TextArea rows={2} />
        </Form.Item>

        <Button type="primary" {...saveButtonProps}>
          Save settings
        </Button>
      </Form>
    </Card>
  );
}
