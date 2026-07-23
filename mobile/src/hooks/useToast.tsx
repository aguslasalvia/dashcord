import { createContext, useContext, useState, ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "@/theme/colors";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function getToastIcon(type: ToastType): keyof typeof Ionicons.glyphMap {
  if (type === "success") return "checkmark-circle";
  if (type === "error") return "close-circle";
  if (type === "warning") return "warning";
  return "information-circle";
}

function getToastColor(type: ToastType): string {
  if (type === "success") return colors.success;
  if (type === "error") return colors.danger;
  if (type === "warning") return "#f59e0b";
  return colors.accent;
}

// Wrap the app in <ToastProvider> once (done in App.tsx). Any screen can
// then call useToast().showToast(message) to pop up a little banner near
// the top of the screen that disappears on its own after a few seconds.
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showToast = (message: string, type: ToastType = "info", duration = 4000) => {
    // Random id just needs to be unique enough to tell toasts apart on screen.
    const id = Math.random().toString(36).slice(2, 11);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), duration);
    return id;
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <SafeAreaView style={styles.container} pointerEvents="box-none">
        {toasts.map((toast) => (
          <TouchableOpacity
            key={toast.id}
            style={[styles.toast, { borderColor: getToastColor(toast.type) }]}
            onPress={() => removeToast(toast.id)}
            activeOpacity={0.85}
          >
            <Ionicons name={getToastIcon(toast.type)} size={18} color={getToastColor(toast.type)} />
            <Text style={styles.message}>{toast.message}</Text>
          </TouchableOpacity>
        ))}
      </SafeAreaView>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.bgElev2,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    maxWidth: "92%",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  message: {
    color: colors.text,
    fontSize: 14,
    flexShrink: 1,
  },
});
