import {
  Card,
  Text,
  Group,
  Badge,
  Button,
  Title,
  Image,
  Modal,
  Flex,
  ScrollArea,
  Divider,
} from "@mantine/core";
import styles from "./Products.module.css";
import { format } from "date-fns";

import { ProductModel } from "../Api";
import { useDisclosure } from "@mantine/hooks";

import { IconWorld, IconMovie } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Product({
  product,
  deleteProduct,
  editProduct,
  buyProduct,
}: {
  product: ProductModel;
  deleteProduct: Function;
  editProduct: Function;
  buyProduct: Function;
}) {
  const {
    id,
    title,
    rated,
    country,
    plot,
    released,
    genre,
    language,
    type,
    poster,
    runtime,
  } = product;

  const [opened, { open, close }] = useDisclosure(false);

  // const [imgPoster, setImgPoster] = useState<string>("");

  const navigate = useNavigate();

  const languages = language.map((language) => (
    <Badge
      variant="light"
      color="blue"
      key={language}
      leftSection={<IconWorld />}
    >
      {language}
    </Badge>
  ));

  const genres = genre.map((genre) => (
    <Badge variant="outline" key={genre} leftSection={<IconMovie />}>
      {genre}
    </Badge>
  ));
  const countries = country.map((countrie) => (
    <Badge key={countrie} size="sm" variant="light">
      {countrie}
    </Badge>
  ));

  // useEffect(() => {
  //   async function fetchImg(poster: string) {
  //     const headers = {
  //       "Content-Type": "application/json;charset=UTF-8",
  //       Authorization: `${localStorage.getItem("token")}`,
  //     };
  //     const res = await fetch(poster, {
  //       method: "GET",
  //       headers,
  //     });
  //     if (!res.ok) {
  //       throw new Error("Something went wrong!");
  //     }
  //     const data = await res.blob();

  //     setImgPoster(URL.createObjectURL(data));
  //   }
  //   poster && fetchImg(poster.toString());
  // }, [poster]);

  return (
    <Card
      my={15}
      radius="lg"
      className={styles.card}
      component="div"
      classNames={{ root: styles.cardRoot }}
    >
      <ScrollArea scrollbarSize={2} scrollHideDelay={0} scrollbars="y">
        <Card.Section pl="1rem" pr="1rem" pt={0}>
          <Image
            className={styles.img}
            onClick={() => navigate(`/api/products/${id}`)}
            src={poster}
            alt={title}
            height={10}
          />
          <Button
            onClick={() => buyProduct(id)}
            mt="sm"
            color="cyan"
            radius="md"
            fullWidth
          >
            BUY
          </Button>
        </Card.Section>

        <Card.Section
          className={styles.section}
          mt="md"
          mih={"8rem"}
          p="1.3rem"
        >
          <Group justify="center">
            <Badge size="sm" variant="filled" color="violet">
              {type}
            </Badge>

            <Group>{countries}</Group>
            <Badge size="md" variant="light" color="indigo">
              {rated}
            </Badge>
          </Group>
          <Title ta={"center"} order={2} fw={500}>
            <strong>{title}</strong>
          </Title>

          <Divider my="xs" />
          <Flex justify={"space-between"} align={"center"}>
            <Text fz="sm" mt="xs">
              {<strong>Released:</strong>}{" "}
              {format(new Date(released), "yyyy-MMM-dd")}
            </Text>
            <Badge size="sm" variant="filled" color="pink">
              {`${runtime} min`}
            </Badge>
          </Flex>
        </Card.Section>

        <Card.Section className={styles.section} mih={"8rem"} p="1.3rem">
          <Text mt="md" c="dimmed">
            Perfect for you, if you enjoy
          </Text>
          <Group gap={7} mt={10}>
            {genres}
          </Group>
        </Card.Section>

        <Card.Section className={styles.section} mih={"8rem"} p="1.3rem">
          <Text mt="md" c="dimmed">
            In language
          </Text>
          <Group gap={7} mt={10}>
            {languages}
          </Group>
        </Card.Section>

        <Card.Section className={styles.section} mih={"15rem"} p="1.3rem">
          <Text mt="md" className={styles.label} c="dimmed">
            Plot
          </Text>
          {plot}
        </Card.Section>
        <Card.Section
          className={`${styles.section}  ${styles.last}`}
          p="1.3rem"
        >
          <Group mt="sm" justify={"space-between"}>
            <Button
              color="teal"
              onClick={() => {
                console.log(product);
                editProduct(product);
              }}
            >
              Update
            </Button>
            <Button onClick={() => open()}>Delete</Button>
          </Group>
        </Card.Section>
      </ScrollArea>
      <Modal opened={opened} onClose={close} centered>
        <Flex gap={10} justify="center" align="center">
          <Text>Do you really want to delete this product?</Text>
          <Button onClick={() => deleteProduct(id)}>OK</Button>
        </Flex>
      </Modal>
    </Card>
  );
}

export default Product;
