export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  category: DocumentCategory;
  uploadDate: Date;
  lastModified: Date;
  tags: string[];
  content?: string;
  metadata: {
    extractedText?: string;
    confidence: number;
    language?: string;
    expiryDate?: Date;
  };
  file: File;
}

export interface DocumentCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  country: string;
  language: string;
  currency: string;
  isDefault: boolean;
}

export interface SearchFilters {
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  hasExpiry?: boolean;
}