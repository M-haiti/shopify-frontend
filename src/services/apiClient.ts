import { GraphQLClient } from 'graphql-request';

const endpoint = 'https://0cb9f6-ba.myshopify.com/api/2022-01/graphql.json';
const headers = {
  'X-Shopify-Storefront-Access-Token': '24a98a2866890da3bf609a7226632f44',
  'Content-Type': 'application/json',
};

export const client = new GraphQLClient(endpoint, { headers });
