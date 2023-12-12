import { Box } from "@mantine/core";
import ApiHeader from "./ApiHeader";
import { ApiNavbar } from "./ApiNavbar";
import styles from "./ApiLayout.module.css";
import { Outlet } from "react-router-dom";

function ApiLayout({ open }: { open: Function }) {
  return (
    <Box className={styles.gridContainer}>
      <ApiHeader open={open} />
      <ApiNavbar />
      <Outlet />
    </Box>
  );
}

export default ApiLayout;
