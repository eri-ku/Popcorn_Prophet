import {
  Box,
  Flex,
  NumberFormatter,
  NumberInput,
  CloseButton,
  Text,
  NumberInputHandlers,
} from "@mantine/core";
import styles from "./FirstStep.module.css";
import { useEffect, useRef, useState } from "react";
import { getCartID } from "../../../App";
import CartItem, { CartItemModel } from "./CartItem";

function FirstStep() {
  const [cart, setCart] = useState<CartItemModel[]>([]);
  function calculateCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

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

      const pro: CartItemModel[] = [];
      for (const key in data) {
        pro.push({
          id: data[key].id,
          product: data[key].product,
          quantity: data[key].quantity,
          price: data[key].price,
        });
      }
      setCart(pro);
    }
    fetchCart();
  }, []);

  async function eraseCartItem(cartItemKey: string) {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `${localStorage.getItem("token")}`,
    };
    const res = await fetch(
      `http://localhost:8080/cart/${cartItemKey}/${getCartID()}`,
      {
        headers,
        method: "DELETE",
      }
    );

    if (!res.ok) {
      throw new Error("Something went wrong!");
    }
    const data = await res.json();
    console.log("du");

    setCart(() =>
      cart.filter((el: CartItemModel) => el.product.id !== cartItemKey)
    );
  }

  return (
    <Flex direction={"column"} gap={15} mt={20} className={styles.container}>
      <Text mt={15}>Total price: {calculateCartTotal()}</Text>
      {cart.map((el) => (
        <CartItem
          key={el.id}
          el={el}
          eraseCartItem={eraseCartItem}
          setCart={setCart}
        />
      ))}
    </Flex>
  );
}

export default FirstStep;
