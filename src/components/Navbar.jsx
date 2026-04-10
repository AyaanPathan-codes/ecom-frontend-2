import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ onSelectCategory }) => {
  const [input, setInput] = useState("");

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-slate-900 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          Telusko
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-blue-400 transition">
            Home
          </Link>

          <Link to="/add_product" className="hover:text-blue-400 transition">
            Add Product
          </Link>

          {/* Dropdown */}
          <div className="relative group">
            <button className="hover:text-blue-400">
              Categories
            </button>

            <div className="absolute hidden group-hover:block bg-white text-black mt-2 rounded shadow-md w-40">
              {categories.map((category) => (
                <div
                  key={category}
                  onClick={() => onSelectCategory(category)}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  {category}
                </div>
              ))}
            </div>
          </div>

          <Link to="/cart" className="hover:text-blue-400">
            🛒 Cart
          </Link>

          {/* Search */}
          <input
            type="text"
            placeholder="Search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="px-3 py-1 rounded bg-slate-800 border border-slate-700 focus:outline-none"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;