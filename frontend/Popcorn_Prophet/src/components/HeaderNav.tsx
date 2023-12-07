import { Burger, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import styles from "./HeaderNav.module.css";
import NavbarLinks from "./NavbarLinks";
import Icon from "./Icon";

function HeaderNav() {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <>
      <Icon />
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

      <NavbarLinks burger={false} />
    </>
  );
}

export default HeaderNav;
