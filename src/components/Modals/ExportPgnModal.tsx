import React, { useState } from 'react';
import { useChessStudy } from '../../context/ChessStudyContext';
import { X, Download, Copy, Check, FileCheck, Share2 } from 'lucide-react';

interface ExportPgnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportPgnModal: React.FC<ExportPgnModalProps> = ({ isOpen, onClose }) => {
  const { exportCurrentGamePgn, currentGame } = useChessStudy();

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const pgnContent = exportCurrentGamePgn();

  const handleCopy = () => {
    navigator.clipboard.writeText(pgnContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `${currentGame.white.replace(/\s+/g, '_')}_vs_${currentGame.black.replace(/\s+/g, '_')}_${currentGame.year}_annotated.pgn`;
    const blob = new Blob([pgnContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-[#090d16] border border-slate-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#090d16]">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Export Annotated PGN</h3>
              <p className="text-xs text-slate-400">
                Includes full comments, 4-questions analysis, and standard ChessBase/Lichess [%csl]/[%cal] glyphs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold text-slate-200">
              {currentGame.white} vs {currentGame.black} ({currentGame.year})
            </span>
            <span className="text-[11px] font-mono text-emerald-400">Standard PGN Format</span>
          </div>

          <div className="relative">
            <pre className="w-full bg-[#020617] border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 max-h-80 overflow-y-auto whitespace-pre-wrap select-all leading-relaxed">
              {pgnContent}
            </pre>
          </div>

          <div className="bg-[#020617]/60 rounded-lg p-2.5 text-[11px] text-slate-400 border border-slate-800 space-y-1">
            <div className="font-semibold text-slate-300">Compatibility Note:</div>
            <p>
              • Arrows are serialized using <code className="text-emerald-400 font-mono">[%cal Ge3e4,Re4d6]</code> (Green, Red, Blue, Yellow).
            </p>
            <p>
              • Highlighted squares use <code className="text-emerald-400 font-mono">[%csl Gd5,Rc6]</code>.
            </p>
            <p>
              • Open this file in Lichess Study, ChessBase, or Chess.com Analysis with 100% visual fidelity.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#090d16] flex items-center justify-end space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy PGN</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .pgn File</span>
          </button>
        </div>
      </div>
    </div>
  );
};
