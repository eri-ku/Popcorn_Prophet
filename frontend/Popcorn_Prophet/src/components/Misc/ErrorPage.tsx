import { Title, Text, Button, Flex, Group } from "@mantine/core";
import styles from "./ErrorPage.module.css";
import { Link } from "react-router-dom";

export function ErrorPage() {
  return (
    <Flex
      className={styles.root}
      justify={"center"}
      align={"center"}
      h={"100vh"}
    >
      <Flex direction={"column"} gap={"1rem"}>
        <div className={styles.label}>500</div>
        <Title className={styles.title}>Something bad just happened...</Title>
        <Text size="lg" ta="center" className={styles.description}>
          Our servers could not handle your request. Don&apos;t worry, our
          development team was already notified.
        </Text>
        <Group justify="center">
          <Button variant="white" size="md" component={Link} to={"/homepage"}>
            Take me back to homepage
          </Button>
        </Group>
      </Flex>
    </Flex>
  );
}
