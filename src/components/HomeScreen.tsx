import { Search, Cake, Cookie, IceCream } from 'lucide-react';
import { useState } from 'react';

interface HomeScreenProps {
  onCategorySelect: (category: string) => void;
  onAdminClick: () => void;
}

const categories = [
  { name: 'Strawberry Fest', icon: IceCream, color: 'from-pink-400 to-red-400' },
  { name: 'Brownies', icon: Cake, color: 'from-amber-700 to-amber-900' },
  { name: 'No bake Cheese Cakes', icon: Cake, color: 'from-yellow-300 to-orange-400' },
  { name: 'Baked Cheese Cakes', icon: Cake, color: 'from-orange-400 to-red-500' },
  { name: 'Cookies', icon: Cookie, color: 'from-amber-500 to-yellow-700' },
  { name: 'Buns', icon: Cake, color: 'from-amber-300 to-yellow-500' },
];

export function HomeScreen({ onCategorySelect, onAdminClick }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4B2C5E] to-[#6B4C7E] p-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#FFFDF5] mb-2">
            Nirvana Desserts
          </h1>
          <p className="text-[#FFD700] text-lg md:text-xl font-medium">Sweet Paradise</p>
        </header>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-4 py-4 rounded-xl bg-[#FFFDF5] text-[#4B2C5E] text-lg font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#FFD700] shadow-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6"> {/* Changed from grid-cols-1 md:grid-cols-2 */}
  {filteredCategories.map((category) => {
    const Icon = category.icon;
    return (
      <button
        key={category.name}
        onClick={() => onCategorySelect(category.name)}
        className={`bg-gradient-to-br ${category.color} p-4 rounded-xl shadow-lg hover:scale-105 transition-transform active:scale-95`}
      >
        <Icon className="w-8 h-8 text-white mx-auto mb-2" /> {/* Smaller icons */}
        <h3 className="text-white text-sm md:text-lg font-bold text-center">
          {category.name}
        </h3>
      </button>
    );
  })}
</div>  

        <button
          onClick={onAdminClick}
          className="w-full bg-[#FFFDF5] text-[#4B2C5E] py-4 rounded-xl font-bold text-lg hover:bg-[#FFD700] transition-colors shadow-lg"
        >
          Admin Dashboard
        </button>
      </div>
    </div>
  );
}
