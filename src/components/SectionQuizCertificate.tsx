import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { QUIZ_BANK, QuizQuestion, calculateScore } from '../utils/fractionLogic';

export const SectionQuizCertificate: React.FC = () => {
  // Use 20 questions by default (from the 25-question bank)
  const [questionCount, setQuestionCount] = useState<number>(20);

  const pickQuestions = (count: number): QuizQuestion[] => {
    const shuffled = [...QUIZ_BANK].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, QUIZ_BANK.length));
  };

  const [questions, setQuestions] = useState<QuizQuestion[]>(pickQuestions(20));
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>('Bintang Pelajar');
  const [showConfirmFinish, setShowConfirmFinish] = useState<boolean>(false);

  const currentQ = questions[currentQIndex];

  const handleSelectOption = (option: string) => {
    sound.playClick();
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option,
    }));
  };

  const handleTextAnswer = (val: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: val,
    }));
  };

  const handleNext = () => {
    sound.playClick();
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      checkFinish();
    }
  };

  const handlePrev = () => {
    sound.playClick();
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
    }
  };

  const jumpToQuestion = (index: number) => {
    sound.playClick();
    setCurrentQIndex(index);
    setShowConfirmFinish(false);
  };

  const answeredCount = questions.filter((q) => (answers[q.id] || '').trim() !== '').length;
  const unansweredCount = questions.length - answeredCount;

  const checkFinish = () => {
    if (unansweredCount > 0) {
      setShowConfirmFinish(true);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setShowConfirmFinish(false);
    setIsFinished(true);

    let correct = 0;
    questions.forEach((q) => {
      const userAns = (answers[q.id] || '').trim().toLowerCase();
      const actualAns = q.correctAnswer.trim().toLowerCase();
      if (userAns === actualAns) {
        correct++;
      }
    });

    const { score } = calculateScore(correct, questions.length);

    if (score >= 60) {
      sound.playFanfare();
      try {
        confetti({
          particleCount: 150,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#FACC15', '#22C55E', '#38BDF8', '#F97316', '#EC4899'],
        });
      } catch {
        // Confetti fallback
      }
    } else {
      sound.playCorrect();
    }
  };

  const restartQuiz = (newCount: number = questionCount) => {
    sound.playClick();
    setQuestionCount(newCount);
    setQuestions(pickQuestions(newCount));
    setCurrentQIndex(0);
    setAnswers({});
    setIsFinished(false);
    setShowConfirmFinish(false);
  };

  // Score calculations
  let correctCount = 0;
  questions.forEach((q) => {
    const userAns = (answers[q.id] || '').trim().toLowerCase();
    const actualAns = q.correctAnswer.trim().toLowerCase();
    if (userAns === actualAns) {
      correctCount++;
    }
  });

  const { score, stars } = calculateScore(correctCount, questions.length);

  const getTodayFormatted = () => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];
    const now = new Date();
    return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* QUIZ IN PROGRESS */}
      {!isFinished ? (
        <section className="bg-white rounded-3xl border-3 border-sky-400 p-5 sm:p-7 shadow-md">
          {/* Header & Mode info */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-sky-100 pb-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Sesi 5: Kuis Tantangan Juara Pecahan
                </span>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  🎯 {questions.length} Soal Ujian (Minimal 20 Soal)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-800 mt-1">
                🏆 Ujian Mandiri Juara Pecahan Saung Pintar
              </h2>
              {/* Question Count Selector */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-xs font-bold text-stone-600">Pilihan Jumlah Soal:</span>
                {[20, 25, 30].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => restartQuiz(cnt)}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                      questions.length === cnt
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-sky-100 hover:text-sky-800'
                    }`}
                  >
                    {cnt} Soal {cnt === 20 ? '(Standar Minimal)' : cnt === 30 ? '(Semua Bank Soal)' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-500">Dijawab:</span>
              <span className="text-sm font-black text-emerald-700 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-xl">
                {answeredCount} / {questions.length}
              </span>
            </div>
          </div>

          {/* QUESTION PALETTE / NOMOR SOAL GRID */}
          <div className="bg-sky-50/60 p-3 sm:p-4 rounded-2xl border border-sky-200 mb-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                🧭 Navigasi Cepat Nomor Soal (1 - {questions.length}):
              </span>
              <span className="text-[11px] text-stone-500 font-medium hidden sm:inline">
                Hijau = Sudah Dijawab, Putih = Belum
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {questions.map((q, idx) => {
                const isAnswered = (answers[q.id] || '').trim() !== '';
                const isCurrent = currentQIndex === idx;
                return (
                  <button
                    key={q.id}
                    onClick={() => jumpToQuestion(idx)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center border-2 ${
                      isCurrent
                        ? 'border-sky-600 bg-sky-500 text-white shadow-sm scale-105'
                        : isAnswered
                        ? 'border-emerald-500 bg-emerald-100 text-emerald-900 font-extrabold'
                        : 'border-stone-300 bg-white text-stone-600 hover:border-sky-300 hover:bg-stone-50'
                    }`}
                    aria-label={`Pindah ke soal nomor ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-stone-100 h-2.5 rounded-full mb-6 overflow-hidden border border-stone-200">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Card */}
          <div className="bg-amber-50/60 border-2 border-amber-200 rounded-2xl p-5 sm:p-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              {currentQ.storyContext ? (
                <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md inline-block">
                  📖 {currentQ.storyContext}
                </span>
              ) : <div></div>}
              <span className="text-xs font-black text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md">
                Soal #{currentQIndex + 1}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-800 mt-1 leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Answer Area */}
          <div className="my-6">
            {currentQ.type === 'multiple-choice' && currentQ.options ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((opt, i) => {
                  const isSelected = answers[currentQ.id] === opt;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(opt)}
                      className={`p-4 rounded-2xl border-3 text-left font-bold text-base transition-all flex items-center justify-between shadow-xs ${
                        isSelected
                          ? 'bg-sky-500 border-sky-700 text-white shadow-md scale-[1.01]'
                          : 'bg-white border-stone-200 text-stone-800 hover:border-sky-300 hover:bg-sky-50/50'
                      }`}
                    >
                      <span>{opt}</span>
                      <span
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
                          isSelected ? 'border-white bg-white/20 text-white' : 'border-stone-300 text-stone-400'
                        }`}
                      >
                        {['A', 'B', 'C', 'D'][i]}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="max-w-md mx-auto bg-yellow-50 p-5 rounded-2xl border-2 border-amber-300">
                <label htmlFor="jawaban-singkat" className="block text-xs font-bold text-stone-700 uppercase mb-2">
                  Tuliskan Jawaban Singkatmu:
                </label>
                <input
                  id="jawaban-singkat"
                  type="text"
                  placeholder="Contoh: 3/4"
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleTextAnswer(e.target.value)}
                  className="w-full text-center text-xl font-black p-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-sky-500 text-stone-800"
                />
                <span className="text-[11px] text-stone-500 mt-1.5 block text-center">
                  Gunakan garis miring (/) untuk pecahan, contoh: 3/4 atau 1/2
                </span>
              </div>
            )}
          </div>

          {/* Unanswered Prompt Notice if clicked Selesai prematurely */}
          {showConfirmFinish && (
            <div className="p-4 bg-amber-100 border-2 border-amber-400 rounded-2xl mb-4 text-sm text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                <span>
                  Masih ada <strong>{unansweredCount} soal</strong> yang belum kamu jawab. Apakah kamu yakin ingin menyelesaikan kuis sekarang?
                </span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowConfirmFinish(false)}
                  className="px-3.5 py-1.5 bg-white border border-stone-300 font-bold rounded-xl text-xs hover:bg-stone-50"
                >
                  Lanjut Mengerjakan
                </button>
                <button
                  onClick={finishQuiz}
                  className="px-3.5 py-1.5 bg-amber-600 text-white font-bold rounded-xl text-xs hover:bg-amber-700"
                >
                  Ya, Kumpulkan Sekarang
                </button>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-stone-200">
            <button
              onClick={handlePrev}
              disabled={currentQIndex === 0}
              className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm border border-stone-300 text-stone-600 disabled:opacity-30 hover:bg-stone-50"
            >
              ⬅️ Soal Sebelumnya
            </button>

            <button
              onClick={handleNext}
              className={`px-6 py-2.5 rounded-xl font-black text-sm sm:text-base text-white shadow-md active:scale-95 transition-all ${
                currentQIndex === questions.length - 1
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-sky-500 hover:bg-sky-600'
              }`}
            >
              {currentQIndex === questions.length - 1 ? 'Selesai & Lihat Skor 🏁' : 'Soal Berikutnya ➡️'}
            </button>
          </div>
        </section>
      ) : (
        /* QUIZ COMPLETED: RESULTS & DIGITAL CERTIFICATE */
        <div className="space-y-8">
          {/* Result Score Banner */}
          <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 rounded-3xl p-6 sm:p-8 border-4 border-amber-500 shadow-lg text-center">
            <span className="text-4xl sm:text-5xl mb-2 inline-block">🎉</span>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
              Hasil Kuis Juara Pecahan ({questions.length} Soal)!
            </h2>

            {/* Score & Stars Display */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-5">
              {/* Score Circle */}
              <div className="w-28 h-28 rounded-full bg-white border-4 border-amber-600 flex flex-col items-center justify-center shadow-md">
                <span className="text-xs font-bold text-stone-500 uppercase">Skor Akhir</span>
                <span className="text-4xl font-black text-amber-600">{score}</span>
                <span className="text-[10px] text-stone-400 font-bold">dari 100</span>
              </div>

              {/* Stars */}
              <div className="flex flex-col items-center sm:items-start">
                <div className="flex items-center gap-1.5 text-3xl sm:text-4xl">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span
                      key={i}
                      className={i < stars ? 'text-amber-600 drop-shadow' : 'text-stone-300 opacity-50'}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="text-sm font-bold text-amber-950 mt-1">
                  {stars === 3
                    ? 'Prestasi: Sangat Sempurna (Bintang 3)'
                    : stars === 2
                    ? 'Prestasi: Hebat & Memuaskan (Bintang 2)'
                    : 'Prestasi: Terus Berlatih & Hebat (Bintang 1)'}
                </span>
                <span className="text-xs text-amber-900 font-semibold">
                  Benar {correctCount} dari {questions.length} soal ({score} Poin)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <button
                onClick={() => restartQuiz(20)}
                className="px-5 py-2.5 bg-white text-stone-800 hover:bg-stone-100 font-bold text-sm rounded-xl border border-amber-600 shadow-sm transition-all"
              >
                🔄 Ulangi Kuis (Acak 20 Soal Baru)
              </button>
            </div>
          </div>

          {/* DIGITAL CERTIFICATE CARD */}
          <section id="sertifikat-container" className="bg-white rounded-3xl border-4 border-yellow-400 p-6 sm:p-10 shadow-xl relative overflow-hidden print:border-none print:shadow-none print:p-2">
            <div className="absolute inset-2 border-2 border-dashed border-amber-300 rounded-2xl pointer-events-none"></div>

            <div className="text-center relative z-10 pt-2 pb-4">
              <div className="inline-block bg-amber-100 text-amber-800 font-black text-[11px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-widest border border-amber-300 mb-2">
                Bimbel Saung Pintar Dukuhwaru • Tegal
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-black text-amber-950 tracking-tight">
                SERTIFIKAT KELULUSAN
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">
                Petualangan Pecahan Matematika Kelas 5 SD Bab 3 (Tantangan 20 Soal)
              </p>
            </div>

            <div className="text-center relative z-10 my-4 space-y-4">
              <p className="text-xs sm:text-sm text-stone-600">Diberikan dengan bangga kepada:</p>

              <div className="inline-block max-w-md w-full">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ketik Nama Siswa di sini..."
                  aria-label="Ketik Nama Siswa Penerima Sertifikat"
                  className="w-full text-center text-xl sm:text-3xl font-serif font-bold text-stone-900 border-b-2 border-amber-400 pb-1 bg-amber-50/50 focus:bg-white focus:outline-none rounded-t-lg transition-colors"
                />
                <span className="text-[10px] text-stone-400 block mt-1 no-print">
                  ✏️ Klik nama di atas untuk mengganti namamu sebelum dicetak
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 max-w-lg mx-auto leading-relaxed">
                Telah berhasil menyelesaikan rangkaian ujian <strong>{questions.length} Soal Bilangan Pecahan Kelas 5 SD</strong> meliputi Eksplorasi Visual, Membandingkan & Mengurutkan, Penjumlahan KPK, dan Pengurangan Soal Cerita dengan predikat:
              </p>

              <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm sm:text-base px-6 py-2 rounded-full shadow-md">
                🏆 JUARA PECAHAN: SKOR {score}/100 ({stars} BINTANG)
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 items-end gap-4 pt-6 border-t border-amber-200 relative z-10 text-center">
              <div>
                <span className="text-[11px] text-stone-500 block">Dukuhwaru, {getTodayFormatted()}</span>
                <div className="h-10 flex items-center justify-center font-serif italic text-emerald-800 text-sm font-bold">
                  Pak Edi / Pengajar Bimbel
                </div>
                <div className="w-28 mx-auto border-t border-stone-400"></div>
                <span className="text-[10px] font-bold text-stone-600 mt-1 block">
                  Pengajar Saung Pintar
                </span>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border-3 border-amber-500 bg-amber-50 flex flex-col items-center justify-center text-amber-800 shadow-sm rotate-6">
                  <span className="text-lg">🦉</span>
                  <span className="text-[8px] font-black uppercase tracking-tighter">
                    SAUNG PINTAR
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-stone-500 block">Dukuhwaru, Tegal</span>
                <div className="h-10 flex items-center justify-center font-serif italic text-amber-800 text-sm font-bold">
                  Si Pintar (Maskot)
                </div>
                <div className="w-28 mx-auto border-t border-stone-400"></div>
                <span className="text-[10px] font-bold text-stone-600 mt-1 block">
                  Sahabat Belajar Anak
                </span>
              </div>
            </div>

            <div className="mt-8 text-center no-print">
              <button
                onClick={handlePrint}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-stone-900 font-black text-sm sm:text-base rounded-2xl shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
              >
                <span>🖨️ Cetak / Simpan Sertifikat (PDF)</span>
              </button>
            </div>
          </section>

          {/* Comprehensive 20-Question Review */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200">
            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-3">
              📋 Pembahasan Lengkap Seluruh {questions.length} Soal:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {questions.map((q, idx) => {
                const userAns = (answers[q.id] || '').trim();
                const isCorrect = userAns.toLowerCase() === q.correctAnswer.toLowerCase();
                return (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-bold text-stone-800">
                        {idx + 1}. {q.question}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-black flex-shrink-0 ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isCorrect ? `Benar (+${Math.round(100 / questions.length)})` : 'Salah'}
                      </span>
                    </div>
                    <p className="text-stone-600 text-xs">
                      Jawabanmu: <span className="font-bold text-stone-800">{userAns || '(Kosong)'}</span> | Kunci: <span className="font-bold text-emerald-700">{q.correctAnswer}</span>
                    </p>
                    <p className="text-amber-800 bg-amber-50 p-2 rounded-lg mt-1.5 text-xs">
                      💡 {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
