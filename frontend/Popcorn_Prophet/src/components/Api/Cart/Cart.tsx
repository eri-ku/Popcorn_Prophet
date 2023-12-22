import { Box, Stepper, Group, Button, Flex } from "@mantine/core";
import styles from "./Cart.module.css";
import { useEffect, useState } from "react";
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import ThirdStep from "./ThirdStep";
import LastStep from "./LastStep";
import { getCartID } from "../../../App";
import { ProductModel } from "../Api";

export interface CartItem {
  product: ProductModel;
  id: string;
  quantity: number;
  price: number;
}

function Cart() {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const [containerWidth, setContainerWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setContainerWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const SCREEN_RES_THRESHOLD = 768;

  const isSmallScreen = containerWidth < SCREEN_RES_THRESHOLD;

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
        {active == 1 && <SecondStep />}
        {active == 2 && <ThirdStep />}
        {active == 3 && <LastStep />}

        {active != 3 && (
          <Group justify="center" mt="xl">
            <Button
              variant="default"
              onClick={prevStep}
              disabled={active < 1 ? true : false}
            >
              Back
            </Button>

            <Button onClick={nextStep}>
              {active == 2 ? "Finish order" : "Next step"}
            </Button>
          </Group>
        )}
      </Flex>
    </Box>
  );
}

export default Cart;
