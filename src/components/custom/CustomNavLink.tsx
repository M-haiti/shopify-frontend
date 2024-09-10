import { Box } from "@chakra-ui/react";
import { NavLink as OriginalNavLink } from "react-router-dom";
import { NavLinkProps } from "react-router-dom";

const CustomNavLink = (props: NavLinkProps) => {
  return (
    <Box mx={4}>
    <OriginalNavLink
      className={({ isActive }) =>
        isActive ? "active primary NavLink" : "primary NavLink"
    }
    {...props}
    />
    </Box>
  );
};

export default CustomNavLink;
