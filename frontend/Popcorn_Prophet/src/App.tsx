import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Api from "./components/Api";
import Register from "./components/Register";

export function getAuth() {
  return sessionStorage.getItem("authMember");
}

function ProtectedRoute({ children }: { children: any }) {
  return getAuth() ? children : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />}></Route>
        <Route
          path="/api"
          element={
            <ProtectedRoute>
              <Api />
            </ProtectedRoute>
          }
        ></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
