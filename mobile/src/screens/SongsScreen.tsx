import { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius } from "@/theme/colors";
import SongCard from "@/components/SongCard";
import EqualizerBars from "@/components/EqualizerBars";
import ScreenGlow from "@/components/ScreenGlow";
import { searchSong } from "@/lib/songs";
import { addSongToPlaylist, getAllPlaylist } from "@/lib/playlist";
import { IPlaylist } from "@/types";
import { useToast } from "@/hooks/useToast";
import { usePlayer } from "@/player/audioEngine";
import { TAB_BAR_HEIGHT, TAB_BAR_MARGIN, PLAYER_BAR_HEIGHT, FLOATING_GAP } from "@/navigation/layout";

interface SearchResult {
  id: string;
  title: string;
  channel?: { name?: string };
}

// The "Discover" tab: search for songs, play them, and add them to a
// playlist via the modal at the bottom of this file.
export default function SongsScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { current } = usePlayer();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState<{ title: string; artist: string; youtube_id: string } | null>(
    null,
  );
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);

  const handleSearch = async () => {
    const q = search.trim();
    if (!q) return;
    setQuery(q);
    setLoading(true);
    try {
      const data = await searchSong(q);
      setSongs(data);
    } catch {
      showToast("Error searching songs", "error");
    } finally {
      setHasSearched(true);
      setLoading(false);
    }
  };

  // Turn the raw search results into the shape the player expects, so
  // tapping any result plays through the whole list as a queue.
  const queue = songs.map((song) => ({
    youtube_id: song.id,
    title: song.title,
    artist: song.channel?.name,
    cover: `https://img.youtube.com/vi/${song.id}/mqdefault.jpg`,
  }));

  const handleOpenModal = (song: { title: string; artist: string; youtube_id: string }) => {
    setSelectedSong(song);
    setShowModal(true);
    // Fetch the user's playlists right before showing the modal, so the
    // list is fresh instead of relying on data loaded a while ago.
    getAllPlaylist().then(setPlaylists);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSong(null);
  };

  const handleAddSongToPlaylist = async (playlistId: string) => {
    if (!selectedSong) return;
    try {
      await addSongToPlaylist(selectedSong, playlistId);
      showToast("Added to playlist", "success");
    } catch {
      showToast("Couldn't add the song.", "error");
    }
    handleCloseModal();
  };

  // Same bottom-space calculation as PlaylistsScreen.tsx — see the comment
  // there for why.
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
        <Text style={styles.eyebrow}>Discover</Text>
        <Text style={styles.title}>
          Find your <Text style={styles.titleEm}>sound</Text>
        </Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={17} color={colors.textFaint} />
          <TextInput
            style={styles.searchInput}
            placeholder="Song or artist…"
            placeholderTextColor={colors.textFaint}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        <Pressable
          style={({ pressed }) => [styles.searchBtn, pressed && styles.pressed]}
          onPress={handleSearch}
        >
          <Ionicons name="arrow-forward" size={20} color={colors.accentInk} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <EqualizerBars />
        </View>
      ) : songs.length > 0 ? (
        <FlatList
          data={songs}
          keyExtractor={(item, idx) => item.id + idx}
          contentContainerStyle={{ paddingBottom: bottomReserve }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <SongCard
              title={item.title}
              youtube_id={item.id}
              artist={item.channel?.name ?? ""}
              queue={queue}
              index={index}
              onAddToPlaylist={handleOpenModal}
            />
          )}
        />
      ) : hasSearched ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="musical-notes-outline" size={26} color={colors.textFaint} />
          </View>
          <Text style={styles.emptyText}>Nothing turned up for "{query}". Try another search.</Text>
        </View>
      ) : (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="search" size={26} color={colors.textFaint} />
          </View>
          <Text style={styles.emptyText}>Search any song or artist to start queuing tracks.</Text>
        </View>
      )}

      <Modal visible={showModal} transparent animationType="fade" onRequestClose={handleCloseModal}>
        <Pressable style={styles.overlay} onPress={handleCloseModal}>
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add to playlist</Text>
              <Pressable onPress={handleCloseModal} hitSlop={8}>
                <Ionicons name="close" size={20} color={colors.textMuted} />
              </Pressable>
            </View>
            {playlists.length === 0 ? (
              <Text style={styles.emptyText}>You have no playlists yet.</Text>
            ) : (
              <FlatList
                data={playlists}
                keyExtractor={(item, idx) => item._id ?? String(idx)}
                style={{ maxHeight: 320 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Pressable
                    style={({ pressed }) => [styles.playlistOption, pressed && styles.pressed]}
                    onPress={() => item._id && handleAddSongToPlaylist(item._id)}
                  >
                    <View style={styles.playlistOptionIcon}>
                      <Ionicons name="albums-outline" size={18} color={colors.accent} />
                    </View>
                    <Text style={styles.playlistOptionLabel}>{item.name}</Text>
                    <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
                  </Pressable>
                )}
              />
            )}
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
  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  searchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.bgElev,
    borderRadius: radius.full,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    paddingVertical: 13,
    fontSize: 15,
  },
  searchBtn: {
    width: 48,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.75,
  },
  loading: {
    marginTop: 60,
    alignItems: "center",
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
  playlistOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  playlistOptionIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  playlistOptionLabel: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
});
