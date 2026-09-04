import React from 'react';
import { X, Printer } from 'lucide-react';
import { Order } from '../types';
import { formatNaira } from '../utils/helpers';

interface ThermalReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Modal Controls Header */}
        <div className="p-3.5 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-xs uppercase tracking-wider">
              80mm Kitchen Thermal Slip Preview
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Printable Slip Container */}
        <div className="p-6 overflow-y-auto flex-1 bg-stone-50 flex justify-center">
          {/* Exact 80mm Thermal Receipt Element */}
          <div
            id="thermal-receipt"
            className="bg-white p-5 border border-dashed border-stone-300 shadow-xs font-mono text-[12px] text-stone-900 w-[290px] space-y-3 leading-tight"
          >
            {/* Header */}
            <div className="text-center space-y-1">
              <h2 className="text-base font-black tracking-tighter">*** FOODDECK KITCHEN ***</h2>
              <p className="text-[10px]">12 Admiralty Way, Lekki 1, Lagos</p>
              <p className="text-[10px]">Tel: +234 800-FOODDECK</p>
              <div className="border-b border-dashed border-stone-400 my-2" />
            </div>

            {/* Order meta */}
            <div className="space-y-0.5">
              <div className="flex justify-between font-bold text-sm">
                <span>ORDER: {order.orderNumber}</span>
                <span className="uppercase">{order.deliveryType}</span>
              </div>
              <div className="text-[11px] text-stone-600">
                DATE: {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-[11px] text-stone-600">
                PAY REF: {order.paymentReference} ({order.paymentMethod.toUpperCase()})
              </div>
              <div className="text-[11px] text-stone-900 font-bold">
                PAYMENT: 100% PRE-PAID (VERIFIED)
              </div>
            </div>

            <div className="border-b border-dashed border-stone-400 my-2" />

            {/* Customer Details */}
            <div className="space-y-0.5">
              <div className="font-bold text-[11px]">CUSTOMER: {order.customerName}</div>
              <div className="text-[11px]">PHONE: {order.customerPhone}</div>
              <div className="text-[11px]">
                ZONE: {order.deliveryZone?.name || 'CENTRAL PICKUP'}
              </div>
              {order.deliveryAddress && (
                <div className="text-[11px] font-semibold">
                  DEST: {order.deliveryAddress}
                </div>
              )}
              {order.specialInstructions && (
                <div className="text-[10px] italic bg-stone-100 p-1 rounded border border-stone-300 mt-1">
                  NOTE: {order.specialInstructions}
                </div>
              )}
            </div>

            <div className="border-b border-dashed border-stone-400 my-2" />

            {/* Kitchen Items Breakdown */}
            <div className="space-y-2">
              <div className="font-bold text-[11px] uppercase tracking-wider">
                ITEMS TO PREPARE:
              </div>

              {order.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-black text-[13px]">
                    <span>{item.quantity}x {item.name}</span>
                    <span>{formatNaira(item.itemTotal)}</span>
                  </div>

                  {item.selectedSwallow && (
                    <div className="pl-3 text-[11px] text-stone-700 font-bold">
                      &gt; SWALLOW: {item.selectedSwallow.name}
                    </div>
                  )}

                  {item.selectedProtein && (
                    <div className="pl-3 text-[11px] text-stone-700 font-bold">
                      &gt; PROTEIN: {item.selectedProtein.name}
                    </div>
                  )}

                  {item.selectedSides && item.selectedSides.length > 0 && (
                    <div className="pl-3 text-[11px] text-stone-700">
                      &gt; SIDES: {item.selectedSides.map((s) => s.name).join(', ')}
                    </div>
                  )}

                  {item.specialInstructions && (
                    <div className="pl-3 text-[10px] text-red-600 font-bold">
                      * NOTE: {item.specialInstructions}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-b border-dashed border-stone-400 my-2" />

            {/* Financial summary */}
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span>{formatNaira(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>DELIVERY FEE:</span>
                <span>{order.deliveryFee > 0 ? formatNaira(order.deliveryFee) : 'FREE'}</span>
              </div>
              <div className="flex justify-between">
                <span>PACKAGING:</span>
                <span>{formatNaira(order.packagingFee)}</span>
              </div>
              <div className="flex justify-between font-black text-sm pt-1 border-t border-dashed border-stone-400">
                <span>TOTAL PAID:</span>
                <span>{formatNaira(order.total)}</span>
              </div>
            </div>

            <div className="border-b border-dashed border-stone-400 my-2" />

            {/* Footer barcode/sign */}
            <div className="text-center pt-1 space-y-1 text-[10px]">
              <div className="font-mono tracking-widest text-xs font-bold">
                ||| | |||| | ||| || ||||
              </div>
              <p>*** CHEF COPY - PACK WITH TAMPER SEAL ***</p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-3.5 bg-white border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50"
          >
            Close
          </button>

          <button
            id="print-thermal-slip-btn"
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-[#E25822] hover:bg-[#C94716] text-white font-extrabold text-xs flex items-center gap-2 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Thermal Slip (80mm)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
