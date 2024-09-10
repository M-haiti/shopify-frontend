import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GraphQLClient } from 'graphql-request';
import { createCart, addToCart } from '../services/cartService';
import { useStore } from '../stores/store'
import { useNavigate } from 'react-router-dom';


interface Image {
  originalSrc: string;
}

interface ImageEdge {
  node: Image;
}

interface ProductDetailsType {
  id: string;
  title: string;
  description: string;
  priceRange: {
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: ImageEdge[];
  };
  variantIds: string[]; // Array to store variant IDs
}


const ProductDetails = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState<ProductDetailsType | null>(null);
  const cartId = useStore(state => state.cartId); // Using cart ID from Zustand store

  useEffect(() => {
    const gid = `gid://shopify/Product/${productId}`;
    console.log("cartId on page load:", cartId);
    fetchProductDetails(gid);
  }, [productId]);

  
  const endpoint = 'https://0cb9f6-ba.myshopify.com/api/2022-01/graphql.json';
  const headers = {
    'X-Shopify-Storefront-Access-Token': '24a98a2866890da3bf609a7226632f44',
    'Content-Type': 'application/json',
  };
  
  const fetchProductDetails = async (gid: string) => {
    const client = new GraphQLClient(endpoint, { headers });
    const query = `
      {
        product(id: "${gid}") {
          id
          title
          description
          priceRange {
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                originalSrc
              }
            }
          }
          variants(first: 5) {
            edges {
              node {
                id
              }
            }
          }
        }
      }`;
    try {
      const response = await client.request<{ product: ProductDetailsType & { variants: { edges: { node: { id: string } }[] } } }>(query);
      setProduct({ ...response.product, variantIds: response.product.variants.edges.map(edge => edge.node.id) });
      console.log("Product Details:", response.product);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleAddToCart = async () => {
    let localCartId = cartId;
  
    if (!localCartId) {
      console.log("Creating new cart");
      localCartId = await createCart();
      console.log("New Cart ID:", localCartId);
    }
  
    if (!product || product.variantIds.length === 0) {
      console.error("No product or product variants available.");
      return;
    }
  
    const variantId = product.variantIds[0];  // Using the first variant ID
  
    if (localCartId) {
      await addToCart(localCartId, [{ merchandiseId: variantId, quantity: 1 }]);
      console.log("Product added to cart using variant ID:", variantId);
    } else {
      console.error("Failed to create or retrieve a valid cart ID.");
    }
  };

  
  if (!product) {
    return <div>Loading...{productId}</div>;
  }
  
  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>Price: {product.priceRange.maxVariantPrice.amount} {product.priceRange.maxVariantPrice.currencyCode}</p>
      {product.images.edges.map((edge, index) => (
        <img key={index} src={edge.node.originalSrc} alt={`Image of ${product.title}`} />
      ))}
      <button onClick={handleAddToCart}>Buy</button>
      <button onClick={() => navigate("/mycart/")}>My cart</button>
    </div>
  );
  
};

export default ProductDetails;
