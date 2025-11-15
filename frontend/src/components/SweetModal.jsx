import React, { useState, useEffect, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { API_BASE_URL } from '../config';

function SweetModal({ sweet, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [sweetForm, setSweetForm] = useState({
    name: '',
    category: '',
    price: '',
    quantity: ''
  });

  useEffect(() => {
    if (sweet) {
      setSweetForm({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price.toString(),
        quantity: sweet.quantity.toString()
      });
      // Set preview for existing image
      if (sweet.imageUrl) {
        setImagePreview(`${API_BASE_URL}${sweet.imageUrl}`);
      }
    }
  }, [sweet]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSweetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('name', sweetForm.name);
      formData.append('category', sweetForm.category);
      formData.append('price', sweetForm.price);
      formData.append('quantity', sweetForm.quantity);
      
      // Add image file if exists
      if (fileInputRef.current?.files[0]) {
        formData.append('image', fileInputRef.current.files[0]);
      }

      const url = sweet 
        ? `${API_BASE_URL}/sweets/${sweet._id}`
        : `${API_BASE_URL}/sweets`;
      
      const response = await fetch(url, {
        method: sweet ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
          // DON'T set Content-Type - browser will set it with boundary
        },
        body: formData
      });

      if (response.ok) {
        alert(sweet ? 'Sweet updated successfully! ✅' : 'Sweet added successfully! ✅');
        onSuccess();
      } else {
        const data = await response.json();
        alert(data.message || `Failed to ${sweet ? 'update' : 'add'} sweet`);
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          {sweet ? 'Edit Sweet' : 'Add New Sweet'}
        </h2>
        
        <form onSubmit={handleSweetSubmit} className="space-y-4">
          {/* Image Upload Section */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Product Image
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-all bg-gray-50 hover:bg-purple-50"
              >
                <Upload size={40} className="text-gray-400 mb-2" />
                <p className="text-gray-600 font-medium">Click to upload image</p>
                <p className="text-gray-400 text-sm">PNG, JPG, GIF, WEBP (Max 5MB)</p>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              value={sweetForm.name}
              onChange={(e) => setSweetForm({ ...sweetForm, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Category</label>
            <input
              type="text"
              value={sweetForm.category}
              onChange={(e) => setSweetForm({ ...sweetForm, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
              placeholder="e.g., Chocolate, Candy, Gummy"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Price (Rs)</label>
            <input
              type="number"
              step="0.01"
              value={sweetForm.price}
              onChange={(e) => setSweetForm({ ...sweetForm, price: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Quantity</label>
            <input
              type="number"
              value={sweetForm.quantity}
              onChange={(e) => setSweetForm({ ...sweetForm, quantity: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? '⏳ Saving...' : sweet ? 'Update Sweet' : 'Add Sweet'}
          </button>
        </form>
        
        <button
          onClick={onClose}
          className="mt-4 w-full text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default SweetModal;