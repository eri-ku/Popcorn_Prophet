import styles from "./ArticleView.module.css";
import {
  Flex,
  Title,
  Image,
  Button,
  Text,
  Pagination,
  Modal,
  Textarea,
  Input,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArticleModel, CommentModel } from "./ArticlesPage";
import Comment from "./Comment";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { BASE_URL, getMemberID } from "../../../App";
import axios from "axios";
import Spinner from "../../Misc/Spinner";
import { notifications } from "@mantine/notifications";
function ArticleView() {
  const navigate = useNavigate();
  const [toggleComments, setToggleComments] = useState<boolean>(false);

  const [article, setArticle] = useState<ArticleModel>();

  const [comments, setComments] = useState<CommentModel[]>([]);

  const [activePage, setActivePage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const commentRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string>("");

  const [openedModal, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  const form = useForm({
    initialValues: {
      id: "",
      commentText: "",
    },
  });

  const { articleId } = useParams();

  useEffect(() => {
    getArticle();
  }, []);

  async function getArticle() {
    try {
      setIsLoading(true);

      const response = await axios.get(`${BASE_URL}articles/${articleId}`);

      const data = await response.data;
      setArticle(data);
    } catch (error: any) {
      if (error.response.status == 404) {
        navigate("/notfound");
      } else navigate("/error");
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (commentRef.current && toggleComments) {
      commentRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [toggleComments]);

  useEffect(() => {
    fetchComments();
  }, [activePage]);

  async function fetchComments() {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BASE_URL}articles/articleComment/${articleId}?page=${
          activePage - 1
        }`,
        { withCredentials: true }
      );

      const data = await response.data;
      setComments(data.articleComment);
      setTotalPages(data.totalPages);
      if (activePage > data.totalPages && data.totalPages != 0) {
        setActivePage(data.totalPages);
      }
    } catch (error: any) {
      if (error.response.status == 404) {
        navigate("/notfound");
      } else navigate("/error");
    }

    setIsLoading(false);
  }

  function handleClickOnShowComments() {
    fetchComments();
    setToggleComments((val) => !val);
  }

  async function editComment(comment: CommentModel) {
    try {
      setIsLoading(true);

      const res = await axios.put(
        `${BASE_URL}articles/articleComment`,
        comment,
        { withCredentials: true }
      );
      notifications.show({
        title: "Success",
        message: "Comment edited",
        withBorder: true,
        color: "gray",
        icon: "📝",
      });

      fetchComments();
      closeCommentModal();
    } catch (error: any) {
      if (error.response.status == 400) {
        setValidationMessage(() => error.response.data.join(".\n\n"));
      } else if (error.response.status == 404) {
        closeCommentModal();
        navigate("/notfound");
      } else {
        closeCommentModal();
        navigate("/error");
      }
    }
    setIsLoading(false);
  }

  async function createComment(comment: CommentModel) {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${BASE_URL}articles/articleComment/${articleId}/${getMemberID()}`,
        comment,
        { withCredentials: true }
      );
      notifications.show({
        title: "Success",
        message: "Comment created",
        withBorder: true,
        color: "gray",
        icon: "✍️",
      });
      fetchComments();
      closeCommentModal();
    } catch (error: any) {
      if (error.response.status == 400) {
        setValidationMessage(() => error.response.data.join(".\n\n"));
      } else if (error.response.status == 404) {
        closeCommentModal();
        navigate("/notfound");
      } else {
        closeCommentModal();
        navigate("/error");
      }
    }
    setIsLoading(false);
  }

  function handleComment(comment: CommentModel) {
    comment.id ? editComment(comment) : createComment(comment);
  }

  function closeCommentModal() {
    setValidationMessage("");
    form.reset();
    closeModal();
  }

  function handleEditModal(comment: CommentModel) {
    form.setValues({
      id: comment.id,
      commentText: comment.commentText,
    });
    openModal();
  }

  if (isLoading) return <Spinner />;

  return (
    <Flex className={styles.main} p={10}>
      <Flex className={styles.article}>
        <Flex>
          <Image
            fit="cover"
            className={styles.img}
            src={article?.poster}
          ></Image>
        </Flex>

        <Flex direction={"column"} className={styles.text}>
          <Title order={1} ta={"center"} mb={"1rem"}>
            {article?.title}
          </Title>
          <Text>{article?.content}</Text>
        </Flex>
      </Flex>

      <Flex align={"center"} direction={"column"} m={"1rem"}>
        <Flex gap={10} direction={"column"} align={"center"}>
          <Flex gap={"1rem"}>
            <Button color="gray" onClick={() => navigate(-1)}>
              <IconArrowLeft size={30} />
            </Button>
            <Button color="blue" onClick={() => openModal()}>
              Add Comment
            </Button>
          </Flex>
          <Flex>
            {toggleComments ? (
              <Button mb={5} onClick={() => setToggleComments((val) => !val)}>
                Hide Comments
              </Button>
            ) : (
              <Button mb={5} onClick={() => handleClickOnShowComments()}>
                Show Comments
              </Button>
            )}
          </Flex>
          {toggleComments && (
            <Flex ref={commentRef} direction={"column"} m={"1rem"}>
              {comments.length == 0 ? (
                <Text my={"2rem"}>
                  This article doesn't have comment, be first!{" "}
                </Text>
              ) : (
                <Flex
                  direction={"column"}
                  align={"center"}
                  justify={"center"}
                  gap={"1rem"}
                >
                  {comments.map((comment) => (
                    <Comment
                      key={comment.id}
                      comment={comment}
                      editComment={handleEditModal}
                      fetchComments={fetchComments}
                    />
                  ))}
                  <Pagination
                    m={"1rem"}
                    total={totalPages}
                    size="sm"
                    radius="sm"
                    withEdges
                    gap={5}
                    value={activePage}
                    onChange={setActivePage}
                  />
                </Flex>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
      <Modal opened={openedModal} onClose={closeCommentModal} centered>
        <form onSubmit={form.onSubmit((values) => handleComment(values))}>
          <Flex direction={"column"} gap={"1rem"}>
            <Input {...form.getInputProps("id")} type="hidden" />
            {validationMessage && (
              <Flex justify="center" align="center">
                <Text c="red">{validationMessage}</Text>
              </Flex>
            )}
            <Textarea
              placeholder="write your commentary"
              autosize
              minRows={3}
              maxRows={4}
              label="Comment"
              {...form.getInputProps("commentText")}
            ></Textarea>

            <Button type="submit">Submit</Button>
          </Flex>
        </form>
      </Modal>
    </Flex>
  );
}

export default ArticleView;
