import { Authenticated, Refine } from "@refinedev/core";
import {
  ThemedLayout,
  useNotificationProvider,
  ErrorComponent,
  AuthPage,
} from "@refinedev/antd";
import routerProvider, {
  CatchAllNavigate,
  NavigateToResource,
} from "@refinedev/react-router";
import "@refinedev/antd/dist/reset.css";
import {
  AppstoreOutlined,
  DashboardOutlined,
  FileTextOutlined,
  GiftOutlined,
  InboxOutlined,
  PictureOutlined,
  SettingOutlined,
  ShoppingOutlined,
  TagsOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { App as AntdApp, ConfigProvider } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";

import { antdTheme } from "./theme";
import { config } from "./config";
import { dataProvider } from "./providers/dataProvider";
import { authProvider } from "./providers/authProvider";
import { Title } from "./components/Title";
import { Dashboard } from "./pages/Dashboard";
import { ProductList, ProductCreate, ProductEdit } from "./pages/products";
import { CategoryList, CategoryCreate, CategoryEdit } from "./pages/categories";
import { InventoryList } from "./pages/inventory";
import { OrderList, OrderShow } from "./pages/orders";
import { CouponList, CouponCreate, CouponEdit } from "./pages/coupons";
import { CustomerList, CustomerShow } from "./pages/customers";
import {
  SlideList,
  SlideCreate,
  SlideEdit,
  TestimonialList,
  TestimonialCreate,
  TestimonialEdit,
  PageList,
  PageCreate,
  PageEdit,
} from "./pages/content";
import { SettingsPage } from "./pages/settings";

function MisconfigBanner() {
  if (!config.misconfigured) return null;
  return (
    <div
      style={{
        background: "#B3261E",
        color: "#fff",
        padding: "10px 16px",
        fontSize: 13,
        textAlign: "center",
      }}
    >
      This build has no API URL. Set <code>VITE_API_URL</code> in Vercel →
      Settings → Environment Variables to <code>https://&lt;your-api&gt;/api/v1</code>
      and redeploy.
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MisconfigBanner />
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
              disableTelemetry: true,
              title: { text: "Marvel's Admin", icon: <ShoppingOutlined /> },
            }}
            resources={[
              { name: "dashboard", list: "/", meta: { label: "Dashboard", icon: <DashboardOutlined /> } },
              { name: "products", list: "/products", create: "/products/create", edit: "/products/edit/:id", meta: { icon: <ShoppingOutlined /> } },
              { name: "categories", list: "/categories", create: "/categories/create", edit: "/categories/edit/:id", meta: { icon: <AppstoreOutlined /> } },
              { name: "inventory", list: "/inventory", meta: { icon: <InboxOutlined /> } },
              { name: "orders", list: "/orders", show: "/orders/show/:id", meta: { icon: <TagsOutlined /> } },
              { name: "coupons", list: "/coupons", create: "/coupons/create", edit: "/coupons/edit/:id", meta: { icon: <GiftOutlined /> } },
              { name: "customers", list: "/customers", show: "/customers/show/:id", meta: { icon: <TeamOutlined /> } },
              { name: "content/slides", list: "/content/slides", create: "/content/slides/create", edit: "/content/slides/edit/:id", meta: { label: "Hero slides", icon: <PictureOutlined /> } },
              { name: "content/testimonials", list: "/content/testimonials", create: "/content/testimonials/create", edit: "/content/testimonials/edit/:id", meta: { label: "Testimonials", icon: <PictureOutlined /> } },
              { name: "content/pages", list: "/content/pages", create: "/content/pages/create", edit: "/content/pages/edit/:id", meta: { label: "Pages", icon: <FileTextOutlined /> } },
              { name: "settings", list: "/settings", meta: { icon: <SettingOutlined /> } },
            ]}
          >
            <Routes>
              <Route
                element={
                  <Authenticated key="app" fallback={<CatchAllNavigate to="/login" />}>
                    <ThemedLayout Title={Title}>
                      <Outlet />
                    </ThemedLayout>
                  </Authenticated>
                }
              >
                <Route index element={<Dashboard />} />

                <Route path="/products">
                  <Route index element={<ProductList />} />
                  <Route path="create" element={<ProductCreate />} />
                  <Route path="edit/:id" element={<ProductEdit />} />
                </Route>

                <Route path="/categories">
                  <Route index element={<CategoryList />} />
                  <Route path="create" element={<CategoryCreate />} />
                  <Route path="edit/:id" element={<CategoryEdit />} />
                </Route>

                <Route path="/inventory" element={<InventoryList />} />

                <Route path="/orders">
                  <Route index element={<OrderList />} />
                  <Route path="show/:id" element={<OrderShow />} />
                </Route>

                <Route path="/coupons">
                  <Route index element={<CouponList />} />
                  <Route path="create" element={<CouponCreate />} />
                  <Route path="edit/:id" element={<CouponEdit />} />
                </Route>

                <Route path="/customers">
                  <Route index element={<CustomerList />} />
                  <Route path="show/:id" element={<CustomerShow />} />
                </Route>

                <Route path="/content/slides">
                  <Route index element={<SlideList />} />
                  <Route path="create" element={<SlideCreate />} />
                  <Route path="edit/:id" element={<SlideEdit />} />
                </Route>
                <Route path="/content/testimonials">
                  <Route index element={<TestimonialList />} />
                  <Route path="create" element={<TestimonialCreate />} />
                  <Route path="edit/:id" element={<TestimonialEdit />} />
                </Route>
                <Route path="/content/pages">
                  <Route index element={<PageList />} />
                  <Route path="create" element={<PageCreate />} />
                  <Route path="edit/:id" element={<PageEdit />} />
                </Route>

                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<ErrorComponent />} />
              </Route>

              <Route
                element={
                  <Authenticated key="auth" fallback={<Outlet />}>
                    <NavigateToResource resource="dashboard" />
                  </Authenticated>
                }
              >
                <Route
                  path="/login"
                  element={
                    <AuthPage
                      type="login"
                      title={<Title collapsed={false} />}
                      registerLink={false}
                      forgotPasswordLink={false}
                      rememberMe={false}
                    />
                  }
                />
              </Route>
            </Routes>
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}
