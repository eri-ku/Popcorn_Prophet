import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Api from "./components/Api/Api";
import Register from "./components/Register/Register";
import ApiLayout from "./components/Api/ApiLayout";
import Homepage from "./components/Homepage/Homepage";
import { useDisclosure } from "@mantine/hooks";
import ProductView from "./components/Api/Product/ProductView";
import Cart from "./components/Api/Cart/Cart";

export function getAuth() {
  return sessionStorage.getItem("authMember");
}

function ProtectedRoute({ children }: { children: any }) {
  return getAuth() ? children : <Navigate replace to="homepage" />;
}

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
          <Route path="api/products/:productId" element={<ProductView />} />
          <Route path="api/cart" element={<Cart />} />
          {/* children end */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
