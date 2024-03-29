import styles from "./WishList.module.css";
import { useForm } from "@mantine/form";
import { TextInput, Box, Button, Flex } from "@mantine/core";
import axios from "axios";
import { BASE_URL } from "../../../App";
import { useState } from "react";
import Spinner from "../../Misc/Spinner";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
function WishList() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  async function getProduct(id: { id: string }) {
    try {
      setIsLoading(true);
      const res = await axios.post(`${BASE_URL}api/products/search?i=${id}`);
      const data = await res.data;
      notifications.show({
        title: "Success",
        message: "Product added successfully",
        color: "grey",
        withBorder: true,
        icon: "🤩",
      });
    } catch (error: any) {
      if (error.response.status == 404) {
        navigate("/notfound");
      } else navigate("/error");
    }
    setIsLoading(false);
  }

  const form = useForm<any>({
    initialValues: {
      id: "",
    },
  });

  if (isLoading) return <Spinner />;
  return (
    <Box className={styles.container}>
      <form
        onSubmit={form.onSubmit((values) => {
          getProduct(values.id);
          form.reset();
        })}
      >
        <TextInput
          className={styles.small}
          required
          label="Imdb ID"
          maxLength={30}
          {...form.getInputProps("id")}
        />
        <Flex justify={"end"}>
          <Button type="submit" mt={10}>
            Submit
          </Button>
        </Flex>
      </form>
    </Box>
  );
}

export default WishList;
