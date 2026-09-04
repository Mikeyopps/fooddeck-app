import { OrderStatus, StoreSettings } from '../types';

/**
 * Format a number as Nigerian Naira (₦)
 */
export function formatNaira(amount: number): string {
  return '₦' + amount.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Play a crystal-clear pleasant two-tone kitchen chime using Web Audio API
 * No external audio files needed; 100% reliable across browsers.
 */
export function playKitchenChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // First tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain1.gain.setValueAtTime(0, ctx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.5);

    // Second tone (higher cheerful chime)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain2.gain.setValueAtTime(0, ctx.currentTime + 0.15);
    gain2.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.9);
  } catch {
    // Audio might be blocked by autoplay policies until user interaction
  }
}

/**
 * Check if the store is currently open and accepting orders
 */
export function checkStoreStatus(settings: StoreSettings): {
  isOpen: boolean;
  reason?: string;
  nextOpenTime?: string;
} {
  if (settings.manualPause) {
    return {
      isOpen: false,
      reason: settings.pauseReason || 'Kitchen is temporarily paused for prep',
    };
  }

  // Get current time in West Africa Time (UTC+1 / Nigeria)
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const watDate = new Date(utc + (3600000 * 1)); // WAT is UTC+1
  
  const currentMinutes = watDate.getHours() * 60 + watDate.getMinutes();

  const [openH, openM] = settings.openingTime.split(':').map(Number);
  const [closeH, closeM] = settings.closingTime.split(':').map(Number);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  const isWithinHours = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  if (!isWithinHours && !settings.isOpen) {
    return {
      isOpen: false,
      reason: `Outside operating hours (${settings.openingTime} – ${settings.closingTime} WAT)`,
      nextOpenTime: settings.openingTime,
    };
  }

  return {
    isOpen: settings.isOpen,
    reason: settings.isOpen ? undefined : 'Currently closed',
  };
}

export function getStatusConfig(status: OrderStatus) {
  switch (status) {
    case 'payment_confirmed':
      return {
        label: 'Payment Verified',
        step: 1,
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        dot: 'bg-amber-500',
        description: 'Order paid & queued for chef confirmation',
      };
    case 'in_kitchen':
      return {
        label: 'Cooking in Kitchen',
        step: 2,
        color: 'text-orange-700 bg-orange-50 border-orange-200',
        badge: 'bg-orange-100 text-orange-800 border-orange-300',
        dot: 'bg-orange-500 animate-pulse',
        description: 'Chef is preparing and packaging your meal',
      };
    case 'out_for_delivery':
      return {
        label: 'Out for Delivery',
        step: 3,
        color: 'text-blue-700 bg-blue-50 border-blue-200',
        badge: 'bg-blue-100 text-blue-800 border-blue-300',
        dot: 'bg-blue-500 animate-ping',
        description: 'Dispatch rider is en route to your address',
      };
    case 'delivered':
      return {
        label: 'Delivered',
        step: 4,
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        dot: 'bg-emerald-500',
        description: 'Meal successfully handed over. Enjoy!',
      };
    case 'cancelled':
      return {
        label: 'Cancelled / Refunded',
        step: 0,
        color: 'text-red-700 bg-red-50 border-red-200',
        badge: 'bg-red-100 text-red-800 border-red-300',
        dot: 'bg-red-500',
        description: 'Order was cancelled and payment refunded',
      };
  }
}
