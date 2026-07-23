import { useState } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "@/theme/colors";

interface AuthFieldProps extends TextInputProps {
  icon: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
}

// A rounded text input used on the login/register screens. It shows an icon
// on the left, an optional icon on the right (used for the show/hide
// password toggle), and highlights its border while the user is typing.
export default function AuthField({ icon, rightIcon, onRightIconPress, onFocus, onBlur, ...props }: AuthFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrap, focused && styles.wrapFocused]}>
      <Ionicons name={icon} size={18} color={focused ? colors.accent : colors.textFaint} />
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.textFaint}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {rightIcon && (
        <Ionicons
          name={rightIcon}
          size={18}
          color={colors.textFaint}
          onPress={onRightIconPress}
          suppressHighlighting
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.bgElev,
    borderRadius: radius.full,
    paddingHorizontal: 18,
    height: 56,
  },
  wrapFocused: {
    borderColor: colors.accent,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
});
