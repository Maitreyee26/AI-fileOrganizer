import React from 'react';
import { Shield, FileText, Zap, Users, Lock, Globe } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const { login, isLoading, error } = useAuth();

  const features = [
    {
      icon: FileText,
      title: 'Smart Organization',
      description: 'AI-powered categorization of your documents into 12+ categories'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your documents are encrypted and stored securely with full privacy control'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Upload, search, and organize thousands of documents in seconds'
    },
    {
      icon: Users,
      title: 'Multi-Profile',
      description: 'Organize documents for yourself, family members, and dependents'
    },
    {
      icon: Lock,
      title: 'Secure Sharing',
      description: 'Generate secure, expiring links to share documents safely'
    },
    {
      icon: Globe,
      title: 'Global Support',
      description: 'Multi-language support with region-specific document recognition'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex min-h-screen">
        {/* Left side - Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12">
          <div className="max-w-md">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">DocOrganizer</h1>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Organize your documents with AI
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Upload, categorize, and manage all your important documents in one secure place.
            </p>
            
            <div className="space-y-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Right side - Login */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                <p className="text-gray-600 mt-2">
                  Sign in to access your document organizer
                </p>
              </div>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              <button
                onClick={login}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Sign in with Keycloak</span>
                  </>
                )}
              </button>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Secure authentication powered by Keycloak
                </p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    New to DocOrganizer?
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Free to start</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>1000+ documents</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>AI categorization</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Secure storage</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};