// import React, { useState } from 'react';
// import { Edit2, Trash2, Package, ShoppingCart, Minus, Plus, Check } from 'lucide-react';
// import { API_BASE_URL } from '../config';

// // Helper to get full image URL
// const getImageUrl = (imageUrl) => {
//   if (!imageUrl) return null;
//   const baseUrl = API_BASE_URL.replace('/api', '');
//   return `${baseUrl}${imageUrl}`;
// };

// function SweetCard({ sweet, user, onPurchase, onAddToCart, onEdit, onDelete, onRestock }) {
//   const [quantity, setQuantity] = useState(1);
//   const [imageError, setImageError] = useState(false);
//   const [isAdded, setIsAdded] = useState(false); // For visual feedback

//   const getSweetEmoji = (category) => {
//     const cat = category.toLowerCase();
//     if (cat.includes('chocolate')) return '🍫';
//     if (cat.includes('candy')) return '🍬';
//     if (cat.includes('gum')) return '🍭';
//     return '🧁';
//   };

//   const handleIncrement = () => {
//     if (quantity < sweet.quantity) {
//       setQuantity(prev => prev + 1);
//     }
//   };

//   const handleDecrement = () => {
//     if (quantity > 1) {
//       setQuantity(prev => prev - 1);
//     }
//   };

//   const handleAddToCart = () => {
//     if (!user) {
//       onAddToCart(sweet, 1); // Triggers login prompt
//       return;
//     }
    
//     onAddToCart(sweet, quantity);
    
//     // Show "Added" feedback for 2 seconds
//     setIsAdded(true);
//     setTimeout(() => setIsAdded(false), 2000);
//     setQuantity(1); // Reset quantity
//   };

//   const handlePurchase = () => {
//     onPurchase(sweet._id, quantity);
//     setQuantity(1);
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group flex flex-col h-full">
//       {/* Image Section */}
//       <div className="bg-linear-to-br from-pink-200 to-purple-200 h-48 flex items-center justify-center overflow-hidden relative shrink-0">
//         {sweet.imageUrl && !imageError ? (
//           <img 
//             src={getImageUrl(sweet.imageUrl)}
//             alt={sweet.name}
//             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//             loading="lazy"
//             onError={() => setImageError(true)}
//           />
//         ) : (
//           <div className="text-7xl">
//             {getSweetEmoji(sweet.category)}
//           </div>
//         )}
//       </div>
      
//       <div className="p-5 flex flex-col flex-1">
//         {/* Title and Price */}
//         <div className="mb-4">
//           <div className="flex justify-between items-start mb-2">
//             <h3 className="text-xl font-bold text-gray-800 leading-tight">{sweet.name}</h3>
//             <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap ml-2">
//               {sweet.category}
//             </span>
//           </div>
//           <div className="flex items-center justify-between">
//              <span className="text-2xl font-bold text-pink-600">Rs.{sweet.price.toFixed(2)}</span>
//              <span className={`text-xs font-bold px-2 py-1 rounded-full ${sweet.quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//               {sweet.quantity > 0 ? `${sweet.quantity} left` : 'No Stock'}
//             </span>
//           </div>
//         </div>
        
//         <div className="mt-auto space-y-3">
          
//           {/* Quantity Selector (Only show for Users/Guests if stock exists) */}
//           {user?.role !== 'admin' && sweet.quantity > 0 && (
//             <div className="flex items-center justify-between bg-gray-50 rounded-xl p-2 border border-gray-100">
//               <span className="text-sm text-gray-500 font-medium ml-1">Qty:</span>
//               <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
//                 <button 
//                   onClick={handleDecrement}
//                   disabled={quantity <= 1}
//                   className="p-2 text-gray-600 hover:text-purple-600 disabled:text-gray-300 transition-colors"
//                 >
//                   <Minus size={16} />
//                 </button>
//                 <span className="w-8 text-center font-bold text-gray-800">{quantity}</span>
//                 <button 
//                   onClick={handleIncrement}
//                   disabled={quantity >= sweet.quantity}
//                   className="p-2 text-gray-600 hover:text-purple-600 disabled:text-gray-300 transition-colors"
//                 >
//                   <Plus size={16} />
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* User Actions */}
//           {user?.role !== 'admin' && (
//             <div className="grid grid-cols-2 gap-3">
//               {/* Add to Cart Button */}
//               <button
//                 onClick={handleAddToCart}
//                 disabled={sweet.quantity === 0}
//                 className={`py-2.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-1 transition-all duration-200 ${
//                   sweet.quantity === 0
//                     ? 'bg-gray-100 text-gray-400 cursor-not-allowed col-span-2'
//                     : isAdded 
//                       ? 'bg-green-500 text-white shadow-md scale-105'
//                       : 'bg-white border-2 border-purple-500 text-purple-600 hover:bg-purple-50'
//                 }`}
//               >
//                 {isAdded ? (
//                   <>
//                     <Check size={18} />
//                     <span>Added</span>
//                   </>
//                 ) : (
//                   <>
//                     <ShoppingCart size={18} />
//                     <span>Add</span>
//                   </>
//                 )}
//               </button>

//               {/* Purchase Button */}
//               {sweet.quantity > 0 && (
//                 <button
//                   onClick={handlePurchase}
//                   className={`py-2.5 rounded-xl font-bold text-sm text-white transition-all shadow-md hover:shadow-lg flex items-center justify-center ${
//                     user 
//                       ? 'bg-linear-to-br from-pink-500 to-purple-600'
//                       : 'bg-linear-to-br from-gray-500 to-gray-600'
//                   }`}
//                 >
//                   {user ? 'Buy Now' : 'Login'}
//                 </button>
//               )}
//             </div>
//           )}
          
//           {/* Admin Controls */}
//           {user && user.role === 'admin' && (
//             <div className="flex space-x-2 pt-2">
//               <button
//                 onClick={() => onEdit(sweet)}
//                 className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-all flex items-center justify-center border border-blue-200"
//               >
//                 <Edit2 size={16} />
//               </button>
//               <button
//                 onClick={() => onRestock(sweet._id)}
//                 className="flex-1 bg-green-50 text-green-600 py-2 rounded-lg hover:bg-green-100 transition-all flex items-center justify-center border border-green-200"
//               >
//                 <Package size={16} />
//               </button>
//               <button
//                 onClick={() => onDelete(sweet._id)}
//                 className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-all flex items-center justify-center border border-red-200"
//               >
//                 <Trash2 size={16} />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SweetCard;



import React, { useState } from 'react';
import { Edit2, Trash2, Package, ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import { API_BASE_URL } from '../config';

// Helper to get full image URL
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  const baseUrl = API_BASE_URL.replace('/api', '');
  return `${baseUrl}${imageUrl}`;
};

function SweetCard({ sweet, user, onPurchase, onAddToCart, onEdit, onDelete, onRestock }) {
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [isAdded, setIsAdded] = useState(false); // For visual feedback

  const getSweetEmoji = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes('chocolate')) return '🍫';
    if (cat.includes('candy')) return '🍬';
    if (cat.includes('gum')) return '🍭';
    return '🧁';
  };

  const handleIncrement = () => {
    if (quantity < sweet.quantity) setQuantity(prev => prev + 1);
  };
  const handleDecrement = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddToCart = () => {
    if (!user) {
      onAddToCart(sweet, 1); return;
    }
    onAddToCart(sweet, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    setQuantity(1);
  };

  const handlePurchase = () => {
    onPurchase(sweet._id, quantity);
    setQuantity(1);
  };

  return (
    // Card outer container: More padding, softer shadow
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      
      {/* Image Section: New layout, no bg color, just the image */}
      <div className="h-56 w-full relative shrink-0">
        {sweet.imageUrl && !imageError ? (
          <img 
            src={getImageUrl(sweet.imageUrl)}
            alt={sweet.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-orange-50 text-7xl">
            {getSweetEmoji(sweet.category)}
          </div>
        )}
        {/* Category Badge: New position */}
        <span className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
          {sweet.category}
        </span>
      </div>
      
      {/* Content Section: New arrangement and spacing */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title and Stock (New Arrangement) */}
        <div className="flex-1 mb-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-800 leading-tight">{sweet.name}</h3>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ml-2 ${
              sweet.quantity > 0 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {sweet.quantity > 0 ? `${sweet.quantity} In Stock` : 'Out of Stock'}
            </span>
          </div>
          {/* Price: Moved, more prominent */}
          <span className="text-3xl font-bold text-orange-600">Rs.{sweet.price.toFixed(2)}</span>
        </div>
        
        {/* Action Area: New layout */}
        <div className="mt-auto space-y-3">
          
          {/* User actions */}
          {user?.role !== 'admin' && (
            <>
              {/* Quantity Selector (Redesigned) */}
              {sweet.quantity > 0 && (
                <div className="flex items-center justify-center space-x-3 bg-gray-100 rounded-lg p-2">
                  <button 
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="p-1.5 rounded-full bg-white shadow text-gray-600 hover:text-red-600 disabled:text-gray-300 transition-colors"
                  > <Minus size={18} /> </button>
                  
                  <span className="w-10 text-center text-lg font-bold text-gray-800">{quantity}</span>
                  
                  <button 
                    onClick={handleIncrement}
                    disabled={quantity >= sweet.quantity}
                    className="p-1.5 rounded-full bg-white shadow text-gray-600 hover:text-green-600 disabled:text-gray-300 transition-colors"
                  > <Plus size={18} /> </button>
                </div>
              )}

              {/* Add to Cart / Purchase Buttons (Redesigned) */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={sweet.quantity === 0 || isAdded}
                  className={`py-3 rounded-lg font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-200 ${
                    isAdded 
                      ? 'bg-green-500 text-white'
                      : sweet.quantity === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  }`}
                >
                  {isAdded ? <Check size={18} /> : <ShoppingCart size={18} />}
                  <span>{isAdded ? 'Added' : 'Add'}</span>
                </button>

                <button
                  onClick={handlePurchase}
                  disabled={sweet.quantity === 0}
                  className={`py-3 rounded-lg font-bold text-sm text-white transition-all shadow-md hover:shadow-lg ${
                    sweet.quantity === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-linear-to-br from-orange-500 to-red-600'
                  }`}
                >
                  {user ? 'Buy Now' : 'Login'}
                </button>
              </div>
            </>
          )}
          
          {/* Admin Controls (Redesigned) */}
          {user && user.role === 'admin' && (
            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                onClick={() => onEdit(sweet)}
                className="flex-1 bg-blue-50 text-blue-600 py-2.5 rounded-lg hover:bg-blue-100 transition-all flex items-center justify-center space-x-1 border border-blue-200"
              >
                <Edit2 size={16} /> <span className="text-sm font-medium">Edit</span>
              </button>
              <button
                onClick={() => onRestock(sweet._id)}
                className="flex-1 bg-green-50 text-green-600 py-2.5 rounded-lg hover:bg-green-100 transition-all flex items-center justify-center space-x-1 border border-green-200"
              >
                <Package size={16} /> <span className="text-sm font-medium">Stock</span>
              </button>
              <button
                onClick={() => onDelete(sweet._id)}
                className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-lg hover:bg-red-100 transition-all flex items-center justify-center space-x-1 border border-red-200"
              >
                <Trash2 size={16} /> <span className="text-sm font-medium">Del</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SweetCard;