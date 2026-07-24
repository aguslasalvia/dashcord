import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radius } from "@/theme/colors";
import EqualizerBars from "@/components/EqualizerBars";

interface AuthButtonProps {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

// The big pill-shaped submit button on the login/register screens. While
// `loading` is true it shows the little equalizer animation instead of
// its label, so the user knows the request is in flight.
export default function AuthButton({ label, loading, disabled, onPress }: AuthButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
      disabled={disabled || loading}
      onPress={onPress}
    >
      {loading ? <EqualizerBars size="sm" color={colors.accentInk} /> : <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.accent,
    borderRadius: radius.full,
    paddingVertical: 17,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    color: colors.accentInk,
    fontWeight: "700",
    fontSize: 16,
  },
});
