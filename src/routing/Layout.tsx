import { Box,Text } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const Layout = () => {
  return (
    <Box p={8}>
      <Header />
      <Box id="main">
        <Outlet />
      </Box>
      <Box id="footer">
        <Text>Shopify 2024 Copyright</Text>
      </Box>
    </Box>
  );
};

export default Layout;
