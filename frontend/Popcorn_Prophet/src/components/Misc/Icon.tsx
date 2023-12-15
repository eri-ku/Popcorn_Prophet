import { Image } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import styles from "./Icon.module.css";
function Icon() {
  const navigate = useNavigate();

  return (
    <Image
      className={styles.image}
      onClick={() => navigate("/homepage")}
      src="\film-reel-svgrepo-com.png"
      h={35}
      w={35}
      m="1rem"
    />
  );
}

export default Icon;
