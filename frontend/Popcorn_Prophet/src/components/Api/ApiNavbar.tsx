import { useEffect, useState } from "react";
import { Tooltip, UnstyledButton, Stack, rem } from "@mantine/core";
import {
  IconHome2,
  IconDeviceDesktopAnalytics,
  IconGift,
  IconUsers,
  IconLogout,
  IconNews,
} from "@tabler/icons-react";
import styles from "./ApiNavbar.module.css";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL, getMemberRoles } from "../../App";
import NavbarLinks from "../Misc/NavbarLinks";
import { findRole } from "./ContextProvider";

interface ApiLinkProps {
  icon: typeof IconHome2;
  label: string;
  to?: string;
  active?: boolean;
  onClick?(): void;
}

export function clean() {
  axios.post(`${BASE_URL}auth/logout`, {}, { withCredentials: true });
  sessionStorage.clear();
  localStorage.clear();
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
  { icon: IconDeviceDesktopAnalytics, label: "Api", to: "/api/products/1" },
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

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarMain}>
        <Stack justify="center" gap={0}>
          {links[0]}
          {links[1]}
          {links[2]}
          {links[3]}
          {findRole("ROLE_ADMIN") && links[4]}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink icon={IconLogout} to="/" label="Logout" onClick={clean} />
      </Stack>
    </nav>
  );
}
