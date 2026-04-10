import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../axios";
import { getProductImageSrc, handleImageFallback } from "../utils/productImage";
import { useNavigate } from "react-router-dom";
import Update from "./Update.jsx";

const Product = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/product/${id}`);
        setProduct(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
  try {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    await axios.delete(`/product/${product.id}`);  // ✅ axios instance

    alert("Product deleted successfully ✅");
     setProduct(null);
    navigate("/"); // go back to home
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("Delete failed ❌");
  }
};
   if (!product) {
    return (
      <h2 className="py-40 text-center text-xl font-semibold text-slate-700 dark:text-slate-200">
        Loading...
      </h2>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-2 dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
          <img
            src={getProductImageSrc(product)}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={handleImageFallback}
          />
        </div>
        <div>
          <div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {product.category}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              {product.name}
            </h1>
            <h5 className="mt-2 text-lg font-medium text-slate-500 dark:text-slate-400">
              {product.brand}
            </h5>
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {product.description}
            </p>
          </div>

          <div className="mt-6 space-y-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
            <span className="block text-3xl font-bold text-blue-700 dark:text-blue-400">
              {"$" + product.price}
            </span>
            <button
              className={`w-full rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
                product.available
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "cursor-not-allowed bg-slate-400"
              }`}
              disabled={!product.available}
              type="button"
            >
              {product.available ? "Add to Cart" : "Out of Stock"}
            </button>
            <h6 className="text-sm text-slate-700 dark:text-slate-200">
              Stock Available:{" "}
              <i className="font-bold text-green-600 dark:text-green-400">
                {product.stockQuantity ?? product.quantity}
              </i>
            </h6>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Product listed on:{" "}
              <span className="font-medium">
                {product.releaseDate ?? product.releasedate}
              </span>
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
              type="button"
              onClick={() => navigate(`/update/${product.id}`)}
            >
              Update
            </button>

            <button
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              type="button"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
