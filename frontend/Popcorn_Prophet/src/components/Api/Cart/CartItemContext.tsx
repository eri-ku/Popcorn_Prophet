import { createContext, useContext, useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";

import { getCartID } from "../../../App";
import { ProductModel } from "../Api";
import { CartItemModel } from "./Cart";

const CartItemContext = createContext<any>(null);

function CartItemProvider({ children }: { children: any }) {
  const [cart, setCart] = useState<CartItemModel[]>([]);

  const [prod, setProds] = useState<ProductModel[]>([]);

  const [itemIdToErase, setItemIdToErase] = useState<string>("");
  const [opened, { open, close }] = useDisclosure(false);

  function calculateCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  const sizeOfCart = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  async function buyProduct(id: string) {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `${localStorage.getItem("token")}`,
    };
    const res = await fetch(`http://localhost:8080/cart/${id}/${getCartID()}`, {
      headers,
      method: "POST",
    });
    if (!res.ok) {
      throw new Error("Something went wrong!");
    }
    const data = await res.json();
    setCart(data);
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
  }, [prod]);

  return (
    <CartItemContext.Provider
      value={{
        cart,
        setCart,
        calculateCartTotal,
        sizeOfCart,
        prod,
        setProds,
        buyProduct,
        itemIdToErase,
        setItemIdToErase,
        opened,
        close,
        open,
      }}
    >
      {children}
    </CartItemContext.Provider>
  );
}

function useCart() {
  const context = useContext(CartItemContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartItemProvider");
  }
  return context;
}

export { CartItemProvider, useCart };
