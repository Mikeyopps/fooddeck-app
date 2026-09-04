import React, { useState } from 'react';
import { X, Plus, Minus, Check, Flame, Clock } from 'lucide-react';
import { MenuItem, SwallowOption, ProteinOption, SideOption, CartItem } from '../types';
import { SWALLOW_OPTIONS, PROTEIN_OPTIONS, SIDE_OPTIONS } from '../data/mockData';
import { formatNaira } from '../utils/helpers';

interface CustomizationModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  if (!item) return null;

  // Defaults
  const [selectedSwallow, setSelectedSwallow] = useState<SwallowOption | undefined>(
    item.allowsSwallowChoice ? SWALLOW_OPTIONS[0] : undefined
  );
  const [selectedProtein, setSelectedProtein] = useState<ProteinOption | undefined>(
    item.allowsProteinChoice ? PROTEIN_OPTIONS[0] : undefined
  );
  const [selectedSides, setSelectedSides] = useState<SideOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Calculate unit price based on base price + additions
  const swallowExtra = selectedSwallow?.price || 0;
  const proteinExtra = selectedProtein?.price || 0;
  const sidesExtra = selectedSides.reduce((sum, s) => sum + s.price, 0);
  const unitPrice = item.price + swallowExtra + proteinExtra + sidesExtra;
  const totalItemCost = unitPrice * quantity;

  const toggleSide = (side: SideOption) => {
    if (selectedSides.some((s) => s.id === side.id)) {
      setSelectedSides(selectedSides.filter((s) => s.id !== side.id));
    } else {
      setSelectedSides([...selectedSides, side]);
    }
  };

  const handleConfirm = () => {
    const newCartItem: CartItem = {
      cartLineId: 'cl-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      menuItemId: item.id,
      name: item.name,
      basePrice: item.price,
      image: item.image,
      selectedSwallow,
      selectedProtein,
      selectedSides: selectedSides.length > 0 ? selectedSides : undefined,
      specialInstructions: specialInstructions.trim() || undefined,
      quantity,
      unitPrice,
      itemTotal: totalItemCost,
    };

    onAddToCart(newCartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Modal Header with Image */}
        <div className="relative h-48 sm:h-56 w-full bg-stone-900 shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />
          
          <button
            id="close-customization-modal-btn"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-stone-950/70 hover:bg-stone-900 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            {item.spicyLevel && item.spicyLevel > 0 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-red-600/90 text-white px-2 py-0.5 rounded mb-1">
                <Flame className="w-3 h-3" />
                {'🌶️'.repeat(item.spicyLevel)} Spicy
              </span>
            ) : null}
            <h3 className="text-xl sm:text-2xl font-black font-heading leading-tight drop-shadow-sm">
              {item.name}
            </h3>
            {item.nativeSubtitle && (
              <p className="text-xs sm:text-sm text-stone-200 font-medium drop-shadow-sm line-clamp-1">
                {item.nativeSubtitle}
              </p>
            )}
          </div>
        </div>

        {/* Scrollable Customization Options */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 divide-y divide-stone-200/80 text-stone-900">
          {/* Base description & prep time */}
          <div className="space-y-2">
            <p className="text-sm text-stone-600 leading-relaxed">{item.description}</p>
            <div className="flex items-center gap-4 text-xs font-semibold text-stone-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#E25822]" />
                Est. Prep: {item.prepTimeMinutes || 20} mins
              </span>
              <span>•</span>
              <span className="text-[#E25822] font-bold">Base Price: {formatNaira(item.price)}</span>
            </div>
          </div>

          {/* Swallow Selection (if applicable) */}
          {item.allowsSwallowChoice && (
            <div className="pt-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold tracking-tight text-stone-900 uppercase">
                  1. Select Hot Swallow <span className="text-[#E25822]">*</span>
                </label>
                <span className="text-xs text-stone-500 font-medium">Choose one</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SWALLOW_OPTIONS.map((swallow) => {
                  const isSelected = selectedSwallow?.id === swallow.id;
                  return (
                    <button
                      key={swallow.id}
                      type="button"
                      onClick={() => setSelectedSwallow(swallow)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#E25822] bg-orange-50/80 shadow-sm text-stone-950 ring-1 ring-[#E25822]'
                          : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#E25822] bg-[#E25822]' : 'border-stone-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold">{swallow.name}</span>
                      </div>
                      <span className="text-xs font-bold text-stone-600">+{formatNaira(swallow.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Protein Selection (if applicable) */}
          {item.allowsProteinChoice && (
            <div className="pt-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold tracking-tight text-stone-900 uppercase">
                  {item.allowsSwallowChoice ? '2. Choose Your Protein' : '1. Choose Your Protein'} <span className="text-[#E25822]">*</span>
                </label>
                <span className="text-xs text-stone-500 font-medium">Included with meal</span>
              </div>
              <div className="space-y-2">
                {PROTEIN_OPTIONS.map((protein) => {
                  const isSelected = selectedProtein?.id === protein.id;
                  return (
                    <button
                      key={protein.id}
                      type="button"
                      onClick={() => setSelectedProtein(protein)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#E25822] bg-orange-50/80 shadow-sm text-stone-950 ring-1 ring-[#E25822]'
                          : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#E25822] bg-[#E25822]' : 'border-stone-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold">{protein.name}</span>
                      </div>
                      <span className="text-xs font-bold text-[#E25822]">+{formatNaira(protein.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Extra Sides (Optional) */}
          {item.allowsExtraSides && (
            <div className="pt-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold tracking-tight text-stone-900 uppercase">
                  Extra Sides & Add-ons
                </label>
                <span className="text-xs text-stone-500 font-medium">Optional extras</span>
              </div>
              <div className="space-y-2">
                {SIDE_OPTIONS.map((side) => {
                  const isSelected = selectedSides.some((s) => s.id === side.id);
                  return (
                    <button
                      key={side.id}
                      type="button"
                      onClick={() => toggleSide(side)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 text-stone-950 ring-1 ring-emerald-600'
                          : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-stone-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold">{side.name}</span>
                      </div>
                      <span className="text-xs font-bold text-stone-600">+{formatNaira(side.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Kitchen Special Notes */}
          <div className="pt-4 space-y-1.5">
            <label className="text-sm font-bold tracking-tight text-stone-900 uppercase block">
              Special Kitchen Notes
            </label>
            <textarea
              id="special-instructions-input"
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Mild pepper please, separate stew into container, or no onions..."
              className="w-full text-sm p-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E25822] text-stone-800 placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Modal Footer with Quantity and Total Price */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-lg bg-white text-stone-700 hover:text-stone-950 flex items-center justify-center shadow-xs disabled:opacity-40 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-9 text-center font-extrabold text-sm text-stone-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-white text-stone-700 hover:text-stone-950 flex items-center justify-center shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="text-right sm:text-left">
              <div className="text-[11px] font-semibold text-stone-400 uppercase">Subtotal</div>
              <div className="text-lg font-black text-stone-950 font-heading">
                {formatNaira(totalItemCost)}
              </div>
            </div>
          </div>

          <button
            id="confirm-add-to-cart-btn"
            type="button"
            onClick={handleConfirm}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#E25822] hover:bg-[#C94716] text-white font-extrabold text-sm shadow-md shadow-orange-950/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>Add to Tray • {formatNaira(totalItemCost)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
