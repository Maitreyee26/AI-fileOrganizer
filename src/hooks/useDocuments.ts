import { useState, useCallback } from 'react';
import { Document, DocumentCategory, SearchFilters } from '../types';
import { documentCategories } from '../data/categories';

// Simulated AI categorization
const categorizeDocument = (file: File): DocumentCategory => {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  
  // Simple keyword-based categorization (in real app, this would be AI-powered)
  if (fileName.includes('diploma') || fileName.includes('degree') || fileName.includes('certificate')) {
    return documentCategories.find(c => c.id === 'education')!;
  }
  if (fileName.includes('payslip') || fileName.includes('salary') || fileName.includes('w2') || fileName.includes('tax')) {
    return documentCategories.find(c => c.id === 'employment')!;
  }
  if (fileName.includes('bank') || fileName.includes('statement') || fileName.includes('loan')) {
    return documentCategories.find(c => c.id === 'finance')!;
  }
  if (fileName.includes('medical') || fileName.includes('prescription') || fileName.includes('health')) {
    return documentCategories.find(c => c.id === 'medical')!;
  }
  if (fileName.includes('bill') || fileName.includes('utility') || fileName.includes('electric')) {
    return documentCategories.find(c => c.id === 'utilities')!;
  }
  if (fileName.includes('lease') || fileName.includes('rent') || fileName.includes('property')) {
    return documentCategories.find(c => c.id === 'property')!;
  }
  if (fileName.includes('passport') || fileName.includes('license') || fileName.includes('id')) {
    return documentCategories.find(c => c.id === 'legal')!;
  }
  if (fileName.includes('car') || fileName.includes('vehicle') || fileName.includes('registration')) {
    return documentCategories.find(c => c.id === 'vehicles')!;
  }
  if (fileName.includes('insurance')) {
    return documentCategories.find(c => c.id === 'insurance')!;
  }
  if (fileName.includes('invoice') || fileName.includes('receipt') || fileName.includes('purchase')) {
    return documentCategories.find(c => c.id === 'purchases')!;
  }
  
  return documentCategories.find(c => c.id === 'miscellaneous')!;
};

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const uploadDocuments = useCallback(async (files: FileList) => {
    setIsProcessing(true);
    
    const newDocuments: Document[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const category = categorizeDocument(file);
      
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const document: Document = {
        id: `doc_${Date.now()}_${i}`,
        name: file.name,
        type: file.type,
        size: file.size,
        category,
        uploadDate: new Date(),
        lastModified: new Date(file.lastModified),
        tags: [],
        metadata: {
          confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
          language: 'en'
        },
        file
      };
      
      newDocuments.push(document);
    }
    
    setDocuments(prev => [...prev, ...newDocuments]);
    setIsProcessing(false);
    
    return newDocuments;
  }, []);

  const searchDocuments = useCallback((query: string, filters?: SearchFilters) => {
    return documents.filter(doc => {
      const matchesQuery = !query || 
        doc.name.toLowerCase().includes(query.toLowerCase()) ||
        doc.category.name.toLowerCase().includes(query.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      
      const matchesCategory = !filters?.category || doc.category.id === filters.category;
      
      const matchesTags = !filters?.tags?.length || 
        filters.tags.some(tag => doc.tags.includes(tag));
      
      return matchesQuery && matchesCategory && matchesTags;
    });
  }, [documents]);

  const updateDocumentCategory = useCallback((documentId: string, newCategory: DocumentCategory) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId ? { ...doc, category: newCategory } : doc
    ));
  }, []);

  const addTagToDocument = useCallback((documentId: string, tag: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId ? { ...doc, tags: [...doc.tags, tag] } : doc
    ));
  }, []);

  const deleteDocument = useCallback((documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  }, []);

  return {
    documents,
    isProcessing,
    uploadDocuments,
    searchDocuments,
    updateDocumentCategory,
    addTagToDocument,
    deleteDocument
  };
};