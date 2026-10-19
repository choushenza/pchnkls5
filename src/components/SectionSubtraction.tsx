import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { subtractFractions, Fraction } from '../utils/fractionLogic';
import { MascotSiPintar } from './MascotSiPintar';

interface StoryProblem {
  id: number;
  title: string;
  story: string;
  location: string;
  f1: Fraction;
  f2: Fraction;
  visualType: 'martabak' | 'ribbon' | 'kue' | 'semangka';
}

const DUKUHWARU_STORIES: StoryProblem[] = [
  {
    id: 1,
    title: '🍕 Martabak Manis Desa Dukuhwaru',
    location: 'Warung Martabak Dukuhwaru',
    story: 'Ibu Fatimah membeli 1 loyang Martabak Manis yang dipotong rata menjadi 8 bagian sama besar (8/8). Sesampainya di Saung Dukuhwaru, adik memakan 3 bagian (3/8). Berapa bagian martabak yang masih tersisa?',
    f1: { num: 8, den: 8 },
    f2: { num: 3, den: 8 },
    visualType: 'martabak',
  },
  {
    id: 2,
    title: '🎗️ Pita Karnaval Sepeda Hias',
    location: 'Pasar Trayeman Slawi ke Dukuhwaru',
    story: 'Rian memiliki pita hias sepanjang 3/4 meter yang dibeli dari pasar. Untuk menghias stang sepeda karnaval HUT RI di Dukuhwaru, Rian memotongnya sepanjang 1/2 meter. Berapa meter sisa pita Rian sekarang?',
    f1: { num: 3, den: 4 },
    f2: { num: 1, den: 2 },
    visualType: 'ribbon',
  },
  {
    id: 3,
    title: '🥧 Kue Talam Pandan Saung Pintar',
    location: 'Dapur Saung Pintar',
    story: 'Anak-anak bimbel Saung Pintar membuat 5/6 loyang Kue Talam Pandan yang harum. Sebanyak 1/3 loyang disajikan untuk camilan istirahat belajar. Berapa loyang sisa kue talam tersebut?',
    f1: { num: 5, den: 6 },
    f2: { num: 1, den: 3 },
    visualType: 'kue',
  },
  {
    id: 4,
    title: '🍉 Panen Semangka Manis Dukuhwaru',
    location: 'Kebun Buah Dukuhwaru',
    story: 'Pak Tani memanen semangka manis. Sebanyak 7/10 bagian dibawa ke pasar, namun 2/10 bagian dibagikan gratis untuk anak-anak Saung Pintar yang rajin belajar. Berapa selisih bagian semangka tersebut?',
    f1: { num: 7, den: 10 },
    f2: { num: 2, den: 10 },
    visualType: 'semangka',
  },
];

export const SectionSubtraction: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [ansNum, setAnsNum] = useState<string>('');
  const [ansDen, setAnsDen] = useState<string>('');
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);
  const [showSteps, setShowSteps] = useState<boolean>(false);

  const currentStory = DUKUHWARU_STORIES[currentIdx];
  const stepResult = subtractFractions(currentStory.f1, currentStory.f2);

  const handleSelectStory = (idx: number) => {
    sound.playClick();
    setCurrentIdx(idx);
    setAnsNum('');
    setAnsDen('');
    setFeedback(null);
    setShowSteps(false);
  };

  const checkAnswer = () => {
    const userN = parseInt(ansNum.trim(), 10);
    const userD = parseInt(ansDen.trim(), 10);

    if (isNaN(userN) || isNaN(userD) || userD === 0) {
      sound.playWrong();
      setFeedback({
        correct: false,
        message: 'Isi angka pembilang dan penyebut dulu ya sobat! 😊',
      });
      return;
    }

    const isMatch =
      (userN === stepResult.resultNum && userD === stepResult.resultDen) ||
      (userN === stepResult.simplified.num && userD === stepResult.simplified.den);

    if (isMatch) {
      sound.playCorrect();
      setFeedback({
        correct: true,
        message: `Tepat sekali! 🌟 Sisa pecahan adalah ${userN}/${userD}. Kamu berhasil memecahkan soal cerita Dukuhwaru!`,
      });
      setShowSteps(true);
    } else {
      sound.playWrong();
      setFeedback({
        correct: false,
        message: `Jawabanmu ${userN}/${userD} belum pas. Periksa kembali pengurangan pembilangnya atau samakan penyebutnya dulu!`,
      });
    }
  };

  // SVG representation for the story
  const renderStoryVisual = () => {
    const totalSegments = currentStory.f1.den;
    const initialFilled = currentStory.f1.num;
    const removedCount = Math.round((currentStory.f2.num / currentStory.f2.den) * totalSegments);
    const remainingCount = Math.max(0, initialFilled - removedCount);

    return (
      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col items-center">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
          Ilustrasi Pemotongan:
        </span>

        {/* Visual Bar segments */}
        <div className="flex w-full max-w-sm h-12 rounded-xl overflow-hidden border-2 border-stone-300 shadow-xs">
          {Array.from({ length: totalSegments }).map((_, i) => {
            let bg = 'bg-stone-200';
            let label = `${i + 1}`;
            let textColor = 'text-stone-400';

            if (i < remainingCount) {
              bg = 'bg-emerald-500';
              label = 'Sisa';
              textColor = 'text-white';
            } else if (i < initialFilled) {
              bg = 'bg-rose-400';
              label = 'Dimakan/Diambil';
              textColor = 'text-white';
            }

            return (
              <div
                key={i}
                className={`flex-1 ${bg} border-r border-white/40 flex items-center justify-center transition-all`}
                title={`Potongan ke-${i + 1}`}
              >
                <span className={`text-[10px] font-black ${textColor} truncate px-0.5`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold mt-3 text-stone-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500 inline-block"></span>
            <span>Sisa yang dicari ({remainingCount} bagian)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-rose-400 inline-block"></span>
            <span>Bagian yang dipotong / dimakan ({removedCount} bagian)</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-3xl border-3 border-amber-300 p-5 sm:p-7 shadow-md">
        {/* Story Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-amber-100 pb-4">
          <div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Sesi 4: Pengurangan Kontekstual (10 Menit)
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-stone-800 mt-1">
              ➖ Cerita Pecahan Anak Dukuhwaru
            </h3>
          </div>

          {/* Quick story selector tabs */}
          <div className="flex flex-wrap gap-1.5">
            {DUKUHWARU_STORIES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => handleSelectStory(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                  currentIdx === idx
                    ? 'bg-amber-400 border-amber-500 text-stone-900 shadow-sm'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                Cerita #{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Active Story Card */}
        <div className="bg-amber-50/70 rounded-3xl border-2 border-amber-200 p-5 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md">
              📍 {currentStory.location}
            </span>
            <span className="text-xs font-bold text-stone-500">
              Soal #{currentStory.id} dari {DUKUHWARU_STORIES.length}
            </span>
          </div>

          <h4 className="text-lg sm:text-xl font-black text-amber-950 mb-2">
            {currentStory.title}
          </h4>

          <p className="text-stone-800 font-medium text-sm sm:text-base leading-relaxed mb-4">
            {currentStory.story}
          </p>

          {/* Visual story representation */}
          {renderStoryVisual()}
        </div>

        {/* Mathematical Equation & Interactive Answer Box */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 my-6 bg-stone-50 p-4 sm:p-6 rounded-3xl border border-stone-200">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block w-full text-center mb-1">
            Kalimat Matematika:
          </span>

          {/* Fraction 1 */}
          <div className="flex flex-col items-center bg-white px-4 py-3 rounded-2xl border-2 border-stone-300 shadow-xs min-w-[70px]">
            <span className="text-3xl font-black text-amber-700">{currentStory.f1.num}</span>
            <div className="w-10 h-1 bg-stone-800 rounded-full my-1"></div>
            <span className="text-3xl font-black text-amber-700">{currentStory.f1.den}</span>
          </div>

          <span className="text-4xl font-black text-stone-700">-</span>

          {/* Fraction 2 */}
          <div className="flex flex-col items-center bg-white px-4 py-3 rounded-2xl border-2 border-stone-300 shadow-xs min-w-[70px]">
            <span className="text-3xl font-black text-rose-600">{currentStory.f2.num}</span>
            <div className="w-10 h-1 bg-stone-800 rounded-full my-1"></div>
            <span className="text-3xl font-black text-rose-600">{currentStory.f2.den}</span>
          </div>

          <span className="text-4xl font-black text-stone-700">=</span>

          {/* Answer Inputs */}
          <div className="flex flex-col items-center bg-yellow-50 px-3 py-2 rounded-2xl border-2 border-amber-400 shadow-xs">
            <input
              type="number"
              placeholder="?"
              value={ansNum}
              onChange={(e) => setAnsNum(e.target.value)}
              aria-label="Isi Pembilang Hasil Pengurangan"
              className="w-14 h-11 text-center font-black text-2xl bg-white border-2 border-amber-300 rounded-xl focus:outline-emerald-500 text-amber-700"
            />
            <div className="w-12 h-1 bg-stone-700 rounded-full my-1.5"></div>
            <input
              type="number"
              placeholder="?"
              value={ansDen}
              onChange={(e) => setAnsDen(e.target.value)}
              aria-label="Isi Penyebut Hasil Pengurangan"
              className="w-14 h-11 text-center font-black text-2xl bg-white border-2 border-amber-300 rounded-xl focus:outline-emerald-500 text-emerald-700"
            />
          </div>

          <button
            onClick={checkAnswer}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-stone-900 font-black text-sm sm:text-base rounded-2xl shadow-md transition-all active:scale-95"
          >
            Cek Jawaban
          </button>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl border-2 text-sm sm:text-base font-semibold mb-4 ${
              feedback.correct
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Toggle Step Details Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              sound.playClick();
              setShowSteps(!showSteps);
            }}
            className="text-xs sm:text-sm font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-4 py-2 rounded-xl border border-amber-300 transition-all"
          >
            {showSteps ? 'Sembunyikan Langkah Solusi 🔼' : 'Lihat Langkah Solusi Lengkap 🔽'}
          </button>
        </div>

        {/* Detailed steps panel */}
        {showSteps && (
          <div className="bg-white border-2 border-amber-200 rounded-2xl p-4 mt-4 space-y-2 text-sm text-stone-700">
            <span className="font-bold text-amber-900 block mb-1">
              📝 Langkah Penyelesaian Cerita:
            </span>
            {stepResult.steps.map((st, i) => (
              <p key={i} className="flex items-center gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>{st}</span>
              </p>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
