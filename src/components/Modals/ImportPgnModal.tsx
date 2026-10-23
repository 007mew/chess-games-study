import React, { useState } from 'react';
import { useChessStudy } from '../../context/ChessStudyContext';
import { PawnStructureType } from '../../types/chess';
import { fetchPgnFromUrl, detectGameUrl } from '../../services/linkImporter';
import {
  X,
  Upload,
  FileText,
  Link2,
  Globe,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ClipboardCopy,
} from 'lucide-react';
import { inferPawnStructure } from '../../utils/pgnParser';

interface ImportPgnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportPgnModal: React.FC<ImportPgnModalProps> = ({ isOpen, onClose }) => {
  const { importPgn } = useChessStudy();

  const [activeTab, setActiveTab] = useState<'link' | 'paste' | 'file'>('link');
  const [urlInput, setUrlInput] = useState('');
  const [pgnText, setPgnText] = useState('');
  const [selectedStructure, setSelectedStructure] = useState<PawnStructureType>('Custom');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const [directPgnUrl, setDirectPgnUrl] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  if (!isOpen) return null;

  const detectedInfo = detectGameUrl(urlInput);

  const resetForm = () => {
    setUrlInput('');
    setPgnText('');
    setError(null);
    setFailedUrl(null);
    setDirectPgnUrl(null);
    setSuccessInfo(null);
  };

  // Main action: Import directly from URL in one step
  const handleImportFromUrl = async (overrideUrl?: string) => {
    const targetUrl = (overrideUrl || urlInput).trim();
    if (!targetUrl) {
      setError('Please enter a website link to import.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setFailedUrl(null);
    setDirectPgnUrl(null);
    setSuccessInfo(null);

    try {
      const result = await fetchPgnFromUrl(targetUrl);
      setPgnText(result.pgn);
      const inferred = inferPawnStructure('', result.pgn);
      setSelectedStructure(inferred);

      // Successfully imported into study context
      importPgn(result.pgn, inferred);
      resetForm();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch PGN from URL.');
      setFailedUrl(targetUrl);
      const detection = detectGameUrl(targetUrl);
      if (detection.directPgnUrl) {
        setDirectPgnUrl(detection.directPgnUrl);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Optional manual fetch preview
  const handleFetchPreview = async (overrideUrl?: string) => {
    const targetUrl = (overrideUrl || urlInput).trim();
    if (!targetUrl) {
      setError('Please enter a website link to fetch.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setFailedUrl(null);
    setDirectPgnUrl(null);
    setSuccessInfo(null);

    try {
      const result = await fetchPgnFromUrl(targetUrl);
      setPgnText(result.pgn);
      const inferred = inferPawnStructure('', result.pgn);
      setSelectedStructure(inferred);
      setSuccessInfo(`Fetched successfully from ${result.source}! Inferred structure: ${inferred}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch PGN from URL.');
      setFailedUrl(targetUrl);
      const detection = detectGameUrl(targetUrl);
      if (detection.directPgnUrl) {
        setDirectPgnUrl(detection.directPgnUrl);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setPgnText(content);
        const inferred = inferPawnStructure('', content);
        setSelectedStructure(inferred);
        setError(null);
        setSuccessInfo(`Loaded ${file.name}. Inferred structure: ${inferred}`);
      }
    };
    reader.onerror = () => {
      setError('Could not read the uploaded file.');
    };
    reader.readAsText(file);
  };

  const handleImportPasted = () => {
    if (!pgnText.trim()) {
      setError('Please provide PGN notation text first.');
      return;
    }

    try {
      importPgn(pgnText, selectedStructure);
      resetForm();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Invalid PGN format. Please verify the game notation.');
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        if (text.startsWith('http://') || text.startsWith('https://') || text.includes('lichess.org') || text.includes('chessgames.com')) {
          setUrlInput(text.trim());
          setError(null);
        } else {
          setPgnText(text.trim());
          setActiveTab('paste');
          const inferred = inferPawnStructure('', text);
          setSelectedStructure(inferred);
          setError(null);
        }
      }
    } catch {
      // Ignore clipboard permission blocks
    }
  };

  const sampleLinks = [
    {
      title: 'Chessgames.com: Nikolic vs Kramnik (1998)',
      url: 'https://www.chessgames.com/perl/chessgame?gid=1302324',
      tag: 'Chessgames #1302324',
    },
    {
      title: 'Lichess Master Game: Winter Marathon',
      url: 'https://lichess.org/q7ZvsdUF',
      tag: 'Lichess Game',
    },
    {
      title: 'Lichess Analysis Board: Classical Game',
      url: 'https://lichess.org/analysis/q7ZvsdUF',
      tag: 'Lichess Analysis',
    },
    {
      title: 'Raw PGN Cloud Link (GitHub CDN)',
      url: 'https://raw.githubusercontent.com/lichess-org/api/master/test/pgn/valid.pgn',
      tag: 'Direct PGN',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#090d16] border border-slate-800 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#090d16]">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Import Game to Study Library</h3>
              <p className="text-xs text-slate-400">
                Direct web links (Lichess, Chessgames.com, Chess.com), raw PGN, or local files
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs: Link / Paste / File */}
        <div className="flex border-b border-slate-800 bg-[#020617]/50 text-xs">
          <button
            onClick={() => {
              setActiveTab('link');
              setError(null);
            }}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center space-x-1.5 font-medium border-b-2 transition-colors ${
              activeTab === 'link'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900/50 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Direct Web Link</span>
            <span className="px-1 py-0.2 text-[9px] bg-emerald-500/20 text-emerald-300 rounded font-semibold ml-1">
              Live
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('paste');
              setError(null);
            }}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center space-x-1.5 font-medium border-b-2 transition-colors ${
              activeTab === 'paste'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900/50 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste PGN</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('file');
              setError(null);
            }}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center space-x-1.5 font-medium border-b-2 transition-colors ${
              activeTab === 'file'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900/50 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Direct Web Link Tab */}
          {activeTab === 'link' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                  <span>Enter Chess Website Link:</span>
                  <button
                    type="button"
                    onClick={handlePasteClipboard}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                  >
                    <ClipboardCopy className="w-3 h-3" />
                    <span>Paste Clipboard</span>
                  </button>
                </label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => {
                        setUrlInput(e.target.value);
                        setError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleImportFromUrl();
                        }
                      }}
                      placeholder="e.g. https://www.chessgames.com/perl/chessgame?gid=1302324 or https://lichess.org/..."
                      className="w-full bg-[#020617] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500/50 pr-24 font-mono"
                    />
                    {detectedInfo.provider !== 'unknown' && (
                      <span className="absolute right-2 top-2 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono font-medium">
                        {detectedInfo.label}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleFetchPreview()}
                    disabled={isLoading || !urlInput.trim()}
                    className="px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 transition-colors border border-slate-700"
                    title="Fetch and preview PGN before loading"
                  >
                    {isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Link2 className="w-3.5 h-3.5" />
                    )}
                    <span>Preview</span>
                  </button>
                </div>
              </div>

              {/* Supported Platforms Notice */}
              <div className="bg-[#020617]/60 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="text-slate-300 font-semibold block flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Direct Web Import Supports:</span>
                </span>
                <p>• <strong>Chessgames.com:</strong> Game pages (e.g. <code className="text-emerald-400 font-mono">gid=1302324</code>) with automatic PGN resolver</p>
                <p>• <strong>Lichess.org:</strong> Game URLs, analysis boards (<code className="text-emerald-400 font-mono">lichess.org/analysis/id</code>), & studies</p>
                <p>• <strong>Chess.com:</strong> Live & Daily game links with callback API extraction</p>
                <p>• <strong>Direct Raw Links:</strong> GitHub Raw PGNs, Gists, and Pastebin URLs</p>
              </div>

              {/* Quick Sample Links */}
              <div>
                <p className="text-[11px] font-semibold text-slate-400 mb-1.5">
                  Click a sample link to test instantly:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {sampleLinks.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setUrlInput(s.url);
                        handleImportFromUrl(s.url);
                      }}
                      className="text-left p-2 rounded-lg bg-[#020617]/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 transition group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 truncate">
                          {s.title}
                        </span>
                        <span className="text-[10px] text-emerald-400 shrink-0 ml-1 group-hover:underline">
                          Load &rarr;
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                        {s.url}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Paste PGN Tab */}
          {activeTab === 'paste' && (
            <div className="space-y-2">
              <label className="block text-slate-300 font-semibold">
                Paste PGN Notation:
              </label>
              <textarea
                rows={7}
                value={pgnText}
                onChange={(e) => {
                  setPgnText(e.target.value);
                  const inferred = inferPawnStructure('', e.target.value);
                  setSelectedStructure(inferred);
                  setError(null);
                }}
                placeholder={`[Event "Melody Amber Blind 7th"]\n[White "Nikolic, Predrag"]\n[Black "Kramnik, Vladimir"]\n1. d4 Nf6 2. c4 e6...`}
                className="w-full bg-[#020617] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-600 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none leading-relaxed"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Supports standard tags, comments, and ChessBase glyphs</span>
                <span>{pgnText.length} characters</span>
              </div>
            </div>
          )}

          {/* Upload File Tab */}
          {activeTab === 'file' && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Select .pgn File:
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-lg p-6 cursor-pointer bg-[#020617]/50 hover:bg-slate-800/40 transition-colors">
                <FileText className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs text-slate-300 font-medium">Click to select PGN file</span>
                <span className="text-[10px] text-slate-500 mt-1">Accepts .pgn and .txt files</span>
                <input
                  type="file"
                  accept=".pgn,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Fetched PGN Preview (if previewed) */}
          {pgnText && activeTab === 'link' && (
            <div className="p-2.5 rounded-lg bg-[#020617] border border-slate-800 text-[11px] font-mono text-slate-300 max-h-28 overflow-y-auto">
              <span className="text-emerald-400 font-sans font-semibold block mb-1">PGN Preview:</span>
              <pre className="whitespace-pre-wrap">{pgnText.slice(0, 300)}...</pre>
            </div>
          )}

          {/* Pawn Structure Classifier */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-semibold flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Primary Pawn Structure Classification:</span>
              </label>
              <span className="text-[10px] text-slate-500">Auto-inferred</span>
            </div>
            <select
              value={selectedStructure}
              onChange={(e) => setSelectedStructure(e.target.value as PawnStructureType)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="Carlsbad">Carlsbad / Minority Attack</option>
              <option value="IQP">Isolated Queen's Pawn (IQP)</option>
              <option value="Hanging Pawns">Hanging Pawns</option>
              <option value="Closed">Closed Center (French / King's Indian)</option>
              <option value="Open">Open Center</option>
              <option value="Benoni">Benoni Wedge</option>
              <option value="Custom">Custom / Other</option>
            </select>
          </div>

          {/* Success Banner */}
          {successInfo && (
            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successInfo}</span>
            </div>
          )}

          {/* Error Banner with Direct Link Helper */}
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs space-y-2">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div>
                  <p className="font-semibold">Import Issue</p>
                  <p className="text-rose-200/90">{error}</p>
                </div>
              </div>

              {directPgnUrl && (
                <div className="pt-2 border-t border-rose-500/20 text-[11px] text-slate-300">
                  <p className="mb-1 text-slate-400">
                    If your browser or network blocks direct cross-origin access:
                  </p>
                  <a
                    href={directPgnUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 underline font-mono break-all"
                  >
                    <span>Open Raw PGN in New Tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <p className="mt-1 text-slate-400">
                    Copy the text in the new tab and paste it into the <strong>"Paste PGN"</strong> tab above.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#090d16] flex items-center justify-end space-x-2">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Cancel
          </button>

          {activeTab === 'link' ? (
            <button
              onClick={() => (pgnText ? handleImportPasted() : handleImportFromUrl())}
              disabled={isLoading || (!urlInput.trim() && !pgnText.trim())}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Globe className="w-3.5 h-3.5" />
                  <span>Import Game from Link</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleImportPasted}
              disabled={!pgnText.trim()}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Import Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
