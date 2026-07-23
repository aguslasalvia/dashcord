import { useCallback, useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { colors, fonts, radius } from "@/theme/colors";
import { getPlaylistByID, deleteSongsFromPlaylistByID } from "@/lib/playlist";
import { IPlaylist, ISong } from "@/types";
import { usePlayer } from "@/player/audioEngine";
import { useToast } from "@/hooks/useToast";
import { openExternal } from "@/lib/shell";
import ConfirmDialog from "@/components/ConfirmDialog";
import PlayerBar from "@/components/PlayerBar";
import EqualizerBars from "@/components/EqualizerBars";
import ScreenGlow from "@/components/ScreenGlow";
import { TAB_BAR_MARGIN, PLAYER_BAR_HEIGHT, FLOATING_GAP } from "@/navigation/layout";
import type { MainStackParamList } from "@/navigation/types";

type PlaylistRouteProp = RouteProp<MainStackParamList, "Playlist">;

export default function PlaylistScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<PlaylistRouteProp>();
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { playQueue, current, isPlaying } = usePlayer();

  const [playlist, setPlaylist] = useState<IPlaylist | null>(null);
  const [songToDelete, setSongToDelete] = useState<string | null>(null);
  const [confirmDeletePlaylist, setConfirmDeletePlaylist] = useState(false);

  const fetchPlaylist = useCallback(async () => {
    const data = await getPlaylistByID(id);
    setPlaylist(data);
  }, [id]);

  useEffect(() => {
    fetchPlaylist();
  }, [fetchPlaylist]);

  const playSong = (index: number) => {
    if (!playlist) return;
    const queue = playlist.songs.map((song) => ({
      youtube_id: song.youtube_id,
      title: song.title,
      artist: song.artist,
      cover: `https://img.youtube.com/vi/${song.youtube_id}/mqdefault.jpg`,
    }));
    playQueue(queue, index);
  };

  const handleDeleteSong = async () => {
    if (!songToDelete) return;
    const ok = await deleteSongsFromPlaylistByID(id, songToDelete);
    if (ok) {
      showToast("Song removed from playlist", "success");
      fetchPlaylist();
    } else {
      showToast("Error removing song", "error");
    }
    setSongToDelete(null);
  };

  const handleDeletePlaylist = async () => {
    const ok = await deleteSongsFromPlaylistByID(id, "");
    if (ok) {
      showToast("Playlist deleted", "success");
      navigation.goBack();
    } else {
      showToast("Error deleting playlist", "error");
    }
    setConfirmDeletePlaylist(false);
  };

  const handleCopy = async (song: ISong) => {
    await Clipboard.setStringAsync(`https://www.youtube.com/watch?v=${song.youtube_id}`);
    showToast("Link copied", "success", 1500);
  };

  if (!playlist) {
    return (
      <View style={styles.loadingScreen}>
        <ScreenGlow height={320} />
        <EqualizerBars />
      </View>
    );
  }

  const cover = playlist.songs[0]?.youtube_id
    ? `https://img.youtube.com/vi/${playlist.songs[0].youtube_id}/mqdefault.jpg`
    : undefined;

  const bottomReserve =
    insets.bottom + TAB_BAR_MARGIN + (current ? PLAYER_BAR_HEIGHT + FLOATING_GAP : 0) + 16;

  return (
    <View style={styles.screen}>
      <ScreenGlow height={320} />
      <View style={styles.header}>
        {cover ? (
          <Image source={{ uri: cover }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, styles.coverPlaceholder]}>
            <Ionicons name="albums" size={32} color={colors.textFaint} />
          </View>
        )}
        <Text style={styles.label}>Playlist</Text>
        <Text style={styles.title}>{playlist.name}</Text>
        <Text style={styles.meta}>
          {playlist.created_by} · {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}
        </Text>
        <View style={styles.actionsRow}>
          <Pressable
            style={({ pressed }) => [styles.playBtn, pressed && styles.pressed]}
            onPress={() => playSong(0)}
            disabled={playlist.songs.length === 0}
          >
            <Ionicons name="play" size={18} color={colors.accentInk} />
            <Text style={styles.playLabel}>Play</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
            onPress={() => setConfirmDeletePlaylist(true)}
          >
            <Ionicons name="trash" size={18} color={colors.danger} />
          </Pressable>
        </View>
      </View>

      {playlist.songs.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>This playlist is empty.</Text>
        </View>
      ) : (
        <FlatList
          data={playlist.songs}
          keyExtractor={(item, idx) => item.youtube_id + idx}
          contentContainerStyle={[styles.list, { paddingBottom: bottomReserve }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const isCurrent = current?.youtube_id === item.youtube_id;
            return (
              <Pressable
                style={[styles.songRow, isCurrent && styles.songRowActive]}
                onPress={() => playSong(index)}
              >
                <View style={styles.songIndex}>
                  {isCurrent && isPlaying ? (
                    <EqualizerBars size="sm" />
                  ) : (
                    <Text style={styles.songIndexText}>{index + 1}</Text>
                  )}
                </View>
                <View style={styles.songMeta}>
                  <Text style={styles.songTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.songArtist} numberOfLines={1}>
                    {item.artist}
                  </Text>
                </View>
                <Pressable
                  style={styles.songAction}
                  onPress={() => openExternal(`https://www.youtube.com/watch?v=${item.youtube_id}`)}
                  hitSlop={6}
                >
                  <Ionicons name="logo-youtube" size={18} color={colors.textMuted} />
                </Pressable>
                <Pressable style={styles.songAction} onPress={() => handleCopy(item)} hitSlop={6}>
                  <Ionicons name="link" size={18} color={colors.textMuted} />
                </Pressable>
                <Pressable
                  style={styles.songAction}
                  onPress={() => setSongToDelete(item.youtube_id)}
                  hitSlop={6}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </Pressable>
              </Pressable>
            );
          }}
        />
      )}

      <ConfirmDialog
        open={songToDelete !== null}
        title="Remove song"
        message="Remove this song from the playlist? This can't be undone."
        confirmLabel="Remove"
        onConfirm={handleDeleteSong}
        onCancel={() => setSongToDelete(null)}
      />
      <ConfirmDialog
        open={confirmDeletePlaylist}
        title="Delete playlist"
        message={`Delete "${playlist.name}" permanently? This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeletePlaylist}
        onCancel={() => setConfirmDeletePlaylist(false)}
      />

      {!!current && <PlayerBar bottom={insets.bottom + TAB_BAR_MARGIN} />}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    padding: 20,
  },
  cover: {
    width: 140,
    height: 140,
    borderRadius: radius.lg,
    marginBottom: 14,
  },
  coverPlaceholder: {
    backgroundColor: colors.bgElev2,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  title: {
    fontFamily: fonts.bold,
    color: colors.text,
    fontSize: 25,
    textAlign: "center",
    marginTop: 6,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 6,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  pressed: {
    opacity: 0.75,
  },
  playBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: radius.full,
  },
  playLabel: {
    color: colors.accentInk,
    fontWeight: "700",
  },
  deleteBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.bgElev,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    padding: 12,
    gap: 4,
  },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 8,
    borderRadius: radius.md,
  },
  songRowActive: {
    backgroundColor: colors.accentSoft,
  },
  songIndex: {
    width: 24,
    alignItems: "center",
  },
  songIndexText: {
    color: colors.textFaint,
    fontSize: 13,
  },
  songMeta: {
    flex: 1,
    gap: 2,
  },
  songTitle: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 14,
  },
  songArtist: {
    color: colors.textMuted,
    fontSize: 12,
  },
  songAction: {
    padding: 4,
  },
  empty: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: colors.textMuted,
  },
});
