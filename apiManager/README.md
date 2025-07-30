# API Manager App

A React Native mobile application for managing API keys with authentication and comprehensive API management features.

## Features

### Authentication
- User registration and login
- Secure token-based authentication
- Automatic session management

### API Management
- Add new API keys with email association
- View all APIs with detailed information
- Reset API usage and status
- Pause/overload APIs
- Delete APIs with confirmation
- Real-time statistics dashboard

### UI/UX
- Modern, clean interface
- Responsive design
- Pull-to-refresh functionality
- Loading states and error handling
- Confirmation dialogs for destructive actions

## Backend Integration

This app integrates with your Express.js backend and uses the following endpoints:

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### API Management Endpoints
- `POST /api/api/addApi` - Add new API
- `GET /api/api/getAllApis` - Get all APIs
- `POST /api/api/overUsage` - Pause/overload API
- `POST /api/api/resetApi` - Reset API status and usage
- `DELETE /api/api/deleteApi` - Delete API

## Setup Instructions

### Prerequisites
1. Node.js and npm installed
2. Expo CLI installed globally: `npm install -g expo-cli`
3. Your Express backend running on `http://localhost:3000`

### Installation
1. Navigate to the apiManager directory:
   ```bash
   cd apiManager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on Android:
   ```bash
   npm run android
   ```

5. Run on iOS:
   ```bash
   npm run ios
   ```

## Configuration

### Backend URL
Update the `BACKEND_URL` constant in the following files to match your backend URL:
- `app/(tabs)/index.tsx` (line 18)
- `app/dashboard.tsx` (line 18)

```javascript
const BACKEND_URL = 'http://localhost:3000/api'; // Update this with your backend URL
```

## App Flow

1. **Login Screen** - First screen users see
   - Login with existing credentials
   - Sign up for new account
   - Automatic redirect to dashboard if already authenticated

2. **Dashboard Screen** - Main API management interface
   - Statistics overview (Total, Active, Paused APIs)
   - Add new API button
   - List of all APIs with management actions
   - Pull-to-refresh functionality
   - Logout option

## API Data Structure

Each API object contains:
```javascript
{
  _id: string,
  apiEmail: string,
  apiKey: string,
  apiStatus: 'active' | 'overloaded',
  apiUsage: number,
  createdAt: string
}
```

## Features in Detail

### Add New API
- Modal form for entering API email and key
- Validation for required fields
- Success/error feedback

### API Management Actions
- **Reset**: Resets API status to 'active' and usage to 0
- **Pause**: Sets API status to 'overloaded'
- **Delete**: Removes API with confirmation dialog

### Statistics Dashboard
- Total number of APIs
- Number of active APIs
- Number of paused/overloaded APIs

## Security Features

- JWT token storage in AsyncStorage
- Automatic authentication checks
- Secure logout functionality
- Input validation and sanitization

## Error Handling

- Network error handling
- User-friendly error messages
- Loading states for better UX
- Graceful fallbacks

## Development Notes

- Built with Expo Router for navigation
- Uses React Native's built-in components
- TypeScript for type safety
- Modern React hooks for state management
- Responsive design for different screen sizes

## Troubleshooting

### Common Issues

1. **Expo command not found**
   - Install Expo CLI: `npm install -g expo-cli`
   - Or use npx: `npx expo start`

2. **Backend connection issues**
   - Ensure your Express backend is running
   - Check the BACKEND_URL configuration
   - Verify CORS settings in your backend

3. **Authentication issues**
   - Clear AsyncStorage if needed
   - Check backend authentication endpoints
   - Verify JWT token handling

### Development Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web

# Lint code
npm run lint
```

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Test on both Android and iOS
4. Update documentation for new features

## License

This project is part of your AI Interview application suite.
