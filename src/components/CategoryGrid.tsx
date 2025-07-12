import React from 'react';
import * as Icons from 'lucide-react';
import { DocumentCategory } from '../types';
import { documentCategories } from '../data/categories';

interface CategoryGridProps {
  documents: any[];
  onCategoryClick: (category: DocumentCategory) => void;
  selectedCategory?: string;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ 
  documents, 
  onCategoryClick, 
  selectedCategory 
}) => {
  const getDocumentCount = (categoryId: string) => {
    return documents.filter(doc => doc.category.id === categoryId).length;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4">
      {documentCategories.map((category) => {
        const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ComponentType<any>;
        const count = getDocumentCount(category.id);
        const isSelected = selectedCategory === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
              isSelected 
                ? 'border-blue-500 bg-blue-50 shadow-lg' 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-medium text-gray-900 text-sm">{category.name}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {count} {count === 1 ? 'document' : 'documents'}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};