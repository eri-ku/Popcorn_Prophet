import {
  Box,
  Stepper,
  Group,
  Button,
  Flex,
  Fieldset,
  TextInput,
} from "@mantine/core";
import styles from "./Cart.module.css";
import { useEffect, useState } from "react";
import FirstStep from "./FirstSTep";
import SecondStep from "./SecondStep";

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
        <Stepper
          className={styles.stepper}
          ta={"center"}
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={false}
          orientation={!isSmallScreen ? "horizontal" : "vertical"}
        >
          <Stepper.Step label="First step" description="Create an account">
            Step 1 : Check your Order
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Verify email">
            Step 2 : Verify your address
          </Stepper.Step>
          <Stepper.Step label="Final step" description="Get full access">
            Step 3 content: Set your delivery method
          </Stepper.Step>
          <Stepper.Completed>Completed</Stepper.Completed>
        </Stepper>

        {active == 0 && <FirstStep />}
        {active == 1 && <SecondStep />}
        {active == 2 && <FirstStep />}

        <Group bg={"gray"} justify="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={nextStep}>Next step</Button>
        </Group>
      </Flex>
    </Box>
  );
}

export default Cart;
