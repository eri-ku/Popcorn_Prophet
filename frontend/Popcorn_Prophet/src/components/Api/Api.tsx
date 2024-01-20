import { useForm } from "@mantine/form";
import { countries } from "../../util/countries";
import { DateInput } from "@mantine/dates";
import { format } from "date-fns";
import {
  FileInput,
  Button,
  Modal,
  TextInput,
  Textarea,
  Select,
  Flex,
  Input,
  MultiSelect,
  NumberInput,
  Pagination,
  Text,
} from "@mantine/core";
import Product from "./Product/Product";
import styles from "./Api.module.css";
import { useState, useEffect } from "react";
import { languages } from "../../util/languages";
import { genres } from "../../util/genres";
import { movieRatings, seriesRatings } from "../../util/ratings";
import Spinner from "../Misc/Spinner";
import { BASE_URL } from "../../App";
import { useProvider } from "./ContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { clean } from "./ApiNavbar";
export interface ProductModel {
  id?: string;
  title: string;
  type: string;
  released: Date | string;
  genre: string[];
  language: string[];
  country: string[];
  plot: string;
  rated: string;
  runtime: string;
  poster: File | string;
  [key: string]: any;
}

function Api({
  opened,
  close,
  open,
}: {
  opened: boolean;
  close: Function;
  open: Function;
}) {
  const { buyProduct, prod, setProds } = useProvider();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { page } = useParams();
  const [activePage, setActivePage] = useState<number>(Number(page));
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState<number>(0);

  const [validationMessage, setValidationMessage] = useState<string>("");

  const form = useForm<ProductModel>({
    initialValues: {
      title: "",
      type: "",
      released: new Date(),
      genre: [],
      language: [],
      country: [],
      plot: "",
      rated: "",
      id: "",
      poster: "",
      runtime: "",
    },
    validate: {
      type: (value: any, values: any) =>
        !value
          ? "Type is required"
          : value.toLowerCase() == "movie"
          ? movieRatings.items.includes(values.rated)
            ? null
            : "Type Movie must be rated from Movie Ratings group"
          : seriesRatings.items.includes(values?.rated)
          ? null
          : "Type Series must be rated from Series Ratings group",
      title: (value: any) =>
        value.length < 2
          ? "Title must be at least 3 characters"
          : value.length > 100
          ? "Title must be less than 150 characters"
          : null,
      plot: (value: any) =>
        value.length < 2
          ? "Plot must be at least 3 characters"
          : value.length > 255
          ? "Plot must be less than 255 characters"
          : null,
      poster: (value: any) => (!value ? "Poster is required" : null),
      runtime: (value: any) =>
        value < 1 ? "Runtime must be at least 1 minute" : null,
      released: (value: any) => (!value ? "Released is required" : null),
    },
  });

  useEffect(() => {
    fetchProducts();
  }, [activePage]);

  async function fetchProducts() {
    if (!page || Number(page) < 1) {
      navigate(`/api/products/1`);
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${BASE_URL}api/products/all?page=${activePage - 1}`
      );
      const data = await res.data;

      const pro: ProductModel[] = [];
      for (const key in data.products) {
        pro.push({
          id: data.products[key].id,
          title: data.products[key].title,
          rated: data.products[key].rated,
          poster: data.products[key].poster,
          country: data.products[key].country,
          plot: data.products[key].plot,
          type: data.products[key].type,
          released: data.products[key].released,
          genre: data.products[key].genre,
          language: data.products[key].language,
          runtime: data.products[key].runtime,
        });
      }

      setProds(pro);
      setTotalPages(() => data.totalPages);

      navigate(`/api/products/${activePage}`);
    } catch (err: any) {
      if (err.response.status == 404) {
        navigate("/notfound");
      } else navigate("/error");
    }

    setIsLoading(false);
  }

  function closeModal() {
    setValidationMessage("");
    form.reset();
    close();
  }

  async function deleteProduct(id: string) {
    try {
      setIsLoading(true);
      const res = await axios.delete(`${BASE_URL}api/products/delete/${id}`);

      fetchProducts();
    } catch (err: any) {
      if (err.response.status == 404) {
        navigate("/notfound");
      } else navigate("/error");
    }

    setIsLoading(false);
  }

  async function createProduct(product: ProductModel) {
    const formData = new FormData();
    formData.append("img", product.poster);
    product.released = format(new Date(product.released), "yyyy-MMM-dd");
    product.poster = "";
    Object.keys(product).forEach((key) => formData.append(key, product[key]));
    try {
      setIsLoading(true);
      const res = await axios.post(`${BASE_URL}api/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      cleanForm();
      fetchProducts();
    } catch (err: any) {
      if (err.response.status == 400) {
        setValidationMessage(() => err.response.data.join(".\n\n"));
      } else if (err.response.status == 404) {
        cleanForm();
        navigate("/notfound");
      } else {
        cleanForm();
        navigate("/error");
      }
    }
    setIsLoading(false);
  }

  function cleanForm() {
    setValidationMessage("");
    form.reset();
    close();
  }

  async function editProduct(product: ProductModel) {
    const formData = new FormData();
    formData.append("img", product.poster);
    product.released = format(new Date(product.released), "yyyy-MMM-dd");
    product.poster = "";
    Object.keys(product).forEach((key) => formData.append(key, product[key]));
    try {
      setIsLoading(true);
      const res = await axios.put(`${BASE_URL}api/products/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      cleanForm();
      fetchProducts();
    } catch (err: any) {
      if (err.response.status == 400) {
        setValidationMessage(() => err.response.data.join(".\n\n"));
      } else if (err.response.status == 404) {
        cleanForm();
        navigate("/notfound");
      } else {
        cleanForm();
        navigate("/error");
      }
    }
    setIsLoading(false);
  }

  function handleProduct(product: ProductModel) {
    product.id ? editProduct(product) : createProduct(product);
  }

  function handleEditModal(product: ProductModel) {
    form.setValues({
      ...product,
      released: new Date(product.released.toString()),
      type: product.type
        ? product.type.charAt(0).toUpperCase() + product.type.slice(1)
        : "",
    });
    open();
  }
  if (isLoading) return <Spinner />;

  return (
    <>
      <Flex className={styles.main}>
        <Flex direction={"column"} align={"center"}>
          <Flex gap={"1rem"} wrap={"wrap"} justify={"center"}>
            {prod.map((product: ProductModel) => (
              <Product
                key={product.id}
                product={product}
                deleteProduct={deleteProduct}
                editProduct={handleEditModal}
                buyProduct={buyProduct}
              />
            ))}
          </Flex>
          <Flex>
            <Pagination
              m={"1rem"}
              total={totalPages}
              size="lg"
              withEdges
              value={activePage}
              onChange={setActivePage}
            />
          </Flex>
        </Flex>
      </Flex>

      <Modal
        opened={opened}
        onClose={closeModal}
        title="Create Product"
        centered
      >
        <form
          onSubmit={form.onSubmit((values) => {
            const product: ProductModel = {
              ...values,
            };
            handleProduct(product);
          })}
        >
          <Input type="hidden" {...form.getInputProps("id")} />
          {validationMessage && (
            <Flex justify="center" align="center">
              <Text c="red">{validationMessage}</Text>
            </Flex>
          )}

          <TextInput
            label="Title"
            required
            maxLength={150}
            {...form.getInputProps("title")}
          />
          <NumberInput
            label="Runtime"
            suffix=" min"
            required
            mt="md"
            allowNegative={false}
            {...form.getInputProps("runtime")}
          />
          <Select
            required
            label="Type"
            data={["Movie", "Series"]}
            {...form.getInputProps("type")}
          />

          <DateInput
            clearable
            minDate={new Date(1888, 9, 14)}
            maxDate={new Date()}
            valueFormat="DD MMM YYYY"
            label="Released"
            required
            {...form.getInputProps("released")}
          />

          <MultiSelect
            nothingFoundMessage="Nothing found..."
            hidePickedOptions
            searchable
            clearable
            label="Genre"
            data={genres}
            {...form.getInputProps("genre")}
          />

          <MultiSelect
            nothingFoundMessage="Nothing found..."
            hidePickedOptions
            searchable
            clearable
            label="Language"
            data={languages}
            {...form.getInputProps("language")}
          />

          <MultiSelect
            nothingFoundMessage="Nothing found..."
            hidePickedOptions
            searchable
            clearable
            label="Country"
            data={countries}
            {...form.getInputProps("country")}
          />
          <Textarea
            autosize={true}
            minRows={3}
            maxLength={255}
            label="Plot"
            required
            {...form.getInputProps("plot")}
          />
          <Select
            label="Rated"
            required
            {...form.getInputProps("rated")}
            data={[movieRatings, seriesRatings]}
          />
          <FileInput
            required
            clearable
            accept="image/png,image/jpg,image/jpeg"
            label="Upload poster"
            {...form.getInputProps("poster")}
          />
          <Flex justify={"end"}>
            <Button type="submit" mt={10}>
              Submit
            </Button>
          </Flex>
        </form>
      </Modal>
    </>
  );
}

export default Api;
