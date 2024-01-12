import { useEffect, useState } from "react";
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
import { Link, useLocation } from "react-router-dom";

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

const contentLinks = [
  { icon: IconHome2, label: "Homepage", to: "/homepage" },
  { icon: IconDeviceDesktopAnalytics, label: "Api", to: "/api/1" },
  { icon: IconNews, label: "Articles", to: "/api/articles/1" },
  { icon: IconGift, label: "WishList", to: "/api/wishlist" },
  { icon: IconUsers, label: "Adminpage", to: "/adminPage" },
];

export function ApiNavbar() {
  const location = useLocation();
  const [active, setActive] = useState(
    contentLinks.findIndex((link) => link.to === location.pathname)
  );

  useEffect(() => {
    const foundIndex = contentLinks.findIndex(
      (link) => link.to === location.pathname
    );
    if (foundIndex !== -1) {
      setActive(foundIndex);
    }
  }, [location.pathname]);

  const links = contentLinks.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  function clean() {
    localStorage.clear();
    localStorage.clear();
  }
  console.log("active", active);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink icon={IconLogout} to="/" label="Logout" onClick={clean} />
      </Stack>
    </nav>
  );
}
