import { useState } from "react";
import { Tooltip, UnstyledButton, Stack, rem } from "@mantine/core";
import {
  IconHome2,
  IconDeviceDesktopAnalytics,
  IconUser,
  IconSettings,
  IconGift,
  IconUsers,
  IconLogout,
  IconNews,
} from "@tabler/icons-react";
import styles from "./ApiNavbar.module.css";
import { Link } from "react-router-dom";

interface ApiLinkProps {
  icon: typeof IconHome2;
  label: string;
  to?: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, to, active, onClick }: ApiLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        component={Link}
        to={to ? to : ""}
        onClick={onClick}
        className={styles.link}
        data-active={active || undefined}
      >
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: "Homepage", to: "/homepage" },
  { icon: IconDeviceDesktopAnalytics, label: "Api", to: "/api/1" },
  { icon: IconNews, label: "Articles", to: "/api/articles" },
  { icon: IconGift, label: "WishList", to: "/api/wishlist" },
];

export function ApiNavbar() {
  const [active, setActive] = useState(1);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  function clean() {
    localStorage.clear();
    sessionStorage.clear();
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink icon={IconUsers} to="/adminPage" label="Adminpage" />
        <NavbarLink icon={IconLogout} to="/" label="Logout" onClick={clean} />
      </Stack>
    </nav>
  );
}
