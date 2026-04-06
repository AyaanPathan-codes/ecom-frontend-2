import React, { useState } from "react";
import axios from "../axios";

const initialFormState = {
  name: "",
  brand: "",
  category: "",
  description: "",
  price: "",
  stockQuantity: "",
  releaseDate: "",
  available: true,
};

const AddProduct = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);

    if (!file) {
      setPreviewUrl("");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setImageFile(null);
    setPreviewUrl("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    setIsSubmitting(true);

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });

      if (imageFile) {
        payload.append("image", imageFile);
      }

      await axios.post("/product", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setStatusMessage("Product added successfully.");
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
      setStatusMessage("Unable to add product. Please check the backend image API.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="center-container add-product-form-wrapper">
        <h2 className="mb-4 text-center">Add Product</h2>
        <form className="add-product-form" onSubmit={handleSubmit}>
          <input
            className="form-control"
            name="name"
            placeholder="Product name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            className="form-control"
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />
          <input
            className="form-control"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <textarea
            className="form-control"
            name="description"
            placeholder="Description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            className="form-control"
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <input
            className="form-control"
            name="stockQuantity"
            type="number"
            min="0"
            placeholder="Stock quantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            required
          />
          <input
            className="form-control"
            name="releaseDate"
            type="date"
            value={formData.releaseDate}
            onChange={handleChange}
          />
          <input
            className="form-control image-control"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="add-product-preview" />
          ) : null}
          <label className="form-check-label availability-toggle">
            <input
              className="form-check-input"
              name="available"
              type="checkbox"
              checked={formData.available}
              onChange={handleChange}
            />
            Available
          </label>
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add Product"}
          </button>
        </form>
        {statusMessage ? <p className="add-product-status">{statusMessage}</p> : null}
      </div>
    </div>
  );
};

export default AddProduct;
