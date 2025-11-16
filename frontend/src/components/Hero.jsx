// import React from 'react';
// import { Search } from 'lucide-react';

// function Hero({ user, searchTerm, onSearchChange }) {
//   return (
//     <div className="relative overflow-hidden bg-linear-to-r from-pink-400 via-purple-400 to-indigo-400 py-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center">
//           <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
//             🍭 Welcome to Sweet Paradise 🍬
//           </h2>
//           <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
//             Indulge in the finest selection of candies, chocolates, and treats from around the world
//           </p>
          
//           {/* Search Bar */}
//           <div className="max-w-2xl mx-auto">
//             <div className="relative">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
//               <input
//                 type="text"
//                 placeholder="Search for your favorite sweets..."
//                 value={searchTerm}
//                 onChange={(e) => onSearchChange(e.target.value)}
//                 className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-white/30 focus:border-white focus:outline-none text-lg bg-white/90 backdrop-blur-sm shadow-xl"
//               />
//             </div>
//           </div>

//           {/* Login prompt for guests */}
//           {!user && (
//             <div className="mt-6">
//               <p className="text-white/90 text-sm">
//                 👋 <span className="font-semibold">New here?</span> Login to start purchasing your favorite treats!
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
      
//       {/* Decorative Elements */}
//       <div className="absolute top-10 left-10 text-6xl animate-bounce">🍬</div>
//       <div className="absolute top-20 right-20 text-6xl animate-bounce" style={{animationDelay: '0.1s'}}>🍭</div>
//       <div className="absolute bottom-10 left-1/4 text-6xl animate-bounce" style={{animationDelay: '0.2s'}}>🍫</div>
//       <div className="absolute bottom-20 right-1/3 text-6xl animate-bounce" style={{animationDelay: '0.3s'}}>🧁</div>
//     </div>
//   );
// }

// export default Hero;


import React from 'react';
import { Search } from 'lucide-react';

function Hero({ user, searchTerm, onSearchChange }) {
  return (
    <div className="relative bg-linear-to-r from-amber-100 via-orange-50 to-red-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Column 1: Text Content & Search */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 drop-shadow-sm">
              <span className="bg-linear-to-br from-orange-600 to-red-600 bg-clip-text text-transparent">Indulge</span> Your
              <br />
              Sweet Cravings
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              The finest selection of candies, chocolates, and artisan treats, delivered straight to your door.
            </p>
            
            {/* Search Bar - Redesigned */}
            <div className="w-full max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400" size={22} />
                <input
                  type="text"
                  placeholder="Search for chocolates, gummies, cakes..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 rounded-full border-2 border-orange-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 text-lg shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Column 2: Visual (I'll use emojis as placeholders, you can add an image here) */}
          <div className="hidden md:flex items-center justify-center">
            <div className="grid grid-cols-2 gap-6 p-8 bg-white/50 rounded-3xl shadow-lg backdrop-blur-sm">
              <div className="text-8xl transform transition-transform hover:scale-125">🍫</div>
              <div className="text-8xl transform transition-transform hover:scale-125">🍬</div>
              <div className="text-8xl transform transition-transform hover:scale-125">🍭</div>
              <div className="text-8xl transform transition-transform hover:scale-125">🧁</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Hero;