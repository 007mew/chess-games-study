import { ChessStudyGame } from '../types/chess';

export const PRESET_GAMES: ChessStudyGame[] = [
  {
    id: 'botvinnik-keres-1948',
    white: 'Mikhail Botvinnik',
    black: 'Paul Keres',
    whiteElo: '2720',
    blackElo: '2700',
    year: 1948,
    date: '1948.04.27',
    event: 'FIDE World Championship Tournament',
    site: 'Moscow / The Hague',
    round: '20',
    result: '1-0',
    eco: 'D35',
    openingName: "Queen's Gambit Declined: Exchange, Carlsbad Variation",
    primaryPawnStructure: 'Carlsbad',
    pgn: `[Event "World Championship Tournament"]
[Site "Moscow"]
[Date "1948.04.27"]
[Round "20"]
[White "Botvinnik, Mikhail"]
[Black "Keres, Paul"]
[Result "1-0"]
[ECO "D35"]
[Opening "QGD: exchange, Carlsbad variation"]

1. d4 Nf6 2. c4 e6 3. Nc3 d5 4. cxd5 exd5 5. Bg5 Be7 6. e3 O-O 7. Bd3 Nbd7 8. Qc2 Re8 9. Nge2 Nf8 10. O-O c6 11. Rab1 Bd6 12. Kh1 Ng6 13. f3 Be7 14. Rbe1 Nd7 15. Bxe7 Rxe7 16. Ng3 Nf6 17. Qf2 Be6 18. Nf5 Bxf5 19. Bxf5 Qb6 20. e4 dxe4 21. fxe4 Rd8 22. e5 Nd5 23. Ne4 Nf8 24. Nd6 Qc7 25. Be4 Ne6 26. Qh4 g6 27. Bxd5 cxd5 28. Rc1 Qd7 29. Rc3 Rf8 30. Nf5 Ree8 31. Nh6+ Kh8 32. Qf6+ Ng7 33. Nxf7+ Kg8 34. Nh6+ Kh8 35. Qxf8+ 1-0`,
    annotations: {
      20: {
        ply: 20,
        fen: 'r1bq1rk1/pp1n1pbp/2p2np1/3p4/3P4/2NBPP2/PPQ1N1PP/1RB2RK1 b - - 1 10',
        themeTags: ['Carlsbad', 'Minority Attack', 'Pawn Chain Base'],
        noteMarkdown:
          '**The Classic Carlsbad Setup.**\n\nWhite prepares the thematic minority attack (`b4-b5`) or center break (`e4`). The key strategic plan for White is to create weaknesses on the queenside (`c6` and `d5`) by advancing the b-pawn.',
        questionsAnalysis: {
          worstPiece: 'Black knight on d7 lacks active outposts.',
          weakness: 'Black c6-pawn is a potential backward target once b4-b5 occurs.',
          pawnBreak: 'White plans b4-b5 or e4 push in the center.',
          prophylaxis: 'Black plays ...Nf8 and ...Be6 to bolster king and queenside defenses.',
        },
        arrows: [
          { from: 'b2', to: 'b4', color: 'green' },
          { from: 'b4', to: 'b5', color: 'green' },
          { from: 'c6', to: 'b5', color: 'red' },
        ],
        highlightedSquares: [
          { square: 'c6', color: 'red' },
          { square: 'd5', color: 'yellow' },
          { square: 'e4', color: 'green' },
        ],
      },
      38: {
        ply: 38,
        fen: 'r5k1/pp1nrppp/1qp1b3/3p1B2/3P4/5N2/PPP2QPP/4RR1K w - - 0 19',
        themeTags: ['Center Liquidate', 'Knight Outpost', 'Passed Pawn Creation'],
        noteMarkdown:
          '**Central Breakthrough.**\n\nBotvinnik transitions from queenside pressure to a devastating central expansion with `e4!`. Black’s pieces are pinned and passive.',
        questionsAnalysis: {
          worstPiece: 'Black king lacks defensive shelter against f-file pressure.',
          weakness: 'Light-square diagonal towards Black’s king.',
          pawnBreak: 'e3-e4 decisively cracks open the center.',
          prophylaxis: 'Anticipates Black ...Ne6 and keeps control over the e-file.',
        },
        arrows: [
          { from: 'e3', to: 'e4', color: 'green' },
          { from: 'f5', to: 'e6', color: 'blue' },
        ],
        highlightedSquares: [
          { square: 'e4', color: 'green' },
          { square: 'f7', color: 'red' },
        ],
      },
    },
  },
  {
    id: 'karpov-spassky-1974',
    white: 'Anatoly Karpov',
    black: 'Boris Spassky',
    whiteElo: '2700',
    blackElo: '2690',
    year: 1974,
    date: '1974.04.14',
    event: 'Candidates Semifinal',
    site: 'Leningrad',
    round: '9',
    result: '1-0',
    eco: 'E55',
    openingName: 'Nimzo-Indian Defense: Hübner Variation',
    primaryPawnStructure: 'IQP',
    pgn: `[Event "Candidates Semifinal"]
[Site "Leningrad"]
[Date "1974.04.14"]
[Round "9"]
[White "Karpov, Anatoly"]
[Black "Spassky, Boris"]
[Result "1-0"]
[ECO "E55"]
[Opening "Nimzo-Indian: Hubner variation"]

1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 c5 5. Bd3 O-O 6. Nf3 d5 7. O-O dxc4 8. Bxc4 Nbd7 9. a3 Ba5 10. Ba2 Bc7 11. dxc5 Nxc5 12. b4 Nce4 13. Nxe4 Nxe4 14. Bb2 Qxd1 15. Rfxd1 Rd8 16. Rxd8+ Bxd8 17. Rd1 Be7 18. Ne5 Kf8 19. f3 Nd6 20. Bd4 f6 21. Nd3 b6 22. e4 e5 23. Bf2 Bd7 24. Rc1 Rc8 25. Rxc8+ Bxc8 26. Bd5 Nb5 27. a4 Nc3 28. a5 Nxd5 29. exd5 bxa5 30. bxa5 a6 31. Bc5 Bf5 32. Nb4 Bxc5+ 33. Kf1 Bxb4 34. Ke2 Ke7 35. g4 1-0`,
    annotations: {
      14: {
        ply: 14,
        fen: 'r1bq1rk1/pp1n1ppp/8/b2p4/1PB1n3/N3PN2/B2B1PPP/R2Q1RK1 b - b3 0 12',
        themeTags: ['IQP', 'Knight Outpost', 'Prophylaxis'],
        noteMarkdown:
          '**Masterclass on Exploiting the Isolated Queen Pawn Structure.**\n\nKarpov systematically controls the d4/d5 blockade squares and neutralizes Black piece activity, leading to endgame dominance.',
        questionsAnalysis: {
          worstPiece: 'Black light-squared bishop on c8.',
          weakness: 'Square d4 and d5 blockade lines.',
          pawnBreak: 'White pushes b4 expanding queenside space.',
          prophylaxis: 'Trading queens to exploit Black static weakness in the endgame.',
        },
        arrows: [
          { from: 'c3', to: 'e4', color: 'blue' },
          { from: 'd1', to: 'd8', color: 'green' },
        ],
        highlightedSquares: [
          { square: 'd4', color: 'green' },
          { square: 'd5', color: 'red' },
        ],
      },
    },
  },
  {
    id: 'kasparov-piket-1989',
    white: 'Garry Kasparov',
    black: 'Jeroen Piket',
    whiteElo: '2775',
    blackElo: '2540',
    year: 1989,
    date: '1989.10.15',
    event: 'Tilburg',
    site: 'Tilburg NED',
    round: '4',
    result: '1-0',
    eco: 'E97',
    openingName: "King's Indian Defense: Classical, Aronin-Taimanov",
    primaryPawnStructure: 'Closed',
    pgn: `[Event "Tilburg"]
[Site "Tilburg NED"]
[Date "1989.10.15"]
[Round "4"]
[White "Kasparov, Garry"]
[Black "Piket, Jeroen"]
[Result "1-0"]
[ECO "E97"]
[Opening "King's Indian: Classical, Aronin-Taimanov"]

1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. Be2 e5 7. O-O Nc6 8. d5 Ne7 9. b4 Nh5 10. Re1 f5 11. Ng5 Nf6 12. Bf3 c6 13. Be3 h6 14. Ne6 Bxe6 15. dxe6 fxe4 16. Nxe4 Nxe4 17. Bxe4 d5 18. cxd5 cxd5 19. Bc2 b6 20. Qg4 e4 21. Rad1 Qc8 22. Bb3 Rf5 23. Qh4 Qxe6 24. Bxh6 Rh5 25. Qxe4 Qxe4 26. Rxe4 Rxh6 27. Rxe7 Kf8 28. Rd7 d4 29. Rf7+ 1-0`,
    annotations: {
      17: {
        ply: 17,
        fen: 'r1bq1rk1/ppp1n1b1/3p1n1p/3Pp3/1PP1P3/2N1B3/P3BPPP/R2QRNK1 b - - 0 9',
        themeTags: ['Closed', 'Minority Attack', 'Opposite-Side Castling Storm'],
        noteMarkdown:
          '**The Closed Center Clash: Race on Opposite Wings.**\n\nIn this locked center (d5 vs e5), White attacks on the queenside (`b4, c5`), while Black aims for kingside counterplay (`...f5`). Kasparov shows textbook precision.',
        questionsAnalysis: {
          worstPiece: 'Black bishop on g7 blocked by the e5 pawn.',
          weakness: 'c7 and d6 squares in Black camp.',
          pawnBreak: 'White pushes c5; Black pushes f5.',
          prophylaxis: 'Re1 and Bf3 to restrain Black f5 break.',
        },
        arrows: [
          { from: 'b4', to: 'b5', color: 'green' },
          { from: 'c4', to: 'c5', color: 'green' },
          { from: 'f7', to: 'f5', color: 'red' },
        ],
        highlightedSquares: [
          { square: 'd5', color: 'green' },
          { square: 'c5', color: 'green' },
          { square: 'e5', color: 'yellow' },
        ],
      },
    },
  },
  {
    id: 'fischer-petrosian-1971',
    white: 'Robert James Fischer',
    black: 'Tigran V Petrosian',
    whiteElo: '2760',
    blackElo: '2640',
    year: 1971,
    date: '1971.10.19',
    event: 'Candidates Final',
    site: 'Buenos Aires',
    round: '7',
    result: '1-0',
    eco: 'B42',
    openingName: 'Sicilian Defense: Kan Variation',
    primaryPawnStructure: 'Open',
    pgn: `[Event "Candidates Final"]
[Site "Buenos Aires"]
[Date "1971.10.19"]
[Round "7"]
[White "Fischer, Robert J."]
[Black "Petrosian, Tigran V."]
[Result "1-0"]
[ECO "B42"]
[Opening "Sicilian: Kan, 5.Bd3"]

1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6 5. Bd3 Nc6 6. Nxc6 bxc6 7. O-O d5 8. c4 Nf6 9. cxd5 cxd5 10. exd5 exd5 11. Nc3 Be7 12. Qa4+ Qd7 13. Re1 Qxa4 14. Nxa4 Be6 15. Be3 O-O 16. Bc5 Rfe8 17. Bxe7 Rxe7 18. b4 Kf8 19. Nc5 Bc8 20. f3 Raa7 21. Kf2 Nd7 22. Rxe7 Kxe7 23. Ke3 Kd6 24. Kd4 Nb8 25. b5 axb5 26. Bxb5 Ba6 27. Nxa6 Nxa6 28. Rc1 Nc7 29. Rc6+ Ke7 30. a4 Ne6+ 31. Kxd5 Nf4+ 32. Kc5 Nxg2 33. Kb6 Ra8 34. a5 1-0`,
    annotations: {
      22: {
        ply: 22,
        fen: 'r3kb1r/4qppp/p3b3/8/N7/4B3/PP3PPP/R3R1K1 b - - 1 14',
        themeTags: ['Bad Bishop Trade', 'Knight Outpost', 'Rook on 7th'],
        noteMarkdown:
          '**Fischer’s Positional Squeeze.**\n\nFischer trades off Black’s good defensive pieces (`Be7` with `Bc5!`) to leave Black’s king vulnerable and seize control of the queenside files with an overwhelming knight outpost on `c5`.',
        questionsAnalysis: {
          worstPiece: 'Black dark-squared bishop is traded off, exposing weaknesses.',
          weakness: 'a6 and c6 squares.',
          pawnBreak: 'b4-b5 opens queenside paths for the White rooks.',
          prophylaxis: 'Trading queens eliminates Black attacking chances.',
        },
        arrows: [
          { from: 'e3', to: 'c5', color: 'green' },
          { from: 'a4', to: 'c5', color: 'blue' },
        ],
        highlightedSquares: [
          { square: 'c5', color: 'green' },
          { square: 'a6', color: 'red' },
        ],
      },
    },
  },
  {
    id: 'nimzowitsch-rubinstein-1926',
    white: 'Aron Nimzowitsch',
    black: 'Akiba Rubinstein',
    whiteElo: '2600',
    blackElo: '2620',
    year: 1926,
    date: '1926.04.14',
    event: 'Dresden',
    site: 'Dresden GER',
    round: '8',
    result: '1-0',
    eco: 'A34',
    openingName: 'English Opening: Symmetrical',
    primaryPawnStructure: 'Hanging Pawns',
    pgn: `[Event "Dresden"]
[Site "Dresden GER"]
[Date "1926.04.14"]
[Round "8"]
[White "Nimzowitsch, Aron"]
[Black "Rubinstein, Akiba"]
[Result "1-0"]
[ECO "A34"]
[Opening "English, 1...c5"]

1. c4 c5 2. Nf3 Nf6 3. Nc3 d5 4. cxd5 Nxd5 5. e4 Nb4 6. Bc4 e6 7. O-O N8c6 8. d3 Nd4 9. Nxd4 cxd4 10. Ne2 a6 11. Ng3 Bd6 12. f4 O-O 13. Qf3 Kh8 14. Bd2 f5 15. Rae1 Nc6 16. Re2 Qc7 17. exf5 exf5 18. Nh1 Bd7 19. Nf2 Rae8 20. Rfe1 Rxe2 21. Rxe2 Nd8 22. Nh3 Bc6 23. Qh5 g6 24. Qh4 Kg7 25. Qf2 Bc5 26. b4 Bb6 27. Qh4 Re8 28. Re5 Nf7 29. Bxf7 Qxf7 30. Ng5 Qg8 31. Rxe8 Bxe8 32. Qe1 Bc6 33. Qe7+ Kh8 34. b5 1-0`,
    annotations: {
      18: {
        ply: 18,
        fen: 'r1bq1rk1/1p3ppp/p1nbp3/8/3p1P2/3P2N1/PP1B2PP/R2Q1RK1 b - - 0 12',
        themeTags: ['Hanging Pawns', 'Prophylaxis', 'Rook Lift'],
        noteMarkdown:
          '**Prophylactic Maneuvers & The d4 Pawn.**\n\nNimzowitsch executes one of his foundational theoretical games on overprotection, piece restraint, and blockading central pawns before initiating a kingside attack.',
        questionsAnalysis: {
          worstPiece: 'White knight on g3 maneuvers to f2 and h3 with decisive effect.',
          weakness: 'Black d4 pawn is separated from companion pawns.',
          pawnBreak: 'f4-f5 cracks open lines against Black king.',
          prophylaxis: 'Re2 and Rfe1 controlling open lines.',
        },
        arrows: [
          { from: 'f4', to: 'f5', color: 'green' },
          { from: 'g3', to: 'h1', color: 'blue' },
          { from: 'h1', to: 'f2', color: 'blue' },
          { from: 'f2', to: 'h3', color: 'blue' },
        ],
        highlightedSquares: [
          { square: 'd4', color: 'red' },
          { square: 'f5', color: 'green' },
        ],
      },
    },
  },
  {
    id: 'tal-larsen-1965',
    white: 'Mikhail Tal',
    black: 'Bent Larsen',
    whiteElo: '2700',
    blackElo: '2660',
    year: 1965,
    date: '1965.08.08',
    event: 'Candidates Semifinal',
    site: 'Bled YUG',
    round: '10',
    result: '1-0',
    eco: 'B53',
    openingName: 'Sicilian Defense: Chekhover Variation',
    primaryPawnStructure: 'Benoni',
    pgn: `[Event "Candidates Semifinal"]
[Site "Bled YUG"]
[Date "1965.08.08"]
[Round "10"]
[White "Tal, Mikhail"]
[Black "Larsen, Bent"]
[Result "1-0"]
[ECO "B53"]
[Opening "Sicilian: Chekhover, 4...Nc6 5.Bb5"]

1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Qxd4 Nc6 5. Bb5 Bd7 6. Bxc6 Bxc6 7. Nc3 Nf6 8. Bg5 e6 9. O-O-O Be7 10. Rhe1 O-O 11. f4 Qa5 12. f5 e5 13. Qd3 Rac8 14. Kb1 Rfd8 15. Bxf6 Bxf6 16. g4 Be7 17. g5 Bf8 18. h4 b5 19. Nd5 Bxd5 20. Qxd5 Rc5 21. Qd3 Rdc8 22. c3 b4 23. cxb4 Qxb4 24. Rc1 Rb8 25. b3 a5 26. Rxc5 Qxc5 27. Rc1 Qf2 28. Rc2 Qg3 29. Qd5 Qxf3 30. g6 hxg6 31. fxg6 a4 32. Rc7 axb3 33. Qxf7+ Qxf7 34. gxf7+ Kh7 35. a4 1-0`,
    annotations: {
      24: {
        ply: 24,
        fen: '2r2rk1/4bppp/3p1n2/q3pP2/4P3/3Q4/PPP3PP/1K1RR3 w - - 3 13',
        themeTags: ['Benoni', 'Opposite-Side Castling Storm', 'Center Liquidate'],
        noteMarkdown:
          '**Dynamic Wedge with Opposite-Side Castling.**\n\nWith Black locking the center with `...e5`, Tal secures the `d5` outpost and initiates an all-out pawn storm (`g4-g5, h4-h5`) on the kingside.',
        questionsAnalysis: {
          worstPiece: 'Black bishop on f8.',
          weakness: 'Square d5 and the backward d6 pawn.',
          pawnBreak: 'White pushes g4-g5 and f5-f6; Black attempts queenside b5-b4 counterplay.',
          prophylaxis: 'Kb1 tucks king to safety.',
        },
        arrows: [
          { from: 'g2', to: 'g4', color: 'green' },
          { from: 'g4', to: 'g5', color: 'green' },
          { from: 'c3', to: 'd5', color: 'blue' },
        ],
        highlightedSquares: [
          { square: 'd5', color: 'green' },
          { square: 'd6', color: 'red' },
        ],
      },
    },
  },
];
