import { useForm } from "@mantine/form";
import { countries } from "../../util/countries";
import { DateInput } from "@mantine/dates";
import { format, set } from "date-fns";
import {
  Box,
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
} from "@mantine/core";
import Product from "./Product/Product";
import styles from "./Api.module.css";
import { useState, useEffect } from "react";
import { languages } from "../../util/languages";
import { genres } from "../../util/genres";
import { movieRatings, seriesRatings } from "../../util/ratings";
import Spinner from "../Misc/Spinner";
import { getCartID } from "../../App";
import { useProvider } from "./ContextProvider";
import { useNavigate, useParams } from "react-router-dom";
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

  const form = useForm<ProductModel>({
    initialValues: {
      title: "",
      type: "",
      released: "",
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
        value?.toLowerCase() == "movie"
          ? movieRatings.items.includes(values.rated)
            ? null
            : "Type Movie must be rated from Movie Ratings group"
          : seriesRatings.items.includes(values?.rated)
          ? null
          : "Type Series must be rated from Series Ratings group",
    },
  });

  useEffect(() => {
    fetchProducts();
  }, [activePage]);

  async function fetchProducts() {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `${localStorage.getItem("token")}`,
    };
    if (!page || Number(page) < 1) {
      navigate(`/api/1`);
      setActivePage(1);
      return;
    }
    setIsLoading(true);

    const res = await fetch(
      `http://localhost:8080/api/products/all?page=${activePage - 1}`,
      {
        headers,
      }
    );

    if (!res.ok) {
      throw new Error("Something went wrong!");
    }
    const data = await res.json();

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
    activePage > data.totalPages && setActivePage(data.totalPages);
    activePage < 1 && setActivePage(1);

    setIsLoading(false);

    navigate(`/api/${activePage}`);
  }

  function closeModal() {
    form.reset();
    close();
  }

  async function deleteProduct(id: string) {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `${localStorage.getItem("token")}`,
    };
    setIsLoading(true);
    const res = await fetch(`http://localhost:8080/api/products/delete/${id}`, {
      method: "DELETE",
      body: JSON.stringify(id),
      headers,
    });
    if (!res.ok) {
      throw new Error("Something went wrong!");
    }

    fetchProducts();
    setIsLoading(false);
  }

  async function createProduct(product: ProductModel) {
    const formData = new FormData();
    formData.append("img", product.poster);
    product.released = format(new Date(product.released), "yyyy-MMM-dd");
    product.poster = "";
    Object.keys(product).forEach((key) => formData.append(key, product[key]));
    const headers = {
      Authorization: `${localStorage.getItem("token")}`,
    };
    setIsLoading(true);
    const res = await fetch(`http://localhost:8080/api/products`, {
      method: "POST",
      body: formData,
      headers,
    });
    if (!res.ok) {
      throw new Error("Something went wrong!");
    }
    fetchProducts();
    setIsLoading(false);
  }

  async function editProduct(product: ProductModel) {
    const formData = new FormData();
    formData.append("img", product.poster);
    product.released = format(new Date(product.released), "yyyy-MMM-dd");
    product.poster = "";
    Object.keys(product).forEach((key) => formData.append(key, product[key]));
    const headers = {
      Authorization: `${localStorage.getItem("token")}`,
    };
    setIsLoading(true);
    const res = await fetch(`http://localhost:8080/api/products/update`, {
      method: "PUT",
      body: formData,
      headers,
    });
    if (!res.ok) {
      throw new Error("Something went wrong!");
    }

    fetchProducts();
    setIsLoading(false);
  }

  function handleProduct(product: ProductModel) {
    product.id ? editProduct(product) : createProduct(product);
    form.reset();
    close();
  }

  function handleEditModal(product: ProductModel) {
    form.setValues({
      ...product,
      released: new Date(product.released.toString()),
      type: product.type.charAt(0).toUpperCase() + product.type.slice(1),
    });
    open();
  }
  if (isLoading) {
    return <Spinner />;
  }

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
          <Input type="hidden" {...form.getInputProps("id")}></Input>

          <TextInput
            required
            label="Title"
            maxLength={150}
            {...form.getInputProps("title")}
          />
          <NumberInput
            required
            label="Runtime"
            suffix=" min"
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
            required
            clearable
            minDate={new Date(1888, 9, 14)}
            maxDate={new Date()}
            valueFormat="DD MMM YYYY"
            label="Released"
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
            required
            maxLength={255}
            label="Plot"
            {...form.getInputProps("plot")}
          />
          <Select
            required
            label="Rated"
            {...form.getInputProps("rated")}
            data={[movieRatings, seriesRatings]}
          />
          <FileInput
            required
            clearable
            accept="image/png,image/jpg,image/jpeg"
            label="Upload files"
            placeholder="Upload poster"
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
