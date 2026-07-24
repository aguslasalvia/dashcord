import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface ScreenGlowProps {
  height?: number;
}

// The same top glow used on the auth screens, reused everywhere so the whole
// app reads as one surface instead of auth being a separate "designed" moment.
export default function ScreenGlow({ height = 420 }: ScreenGlowProps) {
  return (
    <LinearGradient
      colors={["rgba(244, 63, 94, 0.22)", "rgba(244, 63, 94, 0)"]}
      style={[styles.glow, { height }]}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  glow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
});
