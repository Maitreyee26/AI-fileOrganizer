import React, { useState } from 'react';
import { FileText, Image, File, MoreVertical, Tag, Calendar, Eye, Trash2, FolderOpen } from 'lucide-react';
import { Document, DocumentCategory } from '../types';
import { documentCategories } from '../data/categories';

interface DocumentListProps {
  documents: Document[];
  onDocumentClick: (document: Document) => void;
  onCategoryChange: (documentId: string, category: DocumentCategory) => void;
  onDelete: (documentId: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ 
  documents, 
  onDocumentClick, 
  onCategoryChange,
  onDelete 
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return Image;
    if (type.includes('pdf')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <FolderOpen className="w-16 h-16 mb-4" />
        <h3 className="text-lg font-medium mb-2">No documents found</h3>
        <p className="text-sm">Upload some documents to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4">
      {documents.map((document) => {
        const FileIcon = getFileIcon(document.type);
        
        return (
          <div
            key={document.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className={`w-10 h-10 ${document.category.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <FileIcon className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{document.name}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Tag className="w-3 h-3 mr-1" />
                      {document.category.name}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(document.uploadDate)}
                    </span>
                    <span>{formatFileSize(document.size)}</span>
                    {document.metadata.confidence && (
                      <span className="text-green-600">
                        {Math.round(document.metadata.confidence * 100)}% confidence
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onDocumentClick(document)}
                  className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                  title="View document"
                >
                  <Eye className="w-4 h-4" />
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === document.id ? null : document.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  {activeDropdown === document.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <div className="py-1">
                        <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b">
                          Move to Category
                        </div>
                        {documentCategories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => {
                              onCategoryChange(document.id, category);
                              setActiveDropdown(null);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <div className={`w-3 h-3 ${category.color} rounded mr-2`}></div>
                            {category.name}
                          </button>
                        ))}
                        <div className="border-t">
                          <button
                            onClick={() => {
                              onDelete(document.id);
                              setActiveDropdown(null);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                          >
                            <Trash2 className="w-3 h-3 mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {document.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {document.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};