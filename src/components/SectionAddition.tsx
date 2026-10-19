import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { addFractions, Fraction } from '../utils/fractionLogic';
import { MascotSiPintar } from './MascotSiPintar';

export const SectionAddition: React.FC = () => {
  const [mode, setMode] = useState<'same' | 'diff'>('same');

  // Fractions state
  const [f1, setF1] = useState<Fraction>({ num: 2, den: 7 });
  const [f2, setF2] = useState<Fraction>({ num: 3, den: 7 });

  // User input answers
  const [ansNum, setAnsNum] = useState<string>('');
  const [ansDen, setAnsDen] = useState<string>('');

  // KPK Helper Modal / Panel
  const [showKpkHelper, setShowKpkHelper] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);

  const stepResult = addFractions(f1, f2);

  const handleModeSwitch = (newMode: 'same' | 'diff') => {
    sound.playClick();
    setMode(newMode);
    setAnsNum('');
    setAnsDen('');
    setFeedback(null);
    setShowKpkHelper(false);

    if (newMode === 'same') {
      setF1({ num: 2, den: 7 });
      setF2({ num: 3, den: 7 });
    } else {
      setF1({ num: 1, den: 3 });
      setF2({ num: 2, den: 5 });
    }
  };

  const handleNewExercise = () => {
    sound.playClick();
    setAnsNum('');
    setAnsDen('');
    setFeedback(null);
    setShowKpkHelper(false);

    if (mode === 'same') {
      const den = [4, 5, 6, 7, 8, 9, 10][Math.floor(Math.random() * 7)];
      const n1 = Math.floor(Math.random() * (den - 2)) + 1;
      const n2 = Math.floor(Math.random() * (den - n1)) + 1;
      setF1({ num: n1, den });
      setF2({ num: n2, den });
    } else {
      const pairs: [Fraction, Fraction][] = [
        [{ num: 1, den: 2 }, { num: 1, den: 3 }],
        [{ num: 1, den: 4 }, { num: 1, den: 2 }],
        [{ num: 2, den: 5 }, { num: 1, den: 3 }],
        [{ num: 3, den: 8 }, { num: 1, den: 4 }],
        [{ num: 1, den: 6 }, { num: 2, den: 3 }],
        [{ num: 2, den: 7 }, { num: 1, den: 2 }],
        [{ num: 3, den: 10 }, { num: 2, den: 5 }],
      ];
      const pick = pairs[Math.floor(Math.random() * pairs.length)];
      setF1(pick[0]);
      setF2(pick[1]);
    }
  };

  const checkAnswer = () => {
    const userN = parseInt(ansNum.trim(), 10);
    const userD = parseInt(ansDen.trim(), 10);

    if (isNaN(userN) || isNaN(userD) || userD === 0) {
      sound.playWrong();
      setFeedback({
        correct: false,
        message: 'Ayo masukkan angka pembilang dan penyebut terlebih dahulu ya! 😊',
      });
      return;
    }

    // Check if equivalent to correct sum
    const isExact =
      (userN === stepResult.resultNum && userD === stepResult.resultDen) ||
      (userN === stepResult.simplified.num && userD === stepResult.simplified.den);

    if (isExact) {
      sound.playCorrect();
      setFeedback({
        correct: true,
        message: `Hebat sekali! Jawabanmu ${userN}/${userD} benar! 🎯 ${
          stepResult.simplified.num !== stepResult.resultNum
            ? `Bentuk paling sederhananya adalah ${stepResult.simplified.num}/${stepResult.simplified.den}.`
            : ''
        }`,
      });
    } else {
      sound.playWrong();
      setFeedback({
        correct: false,
        message: `Jawabanmu ${userN}/${userD} belum tepat. Jangan menyerah! Coba klik tombol "💡 Bantuan KPK & Langkah" di bawah untuk melihat triknya!`,
      });
    }
  };

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-3xl border-3 border-emerald-300 p-5 sm:p-7 shadow-md">
        {/* Header & Sub-mode toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-emerald-100 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Sesi 3: Penjumlahan Pecahan (15 Menit)
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-stone-800 mt-1">
              ➕ Penjumlahan Berpenyebut Sama & Beda
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleModeSwitch('same')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                mode === 'same'
                  ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              Penyebut Sama
            </button>
            <button
              onClick={() => handleModeSwitch('diff')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                mode === 'diff'
                  ? 'bg-amber-500 border-amber-600 text-white shadow-sm'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              Penyebut Beda
            </button>
            <button
              onClick={handleNewExercise}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-bold rounded-xl border border-stone-300 transition-all shadow-xs"
            >
              🎲 Soal Baru
            </button>
          </div>
        </div>

        {/* Visual Math Problem Formula Display */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 my-6 bg-emerald-50/60 p-4 sm:p-6 rounded-3xl border-2 border-emerald-200">
          {/* Fraction 1 */}
          <div className="flex flex-col items-center bg-white px-4 py-3 rounded-2xl border-2 border-emerald-300 shadow-xs min-w-[70px]">
            <span className="text-3xl font-black text-emerald-700">{f1.num}</span>
            <div className="w-10 h-1 bg-emerald-800 rounded-full my-1"></div>
            <span className="text-3xl font-black text-emerald-700">{f1.den}</span>
          </div>

          <span className="text-4xl font-black text-stone-700">+</span>

          {/* Fraction 2 */}
          <div className="flex flex-col items-center bg-white px-4 py-3 rounded-2xl border-2 border-emerald-300 shadow-xs min-w-[70px]">
            <span className="text-3xl font-black text-emerald-700">{f2.num}</span>
            <div className="w-10 h-1 bg-emerald-800 rounded-full my-1"></div>
            <span className="text-3xl font-black text-emerald-700">{f2.den}</span>
          </div>

          <span className="text-4xl font-black text-stone-700">=</span>

          {/* User Input Fraction */}
          <div className="flex flex-col items-center bg-yellow-50 px-3 py-2 rounded-2xl border-2 border-amber-400 shadow-xs">
            <input
              type="number"
              placeholder="?"
              value={ansNum}
              onChange={(e) => setAnsNum(e.target.value)}
              aria-label="Isi Pembilang Hasil"
              className="w-14 h-11 text-center font-black text-2xl bg-white border-2 border-amber-300 rounded-xl focus:outline-emerald-500 text-amber-700"
            />
            <div className="w-12 h-1 bg-stone-700 rounded-full my-1.5"></div>
            <input
              type="number"
              placeholder="?"
              value={ansDen}
              onChange={(e) => setAnsDen(e.target.value)}
              aria-label="Isi Penyebut Hasil"
              className="w-14 h-11 text-center font-black text-2xl bg-white border-2 border-amber-300 rounded-xl focus:outline-emerald-500 text-emerald-700"
            />
          </div>

          {/* Submit Answer */}
          <button
            onClick={checkAnswer}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-md transition-all active:scale-95"
          >
            Cek Jawaban
          </button>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl border-2 text-sm sm:text-base font-semibold mb-6 ${
              feedback.correct
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Action Button: Bantuan KPK */}
        <div className="flex justify-center my-4">
          <button
            onClick={() => {
              sound.playClick();
              setShowKpkHelper(!showKpkHelper);
            }}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-stone-900 font-extrabold text-sm rounded-2xl shadow-sm border border-amber-600 transition-all flex items-center gap-2"
          >
            <span>💡 {showKpkHelper ? 'Tutup Bantuan KPK' : 'Bantuan KPK & Langkah Menyamakan Penyebut'}</span>
          </button>
        </div>

        {/* Bantuan KPK Visualizer Panel */}
        {showKpkHelper && (
          <div className="bg-amber-50/90 border-3 border-amber-300 rounded-3xl p-5 sm:p-6 mt-4 shadow-inner space-y-4">
            <div className="flex items-center gap-2 border-b border-amber-200 pb-2">
              <span className="text-2xl">🧠</span>
              <h4 className="text-lg font-black text-amber-900">
                Langkah Cerdas Si Pintar: Menyamakan Penyebut
              </h4>
            </div>

            {/* Step-by-step visual cards */}
            <div className="space-y-3">
              {stepResult.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3.5 rounded-2xl border border-amber-200 text-sm text-stone-800 flex items-start gap-3 shadow-xs"
                >
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="font-medium leading-relaxed">{step}</div>
                </div>
              ))}
            </div>

            {/* Visual Multiples Table if denominators differ */}
            {!stepResult.isSameDen && (
              <div className="bg-white p-4 rounded-2xl border border-amber-200">
                <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">
                  Tabel Kelipatan untuk mencari KPK:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="bg-amber-50 p-2.5 rounded-xl">
                    <span className="font-bold text-amber-800">Kelipatan {f1.den}:</span>
                    <p className="text-stone-700 mt-1">
                      {[1, 2, 3, 4, 5, 6].map((m) => {
                        const val = f1.den * m;
                        const isKpk = val === stepResult.commonDen;
                        return (
                          <span
                            key={m}
                            className={`inline-block mr-1.5 px-1.5 py-0.5 rounded ${
                              isKpk ? 'bg-amber-400 font-black text-stone-900' : 'text-stone-600'
                            }`}
                          >
                            {val}
                          </span>
                        );
                      })}
                    </p>
                  </div>

                  <div className="bg-emerald-50 p-2.5 rounded-xl">
                    <span className="font-bold text-emerald-800">Kelipatan {f2.den}:</span>
                    <p className="text-stone-700 mt-1">
                      {[1, 2, 3, 4, 5, 6].map((m) => {
                        const val = f2.den * m;
                        const isKpk = val === stepResult.commonDen;
                        return (
                          <span
                            key={m}
                            className={`inline-block mr-1.5 px-1.5 py-0.5 rounded ${
                              isKpk ? 'bg-emerald-400 font-black text-stone-900' : 'text-stone-600'
                            }`}
                          >
                            {val}
                          </span>
                        );
                      })}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-amber-900 font-bold mt-3 text-center">
                  🎯 Angka terkecil yang sama adalah {stepResult.commonDen}, jadi KPK-nya adalah {stepResult.commonDen}!
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
