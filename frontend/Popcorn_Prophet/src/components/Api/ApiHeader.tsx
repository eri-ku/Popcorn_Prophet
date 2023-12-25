import styles from "./ApiHeader.module.css";
import { useDisclosure } from "@mantine/hooks";
import {
  Group,
  Burger,
  Autocomplete,
  rem,
  Drawer,
  Button,
  Flex,
  Avatar,
  Indicator,
  Anchor,
} from "@mantine/core";
import Icon from "../Misc/Icon";
import { IconSearch } from "@tabler/icons-react";
import NavbarLinks from "../Misc/NavbarLinks";
import { getAuth } from "../../App";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "./Cart/CartItemContext";

// const links = [{ link: "/", label: "Homepage" }];
function ApiHeader({ open }: { open: any }) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { sizeOfCart } = useCart();

  const handleClick = () => {
    if (location.pathname === "/api/cart") {
      window.location.reload();
    } else {
      navigate("/api/cart");
    }
  };

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
          <Icon />
          <Button
            component={Link}
            variant="outline"
            color="red.2"
            radius="lg"
            size="compact-xl"
            to="/user"
          >
            {getAuth()}
          </Button>
        </Group>

        {/* <Group ml={50} gap={5} className={styles.links} visibleFrom="sm">
         {items}
        </Group> */}

        <Flex className={styles.actionHeader} align={"center"}>
          <Button
            variant="outline"
            color="red.2"
            radius="lg"
            size="compact-xl"
            onClick={open}
          >
            Create Product
          </Button>
          <Anchor component={Link} to="/api/cart" onClick={handleClick}>
            <Indicator
              processing
              mt={3}
              color="red"
              position="top-start"
              size={20}
              label={sizeOfCart()}
            >
              <Avatar src="/icons8-cart-48.png"></Avatar>
            </Indicator>
          </Anchor>
          <Autocomplete
            classNames={{ input: styles.inputAutoComplete }}
            placeholder="Search"
            mb={10}
            leftSection={
              <IconSearch
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
            data={["Movies", "Tv Shows", "Limited Series", "Theater"]}
          />
        </Flex>
      </div>
    </header>
  );
}

export default ApiHeader;
