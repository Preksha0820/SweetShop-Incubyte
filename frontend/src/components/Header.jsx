// import React from 'react';
// import { ShoppingBag, LogOut, Plus, User, ShoppingCart } from 'lucide-react';

// function Header({ user, cartCount, onLogout, onLoginClick, onAddSweetClick, onOrdersClick, onCartClick }) {
//   return (
//     <header className="backdrop-blur-md bg-white/30 shadow-lg sticky top-0 z-40">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <span className="text-4xl">🍬</span>
//             <h1 className="text-3xl font-bold bg-linear-to-br from-pink-600 to-purple-600 bg-clip-text text-transparent">
//               Sweet Shop
//             </h1>
//           </div>

//           <div className="flex items-center space-x-4">
//             {user ? (
//               <>
//                 <div className="bg-purple-100 px-4 py-2 rounded-full flex items-center space-x-2">
//                   <User size={20} className="text-purple-600" />
//                   <span className="text-purple-900 font-medium">{user.name}</span>
//                   {user.role === 'admin' && (
//                     <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
//                       ADMIN
//                     </span>
//                   )}
//                 </div>

//                 {/* Your Cart Button - Only for regular users */}
//                 {user.role !== 'admin' && (
//                   <button
//                     onClick={onCartClick}
//                     className="bg-linear-to-br from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all flex items-center space-x-2 relative"
//                   >
//                     <ShoppingCart size={20} />
//                     <span>Your Cart</span>
//                     {cartCount > 0 && (
//                       <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
//                         {cartCount}
//                       </span>
//                     )}
//                   </button>
//                 )}

//                 {/* Your Orders Button - Only for regular users */}
//                 {user.role !== 'admin' && (
//                   <button
//                     onClick={onOrdersClick}
//                     className="bg-white border-2 border-purple-100 text-purple-600 px-4 py-2 rounded-full font-medium hover:bg-purple-50 transition-all flex items-center space-x-2"
//                   >
//                     <ShoppingBag size={20} />
//                     <span>Your Orders</span>
//                   </button>
//                 )}

//                 {user.role === 'admin' && (
//                   <button
//                     onClick={onAddSweetClick}
//                     className="bg-linear-to-br from-purple-500 to-pink-600 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all flex items-center space-x-2"
//                   >
//                     <Plus size={20} />
//                     <span>Add Sweet</span>
//                   </button>
//                 )}

//                 <button
//                   onClick={onLogout}
//                   className="bg-red-500 text-white px-4 py-2 rounded-full font-medium hover:bg-red-600 transition-all flex items-center space-x-2"
//                 >
//                   <LogOut size={20} />
//                   <span>Logout</span>
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={onLoginClick}
//                 className="bg-linear-to-br from-purple-500 to-pink-600 text-white px-6 py-3 rounded-full font-bold hover:shadow-xl transition-all"
//               >
//                 Login / Register
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;


import React from 'react';
import { ShoppingBag, LogOut, Plus, User, ShoppingCart } from 'lucide-react';

function Header({ user, cartCount, onLogout, onLoginClick, onAddSweetClick, onOrdersClick, onCartClick }) {
  // Helper component for buttons
  const NavButton = ({ onClick, className, children }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${className}`}
    >
      {children}
    </button>
  );

  return (
    // Clean, flat header with a bottom border
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-40 border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🍬</span>
            <h1 className="text-2xl font-bold bg-linear-to-br from-orange-600 to-red-600 bg-clip-text text-transparent">
              Sweet Shop
            </h1>
          </div>

          {/* Navigation & User */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1.5 rounded-lg">
                  <User size={18} className="text-orange-600" />
                  <span className="text-orange-900 font-medium text-sm">{user.name}</span>
                  {user.role === 'admin' && (
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                      ADMIN
                    </span>
                  )}
                </div>

                {user.role !== 'admin' && (
                  <>
                    <NavButton onClick={onOrdersClick} className="text-gray-600 hover:bg-orange-50 hover:text-orange-700">
                      <ShoppingBag size={18} />
                      <span>Orders</span>
                    </NavButton>
                    
                    <NavButton onClick={onCartClick} className="bg-orange-500 text-white hover:bg-orange-600 relative">
                      <ShoppingCart size={18} />
                      <span>Cart</span>
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </NavButton>
                  </>
                )}

                {user.role === 'admin' && (
                  <NavButton onClick={onAddSweetClick} className="bg-orange-500 text-white hover:bg-orange-600">
                    <Plus size={18} />
                    <span>Add Sweet</span>
                  </NavButton>
                )}

                <NavButton onClick={onLogout} className="bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700">
                  <LogOut size={18} />
                </NavButton>
              </>
            ) : (
              // Login button
              <button
                onClick={onLoginClick}
                className="bg-linear-to-br from-orange-500 to-red-600 text-white px-5 py-2.5 rounded-lg font-bold hover:shadow-lg transition-all"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;