// @ts-nocheck
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CvData } from '../types/cv';
import { v4 as uuidv4 } from 'uuid';

// Système de prompt qui sera envoyé à Gemini
const SYSTEM_PROMPT = `
Tu es une IA spécialisée qui extrait des informations structurées à partir des descriptions fournies par l'utilisateur pour générer un CV professionnel.

Ta tâche est d'analyser le texte fourni par l'utilisateur et d'en extraire les informations pour remplir un objet CVData structuré. Sois précis et respecte strictement le format demandé.

RÈGLES IMPORTANTES:
1. Si une information n'est pas fournie, utilise une valeur par défaut raisonnable ou laisse le champ vide.
2. Pour les listes (education, experience, skills, languages), crée des entrées distinctes avec des ID uniques.
3. Organise les expériences et formations de la plus récente à la plus ancienne.
4. Assure-toi que chaque champ respecte le type spécifié.
5. Pour le champ "description" dans personalInfo, formule une courte présentation professionnelle pertinente.
6. Pour les compétences (skills), attribue un niveau entre 1-10 en fonction du contexte.
7. Pour les langues (languages), attribue un niveau entre 1-5 (1=Débutant, 5=Bilingue/Natif).
8. Génère des identifiants uniques (id) pour chaque élément des listes.
9. Rends la description professionnelle et concise, sans être trop exagérée.
10. IMPORTANT: RÉPONDS UNIQUEMENT AVEC L'OBJET JSON BRUT, SANS BLOCMDE CODE MARKDOWN, SANS BACKTICKS (\`\`\`), SANS PRÉFIXE "json". JUSTE LES ACCOLADES {} ET LEUR CONTENU.

Voici la structure attendue de l'objet CVData:

export interface PersonalInfo {
  photo?: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  address: string;
  phone: string;
  email: string;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 1-10
}

export interface LanguageItem {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface CvData {
  personalInfo: PersonalInfo;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: SkillItem[];
  languages: LanguageItem[];
}

Formate ta réponse UNIQUEMENT comme un objet JSON valide correspondant à la structure CvData, sans aucun texte explicatif avant ou après, sans délimiteurs de bloc de code.
`;

// Clé API Gemini depuis les variables d'environnement
// Assurez-vous d'ajouter VITE_GEMINI_API_KEY dans votre .env
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface AiResponse {
    cvData?: CvData;
    error?: string;
}

export async function generateCvFromPrompt(userPrompt: string): Promise<AiResponse> {
    try {
        // Vérifier si la clé API est définie
        if (!GEMINI_API_KEY) {
            console.error("Clé API Gemini non définie");
            return {
                error: "Clé API non configurée. Veuillez ajouter VITE_GEMINI_API_KEY dans votre fichier .env"
            };
        }

        // Initialiser l'API Gemini
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

        // Configurer le modèle
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            generationConfig: {
                temperature: 0.2, // Plus faible pour des réponses plus déterministes
                topP: 0.8,
                maxOutputTokens: 8192,
            },
        });

        // Préparer le contexte et l'instruction
        const prompt = `${SYSTEM_PROMPT}\n\nInformations de l'utilisateur: "${userPrompt}"`;

        // Générer la réponse
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Log pour déboguer
        console.log("------------------------------------------");
        console.log("REPONSE DE L'IA", text);
        console.log("--------------------------------------------------------------------------");

        // Nettoyer la réponse des délimiteurs de bloc de code Markdown
        text = cleanJsonResponse(text);

        try {
            // Tenter de parser la réponse JSON
            const parsedData = JSON.parse(text);

            // Assurer que les IDs sont bien définis
            ensureIdsForItems(parsedData);

            return { cvData: parsedData };
        } catch (parseError) {
            console.error("Erreur lors du parsing de la réponse JSON:", parseError);
            return {
                error: "La réponse de l'IA n'est pas au format JSON attendu. Veuillez réessayer avec un prompt plus détaillé."
            };
        }
    } catch (error) {
        console.error("Erreur lors de la génération avec Gemini:", error);
        return {
            error: error instanceof Error
                ? error.message
                : "Une erreur s'est produite lors de la communication avec l'API Gemini."
        };
    }
}

// Fonction pour nettoyer la réponse JSON des délimiteurs Markdown
function cleanJsonResponse(text: string): string {
    // Supprimer les délimiteurs de bloc de code et le préfixe "json"
    let cleaned = text;

    // Supprimer ```json ou ``` au début
    cleaned = cleaned.replace(/^```(json)?\s*/i, '');

    // Supprimer ``` à la fin
    cleaned = cleaned.replace(/\s*```$/i, '');

    // Vérifier si le texte commence par {
    if (!cleaned.trim().startsWith('{')) {
        // Essayer de trouver le premier { et supprimer tout ce qui est avant
        const firstBraceIndex = cleaned.indexOf('{');
        if (firstBraceIndex !== -1) {
            cleaned = cleaned.substring(firstBraceIndex);
        }
    }

    // Vérifier si le texte se termine par }
    if (!cleaned.trim().endsWith('}')) {
        // Essayer de trouver le dernier } et supprimer tout ce qui est après
        const lastBraceIndex = cleaned.lastIndexOf('}');
        if (lastBraceIndex !== -1) {
            cleaned = cleaned.substring(0, lastBraceIndex + 1);
        }
    }

    return cleaned;
}

// Fonction pour s'assurer que tous les éléments des listes ont un ID unique
function ensureIdsForItems(data: CvData) {
    // Fonction helper pour vérifier et assigner des IDs
    const ensureIds = (items: any[]) => {
        if (!items) return;

        items.forEach(item => {
            if (!item.id) {
                item.id = uuidv4();
            }
        });
    };

    // Appliquer aux différentes listes
    ensureIds(data.education);
    ensureIds(data.experience);
    ensureIds(data.skills);
    ensureIds(data.languages);

    // S'assurer qu'il y a au moins un élément dans chaque liste
    ['education', 'experience', 'skills', 'languages'].forEach(listName => {
        if (!data[listName] || data[listName].length === 0) {
            data[listName] = [{ id: uuidv4() }];
        }
    });

    return data;
}

// Pour le développement et les tests, mock Gemini API
export async function mockGenerateCvFromPrompt(userPrompt: string): Promise<AiResponse> {
    console.log("Utilisation du mock pour la génération AI (développement uniquement)");
    console.log("Prompt utilisateur:", userPrompt);

    // Extraire le prénom/nom si possible
    const nameMatch = userPrompt.match(/je m'appelle\s+([^\.,]+)/i);
    const name = nameMatch ? nameMatch[1].split(' ') : ['John', 'Doe'];

    // Simuler un délai d'API
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock data
    return {
        cvData: {
            personalInfo: {
                firstName: name[0] || 'John',
                lastName: name.length > 1 ? name.slice(1).join(' ') : 'Doe',
                jobTitle: "Développeur Web Full Stack",
                address: "Paris, France",
                phone: "+33 6 12 34 56 78",
                email: "contact@example.com",
                description: "Développeur passionné avec une solide expérience en conception d'applications web innovantes. Spécialisé en JavaScript moderne et frameworks frontend, je combine créativité technique et vision business pour livrer des produits de qualité."
            },
            education: [
                {
                    id: uuidv4(),
                    degree: "Master en Développement Web",
                    school: "Université de Technologie",
                    startDate: "09/2016",
                    endDate: "06/2018",
                    description: "Spécialisation en technologies web avancées et architecture logicielle."
                },
                {
                    id: uuidv4(),
                    degree: "Licence en Informatique",
                    school: "Institut Supérieur d'Informatique",
                    startDate: "09/2013",
                    endDate: "06/2016",
                    description: "Formation fondamentale en algorithmique, structures de données et programmation."
                }
            ],
            experience: [
                {
                    id: uuidv4(),
                    title: "Développeur Full Stack Senior",
                    company: "Tech Solutions",
                    startDate: "01/2020",
                    endDate: "Présent",
                    description: "Développement d'applications web évolutives avec React, Node.js et MongoDB. Mise en place de CI/CD et optimisation des performances."
                },
                {
                    id: uuidv4(),
                    title: "Développeur Frontend",
                    company: "Digital Agency",
                    startDate: "06/2018",
                    endDate: "12/2019",
                    description: "Création d'interfaces utilisateur réactives et accessibles avec Vue.js et Sass. Collaboration étroite avec les designers UX/UI."
                }
            ],
            skills: [
                { id: uuidv4(), name: "JavaScript", level: 9 },
                { id: uuidv4(), name: "React", level: 8 },
                { id: uuidv4(), name: "Node.js", level: 7 },
                { id: uuidv4(), name: "TypeScript", level: 8 },
                { id: uuidv4(), name: "CSS/SASS", level: 8 },
                { id: uuidv4(), name: "Git", level: 7 }
            ],
            languages: [
                { id: uuidv4(), name: "Français", level: 5 },
                { id: uuidv4(), name: "Anglais", level: 4 },
                { id: uuidv4(), name: "Espagnol", level: 2 }
            ]
        }
    };
}