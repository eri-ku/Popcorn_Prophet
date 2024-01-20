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
  Box,
  rem,
  Popover,
  Progress,
} from "@mantine/core";
import { MemberModel } from "../AdminPage/AdminPage";
import { IconX, IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL, getMemberID } from "../../../App";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import Spinner from "../../Misc/Spinner";
import { notifications } from "@mantine/notifications";
function PasswordRequirement({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) {
  return (
    <>
      <Box
        c={meets ? "teal" : "red"}
        style={{ display: "flex", alignItems: "center" }}
        mt={7}
        size="sm"
      >
        {meets ? (
          <IconCheck style={{ width: rem(14), height: rem(14) }} />
        ) : (
          <IconX style={{ width: rem(14), height: rem(14) }} />
        )}
        {label}
      </Box>
    </>
  );
}

const requirements = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
];

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

function User() {
  useEffect(() => {
    fetchMember();
  }, []);

  const [member, setMember] = useState<any>({});

  const [opened, { open, close }] = useDisclosure(false);

  const [switchModal, setSwitchModal] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [popoverOpened, setPopoverOpened] = useState(false);

  const navigate = useNavigate();

  const formEmail = useForm<{ email: string }>({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) =>
        /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(value)
          ? value.length < 6
            ? "Email is too short"
            : null
          : "Invalid email",
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
    validate: {
      oldPassword: (value) =>
        getStrength(value) === 100
          ? null
          : "Password does not satisfy requirements ",
      newPassword: (value) =>
        getStrength(value) === 100
          ? null
          : "Password does not satisfy requirements ",
      repeatPassword: (value, values) =>
        value === values.newPassword ? null : "Passwords does not match",
    },
  });

  const strength = getStrength(formPassword.values.newPassword);
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(formPassword.values.newPassword)}
    />
  ));

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
      };
      setMember(mem);
      setIsLoading(false);
    } catch (err: any) {
      if (err.response.status == 404) {
        navigate("/notfound");
      } else navigate("/error");
    }
  }

  async function updateEmail(email: string) {
    try {
      setIsLoading(true);
      const res = await axios.patch(
        `${BASE_URL}auth/email/${getMemberID()}`,
        { email },
        { withCredentials: true }
      );
      notifications.show({
        title: "Success",
        message: "Email changed successfully",
        color: "grey",
        withBorder: true,
        icon: "📩",
      });
      cleanForm();
      axios.post(`${BASE_URL}auth/logout`, {}, { withCredentials: true });
      localStorage.clear();
      sessionStorage.clear();

      navigate("/homepage");
    } catch (err: any) {
      if (err.response.status == 400) {
        setValidationMessage(() => err.response.data.message);
      } else if (err.response.status == 404) {
        navigate("/notfound");
      } else {
        navigate("/error");
      }
    }
    setIsLoading(false);
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
      notifications.show({
        title: "Success",
        message: "Password changed successfully",
        color: "grey",
        withBorder: true,
        icon: "🔑",
      });
      cleanForm();
      axios.post(`${BASE_URL}auth/logout`, {}, { withCredentials: true });
      localStorage.clear();
      sessionStorage.clear();

      navigate("/homepage");
    } catch (err: any) {
      if (err.response.status == 400) {
        setValidationMessage(() => err.response.data.message);
      } else if (err.response.status == 404) {
        navigate("/notfound");
      } else {
        navigate("/error");
      }
    }

    setIsLoading(false);
  }

  if (isLoading) return <Spinner />;

  function cleanForm() {
    setValidationMessage("");
    formEmail.reset();
    formPassword.reset();
    close();
  }

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

      <Modal opened={opened} onClose={cleanForm} centered>
        {validationMessage && (
          <Flex justify="center" align="center">
            <Text c="red">{validationMessage}</Text>
          </Flex>
        )}
        {switchModal === "email" && (
          <form
            onSubmit={formEmail.onSubmit((values) => updateEmail(values.email))}
          >
            <TextInput
              mb={"1rem"}
              required
              min={6}
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
                min={6}
                required
                label="Old password"
                placeholder="Type your old password"
                {...formPassword.getInputProps("oldPassword")}
              />
              <Popover
                opened={popoverOpened}
                position="bottom"
                width="target"
                transitionProps={{ transition: "pop" }}
              >
                <Popover.Target>
                  <div
                    onFocusCapture={() => setPopoverOpened(true)}
                    onBlurCapture={() => setPopoverOpened(false)}
                  >
                    <PasswordInput
                      min={6}
                      required
                      label="New password"
                      placeholder="Type your new password"
                      {...formPassword.getInputProps("newPassword")}
                    />
                  </div>
                </Popover.Target>
                <Popover.Dropdown>
                  <Progress color={color} value={strength} size={5} mb="xs" />
                  <PasswordRequirement
                    label="Includes at least 6 characters"
                    meets={formPassword.values.newPassword.length > 5}
                  />
                  {checks}
                </Popover.Dropdown>
              </Popover>
              <PasswordInput
                required
                min={6}
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
