import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="rounded-2xl shadow-md bg-white overflow-hidden flex flex-col">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-44 object-cover"
        />

        <div className="p-3">
          <h5 className="text-lg font-semibold">
            {product.name}
          </h5>
          <p className="text-sm text-gray-600">
            {product.brand}
          </p>
        </div>
      </Link>

      <div className="p-3 pt-0">
        <p className="font-bold">${product.price}</p>

        <button
          onClick={() => addToCart(product)}
          disabled={!product.productAvailable}
          className={`w-full mt-2 py-2 rounded-lg text-white ${
            product.productAvailable
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-500"
          }`}
        >
          {product.productAvailable
            ? "Add to Cart"
            : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;