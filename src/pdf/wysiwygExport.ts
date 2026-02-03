// NANCY CV - Pixel-Perfect Vector PDF Export
// Strategy: Capture HTML AS-IS without modifying inline styles

import type { CVData } from '../types/cv';

// A4 dimensions at 96 DPI
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

// API endpoint
const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
const PDF_API_URL = isProd ? '/api/generate-pdf' : 'http://localhost:3001/api/generate-pdf';

export interface VectorPDFOptions {
  filename?: string;
  previewElement?: HTMLElement | null;
}

function sanitizeFilename(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
    .trim() || 'cv';
}

/**
 * Prepare HTML for PDF
 * Key: Clone DOM, remove UI elements, keep all styles intact
 */
function prepareHTMLForPDF(element: HTMLElement): string {
  // Clone the element - preserves ALL inline styles
  const clone = element.cloneNode(true) as HTMLElement;
  
  // CRITICAL: Remove ALL UI/editing elements that should NOT be in PDF
  const elementsToRemove = [
    'button',
    '[data-no-print]',
    '.no-print',
    '[contenteditable="true"]',
    // Edit mode badge and UI
    '.absolute.top-2.right-2', // Edition Live badge
    '[class*="ring-"]', // Edit mode rings
    '[class*="z-50"]', // Overlay elements
    // Section manager and floating buttons
    '[class*="fixed"]',
    // Any element with "Edition" or "edit" in text that's an overlay
  ].join(', ');
  
  clone.querySelectorAll(elementsToRemove).forEach(el => {
    // For contenteditable, just remove the attribute
    if (el.hasAttribute('contenteditable')) {
      el.removeAttribute('contenteditable');
    } else {
      el.remove();
    }
  });
  
  // Also remove any element containing "Edition Live" text
  clone.querySelectorAll('div').forEach(el => {
    if (el.textContent?.trim() === 'Edition Live' || 
        el.textContent?.trim() === 'Mode Edition') {
      el.remove();
    }
  });
  
  // Remove edit-mode class from all elements
  clone.querySelectorAll('.edit-mode').forEach(el => {
    el.classList.remove('edit-mode');
  });
  clone.classList.remove('edit-mode');
  
  // Get the actual CV template inside (skip wrapper divs)
  let cvContent = clone;
  const templateEl = clone.querySelector('.cv-template');
  if (templateEl) {
    cvContent = templateEl as HTMLElement;
  }
  
  // CRITICAL: Convert all mm dimensions to px for consistent rendering
  // 1mm = 3.7795px at 96 DPI
  const MM_TO_PX = 3.7795;
  cvContent.querySelectorAll('*').forEach(el => {
    const htmlEl = el as HTMLElement;
    const style = htmlEl.getAttribute('style');
    if (style && style.includes('mm')) {
      // Replace mm values with px equivalents
      const newStyle = style.replace(/(\d+(?:\.\d+)?)\s*mm/g, (match, num) => {
        const px = Math.round(parseFloat(num) * MM_TO_PX);
        return `${px}px`;
      });
      htmlEl.setAttribute('style', newStyle);
    }
  });
  
  // Remove transform (zoom scaling) but keep all other styles
  const currentStyle = cvContent.getAttribute('style') || '';
  let styleProps = currentStyle.split(';').filter(s => {
    const prop = s.trim().toLowerCase();
    return prop && 
           !prop.startsWith('transform:') && 
           !prop.startsWith('transform-origin:');
  });
  
  // Convert any mm in root style too
  styleProps = styleProps.map(s => {
    if (s.includes('mm')) {
      return s.replace(/(\d+(?:\.\d+)?)\s*mm/g, (match, num) => {
        const px = Math.round(parseFloat(num) * MM_TO_PX);
        return `${px}px`;
      });
    }
    return s;
  });
  
  // Force exact A4 dimensions
  styleProps.push(
    `width: ${A4_WIDTH_PX}px`,
    `max-width: ${A4_WIDTH_PX}px`,
    `min-height: ${A4_HEIGHT_PX}px`,
    `height: auto`,
    'margin: 0',
    'padding: 0',
    'box-shadow: none',
    'overflow: visible'
  );
  
  cvContent.setAttribute('style', styleProps.join('; '));
  
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=${A4_WIDTH_PX}">
  <title>CV</title>
  
  <!-- Google Fonts - ALL fonts used by ALL templates -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Inter:wght@100;200;300;400;500;600;700;800;900&family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Open+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Raleway:wght@100;200;300;400;500;600;700;800;900&family=Roboto:wght@100;300;400;500;700;900&family=Source+Sans+3:wght@200;300;400;500;600;700;900&family=Source+Serif+4:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <style>
    /* Reset */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    
    @page {
      size: ${A4_WIDTH_PX}px ${A4_HEIGHT_PX}px;
      margin: 0;
    }
    
    html, body {
      width: ${A4_WIDTH_PX}px;
      min-height: ${A4_HEIGHT_PX}px;
      margin: 0;
      padding: 0;
      background: white;
      overflow: visible;
    }
    
    /* Ensure CV container fits A4 */
    body > * {
      width: ${A4_WIDTH_PX}px !important;
      max-width: ${A4_WIDTH_PX}px !important;
      overflow: visible;
    }
    
    /* Font fallbacks - ensure Source Sans Pro maps to Source Sans 3 */
    @font-face {
      font-family: 'Source Sans Pro';
      src: local('Source Sans 3'), local('Source Sans Pro');
    }
    
    /* Font fallbacks - ensure Source Serif Pro maps to Source Serif 4 */
    @font-face {
      font-family: 'Source Serif Pro';
      src: local('Source Serif 4'), local('Source Serif Pro');
    }
    
    /* Hide any remaining UI elements */
    .edit-mode,
    [class*="ring-"],
    [class*="outline-"],
    button,
    [role="button"] {
      display: none !important;
    }
  </style>
</head>
<body>
${cvContent.outerHTML}
</body>
</html>`;
}

/**
 * Main export function
 */
export async function downloadPDFHighFidelity(
  cvData: CVData,
  options: VectorPDFOptions = {}
): Promise<void> {
  const {
    filename = `cv-${cvData.personalInfo.firstName || 'mon'}-${cvData.personalInfo.lastName || 'cv'}`,
    previewElement,
  } = options;

  const element = previewElement || document.querySelector('[data-cv-preview]') as HTMLElement;
  if (!element) throw new Error('Preview element not found');

  console.log('[PDF Export] Capturing preview HTML...');

  // Wait for fonts
  if (document.fonts) {
    await document.fonts.ready;
  }
  await new Promise(r => setTimeout(r, 100));

  const html = prepareHTMLForPDF(element);
  const safeFilename = sanitizeFilename(filename);

  console.log(`[PDF Export] HTML size: ${(html.length / 1024).toFixed(1)}KB`);

  try {
    const response = await fetch(PDF_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html, filename: safeFilename }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Server error: ${response.status}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeFilename}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('[PDF Export] Download complete');

  } catch (error) {
    console.error('[PDF Export] API failed:', error);
    
    // Fallback: browser print
    const win = window.open('', '_blank', `width=${A4_WIDTH_PX},height=${A4_HEIGHT_PX}`);
    if (!win) throw new Error('Popup blocked');
    
    win.document.write(html);
    win.document.close();
    
    if (win.document.fonts) {
      await win.document.fonts.ready;
    }
    setTimeout(() => win.print(), 1000);
  }
}

export { downloadPDFHighFidelity as downloadPDFWYSIWYG };
export { downloadPDFHighFidelity as exportVectorPDF };
