import { useForm } from "@mantine/form";
import { countries } from "../../util/countries";
import { DateInput } from "@mantine/dates";
import { format } from "date-fns";
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
} from "@mantine/core";
import Product from "./Product/Product";
import styles from "./Api.module.css";
import { useState, useEffect } from "react";
import { languages } from "../../util/languages";
import { genres } from "../../util/genres";
import { movieRatings, seriesRatings } from "../../util/ratings";
export interface ProductModel {
  id?: string;
  title: string;
  type: string;
  released: Date | string;
  genre: string[];
  language: string[];
  country: string;
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
  const [prod, setProds] = useState<ProductModel[]>([]);

  const form = useForm<ProductModel>({
    initialValues: {
      title: "",
      type: "",
      released: "",
      genre: [],
      language: [],
      country: "",
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
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `${localStorage.getItem("token")}`,
    };
    async function fetchProducts() {
      const res = await fetch("http://localhost:8080/api/products", {
        headers,
      });

      if (!res.ok) {
        throw new Error("Something went wrong!");
      }
      const json = await res.json();

      const data = json;
      const pro: ProductModel[] = [];

      for (const key in data) {
        pro.push({
          id: data[key].id,
          title: data[key].title,
          rated: data[key].rated,
          poster: data[key].poster,
          country: data[key].country,
          plot: data[key].plot,
          type: data[key].type,
          released: data[key].releasedDate,
          genre: data[key].genre,
          language: data[key].language,
          runtime: data[key].runtime,
        });
      }
      setProds(pro);
    }
    fetchProducts();
  }, []);

  function closeModal() {
    form.reset();
    close();
  }

  async function deleteProduct(id: string) {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `${localStorage.getItem("token")}`,
    };
    const res = await fetch(`http://localhost:8080/api/products/delete/${id}`, {
      method: "DELETE",
      body: JSON.stringify(id),
      headers,
    });
    if (!res.ok) {
      throw new Error("Something went wrong!");
    }

    setProds(() => prod.filter((el) => el.id !== id));
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
    const res = await fetch(`http://localhost:8080/api/products`, {
      method: "POST",
      body: formData,
      headers,
    });
    if (!res.ok) {
      throw new Error("Something went wrong!");
    }
    const data: ProductModel = await res.json();
    setProds(() => [...prod, data]);
  }

  async function editProduct(product: ProductModel) {
    console.log(product, " hi");
    const formData = new FormData();
    formData.append("img", product.poster);
    product.released = format(new Date(product.released), "yyyy-MMM-dd");
    product.poster = "";
    Object.keys(product).forEach((key) => formData.append(key, product[key]));
    const headers = {
      Authorization: `${localStorage.getItem("token")}`,
    };
    const res = await fetch(`http://localhost:8080/api/products/update`, {
      method: "PUT",
      body: formData,
      headers,
    });
    if (!res.ok) {
      throw new Error("Something went wrong!");
    }

    const data: ProductModel = await res.json();
    console.log(data);

    setProds(() => [...prod.filter((pro) => pro.id != product.id), data]);
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
    });
    open();
  }

  return (
    <>
      <Box className={styles.main}>
        {prod.map((product) => (
          <Product
            key={product.id}
            product={product}
            deleteProduct={deleteProduct}
            editProduct={handleEditModal}
          />
        ))}
      </Box>

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
            form.reset();
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

          <Select
            required
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
            {...form.getInputProps("rated")}
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
