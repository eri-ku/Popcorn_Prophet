import {
  Box,
  Flex,
  NumberFormatter,
  NumberInput,
  CloseButton,
} from "@mantine/core";
import styles from "./FirstStep.module.css";
import { useEffect, useState } from "react";
import { getCartID } from "../../../App";
import { CartItem } from "./Cart";

function FirstStep() {
  const [cart, setCart] = useState<CartItem[]>([]);
  useEffect(() => {
    async function fetchCart() {
      const headers = {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `${localStorage.getItem("token")}`,
      };
      const res = await fetch(`http://localhost:8080/cart/${getCartID()}`, {
        headers,
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await res.json();

      const pro: CartItem[] = [];
      for (const key in data) {
        pro.push({
          id: data[key].id,
          product: data[key].product,
          quantity: data[key].quantity,
          price: data[key].price,
        });
        console.log(pro);
      }
      setCart(pro);
    }
    fetchCart();
  }, []);

  async function eraseCartItem(cartItemId: string) {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `${localStorage.getItem("token")}`,
    };
    const res = await fetch(
      `http://localhost:8080/cart/${cartItemId}/${getCartID()}`,
      {
        headers,
        method: "DELETE",
      }
    );

    if (!res.ok) {
      throw new Error("Something went wrong!");
    }
    const data = await res.json();

    setCart(() => cart.filter((el) => el.id !== cartItemId));
  }

  return (
    <Flex direction={"column"} gap={15} mt={20} className={styles.container}>
      {cart.map((el) => (
        <Flex className={styles.row} key={el.id}>
          <Flex className={styles.title}>
            <CloseButton c="red" onClick={() => eraseCartItem(el.id)} />
            {el.product.title}
          </Flex>
          <Box className={`${styles.volumprice} ${styles.boxprice}`}>
            <NumberInput
              w={"50"}
              size="xs"
              variant="filled"
              min={1}
              max={99}
              defaultValue={el.quantity}
            />
            <NumberFormatter
              thousandSeparator=" "
              decimalSeparator=","
              suffix="€"
              value={el.price * el.quantity}
            ></NumberFormatter>{" "}
          </Box>
        </Flex>
      ))}
    </Flex>
  );
}

export default FirstStep;
