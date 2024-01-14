import {
  Flex,
  Pagination,
  Textarea,
  TextInput,
  Modal,
  Select,
  Button,
  Input,
  FileInput,
} from "@mantine/core";
import Article from "./Article";
import styles from "./ArticlesPage.module.css";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { MemberModel } from "../AdminPage/AdminPage";
import { getMemberID } from "../../../App";
import {
  IconArrowBarToRight,
  IconArrowBarToLeft,
  IconArrowLeft,
  IconArrowRight,
  IconGripHorizontal,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useProvider } from "../ContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import { set } from "date-fns";

export interface CommentModel {
  id?: string;
  commentText: string;
  likes?: number;
  member?: MemberModel;
}

export interface ArticleModel {
  id?: string;
  title: string;
  content: string;
  rating: string;
  author: MemberModel;
  likes: number;
  articleComments: CommentModel[];
  poster: string | File;
}

function ArticlesPage() {
  const { isArticleFormOpened, closeArticleForm, openArticleForm } =
    useProvider();
  const [articles, setArticles] = useState<ArticleModel[]>([]);

  const { pageNum } = useParams();
  const [page, setPage] = useState(Number(pageNum));

  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  const isSmall = useMediaQuery("(max-width: 992px)");

  const form = useForm({
    initialValues: {
      id: "",
      title: "",
      content: "",
      rating: "",
      poster: "",
    },
  });

  useEffect(() => {
    getArticles();
  }, [page, isSmall]);

  async function getArticles() {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `${localStorage.getItem("token")}`,
    };

    if (!page || Number(page) < 1) {
      navigate(`/api/articles/1`);
      setPage(1);
      return;
    }

    const res = await fetch(
      `http://localhost:8080/articles?page=${page - 1}&size=${
        isSmall ? "1" : "2"
      }`,
      {
        headers,
      }
    );
    if (!res.ok) {
      throw new Error("Something went wrong!");
    }

    const data = await res.json();
    setArticles(data.articles);
    setTotalPages(data.totalPages);

    page > data.totalPages && setPage(data.totalPages);
    page < 1 && setPage(1);

    navigate(`/api/articles/${page}`);
  }

  async function createArticle(article: any) {
    const formData = new FormData();
    formData.append("img", article.poster);
    article.poster = "";

    Object.keys(article).forEach((key) => formData.append(key, article[key]));

    console.log(formData);

    const headers = {
      Authorization: `${localStorage.getItem("token")}`,
    };
    const res = await fetch(`http://localhost:8080/articles/${getMemberID()}`, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!res.ok) {
      throw new Error("Something went wrong!");
    }
    getArticles();
  }

  async function updateArticle(article: any) {
    const formData = new FormData();
    formData.append("img", article.poster);
    article.poster = "";
    Object.keys(article).forEach((key) => formData.append(key, article[key]));

    const headers = {
      Authorization: `${localStorage.getItem("token")}`,
    };
    const res = await fetch(`http://localhost:8080/articles/${article.id}`, {
      method: "PUT",
      headers,
      body: formData,
    });
    if (!res.ok) {
      throw new Error("Something went wrong!");
    }
    getArticles();
  }

  async function deleteArticle(id: string) {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `${localStorage.getItem("token")}`,
    };
    const res = await fetch(`http://localhost:8080/articles/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) {
      throw new Error("Something went wrong!");
    }
    getArticles();
  }

  function handleArticle(article: any) {
    console.log(article);
    article.id ? updateArticle(article) : createArticle(article);
    form.reset();
    closeArticleForm();
  }

  function closeModal() {
    form.reset();
    closeArticleForm();
  }

  function handleEditModal(article: any) {
    form.setValues({
      ...article,
    });
    openArticleForm();
  }

  return (
    <Flex
      justify={"center"}
      align={"center"}
      className={styles.main}
      gap={"1rem"}
    >
      <Flex direction={"column"}>
        <Flex justify={"center"}>
          <Pagination
            m={"1rem"}
            total={totalPages}
            radius={"xl"}
            size="xl"
            withEdges
            value={page}
            onChange={setPage}
            nextIcon={IconArrowRight}
            previousIcon={IconArrowLeft}
            firstIcon={IconArrowBarToLeft}
            lastIcon={IconArrowBarToRight}
            dotsIcon={IconGripHorizontal}
          />
        </Flex>
        <Flex gap={"sm"}>
          {articles.map((article) => (
            <Article
              article={article}
              key={article.id}
              updateArticle={handleEditModal}
              deleteArticle={deleteArticle}
            />
          ))}
        </Flex>
      </Flex>

      <Modal
        opened={isArticleFormOpened}
        onClose={closeModal}
        title="Create Article"
        centered
      >
        <form
          onSubmit={form.onSubmit((values) => {
            const article = {
              ...values,
            };
            handleArticle(article);
          })}
        >
          <Input type="hidden" {...form.getInputProps("id")}></Input>
          <TextInput
            required
            label="Title"
            maxLength={50}
            minLength={3}
            {...form.getInputProps("title")}
          />
          <Textarea
            autosize={true}
            minRows={3}
            minLength={10}
            maxRows={5}
            required
            maxLength={1000}
            label="Content"
            {...form.getInputProps("content")}
          />
          <Select
            required
            placeholder="Select rating"
            allowDeselect={false}
            nothingFoundMessage="Nothing found..."
            searchable
            label="Rating"
            data={["Outstanding", "Good", "Bad"]}
            {...form.getInputProps("rating")}
          />
          <FileInput
            required
            clearable
            accept="image/png,image/jpg,image/jpeg"
            label="Upload files"
            placeholder="Upload poster"
            {...form.getInputProps("poster")}
          />

          <Flex justify={"end"} mt={"1rem"}>
            <Button type="submit">Submit</Button>
          </Flex>
        </form>
      </Modal>
    </Flex>
  );
}

export default ArticlesPage;
