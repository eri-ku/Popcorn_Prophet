import {
  Box,
  Flex,
  NumberFormatter,
  NumberInput,
  CloseButton,
} from "@mantine/core";
import styles from "./FirstStep.module.css";
const arr = [
  { id: 1, name: "Deadpool", volume: 1, price: "100" },
  { id: 2, name: "HP", volume: 7, price: "1004" },
  { id: 3, name: "Game of Thrones", volume: 2, price: "300" },
  { id: 31, name: "Game of Thrones", volume: 2, price: "300" },
  { id: 32, name: "Game of Thrones", volume: 2, price: "300" },
  { id: 33, name: "Game of Thrones", volume: 2, price: "300" },
  { id: 34, name: "Game of Thrones", volume: 2, price: "300" },
  { id: 35, name: "Game of Thrones", volume: 2, price: "300" },
  { id: 36, name: "Game of Thrones", volume: 2, price: "300" },
];

function FirstStep() {
  return (
    <Flex direction={"column"} gap={15} mt={20} className={styles.container}>
      {arr.map((el) => (
        <Flex className={styles.row} key={el.id}>
          <Flex className={styles.title}>
            <CloseButton c="red" />
            {el.name}
          </Flex>
          <Box className={`${styles.volumprice} ${styles.boxprice}`}>
            <NumberInput
              w={"50"}
              size="xs"
              variant="filled"
              min={1}
              max={99}
              defaultValue={el.volume}
            />
            <NumberFormatter
              thousandSeparator=" "
              decimalSeparator=","
              suffix="€"
              value={el.price}
            ></NumberFormatter>{" "}
          </Box>
        </Flex>
      ))}
    </Flex>
  );
}

export default FirstStep;
