import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from "@chakra-ui/react";
import { RouterProvider } from "react-router-dom";
import router from "./routing/routes";
import theme from "./theme";
import './index.css'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </StrictMode>,
)
