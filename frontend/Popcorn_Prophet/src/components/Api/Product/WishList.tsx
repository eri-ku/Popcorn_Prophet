import styles from "./WishList.module.css";
import { useForm } from "@mantine/form";
import { TextInput, Box, Button, Flex } from "@mantine/core";
function WishList() {
  async function getProduct(id: { id: string }) {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `${localStorage.getItem("token")}`,
    };
    const res = await fetch(
      `http://localhost:8080/api/products/search?i=${id}`,
      { headers }
    );
    if (!res.ok) {
      throw new Error("Something went wrong!");
    }
  }

  const form = useForm<any>({
    initialValues: {
      id: "",
    },
  });
  return (
    <Box className={styles.container}>
      <form
        onSubmit={form.onSubmit((values) => {
          console.log(values.id);
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
