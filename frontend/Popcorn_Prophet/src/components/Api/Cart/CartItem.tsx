import {
  Box,
  Flex,
  NumberFormatter,
  NumberInput,
  CloseButton,
} from "@mantine/core";
import { BASE_URL, getCartID } from "../../../App";
import styles from "./CartItem.module.css";
import { useEffect, useRef, useState } from "react";
import { useProvider } from "../ContextProvider";
import { CartItemModel } from "./Cart";
import axios from "axios";
import Spinner from "../../Misc/Spinner";
function CartItem({ el }: { el: CartItemModel }) {
  const [value, setValue] = useState<string | number>(el.quantity);
  const { setCart, setItemIdToErase, open } = useProvider();

  const firstRender = useRef(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      patchQuantity(value);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [value]);

  async function patchQuantity(newValue: string | number) {
    try {
      setIsLoading(true);

      const res = await axios.patch(
        `${BASE_URL}cart/${el.product.id}/${getCartID()}/${newValue}`,
        {},
        { withCredentials: true }
      );

      const data = await res.data;

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
      setIsLoading(false);
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  function handleEraseCartItem(cartItemKey: string | undefined) {
    setItemIdToErase(() => cartItemKey);
    open();
  }

  if (isLoading) return <Spinner />;

  return (
    <Flex className={styles.row} key={el.id}>
      <Flex className={styles.title}>
        <CloseButton
          c="red"
          onClick={() => handleEraseCartItem(el.product.id)}
        />
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
