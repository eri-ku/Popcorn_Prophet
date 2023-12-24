import {
  Box,
  Flex,
  NumberFormatter,
  NumberInput,
  CloseButton,
  Text,
  NumberInputHandlers,
} from "@mantine/core";
import { ProductModel } from "../Api";
import { getCartID } from "../../../App";
import styles from "./CartItem.module.css";
import { useEffect, useRef, useState } from "react";
export interface CartItemModel {
  product: ProductModel;
  id: string;
  quantity: number;
  price: number;
}

function CartItem({
  el,
  eraseCartItem,
  setCart,
}: {
  el: CartItemModel;
  eraseCartItem: Function;
  setCart: Function;
}) {
  const [value, setValue] = useState<string | number>(el.quantity);

  async function patchQuantity(newValue: string | number) {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `${localStorage.getItem("token")}`,
    };
    const res = await fetch(
      `http://localhost:8080/cart/${el.product.id}/${getCartID()}/${newValue}`,
      {
        headers,
        method: "PATCH",
      }
    );
    if (!res.ok) {
      throw new Error("Something went wrong!");
    }

    const data = await res.json();

    setCart((prev: CartItemModel[]) => {
      const newCart = prev.map((item) => {
        if (item.id === data.id) {
          return {
            ...item,
            quantity: data.quantity,
          };
        }
        return item;
      });
      return newCart;
    });
  }

  return (
    <Flex className={styles.row} key={el.id}>
      <Flex className={styles.title}>
        <CloseButton c="red" onClick={() => eraseCartItem(el.product.id)} />
        {el.product.title}
      </Flex>
      <Box className={`${styles.volumprice} ${styles.boxprice}`}>
        <NumberInput
          w={"50"}
          size="xs"
          variant="filled"
          min={1}
          max={99}
          value={value}
          onChange={(value) => {
            setValue(() => value);
            patchQuantity(value);
          }}
        />
        <NumberFormatter
          thousandSeparator=" "
          decimalSeparator=","
          suffix="€"
          value={el.price * Number(value)}
        ></NumberFormatter>{" "}
      </Box>
    </Flex>
  );
}

export default CartItem;
