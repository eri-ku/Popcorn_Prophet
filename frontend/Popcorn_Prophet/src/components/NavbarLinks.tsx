import { Flex } from "@mantine/core";
import styles from "./NavbarLinks.module.css";
import NavButton from "./NavButton";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Login from "./Login";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../App";

function NavbarLinks({ burger }: { burger: boolean }) {
  const [opened, handlers] = useDisclosure(false);
  const navigate = useNavigate();

  const isAuth = getAuth() ? true : false;

  return (
    <>
      {isAuth && (
        <Button
          variant="outline"
          color="red.2"
          radius="lg"
          pos="absolute"
          top={15}
          left={95}
          size="compact-xl"
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            navigate("/");
          }}
        >
          Logout - {getAuth()}
        </Button>
      )}
      <Flex
        gap="0.5rem"
        mt="1rem"
        className={!burger ? styles.navHeader : ""}
        visibleFrom={!burger ? "md" : ""}
        direction={burger ? "column" : "row"}
      >
        <NavButton to="/">Home</NavButton>
        <NavButton to="/register">Register</NavButton>
        {!isAuth && (
          <Button
            variant="outline"
            color="red.2"
            radius="lg"
            size="compact-xl"
            onClick={handlers.toggle}
          >
            Login
          </Button>
        )}

        <NavButton to="/api">Api</NavButton>
      </Flex>
      {opened && <Login handlers={handlers} opened={opened} />}
    </>
  );
}
export default NavbarLinks;
