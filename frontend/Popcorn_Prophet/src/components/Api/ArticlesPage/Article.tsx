import styles from "./Article.module.css";
import {
  IconBookmark,
  IconHeart,
  IconMessage,
  IconShare,
} from "@tabler/icons-react";
import {
  Card,
  Image,
  Text,
  ActionIcon,
  Badge,
  Group,
  Center,
  Avatar,
  Flex,
  rem,
  Button,
  Modal,
  Indicator,
  Box,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { ArticleModel } from "./ArticlesPage";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
function Article({
  article,
  updateArticle,
  deleteArticle,
}: {
  article: ArticleModel;
  updateArticle: Function;
  deleteArticle: Function;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  const [likes, setLikes] = useState<number>(article.likes);
  return (
    <Card withBorder radius="lg" className={styles.card}>
      <Flex gap={"lg"} direction={"column"}>
        <Card.Section>
          <Link to={`/api/articles/article/${article.id}`}>
            <Image
              src="https://i.imgur.com/Cij5vdL.png"
              h={500}
              className={styles.img}
            />
          </Link>
        </Card.Section>

        <Flex direction={"column"} gap={5}>
          <Badge
            className={styles.rating}
            variant="gradient"
            gradient={{ from: "yellow", to: "red" }}
          >
            {article.rating}
          </Badge>
          <Text
            className={styles.title}
            fw={500}
            component={Link}
            to={`/api/articles/${1}`}
          >
            {article.title}
          </Text>

          <Text fz="sm" c="dimmed" className={styles.content}>
            {article.content}
          </Text>
        </Flex>
      </Flex>

      <Group justify="space-between" className={styles.footer}>
        <Center>
          <Avatar src="/user.png" size={24} radius="xl" mr="xs" />
          <Text fz="sm" inline>
            {article.author.username}
          </Text>
        </Center>

        <Group gap={25} mr={0}>
          <Indicator
            inline
            label={Number(likes)}
            size={15}
            offset={-2}
            position="bottom-end"
            color="red"
          >
            <ActionIcon
              className={styles.action}
              onClick={() => setLikes((count) => count + 1)}
            >
              <IconHeart
                style={{ width: rem(16), height: rem(16) }}
                color="red"
              />
            </ActionIcon>
          </Indicator>
          <Indicator
            m={5}
            inline
            label={0}
            size={15}
            offset={-2}
            position="bottom-end"
            color="yellow"
          >
            <Badge
              bg={"dark"}
              h={"28"}
              w={"35"}
              radius={"sm"}
              pt={3}
              pr={7}
              pl={7}
            >
              <IconMessage
                style={{ width: rem(16), height: rem(16) }}
                color={"orange"}
              />
            </Badge>
          </Indicator>
        </Group>
      </Group>
      <Flex mt={"1.5rem"} justify={"space-between"}>
        <Button onClick={() => open()}>Delete</Button>
        <Button color="blue" onClick={() => updateArticle(article)}>
          Edit
        </Button>
      </Flex>
      <Modal opened={opened} onClose={close} centered>
        <Flex gap={10} justify="center" align="center">
          <Text>Do you really want to delete this product?</Text>
          <Button onClick={() => deleteArticle(article.id)}>OK</Button>
        </Flex>
      </Modal>
    </Card>
  );
}

export default Article;
