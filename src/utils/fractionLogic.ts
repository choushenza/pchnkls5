/**
 * Pure mathematical logic for 5th grade fractions:
 * - GCD (FPB) & LCM (KPK)
 * - Fraction reduction & simplification
 * - Comparison (<, >, =)
 * - Addition & Subtraction with step-by-step intermediate representations
 * - Ordering verification
 * - Quiz question generator & scoring
 */

export interface Fraction {
  num: number;
  den: number;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a * b) / gcd(a, b));
}

export function simplifyFraction(f: Fraction): Fraction {
  if (f.den === 0) return { num: 0, den: 1 };
  const d = gcd(f.num, f.den);
  const sign = f.den < 0 ? -1 : 1;
  return {
    num: (f.num / d) * sign,
    den: (f.den / d) * sign,
  };
}

export function compareFractions(f1: Fraction, f2: Fraction): '<' | '>' | '=' {
  const left = f1.num * f2.den;
  const right = f2.num * f1.den;
  if (left < right) return '<';
  if (left > right) return '>';
  return '=';
}

export interface FractionStepResult {
  commonDen: number;
  f1Equiv: Fraction;
  f2Equiv: Fraction;
  resultNum: number;
  resultDen: number;
  simplified: Fraction;
  isSameDen: boolean;
  steps: string[];
}

export function addFractions(f1: Fraction, f2: Fraction): FractionStepResult {
  const isSame = f1.den === f2.den;
  const kpk = isSame ? f1.den : lcm(f1.den, f2.den);
  const m1 = kpk / f1.den;
  const m2 = kpk / f2.den;

  const f1Equiv: Fraction = { num: f1.num * m1, den: kpk };
  const f2Equiv: Fraction = { num: f2.num * m2, den: kpk };
  const resultNum = f1Equiv.num + f2Equiv.num;
  const simplified = simplifyFraction({ num: resultNum, den: kpk });

  const steps: string[] = [];
  if (isSame) {
    steps.push(`Karena penyebut sudah sama (${f1.den}), langsung jumlahkan pembilangnya: ${f1.num} + ${f2.num} = ${resultNum}.`);
    steps.push(`Hasil: ${resultNum}/${kpk}`);
  } else {
    steps.push(`Cari KPK dari penyebut ${f1.den} dan ${f2.den} -> KPK = ${kpk}.`);
    steps.push(`Ubah pecahan pertama: ${f1.num}/${f1.den} = (${f1.num} × ${m1})/(${f1.den} × ${m1}) = ${f1Equiv.num}/${kpk}.`);
    steps.push(`Ubah pecahan kedua: ${f2.num}/${f2.den} = (${f2.num} × ${m2})/(${f2.den} × ${m2}) = ${f2Equiv.num}/${kpk}.`);
    steps.push(`Jumlahkan pembilangnya: ${f1Equiv.num} + ${f2Equiv.num} = ${resultNum}/${kpk}.`);
  }

  if (simplified.num !== resultNum || simplified.den !== kpk) {
    const fpb = gcd(resultNum, kpk);
    steps.push(`Sederhanakan dengan membagi pembilang & penyebut dengan FPB (${fpb}) -> ${simplified.num}/${simplified.den}.`);
  }

  return {
    commonDen: kpk,
    f1Equiv,
    f2Equiv,
    resultNum,
    resultDen: kpk,
    simplified,
    isSameDen: isSame,
    steps,
  };
}

export function subtractFractions(f1: Fraction, f2: Fraction): FractionStepResult {
  const isSame = f1.den === f2.den;
  const kpk = isSame ? f1.den : lcm(f1.den, f2.den);
  const m1 = kpk / f1.den;
  const m2 = kpk / f2.den;

  const f1Equiv: Fraction = { num: f1.num * m1, den: kpk };
  const f2Equiv: Fraction = { num: f2.num * m2, den: kpk };
  const resultNum = f1Equiv.num - f2Equiv.num;
  const simplified = simplifyFraction({ num: resultNum, den: kpk });

  const steps: string[] = [];
  if (isSame) {
    steps.push(`Karena penyebut sudah sama (${f1.den}), kurangkan pembilangnya: ${f1.num} - ${f2.num} = ${resultNum}.`);
    steps.push(`Hasil: ${resultNum}/${kpk}`);
  } else {
    steps.push(`Cari KPK dari penyebut ${f1.den} dan ${f2.den} -> KPK = ${kpk}.`);
    steps.push(`Ubah pecahan pertama: ${f1.num}/${f1.den} = (${f1.num} × ${m1})/(${f1.den} × ${m1}) = ${f1Equiv.num}/${kpk}.`);
    steps.push(`Ubah pecahan kedua: ${f2.num}/${f2.den} = (${f2.num} × ${m2})/(${f2.den} × ${m2}) = ${f2Equiv.num}/${kpk}.`);
    steps.push(`Kurangkan pembilangnya: ${f1Equiv.num} - ${f2Equiv.num} = ${resultNum}/${kpk}.`);
  }

  if (simplified.num !== resultNum || simplified.den !== kpk) {
    const fpb = gcd(Math.abs(resultNum), kpk);
    steps.push(`Sederhanakan dengan FPB (${fpb}) -> ${simplified.num}/${simplified.den}.`);
  }

  return {
    commonDen: kpk,
    f1Equiv,
    f2Equiv,
    resultNum,
    resultDen: kpk,
    simplified,
    isSameDen: isSame,
    steps,
  };
}

export function isSortedAscending(fractions: Fraction[]): boolean {
  for (let i = 0; i < fractions.length - 1; i++) {
    const currentVal = fractions[i].num / fractions[i].den;
    const nextVal = fractions[i + 1].num / fractions[i + 1].den;
    if (currentVal > nextVal) {
      return false;
    }
  }
  return true;
}

export interface QuizQuestion {
  id: number;
  type: 'multiple-choice' | 'short-answer';
  question: string;
  storyContext?: string;
  options?: string[]; // for multiple choice
  correctAnswer: string; // e.g. "3/4" or option value
  explanation: string;
}

export const QUIZ_BANK: QuizQuestion[] = [
  {
    id: 1,
    type: 'multiple-choice',
    question: 'Berapakah hasil dari 2/7 + 3/7?',
    storyContext: 'Dua potong kue tradisional Saung Pintar',
    options: ['5/14', '5/7', '6/7', '1/7'],
    correctAnswer: '5/7',
    explanation: 'Karena penyebut sudah sama-sama 7, cukup jumlahkan pembilangnya: 2 + 3 = 5, jadi 5/7.',
  },
  {
    id: 2,
    type: 'multiple-choice',
    question: 'Tanda perbandingan yang tepat untuk 1/2 ... 3/4 adalah?',
    storyContext: 'Membandingkan panjang pita hiasan',
    options: ['>', '<', '=', 'Semua Benar'],
    correctAnswer: '<',
    explanation: '1/2 sama dengan 2/4. Karena 2/4 lebih kecil dari 3/4, maka tandanya adalah <.',
  },
  {
    id: 3,
    type: 'multiple-choice',
    question: 'Berapakah KPK dari penyebut pecahan 1/3 dan 1/4?',
    storyContext: 'Menyamakan penyebut sebelum menjumlahkan',
    options: ['7', '12', '14', '6'],
    correctAnswer: '12',
    explanation: 'Kelipatan 3: 3, 6, 9, 12... dan kelipatan 4: 4, 8, 12... KPK-nya adalah 12.',
  },
  {
    id: 4,
    type: 'multiple-choice',
    question: 'Ibu membeli 1 loyang Martabak Dukuhwaru dipotong 8 bagian (8/8). Dimakan adik 3/8 bagian. Berapa bagian sisa martabak?',
    storyContext: 'Martabak Manis Dukuhwaru',
    options: ['5/8', '3/8', '2/8', '6/8'],
    correctAnswer: '5/8',
    explanation: '8/8 - 3/8 = (8 - 3)/8 = 5/8 bagian martabak tersisa.',
  },
  {
    id: 5,
    type: 'short-answer',
    question: 'Hitunglah hasil dari: 1/4 + 1/2 = ... (tulis dalam bentuk pecahan sederhana, contoh: 3/4)',
    storyContext: 'Penjumlahan beda penyebut',
    correctAnswer: '3/4',
    explanation: '1/2 diubah menjadi 2/4. Lalu 1/4 + 2/4 = 3/4.',
  },
  {
    id: 6,
    type: 'multiple-choice',
    question: 'Hasil pengurangan 5/6 - 1/3 adalah...',
    storyContext: 'Kue Talam Saung Pintar',
    options: ['1/2', '4/3', '4/6', '2/3'],
    correctAnswer: '1/2',
    explanation: '1/3 = 2/6. Maka 5/6 - 2/6 = 3/6, disederhanakan (bagi 3) menjadi 1/2.',
  },
  {
    id: 7,
    type: 'multiple-choice',
    question: 'Urutan pecahan dari terkecil ke terbesar berikut yang benar adalah...',
    storyContext: 'Mengurutkan pecahan',
    options: ['1/4, 1/2, 3/4', '3/4, 1/2, 1/4', '1/2, 1/4, 3/4', '1/4, 3/4, 1/2'],
    correctAnswer: '1/4, 1/2, 3/4',
    explanation: '1/4 = 0.25, 1/2 = 0.50, 3/4 = 0.75. Urutan terkecil ke terbesar adalah 1/4, 1/2, 3/4.',
  },
  {
    id: 8,
    type: 'short-answer',
    question: 'Rian punya pita 7/10 meter, digunakan untuk sepeda 3/10 meter. Berapa meter sisa pita Rian? (Tulis pecahan sederhana, contoh: 2/5)',
    storyContext: 'Pita Karnaval Pasar Trayeman',
    correctAnswer: '2/5',
    explanation: '7/10 - 3/10 = 4/10. Disederhanakan dengan membagi 2 menjadi 2/5 meter.',
  },
  {
    id: 9,
    type: 'multiple-choice',
    question: 'Berapakah pecahan paling sederhana dari 6/8?',
    storyContext: 'Menyederhanakan pecahan dengan FPB',
    options: ['3/4', '2/4', '3/5', '1/2'],
    correctAnswer: '3/4',
    explanation: 'FPB dari 6 dan 8 adalah 2. Maka 6 ÷ 2 = 3 dan 8 ÷ 2 = 4, hasilnya 3/4.',
  },
  {
    id: 10,
    type: 'multiple-choice',
    question: 'Manakah di bawah ini pecahan yang senilai dengan 2/5?',
    storyContext: 'Konsep pecahan senilai',
    options: ['4/10', '3/10', '4/15', '5/10'],
    correctAnswer: '4/10',
    explanation: '2/5 dikali 2 pada pembilang dan penyebut menjadi (2×2)/(5×2) = 4/10.',
  },
  {
    id: 11,
    type: 'short-answer',
    question: 'Berapakah hasil dari 2/5 + 1/10 = ... (tulis dalam pecahan paling sederhana, contoh: 1/2)',
    storyContext: 'Penjumlahan pecahan beda penyebut',
    correctAnswer: '1/2',
    explanation: '2/5 = 4/10. Maka 4/10 + 1/10 = 5/10, disederhanakan bagi 5 menjadi 1/2.',
  },
  {
    id: 12,
    type: 'multiple-choice',
    question: 'Tanda yang tepat untuk membandingkan 3/5 ... 2/3 adalah?',
    storyContext: 'Perbandingan kali silang',
    options: ['<', '>', '=', '≥'],
    correctAnswer: '<',
    explanation: 'Kali silang: 3 × 3 = 9 dan 2 × 5 = 10. Karena 9 < 10, maka 3/5 < 2/3.',
  },
  {
    id: 13,
    type: 'multiple-choice',
    question: 'Hasil dari 4/9 + 2/9 - 1/9 adalah...',
    storyContext: 'Operasi campuran berpenyebut sama',
    options: ['5/9', '6/9', '7/9', '3/9'],
    correctAnswer: '5/9',
    explanation: '(4 + 2 - 1)/9 = 5/9.',
  },
  {
    id: 14,
    type: 'short-answer',
    question: 'Hitunglah pengurangan: 3/4 - 1/8 = ... (tulis dalam pecahan biasa, contoh: 5/8)',
    storyContext: 'Pengurangan pecahan beda penyebut',
    correctAnswer: '5/8',
    explanation: '3/4 diubah menjadi 6/8. Maka 6/8 - 1/8 = 5/8.',
  },
  {
    id: 15,
    type: 'multiple-choice',
    question: 'Paman panen semangka di Desa Dukuhwaru. Sebanyak 1/2 bagian dibagikan ke tetangga dan 1/4 bagian dijual. Berapa total bagian semangka yang sudah dikeluarkan?',
    storyContext: 'Kebun Buah Dukuhwaru',
    options: ['3/4', '2/6', '2/4', '1/4'],
    correctAnswer: '3/4',
    explanation: '1/2 + 1/4 = 2/4 + 1/4 = 3/4 bagian.',
  },
  {
    id: 16,
    type: 'multiple-choice',
    question: 'Pecahan biasa dari pecahan campuran 1 1/2 adalah...',
    storyContext: 'Pecahan campuran ke biasa',
    options: ['3/2', '2/2', '4/2', '1/2'],
    correctAnswer: '3/2',
    explanation: '1 1/2 = (1 × 2 + 1)/2 = 3/2.',
  },
  {
    id: 17,
    type: 'multiple-choice',
    question: 'KPK dari penyebut pecahan 1/6 dan 1/8 adalah...',
    storyContext: 'Mencari kelipatan persekutuan',
    options: ['24', '14', '48', '18'],
    correctAnswer: '24',
    explanation: 'Kelipatan 6: 6, 12, 18, 24... Kelipatan 8: 8, 16, 24... KPK terkecilnya adalah 24.',
  },
  {
    id: 18,
    type: 'short-answer',
    question: 'Berapakah bentuk pecahan paling sederhana dari 10/15? (contoh: 2/3)',
    storyContext: 'Penyederhanaan pecahan',
    correctAnswer: '2/3',
    explanation: '10 dan 15 dibagi FPB-nya yaitu 5: 10 ÷ 5 = 2, 15 ÷ 5 = 3, jadi 2/3.',
  },
  {
    id: 19,
    type: 'multiple-choice',
    question: 'Siti mempunyai gula 4/5 kg. Digunakan untuk membuat teh manis di Saung Pintar sebanyak 2/5 kg. Sisa gula Siti adalah...',
    storyContext: 'Minuman Teh Hangat Saung Pintar',
    options: ['2/5 kg', '1/5 kg', '3/5 kg', '6/5 kg'],
    correctAnswer: '2/5 kg',
    explanation: '4/5 kg - 2/5 kg = (4 - 2)/5 kg = 2/5 kg.',
  },
  {
    id: 20,
    type: 'multiple-choice',
    question: 'Manakah perbandingan yang BENAR berikut ini?',
    storyContext: 'Evaluasi pecahan',
    options: ['2/3 > 1/2', '1/3 > 1/2', '3/4 < 1/2', '2/5 > 3/5'],
    correctAnswer: '2/3 > 1/2',
    explanation: '2/3 ≈ 0.67 sedangkan 1/2 = 0.50. Maka 2/3 > 1/2 adalah pernyataan yang benar.',
  },
  {
    id: 21,
    type: 'short-answer',
    question: 'Hitunglah penjumlahan: 1/6 + 1/3 = ... (tulis dalam bentuk paling sederhana, contoh: 1/2)',
    storyContext: 'Penjumlahan pecahan beda penyebut',
    correctAnswer: '1/2',
    explanation: '1/3 = 2/6. Maka 1/6 + 2/6 = 3/6, disederhanakan bagi 3 menjadi 1/2.',
  },
  {
    id: 22,
    type: 'multiple-choice',
    question: 'Sebuah pizza utuh dipotong menjadi 12 potong sama besar. Andi makan 4 potong, Budi makan 5 potong. Berapa sisa bagian pizza?',
    storyContext: 'Membagi makanan bersama teman',
    options: ['3/12', '9/12', '4/12', '2/12'],
    correctAnswer: '3/12',
    explanation: 'Total dimakan = 4/12 + 5/12 = 9/12. Sisa pizza = 12/12 - 9/12 = 3/12 (atau 1/4).',
  },
  {
    id: 23,
    type: 'multiple-choice',
    question: 'Berapakah nilai desimal dari pecahan 3/4?',
    storyContext: 'Hubungan pecahan dan desimal',
    options: ['0.75', '0.50', '0.25', '0.80'],
    correctAnswer: '0.75',
    explanation: '3 ÷ 4 = 0.75.',
  },
  {
    id: 24,
    type: 'short-answer',
    question: 'Hitunglah: 5/7 - 2/7 = ... (tulis pecahan sederhana, contoh: 3/7)',
    storyContext: 'Pengurangan penyebut sama',
    correctAnswer: '3/7',
    explanation: 'Karena penyebut sama, kurangkan pembilangnya: 5 - 2 = 3, hasilnya 3/7.',
  },
  {
    id: 25,
    type: 'multiple-choice',
    question: 'Di antara pecahan 1/8, 1/4, 1/2, dan 1/3, manakah pecahan yang nilainya PALING BESAR?',
    storyContext: 'Menentukan nilai terbesar pecahan satu per',
    options: ['1/2', '1/3', '1/4', '1/8'],
    correctAnswer: '1/2',
    explanation: 'Dengan pembilang sama (1), semakin kecil nilai penyebutnya, maka semakin besar nilai pecahannya. 1/2 adalah yang terbesar.',
  },
  {
    id: 26,
    type: 'multiple-choice',
    question: 'Berapakah bentuk pecahan paling sederhana dari 25%?',
    storyContext: 'Mengubah persen ke pecahan biasa',
    options: ['1/4', '1/2', '2/5', '1/5'],
    correctAnswer: '1/4',
    explanation: '25% = 25/100. Dibagi FPB (25): 25÷25 = 1 dan 100÷25 = 4, menjadi 1/4.',
  },
  {
    id: 27,
    type: 'multiple-choice',
    question: 'Hasil penjumlahan pecahan 3/5 + 1/4 adalah...',
    storyContext: 'Penjumlahan beda penyebut',
    options: ['17/20', '4/9', '4/20', '7/20'],
    correctAnswer: '17/20',
    explanation: 'KPK dari 5 dan 4 adalah 20. 3/5 = 12/20 dan 1/4 = 5/20. Dijumlahkan: 12/20 + 5/20 = 17/20.',
  },
  {
    id: 28,
    type: 'multiple-choice',
    question: 'Pak Budi memiliki beras 5/8 karung. Digunakan untuk konsumsi belajar kelompok Saung Pintar sebanyak 1/4 karung. Sisa beras Pak Budi adalah...',
    storyContext: 'Persediaan beras Saung Pintar',
    options: ['3/8 karung', '4/8 karung', '2/8 karung', '1/8 karung'],
    correctAnswer: '3/8 karung',
    explanation: '1/4 disamakan penyebutnya menjadi 2/8. Maka 5/8 - 2/8 = 3/8 karung.',
  },
  {
    id: 29,
    type: 'multiple-choice',
    question: 'Urutan pecahan 2/3, 1/6, 1/2 dari yang TERKECIL ke TERBESAR adalah...',
    storyContext: 'Mengurutkan tiga pecahan berbeda penyebut',
    options: ['1/6, 1/2, 2/3', '1/6, 2/3, 1/2', '1/2, 1/6, 2/3', '2/3, 1/2, 1/6'],
    correctAnswer: '1/6, 1/2, 2/3',
    explanation: 'Samakan penyebut ke 6: 1/6, 3/6 (1/2), 4/6 (2/3). Jadi urutan terkecil: 1/6, 1/2, 2/3.',
  },
  {
    id: 30,
    type: 'short-answer',
    question: 'Ubahlah pecahan biasa tidak murni 7/3 menjadi bentuk pecahan campuran! (format jawaban contoh: 2 1/3)',
    storyContext: 'Pecahan biasa ke pecahan campuran',
    correctAnswer: '2 1/3',
    explanation: '7 dibagi 3 hasilnya 2 sisa 1, sehingga bentuk pecahannya adalah 2 1/3.',
  },
];

export function calculateScore(correctCount: number, totalQuestions: number): { score: number; stars: number } {
  if (totalQuestions === 0) return { score: 0, stars: 0 };
  const score = Math.round((correctCount / totalQuestions) * 100);
  let stars = 1;
  if (score >= 80) stars = 3;
  else if (score >= 60) stars = 2;
  else stars = 1;
  return { score, stars };
}
