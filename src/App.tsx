import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { CategoryGrid } from './components/CategoryGrid';
import { DocumentList } from './components/DocumentList';
import { UploadZone } from './components/UploadZone';
import { AIAssistant } from './components/AIAssistant';
import { StatsOverview } from './components/StatsOverview';
import { useDocuments } from './hooks/useDocuments';
import { DocumentCategory } from './types';
import { ArrowLeft, BarChart3 } from 'lucide-react';

type ViewMode = 'overview' | 'category' | 'upload' | 'stats';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  
  const {
    documents,
    isProcessing,
    uploadDocuments,
    searchDocuments,
    updateDocumentCategory,
    addTagToDocument,
    deleteDocument
  } = useDocuments();

  const filteredDocuments = useMemo(() => {
    if (selectedCategory) {
      return searchDocuments(searchQuery, { category: selectedCategory.id });
    }
    return searchDocuments(searchQuery);
  }, [searchDocuments, searchQuery, selectedCategory]);

  const handleCategoryClick = (category: DocumentCategory) => {
    setSelectedCategory(category);
    setViewMode('category');
  };

  const handleBackToOverview = () => {
    setSelectedCategory(null);
    setViewMode('overview');
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'stats':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4">
              <button
                onClick={handleBackToOverview}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Overview</span>
              </button>
              <h2 className="text-xl font-bold text-gray-900">Document Statistics</h2>
            </div>
            <StatsOverview documents={documents} />
            <div className="p-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Document Health Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800">Well organized documents</span>
                    <span className="font-medium text-green-900">{documents.filter(d => d.category.id !== 'miscellaneous').length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-yellow-800">Need categorization</span>
                    <span className="font-medium text-yellow-900">{documents.filter(d => d.category.id === 'miscellaneous').length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-800">Documents with tags</span>
                    <span className="font-medium text-blue-900">{documents.filter(d => d.tags.length > 0).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'upload':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4">
              <button
                onClick={handleBackToOverview}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Overview</span>
              </button>
              <h2 className="text-xl font-bold text-gray-900">Upload Documents</h2>
            </div>
            <UploadZone onFilesUpload={uploadDocuments} isProcessing={isProcessing} />
          </div>
        );
      
      case 'category':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4">
              <button
                onClick={handleBackToOverview}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Categories</span>
              </button>
              <h2 className="text-xl font-bold text-gray-900">
                {selectedCategory?.name} Documents
              </h2>
            </div>
            <DocumentList
              documents={filteredDocuments}
              onDocumentClick={(doc) => console.log('View document:', doc)}
              onCategoryChange={updateDocumentCategory}
              onDelete={deleteDocument}
            />
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            <StatsOverview documents={documents} />
            
            <div className="flex items-center justify-between p-4">
              <h2 className="text-xl font-bold text-gray-900">Document Categories</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('stats')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>View Stats</span>
                </button>
                <button
                  onClick={() => setViewMode('upload')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Upload Documents
                </button>
              </div>
            </div>
            
            <CategoryGrid
              documents={documents}
              onCategoryClick={handleCategoryClick}
              selectedCategory={selectedCategory?.id}
            />
            
            {documents.length > 0 && (
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Documents</h3>
                <DocumentList
                  documents={documents.slice(0, 5)}
                  onDocumentClick={(doc) => console.log('View document:', doc)}
                  onCategoryChange={updateDocumentCategory}
                  onDelete={deleteDocument}
                />
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        documentCount={documents.length}
      />
      
      <main className="max-w-7xl mx-auto">
        {renderContent()}
      </main>
      
      <AIAssistant documents={documents} />
    </div>
  );
}

export default App;