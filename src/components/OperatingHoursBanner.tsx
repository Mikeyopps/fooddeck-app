import React from 'react';
import { AlertTriangle, Clock, Info } from 'lucide-react';
import { StoreSettings } from '../types';

interface OperatingHoursBannerProps {
  storeSettings: StoreSettings;
  onOpenStoreOverride?: () => void;
}

export const OperatingHoursBanner: React.FC<OperatingHoursBannerProps> = ({ storeSettings }) => {
  if (storeSettings.isOpen && !storeSettings.manualPause) {
    // Normal open banner with nice announcement
    if (storeSettings.announcement) {
      return (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b border-orange-200/80 px-4 py-2.5 text-center text-xs sm:text-sm font-medium text-stone-800 flex items-center justify-center gap-2">
          <span className="text-base">🌶️</span>
          <span>{storeSettings.announcement}</span>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="bg-amber-500 text-stone-950 border-b-2 border-amber-600 px-4 py-3 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-stone-950 text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base leading-tight">
              {storeSettings.manualPause ? 'Kitchen In-Rush Pause Active' : 'Currently Outside Operating Hours'}
            </h4>
            <p className="text-xs sm:text-sm font-medium text-stone-900 mt-0.5">
              {storeSettings.manualPause
                ? storeSettings.pauseReason || 'We are temporarily pausing new online orders to attend to ongoing orders.'
                : `FoodDeck kitchen operates daily between ${storeSettings.openingTime} – ${storeSettings.closingTime} WAT. You can still explore the menu and plan your tray!`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-stone-950/10 px-3 py-1.5 rounded-lg border border-stone-950/15">
          <Clock className="w-3.5 h-3.5" />
          <span>Ordering Resumes Soon</span>
        </div>
      </div>
    </div>
  );
};
