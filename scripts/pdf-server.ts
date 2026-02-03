// Local PDF Server for Development
// Simple approach: render HTML exactly as received

import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const app = express();
const PORT = 3001;

// A4 at 96 DPI
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/api/generate-pdf', async (req, res) => {
  let browser = null;
  
  try {
    const { html, filename = 'cv' } = req.body;
    
    if (!html) {
      return res.status(400).json({ error: 'HTML content required' });
    }
    
    console.log('[PDF] Launching browser...');
    
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();
    
    // Set viewport to match A4
    await page.setViewport({
      width: A4_WIDTH_PX,
      height: A4_HEIGHT_PX,
      deviceScaleFactor: 1,
    });
    
    // Load HTML
    await page.setContent(html, {
      waitUntil: ['load', 'networkidle0'],
      timeout: 30000,
    });
    
    // Wait for fonts
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    await new Promise(r => setTimeout(r, 500));
    
    console.log('[PDF] Generating...');
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      width: `${A4_WIDTH_PX}px`,
      height: `${A4_HEIGHT_PX}px`,
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    
    await browser.close();
    
    console.log(`[PDF] Done: ${pdfBuffer.length} bytes`);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('[PDF] Error:', error);
    if (browser) await browser.close();
    res.status(500).json({ error: 'PDF generation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`[PDF Server] http://localhost:${PORT}`);
});
