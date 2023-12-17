import { Avatar, Flex, Group, Text } from "@mantine/core";
import styles from "./Review.module.css";

function Review() {
  return (
    <Flex p={15} className={styles.content}>
      <div>
        <Group>
          <Avatar
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
            alt="Jacob Warnhalter"
            radius="xl"
          />
          <div>
            <Text size="sm">Jacob Warnhalter</Text>
            <Text size="xs" c="dimmed">
              10 minutes ago
            </Text>
          </div>
        </Group>
        <Text pl={54} pt="sm" size="sm">
          This Pokémon likes to lick its palms that are sweetened by being
          soaked in honey. Teddiursa concocts its own honey by blending fruits
          and pollen collected by Beedrill. Blastoise has water spouts that
          protrude from its shell. The water spouts are very accurate.
        </Text>
      </div>
    </Flex>
  );
}

export default Review;