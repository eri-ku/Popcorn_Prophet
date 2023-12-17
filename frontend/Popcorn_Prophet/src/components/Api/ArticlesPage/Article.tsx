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
} from "@mantine/core";
import { Link } from "react-router-dom";
function Article() {
  return (
    <Card withBorder radius="lg" className={styles.card}>
      <Flex gap={"lg"} direction={"column"}>
        <Card.Section>
          <Link to={`/api/articles/${1}`}>
            <Image src="https://i.imgur.com/Cij5vdL.png" h={500} />
          </Link>
        </Card.Section>

        <Flex direction={"column"} gap={5}>
          <Badge
            className={styles.rating}
            variant="gradient"
            gradient={{ from: "yellow", to: "red" }}
          >
            outstanding
          </Badge>
          <Text
            className={styles.title}
            fw={500}
            component={Link}
            to={`/api/articles/${1}`}
          >
            Resident Evil Village review
          </Text>

          <Text fz="sm" c="dimmed" lineClamp={3}>
            Resident Evil Village is a direct sequel to 2017’s Resident Evil 7,
            but takes a very different direction to its predecessor, namely the
            fact that this time round instead of fighting against various
            mutated zombies, you’re now dealing with more occult enemies like
            werewolves and vampires.
          </Text>
        </Flex>
      </Flex>

      <Group justify="space-between" className={styles.footer}>
        <Center>
          <Avatar
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
            size={24}
            radius="xl"
            mr="xs"
          />
          <Text fz="sm" inline>
            Bill Wormeater
          </Text>
        </Center>

        <Group gap={8} mr={0}>
          <ActionIcon className={styles.action}>
            <IconHeart
              style={{ width: rem(16), height: rem(16) }}
              color="red"
            />
          </ActionIcon>
          <ActionIcon className={styles.action}>
            <IconMessage
              style={{ width: rem(16), height: rem(16) }}
              color={"orange"}
            />
          </ActionIcon>
        </Group>
      </Group>
    </Card>
  );
}

export default Article;
