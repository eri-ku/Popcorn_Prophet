import { useEffect, useState } from "react";
import styles from "./AdminPage.module.css";
import { Flex, Group, Text, Accordion, Button } from "@mantine/core";

export interface Member {
  id: number;
  username: string;
  email: string;
  roles: any[];
}

function AccordionLabel({ username, email }: Member) {
  return (
    <Group wrap="nowrap">
      <div>
        <Text>{username}</Text>
        <Text size="sm" c="dimmed" fw={400}>
          {email}
        </Text>
      </div>
    </Group>
  );
}

function AdminPage() {
  const [members, setMembers] = useState<Member[]>([]);
  useEffect(() => {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `${localStorage.getItem("token")}`,
    };
    async function fetchMembers() {
      const res = await fetch("http://localhost:8080/auth", {
        headers,
      });
      if (!res.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await res.json();
      const users = [];
      for (const key in data) {
        users.push({
          id: data[key].id,
          username: data[key].username,
          email: data[key].email,
          roles: data[key].roles,
        });
      }
      users[0].roles.push(
        { id: 2, roleName: "Admin", authority: "Admin" },
        { id: 3, roleName: "Admin", authority: "Admin" }
      );
      setMembers(users);
    }
    fetchMembers();
  }, []);

  const items = members.map((item) => (
    <Accordion.Item
      value={item.id.toString()}
      key={item.id}
      className={styles.item}
    >
      <Accordion.Control>
        <AccordionLabel {...item} />
      </Accordion.Control>
      <Accordion.Panel className={styles.panel}>
        <Flex justify={"space-between"}>
          <Flex direction={"column"} gap={10}>
            <Text>
              <strong>Id: </strong>
              {item.id}
            </Text>
            <Text size="sm">
              <strong>Roles: </strong>
              {item.roles.map((role) => role.roleName).join(", ")}
            </Text>
          </Flex>
          <Flex direction={"column"} gap={10}>
            <Button color="blue">Change role</Button>
            <Button>Delete User</Button>
          </Flex>
        </Flex>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Flex direction={"column"} className={styles.container}>
      <Accordion p={20} variant="separated">
        {items}
      </Accordion>
    </Flex>
  );
}

export default AdminPage;
