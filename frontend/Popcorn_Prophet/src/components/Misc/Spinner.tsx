import { Loader, Flex } from "@mantine/core";
function Spinner() {
  return (
    <Flex justify={"center"} align={"center"}>
      <Loader color="red" size={100} />
    </Flex>
  );
}

export default Spinner;
