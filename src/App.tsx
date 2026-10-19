import React, { useState, useEffect } from 'react';
import { sound } from './utils/audio';
import { MascotSiPintar } from './components/MascotSiPintar';
import { FractionVisualizer } from './components/FractionVisualizer';
import { SectionCompareOrder } from './components/SectionCompareOrder';
import { SectionAddition } from './components/SectionAddition';
import { SectionSubtraction } from './components/SectionSubtraction';
import { SectionQuizCertificate } from './components/SectionQuizCertificate';
import { ExportHtmlModal } from './components/ExportHtmlModal';

type TabType = 1 | 2 | 3 | 4 | 5;

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // 60-Minute Master Learning Timer
  const [secondsLeft, setSecondsLeft] = useState<number>(60 * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(true);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleTabChange = (tab: TabType) => {
    sound.playClick();
    setActiveTab(tab);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    sound.enabled = next;
    setSoundEnabled(next);
    if (next) sound.playClick();
  };

  const toggleTimer = () => {
    sound.playClick();
    setTimerRunning((prev) => !prev);
  };

  const mascotMessages: Record<TabType, { msg: string; sub?: string }> = {
    1: {
      msg: 'Selamat datang di Sesi 1 (10 Menit)! Geser slider pembilang & penyebut atau klik potongan pizzanya untuk merasakan konsep pecahan!',
      sub: 'Ingat: Pembilang ada di atas (potongan yang diwarnai), Penyebut ada di bawah (seluruh potongan)!',
    },
    2: {
      msg: 'Di Sesi 2 (15 Menit), kita jadi detektif pecahan! Gunakan Trik Kali Silang dan Garis Bilangan untuk membandingkan dan menyusun kartu pecahan!',
      sub: 'Trik Kali Silang sangat cepat: a/b ... c/d cukup bandingkan (a × d) dengan (b × c)!',
    },
    3: {
      msg: 'Sesi 3 (15 Menit): Penjumlahan Pecahan! Jika penyebutnya belum sama, klik tombol "Bantuan KPK" untuk melihat langkah menyamakannya bersama Si Pintar!',
      sub: 'Kelipatan Persekutuan Terkecil (KPK) adalah kunci emas untuk menjumlahkan pecahan beda penyebut.',
    },
    4: {
      msg: 'Sesi 4 (10 Menit): Bantu warga Dukuhwaru menghitung sisa martabak manis dan pita hiasan karnaval dengan pengurangan pecahan kontekstual!',
      sub: 'Baca ceritanya baik-baik, lalu kurangkan bagian yang dipotong atau dimakan.',
    },
    5: {
      msg: 'Puncak Petualangan! Kerjakan Kuis Tantangan Juara Pecahan (minimal 20 soal) dan raih Sertifikat Kelulusan Saung Pintar dengan namamu sendiri!',
      sub: 'Dapatkan nilai 100 untuk meraih predikat Bintang 3 (⭐⭐⭐)!',
    },
  };

  return (
    <div className="min-h-screen bg-amber-50/50 text-stone-800 flex flex-col font-sans selection:bg-amber-300 selection:text-amber-950">
      {/* APP HEADER */}
      <header className="bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 border-b-4 border-amber-500 shadow-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border-2 border-amber-600 transition-transform hover:scale-105">
              🦉
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-900 bg-white/70 px-2 py-0.5 rounded-full inline-block">
                Bimbel Saung Pintar Dukuhwaru
              </span>
              <h1 className="text-sm sm:text-lg md:text-xl font-black text-stone-900 leading-tight">
                Petualangan Pecahan - Matematika Kelas 5 SD
              </h1>
            </div>
          </div>

          {/* Right Controls: Timer + Audio + Single-file Download button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 60-Minute Session Countdown Timer */}
            <div className="bg-white/90 border-2 border-amber-600 rounded-2xl px-2.5 sm:px-3 py-1.5 flex items-center gap-2 shadow-xs">
              <span className="text-base sm:text-lg">⏱️</span>
              <div>
                <div className="text-[9px] font-bold text-stone-500 uppercase leading-none">
                  Sesi 60 Menit
                </div>
                <div className="text-sm sm:text-base font-black text-amber-700 leading-none mt-0.5">
                  {formatTimer(secondsLeft)}
                </div>
              </div>
              <button
                onClick={toggleTimer}
                className="text-[11px] px-1.5 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded font-bold transition ml-0.5"
                title={timerRunning ? 'Jeda Timer' : 'Lanjutkan Timer'}
              >
                {timerRunning ? 'Jeda' : 'Mulai'}
              </button>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white border-2 border-amber-600 text-stone-800 flex items-center justify-center font-bold text-base sm:text-lg hover:bg-amber-100 shadow-xs transition"
              title={soundEnabled ? 'Matikan Suara Efek' : 'Nyalakan Suara Efek'}
              aria-label="Pengaturan Suara Efek"
            >
              {soundEnabled ? '🔔' : '🔕'}
            </button>

            {/* Single-File HTML Export Modal Opener */}
            <button
              onClick={() => {
                sound.playClick();
                setShowExportModal(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-amber-600 text-amber-900 font-extrabold text-xs rounded-2xl hover:bg-amber-100 shadow-xs transition active:scale-95"
              title="Lihat atau Unduh File Single HTML Tunggal"
            >
              <span>💾</span>
              <span>Kode Single HTML</span>
            </button>
          </div>
        </div>

        {/* 5-Session Navigation Tabs */}
        <nav
          className="max-w-6xl mx-auto px-2 pt-1 pb-2 overflow-x-auto flex items-center gap-1.5 sm:gap-2"
          aria-label="Navigasi Sesi Belajar"
        >
          <button
            onClick={() => handleTabChange(1)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all border-2 ${
              activeTab === 1
                ? 'bg-white text-stone-900 border-amber-600 shadow-sm'
                : 'text-amber-950 border-transparent hover:bg-white/50'
            }`}
          >
            🍕 1. Eksplorasi (10m)
          </button>
          <button
            onClick={() => handleTabChange(2)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all border-2 ${
              activeTab === 2
                ? 'bg-white text-stone-900 border-amber-600 shadow-sm'
                : 'text-amber-950 border-transparent hover:bg-white/50'
            }`}
          >
            ⚖️ 2. Banding & Urut (15m)
          </button>
          <button
            onClick={() => handleTabChange(3)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all border-2 ${
              activeTab === 3
                ? 'bg-white text-stone-900 border-amber-600 shadow-sm'
                : 'text-amber-950 border-transparent hover:bg-white/50'
            }`}
          >
            ➕ 3. Penjumlahan KPK (15m)
          </button>
          <button
            onClick={() => handleTabChange(4)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all border-2 ${
              activeTab === 4
                ? 'bg-white text-stone-900 border-amber-600 shadow-sm'
                : 'text-amber-950 border-transparent hover:bg-white/50'
            }`}
          >
            ➖ 4. Pengurangan Cerita (10m)
          </button>
          <button
            onClick={() => handleTabChange(5)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all border-2 ${
              activeTab === 5
                ? 'bg-white text-stone-900 border-amber-600 shadow-sm'
                : 'text-amber-950 border-transparent hover:bg-white/50'
            }`}
          >
            🏆 5. Kuis Juara (10m)
          </button>
        </nav>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-5xl w-full mx-auto p-4 sm:p-6 flex-1 space-y-6">
        {/* Dynamic Mascot Guidance Header */}
        <MascotSiPintar
          message={mascotMessages[activeTab].msg}
          subtext={mascotMessages[activeTab].sub}
          mood={activeTab === 5 ? 'cheering' : 'happy'}
        />

        {/* ACTIVE SECTION CONTENT */}
        {activeTab === 1 && (
          <div className="space-y-6">
            <FractionVisualizer initialNum={3} initialDen={4} interactive={true} />
          </div>
        )}

        {activeTab === 2 && <SectionCompareOrder />}

        {activeTab === 3 && <SectionAddition />}

        {activeTab === 4 && <SectionSubtraction />}

        {activeTab === 5 && <SectionQuizCertificate />}

        {/* Mobile quick HTML export link */}
        <div className="sm:hidden text-center pt-2">
          <button
            onClick={() => setShowExportModal(true)}
            className="text-xs font-bold text-amber-800 underline bg-amber-100/80 px-3 py-1.5 rounded-xl inline-block"
          >
            💾 Unduh / Salin Kode Single-File HTML
          </button>
        </div>
      </main>

      {/* APP FOOTER */}
      <footer className="bg-amber-200/60 border-t-2 border-amber-300 py-4 px-4 text-center text-xs text-stone-600 mt-10 print:hidden">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-bold text-stone-700">
            ✨ Saung Pintar Dukuhwaru • Media Belajar Interaktif Matematika Kelas 5 SD Bab 3
          </p>
          <p className="text-stone-500">
            Dirancang khusus untuk bimbel 60 menit menyenangkan, aktif & mandiri.
          </p>
        </div>
      </footer>

      {/* Single-File HTML Modal */}
      <ExportHtmlModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
}
