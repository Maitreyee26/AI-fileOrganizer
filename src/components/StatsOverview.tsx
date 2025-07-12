import React from 'react';
import { FileText, FolderOpen, Clock, Shield } from 'lucide-react';
import { Document } from '../types';

interface StatsOverviewProps {
  documents: Document[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ documents }) => {
  const totalDocuments = documents.length;
  const categorizedDocuments = documents.filter(doc => doc.category.id !== 'miscellaneous').length;
  const recentDocuments = documents.filter(doc => {
    const daysDiff = (Date.now() - doc.uploadDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  }).length;
  
  const organizationScore = totalDocuments > 0 ? Math.round((categorizedDocuments / totalDocuments) * 100) : 0;

  const stats = [
    {
      label: 'Total Documents',
      value: totalDocuments,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Categories Used',
      value: new Set(documents.map(doc => doc.category.id)).size,
      icon: FolderOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Added This Week',
      value: recentDocuments,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      label: 'Organization Score',
      value: `${organizationScore}%`,
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <IconComponent className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};