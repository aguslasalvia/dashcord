import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { colors } from "@/theme/colors";

// Settings for a single animated bar: how tall it gets, how long one
// up-or-down move takes, and how long to wait before it starts (so all the
// bars don't move in perfect sync — that's what makes it look organic).
interface BarConfig {
  minHeight: number;
  maxHeight: number;
  duration: number;
  delay: number;
}

interface Preset {
  barWidth: number;
  gap: number;
  bars: BarConfig[];
}

// Three sizes to reuse across the app: a big one for the login/register
// hero, a medium one for loading spinners, and a small one for inline
// "now playing" indicators.
const PRESETS: { hero: Preset; md: Preset; sm: Preset } = {
  hero: {
    barWidth: 6,
    gap: 7,
    bars: [
      { minHeight: 14, maxHeight: 40, duration: 620, delay: 0 },
      { minHeight: 22, maxHeight: 74, duration: 740, delay: 90 },
      { minHeight: 18, maxHeight: 58, duration: 560, delay: 180 },
      { minHeight: 26, maxHeight: 96, duration: 820, delay: 40 },
      { minHeight: 16, maxHeight: 66, duration: 680, delay: 220 },
      { minHeight: 24, maxHeight: 52, duration: 600, delay: 130 },
      { minHeight: 14, maxHeight: 44, duration: 700, delay: 60 },
    ],
  },
  md: {
    barWidth: 4,
    gap: 5,
    bars: [
      { minHeight: 6, maxHeight: 16, duration: 480, delay: 0 },
      { minHeight: 8, maxHeight: 26, duration: 560, delay: 110 },
      { minHeight: 6, maxHeight: 20, duration: 420, delay: 210 },
      { minHeight: 8, maxHeight: 24, duration: 520, delay: 60 },
    ],
  },
  sm: {
    barWidth: 3,
    gap: 3,
    bars: [
      { minHeight: 3, maxHeight: 8, duration: 380, delay: 0 },
      { minHeight: 4, maxHeight: 13, duration: 440, delay: 90 },
      { minHeight: 3, maxHeight: 10, duration: 400, delay: 170 },
    ],
  },
};

interface BarProps extends BarConfig {
  width: number;
  color: string;
  opacity: number;
}

// One vertical bar that grows and shrinks forever. `withRepeat(..., -1,
// true)` means "repeat forever, and reverse direction each time" — that's
// what makes it go up, then back down, then up again, instead of jumping.
function Bar({ minHeight, maxHeight, duration, delay, width, color, opacity }: BarProps) {
  const height = useSharedValue(minHeight);

  useEffect(() => {
    height.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(maxHeight, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(minHeight, { duration, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({ height: height.value }));

  return (
    <Animated.View
      style={[styles.bar, style, { width, borderRadius: width / 2, backgroundColor: color, opacity }]}
    />
  );
}

interface EqualizerBarsProps {
  size?: "hero" | "md" | "sm";
  color?: string;
  opacity?: number;
}

// The app's one recurring signature motion — a little audio equalizer.
// Used at brand scale on the auth screens, and reused everywhere something
// needs to signal "loading" or "playing right now" instead of a generic spinner.
export default function EqualizerBars({ size = "md", color = colors.accent, opacity = 1 }: EqualizerBarsProps) {
  const preset = PRESETS[size];
  const maxBarHeight = Math.max(...preset.bars.map((bar) => bar.maxHeight));

  return (
    <View style={[styles.row, { gap: preset.gap, height: maxBarHeight }]} pointerEvents="none">
      {preset.bars.map((bar, i) => (
        <Bar key={i} {...bar} width={preset.barWidth} color={color} opacity={opacity} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  bar: {
    alignSelf: "flex-end",
  },
});
