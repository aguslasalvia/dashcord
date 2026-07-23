import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors, radius } from "@/theme/colors";

// Picks which icon to show for each tab. A plain function is easier to read
// here than a lookup object with fancy TypeScript types.
function getTabIcon(tabName: string): keyof typeof Ionicons.glyphMap {
  if (tabName === "Library") return "albums";
  if (tabName === "Discover") return "search";
  return "person";
}

interface TabBarProps extends BottomTabBarProps {
  bottom: number;
}

// A small icon-only floating pill, centered at the bottom of the screen.
// This is passed as the custom `tabBar` for the bottom tab navigator in
// MainTabs.tsx, so React Navigation calls it with `state`/`navigation`
// instead of rendering its own default tab bar.
export default function TabBar({ state, navigation, bottom }: TabBarProps) {
  return (
    // pointerEvents="box-none" means taps outside the pill (but inside this
    // full-width wrapper) pass through to whatever is underneath.
    <View style={[styles.wrap, { bottom }]} pointerEvents="box-none">
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable key={route.key} onPress={onPress} style={styles.item} hitSlop={8}>
              <Ionicons
                name={getTabIcon(route.name)}
                size={22}
                color={isFocused ? colors.accent : colors.textFaint}
              />
              <View style={[styles.dot, isFocused && styles.dotFocused]} />
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
    gap: 26,
    backgroundColor: colors.bgElev2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingHorizontal: 26,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 14,
  },
  item: {
    alignItems: "center",
    gap: 5,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "transparent",
  },
  dotFocused: {
    backgroundColor: colors.accent,
  },
});
