import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import AppContext from "../Context/Context";
import ProductCard from "./ProductCard.jsx";
import { useLocation } from "react-router-dom";

      // 🔥 THIS IS THE FIX
const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const location = useLocation();



  // Fetch products
  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);
useEffect(() => {
  refreshData();   // ✅ correct
}, [location]);
  // Fetch images
  useEffect(() => {
    if (data && data.length > 0) {
      const fetchImages = async () => {
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/product/${product.id}/image`,
                { responseType: "blob" }
              );

              const imageUrl = URL.createObjectURL(response.data);

              return {
                ...product,
                imageUrl,
                productAvailable: product.productAvailable ?? true,
              };
            } catch (error) {
              return {
                ...product,
                imageUrl:
                  "https://via.placeholder.com/300x200?text=No+Image",
                productAvailable: product.productAvailable ?? true,
              };
            }
          })
        );
        console.log(updatedProducts);
        
        setProducts(updatedProducts);
      };

      fetchImages();
    }
  }, [data]);

  // Filter
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  // Error UI
  if (isError) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h2 className="text-xl font-semibold text-red-500">
          Something went wrong...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page Title */}
      <div className="px-6 pt-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Products
        </h1>
        <p className="text-gray-500 text-sm">
          Browse all available items
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full flex justify-center items-center h-[50vh]">
            <h2 className="text-lg font-medium text-gray-600">
              No Products Available
            </h2>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;