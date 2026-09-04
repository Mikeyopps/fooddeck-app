import React, { useState, useMemo } from 'react';
import { Search, Flame, Plus, Sparkles, Filter, CheckCircle2, XCircle } from 'lucide-react';
import { MenuItem, FoodCategory, CartItem } from '../types';
import { formatNaira } from '../utils/helpers';
import { CustomizationModal } from './CustomizationModal';

interface MenuCatalogProps {
  menuItems: MenuItem[];
  onAddToCartDirect: (item: MenuItem) => void;
  onAddToCartCustomized: (cartItem: CartItem) => void;
}

const CATEGORIES: { id: FoodCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'All Dishes', icon: '🍽️' },
  { id: 'rice', label: 'Rice & Grains', icon: '🍚' },
  { id: 'swallow', label: 'Swallow & Soups', icon: '🥣' },
  { id: 'proteins', label: 'Proteins & Grills', icon: '🥩' },
  { id: 'sides', label: 'Sides & Extras', icon: '🥟' },
  { id: 'drinks', label: 'Drinks & Cocktails', icon: '🍹' },
];

export const MenuCatalog: React.FC<MenuCatalogProps> = ({
  menuItems,
  onAddToCartDirect,
  onAddToCartCustomized,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedSpicyOnly, setSelectedSpicyOnly] = useState(false);
  const [activeCustomizingItem, setActiveCustomizingItem] = useState<MenuItem | null>(null);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesSubtitle = item.nativeSubtitle?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesSubtitle) {
          return false;
        }
      }
      // In stock filter
      if (inStockOnly && !item.inStock) {
        return false;
      }
      // Spicy filter
      if (selectedSpicyOnly && (!item.spicyLevel || item.spicyLevel === 0)) {
        return false;
      }
      return true;
    });
  }, [menuItems, selectedCategory, searchQuery, inStockOnly, selectedSpicyOnly]);

  const handleItemClick = (item: MenuItem) => {
    if (!item.inStock) return;

    // If item allows customization (swallows, proteins, sides), open modal
    if (item.allowsSwallowChoice || item.allowsProteinChoice || item.allowsExtraSides) {
      setActiveCustomizingItem(item);
    } else {
      // Direct add to cart for simple items like drinks or standard sides
      onAddToCartDirect(item);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Pills and Search Bar Container */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs space-y-4">
        {/* Search input & Quick Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="menu-search-input"
              type="text"
              placeholder="Search jollof, egusi, asun, amala, chapman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E25822] text-sm text-stone-800 placeholder:text-stone-400 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-start">
            <button
              id="filter-instock-btn"
              type="button"
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`text-xs px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 border whitespace-nowrap ${
                inStockOnly
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              In Stock Only
            </button>

            <button
              id="filter-spicy-btn"
              type="button"
              onClick={() => setSelectedSpicyOnly(!selectedSpicyOnly)}
              className={`text-xs px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 border whitespace-nowrap ${
                selectedSpicyOnly
                  ? 'bg-red-50 text-red-700 border-red-300'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-red-500" />
              Spicy 🌶️
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#E25822] text-white shadow-sm shadow-orange-950/20 scale-102'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Dishes */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-2xl">
            🍲
          </div>
          <h3 className="text-lg font-bold text-stone-800">No dishes matched your search</h3>
          <p className="text-stone-500 text-sm mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or clear filters to view the full Nigerian menu.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setInStockOnly(false);
              setSelectedSpicyOnly(false);
            }}
            className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((dish) => {
            const hasCustomizations =
              dish.allowsSwallowChoice || dish.allowsProteinChoice || dish.allowsExtraSides;

            return (
              <div
                key={dish.id}
                id={`dish-card-${dish.id}`}
                className={`group bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                  dish.inStock
                    ? 'border-stone-200/90 hover:border-orange-300'
                    : 'border-stone-200 opacity-75 grayscale-20'
                }`}
              >
                {/* Top Image Container */}
                <div>
                  <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />

                    {/* Stock Status Badge */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {dish.inStock ? (
                        <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                          In Stock
                        </span>
                      ) : (
                        <span className="bg-red-600/90 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          Sold Out
                        </span>
                      )}

                      {dish.popular && (
                        <span className="bg-amber-400/95 backdrop-blur-xs text-stone-950 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-stone-900 fill-stone-900" />
                          Chef Special
                        </span>
                      )}
                    </div>

                    {/* Spicy Level Badge */}
                    {dish.spicyLevel && dish.spicyLevel > 0 ? (
                      <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span>{'🌶️'.repeat(dish.spicyLevel)}</span>
                      </div>
                    ) : null}
                  </div>

                  {/* Body Info */}
                  <div className="p-4 sm:p-5 space-y-2">
                    <div>
                      <h4 className="font-extrabold text-base sm:text-lg text-stone-900 font-heading leading-snug group-hover:text-[#E25822] transition-colors">
                        {dish.name}
                      </h4>
                      {dish.nativeSubtitle && (
                        <p className="text-xs font-semibold text-[#B83E0F] mt-0.5 line-clamp-1">
                          {dish.nativeSubtitle}
                        </p>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>
                </div>

                {/* Footer with Price and Action */}
                <div className="p-4 sm:p-5 pt-0 flex items-center justify-between gap-3 border-t border-stone-100 mt-2">
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Price
                    </span>
                    <span className="text-lg sm:text-xl font-extrabold text-stone-950 font-heading">
                      {formatNaira(dish.price)}
                    </span>
                  </div>

                  <button
                    id={`add-dish-btn-${dish.id}`}
                    type="button"
                    disabled={!dish.inStock}
                    onClick={() => handleItemClick(dish)}
                    className={`px-3.5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                      dish.inStock
                        ? 'bg-[#E25822] hover:bg-[#C94716] text-white'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>{hasCustomizations ? 'Customize' : 'Add to Tray'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Customization modal */}
      {activeCustomizingItem && (
        <CustomizationModal
          item={activeCustomizingItem}
          onClose={() => setActiveCustomizingItem(null)}
          onAddToCart={onAddToCartCustomized}
        />
      )}
    </div>
  );
};
