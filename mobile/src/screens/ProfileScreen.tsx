import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius } from "@/theme/colors";
import { getAllPlaylist } from "@/lib/playlist";
import { useAuth } from "@/hooks/useAuth";
import { usePlayer } from "@/player/audioEngine";
import ScreenGlow from "@/components/ScreenGlow";
import { TAB_BAR_HEIGHT, TAB_BAR_MARGIN, PLAYER_BAR_HEIGHT, FLOATING_GAP } from "@/navigation/layout";

// The "Profile" tab: shows the signed-in user, some quick stats about
// their library, and the sign out / delete account actions.
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { username, signOut } = useAuth();
  const { current } = usePlayer();
  const [stats, setStats] = useState({ playlists: 0, songs: 0 });

  // There's no dedicated "stats" endpoint, so we just fetch every playlist
  // and count them up ourselves.
  useEffect(() => {
    getAllPlaylist().then((playlists) => {
      const songs = playlists.reduce((sum, p) => sum + (p.songs?.length ?? 0), 0);
      setStats({ playlists: playlists.length, songs });
    });
  }, []);

  // Used for the round avatar bubble, e.g. "agus" -> "A".
  const initial = username ? username[0].toUpperCase() : "?";

  const bottomReserve =
    insets.bottom +
    TAB_BAR_MARGIN +
    TAB_BAR_HEIGHT +
    FLOATING_GAP +
    (current ? PLAYER_BAR_HEIGHT + FLOATING_GAP : 0) +
    16;

  return (
    <View style={styles.screen}>
      <ScreenGlow height={340 + insets.top} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: bottomReserve }]}
        showsVerticalScrollIndicator={false}
      >
      <Text style={styles.eyebrow}>Profile</Text>

      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.name}>{username ?? "Unknown"}</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{stats.playlists}</Text>
          <Text style={styles.statLabel}>Playlists</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNum}>{stats.songs}</Text>
          <Text style={styles.statLabel}>Songs saved</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <View style={styles.sectionIcon}>
            <Ionicons name="log-out-outline" size={18} color={colors.text} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Session</Text>
            <Text style={styles.sectionSubtitle}>Sign out on this device.</Text>
          </View>
        </View>
        <Pressable
          style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
          onPress={signOut}
        >
          <Text style={styles.secondaryLabel}>Sign out</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <View style={[styles.sectionIcon, styles.dangerIcon]}>
            <Ionicons name="trash" size={17} color={colors.danger} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sectionTitle, styles.dangerTitle]}>Danger zone</Text>
            <Text style={styles.sectionSubtitle}>Permanently delete your account and data.</Text>
          </View>
        </View>
        <Pressable style={[styles.secondaryBtn, styles.dangerBtn]} disabled>
          <Text style={styles.dangerLabel}>Delete account</Text>
        </Pressable>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: 20,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  hero: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: radius.full,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  avatarText: {
    fontFamily: fonts.bold,
    color: colors.accent,
    fontSize: 30,
  },
  name: {
    fontFamily: fonts.bold,
    color: colors.text,
    fontSize: 24,
  },
  stats: {
    flexDirection: "row",
    backgroundColor: colors.bgElev,
    borderRadius: radius.lg,
    paddingVertical: 20,
    marginBottom: 16,
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  statNum: {
    fontFamily: fonts.bold,
    color: colors.text,
    fontSize: 24,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    backgroundColor: colors.bgElev,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 14,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
  },
  sectionIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.bgElev2,
    alignItems: "center",
    justifyContent: "center",
  },
  dangerIcon: {
    backgroundColor: "rgba(244, 63, 94, 0.14)",
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.75,
  },
  secondaryBtn: {
    alignSelf: "flex-start",
    backgroundColor: colors.bgElev2,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: radius.full,
  },
  secondaryLabel: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 13,
  },
  dangerTitle: {
    color: colors.danger,
  },
  dangerBtn: {
    opacity: 0.4,
  },
  dangerLabel: {
    color: colors.textFaint,
    fontWeight: "700",
    fontSize: 13,
  },
});
