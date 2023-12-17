import styles from "./ArticleView.module.css";
import { Flex, Title, Image, Button, Text, Box } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Review from "../Product/Review";
function ArticleView() {
  const navigate = useNavigate();
  const [toggleComment, setToggleComment] = useState<boolean>(false);
  return (
    <Flex className={styles.main} p={10} m={"auto"}>
      <Flex direction={"column"} gap={10} align={"center"}>
        <Flex gap={10} className={styles.dir}>
          <Image
            ml={10}
            fit="cover"
            className={styles.content}
            src="https://m.media-amazon.com/images/M/MV5BMGNiOTBhZmMtNGU1Yi00NWQzLTlkOTctOTU1YjNkMjJhYTdlXkEyXkFqcGdeQXVyMTYzMDM0NTU@._V1_.jpg"
          ></Image>
          <Flex direction={"column"} className={styles.text}>
            <Title order={2}>Tu bude velky nadpis</Title>
            <Text>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Atque
              quo et debitis! Corporis eos voluptatum cumque nihil error aperiam
              provident ab, assumenda cum ea veniam quibusdam excepturi
              similique culpa iure! Lorem, ipsum dolor sit amet consectetur
              adipisicing elit. Iusto nesciunt praesentium delectus voluptates
              quam alias eveniet nisi labore ipsum sunt excepturi laborum sint,
              aliquid pariatur dolor blanditiis illum ratione quia.
            </Text>
          </Flex>
        </Flex>
        <Flex align={"center"} direction={"column"}>
          <Flex gap={10}>
            <Button color="gray" onClick={() => navigate(-1)}>
              <IconArrowLeft size={30} />
            </Button>
            <Button mb={5} onClick={() => setToggleComment((val) => !val)}>
              {toggleComment ? `Hide Reviews` : `Show Reviews`}
            </Button>
          </Flex>
          {toggleComment && (
            <>
              <Review />
              <Review />
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default ArticleView;
