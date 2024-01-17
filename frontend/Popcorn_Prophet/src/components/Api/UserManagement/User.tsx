import { useForm } from "@mantine/form";
import styles from "./User.module.css";
import {
  Paper,
  Avatar,
  Text,
  Flex,
  Anchor,
  Modal,
  Input,
  Button,
  TextInput,
  PasswordInput,
} from "@mantine/core";
import { MemberModel } from "../AdminPage/AdminPage";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL, getMemberID } from "../../../App";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import Spinner from "../../Misc/Spinner";
function User() {
  useEffect(() => {
    fetchMember();
  }, []);

  const [member, setMember] = useState<any>({});

  const [opened, { open, close }] = useDisclosure(false);

  const [switchModal, setSwitchModal] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const formEmail = useForm<{ email: string }>({
    initialValues: {
      email: "",
    },
  });

  const formPassword = useForm<{
    oldPassword: string;
    newPassword: string;
    repeatPassword: string;
  }>({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      repeatPassword: "",
    },
  });

  async function fetchMember() {
    try {
      setIsLoading(true);
      const res = await axios.get(`${BASE_URL}auth/${getMemberID()}`);
      const data = await res.data;
      const mem: MemberModel = {
        id: data.id,
        username: data.username,
        email: data.email,
        roles: data.roles
          .map((role: any) => {
            return role.roleName;
          })
          .join(", "),
        password: "",
      };
      setMember(mem);
      setIsLoading(false);
    } catch (err) {
      navigate("/error");
    }
  }

  async function updateEmail(email: string) {
    try {
      const res = await axios.patch(
        `${BASE_URL}auth/email/${getMemberID()}`,
        email,
        { withCredentials: true }
      );
      fetchMember();
      close();
      sessionStorage.clear();
      navigate("/homepage");
    } catch (err) {
      navigate("/error");
    }
  }

  async function updatePassword(
    oldPassword: string,
    newPassword: string,
    repeatPassword: string
  ) {
    try {
      setIsLoading(true);
      const res = await axios.patch(
        `${BASE_URL}auth/password/${getMemberID()}`,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
          repeatPassword: repeatPassword,
        },
        { withCredentials: true }
      );
      fetchMember();
      close();
      sessionStorage.clear();
      setIsLoading(false);
      navigate("/homepage");
    } catch (err) {
      navigate("/error");
    }
  }

  if (isLoading) return <Spinner />;

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
          {member?.username}
        </Text>
        <Text ta="center" c="dimmed" fz="sm">
          {`${member.email} • ${member.roles}`}
        </Text>
        <Flex direction={"column"} align={"center"} mt={50} gap={10}>
          <Anchor
            onClick={() => {
              setSwitchModal("password");
              open();
            }}
          >
            Click to change password{" "}
          </Anchor>
          <Anchor
            onClick={() => {
              setSwitchModal("email");
              open();
            }}
          >
            Click to change email{" "}
          </Anchor>
        </Flex>
      </Paper>

      <Modal opened={opened} onClose={close} centered>
        {switchModal === "email" && (
          <form
            onSubmit={formEmail.onSubmit((values) => updateEmail(values.email))}
          >
            <TextInput
              mb={"1rem"}
              label="New email"
              placeholder="Type your new email address"
              {...formEmail.getInputProps("email")}
            />
            <Button fullWidth type="submit">
              OK
            </Button>
          </form>
        )}

        {switchModal === "password" && (
          <form
            onSubmit={formPassword.onSubmit((values) =>
              updatePassword(
                values.oldPassword,
                values.newPassword,
                values.repeatPassword
              )
            )}
          >
            <Flex gap={"1rem"} direction={"column"}>
              <Input type="hidden" {...formPassword.getInputProps("id")} />
              <PasswordInput
                label="Old password"
                placeholder="Type your old password"
                {...formPassword.getInputProps("oldPassword")}
              />
              <PasswordInput
                label="New password"
                placeholder="Type your new password"
                {...formPassword.getInputProps("newPassword")}
              />
              <PasswordInput
                label="Repeat password"
                placeholder="Repeat your new password"
                {...formPassword.getInputProps("repeatPassword")}
              />
              <Button fullWidth type="submit">
                OK
              </Button>
            </Flex>
          </form>
        )}
      </Modal>
    </Flex>
  );
}

export default User;
