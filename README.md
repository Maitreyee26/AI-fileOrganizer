# AI-Based Document Organizer

A full-stack AI-powered document organizer with React frontend, Node.js/Express backend, and Keycloak authentication.

## Features

### 🤖 AI-Powered Organization
- Automatic document categorization using AI
- 12+ predefined categories (Education, Finance, Medical, etc.)
- Confidence scoring for categorization accuracy
- Smart tagging and metadata extraction

### 🔐 Secure Authentication
- Keycloak integration for enterprise-grade security
- Role-based access control
- Secure session management
- Multi-profile support

### 📱 Modern Web Interface
- Responsive design for all devices
- Beautiful, intuitive user interface
- Real-time document processing
- Advanced search and filtering

### 🛡️ Privacy-First Architecture
- Encrypted document storage
- Secure file uploads
- Privacy-compliant data handling
- Optional cloud sync

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API communication
- **React Query** for state management

### Backend
- **Node.js** with Express
- **Keycloak** for authentication
- **Multer** for file uploads
- **JWT** for token management
- **Helmet** for security

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Keycloak server (optional for development)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-document-organizer
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Keycloak Configuration
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=document-organizer
KEYCLOAK_CLIENT_ID=document-organizer-client
KEYCLOAK_CLIENT_SECRET=your-client-secret

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

4. **Start Development Servers**

Option 1 - Start both frontend and backend:
```bash
npm run dev:full
```

Option 2 - Start separately:
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend  
npm run dev
```

### Keycloak Setup (Optional)

For full authentication functionality, set up Keycloak:

1. **Download and start Keycloak**
```bash
# Download Keycloak
wget https://github.com/keycloak/keycloak/releases/download/22.0.1/keycloak-22.0.1.zip
unzip keycloak-22.0.1.zip
cd keycloak-22.0.1

# Start Keycloak
bin/kc.sh start-dev
```

2. **Configure Keycloak**
- Access admin console: http://localhost:8080
- Create realm: `document-organizer`
- Create client: `document-organizer-client`
- Configure client settings for web application

## API Endpoints

### Authentication
- `GET /api/auth/login` - Initiate login
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/status` - Check auth status

### Documents
- `POST /api/documents/upload` - Upload documents
- `GET /api/documents` - List documents
- `GET /api/documents/:id` - Get document
- `PUT /api/documents/:id/category` - Update category
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/stats/overview` - Get statistics

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/preferences` - Update preferences
- `GET /api/users/activity` - Get activity log

## Document Categories

1. **Education** - Diplomas, Degrees, Certificates
2. **Employment & Income** - Contracts, Pay Stubs, Tax Documents
3. **Finance** - Bank Statements, Loans, Investments
4. **Medical** - Prescriptions, Reports, Vaccination Records
5. **Utilities & Bills** - Electricity, Water, Internet
6. **Property & Rent** - Lease, Deeds, Agreements
7. **Legal & Identity** - Passport, License, Certificates
8. **Vehicles** - Registration, Insurance, Service History
9. **Insurance** - Health, Life, Travel policies
10. **Personal & Family** - Emergency Info, Family Documents
11. **Online Purchases** - Invoices, Warranties
12. **Miscellaneous** - Uncategorized documents

## Security Features

- **Keycloak Authentication** - Enterprise-grade security
- **JWT Tokens** - Secure API access
- **File Upload Validation** - Type and size restrictions
- **CORS Protection** - Cross-origin request security
- **Helmet.js** - Security headers
- **Input Validation** - Request sanitization

## Development

### Project Structure
```
├── src/                    # Frontend React application
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API service layers
│   ├── types/             # TypeScript definitions
│   └── config/            # Configuration files
├── server/                # Backend Node.js application
│   ├── routes/            # Express route handlers
│   ├── middleware/        # Custom middleware
│   ├── config/            # Server configuration
│   └── index.js           # Server entry point
└── uploads/               # File upload directory
```

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run dev:server` - Start backend server
- `npm run dev:full` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Deployment

### Frontend Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

### Backend Deployment
```bash
# Set production environment variables
NODE_ENV=production
# Deploy server/ folder to your hosting provider
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints

---

Built with ❤️ using React, Node.js, and Keycloak