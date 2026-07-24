import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Music2, Pause, Play, SkipBack, SkipForward, X } from "lucide-react-native";
import { colors, radius } from "@/theme/colors";
import { usePlayer } from "@/player/audioEngine";
import { TAB_BAR_MARGIN } from "@/navigation/layout";
import EqualizerBars from "@/components/EqualizerBars";

// Turns a number of seconds into "m:ss" for display, e.g. 125 -> "2:05".
function formatTime(s: number) {
  if (!isFinite(s) || s <= 0) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${r}`;
}

interface PlayerBarProps {
  bottom: number;
}

// The floating mini player shown above the tab bar whenever a song is
// loaded. Renders nothing if nothing is playing.
export default function PlayerBar({ bottom }: PlayerBarProps) {
  const {
    current,
    isPlaying,
    isLoading,
    progress,
    duration,
    hasNext,
    hasPrevious,
    error,
    toggle,
    stop,
    next,
    previous,
  } = usePlayer();

  if (!current) return null;

  const pct = duration > 0 ? Math.min(100, (progress / duration) * 100) : 0;

  return (
    <View style={[styles.bar, { bottom }]}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct}%` }]} />
      </View>
      <View style={styles.row}>
        {current.cover ? (
          <Image source={{ uri: current.cover }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, styles.coverPlaceholder]}>
            <Music2 size={16} color={colors.textFaint} />
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {current.title}
          </Text>
          {error ? (
            <Text style={styles.error} numberOfLines={1}>
              {error}
            </Text>
          ) : isLoading ? (
            <Text style={styles.subtitle}>Loading…</Text>
          ) : (
            !!current.artist && (
              <Text style={styles.subtitle} numberOfLines={1}>
                {current.artist}
              </Text>
            )
          )}
        </View>

        <Pressable onPress={previous} disabled={!hasPrevious} hitSlop={8} style={styles.controlBtn}>
          <SkipBack
            size={16}
            color={hasPrevious ? colors.text : colors.textFaint}
            fill={hasPrevious ? colors.text : colors.textFaint}
          />
        </Pressable>

        <Pressable onPress={toggle} disabled={isLoading} hitSlop={8} style={styles.playBtn}>
          {isLoading ? (
            <EqualizerBars size="sm" color={colors.accentInk} />
          ) : isPlaying ? (
            <Pause size={17} color={colors.accentInk} fill={colors.accentInk} />
          ) : (
            <Play size={17} color={colors.accentInk} fill={colors.accentInk} />
          )}
        </Pressable>

        <Pressable onPress={next} disabled={!hasNext} hitSlop={8} style={styles.controlBtn}>
          <SkipForward
            size={16}
            color={hasNext ? colors.text : colors.textFaint}
            fill={hasNext ? colors.text : colors.textFaint}
          />
        </Pressable>

        <Pressable onPress={stop} hitSlop={8} style={styles.controlBtn}>
          <X size={18} color={colors.textMuted} />
        </Pressable>
      </View>
      <View style={styles.timeRow}>
        <Text style={styles.time}>{formatTime(progress)}</Text>
        <Text style={styles.time}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: TAB_BAR_MARGIN,
    right: TAB_BAR_MARGIN,
    backgroundColor: colors.bgElev2,
    borderRadius: radius.xl,
    paddingTop: 8,
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.bgElev3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.accent,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cover: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
  },
  coverPlaceholder: {
    backgroundColor: colors.bgElev3,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 1,
  },
  title: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 13,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 11,
  },
  error: {
    color: colors.danger,
    fontSize: 11,
  },
  controlBtn: {
    padding: 4,
  },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  time: {
    color: colors.textFaint,
    fontSize: 10,
  },
});
