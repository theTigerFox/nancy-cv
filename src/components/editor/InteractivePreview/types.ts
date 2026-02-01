// ============================================================================
// NANCY CV - Interactive Preview Types
// ============================================================================

export type EditableFieldType = 
    | 'text' 
    | 'textarea' 
    | 'color' 
    | 'number' 
    | 'date'
    | 'image';

export interface EditableField {
    /** Chemin vers la donnee dans cvData (ex: 'personalInfo.firstName') */
    path: string;
    /** Type de champ */
    type: EditableFieldType;
    /** Label affiche dans l'editeur */
    label: string;
    /** Placeholder */
    placeholder?: string;
    /** Validation */
    validation?: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
    };
}

export interface EditableZone {
    /** ID unique de la zone */
    id: string;
    /** Champs editables dans cette zone */
    fields: EditableField[];
    /** Position relative dans le template */
    position?: {
        top?: number;
        left?: number;
        right?: number;
        bottom?: number;
    };
}

export interface InlineEditorState {
    /** Zone active en edition */
    activeZone: string | null;
    /** Champ actif */
    activeField: string | null;
    /** Position de l'editeur */
    editorPosition: { x: number; y: number } | null;
    /** Mode d'edition */
    isEditing: boolean;
}

export interface ColorPickerState {
    isOpen: boolean;
    targetPath: string | null;
    position: { x: number; y: number } | null;
}

export interface InteractivePreviewProps {
    children: React.ReactNode;
    onFieldChange: (path: string, value: any) => void;
    onStyleChange?: (property: string, value: string) => void;
    isInteractive?: boolean;
}
