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
import { getMemberID } from "../../../App";
function ArticleView() {
  const navigate = useNavigate();
  const [toggleComments, setToggleComments] = useState<boolean>(false);

  const [article, setArticle] = useState<ArticleModel>();

  const [comments, setComments] = useState<CommentModel[]>([]);

  const [activePage, setActivePage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const commentRef = useRef<HTMLDivElement>(null);

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
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `${localStorage.getItem("token")}`,
    };

    const response = await fetch(
      `http://localhost:8080/articles/${articleId}`,
      {
        method: "GET",
        headers: headers,
      }
    );

    const data = await response.json();
    setArticle(data);
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
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `${localStorage.getItem("token")}`,
    };

    const response = await fetch(
      `http://localhost:8080/articles/articleComment/${articleId}?page=${
        activePage - 1
      }`,
      {
        method: "GET",
        headers: headers,
      }
    );

    const data = await response.json();
    setComments(data.articleComment);
    setTotalPages(data.totalPages);
    if (activePage > data.totalPages && data.totalPages != 0) {
      setActivePage(data.totalPages);
    }
  }

  function handleClickOnShowComments() {
    fetchComments();
    setToggleComments((val) => !val);
  }

  async function editComment(comment: CommentModel) {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `${localStorage.getItem("token")}`,
    };

    const response = await fetch(
      `http://localhost:8080/articles/articleComment`,
      {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(comment),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    fetchComments();
  }

  async function createComment(comment: CommentModel) {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `${localStorage.getItem("token")}`,
    };

    const response = await fetch(
      `http://localhost:8080/articles/articleComment/${articleId}/${getMemberID()}`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(comment),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    fetchComments();
  }

  function handleComment(comment: CommentModel) {
    comment.id ? editComment(comment) : createComment(comment);
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

  return (
    <Flex className={styles.main} p={10}>
      <Flex className={styles.article}>
        <Flex>
          <Image
            fit="cover"
            className={styles.img}
            src="https://m.media-amazon.com/images/M/MV5BMGNiOTBhZmMtNGU1Yi00NWQzLTlkOTctOTU1YjNkMjJhYTdlXkEyXkFqcGdeQXVyMTYzMDM0NTU@._V1_.jpg"
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
      <Modal opened={openedModal} onClose={closeModal} centered>
        <form onSubmit={form.onSubmit((values) => handleComment(values))}>
          <Flex direction={"column"} gap={"1rem"}>
            <Input {...form.getInputProps("id")} type="hidden" />
            <Textarea
              placeholder="write your commentary"
              autosize
              minRows={3}
              maxRows={4}
              minLength={2}
              maxLength={255}
              required
              label="Review"
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
