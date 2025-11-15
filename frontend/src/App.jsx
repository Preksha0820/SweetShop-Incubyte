import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import SweetGrid from "./components/SweetGrid";
import AuthModal from "./components/AuthModal";
import SweetModal from "./components/SweetModal";
import OrdersModal from "./components/OrdersModal";
import { API_BASE_URL } from "./config";

function App() {
  const [user, setUser] = useState(null);
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddSweetModal, setShowAddSweetModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    fetchSweets();
  }, []);

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
    fetchSweets();
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Header
        user={user}
        onLogout={handleLogout}
        onLoginClick={() => setShowAuthModal(true)}
        onAddSweetClick={() => setShowAddSweetModal(true)}
        onOrdersClick={() => setShowOrdersModal(true)}
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
        onEdit={setEditingSweet}
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
        <OrdersModal
          onClose={() => setShowOrdersModal(false)}
        />
      )}
    </div>
  );
}

export default App;