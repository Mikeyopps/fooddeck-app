import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Landmark, Smartphone, CheckCircle, Copy, Loader2, ArrowRight } from 'lucide-react';
import { CartItem, DeliveryZone, Order, StatusUpdate } from '../types';
import { formatNaira, playKitchenChime } from '../utils/helpers';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  deliveryType: 'delivery' | 'pickup';
  deliveryZone: DeliveryZone;
  deliveryInstructions: string;
  packagingFee: number;
  onOrderCreated: (newOrder: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  deliveryType,
  deliveryZone,
  deliveryInstructions,
  packagingFee,
  onOrderCreated,
}) => {
  if (!isOpen) return null;

  // Step 1: Customer Details | Step 2: Paystack Gateway Simulation | Step 3: Success
  const [currentStep, setCurrentStep] = useState<'details' | 'payment' | 'verifying'>('details');

  // Customer form state
  const [customerName, setCustomerName] = useState('Tunde Adeleke');
  const [customerPhone, setCustomerPhone] = useState('+234 803 456 7890');
  const [customerEmail, setCustomerEmail] = useState('tunde.adeleke@gmail.com');
  const [deliveryAddress, setDeliveryAddress] = useState(
    deliveryType === 'delivery' ? 'Flat 3, 14 Admiralty Way, Lekki Phase 1, Lagos' : ''
  );

  // Payment tab state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer' | 'ussd'>('card');
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Card inputs
  const [cardNumber, setCardNumber] = useState('5399 4120 8821 7364');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('482');

  // USSD bank selection
  const [selectedBankUssd, setSelectedBankUssd] = useState('*737# (GTBank)');

  // Financial calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);
  const deliveryFee = deliveryType === 'delivery' ? deliveryZone.fee : 0;
  const grandTotal = subtotal + deliveryFee + packagingFee;

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText('9948210452');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const handleSimulatePayment = () => {
    setCurrentStep('verifying');

    // Simulate Paystack webhook / verification delay (1.8 seconds)
    setTimeout(() => {
      // Play cheerful kitchen notification chime
      playKitchenChime();

      const orderNumber = '#FD-' + Math.floor(1000 + Math.random() * 9000);
      const referenceId =
        (paymentMethod === 'card' ? 'PAY_CARD_' : paymentMethod === 'bank_transfer' ? 'TRF_WEMA_' : 'USSD_') +
        Math.random().toString(36).substring(2, 9).toUpperCase();

      const now = new Date();
      const initialHistory: StatusUpdate[] = [
        {
          status: 'payment_confirmed',
          timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          label: 'Pre-Payment Verified',
          description: `Payment of ${formatNaira(grandTotal)} received and verified via Paystack gateway (${paymentMethod}).`,
        },
      ];

      const newOrder: Order = {
        id: 'ord-' + Date.now(),
        orderNumber,
        createdAt: now.toISOString(),
        deliveryType,
        deliveryZone: deliveryType === 'delivery' ? deliveryZone : undefined,
        deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : 'FoodDeck Central Kitchen (Pickup Desk)',
        customerName: customerName.trim() || 'Valued Customer',
        customerPhone: customerPhone.trim() || '+234 800 000 0000',
        customerEmail: customerEmail.trim() || 'customer@fooddeck.ng',
        specialInstructions: deliveryInstructions || undefined,
        items: cartItems,
        subtotal,
        deliveryFee,
        packagingFee,
        total: grandTotal,
        paymentMethod,
        paymentReference: referenceId,
        status: 'payment_confirmed',
        statusHistory: initialHistory,
        estimatedArrivalMinutes: 35,
        riderInfo:
          deliveryType === 'delivery'
            ? {
                name: 'Kazeem Oladipo',
                phone: '+234 814 555 8921',
                bikeNumber: 'KJA-512-AB (Express Box)',
                whatsappUrl: `https://wa.me/2348145558921?text=Hello%20Kazeem,%20regarding%20my%20FoodDeck%20order%20${orderNumber}`,
              }
            : undefined,
      };

      onOrderCreated(newOrder);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#E25822] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-stone-900 font-heading leading-tight">
                {currentStep === 'details' ? 'Delivery & Contact Details' : 'Secure Pre-Payment (Paystack)'}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                {currentStep === 'details'
                  ? 'Step 1 of 2: Who are we cooking for?'
                  : `Amount Payable: ${formatNaira(grandTotal)}`}
              </p>
            </div>
          </div>

          <button
            id="close-checkout-modal-btn"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 text-stone-800">
          {/* Verifying Spinner Screen */}
          {currentStep === 'verifying' ? (
            <div className="py-12 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <Loader2 className="w-16 h-16 text-[#E25822] animate-spin" />
                <ShieldCheck className="w-7 h-7 text-stone-900 absolute" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-lg text-stone-900 font-heading">
                  Verifying Upfront Payment...
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Confirming transaction with the banking switch. As soon as payment settles, the kitchen starts cooking!
                </p>
              </div>
            </div>
          ) : currentStep === 'details' ? (
            /* Step 1: Customer details form */
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-stone-700 uppercase tracking-wider block">
                  Full Name <span className="text-[#E25822]">*</span>
                </label>
                <input
                  id="checkout-name-input"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Tunde Adeleke"
                  className="w-full text-sm p-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E25822]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-stone-700 uppercase tracking-wider block">
                    Phone Number (WhatsApp) <span className="text-[#E25822]">*</span>
                  </label>
                  <input
                    id="checkout-phone-input"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+234 80..."
                    className="w-full text-sm p-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E25822]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-stone-700 uppercase tracking-wider block">
                    Email Address <span className="text-[#E25822]">*</span>
                  </label>
                  <input
                    id="checkout-email-input"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full text-sm p-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E25822]"
                  />
                </div>
              </div>

              {deliveryType === 'delivery' ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-stone-700 uppercase tracking-wider block">
                      Delivery Street Address & Landmark <span className="text-[#E25822]">*</span>
                    </label>
                    <span className="text-xs font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded">
                      {deliveryZone.name}
                    </span>
                  </div>
                  <textarea
                    id="checkout-address-input"
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="House/Apartment number, street name, nearest landmark..."
                    className="w-full text-sm p-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E25822]"
                  />
                </div>
              ) : (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <span className="font-bold block">🏪 Self Pickup Counter:</span>
                  <p>
                    FoodDeck Central Hub: 12 Admiralty Way, Lekki Phase 1, Lagos. Your meal will be packaged and ready for pickup at our dispatch desk.
                  </p>
                </div>
              )}

              {/* Order Quick Review Card */}
              <div className="bg-stone-100/90 rounded-xl p-3 text-xs space-y-1.5 border border-stone-200/80">
                <div className="flex justify-between font-semibold text-stone-600">
                  <span>Dishes ({cartItems.length})</span>
                  <span>{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between font-semibold text-stone-600">
                  <span>Delivery ({deliveryType === 'delivery' ? deliveryZone.name : 'Pickup'})</span>
                  <span>{deliveryFee > 0 ? formatNaira(deliveryFee) : 'FREE'}</span>
                </div>
                <div className="flex justify-between font-semibold text-stone-600">
                  <span>Packaging & Seal</span>
                  <span>{formatNaira(packagingFee)}</span>
                </div>
                <div className="flex justify-between font-black text-stone-900 pt-1 border-t border-stone-200 text-sm">
                  <span>Total Due</span>
                  <span className="text-[#E25822]">{formatNaira(grandTotal)}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Step 2: Payment Gateway Tabbed Interface */
            <div className="space-y-4">
              {/* Payment Method Switcher */}
              <div className="grid grid-cols-3 gap-2 bg-stone-100 p-1.5 rounded-xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'card'
                      ? 'bg-white text-stone-950 shadow-xs border border-stone-200'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#E25822]" />
                  <span>Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'bank_transfer'
                      ? 'bg-white text-stone-950 shadow-xs border border-stone-200'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Landmark className="w-4 h-4 text-emerald-600" />
                  <span>Bank Transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('ussd')}
                  className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'ussd'
                      ? 'bg-white text-stone-950 shadow-xs border border-stone-200'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>USSD Code</span>
                </button>
              </div>

              {/* Tab 1: Card Form */}
              {paymentMethod === 'card' && (
                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-stone-600 uppercase tracking-wider">
                      Mastercard / Visa / Verve
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3" /> PCI-DSS Encrypted
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-500 uppercase">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full text-sm font-mono p-2.5 rounded-lg bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E25822]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-stone-500 uppercase">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full text-sm font-mono p-2.5 rounded-lg bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E25822]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-stone-500 uppercase">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full text-sm font-mono p-2.5 rounded-lg bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E25822]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Bank Transfer (Dedicated Virtual Account) */}
              {paymentMethod === 'bank_transfer' && (
                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3.5 shadow-2xs">
                  <div className="text-center space-y-1 pb-1">
                    <span className="text-xs font-semibold text-stone-500">
                      Transfer exact amount to dynamic dedicated account:
                    </span>
                    <div className="text-2xl font-black text-stone-900 font-heading">
                      {formatNaira(grandTotal)}
                    </div>
                  </div>

                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">Bank Name:</span>
                      <span className="font-extrabold text-stone-900">Wema Bank / Paystack-FoodDeck</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">Account Number:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-black text-stone-900">9948210452</span>
                        <button
                          type="button"
                          onClick={handleCopyAccount}
                          className="px-2 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded text-[10px] font-bold flex items-center gap-1 transition-colors"
                        >
                          {copiedAccount ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          {copiedAccount ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">Beneficiary:</span>
                      <span className="font-bold text-stone-800">FoodDeck Central Kitchen</span>
                    </div>

                    <div className="flex justify-between items-center text-amber-700 font-medium">
                      <span>Account validity:</span>
                      <span>Expires in 29:45 mins</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 text-center">
                    Automatic confirmation: as soon as you transfer from your bank app, tap the confirmation button below.
                  </p>
                </div>
              )}

              {/* Tab 3: USSD */}
              {paymentMethod === 'ussd' && (
                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3.5 shadow-2xs">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-600 uppercase">Choose Your Nigerian Bank</label>
                    <select
                      value={selectedBankUssd}
                      onChange={(e) => setSelectedBankUssd(e.target.value)}
                      className="w-full text-xs sm:text-sm font-semibold p-2.5 rounded-lg bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E25822]"
                    >
                      <option value="*737# (GTBank)">GTBank (*737#)</option>
                      <option value="*966# (Zenith Bank)">Zenith Bank (*966#)</option>
                      <option value="*901# (Access Bank)">Access Bank (*901#)</option>
                      <option value="*919# (UBA)">UBA (*919#)</option>
                      <option value="*894# (First Bank)">First Bank (*894#)</option>
                      <option value="*822# (Sterling Bank)">Sterling Bank (*822#)</option>
                    </select>
                  </div>

                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center space-y-1">
                    <span className="text-xs text-amber-900 font-semibold block">Dial this code on your registered SIM:</span>
                    <div className="text-lg font-mono font-black text-amber-950 select-all">
                      *737*2*{grandTotal}*9482#
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        {currentStep !== 'verifying' && (
          <div className="p-4 sm:p-5 bg-white border-t border-stone-200 flex items-center justify-between gap-3">
            {currentStep === 'details' ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  Back to Tray
                </button>

                <button
                  id="checkout-proceed-to-payment-btn"
                  type="button"
                  onClick={() => setCurrentStep('payment')}
                  disabled={!customerName.trim() || !customerPhone.trim() || (deliveryType === 'delivery' && !deliveryAddress.trim())}
                  className="px-6 py-3 rounded-xl bg-[#E25822] hover:bg-[#C94716] text-white font-extrabold text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentStep('details')}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  Back to Details
                </button>

                <button
                  id="checkout-complete-payment-btn"
                  type="button"
                  onClick={handleSimulatePayment}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {paymentMethod === 'bank_transfer'
                      ? `I Have Sent ${formatNaira(grandTotal)}`
                      : `Pay ${formatNaira(grandTotal)} Now`}
                  </span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
