import { Box } from "@mantine/core";
import ApiHeader from "./ApiHeader";
import { ApiNavbar } from "./ApiNavbar";
import styles from "./ApiLayout.module.css";
import { Outlet } from "react-router-dom";
import { CartItemProvider } from "./Cart/CartItemContext";

function ApiLayout({ open }: { open: Function }) {
  return (
    <Box className={styles.gridContainer}>
      <CartItemProvider>
        <ApiHeader open={open} />
        <ApiNavbar />
        <Outlet />
      </CartItemProvider>
    </Box>
  );
}

export default ApiLayout;
