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
import { useEffect, useState } from "react";
import { BASE_URL, getAuth } from "../../../App";

import { IconThumbUp } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { findRole } from "../ContextProvider";
import { notifications } from "@mantine/notifications";
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
  const navigate = useNavigate();
  const [likedMembersUsernames, setLikedMembersUsernames] = useState<string[]>(
    comment.likedMembersUsernames!
  );
  const [isAlreadyLiked, setAlreadyLiked] = useState<boolean>(
    likedMembersUsernames.includes(getAuth()!)
  );

  const [likes, setLikes] = useState<number>(comment.likes!);

  async function deleteReview(id: string) {
    try {
      const response = await axios.delete(
        `${BASE_URL}articles/articleComment/${id}`,
        { withCredentials: true }
      );
      notifications.show({
        title: "Success",
        message: "Comment deleted successfully",
        color: "gray",
        withBorder: true,
        icon: "😭",
      });
      fetchComments();
      close();
    } catch (error: any) {
      if (error.response.status == 404) {
        close();
        navigate("/notfound");
      } else {
        close();
        navigate("/error");
      }
    }
  }
  useEffect(() => {
    setAlreadyLiked(() => likedMembersUsernames.includes(getAuth()!));
  }, [likedMembersUsernames]);

  async function changeLike() {
    try {
      const res = await axios.patch(
        `${BASE_URL}articles/articleComment/${
          comment.id
        }/like?memberName=${getAuth()}`,
        { withCredentials: true }
      );

      const data = res.data;
      setLikedMembersUsernames(() => data.likedMembersUsernames);
      setLikes(() => data.likes);
    } catch (error: any) {
      if (error.response.status == 404) {
        navigate("/notfound");
      } else navigate("/error");
    }
  }

  return (
    <Paper withBorder radius="md" className={styles.comment}>
      <Flex justify={"end"} m={"0.5rem"} gap="0.5rem">
        <Button
          size="xs"
          color={isAlreadyLiked ? "lime" : "gray"}
          onClick={() => changeLike()}
        >
          <IconThumbUp fill={isAlreadyLiked ? "" : "black"} />
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
        {getAuth() === comment.member?.username && (
          <Button color="blue" onClick={() => editComment(comment)}>
            Edit
          </Button>
        )}
        {(findRole("ROLE_A&M") || getAuth() === comment.member?.username) && (
          <Button onClick={() => open()}>Delete</Button>
        )}
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
