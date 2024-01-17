import { createContext, useContext, useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";

import { BASE_URL, getCartID } from "../../App";
import { ProductModel } from "./Api";
import { CartItemModel } from "./Cart/Cart";
import axiosPom from "axios";
import { useNavigate } from "react-router-dom";

const Context = createContext<any>(null);

export function getXSRFToken() {
  return sessionStorage.getItem("XSRF-TOKEN");
}

function ContextProvider({ children }: { children: any }) {
  const [cart, setCart] = useState<CartItemModel[]>([]);

  const [prod, setProds] = useState<ProductModel[]>([]);

  const [itemIdToErase, setItemIdToErase] = useState<string>("");
  const [opened, { open, close }] = useDisclosure(false);

  const navigate = useNavigate();

  const [
    isArticleFormOpened,
    {
      open: openArticleForm,
      close: closeArticleForm,
      toggle: toggleArticleForm,
    },
  ] = useDisclosure(false);

  function calculateCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  const sizeOfCart = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  async function buyProduct(id: string) {
    try {
      const res = await axiosPom.post(
        `${BASE_URL}cart/${id}/${getCartID()}`,
        {}
      );

      fetchCart();
    } catch (err) {
      navigate("/error");
    }
  }

  useEffect(() => {
    fetchCart();
  }, [prod]);

  async function fetchCart() {
    try {
      const res = await axiosPom(`${BASE_URL}cart/${getCartID()}`);

      const data = await res.data;

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
    } catch (err) {
      navigate("/error");
    }
  }

  return (
    <Context.Provider
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
        isArticleFormOpened,
        openArticleForm,
        closeArticleForm,
        toggleArticleForm,
      }}
    >
      {children}
    </Context.Provider>
  );
}

function useProvider() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useProvider must be used within a ContextProvider");
  }
  return context;
}

export { ContextProvider, useProvider };
