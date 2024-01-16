import { Burger, Drawer, Flex, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import styles from "./HeaderNav.module.css";
import NavbarLinks from "../Misc/NavbarLinks";
import Icon from "../Misc/Icon";
import { getAuth } from "../../App";
import { useNavigate } from "react-router-dom";

function HeaderNav() {
  const [opened, { toggle, close }] = useDisclosure();
  const navigate = useNavigate();

  return (
    <>
      <Flex>
        <Icon />
        <Button
          mt={15}
          styles={{ root: { visibility: getAuth() ? "visible" : "hidden" } }}
          variant="outline"
          color="red.2"
          radius="lg"
          size="compact-xl"
          onClick={() => {
            sessionStorage.clear();
            sessionStorage.clear();
            navigate("/");
          }}
        >
          Logout - {getAuth()}
        </Button>
      </Flex>

      <NavbarLinks burger={false} />

      <Burger
        className={styles.burger}
        opened={opened}
        onClick={toggle}
        m="1rem"
        aria-label="Toggle navigation"
        color="red.2"
      />

      <Drawer.Root
        opened={opened}
        onClose={close}
        closeOnEscape={true}
        position="right"
        closeOnClickOutside={true}
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Navigation </Drawer.Title>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>
            <NavbarLinks burger={true} />
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}

export default HeaderNav;
