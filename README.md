# NOGA - Food Health Analysis App

A modern React Native app built with Expo that helps users analyze food ingredients and nutrition information through OCR scanning or manual input.

## Features

- 📸 **Camera OCR**: Scan food labels and ingredient lists
- 🔍 **Health Analysis**: AI-powered ingredient safety assessment
- 📊 **Nutrition Tracking**: Analyze nutrition facts and values
- ⚠️ **Preservative Detection**: Identify harmful additives
- 💡 **Smart Recommendations**: Get healthier food alternatives

## Tech Stack

- **Expo SDK 54** with React Native
- **Expo Router** for file-based navigation
- **NativeWind** (Tailwind CSS for React Native)
- **TypeScript** with strict mode
- **AsyncStorage** for data persistence
- **Axios** for API communication

## Quick Start

### Prerequisites

- Node.js >= 20.19.4
- Android Studio (for Android) or Xcode (for iOS)
- Expo Go app on your phone (for testing)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios
```

### Environment Setup

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=your_api_url_here
EXPO_PUBLIC_AI_URL=your_ai_api_url_here
```

## Project Structure

```
noga-app/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout
│   ├── index.tsx           # Home screen
│   └── ...                 # Other screens
├── components/             # Reusable components
├── lib/                    # Utilities and helpers
├── services/               # API services
├── types/                  # TypeScript types
└── assets/                 # Images and icons
```

## Development

```bash
# Clear cache and start
npx expo start --clear

# Type checking
npx tsc --noEmit

# Rebuild native code
npx expo prebuild --clean
```

## Navigation

Uses Expo Router with file-based routing:
- `/` - Home
- `/food-type` - Select food type
- `/type-ingredient` - Manual input
- `/one-take-picture` - Camera for prepared food
- `/two-take-picture` - Camera for packaged food
- `/nutrition-general` - Results overview
- `/nutrition-detail` - Detailed analysis

## Key Libraries

- `expo-router` - File-based navigation
- `expo-camera` - Camera and OCR
- `nativewind` - Tailwind CSS for React Native
- `react-native-animatable` - Animations
- `axios` - HTTP client
- `@react-native-async-storage/async-storage` - Local storage

## License

Private - All rights reserved

## Support

For issues and questions, please open an issue on the repository.
