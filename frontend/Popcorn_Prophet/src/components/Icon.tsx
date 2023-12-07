import { Image } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import styles from "./Icon.module.css";
function Icon({ inApi }: { inApi?: boolean }) {
  const navigate = useNavigate();

  return (
    <>
      {inApi ? (
        <Image
          className={styles.image}
          onClick={() => navigate("/")}
          src="src\assets\film-reel-svgrepo-com.png"
          h={35}
          w={35}
          m="1rem"
        />
      ) : (
        <Image
          className={styles.image}
          onClick={() => navigate("/")}
          pos="absolute"
          left="0"
          top="0"
          src="src\assets\film-reel-svgrepo-com.png"
          h={35}
          w={35}
          m="1rem"
        />
      )}
    </>
  );
}

export default Icon;
