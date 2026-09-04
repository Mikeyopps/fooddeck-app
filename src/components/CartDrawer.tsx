import React from 'react';
import { X, Trash2, Plus, Minus, MapPin, Bike, ShoppingBag, ShieldCheck, AlertCircle } from 'lucide-react';
import { CartItem, DeliveryZone, StoreSettings } from '../types';
import { formatNaira } from '../utils/helpers';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartLineId: string, delta: number) => void;
  onRemoveItem: (cartLineId: string) => void;
  deliveryType: 'delivery' | 'pickup';
  onSetDeliveryType: (type: 'delivery' | 'pickup') => void;
  deliveryZones: DeliveryZone[];
  selectedZone: DeliveryZone;
  onSelectZone: (zone: DeliveryZone) => void;
  deliveryInstructions: string;
  onSetDeliveryInstructions: (text: string) => void;
  storeSettings: StoreSettings;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  deliveryType,
  onSetDeliveryType,
  deliveryZones,
  selectedZone,
  onSelectZone,
  deliveryInstructions,
  onSetDeliveryInstructions,
  storeSettings,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);
  const deliveryFee = deliveryType === 'delivery' ? selectedZone.fee : 0;
  const packagingFee = cartItems.length > 0 ? storeSettings.packagingFee : 0;
  const total = subtotal + deliveryFee + packagingFee;

  const isStoreAccepting = storeSettings.isOpen && !storeSettings.manualPause;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col border-l border-stone-200">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 bg-white border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#E25822] flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-stone-900 font-heading leading-tight">
                  Your Order Tray
                </h3>
                <span className="text-xs text-stone-500 font-medium">
                  {cartItems.length} {cartItems.length === 1 ? 'dish' : 'dishes'} selected
                </span>
              </div>
            </div>

            <button
              id="close-cart-drawer-btn"
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-3xl">
                  🍲
                </div>
                <h4 className="font-bold text-stone-800 text-base">Your food tray is empty</h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Browse our hot party jollof, soups, and grilled meats to add delicious Nigerian meals.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 bg-[#E25822] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#C94716]"
                >
                  Explore Delicious Menu
                </button>
              </div>
            ) : (
              <>
                {/* Delivery Type Switcher (Delivery vs Pickup) */}
                <div className="bg-white p-1.5 rounded-2xl border border-stone-200 flex items-center gap-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => onSetDeliveryType('delivery')}
                    className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      deliveryType === 'delivery'
                        ? 'bg-[#1A1816] text-white shadow-xs'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Bike className="w-4 h-4 text-orange-400" />
                    <span>Lagos Dispatch Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSetDeliveryType('pickup')}
                    className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      deliveryType === 'pickup'
                        ? 'bg-[#1A1816] text-white shadow-xs'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>🏪 Self-Pickup (Free)</span>
                  </button>
                </div>

                {/* Location Zone Selector (Dynamic Zone Fee) */}
                {deliveryType === 'delivery' && (
                  <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#E25822]" />
                        Select Delivery Area / Zone
                      </label>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {selectedZone.estimatedMinutes}
                      </span>
                    </div>

                    <select
                      id="cart-zone-select"
                      value={selectedZone.id}
                      onChange={(e) => {
                        const found = deliveryZones.find((z) => z.id === e.target.value);
                        if (found) onSelectZone(found);
                      }}
                      className="w-full text-xs sm:text-sm font-semibold p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:ring-2 focus:ring-[#E25822] focus:outline-none"
                    >
                      {deliveryZones.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name} — {formatNaira(zone.fee)} ({zone.estimatedMinutes})
                        </option>
                      ))}
                    </select>

                    <p className="text-[11px] text-stone-500 leading-tight">
                      Delivery fee is calculated automatically based on distance from our central kitchen.
                    </p>
                  </div>
                )}

                {/* Cart Items List */}
                <div className="space-y-3">
                  <span className="text-xs font-extrabold text-stone-400 uppercase tracking-wider block">
                    Dishes in Tray
                  </span>

                  {cartItems.map((item) => (
                    <div
                      key={item.cartLineId}
                      className="bg-white rounded-2xl p-3.5 border border-stone-200/90 shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-100"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h5 className="font-extrabold text-sm text-stone-900 font-heading leading-tight">
                              {item.name}
                            </h5>
                            <span className="text-xs font-bold text-[#E25822]">
                              {formatNaira(item.unitPrice)} each
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.cartLineId)}
                          className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Customization Details Pills */}
                      <div className="text-xs space-y-1 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                        {item.selectedSwallow && (
                          <div className="text-stone-700 font-medium">
                            <span className="text-stone-400 font-semibold">Swallow:</span>{' '}
                            <span className="font-bold text-stone-900">{item.selectedSwallow.name}</span>
                          </div>
                        )}
                        {item.selectedProtein && (
                          <div className="text-stone-700 font-medium">
                            <span className="text-stone-400 font-semibold">Protein:</span>{' '}
                            <span className="font-bold text-stone-900">{item.selectedProtein.name}</span>
                          </div>
                        )}
                        {item.selectedSides && item.selectedSides.length > 0 && (
                          <div className="text-stone-700 font-medium">
                            <span className="text-stone-400 font-semibold">Sides:</span>{' '}
                            <span className="font-bold text-stone-900">
                              {item.selectedSides.map((s) => s.name).join(', ')}
                            </span>
                          </div>
                        )}
                        {item.specialInstructions && (
                          <div className="text-stone-600 italic text-[11px] pt-0.5">
                            "{item.specialInstructions}"
                          </div>
                        )}
                      </div>

                      {/* Quantity and Line Total */}
                      <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                        <div className="flex items-center bg-stone-100 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartLineId, -1)}
                            className="w-6 h-6 rounded bg-white text-stone-700 flex items-center justify-center hover:bg-stone-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-extrabold text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartLineId, 1)}
                            className="w-6 h-6 rounded bg-white text-stone-700 flex items-center justify-center hover:bg-stone-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-black text-sm text-stone-900 font-heading">
                          {formatNaira(item.itemTotal)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-stone-700 uppercase tracking-wider block">
                    Drop-off Directions / Notes
                  </label>
                  <input
                    type="text"
                    value={deliveryInstructions}
                    onChange={(e) => onSetDeliveryInstructions(e.target.value)}
                    placeholder="e.g. Leave at gate security, call when outside..."
                    className="w-full text-xs p-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E25822] text-stone-800"
                  />
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer with Financial Summary & Checkout CTA */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-stone-200 space-y-3.5 shrink-0">
              {/* Receipt Summary Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Food Subtotal</span>
                  <span className="font-semibold text-stone-900">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Fee ({deliveryType === 'delivery' ? selectedZone.name : 'Self Pickup'})</span>
                  <span className="font-semibold text-stone-900">
                    {deliveryFee > 0 ? formatNaira(deliveryFee) : 'FREE'}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Thermal Packaging & Tamper Seal</span>
                  <span className="font-semibold text-stone-900">{formatNaira(packagingFee)}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="font-black text-sm text-stone-950 uppercase">Total Amount</span>
                  <span className="font-black text-xl text-[#E25822] font-heading">
                    {formatNaira(total)}
                  </span>
                </div>
              </div>

              {/* Notice if Kitchen is Paused */}
              {!isStoreAccepting && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    {storeSettings.manualPause
                      ? 'Checkout paused: Kitchen is attending to active orders.'
                      : 'Store currently closed. Resumes at ' + storeSettings.openingTime + ' WAT.'}
                  </span>
                </div>
              )}

              {/* Checkout CTA */}
              <button
                id="cart-proceed-checkout-btn"
                type="button"
                disabled={!isStoreAccepting}
                onClick={onProceedToCheckout}
                className={`w-full py-3.5 rounded-xl font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 ${
                  isStoreAccepting
                    ? 'bg-[#E25822] hover:bg-[#C94716] text-white shadow-orange-950/20'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>Pay & Send to Kitchen • {formatNaira(total)}</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-stone-400">
                <span>🔒 Upfront Payment Required (Cards • Transfer • USSD)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
