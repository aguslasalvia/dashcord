import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radius } from "@/theme/colors";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// A "are you sure?" bottom sheet, used before destructive actions like
// deleting a song or a playlist. Nothing happens until the user taps one
// of the two buttons — tapping outside the sheet also cancels.
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.grabber} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                { backgroundColor: danger ? colors.danger : colors.accent },
                pressed && styles.pressed,
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.primaryLabel}>{confirmLabel}</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
              onPress={onCancel}
            >
              <Text style={styles.secondaryLabel}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.bgElev,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: 24,
    paddingBottom: 36,
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    alignSelf: "center",
    marginBottom: 18,
  },
  title: {
    fontFamily: fonts.semibold,
    color: colors.text,
    fontSize: 19,
    marginBottom: 8,
  },
  message: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  actions: {
    gap: 10,
  },
  pressed: {
    opacity: 0.8,
  },
  primaryBtn: {
    paddingVertical: 15,
    borderRadius: radius.full,
    alignItems: "center",
  },
  primaryLabel: {
    color: colors.accentInk,
    fontWeight: "700",
    fontSize: 15,
  },
  secondaryBtn: {
    paddingVertical: 15,
    borderRadius: radius.full,
    alignItems: "center",
    backgroundColor: colors.bgElev2,
  },
  secondaryLabel: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 15,
  },
});
