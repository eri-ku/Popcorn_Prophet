import { Box } from "@mantine/core";
import ApiHeader from "./ApiHeader";
import { ApiNavbar } from "./ApiNavbar";
import styles from "./ApiLayout.module.css";
import { Outlet } from "react-router-dom";
import { ContextProvider } from "./ContextProvider";

function ApiLayout({ open }: { open: Function }) {
  return (
    <Box className={styles.gridContainer}>
      <ContextProvider>
        <ApiHeader open={open} />
        <ApiNavbar />
        <Outlet />
      </ContextProvider>
    </Box>
  );
}

export default ApiLayout;
