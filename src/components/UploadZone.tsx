import React, { useCallback, useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle } from 'lucide-react';

interface UploadZoneProps {
  onFilesUpload: (files: FileList) => Promise<any[]>;
  isProcessing: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFilesUpload, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setUploadProgress(Array.from(files).map(f => f.name));
      await onFilesUpload(files);
      setUploadProgress([]);
    }
  }, [onFilesUpload]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadProgress(Array.from(files).map(f => f.name));
      await onFilesUpload(files);
      setUploadProgress([]);
    }
    e.target.value = '';
  }, [onFilesUpload]);

  return (
    <div className="p-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          {isProcessing ? (
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 text-gray-400" />
          )}
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isProcessing ? 'Processing documents...' : 'Upload your documents'}
            </h3>
            <p className="text-gray-500 mb-4">
              Drag and drop files here, or click to browse
            </p>
            
            {!isProcessing && (
              <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                <FileText className="w-4 h-4 mr-2" />
                Choose Files
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            )}
          </div>
          
          {uploadProgress.length > 0 && (
            <div className="w-full max-w-md space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Processing files:</h4>
              {uploadProgress.map((fileName, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  <span className="text-gray-600 truncate">{fileName}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-xs text-gray-400">
            Supports PDF, Word, Images, and more • Max 10MB per file
          </div>
        </div>
      </div>
    </div>
  );
};