import React from 'react';

interface MascotProps {
  message: string;
  subtext?: string;
  mood?: 'happy' | 'thinking' | 'cheering';
  size?: 'sm' | 'md' | 'lg';
}

export const MascotSiPintar: React.FC<MascotProps> = ({
  message,
  subtext,
  mood = 'happy',
  size = 'md',
}) => {
  return (
    <div className="flex items-start gap-3 sm:gap-4 bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-3 sm:p-4 shadow-sm transition-all hover:shadow-md">
      {/* SVG Mascot Character: Si Pintar the Owl */}
      <div className="relative flex-shrink-0">
        <svg
          viewBox="0 0 100 100"
          className={`${size === 'sm' ? 'w-12 h-12' : size === 'lg' ? 'w-20 h-20' : 'w-16 h-16'} filter drop-shadow`}
          aria-label="Maskot Si Pintar"
        >
          {/* Owl Body */}
          <ellipse cx="50" cy="58" rx="36" ry="34" fill="#3B82F6" />
          <ellipse cx="50" cy="62" rx="28" ry="26" fill="#FEF08A" />

          {/* Feathers on chest */}
          <path d="M42 54 Q50 60 58 54" stroke="#F59E0B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M40 63 Q50 70 60 63" stroke="#F59E0B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M44 72 Q50 78 56 72" stroke="#F59E0B" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Wings */}
          <ellipse cx="16" cy="60" rx="9" ry="20" fill="#1D4ED8" transform="rotate(15 16 60)" />
          <ellipse cx="84" cy="60" rx="9" ry="20" fill="#1D4ED8" transform="rotate(-15 84 60)" />

          {/* Big Wise Eyes with Glasses */}
          {/* Left Eye */}
          <circle cx="37" cy="40" r="14" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="37" cy="40" r="7" fill="#1E293B" />
          <circle cx="35" cy="37" r="2.5" fill="#FFFFFF" />

          {/* Right Eye */}
          <circle cx="63" cy="40" r="14" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="63" cy="40" r="7" fill="#1E293B" />
          <circle cx="61" cy="37" r="2.5" fill="#FFFFFF" />

          {/* Glasses Bridge */}
          <path d="M47 38 L53 38" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />

          {/* Orange Beak */}
          <polygon points="50,45 44,53 56,53" fill="#F97316" stroke="#C2410C" strokeWidth="1.5" />

          {/* Rosy Cheeks */}
          <circle cx="27" cy="49" r="4.5" fill="#F43F5E" opacity="0.6" />
          <circle cx="73" cy="49" r="4.5" fill="#F43F5E" opacity="0.6" />

          {/* Graduation Cap (Toga Pintar) */}
          <polygon points="50,6 20,20 50,26 80,20" fill="#1E1B4B" stroke="#0F172A" strokeWidth="1" />
          <rect x="42" y="21" width="16" height="8" rx="2" fill="#1E1B4B" />
          {/* Tassel */}
          <line x1="50" y1="20" x2="76" y2="28" stroke="#F59E0B" strokeWidth="2.5" />
          <circle cx="76" cy="30" r="3" fill="#F59E0B" />

          {/* Feet */}
          <ellipse cx="40" cy="92" rx="6" ry="3" fill="#EA580C" />
          <ellipse cx="60" cy="92" rx="6" ry="3" fill="#EA580C" />

          {/* Cheerful sparkles if mood = cheering */}
          {mood === 'cheering' && (
            <>
              <path d="M12 25 L16 28 L12 31 L8 28 Z" fill="#FACC15" />
              <path d="M88 25 L92 28 L88 31 L84 28 Z" fill="#FACC15" />
            </>
          )}
        </svg>
        <span className="absolute -bottom-1 -right-1 bg-amber-400 text-stone-900 font-extrabold text-[9px] px-1.5 py-0.5 rounded-full border border-amber-600 shadow-xs">
          Si Pintar
        </span>
      </div>

      {/* Speech Bubble */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-xs uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-md">
            Pesan Si Pintar
          </span>
          <span className="text-[11px] text-amber-700 font-medium hidden sm:inline">
            Teman Belajarmu di Dukuhwaru 🦉
          </span>
        </div>
        <p className="text-stone-800 font-medium text-sm sm:text-base leading-snug">
          "{message}"
        </p>
        {subtext && (
          <p className="text-stone-600 text-xs sm:text-sm mt-1 bg-white/70 p-1.5 rounded-lg border border-amber-200/60 inline-block">
            💡 {subtext}
          </p>
        )}
      </div>
    </div>
  );
};
