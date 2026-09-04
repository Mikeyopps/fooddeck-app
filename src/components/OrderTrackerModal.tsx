import React from 'react';
import { X, CheckCircle2, Clock, ChefHat, Bike, Home, Phone, MessageCircle, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatNaira, getStatusConfig } from '../utils/helpers';

interface OrderTrackerModalProps {
  order: Order | null;
  onClose: () => void;
  onReorder?: (order: Order) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order,
  onClose,
  onReorder,
}) => {
  if (!order) return null;

  const statusConfig = getStatusConfig(order.status);

  // Stepper stages definition
  const stages: {
    status: OrderStatus;
    title: string;
    icon: React.ReactNode;
    subtitle: string;
  }[] = [
    {
      status: 'payment_confirmed',
      title: 'Payment Confirmed',
      icon: <ShieldCheck className="w-5 h-5" />,
      subtitle: 'Upfront payment verified via Paystack',
    },
    {
      status: 'in_kitchen',
      title: 'In the Kitchen',
      icon: <ChefHat className="w-5 h-5" />,
      subtitle: 'Chef is steaming swallow & packaging meals',
    },
    {
      status: 'out_for_delivery',
      title: order.deliveryType === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup',
      icon: <Bike className="w-5 h-5" />,
      subtitle: order.deliveryType === 'delivery' ? 'Dispatch rider is navigating with warm packs' : 'Ready at front desk',
    },
    {
      status: 'delivered',
      title: order.deliveryType === 'delivery' ? 'Delivered & Enjoyed' : 'Picked Up',
      icon: <Home className="w-5 h-5" />,
      subtitle: 'Meal successfully handed over',
    },
  ];

  const currentStageIndex = stages.findIndex((s) => s.status === order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Tracker Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-stone-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-stone-950 font-heading">
                Order {order.orderNumber}
              </span>
              <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${statusConfig.badge}`}>
                {statusConfig.label}
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Placed {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Ref: {order.paymentReference}
            </p>
          </div>

          <button
            id="close-order-tracker-btn"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tracker Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-stone-800">
          {/* Estimated Arrival Countdown Banner */}
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-2xl p-4 sm:p-5 shadow-md flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Estimated Delivery Countdown
                </span>
                <div className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
                  ~ {order.estimatedArrivalMinutes} Minutes
                </div>
                <p className="text-xs text-stone-300">
                  {order.deliveryType === 'delivery'
                    ? `Dispatching to ${order.deliveryZone?.name || 'your location'}`
                    : 'Awaiting pickup at FoodDeck Central counter'}
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-amber-300">
                {order.status === 'in_kitchen' ? (
                  <ChefHat className="w-6 h-6 animate-pulse" />
                ) : (
                  <Bike className="w-6 h-6 animate-bounce" />
                )}
              </div>
            </div>
          )}

          {/* 4-Stage Stepper Progress */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 space-y-4 shadow-2xs">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-400">
              Live Fulfillment Progress
            </h4>

            <div className="space-y-4 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
              {stages.map((stage, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div key={stage.status} className="relative flex items-start gap-4">
                    {/* Stepper Dot */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 z-10 transition-colors shadow-xs ${
                        isCurrent
                          ? 'bg-[#E25822] text-white ring-4 ring-orange-100'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-100 text-stone-400 border border-stone-200'
                      }`}
                    >
                      {isPassed && !isCurrent ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        stage.icon
                      )}
                    </div>

                    {/* Stepper text */}
                    <div className="pt-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h5
                          className={`text-sm font-extrabold font-heading ${
                            isCurrent
                              ? 'text-[#E25822]'
                              : isPassed
                              ? 'text-stone-900'
                              : 'text-stone-400'
                          }`}
                        >
                          {stage.title}
                        </h5>
                        {isCurrent && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E25822] bg-orange-50 px-2 py-0.5 rounded-full animate-pulse">
                            Active Now
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">{stage.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Driver Contact Box (when Out for Delivery or In Kitchen with rider assigned) */}
          {order.riderInfo && order.deliveryType === 'delivery' && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-stone-400">
                  Assigned Dispatch Rider
                </span>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {order.riderInfo.bikeNumber}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center font-bold text-stone-700">
                    🛵
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-stone-900">{order.riderInfo.name}</h5>
                    <p className="text-xs text-stone-500 font-mono">{order.riderInfo.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${order.riderInfo.phone}`}
                    className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors flex items-center justify-center"
                    title="Call Rider"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  {order.riderInfo.whatsappUrl && (
                    <a
                      href={order.riderInfo.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Delivery Destination / Pickup Address */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 space-y-2 text-xs">
            <div className="flex items-center justify-between text-stone-500 font-bold uppercase tracking-wider text-[10px]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#E25822]" />
                {order.deliveryType === 'delivery' ? 'Drop-off Address' : 'Pickup Desk'}
              </span>
              <span>{order.customerPhone}</span>
            </div>
            <p className="font-semibold text-stone-900 text-sm">{order.deliveryAddress}</p>
            {order.specialInstructions && (
              <p className="text-stone-500 italic bg-stone-50 p-2 rounded-lg border border-stone-100">
                Notes: "{order.specialInstructions}"
              </p>
            )}
          </div>

          {/* Meal Items Summary */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-400">
              Items Prepared ({order.items.length})
            </h4>

            <div className="space-y-2.5 divide-y divide-stone-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="pt-2.5 first:pt-0 flex justify-between items-start text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-stone-900">
                      {item.quantity}x {item.name}
                    </div>
                    {item.selectedSwallow && (
                      <div className="text-stone-500 text-[11px]">
                        Swallow: <span className="text-stone-800 font-medium">{item.selectedSwallow.name}</span>
                      </div>
                    )}
                    {item.selectedProtein && (
                      <div className="text-stone-500 text-[11px]">
                        Protein: <span className="text-stone-800 font-medium">{item.selectedProtein.name}</span>
                      </div>
                    )}
                    {item.selectedSides && item.selectedSides.length > 0 && (
                      <div className="text-stone-500 text-[11px]">
                        Sides: <span className="text-stone-800 font-medium">{item.selectedSides.map(s => s.name).join(', ')}</span>
                      </div>
                    )}
                  </div>
                  <span className="font-black text-stone-900 font-heading">
                    {formatNaira(item.itemTotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="pt-3 border-t border-stone-200 space-y-1 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal:</span>
                <span className="font-semibold text-stone-800">{formatNaira(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Delivery:</span>
                <span className="font-semibold text-stone-800">
                  {order.deliveryFee > 0 ? formatNaira(order.deliveryFee) : 'FREE'}
                </span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Packaging:</span>
                <span className="font-semibold text-stone-800">{formatNaira(order.packagingFee)}</span>
              </div>
              <div className="flex justify-between text-stone-950 font-black pt-1 border-t border-stone-200 text-sm">
                <span>Paid Total:</span>
                <span className="text-[#E25822]">{formatNaira(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200 flex items-center justify-between gap-3">
          {onReorder && (
            <button
              type="button"
              onClick={() => onReorder(order)}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-extrabold text-xs transition-colors"
            >
              Re-Order Meal
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="ml-auto px-6 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-900 text-white font-extrabold text-xs transition-colors"
          >
            Done / Browse Menu
          </button>
        </div>
      </div>
    </div>
  );
};
