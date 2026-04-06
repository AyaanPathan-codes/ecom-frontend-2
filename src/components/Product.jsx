import { useParams } from "react-router-dom";
import {  useEffect, useState } from "react";
import axios from "../axios";
import { getProductImageSrc, handleImageFallback } from "../utils/productImage";

const Product = () => {
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





  if (!product) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Loading...
      </h2>
    );
  }

  return (
    <>
      <div className="containers">
        <div className="left-column">
          <img
            src={getProductImageSrc(product)}
            alt={product.name}
            className="active left-column-img"
            onError={handleImageFallback}
          />
        </div>
        <div className="right-column">
          <div className="product-description">
            <span>{product.category}</span>
            <h1>{product.name}</h1>
            <h5>{product.brand}</h5>
            <p>{product.description}</p>
          </div>

          <div className="product-price">
            <span>{"$" + product.price}</span>
           <button
  className={`cart-btn ${!product.available ? "disabled-btn" : ""}`}
  disabled={!product.available}
>
  {product.available ? "Add to cart" : "Out of Stock"}
</button>

<h6>
  Stock Available:
  <i>{product.quantity ?? product.stockQuantity}</i>
</h6>
            <h6>
              Stock Available :{" "}
              <i style={{ color: "green", fontWeight: "bold" }}>
                {product.stockQuantity ?? product.quantity}
              </i>
            </h6>
           <p>
  Product listed on: <span>{product.releaseDate ?? product.releasedate}</span>
</p>
          </div>
          <div className="update-button ">
            <button
              className="btn btn-primary"
              type="button"
          
            >
              Update
            </button>
        
            <button
              className="btn btn-primary"
              type="button"
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
