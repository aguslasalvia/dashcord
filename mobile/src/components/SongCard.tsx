import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ExternalLink, Link2, Pause, Play, Plus } from "lucide-react-native";
import { colors, fonts, radius } from "@/theme/colors";
import { usePlayer } from "@/player/audioEngine";
import { PlayerTrack } from "@/store/playerSlice";
import { openExternal } from "@/lib/shell";
import * as Clipboard from "expo-clipboard";
import { useToast } from "@/hooks/useToast";

interface SongCardProps {
  title: string;
  artist: string;
  youtube_id: string;
  queue: PlayerTrack[];
  index: number;
  onAddToPlaylist: (song: { title: string; artist: string; youtube_id: string }) => void;
}

// One row in the search results list on the Discover screen. Tapping it
// plays the song (or toggles play/pause if it's already the current
// song); the three buttons on the right copy the link, open it on
// YouTube, or add it to a playlist.
export default function SongCard(props: SongCardProps) {
  const { current, isPlaying, playQueue, toggle } = usePlayer();
  const { showToast } = useToast();
  const isCurrent = current?.youtube_id === props.youtube_id;
  const youtubeLink = `https://www.youtube.com/watch?v=${props.youtube_id}`;

  const handlePlay = () => {
    if (isCurrent) {
      toggle();
    } else {
      playQueue(props.queue, props.index);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(youtubeLink);
    showToast("Link copied", "success", 1500);
  };

  const handleAddPlaylist = () => {
    props.onAddToPlaylist({ title: props.title, artist: props.artist, youtube_id: props.youtube_id });
  };

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={handlePlay}>
      <View>
        <Image
          source={{ uri: `https://img.youtube.com/vi/${props.youtube_id}/mqdefault.jpg` }}
          style={styles.cover}
        />
        <View style={styles.playOverlay}>
          {isCurrent && isPlaying ? (
            <Pause size={16} color={colors.accentInk} fill={colors.accentInk} />
          ) : (
            <Play size={16} color={colors.accentInk} fill={colors.accentInk} />
          )}
        </View>
      </View>

      <View style={styles.meta}>
        <Text style={[styles.title, isCurrent && styles.titleActive]} numberOfLines={1}>
          {props.title}
        </Text>
        {!!props.artist && (
          <Text style={styles.artist} numberOfLines={1}>
            {props.artist}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={handleCopy} hitSlop={6}>
          <Link2 size={17} color={colors.textMuted} />
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={() => openExternal(youtubeLink)} hitSlop={6}>
          <ExternalLink size={17} color={colors.textMuted} />
        </Pressable>
        <Pressable style={styles.addBtn} onPress={handleAddPlaylist} hitSlop={6}>
          <Plus size={18} color={colors.accentInk} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  pressed: {
    opacity: 0.8,
  },
  cover: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
    backgroundColor: colors.bgElev2,
  },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: radius.sm,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: fonts.semibold,
    color: colors.text,
    fontSize: 14,
  },
  titleActive: {
    color: colors.accent,
  },
  artist: {
    color: colors.textMuted,
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  actionBtn: {
    padding: 6,
  },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
  },
});
