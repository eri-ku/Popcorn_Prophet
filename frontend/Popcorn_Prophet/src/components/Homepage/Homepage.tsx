import { Box, Flex, Title, Button } from "@mantine/core";
import { IconArrowBarToRight, IconMovie } from "@tabler/icons-react";
import styles from "./Homepage.module.css";
import HeaderNav from "./HeaderNav";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { removeCookie } from "../../App";
function Homepage() {
  const isAuth = sessionStorage.getItem("authMember") ? true : false;

  return (
    <Box className={styles.header}>
      <Flex justify={"space-between"}>
        <HeaderNav />
      </Flex>
      <Flex justify={"center"}>
        <Flex direction={"column"} align={"center"}>
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
              rightSection={
                <IconArrowBarToRight size={24}></IconArrowBarToRight>
              }
            >
              Join in now!
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}

export default Homepage;
