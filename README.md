# UI Playground

A playground for mobile UI component experiments using Expo, TypeScript, and NativeWind.

## 🚀 Tech Stack

- **Expo** - React Native development platform
- **TypeScript** - Type-safe JavaScript
- **NativeWind** - Tailwind CSS for React Native
- **React Native** - Mobile app framework

## 📱 Getting Started

### Prerequisites

- Node.js (v16 or later)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (Xcode) or Android Emulator

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

### Running the App

- **iOS**: Press `i` in the terminal or scan QR code with Expo Go app
- **Android**: Press `a` in the terminal or scan QR code with Expo Go app
- **Web**: Press `w` in the terminal

## 🎨 Project Structure

```
src/
  experiments/          # UI component experiments
    ButtonExperiment.tsx
    CardExperiment.tsx
    InputExperiment.tsx
App.tsx                 # Main app with experiment navigation
tailwind.config.js      # Tailwind CSS configuration
nativewind-env.d.ts     # NativeWind TypeScript declarations
babel.config.js         # Babel configuration with NativeWind plugin
metro.config.js         # Metro bundler configuration
```

## 🧪 Adding New Experiments

1. Create a new component in `src/experiments/`
2. Export it as the default export
3. Import and add it to the experiments array in `App.tsx`

### Example Experiment Component

```tsx
import { View, Text } from "react-native";

export function MyExperiment() {
  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold text-gray-900">My Experiment</Text>
    </View>
  );
}
```

## 🎯 NativeWind Usage

Use Tailwind CSS classes directly in your components:

```tsx
<View className="bg-blue-500 rounded-lg p-4 shadow-lg">
  <Text className="text-white font-semibold text-center">
    Styled with NativeWind
  </Text>
</View>
```

## 📚 Resources

- [NativeWind Documentation](https://www.nativewind.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🔧 Troubleshooting

If you encounter issues:

1. Clear Metro cache: `npx expo start --clear`
2. Reset Expo cache: `npx expo start -c`
3. Check NativeWind setup in `babel.config.js`
4. Ensure TypeScript types are properly configured
