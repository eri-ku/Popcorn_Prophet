import { Flex, Portal, rem } from "@mantine/core";
import styles from "./NavbarLinks.module.css";
import NavButton from "./NavButton";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Login from "../Login/Login";
import { getAuth } from "../../App";

function NavbarLinks({ burger }: { burger: boolean }) {
  const [opened, handlers] = useDisclosure(false);

  const isAuth = getAuth() ? true : false;

  return (
    <>
      <Flex
        mr={"11rem"}
        gap="0.5rem"
        mt="1rem"
        visibleFrom={!burger ? "md" : ""}
        direction={burger ? "column" : "row"}
      >
        <NavButton to="/homepage">Home</NavButton>
        <NavButton to="/register">Register</NavButton>
        {!isAuth && (
          <Button
            variant="outline"
            color="red.2"
            radius="lg"
            size="compact-xl"
            onClick={handlers.toggle}
            className={styles.rootButton}
          >
            Login
          </Button>
        )}

        {!isAuth ? (
          <Button
            variant="outline"
            color="red.2"
            radius="lg"
            size="compact-xl"
            onClick={handlers.toggle}
            className={styles.rootButton}
          >
            Api
          </Button>
        ) : (
          <NavButton to="/api">Api</NavButton>
        )}
      </Flex>
      <Portal>{opened && <Login handlers={handlers} opened={opened} />}</Portal>
    </>
  );
}
export default NavbarLinks;
