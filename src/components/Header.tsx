import React from 'react';
import { ShoppingBag, Clock, ChefHat, User, Sparkles, UtensilsCrossed } from 'lucide-react';
import { StoreSettings, CartItem } from '../types';
import { formatNaira } from '../utils/helpers';

interface HeaderProps {
  storeSettings: StoreSettings;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenMyOrders: () => void;
  onToggleAdmin: () => void;
  isAdminView: boolean;
  activeOrdersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  storeSettings,
  cartItems,
  onOpenCart,
  onOpenMyOrders,
  onToggleAdmin,
  isAdminView,
  activeOrdersCount,
}) => {
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E1D5] transition-all">
      {/* Top micro bar for operating status & Nigerian warmth */}
      <div className="bg-[#1A1816] text-[#F3EEEA] text-xs py-1 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-stone-200">
              {storeSettings.manualPause
                ? '🔴 Kitchen temporarily paused for rush orders'
                : storeSettings.isOpen
                ? '🟢 Lagos Kitchen Active • Hot Deliveries Ongoing'
                : '🟡 Closed • Opens 8:00 AM WAT'}
            </span>
            <span className="hidden sm:inline text-stone-400">|</span>
            <span className="hidden sm:inline text-stone-400">Hours: {storeSettings.openingTime} – {storeSettings.closingTime} WAT</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="header-toggle-admin-btn"
              onClick={onToggleAdmin}
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold transition-colors flex items-center gap-1.5 ${
                isAdminView
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              {isAdminView ? 'Switch to Customer App' : 'Kitchen / Admin Portal'}
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Logo & brand */}
        <div className="flex items-center gap-3">
          <button
            id="brand-logo-btn"
            onClick={() => {
              if (isAdminView) onToggleAdmin();
            }}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E25822] to-[#B83E0F] flex items-center justify-center text-white shadow-md shadow-orange-950/15 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-[#1A1816] font-heading">
                  Food<span className="text-[#E25822]">Deck</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                  Lagos
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium hidden sm:block">
                Authentic Naija Cuisine & Fast Dispatch
              </p>
            </div>
          </button>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* My orders button */}
          <button
            id="header-my-orders-btn"
            onClick={onOpenMyOrders}
            className="relative px-3.5 py-2 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-200/60 font-semibold text-sm transition-colors flex items-center gap-2 border border-transparent hover:border-stone-300/80"
          >
            <Clock className="w-4 h-4 text-stone-500" />
            <span className="hidden sm:inline">My Orders</span>
            {activeOrdersCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-[#E25822] rounded-full animate-pulse shadow-sm">
                {activeOrdersCount}
              </span>
            )}
          </button>

          {/* Cart button */}
          <button
            id="header-open-cart-btn"
            onClick={onOpenCart}
            className="relative px-4 py-2.5 rounded-xl bg-[#E25822] hover:bg-[#C94716] text-white font-bold text-sm shadow-md shadow-orange-900/20 transition-all flex items-center gap-2.5 active:scale-95"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-300 text-stone-950 text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#E25822]">
                  {totalCartCount}
                </span>
              )}
            </div>
            <div className="text-left hidden xs:block">
              <span className="text-xs font-medium text-orange-100 block leading-tight">My Tray</span>
              <span className="text-sm font-extrabold leading-tight">
                {totalCartCount > 0 ? formatNaira(totalCartAmount) : 'Empty'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
