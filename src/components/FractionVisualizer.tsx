import React, { useState } from 'react';
import { sound } from '../utils/audio';

interface FractionVisualizerProps {
  initialNum?: number;
  initialDen?: number;
  interactive?: boolean;
}

export const FractionVisualizer: React.FC<FractionVisualizerProps> = ({
  initialNum = 3,
  initialDen = 4,
  interactive = true,
}) => {
  const [num, setNum] = useState<number>(initialNum);
  const [den, setDen] = useState<number>(initialDen);
  const [mode, setMode] = useState<'pizza' | 'ribbon'>('pizza');
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  const handleNumChange = (newNum: number) => {
    sound.playClick();
    const clamped = Math.max(1, Math.min(newNum, den));
    setNum(clamped);
  };

  const handleDenChange = (newDen: number) => {
    sound.playClick();
    const clampedDen = Math.max(1, Math.min(newDen, 10));
    setDen(clampedDen);
    if (num > clampedDen) {
      setNum(clampedDen);
    }
  };

  const handleSliceClick = (index: number) => {
    if (!interactive) return;
    sound.playClick();
    // If clicked on index < num, toggle down, otherwise toggle up to index + 1
    if (index < num) {
      setNum(Math.max(1, index));
    } else {
      setNum(index + 1);
    }
  };

  // Helper to generate SVG pizza slices
  const renderPizzaSlices = () => {
    const center = 150;
    const radius = 120;
    const slices = [];

    for (let i = 0; i < den; i++) {
      const startAngle = (i * 2 * Math.PI) / den - Math.PI / 2;
      const endAngle = ((i + 1) * 2 * Math.PI) / den - Math.PI / 2;

      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);

      const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
      const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      const isFilled = i < num;
      const isHovered = hoveredSlice === i;

      // Slice label coordinate
      const midAngle = (startAngle + endAngle) / 2;
      const labelX = center + (radius * 0.65) * Math.cos(midAngle);
      const labelY = center + (radius * 0.65) * Math.sin(midAngle);

      // Slices toppings coordinates
      const tX = center + (radius * 0.4) * Math.cos(midAngle);
      const tY = center + (radius * 0.4) * Math.sin(midAngle);

      slices.push(
        <g
          key={i}
          className="cursor-pointer transition-all duration-200"
          onClick={() => handleSliceClick(i)}
          onMouseEnter={() => setHoveredSlice(i)}
          onMouseLeave={() => setHoveredSlice(null)}
        >
          <path
            d={pathData}
            fill={isFilled ? (isHovered ? '#FB923C' : '#F59E0B') : (isHovered ? '#F1F5F9' : '#F8FAFC')}
            stroke="#D97706"
            strokeWidth="3"
            className="transition-colors duration-150"
          />

          {/* Crust border on the edge */}
          <path
            d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`}
            stroke="#B45309"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />

          {/* Tasty toppings if filled */}
          {isFilled && (
            <>
              {/* Pepperoni / tomato slice */}
              <circle cx={tX} cy={tY} r={radius * 0.1} fill="#DC2626" opacity="0.85" />
              <circle cx={tX - 2} cy={tY - 2} r={radius * 0.04} fill="#EF4444" />
              {/* Basil herb flake */}
              <circle cx={tX + 8} cy={tY + 4} r="2.5" fill="#16A34A" />
            </>
          )}

          {/* Slice number / fraction part */}
          <text
            x={labelX}
            y={labelY + 4}
            textAnchor="middle"
            fontSize={den > 6 ? '12' : '15'}
            fontWeight="bold"
            fill={isFilled ? '#78350F' : '#94A3B8'}
            className="select-none pointer-events-none"
          >
            {isFilled ? `1/${den}` : `${i + 1}`}
          </text>
        </g>
      );
    }

    return (
      <svg viewBox="0 0 300 300" className="w-64 h-64 sm:w-72 sm:h-72 drop-shadow-md mx-auto">
        {/* Outer wood plate */}
        <circle cx="150" cy="150" r="140" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="4" />
        <circle cx="150" cy="150" r="132" fill="#FEF3C7" opacity="0.6" />

        {/* Render the slices */}
        {slices}

        {/* Center hub */}
        <circle cx="150" cy="150" r="12" fill="#D97706" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="150" cy="150" r="5" fill="#FFFFFF" />
      </svg>
    );
  };

  // Helper to generate SVG ribbon / bar
  const renderRibbonBar = () => {
    const totalWidth = 320;
    const height = 50;
    const segmentWidth = totalWidth / den;

    const segments = [];
    for (let i = 0; i < den; i++) {
      const isFilled = i < num;
      const isHovered = hoveredSlice === i;
      segments.push(
        <g
          key={i}
          className="cursor-pointer"
          onClick={() => handleSliceClick(i)}
          onMouseEnter={() => setHoveredSlice(i)}
          onMouseLeave={() => setHoveredSlice(null)}
        >
          <rect
            x={i * segmentWidth}
            y={0}
            width={segmentWidth}
            height={height}
            fill={isFilled ? (isHovered ? '#34D399' : '#10B981') : (isHovered ? '#E2E8F0' : '#F8FAFC')}
            stroke="#059669"
            strokeWidth="2.5"
            className="transition-colors duration-150"
          />
          {/* Label inside segment */}
          <text
            x={i * segmentWidth + segmentWidth / 2}
            y={height / 2 + 5}
            textAnchor="middle"
            fontSize={den > 6 ? '12' : '14'}
            fontWeight="bold"
            fill={isFilled ? '#FFFFFF' : '#64748B'}
            className="select-none pointer-events-none"
          >
            {isFilled ? `1/${den}` : `Bag. ${i + 1}`}
          </text>
        </g>
      );
    }

    return (
      <div className="w-full max-w-md mx-auto py-6 px-2">
        <svg viewBox={`0 0 ${totalWidth} ${height}`} className="w-full drop-shadow rounded-lg overflow-hidden border-2 border-emerald-600">
          {segments}
        </svg>
        <div className="flex justify-between items-center text-xs text-stone-500 font-semibold mt-2 px-1">
          <span>0 (Mulai)</span>
          <span>Panjang Total: 1 Bagian Penuh ({den}/{den})</span>
          <span>1 (Penuh)</span>
        </div>
      </div>
    );
  };

  const presets = [
    { n: 1, d: 2, label: '1/2 (Setengah)' },
    { n: 1, d: 4, label: '1/4 (Seperempat)' },
    { n: 2, d: 3, label: '2/3 (Dua pertiga)' },
    { n: 3, d: 4, label: '3/4 (Tiga perempat)' },
    { n: 2, d: 5, label: '2/5 (Dua perlima)' },
    { n: 5, d: 8, label: '5/8 (Lima perdelapan)' },
  ];

  return (
    <div className="bg-white rounded-3xl border-3 border-emerald-300 p-4 sm:p-6 shadow-md">
      {/* Visualizer header & mode switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
            <span>✨ Laboratorium Visual Pecahan</span>
          </h3>
          <p className="text-xs sm:text-sm text-stone-600">
            Klik potongan langsung atau geser slider di bawah untuk melihat keajaibannya!
          </p>
        </div>

        {/* Mode toggle */}
        <div className="inline-flex bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button
            onClick={() => {
              sound.playClick();
              setMode('pizza');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              mode === 'pizza'
                ? 'bg-amber-400 text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🍕 Pizza Lingkaran
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setMode('ribbon');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              mode === 'ribbon'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            📏 Batang Pita
          </button>
        </div>
      </div>

      {/* Main Display: Fraction Big Math Symbol + Canvas/SVG */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-2">
        {/* Big Interactive Fraction Badge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-amber-50/70 rounded-2xl border-2 border-amber-200">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
            Nilai Pecahan Saat Ini
          </span>

          <div className="flex items-center gap-4 my-2">
            <div className="flex flex-col items-center font-black">
              {/* Pembilang */}
              <span className="text-4xl sm:text-5xl text-amber-600 leading-none">
                {num}
              </span>
              {/* Garis Pecahan */}
              <div className="w-16 sm:w-20 h-1.5 bg-stone-800 rounded-full my-1.5"></div>
              {/* Penyebut */}
              <span className="text-4xl sm:text-5xl text-emerald-600 leading-none">
                {den}
              </span>
            </div>

            <div className="text-left text-xs sm:text-sm space-y-1.5 text-stone-700 border-l-2 border-amber-300 pl-3">
              <div>
                <span className="font-bold text-amber-700">Pembilang ({num}) :</span>
                <p className="text-xs text-stone-600">Bagian yang diwarnai / dimakan</p>
              </div>
              <div>
                <span className="font-bold text-emerald-700">Penyebut ({den}) :</span>
                <p className="text-xs text-stone-600">Total seluruh potongan sama besar</p>
              </div>
              <div className="pt-1 text-[11px] font-semibold text-stone-500">
                Nilai Desimal: <span className="text-stone-800 font-bold">{(num / den).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="w-full mt-4 pt-3 border-t border-amber-200">
            <span className="text-[11px] font-bold text-stone-600 block mb-1.5">
              Contoh Cepat Pecahan:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    sound.playClick();
                    setDen(p.d);
                    setNum(p.n);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold border transition-all ${
                    num === p.n && den === p.d
                      ? 'bg-amber-400 border-amber-600 text-stone-900 font-bold'
                      : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {p.n}/{p.d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visualizer Display (SVG Pizza or Ribbon) */}
        <div className="md:col-span-7 flex flex-col items-center justify-center min-h-[260px] bg-stone-50 rounded-2xl p-4 border border-stone-200">
          {mode === 'pizza' ? renderPizzaSlices() : renderRibbonBar()}
          <span className="text-xs text-stone-500 font-medium mt-2">
            💡 Tips: Kamu bisa mengklik langsung setiap potongan pizza/pita di atas!
          </span>
        </div>
      </div>

      {/* Sliders & Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t border-stone-200">
        {/* Pembilang Controller */}
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="pembilang-slider" className="font-bold text-stone-800 text-sm flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              Pembilang (Atas):
              <span className="text-lg font-black text-amber-700 ml-1">{num}</span>
            </label>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleNumChange(num - 1)}
                disabled={num <= 1}
                aria-label="Kurangi Pembilang"
                className="w-7 h-7 rounded-lg bg-white border border-amber-300 text-amber-800 font-bold disabled:opacity-40 hover:bg-amber-100 flex items-center justify-center text-sm shadow-xs"
              >
                -
              </button>
              <button
                onClick={() => handleNumChange(num + 1)}
                disabled={num >= den}
                aria-label="Tambah Pembilang"
                className="w-7 h-7 rounded-lg bg-white border border-amber-300 text-amber-800 font-bold disabled:opacity-40 hover:bg-amber-100 flex items-center justify-center text-sm shadow-xs"
              >
                +
              </button>
            </div>
          </div>
          <input
            id="pembilang-slider"
            type="range"
            min="1"
            max={den}
            value={num}
            onChange={(e) => handleNumChange(parseInt(e.target.value, 10))}
            aria-label="Atur Pembilang Pecahan"
            className="w-full accent-amber-500 h-2.5 bg-amber-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-stone-500 font-medium mt-1">
            <span>1</span>
            <span>Maksimal sama dengan penyebut ({den})</span>
          </div>
        </div>

        {/* Penyebut Controller */}
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="penyebut-slider" className="font-bold text-stone-800 text-sm flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              Penyebut (Bawah):
              <span className="text-lg font-black text-emerald-700 ml-1">{den}</span>
            </label>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleDenChange(den - 1)}
                disabled={den <= 1}
                aria-label="Kurangi Penyebut"
                className="w-7 h-7 rounded-lg bg-white border border-emerald-300 text-emerald-800 font-bold disabled:opacity-40 hover:bg-emerald-100 flex items-center justify-center text-sm shadow-xs"
              >
                -
              </button>
              <button
                onClick={() => handleDenChange(den + 1)}
                disabled={den >= 10}
                aria-label="Tambah Penyebut"
                className="w-7 h-7 rounded-lg bg-white border border-emerald-300 text-emerald-800 font-bold disabled:opacity-40 hover:bg-emerald-100 flex items-center justify-center text-sm shadow-xs"
              >
                +
              </button>
            </div>
          </div>
          <input
            id="penyebut-slider"
            type="range"
            min="1"
            max="10"
            value={den}
            onChange={(e) => handleDenChange(parseInt(e.target.value, 10))}
            aria-label="Atur Penyebut Pecahan"
            className="w-full accent-emerald-500 h-2.5 bg-emerald-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-stone-500 font-medium mt-1">
            <span>1 bagian penuh</span>
            <span>10 potongan</span>
          </div>
        </div>
      </div>
    </div>
  );
};
