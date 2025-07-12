import { apiClient, endpoints } from '../config/api';
import { Document, DocumentCategory } from '../types';

export interface DocumentUploadResponse {
  message: string;
  documents: Document[];
  count: number;
}

export interface DocumentListResponse {
  documents: Document[];
  total: number;
  hasMore: boolean;
}

export interface DocumentStats {
  totalDocuments: number;
  categorizedDocuments: number;
  recentUploads: number;
  organizationScore: number;
  categoryBreakdown: Record<string, number>;
}

export interface SearchFilters {
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
}

class DocumentService {
  // Upload documents
  async uploadDocuments(files: FileList): Promise<DocumentUploadResponse> {
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append('documents', files[i]);
    }

    try {
      const response = await apiClient.post(endpoints.documents.upload, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds for file uploads
      });
      
      return response.data;
    } catch (error) {
      console.error('Document upload failed:', error);
      throw new Error('Failed to upload documents');
    }
  }

  // Get documents list
  async getDocuments(params?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<DocumentListResponse> {
    try {
      const response = await apiClient.get(endpoints.documents.list, { params });
      return response.data;
    } catch (error) {
      console.error('Get documents failed:', error);
      throw new Error('Failed to retrieve documents');
    }
  }

  // Get single document
  async getDocument(id: string): Promise<Document> {
    try {
      const response = await apiClient.get(endpoints.documents.get(id));
      return response.data;
    } catch (error) {
      console.error('Get document failed:', error);
      throw new Error('Failed to retrieve document');
    }
  }

  // Update document category
  async updateDocumentCategory(id: string, category: string): Promise<void> {
    try {
      await apiClient.put(endpoints.documents.updateCategory(id), { category });
    } catch (error) {
      console.error('Update category failed:', error);
      throw new Error('Failed to update document category');
    }
  }

  // Add tags to document
  async addTagsToDocument(id: string, tags: string[]): Promise<void> {
    try {
      await apiClient.post(endpoints.documents.addTags(id), { tags });
    } catch (error) {
      console.error('Add tags failed:', error);
      throw new Error('Failed to add tags to document');
    }
  }

  // Delete document
  async deleteDocument(id: string): Promise<void> {
    try {
      await apiClient.delete(endpoints.documents.delete(id));
    } catch (error) {
      console.error('Delete document failed:', error);
      throw new Error('Failed to delete document');
    }
  }

  // Search documents
  async searchDocuments(query: string, filters?: SearchFilters): Promise<any[]> {
    try {
      const response = await apiClient.post(endpoints.documents.search, {
        query,
        filters
      });
      return response.data.results;
    } catch (error) {
      console.error('Search documents failed:', error);
      throw new Error('Failed to search documents');
    }
  }

  // Get document statistics
  async getDocumentStats(): Promise<DocumentStats> {
    try {
      const response = await apiClient.get(endpoints.documents.stats);
      return response.data;
    } catch (error) {
      console.error('Get stats failed:', error);
      throw new Error('Failed to retrieve document statistics');
    }
  }

  // Download document
  async downloadDocument(id: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`/documents/${id}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Download document failed:', error);
      throw new Error('Failed to download document');
    }
  }
}

export const documentService = new DocumentService();