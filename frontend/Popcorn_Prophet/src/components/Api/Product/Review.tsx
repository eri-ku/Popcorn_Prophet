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
import axios from "axios";
import { BASE_URL, getMemberID } from "../../../App";
import { useState } from "react";
import Spinner from "../../Misc/Spinner";
import { useNavigate } from "react-router-dom";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  async function deleteReview(id: string) {
    try {
      setIsLoading(true);
      const res = await axios.delete(
        `${BASE_URL}products/productReview/${id}`,
        { withCredentials: true }
      );
      const data = await res.data;
      fetchReviews();

      close();
      setIsLoading(false);
    } catch (error) {
      navigate("/error");
    }
  }

  if (isLoading) return <Spinner />;
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
