import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/theme/colors";
import PlaylistsScreen from "@/screens/PlaylistsScreen";
import SongsScreen from "@/screens/SongsScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import PlayerBar from "@/components/PlayerBar";
import { usePlayer } from "@/player/audioEngine";
import TabBar from "./TabBar";
import { TAB_BAR_HEIGHT, TAB_BAR_MARGIN, FLOATING_GAP } from "./layout";
import type { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

// The three main tabs (Library, Discover, Profile), plus the floating mini
// player shown above the tab bar whenever a song is loaded. `tabBar` is
// swapped for our own TabBar component instead of React Navigation's
// default one, so we control exactly how it looks.
export default function MainTabs() {
  const insets = useSafeAreaInsets();
  const { current } = usePlayer();
  const tabBarBottom = insets.bottom + TAB_BAR_MARGIN;
  const playerBottom = tabBarBottom + TAB_BAR_HEIGHT + FLOATING_GAP;

  return (
    <View style={styles.wrap}>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <TabBar {...props} bottom={tabBarBottom} />}
      >
        <Tab.Screen name="Library" component={PlaylistsScreen} />
        <Tab.Screen name="Discover" component={SongsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      {!!current && <PlayerBar bottom={playerBottom} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
