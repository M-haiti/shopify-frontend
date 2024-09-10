import React, { useEffect, useState } from 'react';
import { GraphQLClient } from 'graphql-request';
import { useStore } from '../stores/store';
import { updateCartItemQuantity, removeFromCart, getCheckoutUrl } from '../services/cartService';

// Define interfaces for cart line items and the cart
interface CartItem {
  id: string;
  title: string;
  quantity: number;
  price: { amount: string; currencyCode: string };
  imageSrc: string;
}

interface CartDetails {
  id: string;
  items: CartItem[];
  totalCost: string;
  currencyCode: string;
}

const CartDetails = () => {
  const [cart, setCart] = useState<CartDetails | null>(null);
  const cartId = useStore(state => state.cartId);

  useEffect(() => {
    console.log("Current cart ID:", cartId);
    if (cartId) {
      fetchCartDetails(cartId);
    }
  }, [cartId]);

  const endpoint = 'https://0cb9f6-ba.myshopify.com/api/2022-01/graphql.json';
  const headers = {
    'X-Shopify-Storefront-Access-Token': '24a98a2866890da3bf609a7226632f44',
    'Content-Type': 'application/json',
  };

  const fetchCartDetails = async (cartId: string) => {
    const client = new GraphQLClient(endpoint, { headers });
      
    const query = `
      {
        cart(id: "${cartId}") {
          id
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            originalSrc
                          }
                        }
                      }
                    }
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    `;

    try {
      const response = await client.request(query);
      const items = response.cart.lines.edges.map(edge => ({
        id: edge.node.id,
        title: edge.node.merchandise.product.title,
        quantity: edge.node.quantity,
        price: {
          amount: edge.node.merchandise.priceV2.amount,
          currencyCode: edge.node.merchandise.priceV2.currencyCode,
        },
        imageSrc: edge.node.merchandise.product.images.edges[0].node.originalSrc
      }));

      setCart({
        id: response.cart.id,
        items,
        totalCost: response.cart.cost.totalAmount.amount,
        currencyCode: response.cart.cost.totalAmount.currencyCode,
      });
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  };

  const handleIncreaseQuantity = async (cartId, lineId, quantity) => {
    try {
      await updateCartItemQuantity(cartId, lineId, quantity);
      fetchCartDetails(cartId); // Assuming fetchCartDetails is a function that fetches the entire cart
    } catch (error) {
      console.error("Error when updating quantity:", error);
    }
  };

  const handleRemoveItem = async (cartId, lineId) => {
    try {
      await removeFromCart(cartId, lineId);  // Assuming removeFromCart is similar to updateCartItemQuantity
      console.log("Item removed successfully");
      fetchCartDetails(cartId);  // Refetch cart details to update UI
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  const handleCheckout = async () => {
    if (cart) {
      try {
        const url = await getCheckoutUrl(cart.id);
        window.location.href = url; // Redirects to the Shopify checkout page
      } catch (error) {
        console.error("Error during checkout:", error);
      }
    }
  };

  if (!cart) {
    return <div>Loading cart details...</div>;
  }

  return (
    <div>
      <h1>Cart Details</h1>
      {cart.items.map((item) => (
        <div key={item.id}>
          <img src={item.imageSrc} alt={item.title} style={{ width: '100px' }} />
          <h2>{item.title}</h2>
          <p>Quantity: {item.quantity}</p>
          <p>Price: {item.price.amount} {item.price.currencyCode}</p>
          <button onClick={() => handleIncreaseQuantity(cart.id, item.id, item.quantity +1)}>Increase</button>
          <button onClick={() => handleIncreaseQuantity(cart.id, item.id, Math.max(1, item.quantity - 1))}>Decrease</button> 
        
          <button onClick={() => handleRemoveItem(cart.id, item.id)}>Remove</button>

        </div>
      ))}
      <h3>Total Cost: {cart.totalCost} {cart.currencyCode}</h3>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default CartDetails;
