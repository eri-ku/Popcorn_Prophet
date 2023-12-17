import { useForm } from "@mantine/form";
import styles from "./User.module.css";
import { Paper, Avatar, Text, Flex, Anchor } from "@mantine/core";
import { Member } from "../AdminPage/AdminPage";

import { IconX, IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function User() {
  return (
    <Flex className={styles.container}>
      <Paper
        radius="lg"
        withBorder
        p="md"
        bg="var(--mantine-color-body)"
        className={styles.small}
      >
        <Avatar src="user.png" size={120} radius={120} mx="auto" />
        <Text ta="center" fz="lg" fw={500} mt="md">
          Jane Fingerlicker
        </Text>
        <Text ta="center" c="dimmed" fz="sm">
          jfingerlicker@me.io • Art director
        </Text>
        <Flex direction={"column"} align={"center"} mt={50} gap={10}>
          <Anchor component={Link} to={"/user/changePassword"}>
            Click to change password{" "}
          </Anchor>
          <Anchor component={Link} to={"/user/changeemail"}>
            Click to change email{" "}
          </Anchor>
        </Flex>
      </Paper>
    </Flex>
  );
}

export default User;
