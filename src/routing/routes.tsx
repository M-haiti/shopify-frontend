import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import CartDetails from "../pages/CartDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "product/:productId", element: <ProductDetails /> }, // New route for product details
      { path: "mycart/", element: <CartDetails /> },
      //{ path: "product/", element: <ProductDetails /> }, // New route for product details

    ],
  },
]);

export default router;
