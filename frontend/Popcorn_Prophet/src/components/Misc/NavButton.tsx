import { Button } from "@mantine/core";
import styles from "./NavButton.module.css";
import { NavLink } from "react-router-dom";
import cx from "clsx";
function NavButton({ children, to }: { children: any; to: string }) {
  return (
    <Button
      renderRoot={({ className, ...others }) => (
        <NavLink
          to={to}
          className={({ isActive }) =>
            cx(className, { "active-class": isActive })
          }
          {...others}
        />
      )}
      variant="outline"
      color="red.2"
      radius="lg"
      size="compact-xl"
      className={styles.rootButton}
    >
      {children}
    </Button>
  );
}

export default NavButton;
