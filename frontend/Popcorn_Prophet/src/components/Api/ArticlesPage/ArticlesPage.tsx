import { Flex, useMantineTheme } from "@mantine/core";
import Article from "./Article";
import { Carousel } from "@mantine/carousel";
import styles from "./ArticlesPage.module.css";
import { useMediaQuery } from "@mantine/hooks";
function ArticlesPage() {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  return (
    <Flex justify={"center"} align={"center"} p={15} className={styles.main}>
      <Carousel
        classNames={styles}
        slideSize={{ base: "100%", md: "50%" }}
        slideGap={{ base: "xl", sm: 2 }}
        align="start"
        slidesToScroll={mobile ? 1 : 2}
        withIndicators
        controlsOffset="md"
        controlSize={40}
      >
        <Carousel.Slide>
          <Article />
        </Carousel.Slide>
        <Carousel.Slide>
          <Article />
        </Carousel.Slide>
        <Carousel.Slide>
          <Article />
        </Carousel.Slide>
        <Carousel.Slide>
          <Article />
        </Carousel.Slide>
      </Carousel>
    </Flex>
  );
}

export default ArticlesPage;
