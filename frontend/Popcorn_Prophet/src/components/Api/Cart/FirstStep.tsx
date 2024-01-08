import { Flex, Text } from "@mantine/core";
import styles from "./FirstStep.module.css";
import CartItem from "./CartItem";
import { useProvider } from "../ContextProvider";
import { CartItemModel } from "./Cart";

function FirstStep() {
  const { cart, calculateCartTotal } = useProvider();

  return (
    <Flex direction={"column"} gap={15} mt={20} className={styles.container}>
      <Text mt={15}>Total price: {calculateCartTotal()}</Text>
      {cart.map((el: CartItemModel) => (
        <CartItem key={el.id} el={el} />
      ))}
    </Flex>
  );
}

export default FirstStep;
