import styles from "./ApiHeader.module.css";
import { useDisclosure } from "@mantine/hooks";
import {
  Group,
  Burger,
  Drawer,
  Button,
  Flex,
  Avatar,
  Indicator,
  Anchor,
  Modal,
  TextInput,
  Textarea,
  Select,
} from "@mantine/core";
import Icon from "../Misc/Icon";
import NavbarLinks from "../Misc/NavbarLinks";
import { getAuth } from "../../App";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useProvider } from "./ContextProvider";
import { useForm } from "@mantine/form";
import { ArticleModel } from "./ArticlesPage/ArticlesPage";
import NavButton from "../Misc/NavButton";

function ApiHeader({ open }: { open: any }) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { sizeOfCart, openArticleForm } = useProvider();
  const { page } = useParams();

  const handleClick = () => {
    if (location.pathname === "/api/cart") {
      window.location.reload();
    } else {
      navigate("/api/cart");
    }
  };

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
                  <Flex
                    direction={"column"}
                    gap={"1rem"}
                    onClick={() => close()}
                  >
                    <NavButton to="/homepage">Homepage</NavButton>
                    <NavButton to="/api/1">Api</NavButton>
                    <NavButton to="api/articles/1">Articles</NavButton>
                    <NavButton to="/api/wishlist">WishList</NavButton>
                    <NavButton to="/adminPage">Adminpage</NavButton>
                  </Flex>
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
          {/* :page v App route*/}
          {page && (
            <Button
              variant="outline"
              color="red.2"
              radius="lg"
              size="compact-xl"
              onClick={open}
            >
              Create Product
            </Button>
          )}

          {/^\/api\/articles\/\d+$/.test(location.pathname) && (
            <Button
              variant="outline"
              color="red.2"
              radius="lg"
              size="compact-xl"
              onClick={openArticleForm}
            >
              Create Article
            </Button>
          )}

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
        </Flex>
      </div>
    </header>
  );
}

export default ApiHeader;
