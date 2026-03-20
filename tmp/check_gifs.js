const fs = require('fs');
const https = require('https');
const http = require('http');

const filePath = '../src/data/exerciseDB.ts';
const content = fs.readFileSync(filePath, 'utf8');

const urlRegex = /gifUrl:\s*'([^']+)'/g;
let match;
const urls = new Set();
const fileMap = new Map(); // Store line number or context if needed

while ((match = urlRegex.exec(content)) !== null) {
    const url = match[1];
    if (url.startsWith('http')) {
        urls.add(url);
    }
}

console.log(`Found ${urls.size} unique URLs to check.`);

const brokenUrls = [];
let checked = 0;

function checkUrl(url) {
    return new Promise((resolve) => {
        const reqMod = url.startsWith('https') ? https : http;
        const options = {
            method: 'HEAD',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': '*/*'
            },
            timeout: 5000,
            rejectUnauthorized: false
        };

        const req = reqMod.request(url, options, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                resolve({ url, status: res.statusCode, ok: true });
            } else {
                resolve({ url, status: res.statusCode, ok: false });
            }
        });

        req.on('error', (e) => {
            resolve({ url, error: e.message, ok: false });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ url, error: 'TIMEOUT', ok: false });
        });

        req.end();
    });
}

async function processBatch(urlsArr, batchSize = 20) {
    for (let i = 0; i < urlsArr.length; i += batchSize) {
        const batch = urlsArr.slice(i, i + batchSize);
        const results = await Promise.all(batch.map(checkUrl));

        results.forEach(res => {
            checked++;
            if (!res.ok) {
                console.log(`❌ BROKEN: ${res.url} (Status: ${res.status || res.error})`);
                brokenUrls.push(res);
            }
        });
        console.log(`Checked ${checked}/${urlsArr.length}`);
    }

    console.log('\n--- BROKEN URLS SUMMARY ---');
    brokenUrls.forEach(res => {
        console.log(`"${res.url}": failed with ${res.status || res.error}`);
    });
    console.log(`\nTotal broken: ${brokenUrls.length}`);
}

processBatch(Array.from(urls)).catch(console.error);
