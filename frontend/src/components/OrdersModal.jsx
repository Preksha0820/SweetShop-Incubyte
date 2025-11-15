import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Calendar, Package } from 'lucide-react';
import { API_BASE_URL } from '../config';

function OrdersModal({ onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sweets/my-orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        alert('Failed to fetch orders');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
    setLoading(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalSpent = () => {
    return orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShoppingBag size={32} />
            <div>
              <h2 className="text-3xl font-bold">Your Orders</h2>
              <p className="text-purple-100">Order history and purchases</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-500">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-6">🛒</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Orders Yet</h3>
              <p className="text-gray-500">Start shopping to see your order history!</p>
            </div>
          ) : (
            <>
              {/* Summary Card */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 font-medium">Total Orders</p>
                    <p className="text-3xl font-bold text-purple-600">{orders.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 font-medium">Total Spent</p>
                    <p className="text-3xl font-bold text-pink-600">Rs{getTotalSpent()}</p>
                  </div>
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <div
                    key={order._id || index}
                    className="bg-white border-2 border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-800 mb-1">
                          {order.sweetName}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar size={16} />
                            <span>{formatDate(order.purchaseDate)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Package size={16} />
                            <span>Qty: {order.quantity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-2xl font-bold text-purple-600">
                          Rs.{order.totalPrice.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Rs.{order.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrdersModal;