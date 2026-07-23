import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, DarkTheme, type Theme } from "@react-navigation/native";
import {
  useFonts,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import { store } from "@/store/store";
import { colors } from "@/theme/colors";
import { AuthProvider } from "@/hooks/useAuth";
import { ToastProvider } from "@/hooks/useToast";
import RootNavigator from "@/navigation/RootNavigator";
import EqualizerBars from "@/components/EqualizerBars";

const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.accent,
    background: colors.bg,
    card: colors.bgElev,
    text: colors.text,
    border: colors.border,
    notification: colors.accent,
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
        <EqualizerBars size="hero" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AuthProvider>
          <ToastProvider>
            <NavigationContainer theme={navigationTheme}>
              <RootNavigator />
            </NavigationContainer>
          </ToastProvider>
        </AuthProvider>
      </SafeAreaProvider>
      <StatusBar style="light" />
    </Provider>
  );
}
