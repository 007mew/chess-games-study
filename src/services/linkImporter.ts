export interface UrlDetectionResult {
  provider: 'lichess' | 'chessgames' | 'chess.com' | 'direct-pgn' | 'unknown';
  label: string;
  gameId?: string;
  directPgnUrl?: string;
}

/**
 * Robust URL detector supporting Lichess, Chessgames.com, Chess.com, and raw links.
 */
export function detectGameUrl(url: string): UrlDetectionResult {
  const trimmed = url.trim();
  if (!trimmed) {
    return { provider: 'unknown', label: 'Empty Link' };
  }

  // 1. Chessgames.com detection
  if (trimmed.includes('chessgames.com')) {
    const gidMatch =
      trimmed.match(/[?&]gid=(\d+)/i) ||
      trimmed.match(/downloadPGN\/(\d+)/i) ||
      trimmed.match(/viewPGN\/(\d+)/i) ||
      trimmed.match(/chessgame[/?].*?(\d{5,8})/i) ||
      trimmed.match(/(\d{6,8})/);

    const gid = gidMatch ? gidMatch[1] : undefined;
    const directPgnUrl = gid
      ? `https://www.chessgames.com/perl/nph-chesspgn?text=1&gid=${gid}`
      : undefined;

    return {
      provider: 'chessgames',
      label: gid ? `Chessgames.com (Game #${gid})` : 'Chessgames.com Game',
      gameId: gid,
      directPgnUrl,
    };
  }

  // 2. Lichess Study or Game detection
  if (trimmed.includes('lichess.org')) {
    // Study chapter or study root: lichess.org/study/{studyId}/{chapterId}
    const studyMatch = trimmed.match(
      /lichess\.org\/study\/([a-zA-Z0-9]{8})(?:\/([a-zA-Z0-9]{8}))?/i
    );
    if (studyMatch) {
      const studyId = studyMatch[1];
      const chapterId = studyMatch[2];
      return {
        provider: 'lichess',
        label: chapterId ? 'Lichess Study Chapter' : 'Lichess Study',
        gameId: chapterId ? `${studyId}/${chapterId}` : studyId,
        directPgnUrl: chapterId
          ? `https://lichess.org/study/${studyId}/${chapterId}.pgn`
          : `https://lichess.org/api/study/${studyId}.pgn`,
      };
    }

    // Analysis board game URL: lichess.org/analysis/(standard/)?{id}
    const analysisMatch = trimmed.match(
      /lichess\.org\/analysis\/(?:[a-zA-Z0-9_-]+\/)*([a-zA-Z0-9]{8,12})/i
    );
    if (analysisMatch) {
      const gameId = analysisMatch[1].slice(0, 8);
      return {
        provider: 'lichess',
        label: 'Lichess Analysis Game',
        gameId,
        directPgnUrl: `https://lichess.org/game/export/${gameId}?moves=true&tags=true&clocks=false&evals=false&opening=true`,
      };
    }

    // Direct export link: lichess.org/game/export/{id}
    const exportMatch = trimmed.match(/lichess\.org\/game\/export\/([a-zA-Z0-9]{8})/i);
    if (exportMatch) {
      const gameId = exportMatch[1];
      return {
        provider: 'lichess',
        label: 'Lichess Game Export',
        gameId,
        directPgnUrl: `https://lichess.org/game/export/${gameId}?moves=true&tags=true&clocks=false&evals=false&opening=true`,
      };
    }

    // Standard game URL: lichess.org/{8-12 char id}, excluding reserved site sections
    const reservedRoutes = new Set([
      'analysis',
      'training',
      'practice',
      'study',
      'broadcast',
      'tournament',
      'swiss',
      'team',
      'forum',
      'inbox',
      'tv',
      'learn',
      'embed',
      'mobile',
    ]);

    const pathPart = trimmed.replace(/^https?:\/\/(?:www\.)?lichess\.org\//i, '').split(/[/?#]/)[0];
    if (pathPart && !reservedRoutes.has(pathPart.toLowerCase()) && /^[a-zA-Z0-9]{8,12}$/.test(pathPart)) {
      const gameId = pathPart.slice(0, 8);
      return {
        provider: 'lichess',
        label: 'Lichess Game',
        gameId,
        directPgnUrl: `https://lichess.org/game/export/${gameId}?moves=true&tags=true&clocks=false&evals=false&opening=true`,
      };
    }
  }

  // If user pasted just a raw 8-character Lichess Game ID directly
  if (/^[a-zA-Z0-9]{8}$/.test(trimmed)) {
    return {
      provider: 'lichess',
      label: `Lichess Game ID (${trimmed})`,
      gameId: trimmed,
      directPgnUrl: `https://lichess.org/game/export/${trimmed}?moves=true&tags=true&clocks=false&evals=false&opening=true`,
    };
  }

  // 3. Chess.com detection
  if (trimmed.includes('chess.com')) {
    const isDaily = trimmed.toLowerCase().includes('daily');
    const chessMatch =
      trimmed.match(/chess\.com\/(?:analysis\/)?(?:game|live)\/(?:live|daily)?\/?(\d+)/i) ||
      trimmed.match(/chess\.com\/.*?\b(\d{7,14})\b/);
    const id = chessMatch ? chessMatch[1] : undefined;
    return {
      provider: 'chess.com',
      label: isDaily ? 'Chess.com Daily Game' : 'Chess.com Live Game',
      gameId: id ? (isDaily ? `daily/${id}` : `live/${id}`) : undefined,
    };
  }

  // 4. Direct PGN or Raw text web links
  if (
    trimmed.endsWith('.pgn') ||
    trimmed.endsWith('.txt') ||
    trimmed.includes('raw.githubusercontent.com') ||
    trimmed.includes('gist.githubusercontent.com') ||
    trimmed.includes('pastebin.com/raw/') ||
    trimmed.includes('theweekinchess.com')
  ) {
    return {
      provider: 'direct-pgn',
      label: 'Direct PGN / Raw Text Link',
      directPgnUrl: trimmed,
    };
  }

  return {
    provider: 'unknown',
    label: 'Generic Web Link',
    directPgnUrl: trimmed,
  };
}

/**
 * Fetch helper with strict timeout to prevent hanging
 */
async function fetchWithTimeout(url: string, timeoutMs = 4500, headers?: Record<string, string>): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'text/plain, application/json, text/x-chess-pgn, application/x-chess-pgn, text/html, */*',
        ...headers,
      },
    });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Robust fetch helper that handles CORS restrictions using local Vite proxy
 * and fast fallback proxies with quick timeouts.
 */
async function fetchWithCorsFallback(
  targetUrl: string,
  onProgress?: (msg: string) => void
): Promise<string> {
  // 1. Direct fetch (works out-of-the-box for Lichess and CORS-enabled servers)
  try {
    onProgress?.('Attempting direct connection...');
    const res = await fetchWithTimeout(targetUrl, 4000);
    if (res.ok) {
      const text = await res.text();
      if (text && (text.includes('[') || text.includes('1.'))) {
        return text;
      }
    }
  } catch (err) {
    // Direct fetch failed or blocked by CORS, proceed to proxy
  }

  // 2. Local Vite Proxy (works seamlessly in Vite dev and preview modes)
  if (typeof window !== 'undefined') {
    try {
      onProgress?.('Fetching via local proxy server...');
      const localProxyUrl = `/api/proxy?url=${encodeURIComponent(targetUrl)}`;
      const res = await fetchWithTimeout(localProxyUrl, 5000);
      if (res.ok) {
        const text = await res.text();
        if (text && (text.includes('[') || text.includes('1.'))) {
          return text;
        }
      }
    } catch {
      // Local proxy not available (e.g. static production deployment)
    }
  }

  // 3. Fast Public CORS Proxies with 3.5s timeout each
  const externalProxies = [
    (u: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
    (u: string) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
  ];

  for (let i = 0; i < externalProxies.length; i++) {
    try {
      onProgress?.(`Retrying via web proxy (${i + 1}/${externalProxies.length})...`);
      const proxyUrl = externalProxies[i](targetUrl);
      const res = await fetchWithTimeout(proxyUrl, 4000);
      if (res.ok) {
        const text = await res.text();
        if (text && (text.includes('[') || text.includes('1.'))) {
          return text;
        }
      }
    } catch {
      // try next proxy
    }
  }

  throw new Error(
    `Failed to fetch PGN from URL. The website server blocks cross-origin access.`
  );
}

/**
 * Fetches PGN from a URL, automatically handling Lichess, Chessgames.com,
 * Chess.com game endpoints, or raw PGN endpoints.
 */
export async function fetchPgnFromUrl(
  url: string,
  onProgress?: (message: string) => void
): Promise<{ pgn: string; source: string; directPgnUrl?: string }> {
  const detection = detectGameUrl(url);
  const trimmed = url.trim();

  // 1. Chessgames.com integration
  if (detection.provider === 'chessgames') {
    if (!detection.gameId) {
      throw new Error(
        'Could not extract a valid game ID (gid) from this Chessgames link. Example: https://www.chessgames.com/perl/chessgame?gid=1302324'
      );
    }

    onProgress?.(`Connecting to Chessgames.com (Game #${detection.gameId})...`);
    const endpoints = [
      `https://www.chessgames.com/perl/nph-chesspgn?text=1&gid=${detection.gameId}`,
      `https://www.chessgames.com/njs/api/game/viewPGN/${detection.gameId}?raw=true`,
    ];

    for (const ep of endpoints) {
      try {
        const text = await fetchWithCorsFallback(ep, onProgress);
        if (text.includes('[Event') || text.includes('1.')) {
          return {
            pgn: text.trim(),
            source: `Chessgames.com (#${detection.gameId})`,
            directPgnUrl: endpoints[0],
          };
        }
      } catch {
        // try next endpoint
      }
    }

    throw new Error(
      `Could not bypass CORS for Chessgames.com automatically. Please click the direct PGN link below to copy and paste the game.`
    );
  }

  // 2. Lichess integration
  if (detection.provider === 'lichess' && detection.gameId) {
    onProgress?.('Fetching game directly from Lichess Open API...');
    let exportUrl: string;

    if (detection.gameId.includes('/')) {
      const [studyId, chapterId] = detection.gameId.split('/');
      exportUrl = `https://lichess.org/study/${studyId}/${chapterId}.pgn`;
    } else if (url.includes('/study/')) {
      exportUrl = `https://lichess.org/api/study/${detection.gameId}.pgn`;
    } else {
      exportUrl = `https://lichess.org/game/export/${detection.gameId}?moves=true&tags=true&clocks=false&evals=false&opening=true`;
    }

    try {
      const pgn = await fetchWithCorsFallback(exportUrl, onProgress);
      if (pgn.includes('[') || pgn.includes('1.')) {
        return {
          pgn: pgn.trim(),
          source: 'Lichess',
          directPgnUrl: exportUrl,
        };
      }
    } catch (err: any) {
      throw new Error(
        `Failed to load from Lichess (${detection.gameId}). Please verify the game exists or copy the PGN directly.`
      );
    }
  }

  // 3. Chess.com integration
  if (detection.provider === 'chess.com' && detection.gameId) {
    onProgress?.('Fetching Chess.com game notation...');
    const [mode, gameId] = detection.gameId.includes('/')
      ? detection.gameId.split('/')
      : ['live', detection.gameId];
    const endpoint = `https://www.chess.com/callback/${mode}/game/${gameId}`;

    try {
      const raw = await fetchWithCorsFallback(endpoint, onProgress);
      try {
        const json = JSON.parse(raw);
        if (json.game?.pgn) {
          return { pgn: json.game.pgn.trim(), source: 'Chess.com' };
        }
        if (json.pgn) {
          return { pgn: json.pgn.trim(), source: 'Chess.com' };
        }
      } catch {
        if (raw.includes('[') || raw.includes('1.')) {
          return { pgn: raw.trim(), source: 'Chess.com' };
        }
      }
      throw new Error('Game PGN not found in Chess.com response.');
    } catch (err: any) {
      throw new Error(`Failed to load from Chess.com: ${err.message}`);
    }
  }

  // 4. Direct / Raw PGN or Generic Web Link
  onProgress?.('Downloading PGN from web source...');
  try {
    const raw = await fetchWithCorsFallback(trimmed, onProgress);
    if (raw.includes('[') || raw.includes('1.') || raw.includes('1-0') || raw.includes('0-1')) {
      return { pgn: raw.trim(), source: detection.label, directPgnUrl: trimmed };
    }
    throw new Error('The fetched link content does not contain valid chess PGN headers or move notation.');
  } catch (err: any) {
    throw new Error(err.message || 'Unable to import PGN from the specified URL.');
  }
}
