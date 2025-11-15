import React, { useState } from 'react';
import { Edit2, Trash2, Package } from 'lucide-react';
import { API_BASE_URL } from '../config';

// Helper to get full image URL
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  // Remove /api from API_BASE_URL to get base server URL
  const baseUrl = API_BASE_URL.replace('/api', '');
  return `${baseUrl}${imageUrl}`;
};

function SweetCard({ sweet, user, onPurchase, onEdit, onDelete, onRestock }) {
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [showQuantityInput, setShowQuantityInput] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getSweetEmoji = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes('chocolate')) return '🍫';
    if (cat.includes('candy')) return '🍬';
    if (cat.includes('gum')) return '🍭';
    return '🧁';
  };

  const handlePurchaseClick = () => {
    if (!user) {
      onPurchase(sweet._id, 1); // Triggers login prompt
      return;
    }
    
    // Show quantity input for regular users
    if (user.role !== 'admin') {
      setShowQuantityInput(true);
    }
  };

  const confirmPurchase = () => {
    if (purchaseQuantity > sweet.quantity) {
      alert(`Only ${sweet.quantity} items available in stock!`);
      return;
    }
    if (purchaseQuantity < 1) {
      alert('Please enter a valid quantity!');
      return;
    }
    onPurchase(sweet._id, purchaseQuantity);
    setShowQuantityInput(false);
    setPurchaseQuantity(1);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
      {/* Image or Emoji Display */}
      <div className="bg-gradient-to-br from-pink-200 to-purple-200 h-48 flex items-center justify-center overflow-hidden relative">
        {sweet.imageUrl && !imageError ? (
          <img 
            src={getImageUrl(sweet.imageUrl)}
            alt={sweet.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="text-7xl">
            {getSweetEmoji(sweet.category)}
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{sweet.name}</h3>
        <div className="flex items-center justify-between mb-4">
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
            {sweet.category}
          </span>
          <span className="text-2xl font-bold text-pink-600">Rs.{sweet.price.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-medium ${sweet.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of stock'}
          </span>
        </div>
        
        <div className="space-y-2">
          {/* Quantity Input Modal */}
          {showQuantityInput && (
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity to purchase:
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="1"
                  max={sweet.quantity}
                  value={purchaseQuantity}
                  onChange={(e) => setPurchaseQuantity(parseInt(e.target.value) || 1)}
                  className="flex-1 px-3 py-2 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={confirmPurchase}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  Buy
                </button>
                <button
                  onClick={() => {
                    setShowQuantityInput(false);
                    setPurchaseQuantity(1);
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Purchase Button - Hidden for Admin, Show for Users/Guests */}
          {user?.role !== 'admin' && (
            <button
              onClick={handlePurchaseClick}
              disabled={sweet.quantity === 0}
              className={`w-full py-3 rounded-xl font-medium transition-all ${
                sweet.quantity === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : user 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-lg'
              }`}
            >
              {sweet.quantity === 0 ? 'Out of Stock' : user ? 'Purchase Now' : '🔒 Login to Purchase'}
            </button>
          )}
          
          {/* Admin Controls */}
          {user && user.role === 'admin' && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(sweet)}
                className="flex-1 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center space-x-1"
              >
                <Edit2 size={16} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onRestock(sweet._id)}
                className="flex-1 bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition-all flex items-center justify-center space-x-1"
              >
                <Package size={16} />
                <span>Restock</span>
              </button>
              <button
                onClick={() => onDelete(sweet._id)}
                className="bg-red-500 text-white py-2 px-3 rounded-xl hover:bg-red-600 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SweetCard;