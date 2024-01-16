import axios from "axios";
import { CommentModel } from "./ArticlesPage";
import styles from "./Comment.module.css";
import {
  Avatar,
  Group,
  Paper,
  Text,
  Box,
  Button,
  Flex,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import Spinner from "../../Misc/Spinner";
import { BASE_URL } from "../../../App";

import { IconThumbUp } from "@tabler/icons-react";
import { is } from "date-fns/locale";
function Comment({
  comment,
  editComment,
  fetchComments,
}: {
  comment: CommentModel;
  editComment: Function;
  fetchComments: Function;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //TODO
  const [isAlreadyLiked, setAlreadyLiked] = useState<boolean>(false);

  const [likes, setLikes] = useState<number>(comment.likes!);

  async function deleteReview(id: string) {
    try {
      setIsLoading(true);

      const response = await axios.delete(
        `${BASE_URL}articles/articleComment/${id}`,
        { withCredentials: true }
      );
      fetchComments();
      close();
      setIsLoading(false);
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  async function changeLike(alreadyLiked: boolean) {
    try {
      const res = await axios.patch(
        `${BASE_URL}articles/articleComment/${comment.id}/like?isAlreadyLiked=${alreadyLiked}`,
        { withCredentials: true }
      );

      setAlreadyLiked((isAlreadyLiked) => !isAlreadyLiked);
      setLikes((likes) => (isAlreadyLiked ? likes - 1 : likes + 1));
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  if (isLoading) return <Spinner />;

  return (
    <Paper withBorder radius="md" className={styles.comment}>
      <Flex justify={"end"} m={"0.5rem"} gap="0.5rem">
        <Button
          size="xs"
          color={isAlreadyLiked ? "lime" : "gray"}
          onClick={() => changeLike(isAlreadyLiked)}
        >
          {isAlreadyLiked ? <IconThumbUp /> : <IconThumbUp fill="black" />}
        </Button>
        <Text>{likes}</Text>
      </Flex>
      <Group>
        <Avatar src="/user.png" alt={comment.member!.username} radius="xl" />
        <div>
          <Text fz="sm">{comment.member!.username}</Text>
        </div>
      </Group>
      <Box className={styles.body}>
        <Text className={styles.content}>{comment.commentText}</Text>
      </Box>

      <Flex justify={"space-between"} mt={"1rem"}>
        <Button color="blue" onClick={() => editComment(comment)}>
          Edit
        </Button>
        <Button onClick={() => open()}>Delete</Button>
      </Flex>

      <Modal opened={opened} onClose={close} centered>
        <Flex gap={10} justify="center" align="center">
          <Text>Do you really want to delete this comment?</Text>
          <Button onClick={() => deleteReview(comment.id!)}>OK</Button>
        </Flex>
      </Modal>
    </Paper>
  );
}

export default Comment;
