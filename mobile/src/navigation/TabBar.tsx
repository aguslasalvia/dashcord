import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Library, LucideIcon, Search, User } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors, radius } from "@/theme/colors";

function getTabIcon(tabName: string): LucideIcon {
  if (tabName === "Library") return Library;
  if (tabName === "Discover") return Search;
  return User;
}

interface TabBarProps extends BottomTabBarProps {
  bottom: number;
}

const ITEM_SIZE = 48;
const GAP = 34;
const PADDING = 12;
const STEP = ITEM_SIZE + GAP;

// A floating pill tab bar, centered at the bottom of the screen, with a
// soft accent-tinted highlight that slides behind whichever tab is active.
// Passed as the custom `tabBar` for the bottom tab navigator in
// MainTabs.tsx, so React Navigation calls it with `state`/`navigation`
// instead of rendering its own default tab bar.
export default function TabBar({ state, navigation, bottom }: TabBarProps) {
  const indicatorX = useSharedValue(state.index * STEP);

  useEffect(() => {
    indicatorX.value = withSpring(state.index * STEP, { damping: 18, stiffness: 220, mass: 0.6 });
  }, [state.index, indicatorX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    // pointerEvents="box-none" means taps outside the pill (but inside this
    // full-width wrapper) pass through to whatever is underneath.
    <View style={[styles.wrap, { bottom }]} pointerEvents="box-none">
      <View style={styles.bar}>
        <LinearGradient
          colors={["rgba(255,255,255,0.07)", "rgba(255,255,255,0)"]}
          style={styles.sheen}
          pointerEvents="none"
        />
        <Animated.View style={[styles.indicator, indicatorStyle]} />

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const TabIcon = getTabIcon(route.name);

          const onPress = () => {
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable key={route.key} onPress={onPress} style={styles.item} hitSlop={8}>
              <TabIcon
                size={21}
                color={isFocused ? colors.accent : colors.textFaint}
                strokeWidth={isFocused ? 2.4 : 2}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: GAP,
    padding: PADDING,
    backgroundColor: "rgba(31, 31, 40, 0.92)",
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    overflow: "hidden",
    shadowColor: colors.accent,
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 16,
  },
  sheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "55%",
  },
  indicator: {
    position: "absolute",
    top: PADDING,
    left: PADDING,
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: "rgba(244, 63, 94, 0.35)",
  },
  item: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
});
