import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import SweetGrid from "./components/SweetGrid";
import AuthModal from "./components/AuthModal";
import SweetModal from "./components/SweetModal";
import OrdersModal from "./components/OrdersModal";
import CartModal from "./components/CartModal";
import { API_BASE_URL } from "./config";

function App() {
  const [user, setUser] = useState(null);
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddSweetModal, setShowAddSweetModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    fetchSweets();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = sweets.filter(
        (sweet) =>
          sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sweet.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSweets(filtered);
    } else {
      setFilteredSweets(sweets);
    }
  }, [searchTerm, sweets]);

  const fetchSweets = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sweets`);
      if (response.ok) {
        const data = await response.json();
        setSweets(data);
      }
    } catch (error) {
      console.error("Error fetching sweets:", error);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
    fetchSweets();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCart([]);
    fetchSweets();
  };

  const addToCart = (sweet, quantity) => {
    if (!user) {
      alert("Please login to add items to cart! 🔒");
      setShowAuthModal(true);
      return;
    }
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === sweet._id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > sweet.quantity) return prevCart;
        return prevCart.map((item) =>
          item._id === sweet._id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        return [
          ...prevCart,
          { ...sweet, quantity, stockAvailable: sweet.quantity },
        ];
      }
    });
  };

  const removeFromCart = (sweetId) => {
    setCart((prev) => prev.filter((item) => item._id !== sweetId));
  };

  const updateCartQuantity = (sweetId, newQuantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === sweetId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleCartCheckout = async () => {
    if (cart.length === 0) return;
    try {
      for (const item of cart) {
        const response = await fetch(
          `${API_BASE_URL}/sweets/${item._id}/purchase`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ quantity: item.quantity }),
          }
        );
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || `Failed to purchase ${item.name}`);
        }
      }
      alert("Purchase successful! 🎉");
      setCart([]);
      setShowCartModal(false);
      fetchSweets();
      setShowOrdersModal(true);
    } catch (error) {
      alert(`Checkout Error: ${error.message}`);
    }
  };

  const handlePurchase = async (sweetId, quantity = 1) => {
    if (!user) {
      alert("Please login to purchase sweets! 🔒");
      setShowAuthModal(true);
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/sweets/${sweetId}/purchase`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ quantity }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert(
          `Purchase successful! 🎉 (${quantity} item${quantity > 1 ? "s" : ""})`
        );
        fetchSweets();
      } else {
        alert(data.message || "Purchase failed");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  const handleSweetUpdate = () => {
    setShowAddSweetModal(false);
    setEditingSweet(null);
    fetchSweets();
  };

  const handleDeleteSweet = async (sweetId) => {
    if (!confirm("Are you sure you want to delete this sweet?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/sweets/${sweetId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        alert("Sweet deleted successfully!");
        fetchSweets();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete sweet");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  const handleRestock = async (sweetId) => {
    const quantity = prompt("Enter restock quantity:");
    if (!quantity || isNaN(quantity)) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/sweets/${sweetId}/restock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ quantity: parseInt(quantity) }),
        }
      );
      if (response.ok) {
        alert("Restocked successfully!");
        fetchSweets();
      } else {
        const data = await response.json();
        alert(data.message || "Restock failed");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  return (
    // New background color for the whole app
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        cartCount={cart.length}
        onLogout={handleLogout}
        onLoginClick={() => setShowAuthModal(true)}
        onAddSweetClick={() => setShowAddSweetModal(true)}
        onOrdersClick={() => setShowOrdersModal(true)}
        onCartClick={() => setShowCartModal(true)}
      />

      <Hero
        user={user}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <SweetGrid
        sweets={filteredSweets}
        user={user}
        onPurchase={handlePurchase}
        onAddToCart={addToCart}
        onEdit={setEditingSweet} // Updated: Pass function
        onDelete={handleDeleteSweet}
        onRestock={handleRestock}
      />

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleLogin}
        />
      )}

      {(showAddSweetModal || editingSweet) && (
        <SweetModal
          sweet={editingSweet}
          onClose={() => {
            setShowAddSweetModal(false);
            setEditingSweet(null);
          }}
          onSuccess={handleSweetUpdate}
        />
      )}

      {showOrdersModal && (
        <OrdersModal onClose={() => setShowOrdersModal(false)} />
      )}

      {showCartModal && (
        <CartModal
          cart={cart}
          onClose={() => setShowCartModal(false)}
          onRemove={removeFromCart}
          onUpdateQuantity={updateCartQuantity}
          onCheckout={handleCartCheckout}
        />
      )}
    </div>
  );
}

export default App;