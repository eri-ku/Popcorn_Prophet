import { useEffect, useState } from "react";
import styles from "./AdminPage.module.css";
import {
  Flex,
  Group,
  Text,
  Accordion,
  Button,
  Pagination,
  Modal,
} from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
export interface MemberModel {
  id: string;
  username: string;
  email: string;
  roles: any[];
  password: string;
}

function AccordionLabel({ username, email }: MemberModel) {
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
  const [members, setMembers] = useState<MemberModel[]>([]);
  const [activePage, setActivePage] = useState<number>(1);

  const [id, setId] = useState<string>("-1");

  const [totalPages, setTotalPages] = useState<number>(0);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    fetchMembers();
  }, [activePage]);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function deleteMember(id: string) {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `${localStorage.getItem("token")}`,
    };
    const res = await fetch(`http://localhost:8080/auth/${id}`, {
      headers,
      method: "Delete",
    });
    if (!res.ok) {
      throw new Error("Something went wrong!");
    }
    fetchMembers();
    close();
  }

  async function fetchMembers() {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `${localStorage.getItem("token")}`,
    };
    const res = await fetch(
      `http://localhost:8080/auth?page=${activePage - 1}`,
      {
        headers,
      }
    );
    if (!res.ok) {
      throw new Error("Something went wrong!");
    }
    const data = await res.json();
    const newMembers = [];
    console.log(data);
    for (const key in Object.keys(data.members)) {
      newMembers.push({
        id: data.members[key].id,
        username: data.members[key].username,
        email: data.members[key].email,
        roles: data.members[key].roles,
        password: "",
      });
    }
    setMembers(newMembers);
    setTotalPages(data.totalPages);
    if (activePage > data.totalPages && data.totalPages != 0) {
      setActivePage(data.totalPages);
    }
  }

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
            <Button
              onClick={() => {
                setId(item.id);
                open();
              }}
            >
              Delete User
            </Button>
          </Flex>
        </Flex>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Flex className={styles.container} direction={"column"}>
      <Flex>
        <Accordion p={20} variant="separated" className={styles.acc}>
          {items}
        </Accordion>
      </Flex>
      <Flex justify={"center"}>
        <Pagination
          m={"1rem"}
          total={totalPages}
          size="lg"
          withEdges
          value={activePage}
          onChange={setActivePage}
        />
      </Flex>

      <Modal opened={opened} onClose={close} centered>
        <Flex gap={10} justify="center" align="center">
          <Text>Do you really want to delete this member?</Text>
          <Button onClick={() => deleteMember(id)}>OK</Button>
        </Flex>
      </Modal>
    </Flex>
  );
}

export default AdminPage;
