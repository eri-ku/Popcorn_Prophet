import styles from "./ArticleView.module.css";
import { Flex, Title, Image, Button, Text, Box } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Review from "../Product/Review";
import { ArticleModel } from "./ArticlesPage";
function ArticleView() {
  const navigate = useNavigate();
  const [toggleComment, setToggleComment] = useState<boolean>(false);

  const [article, setArticle] = useState<ArticleModel>();

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
          <Button mb={5} onClick={() => setToggleComment((val) => !val)}>
            {toggleComment ? `Hide Reviews` : `Show Reviews`}
          </Button>
        </Flex>
        <Flex>{toggleComment && <>{`Empty`}</>}</Flex>
      </Flex>
    </Flex>
  );
}

export default ArticleView;
