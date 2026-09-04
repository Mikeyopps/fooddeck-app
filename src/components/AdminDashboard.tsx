import React, { useState } from 'react';
import {
  ChefHat,
  Bell,
  Volume2,
  Clock,
  Printer,
  CheckCircle2,
  Bike,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  Plus,
  Edit2,
  DollarSign,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { Order, OrderStatus, MenuItem, DeliveryZone, StoreSettings, StatusUpdate } from '../types';
import { formatNaira, getStatusConfig, playKitchenChime } from '../utils/helpers';
import { ThermalReceiptModal } from './ThermalReceiptModal';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  menuItems: MenuItem[];
  onToggleMenuItemStock: (itemId: string) => void;
  onUpdateMenuItemPrice: (itemId: string, newPrice: number) => void;
  deliveryZones: DeliveryZone[];
  onUpdateDeliveryZoneFee: (zoneId: string, newFee: number) => void;
  storeSettings: StoreSettings;
  onUpdateStoreSettings: (newSettings: Partial<StoreSettings>) => void;
  onBackToCustomer: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
  menuItems,
  onToggleMenuItemStock,
  onUpdateMenuItemPrice,
  deliveryZones,
  onUpdateDeliveryZoneFee,
  storeSettings,
  onUpdateStoreSettings,
  onBackToCustomer,
}) => {
  // Navigation tabs in Admin
  const [activeAdminTab, setActiveAdminTab] = useState<'queue' | 'menu' | 'zones' | 'settings'>('queue');
  const [queueFilter, setQueueFilter] = useState<'all' | 'pending' | 'kitchen' | 'dispatch' | 'completed'>('all');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  // Quick stats calculation
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const activeKitchenOrders = orders.filter((o) => o.status === 'in_kitchen');
  const pendingOrders = orders.filter((o) => o.status === 'payment_confirmed');
  const outOrders = orders.filter((o) => o.status === 'out_for_delivery');
  const completedOrders = orders.filter((o) => o.status === 'delivered');

  // Filter orders for the queue
  const filteredOrders = orders.filter((order) => {
    if (queueFilter === 'pending') return order.status === 'payment_confirmed';
    if (queueFilter === 'kitchen') return order.status === 'in_kitchen';
    if (queueFilter === 'dispatch') return order.status === 'out_for_delivery';
    if (queueFilter === 'completed') return order.status === 'delivered';
    return true; // 'all'
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Admin Top Dashboard Bar */}
      <div className="bg-[#1A1816] text-white rounded-2xl p-4 sm:p-6 shadow-lg border border-stone-800 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E25822] text-white flex items-center justify-center font-black text-xl shadow-md">
              <ChefHat className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
                  Kitchen Command Portal
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-400 text-stone-950 px-2 py-0.5 rounded">
                  Manager Chioma
                </span>
              </div>
              <p className="text-xs text-stone-400 font-medium">
                Live order queue, real-time status switches, stock toggles & kitchen pause
              </p>
            </div>
          </div>

          {/* Quick Actions / Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Test Audio Alert Button */}
            <button
              id="admin-test-chime-btn"
              type="button"
              onClick={() => playKitchenChime()}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors flex items-center gap-1.5 border border-stone-700"
              title="Test new order alert sound"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>Test Alert Chime</span>
            </button>

            {/* Emergency Kitchen Pause Switch */}
            <button
              id="admin-toggle-pause-btn"
              type="button"
              onClick={() => onUpdateStoreSettings({ manualPause: !storeSettings.manualPause })}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-xs ${
                storeSettings.manualPause
                  ? 'bg-amber-400 text-stone-950 hover:bg-amber-300'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border border-stone-700'
              }`}
            >
              <AlertTriangle className={`w-4 h-4 ${storeSettings.manualPause ? 'text-stone-950' : 'text-amber-400'}`} />
              <span>{storeSettings.manualPause ? 'Orders Paused (Resume)' : 'Pause Orders (Busy)'}</span>
            </button>

            {/* Back to Customer view */}
            <button
              type="button"
              onClick={onBackToCustomer}
              className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-white text-stone-950 text-xs font-extrabold transition-all"
            >
              Customer View &rarr;
            </button>
          </div>
        </div>

        {/* 4 Financial & Operational KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-stone-800">
          <div className="bg-stone-900/90 p-3 rounded-xl border border-stone-800/80 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Total Sales</span>
            <div className="text-xl font-black text-amber-400 font-heading">
              {formatNaira(totalRevenue)}
            </div>
            <span className="text-[10px] text-stone-500 font-medium">100% Pre-Paid via Paystack</span>
          </div>

          <div className="bg-stone-900/90 p-3 rounded-xl border border-stone-800/80 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">New Paid Waiting</span>
            <div className="text-xl font-black text-white font-heading flex items-center gap-1.5">
              <span>{pendingOrders.length}</span>
              {pendingOrders.length > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              )}
            </div>
            <span className="text-[10px] text-amber-400 font-medium">Needs Chef confirmation</span>
          </div>

          <div className="bg-stone-900/90 p-3 rounded-xl border border-stone-800/80 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Cooking In Kitchen</span>
            <div className="text-xl font-black text-orange-400 font-heading">
              {activeKitchenOrders.length}
            </div>
            <span className="text-[10px] text-stone-500 font-medium">Active prep & packing</span>
          </div>

          <div className="bg-stone-900/90 p-3 rounded-xl border border-stone-800/80 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Delivered Today</span>
            <div className="text-xl font-black text-emerald-400 font-heading">
              {completedOrders.length}
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">Fulfillment rate: 100%</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200 shadow-2xs flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setActiveAdminTab('queue')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
            activeAdminTab === 'queue'
              ? 'bg-[#E25822] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Live Order Queue ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminTab('menu')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
            activeAdminTab === 'menu'
              ? 'bg-[#E25822] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <ChefHat className="w-4 h-4" />
          <span>Menu & Stock Manager ({menuItems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminTab('zones')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
            activeAdminTab === 'zones'
              ? 'bg-[#E25822] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Delivery Zones ({deliveryZones.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
            activeAdminTab === 'settings'
              ? 'bg-[#E25822] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Operating Hours & Store Status</span>
        </button>
      </div>

      {/* TAB 1: Live Order Queue */}
      {activeAdminTab === 'queue' && (
        <div className="space-y-4">
          {/* Filter Pills for Queue */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setQueueFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                queueFilter === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setQueueFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                queueFilter === 'pending'
                  ? 'bg-amber-500 text-stone-950'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              🟡 New Paid ({pendingOrders.length})
            </button>
            <button
              type="button"
              onClick={() => setQueueFilter('kitchen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                queueFilter === 'kitchen'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              🟠 In Kitchen ({activeKitchenOrders.length})
            </button>
            <button
              type="button"
              onClick={() => setQueueFilter('dispatch')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                queueFilter === 'dispatch'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              🔵 Out for Delivery ({outOrders.length})
            </button>
            <button
              type="button"
              onClick={() => setQueueFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                queueFilter === 'completed'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              🟢 Delivered ({completedOrders.length})
            </button>
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredOrders.map((order) => {
              const statusCfg = getStatusConfig(order.status);

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border shadow-2xs space-y-4 transition-all ${
                    order.status === 'payment_confirmed'
                      ? 'border-amber-300 ring-2 ring-amber-200/50 bg-amber-50/20'
                      : order.status === 'in_kitchen'
                      ? 'border-orange-300 bg-orange-50/15'
                      : 'border-stone-200'
                  }`}
                >
                  {/* Order Top Meta */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-stone-900 font-heading">
                          {order.orderNumber}
                        </span>
                        <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${statusCfg.badge}`}>
                          {statusCfg.label}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                          {order.deliveryType}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 font-medium mt-1">
                        Placed {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Pay Ref: {order.paymentReference}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-base sm:text-lg font-black text-[#E25822] font-heading block">
                        {formatNaira(order.total)}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        100% PRE-PAID
                      </span>
                    </div>
                  </div>

                  {/* Customer Information Box */}
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-stone-900">
                      <span>{order.customerName}</span>
                      <a href={`tel:${order.customerPhone}`} className="text-[#E25822] font-mono hover:underline">
                        {order.customerPhone}
                      </a>
                    </div>
                    <div className="text-stone-600 font-medium">
                      <span className="text-stone-400">Destination:</span>{' '}
                      {order.deliveryType === 'delivery'
                        ? `${order.deliveryAddress} (${order.deliveryZone?.name})`
                        : '🏪 Central Pickup Desk (12 Admiralty Way, Lekki 1)'}
                    </div>
                    {order.specialInstructions && (
                      <div className="text-red-700 font-bold italic bg-white p-2 rounded border border-red-200 mt-1">
                        ⚠️ Special Instruction: "{order.specialInstructions}"
                      </div>
                    )}
                  </div>

                  {/* Line Items for Chef */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 block">
                      Cooking & Assembly Checklist:
                    </span>
                    <div className="space-y-2 divide-y divide-stone-100 text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="pt-2 first:pt-0 space-y-1">
                          <div className="flex justify-between font-black text-stone-900 text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span>{formatNaira(item.itemTotal)}</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {item.selectedSwallow && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-bold">
                                🥣 Swallow: {item.selectedSwallow.name}
                              </span>
                            )}
                            {item.selectedProtein && (
                              <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-900 text-[11px] font-bold">
                                🥩 Protein: {item.selectedProtein.name}
                              </span>
                            )}
                            {item.selectedSides && item.selectedSides.map((s, sIdx) => (
                              <span key={sIdx} className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[11px] font-bold">
                                🥟 Side: {s.name}
                              </span>
                            ))}
                          </div>

                          {item.specialInstructions && (
                            <div className="text-[11px] text-amber-900 font-semibold italic bg-amber-50 p-1 rounded">
                              Kitchen note: "{item.specialInstructions}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rider Contact if Out for Delivery */}
                  {order.riderInfo && order.status === 'out_for_delivery' && (
                    <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-blue-950 block">Rider: {order.riderInfo.name}</span>
                        <span className="text-blue-700 font-mono text-[11px]">{order.riderInfo.phone} ({order.riderInfo.bikeNumber})</span>
                      </div>
                      <a
                        href={`tel:${order.riderInfo.phone}`}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
                      >
                        Call Rider
                      </a>
                    </div>
                  )}

                  {/* Kitchen Actions Toolbar */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setSelectedReceiptOrder(order)}
                      className="px-3 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Print 80mm kitchen thermal slip"
                    >
                      <Printer className="w-3.5 h-3.5 text-stone-500" />
                      <span>Print Slip</span>
                    </button>

                    {/* Status State Machine Transitions */}
                    <div className="flex items-center gap-2">
                      {order.status === 'payment_confirmed' && (
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateOrderStatus(order.id, 'in_kitchen');
                            playKitchenChime();
                          }}
                          className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <ChefHat className="w-3.5 h-3.5" />
                          <span>Accept & Move to Kitchen</span>
                        </button>
                      )}

                      {order.status === 'in_kitchen' && (
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateOrderStatus(order.id, 'out_for_delivery');
                            playKitchenChime();
                          }}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <Bike className="w-3.5 h-3.5" />
                          <span>Dispatch / Out for Delivery</span>
                        </button>
                      )}

                      {order.status === 'out_for_delivery' && (
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateOrderStatus(order.id, 'delivered');
                            playKitchenChime();
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Delivered</span>
                        </button>
                      )}

                      {order.status === 'delivered' && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Menu & Stock Manager */}
      {activeAdminTab === 'menu' && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
            <div>
              <h3 className="text-lg font-extrabold text-stone-900 font-heading">
                Menu Catalog & Instant Stock Toggles
              </h3>
              <p className="text-xs text-stone-500">
                Marking an item "Sold Out" instantly prevents customer checkout while keeping prices transparent.
              </p>
            </div>
            <span className="text-xs font-bold bg-stone-100 text-stone-700 px-3 py-1.5 rounded-xl self-start">
              Total Menu Dishes: {menuItems.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Dish</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price (₦)</th>
                  <th className="py-3 px-3 text-center">In-Stock Status</th>
                  <th className="py-3 px-3 text-right">Quick Price Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {menuItems.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-stone-900">{item.name}</div>
                          <div className="text-[11px] text-stone-500 line-clamp-1">{item.nativeSubtitle}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="capitalize font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded text-xs">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-extrabold text-stone-950">
                      {formatNaira(item.price)}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleMenuItemStock(item.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          item.inStock
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {item.inStock ? '🟢 In Stock' : '🔴 Sold Out'}
                      </button>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1 justify-end">
                        <button
                          type="button"
                          onClick={() => onUpdateMenuItemPrice(item.id, Math.max(500, item.price - 200))}
                          className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center"
                          title="Reduce price ₦200"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateMenuItemPrice(item.id, item.price + 200)}
                          className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center"
                          title="Increase price ₦200"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Delivery Zones Manager */}
      {activeAdminTab === 'zones' && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-stone-200">
            <h3 className="text-lg font-extrabold text-stone-900 font-heading">
              Lagos Delivery Zones & Dynamic Dispatch Pricing
            </h3>
            <p className="text-xs text-stone-500">
              Update zone dispatch pricing based on rider logistics and traffic conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {deliveryZones.map((zone) => (
              <div
                key={zone.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-extrabold text-sm text-stone-900">{zone.name}</h5>
                    <span className="text-[11px] text-stone-500">{zone.state} • {zone.estimatedMinutes}</span>
                  </div>
                  <span className="font-black text-sm text-[#E25822]">
                    {formatNaira(zone.fee)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-xs">
                  <span className="text-stone-500 font-medium">Adjust Fee:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onUpdateDeliveryZoneFee(zone.id, Math.max(500, zone.fee - 100))}
                      className="px-2 py-1 bg-white border border-stone-300 rounded font-bold hover:bg-stone-100"
                    >
                      - ₦100
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateDeliveryZoneFee(zone.id, zone.fee + 100)}
                      className="px-2 py-1 bg-white border border-stone-300 rounded font-bold hover:bg-stone-100"
                    >
                      + ₦100
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Operating Hours & Store Settings */}
      {activeAdminTab === 'settings' && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-2xs space-y-5">
          <div className="pb-3 border-b border-stone-200">
            <h3 className="text-lg font-extrabold text-stone-900 font-heading">
              Store Schedule & Checkout Control
            </h3>
            <p className="text-xs text-stone-500">
              Control automatic opening hours, rush pause overrides, and banner messages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Master Store Status */}
            <div className="p-4 rounded-xl border border-stone-200 space-y-3">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                Master Store Status
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onUpdateStoreSettings({ isOpen: !storeSettings.isOpen })}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                    storeSettings.isOpen
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-300 text-stone-700'
                  }`}
                >
                  <span>{storeSettings.isOpen ? '🟢 STORE OPEN' : '🔴 STORE CLOSED'}</span>
                </button>
                <span className="text-xs text-stone-500">
                  {storeSettings.isOpen ? 'Accepting customer orders' : 'Customer checkout is disabled'}
                </span>
              </div>
            </div>

            {/* In-Rush Order Pause */}
            <div className="p-4 rounded-xl border border-stone-200 space-y-3">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                Kitchen Busy / Temporary Pause
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onUpdateStoreSettings({ manualPause: !storeSettings.manualPause })}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                    storeSettings.manualPause
                      ? 'bg-amber-400 text-stone-950'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{storeSettings.manualPause ? 'PAUSE ACTIVE' : 'NO PAUSE'}</span>
                </button>
                <span className="text-xs text-stone-500">
                  {storeSettings.manualPause ? 'Temporarily pauses incoming orders' : 'Normal queue flow'}
                </span>
              </div>
            </div>

            {/* Operating Times */}
            <div className="p-4 rounded-xl border border-stone-200 space-y-3">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                Daily Operating Schedule (WAT)
              </label>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-stone-500 block">Opens at:</span>
                  <input
                    type="time"
                    value={storeSettings.openingTime}
                    onChange={(e) => onUpdateStoreSettings({ openingTime: e.target.value })}
                    className="mt-1 font-bold p-2 bg-stone-50 border border-stone-200 rounded-lg w-full"
                  />
                </div>
                <div>
                  <span className="text-stone-500 block">Closes at:</span>
                  <input
                    type="time"
                    value={storeSettings.closingTime}
                    onChange={(e) => onUpdateStoreSettings({ closingTime: e.target.value })}
                    className="mt-1 font-bold p-2 bg-stone-50 border border-stone-200 rounded-lg w-full"
                  />
                </div>
              </div>
            </div>

            {/* Thermal Packaging Fee */}
            <div className="p-4 rounded-xl border border-stone-200 space-y-3">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                Thermal Packaging & Tamper Seal Fee (₦)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={storeSettings.packagingFee}
                  onChange={(e) => onUpdateStoreSettings({ packagingFee: Number(e.target.value) || 0 })}
                  className="font-bold text-sm p-2 bg-stone-50 border border-stone-200 rounded-lg w-32"
                />
                <span className="text-xs text-stone-500">Applied per checkout tray</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thermal receipt modal */}
      {selectedReceiptOrder && (
        <ThermalReceiptModal
          order={selectedReceiptOrder}
          onClose={() => setSelectedReceiptOrder(null)}
        />
      )}
    </div>
  );
};
