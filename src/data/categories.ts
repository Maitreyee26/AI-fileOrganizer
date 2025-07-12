import { DocumentCategory } from '../types';

export const documentCategories: DocumentCategory[] = [
  {
    id: 'education',
    name: 'Education',
    icon: 'GraduationCap',
    color: 'bg-blue-500',
    subcategories: ['Diplomas', 'Degrees', 'Report Cards', 'Course Certificates']
  },
  {
    id: 'employment',
    name: 'Employment & Income',
    icon: 'Briefcase',
    color: 'bg-green-500',
    subcategories: ['Offer Letters', 'Contracts', 'Pay Stubs', 'Tax Documents']
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: 'DollarSign',
    color: 'bg-emerald-500',
    subcategories: ['Bank Statements', 'Loans', 'Credit Cards', 'Investments']
  },
  {
    id: 'medical',
    name: 'Medical',
    icon: 'Heart',
    color: 'bg-red-500',
    subcategories: ['Prescriptions', 'Reports', 'Claims', 'Vaccination Records']
  },
  {
    id: 'utilities',
    name: 'Utilities & Bills',
    icon: 'Zap',
    color: 'bg-yellow-500',
    subcategories: ['Electricity', 'Water', 'Gas', 'Mobile', 'Internet']
  },
  {
    id: 'property',
    name: 'Property & Rent',
    icon: 'Home',
    color: 'bg-purple-500',
    subcategories: ['Lease', 'Title Deeds', 'Property Tax', 'Agreements']
  },
  {
    id: 'legal',
    name: 'Legal & Identity',
    icon: 'Shield',
    color: 'bg-indigo-500',
    subcategories: ['Passport', 'ID Cards', 'Driver\'s License', 'Certificates']
  },
  {
    id: 'vehicles',
    name: 'Vehicles',
    icon: 'Car',
    color: 'bg-orange-500',
    subcategories: ['Registration', 'PUC', 'Insurance', 'Service History']
  },
  {
    id: 'insurance',
    name: 'Insurance',
    icon: 'Umbrella',
    color: 'bg-cyan-500',
    subcategories: ['Health', 'Life', 'Travel', 'Vehicle']
  },
  {
    id: 'personal',
    name: 'Personal & Family',
    icon: 'Users',
    color: 'bg-pink-500',
    subcategories: ['Emergency Info', 'Family IDs', 'Notes', 'Kids Docs']
  },
  {
    id: 'purchases',
    name: 'Online Purchases',
    icon: 'ShoppingCart',
    color: 'bg-violet-500',
    subcategories: ['Invoices', 'Warranties', 'Subscriptions']
  },
  {
    id: 'miscellaneous',
    name: 'Miscellaneous',
    icon: 'FolderOpen',
    color: 'bg-gray-500',
    subcategories: ['Uncategorized', 'Tickets', 'Receipts', 'Memberships']
  }
];