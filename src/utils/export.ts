// ============================================================================
// NANCY CV - Export Utilities (PDF, JSON, TXT)
// ============================================================================

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { CVData, CVExport, CV_SCHEMA_VERSION } from '../types/cv';

// ─────────────────────────────────────────────────────────────────────────────
// PDF Export
// ─────────────────────────────────────────────────────────────────────────────

export interface PDFExportOptions {
    filename?: string;
    quality?: 'low' | 'medium' | 'high' | 'print';
    format?: 'a4' | 'letter';
    margins?: number; // mm
    showWatermark?: boolean;
}

const QUALITY_SETTINGS = {
    low: { scale: 2, imageQuality: 0.85 },
    medium: { scale: 3, imageQuality: 0.92 },
    high: { scale: 4, imageQuality: 0.98 },
    print: { scale: 5, imageQuality: 1 },
};

const FORMAT_DIMENSIONS = {
    a4: { width: 210, height: 297 }, // mm
    letter: { width: 215.9, height: 279.4 }, // mm
};

export async function exportToPDF(
    element: HTMLElement,
    options: PDFExportOptions = {}
): Promise<Blob> {
    const {
        quality = 'high',
        format = 'a4',
        margins = 0,
        showWatermark = false,
    } = options;
    
    const qualitySettings = QUALITY_SETTINGS[quality];
    const dimensions = FORMAT_DIMENSIONS[format];
    
    // Ensure element is valid and visible
    if (!element || element.offsetWidth === 0 || element.offsetHeight === 0) {
        throw new Error('Element invalide ou non visible pour l\'export PDF');
    }
    
    // Clone element for clean capture (remove edit-mode artifacts)
    const clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.style.transform = 'none';
    clonedElement.style.position = 'absolute';
    clonedElement.style.left = '-9999px';
    clonedElement.style.top = '0';
    clonedElement.style.width = '210mm';
    clonedElement.classList.remove('edit-mode');
    
    // Remove edit mode indicators
    clonedElement.querySelectorAll('[data-inline-editor], [data-universal-editor]').forEach(el => {
        (el as HTMLElement).style.outline = 'none';
        (el as HTMLElement).style.cursor = 'default';
    });
    
    // Remove link underlines and ensure clean text rendering
    clonedElement.querySelectorAll('a').forEach(link => {
        link.style.textDecoration = 'none';
        link.style.color = 'inherit';
    });
    
    // Optimize text rendering for PDF
    (clonedElement.style as any).webkitFontSmoothing = 'antialiased';
    clonedElement.style.textRendering = 'optimizeLegibility';
    
    document.body.appendChild(clonedElement);
    
    try {
        // Capture du canvas
        const canvas = await html2canvas(clonedElement, {
            scale: qualitySettings.scale,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            width: clonedElement.scrollWidth,
            height: clonedElement.scrollHeight,
        });
        
        // Validate canvas dimensions
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        if (imgWidth === 0 || imgHeight === 0) {
            throw new Error('Canvas capture echouee - dimensions invalides');
        }
        
        // Dimensions du PDF en mm
        const pdfWidth = dimensions.width - (margins * 2);
        const pdfHeight = dimensions.height - (margins * 2);
        
        // Calculer le ratio pour ajuster l'image a la page
        const widthRatio = pdfWidth / (imgWidth / qualitySettings.scale);
        const heightRatio = pdfHeight / (imgHeight / qualitySettings.scale);
        const ratio = Math.min(widthRatio, heightRatio, 1); // Ne pas agrandir
        
        const scaledWidth = (imgWidth / qualitySettings.scale) * ratio;
        const scaledHeight = (imgHeight / qualitySettings.scale) * ratio;
        
        // Création du PDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: format,
        });
        
        // Centrer horizontalement
        const x = margins + (pdfWidth - scaledWidth) / 2;
        
        // Calculer le nombre de pages necessaires
        const pageContentHeight = pdfHeight;
        const totalContentHeight = scaledHeight;
        const totalPages = Math.ceil(totalContentHeight / pageContentHeight);
        
        for (let page = 0; page < totalPages; page++) {
            if (page > 0) {
                pdf.addPage();
            }
            
            // Calculer quelle portion du canvas afficher
            const sourceY = (page * pageContentHeight / ratio) * qualitySettings.scale;
            const sourceHeight = Math.min(
                (pageContentHeight / ratio) * qualitySettings.scale,
                imgHeight - sourceY
            );
            
            if (sourceHeight <= 0) continue;
            
            const destHeight = (sourceHeight / qualitySettings.scale) * ratio;
            
            // Créer un canvas pour cette page
            const pageCanvas = document.createElement('canvas');
            pageCanvas.width = imgWidth;
            pageCanvas.height = Math.ceil(sourceHeight);
            
            const ctx = pageCanvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
                
                ctx.drawImage(
                    canvas,
                    0, sourceY,
                    imgWidth, sourceHeight,
                    0, 0,
                    imgWidth, sourceHeight
                );
                
                // Use PNG for better text clarity, fallback to high-quality JPEG
                const imgData = qualitySettings.imageQuality >= 0.98 
                    ? pageCanvas.toDataURL('image/png')
                    : pageCanvas.toDataURL('image/jpeg', qualitySettings.imageQuality);
                const imgFormat = qualitySettings.imageQuality >= 0.98 ? 'PNG' : 'JPEG';
                pdf.addImage(imgData, imgFormat, x, margins, scaledWidth, destHeight);
            }
        }
        
        // Watermark optionnel
        if (showWatermark) {
            const pageCount = pdf.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setTextColor(200, 200, 200);
                pdf.text('Cree avec Nancy CV - nancycv.app', dimensions.width / 2, dimensions.height - 5, {
                    align: 'center',
                });
            }
        }
        
        return pdf.output('blob');
    } finally {
        // Always cleanup
        document.body.removeChild(clonedElement);
    }
}

export async function downloadPDF(
    element: HTMLElement,
    options: PDFExportOptions = {}
): Promise<void> {
    const { filename = 'cv' } = options;
    const blob = await exportToPDF(element, options);
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON Export/Import
// ─────────────────────────────────────────────────────────────────────────────

export function exportToJSON(cvData: CVData): CVExport {
    return {
        schemaVersion: CV_SCHEMA_VERSION,
        exportedAt: new Date().toISOString(),
        generator: 'nancy-cv',
        data: cvData,
    };
}

export function downloadJSON(cvData: CVData, filename: string = 'cv'): void {
    const exportData = exportToJSON(cvData);
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function parseJSONImport(jsonString: string): CVExport | null {
    try {
        const parsed = JSON.parse(jsonString);
        
        // Validate structure
        if (parsed.schemaVersion && parsed.data) {
            return parsed as CVExport;
        }
        
        // Maybe it's just CVData directly
        if (parsed.personalInfo && parsed.experience) {
            return {
                schemaVersion: CV_SCHEMA_VERSION,
                exportedAt: new Date().toISOString(),
                generator: 'nancy-cv' as const,
                data: parsed as CVData,
            };
        }
        
        return null;
    } catch {
        return null;
    }
}

export async function importFromFile(file: File): Promise<CVExport | null> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const content = e.target?.result as string;
            resolve(parseJSONImport(content));
        };
        
        reader.onerror = () => resolve(null);
        reader.readAsText(file);
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Plain Text Export (for ATS)
// ─────────────────────────────────────────────────────────────────────────────

export function exportToPlainText(cvData: CVData): string {
    const { personalInfo, experience, education, skills, languages, projects, certifications } = cvData;
    
    const lines: string[] = [];
    
    // Header
    lines.push(`${personalInfo.firstName} ${personalInfo.lastName}`.toUpperCase());
    lines.push(personalInfo.jobTitle);
    lines.push('');
    
    // Contact
    lines.push('CONTACT');
    lines.push('-'.repeat(40));
    if (personalInfo.email) lines.push(`Email: ${personalInfo.email}`);
    if (personalInfo.phone) lines.push(`Téléphone: ${personalInfo.phone}`);
    if (personalInfo.address || personalInfo.city) {
        lines.push(`Adresse: ${[personalInfo.address, personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}`);
    }
    if (personalInfo.website) lines.push(`Site web: ${personalInfo.website}`);
    personalInfo.socialLinks?.forEach((link) => {
        lines.push(`${link.platform}: ${link.url}`);
    });
    lines.push('');
    
    // Summary
    if (personalInfo.summary) {
        lines.push('PROFIL');
        lines.push('-'.repeat(40));
        lines.push(personalInfo.summary);
        lines.push('');
    }
    
    // Experience
    if (experience.length > 0) {
        lines.push('EXPÉRIENCE PROFESSIONNELLE');
        lines.push('-'.repeat(40));
        experience.forEach((exp) => {
            if (!exp.visible) return;
            lines.push(`${exp.title} | ${exp.company}`);
            lines.push(`${exp.startDate} - ${exp.current ? 'Présent' : exp.endDate}${exp.location ? ` | ${exp.location}` : ''}`);
            if (exp.description) lines.push(exp.description);
            exp.highlights?.forEach((h) => lines.push(`• ${h}`));
            lines.push('');
        });
    }
    
    // Education
    if (education.length > 0) {
        lines.push('FORMATION');
        lines.push('-'.repeat(40));
        education.forEach((edu) => {
            if (!edu.visible) return;
            lines.push(`${edu.degree} - ${edu.field}`);
            lines.push(`${edu.school} | ${edu.startDate} - ${edu.current ? 'Présent' : edu.endDate}`);
            if (edu.grade) lines.push(`Mention: ${edu.grade}`);
            lines.push('');
        });
    }
    
    // Skills
    if (skills.length > 0) {
        lines.push('COMPÉTENCES');
        lines.push('-'.repeat(40));
        const visibleSkills = skills.filter((s) => s.visible);
        lines.push(visibleSkills.map((s) => s.name).join(', '));
        lines.push('');
    }
    
    // Languages
    if (languages.length > 0) {
        lines.push('LANGUES');
        lines.push('-'.repeat(40));
        languages.forEach((lang) => {
            if (!lang.visible) return;
            lines.push(`${lang.name}: ${lang.level}${lang.certification ? ` (${lang.certification})` : ''}`);
        });
        lines.push('');
    }
    
    // Projects
    if (projects.length > 0) {
        lines.push('PROJETS');
        lines.push('-'.repeat(40));
        projects.forEach((proj) => {
            if (!proj.visible) return;
            lines.push(proj.name);
            if (proj.description) lines.push(proj.description);
            if (proj.technologies?.length) lines.push(`Technologies: ${proj.technologies.join(', ')}`);
            if (proj.url) lines.push(`Lien: ${proj.url}`);
            lines.push('');
        });
    }
    
    // Certifications
    if (certifications.length > 0) {
        lines.push('CERTIFICATIONS');
        lines.push('-'.repeat(40));
        certifications.forEach((cert) => {
            if (!cert.visible) return;
            lines.push(`${cert.name} - ${cert.issuer} (${cert.issueDate})`);
        });
        lines.push('');
    }
    
    return lines.join('\n');
}

export function downloadPlainText(cvData: CVData, filename: string = 'cv'): void {
    const text = exportToPlainText(cvData);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────────────────────
// Image Export (PNG)
// ─────────────────────────────────────────────────────────────────────────────

export async function exportToImage(
    element: HTMLElement,
    format: 'png' | 'jpeg' = 'png',
    quality: number = 0.95
): Promise<Blob> {
    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
    });
    
    return new Promise((resolve) => {
        canvas.toBlob(
            (blob) => resolve(blob!),
            `image/${format}`,
            quality
        );
    });
}

export async function downloadImage(
    element: HTMLElement,
    filename: string = 'cv',
    format: 'png' | 'jpeg' = 'png'
): Promise<void> {
    const blob = await exportToImage(element, format);
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────────────────────
// Clipboard
// ─────────────────────────────────────────────────────────────────────────────

export async function copyToClipboard(cvData: CVData): Promise<boolean> {
    try {
        const text = exportToPlainText(cvData);
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Share API
// ─────────────────────────────────────────────────────────────────────────────

export async function shareCV(
    element: HTMLElement,
    cvData: CVData
): Promise<boolean> {
    if (!navigator.share) return false;
    
    try {
        const blob = await exportToPDF(element, { quality: 'medium' });
        const file = new File([blob], `${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}_CV.pdf`, {
            type: 'application/pdf',
        });
        
        await navigator.share({
            title: `CV de ${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`,
            text: cvData.personalInfo.headline || cvData.personalInfo.jobTitle,
            files: [file],
        });
        
        return true;
    } catch {
        return false;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Print
// ─────────────────────────────────────────────────────────────────────────────

export function printCV(): void {
    window.print();
}
