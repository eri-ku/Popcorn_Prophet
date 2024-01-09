import styles from "./ArticleView.module.css";
import { Flex, Title, Image, Button, Text, Pagination } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArticleModel, CommentModel } from "./ArticlesPage";
import Comment from "./Comment";

function ArticleView() {
  const navigate = useNavigate();
  const [toggleComments, setToggleComments] = useState<boolean>(false);

  const [article, setArticle] = useState<ArticleModel>();

  const [comments, setComments] = useState<CommentModel[]>([]);

  const [activePage, setActivePage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const commentRef = useRef<HTMLDivElement>(null);

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
  }

  function handleClickOnShowComments() {
    fetchComments();
    setToggleComments((val) => !val);
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

      <Flex align={"center"} direction={"column"}>
        <Flex gap={10}>
          <Button color="gray" onClick={() => navigate(-1)}>
            <IconArrowLeft size={30} />
          </Button>

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
          <Flex ref={commentRef} direction={"column"}>
            {comments.length == 0 ? (
              <Text my={"2rem"}>
                This article doesn't have comment, be first!{" "}
              </Text>
            ) : (
              <Flex direction={"column"} align={"center"} justify={"center"}>
                {comments.map((comment) => (
                  <Comment key={comment.id} comment={comment} />
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
  );
}

export default ArticleView;
