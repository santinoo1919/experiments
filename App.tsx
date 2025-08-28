import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { CurrencySwapper } from "./src/experiments/currency-swapper";

export default function App() {
  return (
    <View className="flex-1 bg-gray-900">
      <CurrencySwapper />
    </View>
  );
}
