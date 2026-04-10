import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import CheckoutPopup from "./CheckoutPopup.jsx";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartImage, setCartImage] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        const backendIds = response.data.map((p) => p.id);

        const updatedCart = cart.filter((item) =>
          backendIds.includes(item.id)
        );

        const cartWithImages = await Promise.all(
          updatedCart.map(async (item) => {
            try {
              const res = await axios.get(
                `http://localhost:8080/api/product/${item.id}/image`,
                { responseType: "blob" }
              );

              const imageUrl = URL.createObjectURL(res.data);
              return { ...item, imageUrl };
            } catch {
              return {
                ...item,
                imageUrl:
                  "https://via.placeholder.com/150?text=No+Image",
              };
            }
          })
        );

        setCartItems(cartWithImages);
      } catch (err) {
        console.error(err);
      }
    };

    if (cart.length) fetchImagesAndUpdateCart();
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const handleIncreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity < item.stockQuantity
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b pb-4"
                >
                  {/* IMAGE */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  {/* INFO */}
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.brand}
                    </p>
                  </div>

                  {/* QUANTITY */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecreaseQuantity(item.id)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleIncreaseQuantity(item.id)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>

                  {/* PRICE */}
                  <div className="font-semibold">
                    ${item.price * item.quantity}
                  </div>

                  {/* DELETE */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="mt-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Total: ${totalPrice}
              </h2>

              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>

      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
      />
    </div>
  );
};

export default Cart;