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

  async function deleteReview(id: string) {
    const response = await fetch(
      `http://localhost:8080/articles/articleComment/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      }
    );
    fetchComments();
    close();
  }

  return (
    <Paper withBorder radius="md" className={styles.comment}>
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
