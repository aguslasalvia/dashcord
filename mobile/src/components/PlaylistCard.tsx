import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius } from "@/theme/colors";
import { usePlayer } from "@/player/audioEngine";
import { ISong } from "@/types";

interface PlaylistCardProps {
  _id: string;
  title: string;
  created: string;
  cover?: string;
  songs?: ISong[];
  onPress: () => void;
}

// One tile in the playlist grid on the Library screen. Tapping the card
// opens the playlist; tapping the small play button on the cover starts
// playing it immediately without opening it.
export default function PlaylistCard({ title, created, cover, songs, onPress }: PlaylistCardProps) {
  const { playQueue } = usePlayer();

  const handlePlay = () => {
    if (!songs || songs.length === 0) return;
    const queue = songs.map((song) => ({
      youtube_id: song.youtube_id,
      title: song.title,
      artist: song.artist,
      cover: `https://img.youtube.com/vi/${song.youtube_id}/mqdefault.jpg`,
    }));
    playQueue(queue, 0);
  };

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.coverWrap}>
        {cover ? (
          <Image source={{ uri: cover }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, styles.coverPlaceholder]}>
            <Ionicons name="albums" size={28} color={colors.textFaint} />
          </View>
        )}
        <Pressable style={styles.playBtn} onPress={handlePlay} hitSlop={8}>
          <Ionicons name="play" size={16} color={colors.accentInk} />
        </Pressable>
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.creator} numberOfLines={1}>
        by {created}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 152,
  },
  pressed: {
    opacity: 0.8,
  },
  coverWrap: {
    width: 152,
    height: 152,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.bgElev2,
  },
  cover: {
    width: "100%",
    height: "100%",
  },
  coverPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  playBtn: {
    position: "absolute",
    right: 8,
    bottom: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontFamily: fonts.semibold,
    color: colors.text,
    fontSize: 14,
    marginTop: 10,
  },
  creator: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
});
