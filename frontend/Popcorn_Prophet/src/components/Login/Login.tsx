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
import { useEffect, useState } from "react";
import { BASE_URL, getCookie } from "../../App";
import axios from "axios";
import Spinner from "../Misc/Spinner";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      email: "",
      password: "",
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
    },
  });
  const navigate = useNavigate();

  async function login(values: any) {
    try {
      setIsLoading(true);
      const res = await axios.post(`${BASE_URL}auth/login`, values, {
        withCredentials: false,
      });
      const data = await res.data;
      console.log(data);
      if (data) {
        data.errors
          ? setValidationErros([...data.errors])
          : setValidationErros([]);
        data.message
          ? setValidationMessage(data.message)
          : setValidationMessage("");
      }

      sessionStorage.setItem("cart", data.cartId);
      sessionStorage.setItem(
        "token",
        `Basic ${window.btoa(`${values.email}:${values.password}`)}`
      );
      sessionStorage.setItem("authMember", data.member.username);
      sessionStorage.setItem("memberId", data.member.id);

      setIsLoading(false);
      handlers.toggle();
      navigate("/api");
    } catch (err) {
      navigate("/error");
    }
  }

  if (isLoading) return <Spinner />;

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
