import React, { useState } from 'react';
import { generateSingleFileHtml } from '../utils/generateSingleFileHtml';
import { sound } from '../utils/audio';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportHtmlModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);
  if (!isOpen) return null;

  const htmlCode = generateSingleFileHtml();

  const handleCopy = async () => {
    sound.playClick();
    try {
      await navigator.clipboard.writeText(htmlCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    sound.playClick();
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'petualangan-pecahan-saung-pintar.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl border-4 border-amber-400 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-200 border-b-2 border-amber-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📄</span>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-amber-950">
                Kode Single-File HTML/JS/CSS Lengkap
              </h3>
              <p className="text-xs text-amber-900 font-semibold">
                100% Mandiri (Self-Contained), siap dibuka offline di browser apa saja!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-stone-700 font-black flex items-center justify-center shadow-xs"
            aria-label="Tutup Modal"
          >
            ✕
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-amber-50/70 border-b border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="text-stone-700 font-medium">
            File ini berisi seluruh 5 Sesi (Visualizer, Bandingkan, KPK, Cerita, Kuis & Sertifikat).
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-white hover:bg-stone-50 border border-amber-300 rounded-xl font-bold text-stone-800 shadow-xs flex items-center gap-1.5 transition active:scale-95"
            >
              {copied ? '✅ Tersalin ke Clipboard!' : '📋 Salin Kode HTML'}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5 transition active:scale-95"
            >
              📥 Unduh File .html
            </button>
          </div>
        </div>

        {/* Code View Area */}
        <div className="p-4 flex-1 overflow-auto bg-stone-900 text-amber-100 font-mono text-xs select-all">
          <pre className="whitespace-pre-wrap">{htmlCode}</pre>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 text-center text-xs text-stone-500 font-medium">
          Dapat disimpan dengan nama file <code>index.html</code> lalu klik ganda untuk langsung membukanya di laptop/HP.
        </div>
      </div>
    </div>
  );
};
