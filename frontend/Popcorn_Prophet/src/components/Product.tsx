import { IconHeart } from "@tabler/icons-react";
import {
  Card,
  Text,
  Group,
  Badge,
  Button,
  Box,
  ActionIcon,
  Modal,
  Flex,
} from "@mantine/core";
import styles from "./Products.module.css";

import { ProductModel } from "./Api";
import { useDisclosure } from "@mantine/hooks";

function Product({
  product,
  deleteProduct,
  editProduct,
}: {
  product: ProductModel;
  deleteProduct: Function;
  editProduct: Function;
}) {
  const { id, title, rated, country, plot } = product;
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Card radius="md" p="sm" className={styles.card} mb={10}>
        <Box p="xs" pl={20}>
          {/* <Card.Section>
          <Image src={poster} alt={title} height={10} />
        </Card.Section> */}

          <Card.Section className={styles.section} mt="md">
            <Group justify="apart">
              <Text fz="lg" fw={500}>
                {title}
              </Text>
              <Badge size="sm" variant="light">
                {country}
              </Badge>
            </Group>
            <Text fz="sm" mt="xs">
              {plot}
            </Text>
          </Card.Section>

          <Card.Section className={styles.section}>
            <Text ta={"center"} mt="md" className={styles.label} c="dimmed">
              Rating
            </Text>
            <Text ta={"center"}>{rated}</Text>
          </Card.Section>

          <Group mt="xs">
            <Button color="cyan" radius="md" style={{ flex: 1 }}>
              BUY
            </Button>
            <ActionIcon variant="default" radius="md" size={36}>
              <IconHeart className={styles.like} stroke={1.5} />
            </ActionIcon>
            <Button color="teal" onClick={() => editProduct(product)}>
              Update
            </Button>
            <Button onClick={() => open()}>Delete</Button>
          </Group>
        </Box>
      </Card>
      <Modal opened={opened} onClose={close} centered>
        <Flex gap={10} justify="center" align="center">
          <Text>Do you really want to delete this product?</Text>
          <Button onClick={() => deleteProduct(id)}>OK</Button>
        </Flex>
      </Modal>
    </>
  );
}

export default Product;
