import { useNavigate, useParams } from "react-router-dom";
import styles from "./ProductView.module.css";
import { useEffect, useState } from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import {
  Text,
  Flex,
  Box,
  Image,
  Accordion,
  Title,
  Center,
  rem,
  Avatar,
  Group,
  Button,
} from "@mantine/core";
import { ProductModel } from "../Api";
import { act } from "react-dom/test-utils";
import Review from "./Review";
import { format } from "date-fns";
import { useCart } from "../Cart/CartItemContext";

function ProductView() {
  const { productId } = useParams();
  const [product, setProduct] = useState<ProductModel>();
  const [toggleComment, setToggleComment] = useState<boolean>(false);
  const navigate = useNavigate();
  const { buyProduct } = useCart();
  useEffect(() => {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `${localStorage.getItem("token")}`,
    };
    async function fetchProduct() {
      try {
        const res = await fetch(
          `http://localhost:8080/api/products/${productId}`,
          {
            headers,
          }
        );

        if (!res.ok) {
          throw new Error("Something went wrong!");
        }
        const data = await res.json();

        const pro: ProductModel = { ...data };

        setProduct(() => pro);
      } catch (error: any) {
        console.error("Fetch error:", error);
      }
    }
    fetchProduct();
  }, []);

  if (!product) {
    return <Text className={styles.loading}>Loading...</Text>;
  }
  const {
    id,
    title,
    type,
    released,
    genre,
    language,
    country,
    plot,
    rated,
    runtime,
    poster,
  } = product;

  const items1 = [
    { emoji: "❤", value: "Type", description: type },
    {
      emoji: "⌛",
      value: "Released",
      description: format(new Date(released), "yyyy-MMM-dd"),
    },
    { emoji: "🎦", value: "Genre", description: genre.join(", ") },
    { emoji: "🗣", value: "Language", description: language.join(", ") },
  ];
  const items2 = [
    { emoji: "🗺", value: "Country", description: country },
    { emoji: "🔠", value: "Plot", description: plot },
    { emoji: "💯", value: "Rated", description: rated },
    { emoji: "🏃‍♂️", value: "Runtime", description: `${runtime} min` },
  ];

  return (
    <Flex justify={"center"} className={styles.main}>
      <Flex direction={"column"} gap={10} mt={80}>
        <Image ml={10} className={styles.content} src={poster}></Image>
        <Button mih={30} color="blue" onClick={() => buyProduct(id)}>
          Buy
        </Button>
        <Title ta={"center"} order={2}>
          {title}
        </Title>
        <Flex gap={20} justify={"center"} direction={"column"}>
          <Flex gap={20}>
            <Accordion variant="separated" mb={20} className={styles.acc}>
              {items1.map((item) => (
                <Accordion.Item key={item.value} value={item.value}>
                  <Accordion.Control icon={item.emoji}>
                    {item.value}
                  </Accordion.Control>
                  <Accordion.Panel>
                    {item.description.toString()}
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
            <Accordion variant="separated" className={styles.acc}>
              {items2.map((item) => (
                <Accordion.Item key={item.value} value={item.value}>
                  <Accordion.Control icon={item.emoji}>
                    {item.value}
                  </Accordion.Control>
                  <Accordion.Panel>{item.description}</Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Flex>
          <Flex direction={"column"} align={"center"}>
            <Flex gap={10}>
              <Button color="gray" onClick={() => navigate(-1)}>
                <IconArrowLeft />
              </Button>
              <Button onClick={() => setToggleComment((val) => !val)}>
                {toggleComment ? `Hide Reviews` : `Show Reviews`}
              </Button>
            </Flex>
            {toggleComment && (
              <>
                <Review />
                <Review />
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default ProductView;
