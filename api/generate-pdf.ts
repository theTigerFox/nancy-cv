// Vercel Serverless - PDF Generation
// Simple approach: render HTML exactly as received

import type { VercelRequest, VercelResponse } from '@vercel/node';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

export const config = { maxDuration: 60 };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let browser = null;

  try {
    const { html, filename = 'cv' } = req.body;
    if (!html) return res.status(400).json({ error: 'HTML required' });

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: 'new',
    });

    const page = await browser.newPage();
    
    await page.setViewport({
      width: A4_WIDTH_PX,
      height: A4_HEIGHT_PX,
      deviceScaleFactor: 1,
    });

    await page.setContent(html, {
      waitUntil: ['load', 'networkidle0'],
      timeout: 30000,
    });

    // Wait for fonts
    await page.evaluate(async () => { await document.fonts.ready; });
    await new Promise(r => setTimeout(r, 500));

    const pdfBuffer = await page.pdf({
      width: `${A4_WIDTH_PX}px`,
      height: `${A4_HEIGHT_PX}px`,
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
    return res.send(pdfBuffer);

  } catch (error) {
    console.error('[PDF]', error);
    if (browser) await browser.close();
    return res.status(500).json({ error: 'PDF generation failed' });
  }
}
