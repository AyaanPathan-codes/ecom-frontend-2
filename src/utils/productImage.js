import productPlaceholder from "../assets/product-placeholder.svg";

const API_BASE_URL = "http://localhost:8080";

const absoluteUrlPattern = /^(https?:\/\/|data:|blob:)/i;

export const getProductImageSrc = (product) => {
  if (!product) {
    return productPlaceholder;
  }

  const directImageValue =
    product.imageUrl ||
    product.image ||
    product.imgUrl ||
    product.thumbnailUrl ||
    product.photoUrl;

  if (typeof directImageValue === "string" && directImageValue.trim()) {
    const normalizedValue = directImageValue.trim();

    if (absoluteUrlPattern.test(normalizedValue)) {
      return normalizedValue;
    }

    if (normalizedValue.startsWith("/")) {
      return `${API_BASE_URL}${normalizedValue}`;
    }

    return `${API_BASE_URL}/${normalizedValue}`;
  }

  if (product.id) {
    return `${API_BASE_URL}/api/product/${product.id}/image`;
  }

  return productPlaceholder;
};

export const handleImageFallback = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = productPlaceholder;
};
