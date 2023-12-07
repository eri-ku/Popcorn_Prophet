import ApiHeader from "./ApiHeader";
import { ApiNavbar } from "./ApiNavbar";
import { useForm } from "@mantine/form";
import { countries } from "../util/countries";
import {
  Box,
  Group,
  Button,
  Modal,
  TextInput,
  Textarea,
  NativeSelect,
  Flex,
  Input,
} from "@mantine/core";
import Product from "./Product";
import styles from "./Api.module.css";
import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
export interface ProductModel {
  id?: string;
  title: string;
  rated: string;
  // poster: string;
  country: string;
  plot: string;
}

function Api() {
  const [prod, setProds] = useState<ProductModel[]>([]);
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      title: "",
      country: "",
      plot: "",
      rated: "",
      id: "",
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
          // poster: data[key].poster,
          country: data[key].country,
          plot: data[key].plot,
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
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `${localStorage.getItem("token")}`,
    };
    const res = await fetch(`http://localhost:8080/api/products`, {
      method: "POST",
      body: JSON.stringify(product),
      headers,
    });
    if (!res.ok) {
      throw new Error("Something went wrong!");
    }
    const data: ProductModel = await res.json();
    product.id = data.id;
    setProds(() => [...prod, product]);
  }

  async function editProduct(product: ProductModel) {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `${localStorage.getItem("token")}`,
    };
    const res = await fetch(`http://localhost:8080/api/products/update`, {
      method: "PUT",
      body: JSON.stringify(product),
      headers,
    });
    if (!res.ok) {
      throw new Error("Something went wrong!");
    }
    setProds(() => [...prod.filter((pro) => pro.id != product.id), product]);
  }

  function handleProduct(product: ProductModel) {
    product.id ? editProduct(product) : createProduct(product);
    form.reset();
    close();
  }

  function handleEditModal(product: ProductModel) {
    form.setValues({ ...product });
    open();
  }

  return (
    <Box className={styles.gridContainer}>
      <ApiHeader>
        <Button onClick={open}>Create Product</Button>
      </ApiHeader>
      <ApiNavbar />
      <Group className={styles.main} p="1rem">
        <Group gap={20}>
          {prod.map((product) => (
            <Product
              key={product.id}
              product={product}
              deleteProduct={deleteProduct}
              editProduct={handleEditModal}
            />
          ))}
        </Group>
      </Group>

      <Modal
        opened={opened}
        onClose={closeModal}
        title="Create Product"
        centered
      >
        <form
          onSubmit={form.onSubmit((values) => {
            const product: ProductModel = { ...values };
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
            placeholder="Product name"
          />
          <NativeSelect
            required
            label="Country"
            data={countries}
            {...form.getInputProps("country")}
          />
          <Textarea
            autosize={true}
            minRows={3}
            required
            maxLength={500}
            label="Plot"
            {...form.getInputProps("plot")}
            placeholder="Product plot"
          />
          <NativeSelect
            required
            label="Rated"
            {...form.getInputProps("rated")}
            data={["", "G", "PG", "PG-13", "R", "NC-17"]}
          />
          <Flex justify={"end"}>
            <Button type="submit" mt={10}>
              Submit
            </Button>
          </Flex>
        </form>
      </Modal>
    </Box>
  );
}

export default Api;
