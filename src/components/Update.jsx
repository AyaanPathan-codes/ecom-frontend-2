import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../axios";

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({});
  const [image, setImage] = useState(null);

  const [updateProduct, setUpdateProduct] = useState({
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    quantity: "",
    available: true,
  });

  // 🔥 Fetch product + image
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/product/${id}`);
        setProduct(res.data);
        setUpdateProduct(res.data);

        // get image as blob
        const imgRes = await axios.get(`/product/${id}/image`, {
          responseType: "blob",
        });

        const file = new File([imgRes.data], res.data.imageName, {
          type: imgRes.data.type,
        });

        setImage(file);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  // 🔥 Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({
      ...updateProduct,
      [name]: value,
    });
  };

  // 🔥 Handle image
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // 🔥 Submit (FormData + JSON)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // image
      if (image) {
        formData.append("imageFile", image);
      }

      // JSON product
      formData.append(
        "product",
        new Blob([JSON.stringify(updateProduct)], {
          type: "application/json",
        })
      );

      await axios.put(`/product/${id}`, formData, {
        headers: {      
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product updated successfully ✅");
      navigate(`/product/${id}`);
    } catch (err) {
      console.error(err.response || err);
      alert("Update failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Update Product
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            name="name"
            value={updateProduct.name || ""}
            onChange={handleChange}
            placeholder="Name"
            className="p-3 border rounded-lg"
          />

          <input
            type="text"
            name="brand"
            value={updateProduct.brand || ""}
            onChange={handleChange}
            placeholder="Brand"
            className="p-3 border rounded-lg"
          />

          <input
            type="text"
            name="category"
            value={updateProduct.category || ""}
            onChange={handleChange}
            placeholder="Category"
            className="p-3 border rounded-lg"
          />

          <input
            type="number"
            name="price"
            value={updateProduct.price || ""}
            onChange={handleChange}
            placeholder="Price"
            className="p-3 border rounded-lg"
          />

          <input
            type="number"
            name="quantity"
            value={updateProduct.quantity || ""}
            onChange={handleChange}
            placeholder="Stock Quantity"
            className="p-3 border rounded-lg"
          />

          <textarea
            name="description"
            value={updateProduct.description || ""}
            onChange={handleChange}
            placeholder="Description"
            className="p-3 border rounded-lg col-span-2"
          />

          {/* Image Preview */}
          <div className="col-span-2">
            <img
              src={image ? URL.createObjectURL(image) : ""}
              alt="preview"
              className="w-full h-40 object-cover rounded-lg mb-2"
            />

            <input
              type="file"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Checkbox */}
          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={updateProduct.available}
              onChange={(e) =>
                setUpdateProduct({
                  ...updateProduct,
                  available: e.target.checked,
                })
              }
            />
            <label>Available</label>
          </div>

          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default Update;