import { useEffect, useState, useRef } from 'react';
import { GraphQLClient } from 'graphql-request';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';

interface Image {
  originalSrc: string;
}

interface ImageEdge {
  node: Image;
}

interface ProductNode {
  id: string;
  title: string;
  images: {
      edges: ImageEdge[];
  };
}

interface ProductEdge {
  node: ProductNode;
}

interface ProductsData {
  edges: ProductEdge[];
}

interface GraphQLResponse {
  products: ProductsData;
}

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true ,
};

const extractIdFromGid = (gid:string) => {
  const matches = /Product\/(\d+)/.exec(gid);
  return matches ? matches[1] : null;
};

const Home = () => {
  const [products, setProducts] = useState<ProductNode[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const sliderRef = useRef<Slider | null>(null);

  const navigate = useNavigate();
  
  const endpoint = 'https://0cb9f6-ba.myshopify.com/api/2022-01/graphql.json';

  const fetchProducts = async () => {
      const productFilter = searchTerm ? `, query: "title:*${searchTerm}*"` : "";
  
      const query = `
      {
          products(first:10${productFilter}) {
              edges {
                  node {
                      id
                      title
                      images(first: 1) {
                          edges {
                              node {
                                  originalSrc
                              }
                          }
                      }
                  }
              }
          }
      }`;

      const headers = {
          'X-Shopify-Storefront-Access-Token': '24a98a2866890da3bf609a7226632f44',
          'Content-Type': 'application/json',
      };

      const client = new GraphQLClient(endpoint, { headers });

      try {
        const response = await client.request<GraphQLResponse>(query);
        console.log("API Response:", response); // Check the full structure of response
        setProducts(response.products.edges.map(edge => edge.node));
        console.log("Mapped Products:", products); // Check if products are set correctly
      } catch (error) {
          console.error("Error fetching products:", error);
      }
    
  };

  useEffect(() => {
      fetchProducts();
  },  [searchTerm]);

  useEffect(() => {
    if (products.length && sliderRef.current) {
        sliderRef.current.slickGoTo(0);
    }
}, [products]); // Reinitialize the slider when products are updated


  return (
      <div>
        <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ margin: '10px 0', padding: '10px', color: 'black' }}
          />
          <Slider ref={sliderRef} {...settings}>
              {products.map(product => (
                <div onClick={() => navigate(`/product/${extractIdFromGid(product.id)}`)} key={product.id} style={{ width: '100%', cursor: 'pointer' }}>
  
                  <div key={product.id} style={{ width: '100%' }}>
                      <h3>{product.title}</h3>
                      <h2>{product.id}</h2>
                      {product.images.edges.length > 0 && (
                          <img src={product.images.edges[0].node.originalSrc} alt={product.title} />
                      )}
                  </div>
                </div>  
              ))}
          </Slider>
      </div>
  );
};

export default Home