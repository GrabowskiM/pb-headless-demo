import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';

import handler from './dist/server/server.js';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const CLIENT_DIR = join(ROOT, 'dist', 'client');
const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? '0.0.0.0';

const MIME = {
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.ico': 'image/x-icon',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.woff2': 'font/woff2',
};

const toWebRequest = (req) => {
    const url = `http://${req.headers.host ?? HOST}${req.url}`;
    const method = req.method ?? 'GET';
    const body = method === 'GET' || method === 'HEAD' ? undefined : Readable.toWeb(req);

    return new Request(url, { method, headers: req.headers, body, duplex: 'half' });
};

const serveStatic = async (pathname) => {
    const filePath = normalize(join(CLIENT_DIR, pathname));

    if (!filePath.startsWith(CLIENT_DIR)) {
        return null;
    }

    try {
        const info = await stat(filePath);

        if (!info.isFile()) {
            return null;
        }

        const body = await readFile(filePath);
        const type = MIME[extname(filePath)] ?? 'application/octet-stream';
        const immutable = pathname.startsWith('/assets/');

        return { body, type, immutable };
    } catch {
        return null;
    }
};

const server = createServer((req, res) => {
    void (async () => {
        try {
            const pathname = decodeURIComponent((req.url ?? '/').split('?')[0]);
            const asset = pathname === '/' ? null : await serveStatic(pathname);

            if (asset) {
                res.writeHead(200, {
                    'content-type': asset.type,
                    'cache-control': asset.immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=3600',
                });
                res.end(asset.body);

                return;
            }

            const response = await handler.fetch(toWebRequest(req));

            res.writeHead(response.status, Object.fromEntries(response.headers));

            if (response.body) {
                Readable.fromWeb(response.body).pipe(res);
            } else {
                res.end();
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'content-type': 'text/plain' });
            res.end('Internal Server Error');
        }
    })();
});

server.listen(PORT, HOST, () => {
    console.log(`Listening on http://${HOST}:${PORT}`);
});
