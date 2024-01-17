import { useNavigate, useParams } from "react-router-dom";
import styles from "./ProductView.module.css";
import { useEffect, useRef, useState } from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import {
  Text,
  Flex,
  Image,
  Accordion,
  Title,
  Button,
  Modal,
  Textarea,
  Rating,
  Pagination,
} from "@mantine/core";
import { ProductModel } from "../Api";
import Review from "./Review";
import { format } from "date-fns";
import { useProvider } from "../ContextProvider";
import { BASE_URL, getMemberID } from "../../../App";
import { MemberModel } from "../AdminPage/AdminPage";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import axios from "axios";
import Spinner from "../../Misc/Spinner";
export interface ReviewModel {
  id?: string;
  product?: ProductModel;
  member?: MemberModel;
  rating: number;
  review: string;
}

function ProductView() {
  const { productId } = useParams();
  const [product, setProduct] = useState<ProductModel>();
  const [toggleReviews, setToggleReviews] = useState<boolean>(false);
  const navigate = useNavigate();
  const { buyProduct } = useProvider();
  const [opened, { open, close }] = useDisclosure(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [activePage, setActivePage] = useState(1);

  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const form = useForm({
    initialValues: {
      id: "",
      rating: 3,
      review: "",
    },
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [activePage]);

  useEffect(() => {
    if (reviewsRef.current && toggleReviews) {
      reviewsRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [toggleReviews]);

  async function fetchProduct() {
    try {
      setIsLoading(true);
      const res = await axios.get(`${BASE_URL}api/products/${productId}`);
      const data = await res.data;

      const pro: ProductModel = { ...data };

      setProduct(() => pro);
      setIsLoading(false);
    } catch (error: any) {
      navigate("/error");
    }
  }

  async function fetchReviews() {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${BASE_URL}products/productReview/${productId}?page=${activePage - 1}`,
        { withCredentials: true }
      );

      const data = await res.data;

      setReviews(() => data.reviews);
      setTotalPages(() => data.totalPages);
      if (activePage > data.totalPages && data.totalPages != 0) {
        setActivePage(data.totalPages);
      }
      setIsLoading(false);
    } catch (error: any) {
      navigate("/error");
    }
  }

  async function createReview(ProductReview: ReviewModel) {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${BASE_URL}products/productReview/${productId}/${getMemberID()}`,
        ProductReview,
        { withCredentials: true }
      );

      fetchReviews();
      setIsLoading(false);
    } catch (error: any) {
      navigate("/error");
    }
  }

  if (!product) {
    return <Spinner />;
  }
  const {
    id,
    title,
    type,
    released,
    genre,
    language,
    country,
    plot,
    rated,
    runtime,
    poster,
  } = product;

  const items1 = [
    {
      emoji: "❤",
      value: "Type",
      description: type.charAt(0).toUpperCase() + type.slice(1),
    },
    {
      emoji: "⌛",
      value: "Released",
      description: format(new Date(released), "yyyy-MMM-dd"),
    },
    { emoji: "🎦", value: "Genre", description: genre.join(", ") },
    { emoji: "🗣", value: "Language", description: language.join(", ") },
  ];
  const items2 = [
    { emoji: "🗺", value: "Country", description: country.join(", ") },
    { emoji: "🔠", value: "Plot", description: plot },
    { emoji: "💯", value: "Rated", description: rated },
    {
      emoji: "🏃‍♂️",
      value: "Runtime",
      description: `${runtime.split(" ", 1)} min`,
    },
  ];

  function handleEditModal(review: ReviewModel) {
    form.setValues({
      id: review.id,
      rating: review.rating,
      review: review.review,
    });
    open();
  }

  async function editReview(review: ReviewModel) {
    try {
      const res = await axios.put(`${BASE_URL}products/productReview`, review);

      fetchReviews();
    } catch (error: any) {
      navigate("/error");
    }
  }

  function handleReview(review: ReviewModel) {
    review.id ? editReview(review) : createReview(review);
    form.reset();
    close();
  }

  function handleClickOnShowReviews() {
    fetchReviews();
    setToggleReviews((val) => !val);
  }

  if (isLoading) return <Spinner />;

  return (
    <Flex justify={"center"} className={styles.main}>
      <Flex direction={"column"} gap={10} mt={80}>
        <Image ml={10} className={styles.content} src={poster}></Image>
        <Button mih={30} color="blue" onClick={() => buyProduct(id)}>
          Buy
        </Button>
        <Title ta={"center"} order={2}>
          {title}
        </Title>
        <Flex gap={20} justify={"center"} direction={"column"}>
          <Flex gap={20}>
            <Accordion variant="separated" mb={20} className={styles.acc}>
              {items1.map((item) => (
                <Accordion.Item key={item.value} value={item.value}>
                  <Accordion.Control icon={item.emoji}>
                    {item.value}
                  </Accordion.Control>
                  <Accordion.Panel>
                    {item.description.toString()}
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
            <Accordion variant="separated" className={styles.acc}>
              {items2.map((item) => (
                <Accordion.Item key={item.value} value={item.value}>
                  <Accordion.Control icon={item.emoji}>
                    {item.value}
                  </Accordion.Control>
                  <Accordion.Panel>{item.description}</Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Flex>
          <Flex direction={"column"} align={"center"}>
            <Flex gap={10}>
              <Button color="gray" onClick={() => navigate(-1)}>
                <IconArrowLeft />
              </Button>
              <Button onClick={open} color="blue">
                Add review
              </Button>
            </Flex>
            <Flex mt={"1rem"}>
              {!toggleReviews ? (
                <Button
                  onClick={() => {
                    handleClickOnShowReviews();
                  }}
                >
                  Show Reviews
                </Button>
              ) : (
                <Button onClick={() => setToggleReviews((val) => !val)}>
                  Hide Reviews
                </Button>
              )}
            </Flex>
            {toggleReviews && (
              <Flex ref={reviewsRef} direction={"column"}>
                {reviews.length == 0 ? (
                  <Text my={"2rem"}>
                    This product doesn't have reviews, be first!{" "}
                  </Text>
                ) : (
                  <Flex
                    direction={"column"}
                    align={"center"}
                    justify={"center"}
                  >
                    {reviews.map((review) => (
                      <Review
                        key={review.id}
                        review={review}
                        handleEdit={handleEditModal}
                        fetchReviews={fetchReviews}
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
      </Flex>
      <Modal opened={opened} onClose={close} centered>
        <form onSubmit={form.onSubmit((values) => handleReview(values))}>
          <Flex direction={"column"} gap={"1rem"}>
            <Flex justify={"space-between"} align={"center"}>
              <Text>Rating</Text>
              <Rating
                size="xl"
                defaultValue={3}
                fractions={2}
                {...form.getInputProps("rating")}
              />
            </Flex>

            <Textarea
              placeholder="write your review"
              autosize
              minRows={3}
              maxRows={4}
              minLength={2}
              maxLength={255}
              required
              label="Review"
              {...form.getInputProps("review")}
            ></Textarea>

            <Button type="submit">Submit</Button>
          </Flex>
        </form>
      </Modal>
    </Flex>
  );
}

export default ProductView;
