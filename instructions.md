# Project Specification: "GrandmasterNotes" – Chess Middlegame Study & Annotation Platform

## 1. Project Overview & Objective
Build a modern, responsive single-page web application designed specifically for serious chess players to study master games with a focus on **middlegame plans, pawn structures, and positional ideas**, rather than pure tactical engine calculations.

The primary differentiator of this app is its **Middlegame Idea Notebook** and **Structural Tagging System**, allowing users to attach structured strategic notes, highlight positional concepts (outposts, pawn levers, bad pieces), and filter games by pawn structure.

---

## 2. Tech Stack & Dependencies
- **Framework:** React 18+ (Next.js App Router or Vite + React) with TypeScript.
- **Styling:** Tailwind CSS (clean, modern dark/light mode, slate/zinc color palette inspired by Lichess and Chess.com).
- **Icons:** `lucide-react`.
- **Chess Engine & Board:**
  - `chess.js` (move validation, FEN parsing, PGN import/export).
  - `react-chessboard` (or a customized SVG board) with support for right-click and shift-right-click drawing of colored arrows and highlighted squares.
  - Optional/Toggled: `stockfish.js` running in a Web Worker (capped at depth 18 to avoid performance lag).
- **State Management:** Zustand or React Context with `localStorage` persistence (or IndexedDB).

---

## 3. UI Layout & Architecture (3-Column Desktop Layout)

### Left Column: Study Library & Game Navigation (Width: 20-25%)
- **PGN Importer & Preset Games:**
  - "Import PGN" button supporting three flexible import sources:
    1. **Website Link Direct Import:** Auto-fetch and parse games directly from Chessgames.com (e.g. `https://www.chessgames.com/perl/chessgame?gid={gid}`), Lichess URLs (e.g. `https://lichess.org/{gameId}`, Lichess analysis board, and study chapters), Chess.com game URLs (e.g. `https://www.chess.com/game/live/{id}`), or direct raw PGN web links (`.pgn` / `.txt` files or raw GitHub/gist links) with automated local and web proxy fallback.
    2. **Paste Raw PGN:** Direct multi-line text input with instant validation and format preview.
    3. **Upload PGN File:** Drag-and-drop or file browser supporting single or multi-game `.pgn` archives.
  - Preloaded library dropdown featuring 5-10 classical model games (e.g., Botvinnik vs. Keres 1948 [Carlsbad], Karpov vs. Spassky 1974 [IQP], Kasparov vs. Piket 1989 [KID]).
- **Structural Filter Bar:**
  - Filter games by structure: *Isolated Queen's Pawn (IQP)*, *Carlsbad / Minority Attack*, *Hanging Pawns*, *Closed Center (French/KID)*, *Open Center*, *Benoni Wedge*.
- **Move List Tree:**
  - Clean SAN move notation with sub-variations support.
  - Visual indicators (colored dots or badge icons) next to moves that have attached strategic notes.

### Middle Column: Interactive Chessboard & Controls (Width: 45-50%)
- **Board Display:**
  - Crisp pieces with customizable board themes (e.g., Wood, Slate, Tournament Green).
  - Visual coordinate markers (a-h, 1-8).
  - Interactive right-click arrow drawing (Green for plans/good moves, Red for threats/weaknesses, Blue for maneuvers).
  - Square highlight coloring (e.g., gold for outposts, red for backward pawns).
- **Navigation Controls:**
  - First move (`|<`), Previous (`<`), Next (`>`), Last (`>|`), Flip Board (`F`).
  - Full keyboard shortcuts (Left/Right arrows, Space for pause, F to flip).
- **Engine / Eval Bar (Collapsible):**
  - Toggleable evaluation bar with an on/off switch to encourage independent thinking before checking computer evaluation.

### Right Column: Middlegame Strategic Notebook (Width: 30-35%)
This is the core feature. When the user navigates to any move (especially moves 10–30), this panel updates dynamically.

#### A. Strategic Framework Checklist (The "4 Questions" Accordion)
An interactive evaluation prompt for the current position:
1. **Worst-Placed Piece:** Identify and record which friendly/enemy piece lacks scope.
2. **Key Weaknesses:** Highlight targets (holes, backward pawns, open king).
3. **Pawn Levers & Breaks:** Identify the thematic pawn break (e.g., c5, e5, f4, b5).
4. **Opponent's Plan (Prophylaxis):** Note what the opponent wants to do next.

#### B. Thematic Idea Tagging System
Users can click multi-select pill tags for the current move:
- *Category 1 - Structure:* `Carlsbad`, `IQP`, `Hanging Pawns`, `Pawn Chain Base`, `Passed Pawn Creation`.
- *Category 2 - Maneuver:* `Knight Outpost`, `Bad Bishop Trade`, `Rook on 7th`, `Rook Lift`, `Prophylaxis`.
- *Category 3 - Plan:* `Minority Attack`, `Opposite-Side Castling Storm`, `Center Liquidate`, `Endgame Transition`.

#### C. Rich Markdown Note Editor
- Per-move note-taking with Markdown support.
- Pre-filled note templates (e.g., *"Why did White choose this move over the engine's top choice?"*).
- Timestamped/ply-linked commentary that persists when exporting PGN.

---

## 4. Key Interactive Features

### 1. "Guess the Plan" Training Mode (Blindfold / Solitaire Chess)
- When enabled, the game hides all moves starting from move 15 (or user-chosen move).
- At each turn, the user must:
  1. Select the piece they want to move and execute the move on the board.
  2. Write a 1-sentence hypothesis of the plan.
- If the move matches the GM game, show a success animation and reveal the GM's subsequent moves. If not, offer feedback and allow the user to see the actual move or retry.

### 2. Visual Plan Annotation Tool
- Allow users to "save board markup" directly into the move data.
- E.g., on move 16 of Karpov vs. Spassky, save a green arrow showing `Nf3 -> d4 -> e6` and a red square on `d5`. When reviewing later, these arrows and highlights reload automatically.

### 3. PGN Export with Standard Chess Annotation
- Button to "Export Annotated PGN".
- Must preserve notes as standard PGN comments `{ like this }` and export arrow annotations using standard ChessBase/Lichess glyphs: `[%csl ...] [%cal ...]`.

### 4. Direct Web Link PGN Importer
- **Chessgames.com Integration:** Automatically parses game URLs with `gid` (e.g. `https://www.chessgames.com/perl/chessgame?gid=1302324`), extracts the game ID, and fetches the pure PGN via Chessgames download endpoints (`/perl/nph-chesspgn?text=1&gid=...` or `/njs/api/game/viewPGN/...`) with automatic CORS handling.
- **Lichess Integration:** Detects `lichess.org/{gameId}`, analysis board links (`lichess.org/analysis/{gameId}`), and studies (`/study/{id}/{chapterId}`), querying `https://lichess.org/game/export/{gameId}` with automatic move, clock, and header extraction.
- **Chess.com Integration:** Detects `chess.com/game/{type}/{id}` and extracts the live/daily PGN via Chess.com public callback APIs with fallback to web-proxy fetching.
- **Generic URL & Raw Text / Cloud Links:** Fetches raw `.pgn`, `.txt`, GitHub Raw, Gist, or Pastebin URLs directly with intelligent CORS proxy fallback when cross-origin restrictions occur in the browser.
- **Auto-detection & Tag Inference:** Analyzes the imported game to auto-detect opening ECO, players, year, and attempts structural pawn tag inference (e.g., Carlsbad, IQP, Closed, etc.).

---

## 5. Data Model (TypeScript Schema)

```typescript
interface ChessStudyGame {
  id: string;
  white: string;
  black: string;
  year: number;
  event: string;
  result: "1-0" | "0-1" | "1/2-1/2";
  eco: string;
  openingName: string;
  primaryPawnStructure: "Carlsbad" | "IQP" | "Hanging Pawns" | "Closed" | "Open" | "Benoni" | "Custom";
  pgn: string;
  annotations: Record<number, MoveAnnotation>; // key is ply number
}

interface MoveAnnotation {
  ply: number;
  fen: string;
  themeTags: string[];
  noteMarkdown: string;
  questionsAnalysis?: {
    worstPiece?: string;
    weakness?: string;
    pawnBreak?: string;
    prophylaxis?: string;
  };
  arrows: { from: string; to: string; color: "green" | "red" | "blue" | "yellow" }[];
  highlightedSquares: { square: string; color: string }[];
}