import styles from "./ApiHeader.module.css";
import { useDisclosure } from "@mantine/hooks";
import {
  Group,
  Burger,
  Autocomplete,
  rem,
  Drawer,
  Center,
  Button,
} from "@mantine/core";
import Icon from "./Icon";
import { IconSearch } from "@tabler/icons-react";
import NavbarLinks from "./NavbarLinks";
import { getAuth } from "../App";

// const links = [{ link: "/", label: "Homepage" }];
function ApiHeader({ children }: { children: any }) {
  const [opened, { toggle, close }] = useDisclosure(false);

  // const items = links.map((link) => (
  //   <Link key={link.label} to={link.link} className={styles.link}>
  //     {link.label}
  //   </Link>
  // ));

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
          {opened && (
            <Drawer.Root
              opened={opened}
              onClose={close}
              closeOnEscape={true}
              position="left"
              closeOnClickOutside={true}
              hiddenFrom="sm"
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
          )}
          <Icon inApi={true} />
          <Button variant="outline" color="red.2" radius="lg" size="compact-xl">
            {getAuth()}
          </Button>
        </Group>

        {/* <Group ml={50} gap={5} className={styles.links} visibleFrom="sm">
         {items}
        </Group> */}

        <Group mb={5}>
          <Center>
            {children}
            <Autocomplete
              ml={10}
              maw={rem(200)}
              className={styles.search}
              placeholder="Search"
              leftSection={
                <IconSearch
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              }
              data={["Movies", "Tv Shows", "Limited Series", "Theater"]}
            />
          </Center>
        </Group>
      </div>
    </header>
  );
}

export default ApiHeader;
