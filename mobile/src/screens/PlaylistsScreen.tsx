import { useCallback, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Library, Plus, Search, X } from "lucide-react-native";
import { colors, fonts, radius } from "@/theme/colors";
import PlaylistCard from "@/components/PlaylistCard";
import EqualizerBars from "@/components/EqualizerBars";
import ScreenGlow from "@/components/ScreenGlow";
import { createPlaylist, getAllPlaylist } from "@/lib/playlist";
import { IPlaylist } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { usePlayer } from "@/player/audioEngine";
import { TAB_BAR_HEIGHT, TAB_BAR_MARGIN, PLAYER_BAR_HEIGHT, FLOATING_GAP } from "@/navigation/layout";

// The "Library" tab: shows the user's playlists in a grid, lets them
// search by name, and create new (empty) playlists.
export default function PlaylistsScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { username } = useAuth();
  const { showToast } = useToast();
  const { current } = usePlayer();
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await getAllPlaylist();
    setPlaylists(data);
    setLoading(false);
  }, []);

  // useFocusEffect (instead of a plain useEffect) re-runs this every time
  // the user comes back to this tab — so if they just created a playlist
  // on another screen, the list is up to date when they return here.
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const ok = await createPlaylist({ name: newName.trim(), created_by: username ?? "", songs: [] });
    setCreating(false);
    if (ok) {
      showToast("Playlist created", "success");
      setIsModalOpen(false);
      setNewName("");
      fetchData();
    } else {
      showToast("Couldn't create the playlist.", "error");
    }
  };

  const filtered = playlists.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()));

  // Playlists don't always have their own cover image — fall back to the
  // first song's YouTube thumbnail if there is one.
  const coverFor = (playlist: IPlaylist) => {
    if (playlist.cover) return playlist.cover;
    const youtubeId = playlist.songs?.[0]?.youtube_id;
    if (youtubeId) return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
    return undefined;
  };

  // How much empty space to leave at the bottom of the list so the last
  // row isn't hidden behind the floating tab bar (and the mini player
  // too, if a song happens to be playing).
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
      <View style={[styles.content, { paddingTop: insets.top + 12 }]}>
        <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Library</Text>
          <Text style={styles.title}>
            Your <Text style={styles.titleEm}>music</Text>
          </Text>
          <Text style={styles.subtitle}>
            {playlists.length} {playlists.length === 1 ? "playlist" : "playlists"}
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
          onPress={() => setIsModalOpen(true)}
          hitSlop={6}
        >
          <Plus size={22} color={colors.accentInk} />
        </Pressable>
      </View>

      <View style={styles.searchWrap}>
        <Search size={17} color={colors.textFaint} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name…"
          placeholderTextColor={colors.textFaint}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <View style={styles.loading}>
          <EqualizerBars />
        </View>
      ) : filtered.length > 0 ? (
        <FlatList
          data={filtered}
          keyExtractor={(item, idx) => item._id ?? String(idx)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[styles.grid, { paddingBottom: bottomReserve }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PlaylistCard
              _id={item._id ?? ""}
              title={item.name}
              created={item.created_by}
              cover={coverFor(item)}
              songs={item.songs}
              onPress={() => navigation.navigate("Playlist", { id: item._id, name: item.name })}
            />
          )}
        />
      ) : (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            {playlists.length > 0 && search ? (
              <Search size={26} color={colors.textFaint} />
            ) : (
              <Library size={26} color={colors.textFaint} />
            )}
          </View>
          <Text style={styles.emptyText}>
            {playlists.length > 0
              ? `Nothing matches "${search}".`
              : "No playlists yet — start one to build your library."}
          </Text>
        </View>
      )}

      <Modal visible={isModalOpen} transparent animationType="fade" onRequestClose={() => setIsModalOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setIsModalOpen(false)}>
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New playlist</Text>
              <Pressable onPress={() => setIsModalOpen(false)} hitSlop={8}>
                <X size={20} color={colors.textMuted} />
              </Pressable>
            </View>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="My new playlist"
              placeholderTextColor={colors.textFaint}
              autoFocus
            />
            <View style={styles.modalActions}>
              <Pressable
                style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
                onPress={() => setIsModalOpen(false)}
              >
                <Text style={styles.secondaryLabel}>Cancel</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
                onPress={handleCreate}
                disabled={creating}
              >
                <Text style={styles.primaryLabel}>{creating ? "Creating…" : "Create"}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 30,
    color: colors.text,
  },
  titleEm: {
    color: colors.accent,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  pressed: {
    opacity: 0.75,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.bgElev,
    borderRadius: radius.full,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    paddingVertical: 13,
    fontSize: 15,
  },
  loading: {
    marginTop: 60,
    alignItems: "center",
  },
  grid: {
    gap: 20,
  },
  row: {
    gap: 20,
  },
  empty: {
    alignItems: "center",
    marginTop: 60,
    gap: 14,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.bgElev,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: "center",
    paddingHorizontal: 40,
    fontSize: 14,
    lineHeight: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: colors.bgElev,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: 24,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  modalTitle: {
    fontFamily: fonts.semibold,
    color: colors.text,
    fontSize: 19,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.bgElev2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 16,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  secondaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: radius.full,
    backgroundColor: colors.bgElev2,
  },
  secondaryLabel: {
    color: colors.text,
    fontWeight: "600",
  },
  primaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },
  primaryLabel: {
    color: colors.accentInk,
    fontWeight: "700",
  },
});
