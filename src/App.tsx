import { Refine } from "@refinedev/core";
import { ThemedLayout, useNotificationProvider } from "@refinedev/antd";
import routerProvider from "@refinedev/react-router";
import "@refinedev/antd/dist/reset.css";
import {
  AppstoreOutlined,
  GiftOutlined,
  PictureOutlined,
  SettingOutlined,
  ShoppingOutlined,
  TagsOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { App as AntdApp, ConfigProvider } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";

import { antdTheme } from "./theme";
import { dataProvider } from "./providers/dataProvider";
import { authProvider } from "./providers/authProvider";
import { Dashboard } from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <ConfigProvider theme={antdTheme}>
        <AntdApp>
          <Refine
            dataProvider={dataProvider}
            authProvider={authProvider}
            routerProvider={routerProvider}
            notificationProvider={useNotificationProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              title: { text: "Marvel's Admin" },
            }}
            resources={[
              { name: "products", list: "/products", meta: { icon: <ShoppingOutlined /> } },
              { name: "categories", list: "/categories", meta: { icon: <AppstoreOutlined /> } },
              { name: "orders", list: "/orders", meta: { icon: <TagsOutlined /> } },
              { name: "coupons", list: "/coupons", meta: { icon: <GiftOutlined /> } },
              { name: "customers", list: "/customers", meta: { icon: <TeamOutlined /> } },
              { name: "content", list: "/content", meta: { icon: <PictureOutlined /> } },
              { name: "settings", list: "/settings", meta: { icon: <SettingOutlined /> } },
            ]}
          >
            <Routes>
              <Route
                element={
                  <ThemedLayout>
                    <Outlet />
                  </ThemedLayout>
                }
              >
                <Route index element={<Dashboard />} />
              </Route>
            </Routes>
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}
