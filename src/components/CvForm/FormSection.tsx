import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2 } from 'lucide-react';

interface FormSectionProps<T extends { id: string }> {
    title: string;
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    onAddItem: () => void;
    onRemoveItem: (id: string) => void;
    addItemLabel: string;
}

function FormSection<T extends { id: string }>({
    title,
    items,
    renderItem,
    onAddItem,
    onRemoveItem,
    addItemLabel
}: FormSectionProps<T>) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
        >
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">{title}</h2>
            </div>
            
            <div className="p-6">
                <div className="space-y-4">
                    {items.map((item, index) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="p-5 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white relative group transition-all duration-300 hover:shadow-md"
                        >
                            {renderItem(item, index)}

                            {items.length > 1 && (
                                <motion.button
                                    type="button"
                                    onClick={() => onRemoveItem(item.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                    title={`Supprimer cet élément ${title}`}
                                >
                                    <Trash2 size={18} />
                                </motion.button>
                            )}
                        </motion.div>
                    ))}
                </div>
                
                <motion.button
                    type="button"
                    onClick={onAddItem}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-5 w-full bg-gradient-to-r from-pink-500 to-purple-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium shadow-sm transition-all duration-200"
                >
                    <PlusCircle size={18} />
                    {addItemLabel}
                </motion.button>
            </div>
        </motion.div>
    );
}

export default FormSection;