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
  Text,
} from "@mantine/core";
import Article from "./Article";
import styles from "./ArticlesPage.module.css";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { MemberModel } from "../AdminPage/AdminPage";
import { BASE_URL, getMemberID } from "../../../App";
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
import axios from "axios";
import Spinner from "../../Misc/Spinner";
import { notifications } from "@mantine/notifications";

export interface CommentModel {
  id?: string;
  commentText: string;
  likes?: number;
  member?: MemberModel;
  likedMembersUsernames?: string[];
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
  likedMembersUsernames?: string[];
  [key: string]: any;
}

function ArticlesPage() {
  const { isArticleFormOpened, closeArticleForm, openArticleForm } =
    useProvider();
  const [articles, setArticles] = useState<ArticleModel[]>([]);

  const { pageNum } = useParams();
  const [page, setPage] = useState(Number(pageNum));

  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const isSmall = useMediaQuery("(max-width: 992px)");
  const [validationMessage, setValidationMessage] = useState<string>("");

  const form = useForm({
    initialValues: {
      id: "",
      title: "",
      content: "",
      rating: "",
      poster: "",
    },
    validate: {
      poster: (value: string) =>
        value ? null : "Please upload poster for the article",
    },
  });

  useEffect(() => {
    getArticles();
  }, [page, isSmall]);

  async function getArticles() {
    if (!page || Number(page) < 1) {
      navigate(`/api/articles/1`);
      setPage(1);
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${BASE_URL}articles?page=${page - 1}&size=${isSmall ? "1" : "2"}`,
        { withCredentials: true }
      );

      console.log(res);
      const data = await res.data;

      const newArticles: ArticleModel[] = [];
      for (const key in data.articles) {
        newArticles.push({
          id: data.articles[key].id,
          title: data.articles[key].title,
          content: data.articles[key].content,
          rating: data.articles[key].rating,
          likes: data.articles[key].likes,
          articleComments: data.articles[key].articleComments,
          poster: data.articles[key].poster,
          likedMembersUsernames: data.articles[key].likedMembersUsernames,
          author: data.articles[key].author,
        });
      }

      setArticles(() => newArticles);
      setArticles(newArticles);

      setTotalPages(data.totalPages);

      page > data.totalPages && setPage(data.totalPages);
      page < 1 && setPage(1);

      navigate(`/api/articles/${page}`);
    } catch (error: any) {
      if (error.response.status == 404) {
        navigate("/notfound");
      } else {
        navigate("/error");
      }
    }

    setIsLoading(false);
  }

  async function createArticle(article: any) {
    const formData = new FormData();
    formData.append("img", article.poster);
    article.poster = "";
    Object.keys(article).forEach((key) => formData.append(key, article[key]));

    try {
      setIsLoading(true);

      const res = await axios.post(
        `${BASE_URL}articles/${getMemberID()}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      notifications.show({
        title: "Success",
        message: "Article created",
        color: "gray",
        withBorder: true,
        icon: "📰",
      });
      getArticles();
      closeModal();
    } catch (error: any) {
      if (error.response.status == 400) {
        console.log(error.response.data);
        setValidationMessage(() => error.response.data.join(".\n\n"));
      } else if (error.response.status == 404) {
        closeModal();
        navigate("/notfound");
      } else {
        closeModal();
        navigate("/error");
      }
    }
    setIsLoading(false);
  }

  async function updateArticle(article: any) {
    const formData = new FormData();
    formData.append("img", article.poster);
    article.poster = "";
    Object.keys(article).forEach((key) => formData.append(key, article[key]));

    try {
      setIsLoading(true);

      const res = await axios.put(
        `${BASE_URL}articles/${article.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      notifications.show({
        title: "Success",
        message: "Article updated",
        color: "gray",
        withBorder: true,
        icon: "📎",
      });
      console.log("updated");
      getArticles();
      closeModal();
    } catch (error: any) {
      if (error.response.status == 400) {
        setValidationMessage(() => error.response.data.join(".\n\n"));
      } else if (error.response.status == 404) {
        closeModal();
        navigate("/notfound");
      } else {
        closeModal();
        navigate("/error");
      }
    }
    setIsLoading(false);
  }

  async function deleteArticle(id: string) {
    try {
      setIsLoading(true);

      const res = await axios.delete(`${BASE_URL}articles/${id}`);
      notifications.show({
        title: "Success",
        message: "Article deleted",
        color: "gray",
        withBorder: true,
        icon: "🚮",
      });

      getArticles();
    } catch (error: any) {
      if (error.response.status == 404) {
        navigate("/notfound");
      } else navigate("/error");
    }

    setIsLoading(false);
  }

  function handleArticle(article: any) {
    article.id ? updateArticle(article) : createArticle(article);
  }

  function closeModal() {
    setValidationMessage("");
    form.reset();
    closeArticleForm();
  }

  function handleEditModal(article: any) {
    form.setValues({
      ...article,
    });
    openArticleForm();
  }

  if (isLoading) return <Spinner />;

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
              getArticles={getArticles}
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
          {validationMessage && (
            <Flex justify="center" align="center">
              <Text c="red">{validationMessage}</Text>
            </Flex>
          )}

          <TextInput
            label="Title"
            required
            minLength={3}
            maxLength={100}
            {...form.getInputProps("title")}
          />
          <Textarea
            required
            autosize={true}
            minRows={3}
            maxRows={5}
            minLength={3}
            maxLength={1000}
            label="Content"
            {...form.getInputProps("content")}
          />
          <Select
            placeholder="Select rating"
            allowDeselect={false}
            nothingFoundMessage="Nothing found..."
            searchable
            required
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
