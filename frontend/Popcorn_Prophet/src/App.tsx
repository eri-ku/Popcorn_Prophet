import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Api from "./components/Api/Api";
import Register from "./components/Register/Register";
import ApiLayout from "./components/Api/ApiLayout";
import Homepage from "./components/Homepage/Homepage";
import { useDisclosure } from "@mantine/hooks";
import ProductView from "./components/Api/Product/ProductView";
import Cart from "./components/Api/Cart/Cart";
import AdminPage from "./components/Api/AdminPage/AdminPage";
import ArticlesPage from "./components/Api/ArticlesPage/ArticlesPage";
import User from "./components/Api/UserManagement/User";
import ArticleView from "./components/Api/ArticlesPage/ArticleView";
import WishList from "./components/Api/Product/WishList";
import Cookies from "js-cookie";

export function getAuth() {
  return sessionStorage.getItem("authMember");
}

export function getCartID() {
  return sessionStorage.getItem("cart");
}
export function getMemberID() {
  return sessionStorage.getItem("memberId");
}

function ProtectedRoute({ children }: { children: any }) {
  return getAuth() ? children : <Navigate replace to="homepage" />;
}

export function setCookie(name: string, value: string, expires: number) {
  Cookies.set(name, value, { expires: expires });
}
export function getCookie(name: string) {
  return Cookies.get(name);
}
export function removeCookie(name: string) {
  Cookies.remove(name);
}
export function getXSRFToken() {
  return sessionStorage.getItem("XSRF-TOKEN");
}

export const BASE_URL = "http://localhost:8080/";

import axios from "axios";

axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (config) => {
    if (getCookie("XSRF-TOKEN")) {
      sessionStorage.setItem("XSRF-TOKEN", getCookie("XSRF-TOKEN")!);
    }
    if (getXSRFToken()) {
      config.headers["X-XSRF-TOKEN"] = getXSRFToken();
    }
    if (sessionStorage.getItem("token")) {
      config.headers["Authorization"] = sessionStorage.getItem("token");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate replace to="homepage" />} />
        <Route path="homepage" element={<Homepage />}></Route>
        <Route path="register" element={<Register />}></Route>
        <Route
          element={
            <ProtectedRoute>
              <ApiLayout open={open} />
            </ProtectedRoute>
          }
        >
          {/* children start*/}
          <Route
            path="api"
            element={<Api opened={opened} close={close} open={open} />}
          />
          <Route
            path="api/:page"
            element={<Api opened={opened} close={close} open={open} />}
          />
          <Route path="api/products/:productId" element={<ProductView />} />
          <Route path="api/cart" element={<Cart />} />
          <Route path="api/wishlist" element={<WishList />} />
          <Route path="adminpage" element={<AdminPage />} />
          <Route path="api/articles/:pageNum" element={<ArticlesPage />} />
          <Route
            path="api/articles/article/:articleId"
            element={<ArticleView />}
          />
          <Route path="user" element={<User />} />
          {/* children end */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
