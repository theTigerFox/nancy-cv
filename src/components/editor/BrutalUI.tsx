// ============================================================================
// NANCY CV - Brutal UI Components for Forms
// ============================================================================

import React, { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LucideIcon, 
    ChevronDown, 
    X, 
    Plus,
    GripVertical,
    Eye,
    EyeOff,
    Info
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// Input
// ─────────────────────────────────────────────────────────────────────────────

interface BrutalInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label: string;
    icon?: LucideIcon;
    error?: string;
    hint?: string;
    onChange?: (value: string) => void;
}

export const BrutalInput = forwardRef<HTMLInputElement, BrutalInputProps>(
    ({ label, icon: Icon, error, hint, onChange, className, required, ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                <label className="flex items-center gap-1 text-xs font-black uppercase tracking-wider">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
                <div className={cn(
                    "relative flex items-stretch border-3 border-black bg-white transition-all",
                    "focus-within:shadow-brutal focus-within:-translate-y-0.5",
                    error && "border-red-500"
                )}>
                    {Icon && (
                        <div className="flex items-center justify-center w-12 bg-black text-white shrink-0">
                            <Icon size={18} />
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            "flex-1 px-4 py-3 bg-transparent font-medium text-sm",
                            "placeholder:text-gray-400 focus:outline-none",
                            "focus:bg-brutal-yellow/20",
                            className
                        )}
                        onChange={(e) => onChange?.(e.target.value)}
                        {...props}
                    />
                </div>
                {hint && !error && (
                    <p className="text-xs text-gray-500 italic">{hint}</p>
                )}
                {error && (
                    <p className="text-xs text-red-500 font-medium">{error}</p>
                )}
            </div>
        );
    }
);

BrutalInput.displayName = 'BrutalInput';

// ─────────────────────────────────────────────────────────────────────────────
// Textarea
// ─────────────────────────────────────────────────────────────────────────────

interface BrutalTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    label: string;
    error?: string;
    hint?: string;
    maxLength?: number;
    showCount?: boolean;
    onChange?: (value: string) => void;
}

export const BrutalTextarea = forwardRef<HTMLTextAreaElement, BrutalTextareaProps>(
    ({ label, error, hint, maxLength, showCount, onChange, className, required, value, ...props }, ref) => {
        const charCount = typeof value === 'string' ? value.length : 0;
        
        return (
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1 text-xs font-black uppercase tracking-wider">
                        {label}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                    {showCount && maxLength && (
                        <span className={cn(
                            "text-xs font-mono",
                            charCount > maxLength * 0.9 ? "text-red-500" : "text-gray-400"
                        )}>
                            {charCount}/{maxLength}
                        </span>
                    )}
                </div>
                <textarea
                    ref={ref}
                    value={value}
                    maxLength={maxLength}
                    className={cn(
                        "w-full px-4 py-3 border-3 border-black bg-white font-medium text-sm",
                        "placeholder:text-gray-400 focus:outline-none resize-none",
                        "focus:shadow-brutal focus:-translate-y-0.5 focus:bg-brutal-yellow/20",
                        "transition-all",
                        error && "border-red-500",
                        className
                    )}
                    onChange={(e) => onChange?.(e.target.value)}
                    {...props}
                />
                {hint && !error && (
                    <p className="text-xs text-gray-500 italic">{hint}</p>
                )}
                {error && (
                    <p className="text-xs text-red-500 font-medium">{error}</p>
                )}
            </div>
        );
    }
);

BrutalTextarea.displayName = 'BrutalTextarea';

// ─────────────────────────────────────────────────────────────────────────────
// Select
// ─────────────────────────────────────────────────────────────────────────────

interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface BrutalSelectProps {
    label: string;
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
}

export const BrutalSelect: React.FC<BrutalSelectProps> = ({
    label,
    options,
    value,
    onChange,
    placeholder,
    error,
    required,
}) => {
    return (
        <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-xs font-black uppercase tracking-wider">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={cn(
                        "w-full appearance-none px-4 py-3 pr-10 border-3 border-black bg-white",
                        "font-bold text-sm cursor-pointer",
                        "focus:outline-none focus:shadow-brutal focus:-translate-y-0.5",
                        "hover:bg-gray-50 transition-all",
                        error && "border-red-500"
                    )}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    strokeWidth={3}
                />
            </div>
            {error && (
                <p className="text-xs text-red-500 font-medium">{error}</p>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Checkbox
// ─────────────────────────────────────────────────────────────────────────────

interface BrutalCheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
}

export const BrutalCheckbox: React.FC<BrutalCheckboxProps> = ({
    label,
    checked,
    onChange,
    description,
}) => {
    return (
        <label className="flex items-start gap-3 cursor-pointer group">
            <div
                className={cn(
                    "w-6 h-6 border-3 border-black flex items-center justify-center shrink-0 mt-0.5",
                    "transition-all group-hover:shadow-brutal-sm",
                    checked ? "bg-black text-white" : "bg-white"
                )}
                onClick={() => onChange(!checked)}
            >
                {checked && (
                    <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                    >
                        <path
                            d="M2 7L5.5 10.5L12 3"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="square"
                        />
                    </motion.svg>
                )}
            </div>
            <div>
                <span className="font-bold text-sm">{label}</span>
                {description && (
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                )}
            </div>
        </label>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Toggle
// ─────────────────────────────────────────────────────────────────────────────

interface BrutalToggleProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
}

export const BrutalToggle: React.FC<BrutalToggleProps> = ({
    label,
    checked,
    onChange,
    description,
}) => {
    return (
        <div className="flex items-center justify-between gap-4">
            <div>
                <span className="font-bold text-sm">{label}</span>
                {description && (
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                )}
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={cn(
                    "relative w-14 h-8 border-3 border-black transition-colors",
                    checked ? "bg-brutal-lime" : "bg-gray-200"
                )}
            >
                <motion.div
                    className="absolute top-0.5 w-6 h-6 bg-black"
                    animate={{ left: checked ? 'calc(100% - 26px)' : '2px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            </button>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Skill Level Slider
// ─────────────────────────────────────────────────────────────────────────────

interface BrutalSliderProps {
    label: string;
    value: number;
    min?: number;
    max?: number;
    onChange: (value: number) => void;
    showValue?: boolean;
    color?: string;
}

export const BrutalSlider: React.FC<BrutalSliderProps> = ({
    label,
    value,
    min = 1,
    max = 10,
    onChange,
    showValue = true,
    color = 'bg-black',
}) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider">{label}</label>
                {showValue && (
                    <span className="text-sm font-mono font-bold">{value}/{max}</span>
                )}
            </div>
            <div className="flex items-center gap-1 h-8">
                {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((lvl) => (
                    <button
                        key={lvl}
                        type="button"
                        onClick={() => onChange(lvl)}
                        onMouseEnter={(e) => {
                            if (e.buttons === 1) onChange(lvl);
                        }}
                        className={cn(
                            "flex-1 h-full border-2 border-black transition-all",
                            lvl <= value
                                ? `${color} translate-y-0`
                                : "bg-white hover:bg-gray-100 translate-y-1"
                        )}
                        title={`Niveau ${lvl}`}
                    />
                ))}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Date Input
// ─────────────────────────────────────────────────────────────────────────────

interface BrutalDateInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    isCurrent?: boolean;
    onCurrentChange?: (current: boolean) => void;
    showCurrentOption?: boolean;
    currentLabel?: string;
    required?: boolean;
}

export const BrutalDateInput: React.FC<BrutalDateInputProps> = ({
    label,
    value,
    onChange,
    isCurrent,
    onCurrentChange,
    showCurrentOption = false,
    currentLabel = "En cours",
    required,
}) => {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-1 text-xs font-black uppercase tracking-wider">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex items-center gap-3">
                <input
                    type="month"
                    value={isCurrent ? '' : value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={isCurrent}
                    className={cn(
                        "flex-1 px-4 py-3 border-3 border-black bg-white font-medium text-sm",
                        "focus:outline-none focus:shadow-brutal",
                        isCurrent && "bg-gray-100 text-gray-400"
                    )}
                />
                {showCurrentOption && onCurrentChange && (
                    <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                        <div
                            className={cn(
                                "w-5 h-5 border-2 border-black flex items-center justify-center",
                                isCurrent ? "bg-black text-white" : "bg-white"
                            )}
                            onClick={() => onCurrentChange(!isCurrent)}
                        >
                            {isCurrent && (
                                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                                    <path d="M2 7L5.5 10.5L12 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
                                </svg>
                            )}
                        </div>
                        <span className="text-xs font-bold uppercase">{currentLabel}</span>
                    </label>
                )}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Tag Input (for skills, technologies)
// ─────────────────────────────────────────────────────────────────────────────

interface BrutalTagInputProps {
    label: string;
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    suggestions?: string[];
    maxTags?: number;
}

export const BrutalTagInput: React.FC<BrutalTagInputProps> = ({
    label,
    tags,
    onChange,
    placeholder = "Ajouter...",
    suggestions = [],
    maxTags,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    const filteredSuggestions = suggestions.filter(
        (s) => s.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(s)
    );
    
    const addTag = (tag: string) => {
        const trimmed = tag.trim();
        if (trimmed && !tags.includes(trimmed) && (!maxTags || tags.length < maxTags)) {
            onChange([...tags, trimmed]);
            setInputValue('');
        }
    };
    
    const removeTag = (tag: string) => {
        onChange(tags.filter((t) => t !== tag));
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };
    
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider">{label}</label>
            <div className="border-3 border-black bg-white p-2 focus-within:shadow-brutal transition-all">
                <div className="flex flex-wrap gap-2 mb-2">
                    <AnimatePresence>
                        {tags.map((tag) => (
                            <motion.span
                                key={tag}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-black text-white text-xs font-bold"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="hover:text-red-400 transition-colors"
                                >
                                    <X size={12} strokeWidth={3} />
                                </button>
                            </motion.span>
                        ))}
                    </AnimatePresence>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder={maxTags && tags.length >= maxTags ? "Maximum atteint" : placeholder}
                        disabled={maxTags ? tags.length >= maxTags : false}
                        className="w-full px-2 py-1 text-sm focus:outline-none"
                    />
                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 border-3 border-black bg-white shadow-brutal z-10 max-h-40 overflow-auto">
                            {filteredSuggestions.slice(0, 5).map((suggestion) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => addTag(suggestion)}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-brutal-yellow transition-colors"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {maxTags && (
                <p className="text-xs text-gray-500">
                    {tags.length}/{maxTags} tags
                </p>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// List Item Card
// ─────────────────────────────────────────────────────────────────────────────

interface BrutalCardProps {
    title: string;
    subtitle?: string;
    index: number;
    onRemove: () => void;
    onToggleVisibility?: () => void;
    isVisible?: boolean;
    isDraggable?: boolean;
    color?: string;
    children: React.ReactNode;
}

export const BrutalCard: React.FC<BrutalCardProps> = ({
    title,
    subtitle,
    index,
    onRemove,
    onToggleVisibility,
    isVisible = true,
    isDraggable = true,
    color = 'bg-brutal-yellow',
    children,
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isVisible ? 1 : 0.5, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "border-3 border-black bg-white relative group",
                "hover:shadow-brutal transition-all"
            )}
        >
            {/* Header */}
            <div
                className={cn(
                    "flex items-center gap-3 px-4 py-3 border-b-3 border-black cursor-pointer",
                    color
                )}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isDraggable && (
                    <GripVertical
                        size={18}
                        className="cursor-grab text-black/50 hover:text-black transition-colors"
                    />
                )}
                <div className="flex-1 min-w-0">
                    <div className="font-black text-sm uppercase truncate">
                        {title || `Item ${index + 1}`}
                    </div>
                    {subtitle && (
                        <div className="text-xs text-black/60 truncate">{subtitle}</div>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {onToggleVisibility && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleVisibility();
                            }}
                            className={cn(
                                "p-1.5 hover:bg-black/10 transition-colors",
                                !isVisible && "text-gray-400"
                            )}
                            title={isVisible ? "Masquer" : "Afficher"}
                        >
                            {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        className="p-1.5 hover:bg-red-100 text-red-500 transition-colors"
                        title="Supprimer"
                    >
                        <X size={16} strokeWidth={3} />
                    </button>
                    <ChevronDown
                        size={18}
                        className={cn(
                            "transition-transform",
                            isExpanded && "rotate-180"
                        )}
                    />
                </div>
            </div>
            
            {/* Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Add Button
// ─────────────────────────────────────────────────────────────────────────────

interface BrutalAddButtonProps {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    disabled?: boolean;
}

export const BrutalAddButton: React.FC<BrutalAddButtonProps> = ({
    label,
    onClick,
    icon: Icon = Plus,
    disabled = false,
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "w-full py-4 border-3 border-dashed border-black",
                "font-black uppercase text-sm",
                "flex items-center justify-center gap-3",
                "hover:bg-white hover:border-solid hover:shadow-brutal hover:-translate-y-1",
                "transition-all group",
                disabled && "opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none"
            )}
        >
            <div className="w-8 h-8 rounded-full border-2 border-gray-300 group-hover:border-black flex items-center justify-center transition-colors">
                <Icon size={18} />
            </div>
            {label}
        </button>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section Header
// ─────────────────────────────────────────────────────────────────────────────

interface SectionHeaderProps {
    title: string;
    icon?: LucideIcon;
    count?: number;
    color?: string;
    children?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    icon: Icon,
    count,
    color = 'bg-brutal-yellow',
    children,
}) => {
    return (
        <div className={cn("p-4 border-b-3 border-black flex items-center justify-between", color)}>
            <h2 className="text-xl font-black uppercase flex items-center gap-2">
                {Icon && <Icon size={24} />}
                {title}
                {typeof count === 'number' && (
                    <span className="bg-black text-white text-xs font-bold px-2 py-0.5 ml-2">
                        {count}
                    </span>
                )}
            </h2>
            {children}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Tip / Info Box
// ─────────────────────────────────────────────────────────────────────────────

interface TipBoxProps {
    children: React.ReactNode;
    type?: 'info' | 'warning' | 'success';
}

export const TipBox: React.FC<TipBoxProps> = ({ children, type = 'info' }) => {
    const colors = {
        info: 'bg-blue-50 border-blue-500',
        warning: 'bg-yellow-50 border-yellow-500',
        success: 'bg-green-50 border-green-500',
    };
    
    return (
        <div className={cn("p-3 border-l-4 text-sm", colors[type])}>
            <div className="flex items-start gap-2">
                <Info size={16} className="shrink-0 mt-0.5" />
                <div>{children}</div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Photo Upload
// ─────────────────────────────────────────────────────────────────────────────

interface PhotoUploadProps {
    photo?: string;
    onPhotoChange: (photo: string | undefined) => void;
    shape?: 'circle' | 'square' | 'rounded';
    size?: 'sm' | 'md' | 'lg';
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
    photo,
    onPhotoChange,
    shape = 'square',
    size = 'md',
}) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    
    const sizes = {
        sm: 'w-16 h-16',
        md: 'w-24 h-24',
        lg: 'w-32 h-32',
    };
    
    const shapes = {
        circle: 'rounded-full',
        square: '',
        rounded: 'rounded-lg',
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                onPhotoChange(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    return (
        <div className="flex items-center gap-4">
            <div
                className={cn(
                    "relative border-3 border-black overflow-hidden bg-gray-100",
                    sizes[size],
                    shapes[shape]
                )}
            >
                {photo ? (
                    <img src={photo} alt="Photo" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 border-3 border-black bg-brutal-lime font-bold text-xs uppercase hover:shadow-brutal hover:-translate-y-0.5 transition-all"
                >
                    {photo ? 'Changer' : 'Ajouter'}
                </button>
                {photo && (
                    <button
                        type="button"
                        onClick={() => onPhotoChange(undefined)}
                        className="px-4 py-2 border-3 border-black bg-white text-red-500 font-bold text-xs uppercase hover:bg-red-50 transition-colors"
                    >
                        Supprimer
                    </button>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        </div>
    );
};
