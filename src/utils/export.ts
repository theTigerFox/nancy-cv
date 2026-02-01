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
    low: { scale: 1, imageQuality: 0.7 },
    medium: { scale: 1.5, imageQuality: 0.85 },
    high: { scale: 2, imageQuality: 0.95 },
    print: { scale: 3, imageQuality: 1 },
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
    
    // Capture du canvas
    const canvas = await html2canvas(element, {
        scale: qualitySettings.scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
    });
    
    // Dimensions du PDF
    const pdfWidth = dimensions.width - (margins * 2);
    const pdfHeight = dimensions.height - (margins * 2);
    
    // Ratio de l'image
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * qualitySettings.scale;
    
    const scaledWidth = imgWidth * ratio;
    const scaledHeight = imgHeight * ratio;
    
    // Création du PDF
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: format,
    });
    
    // Centrer l'image
    const x = margins + (pdfWidth - scaledWidth) / 2;
    const y = margins;
    
    // Calcul du nombre de pages nécessaires
    const pageHeight = pdfHeight;
    const totalPages = Math.ceil(scaledHeight / pageHeight);
    
    for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
            pdf.addPage();
        }
        
        const sourceY = page * (pageHeight / ratio) * qualitySettings.scale;
        const sourceHeight = Math.min((pageHeight / ratio) * qualitySettings.scale, imgHeight - sourceY);
        const destHeight = sourceHeight * ratio;
        
        // Créer un canvas pour cette page
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imgWidth;
        pageCanvas.height = sourceHeight;
        
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(
                canvas,
                0, sourceY,
                imgWidth, sourceHeight,
                0, 0,
                imgWidth, sourceHeight
            );
            
            const imgData = pageCanvas.toDataURL('image/jpeg', qualitySettings.imageQuality);
            pdf.addImage(imgData, 'JPEG', x, y, scaledWidth, destHeight);
        }
    }
    
    // Watermark optionnel
    if (showWatermark) {
        pdf.setFontSize(8);
        pdf.setTextColor(200, 200, 200);
        pdf.text('Créé avec Nancy CV - nancycv.app', dimensions.width / 2, dimensions.height - 5, {
            align: 'center',
        });
    }
    
    return pdf.output('blob');
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
