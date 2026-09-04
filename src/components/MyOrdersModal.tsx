import React, { useState } from 'react';
import { X, Clock, ArrowRight, RotateCcw, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';
import { Order } from '../types';
import { formatNaira, getStatusConfig } from '../utils/helpers';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onSelectOrderToTrack: (order: Order) => void;
  onReorder: (order: Order) => void;
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectOrderToTrack,
  onReorder,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const activeOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
  const pastOrders = orders.filter((o) => o.status === 'delivered' || o.status === 'cancelled');

  const displayedOrders = activeTab === 'active' ? activeOrders : pastOrders;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#E25822] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-stone-900 font-heading leading-tight">
                My Food Orders
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Track live kitchen preparation or reorder your favorites
              </p>
            </div>
          </div>

          <button
            id="close-my-orders-modal-btn"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-3 bg-stone-100 border-b border-stone-200 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'active'
                ? 'bg-white text-stone-950 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Active Ongoing</span>
            {activeOrders.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#E25822] text-white text-[11px] flex items-center justify-center font-extrabold">
                {activeOrders.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-white text-stone-950 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Past Receipts ({pastOrders.length})</span>
          </button>
        </div>

        {/* Orders List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5">
          {displayedOrders.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-2xl">
                {activeTab === 'active' ? '🛵' : '📋'}
              </div>
              <h4 className="font-bold text-stone-800 text-sm">
                {activeTab === 'active' ? 'No orders currently cooking' : 'No past order receipts yet'}
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                {activeTab === 'active'
                  ? 'Your newly placed orders will appear here with live kitchen status updates.'
                  : 'All your completed meal receipts will be saved here for instant 1-tap reordering.'}
              </p>
            </div>
          ) : (
            displayedOrders.map((order) => {
              const statusCfg = getStatusConfig(order.status);
              const isOngoing = order.status !== 'delivered' && order.status !== 'cancelled';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs hover:border-orange-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-stone-900 font-heading">
                          {order.orderNumber}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${statusCfg.badge}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 font-medium mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <span className="font-black text-base text-[#E25822] font-heading">
                      {formatNaira(order.total)}
                    </span>
                  </div>

                  {/* Summary of Items */}
                  <div className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-xl space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          {item.quantity}x {item.name}
                          {item.selectedProtein ? ` (${item.selectedProtein.name})` : ''}
                        </span>
                        <span className="font-semibold text-stone-900">{formatNaira(item.itemTotal)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => onSelectOrderToTrack(order)}
                      className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <span>{isOngoing ? 'Track Live Kitchen Status' : 'View Full Receipt'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onReorder(order)}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-orange-50 hover:text-[#E25822] hover:border-orange-300 font-extrabold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-Order</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
