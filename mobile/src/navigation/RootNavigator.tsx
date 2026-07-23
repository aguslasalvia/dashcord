import { StyleSheet, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { useAuth } from "@/hooks/useAuth";
import LoginScreen from "@/screens/LoginScreen";
import RegisterScreen from "@/screens/RegisterScreen";
import PlaylistScreen from "@/screens/PlaylistScreen";
import EqualizerBars from "@/components/EqualizerBars";
import MainTabs from "./MainTabs";
import type { AuthStackParamList, MainStackParamList } from "./types";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

// Decides which set of screens to show:
//  - still checking AsyncStorage for a saved login -> a loading screen
//  - not logged in -> Login/Register
//  - logged in -> the main app (tabs + playlist detail)
export default function RootNavigator() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return (
      <View style={styles.splash}>
        <EqualizerBars size="hero" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Register" component={RegisterScreen} />
      </AuthStack.Navigator>
    );
  }

  return (
    <MainStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bgElev },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <MainStack.Screen name="Tabs" component={MainTabs} options={{ headerShown: false }} />
      <MainStack.Screen
        name="Playlist"
        component={PlaylistScreen}
        options={({ route }) => ({ title: route.params?.name ?? "" })}
      />
    </MainStack.Navigator>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
});
