import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { compareFractions, isSortedAscending, Fraction } from '../utils/fractionLogic';
import { MascotSiPintar } from './MascotSiPintar';

export const SectionCompareOrder: React.FC = () => {
  // --- SUBSECTION 1: Bandingkan 2 Pecahan ---
  const [f1, setF1] = useState<Fraction>({ num: 2, den: 3 });
  const [f2, setF2] = useState<Fraction>({ num: 3, den: 5 });
  const [selectedSymbol, setSelectedSymbol] = useState<'<' | '>' | '=' | null>(null);
  const [comparisonFeedback, setComparisonFeedback] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);

  const generateNewComparison = () => {
    sound.playClick();
    const pairs: [Fraction, Fraction][] = [
      [{ num: 1, den: 2 }, { num: 3, den: 4 }],
      [{ num: 2, den: 3 }, { num: 3, den: 5 }],
      [{ num: 3, den: 6 }, { num: 1, den: 2 }],
      [{ num: 4, den: 5 }, { num: 7, den: 10 }],
      [{ num: 2, den: 4 }, { num: 3, den: 6 }],
      [{ num: 5, den: 8 }, { num: 1, den: 2 }],
      [{ num: 3, den: 7 }, { num: 4, den: 9 }],
      [{ num: 1, den: 3 }, { num: 2, den: 5 }],
    ];
    const pick = pairs[Math.floor(Math.random() * pairs.length)];
    setF1(pick[0]);
    setF2(pick[1]);
    setSelectedSymbol(null);
    setComparisonFeedback(null);
  };

  const handleSelectSymbol = (sym: '<' | '>' | '=') => {
    setSelectedSymbol(sym);
    const correctSymbol = compareFractions(f1, f2);
    const isCorrect = sym === correctSymbol;

    const crossLeft = f1.num * f2.den;
    const crossRight = f2.num * f1.den;

    if (isCorrect) {
      sound.playCorrect();
      setComparisonFeedback({
        correct: true,
        message: `Benar sekali! 🎉 Trik Kali Silang: (${f1.num} × ${f2.den} = ${crossLeft}) dan (${f2.num} × ${f1.den} = ${crossRight}). Karena ${crossLeft} ${correctSymbol} ${crossRight}, maka ${f1.num}/${f1.den} ${correctSymbol} ${f2.num}/${f2.den}!`,
      });
    } else {
      sound.playWrong();
      setComparisonFeedback({
        correct: false,
        message: `Hampir tepat! Ayo coba cek Garis Bilangan di bawah atau gunakan Trik Kali Silang: (${f1.num} × ${f2.den} = ${crossLeft}) vs (${f2.num} × ${f1.den} = ${crossRight}). Simbol yang tepat adalah "${correctSymbol}".`,
      });
    }
  };

  // --- SUBSECTION 2: Urutkan Pecahan (Mini Game) ---
  const presetPuzzles: Fraction[][] = [
    [
      { num: 3, den: 4 },
      { num: 1, den: 4 },
      { num: 1, den: 2 },
    ],
    [
      { num: 5, den: 6 },
      { num: 1, den: 3 },
      { num: 1, den: 2 },
      { num: 2, den: 3 },
    ],
    [
      { num: 7, den: 10 },
      { num: 2, den: 5 },
      { num: 1, den: 2 },
    ],
    [
      { num: 4, den: 5 },
      { num: 1, den: 4 },
      { num: 3, den: 10 },
      { num: 1, den: 2 },
    ],
  ];

  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [cards, setCards] = useState<Fraction[]>(presetPuzzles[0]);
  const [orderChecked, setOrderChecked] = useState<{
    correct: boolean;
    hint?: string;
  } | null>(null);

  const swapCards = (idx1: number, idx2: number) => {
    sound.playClick();
    if (idx1 < 0 || idx2 < 0 || idx1 >= cards.length || idx2 >= cards.length) return;
    const next = [...cards];
    const temp = next[idx1];
    next[idx1] = next[idx2];
    next[idx2] = temp;
    setCards(next);
    setOrderChecked(null);
  };

  const checkOrder = () => {
    const isSorted = isSortedAscending(cards);
    if (isSorted) {
      sound.playCorrect();
      setOrderChecked({
        correct: true,
        hint: 'Luar biasa! Urutan dari terkecil ke terbesar sudah tepat 100%! 🌟',
      });
    } else {
      sound.playWrong();
      // Provide decimal values as educational hint
      const hintText = cards
        .map((c) => `${c.num}/${c.den} = ${(c.num / c.den).toFixed(2)}`)
        .join(', ');
      setOrderChecked({
        correct: false,
        hint: `Urutan belum pas. Tips nilai desimalnya: ${hintText}. Pindahkan pecahan dengan nilai terkecil ke paling kiri!`,
      });
    }
  };

  const newOrderPuzzle = () => {
    sound.playClick();
    const nextIdx = (puzzleIndex + 1) % presetPuzzles.length;
    setPuzzleIndex(nextIdx);
    setCards([...presetPuzzles[nextIdx]]);
    setOrderChecked(null);
  };

  return (
    <div className="space-y-8">
      {/* FITUR 1: BANDINGKAN 2 PECAHAN */}
      <section className="bg-white rounded-3xl border-3 border-sky-300 p-5 sm:p-7 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-sky-100 pb-3">
          <div>
            <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Tantangan 1 (7 Menit)
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-stone-800 mt-1">
              ⚖️ Bandingkan 2 Pecahan
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              Pilih simbol yang tepat: <strong>&gt;</strong> (Lebih Besar), <strong>&lt;</strong> (Lebih Kecil), atau <strong>=</strong> (Sama Dengan).
            </p>
          </div>
          <button
            onClick={generateNewComparison}
            className="px-3.5 py-1.5 bg-sky-100 text-sky-800 hover:bg-sky-200 border border-sky-300 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs"
          >
            🎲 Ganti Soal
          </button>
        </div>

        {/* Fraction comparison battle board */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 my-6">
          {/* Fraction 1 Card */}
          <div className="bg-amber-50 border-3 border-amber-300 rounded-2xl p-4 w-32 sm:w-36 flex flex-col items-center shadow-xs">
            <span className="text-xs font-bold text-amber-800 mb-1">Pecahan A</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-amber-700">{f1.num}</span>
              <div className="w-12 h-1 bg-amber-800 rounded-full my-1"></div>
              <span className="text-3xl font-black text-amber-700">{f1.den}</span>
            </div>
            <span className="text-[11px] text-amber-600 font-semibold mt-1">
              ≈ {(f1.num / f1.den).toFixed(2)}
            </span>
          </div>

          {/* Symbol Choice Buttons */}
          <div className="flex sm:flex-col gap-2">
            {(['>', '<', '='] as const).map((sym) => {
              const isSelected = selectedSymbol === sym;
              return (
                <button
                  key={sym}
                  onClick={() => handleSelectSymbol(sym)}
                  className={`w-14 h-14 rounded-2xl font-black text-2xl border-3 transition-all flex items-center justify-center shadow-md active:scale-95 ${
                    isSelected
                      ? 'bg-sky-500 border-sky-700 text-white scale-105'
                      : 'bg-white border-stone-300 text-stone-800 hover:border-sky-400 hover:bg-sky-50'
                  }`}
                  aria-label={`Pilih simbol ${sym}`}
                >
                  {sym}
                </button>
              );
            })}
          </div>

          {/* Fraction 2 Card */}
          <div className="bg-emerald-50 border-3 border-emerald-300 rounded-2xl p-4 w-32 sm:w-36 flex flex-col items-center shadow-xs">
            <span className="text-xs font-bold text-emerald-800 mb-1">Pecahan B</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-emerald-700">{f2.num}</span>
              <div className="w-12 h-1 bg-emerald-800 rounded-full my-1"></div>
              <span className="text-3xl font-black text-emerald-700">{f2.den}</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1">
              ≈ {(f2.num / f2.den).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Feedback Alert */}
        {comparisonFeedback && (
          <div
            className={`p-4 rounded-2xl border-2 text-sm sm:text-base font-medium mb-6 ${
              comparisonFeedback.correct
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            {comparisonFeedback.message}
          </div>
        )}

        {/* Visualizer: Garis Bilangan (Number Lines) */}
        <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3 flex items-center gap-1.5">
            <span>📏 Bantuan Visual: Garis Bilangan (0 sampai 1)</span>
          </h4>

          {/* Line for Fraction 1 */}
          <div className="mb-4">
            <div className="flex justify-between text-xs font-bold text-amber-800 mb-1">
              <span>Pecahan A: {f1.num}/{f1.den}</span>
              <span>Posisi: {(f1.num / f1.den * 100).toFixed(0)}%</span>
            </div>
            <div className="relative h-6 bg-amber-100 rounded-full border border-amber-300 overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${(f1.num / f1.den) * 100}%` }}
              ></div>
              <div
                className="absolute top-0 bottom-0 w-2 bg-amber-800 shadow-sm"
                style={{ left: `calc(${(f1.num / f1.den) * 100}% - 4px)` }}
              ></div>
            </div>
          </div>

          {/* Line for Fraction 2 */}
          <div>
            <div className="flex justify-between text-xs font-bold text-emerald-800 mb-1">
              <span>Pecahan B: {f2.num}/{f2.den}</span>
              <span>Posisi: {(f2.num / f2.den * 100).toFixed(0)}%</span>
            </div>
            <div className="relative h-6 bg-emerald-100 rounded-full border border-emerald-300 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${(f2.num / f2.den) * 100}%` }}
              ></div>
              <div
                className="absolute top-0 bottom-0 w-2 bg-emerald-800 shadow-sm"
                style={{ left: `calc(${(f2.num / f2.den) * 100}% - 4px)` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between text-[11px] text-stone-400 font-bold mt-2 px-1">
            <span>0</span>
            <span>0.5 (Setengah)</span>
            <span>1 (Satu Penuh)</span>
          </div>
        </div>
      </section>

      {/* FITUR 2: MINI GAME MENGURUTKAN PECAHAN */}
      <section className="bg-white rounded-3xl border-3 border-amber-300 p-5 sm:p-7 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-amber-100 pb-3">
          <div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Tantangan 2 (8 Menit)
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-stone-800 mt-1">
              🎮 Mini Game: Susun Pecahan Terkecil ke Terbesar
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              Gunakan tombol panah ⬅️ ➡️ pada tiap kartu untuk menyusun urutan dari yang paling kecil ke yang paling besar!
            </p>
          </div>
          <button
            onClick={newOrderPuzzle}
            className="px-3.5 py-1.5 bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs"
          >
            🔄 Kartu Baru
          </button>
        </div>

        {/* Cards container */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-6">
          {cards.map((card, idx) => (
            <div
              key={`${card.num}-${card.den}-${idx}`}
              className="bg-yellow-50 border-3 border-yellow-300 rounded-2xl p-4 flex flex-col items-center shadow-xs transition-transform hover:-translate-y-0.5"
            >
              <span className="text-[11px] font-bold text-stone-500 mb-1">
                Posisi #{idx + 1}
              </span>
              <div className="flex flex-col items-center my-2">
                <span className="text-3xl font-black text-amber-600">{card.num}</span>
                <div className="w-12 h-1 bg-stone-700 rounded-full my-1"></div>
                <span className="text-3xl font-black text-emerald-600">{card.den}</span>
              </div>

              {/* Move buttons */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => swapCards(idx, idx - 1)}
                  disabled={idx === 0}
                  className="w-8 h-8 rounded-lg bg-white border border-stone-300 disabled:opacity-30 hover:bg-amber-100 flex items-center justify-center font-bold text-stone-700 shadow-xs"
                  aria-label={`Pindahkan pecahan ${card.num}/${card.den} ke kiri`}
                >
                  ⬅️
                </button>
                <button
                  onClick={() => swapCards(idx, idx + 1)}
                  disabled={idx === cards.length - 1}
                  className="w-8 h-8 rounded-lg bg-white border border-stone-300 disabled:opacity-30 hover:bg-amber-100 flex items-center justify-center font-bold text-stone-700 shadow-xs"
                  aria-label={`Pindahkan pecahan ${card.num}/${card.den} ke kanan`}
                >
                  ➡️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Check button and outcome */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
          <button
            onClick={checkOrder}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>✅ Periksa Urutan Kartu</span>
          </button>

          {orderChecked && (
            <div
              className={`flex-1 p-3.5 rounded-2xl border-2 text-xs sm:text-sm font-semibold ${
                orderChecked.correct
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              {orderChecked.hint}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
