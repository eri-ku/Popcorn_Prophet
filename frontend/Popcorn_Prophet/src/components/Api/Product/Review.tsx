import {
  Avatar,
  Flex,
  Group,
  Text,
  Rating,
  Button,
  Modal,
} from "@mantine/core";
import styles from "./Review.module.css";
import { ReviewModel } from "./ProductView";
import { useDisclosure } from "@mantine/hooks";

function Review({
  review,
  handleEdit,
  fetchReviews,
}: {
  review: ReviewModel;
  handleEdit: Function;
  fetchReviews: Function;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  async function deleteReview(id: string) {
    const response = await fetch(
      `http://localhost:8080/products/productReview/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      }
    );
    fetchReviews();

    close();
  }

  return (
    <Flex
      wrap={"wrap"}
      p={15}
      className={styles.content}
      direction={"column"}
      gap={"1rem"}
    >
      <Flex>
        <Group>
          <Avatar src="/user.png" alt={review.member?.username} radius="xl" />
          <div>
            <Text size="sm">{review.member?.username}</Text>
            <Rating value={review.rating} fractions={2} readOnly />
          </div>
        </Group>
        <Text pl={54} pt="sm" size="sm">
          {review.review}
        </Text>
      </Flex>
      <Flex justify={"space-between"}>
        <Button size="xs" onClick={() => open()}>
          Delete
        </Button>
        <Button color="blue" size="xs" onClick={() => handleEdit(review)}>
          Edit
        </Button>
      </Flex>
      <Modal opened={opened} onClose={close} centered>
        <Flex gap={10} justify="center" align="center">
          <Text>Do you really want to delete this review?</Text>
          <Button onClick={() => deleteReview(review.id!)}>OK</Button>
        </Flex>
      </Modal>
    </Flex>
  );
}

export default Review;
