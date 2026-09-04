import React, { useState, useEffect } from 'react';
import {
  MENU_ITEMS,
  DELIVERY_ZONES,
  INITIAL_STORE_SETTINGS,
  INITIAL_ORDERS,
} from './data/mockData';
import {
  MenuItem,
  CartItem,
  DeliveryZone,
  Order,
  OrderStatus,
  StoreSettings,
} from './types';
import { Header } from './components/Header';
import { OperatingHoursBanner } from './components/OperatingHoursBanner';
import { MenuCatalog } from './components/MenuCatalog';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { MyOrdersModal } from './components/MyOrdersModal';
import { AdminDashboard } from './components/AdminDashboard';
import { playKitchenChime } from './utils/helpers';
import { ChefHat, Bike, ShieldCheck, Flame, Heart, Sparkles } from 'lucide-react';

export default function App() {
  // Master application states with local storage caching for persistence
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('fd_menu_items');
      return saved ? JSON.parse(saved) : MENU_ITEMS;
    } catch {
      return MENU_ITEMS;
    }
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('fd_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() => {
    try {
      const saved = localStorage.getItem('fd_delivery_zones');
      return saved ? JSON.parse(saved) : DELIVERY_ZONES;
    } catch {
      return DELIVERY_ZONES;
    }
  });

  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(DELIVERY_ZONES[1]); // Lekki Phase 1 default
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('fd_store_settings');
      return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
    } catch {
      return INITIAL_STORE_SETTINGS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('fd_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // UI Navigation Modals & Views
  const [isAdminView, setIsAdminView] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fd_cart_items', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('fd_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('fd_menu_items', JSON.stringify(menuItems));
    } catch {}
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem('fd_delivery_zones', JSON.stringify(deliveryZones));
    } catch {}
  }, [deliveryZones]);

  useEffect(() => {
    try {
      localStorage.setItem('fd_store_settings', JSON.stringify(storeSettings));
    } catch {}
  }, [storeSettings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Cart Handlers
  const handleAddToCartDirect = (item: MenuItem) => {
    const existingIndex = cartItems.findIndex(
      (c) => c.menuItemId === item.id && !c.selectedSwallow && !c.selectedProtein && !c.selectedSides
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].itemTotal = updated[existingIndex].quantity * updated[existingIndex].unitPrice;
      setCartItems(updated);
    } else {
      const newCartItem: CartItem = {
        cartLineId: 'cl-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        menuItemId: item.id,
        name: item.name,
        basePrice: item.price,
        image: item.image,
        quantity: 1,
        unitPrice: item.price,
        itemTotal: item.price,
      };
      setCartItems([...cartItems, newCartItem]);
    }
    showToast(`Added ${item.name} to your tray!`);
  };

  const handleAddToCartCustomized = (cartItem: CartItem) => {
    setCartItems([...cartItems, cartItem]);
    showToast(`Added ${cartItem.name} with custom options to tray!`);
  };

  const handleUpdateQuantity = (cartLineId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartLineId === cartLineId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: nextQty,
              itemTotal: nextQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (cartLineId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartLineId !== cartLineId));
  };

  // Order Handlers
  const handleOrderCreated = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
    setCartItems([]); // Clear cart
    setIsCartOpen(false);
    setActiveTrackingOrder(newOrder); // Open live tracker immediately!
    showToast(`Order ${newOrder.orderNumber} confirmed & sent to kitchen!`);
  };

  const handleReorder = (order: Order) => {
    setCartItems([...cartItems, ...order.items]);
    setIsMyOrdersOpen(false);
    if (activeTrackingOrder) setActiveTrackingOrder(null);
    setIsCartOpen(true);
    showToast(`Reloaded ${order.items.length} items from ${order.orderNumber} into tray!`);
  };

  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let label = '';
        let description = '';

        if (nextStatus === 'in_kitchen') {
          label = 'Cooking in Kitchen';
          description = 'Head chef accepted order and has begun meal preparation.';
        } else if (nextStatus === 'out_for_delivery') {
          label = 'Out for Delivery';
          description = 'Rider has picked up the thermal package and is en route.';
        } else if (nextStatus === 'delivered') {
          label = 'Delivered & Completed';
          description = 'Meal handed over to customer.';
        }

        return {
          ...o,
          status: nextStatus,
          statusHistory: [
            ...o.statusHistory,
            {
              status: nextStatus,
              timestamp: timeString,
              label,
              description,
            },
          ],
        };
      }
      return o;
    });

    setOrders(updated);

    // If customer is currently tracking this order, update live state
    if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
      const found = updated.find((o) => o.id === orderId);
      if (found) setActiveTrackingOrder(found);
    }
  };

  // Menu Stock and Price Management Handlers
  const handleToggleMenuItemStock = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, inStock: !item.inStock } : item))
    );
  };

  const handleUpdateMenuItemPrice = (itemId: string, newPrice: number) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, price: newPrice } : item))
    );
  };

  const handleUpdateDeliveryZoneFee = (zoneId: string, newFee: number) => {
    setDeliveryZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, fee: newFee } : z))
    );
  };

  const handleUpdateStoreSettings = (partial: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...partial }));
  };

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1816]">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1816] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-stone-700 animate-in slide-in-from-bottom-5 duration-200">
          <span className="text-lg">🍲</span>
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Main Header with Cart, Orders, and Role Switcher */}
      <Header
        storeSettings={storeSettings}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenMyOrders={() => setIsMyOrdersOpen(true)}
        onToggleAdmin={() => setIsAdminView(!isAdminView)}
        isAdminView={isAdminView}
        activeOrdersCount={activeOrdersCount}
      />

      {/* Operating Hours and In-Rush Pause Banner */}
      <OperatingHoursBanner storeSettings={storeSettings} />

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 w-full">
        {isAdminView ? (
          /* Admin / Kitchen Staff Portal */
          <AdminDashboard
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            menuItems={menuItems}
            onToggleMenuItemStock={handleToggleMenuItemStock}
            onUpdateMenuItemPrice={handleUpdateMenuItemPrice}
            deliveryZones={deliveryZones}
            onUpdateDeliveryZoneFee={handleUpdateDeliveryZoneFee}
            storeSettings={storeSettings}
            onUpdateStoreSettings={handleUpdateStoreSettings}
            onBackToCustomer={() => setIsAdminView(false)}
          />
        ) : (
          /* Customer Ordering App */
          <div className="space-y-8">
            {/* Hero Banner with Authentic Nigerian Warmth */}
            <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#2D1606] via-[#1F1004] to-[#120701] text-white p-6 sm:p-10 shadow-xl border border-stone-800">
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 bg-[#E25822]/30 border border-[#E25822]/50 text-orange-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                  <Flame className="w-3.5 h-3.5 text-[#E25822]" />
                  <span>The Real Taste of Lagos</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight leading-tight">
                  Hot Nigerian Meals, <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-[#E25822]">
                    Cooked Fresh & Delivered Fast.
                  </span>
                </h1>

                <p className="text-stone-300 text-sm sm:text-base font-medium leading-relaxed">
                  Firewood smoky party jollof, silky amala with gbegiri & ewedu, rich seafood okro, and peppered goat meat. Upfront pre-payment guarantees prompt kitchen preparation and dispatch.
                </p>

                {/* 3 Quick Value Badges */}
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-300">
                  <div className="flex items-center gap-1.5">
                    <Bike className="w-4 h-4 text-amber-400" />
                    <span>Zone-based Lagos dispatch</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>100% Pre-Paid via Paystack</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ChefHat className="w-4 h-4 text-orange-400" />
                    <span>Live kitchen status tracking</span>
                  </div>
                </div>
              </div>

              {/* Decorative culinary glow */}
              <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#E25822]/15 blur-3xl pointer-events-none" />
              <div className="absolute top-0 right-1/4 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
            </section>

            {/* Menu Catalog Component */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-heading">
                    Explore Today's Kitchen Menu
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 font-medium">
                    Select swallows, proteins & extra sides before adding to tray
                  </p>
                </div>

                {activeOrdersCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsMyOrdersOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-orange-100 text-orange-950 text-xs font-bold hover:bg-orange-200 transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#E25822] animate-ping" />
                    <span>Track Active Meal</span>
                  </button>
                )}
              </div>

              <MenuCatalog
                menuItems={menuItems}
                onAddToCartDirect={handleAddToCartDirect}
                onAddToCartCustomized={handleAddToCartCustomized}
              />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-16 py-8 px-4 sm:px-8 text-stone-600 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-stone-950 font-heading">
              Food<span className="text-[#E25822]">Deck</span>
            </span>
            <span className="text-stone-400">|</span>
            <span>Authentic Nigerian Cuisine Ordering & Live Kitchen Portal</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsAdminView(!isAdminView)}
              className="text-stone-500 hover:text-stone-900 font-semibold"
            >
              {isAdminView ? 'Switch to Customer View' : 'Staff / Kitchen Admin'}
            </button>
            <span>•</span>
            <span className="text-stone-400">Target Market: Nigeria (WAT)</span>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        deliveryType={deliveryType}
        onSetDeliveryType={setDeliveryType}
        deliveryZones={deliveryZones}
        selectedZone={selectedZone}
        onSelectZone={setSelectedZone}
        deliveryInstructions={deliveryInstructions}
        onSetDeliveryInstructions={setDeliveryInstructions}
        storeSettings={storeSettings}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal (Paystack Pre-Payment Verification) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        deliveryType={deliveryType}
        deliveryZone={selectedZone}
        deliveryInstructions={deliveryInstructions}
        packagingFee={storeSettings.packagingFee}
        onOrderCreated={handleOrderCreated}
      />

      {/* Order Tracker Modal (Live 4-Stage Tracker with WhatsApp Rider Button) */}
      <OrderTrackerModal
        order={activeTrackingOrder}
        onClose={() => setActiveTrackingOrder(null)}
        onReorder={handleReorder}
      />

      {/* My Orders Modal (Receipts & Quick Re-Order) */}
      <MyOrdersModal
        isOpen={isMyOrdersOpen}
        onClose={() => setIsMyOrdersOpen(false)}
        orders={orders}
        onSelectOrderToTrack={(order) => {
          setIsMyOrdersOpen(false);
          setActiveTrackingOrder(order);
        }}
        onReorder={handleReorder}
      />
    </div>
  );
}
