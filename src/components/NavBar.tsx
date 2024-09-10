import { Flex, useBreakpointValue, Divider } from "@chakra-ui/react";
import CustomNavLink from "./custom/CustomNavLink";

const NavBar = () => {
  // Use the breakpoint value to change alignItems based on the direction
  const alignItems = useBreakpointValue({ base: "center", md: "flex-start" });
  const direction = useBreakpointValue({ base: "column", md: "row" });

  return (
    <Flex
      display="flex"
      alignItems={alignItems}
      fontSize={20}
      justifyContent={{ base: "center", md: "space-between" }}
      w="100%"
      px={20}
      direction={{ base: "column", md: "row" }}
    >
      <CustomNavLink to="/">Home</CustomNavLink>
      {direction === "column" && <Divider borderColor="white" />}
    </Flex>
  );
};

export default NavBar;
