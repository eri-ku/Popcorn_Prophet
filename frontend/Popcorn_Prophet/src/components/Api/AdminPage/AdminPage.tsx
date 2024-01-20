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
  MultiSelect,
  Input,
} from "@mantine/core";

import { useForm } from "@mantine/form";

import { useDisclosure } from "@mantine/hooks";
import { BASE_URL, getMemberID } from "../../../App";
import axios from "axios";
import Spinner from "../../Misc/Spinner";
import { useNavigate } from "react-router-dom";
export interface MemberModel {
  id: string;
  username: string;
  email: string;
  roles: any[];
  password?: string;
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

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const [
    openedChaneRoleModal,
    { open: openChangeRoleModal, close: closeChangeRoleModal },
  ] = useDisclosure(false);

  const form = useForm<{ role: string[]; id: string }>({
    initialValues: {
      role: [],
      id: "",
    },
  });

  useEffect(() => {
    fetchMembers();
  }, [activePage]);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function deleteMember(id: string) {
    try {
      setIsLoading(true);
      const res = await axios.delete(`${BASE_URL}auth/${id}`);
      fetchMembers();
      close();
    } catch (error: any) {
      if (error.response.status == 404) {
        navigate("/notfound");
      } else navigate("/error");
    }
    setIsLoading(false);
  }

  async function fetchMembers() {
    try {
      setIsLoading(true);

      const res = await axios.get(`${BASE_URL}auth?page=${activePage - 1}`, {
        withCredentials: true,
      });
      const data = await res.data;
      const newMembers = [];
      for (const key in Object.keys(data.members)) {
        newMembers.push({
          id: data.members[key].id,
          username: data.members[key].username,
          email: data.members[key].email,
          roles: data.members[key].roles,
        });
      }
      setMembers(newMembers);
      setTotalPages(data.totalPages);
      if (activePage > data.totalPages && data.totalPages != 0) {
        setActivePage(data.totalPages);
      }
    } catch (error: any) {
      if (error.response.status == 404) {
        navigate("/notfound");
      } else navigate("/error");
    }

    setIsLoading(false);
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
            <Button
              color="blue"
              onClick={() => {
                form.setValues({
                  role: item.roles.map((role) => role.roleName),
                  id: item.id,
                });
                openChangeRoleModal();
              }}
            >
              Change role
            </Button>
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

  async function updateRoles(id: string, role: string[]) {
    try {
      setIsLoading(true);

      const res = await axios.patch(
        `${BASE_URL}auth/role/${getMemberID()}`,
        {
          role: role,
          memberId: id,
        },
        { withCredentials: true }
      );

      fetchMembers();
      closeChangeRoleModal();
      setIsLoading(false);
      localStorage.clear();
      sessionStorage.clear();
      await axios.post(`${BASE_URL}auth/logout`, {}, { withCredentials: true });
      navigate("/homepage");
    } catch (error: any) {
      if (error.response.status == 404) {
        closeChangeRoleModal();
        navigate("/notfound");
      } else {
        closeChangeRoleModal();
        navigate("/error");
      }
    }
  }

  if (isLoading) return <Spinner />;

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

      <Modal
        opened={openedChaneRoleModal}
        onClose={closeChangeRoleModal}
        centered
      >
        <form
          onSubmit={form.onSubmit((values) =>
            updateRoles(values.id, values.role)
          )}
        >
          <Flex gap={10} justify="center" align="center" direction={"column"}>
            <Input type="hidden" {...form.getInputProps("id")} />
            <Flex direction={"column"}>
              <MultiSelect
                nothingFoundMessage="Nothing found..."
                hidePickedOptions
                searchable
                clearable
                label="Roles"
                data={["ROLE_ADMIN", "ROLE_USER", "ROLE_MODERATOR"]}
                {...form.getInputProps("role")}
              />
            </Flex>
            <Button fullWidth type="submit">
              OK
            </Button>
          </Flex>
        </form>
      </Modal>
    </Flex>
  );
}

export default AdminPage;
