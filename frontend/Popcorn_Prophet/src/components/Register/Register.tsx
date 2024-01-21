import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Image,
  Box,
  Progress,
  Popover,
  rem,
  Portal,
  Text,
  Flex,
  Anchor,
  List,
} from "@mantine/core";
import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom";
import HeaderNav from "../Homepage/HeaderNav";
import { useState } from "react";
import { IconX, IconCheck } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import Login from "../Login/Login";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import { BASE_URL, getCookie } from "../../App";
import Spinner from "../Misc/Spinner";

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

function Register() {
  const [opened, handlers] = useDisclosure(false);
  const [popoverOpened, setPopoverOpened] = useState(false);
  const navigate = useNavigate();
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      email: (value) =>
        /^[^@]+@[^@]+\.[^@]+$/.test(value)
          ? value.length < 6
            ? "Email is too short"
            : null
          : "Invalid email",
      password: (value) =>
        getStrength(value) === 100
          ? null
          : "Password does not satisfy requirements ",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords does not match",

      username: (value) =>
        value.length < 3
          ? "Username is too short"
          : value.length > 20
          ? "Username is too long"
          : null,
    },
  });

  const strength = getStrength(form.values.password);
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(form.values.password)}
    />
  ));

  async function createUser(values: any) {
    try {
      setIsLoading(true);
      const res = await axios.post(`${BASE_URL}auth/register`, values, {
        withCredentials: false,
      });
      const data = await res.data;
      sessionStorage.setItem("cartId", data.cartId);
      sessionStorage.setItem(
        "token",
        `Basic ${window.btoa(`${values.email}:${values.password}`)}`
      );
      sessionStorage.setItem("authMember", values.username);
      sessionStorage.setItem("memberId", data.member.id);
      sessionStorage.setItem(
        "roles",
        JSON.stringify(data.member.roles.map((role: any) => role.roleName))
      );
      navigate("/api/products/1");
    } catch (error: any) {
      if (error.response.status == 400) {
        setValidationMessage(() => error.response.data.join(".\n\n"));
      } else if (error.response.status == 409) {
        setValidationMessage(() => error.response.data.message);
      } else if (error.response.status == 404) {
        navigate("/notfound");
      } else if (error.response.status == 404) {
        navigate("/notfound");
      } else {
        navigate("/error");
      }
    }

    setIsLoading(false);
  }

  function cleanForm() {
    setValidationMessage("");
    form.reset();
    close();
  }

  if (isLoading) return <Spinner />;

  return (
    <>
      <Box className={styles.wrapper}>
        <Flex justify={"space-between"}>
          <HeaderNav />
        </Flex>

        <Flex justify={"center"} className={styles.dirChange}>
          <form onSubmit={form.onSubmit((values) => createUser(values))}>
            <Paper className={styles.form} radius={0} p={30}>
              <Flex direction={"column"}>
                <Title order={2} className={styles.title} ta="center" mb={50}>
                  Welcome back to Popcorn Prophet!
                </Title>
                {validationMessage && (
                  <Flex justify="center" align="center">
                    <List>
                      {validationMessage.split("\n").map((line, index) => (
                        <List.Item c="red" key={index}>
                          {line}
                        </List.Item>
                      ))}
                    </List>
                  </Flex>
                )}

                <TextInput
                  required
                  label="Username"
                  placeholder="Your Username"
                  size="md"
                  {...form.getInputProps("username")}
                />

                <TextInput
                  required
                  label="Email address"
                  placeholder="hello@gmail.com"
                  size="md"
                  mt="md"
                  {...form.getInputProps("email")}
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
                        required
                        label="Password"
                        placeholder="Your password"
                        mt="md"
                        size="md"
                        {...form.getInputProps("password")}
                      />
                    </div>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Progress color={color} value={strength} size={5} mb="xs" />
                    <PasswordRequirement
                      label="Includes at least 6 characters"
                      meets={form.values.password.length > 5}
                    />
                    {checks}
                  </Popover.Dropdown>
                </Popover>

                <PasswordInput
                  required
                  label="Repeat Password"
                  placeholder="Your password again"
                  mt="md"
                  size="md"
                  {...form.getInputProps("confirmPassword")}
                />
                <Button type="submit" fullWidth mt="xl" size="md">
                  Register
                </Button>

                <Text ta="center" mt="md">
                  Already have an account?{" "}
                  <Anchor onClick={handlers.toggle}>Login</Anchor>
                </Text>
              </Flex>
            </Paper>
          </form>
          <Box>
            <Image
              className={styles.imger}
              src="_7c2842ac-2a6b-4420-86a6-c8d3ac7eae70.jpg"
            />
          </Box>
        </Flex>
      </Box>
      <Portal>{opened && <Login handlers={handlers} opened={opened} />}</Portal>
    </>
  );
}

export default Register;
