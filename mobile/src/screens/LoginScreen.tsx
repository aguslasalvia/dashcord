import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { colors, fonts } from "@/theme/colors";
import { login } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import EqualizerBars from "@/components/EqualizerBars";
import ScreenGlow from "@/components/ScreenGlow";
import AuthField from "@/components/auth/AuthField";
import AuthButton from "@/components/auth/AuthButton";

// The sign-in screen. If login succeeds we call signIn() from useAuth,
// which flips isAuthenticated to true — the navigator then automatically
// swaps to the main app, so we don't need to navigate anywhere ourselves.
export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const { showToast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) return;
    setSubmitting(true);
    try {
      const response = await login(username, password);
      if (response) {
        await signIn(response.token, username);
      } else {
        showToast("User not found. Check your credentials.", "error");
      }
    } catch {
      // Most likely the server is unreachable.
      showToast("Connection error. Is the server running?", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenGlow height={420 + insets.top} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.duration(450)} style={styles.hero}>
            <EqualizerBars size="hero" />
            <Text style={styles.brand}>
              dash<Text style={styles.brandEm}>cord</Text>
            </Text>
            <Text style={styles.tagline}>Your library, on the go.</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(120).duration(400)} style={styles.form}>
            <AuthField
              icon="person-outline"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Username"
              returnKeyType="next"
            />
            <AuthField
              icon="lock-closed-outline"
              rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowPassword((v) => !v)}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Password"
              returnKeyType="go"
              onSubmitEditing={handleLogin}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(220).duration(400)}>
            <AuthButton
              label="Sign in"
              loading={submitting}
              disabled={!username || !password}
              onPress={handleLogin}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.switchRow}>
            <Text style={styles.switchText}>New here? </Text>
            <Pressable onPress={() => navigation.navigate("Register")} hitSlop={8}>
              <Text style={styles.switchLink}>Create an account</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  hero: {
    alignItems: "center",
    marginBottom: 40,
  },
  brand: {
    fontFamily: fonts.bold,
    fontSize: 38,
    color: colors.text,
    marginTop: 18,
  },
  brandEm: {
    color: colors.accent,
  },
  tagline: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 6,
  },
  form: {
    gap: 14,
    marginBottom: 22,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  switchText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  switchLink: {
    color: colors.accent,
    fontWeight: "700",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
