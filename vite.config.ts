import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function corsProxyPlugin(): Plugin {
  const handler = async (req: any, res: any) => {
    try {
      const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const targetUrl = parsedUrl.searchParams.get('url');

      if (!targetUrl) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Missing target url query parameter (?url=...)');
        return;
      }

      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept:
            'text/plain, application/json, text/x-chess-pgn, application/x-chess-pgn, text/html, */*',
        },
      });

      const text = await response.text();
      res.statusCode = response.status;
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end(text);
    } catch (err: any) {
      res.statusCode = 500;
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end(`Proxy error: ${err.message}`);
    }
  };

  return {
    name: 'cors-proxy-plugin',
    configureServer(server) {
      server.middlewares.use('/api/proxy', handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/proxy', handler);
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), corsProxyPlugin()],
});
