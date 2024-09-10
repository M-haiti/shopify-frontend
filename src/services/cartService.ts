import { client } from './apiClient';
import { useStore } from '../stores/store';


export const createCart = async (): Promise<string> => {
  const query = `
    mutation {
      cartCreate {
        cart {
          id
        }
      }
    }
  `;
  try {
    const response = await client.request<{ cartCreate: { cart: { id: string } } }>(query);
    const cartId = response.cartCreate.cart.id;
    console.log("cartId (inside service):", cartId);
    useStore.getState().setCartId(cartId);  // Setting cart ID in Zustand store
    console.log("New cart created with ID:", cartId);
    return cartId; // Return the new cart ID
  } catch (error) {
    console.error("Error creating cart:", error);
    throw new Error("Failed to create cart");
  }
};


interface LineItem {
  merchandiseId: string;
  quantity: number;
}

export const addToCart = async (cartId: string, lineItems: { merchandiseId: string; quantity: number }[]) => {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
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
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const variables = {
    cartId,
    lines: lineItems.map(item => ({
      merchandiseId: item.merchandiseId, // Ensure this is a ProductVariant ID, not a Product ID
      quantity: item.quantity
    }))
  };

  try {
    const response = await client.request(query, variables);
    console.log(response); // Debugging to see the full response
    return response.cartLinesAdd.cart;
  } catch (error) {
    console.error("Error adding items to cart:", error);
    throw new Error("Failed to add items to cart");
  }
};

export const updateCartItemQuantity = async (cartId: string, lineId: string, quantity: number) => {
  console.log("quantity",quantity)
  console.log("lineId",lineId)
  console.log("cartId",cartId)
  const query = `
    mutation cartLineUpdate($cartId: ID!, $lineId: ID!, $quantity: Int!) {
      cartLinesUpdate(cartId: $cartId, lines: [{ id: $lineId, quantity: $quantity }]) {
        cart {
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
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lineId,
    quantity
  };

  try {
    const response = await client.request(query, variables);
    console.log("Updated cart inside service:", response);
    return response.cartLinesUpdate.cart;
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    throw new Error("Failed to update cart item quantity");
  }
};

export const removeFromCart = async (cartId: string, lineId: string) => {
  const query = `
    mutation cartLineRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
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
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lineIds: [lineId]  // Ensure this is an array of IDs as expected
  };

  try {
    const response = await client.request(query, variables);
    console.log("Updated cart after removal:", response.cartLinesRemove.cart);
    return response.cartLinesRemove.cart;
  } catch (error) {
    console.error("Error removing item from cart:", error);
    throw new Error("Failed to remove item from cart");
  }
};

export const getCheckoutUrl = async (cartId: string): Promise<string> => {
  const query = `
    query {
      cart(id: "${cartId}") {
        checkoutUrl
      }
    }
  `;
  try {
    const response = await client.request<{ cart: { checkoutUrl: string } }>(query);
    return response.cart.checkoutUrl; // Return the checkout URL
  } catch (error) {
    console.error("Error fetching checkout URL:", error);
    throw new Error("Failed to fetch checkout URL");
  }
};
