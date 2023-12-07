import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Modal,
  Flex,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

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
function Login({ opened, handlers }: { opened: boolean; handlers: any }) {
  const [validationErrors, setValidationErros] = useState<any>([]);
  const [validationMessage, setValidationMessage] = useState<string>("");
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      email: "",
      password: "",
      username: "",
    },
    validate: {
      email: (value) =>
        /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(value)
          ? value.length < 6
            ? "Email is too short"
            : null
          : "Invalid email",
      password: (value) =>
        getStrength(value) === 100
          ? null
          : "Password does not satisfy requirements ",

      username: (value) =>
        value.length < 3
          ? "Username is too short"
          : value.length > 20
          ? "Username is too long"
          : null,
    },
  });
  const navigate = useNavigate();

  async function login(values: any) {
    const credentials = `${values.email}:${values.password}`;
    const base64Credentials = window.btoa(credentials);
    const res = await fetch(`http://localhost:8080/auth/login`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    if (!res.ok) {
      const data = await res.json();
      if (data) {
        data.errors
          ? setValidationErros([...data.errors])
          : setValidationErros([]);
        data.message
          ? setValidationMessage(data.message)
          : setValidationMessage("");
      }
      throw new Error("Something went wrong!");
    }

    const data = await res.json();

    localStorage.setItem("token", `Basic ${base64Credentials}`);
    sessionStorage.setItem("authMember", data.member.username);

    handlers.toggle();
    navigate("/api");
  }

  return (
    <Container size={420} my={40}>
      <Modal opened={opened} onClose={handlers.close} centered>
        <Title ta="center" className={styles.title}>
          Welcome back!
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Do not have an account yet?{" "}
          <Anchor size="sm" component={Link} to="/register">
            Create account
          </Anchor>
        </Text>

        <form onSubmit={form.onSubmit((values) => login(values))}>
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            {validationMessage && (
              <Flex justify="center" align="center">
                <Text c="red">{validationMessage}</Text>
              </Flex>
            )}
            <TextInput
              label="Username"
              placeholder="Your Username"
              required
              {...form.getInputProps("username")}
            />
            <TextInput
              label="Email"
              placeholder="you@example.com"
              required
              {...form.getInputProps("email")}
            />

            <PasswordInput
              {...form.getInputProps("password")}
              label="Password"
              placeholder="Your password"
              required
              mt="md"
            />
            <Group justify="space-between" mt="lg">
              <Checkbox label="Remember me" />
              <Anchor component="button" size="sm">
                Forgot password?
              </Anchor>
            </Group>
            <Button type="submit" fullWidth mt="xl">
              Sign in
            </Button>
            {validationErrors &&
              validationErrors.map((error: any) => (
                <Text mt={10} c={"red"} key={error}>
                  {error}
                </Text>
              ))}
          </Paper>
        </form>
      </Modal>
    </Container>
  );
}

export default Login;
