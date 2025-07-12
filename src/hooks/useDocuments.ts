import { useState, useCallback, useEffect } from 'react';
import { Document, DocumentCategory, SearchFilters } from '../types';
import { documentCategories } from '../data/categories';
import { documentService } from '../services/documentService';
import { useAuth } from './useAuth';

export const useDocuments = () => {
  const { isAuthenticated } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load documents on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadDocuments();
    }
  }, [isAuthenticated]);

  const loadDocuments = useCallback(async () => {
    try {
      setError(null);
      const response = await documentService.getDocuments();
      
      // Convert API response to frontend format
      const convertedDocuments = response.documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        size: doc.size,
        category: documentCategories.find(c => c.id === doc.category) || documentCategories.find(c => c.id === 'miscellaneous')!,
        uploadDate: new Date(doc.uploadDate),
        lastModified: new Date(doc.uploadDate),
        tags: doc.tags || [],
        metadata: {
          confidence: doc.confidence || 0.5,
          language: 'en'
        },
        file: null as any // File object not available from API
      }));
      
      setDocuments(convertedDocuments);
    } catch (error) {
      console.error('Failed to load documents:', error);
      setError('Failed to load documents');
    }
  }, []);

  const uploadDocuments = useCallback(async (files: FileList) => {
    if (!isAuthenticated) {
      setError('Please log in to upload documents');
      return [];
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await documentService.uploadDocuments(files);
      
      // Convert uploaded documents to frontend format
      const newDocuments = response.documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        size: doc.size,
        category: documentCategories.find(c => c.id === doc.category) || documentCategories.find(c => c.id === 'miscellaneous')!,
        uploadDate: new Date(doc.uploadDate),
        lastModified: new Date(doc.uploadDate),
        tags: doc.tags || [],
        metadata: {
          confidence: doc.confidence || 0.5,
          language: 'en'
        },
        file: Array.from(files).find(f => f.name === doc.name) || null as any
      }));
      
      setDocuments(prev => [...prev, ...newDocuments]);
      return newDocuments;
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload documents');
      return [];
    } finally {
      setIsProcessing(false);
    }
  }, [isAuthenticated]);

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

  const updateDocumentCategory = useCallback(async (documentId: string, newCategory: DocumentCategory) => {
    try {
      setError(null);
      await documentService.updateDocumentCategory(documentId, newCategory.id);
      
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId ? { ...doc, category: newCategory } : doc
      ));
    } catch (error) {
      console.error('Failed to update category:', error);
      setError('Failed to update document category');
    }
  }, []);

  const addTagToDocument = useCallback(async (documentId: string, tag: string) => {
    try {
      setError(null);
      await documentService.addTagsToDocument(documentId, [tag]);
      
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId ? { ...doc, tags: [...doc.tags, tag] } : doc
      ));
    } catch (error) {
      console.error('Failed to add tag:', error);
      setError('Failed to add tag to document');
    }
  }, []);

  const deleteDocument = useCallback(async (documentId: string) => {
    try {
      setError(null);
      await documentService.deleteDocument(documentId);
      
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (error) {
      console.error('Failed to delete document:', error);
      setError('Failed to delete document');
    }
  }, []);

  return {
    documents,
    isProcessing,
    error,
    uploadDocuments,
    searchDocuments,
    updateDocumentCategory,
    addTagToDocument,
    deleteDocument,
    loadDocuments
  };
};