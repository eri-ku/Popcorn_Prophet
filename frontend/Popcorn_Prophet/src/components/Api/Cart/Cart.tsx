import { Box, Stepper, Group, Button, Flex, Modal, Text } from "@mantine/core";
import styles from "./Cart.module.css";
import { useEffect, useState } from "react";
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import ThirdStep from "./ThirdStep";
import LastStep from "./LastStep";
import { useProvider } from "../ContextProvider";
import { useForm } from "@mantine/form";
import { BASE_URL, getMemberID } from "../../../App";
import { getCartID } from "../../../App";
import { ProductModel } from "../Api";
import { useMediaQuery } from "@mantine/hooks";
import axios from "axios";
import Spinner from "../../Misc/Spinner";
import { useNavigate } from "react-router-dom";
export interface BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  postalCode: string;
  city: string;
  address: string;
  country: string;
  paymentMethod: string;
}

export interface CartItemModel {
  product: ProductModel;
  id: string;
  quantity: number;
  price: number;
}

function Cart() {
  const [active, setActive] = useState(0);
  const { setCart, cart, itemIdToErase, opened, close, open } = useProvider();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [validationMessage, setValidationMessage] = useState<string>("");

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      postalCode: "",
      city: "",
      address: "",
      country: "",
      paymentMethod: "",
    },
    validate: {
      firstName: (value: string) =>
        value ? null : "Please enter your first name",
      lastName: (value: string) =>
        value ? null : "Please enter your last name",
      email: (value) =>
        /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(value)
          ? value.length < 6
            ? "Email is too short"
            : null
          : "Invalid email",
      postalCode: (value: string) =>
        value ? true : "Please enter your postal code",
      city: (value: string) => (value ? null : "Please enter your city"),
      address: (value: string) => (value ? null : "Please enter your address"),
      country: (value: string) => (value ? null : "Please select your country"),
      paymentMethod: (value: string) =>
        value ? null : "Please select payment method",
    },
  });

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  async function eraseCartItem(cartItemKey: string) {
    try {
      setIsLoading(true);
      const res = await axios.delete(
        `${BASE_URL}cart/${cartItemKey}/${getCartID()}`,
        { withCredentials: true }
      );
      const data = await res.data;

      setCart(() =>
        cart.filter((el: CartItemModel) => el.product.id !== cartItemKey)
      );
      close();
    } catch (error: any) {
      if (error.response.status == 404) {
        navigate("/notfound");
      } else navigate("/error");
    }
    setIsLoading(false);
  }

  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  function handleSubmit() {
    nextStep();
    createBilling(form.values);
    setCart([]);
    cleanCart();
  }

  async function cleanCart() {
    try {
      setIsLoading(true);

      const res = await axios.put(`${BASE_URL}cart/${getCartID()}`, {
        withCredentials: true,
      });
      const data = await res.data;
    } catch (error: any) {
      if (error.response.status == 404) {
        navigate("/notfound");
      } else navigate("/error");
    }
    setIsLoading(false);
  }

  async function createBilling(billingInfo: BillingInfo) {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `${BASE_URL}billingInfo/${getMemberID()}`,
        billingInfo,
        { withCredentials: true }
      );
      const data = await res.data;
    } catch (error: any) {
      if (error.response.status == 400) {
        setValidationMessage(() => error.response.data.join(".\n\n"));
      } else if (error.response.status == 404) {
        navigate("/notfound");
      } else navigate("/error");
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchBilling();
  }, []);

  async function fetchBilling() {
    try {
      setIsLoading(true);

      const res = await axios.get(`${BASE_URL}billingInfo/${getMemberID()}`);
      const data = await res.data;
      for (const key in data) {
        data[key] = data[key] === null ? "" : data[key];
      }

      form.setValues(data);
    } catch (error: any) {
      if (error.response.status == 404) {
        navigate("/notfound");
      } else navigate("/error");
    }
    setIsLoading(false);
  }

  if (isLoading) return <Spinner />;

  return (
    <Box className={styles.container}>
      <Flex direction={"column"}>
        {active < 3 && (
          <Stepper
            className={styles.stepper}
            ta={"center"}
            active={active}
            onStepClick={setActive}
            allowNextStepsSelect={false}
            orientation={!isSmallScreen ? "horizontal" : "vertical"}
          >
            <Stepper.Step label="First step">
              <strong>Check your Order: </strong>
            </Stepper.Step>
            <Stepper.Step label="Second step">
              <strong>Verify your billing address</strong>
            </Stepper.Step>
            <Stepper.Step label="Final step">
              <strong>Set payment method</strong>
            </Stepper.Step>
            <Stepper.Completed>
              <strong>Completed</strong>
            </Stepper.Completed>
          </Stepper>
        )}

        {active == 0 && <FirstStep />}
        {active == 1 && <SecondStep form={form} />}
        {active == 2 && <ThirdStep form={form} />}

        {!validationMessage && active == 3 && <LastStep />}

        {active !== 3 && (
          <Group justify="center" mt="xl">
            <Button
              variant="default"
              onClick={prevStep}
              disabled={active < 1 ? true : false}
            >
              Back
            </Button>

            {active == 2 ? (
              <Button type="submit" onClick={handleSubmit}>
                Finish order
              </Button>
            ) : (
              <Button
                type="button"
                onClick={nextStep}
                disabled={cart.length === 0}
              >
                Next Step
              </Button>
            )}
          </Group>
        )}

        {validationMessage && (
          <Flex justify="center" align="center">
            <Text c="red">{validationMessage}</Text>
          </Flex>
        )}
      </Flex>
      <Modal opened={opened} onClose={close} centered>
        <Flex gap={10} justify="center" align="center">
          <Text>Do you really want to delete this item from your cart?</Text>
          <Button fullWidth onClick={() => eraseCartItem(itemIdToErase)}>
            OK
          </Button>
        </Flex>
      </Modal>
    </Box>
  );
}

export default Cart;
