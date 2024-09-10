import { Box } from "@chakra-ui/react";
import Branding from "./Branding";
import NavBar from "./NavBar";

const Header = () => {
  return (
    <>
      <Box
        id="header"
      >
        <Branding />
        <NavBar />
      </Box>
      
    </>
  );
};

export default Header;

/*
<Box id="navbar">
        <NavBar />
      </Box>
      */