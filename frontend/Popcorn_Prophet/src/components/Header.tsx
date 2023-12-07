import { Center, Title, Button } from "@mantine/core";
import { IconArrowBarToRight, IconMovie } from "@tabler/icons-react";
import styles from "./Header.module.css";
import HeaderNav from "./HeaderNav";
import { Link } from "react-router-dom";
function Header() {
  const isAuth = sessionStorage.getItem("authMember") ? true : false;

  return (
    <>
      <Center className={styles.header}>
        <HeaderNav />
        <Title
          className={styles.titleHeader}
          c="red.1"
          order={1}
          size="5rem"
          mb="3rem"
        >
          Popcorn Prophet
        </Title>
        {isAuth || (
          <Button
            component={Link}
            to="/register"
            display="inline-block"
            size="lg"
            leftSection={<IconMovie size={24} />}
            rightSection={<IconArrowBarToRight size={24}></IconArrowBarToRight>}
          >
            Join in now!
          </Button>
        )}
      </Center>
    </>
  );
}

export default Header;
